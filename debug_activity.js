import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testDB = async () => {
    console.log('Testing DB connection...');
    const today = new Date().toISOString().split('T')[0];
    
    // Test insertion with a dummy user ID (we assume one exists or we use a random UUID if FK allows)
    // But FK on user_activity references profiles(id).
    // I need a valid user ID. 
    // I'll first try to fetch a user/profile.
    
    // Fetch a profile to use
    const { data: profiles, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .limit(1);

    if (profileError) {
        console.error('Error fetching profiles:', profileError);
        return;
    }

    if (!profiles || profiles.length === 0) {
        console.log('No profiles found. Cannot test activity insertion with FK constraints.');
        return;
    }

    const userId = profiles[0].id; // Use first profile
    console.log('Using User ID:', userId);

    const { data, error } = await supabaseAdmin
        .from('user_activity')
        .upsert({ 
            user_id: userId, 
            date: today, 
            seconds_active: 100,
            last_updated: new Date().toISOString()
        }, { 
            onConflict: 'user_id, date' 
        })
        .select();

    if (error) {
        console.error('Upsert Error:', error);
    } else {
        console.log('Upsert Success:', data);
    }
};

testDB();
