import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'preploop_weekly_goals';

function getWeekKey() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNum}`;
}

function getInitialGoals(weeklyData) {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.week === getWeekKey()) {
                // Update done counts from DB data if available
                if (weeklyData) {
                    parsed.items = parsed.items.map(item => {
                        if (item.label === 'Easy problems') return { ...item, done: weeklyData.easy || 0 };
                        if (item.label === 'Medium problems') return { ...item, done: weeklyData.medium || 0 };
                        if (item.label === 'Hard problems') return { ...item, done: weeklyData.hard || 0 };
                        return item;
                    });
                }
                return parsed;
            }
        }
    } catch { }

    return {
        week: getWeekKey(), target: 15, completed: 0, items: [
            { label: 'Easy problems', target: 5, done: weeklyData?.easy || 0 },
            { label: 'Medium problems', target: 7, done: weeklyData?.medium || 0 },
            { label: 'Hard problems', target: 3, done: weeklyData?.hard || 0 },
        ]
    };
}

export default function WeeklyGoals({ weeklyData }) {
    const [goals, setGoals] = useState(() => getInitialGoals(weeklyData));

    // Sync done counts when weeklyData changes from DB
    useEffect(() => {
        if (weeklyData) {
            setGoals(prev => ({
                ...prev,
                items: prev.items.map(item => {
                    if (item.label === 'Easy problems') return { ...item, done: weeklyData.easy || 0 };
                    if (item.label === 'Medium problems') return { ...item, done: weeklyData.medium || 0 };
                    if (item.label === 'Hard problems') return { ...item, done: weeklyData.hard || 0 };
                    return item;
                })
            }));
        }
    }, [weeklyData]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    }, [goals]);

    const totalDone = goals.items.reduce((s, i) => s + i.done, 0);
    const totalTarget = goals.items.reduce((s, i) => s + i.target, 0);
    const pct = totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0;

    // SVG ring
    const size = 90, stroke = 7, radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px',
        }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                🎯 Weekly Goals
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 18 }}>Track your weekly progress</div>

            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                {/* Progress Ring */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
                        <circle cx={size / 2} cy={size / 2} r={radius}
                            stroke={pct >= 100 ? '#22c55e' : '#a78bfa'}
                            strokeWidth={stroke} fill="none"
                            strokeDasharray={circumference} strokeDashoffset={offset}
                            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                        />
                    </svg>
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: pct >= 100 ? '#22c55e' : '#fff', lineHeight: 1 }}>{pct}%</div>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2, fontWeight: 600 }}>{totalDone}/{totalTarget}</div>
                    </div>
                </div>

                {/* Goal Items */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {goals.items.map((item, idx) => {
                        const itemPct = item.target > 0 ? (item.done / item.target) * 100 : 0;
                        const colors = ['#22c55e', '#f59e0b', '#ef4444'];
                        return (
                            <div key={idx}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{item.label}</span>
                                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{item.done}/{item.target}</span>
                                </div>
                                <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${Math.min(itemPct, 100)}%`, height: '100%', borderRadius: 3,
                                        background: colors[idx], transition: 'width 0.4s ease',
                                    }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
