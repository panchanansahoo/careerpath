import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Flame, Crown, User, ArrowRight, X,
  BookOpen, MessageSquare, Brain, Grid3X3,
  TrendingUp, Zap, ChevronRight, Clock, Bookmark
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for initial render to prevent layout shift if API is slow or fails
      // In a real scenario, we'd handle loading states more gracefully or use a skeleton
      const mockData = {
        stats: {
          mock_interviews_completed: 12,
          avg_score: 8.5,
          problems_solved: 45
        },
        streak: 5,
        recentActivity: [
          { type: 'interview', detail: 'Technical Interview: Arrays & Hashing', timestamp: new Date().toISOString() },
          { type: 'submission', detail: 'Two Sum - Passed', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { type: 'interview', detail: 'Behavioral - Leadership', timestamp: new Date(Date.now() - 172800000).toISOString() }
        ],
        progress: { stats: { easy_solved: 25, medium_solved: 15, hard_solved: 5 } }
      };

      try {
        const [dashboardRes, progressRes] = await Promise.all([
          axios.get('/api/user/dashboard'),
          axios.get('/api/dsa/progress')
        ]);
        setData({
          ...dashboardRes.data,
          progress: progressRes.data
        });
      } catch (err) {
        console.warn("API Failed, using mock data", err);
        setData(mockData);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const progress = data?.progress?.stats || {};
  const userName = user?.fullName || user?.email?.split('@')[0] || 'Explorer';
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 animate-fade-up">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {getGreeting()}, <span className="text-gradient">{userName}</span>
          </h1>
          <p className="text-secondary">Ready to level up your career today?</p>
        </div>
        <div className="flex gap-3">
          <Link to="/ai-interview" className="btn btn-primary">
            <Zap size={18} /> Start Interview
          </Link>
          <Link to="/profile" className="btn btn-outline">
            <User size={18} /> Profile
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid animate-fade-up delay-100">
        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--yellow-soft)' }}>
            <Flame size={28} color="var(--yellow)" />
          </div>
          <div className="stat-content">
            <h3>{data?.streak || 0}</h3>
            <p>Day Streak</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--blue-soft)' }}>
            <MessageSquare size={28} color="var(--blue)" />
          </div>
          <div className="stat-content">
            <h3>{stats.mock_interviews_completed || 0}</h3>
            <p>Interviews Completed</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--green-soft)' }}>
            <TrendingUp size={28} color="var(--green)" />
          </div>
          <div className="stat-content">
            <h3>{stats.avg_score?.toFixed(1) || 'N/A'}</h3>
            <p>Avg. Score</p>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon-wrapper" style={{ background: 'var(--accent-soft)' }}>
            <Crown size={28} color="var(--accent)" />
          </div>
          <div className="stat-content">
            <h3>Top 5%</h3>
            <p>Global Rank</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-main-grid animate-fade-up delay-200">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="section-header">
              <h2 className="section-title"><Clock size={20} className="text-accent" /> Recent Activity</h2>
              <Link to="/history" className="text-sm text-secondary hover:text-white transition-colors">View All</Link>
            </div>

            {data?.recentActivity?.length > 0 ? (
              <div className="activity-list">
                {data.recentActivity.map((activity, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'interview' ? <MessageSquare size={18} /> : <Code size={18} />}
                    </div>
                    <div className="activity-details">
                      <div className="activity-title">{activity.detail}</div>
                      <div className="activity-meta">{new Date(activity.timestamp).toLocaleDateString()} • {activity.type === 'interview' ? 'Mock Interview' : 'Code Practice'}</div>
                    </div>
                    <ChevronRight size={16} className="text-muted" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-secondary">
                No recent activity. Time to start practicing!
              </div>
            )}
          </div>

          {/* Recommended Path */}
          <div className="card relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Continue your Learning Path</h3>
              <p className="text-secondary mb-4 max-w-lg">You're making great progress in the <strong>Data Structures & Algorithms</strong> track. The next module is "Dynamic Programming".</p>
              <div className="w-full bg-white/5 h-2 rounded-full mb-6 overflow-hidden">
                <div className="h-full bg-accent w-1/3 rounded-full"></div>
              </div>
              <Link to="/learning-path" className="btn btn-outline text-sm">Continue Learning <ArrowRight size={16} /></Link>
            </div>

            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Progress Breakdown */}
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="section-title mb-6"><Brain size={20} className="text-accent" /> Skills Progress</h2>

            <div className="progress-card">
              <ProgressBar label="Easy" value={progress.easy_solved || 0} total={50} color="var(--green)" />
              <ProgressBar label="Medium" value={progress.medium_solved || 0} total={100} color="var(--yellow)" />
              <ProgressBar label="Hard" value={progress.hard_solved || 0} total={50} color="var(--red)" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="section-title mb-4">Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/dsa-patterns-sheet" className="action-btn">
                <Grid3X3 size={24} className="text-blue-400" />
                <span>DSA Sheet</span>
              </Link>
              <Link to="/system-design" className="action-btn">
                <BookOpen size={24} className="text-purple-400" />
                <span>System Design</span>
              </Link>
              <Link to="/resume-analysis" className="action-btn">
                <User size={24} className="text-pink-400" />
                <span>Resume Check</span>
              </Link>
              <Link to="/settings" className="action-btn">
                <Zap size={24} className="text-yellow-400" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, total, color }) {
  const percentage = Math.min((value / total) * 100, 100);

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 6,
        fontSize: 13
      }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span style={{ color: 'var(--text-muted)' }}>{value}/{total}</span>
      </div>
      <div style={{
        height: 6,
        background: 'var(--border)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: color,
          borderRadius: 3,
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}
