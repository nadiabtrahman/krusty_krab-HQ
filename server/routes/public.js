const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/menu', async (req, res) => {
    try {
        const allItems = await pool.query('SELECT * FROM menu_items ORDER BY id ASC');
        res.json(allItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/menu/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, category } = req.body;

        const result = await pool.query(
            "UPDATE menu_items SET name = $1, price = $2, description = $3, category = $4 WHERE id = $5 RETURNING *",
            [name, price, description, category, id]
        );

        res.json({ message: "Menu item updated!", item: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error updating menu");
    }
});

router.post('/apply', async (req, res) => {
    try {
        const { name, birth_date, email } = req.body;

        if (!name || !birth_date || !email) {
            return res.status(400).json({ message: "Please fill in the form accordingly." });
        }

        const newApp = await pool.query(
            "INSERT INTO applications (name, birth_date, email) VALUES($1, $2, $3) RETURNING *",
            [name, birth_date, email]
        );

        res.json({ message: "Application Received!", data: newApp.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
