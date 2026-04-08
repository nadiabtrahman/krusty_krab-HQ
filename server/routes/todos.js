const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const { staff_id } = req.user;
        const result = await pool.query(
            'SELECT * FROM todos WHERE staff_id = $1 ORDER BY created_at DESC',
            [staff_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { staff_id } = req.user;
        const { task } = req.body;
        if (!task) return res.status(400).json({ message: "Task is required" });
        const result = await pool.query(
            'INSERT INTO todos (staff_id, task) VALUES ($1, $2) RETURNING *',
            [staff_id, task]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.patch('/:id/toggle', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { staff_id } = req.user;
        const result = await pool.query(
            'UPDATE todos SET completed = NOT completed WHERE id = $1 AND staff_id = $2 RETURNING *',
            [id, staff_id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: "Todo not found" });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { staff_id } = req.user;
        await pool.query('DELETE FROM todos WHERE id = $1 AND staff_id = $2', [id, staff_id]);
        res.json({ message: "Todo deleted" });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
