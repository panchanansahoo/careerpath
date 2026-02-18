import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Code2, MessageSquare, FileText, TrendingUp, BookOpen,
  CheckCircle, ChevronDown, ArrowRight, Users, Star, Shield,
  Zap, Clock, Target, Award, Play, Sparkles, Database, Calculator, Map,
  Building2, Mic
} from 'lucide-react';
import CursorGlow from '../components/CursorGlow';

const features = [




  {
    icon: <Zap size={24} />,
    bg: 'rgba(6, 182, 212, 0.15)',
    color: '#22d3ee',
    title: 'Intelligent Code Studio',
    desc: 'Write production-grade code with an environment that critiques your style, efficiency, and edge cases.',
    link: '/code-practice'
  },
  {
    icon: <Database size={24} />,
    bg: 'rgba(139, 92, 246, 0.15)',
    color: '#a78bfa',
    title: 'SQL Mastery',
    desc: 'Master database queries with 100+ real-world SQL problems across joins, subqueries, window functions & more.',
    link: '/sql-problems'
  },
  {
    icon: <Calculator size={24} />,
    bg: 'rgba(244, 114, 182, 0.15)',
    color: '#f472b6',
    title: 'Aptitude Mastery',
    desc: 'Practice 200+ problems across quantitative aptitude, logical reasoning & verbal ability with timer, calculator & formula sheets.',
    link: '/aptitude'
  },
  {
    icon: <Map size={24} />,
    bg: 'rgba(129, 140, 248, 0.15)',
    color: '#818cf8',
    title: 'DSA Learning Path',
    desc: 'Master 15 DSA topics with pattern-first learning, thinking frameworks, and curated practice problems.',
    link: '/dsa-path'
  },
  {
    icon: <Building2 size={24} />,
    bg: 'rgba(234, 179, 8, 0.15)',
    color: '#eab308',
    title: 'Company Prep Hub',
    desc: 'Practice real interview questions from top companies like Google, Amazon, TCS, Deloitte — filtered by role, stage & frequency.',
    link: '/company-prep'
  },
  {
    icon: <Mic size={24} />,
    bg: 'rgba(236, 72, 153, 0.15)',
    color: '#ec4899',
    title: 'AI Interview Simulator',
    desc: 'Simulate real interviews with AI follow-ups tailored to your target company. Includes voice practice with pace & filler analysis.',
    link: '/company-interview'
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    pricePer: '',
    priceSub: 'Free forever',
    features: [
      '5 AI mock interviews per month',
      'Basic code feedback',
      'DSA patterns sheet access',


      'Basic progress tracking'
    ],
    btnText: 'Get Started',
    btnClass: 'btn-outline',
    popular: false
  },
  {
    name: 'Pro',
    price: '$19',
    pricePer: '/mo',
    priceSub: 'Billed monthly · Save 20% annually',
    features: [
      'Unlimited AI mock interviews',
      'Advanced code feedback & optimization',
      'Full DSA patterns with solutions',


      'Priority support',
      'Progress analytics dashboard'
    ],
    btnText: 'Get Pro',
    btnClass: 'btn-primary',
    popular: true
  },
  {
    name: 'Premium',
    price: '$39',
    pricePer: '/mo',
    priceSub: 'Billed monthly · Save 20% annually',
    features: [
      'Everything in Pro, plus:',

      'Extended interview time limits',
      'Behavioral interview coaching',
      'Custom study plan generation',
      'Early access to new features',
      'Priority support & mentorship',
      'Exclusive Discord channel'
    ],
    btnText: 'Get Premium',
    btnClass: 'btn-primary',
    popular: false
  }
];

const faqs = [

  { q: "Can I upgrade or downgrade my plan?", a: "Yes. You can upgrade your plan anytime for instant access to new features. Downgrades take effect at the end of your current billing cycle." },

  { q: "Is my payment information secure?", a: "Yes. We use industry-standard encryption and never store your card details on our servers." },
  { q: "What's your refund policy?", a: "We offer a 7-day money-back guarantee for all paid subscription plans." },
  { q: "Is the Starter plan really free?", a: "The Starter plan is free forever and gives you limited access to AI interviews and code feedback." },
  { q: "How is this different from free platforms?", a: "Free platforms give you problems — we give you a complete system. AI interviewers, instant code feedback, and resume tools. Most users feel interview-ready in 60-90 days." },
  { q: "Can I cancel anytime?", a: "Yes. No contracts or cancellation fees. Cancel from your profile page and retain access until end of billing period." }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

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
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px', fontWeight: 'bold' }}>
              Everything you need to <span className="text-gradient">Crack the Interview</span>
            </h2>
            <p style={{ color: 'var(--zinc-400)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
              A complete, AI-powered ecosystem designed to fast-track your engineering career.
            </p>
          </div>

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

      {/* 4. PRICING PLANS */}
      <section className="container" id="pricing" style={{ padding: '100px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="badge badge-popular" style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={12} />
            Unlock Your Potential
          </div>
          <h2 style={{ fontSize: '48px', marginBottom: '24px', lineHeight: 1.1 }}>
            Pick the Path that <br />
            <span className="text-gradient">Gets You Hired Faster</span>
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            AI-powered prep tailored to your timeline and career goals.
          </p>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan, i) => (
            <div key={i} className={`pricing-card ${plan.popular ? 'popular' : ''} ${plan.popular ? 'glow-effect' : ''}`}>
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '800',
                  letterSpacing: '0.5px',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
                  zIndex: 10,
                  border: '1px solid rgba(255,255,255,0.2)',
                  whiteSpace: 'nowrap'
                }}>MOST POPULAR</div>
              )}
              <h3>{plan.name}</h3>
              <div className="price-tag">
                {plan.price}<span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 400 }}>{plan.pricePer}</span>
              </div>
              <div className="price-sub">{plan.priceSub}</div>
              <ul className="feature-list">
                {plan.features.map((f, j) => (
                  <li key={j}><CheckCircle size={16} /> {f}</li>
                ))}
              </ul>
              <Link to="/signup" className={`btn ${plan.btnClass}`} style={{ width: '100%' }}>
                {plan.btnText}
              </Link>
            </div>
          ))}
        </div>
      </section>



      {/* 6. FAQ */}
      <section className="container" style={{ marginBottom: 120 }} id="faq">
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: '32px' }}>Frequently Asked Questions</h2>
        </div>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button
                className="faq-question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <ChevronDown size={20} style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
              </button>
              <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="home-cta-banner">
        <div className="container">
          <h2>Ready to get started?</h2>
          <p>Join thousands of engineers who are crushing technical interviews.</p>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '18px' }}>
            Start Free Trial <ArrowRight size={20} />
          </Link>
        </div>
      </section>

    </div>
  );
}
