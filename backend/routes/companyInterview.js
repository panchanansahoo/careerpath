import express from 'express';
import Groq from 'groq-sdk';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { supabaseAdmin } from '../db/supabaseClient.js';

const router = express.Router();
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

// Multer config for STT audio uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: os.tmpdir(),
    filename: (req, file, cb) => cb(null, `stt_${Date.now()}${path.extname(file.originalname) || '.webm'}`)
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype.startsWith('audio/'));
  }
});

// ─── Company Category Classification ───
const COMPANY_CATEGORIES = {
  big4: ['deloitte', 'kpmg', 'ey', 'pwc'],
  faang: ['google', 'amazon', 'meta', 'microsoft', 'apple', 'netflix'],
  indian_it: ['tcs', 'infosys', 'wipro', 'hcl', 'techmahindra', 'cognizant'],
  startup: ['flipkart', 'paytm', 'swiggy', 'zomato', 'razorpay', 'cred', 'meesho'],
};

function getCompanyCategory(company) {
  const id = company.toLowerCase();
  for (const [cat, list] of Object.entries(COMPANY_CATEGORIES)) {
    if (list.some(c => id.includes(c))) return cat;
  }
  return 'general';
}

// ─── Distinct Interviewer Personas ───
const PERSONA_PROFILES = {
  big4: {
    name: 'Senior Partner',
    style: 'Formal & Structured',
    description: 'You speak like a senior consulting partner — formal but warm, structured, and analytical. You use frameworks (MECE, issue trees) and expect structured answers.',
    followUpStyle: 'Ask structured follow-ups using consulting frameworks. Challenge assumptions with data questions.',
    challengeMode: 'When an answer lacks structure, say: "I appreciate the direction, but can you structure that more systematically?"',
  },
  faang: {
    name: 'Staff Engineer',
    style: 'Technical & Deep',
    description: 'You speak like a staff engineer at a top tech company — technically rigorous, direct but friendly. You expect deep technical depth and system-level thinking.',
    followUpStyle: 'Dive deep into implementation details. Ask about time/space complexity, alternatives, and what happens at 10x scale.',
    challengeMode: 'When an answer is surface-level, say: "Good start, but go deeper. What about edge cases? What are the trade-offs?"',
  },
  startup: {
    name: 'CTO / Co-founder',
    style: 'Conversational & Product-minded',
    description: 'You speak like a startup CTO — casual, direct, product-focused. You care about speed, product thinking, and cultural fit.',
    followUpStyle: 'Ask about practical implementation, MVP approach, user impact, and prioritization.',
    challengeMode: 'When an answer is too theoretical, say: "Cool idea, but how would you actually ship this? What\'s your MVP?"',
  },
  indian_it: {
    name: 'Technical Lead',
    style: 'Professional & Fundamentals-focused',
    description: 'You speak like a technical lead at a large IT services company — professional, focused on fundamentals and problem-solving.',
    followUpStyle: 'Test foundational knowledge with follow-ups on CS fundamentals. Ask to compare approaches.',
    challengeMode: 'When an answer misses fundamentals, say: "That\'s partially correct. What are the underlying principles at play here?"',
  },
  general: {
    name: 'Hiring Manager',
    style: 'Balanced & Professional',
    description: 'You speak like an experienced hiring manager — balanced between technical and behavioral assessment.',
    followUpStyle: 'Mix of technical depth and behavioral probing. Ask about real experiences and problem-solving.',
    challengeMode: 'When an answer needs improvement, say: "Good effort. Can you think of a scenario where your approach might not work?"',
  },
};

// ─── Enhanced Interviewer Persona System ───
const getInterviewerPersona = (company, role, stage, difficulty, questionNumber, totalQuestions) => {
  const category = getCompanyCategory(company);
  const persona = PERSONA_PROFILES[category] || PERSONA_PROFILES.general;

  return `
You are a senior interviewer at ${company} conducting a ${stage} round interview for a ${role} position.
Difficulty level: ${difficulty}. This is question ${questionNumber} of ${totalQuestions}.

## Your Interviewer Profile
- **Role**: ${persona.name} at ${company}
- **Style**: ${persona.style}
- **Personality**: ${persona.description}

## Engagement Rules - STRICT
- **BE EXTREMELY CONVERSATIONAL AND HUMAN.** Speak like a real person on a video call.
- **LIMIT RESPONSES TO 1-3 SENTENCES MAX.** Brevity is critical. Do not give long monologues.
- React naturally, referencing SPECIFIC things the candidate said. Say things like "Got it", "That makes sense", or "Interesting approach."
- NEVER use robotic transition phrases like "Moving on to my next question" or "Thank you for that detailed answer."
- ${persona.followUpStyle}
- ${persona.challengeMode}
- When the candidate does well: show genuine, brief enthusiasm.
- When they struggle: be encouraging but honest, nudge them forward.
- Build on previous answers — create a flowing conversation.

## Interview Flow
${questionNumber === 1 ? `- OPENING: Greet warmly and briefly. Introduce yourself: "Hi! I'm [Name], ${persona.style.toLowerCase()} interviewer at ${company}." Then ask your first question immediately.` : ''}
${questionNumber === totalQuestions ? `- FINAL QUESTION: Signal this casually: "Great chatting so far — just one last question for you."` : ''}
${questionNumber > 1 && questionNumber < totalQuestions ? `- Transition naturally from the previous answer. Keep it feeling like an ongoing chat.` : ''}

## Stage-Specific Guidelines — FOLLOW STRICTLY
${stage === 'Technical' ? `- Ask general technical knowledge questions: OOP concepts, databases, networking, OS, design patterns, language fundamentals
- ${category === 'faang' ? 'Probe for deep understanding of CAP theorem, distributed systems, concurrency.' : ''}
- ${category === 'big4' ? 'Focus on problem-solving approach and structured thinking.' : ''}
- ${category === 'indian_it' ? 'Test core CS fundamentals: OOPS, DBMS, OS, SQL, networking.' : ''}
- DO NOT ask behavioral or HR-style questions` : ''}
${stage === 'DSA / Coding' ? `- Ask DATA STRUCTURES AND ALGORITHMS coding problems ONLY
- Present a coding problem with clear constraints (input size, expected complexity)
- Topics: arrays, strings, linked lists, trees, graphs, DP, sorting, searching, recursion, greedy
- Ask about time/space complexity
- ${category === 'faang' ? 'Leetcode medium-to-hard. Expect optimal Big-O. Ask about edge cases.' : ''}
- ${category === 'indian_it' ? 'Leetcode easy-to-medium. Basic DS: arrays, strings, stacks, queues, trees.' : ''}
- ${category === 'startup' ? 'Practical coding. Focus on clean code and working solutions.' : ''}
- DO NOT ask behavioral, HR, or system design questions. ONLY coding/algorithm problems.` : ''}
${stage === 'System Design' ? `- Ask system design questions relevant to ${company}'s domain
- Start with requirements, then high-level architecture, then deep dive
- Probe trade-offs, scaling, failure scenarios, database choices
- ${category === 'faang' ? 'Detailed component design, data models, API design, scaling.' : ''}
- ${category === 'startup' ? 'MVP design, practical architecture, iteration speed.' : ''}
- DO NOT ask coding/DSA or behavioral questions. ONLY system design.` : ''}
${stage === 'HR' ? `- Ask ONLY culture-fit, motivation, and personal questions
- Examples: "Tell me about yourself", "Why ${company}?", "Where do you see yourself in 5 years?", "Salary expectations?", "Open to relocation?"
- Career goals, work preferences, team fit, company interest
- ${category === 'big4' ? 'Professional maturity, client-facing skills, career clarity.' : ''}
- ${category === 'startup' ? 'Ownership mentality, learning agility, passion for the product.' : ''}
- Be warm, conversational, and genuine
- ⚠️ DO NOT ask ANY technical, coding, DSA, or system design questions. STRICTLY HR.` : ''}
${stage === 'Behavioral' ? `- Ask ONLY behavioral/situational questions using STAR method
- Examples: "Tell me about a time you handled conflict", "Describe a challenging project"
- ${category === 'faang' ? 'Amazon-style Leadership Principles: Ownership, Bias for Action, Dive Deep.' : ''}
- ${category === 'big4' ? 'Client management, stakeholder communication, cross-functional teamwork.' : ''}
- Probe for specifics: "What was YOUR role?", "What was the measurable outcome?"
- ⚠️ DO NOT ask technical, coding, or DSA questions. STRICTLY behavioral.` : ''}
${stage === 'OA' ? `- Simulate online assessment: coding/aptitude problems
- Clear problem statements with input/output examples
- Focus on problem-solving, logic, code correctness` : ''}
${stage === 'Managerial' ? `- Leadership, project management, team handling, conflict resolution
- Decision-making, prioritization, stakeholder management
- Mix of behavioral and high-level technical judgment` : ''}
`;
};

// ─── Start Interview ───
router.post('/start', optionalAuth, async (req, res) => {
  const { company, role, stage, difficulty, totalQuestions = 8 } = req.body;

  try {
    if (!groq) {
      // Stage-specific fallback questions
      const fallbackQuestions = {
        'HR': `Hi! Welcome to your HR interview at ${company}. I'm excited to get to know you better. Let's start simple — can you tell me about yourself and what excites you about this ${role} role at ${company}?`,
        'Behavioral': `Hi! Welcome to your behavioral interview. I'd love to hear about your experiences. Can you tell me about a time when you faced a significant challenge at work and how you handled it?`,
        'DSA / Coding': `Hi! Welcome to your coding round. Let's start with a classic problem — given an array of integers, can you walk me through how you'd find two numbers that add up to a target sum? Think about both approach and time complexity.`,
        'System Design': `Hi! Welcome to your system design round at ${company}. Let's start with a high-level question — how would you design a URL shortening service like bit.ly? Think about scale, storage, and the key components.`,
        'Technical': `Hi! Welcome to your technical interview. Let's start — can you explain the difference between a process and a thread? When would you use one over the other?`,
        'OA': `Welcome to your online assessment simulation. Here's your first problem: Given a string, find the length of the longest substring without repeating characters. Think about your approach before coding.`,
        'Managerial': `Hi! Welcome to the managerial round. I'd like to understand your leadership style. Can you tell me about a time you had to manage a difficult project with competing priorities?`,
      };
      return res.json({
        question: fallbackQuestions[stage] || `Hi! Great to have you here for this ${stage} interview at ${company}. Let's start — tell me about your relevant experience as a ${role}.`,
        context: { company, role, stage, difficulty, totalQuestions },
        tips: ['Take a moment to collect your thoughts', 'Structure your answer: context → approach → result'],
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
  "question": "Your opening greeting + first question (Extremely natural, max 2-3 sentences total)",
  "tips": ["Tip 1", "Tip 2"],
  "thinkTime": 30,
  "interviewerReaction": "greeting"
}`
        },
        { role: 'user', content: `Start the ${stage} interview for ${role} at ${company}. Greet warmly first.` }
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
    console.error('Interview start error:', error.message?.substring(0, 200));
    // Graceful fallback — serve stage-specific opening question
    const fallbackQuestions = {
      'HR': `Hi! Welcome to your HR interview at ${company}. I'm excited to get to know you better! Tell me about yourself — what excites you about this ${role} role at ${company}?`,
      'Behavioral': `Hi! Welcome to your behavioral round. I'd love to hear about your experiences. Tell me about a time you faced a significant challenge at work and how you handled it.`,
      'DSA / Coding': `Hi! Welcome to your coding round. Let's start — given an array of integers, how would you find two numbers that add up to a target sum? Walk me through your approach and time complexity.`,
      'System Design': `Hi! Welcome to your system design interview at ${company}. How would you design a URL shortening service? Think about key components, scale, and storage.`,
      'Technical': `Hi! Welcome to your technical interview. Let's start — can you explain the difference between a process and a thread? When would you choose one over the other?`,
      'OA': `Welcome to your online assessment. Your first problem: Given a string, find the length of the longest substring without repeating characters. Think carefully about your approach.`,
      'Managerial': `Hi! Welcome to the managerial round. Tell me about a time you had to manage a difficult project with competing priorities. How did you handle it?`,
    };
    res.json({
      question: fallbackQuestions[stage] || `Hi! Great to have you here for this ${stage} interview at ${company}. Tell me about your relevant experience as a ${role}.`,
      context: { company, role, stage, difficulty, totalQuestions },
      tips: ['Take a moment to collect your thoughts', 'Structure your answer clearly'],
      interviewerReaction: 'greeting',
      thinkTime: 30
    });
  }
});

// ─── Adaptive Difficulty Engine ───
function getAdaptiveDifficultyPrompt(lastScore, averageScore, cumulativeScores) {
  if (!lastScore && !averageScore) return '';

  const trend = cumulativeScores && cumulativeScores.length >= 2
    ? (cumulativeScores[cumulativeScores.length - 1] - cumulativeScores[cumulativeScores.length - 2])
    : 0;

  let adaptiveInstruction = '\n## Adaptive Difficulty (IMPORTANT)\n';

  if (averageScore >= 80 || lastScore >= 85) {
    adaptiveInstruction += `The candidate is performing EXCELLENTLY (last: ${lastScore}/100, avg: ${averageScore}/100, trend: ${trend > 0 ? 'improving' : 'stable'}).
- INCREASE difficulty significantly. Ask harder, more nuanced questions.
- Probe for edge cases, system-level thinking, and trade-off analysis.
- Challenge assumptions. Push for optimal solutions.
- Set "difficultyLevel": "hard", "adaptiveNote": brief explanation of why you're increasing difficulty.`;
  } else if (averageScore >= 60 || lastScore >= 60) {
    adaptiveInstruction += `The candidate is performing MODERATELY (last: ${lastScore}/100, avg: ${averageScore}/100, trend: ${trend > 0 ? 'improving' : trend < 0 ? 'declining' : 'stable'}).
- Keep difficulty STEADY at current level.
- Ask clarifying follow-ups that test depth on the same topic.
- If trend is improving, slightly increase complexity.
- Set "difficultyLevel": "medium", "adaptiveNote": brief explanation.`;
  } else {
    adaptiveInstruction += `The candidate is STRUGGLING (last: ${lastScore}/100, avg: ${averageScore}/100).
- DECREASE difficulty. Ask simpler, more foundational questions.
- Give a gentle hint or framework before asking.
- Build confidence — acknowledge what they got right before probing further.
- Set "difficultyLevel": "easy", "adaptiveNote": brief explanation of how you're adjusting.`;
  }

  return adaptiveInstruction;
}

// ─── Follow-up with realistic interviewer behavior ───
router.post('/follow-up', optionalAuth, async (req, res) => {
  const { company, role, stage, difficulty, previousQuestion, userAnswer, conversationHistory, questionNumber = 2, totalQuestions = 8, lastScore, averageScore, cumulativeScores, code, codeLanguage } = req.body;

  try {
    if (!groq) {
      const reactions = [
        "That's a solid approach! I like how you structured that.",
        "Interesting perspective. Let me dig a bit deeper.",
        "Good thinking! I can see you've worked through problems like this before.",
        "I appreciate the detail there. Let's explore a different angle.",
        "Nice! You covered the key points well.",
        "Great answer! I can tell you have hands-on experience with this.",
        "I like your thought process. Let me push you a bit further."
      ];
      // Diverse follow-ups per stage — rotates based on questionNumber
      const stageQuestions = {
        'Technical': [
          'Can you explain the difference between an abstract class and an interface? When would you pick one over the other?',
          'How does garbage collection work in your preferred language? What are the different algorithms?',
          'What is the difference between concurrency and parallelism? Can you give a real-world example?',
          'Explain how a hash map works internally. What happens during a collision?',
          'What are SOLID principles? Can you walk me through each one with a quick example?',
          'How would you debug a production issue where the application is running slow but CPU usage is normal?',
          'What is the CAP theorem? How does it apply to database selection?',
          'Explain the event loop in Node.js. How does it handle asynchronous operations?',
        ],
        'DSA / Coding': [
          'Given a linked list, how would you detect if it has a cycle? Walk me through your approach.',
          'How would you find the kth largest element in an unsorted array? What data structure helps here?',
          'Explain how you would serialize and deserialize a binary tree. What traversal order would you use?',
          'Given a string of parentheses, how would you check if they are balanced? What about multiple types?',
          'How would you merge two sorted arrays in-place? Think about doing it without extra space.',
          'Describe how you would implement an LRU cache. What data structures would you combine?',
          'How would you find the longest increasing subsequence in an array? Discuss both approaches.',
          'Given a matrix of 0s and 1s, how would you count the number of islands?',
        ],
        'System Design': [
          'How would you design a real-time chat application like WhatsApp? Think about message delivery guarantees.',
          'Walk me through designing a news feed system like Instagram. How would you handle ranking?',
          'How would you design a rate limiter for an API? What algorithms could you use?',
          'Design a notification system that handles millions of users. How do you handle delivery at scale?',
          'How would you design a key-value store like Redis? What about persistence and replication?',
          'Walk me through designing a search autocomplete system. How would you optimize for latency?',
          'How would you design a video streaming platform? Think about CDN and adaptive bitrate.',
          'Design a parking lot system. Start with the object model, then think about scaling.',
        ],
        'Behavioral': [
          'Tell me about a time you had to give difficult feedback to a teammate. How did you handle it?',
          'Describe a situation where you had to learn a completely new technology under a tight deadline.',
          'Can you share an example where you disagreed with your manager? What was the outcome?',
          'Tell me about a project that failed. What did you learn and what would you do differently?',
          'Describe a time when you had to prioritize between multiple urgent tasks. How did you decide?',
          'Share an experience where you mentored someone. What approach did you take?',
          'Tell me about a time you went above and beyond what was expected of you.',
          'Describe how you handled a situation with an ambiguous or unclear requirement.',
        ],
        'HR': [
          'What motivates you to come to work every day? What kind of work environment do you thrive in?',
          'Where do you see yourself in 3 to 5 years? How does this role fit into that vision?',
          'Why are you interested in leaving your current position? What are you looking for next?',
          'How do you handle work-life balance? What does a good day at work look like for you?',
          'Tell me about a value or principle that guides your professional decisions.',
          'What are your salary expectations? And what factors are most important to you in an offer?',
          'How would your current colleagues describe you in three words?',
          'What questions do you have for me about the team, the role, or the company culture?',
        ],
        'Managerial': [
          'How do you handle underperforming team members? Walk me through your approach.',
          'Tell me about a time you had to make a tough call between shipping fast and maintaining quality.',
          'How do you keep your team motivated during a long, challenging sprint?',
          'Describe your approach to giving performance reviews. How do you prepare?',
          'How would you handle a situation where two team members have a personal conflict?',
          'What is your process for setting team goals and tracking progress?',
          'How do you balance being hands-on technically while also managing people?',
          'Tell me about a time you had to push back on a stakeholder request. How did you navigate it?',
        ],
        'OA': [
          'Given an array of integers, find the contiguous subarray with the maximum sum. Explain your approach.',
          'How would you determine if a string is a valid palindrome, considering only alphanumeric characters?',
          'Write an algorithm to find all permutations of a given string. What is the time complexity?',
          'Given two sorted arrays, find the median of the combined array in O(log n) time.',
          'How would you implement a stack that supports getMin() in O(1) time?',
          'Given a 2D grid, find the shortest path from top-left to bottom-right. What algorithm would you use?',
          'Design an algorithm to rotate a matrix 90 degrees clockwise in-place.',
          'How would you detect a duplicate in an array of n+1 integers where each integer is between 1 and n?',
        ],
      };
      const questions = stageQuestions[stage] || stageQuestions['Technical'];
      const qIdx = ((questionNumber || 1) - 1) % questions.length;
      const isLast = questionNumber >= totalQuestions;

      return res.json({
        feedback: reactions[Math.floor(Math.random() * reactions.length)],
        followUpQuestion: isLast ? '' : questions[qIdx],
        closingRemark: isLast ? `Thank you so much for your time today! You've given some really thoughtful answers. We'll be in touch soon with next steps. Best of luck!` : undefined,
        score: 65 + Math.floor(Math.random() * 25),
        strengths: [
          ['Clear communication', 'Structured thinking', 'Good examples'][Math.floor(Math.random() * 3)],
          ['Technical depth', 'Problem-solving mindset', 'Practical approach'][Math.floor(Math.random() * 3)]
        ],
        improvements: [
          ['Add more specific metrics', 'Consider edge cases', 'Discuss trade-offs'][Math.floor(Math.random() * 3)],
          ['Mention real-world experience', 'Think about scalability', 'Explore alternatives'][Math.floor(Math.random() * 3)]
        ],
        interviewerReaction: ['encouraging', 'impressed', 'probing', 'neutral'][Math.floor(Math.random() * 4)],
        thinkTime: 30 + Math.floor(Math.random() * 30),
        hint: ['Think about time vs space trade-offs', 'Consider the edge cases first', 'Try working through a small example', 'What would happen at scale?'][Math.floor(Math.random() * 4)]
      });
    }

    const isLastQuestion = questionNumber >= totalQuestions;

    // Build code review context if code was submitted
    const codeContext = code ? `

## Code Submitted by Candidate
Language: ${codeLanguage || 'unknown'}
\`\`\`
${code}
\`\`\`
Evaluate this code as part of your response:
- Correctness: does it solve the problem?
- Time complexity (Big-O)
- Space complexity
- Code quality, readability, edge case handling
- Suggest an optimized version if applicable
Include your evaluation in "codeFeedback" in the JSON response.` : '';

    const adaptivePrompt = getAdaptiveDifficultyPrompt(lastScore, averageScore, cumulativeScores);

    const messages = [
      {
        role: 'system',
        content: getInterviewerPersona(company, role, stage, difficulty, questionNumber, totalQuestions) + adaptivePrompt + codeContext + `

The candidate just answered a question. You must:
1. React naturally to their answer (say something like "Makes sense", "Got it")
2. Give extremely brief, actionable feedback internally (do not speak the "feedback" block aloud)
3. ${isLastQuestion ? 'This is the LAST answer. Provide a short, warm closing compliment.' : 'Ask a follow-up that digs deeper OR moves to a new topic naturally. Keep the spoken "followUpQuestion" to 1-2 sentences MAX.'}
4. Provide score, strengths, improvements
5. Include a subtle hint for the next question
6. Suggest think time in seconds

IMPORTANT: The "followUpQuestion" and "closingRemark" must sound like a real human speaking on a Zoom call. No robotic transitions. Keep it under 3 sentences.

Respond as JSON:
{
  "feedback": "Internal evaluation of their answer (2 sentences)",
  "followUpQuestion": "${isLastQuestion ? 'empty string since this is the last question' : 'Your spoken next question (natural, casual, max 2 sentences)'}",
  ${isLastQuestion ? '"closingRemark": "A warm, natural spoken closing thanking them (max 2 sentences)",' : ''}
  "score": 0-100,
  "strengths": ["specific things done well"],
  "improvements": ["specific things to improve"],
  "interviewerReaction": "encouraging|impressed|probing|neutral|challenging",
  "thinkTime": 30-90,
  "hint": "A gentle nudge if stuck (1 sentence)",
  "difficultyLevel": "easy|medium|hard",
  "adaptiveNote": "Brief explanation of difficulty adjustment"${code ? ',\n  "codeFeedback": {"correctness": "pass|fail|partial", "timeComplexity": "O(...)", "spaceComplexity": "O(...)", "quality": 0-10, "issues": ["issue1"], "optimizedApproach": "brief suggestion"}' : ''}
}`
      },
      ...(conversationHistory || []).map(h => ({
        role: h.role === 'interviewer' ? 'assistant' : 'user',
        content: h.content
      })),
      { role: 'assistant', content: previousQuestion },
      { role: 'user', content: code ? `${userAnswer}\n\n[Code submitted in ${codeLanguage || 'unknown'}]:\n${code}` : userAnswer }
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
      hint: result.hint || 'Try breaking the problem into smaller parts',
      difficultyLevel: result.difficultyLevel || 'medium',
      adaptiveNote: result.adaptiveNote || null,
      codeFeedback: result.codeFeedback || null
    });
  } catch (error) {
    console.error('Follow-up error:', error.message?.substring(0, 200));
    // Graceful fallback — contextual follow-up
    const fallbackFollowUps = {
      'HR': 'That\'s interesting! Can you tell me about your long-term career goals? Where do you see yourself in 5 years?',
      'Behavioral': 'Good insight. Can you give me another example where you demonstrated leadership or took initiative in a difficult situation?',
      'DSA / Coding': 'Nice approach. Now, can you think of a way to optimize that solution? What would the time and space complexity be?',
      'System Design': 'Good thinking. How would your design handle 10x the current traffic? What would you scale first?',
      'Technical': 'Solid answer. Can you explain how this concept applies in a distributed systems context?',
      'OA': 'Good. Here\'s a follow-up: what if the input size was 10 million? How would you optimize?',
      'Managerial': 'Great example. How did you handle any disagreements within the team during that project?',
    };
    res.json({
      feedback: 'That\'s a thoughtful response! I can see you\'ve given this real thought.',
      followUpQuestion: fallbackFollowUps[stage] || 'Can you walk me through how you would optimize that solution? What trade-offs would you consider?',
      score: 72 + Math.floor(Math.random() * 15),
      strengths: ['Clear communication', 'Structured thinking'],
      improvements: ['Add more specific examples', 'Consider edge cases'],
      interviewerReaction: 'encouraging',
      thinkTime: 45,
      hint: 'Try breaking the problem into smaller parts'
    });
  }
});

// ─── Get a hint for current question ───
router.post('/hint', optionalAuth, async (req, res) => {
  const { company, role, stage, currentQuestion, conversationHistory } = req.body;

  try {
    if (!groq) {
      return res.json({
        hint: "Try breaking this down step by step. What's the simplest version you could solve first?",
        approach: "Consider starting with a brute force solution, then optimize.",
        keyTopics: ["Time complexity", "Space-time tradeoff", "Edge cases"]
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a helpful interviewer at ${company}. The candidate is stuck on a ${stage} question for ${role}. 
Give a gentle nudge WITHOUT giving away the answer.

Respond as JSON:
{
  "hint": "A gentle nudge (1-2 sentences)",
  "approach": "Suggested approach without the full answer",
  "keyTopics": ["Topic 1", "Topic 2", "Topic 3"]
}`
        },
        ...(conversationHistory || []).slice(-4).map(h => ({
          role: h.role === 'interviewer' ? 'assistant' : 'user',
          content: h.content
        })),
        { role: 'user', content: `I'm stuck on: "${currentQuestion}". Can you give me a hint?` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);
  } catch (error) {
    console.error('Hint error:', error.message);
    res.status(500).json({ error: 'Failed to generate hint' });
  }
});

// ─── Real-time nudge for AICopilot NudgeBar ───
router.post('/nudge', optionalAuth, async (req, res) => {
  const { currentQuestion, partialAnswer, stage, company, role } = req.body;

  try {
    if (!groq || !partialAnswer || partialAnswer.length < 20) {
      return res.json({ nudge: null });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant', // Fast model for sub-200ms response
      messages: [
        {
          role: 'system',
          content: `You are a real-time interview coach. Based on the candidate's partial answer to a ${stage} question at ${company}, give ONE brief coaching tip (max 15 words). Focus on what they should add or fix RIGHT NOW.
Respond as JSON: { "nudge": "your tip", "type": "structure|depth|confidence|filler|pace" }`
        },
        {
          role: 'user',
          content: `Question: ${currentQuestion}\nPartial answer so far: ${partialAnswer.substring(0, 500)}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 60
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);
  } catch (error) {
    console.error('Nudge error:', error.message?.substring(0, 100));
    res.json({ nudge: null });
  }
});

// ─── Evaluate overall interview session ───
router.post('/evaluate', optionalAuth, async (req, res) => {
  const { company, role, stage, conversation } = req.body;

  try {
    if (!groq) {
      return res.json({
        overallScore: 78,
        summary: 'Solid performance with room for improvement in technical depth.',
        strengths: ['Good communication', 'Structured responses', 'Clear problem-solving'],
        improvements: ['Add more technical detail', 'Use specific metrics', 'Consider edge cases'],
        recommendation: 'Practice more system design questions for this role.',
        verdictEmoji: '👍',
        verdict: 'Would Advance',
        detailedBreakdown: { technicalSkills: 75, communication: 82, problemSolving: 78, cultureFit: 80 }
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
Be honest but constructive. Reference SPECIFIC things the candidate said.

Respond as JSON:
{
  "overallScore": 0-100,
  "summary": "2-3 sentence evaluation",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Area 1", "Area 2", "Area 3"],
  "recommendation": "One practical recommendation",
  "verdict": "Strong Hire / Would Advance / Borderline / Would Not Advance",
  "verdictEmoji": "🌟 or 👍 or 🤔 or 👎",
  "detailedBreakdown": { "technicalSkills": 0-100, "communication": 0-100, "problemSolving": 0-100, "cultureFit": 0-100 }
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
    console.error('Evaluation error:', error.message);
    res.status(500).json({ error: 'Failed to evaluate interview' });
  }
});

// ─── Analyze speech for pace, fillers, clarity ───
router.post('/speech-feedback', optionalAuth, async (req, res) => {
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

    const avgWordLength = words.length > 0 ? words.reduce((a, w) => a + w.length, 0) / words.length : 0;
    let confidenceScore = 70;
    if (wpm >= 120 && wpm <= 170) confidenceScore += 10;
    if (totalFillers <= 2) confidenceScore += 10;
    if (avgWordLength > 4.5) confidenceScore += 5;
    if (wordCount > 50) confidenceScore += 5;
    confidenceScore = Math.min(100, confidenceScore);

    res.json({
      wordCount, wpm, paceAssessment, fillerCount, totalFillers,
      fillerRate: `${fillerRate}%`, clarityScore, confidenceScore,
      tips: [
        totalFillers > 3 ? `Reduce filler words (found ${totalFillers}: ${Object.keys(fillerCount).join(', ')})` : 'Great job minimizing filler words!',
        wpm < 120 ? 'Speak a bit faster to maintain engagement' : wpm > 170 ? 'Slow down slightly' : 'Your pace is great!',
        'Pause briefly between key points for emphasis',
        confidenceScore < 70 ? 'Try to sound more assertive' : 'Good confidence level!'
      ]
    });
  } catch (error) {
    console.error('Speech feedback error:', error.message);
    res.status(500).json({ error: 'Failed to analyze speech' });
  }
});

// ─── AI Copilot suggestions ───
router.post('/copilot-suggest', optionalAuth, async (req, res) => {
  const { company, role, stage, currentQuestion, partialAnswer, jobDescription } = req.body;

  try {
    if (!groq) {
      return res.json({
        starPrompts: { situation: "Provide context", task: "Describe your goal", action: "Explain steps taken", result: "Share impact" },
        keywords: ["leadership", "metrics", "scaling"],
        gapIndicators: ["Add more specific numbers"],
        strengthIndicators: ["Good problem definition"],
        structureSuggestion: "Start with the problem, then your approach, then results.",
        followUpPredictions: ["Can you elaborate on the negative impacts?"]
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert AI interview copilot helping a candidate in a ${stage} interview at ${company} for ${role}.
The candidate is currently answering this question: "${currentQuestion}".
Their partial answer so far: "${partialAnswer || '(Not started yet)'}".
Job Description context: "${jobDescription || 'Standard software engineering role'}".

Analyze their answer in real-time and provide brief, punchy suggestions to guide them.

Respond strictly in this JSON format:
{
  "starPrompts": {
    "situation": "Brief prompt to establish context (e.g. 'Set the scene with X')",
    "task": "Brief prompt for the challenge",
    "action": "Brief prompt for their specific actions",
    "result": "Brief prompt to share metrics/outcomes"
  },
  "keywords": ["keyword1", "keyword2", "technology3"],
  "gapIndicators": ["Missing metric for X", "Clarify your specific role"],
  "strengthIndicators": ["Clear problem statement", "Good use of tech stack"],
  "structureSuggestion": "1 short sentence suggesting how to structure the rest of the answer.",
  "followUpPredictions": ["Potential follow-up 1", "Potential follow-up 2"]
}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json(result);
  } catch (error) {
    console.error('Copilot suggest error:', error.message);
    res.status(500).json({ error: 'Failed to generate copilot suggestions' });
  }
});

// ─── Text-to-Speech (Orpheus TTS) ───
router.post('/tts', optionalAuth, async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    if (!groq) {
      return res.status(503).json({ error: 'AI service unavailable', fallback: true });
    }

    if (text.length > 1500) {
      return res.status(413).json({ error: 'Text too long for TTS', fallback: true });
    }

    // Primary: Orpheus (confirmed working)
    const response = await groq.audio.speech.create({
      model: 'canopylabs/orpheus-v1-english',
      input: text,
      voice: 'diana',
      response_format: 'wav',
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    if (buffer.length < 100) {
      return res.status(500).json({ error: 'TTS returned empty audio', fallback: true });
    }

    res.set({
      'Content-Type': 'audio/wav',
      'Content-Length': buffer.length,
      'Cache-Control': 'no-cache',
    });
    res.send(buffer);
  } catch (error) {
    console.error('Orpheus TTS error:', error.message?.substring(0, 200));

    // Fallback: try PlayAI
    try {
      const response = await groq.audio.speech.create({
        model: 'playai-tts',
        input: text,
        voice: 'Arista-PlayAI',
        response_format: 'wav',
      });
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length > 100) {
        res.set({ 'Content-Type': 'audio/wav', 'Content-Length': buffer.length, 'Cache-Control': 'no-cache' });
        return res.send(buffer);
      }
    } catch (fallbackErr) {
      console.error('PlayAI fallback failed:', fallbackErr.message?.substring(0, 200));
    }

    res.status(500).json({ error: 'TTS failed', fallback: true });
  }
});

// ─── Speech-to-Text (Whisper) ───
router.post('/stt', optionalAuth, upload.single('audio'), async (req, res) => {
  const filePath = req.file?.path;

  try {
    if (!groq) {
      if (filePath) fs.unlinkSync(filePath);
      return res.status(503).json({ error: 'AI service unavailable' });
    }

    if (!filePath) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const transcription = await groq.audio.transcriptions.create({
      model: 'whisper-large-v3-turbo',
      file: fs.createReadStream(filePath),
      response_format: 'json',
    });

    // Clean up temp file
    try { fs.unlinkSync(filePath); } catch {}

    res.json({
      text: transcription.text || '',
      language: transcription.language || 'en',
    });
  } catch (error) {
    console.error('STT error:', error.message);
    try { if (filePath) fs.unlinkSync(filePath); } catch {}
    res.status(500).json({ error: 'STT failed' });
  }
});

// ─── Save Interview Session ───
router.post('/save-session', optionalAuth, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(200).json({ message: 'Guest session not saved' });

  const {
    type = 'single', company, role, stage, difficulty,
    conversation, scores, overallScore, summaryData,
    speechMetrics, emotionData, proctoringViolations,
    rounds, completedAt
  } = req.body;

  try {
    const { data, error } = await supabaseAdmin
      .from('interview_sessions')
      .insert({
        user_id: userId,
        session_type: type,
        company,
        role,
        stage: type === 'multi-round' ? 'Multi-Round' : stage,
        difficulty,
        conversation: conversation || [],
        scores: scores || [],
        overall_score: overallScore || 0,
        summary_data: summaryData || {},
        speech_metrics: speechMetrics || null,
        emotion_data: emotionData || null,
        proctoring_violations: proctoringViolations || [],
        rounds: rounds || null,
        completed_at: completedAt || new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, sessionId: data.id });
  } catch (error) {
    console.error('Save session error:', error.message);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

// ─── List User's Interview Sessions ───
router.get('/sessions', authenticateToken, async (req, res) => {
  const userId = req.user?.id;
  const { limit = 20, offset = 0, company, stage } = req.query;

  try {
    let query = supabaseAdmin
      .from('interview_sessions')
      .select('id, session_type, company, role, stage, difficulty, overall_score, completed_at, created_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (company) query = query.eq('company', company);
    if (stage) query = query.eq('stage', stage);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('List sessions error:', error.message);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// ─── Get Session Detail ───
router.get('/sessions/:id', authenticateToken, async (req, res) => {
  const userId = req.user?.id;

  try {
    const { data, error } = await supabaseAdmin
      .from('interview_sessions')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Session not found' });
    res.json(data);
  } catch (error) {
    console.error('Get session error:', error.message);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// ─── Analytics Aggregation ───
router.get('/analytics', authenticateToken, async (req, res) => {
  const userId = req.user?.id;

  try {
    const { data: sessions, error } = await supabaseAdmin
      .from('interview_sessions')
      .select('overall_score, company, stage, difficulty, completed_at, scores, speech_metrics, emotion_data, proctoring_violations')
      .eq('user_id', userId)
      .order('completed_at', { ascending: true });

    if (error) throw error;

    const totalSessions = sessions?.length || 0;
    if (totalSessions === 0) {
      return res.json({
        totalSessions: 0, averageScore: 0, scoreTrend: [],
        companyBreakdown: {}, stageBreakdown: {}, recentImprovement: 0
      });
    }

    const scores = sessions.map(s => s.overall_score || 0);
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Score trend over time
    const scoreTrend = sessions.map(s => ({
      date: s.completed_at,
      score: s.overall_score || 0,
      company: s.company,
      stage: s.stage
    }));

    // Breakdown by company
    const companyBreakdown = {};
    sessions.forEach(s => {
      if (!companyBreakdown[s.company]) companyBreakdown[s.company] = { count: 0, totalScore: 0 };
      companyBreakdown[s.company].count++;
      companyBreakdown[s.company].totalScore += s.overall_score || 0;
    });
    Object.keys(companyBreakdown).forEach(k => {
      companyBreakdown[k].avgScore = Math.round(companyBreakdown[k].totalScore / companyBreakdown[k].count);
    });

    // Breakdown by stage
    const stageBreakdown = {};
    sessions.forEach(s => {
      if (!stageBreakdown[s.stage]) stageBreakdown[s.stage] = { count: 0, totalScore: 0 };
      stageBreakdown[s.stage].count++;
      stageBreakdown[s.stage].totalScore += s.overall_score || 0;
    });
    Object.keys(stageBreakdown).forEach(k => {
      stageBreakdown[k].avgScore = Math.round(stageBreakdown[k].totalScore / stageBreakdown[k].count);
    });

    // Recent improvement (last 5 vs first 5)
    const first5 = scores.slice(0, Math.min(5, scores.length));
    const last5 = scores.slice(Math.max(0, scores.length - 5));
    const recentImprovement = Math.round(
      (last5.reduce((a, b) => a + b, 0) / last5.length) -
      (first5.reduce((a, b) => a + b, 0) / first5.length)
    );

    res.json({
      totalSessions,
      averageScore,
      scoreTrend,
      companyBreakdown,
      stageBreakdown,
      recentImprovement
    });
  } catch (error) {
    console.error('Analytics error:', error.message);
    res.status(500).json({ error: 'Failed to compute analytics' });
  }
});

export default router;
