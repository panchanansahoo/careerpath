import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Code2, MessageSquare, FileText, TrendingUp, BookOpen,
  CheckCircle, ChevronDown, ArrowRight, Users, Star, Shield,
  Zap, Clock, Target, Award, Play
} from 'lucide-react';
import CursorGlow from '../components/CursorGlow';

const features = [
  {
    icon: <Brain size={24} />,
    bg: 'rgba(124, 58, 237, 0.15)',
    color: '#a78bfa',
    title: 'AI Coach - 1:1 Tutoring',
    desc: 'Get personalized real-time tutoring on any interview topic with our revolutionary AI coach.',
    link: '/ai-coach'
  },
  {
    icon: <Code2 size={24} />,
    bg: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
    title: 'DSA 90+ Pattern Mastery',
    desc: 'Master algorithmic thinking with our comprehensive pattern guide.',
    link: '/dsa-patterns-sheet'
  },
  {
    icon: <MessageSquare size={24} />,
    bg: 'rgba(236, 72, 153, 0.15)',
    color: '#f472b6',
    title: 'AI Mock Interviews',
    desc: 'Practice with advanced AI that adapts to your responses.',
    link: '/ai-interview'
  },
  {
    icon: <Zap size={24} />,
    bg: 'rgba(6, 182, 212, 0.15)',
    color: '#22d3ee',
    title: 'AI Code Practice',
    desc: 'Intelligent coding environment with instant feedback.',
    link: '/code-practice'
  },
  {
    icon: <FileText size={24} />,
    bg: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    title: 'Resume Analysis',
    desc: 'AI-powered resume optimization for maximum impact.',
    link: '/resume-analysis'
  },
  {
    icon: <BookOpen size={24} />,
    bg: 'rgba(245, 158, 11, 0.15)',
    color: '#fbbf24',
    title: 'Structured Learning',
    desc: 'Comprehensive curriculum across all technical domains.',
    link: '/dashboard/learning-path'
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    features: ['5 AI mock interviews/month', 'Basic code feedback', 'DSA patterns sheet access', '2 learning paths'],
    btnText: 'Get Started',
    btnClass: 'btn-outline',
    popular: false
  },
  {
    name: 'Pro',
    price: '$19',
    features: ['Unlimited AI mock interviews', 'Advanced code feedback', 'Full DSA patterns', 'All learning paths'],
    btnText: 'Get Pro',
    btnClass: 'btn-primary',
    popular: true
  },
  {
    name: 'Elite',
    price: '$39',
    features: ['Everything in Pro', 'AI Coach 1:1 tutoring', 'System design prep', 'Behavioral coaching'],
    btnText: 'Get Elite',
    btnClass: 'btn-primary',
    popular: false
  }
];

export default function Home() {
  return (
    <div style={{
      position: 'relative',
      overflowX: 'hidden',
      background: '#030303',
      color: 'white',
      minHeight: '100vh',
      width: '100vw'
    }}>

      {/* WebGL Fluid Simulation — Proception-style cursor effect */}
      <CursorGlow />

      {/* Subtle blue edge glow — proception.ai style ambient border */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        background: `
          linear-gradient(to right, rgba(30, 64, 175, 0.12) 0%, transparent 15%, transparent 85%, rgba(30, 64, 175, 0.12) 100%),
          linear-gradient(to bottom, rgba(30, 64, 175, 0.08) 0%, transparent 10%, transparent 92%, rgba(30, 64, 175, 0.15) 100%)
        `
      }}></div>

      {/* 2. HERO SECTION - Left Aligned, Proception Style */}
      <section className="home-hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', textAlign: 'left', paddingTop: '120px', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '64px', alignItems: 'center' }}>

            {/* Left Content */}
            <div style={{ zIndex: 10, position: 'relative' }}>
              <div style={{
                display: 'inline-block',
                padding: '6px 12px',
                border: '1px solid var(--zinc-800)',
                borderRadius: '99px',
                fontSize: '13px',
                color: 'var(--zinc-400)',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(10px)',
                marginBottom: '32px'
              }}>
                <span style={{ color: '#fff', marginRight: '8px' }}>●</span>
                New: System Design Simulator
              </div>

              <h1 style={{ fontSize: 'clamp(48px, 4vw, 80px)', lineHeight: '1.05', fontWeight: '600', marginBottom: '32px', letterSpacing: '-0.03em' }}>
                Construct your <br />
                <span style={{ color: 'var(--zinc-500)' }}>engineering career.</span>
              </h1>

              <p style={{ fontSize: '20px', lineHeight: '1.6', color: 'var(--zinc-400)', maxWidth: '540px', marginBottom: '48px' }}>
                Advanced interview simulation for the next generation of engineers.
                Master DSA, System Design, and behavioral patterns with real-time AI feedback.
              </p>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Link to="/signup" className="btn btn-primary" style={{ height: '52px', padding: '0 32px', fontSize: '16px', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  Start Building
                </Link>
                <a href="#features" className="btn btn-outline" style={{ height: '52px', padding: '0 32px', fontSize: '16px', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  Explore Platform
                </a>
              </div>

              <div style={{ display: 'flex', gap: '32px', color: 'var(--text-secondary)', fontSize: '14px', marginTop: '40px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} /> Used by 15k+ engineers
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} /> 95% Success Rate
                </span>
              </div>
            </div>

            {/* Right Visual - Hardware/Tech Aesthetic Mockup */}
            <div style={{ position: 'relative', zIndex: 10 }}>
              <div style={{
                background: 'rgba(10,10,10,0.8)',
                border: '1px solid var(--zinc-800)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#333' }}></div>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#333' }}></div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#444', fontFamily: 'monospace' }}>AI_INTERVIEW_SESSION_01</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div style={{ background: '#050505', border: '1px solid #222', borderRadius: '8px', padding: '16px', height: '300px', fontFamily: 'monospace', fontSize: '12px', color: '#666', overflow: 'hidden' }}>
                    <div style={{ color: '#fff', marginBottom: '8px' }}>// Solution.cpp</div>
                    <div style={{ color: '#888' }}>
                      class Solution {'{'}<br />
                      &nbsp;&nbsp;public:<br />
                      &nbsp;&nbsp;vector&lt;int&gt; twoSum(vector&lt;int&gt;& nums, int target) {'{'}<br />
                      &nbsp;&nbsp;&nbsp;&nbsp;return {'{'}...{'}'};<br />
                      &nbsp;&nbsp;{'}'}<br />
                      {'}'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '16px', flex: 1 }}>
                      <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#444', marginBottom: '8px' }}>Score</div>
                      <div style={{ fontSize: '32px', color: '#fff', fontWeight: 'bold' }}>98</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURES */}
      <section style={{ padding: '100px 0', background: 'transparent', position: 'relative', zIndex: 10 }} id="features">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {features.map((f, i) => (
              <Link to={f.link} key={i} className="card" style={{
                background: 'rgba(10,10,10,0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--zinc-800)',
                padding: '40px',
                display: 'block',
                textDecoration: 'none'
              }}>
                <div style={{ marginBottom: '24px', color: f.color }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '20px', marginBottom: '12px', color: '#fff' }}>{f.title}</h3>
                <p style={{ fontSize: '15px', color: 'var(--zinc-500)', lineHeight: '1.6' }}>{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRICING */}
      <section style={{ padding: '100px 0', borderTop: '1px solid var(--zinc-900)', zIndex: 10, position: 'relative' }} id="pricing">
        <div className="container">
          <h2 style={{ fontSize: '32px', marginBottom: '64px' }}>Access.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            {pricingPlans.map((plan, i) => (
              <div key={i} style={{
                padding: '40px',
                border: plan.popular ? '1px solid #fff' : '1px solid var(--zinc-800)',
                background: plan.popular ? 'rgba(255,255,255,0.02)' : 'transparent',
                borderRadius: '12px'
              }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', color: plan.popular ? '#fff' : 'var(--zinc-400)' }}>{plan.name}</h3>
                <div style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '32px', color: '#fff' }}>{plan.price}</div>
                <Link to="/signup" className={`btn ${plan.btnClass}`} style={{ width: '100%', display: 'flex', textDecoration: 'none' }}>
                  {plan.btnText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
