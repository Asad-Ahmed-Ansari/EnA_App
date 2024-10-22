const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sites_data',
    password: '123',
    port: '5432',
});

module.exports = pool;
module.exports = {
    query: (text, params) => pool.query(text, params),
};