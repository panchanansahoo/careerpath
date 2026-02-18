import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Briefcase, Award, Code2, Settings, LogOut, Shield } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    bio: '',
    currentRole: '',
    experience: '',
    skills: '',
    education: ''
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ problemsSolved: 0, interviewsCompleted: 0, streak: 0, coachSessions: 0 });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/profile', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setProfile(prev => ({ ...prev, ...data }));
      }
    } catch (err) { console.error(err); }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/stats', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile)
      });
      setEditing(false);
    } catch (err) { alert('Failed to save'); }
    setSaving(false);
  };

  const statCards = [
    { label: 'Problems Solved', value: stats.problemsSolved, icon: <Code2 size={18} />, color: 'var(--accent)' },
    { label: 'Interviews', value: stats.interviewsCompleted, icon: <Briefcase size={18} />, color: '#f472b6' },
    { label: 'Day Streak', value: stats.streak, icon: <Award size={18} />, color: '#fbbf24' },
    { label: 'Coach Sessions', value: stats.coachSessions, icon: <User size={18} />, color: '#34d399' }
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 30 }}>Profile</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 30 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{
            background: 'var(--bg-card)', borderRadius: 14, padding: '20px',
            border: '1px solid var(--border)', textAlign: 'center'
          }}>
            <div style={{ color: s.color, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Profile Card */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 32, border: '1px solid var(--border)', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6c5ce7, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, color: 'white'
            }}>
              {(user?.fullName || user?.email || '?')[0].toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{profile.fullName || 'User'}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{profile.email}</p>
            </div>
          </div>
          <button onClick={() => editing ? handleSave() : setEditing(true)} className="btn-hero-primary" style={{ border: 'none', cursor: 'pointer', padding: '10px 20px', fontSize: 14 }}>
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'Full Name', key: 'fullName', icon: <User size={14} /> },
            { label: 'Current Role', key: 'currentRole', icon: <Briefcase size={14} /> },
            { label: 'Experience', key: 'experience', icon: <Award size={14} /> },
            { label: 'Education', key: 'education', icon: <Shield size={14} /> }
          ].map((field, i) => (
            <div key={i}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                {field.icon} {field.label}
              </label>
              {editing ? (
                <input
                  value={profile[field.key] || ''}
                  onChange={e => setProfile({ ...profile, [field.key]: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14 }}
                />
              ) : (
                <div style={{ color: profile[field.key] ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: 14, padding: '10px 0' }}>
                  {profile[field.key] || 'Not set'}
                </div>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <div style={{ marginTop: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Bio</label>
            <textarea
              value={profile.bio || ''}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              rows={3}
              placeholder="Tell us about yourself..."
              style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }}
            />
          </div>
        )}
      </div>

      {/* Subscription */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border)', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, marginBottom: 12 }}>Subscription</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ background: 'rgba(108,92,231,0.15)', color: 'var(--accent)', padding: '4px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
              Starter Plan
            </span>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Free forever · Limited features</p>
          </div>
          <a href="/pricing" style={{ color: 'var(--accent)', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Upgrade →
          </a>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: 16, marginBottom: 12, color: 'var(--red)' }}>Danger Zone</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Log out of your account</p>
          </div>
          <button onClick={logout} style={{
            background: 'rgba(255,71,87,0.1)', color: 'var(--red)',
            border: '1px solid var(--red)', padding: '8px 20px',
            borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit'
          }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
