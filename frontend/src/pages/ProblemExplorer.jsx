import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Filter, ChevronDown, ChevronUp, Check, X,
    Clock, Building2, Tag, BarChart3, Target, Flame,
    ArrowUpDown, CheckCircle2, Circle, AlertCircle,
    ExternalLink, SlidersHorizontal
} from 'lucide-react';
import { PROBLEMS, COMPANIES, TOPICS, PATTERNS, getDifficultyCounts } from '../data/problemsDatabase';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const FREQUENCIES = ['high', 'medium', 'low'];
const TIME_ESTIMATES = [10, 15, 20, 25, 30, 45];

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
    const [solvedSet] = useState(() => {
        try { return new Set(JSON.parse(localStorage.getItem('cl_solved') || '[]')); } catch { return new Set(); }
    });

    const toggleListItem = (list, setter, item) => {
        setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };

    const filteredProblems = useMemo(() => {
        let result = PROBLEMS.filter(p => {
            const patterns = p.patterns || [];
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
    }, [search, selectedDifficulties, selectedTopics, selectedCompanies, selectedPatterns, selectedFrequency, maxTime, sortBy, sortDir]);

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
    };

    const handleSort = (key) => {
        if (sortBy === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortBy(key); setSortDir('asc'); }
    };

    const diffColor = (d) => d === 'Easy' ? '#6ee7b7' : d === 'Medium' ? '#fbbf24' : '#f87171';
    const freqColor = (f) => f === 'high' ? '#f87171' : f === 'medium' ? '#fbbf24' : '#6ee7b7';

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
            <div className="fixed inset-0 bg-gradient-to-b from-purple-900/10 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-8 pt-24 relative z-10">
                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg, #c084fc, #6ee7b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>
                        Problem Explorer
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>
                        {PROBLEMS.length} original problems • {TOPICS.length} topics • {COMPANIES.length} companies
                    </p>
                </div>

                {/* Stats Bar */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                    {DIFFICULTIES.map(d => (
                        <div key={d} style={{
                            padding: '8px 16px', borderRadius: 10,
                            background: `${diffColor(d)}08`, border: `1px solid ${diffColor(d)}20`,
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: diffColor(d) }} />
                            <span style={{ fontSize: 13, color: diffColor(d), fontWeight: 700 }}>{diffCounts[d]}</span>
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{d}</span>
                        </div>
                    ))}
                    <div style={{
                        padding: '8px 16px', borderRadius: 10, marginLeft: 'auto',
                        background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
                        display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                        <CheckCircle2 size={14} color="#a78bfa" />
                        <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 700 }}>{solvedSet.size}</span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Solved</span>
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
                        background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 20,
                        border: '1px solid rgba(255,255,255,0.06)', marginBottom: 20,
                        display: 'flex', flexDirection: 'column', gap: 16,
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>FILTERS</span>
                            {activeFilterCount > 0 && (
                                <button onClick={clearAll} style={{
                                    background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                                }}>Clear All</button>
                            )}
                        </div>

                        {/* Difficulty */}
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

                        {/* Topics */}
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

                        {/* Companies */}
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

                        {/* Patterns / Algorithms */}
                        <div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Patterns / Algorithms</div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {PATTERNS.map(p => {
                                    const active = selectedPatterns.includes(p.id);
                                    return (
                                        <button key={p.id} onClick={() => toggleListItem(selectedPatterns, setSelectedPatterns, p.id)}
                                            title={p.desc}
                                            style={{
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

                        {/* Frequency & Time */}
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

                {/* Results Count */}
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
                    Showing <span style={{ color: '#c084fc', fontWeight: 700 }}>{filteredProblems.length}</span> of {PROBLEMS.length} problems
                </div>

                {/* Table Header */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '40px 60px 1fr 280px 90px 80px 60px',
                    gap: 8, padding: '10px 16px', borderRadius: '12px 12px 0 0',
                    background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>STATUS</span>
                    <SortHeader label="#" sortKey="id" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                    <SortHeader label="TITLE" sortKey="title" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>TOPICS / COMPANIES</span>
                    <SortHeader label="DIFFICULTY" sortKey="difficulty" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                    <SortHeader label="ACCEPT %" sortKey="acceptance" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                    <SortHeader label="TIME" sortKey="time" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                </div>

                {/* Problem Rows */}
                <div style={{ borderRadius: '0 0 12px 12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)', borderTop: 'none' }}>
                    {filteredProblems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.3)' }}>
                            No problems match your filters. Try adjusting your criteria.
                        </div>
                    ) : filteredProblems.map((problem, i) => {
                        const solved = solvedSet.has(problem.id);
                        return (
                            <div key={problem.id} style={{
                                display: 'grid', gridTemplateColumns: '40px 60px 1fr 280px 90px 80px 60px',
                                gap: 8, padding: '12px 16px', alignItems: 'center',
                                borderBottom: i < filteredProblems.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                                background: solved ? 'rgba(16,185,129,0.03)' : i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                                transition: 'background 0.15s', cursor: 'pointer',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                onMouseLeave={e => e.currentTarget.style.background = solved ? 'rgba(16,185,129,0.03)' : i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'}
                                onClick={() => navigate(`/code-editor/${problem.id}`)}>
                                {/* Status */}
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    {solved ? <CheckCircle2 size={16} color="#6ee7b7" /> : <Circle size={16} color="rgba(255,255,255,0.12)" />}
                                </div>
                                {/* ID */}
                                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>{problem.id}</span>
                                {/* Title */}
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.3, marginBottom: 2 }}>{problem.title}</div>
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4, maxWidth: 380, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {problem.description}
                                    </div>
                                </div>
                                {/* Topics & Companies */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                        {problem.topics.slice(0, 2).map(t => (
                                            <span key={t} style={{
                                                fontSize: 9, padding: '2px 6px', borderRadius: 4,
                                                background: 'rgba(139,92,246,0.1)', color: '#c084fc', fontWeight: 600,
                                            }}>{t}</span>
                                        ))}
                                        {(problem.patterns || []).slice(0, 1).map(pt => {
                                            const pat = PATTERNS.find(p => p.id === pt);
                                            return pat ? (
                                                <span key={pt} style={{
                                                    fontSize: 9, padding: '2px 6px', borderRadius: 4,
                                                    background: `${pat.color}15`, color: pat.color, fontWeight: 600,
                                                }}>⚡ {pat.name}</span>
                                            ) : null;
                                        })}
                                    </div>
                                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                        {problem.companies.slice(0, 3).map(c => {
                                            const comp = COMPANIES.find(co => co.id === c);
                                            return comp ? (
                                                <span key={c} style={{
                                                    fontSize: 9, padding: '2px 6px', borderRadius: 4,
                                                    background: `${comp.color}10`, color: `${comp.color}cc`, fontWeight: 600,
                                                }}>{comp.name}</span>
                                            ) : null;
                                        })}
                                        {problem.companies.length > 3 && (
                                            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>+{problem.companies.length - 3}</span>
                                        )}
                                    </div>
                                </div>
                                {/* Difficulty */}
                                <span style={{
                                    fontSize: 11, fontWeight: 700, color: diffColor(problem.difficulty),
                                    padding: '4px 10px', borderRadius: 6,
                                    background: `${diffColor(problem.difficulty)}10`,
                                }}>{problem.difficulty}</span>
                                {/* Acceptance */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 30, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                        <div style={{ width: `${problem.acceptance}%`, height: '100%', background: problem.acceptance > 60 ? '#6ee7b7' : problem.acceptance > 40 ? '#fbbf24' : '#f87171', borderRadius: 2 }} />
                                    </div>
                                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{problem.acceptance}%</span>
                                </div>
                                {/* Time */}
                                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Clock size={11} />{problem.timeEstimate}m
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
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
