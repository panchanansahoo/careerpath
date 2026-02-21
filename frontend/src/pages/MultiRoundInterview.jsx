import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
    Play, ChevronRight, Trophy, Star, BarChart3,
    CheckCircle, Clock, ArrowRight, RotateCcw, Zap,
    Code2, Users, Brain, Briefcase, Award, Target
} from 'lucide-react';
import { COMPANIES, ROLES, DIFFICULTIES } from '../data/companyPrepData';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ─── Interview Round Definitions ───
const ROUND_TYPES = [
    {
        id: 'dsa',
        name: 'DSA / Coding',
        stage: 'DSA / Coding',
        icon: <Code2 size={20} />,
        color: '#8b5cf6',
        description: 'Data structures, algorithms, and coding problems',
        duration: '25 min',
        questions: 4
    },
    {
        id: 'system-design',
        name: 'System Design',
        stage: 'System Design',
        icon: <Brain size={20} />,
        color: '#3b82f6',
        description: 'Architecture, scalability, and system thinking',
        duration: '20 min',
        questions: 3
    },
    {
        id: 'behavioral',
        name: 'Behavioral',
        stage: 'Behavioral',
        icon: <Users size={20} />,
        color: '#22c55e',
        description: 'Leadership, teamwork, and situational questions',
        duration: '15 min',
        questions: 3
    },
    {
        id: 'hr',
        name: 'HR Discussion',
        stage: 'HR',
        icon: <Briefcase size={20} />,
        color: '#f59e0b',
        description: 'Culture fit, career goals, and expectations',
        duration: '10 min',
        questions: 2
    }
];

export default function MultiRoundInterview() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Configuration
    const [company, setCompany] = useState('google');
    const [role, setRole] = useState('SDE');
    const [difficulty, setDifficulty] = useState('Medium');
    const [selectedRounds, setSelectedRounds] = useState(['dsa', 'system-design', 'behavioral']);

    // Progress
    const [phase, setPhase] = useState('setup'); // setup | transition | active | report
    const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
    const [roundResults, setRoundResults] = useState([]); // {roundId, score, strengths, improvements, conversation}

    const companyObj = COMPANIES.find(c => c.id === company) || COMPANIES[0];
    const activeRounds = ROUND_TYPES.filter(r => selectedRounds.includes(r.id));

    const getAuthHeaders = () => {
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('token');
        if (token) headers.Authorization = `Bearer ${token}`;
        return headers;
    };

    // Toggle round selection
    const toggleRound = (roundId) => {
        setSelectedRounds(prev =>
            prev.includes(roundId)
                ? prev.filter(id => id !== roundId)
                : [...prev, roundId]
        );
    };

    // Get overall stats
    const overallScore = useMemo(() => {
        if (roundResults.length === 0) return 0;
        return Math.round(roundResults.reduce((sum, r) => sum + (r.score || 0), 0) / roundResults.length);
    }, [roundResults]);

    const getVerdict = (score) => {
        if (score >= 85) return { text: 'Strong Hire 🌟', color: '#22c55e' };
        if (score >= 70) return { text: 'Would Advance 👍', color: '#3b82f6' };
        if (score >= 55) return { text: 'Borderline 🤔', color: '#f59e0b' };
        return { text: 'Needs Improvement 📚', color: '#ef4444' };
    };

    // Start interview → navigate to CompanyInterview with the right config
    const startRound = () => {
        const round = activeRounds[currentRoundIdx];
        if (!round) return;

        // Store multi-round context in sessionStorage for CompanyInterview to pick up
        sessionStorage.setItem('multiRoundContext', JSON.stringify({
            multiRound: true,
            company,
            role,
            difficulty,
            currentRoundIdx,
            totalRounds: activeRounds.length,
            roundId: round.id,
            stage: round.stage,
            questionsPerRound: round.questions,
            previousRounds: roundResults
        }));

        navigate(`/company-interview?multiRound=true&stage=${encodeURIComponent(round.stage)}&company=${company}&role=${role}&difficulty=${difficulty}`);
    };

    // Record round result (called when returning from interview)
    const recordRoundResult = useCallback((result) => {
        setRoundResults(prev => [...prev, result]);
        if (currentRoundIdx + 1 < activeRounds.length) {
            setCurrentRoundIdx(prev => prev + 1);
            setPhase('transition');
        } else {
            setPhase('report');
            // Save full session
            saveMultiRoundSession([...roundResults, result]);
        }
    }, [currentRoundIdx, activeRounds.length, roundResults]);

    // Save session to backend
    const saveMultiRoundSession = async (results) => {
        try {
            await fetch(`${API_URL}/api/company-interview/save-session`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    type: 'multi-round',
                    company,
                    role,
                    difficulty,
                    rounds: results,
                    overallScore: Math.round(results.reduce((s, r) => s + (r.score || 0), 0) / results.length),
                    completedAt: new Date().toISOString()
                })
            });
        } catch (e) {
            console.error('Failed to save multi-round session:', e);
        }
    };

    // Check for returning from a round
    React.useEffect(() => {
        const returnData = sessionStorage.getItem('multiRoundResult');
        if (returnData) {
            sessionStorage.removeItem('multiRoundResult');
            const result = JSON.parse(returnData);
            recordRoundResult(result);
        }
    }, [recordRoundResult]);

    // ═══════════════════════════════════════════
    //  SETUP PHASE — Select company, rounds
    // ═══════════════════════════════════════════
    if (phase === 'setup') {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f23 100%)',
                color: '#e2e8f0',
                padding: '40px 20px',
                fontFamily: "'Inter', system-ui, sans-serif"
            }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 40 }}>
                        <Link to="/dashboard" style={{ color: '#64748b', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
                            ← Back to Dashboard
                        </Link>
                        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                            <Zap size={24} style={{ color: '#8b5cf6' }} /> Full Interview Loop
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: 14 }}>
                            Simulate a complete multi-round interview cycle — just like the real thing
                        </p>
                    </div>

                    {/* Company & Role Selection */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 16,
                        padding: 24,
                        marginBottom: 24
                    }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#e2e8f0' }}>
                            Interview Setup
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                            <div>
                                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Company</label>
                                <select
                                    value={company}
                                    onChange={e => setCompany(e.target.value)}
                                    style={{
                                        width: '100%', padding: '8px 12px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8, color: '#e2e8f0', fontSize: 13
                                    }}
                                >
                                    {COMPANIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Role</label>
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    style={{
                                        width: '100%', padding: '8px 12px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8, color: '#e2e8f0', fontSize: 13
                                    }}
                                >
                                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 4 }}>Difficulty</label>
                                <select
                                    value={difficulty}
                                    onChange={e => setDifficulty(e.target.value)}
                                    style={{
                                        width: '100%', padding: '8px 12px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8, color: '#e2e8f0', fontSize: 13
                                    }}
                                >
                                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Round Selection */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 16,
                        padding: 24,
                        marginBottom: 24
                    }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: '#e2e8f0' }}>
                            Select Interview Rounds
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                            {ROUND_TYPES.map(round => (
                                <div
                                    key={round.id}
                                    onClick={() => toggleRound(round.id)}
                                    style={{
                                        padding: 16,
                                        background: selectedRounds.includes(round.id)
                                            ? `rgba(${round.color === '#8b5cf6' ? '139,92,246' : round.color === '#3b82f6' ? '59,130,246' : round.color === '#22c55e' ? '34,197,94' : '245,158,11'}, 0.1)`
                                            : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${selectedRounds.includes(round.id) ? round.color + '40' : 'rgba(255,255,255,0.06)'}`,
                                        borderRadius: 12,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12
                                    }}
                                >
                                    <div style={{
                                        width: 40, height: 40,
                                        borderRadius: 10,
                                        background: selectedRounds.includes(round.id) ? round.color + '20' : 'rgba(255,255,255,0.04)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: selectedRounds.includes(round.id) ? round.color : '#64748b'
                                    }}>
                                        {round.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{round.name}</div>
                                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{round.description}</div>
                                        <div style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>
                                            ⏱ {round.duration} · {round.questions} questions
                                        </div>
                                    </div>
                                    <div style={{
                                        width: 20, height: 20,
                                        borderRadius: 6,
                                        border: `2px solid ${selectedRounds.includes(round.id) ? round.color : 'rgba(255,255,255,0.15)'}`,
                                        background: selectedRounds.includes(round.id) ? round.color : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {selectedRounds.includes(round.id) && <CheckCircle size={12} color="white" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={() => { setPhase('transition'); setCurrentRoundIdx(0); }}
                        disabled={selectedRounds.length === 0}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: selectedRounds.length > 0 ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'rgba(255,255,255,0.05)',
                            color: selectedRounds.length > 0 ? 'white' : '#64748b',
                            border: 'none',
                            borderRadius: 12,
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: selectedRounds.length > 0 ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            transition: 'all 0.2s'
                        }}
                    >
                        <Play size={18} />
                        Start {selectedRounds.length}-Round Interview Loop
                    </button>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════
    //  TRANSITION SCREEN — Between rounds
    // ═══════════════════════════════════════════
    if (phase === 'transition') {
        const currentRound = activeRounds[currentRoundIdx];
        const prevResult = roundResults[currentRoundIdx - 1];

        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f23 100%)',
                color: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Inter', system-ui, sans-serif"
            }}>
                <div style={{ maxWidth: 500, textAlign: 'center', padding: 40 }}>
                    {/* Round progress dots */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
                        {activeRounds.map((round, i) => (
                            <div key={round.id} style={{
                                width: i === currentRoundIdx ? 32 : 10,
                                height: 10,
                                borderRadius: 5,
                                background: i < currentRoundIdx ? '#22c55e' : i === currentRoundIdx ? round.color : 'rgba(255,255,255,0.1)',
                                transition: 'all 0.3s'
                            }} />
                        ))}
                    </div>

                    {/* Previous round score */}
                    {prevResult && (
                        <div style={{
                            background: 'rgba(34,197,94,0.1)',
                            border: '1px solid rgba(34,197,94,0.2)',
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 24,
                            animation: 'fadeIn 0.5s ease'
                        }}>
                            <div style={{ fontSize: 12, color: '#22c55e', marginBottom: 4 }}>
                                ✅ Round {currentRoundIdx} Complete
                            </div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: '#22c55e' }}>
                                {prevResult.score}%
                            </div>
                        </div>
                    )}

                    {/* Next round info */}
                    <div style={{
                        width: 64, height: 64,
                        borderRadius: 16,
                        background: currentRound?.color + '20',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                        color: currentRound?.color,
                        fontSize: 28
                    }}>
                        {currentRound?.icon}
                    </div>

                    <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                        Round {currentRoundIdx + 1}: {currentRound?.name}
                    </h2>
                    <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8 }}>
                        {currentRound?.description}
                    </p>
                    <p style={{ color: '#64748b', fontSize: 12, marginBottom: 32 }}>
                        {currentRound?.questions} questions · {currentRound?.duration}
                    </p>

                    <button
                        onClick={startRound}
                        style={{
                            padding: '14px 32px',
                            background: `linear-gradient(135deg, ${currentRound?.color}, ${currentRound?.color}dd)`,
                            color: 'white',
                            border: 'none',
                            borderRadius: 12,
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            margin: '0 auto',
                            transition: 'all 0.2s'
                        }}
                    >
                        <ArrowRight size={16} />
                        Begin Round {currentRoundIdx + 1}
                    </button>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════
    //  FINAL REPORT — All rounds complete
    // ═══════════════════════════════════════════
    if (phase === 'report') {
        const verdict = getVerdict(overallScore);

        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f23 100%)',
                color: '#e2e8f0',
                padding: '40px 20px',
                fontFamily: "'Inter', system-ui, sans-serif"
            }}>
                <div style={{ maxWidth: 700, margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <Trophy size={40} style={{ color: '#f59e0b', marginBottom: 12 }} />
                        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                            Interview Complete!
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: 14 }}>
                            {companyObj.name} · {role} · {activeRounds.length} rounds completed
                        </p>
                    </div>

                    {/* Overall Score */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 16,
                        padding: 32,
                        textAlign: 'center',
                        marginBottom: 24
                    }}>
                        <div style={{
                            width: 100, height: 100,
                            borderRadius: '50%',
                            background: `conic-gradient(${verdict.color} ${overallScore * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <div style={{
                                width: 80, height: 80,
                                borderRadius: '50%',
                                background: '#0f0f23',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 28, fontWeight: 700, color: verdict.color
                            }}>
                                {overallScore}
                            </div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: verdict.color, marginBottom: 4 }}>
                            {verdict.text}
                        </div>
                    </div>

                    {/* Per-Round Breakdown */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 16,
                        padding: 24,
                        marginBottom: 24
                    }}>
                        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Round Breakdown</h3>
                        {roundResults.map((result, i) => {
                            const round = activeRounds[i];
                            return (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px 0',
                                    borderBottom: i < roundResults.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
                                }}>
                                    <div style={{
                                        width: 34, height: 34,
                                        borderRadius: 8,
                                        background: round?.color + '15',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: round?.color,
                                        flexShrink: 0
                                    }}>
                                        {round?.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 13 }}>{round?.name}</div>
                                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                                            {result.strengths?.slice(0, 2).join(' · ')}
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: 18, fontWeight: 700,
                                        color: result.score >= 80 ? '#22c55e' : result.score >= 60 ? '#f59e0b' : '#ef4444'
                                    }}>
                                        {result.score}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <button
                            onClick={() => { setPhase('setup'); setCurrentRoundIdx(0); setRoundResults([]); }}
                            style={{
                                padding: '12px 24px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 10,
                                color: '#e2e8f0',
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6
                            }}
                        >
                            <RotateCcw size={14} /> Interview Again
                        </button>
                        <Link
                            to="/interview-analytics"
                            style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                                border: 'none',
                                borderRadius: 10,
                                color: 'white',
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6,
                                textDecoration: 'none'
                            }}
                        >
                            <BarChart3 size={14} /> View Analytics
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
