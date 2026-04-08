const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const userResult = await pool.query(
            `SELECT users.*, staff.role FROM users JOIN staff ON users.staff_id = staff.id WHERE users.username = $1`,
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const user = userResult.rows[0];

        const isMatch = await bcryptjs.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, staff_id: user.staff_id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Login Server Error");
    }
});

module.exports = router;
