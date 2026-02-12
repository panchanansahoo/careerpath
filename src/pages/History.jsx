import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Brain, Code2, FileText, Clock, Filter, ChevronRight } from 'lucide-react';

const typeConfig = {
  interview: { icon: <MessageSquare size={18} />, label: 'AI Interview', color: '#f472b6', bg: 'rgba(236,72,153,0.15)' },
  coach: { icon: <Brain size={18} />, label: 'AI Coach', color: '#a78bfa', bg: 'rgba(108,92,231,0.15)' },
  practice: { icon: <Code2 size={18} />, label: 'Code Practice', color: '#22d3ee', bg: 'rgba(6,182,212,0.15)' },
  resume: { icon: <FileText size={18} />, label: 'Resume Analysis', color: '#34d399', bg: 'rgba(16,185,129,0.15)' }
};

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/history', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const filtered = filter === 'all' ? sessions : sessions.filter(s => s.type === filter);

  // Demo data when API returns empty
  const demoSessions = [
    { id: 1, type: 'interview', title: 'DSA Mock Interview — Arrays & Strings', date: '2026-02-11', score: 85, duration: '25 min' },
    { id: 2, type: 'coach', title: 'System Design — URL Shortener', date: '2026-02-10', score: null, duration: '18 min' },
    { id: 3, type: 'practice', title: 'Two Sum — Optimal Solution', date: '2026-02-10', score: 92, duration: '12 min' },
    { id: 4, type: 'interview', title: 'Behavioral Interview — Leadership', date: '2026-02-09', score: 78, duration: '20 min' },
    { id: 5, type: 'resume', title: 'Resume ATS Analysis', date: '2026-02-09', score: 88, duration: '5 min' },
    { id: 6, type: 'practice', title: 'Binary Search — Rotated Array', date: '2026-02-08', score: 95, duration: '10 min' },
    { id: 7, type: 'coach', title: 'Dynamic Programming — Knapsack', date: '2026-02-08', score: null, duration: '22 min' },
    { id: 8, type: 'interview', title: 'System Design Mock — Chat System', date: '2026-02-07', score: 72, duration: '30 min' }
  ];

  const displaySessions = filtered.length > 0 ? filtered : (filter === 'all' ? demoSessions : demoSessions.filter(s => s.type === filter));

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Session History</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 8,
              fontSize: 13, fontFamily: 'inherit', cursor: 'pointer'
            }}
          >
            <option value="all">All Sessions</option>
            <option value="interview">AI Interviews</option>
            <option value="coach">AI Coach</option>
            <option value="practice">Code Practice</option>
            <option value="resume">Resume Analysis</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Loading history...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {displaySessions.map((s, i) => {
            const cfg = typeConfig[s.type] || typeConfig.practice;
            return (
              <div key={s.id || i} style={{
                background: 'var(--bg-card)', borderRadius: 12, padding: '16px 20px',
                border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
                gap: 16, cursor: 'pointer', transition: 'all 0.2s'
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: cfg.bg, color: cfg.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {cfg.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4, color: 'var(--text-primary)' }}>{s.title}</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {s.duration}</span>
                    <span>{s.date}</span>
                    <span style={{ background: cfg.bg, color: cfg.color, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>{cfg.label}</span>
                  </div>
                </div>
                {s.score !== null && s.score !== undefined && (
                  <div style={{
                    background: s.score >= 80 ? 'rgba(0,214,143,0.15)' : s.score >= 60 ? 'rgba(255,170,0,0.15)' : 'rgba(255,71,87,0.15)',
                    color: s.score >= 80 ? 'var(--green)' : s.score >= 60 ? 'var(--yellow)' : 'var(--red)',
                    padding: '6px 14px', borderRadius: 8, fontWeight: 700, fontSize: 15
                  }}>
                    {s.score}%
                  </div>
                )}
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
