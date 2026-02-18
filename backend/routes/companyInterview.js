import express from 'express';
import Groq from 'groq-sdk';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// ─── Interviewer personality system prompt ───
const getInterviewerPersona = (company, role, stage, difficulty, questionNumber, totalQuestions) => `
You are a senior interviewer at ${company} conducting a ${stage} round interview for a ${role} position.
Difficulty level: ${difficulty}. This is question ${questionNumber} of ${totalQuestions}.

## Your Personality
- You are warm, professional, and encouraging — like a real human interviewer
- You use natural conversational language, not robotic responses
- You occasionally say things like "That's a great point", "Interesting approach", "I see what you mean"
- You build rapport — reference what the candidate said earlier when relevant
- You give the candidate a moment to think when asking hard questions ("Take your time with this one")
- You probe deeper when answers are vague — ask "Can you be more specific?" or "What would happen if...?"
- When the candidate struggles, you nudge gently: "Would it help to think about it from the perspective of...?"

## Interview Structure
${questionNumber === 1 ? `- This is the OPENING question. Start with a warm greeting: "Hi! Great to have you here today. I'm excited to learn more about your experience." Then ask your first question naturally.` : ''}
${questionNumber === totalQuestions ? `- This is the FINAL question. After this, wrap up warmly: "We're almost done — one last question for you."` : ''}
${questionNumber > 1 && questionNumber < totalQuestions ? `- Transition naturally from the previous answer. Reference something specific the candidate said before asking the next question.` : ''}

## Question Guidelines for ${stage}
${stage === 'Technical' ? `- Ask coding, DSA, or system-level questions appropriate for ${company}
- Start with a clear problem statement
- Include constraints and expected complexity
- If the candidate's answer is partial, ask them to optimize or handle edge cases` : ''}
${stage === 'Behavioral' ? `- Use STAR method prompts (Situation, Task, Action, Result)
- Ask about real experiences: conflicts, failures, leadership, teamwork
- Probe for specifics: "What was YOUR specific role?" "What was the measurable outcome?"` : ''}
${stage === 'System Design' ? `- Start with a high-level design question relevant to ${company}'s products
- Ask about trade-offs, scaling, and failure scenarios
- Probe deeper: "How would you handle 10x traffic?" "What if this service goes down?"` : ''}
${stage === 'HR' ? `- Ask culture-fit and motivation questions relevant to ${company}
- Probe career goals, why this company, work style preferences
- Be conversational and genuine` : ''}
`;

// ─── Start Interview ───
router.post('/start', authenticateToken, async (req, res) => {
  const { company, role, stage, difficulty, totalQuestions = 8 } = req.body;

  try {
    if (!groq) {
      return res.json({
        question: `Hi! Great to have you here today for this ${stage} interview. I'm really looking forward to learning about your experience as a ${role}. Let's start with something fundamental — can you walk me through a challenging technical problem you solved recently? I'd love to hear your thought process.`,
        context: { company, role, stage, difficulty, totalQuestions },
        tips: ['Take a moment to collect your thoughts before answering', 'Structure your answer clearly — problem first, then approach, then result'],
        interviewerReaction: 'greeting',
        thinkTime: 30
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: getInterviewerPersona(company, role, stage, difficulty, 1, totalQuestions) + `

Respond as JSON:
{
  "question": "Your opening greeting + first question (speak naturally like a human interviewer)",
  "tips": ["Tip 1 for the candidate", "Tip 2"],
  "thinkTime": 30,
  "interviewerReaction": "greeting"
}`
        },
        { role: 'user', content: `Start the ${stage} interview for ${role} at ${company}. Remember to greet warmly first.` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json({
      ...result,
      context: { company, role, stage, difficulty, totalQuestions },
      thinkTime: result.thinkTime || 30,
      interviewerReaction: result.interviewerReaction || 'greeting'
    });
  } catch (error) {
    console.error('Company interview start error:', error);
    res.status(500).json({ error: 'Failed to start interview' });
  }
});

// ─── Follow-up with realistic interviewer behavior ───
router.post('/follow-up', authenticateToken, async (req, res) => {
  const { company, role, stage, difficulty, previousQuestion, userAnswer, conversationHistory, questionNumber = 2, totalQuestions = 8 } = req.body;

  try {
    if (!groq) {
      const reactions = [
        "That's a solid approach! I like how you structured that.",
        "Interesting perspective. Let me dig a bit deeper on one aspect.",
        "Good thinking! I can see you've worked through problems like this before.",
        "I appreciate the detail there. Let's explore a different angle now.",
        "Nice! You covered the key points well. Here's a follow-up to push your thinking..."
      ];
      return res.json({
        feedback: reactions[Math.floor(Math.random() * reactions.length)],
        followUpQuestion: 'Can you walk me through how you would optimize that solution for scale? What trade-offs would you consider?',
        score: 72 + Math.floor(Math.random() * 20),
        strengths: ['Clear communication', 'Structured thinking'],
        improvements: ['Add more specific metrics or examples', 'Consider edge cases'],
        interviewerReaction: 'encouraging',
        thinkTime: 45,
        hint: 'Think about time vs space complexity trade-offs'
      });
    }

    const messages = [
      {
        role: 'system',
        content: getInterviewerPersona(company, role, stage, difficulty, questionNumber, totalQuestions) + `

The candidate just answered a question. You must:
1. React naturally to their answer (acknowledge what they said specifically — don't be generic)
2. Give brief, actionable feedback
3. Ask a follow-up that digs deeper OR moves to a new topic naturally
4. Provide a score, strengths, and improvements
5. Include a subtle hint the candidate can optionally reveal if stuck on the next question
6. Suggest a reasonable "think time" in seconds for the next question

IMPORTANT: Your reaction should reference SPECIFIC things the candidate said. Not generic praise.
If the answer was weak, be encouraging but honest: "I think you're on the right track, but let me push you a bit further..."
If the answer was strong, show genuine enthusiasm: "That's exactly the kind of thinking we look for!"

Respond as JSON:
{
  "feedback": "Natural reaction + brief evaluation (2-3 sentences, conversational tone)",
  "followUpQuestion": "Your next question (natural transition from what they just said)",
  "score": 0-100,
  "strengths": ["specific things they did well"],
  "improvements": ["specific things to improve"],
  "interviewerReaction": "encouraging|impressed|probing|neutral|challenging",
  "thinkTime": 30-90,
  "hint": "A gentle nudge if they get stuck on the follow-up (1 sentence)"
}`
      },
      ...(conversationHistory || []).map(h => ({
        role: h.role === 'interviewer' ? 'assistant' : 'user',
        content: h.content
      })),
      { role: 'assistant', content: previousQuestion },
      { role: 'user', content: userAnswer }
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.75
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json({
      ...result,
      interviewerReaction: result.interviewerReaction || 'neutral',
      thinkTime: result.thinkTime || 45,
      hint: result.hint || 'Try breaking the problem into smaller parts'
    });
  } catch (error) {
    console.error('Follow-up generation error:', error);
    res.status(500).json({ error: 'Failed to generate follow-up' });
  }
});

// ─── Get a hint for current question ───
router.post('/hint', authenticateToken, async (req, res) => {
  const { company, role, stage, currentQuestion, conversationHistory } = req.body;

  try {
    if (!groq) {
      return res.json({
        hint: "Try breaking this down step by step. What's the simplest version of this problem you could solve first?",
        approach: "Consider starting with a brute force solution, then optimize from there.",
        keyTopics: ["Time complexity", "Space-time tradeoff", "Edge cases"]
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a helpful interviewer at ${company}. The candidate is stuck on a question during a ${stage} interview for ${role}. 
Give them a gentle nudge WITHOUT giving away the answer. Be encouraging like a supportive mentor.
Use language like "Have you considered...", "What if you think about it from...", "A good starting point might be..."

Respond as JSON:
{
  "hint": "A gentle nudge (1-2 sentences, conversational)",
  "approach": "Suggested approach without the full answer (2-3 sentences)",
  "keyTopics": ["Topic 1 to think about", "Topic 2", "Topic 3"]
}`
        },
        ...(conversationHistory || []).slice(-4).map(h => ({
          role: h.role === 'interviewer' ? 'assistant' : 'user',
          content: h.content
        })),
        { role: 'user', content: `I'm stuck on this question: "${currentQuestion}". Can you give me a hint?` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);
  } catch (error) {
    console.error('Hint generation error:', error);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
});

// ─── Evaluate overall interview session ───
router.post('/evaluate', authenticateToken, async (req, res) => {
  const { company, role, stage, conversation } = req.body;

  try {
    if (!groq) {
      return res.json({
        overallScore: 78,
        summary: 'Solid performance with room for improvement in technical depth.',
        strengths: ['Good communication', 'Structured responses', 'Clear problem-solving approach'],
        improvements: ['Add more technical detail', 'Use specific metrics', 'Consider more edge cases'],
        recommendation: 'Practice more system design questions for this role.',
        verdictEmoji: '👍',
        verdict: 'Would Advance',
        detailedBreakdown: {
          technicalSkills: 75,
          communication: 82,
          problemSolving: 78,
          cultureFit: 80
        }
      });
    }

    const conversationText = conversation
      .filter(c => c.role !== 'feedback')
      .map(c => `${c.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${c.content}`)
      .join('\n');

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are the interview panel at ${company} evaluating a ${stage} interview for ${role}.
          
Write your evaluation as if you're a real hiring committee debriefing after the interview.
Be honest but constructive. Reference SPECIFIC things the candidate said or did.

Respond as JSON:
{
  "overallScore": 0-100,
  "summary": "2-3 sentence evaluation in natural language, like talking to a colleague about the candidate",
  "strengths": ["Specific strength 1 with example from interview", "Strength 2", "Strength 3"],
  "improvements": ["Specific area 1 with what they should have done", "Area 2", "Area 3"],
  "recommendation": "One practical, actionable recommendation for what to practice next",
  "verdict": "Strong Hire / Would Advance / Borderline / Would Not Advance",
  "verdictEmoji": "🌟 or 👍 or 🤔 or 👎",
  "detailedBreakdown": {
    "technicalSkills": 0-100,
    "communication": 0-100,
    "problemSolving": 0-100,
    "cultureFit": 0-100
  }
}`
        },
        { role: 'user', content: conversationText }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);
  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ error: 'Failed to evaluate interview' });
  }
});

// ─── Analyze speech for pace, fillers, clarity ───
router.post('/speech-feedback', authenticateToken, async (req, res) => {
  const { transcript, duration } = req.body;

  try {
    const words = transcript.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const wpm = duration > 0 ? Math.round((wordCount / duration) * 60) : 0;

    const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally', 'so', 'right', 'i mean', 'kind of', 'sort of'];
    const fillerCount = {};
    let totalFillers = 0;
    const lowerTranscript = transcript.toLowerCase();
    fillerWords.forEach(fw => {
      const regex = new RegExp(`\\b${fw}\\b`, 'gi');
      const matches = lowerTranscript.match(regex);
      if (matches && matches.length > 0) {
        fillerCount[fw] = matches.length;
        totalFillers += matches.length;
      }
    });

    const fillerRate = wordCount > 0 ? (totalFillers / wordCount * 100).toFixed(1) : 0;

    let paceAssessment = 'Good';
    if (wpm < 100) paceAssessment = 'Too slow — try to speak more confidently';
    else if (wpm > 180) paceAssessment = 'Too fast — slow down for clarity';
    else if (wpm >= 130 && wpm <= 160) paceAssessment = 'Excellent pace!';

    let clarityScore = 85;
    if (totalFillers > 5) clarityScore -= totalFillers * 2;
    if (wpm < 90 || wpm > 190) clarityScore -= 10;
    clarityScore = Math.max(0, Math.min(100, clarityScore));

    // Confidence assessment
    const avgWordLength = words.length > 0 ? words.reduce((a, w) => a + w.length, 0) / words.length : 0;
    let confidenceScore = 70;
    if (wpm >= 120 && wpm <= 170) confidenceScore += 10;
    if (totalFillers <= 2) confidenceScore += 10;
    if (avgWordLength > 4.5) confidenceScore += 5; // using more sophisticated words
    if (wordCount > 50) confidenceScore += 5; // detailed answer
    confidenceScore = Math.min(100, confidenceScore);

    res.json({
      wordCount,
      wpm,
      paceAssessment,
      fillerCount,
      totalFillers,
      fillerRate: `${fillerRate}%`,
      clarityScore,
      confidenceScore,
      tips: [
        totalFillers > 3 ? `Reduce filler words (found ${totalFillers}: ${Object.keys(fillerCount).join(', ')})` : 'Great job minimizing filler words!',
        wpm < 120 ? 'Try to speak a bit faster to maintain engagement' : wpm > 170 ? 'Slow down slightly for better comprehension' : 'Your speaking pace is good!',
        'Remember to pause briefly between key points for emphasis',
        confidenceScore < 70 ? 'Try to sound more assertive — own your answers!' : 'Good confidence level in your delivery!'
      ]
    });
  } catch (error) {
    console.error('Speech feedback error:', error);
    res.status(500).json({ error: 'Failed to analyze speech' });
  }
});

export default router;
