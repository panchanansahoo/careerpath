import React from 'react';
import { Inbox } from 'lucide-react';

export default function TopicProgress({ topics }) {
    const items = topics || [];

    if (items.length === 0) {
        return (
            <div style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px',
            }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
                    📊 Topic Progress
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 18 }}>DSA roadmap completion</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', gap: 8 }}>
                    <Inbox size={28} style={{ color: 'rgba(255,255,255,0.12)' }} />
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                        No topic progress yet. Start solving problems to track your progress!
                    </div>
                </div>
            </div>
        );
    }

    const totalSolved = items.reduce((s, t) => s + t.solved, 0);
    const totalProblems = items.reduce((s, t) => s + t.total, 0);

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
                {items.map((topic, i) => {
                    const pct = topic.total > 0 ? Math.round((topic.solved / topic.total) * 100) : 0;
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
