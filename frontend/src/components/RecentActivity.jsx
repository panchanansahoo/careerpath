import React, { useState, useEffect } from 'react';
import {
    CheckCircle2, Mic, Trophy, Flame, Code2,
    Database, Brain, Clock, ChevronRight
} from 'lucide-react';

const ACTIVITY_TYPES = {
    problem_solved: { icon: CheckCircle2, color: '#22c55e', label: 'Problem Solved' },
    interview_done: { icon: Mic, color: '#a78bfa', label: 'Interview Completed' },
    badge_earned: { icon: Trophy, color: '#f59e0b', label: 'Badge Earned' },
    streak_milestone: { icon: Flame, color: '#ef4444', label: 'Streak Milestone' },
    dsa_practice: { icon: Code2, color: '#38bdf8', label: 'DSA Practice' },
    sql_practice: { icon: Database, color: '#34d399', label: 'SQL Practice' },
    aptitude_quiz: { icon: Brain, color: '#fb923c', label: 'Aptitude Quiz' },
};

function timeAgo(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

export default function RecentActivity() {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        // Try to load from localStorage first
        let stored = [];
        try {
            stored = JSON.parse(localStorage.getItem('recentActivities') || '[]');
        } catch (e) { }

        // Fall back to generated activities if empty
        if (stored.length === 0) {
            stored = [
                { type: 'problem_solved', title: 'Two Sum — Accepted', timestamp: new Date(Date.now() - 1200000).toISOString() },
                { type: 'interview_done', title: 'Mock Interview: Arrays & Hashing', timestamp: new Date(Date.now() - 7200000).toISOString() },
                { type: 'badge_earned', title: 'Earned "7-Day Streak" badge', timestamp: new Date(Date.now() - 18000000).toISOString() },
                { type: 'sql_practice', title: 'Completed JOIN challenge', timestamp: new Date(Date.now() - 43200000).toISOString() },
                { type: 'dsa_practice', title: 'Binary Search pattern — 3 problems', timestamp: new Date(Date.now() - 86400000).toISOString() },
                { type: 'aptitude_quiz', title: 'Quantitative: Percentages — 85%', timestamp: new Date(Date.now() - 172800000).toISOString() },
            ];
        }

        setActivities(stored.slice(0, 6));
    }, []);

    return (
        <div className="recent-activity-card">
            <div className="recent-activity-header">
                <div className="recent-activity-title">
                    <Clock size={18} style={{ color: '#a78bfa' }} />
                    <span>Recent Activity</span>
                </div>
            </div>

            <div className="recent-activity-list">
                {activities.map((activity, i) => {
                    const config = ACTIVITY_TYPES[activity.type] || ACTIVITY_TYPES.problem_solved;
                    const Icon = config.icon;
                    return (
                        <div key={i} className="recent-activity-item" style={{ animationDelay: `${i * 80}ms` }}>
                            <div className="recent-activity-icon" style={{ background: `${config.color}15`, color: config.color }}>
                                <Icon size={16} />
                            </div>
                            <div className="recent-activity-info">
                                <div className="recent-activity-item-title">{activity.title}</div>
                                <div className="recent-activity-meta">
                                    <span style={{ color: config.color, fontSize: 11, fontWeight: 600 }}>{config.label}</span>
                                    <span>·</span>
                                    <span>{timeAgo(activity.timestamp)}</span>
                                </div>
                            </div>
                            <ChevronRight size={14} className="recent-activity-chevron" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
