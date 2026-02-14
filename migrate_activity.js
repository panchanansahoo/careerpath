import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const runMigration = async () => {
  // Direct connection string (bypass pooler for migration)
  const connectionString = `postgres://postgres:${process.env.SUPABASE_DB_PASSWORD}@db.vxbwanobjlxnmwspmkwc.supabase.co:5432/postgres`;
  
  const pool = new pg.Pool({
    connectionString,
    // SSL is required for Supabase
    ssl: { rejectUnauthorized: false }
  });

  try {
    const schemaPath = path.join(__dirname, 'server', 'db', 'schema_activity.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Running migration...');
    const client = await pool.connect();
    try {
        await client.query(sql);
        console.log('Migration completed successfully.');
    } finally {
        client.release();
    }
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    process.exit(1);
  } finally {
      await pool.end();
  }
};

runMigration();
