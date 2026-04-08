const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcryptjs = require('bcryptjs');
const auth = require('../middleware/auth');

router.get('/applications', auth, async (req, res) => {
    if (req.user.role !== 'Manager') {
        return res.status(403).json({ message: "Access Denied: Managers only" });
    }

    try {
        const result = await pool.query("SELECT * FROM applications ORDER BY id DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error fetching applications");
    }
});

router.patch('/applications/:id/status', auth, async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'Manager') return res.status(403).json({ message: "Managers only" });

    try {
        await pool.query(
            "UPDATE applications SET status = $1 WHERE id = $2",
            ['rejected', id]
        );
        res.json({ message: "Application marked as rejected" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

router.post('/hire', auth, async (req, res) => {
    if (req.user.role !== 'Manager') {
        return res.status(403).json({ message: "Access Denied: Managers only" });
    }

    const { name, email, role, birthday, application_id } = req.body;
    const defaultPassword = 'KrabbyPatty123';

    try {
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(defaultPassword, salt);

        const staffRes = await pool.query(
            "INSERT INTO staff (name, role, email, birth_date) VALUES ($1, $2, $3, $4) RETURNING id",
            [name, role, email, birthday]
        );
        const newStaffId = staffRes.rows[0].id;

        await pool.query(
            "INSERT INTO users (username, password_hash, staff_id) VALUES ($1, $2, $3)",
            [name.toLowerCase().replace(/\s/g, ''), hashedPassword, newStaffId]
        );

        await pool.query("DELETE FROM applications WHERE id = $1", [application_id]);

        res.json({ message: "Success! User created." });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.get('/staff-status', auth, async (req, res) => {
    if (req.user.role !== 'Manager') return res.status(403).json("Managers only");

    try {
        const statusReport = await pool.query(`
            SELECT
                staff.id,
                staff.name,
                staff.role,
                staff.hourly_rate,
                staff.image,
                staff.bio,
                staff.birth_date,
                staff.email,
                latest_att.status as attendance_status,
                latest_att.clock_in_time,
                latest_att.clock_out_time,
                CASE
                    WHEN latest_att.status = 'active' THEN 'Clocked In'
                    ELSE 'Not Working'
                END as current_status
            FROM staff
            LEFT JOIN LATERAL (
                SELECT * FROM attendance 
                WHERE attendance.staff_id = staff.id 
                ORDER BY clock_in_time DESC
                LIMIT 1
            ) AS latest_att ON true
            ORDER BY staff.name ASC
        `);
        res.json(statusReport.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

router.put('/staff/:id', auth, async (req, res) => {
    if (req.user.role !== 'Manager') return res.status(403).json({ message: "Managers only" });

    const { id } = req.params;
    const { name, role, hourly_rate, image, bio, birth_date, email } = req.body;

    try {
        const result = await pool.query(
            `UPDATE staff SET name=$1, role=$2, hourly_rate=$3, image=$4, bio=$5, birth_date=$6, email=$7 WHERE id=$8 RETURNING *`,
            [name, role, hourly_rate, image, bio, birth_date, email, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: "Staff not found" });
        res.json({ message: "Staff updated!", data: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
