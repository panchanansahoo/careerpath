import express from 'express';
import { supabaseAdmin } from '../db/index.js';

const router = express.Router();

// Get all published blogs
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .select(`
        *,
        author:author_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabaseAdmin
      .from('blogs')
      .select(`
        *,
        author:author_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    
    // Increment views
    await supabaseAdmin.rpc('increment_blog_view', { blog_id: data.id });

    res.json(data);
  } catch (error) {
    res.status(404).json({ error: 'Blog not found' });
  }
});

// Middleware to verify auth token
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) throw new Error('Unauthorized');

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Create new blog
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, content, category, cover_image, start_date } = req.body; // start_date mapped to created_at if needed, or just let DB default
    
    // Generate simple slug (can be improved)
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const { data, error } = await supabaseAdmin
      .from('blogs')
      .insert({
        title,
        slug,
        content, // JSON or HTML
        author_id: req.user.id,
        category,
        cover_image
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
