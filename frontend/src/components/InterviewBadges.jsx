import React, { useState, useEffect } from 'react';
import { Award, Flame, Target, Star, Zap, Trophy, Medal, TrendingUp } from 'lucide-react';

/**
 * InterviewBadges — Gamification system for mock interviews
 * Shows earned badges, XP, streak info, and milestone progress
 */

const BADGE_DEFS = [
    { id: 'first_session', icon: '🎯', label: 'First Step', desc: 'Complete your first interview', xp: 50, check: (s) => s.totalSessions >= 1 },
    { id: 'five_sessions', icon: '🔥', label: 'Warming Up', desc: 'Complete 5 interview sessions', xp: 150, check: (s) => s.totalSessions >= 5 },
    { id: 'ten_sessions', icon: '💪', label: 'Dedicated', desc: 'Complete 10 sessions', xp: 300, check: (s) => s.totalSessions >= 10 },
    { id: 'twenty_five', icon: '🏆', label: 'Interview Pro', desc: 'Complete 25 sessions', xp: 500, check: (s) => s.totalSessions >= 25 },
    { id: 'high_scorer', icon: '⭐', label: 'High Achiever', desc: 'Score 80+ in a session', xp: 100, check: (s) => s.highestScore >= 80 },
    { id: 'perfect_score', icon: '💎', label: 'Diamond Standard', desc: 'Score 95+ in a session', xp: 250, check: (s) => s.highestScore >= 95 },
    { id: 'streak_3', icon: '🔥', label: '3-Day Streak', desc: 'Practice 3 days in a row', xp: 100, check: (s) => s.currentStreak >= 3 },
    { id: 'streak_7', icon: '🌟', label: 'Week Warrior', desc: 'Practice 7 days in a row', xp: 250, check: (s) => s.currentStreak >= 7 },
    { id: 'no_fillers', icon: '🎤', label: 'Clean Speaker', desc: '0 filler words in an answer', xp: 75, check: (s) => s.hadZeroFillers },
    { id: 'eye_contact', icon: '👁', label: 'Eye Contact Pro', desc: '90%+ eye contact in a session', xp: 100, check: (s) => s.bestEyeContact >= 90 },
    { id: 'fast_improver', icon: '📈', label: 'Fast Improver', desc: 'Improve score by 15+ pts', xp: 125, check: (s) => s.bestImprovement >= 15 },
    { id: 'confidence_king', icon: '👑', label: 'Confidence King', desc: '90%+ confidence score', xp: 100, check: (s) => s.bestConfidence >= 90 },
];

// Calculate XP level from total XP
function getLevel(xp) {
    if (xp < 100) return { level: 1, title: 'Beginner', nextXp: 100, color: '#94a3b8' };
    if (xp < 300) return { level: 2, title: 'Apprentice', nextXp: 300, color: '#60a5fa' };
    if (xp < 600) return { level: 3, title: 'Intermediate', nextXp: 600, color: '#8b5cf6' };
    if (xp < 1000) return { level: 4, title: 'Advanced', nextXp: 1000, color: '#f59e0b' };
    if (xp < 1500) return { level: 5, title: 'Expert', nextXp: 1500, color: '#22c55e' };
    if (xp < 2200) return { level: 6, title: 'Master', nextXp: 2200, color: '#ef4444' };
    return { level: 7, title: 'Interview Titan', nextXp: 9999, color: '#e879f9' };
}

export default function InterviewBadges({ sessionStats, compact = false }) {
    const [newBadges, setNewBadges] = useState([]);

    // Get previously earned badge IDs from localStorage
    const savedBadges = JSON.parse(localStorage.getItem('preploop_badges') || '[]');
    const savedXp = parseInt(localStorage.getItem('preploop_xp') || '0', 10);
    const savedStreak = JSON.parse(localStorage.getItem('preploop_streak') || '{"count":0,"lastDate":""}');

    // Update streak
    const today = new Date().toISOString().slice(0, 10);
    let currentStreak = savedStreak.count;
    if (savedStreak.lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (savedStreak.lastDate === yesterday) {
            currentStreak = savedStreak.count + 1;
        } else if (savedStreak.lastDate !== today) {
            currentStreak = 1;
        }
        localStorage.setItem('preploop_streak', JSON.stringify({ count: currentStreak, lastDate: today }));
    }

    // Build stats object for badge checking
    const stats = {
        totalSessions: parseInt(localStorage.getItem('preploop_sessions') || '0', 10) + 1,
        highestScore: Math.max(sessionStats?.score || 0, parseInt(localStorage.getItem('preploop_best_score') || '0', 10)),
        currentStreak,
        hadZeroFillers: sessionStats?.totalFillers === 0,
        bestEyeContact: Math.max(sessionStats?.eyeContactPct || 0, parseInt(localStorage.getItem('preploop_best_eye') || '0', 10)),
        bestImprovement: sessionStats?.improvement || 0,
        bestConfidence: Math.max(sessionStats?.confidenceScore || 0, parseInt(localStorage.getItem('preploop_best_conf') || '0', 10)),
    };

    // Determine earned badges
    const earnedBadgeIds = BADGE_DEFS.filter(b => b.check(stats)).map(b => b.id);
    const justEarned = earnedBadgeIds.filter(id => !savedBadges.includes(id));
    const allEarned = [...new Set([...savedBadges, ...earnedBadgeIds])];
    const totalXp = allEarned.reduce((sum, id) => {
        const badge = BADGE_DEFS.find(b => b.id === id);
        return sum + (badge?.xp || 0);
    }, 0);
    const levelInfo = getLevel(totalXp);

    // Save updated data
    useEffect(() => {
        localStorage.setItem('preploop_badges', JSON.stringify(allEarned));
        localStorage.setItem('preploop_xp', String(totalXp));
        localStorage.setItem('preploop_sessions', String(stats.totalSessions));
        localStorage.setItem('preploop_best_score', String(stats.highestScore));
        localStorage.setItem('preploop_best_eye', String(stats.bestEyeContact));
        localStorage.setItem('preploop_best_conf', String(stats.bestConfidence));

        if (justEarned.length > 0) {
            setNewBadges(justEarned);
            setTimeout(() => setNewBadges([]), 8000);
        }
    }, []);

    if (compact) {
        return (
            <div className="ib-compact">
                <div className="ib-compact-level" style={{ borderColor: levelInfo.color }}>
                    <Trophy size={14} style={{ color: levelInfo.color }} />
                    <span>Lv.{levelInfo.level}</span>
                    <span className="ib-compact-title">{levelInfo.title}</span>
                </div>
                <div className="ib-compact-xp">
                    <Zap size={12} /> {totalXp} XP
                </div>
                {currentStreak >= 2 && (
                    <div className="ib-compact-streak">
                        <Flame size={12} /> {currentStreak}d
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="ib-card">
            <h3><Award size={16} /> Achievements & Progress</h3>

            {/* Level & XP Bar */}
            <div className="ib-level-row">
                <div className="ib-level-badge" style={{ background: `${levelInfo.color}22`, borderColor: `${levelInfo.color}44` }}>
                    <Trophy size={18} style={{ color: levelInfo.color }} />
                    <div>
                        <div className="ib-level-num" style={{ color: levelInfo.color }}>Level {levelInfo.level}</div>
                        <div className="ib-level-title">{levelInfo.title}</div>
                    </div>
                </div>
                <div className="ib-xp-info">
                    <span className="ib-xp-num"><Zap size={13} /> {totalXp} XP</span>
                    <div className="ib-xp-bar">
                        <div
                            className="ib-xp-fill"
                            style={{
                                width: `${Math.min(100, (totalXp / levelInfo.nextXp) * 100)}%`,
                                background: `linear-gradient(90deg, ${levelInfo.color}, ${levelInfo.color}88)`
                            }}
                        />
                    </div>
                    <span className="ib-xp-next">{levelInfo.nextXp - totalXp} XP to next level</span>
                </div>
            </div>

            {/* Streak */}
            {currentStreak >= 1 && (
                <div className="ib-streak">
                    <Flame size={16} className="ib-streak-icon" />
                    <span>{currentStreak}-day streak!</span>
                    {currentStreak >= 3 && <span className="ib-streak-fire">🔥🔥🔥</span>}
                </div>
            )}

            {/* New Badges Animation */}
            {newBadges.length > 0 && (
                <div className="ib-new-badges">
                    {newBadges.map(id => {
                        const badge = BADGE_DEFS.find(b => b.id === id);
                        return (
                            <div key={id} className="ib-new-badge">
                                <span className="ib-new-badge-icon">{badge.icon}</span>
                                <div>
                                    <div className="ib-new-badge-label">🎉 New Badge!</div>
                                    <div className="ib-new-badge-name">{badge.label}</div>
                                    <div className="ib-new-badge-xp">+{badge.xp} XP</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* All Badges */}
            <div className="ib-badges-grid">
                {BADGE_DEFS.map(badge => {
                    const earned = allEarned.includes(badge.id);
                    return (
                        <div key={badge.id} className={`ib-badge ${earned ? 'ib-earned' : 'ib-locked'}`} title={badge.desc}>
                            <span className="ib-badge-icon">{badge.icon}</span>
                            <span className="ib-badge-label">{badge.label}</span>
                            {earned && <span className="ib-badge-xp">+{badge.xp}</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
