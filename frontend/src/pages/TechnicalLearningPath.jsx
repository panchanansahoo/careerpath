import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Database, Network, BookOpen, Layers, Cpu, Code2, ChevronRight, Zap } from 'lucide-react';
import { TECHNICAL_STAGES, TECHNICAL_TOPICS, getTechnicalTopicIds, getTechnicalTopicsByStage } from '../data/technicalLearningPathData';
import { getTechnicalTopicProgress, getTechOverallProgress } from '../data/technicalLearningProgress';

// Technical 'Radar' or 'Blueprint' styling components
function MasteryNode({ percent }) {
    return (
        <div style={{
            width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
            border: `2px solid ${percent >= 100 ? '#34d399' : percent > 0 ? '#818cf8' : 'rgba(255,255,255,0.1)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: percent > 0 ? `0 0 15px ${percent >= 100 ? 'rgba(52,211,153,0.3)' : 'rgba(129,140,248,0.3)'}` : 'none'
        }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: percent >= 100 ? '#34d399' : '#fff' }}>
                {percent}%
            </span>
        </div>
    );
}

function BlueprintCard({ topic, onClick }) {
    const progress = getTechnicalTopicProgress(topic.id);

    return (
        <div onClick={onClick} style={{
            background: 'linear-gradient(145deg, rgba(20,20,25,0.9), rgba(10,10,15,0.9))',
            border: `1px solid ${topic.color}40`,
            borderRadius: 16, padding: '24px', cursor: 'pointer',
            transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
            backgroundImage: `radial-gradient(${topic.color}10 1px, transparent 1px)`,
            backgroundSize: '20px 20px' // Blueprint effect
        }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 10px 30px ${topic.color}20`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10, background: `${topic.color}20`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                    }}>
                        {topic.icon}
                    </div>
                    <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#fff' }}>{topic.title}</h3>
                        <div style={{ fontSize: 12, color: topic.color, marginTop: 4, fontWeight: 600 }}>{topic.difficulty} • {topic.estimatedTime}</div>
                    </div>
                </div>
                <MasteryNode percent={progress.masteryPercent} />
            </div>

            <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.6, marginBottom: 20 }}>{topic.description}</p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, color: '#d4d4d8' }}>
                    {topic.flashcards.length} Flashcards
                </div>
                <div style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 6, color: '#d4d4d8' }}>
                    {topic.scenarios.length} Scenarios
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: 20, right: 20, color: topic.color }}>
                <ChevronRight size={20} />
            </div>
        </div>
    );
}

export default function TechnicalLearningPath() {
    const navigate = useNavigate();
    const topicIds = useMemo(() => getTechnicalTopicIds(), []);
    const overall = useMemo(() => getTechOverallProgress(topicIds), []);

    return (
        <div style={{
            minHeight: '100vh', background: '#050505', color: '#fff', paddingBottom: 80,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px'
        }}>

            {/* Hero Section */}
            <section style={{ padding: '60px 24px 40px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99,
                    background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', fontSize: 13, color: '#6ee7b7', marginBottom: 24
                }}>
                    <Server size={14} /> The Tech Blueprint
                </div>
                <h1 style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 16, letterSpacing: '-0.02em' }}>
                    System Design & <br />
                    <span style={{ color: '#34d399' }}>Core Fundamentals</span>
                </h1>
                <p style={{ fontSize: 16, color: '#a1a1aa', maxWidth: 650, margin: '0 auto 40px', lineHeight: 1.6 }}>
                    Master the architecture of modern applications. Dive into OS, Databases, Networking, and real-world System Design scenarios.
                </p>

                {/* Overall Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, maxWidth: 600, margin: '0 auto' }}>
                    <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '20px' }}>
                        <div style={{ fontSize: 32, fontWeight: 700, color: '#34d399' }}>{overall.avgMastery}%</div>
                        <div style={{ fontSize: 12, color: '#a1a1aa', marginTop: 4 }}>Architecture Mastery</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '20px' }}>
                        <div style={{ fontSize: 32, fontWeight: 700, color: '#818cf8' }}>{overall.topicsMastered}/{TECHNICAL_TOPICS.length}</div>
                        <div style={{ fontSize: 12, color: '#a1a1aa', marginTop: 4 }}>Modules Completed</div>
                    </div>
                </div>
            </section>

            {/* Stages / Modules */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                {TECHNICAL_STAGES.map((stage) => {
                    const topics = getTechnicalTopicsByStage(stage.id);
                    if (topics.length === 0) return null;
                    return (
                        <div key={stage.id} style={{ marginBottom: 48 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 12, borderBottom: `1px solid ${stage.color}40` }}>
                                <span style={{ fontSize: 24 }}>{stage.icon}</span>
                                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>{stage.name}</h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                                {topics.map(topic => (
                                    <BlueprintCard
                                        key={topic.id}
                                        topic={topic}
                                        onClick={() => navigate(`/technical-path/${topic.id}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
}
