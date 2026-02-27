import React from 'react';

const topics = [
    { name: 'Arrays & Hashing', solved: 18, total: 30, color: '#a78bfa' },
    { name: 'Two Pointers', solved: 12, total: 20, color: '#38bdf8' },
    { name: 'Sliding Window', solved: 8, total: 15, color: '#22c55e' },
    { name: 'Stack', solved: 10, total: 18, color: '#f59e0b' },
    { name: 'Binary Search', solved: 6, total: 20, color: '#fb923c' },
    { name: 'Linked List', solved: 9, total: 15, color: '#ec4899' },
    { name: 'Trees', solved: 14, total: 25, color: '#14b8a6' },
    { name: 'Dynamic Programming', solved: 5, total: 30, color: '#ef4444' },
    { name: 'Graphs', solved: 7, total: 22, color: '#8b5cf6' },
    { name: 'Backtracking', solved: 3, total: 12, color: '#06b6d4' },
];

export default function TopicProgress() {
    const totalSolved = topics.reduce((s, t) => s + t.solved, 0);
    const totalProblems = topics.reduce((s, t) => s + t.total, 0);

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
                        📊 Topic Progress
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>DSA roadmap completion</div>
                </div>
                <div style={{
                    padding: '4px 12px', borderRadius: 99, background: 'rgba(139, 92, 246, 0.12)',
                    color: '#a78bfa', fontSize: 12, fontWeight: 700,
                }}>
                    {totalSolved}/{totalProblems}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {topics.map((topic, i) => {
                    const pct = Math.round((topic.solved / topic.total) * 100);
                    return (
                        <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: topic.color, display: 'inline-block', flexShrink: 0 }} />
                                    {topic.name}
                                </span>
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                                    {topic.solved}/{topic.total} · {pct}%
                                </span>
                            </div>
                            <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${pct}%`, height: '100%', borderRadius: 3,
                                    background: `linear-gradient(90deg, ${topic.color}, ${topic.color}dd)`,
                                    transition: 'width 0.6s ease',
                                }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
