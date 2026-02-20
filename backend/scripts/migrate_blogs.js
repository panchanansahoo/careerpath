
import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars from backend/.env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;

// Construct connection string
// Format: postgres://postgres:[password]@[host]:[port]/[db]
// Host is usually db.[ref].supabase.co
// Ref is in SUPABASE_URL: https://[ref].supabase.co
const supabaseUrl = process.env.SUPABASE_URL;
const supabasePassword = process.env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl || !supabasePassword) {
    console.error('Missing SUPABASE_URL or SUPABASE_DB_PASSWORD in .env');
    process.exit(1);
}

const ref = supabaseUrl.split('//')[1].split('.')[0];
const host = `db.${ref}.supabase.co`;
const connectionString = `postgres://postgres:${supabasePassword}@${host}:5432/postgres`;

console.log(`Connecting to ${host}...`);

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for Supabase
});

async function migrate() {
    try {
        const client = await pool.connect();
        try {
            console.log('Connected to database.');
            
            const schemaPath = path.join(__dirname, '../db/schema_blogs.sql');
            const schemaSql = fs.readFileSync(schemaPath, 'utf8');

            console.log('Applying schema...');
            // Add avatar_url to profiles if missing
            await client.query('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;');
            
            await client.query('DROP TABLE IF EXISTS blogs CASCADE;');
            await client.query(schemaSql);
            
            console.log('✅ Schema applied successfully!');
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await pool.end();
    }
}

migrate();
