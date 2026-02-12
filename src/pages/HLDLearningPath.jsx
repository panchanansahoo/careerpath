import React, { useState } from 'react';
import {
  CheckCircle, Circle, BookOpen, Clock, Target, TrendingUp,
  ChevronRight, ChevronDown, Server, Globe, Database,
  Cloud, Shield, Zap, Network, HardDrive
} from 'lucide-react';

const modules = [
  {
    id: 'hld-foundations',
    title: 'System Design Fundamentals',
    icon: <Server size={20} />,
    color: '#6c5ce7',
    duration: '1 week',
    problems: 10,
    topics: ['Scalability', 'Availability', 'Consistency', 'CAP Theorem', 'Load Balancing', 'Caching'],
    lessons: [
      { title: 'Scalability: Horizontal vs Vertical', type: 'theory', done: true },
      { title: 'CAP Theorem & Trade-offs', type: 'theory', done: true },
      { title: 'Load Balancing Strategies', type: 'theory', done: true },
      { title: 'Caching: Redis, Memcached, CDN', type: 'practice', done: false },
      { title: 'Consistency Models & Patterns', type: 'theory', done: false }
    ]
  },
  {
    id: 'networking',
    title: 'Networking & Protocols',
    icon: <Globe size={20} />,
    color: '#0984e3',
    duration: '5 days',
    problems: 8,
    topics: ['HTTP/HTTPS', 'TCP/UDP', 'WebSockets', 'DNS', 'REST vs gRPC', 'API Gateway'],
    lessons: [
      { title: 'HTTP/2, HTTPS & TLS Handshake', type: 'theory', done: true },
      { title: 'TCP vs UDP & WebSockets', type: 'theory', done: false },
      { title: 'REST, GraphQL & gRPC Comparison', type: 'practice', done: false },
      { title: 'DNS Resolution & CDN Architecture', type: 'theory', done: false }
    ]
  },
  {
    id: 'databases',
    title: 'Database Design & Storage',
    icon: <Database size={20} />,
    color: '#00b894',
    duration: '1.5 weeks',
    problems: 14,
    topics: ['SQL vs NoSQL', 'Sharding', 'Replication', 'Indexing', 'ACID', 'Partitioning', 'Data Modeling'],
    lessons: [
      { title: 'SQL vs NoSQL Trade-offs', type: 'theory', done: false },
      { title: 'Database Sharding & Partitioning', type: 'practice', done: false },
      { title: 'Replication: Master-Slave, Multi-Master', type: 'theory', done: false },
      { title: 'Indexing Strategies & Query Optimization', type: 'practice', done: false },
      { title: 'Data Modeling for Scale', type: 'project', done: false }
    ]
  },
  {
    id: 'distributed-systems',
    title: 'Distributed Systems',
    icon: <Network size={20} />,
    color: '#e17055',
    duration: '1.5 weeks',
    problems: 12,
    topics: ['Consensus Algorithms', 'Distributed Queues', 'Event-Driven Architecture', 'Saga Pattern', 'CQRS', 'Idempotency'],
    lessons: [
      { title: 'Message Queues: Kafka, RabbitMQ, SQS', type: 'theory', done: false },
      { title: 'Event-Driven Architecture & CQRS', type: 'theory', done: false },
      { title: 'Consensus: Raft, Paxos, ZooKeeper', type: 'theory', done: false },
      { title: 'Saga Pattern & Distributed Transactions', type: 'practice', done: false },
      { title: 'Design a Notification System', type: 'project', done: false }
    ]
  },
  {
    id: 'cloud-infra',
    title: 'Cloud & Infrastructure',
    icon: <Cloud size={20} />,
    color: '#fdcb6e',
    duration: '1 week',
    problems: 8,
    topics: ['AWS/GCP/Azure', 'Containers', 'Kubernetes', 'CI/CD', 'Microservices', 'Service Mesh'],
    lessons: [
      { title: 'Cloud Services Overview (Compute, Storage, Networking)', type: 'theory', done: false },
      { title: 'Containers & Kubernetes Basics', type: 'theory', done: false },
      { title: 'Microservices vs Monolith', type: 'practice', done: false },
      { title: 'CI/CD Pipeline Design', type: 'practice', done: false }
    ]
  },
  {
    id: 'security-reliability',
    title: 'Security & Reliability',
    icon: <Shield size={20} />,
    color: '#e84393',
    duration: '5 days',
    problems: 8,
    topics: ['Authentication', 'Authorization', 'Rate Limiting', 'DDoS Protection', 'Monitoring', 'Disaster Recovery'],
    lessons: [
      { title: 'Auth: OAuth 2.0, JWT, SSO', type: 'theory', done: false },
      { title: 'Rate Limiting & Throttling', type: 'practice', done: false },
      { title: 'Monitoring, Logging & Alerting', type: 'theory', done: false },
      { title: 'Disaster Recovery & Chaos Engineering', type: 'theory', done: false }
    ]
  },
  {
    id: 'hld-case-studies',
    title: 'HLD Case Studies & Mock Interviews',
    icon: <Zap size={20} />,
    color: '#a855f7',
    duration: '2 weeks',
    problems: 20,
    topics: ['URL Shortener', 'Twitter/X', 'YouTube', 'Uber', 'WhatsApp', 'Instagram', 'Rate Limiter', 'Search Engine'],
    lessons: [
      { title: 'Design URL Shortener (TinyURL)', type: 'project', done: false },
      { title: 'Design Twitter / Social Feed', type: 'project', done: false },
      { title: 'Design YouTube / Video Streaming', type: 'project', done: false },
      { title: 'Design Uber / Ride-Sharing', type: 'project', done: false },
      { title: 'Design WhatsApp / Chat System', type: 'project', done: false },
      { title: 'Full HLD Mock Interview', type: 'project', done: false }
    ]
  }
];

export default function HLDLearningPath() {
  const [expanded, setExpanded] = useState(null);

  const totalProblems = modules.reduce((a, m) => a + m.problems, 0);
  const doneLessons = modules.reduce((a, m) => a + m.lessons.filter(l => l.done).length, 0);
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  const pct = Math.round((doneLessons / totalLessons) * 100);

  return (
    <div style={{ maxWidth: 950, margin: '0 auto' }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(225,112,85,0.15), rgba(108,92,231,0.14))',
        borderRadius: 18, padding: '40px 36px', marginBottom: 30,
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <HardDrive size={28} color="#e17055" />
          <span style={{ background: 'rgba(225,112,85,0.2)', color: '#e17055', padding: '4px 12px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>Learning Path</span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>High-Level Design (System Design)</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 20, maxWidth: 700 }}>
          Master system design from fundamentals to real-world case studies. Learn scalability, distributed systems, databases, cloud infrastructure, and ace HLD interviews at FAANG.
        </p>
        <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={15} /> 9 Weeks</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><BookOpen size={15} /> {modules.length} Modules</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Target size={15} /> {totalProblems} Problems</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp size={15} /> {pct}% Complete</span>
        </div>
        <div style={{ marginTop: 18, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #e17055, #6c5ce7)', borderRadius: 3, transition: 'width 0.4s' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {modules.map((mod, idx) => {
          const done = mod.lessons.filter(l => l.done).length;
          const modPct = Math.round((done / mod.lessons.length) * 100);
          const isOpen = expanded === idx;

          return (
            <div key={mod.id} style={{ background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
              <button
                onClick={() => setExpanded(isOpen ? null : idx)}
                style={{
                  width: '100%', padding: '18px 20px', background: 'transparent', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'inherit',
                  borderBottom: isOpen ? '1px solid var(--border)' : 'none'
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 10,
                  background: `${mod.color}22`, color: mod.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>{mod.icon}</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 3 }}>{mod.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 14 }}>
                    <span>{mod.duration}</span><span>{mod.problems} problems</span><span>{done}/{mod.lessons.length} lessons</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: modPct === 100 ? 'var(--green)' : modPct > 0 ? '#e17055' : 'var(--text-muted)'
                  }}>{modPct}%</span>
                  {isOpen ? <ChevronDown size={18} color="var(--text-muted)" /> : <ChevronRight size={18} color="var(--text-muted)" />}
                </div>
              </button>

              {isOpen && (
                <div style={{ padding: '12px 20px 18px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                    {mod.topics.map((t, i) => (
                      <span key={i} style={{ fontSize: 11, background: 'var(--bg-secondary)', color: 'var(--text-secondary)', padding: '3px 10px', borderRadius: 5 }}>{t}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {mod.lessons.map((l, li) => (
                      <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: l.done ? 'rgba(0,214,143,0.06)' : 'transparent' }}>
                        {l.done ? <CheckCircle size={16} color="var(--green)" /> : <Circle size={16} color="var(--border)" />}
                        <span style={{ flex: 1, fontSize: 14, color: l.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: l.done ? 'line-through' : 'none' }}>{l.title}</span>
                        <span style={{
                          fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 600, textTransform: 'uppercase',
                          background: l.type === 'project' ? 'rgba(168,85,247,0.15)' : l.type === 'practice' ? 'rgba(6,182,212,0.15)' : 'rgba(225,112,85,0.12)',
                          color: l.type === 'project' ? '#a855f7' : l.type === 'practice' ? '#22d3ee' : '#e17055'
                        }}>{l.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
