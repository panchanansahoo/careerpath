import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Award, Flame, BarChart3, PieChart } from 'lucide-react';

export default function Analytics() {
    const [stats, setStats] = useState({
        problemsSolved: 127,
        totalProblems: 500,
        interviewsCompleted: 18,
        averageScore: 82,
        streak: 14,
        weeklyGoal: { current: 5, target: 7 }
    });

    const [byTopic, setByTopic] = useState([
        { name: 'Arrays & Hashing', solved: 24, total: 45, accuracy: 88 },
        { name: 'Two Pointers', solved: 15, total: 20, accuracy: 85 },
        { name: 'Sliding Window', solved: 12, total: 18, accuracy: 78 },
        { name: 'Binary Search', solved: 18, total: 25, accuracy: 90 },
        { name: 'Trees & Graphs', solved: 20, total: 40, accuracy: 72 },
        { name: 'Dynamic Programming', solved: 10, total: 35, accuracy: 65 },
        { name: 'Backtracking', solved: 8, total: 15, accuracy: 80 },
        { name: 'Stack & Queue', solved: 12, total: 18, accuracy: 83 },
        { name: 'Greedy', solved: 8, total: 12, accuracy: 75 }
    ]);

    const [weeklyProgress, setWeeklyProgress] = useState([
        { day: 'Mon', problems: 3 }, { day: 'Tue', problems: 5 },
        { day: 'Wed', problems: 2 }, { day: 'Thu', problems: 4 },
        { day: 'Fri', problems: 6 }, { day: 'Sat', problems: 1 },
        { day: 'Sun', problems: 0 }
    ]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/user/analytics', { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) {
                    const data = await res.json();
                    if (data.stats) setStats(data.stats);
                    if (data.byTopic) setByTopic(data.byTopic);
                    if (data.weeklyProgress) setWeeklyProgress(data.weeklyProgress);
                }
            } catch (err) { console.error(err); }
        };
        fetchAnalytics();
    }, []);

    const maxProblems = Math.max(...weeklyProgress.map(d => d.problems), 1);

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 30 }}>Analytics</h1>

            {/* Top Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 30 }}>
                {[
                    { label: 'Problems Solved', value: `${stats.problemsSolved}/${stats.totalProblems}`, icon: <Target size={20} />, color: 'var(--accent)', pct: Math.round(stats.problemsSolved / stats.totalProblems * 100) },
                    { label: 'Interviews Done', value: stats.interviewsCompleted, icon: <BarChart3 size={20} />, color: '#f472b6' },
                    { label: 'Avg. Score', value: `${stats.averageScore}%`, icon: <TrendingUp size={20} />, color: '#34d399' },
                    { label: 'Day Streak', value: `${stats.streak} 🔥`, icon: <Flame size={20} />, color: '#fbbf24' }
                ].map((s, i) => (
                    <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 14, padding: 20, border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</span>
                            <span style={{ color: s.color }}>{s.icon}</span>
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
                        {s.pct !== undefined && (
                            <div style={{ marginTop: 8, height: 4, background: 'var(--border)', borderRadius: 2 }}>
                                <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 2 }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
                {/* Weekly Progress */}
                <div style={{ background: 'var(--bg-card)', borderRadius: 14, padding: 24, border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: 16, marginBottom: 20 }}>Weekly Progress</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140 }}>
                        {weeklyProgress.map((d, i) => (
                            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{
                                    height: `${(d.problems / maxProblems) * 100}px`,
                                    minHeight: d.problems > 0 ? 8 : 2,
                                    background: d.problems > 0 ? 'linear-gradient(135deg, #6c5ce7, #a855f7)' : 'var(--border)',
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'height 0.3s',
                                    marginBottom: 8
                                }} />
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.day}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 13 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Weekly Goal</span>
                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{stats.weeklyGoal.current}/{stats.weeklyGoal.target}</span>
                    </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div style={{ background: 'var(--bg-card)', borderRadius: 14, padding: 24, border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: 16, marginBottom: 20 }}>Strengths & Weaknesses</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[...byTopic].sort((a, b) => b.accuracy - a.accuracy).slice(0, 5).map((t, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)', width: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                                <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3 }}>
                                    <div style={{
                                        height: '100%', borderRadius: 3, width: `${t.accuracy}%`,
                                        background: t.accuracy >= 80 ? 'var(--green)' : t.accuracy >= 70 ? 'var(--yellow)' : 'var(--red)'
                                    }} />
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 600, width: 36, textAlign: 'right', color: t.accuracy >= 80 ? 'var(--green)' : t.accuracy >= 70 ? 'var(--yellow)' : 'var(--red)' }}>
                                    {t.accuracy}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Topic Breakdown */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 14, padding: 24, border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 16, marginBottom: 20 }}>Progress by Topic</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {byTopic.map((t, i) => (
                        <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: 14 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</span>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.solved}/{t.total}</span>
                            </div>
                            <div style={{ height: 4, background: 'var(--border)', borderRadius: 2 }}>
                                <div style={{ height: '100%', width: `${(t.solved / t.total) * 100}%`, background: 'var(--accent)', borderRadius: 2 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
