import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, Code2, MessageSquare, FileText, TrendingUp, BookOpen,
  CheckCircle, ChevronDown, ArrowRight, Users, Star, Shield,
  Zap, Award, Clock
} from 'lucide-react';

const features = [
  {
    icon: <Brain size={24} />,
    bg: 'rgba(108, 92, 231, 0.15)',
    color: '#a78bfa',
    title: 'AI Coach - 1:1 Tutoring',
    desc: 'Get personalized real-time tutoring on any interview topic with our revolutionary AI coach',
    bullets: [
      'One-on-one real-time tutoring sessions',
      'Dynamic interactive sessions tailored to you',
      'Complex concepts explained with visual diagrams',
      'Automatic session notes for future review'
    ],
    link: '/ai-coach'
  },
  {
    icon: <Code2 size={24} />,
    bg: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
    title: 'DSA 90+ Pattern Mastery Track',
    desc: 'Master algorithmic thinking with our comprehensive pattern guide',
    bullets: [
      '90+ curated algorithmic patterns',
      'Problem-solving frameworks',
      'Real interview questions mapping',
      'Progressive difficulty levels'
    ],
    link: '/dsa-patterns-sheet'
  },
  {
    icon: <MessageSquare size={24} />,
    bg: 'rgba(236, 72, 153, 0.15)',
    color: '#f472b6',
    title: 'AI Mock Interviews',
    desc: 'Practice with advanced AI that adapts to your responses',
    bullets: [
      'Real-time adaptive questioning',
      'Multi-round interview simulation',
      'Instant feedback and scoring',
      'Behavioral and technical rounds'
    ],
    link: '/ai-interview'
  },
  {
    icon: <Zap size={24} />,
    bg: 'rgba(6, 182, 212, 0.15)',
    color: '#22d3ee',
    title: 'AI Code Practice',
    desc: 'Intelligent coding environment with instant feedback',
    bullets: [
      'Smart code analysis',
      'Optimization suggestions',
      'Multi-language support',
      'Real-time execution testing'
    ],
    link: '/code-practice'
  },
  {
    icon: <FileText size={24} />,
    bg: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    title: 'Resume Analysis & Generation',
    desc: 'AI-powered resume optimization for maximum impact',
    bullets: [
      'ATS compatibility check',
      'Industry-specific optimization',
      'Keyword enhancement',
      'Professional template generation'
    ],
    link: '/resume-analysis'
  },
  {
    icon: <BookOpen size={24} />,
    bg: 'rgba(245, 158, 11, 0.15)',
    color: '#fbbf24',
    title: 'Structured Learning Paths',
    desc: 'Comprehensive curriculum across all technical domains',
    bullets: [
      'Data Structures & Algorithms',
      'System Design (LLD & HLD)',
      'Product Management & Strategy',
      'Data Science, AI & LLMs'
    ],
    link: '/dashboard/learning-path'
  }
];

const testimonials = [
  {
    text: "I spent thousands on interview coaching before finding CareerPath. The AI gives similarly detailed feedback, available instantly, at a fraction of the cost. The code review feature caught edge cases I always missed.",
    author: "Sarah Chen",
    role: "Software Engineer at Google"
  },
  {
    text: "With a full-time job and family, I could only study late nights. CareerPath's AI interviewer was always available. Practiced during my own hours and cleared my interviews after 2 months of consistent prep.",
    author: "Michael Rodriguez",
    role: "Senior Engineer at Meta"
  },
  {
    text: "Unlike platforms where you just grind problems, CareerPath focuses on pattern recognition and problem-solving approaches. The AI explains the 'why' behind solutions, not just the 'what'.",
    author: "Priya Sharma",
    role: "Engineer at Amazon"
  },
  {
    text: "Honestly better than $300/hour interview prep sites. The cleanest interface and smoothest experience. The code editor, real-time feedback, and session summaries are incredibly well-designed.",
    author: "James Liu",
    role: "Staff Engineer at Netflix"
  },
  {
    text: "After each coaching session, CareerPath generates detailed notes with diagrams explaining my solution and alternatives. I built an entire reference library from these notes.",
    author: "Anika Patel",
    role: "Engineer at Microsoft"
  },
  {
    text: "As someone with 5 years experience, most platforms felt too basic. CareerPath's AI quickly assessed my skill level and challenged me with appropriate problems. No more wasting time on easy questions.",
    author: "David Kim",
    role: "Senior SDE at AWS"
  },
  {
    text: "Before CareerPath, I was hopping between random YouTube videos and blog posts with no clear direction. This platform gave me structure and a roadmap. The organized content meant I wasn't wasting time.",
    author: "Emma Wilson",
    role: "Backend Engineer at Stripe"
  },
  {
    text: "I struggled with system design for months. CareerPath's structured approach and instant feedback helped me finally understand the patterns. The AI coaching is like having a personal mentor available 24/7.",
    author: "Raj Venkat",
    role: "Engineering Lead at Uber"
  },
  {
    text: "CareerPath's AI interviewer feels the most natural. It asks follow-up questions, challenges your assumptions, and even gets slightly impatient if you're overthinking — just like real interviews!",
    author: "Lisa Tanaka",
    role: "SDE at Apple"
  },
  {
    text: "I read 'Designing Data-Intensive Applications' and watched countless YouTube tutorials but still blanked during interviews. CareerPath broke down system design into digestible patterns and components.",
    author: "Chris O'Brien",
    role: "Platform Engineer at Airbnb"
  }
];

const faqs = [
  {
    q: "What's the difference between Roadmaps and Subscriptions?",
    a: "Roadmaps are one-time purchases that give you a structured 90-day study plan with daily problems, theory, and mocks. Subscriptions unlock platform features like AI mock interviews, code feedback, resume tools, and learning paths on a monthly or yearly basis. You can use both together for the best results."
  },
  {
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes. You can upgrade your plan anytime for instant access to new features. Downgrades take effect at the end of your current billing cycle, so you keep access until then."
  },
  {
    q: "Do Roadmaps expire after 90 days?",
    a: "No. Once you purchase a roadmap, you have lifetime access to it. You can go through the 90-day plan at your own pace — there is no time limit."
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. We use industry-standard encryption and never store your card details on our servers. All payments are processed through trusted payment gateways."
  },
  {
    q: "What's your refund policy?",
    a: "We offer a 7-day money-back guarantee for all paid subscription plans. Contact our support team if you are not satisfied with your experience. Roadmap purchases are non-refundable once accessed."
  },
  {
    q: "Is the Starter plan really free?",
    a: "The Starter plan is free forever and gives you limited access to AI interviews, code feedback, and learning paths. You can upgrade anytime to unlock more features."
  },
  {
    q: "How is CareerPath different from free platforms like LeetCode?",
    a: "Free platforms give you problems — we give you a complete interview preparation system. CareerPath provides AI interviewers that behave like real humans, instant code feedback with optimization suggestions, structured roadmaps, and resume tools. Most users report feeling interview-ready in 60-90 days."
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. There are no contracts or cancellation fees. You can cancel your subscription anytime, and you'll retain access until the end of your current billing period."
  }
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 'Free',
    priceSub: 'Free forever',
    features: [
      '5 AI mock interviews/month',
      'Basic code feedback',
      'DSA patterns sheet access',
      '2 learning paths',
      'Community access'
    ],
    btnText: 'Get Started',
    btnClass: 'outline',
    popular: false
  },
  {
    name: 'Pro',
    price: '$19',
    pricePer: '/mo',
    priceSub: 'Billed monthly',
    features: [
      'Unlimited AI mock interviews',
      'Advanced code feedback & optimization',
      'Full DSA patterns with solutions',
      'All learning paths',
      'Resume analysis & generation',
      'Priority support'
    ],
    btnText: 'Get Pro',
    btnClass: 'primary',
    popular: true
  },
  {
    name: 'Elite',
    price: '$39',
    pricePer: '/mo',
    priceSub: 'Billed monthly',
    features: [
      'Everything in Pro',
      'AI Coach 1:1 tutoring sessions',
      'System design interview prep',
      'Behavioral interview coaching',
      'Custom study plan generation',
      'Early access to new features',
      'Priority support & mentorship'
    ],
    btnText: 'Get Elite',
    btnClass: 'primary',
    popular: false
  }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="home-hero">
        <div className="container">
          <h1>Engineering interviews solved by structure</h1>
          <p className="hero-sub">
            Master tech interviews with AI-powered coaching. Access 90+ DSA patterns, 
            system design interviews, AI coaching, resume analysis, and structured learning paths.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn-hero-primary">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <a href="#pricing" className="btn-hero-outline">
              Explore Plans
            </a>
          </div>
          <div className="trust-badges">
            <span className="trust-badge">
              <CheckCircle size={16} /> Trusted by learners worldwide
            </span>
            <span className="trust-badge">
              <Shield size={16} /> Complete interview preparation
            </span>
            <span className="trust-badge">
              <Award size={16} /> 95% success rate
            </span>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="home-section" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Everything you need at one place</h2>
            <p>Complete interview preparation platform with AI-powered tools and comprehensive learning resources</p>
          </div>
          <div className="home-features-grid">
            {features.map((f, i) => (
              <Link to={f.link} key={i} className="home-feature-card">
                <div className="home-feature-icon" style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <ul>
                  {f.bullets.map((b, j) => (
                    <li key={j}><CheckCircle size={14} /> {b}</li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BANNER ========== */}
      <section className="home-cta-banner">
        <div className="container">
          <h2>Ready to Ace Your Tech Interview?</h2>
          <p>
            Join thousands of engineers who transformed their careers with our comprehensive platform: 
            DSA patterns, AI interviews, system design practice, resume optimization, and personalized coaching.
          </p>
          <Link to="/signup" className="btn-hero-primary" style={{ display: 'inline-flex' }}>
            Start Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section className="home-section" id="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Choose Your Plan</h2>
            <p>Start free and upgrade as you grow. All plans include core interview preparation features.</p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h3>{plan.name}</h3>
                <div className="price">
                  {plan.price}{plan.pricePer && <span>{plan.pricePer}</span>}
                </div>
                <div className="price-sub">{plan.priceSub}</div>
                <ul className="feature-list">
                  {plan.features.map((f, j) => (
                    <li key={j}><CheckCircle size={16} /> {f}</li>
                  ))}
                </ul>
                <Link to="/signup" className={`btn-pricing ${plan.btnClass}`}>
                  {plan.btnText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ROADMAPS ========== */}
      <section className="home-section alt-bg">
        <div className="container">
          <div className="section-header">
            <h2>Structured Roadmaps</h2>
            <p>Don't guess what to study next. Follow a daily plan to go from zero to offer-ready in 90 days.</p>
          </div>
          <div className="roadmap-grid">
            <div className="roadmap-card">
              <h3>90-Day FAANG Roadmap</h3>
              <p className="roadmap-sub">
                DSA + System Design + Behavioral — Structured learning path covering DSA patterns, 
                system design, and interview preparation.
              </p>
              <ul className="feature-list" style={{ marginBottom: 20 }}>
                <li><CheckCircle size={14} /> 316 curated problems across 20+ DSA patterns</li>
                <li><CheckCircle size={14} /> HLD & LLD system design modules</li>
                <li><CheckCircle size={14} /> 22 mock interviews with AI feedback</li>
                <li><CheckCircle size={14} /> Official certificate upon completion</li>
              </ul>
              <div className="roadmap-stats">87 theory lessons · 316 problems · 22 mocks</div>
              <div className="roadmap-price">$45 <span>+ taxes · One-time payment</span></div>
              <Link to="/dashboard/learning-path/dsa" className="btn-pricing outline" style={{ marginTop: 16 }}>
                Explore Roadmap →
              </Link>
            </div>
            <div className="roadmap-card">
              <h3>90-Day AI & Data Science Roadmap</h3>
              <p className="roadmap-sub">
                ML · Deep Learning · GenAI — Complete path from Data Science fundamentals to 
                GenAI and LLM mastery.
              </p>
              <ul className="feature-list" style={{ marginBottom: 20 }}>
                <li><CheckCircle size={14} /> Complete ML & DL curriculum with hands-on practice</li>
                <li><CheckCircle size={14} /> Transformers, LLMs & GenAI system design</li>
                <li><CheckCircle size={14} /> 22 AI/ML & Data Science mock interviews</li>
                <li><CheckCircle size={14} /> Official certificate upon completion</li>
              </ul>
              <div className="roadmap-stats">137 theory modules · 114 problems · 22 mocks</div>
              <div className="roadmap-price">$35 <span>+ taxes · One-time payment</span></div>
              <Link to="/dashboard/learning-path" className="btn-pricing outline" style={{ marginTop: 16 }}>
                Explore Roadmap →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="home-section alt-bg" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Trusted by Engineers Worldwide</h2>
            <p>Real stories from engineers who transformed their careers</p>
          </div>
        </div>
        <div className="testimonials-wrapper">
          <div className="testimonials-track">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="stars">★★★★★</div>
                <div className="testimonial-text">{t.text}</div>
                <div className="testimonial-author">{t.author}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BLOG / GUIDES ========== */}
      <section className="home-section" id="blog">
        <div className="container">
          <div className="section-header">
            <h2>Expert Guides</h2>
            <p>Learn from comprehensive guides on mastering technical interviews, DSA patterns, and career advancement</p>
          </div>
          <div className="blog-grid">
            <Link to="/dsa-patterns-sheet" className="blog-card">
              <div className="blog-card-img">📊</div>
              <div className="blog-card-body">
                <div className="read-time"><Clock size={12} /> 8 min read</div>
                <h3>The 90 DSA Patterns That Cover 99% of Coding Interviews</h3>
                <p>Master the 90 DSA patterns that form the backbone of coding interviews at top tech companies.</p>
                <span className="read-link">Read Guide <ArrowRight size={14} /></span>
              </div>
            </Link>
            <Link to="/ai-interview" className="blog-card">
              <div className="blog-card-img">🤖</div>
              <div className="blog-card-body">
                <div className="read-time"><Clock size={12} /> 9 min read</div>
                <h3>AI Interview Practice: Free Mock Interview Simulator</h3>
                <p>Practice technical interviews with AI-powered real-time feedback. 600+ problems across DSA, System Design & more.</p>
                <span className="read-link">Read Guide <ArrowRight size={14} /></span>
              </div>
            </Link>
            <Link to="/resume-analysis" className="blog-card">
              <div className="blog-card-img">📄</div>
              <div className="blog-card-body">
                <div className="read-time"><Clock size={12} /> 10 min read</div>
                <h3>Free ATS Resume Checker: Beat Applicant Tracking Systems</h3>
                <p>75% of resumes get rejected by ATS before humans see them. Learn how to optimize your resume with AI.</p>
                <span className="read-link">Read Guide <ArrowRight size={14} /></span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="home-section alt-bg" id="faq">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our platform, pricing, and features</p>
          </div>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button 
                  className={`faq-question ${openFaq === i ? 'open' : ''}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <ChevronDown size={20} />
                </button>
                <div className={`faq-answer ${openFaq === i ? 'open' : ''}`}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="home-cta-banner">
        <div className="container">
          <h2>Ready to transform your career?</h2>
          <p>Start your journey today and join thousands of engineers who landed their dream jobs.</p>
          <Link to="/signup" className="btn-hero-primary" style={{ display: 'inline-flex' }}>
            Start Your Journey <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ========== COMMUNITY ========== */}
      <section className="community-section">
        <h2>Join Our Growing Community</h2>
        <p>Connect with thousands of engineers, share experiences, get help, and stay updated with the latest interview trends.</p>
        <Link to="/community" className="btn-discord">
          <Users size={20} /> Join Community
        </Link>
      </section>
    </div>
  );
}
