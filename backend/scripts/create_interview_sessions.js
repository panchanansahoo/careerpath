import { supabaseAdmin } from '../db/supabaseClient.js';

const sql = `
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT DEFAULT 'single',
    company TEXT,
    role TEXT,
    stage TEXT,
    difficulty TEXT,
    conversation JSONB DEFAULT '[]',
    scores JSONB DEFAULT '[]',
    overall_score INTEGER DEFAULT 0,
    summary_data JSONB DEFAULT '{}',
    speech_metrics JSONB,
    emotion_data JSONB,
    proctoring_violations JSONB DEFAULT '[]',
    rounds JSONB,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_interview_sessions_user ON interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_completed ON interview_sessions(completed_at DESC);
`;

async function run() {
    console.log('Creating interview_sessions table...');
    const { error } = await supabaseAdmin.rpc('exec_sql', { query: sql }).catch(() => ({ error: 'rpc not available' }));
    
    // If rpc doesn't work, try raw SQL via REST
    if (error) {
        console.log('RPC not available, trying direct SQL...');
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({ query: sql })
        });
        
        if (!response.ok) {
            console.log('\n⚠️  Automatic table creation not supported via API.');
            console.log('Please run the following SQL in your Supabase SQL Editor:');
            console.log('Dashboard → SQL Editor → New Query → Paste & Run:\n');
            console.log(sql);
            process.exit(0);
        }
    }
    
    console.log('✅ interview_sessions table created successfully!');
    process.exit(0);
}

run();
