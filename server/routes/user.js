import express from 'express';
import { supabaseAdmin } from '../db/supabaseClient.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import dsaLearningPath, { getModuleProblems, getModuleProgress } from '../data/dsaLearningPath.js';
import lldLearningPath from '../data/lldLearningPath.js';
import aiLearningPath from '../data/aiLearningPath.js';

const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: profile.id,
        email: req.user.email,
        full_name: profile.full_name,
        subscription_tier: profile.subscription_tier,
        experience_level: profile.experience_level,
        created_at: profile.created_at,
        last_login: profile.last_login
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  const { fullName, experienceLevel } = req.body;

  try {
    const updates = {};
    if (fullName) updates.full_name = fullName;
    if (experienceLevel) updates.experience_level = experienceLevel;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      user: {
        id: data.id,
        email: req.user.email,
        full_name: data.full_name,
        subscription_tier: data.subscription_tier,
        experience_level: data.experience_level
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Get counts from various tables
    const { data: progress } = await supabaseAdmin
      .from('user_progress')
      .select('problem_id, status')
      .eq('user_id', req.user.id);

    const { data: submissions } = await supabaseAdmin
      .from('submissions')
      .select('id')
      .eq('user_id', req.user.id);

    const { data: interviews } = await supabaseAdmin
      .from('mock_interviews')
      .select('id')
      .eq('user_id', req.user.id)
      .not('completed_at', 'is', null);

    const { data: resumes } = await supabaseAdmin
      .from('resume_analyses')
      .select('id')
      .eq('user_id', req.user.id);

    const solvedCount = (progress || []).filter(p => p.status === 'solved').length;

    const stats = {
      problems_solved: solvedCount,
      total_submissions: (submissions || []).length,
      mock_interviews_completed: (interviews || []).length,
      resumes_analyzed: (resumes || []).length
    };

    // Recent activity
    const { data: recentSubs } = await supabaseAdmin
      .from('submissions')
      .select('submitted_at, problems(title)')
      .eq('user_id', req.user.id)
      .order('submitted_at', { ascending: false })
      .limit(10);

    const recentActivity = (recentSubs || []).map(s => ({
      type: 'submission',
      timestamp: s.submitted_at,
      detail: s.problems?.title
    }));

    // Streak (last 7 days of submissions)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: streakSubs } = await supabaseAdmin
      .from('submissions')
      .select('submitted_at')
      .eq('user_id', req.user.id)
      .gte('submitted_at', sevenDaysAgo.toISOString());

    const uniqueDays = new Set(
      (streakSubs || []).map(s => new Date(s.submitted_at).toDateString())
    );

    res.json({
      stats,
      recentActivity,
      streak: uniqueDays.size
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

router.get('/learning-paths', authenticateToken, async (req, res) => {
  try {
    const paths = [
      {
        id: 'dsa-basics',
        title: 'DSA Basics',
        description: 'Master fundamental data structures and algorithms from scratch',
        duration: '6-8 weeks',
        difficulty: 'Beginner',
        modules: []
      },
      {
        id: 'dsa',
        title: 'Advanced DSA',
        description: 'Master advanced algorithms and complex data structures for FAANG interviews',
        duration: '10-12 weeks',
        difficulty: 'Advanced',
        modules: []
      },
      {
        id: 'data-science',
        title: 'Data Science Interview Prep',
        description: 'Master statistics, ML algorithms, and Python for data science roles',
        duration: '8-10 weeks',
        difficulty: 'Intermediate',
        modules: []
      },
      {
        id: 'ai',
        title: 'AI & Machine Learning',
        description: 'Deep learning, neural networks, and modern AI techniques',
        duration: '10-12 weeks',
        difficulty: 'Advanced',
        modules: []
      },
      {
        id: 'lld',
        title: 'Low Level Design',
        description: 'Master OOP, design patterns, and build clean code architectures',
        duration: '6-8 weeks',
        difficulty: 'Intermediate',
        modules: []
      },
      {
        id: 'hld',
        title: 'High Level Design',
        description: 'System design for scalable, distributed systems and architectures',
        duration: '8-10 weeks',
        difficulty: 'Advanced',
        modules: []
      },
      {
        id: 'beginner',
        title: 'Interview Prep Bootcamp',
        description: 'Complete beginner-friendly interview preparation path',
        duration: '4-6 weeks',
        difficulty: 'Beginner',
        modules: []
      }
    ];
    
    res.json({ paths });
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
});

router.get('/learning-paths/:pathId', authenticateToken, async (req, res) => {
  try {
    const { pathId } = req.params;
    
    const pathsData = {
      'dsa-basics': {
        id: 'dsa-basics',
        title: 'DSA Basics',
        description: 'Master fundamental data structures and algorithms from scratch',
        duration: '6-8 weeks',
        difficulty: 'Beginner',
        prerequisite: 'Basic programming knowledge',
        outcomes: [
          'Understand core data structures (arrays, linked lists, stacks, queues)',
          'Master basic algorithms and their time complexity',
          'Solve 100+ beginner-friendly problems',
          'Build strong foundation for advanced topics'
        ],
        modules: []
      },
      'dsa': {
        id: 'dsa',
        title: 'Advanced DSA',
        description: 'Master advanced algorithms and complex data structures for FAANG interviews',
        duration: '10-12 weeks',
        difficulty: 'Advanced',
        prerequisite: 'Strong foundation in basic DSA',
        outcomes: [
          'Master advanced data structures (Trees, Graphs, Heaps)',
          'Solve medium to hard LeetCode problems',
          'Understand dynamic programming and greedy algorithms',
          'Ready for top-tier company interviews'
        ],
        modules: []
      },
      'data-science': {
        id: 'data-science',
        title: 'Data Science Interview Prep',
        description: 'Master statistics, ML algorithms, and Python for data science roles',
        duration: '8-10 weeks',
        difficulty: 'Intermediate',
        prerequisite: 'Python programming, basic statistics',
        outcomes: [
          'Master statistics and probability for DS interviews',
          'Understand ML algorithms and their applications',
          'Practice SQL and data manipulation',
          'Build portfolio projects for interviews'
        ],
        modules: []
      },
      'ai': aiLearningPath,
      'lld': {
        id: 'lld',
        title: 'Low Level Design',
        description: 'Master OOP, design patterns, and build clean code architectures',
        duration: '6-8 weeks',
        difficulty: 'Intermediate',
        prerequisite: 'OOP concepts, programming experience',
        outcomes: [
          'Master SOLID principles and design patterns',
          'Design scalable and maintainable systems',
          'Practice real-world LLD interview questions',
          'Build clean, modular code architectures'
        ],
        modules: []
      },
      'hld': {
        id: 'hld',
        title: 'High Level Design',
        description: 'System design for scalable, distributed systems and architectures',
        duration: '8-10 weeks',
        difficulty: 'Advanced',
        prerequisite: 'Basic system design concepts, databases',
        outcomes: [
          'Design scalable distributed systems',
          'Master system design patterns and trade-offs',
          'Practice FAANG-level system design interviews',
          'Understand real-world architecture decisions'
        ],
        modules: []
      }
    };
    
    const pathData = pathsData[pathId];
    
    if (!pathData) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    
    res.json(pathData);
  } catch (error) {
    console.error('Error fetching learning path:', error);
    res.status(500).json({ error: 'Failed to fetch learning path' });
  }
});

router.get('/progress', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_progress')
      .select('problem_id, status')
      .eq('user_id', req.user.id);

    if (error) throw error;

    const progress = {};
    (data || []).forEach(row => {
      progress[`problem_${row.problem_id}`] = {
        solved: row.status === 'solved',
        progress: row.status === 'solved' ? 100 : 0
      };
    });
    
    res.json({ progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get complete DSA learning path
router.get('/learning-path/dsa', optionalAuth, async (req, res) => {
  try {
    let userProgress = {};
    
    if (req.user) {
      const { data } = await supabaseAdmin
        .from('user_progress')
        .select('problem_id, status')
        .eq('user_id', req.user.id);

      (data || []).forEach(row => {
        userProgress[`problem_${row.problem_id}`] = {
          solved: row.status === 'solved'
        };
      });
    }
    
    const pathWithProgress = {
      ...dsaLearningPath,
      modules: dsaLearningPath.modules.map(module => ({
        ...module,
        progress: getModuleProgress(module.slug, userProgress),
        problems: getModuleProblems(module.slug)
      }))
    };
    
    res.json(pathWithProgress);
  } catch (error) {
    console.error('Error fetching DSA learning path:', error);
    res.status(500).json({ error: 'Failed to fetch learning path' });
  }
});

// Get specific module from DSA learning path
router.get('/learning-path/dsa/module/:moduleSlug', optionalAuth, async (req, res) => {
  try {
    const { moduleSlug } = req.params;
    
    const module = dsaLearningPath.modules.find(m => m.slug === moduleSlug);
    
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    let userProgress = {};
    
    if (req.user) {
      const { data } = await supabaseAdmin
        .from('user_progress')
        .select('problem_id, status')
        .eq('user_id', req.user.id);

      (data || []).forEach(row => {
        userProgress[`problem_${row.problem_id}`] = {
          solved: row.status === 'solved'
        };
      });
    }
    
    const problems = getModuleProblems(moduleSlug);
    const progress = getModuleProgress(moduleSlug, userProgress);
    
    res.json({
      ...module,
      problems,
      progress
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});

// Get complete LLD learning path
router.get('/learning-path/lld', optionalAuth, async (req, res) => {
  try {
    let completedProblems = {};
    
    if (req.user) {
      const { data } = await supabaseAdmin
        .from('user_progress')
        .select('problem_id, status')
        .eq('user_id', req.user.id);

      (data || []).forEach(row => {
        completedProblems[row.problem_id] = row.status === 'solved';
      });
    }
    
    const pathWithProgress = {
      ...lldLearningPath,
      modules: lldLearningPath.modules.map(module => {
        const moduleProblems = lldLearningPath.practiceProblems.filter(p => 
          module.keyProblems?.some(kp => kp.title === p.title)
        );
        
        const solved = moduleProblems.filter(p => completedProblems[p.id]).length;
        const total = module.problemCount;
        const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
        
        return {
          ...module,
          progress: {
            solved,
            total,
            percentage
          }
        };
      })
    };
    
    res.json(pathWithProgress);
  } catch (error) {
    console.error('Error fetching LLD learning path:', error);
    res.status(500).json({ error: 'Failed to fetch learning path' });
  }
});

// Get specific module from LLD learning path
router.get('/learning-path/lld/module/:moduleSlug', optionalAuth, async (req, res) => {
  try {
    const { moduleSlug } = req.params;
    
    const module = lldLearningPath.modules.find(m => m.slug === moduleSlug);
    
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    
    let completedProblems = {};
    
    if (req.user) {
      const { data } = await supabaseAdmin
        .from('user_progress')
        .select('problem_id, status')
        .eq('user_id', req.user.id);

      (data || []).forEach(row => {
        completedProblems[row.problem_id] = row.status === 'solved';
      });
    }
    
    const relatedProblems = lldLearningPath.practiceProblems.filter(p => 
      module.keyProblems?.some(kp => kp.title === p.title)
    );
    
    const solved = relatedProblems.filter(p => completedProblems[p.id]).length;
    const total = module.problemCount;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
    
    res.json({
      ...module,
      relatedProblems,
      progress: {
        solved,
        total,
        percentage
      }
    });
  } catch (error) {
    console.error('Error fetching LLD module:', error);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});

export default router;
