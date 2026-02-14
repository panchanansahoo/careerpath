import express from 'express';
import { supabase, supabaseAdmin } from '../db/supabaseClient.js';

const router = express.Router();

// Middleware to get user from session/token
// Assuming auth middleware is already applied or we verify token here
const getUserId = async (req) => {
    // Check for Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user.id;
};

// Update activity time
router.post('/update', async (req, res) => {
    try {
        const userId = await getUserId(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { date, seconds } = req.body;
        if (!date || seconds === undefined) {
             return res.status(400).json({ error: 'Missing date or seconds' });
        }

        // Upsert logic using supabaseAdmin to bypass RLS for now or handle upsert cleanly
        // We use raw SQL for upsert on conflict as Supabase JS upsert is good too
        
        const { data, error } = await supabaseAdmin
            .from('user_activity')
            .upsert({ 
                user_id: userId, 
                date, 
                seconds_active: seconds,
                last_updated: new Date().toISOString()
            }, { 
                onConflict: 'user_id, date' 
            })
            .select();

        if (error) throw error;

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ error: error.message || 'Internal server error', details: error });
    }
});

// Get weekly activity
router.get('/weekly', async (req, res) => {
    try {
        const userId = await getUserId(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        
        const dateStr = sevenDaysAgo.toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('user_activity')
            .select('date, seconds_active')
            .eq('user_id', userId)
            .gte('date', dateStr)
            .order('date', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (error) {
         console.error('Error fetching activity:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
