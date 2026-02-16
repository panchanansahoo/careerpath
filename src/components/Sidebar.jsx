import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, MessageSquare, Brain, BookOpen,
    Grid3X3, FileText, Code, Users,
    ChevronLeft, ChevronRight, Sparkles,
    CalendarDays, BarChart3, Clock, Settings, User,
    PanelLeftClose, PanelLeftOpen, Calculator, Database, Map, Server
} from 'lucide-react';

const navItems = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        subtitle: 'Overview & quick start',
        icon: LayoutDashboard
    },
    {
        path: '/roadmap',
        label: 'Roadmap',
        subtitle: 'Step-by-step guide',
        icon: Map
    },
    {
        path: '/ai-interview',
        label: 'AI Interview',
        subtitle: 'AI-powered mock interviews',
        icon: MessageSquare
    },
    {
        path: '/aptitude-mastery',
        label: 'Aptitude Mastery',
        subtitle: 'Quant, Logical & Verbal',
        icon: Calculator
    },
    {
        path: '/sql-mastery',
        label: 'SQL Mastery',
        subtitle: 'Database & Queries',
        icon: Database
    },
    {
        path: '/system-design',
        label: 'System Design',
        subtitle: 'Architecture Simulator',
        icon: Server
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
        path: '/coding-playground',
        label: 'Playground',
        subtitle: 'Run code in live IDE',
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

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
    const location = useLocation();

    return (
        <>
            <div
                className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
                onClick={onMobileClose}
            />
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/" className="sidebar-brand">
                        <span className="brand-icon">
                            <Sparkles size={18} color="white" />
                        </span>
                        {!collapsed && <span>CareerLoop</span>}
                    </Link>
                    {!collapsed && (
                        <button className="sidebar-toggle desktop-only" onClick={onToggle} title="Collapse Sidebar">
                            <PanelLeftClose size={20} />
                        </button>
                    )}
                    {collapsed && (
                        <button className="sidebar-toggle desktop-only" onClick={onToggle} title="Expand Sidebar" style={{ marginLeft: 0 }}>
                            <PanelLeftOpen size={20} />
                        </button>
                    )}
                    <button className="sidebar-toggle mobile-only" onClick={onMobileClose} title="Close Menu">
                        <PanelLeftClose size={20} />
                    </button>
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
                                onClick={() => mobileOpen && onMobileClose()}
                            >
                                <span className="nav-icon">
                                    <Icon size={20} />
                                </span>
                                {(!collapsed || mobileOpen) && (
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
        </>
    );
}
