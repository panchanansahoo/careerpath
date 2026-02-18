import { useState, useEffect, useCallback } from 'react';
import { XP_VALUES, BADGES, getLevel, getLevelProgress } from '../data/gamificationData';

const STORAGE_KEY = 'careerloop_gamification';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function defaultState() {
  return {
    totalXP: 0,
    problemsSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    currentStreak: 0,
    bestStreak: 0,
    streakFreezes: 1,
    lastActivityDate: null,
    earnedBadges: [],
    dailyChallengesCompleted: 0,
    communityHelps: 0,
    activityHistory: {}, // { 'YYYY-MM-DD': { solved: N, xp: N } }
    xpLog: [], // [{ action, xp, timestamp }]
  };
}

export function useGamification() {
  const [state, setState] = useState(() => loadState() || defaultState());
  const [notification, setNotification] = useState(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const level = getLevel(state.totalXP);
  const levelProgress = getLevelProgress(state.totalXP);

  // Check for new badges
  const checkBadges = useCallback((newState) => {
    const newBadges = [];
    for (const badge of BADGES) {
      if (newState.earnedBadges.includes(badge.id)) continue;
      const c = badge.condition;
      let earned = false;
      switch (c.type) {
        case 'problems_solved':
          earned = newState.problemsSolved >= c.count;
          break;
        case 'streak':
          earned = newState.currentStreak >= c.count || newState.bestStreak >= c.count;
          break;
        case 'difficulty':
          if (c.difficulty === 'Easy') earned = newState.easySolved >= c.count;
          if (c.difficulty === 'Medium') earned = newState.mediumSolved >= c.count;
          if (c.difficulty === 'Hard') earned = newState.hardSolved >= c.count;
          break;
        case 'xp_earned':
          earned = newState.totalXP >= c.count;
          break;
        case 'daily_challenges':
          earned = newState.dailyChallengesCompleted >= c.count;
          break;
        case 'community_helps':
          earned = newState.communityHelps >= c.count;
          break;
        case 'time_range': {
          const hour = new Date().getHours();
          earned = hour >= c.start && hour < c.end;
          break;
        }
        default:
          break;
      }
      if (earned) newBadges.push(badge.id);
    }
    return newBadges;
  }, []);

  // Award XP
  const awardXP = useCallback((action, extraXP = 0) => {
    const xpAmount = (XP_VALUES[action] || 0) + extraXP;
    if (xpAmount === 0) return;

    setState(prev => {
      const today = new Date().toISOString().split('T')[0];
      const todayActivity = prev.activityHistory[today] || { solved: 0, xp: 0 };
      const newState = {
        ...prev,
        totalXP: prev.totalXP + xpAmount,
        activityHistory: {
          ...prev.activityHistory,
          [today]: { ...todayActivity, xp: todayActivity.xp + xpAmount }
        },
        xpLog: [...prev.xpLog.slice(-99), { action, xp: xpAmount, timestamp: Date.now() }],
      };

      // Check for new badges
      const newBadgeIds = checkBadges(newState);
      if (newBadgeIds.length > 0) {
        newState.earnedBadges = [...new Set([...newState.earnedBadges, ...newBadgeIds])];
        const badge = BADGES.find(b => b.id === newBadgeIds[0]);
        setNotification({ type: 'badge', badge, xp: xpAmount });
      } else {
        setNotification({ type: 'xp', xp: xpAmount, action });
      }

      // Check for level up
      const prevLevel = getLevel(prev.totalXP);
      const newLevel = getLevel(newState.totalXP);
      if (newLevel.index > prevLevel.index) {
        setNotification({ type: 'levelup', level: newLevel, xp: xpAmount });
      }

      return newState;
    });
  }, [checkBadges]);

  // Record problem solved
  const recordSolve = useCallback((difficulty, timeMinutes) => {
    setState(prev => {
      const today = new Date().toISOString().split('T')[0];
      const lastDate = prev.lastActivityDate;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      let newStreak = prev.currentStreak;
      if (lastDate === today) {
        // already active today
      } else if (lastDate === yesterday) {
        newStreak += 1;
      } else if (lastDate !== today) {
        newStreak = 1;
      }

      const todayAct = prev.activityHistory[today] || { solved: 0, xp: 0 };
      const diffKey = difficulty === 'Easy' ? 'easySolved' : difficulty === 'Medium' ? 'mediumSolved' : 'hardSolved';
      const xpKey = difficulty === 'Easy' ? 'SOLVE_EASY' : difficulty === 'Medium' ? 'SOLVE_MEDIUM' : 'SOLVE_HARD';
      let xp = XP_VALUES[xpKey];
      if (timeMinutes && timeMinutes < 5) xp += XP_VALUES.SPEED_SOLVE;
      xp += XP_VALUES.DAILY_STREAK;

      const newState = {
        ...prev,
        totalXP: prev.totalXP + xp,
        problemsSolved: prev.problemsSolved + 1,
        [diffKey]: prev[diffKey] + 1,
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        lastActivityDate: today,
        activityHistory: {
          ...prev.activityHistory,
          [today]: { solved: todayAct.solved + 1, xp: todayAct.xp + xp }
        },
        xpLog: [...prev.xpLog.slice(-99), { action: `SOLVE_${difficulty.toUpperCase()}`, xp, timestamp: Date.now() }],
      };

      const newBadgeIds = checkBadges(newState);
      if (newBadgeIds.length > 0) {
        newState.earnedBadges = [...new Set([...newState.earnedBadges, ...newBadgeIds])];
        const badge = BADGES.find(b => b.id === newBadgeIds[0]);
        setNotification({ type: 'badge', badge, xp });
      } else {
        setNotification({ type: 'xp', xp, action: `Solved ${difficulty} problem` });
      }

      const prevLevel = getLevel(prev.totalXP);
      const newLevel = getLevel(newState.totalXP);
      if (newLevel.index > prevLevel.index) {
        setNotification({ type: 'levelup', level: newLevel, xp });
      }

      return newState;
    });
  }, [checkBadges]);

  // Use streak freeze
  const useStreakFreeze = useCallback(() => {
    setState(prev => {
      if (prev.streakFreezes <= 0) return prev;
      return { ...prev, streakFreezes: prev.streakFreezes - 1, lastActivityDate: new Date().toISOString().split('T')[0] };
    });
  }, []);

  // Complete daily challenge
  const completeDailyChallenge = useCallback(() => {
    setState(prev => ({
      ...prev,
      dailyChallengesCompleted: prev.dailyChallengesCompleted + 1,
    }));
    awardXP('DAILY_CHALLENGE');
  }, [awardXP]);

  // Dismiss notification
  const dismissNotification = useCallback(() => setNotification(null), []);

  return {
    ...state,
    level,
    levelProgress,
    notification,
    awardXP,
    recordSolve,
    useStreakFreeze,
    completeDailyChallenge,
    dismissNotification,
  };
}
