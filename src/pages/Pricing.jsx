import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ChevronDown, ArrowRight, Zap, BookOpen, Star, Sparkles } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: 'Free',
        pricePer: '',
        priceSub: 'Free forever',
        features: [
            '5 AI mock interviews per month',
            'Basic code feedback',
            'DSA patterns sheet access',
            '2 learning paths',
            'Community access',
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
            'All learning paths unlocked',
            'Resume analysis & generation',
            'System design practice',
            'Priority support',
            'Progress analytics dashboard'
        ],
        btnText: 'Get Pro',
        btnClass: 'btn-primary',
        popular: true
    },
    {
        name: 'Elite',
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
        btnText: 'Get Elite',
        btnClass: 'btn-primary',
        popular: false
    }
];

const faqs = [
    { q: "What's the difference between Roadmaps and Subscriptions?", a: "Roadmaps are one-time purchases that give you a structured 90-day study plan with daily problems, theory, and mocks. Subscriptions unlock platform features like AI mock interviews, code feedback, resume tools, and learning paths on a monthly or yearly basis." },
    { q: "Can I upgrade or downgrade my plan?", a: "Yes. You can upgrade your plan anytime for instant access to new features. Downgrades take effect at the end of your current billing cycle." },
    { q: "Do Roadmaps expire after 90 days?", a: "No. Once you purchase a roadmap, you have lifetime access to it. You can go through the plan at your own pace." },
    { q: "Is my payment information secure?", a: "Yes. We use industry-standard encryption and never store your card details on our servers." },
    { q: "What's your refund policy?", a: "We offer a 7-day money-back guarantee for all paid subscription plans. Roadmap purchases are non-refundable once accessed." },
    { q: "Is the Starter plan really free?", a: "The Starter plan is free forever and gives you limited access to AI interviews, code feedback, and learning paths." },
    { q: "How is this different from free platforms?", a: "Free platforms give you problems — we give you a complete system. AI interviewers, instant code feedback, structured roadmaps, and resume tools. Most users feel interview-ready in 60-90 days." },
    { q: "Can I cancel anytime?", a: "Yes. No contracts or cancellation fees. Cancel from your profile page and retain access until end of billing period." }
];

export default function Pricing() {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div style={{ paddingTop: 40 }}>
            {/* Hero */}
            <section className="container" style={{ textAlign: 'center', marginBottom: 80 }}>
                <div className="badge badge-popular" style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={12} />
                    Unlock Your Potential
                </div>
                <h1 style={{ fontSize: '56px', marginBottom: '24px', lineHeight: 1.1 }}>
                    Pick the Path that <br />
                    <span className="text-gradient">Gets You Hired Faster</span>
                </h1>
                <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    AI-powered prep tailored to your timeline and career goals. Whether you need a structured daily plan or flexible practice, we have you covered.
                </p>
            </section>

            {/* Plans */}
            <section className="container" id="plans">
                <div className="pricing-grid">
                    {plans.map((plan, i) => (
                        <div key={i} className={`pricing-card ${plan.popular ? 'popular' : ''} ${plan.popular ? 'glow-effect' : ''}`}>
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute',
                                    top: -12,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'var(--accent)',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 0 10px var(--accent-glow)'
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

            {/* Roadmaps */}
            <section className="container" style={{ marginTop: 120 }}>
                <div className="glass-panel" style={{ borderRadius: '24px', padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
                    {/* Background decoration */}
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />

                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Structured Roadmaps</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Our AI curates a daily plan to take you from zero to offer-ready in 90 days.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
                        {/* Roadmap Card 1 */}
                        <div className="card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '20px', margin: 0 }}>90-Day FAANG Roadmap</h3>
                                    <p style={{ color: 'var(--accent)', fontSize: '14px', marginTop: 4 }}>DSA + System Design + Behavioral</p>
                                </div>
                            </div>

                            <ul className="feature-list" style={{ marginBottom: 32 }}>
                                <li><CheckCircle size={16} /> 316 curated problems across 20+ DSA patterns</li>
                                <li><CheckCircle size={16} /> HLD & LLD system design modules</li>
                                <li><CheckCircle size={16} /> 22 mock interviews with AI feedback</li>
                                <li><CheckCircle size={16} /> Official certificate upon completion</li>
                            </ul>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                                <div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>$45</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>One-time payment</div>
                                </div>
                                <Link to="/dashboard/learning-path/dsa" className="btn btn-outline">
                                    Explore Roadmap <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>

                        {/* Roadmap Card 2 */}
                        <div className="card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(34, 211, 238, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee' }}>
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '20px', margin: 0 }}>90-Day AI & Data Science</h3>
                                    <p style={{ color: '#22d3ee', fontSize: '14px', marginTop: 4 }}>ML · Deep Learning · GenAI</p>
                                </div>
                            </div>

                            <ul className="feature-list" style={{ marginBottom: 32 }}>
                                <li><CheckCircle size={16} /> Complete ML & DL curriculum</li>
                                <li><CheckCircle size={16} /> Transformers, LLMs & GenAI design</li>
                                <li><CheckCircle size={16} /> 22 AI/ML mock interviews</li>
                                <li><CheckCircle size={16} /> Official certificate upon completion</li>
                            </ul>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                                <div>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>$35</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>One-time payment</div>
                                </div>
                                <Link to="/dashboard/learning-path" className="btn btn-outline">
                                    Explore Roadmap <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="container" style={{ margin: '120px auto' }}>
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

            {/* CTA */}
            <section className="container" style={{ marginBottom: 100 }}>
                <div className="glass-panel glow-effect" style={{
                    borderRadius: '24px',
                    padding: '80px 20px',
                    textAlign: 'center',
                    background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, rgba(20, 20, 25, 0.6) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.2)'
                }}>
                    <h2 style={{ fontSize: '40px', marginBottom: '16px' }}>Ready to get started?</h2>
                    <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px' }}>Join thousands of engineers who are crushing technical interviews.</p>
                    <Link to="/signup" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '18px' }}>
                        Start Free Trial <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
