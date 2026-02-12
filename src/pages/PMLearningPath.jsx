import React, { useState } from 'react';
import {
    CheckCircle, Circle, BookOpen, Clock, Target, TrendingUp,
    ChevronRight, ChevronDown, Lightbulb, Users, BarChart3,
    Pencil, Megaphone, Workflow, Layers, Rocket
} from 'lucide-react';

const modules = [
    {
        id: 'pm-foundations',
        title: 'Product Thinking & Frameworks',
        icon: <Lightbulb size={20} />,
        color: '#f97316',
        duration: '2 weeks',
        problems: 15,
        topics: ['Product Sense', 'North Star Metrics', 'User Empathy', 'RICE Framework', 'Jobs-to-Be-Done', 'First Principles'],
        lessons: [
            { title: 'What Makes a Great Product Manager', type: 'theory', done: true },
            { title: 'Product Sense Frameworks (CIRCLES, AARRR)', type: 'theory', done: true },
            { title: 'Defining North Star Metrics', type: 'practice', done: true },
            { title: 'User Research & Empathy Maps', type: 'practice', done: false },
            { title: 'Product Tear-Down Exercise', type: 'project', done: false }
        ]
    },
    {
        id: 'product-strategy',
        title: 'Product Strategy & Roadmaps',
        icon: <Workflow size={20} />,
        color: '#6c5ce7',
        duration: '2 weeks',
        problems: 12,
        topics: ['Vision & Strategy', 'Roadmap Planning', 'OKRs', 'Prioritization', 'Competitive Analysis', 'Go-to-Market'],
        lessons: [
            { title: 'Building Product Vision & Strategy', type: 'theory', done: true },
            { title: 'Prioritization: RICE, ICE, MoSCoW', type: 'practice', done: false },
            { title: 'Roadmap Building & Communication', type: 'practice', done: false },
            { title: 'Go-to-Market Strategy', type: 'theory', done: false },
            { title: 'Strategy Case Study: Launch a Feature', type: 'project', done: false }
        ]
    },
    {
        id: 'product-design',
        title: 'Product Design & UX',
        icon: <Pencil size={20} />,
        color: '#e84393',
        duration: '1.5 weeks',
        problems: 10,
        topics: ['UX Principles', 'Wireframing', 'User Flows', 'Design Critique', 'Accessibility', 'A/B Testing Design'],
        lessons: [
            { title: 'UX Fundamentals for PMs', type: 'theory', done: false },
            { title: 'Wireframing & User Flow Design', type: 'practice', done: false },
            { title: 'Design Critique Framework', type: 'practice', done: false },
            { title: 'Redesign a Product Feature', type: 'project', done: false }
        ]
    },
    {
        id: 'pm-analytics',
        title: 'Product Analytics & Metrics',
        icon: <BarChart3 size={20} />,
        color: '#00b894',
        duration: '2 weeks',
        problems: 18,
        topics: ['Metrics Design', 'Funnel Analysis', 'Cohort Analysis', 'Experimentation', 'SQL for PMs', 'Data-Driven Decisions'],
        lessons: [
            { title: 'Defining Success Metrics', type: 'theory', done: false },
            { title: 'Funnel & Cohort Analysis', type: 'practice', done: false },
            { title: 'A/B Testing & Experimentation', type: 'practice', done: false },
            { title: 'SQL Queries for Product Insights', type: 'practice', done: false },
            { title: 'Metrics Dashboard Design', type: 'project', done: false }
        ]
    },
    {
        id: 'pm-execution',
        title: 'Execution & Technical Skills',
        icon: <Layers size={20} />,
        color: '#0984e3',
        duration: '1.5 weeks',
        problems: 10,
        topics: ['Agile & Scrum', 'Sprint Planning', 'PRDs & Specs', 'API Basics', 'System Design for PMs', 'Cross-Functional Collaboration'],
        lessons: [
            { title: 'Writing Effective PRDs', type: 'practice', done: false },
            { title: 'Agile, Scrum & Sprint Management', type: 'theory', done: false },
            { title: 'Technical Concepts for PMs (APIs, Databases)', type: 'theory', done: false },
            { title: 'System Design Thinking for PMs', type: 'practice', done: false }
        ]
    },
    {
        id: 'pm-interviews',
        title: 'PM Interview Mastery',
        icon: <Rocket size={20} />,
        color: '#fdcb6e',
        duration: '2 weeks',
        problems: 20,
        topics: ['Product Sense Questions', 'Estimation', 'Behavioral (STAR)', 'Case Studies', 'Presentation Skills', 'Offer Negotiation'],
        lessons: [
            { title: 'Product Sense Interview Framework', type: 'theory', done: false },
            { title: 'Estimation Questions (Fermi)', type: 'practice', done: false },
            { title: 'Behavioral Stories (STAR Method)', type: 'practice', done: false },
            { title: 'Full Mock PM Interview', type: 'project', done: false },
            { title: 'Offer Evaluation & Negotiation', type: 'theory', done: false }
        ]
    }
];

export default function PMLearningPath() {
    const [expanded, setExpanded] = useState(null);

    const totalProblems = modules.reduce((a, m) => a + m.problems, 0);
    const doneLessons = modules.reduce((a, m) => a + m.lessons.filter(l => l.done).length, 0);
    const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
    const pct = Math.round((doneLessons / totalLessons) * 100);

    return (
        <div style={{ maxWidth: 950, margin: '0 auto' }}>
            {/* Hero */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(233,67,147,0.12))',
                borderRadius: 18, padding: '40px 36px', marginBottom: 30,
                border: '1px solid var(--border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <Megaphone size={28} color="#f97316" />
                    <span style={{ background: 'rgba(249,115,22,0.2)', color: '#f97316', padding: '4px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>Learning Path</span>
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>Product Management</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 20, maxWidth: 700 }}>
                    Build product sense, master strategy frameworks, learn analytics, and nail PM interviews at Google, Meta, Amazon, and top startups.
                </p>
                <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={15} /> 11 Weeks</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><BookOpen size={15} /> {modules.length} Modules</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Target size={15} /> {totalProblems} Problems</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp size={15} /> {pct}% Complete</span>
                </div>
                <div style={{ marginTop: 18, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #f97316, #e84393)', borderRadius: 3, transition: 'width 0.4s' }} />
                </div>
            </div>

            {/* Modules */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {modules.map((mod, idx) => {
                    const done = mod.lessons.filter(l => l.done).length;
                    const modPct = Math.round((done / mod.lessons.length) * 100);
                    const isOpen = expanded === idx;

                    return (
                        <div key={mod.id} style={{ background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
                            <button
                                onClick={() => setExpanded(isOpen ? null : idx)}
                                style={{
                                    width: '100%', padding: '18px 20px', background: 'transparent', border: 'none',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'inherit',
                                    borderBottom: isOpen ? '1px solid var(--border)' : 'none'
                                }}
                            >
                                <div style={{
                                    width: 42, height: 42, borderRadius: 10,
                                    background: `${mod.color}22`, color: mod.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>{mod.icon}</div>
                                <div style={{ flex: 1, textAlign: 'left' }}>
                                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 3 }}>{mod.title}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 14 }}>
                                        <span>{mod.duration}</span><span>{mod.problems} problems</span><span>{done}/{mod.lessons.length} lessons</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{
                                        fontSize: 13, fontWeight: 700,
                                        color: modPct === 100 ? 'var(--green)' : modPct > 0 ? '#f97316' : 'var(--text-muted)'
                                    }}>{modPct}%</span>
                                    {isOpen ? <ChevronDown size={18} color="var(--text-muted)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
                                </div>
                            </button>

                            {isOpen && (
                                <div style={{ padding: '12px 20px 18px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                                        {mod.topics.map((t, i) => (
                                            <span key={i} style={{ fontSize: 11, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '3px 10px', borderRadius: 5 }}>{t}</span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {mod.lessons.map((l, li) => (
                                            <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: l.done ? 'rgba(0,214,143,0.06)' : 'transparent' }}>
                                                {l.done ? <CheckCircle size={16} color="var(--green)" /> : <Circle size={16} color="var(--border)" />}
                                                <span style={{ flex: 1, fontSize: 14, color: l.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: l.done ? 'line-through' : 'none' }}>{l.title}</span>
                                                <span style={{
                                                    fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600, textTransform: 'uppercase',
                                                    background: l.type === 'project' ? 'rgba(168,85,247,0.15)' : l.type === 'practice' ? 'rgba(6,182,212,0.15)' : 'rgba(249,115,22,0.12)',
                                                    color: l.type === 'project' ? '#a855f7' : l.type === 'practice' ? '#22d3ee' : '#f97316'
                                                }}>{l.type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
