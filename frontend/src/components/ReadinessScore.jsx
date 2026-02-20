import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, TrendingUp, CheckCircle2 } from 'lucide-react';

function AnimatedGauge({ value, size = 140, strokeWidth = 10, color = 'var(--accent)' }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;

        const cx = size / 2;
        const cy = size / 2;
        const r = (size - strokeWidth * 2) / 2;

        // Background arc
        ctx.clearRect(0, 0, size, size);
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Value arc
        const angle = Math.PI * 0.75 + (Math.PI * 1.5) * (value / 100);
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * 0.75, angle);
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Center text
        ctx.fillStyle = '#fff';
        ctx.font = `bold ${size * 0.22}px system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${value}%`, cx, cy - 4);
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = `600 ${size * 0.09}px system-ui`;
        ctx.fillText('Ready', cx, cy + size * 0.14);
    }, [value, size, strokeWidth, color]);

    return <canvas ref={canvasRef} />;
}

export default function ReadinessScore({ company = null, compact = false }) {
    const { user } = useAuth();
    const [score, setScore] = useState(null);
    const [breakdown, setBreakdown] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        calculateScore();
    }, [company]);

    const calculateScore = () => {
        // Client-side readiness calculation from localStorage data
        const streak = parseInt(localStorage.getItem('streakCount') || '0');
        const solvedCount = parseInt(localStorage.getItem('solvedCount') || '0');
        const mockSessions = parseInt(localStorage.getItem('mockSessionsCompleted') || '0');
        const timedSessions = parseInt(localStorage.getItem('timedSessionsCompleted') || '0');
        const trackProgress = JSON.parse(localStorage.getItem(`ct_progress_${company || 'general'}`) || '{}');
        const sectionsCompleted = Object.values(trackProgress).filter(Boolean).length;

        // Calculate sub-scores (0-100 each)
        const practiceScore = Math.min(100, Math.round((solvedCount / 50) * 100));
        const mockScore = Math.min(100, Math.round((mockSessions / 5) * 100));
        const streakScore = Math.min(100, Math.round((streak / 14) * 100));
        const timedScore = Math.min(100, Math.round((timedSessions / 3) * 100));
        const trackScore = Math.min(100, Math.round((sectionsCompleted / 4) * 100));

        // Weighted average
        const overall = Math.round(
            practiceScore * 0.30 +
            mockScore * 0.25 +
            streakScore * 0.15 +
            timedScore * 0.15 +
            trackScore * 0.15
        );

        setScore(overall);
        setBreakdown({
            practice: practiceScore,
            mocks: mockScore,
            streak: streakScore,
            timed: timedScore,
            track: trackScore,
        });
        setLoading(false);
    };

    if (loading) return null;

    const getColor = (v) => v >= 70 ? '#22c55e' : v >= 40 ? '#f59e0b' : '#ef4444';
    const getLabel = (v) => v >= 80 ? 'Interview Ready! 🎯' : v >= 60 ? 'Almost There 💪' : v >= 30 ? 'Making Progress 📈' : 'Just Getting Started 🌱';

    if (compact) {
        return (
            <div className="rs-compact">
                <div className="rs-compact-gauge">
                    <AnimatedGauge value={score} size={80} strokeWidth={6} color={getColor(score)} />
                </div>
                <div className="rs-compact-info">
                    <span className="rs-compact-label">Interview Readiness</span>
                    <span className="rs-compact-status" style={{ color: getColor(score) }}>
                        {getLabel(score)}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="rs-card">
            <div className="rs-header">
                <Shield size={18} style={{ color: 'var(--accent)' }} />
                <h3>Interview Readiness {company ? `— ${company}` : ''}</h3>
            </div>

            <div className="rs-gauge-row">
                <AnimatedGauge value={score} size={140} color={getColor(score)} />
                <div className="rs-label" style={{ color: getColor(score) }}>
                    {getLabel(score)}
                </div>
            </div>

            {breakdown && (
                <div className="rs-breakdown">
                    {[
                        { label: 'Practice', value: breakdown.practice, icon: '📝' },
                        { label: 'Mocks', value: breakdown.mocks, icon: '🎤' },
                        { label: 'Streak', value: breakdown.streak, icon: '🔥' },
                        { label: 'Timed', value: breakdown.timed, icon: '⏱️' },
                        { label: 'Track', value: breakdown.track, icon: '🗺️' },
                    ].map(item => (
                        <div key={item.label} className="rs-break-item">
                            <div className="rs-break-header">
                                <span>{item.icon} {item.label}</span>
                                <span style={{ color: getColor(item.value) }}>{item.value}%</span>
                            </div>
                            <div className="rs-break-bar">
                                <div className="rs-break-fill" style={{ width: `${item.value}%`, background: getColor(item.value) }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
