import { Pool } from 'pg';

import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

console.log("Database Connected Successfully");
export default pool;
