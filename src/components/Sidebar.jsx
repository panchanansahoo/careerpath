import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, MessageSquare, Brain, BookOpen,
    Grid3X3, FileText, Code, Users,
    ChevronLeft, ChevronRight, Sparkles,
    CalendarDays, BarChart3, Clock, Settings, User
} from 'lucide-react';

const navItems = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        subtitle: 'Overview & quick start',
        icon: LayoutDashboard
    },
    {
        path: '/ai-interview',
        label: 'AI Interview',
        subtitle: 'AI-powered mock interviews',
        icon: MessageSquare
    },
    {
        path: '/ai-coach',
        label: 'AI Coach',
        subtitle: 'Revolutionary AI-powered learning',
        icon: Brain
    },
    {
        path: '/dashboard/learning-path',
        label: 'Learning Path',
        subtitle: 'Pattern-based learning journey',
        icon: BookOpen
    },
    {
        path: '/dsa-patterns-sheet',
        label: 'DSA Pattern Mastery',
        subtitle: 'Browse interview questions',
        icon: Grid3X3
    },
    {
        path: '/resume-analysis',
        label: 'Resume Analyzer',
        subtitle: 'ATS optimization & analysis',
        icon: FileText
    },
    {
        path: '/code-practice',
        label: 'AI Code Practice',
        subtitle: 'AI-powered code practice',
        icon: Code
    },
    {
        path: '/community',
        label: 'Community',
        subtitle: 'Learn from the community',
        icon: Users
    },
    {
        path: '/dashboard/study-plan',
        label: 'Study Plan',
        subtitle: '90-day structured roadmap',
        icon: CalendarDays
    },
    {
        path: '/dashboard/analytics',
        label: 'Analytics',
        subtitle: 'Track your progress',
        icon: BarChart3
    },
    {
        path: '/history',
        label: 'History',
        subtitle: 'Past sessions & scores',
        icon: Clock
    },
    {
        path: '/profile',
        label: 'Profile',
        subtitle: 'Account & preferences',
        icon: User
    },
    {
        path: '/dashboard/settings',
        label: 'Settings',
        subtitle: 'App configuration',
        icon: Settings
    }
];

export default function Sidebar({ collapsed, onToggle }) {
    const location = useLocation();

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <Link to="/dashboard" className="sidebar-brand">
                    <span className="brand-icon">
                        <Sparkles size={18} color="white" />
                    </span>
                    {!collapsed && <span>CareerLoop</span>}
                </Link>
                {!collapsed && (
                    <button className="sidebar-toggle" onClick={onToggle} title="Collapse">
                        <ChevronLeft size={18} />
                        <span style={{ fontSize: 11, marginLeft: 2, color: 'var(--text-muted)' }}>collapse</span>
                    </button>
                )}
                {collapsed && (
                    <button className="sidebar-toggle" onClick={onToggle} title="Expand" style={{ marginLeft: -4 }}>
                        <ChevronRight size={18} />
                    </button>
                )}
            </div>

            <nav className="sidebar-nav">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                            title={collapsed ? item.label : undefined}
                        >
                            <span className="nav-icon">
                                <Icon size={20} />
                            </span>
                            {!collapsed && (
                                <div>
                                    <div className="nav-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {item.label}
                                        {isActive && <ChevronRight size={14} />}
                                    </div>
                                    <div className="nav-subtitle">{item.subtitle}</div>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
