const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/my', auth, async (req, res) => {
    try {
        const { staff_id } = req.user;
        const result = await pool.query(
            'SELECT * FROM attendance WHERE staff_id = $1 ORDER BY clock_in_time DESC LIMIT 30',
            [staff_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.post('/clock-in', auth, async (req, res) => {
    try {
        const { staff_id } = req.user;
        const existing = await pool.query(
            "SELECT * FROM attendance WHERE staff_id = $1 AND status = 'active'",
            [staff_id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ message: "Already clocked in!" });
        }

        await pool.query(
            "INSERT INTO attendance (staff_id) VALUES ($1)",
            [staff_id]
        );
        res.json({ message: "Clock-in successful! Happy Working!" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

router.post('/clock-out', auth, async (req, res) => {
    try {
        const { staff_id } = req.user;
        const result = await pool.query(
            "UPDATE attendance SET status ='clocked_out' WHERE staff_id = $1 AND status = 'active' RETURNING*",
            [staff_id]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "No active session found." });
        }

        res.json({ message: "Clock-out successful! See you tomorrow!" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;
