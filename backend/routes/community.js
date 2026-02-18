import express from 'express';
import { supabaseAdmin } from '../db/supabaseClient.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const { filter = 'trending' } = req.query;
    
    let query = supabaseAdmin
      .from('community_posts')
      .select('*, profiles(full_name), community_replies(count)')
      .limit(50);

    if (filter === 'popular') {
      query = query.order('likes', { ascending: false });
    } else if (filter === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else {
      // trending: order by created_at desc as default
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;

    const posts = (data || []).map(p => ({
      ...p,
      author_name: p.profiles?.full_name || 'Anonymous',
      reply_count: p.community_replies?.[0]?.count || 0,
      profiles: undefined,
      community_replies: undefined
    }));

    res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/posts', authenticateToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    const { data, error } = await supabaseAdmin
      .from('community_posts')
      .insert({
        user_id: req.user.id,
        title,
        content,
        tags,
        likes: 0,
        replies: 0
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ post: data });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.post('/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get current likes then increment
    const { data: post } = await supabaseAdmin
      .from('community_posts')
      .select('likes')
      .eq('id', id)
      .single();

    await supabaseAdmin
      .from('community_posts')
      .update({ likes: (post?.likes || 0) + 1 })
      .eq('id', id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

router.post('/posts/:id/reply', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    const { error: replyError } = await supabaseAdmin
      .from('community_replies')
      .insert({
        post_id: id,
        user_id: req.user.id,
        content
      });

    if (replyError) throw replyError;

    // Increment reply count
    const { data: post } = await supabaseAdmin
      .from('community_posts')
      .select('replies')
      .eq('id', id)
      .single();

    await supabaseAdmin
      .from('community_posts')
      .update({ replies: (post?.replies || 0) + 1 })
      .eq('id', id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error submitting reply:', error);
    res.status(500).json({ error: 'Failed to submit reply' });
  }
});

router.get('/posts/:id/replies', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabaseAdmin
      .from('community_replies')
      .select('*, profiles(full_name)')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    const replies = (data || []).map(r => ({
      ...r,
      author_name: r.profiles?.full_name || 'Anonymous',
      profiles: undefined
    }));

    res.json({ replies });
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
});

export default router;
