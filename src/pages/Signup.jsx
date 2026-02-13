import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await signup(email, password, fullName);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left Panel */}
      <div style={{
        flex: 1, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -100, right: -100, width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(0,214,143,0.12), transparent)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute', bottom: -80, left: -80, width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(108,92,231,0.1), transparent)',
          borderRadius: '50%'
        }} />

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white', textDecoration: 'none', marginBottom: 48, fontSize: 20, fontWeight: 700 }}>
          <Sparkles size={22} color="#a78bfa" /> CareerLoop
        </Link>

        <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>
          Start Your Journey<br />to FAANG
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 40, maxWidth: 400 }}>
          Join thousands of engineers who landed their dream jobs using CareerLoop's AI-powered interview preparation.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            'Unlimited AI mock interviews',
            'Personalized study roadmap',
            '90+ DSA patterns & solutions',
            'ATS-optimized resume analysis',
            'Real-time AI coaching'
          ].map((text, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              <CheckCircle size={16} color="#34d399" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px', background: 'var(--bg-primary)'
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 32 }}>
            Start your journey to landing your dream job
          </p>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
              background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.2)',
              borderRadius: 10, color: 'var(--red)', fontSize: 14, marginBottom: 20
            }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <button
            onClick={() => setError('Google OAuth coming soon!')}
            style={{
              width: '100%', padding: '12px', borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg-card)', color: 'var(--text-primary)',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              marginBottom: 20, fontFamily: 'inherit'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" required
                  style={{ width: '100%', padding: '12px 14px 12px 42px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                  style={{ width: '100%', padding: '12px 14px 12px 42px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  style={{ width: '100%', padding: '12px 14px 12px 42px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit' }}
                />
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>At least 6 characters</p>
            </div>

            <button type="submit" disabled={loading} className="btn-hero-primary"
              style={{ width: '100%', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 15, justifyContent: 'center' }}
            >
              {loading ? 'Creating account...' : 'Create Account'} {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16, textAlign: 'center', lineHeight: 1.5 }}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <div style={{ marginTop: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
