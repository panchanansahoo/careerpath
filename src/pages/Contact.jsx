import React, { useState } from 'react';
import { Mail, Clock, MessageSquare, Send } from 'lucide-react';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            setSent(true);
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            alert('Failed to send message. Please try again.');
        }
        setSending(false);
    };

    return (
        <div>
            <section className="home-hero" style={{ padding: '80px 20px 60px' }}>
                <div className="container">
                    <h1 style={{ fontSize: '48px' }}>Get in Touch</h1>
                    <p className="hero-sub">
                        Have questions about our AI interview coaching? Need technical support? We're here to help you succeed in your interview preparation journey.
                    </p>
                </div>
            </section>

            <section className="home-section">
                <div className="container" style={{ maxWidth: 1000 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 50 }}>
                        {/* Info Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div className="home-feature-card">
                                <div className="home-feature-icon" style={{ background: 'rgba(108,92,231,0.15)', color: '#a78bfa' }}>
                                    <Mail size={24} />
                                </div>
                                <h3>Email Support</h3>
                                <p>Our primary communication channel</p>
                                <a href="mailto:support@careerpath.ai" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 15 }}>
                                    support@careerpath.ai
                                </a>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
                                    We respond to all emails within 24 hours
                                </p>
                            </div>

                            <div className="home-feature-card">
                                <div className="home-feature-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
                                    <Clock size={24} />
                                </div>
                                <h3>Response Times</h3>
                                <ul>
                                    <li style={{ padding: '6px 0', fontSize: 14, color: 'var(--text-secondary)' }}>General inquiries: within 24 hours</li>
                                    <li style={{ padding: '6px 0', fontSize: 14, color: 'var(--text-secondary)' }}>Technical support: within 12 hours</li>
                                    <li style={{ padding: '6px 0', fontSize: 14, color: 'var(--text-secondary)' }}>Billing issues: within 6 hours</li>
                                </ul>
                            </div>

                            <div className="home-feature-card">
                                <div className="home-feature-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
                                    <MessageSquare size={24} />
                                </div>
                                <h3>Business Hours</h3>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                                    Monday - Friday: 9:00 AM - 6:00 PM IST
                                </p>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
                                    Emergency support available 24/7 for critical issues
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="home-feature-card" style={{ padding: 32 }}>
                            <h3 style={{ fontSize: 20, marginBottom: 4 }}>Send us a Message</h3>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
                                Fill out the form below and we'll get back to you as soon as possible
                            </p>

                            {sent ? (
                                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                                    <h3>Message Sent!</h3>
                                    <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
                                        We'll get back to you within 24 hours.
                                    </p>
                                    <button onClick={() => setSent(false)} className="btn-hero-primary" style={{ marginTop: 20, border: 'none', cursor: 'pointer' }}>
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            placeholder="Your name"
                                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14 }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            placeholder="you@example.com"
                                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14 }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Subject</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.subject}
                                            onChange={e => setForm({ ...form, subject: e.target.value })}
                                            placeholder="How can we help?"
                                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14 }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Message</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={form.message}
                                            onChange={e => setForm({ ...form, message: e.target.value })}
                                            placeholder="Tell us more about your question..."
                                            style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }}
                                        />
                                    </div>
                                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                                        If you're contacting about an existing account, please provide the email associated with it
                                    </p>
                                    <button type="submit" disabled={sending} className="btn-hero-primary" style={{ width: '100%', justifyContent: 'center', border: 'none', cursor: 'pointer', opacity: sending ? 0.6 : 1 }}>
                                        <Send size={16} /> {sending ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
