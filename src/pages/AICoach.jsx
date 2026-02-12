import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import {
  MessageCircle, Send, Bot, User, Lightbulb,
  BookOpen, Code, TrendingUp, Sparkles,
  ChevronRight, Mic, Play, Pause, X, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AICoach() {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'session'
  const [activeMode, setActiveMode] = useState(null);

  // Dashboard State
  const learningPaths = [
    { id: 'dsa', title: 'Data Structures & Algorithms', icon: Code, color: 'var(--blue)', desc: 'Master arrays, trees, graphs, and DP.' },
    { id: 'system-design', title: 'System Design', icon: TrendingUp, color: 'var(--purple)', desc: 'Learn scalable architecture design.' },
    { id: 'career', title: 'Career Guidance', icon: Sparkles, color: 'var(--yellow)', desc: 'Resume tips, behavioral prep, and negotiation.' }
  ];

  const startSession = (mode) => {
    setActiveMode(mode);
    setView('session');
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-6">
      {view === 'dashboard' ? (
        <CoachDashboard paths={learningPaths} onStart={startSession} />
      ) : (
        <CoachSession mode={activeMode} onExit={() => setView('dashboard')} />
      )}
    </div>
  );
}

function CoachDashboard({ paths, onStart }) {
  return (
    <div className="max-w-6xl mx-auto animate-fade-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Meet Your <span className="text-gradient">AI Coach</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Personalized guidance that adapts to your learning style.
          Master complex concepts with the Socratic method and interactive visualizations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {paths.map(path => (
          <div key={path.id} className="glass-panel p-6 rounded-2xl hover:border-accent transition-all cursor-pointer group"
            onClick={() => onStart(path.id)}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
              style={{ background: `${path.color}20` }}>
              <path.icon size={24} color={path.color} />
            </div>
            <h3 className="text-xl font-bold mb-2">{path.title}</h3>
            <p className="text-text-secondary text-sm mb-4">{path.desc}</p>
            <div className="flex items-center text-accent text-sm font-medium">
              Start Session <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-3">Continue Learning</h2>
          <p className="text-text-secondary mb-6">
            Pick up where you left off. Your AI Coach remembers your progress and areas for improvement.
          </p>
          <button className="btn btn-primary">
            Resume Last Session
          </button>
        </div>
        <div className="w-full md:w-1/3 h-32 bg-bg-secondary rounded-xl flex items-center justify-center border border-border dashed">
          <span className="text-text-muted">No recent sessions</span>
        </div>
      </div>
    </div>
  );
}

function CoachSession({ mode, onExit }) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hello! I'm your AI Coach for **${mode}**. What would you like to focus on today?`,
    timestamp: Date.now()
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('/api/ai/coach/chat', {
        message: input,
        mode,
        history: messages
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.response,
        suggestions: res.data.suggestions,
        timestamp: Date.now()
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble forcing a connection. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button onClick={onExit} className="text-text-secondary hover:text-white flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <div className="bg-bg-secondary px-3 py-1 rounded-full text-sm font-medium border border-border">
          {mode.toUpperCase()} Coach
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">

        {/* Chat Interface */}
        <div className="glass-panel flex flex-col rounded-2xl overflow-hidden h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-accent' : 'bg-green-500'}`}>
                  {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${msg.role === 'assistant'
                    ? 'bg-bg-secondary border border-border'
                    : 'bg-accent/10 border border-accent/20'
                  }`}>
                  <div className="markdown-content whitespace-pre-wrap">{msg.content}</div>
                  {msg.suggestions && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.suggestions.map((s, idx) => (
                        <button key={idx} onClick={() => setInput(s)}
                          className="text-xs border border-accent/30 rounded-full px-2 py-1 hover:bg-accent/10 transition-colors text-accent">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-accent flex-center">
                  <Bot size={16} />
                </div>
                <div className="bg-bg-secondary p-3 rounded-xl border border-border flex items-center gap-2 text-text-muted text-sm">
                  <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-border bg-bg-secondary/30 backdrop-blur-md">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask a question..."
                className="w-full bg-bg-primary border border-border rounded-xl py-3 pl-4 pr-12 focus:border-accent outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Workspace (Code/Canvas) */}
        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full bg-[#1e1e1e]">
          <div className="flex items-center justify-between p-3 border-b border-white/10 bg-[#2d2d2d]">
            <span className="text-xs font-mono text-text-secondary flex items-center gap-2">
              <Code size={14} /> SCRATCHPAD.js
            </span>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-white/10 rounded"><Play size={14} className="text-green-400" /></button>
            </div>
          </div>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue="// Use this scratchpad to test code examples or take notes during your coaching session.\n\nfunction example() {\n  console.log('Hello from AI Coach!');\n}\n"
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16 }
            }}
          />
        </div>
      </div>
    </div>
  );
}
