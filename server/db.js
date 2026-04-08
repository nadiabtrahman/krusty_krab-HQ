const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'krusty_krab',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

module.exports = pool;