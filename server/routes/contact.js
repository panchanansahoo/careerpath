import express from 'express';
const router = express.Router();

// POST /api/contact - Store contact form submissions
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Log the contact submission (in production, save to DB or send email)
    console.log('Contact form submission:', { name, email, subject, message, timestamp: new Date().toISOString() });

    // If using Supabase, uncomment below to store in a contacts table:
    // const { createClient } = require('@supabase/supabase-js');
    // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    // await supabase.from('contacts').insert({ name, email, subject, message });

    res.json({ success: true, message: 'Message received. We will get back to you within 24 hours.' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit message' });
  }
});

export default router;
