import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? {
        rejectUnauthorized: true,
        ...(process.env.PG_SSL_CA ? { ca: process.env.PG_SSL_CA } : {})
      }
    : false
});

export const query = (text: string, params?: unknown[]) => pool.query(text, params);
export const getPool = () => pool;
