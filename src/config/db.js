const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'tech_support_ai',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = {
  query: (text, params) => {
    return pool.query(text, params);
  },
  testConnection: async () => {
    try {
      const result = await pool.query('SELECT NOW()');
      console.log('✅ PostgreSQL connected successfully');
      return result;
    } catch (err) {
      console.error('❌ PostgreSQL connection error:', err);
      throw err;
    }
  },
  pool
};
