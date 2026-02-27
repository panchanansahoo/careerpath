import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Filter, ChevronDown, ChevronUp, Check, X,
    Clock, Building2, Tag, BarChart3, Target, Flame,
    ArrowUpDown, CheckCircle2, Circle, AlertCircle,
    ExternalLink, SlidersHorizontal, Bookmark, Shuffle,
    Zap, Star, Sparkles, History, StickyNote,
    ChevronRight, Trophy, BarChart2, Eye, EyeOff,
    ChevronLeft, ListFilter, BookOpen, TrendingUp
} from 'lucide-react';
import { PROBLEMS, COMPANIES, TOPICS, PATTERNS, getDifficultyCounts } from '../data/problemsDatabase';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const FREQUENCIES = ['high', 'medium', 'low'];
const TIME_ESTIMATES = [10, 15, 20, 25, 30, 45];

// Daily challenge: deterministic pick based on date
function getDailyChallenge() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return PROBLEMS[seed % PROBLEMS.length];
}

// Top companies for quick prep
const QUICK_PREP_COMPANIES = ['google', 'amazon', 'meta', 'microsoft', 'apple'];
const ITEMS_PER_PAGE = 30;

// Study plan presets
const STUDY_PLANS = [
    { id: 'beginner', label: '🌱 Beginner 50', desc: 'Easy problems to build confidence', filter: p => p.difficulty === 'Easy', limit: 50 },
    { id: 'top-medium', label: '🔥 Top Medium', desc: 'Most asked medium problems', filter: p => p.difficulty === 'Medium' && p.frequency === 'high', limit: 50 },
    { id: 'hard-grind', label: '💪 Hard Grind', desc: 'Challenge yourself', filter: p => p.difficulty === 'Hard', limit: 30 },
    { id: 'arrays-strings', label: '📚 Arrays & Strings', desc: 'Foundation topics', filter: p => p.topics.includes('Arrays') || p.topics.includes('Strings'), limit: 50 },
    { id: 'trees-graphs', label: '🌳 Trees & Graphs', desc: 'Tree and graph mastery', filter: p => p.topics.includes('Trees') || p.topics.includes('Graphs'), limit: 40 },
    { id: 'dp-master', label: '🧠 DP Master', desc: 'Dynamic programming focus', filter: p => p.topics.includes('Dynamic Programming'), limit: 45 },
];



// Calculate streak from solved dates
function calcStreak() {
    try {
        const dates = JSON.parse(localStorage.getItem('cl_solve_dates') || '[]');
        if (!dates.length) return 0;
        const unique = [...new Set(dates)].sort().reverse();
        const today = new Date().toISOString().slice(0, 10);
        let streak = 0;
        for (let i = 0; i < unique.length; i++) {
            const expected = new Date();
            expected.setDate(expected.getDate() - i);
            const exp = expected.toISOString().slice(0, 10);
            if (unique[i] === exp || (i === 0 && unique[0] === new Date(Date.now() - 86400000).toISOString().slice(0, 10))) {
                streak++;
            } else if (i === 0 && unique[0] !== today) {
                // check if yesterday
                const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
                if (unique[0] === yesterday) { streak = 1; continue; }
                break;
            } else break;
        }
        return streak;
    } catch { return 0; }
}

function getWeekSolved() {
    try {
        const dates = JSON.parse(localStorage.getItem('cl_solve_dates') || '[]');
        const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
        const weekStr = weekAgo.toISOString().slice(0, 10);
        return dates.filter(d => d >= weekStr).length;
    } catch { return 0; }
}

export default function ProblemExplorer() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [selectedDifficulties, setSelectedDifficulties] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [selectedPatterns, setSelectedPatterns] = useState([]);
    const [selectedFrequency, setSelectedFrequency] = useState('');
    const [maxTime, setMaxTime] = useState('');
    const [sortBy, setSortBy] = useState('id');
    const [sortDir, setSortDir] = useState('asc');
    const [showFilters, setShowFilters] = useState(true);
    const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
    const [hideSolved, setHideSolved] = useState(false);
    const [activePlan, setActivePlan] = useState(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [weeklyGoal, setWeeklyGoal] = useState(() => {
        try { return parseInt(localStorage.getItem('cl_weekly_goal') || '7'); } catch { return 7; }
    });

    const [showGoalEdit, setShowGoalEdit] = useState(false);

    const [showTopicMastery, setShowTopicMastery] = useState(false);
    const [showRecentlyViewed, setShowRecentlyViewed] = useState(false);
    const [activeNote, setActiveNote] = useState(null); // problemId being edited
    const [noteText, setNoteText] = useState('');

    const [solvedSet, setSolvedSet] = useState(() => {
        try { return new Set(JSON.parse(localStorage.getItem('cl_solved') || '[]')); } catch { return new Set(); }
    });
    const [bookmarks, setBookmarks] = useState(() => {
        try { return new Set(JSON.parse(localStorage.getItem('cl_bookmarks') || '[]')); } catch { return new Set(); }
    });

    const [notes, setNotes] = useState(() => {
        try { return JSON.parse(localStorage.getItem('cl_notes') || '{}'); } catch { return {}; }
    });
    const [recentlyViewed] = useState(() => {
        try { return JSON.parse(localStorage.getItem('cl_recent') || '[]'); } catch { return []; }
    });

    const dailyChallenge = useMemo(() => getDailyChallenge(), []);
    const streak = useMemo(() => calcStreak(), []);
    const weekSolved = useMemo(() => getWeekSolved(), []);

    // Simulate smooth initial loading
    useEffect(() => {
        const timer = setTimeout(() => setInitialLoading(false), 700);
        return () => clearTimeout(timer);
    }, []);

    const toggleListItem = (list, setter, item) => {
        setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const toggleBookmark = useCallback((e, problemId) => {
        e.stopPropagation();
        setBookmarks(prev => {
            const next = new Set(prev);
            if (next.has(problemId)) next.delete(problemId);
            else next.add(problemId);
            localStorage.setItem('cl_bookmarks', JSON.stringify([...next]));
            return next;
        });
    }, []);





    const saveNote = useCallback((problemId, text) => {
        setNotes(prev => {
            const next = { ...prev };
            if (text.trim()) next[problemId] = text.trim();
            else delete next[problemId];
            localStorage.setItem('cl_notes', JSON.stringify(next));
            return next;
        });
        setActiveNote(null);
    }, []);

    const openNote = useCallback((e, problemId) => {
        e.stopPropagation();
        setActiveNote(problemId);
        setNoteText(notes[problemId] || '');
    }, [notes]);

    // Track recently viewed when navigating
    const goToProblem = useCallback((problemId) => {
        const recent = JSON.parse(localStorage.getItem('cl_recent') || '[]');
        const updated = [problemId, ...recent.filter(id => id !== problemId)].slice(0, 10);
        localStorage.setItem('cl_recent', JSON.stringify(updated));
        navigate(`/code-editor/${problemId}`);
    }, [navigate]);

    const filteredProblems = useMemo(() => {
        let result = PROBLEMS.filter(p => {
            const patterns = p.patterns || [];
            if (showBookmarksOnly && !bookmarks.has(p.id)) return false;
            if (hideSolved && solvedSet.has(p.id)) return false;
            if (activePlan) {
                const plan = STUDY_PLANS.find(sp => sp.id === activePlan);
                if (plan && !plan.filter(p)) return false;
            }
            if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.topics.some(t => t.toLowerCase().includes(search.toLowerCase())) && !patterns.some(pt => { const pat = PATTERNS.find(pp => pp.id === pt); return pat && pat.name.toLowerCase().includes(search.toLowerCase()); })) return false;
            if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(p.difficulty)) return false;
            if (selectedTopics.length > 0 && !p.topics.some(t => selectedTopics.includes(t))) return false;
            if (selectedCompanies.length > 0 && !p.companies.some(c => selectedCompanies.includes(c))) return false;
            if (selectedPatterns.length > 0 && !patterns.some(pt => selectedPatterns.includes(pt))) return false;
            if (selectedFrequency && p.frequency !== selectedFrequency) return false;
            if (maxTime && p.timeEstimate > parseInt(maxTime)) return false;
            return true;
        });

        result.sort((a, b) => {
            let cmp = 0;
            if (sortBy === 'title') cmp = a.title.localeCompare(b.title);
            else if (sortBy === 'difficulty') cmp = DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty);
            else if (sortBy === 'acceptance') cmp = a.acceptance - b.acceptance;
            else if (sortBy === 'time') cmp = a.timeEstimate - b.timeEstimate;
            else cmp = a.id - b.id;
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [search, selectedDifficulties, selectedTopics, selectedCompanies, selectedPatterns, selectedFrequency, maxTime, sortBy, sortDir, showBookmarksOnly, hideSolved, activePlan, bookmarks, solvedSet]);

    const diffCounts = getDifficultyCounts();
    const activeFilterCount = selectedDifficulties.length + selectedTopics.length + selectedCompanies.length + selectedPatterns.length + (selectedFrequency ? 1 : 0) + (maxTime ? 1 : 0);

    const clearAll = () => {
        setSelectedDifficulties([]);
        setSelectedTopics([]);
        setSelectedCompanies([]);
        setSelectedPatterns([]);
        setSelectedFrequency('');
        setMaxTime('');
        setSearch('');
        setShowBookmarksOnly(false);
        setHideSolved(false);
        setActivePlan(null);
        setPage(1);
    };

    const handleSort = (key) => {
        if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortBy(key); setSortDir('asc'); }
    };

    const diffColor = (d) => d === 'Easy' ? '#6ee7b7' : d === 'Medium' ? '#fbbf24' : '#f87171';
    const freqColor = (f) => f === 'high' ? '#f87171' : f === 'medium' ? '#fbbf24' : '#6ee7b7';

    const pickRandom = () => {
        const pool = filteredProblems.length > 0 ? filteredProblems : PROBLEMS;
        const random = pool[Math.floor(Math.random() * pool.length)];
        goToProblem(random.id);
    };

    // Quick company prep
    const quickPrep = (companyId) => {
        setSelectedCompanies([companyId]);
        setSelectedDifficulties([]);
        setSelectedTopics([]);
        setSelectedPatterns([]);
        setSelectedFrequency('');
        setMaxTime('');
        setSearch('');
        setShowBookmarksOnly(false);
        setHideSolved(false);
        setActivePlan(null);
        setPage(1);
    };

    // Topic mastery data
    const topicMastery = useMemo(() => {
        return TOPICS.map(topic => {
            const topicProblems = PROBLEMS.filter(p => p.topics.includes(topic));
            const solved = topicProblems.filter(p => solvedSet.has(p.id)).length;
            return { topic, total: topicProblems.length, solved, percent: topicProblems.length > 0 ? Math.round((solved / topicProblems.length) * 100) : 0 };
        }).sort((a, b) => b.total - a.total);
    }, [solvedSet]);

    // Progress calculations
    const solvedCount = solvedSet.size;
    const totalCount = PROBLEMS.length;
    const progressPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;
    const solvedInFiltered = filteredProblems.filter(p => solvedSet.has(p.id)).length;

    // Recently viewed problems
    const recentProblems = useMemo(() => {
        return recentlyViewed.map(id => PROBLEMS.find(p => p.id === id)).filter(Boolean).slice(0, 5);
    }, [recentlyViewed]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30" style={{ scrollBehavior: 'smooth' }}>
            <div className="fixed inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.10), transparent 70%)' }} />
            <style>{`
                @keyframes shimmer-border { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                @keyframes pulse-glow { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
                @keyframes fade-up-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin-loader { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes skeleton-pulse { 0%, 100% { opacity: 0.04; } 50% { opacity: 0.08; } }
            `}</style>

            {/* Note Modal */}
            {activeNote !== null && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }} onClick={() => setActiveNote(null)}>
                    <div onClick={e => e.stopPropagation()} style={{
                        width: 440, padding: 24, borderRadius: 16,
                        background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700, color: '#e9d5ff' }}>
                                <StickyNote size={16} />
                                Problem Notes
                            </div>
                            <button onClick={() => setActiveNote(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={18} color="rgba(255,255,255,0.4)" />
                            </button>
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
                            {PROBLEMS.find(p => p.id === activeNote)?.title}
                        </div>
                        <textarea
                            value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                            placeholder="Add your notes, approach, key insights..."
                            style={{
                                width: '100%', minHeight: 120, padding: 12, borderRadius: 10,
                                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                color: '#fff', fontSize: 13, resize: 'vertical', outline: 'none',
                                fontFamily: 'inherit', lineHeight: 1.6,
                            }}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
                            {noteText && (
                                <button onClick={() => { setNoteText(''); saveNote(activeNote, ''); }} style={{
                                    padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                                    background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171',
                                }}>Delete</button>
                            )}
                            <button onClick={() => saveNote(activeNote, noteText)} style={{
                                padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700,
                                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                                border: 'none', color: '#fff',
                            }}>Save Note</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 py-8 pt-24 relative z-10">
                {/* Header */}
                <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h1 style={{
                            fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, margin: 0,
                            background: 'linear-gradient(135deg, #c084fc, #a78bfa, #67e8f9, #6ee7b7)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            textShadow: 'none',
                        }}>Problem Explorer</h1>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#6ee7b7', animation: 'pulse-glow 2s ease-in-out infinite', boxShadow: '0 0 8px rgba(110,231,183,0.4)' }} />
                            {PROBLEMS.length} original problems • {TOPICS.length} topics • {COMPANIES.length} companies
                        </p>
                    </div>
                    <button onClick={pickRandom} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12,
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(110,231,183,0.1))',
                        border: '1px solid rgba(139,92,246,0.25)', color: '#e9d5ff',
                        cursor: 'pointer', fontWeight: 700, fontSize: 13, transition: 'all 0.3s ease',
                        boxShadow: '0 0 15px rgba(139,92,246,0.08)',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(110,231,183,0.15))'; e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(139,92,246,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(110,231,183,0.1))'; e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(139,92,246,0.08)'; }}
                    >
                        <Shuffle size={16} />
                        Surprise Me
                    </button>
                </div>

                {/* Stats Bar */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    {DIFFICULTIES.map(d => (
                        <div key={d} style={{
                            padding: '8px 14px', borderRadius: 12,
                            background: `${diffColor(d)}08`, border: `1px solid ${diffColor(d)}20`,
                            display: 'flex', alignItems: 'center', gap: 6,
                            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                            boxShadow: `0 0 12px ${diffColor(d)}08, inset 0 1px 0 rgba(255,255,255,0.04)`,
                            transition: 'all 0.25s ease', cursor: 'default',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 4px 20px ${diffColor(d)}15, inset 0 1px 0 rgba(255,255,255,0.06)`; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 0 12px ${diffColor(d)}08, inset 0 1px 0 rgba(255,255,255,0.04)`; }}
                        >
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: diffColor(d), boxShadow: `0 0 6px ${diffColor(d)}60` }} />
                            <span style={{ fontSize: 13, color: diffColor(d), fontWeight: 700 }}>{diffCounts[d]}</span>
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{d}</span>
                        </div>
                    ))}

                    {/* Progress Ring */}
                    <div style={{
                        padding: '8px 14px', borderRadius: 12,
                        background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
                        display: 'flex', alignItems: 'center', gap: 8,
                        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                        boxShadow: '0 0 12px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
                        transition: 'all 0.25s ease',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)'; }}
                    >
                        <div style={{ position: 'relative', width: 28, height: 28 }}>
                            <svg width="28" height="28" viewBox="0 0 28 28" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="14" cy="14" r="11" stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" />
                                <circle cx="14" cy="14" r="11" stroke="url(#progressGrad)" strokeWidth="3" fill="none"
                                    strokeDasharray={`${2 * Math.PI * 11}`}
                                    strokeDashoffset={`${2 * Math.PI * 11 * (1 - progressPercent / 100)}`}
                                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)', filter: 'drop-shadow(0 0 3px rgba(167,139,250,0.4))' }} />
                                <defs><linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a78bfa" /><stop offset="100%" stopColor="#6ee7b7" /></linearGradient></defs>
                            </svg>
                            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7, fontWeight: 800, color: '#a78bfa' }}>
                                {progressPercent}%
                            </span>
                        </div>
                        <div>
                            <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 700 }}>{solvedCount}</span>
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>/{totalCount}</span>
                        </div>
                    </div>

                    {/* Bookmarks Toggle */}
                    <button onClick={() => setShowBookmarksOnly(b => !b)} style={{
                        padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                        background: showBookmarksOnly ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.03)',
                        border: showBookmarksOnly ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                        <Bookmark size={14} color={showBookmarksOnly ? '#fbbf24' : 'rgba(255,255,255,0.4)'} fill={showBookmarksOnly ? '#fbbf24' : 'none'} />
                        <span style={{ fontSize: 13, color: showBookmarksOnly ? '#fbbf24' : 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{bookmarks.size}</span>
                        <span style={{ fontSize: 12, color: showBookmarksOnly ? '#fbbf24' : 'rgba(255,255,255,0.3)' }}>Saved</span>
                    </button>

                    {/* Streak Badge */}
                    <div style={{
                        padding: '8px 14px', borderRadius: 10,
                        background: streak > 0 ? 'rgba(251,146,60,0.12)' : 'rgba(255,255,255,0.03)',
                        border: streak > 0 ? '1px solid rgba(251,146,60,0.25)' : '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                        <Flame size={14} color={streak > 0 ? '#fb923c' : 'rgba(255,255,255,0.3)'} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: streak > 0 ? '#fb923c' : 'rgba(255,255,255,0.3)' }}>{streak}</span>
                        <span style={{ fontSize: 11, color: streak > 0 ? 'rgba(251,146,60,0.7)' : 'rgba(255,255,255,0.25)' }}>Streak</span>
                    </div>

                    {/* Weekly Goal */}
                    <div onClick={() => setShowGoalEdit(g => !g)} style={{
                        padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                        background: 'rgba(103,232,249,0.06)', border: '1px solid rgba(103,232,249,0.15)',
                        display: 'flex', alignItems: 'center', gap: 8, position: 'relative',
                    }}>
                        <Target size={14} color='#67e8f9' />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span style={{ fontSize: 10, color: 'rgba(103,232,249,0.7)' }}>Week Goal</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 50, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(100, (weekSolved / weeklyGoal) * 100)}%`, height: '100%', background: weekSolved >= weeklyGoal ? '#6ee7b7' : '#67e8f9', borderRadius: 2, transition: 'width 0.3s' }} />
                                </div>
                                <span style={{ fontSize: 10, fontWeight: 700, color: weekSolved >= weeklyGoal ? '#6ee7b7' : '#67e8f9' }}>{weekSolved}/{weeklyGoal}</span>
                            </div>
                        </div>
                        {showGoalEdit && (
                            <div onClick={e => e.stopPropagation()} style={{
                                position: 'absolute', top: '110%', left: 0, zIndex: 20, padding: 12, borderRadius: 10,
                                background: 'rgba(15,15,25,0.97)', border: '1px solid rgba(103,232,249,0.2)',
                                display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                            }}>
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Goal:</span>
                                {[3, 5, 7, 10, 15].map(g => (
                                    <button key={g} onClick={() => { setWeeklyGoal(g); localStorage.setItem('cl_weekly_goal', String(g)); setShowGoalEdit(false); }} style={{
                                        padding: '3px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 700,
                                        background: weeklyGoal === g ? 'rgba(103,232,249,0.2)' : 'rgba(255,255,255,0.04)',
                                        border: weeklyGoal === g ? '1px solid rgba(103,232,249,0.3)' : '1px solid rgba(255,255,255,0.06)',
                                        color: weeklyGoal === g ? '#67e8f9' : 'rgba(255,255,255,0.4)',
                                    }}>{g}/wk</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Topic Mastery Toggle */}
                    <button onClick={() => setShowTopicMastery(t => !t)} style={{
                        padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                        background: showTopicMastery ? 'rgba(103,232,249,0.12)' : 'rgba(255,255,255,0.03)',
                        border: showTopicMastery ? '1px solid rgba(103,232,249,0.3)' : '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                        <BarChart2 size={14} color={showTopicMastery ? '#67e8f9' : 'rgba(255,255,255,0.4)'} />
                        <span style={{ fontSize: 12, color: showTopicMastery ? '#67e8f9' : 'rgba(255,255,255,0.3)' }}>Mastery</span>
                    </button>

                    {/* Recently Viewed Toggle */}
                    {recentProblems.length > 0 && (
                        <button onClick={() => setShowRecentlyViewed(r => !r)} style={{
                            padding: '8px 14px', borderRadius: 10, cursor: 'pointer',
                            background: showRecentlyViewed ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.03)',
                            border: showRecentlyViewed ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.08)',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                            <History size={14} color={showRecentlyViewed ? '#a78bfa' : 'rgba(255,255,255,0.4)'} />
                            <span style={{ fontSize: 12, color: showRecentlyViewed ? '#a78bfa' : 'rgba(255,255,255,0.3)' }}>Recent</span>
                        </button>
                    )}
                </div>

                {/* Topic Mastery Panel */}
                {showTopicMastery && (
                    <div style={{
                        marginBottom: 16, padding: 16, borderRadius: 14,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(103,232,249,0.12)',
                    }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#67e8f9', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Topic Mastery
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                            {topicMastery.map(tm => (
                                <button key={tm.topic} onClick={() => { setSelectedTopics([tm.topic]); setShowTopicMastery(false); }}
                                    style={{
                                        padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
                                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                                        textAlign: 'left', transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{tm.topic}</span>
                                        <span style={{ fontSize: 10, color: tm.percent === 100 ? '#6ee7b7' : 'rgba(255,255,255,0.35)', fontWeight: 700 }}>
                                            {tm.solved}/{tm.total}
                                        </span>
                                    </div>
                                    <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${tm.percent}%`, height: '100%', borderRadius: 2,
                                            background: tm.percent === 100 ? '#6ee7b7' : tm.percent > 50 ? '#fbbf24' : '#a78bfa',
                                            transition: 'width 0.3s ease',
                                        }} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recently Viewed Panel */}
                {showRecentlyViewed && recentProblems.length > 0 && (
                    <div style={{
                        marginBottom: 16, padding: 16, borderRadius: 14,
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.12)',
                    }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <History size={13} /> Recently Viewed
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {recentProblems.map(p => (
                                <button key={p.id} onClick={() => goToProblem(p.id)} style={{
                                    padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                    display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                >
                                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>#{p.id}</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{p.title}</span>
                                    <span style={{
                                        fontSize: 9, fontWeight: 700, color: diffColor(p.difficulty),
                                        padding: '1px 5px', borderRadius: 3, background: `${diffColor(p.difficulty)}15`,
                                    }}>{p.difficulty}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Company Quick Prep */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 4 }}>Quick Prep:</span>
                    {QUICK_PREP_COMPANIES.map(cId => {
                        const comp = COMPANIES.find(c => c.id === cId);
                        if (!comp) return null;
                        const isActive = selectedCompanies.length === 1 && selectedCompanies[0] === cId;
                        return (
                            <button key={cId} onClick={() => isActive ? clearAll() : quickPrep(cId)} style={{
                                padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                                background: isActive ? `${comp.color}20` : 'rgba(255,255,255,0.03)',
                                border: isActive ? `1px solid ${comp.color}40` : '1px solid rgba(255,255,255,0.06)',
                                color: isActive ? comp.color : 'rgba(255,255,255,0.4)',
                                transition: 'all 0.15s',
                            }}>
                                {comp.name}
                            </button>
                        );
                    })}
                </div>

                {/* Daily Challenge */}
                <div
                    onClick={() => goToProblem(dailyChallenge.id)}
                    style={{
                        marginBottom: 16, padding: '14px 22px', borderRadius: 16,
                        background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(139,92,246,0.08))',
                        border: '1px solid rgba(251,191,36,0.2)',
                        display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                        transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(251,191,36,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(139,92,246,0.12))'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(251,191,36,0.12), inset 0 1px 0 rgba(255,255,255,0.06)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(139,92,246,0.08))'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(251,191,36,0.06), inset 0 1px 0 rgba(255,255,255,0.04)'; }}
                >
                    {/* Animated shimmer overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.04) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'shimmer-border 4s ease infinite', pointerEvents: 'none' }} />
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'linear-gradient(135deg, rgba(251,191,36,0.25), rgba(251,191,36,0.1))',
                        border: '1px solid rgba(251,191,36,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        boxShadow: '0 0 12px rgba(251,191,36,0.15)',
                    }}>
                        <Sparkles size={17} color="#fbbf24" style={{ animation: 'pulse-glow 2.5s ease-in-out infinite' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 1 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 0.5 }}>Daily Challenge</span>
                            <span style={{
                                fontSize: 9, fontWeight: 700, color: diffColor(dailyChallenge.difficulty),
                                padding: '1px 5px', borderRadius: 3, background: `${diffColor(dailyChallenge.difficulty)}15`,
                            }}>{dailyChallenge.difficulty}</span>
                            {solvedSet.has(dailyChallenge.id) && (
                                <span style={{ fontSize: 9, color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: 2, fontWeight: 600 }}>
                                    <CheckCircle2 size={10} /> Done
                                </span>
                            )}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{dailyChallenge.title}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                        {dailyChallenge.topics.slice(0, 2).map(t => (
                            <span key={t} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'rgba(139,92,246,0.1)', color: '#c084fc', fontWeight: 600 }}>{t}</span>
                        ))}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                        <Clock size={11} />{dailyChallenge.timeEstimate}m
                    </div>
                </div>

                {/* Search & Filter Toggle */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    <div style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                        background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '10px 14px',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                        <Search size={18} color="rgba(255,255,255,0.3)" />
                        <input
                            value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search problems by name or topic..."
                            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14 }}
                        />
                        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={16} color="rgba(255,255,255,0.3)" /></button>}
                    </div>
                    <button onClick={() => setShowFilters(f => !f)} style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 12,
                        background: showFilters ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.04)',
                        border: showFilters ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.08)',
                        color: showFilters ? '#c084fc' : 'rgba(255,255,255,0.5)',
                        fontWeight: 600, fontSize: 13, cursor: 'pointer',
                    }}>
                        <SlidersHorizontal size={16} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span style={{
                                background: '#8b5cf6', color: '#fff', borderRadius: '50%', width: 18, height: 18,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800,
                            }}>{activeFilterCount}</span>
                        )}
                    </button>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div style={{
                        background: 'rgba(255,255,255,0.03)', borderRadius: 18, padding: 22,
                        border: '1px solid rgba(255,255,255,0.06)', marginBottom: 20,
                        display: 'flex', flexDirection: 'column', gap: 18,
                        boxShadow: '0 4px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>FILTERS</span>
                            {activeFilterCount > 0 && (
                                <button onClick={clearAll} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Clear All</button>
                            )}
                        </div>

                        <div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Difficulty</div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {DIFFICULTIES.map(d => {
                                    const active = selectedDifficulties.includes(d);
                                    return (
                                        <button key={d} onClick={() => toggleListItem(selectedDifficulties, setSelectedDifficulties, d)} style={{
                                            padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                                            background: active ? `${diffColor(d)}20` : 'rgba(255,255,255,0.04)',
                                            border: active ? `1px solid ${diffColor(d)}40` : '1px solid rgba(255,255,255,0.06)',
                                            color: active ? diffColor(d) : 'rgba(255,255,255,0.4)',
                                        }}>{d}</button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Topics</div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {TOPICS.map(t => {
                                    const active = selectedTopics.includes(t);
                                    return (
                                        <button key={t} onClick={() => toggleListItem(selectedTopics, setSelectedTopics, t)} style={{
                                            padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                                            background: active ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                                            border: active ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.05)',
                                            color: active ? '#c084fc' : 'rgba(255,255,255,0.4)',
                                        }}>{t}</button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Companies</div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {COMPANIES.map(c => {
                                    const active = selectedCompanies.includes(c.id);
                                    return (
                                        <button key={c.id} onClick={() => toggleListItem(selectedCompanies, setSelectedCompanies, c.id)} style={{
                                            padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                                            background: active ? `${c.color}20` : 'rgba(255,255,255,0.03)',
                                            border: active ? `1px solid ${c.color}40` : '1px solid rgba(255,255,255,0.05)',
                                            color: active ? c.color : 'rgba(255,255,255,0.4)',
                                        }}>{c.name}</button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Patterns / Algorithms</div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {PATTERNS.map(p => {
                                    const active = selectedPatterns.includes(p.id);
                                    return (
                                        <button key={p.id} onClick={() => toggleListItem(selectedPatterns, setSelectedPatterns, p.id)}
                                            title={p.desc} style={{
                                                padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                                                background: active ? `${p.color}20` : 'rgba(255,255,255,0.03)',
                                                border: active ? `1px solid ${p.color}40` : '1px solid rgba(255,255,255,0.05)',
                                                color: active ? p.color : 'rgba(255,255,255,0.4)',
                                                display: 'flex', alignItems: 'center', gap: 4,
                                            }}>
                                            <span style={{ fontSize: 12 }}>{p.icon}</span>{p.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                            <div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Frequency</div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    {FREQUENCIES.map(f => {
                                        const active = selectedFrequency === f;
                                        return (
                                            <button key={f} onClick={() => setSelectedFrequency(active ? '' : f)} style={{
                                                padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                                                background: active ? `${freqColor(f)}20` : 'rgba(255,255,255,0.03)',
                                                border: active ? `1px solid ${freqColor(f)}40` : '1px solid rgba(255,255,255,0.05)',
                                                color: active ? freqColor(f) : 'rgba(255,255,255,0.4)',
                                            }}>{f}</button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Max Time (min)</div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    {TIME_ESTIMATES.map(t => {
                                        const active = maxTime === String(t);
                                        return (
                                            <button key={t} onClick={() => setMaxTime(active ? '' : String(t))} style={{
                                                padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                                                background: active ? 'rgba(103,232,249,0.15)' : 'rgba(255,255,255,0.03)',
                                                border: active ? '1px solid rgba(103,232,249,0.4)' : '1px solid rgba(255,255,255,0.05)',
                                                color: active ? '#67e8f9' : 'rgba(255,255,255,0.4)',
                                            }}>{t}m</button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Study Plan Presets */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <BookOpen size={12} /> Study Plans:
                    </span>
                    {STUDY_PLANS.map(plan => {
                        const isActive = activePlan === plan.id;
                        return (
                            <button key={plan.id} onClick={() => { setActivePlan(isActive ? null : plan.id); setPage(1); }} title={plan.desc} style={{
                                padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                                background: isActive ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                                border: isActive ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
                                color: isActive ? '#c084fc' : 'rgba(255,255,255,0.4)',
                                transition: 'all 0.15s',
                            }}>{plan.label}</button>
                        );
                    })}
                </div>

                {/* Results Count */}
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>Showing <span style={{ color: '#c084fc', fontWeight: 700 }}>{Math.min(page * ITEMS_PER_PAGE, filteredProblems.length)}</span> of {filteredProblems.length} problems</span>
                    {solvedInFiltered > 0 && (
                        <span style={{ color: 'rgba(110,231,183,0.6)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <CheckCircle2 size={11} /> {solvedInFiltered} solved
                        </span>
                    )}
                    {/* Hide Solved Toggle */}
                    <button onClick={() => { setHideSolved(h => !h); setPage(1); }} style={{
                        marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
                        padding: '4px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                        background: hideSolved ? 'rgba(110,231,183,0.12)' : 'rgba(255,255,255,0.03)',
                        border: hideSolved ? '1px solid rgba(110,231,183,0.25)' : '1px solid rgba(255,255,255,0.06)',
                        color: hideSolved ? '#6ee7b7' : 'rgba(255,255,255,0.4)',
                    }}>
                        {hideSolved ? <EyeOff size={12} /> : <Eye size={12} />}
                        {hideSolved ? 'Showing Unsolved' : 'Hide Solved'}
                    </button>
                </div>

                <div style={{
                    display: 'grid', gridTemplateColumns: '30px 30px 50px 1fr 240px 80px 70px 50px',
                    gap: 6, padding: '12px 14px', borderRadius: '14px 14px 0 0',
                    background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>★</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>✓</span>
                    <SortHeader label="#" sortKey="id" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                    <SortHeader label="TITLE" sortKey="title" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>TOPICS / COMPANIES</span>
                    <SortHeader label="DIFF" sortKey="difficulty" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />

                    <SortHeader label="ACC %" sortKey="acceptance" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                    <SortHeader label="TIME" sortKey="time" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                </div>

                {/* Problem Rows */}
                <div style={{ borderRadius: '0 0 14px 14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', borderTop: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                    {initialLoading ? (
                        /* Skeleton loading rows */
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} style={{
                                display: 'grid', gridTemplateColumns: '30px 30px 50px 1fr 240px 80px 70px 50px',
                                gap: 6, padding: '14px 14px', alignItems: 'center',
                                borderBottom: '1px solid rgba(255,255,255,0.03)',
                                animation: `fade-up-in 0.4s ease ${i * 0.06}s both`,
                            }}>
                                <div style={{ width: 14, height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.04)', animation: 'skeleton-pulse 1.5s ease-in-out infinite' }} />
                                <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.1s' }} />
                                <div style={{ width: 24, height: 10, borderRadius: 4, background: 'rgba(255,255,255,0.04)', animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.15s' }} />
                                <div>
                                    <div style={{ width: `${55 + (i * 7) % 30}%`, height: 12, borderRadius: 5, background: 'rgba(255,255,255,0.05)', marginBottom: 6, animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.2s' }} />
                                    <div style={{ width: `${70 + (i * 11) % 20}%`, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.03)', animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.3s' }} />
                                </div>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <div style={{ width: 44, height: 16, borderRadius: 4, background: 'rgba(139,92,246,0.06)', animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.25s' }} />
                                    <div style={{ width: 52, height: 16, borderRadius: 4, background: 'rgba(139,92,246,0.04)', animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.35s' }} />
                                </div>
                                <div style={{ width: 50, height: 18, borderRadius: 6, background: i % 3 === 0 ? 'rgba(110,231,183,0.06)' : i % 3 === 1 ? 'rgba(251,191,36,0.06)' : 'rgba(248,113,113,0.06)', animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.3s' }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 28, height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.04)', animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.35s' }} />
                                    <div style={{ width: 20, height: 8, borderRadius: 3, background: 'rgba(255,255,255,0.03)', animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.4s' }} />
                                </div>
                                <div style={{ width: 30, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.03)', animation: 'skeleton-pulse 1.5s ease-in-out infinite 0.4s' }} />
                            </div>
                        ))
                    ) : filteredProblems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.3)' }}>
                            {showBookmarksOnly ? 'No bookmarked problems yet. Star problems to save them.' :
                                'No problems match your filters.'}
                        </div>
                    ) : filteredProblems.slice(0, page * ITEMS_PER_PAGE).map((problem, i) => {
                        const solved = solvedSet.has(problem.id);
                        const isBookmarked = bookmarks.has(problem.id);
                        const hasNote = !!notes[problem.id];
                        const isDaily = problem.id === dailyChallenge.id;
                        return (
                            <div key={problem.id} style={{
                                display: 'grid', gridTemplateColumns: '30px 30px 50px 1fr 240px 80px 70px 50px',
                                gap: 6, padding: '12px 14px', alignItems: 'center',
                                borderBottom: i < filteredProblems.length - 1 ? '1px solid rgba(255,255,255,0.035)' : 'none',
                                background: isDaily ? 'rgba(251,191,36,0.03)' : solved ? 'rgba(16,185,129,0.03)' : i % 2 === 0 ? 'rgba(255,255,255,0.012)' : 'transparent',
                                transition: 'all 0.2s ease', cursor: 'pointer',
                                borderLeft: isDaily ? '3px solid rgba(251,191,36,0.5)' : '3px solid transparent',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.05)'; e.currentTarget.style.borderLeftColor = solved ? '#6ee7b7' : '#8b5cf6'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = isDaily ? 'rgba(251,191,36,0.03)' : solved ? 'rgba(16,185,129,0.03)' : i % 2 === 0 ? 'rgba(255,255,255,0.012)' : 'transparent'; e.currentTarget.style.borderLeftColor = isDaily ? 'rgba(251,191,36,0.5)' : 'transparent'; }}
                                onClick={() => goToProblem(problem.id)}>
                                {/* Bookmark */}
                                <button onClick={(e) => toggleBookmark(e, problem.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                                    <Bookmark size={13} color={isBookmarked ? '#fbbf24' : 'rgba(255,255,255,0.12)'} fill={isBookmarked ? '#fbbf24' : 'none'} />
                                </button>
                                {/* Status */}
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    {solved ? <CheckCircle2 size={14} color="#6ee7b7" /> : <Circle size={14} color="rgba(255,255,255,0.12)" />}
                                </div>
                                {/* ID */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{problem.id}</span>
                                    {isDaily && <Sparkles size={9} color="#fbbf24" />}
                                </div>
                                {/* Title + Note indicator */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{problem.title}</div>
                                        <button onClick={(e) => openNote(e, problem.id)} title={hasNote ? notes[problem.id] : 'Add note'} style={{
                                            background: 'none', border: 'none', cursor: 'pointer', padding: 1, opacity: hasNote ? 1 : 0.3,
                                            transition: 'opacity 0.15s',
                                        }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                            onMouseLeave={e => e.currentTarget.style.opacity = hasNote ? '1' : '0.3'}
                                        >
                                            <StickyNote size={11} color={hasNote ? '#fbbf24' : 'rgba(255,255,255,0.4)'} />
                                        </button>
                                    </div>
                                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', lineHeight: 1.4, maxWidth: 350, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {hasNote ? <span style={{ color: 'rgba(251,191,36,0.5)' }}>📝 {notes[problem.id]}</span> : problem.description}
                                    </div>
                                </div>
                                {/* Topics & Companies */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                        {problem.topics.slice(0, 2).map(t => (
                                            <span key={t} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: 'rgba(139,92,246,0.1)', color: '#c084fc', fontWeight: 600 }}>{t}</span>
                                        ))}
                                        {(problem.patterns || []).slice(0, 1).map(pt => {
                                            const pat = PATTERNS.find(p => p.id === pt);
                                            return pat ? <span key={pt} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: `${pat.color}15`, color: pat.color, fontWeight: 600 }}>⚡ {pat.name}</span> : null;
                                        })}
                                    </div>
                                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                        {problem.companies.slice(0, 3).map(c => {
                                            const comp = COMPANIES.find(co => co.id === c);
                                            return comp ? <span key={c} style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: `${comp.color}10`, color: `${comp.color}cc`, fontWeight: 600 }}>{comp.name}</span> : null;
                                        })}
                                        {problem.companies.length > 3 && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>+{problem.companies.length - 3}</span>}
                                    </div>
                                </div>
                                {/* Difficulty */}
                                <span style={{
                                    fontSize: 10, fontWeight: 700, color: diffColor(problem.difficulty),
                                    padding: '3px 10px', borderRadius: 6, background: `${diffColor(problem.difficulty)}12`,
                                    border: `1px solid ${diffColor(problem.difficulty)}18`,
                                    boxShadow: `0 0 8px ${diffColor(problem.difficulty)}10`,
                                    letterSpacing: '0.3px',
                                }}>{problem.difficulty}</span>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 28, height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                        <div style={{ width: `${problem.acceptance}%`, height: '100%', background: `linear-gradient(90deg, ${problem.acceptance > 60 ? '#6ee7b7' : problem.acceptance > 40 ? '#fbbf24' : '#f87171'}, ${problem.acceptance > 60 ? '#34d399' : problem.acceptance > 40 ? '#f59e0b' : '#ef4444'})`, borderRadius: 3, transition: 'width 0.5s ease', boxShadow: `0 0 4px ${problem.acceptance > 60 ? 'rgba(110,231,183,0.3)' : problem.acceptance > 40 ? 'rgba(251,191,36,0.3)' : 'rgba(248,113,113,0.3)'}` }} />
                                    </div>
                                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{problem.acceptance}%</span>
                                </div>
                                {/* Time */}
                                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Clock size={10} />{problem.timeEstimate}m
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination / Load More */}
                {
                    filteredProblems.length > page * ITEMS_PER_PAGE && (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            {isLoading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, animation: 'fade-up-in 0.3s ease' }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        border: '3px solid rgba(139,92,246,0.1)',
                                        borderTopColor: '#a78bfa',
                                        animation: 'spin-loader 0.8s linear infinite',
                                    }} />
                                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Loading problems...</span>
                                </div>
                            ) : (
                                <button onClick={() => {
                                    setIsLoading(true);
                                    setTimeout(() => {
                                        setPage(p => p + 1);
                                        setIsLoading(false);
                                    }, 600);
                                }} style={{
                                    padding: '12px 36px', borderRadius: 14, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                                    background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(110,231,183,0.06))',
                                    border: '1px solid rgba(139,92,246,0.3)',
                                    color: '#c084fc', transition: 'all 0.3s ease',
                                    boxShadow: '0 0 15px rgba(139,92,246,0.08)',
                                    position: 'relative', overflow: 'hidden',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(110,231,183,0.1))'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(139,92,246,0.2)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(110,231,183,0.06))'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(139,92,246,0.08)'; }}
                                >
                                    Load More <span style={{ color: '#a78bfa', fontWeight: 800 }}>({filteredProblems.length - page * ITEMS_PER_PAGE} remaining)</span>
                                </button>
                            )}
                        </div>
                    )
                }
            </div >
        </div >
    );
}

function SortHeader({ label, sortKey, sortBy, sortDir, onClick }) {
    const active = sortBy === sortKey;
    return (
        <button onClick={() => onClick(sortKey)} style={{
            display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 10, color: active ? '#c084fc' : 'rgba(255,255,255,0.3)', fontWeight: 700,
            padding: 0, textTransform: 'uppercase', letterSpacing: 0.5,
        }}>
            {label}
            {active && (sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />)}
        </button>
    );
}
