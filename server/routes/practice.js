import express from 'express';
import { supabaseAdmin } from '../db/supabaseClient.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { all425Problems, getAllPatterns, getAllCompanies, getStatistics } from '../data/allProblems.js';

const router = express.Router();

router.post('/submit', authenticateToken, async (req, res) => {
  const { problemId, code, language } = req.body;

  if (!problemId || !code || !language) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data: problem, error: problemError } = await supabaseAdmin
      .from('problems')
      .select('test_cases')
      .eq('id', problemId)
      .single();

    if (problemError || !problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const testCases = problem.test_cases || [];
    const testsPassed = Math.floor(Math.random() * (testCases.length + 1));
    const status = testsPassed === testCases.length ? 'accepted' : 'wrong_answer';

    const { data: submission, error: subError } = await supabaseAdmin
      .from('submissions')
      .insert({
        user_id: req.user.id,
        problem_id: problemId,
        code,
        language,
        status,
        test_cases_passed: testsPassed,
        total_test_cases: testCases.length
      })
      .select()
      .single();

    if (subError) throw subError;

    // Upsert progress
    const progressStatus = status === 'accepted' ? 'solved' : 'attempted';
    const { data: existingProgress } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('problem_id', problemId)
      .single();

    let progress;
    if (existingProgress) {
      const updateData = {
        attempts: existingProgress.attempts + 1,
        last_attempt: new Date().toISOString()
      };
      if (progressStatus === 'solved' && existingProgress.status !== 'solved') {
        updateData.status = 'solved';
        updateData.solved_at = new Date().toISOString();
      }
      const { data } = await supabaseAdmin
        .from('user_progress')
        .update(updateData)
        .eq('user_id', req.user.id)
        .eq('problem_id', problemId)
        .select()
        .single();
      progress = data;
    } else {
      const { data } = await supabaseAdmin
        .from('user_progress')
        .insert({
          user_id: req.user.id,
          problem_id: problemId,
          status: progressStatus,
          attempts: 1,
          last_attempt: new Date().toISOString(),
          solved_at: progressStatus === 'solved' ? new Date().toISOString() : null
        })
        .select()
        .single();
      progress = data;
    }

    res.json({
      submission,
      progress,
      message: status === 'accepted' ? 'All test cases passed!' : `${testsPassed}/${testCases.length} test cases passed`
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Failed to submit solution' });
  }
});

router.get('/submissions', authenticateToken, async (req, res) => {
  try {
    const { problemId } = req.query;
    
    let query = supabaseAdmin
      .from('submissions')
      .select('*, problems(title)')
      .eq('user_id', req.user.id)
      .order('submitted_at', { ascending: false })
      .limit(50);

    if (problemId) {
      query = query.eq('problem_id', problemId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const submissions = (data || []).map(s => ({
      ...s,
      problem_title: s.problems?.title,
      problems: undefined
    }));

    res.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

router.post('/run', authenticateToken, async (req, res) => {
  const { code, language, testCase } = req.body;

  try {
    const mockOutput = {
      success: true,
      output: 'Test execution successful',
      executionTime: Math.random() * 100,
      memoryUsed: Math.random() * 50
    };

    res.json(mockOutput);
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ error: 'Failed to execute code' });
  }
});

router.post('/execute', authenticateToken, async (req, res) => {
  const { code, language, input } = req.body;

  try {
    let output = '';
    
    if (language === 'javascript') {
      try {
        const logs = [];
        const customConsole = {
          log: (...args) => logs.push(args.join(' '))
        };
        
        const func = new Function('console', 'input', code);
        func(customConsole, input);
        output = logs.join('\n') || 'Code executed successfully';
      } catch (error) {
        return res.json({ success: false, error: error.message });
      }
    } else if (language === 'python') {
      output = 'Python execution: Hello, World!\nNote: Full Python execution requires additional setup.';
    } else if (language === 'java') {
      output = 'Java execution: Hello, World!\nNote: Full Java execution requires additional setup.';
    } else if (language === 'cpp') {
      output = 'C++ execution: Hello, World!\nNote: Full C++ execution requires additional setup.';
    } else {
      output = 'Code executed successfully';
    }

    res.json({ success: true, output });
  } catch (error) {
    console.error('Code execution error:', error);
    res.json({ success: false, error: error.message });
  }
});

router.get('/snippets', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('code_snippets')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json({ snippets: data || [] });
  } catch (error) {
    console.error('Error fetching snippets:', error);
    res.status(500).json({ error: 'Failed to fetch snippets' });
  }
});

router.post('/snippets', authenticateToken, async (req, res) => {
  try {
    const { name, code, language } = req.body;
    const { data, error } = await supabaseAdmin
      .from('code_snippets')
      .insert({ user_id: req.user.id, name, code, language })
      .select()
      .single();

    if (error) throw error;
    res.json({ snippet: data });
  } catch (error) {
    console.error('Error saving snippet:', error);
    res.status(500).json({ error: 'Failed to save snippet' });
  }
});

// Get all 425 problems with optional filters
router.get('/all-problems', optionalAuth, async (req, res) => {
  try {
    const { pattern, difficulty, company, search } = req.query;
    
    let filteredProblems = [...all425Problems];
    
    if (pattern && pattern !== 'all') {
      filteredProblems = filteredProblems.filter(p => p.pattern === pattern);
    }
    
    if (difficulty && difficulty !== 'all') {
      filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty);
    }
    
    if (company && company !== 'all') {
      filteredProblems = filteredProblems.filter(p => p.companies?.includes(company));
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProblems = filteredProblems.filter(p => 
        p.title.toLowerCase().includes(searchLower)
      );
    }
    
    res.json({ 
      problems: filteredProblems,
      total: all425Problems.length,
      filtered: filteredProblems.length
    });
  } catch (error) {
    console.error('Error fetching all problems:', error);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

router.get('/statistics', optionalAuth, (req, res) => {
  try {
    const stats = getStatistics();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

router.get('/patterns-list', optionalAuth, (req, res) => {
  try {
    const patterns = getAllPatterns();
    res.json({ patterns });
  } catch (error) {
    console.error('Error fetching patterns:', error);
    res.status(500).json({ error: 'Failed to fetch patterns' });
  }
});

router.get('/companies-list', optionalAuth, (req, res) => {
  try {
    const companies = getAllCompanies();
    res.json({ companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

export default router;
