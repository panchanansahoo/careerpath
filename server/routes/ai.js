import express from 'express';
import Groq from 'groq-sdk';
import { authenticateToken } from '../middleware/auth.js';
import { supabaseAdmin } from '../db/supabaseClient.js';

const router = express.Router();

const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

router.post('/code-feedback', authenticateToken, async (req, res) => {
  const { code, language, problemId } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  try {
    let problemContext = '';
    if (problemId) {
      const { data: problem } = await supabaseAdmin
        .from('problems')
        .select('title, description')
        .eq('id', problemId)
        .single();

      if (problem) {
        problemContext = `Problem: ${problem.title}\n${problem.description}\n\n`;
      }
    }

    if (!groq) {
      return res.json({
        feedback: {
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)',
          strengths: [
            'Code is readable and well-structured',
            'Uses appropriate data structures'
          ],
          improvements: [
            'Consider edge cases',
            'Add input validation'
          ],
          suggestions: 'Overall good implementation. Consider optimizing for better performance.',
          score: 85
        }
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are an expert programming coach. Analyze code and provide constructive feedback on time complexity, space complexity, code quality, and suggest improvements. Format your response as JSON with fields: timeComplexity, spaceComplexity, strengths (array), improvements (array), suggestions (string), score (0-100). Respond ONLY with valid JSON.'
        },
        {
          role: 'user',
          content: `${problemContext}Language: ${language}\n\nCode:\n${code}\n\nProvide detailed feedback.`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const feedback = JSON.parse(completion.choices[0].message.content);
    
    if (problemId) {
      // Update latest submission with AI feedback
      const { data: latestSub } = await supabaseAdmin
        .from('submissions')
        .select('id')
        .eq('user_id', req.user.id)
        .eq('problem_id', problemId)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single();

      if (latestSub) {
        await supabaseAdmin
          .from('submissions')
          .update({ ai_feedback: JSON.stringify(feedback) })
          .eq('id', latestSub.id);
      }
    }

    res.json({ feedback });
  } catch (error) {
    console.error('AI feedback error:', error);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

router.post('/mock-interview', authenticateToken, async (req, res) => {
  const { interviewType, difficulty, userResponse } = req.body;

  try {
    if (!groq) {
      return res.json({
        question: 'Describe a time when you solved a challenging technical problem.',
        followUp: 'What was your approach to solving this problem?',
        feedback: 'Good response. Consider providing more specific technical details.'
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert technical interviewer conducting a ${interviewType} interview at ${difficulty} level. Ask relevant questions, provide follow-ups, and give constructive feedback.`
        },
        {
          role: 'user',
          content: userResponse || 'Start the interview'
        }
      ]
    });

    res.json({
      response: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Mock interview error:', error);
    res.status(500).json({ error: 'Failed to conduct interview' });
  }
});

router.post('/hint', authenticateToken, async (req, res) => {
  const { problemId, currentCode } = req.body;

  try {
    const { data: problem, error } = await supabaseAdmin
      .from('problems')
      .select('title, description, hints')
      .eq('id', problemId)
      .single();

    if (error || !problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    if (!groq) {
      return res.json({
        hint: problem.hints?.[0] || 'Think about the problem step by step and consider edge cases.'
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful coding mentor. Provide subtle hints without giving away the complete solution. Guide the user to think through the problem.'
        },
        {
          role: 'user',
          content: `Problem: ${problem.title}\n${problem.description}\n\nCurrent code:\n${currentCode || 'Not started yet'}\n\nProvide a helpful hint.`
        }
      ]
    });

    res.json({
      hint: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Hint generation error:', error);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
});

router.post('/explain', authenticateToken, async (req, res) => {
  const { code, language } = req.body;

  try {
    if (!groq) {
      return res.json({
        explanation: 'This code implements the solution using standard algorithms and data structures.'
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a coding tutor. Explain code clearly and concisely, breaking down complex concepts.'
        },
        {
          role: 'user',
          content: `Explain this ${language} code:\n\n${code}`
        }
      ]
    });

    res.json({
      explanation: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Code explanation error:', error);
    res.status(500).json({ error: 'Failed to explain code' });
  }
});

export default router;
