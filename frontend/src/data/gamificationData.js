import {
  Flame, Zap, Target, Trophy, Star, Crown, Shield, Swords,
  Bug, Moon, Clock, Rocket, Brain, Heart, Diamond, Medal,
  Award, Sparkles, Lightbulb, Code, Timer, Users, Eye, Compass
} from 'lucide-react';

// ─── XP Values ───
export const XP_VALUES = {
  SOLVE_EASY: 10,
  SOLVE_MEDIUM: 25,
  SOLVE_HARD: 50,
  DAILY_STREAK: 5,
  DAILY_CHALLENGE: 15,
  FIRST_ATTEMPT_SOLVE: 10, // bonus
  SPEED_SOLVE: 8,          // bonus for < 5 min
  HELP_OTHERS: 3,          // community answer
  POST_SOLUTION: 5,
  COMPLETE_PATTERN: 30,
  COMPANY_PREP_SOLVE: 8,
  AI_INTERVIEW_COMPLETE: 25,
  VOICE_PRACTICE: 15,
  FEED_ENGAGE: 5,
};

// ─── Level Thresholds ───
export const LEVELS = [
  { name: 'Novice',        minXP: 0,     icon: '🌱', color: '#6ee7b7', gradient: 'from-emerald-500 to-emerald-700' },
  { name: 'Apprentice',    minXP: 100,   icon: '⚡', color: '#93c5fd', gradient: 'from-blue-400 to-blue-600' },
  { name: 'Intermediate',  minXP: 350,   icon: '🔥', color: '#fbbf24', gradient: 'from-yellow-400 to-amber-600' },
  { name: 'Advanced',      minXP: 800,   icon: '💎', color: '#a78bfa', gradient: 'from-violet-400 to-purple-600' },
  { name: 'Expert',        minXP: 1800,  icon: '🏆', color: '#f472b6', gradient: 'from-pink-400 to-rose-600' },
  { name: 'Master',        minXP: 4000,  icon: '👑', color: '#fcd34d', gradient: 'from-yellow-300 to-orange-500' },
  { name: 'Grandmaster',   minXP: 8000,  icon: '🌟', color: '#e879f9', gradient: 'from-fuchsia-400 to-purple-700' },
  { name: 'Legend',        minXP: 15000, icon: '🔱', color: '#67e8f9', gradient: 'from-cyan-300 to-blue-600' },
];

export function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return { ...LEVELS[i], index: i };
  }
  return { ...LEVELS[0], index: 0 };
}

export function getLevelProgress(xp) {
  const current = getLevel(xp);
  const nextIndex = current.index + 1;
  if (nextIndex >= LEVELS.length) return { progress: 100, xpToNext: 0, nextLevel: null };
  const next = LEVELS[nextIndex];
  const range = next.minXP - current.minXP;
  const gained = xp - current.minXP;
  return {
    progress: Math.min(100, Math.round((gained / range) * 100)),
    xpToNext: next.minXP - xp,
    nextLevel: next,
  };
}

// ─── Badge Definitions ───
export const BADGES = [
  // Milestone badges
  { id: 'first_blood',       name: 'First Blood',       desc: 'Solve your first problem',            icon: Target,    tier: 'bronze',   condition: { type: 'problems_solved', count: 1 } },
  { id: 'ten_down',          name: 'Ten Down',           desc: 'Solve 10 problems',                   icon: Star,      tier: 'bronze',   condition: { type: 'problems_solved', count: 10 } },
  { id: 'half_century',      name: 'Half Century',       desc: 'Solve 50 problems',                   icon: Trophy,    tier: 'silver',   condition: { type: 'problems_solved', count: 50 } },
  { id: 'centurion',         name: 'Centurion',          desc: 'Solve 100 problems',                  icon: Crown,     tier: 'gold',     condition: { type: 'problems_solved', count: 100 } },
  { id: 'problem_machine',   name: 'Problem Machine',    desc: 'Solve 250 problems',                  icon: Rocket,    tier: 'platinum', condition: { type: 'problems_solved', count: 250 } },
  { id: 'legendary_solver',  name: 'Legendary Solver',   desc: 'Solve 500 problems',                  icon: Diamond,   tier: 'diamond',  condition: { type: 'problems_solved', count: 500 } },

  // Streak badges
  { id: 'week_warrior',      name: 'Week Warrior',       desc: '7-day solving streak',                icon: Flame,     tier: 'bronze',   condition: { type: 'streak', count: 7 } },
  { id: 'fortnight_fire',    name: 'Fortnight Fire',     desc: '14-day solving streak',               icon: Flame,     tier: 'silver',   condition: { type: 'streak', count: 14 } },
  { id: 'month_master',      name: 'Month Master',       desc: '30-day solving streak',               icon: Flame,     tier: 'gold',     condition: { type: 'streak', count: 30 } },
  { id: 'streak_legend',     name: 'Streak Legend',       desc: '100-day solving streak',              icon: Flame,     tier: 'diamond',  condition: { type: 'streak', count: 100 } },

  // Difficulty badges
  { id: 'easy_peasy',        name: 'Easy Peasy',         desc: 'Solve 20 Easy problems',              icon: Zap,       tier: 'bronze',   condition: { type: 'difficulty', difficulty: 'Easy', count: 20 } },
  { id: 'medium_rare',       name: 'Medium Rare',        desc: 'Solve 20 Medium problems',            icon: Shield,    tier: 'silver',   condition: { type: 'difficulty', difficulty: 'Medium', count: 20 } },
  { id: 'hard_core',         name: 'Hard Core',          desc: 'Solve 10 Hard problems',              icon: Swords,    tier: 'gold',     condition: { type: 'difficulty', difficulty: 'Hard', count: 10 } },

  // Special badges
  { id: 'speed_demon',       name: 'Speed Demon',        desc: 'Solve a problem in under 5 minutes',  icon: Timer,     tier: 'silver',   condition: { type: 'speed_solve', minutes: 5 } },
  { id: 'night_owl',         name: 'Night Owl',          desc: 'Solve a problem between 12-4 AM',     icon: Moon,      tier: 'bronze',   condition: { type: 'time_range', start: 0, end: 4 } },
  { id: 'early_bird',        name: 'Early Bird',         desc: 'Solve a problem between 5-7 AM',      icon: Sparkles,  tier: 'bronze',   condition: { type: 'time_range', start: 5, end: 7 } },
  { id: 'perfectionist',     name: 'Perfectionist',      desc: 'Optimal solution on first try',       icon: Award,     tier: 'gold',     condition: { type: 'first_try_optimal' } },
  { id: 'bug_hunter',        name: 'Bug Hunter',         desc: '10+ submissions before solving',      icon: Bug,       tier: 'bronze',   condition: { type: 'submissions_before_solve', count: 10 } },
  { id: 'code_reviewer',     name: 'Code Reviewer',      desc: 'Help 10 people in community',         icon: Users,     tier: 'silver',   condition: { type: 'community_helps', count: 10 } },

  // Pattern mastery badges
  { id: 'array_ace',         name: 'Array Ace',          desc: 'Complete all Array pattern problems',  icon: Code,      tier: 'gold',     condition: { type: 'pattern_complete', pattern: 'arrays' } },
  { id: 'tree_tamer',        name: 'Tree Tamer',         desc: 'Complete all Tree pattern problems',   icon: Brain,     tier: 'gold',     condition: { type: 'pattern_complete', pattern: 'trees' } },
  { id: 'graph_guru',        name: 'Graph Guru',         desc: 'Complete all Graph pattern problems',  icon: Compass,   tier: 'gold',     condition: { type: 'pattern_complete', pattern: 'graphs' } },
  { id: 'dp_dynamo',         name: 'DP Dynamo',          desc: 'Complete all DP pattern problems',     icon: Lightbulb, tier: 'platinum', condition: { type: 'pattern_complete', pattern: 'dp' } },

  // XP-based badges
  { id: 'xp_100',            name: 'Rising Star',        desc: 'Earn 100 XP',                         icon: Star,      tier: 'bronze',   condition: { type: 'xp_earned', count: 100 } },
  { id: 'xp_500',            name: 'Shining Bright',     desc: 'Earn 500 XP',                         icon: Star,      tier: 'silver',   condition: { type: 'xp_earned', count: 500 } },
  { id: 'xp_2000',           name: 'Supernova',          desc: 'Earn 2000 XP',                        icon: Star,      tier: 'gold',     condition: { type: 'xp_earned', count: 2000 } },
  { id: 'xp_5000',           name: 'Cosmic Force',       desc: 'Earn 5000 XP',                        icon: Star,      tier: 'platinum', condition: { type: 'xp_earned', count: 5000 } },

  // Daily challenge badges
  { id: 'daily_5',           name: 'Regular',            desc: 'Complete 5 daily challenges',          icon: Clock,     tier: 'bronze',   condition: { type: 'daily_challenges', count: 5 } },
  { id: 'daily_30',          name: 'Dedicated',          desc: 'Complete 30 daily challenges',         icon: Heart,     tier: 'silver',   condition: { type: 'daily_challenges', count: 30 } },
  { id: 'daily_100',         name: 'Unstoppable',        desc: 'Complete 100 daily challenges',        icon: Medal,     tier: 'gold',     condition: { type: 'daily_challenges', count: 100 } },

  // Company Prep badges
  { id: 'company_explorer',   name: 'Company Explorer',   desc: 'Attempt questions from 5 companies',   icon: Compass,   tier: 'bronze',   condition: { type: 'company_prep', count: 5 } },
  { id: 'company_master',     name: 'Company Master',     desc: 'Solve 20 questions from one company',  icon: Crown,     tier: 'gold',     condition: { type: 'company_prep', count: 20 } },
  { id: 'interview_ace',      name: 'Interview Ace',      desc: 'Complete 10 AI mock interviews',       icon: Star,      tier: 'silver',   condition: { type: 'ai_interview', count: 10 } },
  { id: 'voice_pioneer',      name: 'Voice Pioneer',      desc: 'Complete 5 voice practice sessions',   icon: Rocket,    tier: 'bronze',   condition: { type: 'voice_practice', count: 5 } },
  { id: 'prep_machine',       name: 'Prep Machine',       desc: 'Solve 50 company prep questions',      icon: Zap,       tier: 'platinum', condition: { type: 'company_prep', count: 50 } },
];

export const BADGE_TIERS = {
  bronze:   { label: 'Bronze',   color: '#CD7F32', glow: 'rgba(205,127,50,0.4)' },
  silver:   { label: 'Silver',   color: '#C0C0C0', glow: 'rgba(192,192,192,0.4)' },
  gold:     { label: 'Gold',     color: '#FFD700', glow: 'rgba(255,215,0,0.4)' },
  platinum: { label: 'Platinum', color: '#E5E4E2', glow: 'rgba(229,228,226,0.5)' },
  diamond:  { label: 'Diamond',  color: '#B9F2FF', glow: 'rgba(185,242,255,0.5)' },
};

// ─── Mock Leaderboard Data ───
export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'AlgoKing',      xp: 12450, level: 'Legend',       avatar: '👑', streak: 87,  solved: 482 },
  { rank: 2, name: 'CodeNinja',     xp: 9800,  level: 'Grandmaster',  avatar: '🥷', streak: 52,  solved: 391 },
  { rank: 3, name: 'ByteWizard',    xp: 8200,  level: 'Grandmaster',  avatar: '🧙', streak: 41,  solved: 328 },
  { rank: 4, name: 'DSAQueen',      xp: 6300,  level: 'Master',       avatar: '👸', streak: 33,  solved: 264 },
  { rank: 5, name: 'RecursionPro',  xp: 5100,  level: 'Master',       avatar: '🔄', streak: 28,  solved: 215 },
  { rank: 6, name: 'GraphTraverser',xp: 4200,  level: 'Master',       avatar: '🌐', streak: 22,  solved: 189 },
  { rank: 7, name: 'StackOverflow', xp: 3600,  level: 'Expert',       avatar: '📚', streak: 19,  solved: 156 },
  { rank: 8, name: 'BinaryBeast',   xp: 2900,  level: 'Expert',       avatar: '🐉', streak: 15,  solved: 132 },
  { rank: 9, name: 'HeapMaster',    xp: 2100,  level: 'Expert',       avatar: '🏔️', streak: 11,  solved: 98 },
  { rank: 10, name: 'LinkedLister', xp: 1500,  level: 'Advanced',     avatar: '🔗', streak: 8,   solved: 72 },
];
