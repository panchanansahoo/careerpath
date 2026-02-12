import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Code2, FileText, BookOpen, Brain, Cpu, TrendingUp } from 'lucide-react';

const coreFeatures = [
  {
    icon: <MessageSquare size={24} />,
    title: 'AI Mock Interviews',
    desc: 'Practice with adaptive AI that provides personalized feedback and realistic interview scenarios.',
    bullets: ['Adaptive questioning', 'Real-time feedback', 'Multiple interview types'],
    link: '/ai-interview',
    bg: 'rgba(236, 72, 153, 0.15)', color: '#f472b6'
  },
  {
    icon: <Code2 size={24} />,
    title: 'AI Code Practice',
    desc: 'Master coding problems with intelligent hints, pattern recognition, and step-by-step guidance.',
    bullets: ['500+ problems', 'Pattern-based learning', 'Intelligent hints'],
    link: '/code-practice',
    bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8'
  },
  {
    icon: <FileText size={24} />,
    title: 'Resume AI Optimizer',
    desc: 'Generate and optimize resumes with ATS-friendly formatting and keyword optimization.',
    bullets: ['ATS optimization', 'Smart suggestions', 'Multiple formats'],
    link: '/resume-analysis',
    bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399'
  }
];

const learningTracks = [
  { title: 'DSA Mastery', desc: 'From basics to advanced algorithms with pattern-based learning', link: '/dashboard/learning-path/dsa', icon: '🧮' },
  { title: 'System Design', desc: 'HLD and LLD with interactive whiteboard practice', link: '/system-design', icon: '🏗️' },
  { title: 'Data Science', desc: 'Statistics, ML, and data analysis fundamentals', link: '/dashboard/learning-path', icon: '📊' },
  { title: 'AI & ML', desc: 'Machine learning concepts and deployment practices', link: '/dashboard/learning-path', icon: '🤖' }
];

const dsaPatterns = [
  'Two Pointers', 'Sliding Window', 'Binary Search', 'Dynamic Programming',
  'Graph Traversal', 'Tree Patterns', 'Backtracking', 'Greedy Algorithms'
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="home-hero" style={{ padding: '80px 20px 60px' }}>
        <div className="container">
          <h1 style={{ fontSize: '48px' }}>Master Technical Interviews with AI</h1>
          <p className="hero-sub">
            Advanced AI-powered platform for coding interviews, system design, and career preparation
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <h2>Core Features</h2>
            <p>Everything you need to ace technical interviews with AI-powered guidance</p>
          </div>
          <div className="home-features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {coreFeatures.map((f, i) => (
              <Link to={f.link} key={i} className="home-feature-card">
                <div className="home-feature-icon" style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <ul>
                  {f.bullets.map((b, j) => (
                    <li key={j}>✓ {b}</li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Tracks */}
      <section className="home-section alt-bg">
        <div className="container">
          <div className="section-header">
            <h2>Learning Tracks</h2>
            <p>Structured learning paths designed to take you from beginner to interview-ready</p>
          </div>
          <div className="home-features-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 900 }}>
            {learningTracks.map((t, i) => (
              <Link to={t.link} key={i} className="home-feature-card">
                <div className="home-feature-icon" style={{ background: 'rgba(108,92,231,0.15)', fontSize: 28 }}>
                  {t.icon}
                </div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DSA 90 Patterns */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <h2>DSA 90 Patterns</h2>
            <p>Master the most important coding patterns that appear in 90% of technical interviews</p>
          </div>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 30 }}>
              {dsaPatterns.map((p, i) => (
                <span key={i} style={{
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: 14,
                  fontWeight: 600
                }}>{p}</span>
              ))}
              <span style={{
                background: 'var(--bg-card)',
                color: 'var(--text-muted)',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 600,
                border: '1px solid var(--border)'
              }}>+82 more patterns</span>
            </div>
            <Link to="/dsa-patterns-sheet" className="btn-hero-primary" style={{ display: 'inline-flex' }}>
              Explore All Patterns <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta-banner">
        <div className="container">
          <h2>Start Your Journey Today</h2>
          <p>Join thousands of engineers who landed their dream jobs with AI-powered preparation.</p>
          <Link to="/signup" className="btn-hero-primary" style={{ display: 'inline-flex' }}>
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
