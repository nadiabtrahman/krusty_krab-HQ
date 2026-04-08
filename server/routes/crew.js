const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth')

router.get('/me', auth, async (req, res) => {
    try {
        const { staff_id } = req.user;
        const result = await pool.query('SELECT * FROM staff WHERE id = $1', [staff_id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Staff not found" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', async (req, res) => {
    try {
        const allCrew = await pool.query('SELECT * FROM staff ORDER BY id ASC');
        res.json(allCrew.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await pool.query('SELECT * FROM staff WHERE id = $1', [id]);

        if (employee.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json(employee.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.patch('/me', auth, async (req, res) => {
    try {
        const staffId = req.user.staff_id || req.user.id;
        const { email, birth_date } = req.body;

        const updatedProfile = await pool.query(
            "UPDATE staff SET email = $1, birth_date = $2 WHERE id = $3 RETURNING *",
            [email, birth_date, staffId]
        );

        if (updatedProfile.rows.length === 0) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        res.json({ message: "Profile updated successfully!", data: updatedProfile.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
