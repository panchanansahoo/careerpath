import React, { useState, useMemo } from 'react';
import {
    Sparkles, Target, Brain, TrendingUp, ArrowRight, CheckCircle,
    Circle, Building2, Flame, ChevronRight, BarChart3, Compass
} from 'lucide-react';
import { COMPANIES, COMPANY_QUESTIONS } from '../data/companyPrepData';
import { useCompanyPrepProgress } from '../data/companyPrepProgress';
import { Link } from 'react-router-dom';

export default function PersonalizedFeed() {
    const { progress, toggleSolved, stats, isSolved, getRecommendations, setTargetCompanies } = useCompanyPrepProgress();
    const [targetInput, setTargetInput] = useState(progress.targetCompanies || []);

    const recommendations = useMemo(() => getRecommendations(12), [getRecommendations]);
    const dailyPicks = useMemo(() => getRecommendations(5), [getRecommendations]);

    const tagStats = useMemo(() => {
        const allTags = {};
        COMPANY_QUESTIONS.forEach(q => q.tags.forEach(t => {
            if (!allTags[t]) allTags[t] = { total: 0, solved: 0 };
            allTags[t].total++;
            if (isSolved(q.id)) allTags[t].solved++;
        }));
        return Object.entries(allTags)
            .map(([tag, data]) => ({ tag, ...data, rate: data.total > 0 ? (data.solved / data.total * 100).toFixed(0) : 0 }))
            .sort((a, b) => a.rate - b.rate);
    }, [progress.solved]);

    const toggleTarget = (companyId) => {
        const next = targetInput.includes(companyId)
            ? targetInput.filter(c => c !== companyId)
            : [...targetInput, companyId];
        setTargetInput(next);
        setTargetCompanies(next);
    };

    const getCompanyInfo = (id) => COMPANIES.find(c => c.id === id) || { name: id, logo: '🏢', color: '#888' };
    const diffColor = (d) => d === 'Easy' ? '#22c55e' : d === 'Medium' ? '#f59e0b' : '#ef4444';

    return (
        <div className="pf-page">
            {/* Header */}
            <div className="pf-hero">
                <div className="pf-hero-content">
                    <div className="pf-hero-icon"><Compass size={32} /></div>
                    <h1>Your Smart Feed</h1>
                    <p>Personalized recommendations based on your weak areas and target companies</p>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="pf-progress-strip">
                <div className="pf-prog-stat">
                    <strong>{stats.totalSolved}</strong>
                    <span>Solved</span>
                </div>
                <div className="pf-prog-stat">
                    <strong>{stats.totalQuestions - stats.totalSolved}</strong>
                    <span>Remaining</span>
                </div>
                <div className="pf-prog-stat easy">
                    <strong>{stats.byDifficulty.Easy}</strong>
                    <span>Easy</span>
                </div>
                <div className="pf-prog-stat medium">
                    <strong>{stats.byDifficulty.Medium}</strong>
                    <span>Medium</span>
                </div>
                <div className="pf-prog-stat hard">
                    <strong>{stats.byDifficulty.Hard}</strong>
                    <span>Hard</span>
                </div>
            </div>

            <div className="pf-content">
                {/* Target Companies */}
                <div className="pf-section">
                    <h2><Building2 size={18} /> Target Companies</h2>
                    <p className="pf-section-desc">Select companies you're preparing for to get tailored recommendations</p>
                    <div className="pf-target-grid">
                        {COMPANIES.map(c => (
                            <button key={c.id} className={`pf-target-chip ${targetInput.includes(c.id) ? 'active' : ''}`}
                                onClick={() => toggleTarget(c.id)}
                                style={targetInput.includes(c.id) ? { borderColor: c.color, background: `${c.color}15`, color: c.color } : {}}>
                                {c.logo} {c.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Daily Picks */}
                <div className="pf-section">
                    <h2><Sparkles size={18} /> Today's Picks</h2>
                    <div className="pf-daily-cards">
                        {dailyPicks.map(q => {
                            const ci = getCompanyInfo(q.company);
                            return (
                                <div key={q.id} className={`pf-daily-card ${isSolved(q.id) ? 'solved' : ''}`}>
                                    <div className="pf-dc-top">
                                        <span className="pf-dc-company" style={{ color: ci.color }}>{ci.logo} {ci.name}</span>
                                        <span className="pf-dc-diff" style={{ color: diffColor(q.difficulty) }}>{q.difficulty}</span>
                                    </div>
                                    <p className="pf-dc-question">{q.question}</p>
                                    <div className="pf-dc-bottom">
                                        <div className="pf-dc-tags">
                                            {q.tags.slice(0, 2).map(t => <span key={t}>#{t}</span>)}
                                        </div>
                                        <button className="pf-dc-solve" onClick={() => toggleSolved(q.id)}>
                                            {isSolved(q.id) ? <CheckCircle size={16} className="pf-solved" /> : <Circle size={16} />}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Weak Areas Radar */}
                <div className="pf-section">
                    <h2><Target size={18} /> Weak Areas</h2>
                    <div className="pf-weak-bars">
                        {tagStats.slice(0, 10).map(t => (
                            <div key={t.tag} className="pf-weak-bar-row">
                                <span className="pf-wb-label">{t.tag}</span>
                                <div className="pf-wb-track">
                                    <div className="pf-wb-fill" style={{
                                        width: `${t.rate}%`,
                                        background: Number(t.rate) < 30 ? '#ef4444' : Number(t.rate) < 60 ? '#f59e0b' : '#22c55e'
                                    }}></div>
                                </div>
                                <span className="pf-wb-pct">{t.rate}%</span>
                                <span className="pf-wb-count">{t.solved}/{t.total}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Full Recommendations */}
                <div className="pf-section">
                    <h2><Brain size={18} /> Recommended Questions</h2>
                    <div className="pf-rec-list">
                        {recommendations.map(q => {
                            const ci = getCompanyInfo(q.company);
                            return (
                                <div key={q.id} className={`pf-rec-item ${isSolved(q.id) ? 'solved' : ''}`}>
                                    <button className="pf-rec-check" onClick={() => toggleSolved(q.id)}>
                                        {isSolved(q.id) ? <CheckCircle size={18} className="pf-solved" /> : <Circle size={18} />}
                                    </button>
                                    <div className="pf-rec-content">
                                        <div className="pf-rec-meta">
                                            <span style={{ color: ci.color }}>{ci.logo} {ci.name}</span>
                                            <span style={{ color: diffColor(q.difficulty) }}>{q.difficulty}</span>
                                            <span>{q.stage}</span>
                                            <span>{'🔥'.repeat(q.frequencyScore)}</span>
                                        </div>
                                        <p>{q.question}</p>
                                        <div className="pf-rec-tags">
                                            {q.tags.map(t => <span key={t}>#{t}</span>)}
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="pf-rec-arrow" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pf-cta">
                    <Link to="/company-prep" className="pf-cta-btn">
                        Explore All Questions <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
