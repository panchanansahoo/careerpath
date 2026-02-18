import express from 'express';
import { supabaseAdmin } from '../db/supabaseClient.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.join(__dirname, '../../debug_auth.log');

function logDebug(message) {
  try {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `${timestamp} - ${message}\n`);
  } catch (e) {
    console.error('Logging failed', e);
  }
}

const router = express.Router();

router.post('/signup', async (req, res) => {
  logDebug('Signup request received');
  const { email, password, fullName } = req.body;
  logDebug(`Payload: ${email}, ${fullName}`);

  if (!email || !password || !fullName) {
    return res.status(400).json({ error: 'Email, password, and full name are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    logDebug('Attempting to create user in Supabase Admin');
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });
    logDebug('Supabase Admin createUser returned');

    if (error) {
      logDebug(`Signup error: ${error.message}`);
      if (error.message.includes('already registered')) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      console.error('Signup error:', error);
      return res.status(400).json({ error: error.message });
    }
    logDebug(`User created with ID: ${data.user.id}`);

    // Sign in the user to get a session token
    logDebug('Attempting auto sign-in');
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (signInError) {
      console.error('Auto sign-in error:', signInError);
      return res.status(201).json({
        message: 'User created successfully. Please log in.',
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: fullName
        }
      });
    }

    res.status(201).json({
      message: 'User created successfully',
      token: signInData.session.access_token,
      refreshToken: signInData.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: fullName,
        subscriptionTier: 'free',
        experienceLevel: 'beginner'
      }
    });

  } catch (error) {
    logDebug(`Signup exception: ${error.message} - ${error.stack}`);
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.post('/login', async (req, res) => {
  logDebug('Login request received');
  const { email, password } = req.body;
  logDebug(`Login payload: ${email}`);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    logDebug('Attempting signInWithPassword');
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });
    logDebug('signInWithPassword returned');

    if (error) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last_login in profiles
    logDebug('Updating last_login in profiles');
    await supabaseAdmin
      .from('profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);
    logDebug('last_login updated');

    // Get profile data
    logDebug('Fetching profile data');
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    logDebug('Profile data fetched');

    res.json({
      message: 'Login successful',
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: profile?.full_name || data.user.user_metadata?.full_name || '',
        subscriptionTier: profile?.subscription_tier || 'free',
        experienceLevel: profile?.experience_level || 'beginner'
      }
    });
  } catch (error) {
    logDebug(`Login exception: ${error.message}`);
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/refresh', async (req, res) => {
  logDebug('Refresh request received');
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    res.json({
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    });

  } catch (error) {
    logDebug(`Refresh exception: ${error.message}`);
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

export default router;
