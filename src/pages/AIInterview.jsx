import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import {
  Play, Mic, Video, MessageSquare, CheckCircle, Clock, Brain,
  AlertCircle, ChevronRight, Settings, Code, Send, X, Terminal,
  Cpu, Zap, Sparkles, Layout
} from 'lucide-react';
import SetupInterviewModal from '../components/SetupInterviewModal';
import { useAuth } from '../context/AuthContext';

export default function AIInterview() {
  const { user } = useAuth();
  const [setupOpen, setSetupOpen] = useState(false);
  const [config, setConfig] = useState({ type: 'technical', difficulty: 'medium', duration: 30 });
  const [isActive, setIsActive] = useState(false);

  // Interview State
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [code, setCode] = useState('// Write your solution here...\n');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatEndRef = useRef(null);

  const interviewTypes = [
    {
      value: 'technical',
      label: 'Technical Interview',
      icon: Terminal,
      desc: 'Data Structures, Algorithms, and System Design problems.',
      color: 'blue'
    },
    {
      value: 'system-design',
      label: 'System Design',
      icon: Layout,
      desc: 'Scalability, Architecture, and High-level design discussions.',
      color: 'purple'
    },
    {
      value: 'behavioral',
      label: 'Behavioral Fit',
      icon: MessageSquare,
      desc: 'Leadership, Culture fit, and Soft skills assessment.',
      color: 'green'
    }
  ];

  const handleStartSetup = (type) => {
    setConfig(prev => ({ ...prev, type }));
    setSetupOpen(true);
  };

  const startInterview = async () => {
    setSetupOpen(false);
    try {
      const response = await axios.post('/api/ai/interview/start', config);
      setCurrentQuestion(response.data.questions[0]);
      setQuestionIndex(0);
      setTimeLeft(config.duration * 60);
      setIsActive(true);
      setResponses([]);
      setChatHistory([{ role: 'ai', content: "Hello! I'm your AI interviewer. I've prepared a question for you. Feel free to ask for clarifications or hints." }]);
    } catch (error) {
      console.error('Error starting interview:', error);
      // Fallback for Demo/Dev mode
      if (error.response && (error.response.status === 403 || error.response.status === 401 || error.response.status === 404)) {
        console.warn("Entering DEMO MODE due to API error");
        setCurrentQuestion({
          question: "Two Sum",
          context: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice."
        });
        setQuestionIndex(0);
        setTimeLeft(config.duration * 60);
        setIsActive(true);
        setResponses([]);
        setChatHistory([{ role: 'ai', content: "Hello! I'm your AI interviewer. I've prepared a sample question for you since we are in demo mode." }]);
      } else {
        alert("Failed to start interview. Please try again.");
      }
    }
  };

  const submitResponse = async () => {
    if (!currentQuestion) return;
    setIsSubmitting(true);

    const newResponse = {
      question: currentQuestion,
      code: code,
      answer: chatMessage,
      timestamp: Date.now()
    };

    const newResponses = [...responses, newResponse];
    setResponses(newResponses);
    setChatMessage('');

    if (questionIndex < 4) {
      try {
        const response = await axios.post('/api/ai/interview/next-question', {
          previousResponses: newResponses,
          type: config.type,
          difficulty: config.difficulty
        });
        setCurrentQuestion(response.data.question);
        setQuestionIndex(prev => prev + 1);
        setChatHistory(prev => [...prev,
        { role: 'user', content: 'Submitted solution.' },
        { role: 'ai', content: "Great. Let's move to the next question." }
        ]);
        setCode('// Write your solution here...\n');
      } catch (error) {
        console.error('Error fetching next question:', error);
        // Fallback demo logic
        setCurrentQuestion({ question: "Next Demo Question", context: "This is a placeholder for the next question." });
        setQuestionIndex(prev => prev + 1);
      }
    } else {
      endInterview(newResponses);
    }
    setIsSubmitting(false);
  };

  const endInterview = async (finalResponses) => {
    try {
      const response = await axios.post('/api/ai/interview/complete', {
        ...config,
        responses: finalResponses
      });
      setIsActive(false);
      window.location.href = `/interview-results/${response.data.interviewId}`;
    } catch (error) {
      console.error('Error ending interview:', error);
      // Fallback
      alert("Interview finished! (Demo mode: results not saved)");
      setIsActive(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  // Timer Effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endInterview(responses);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isActive, timeLeft]);

  if (isActive) {
    return (
      <div className="h-[calc(100vh-var(--navbar-height))] bg-bg-primary overflow-hidden flex flex-col">
        {/* Interview Header */}
        <div className="h-16 border-b border-white/5 bg-bg-secondary px-6 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${config.type === 'technical' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' :
                  config.type === 'system-design' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]' :
                    'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                }`}></span>
              {config.type.charAt(0).toUpperCase() + config.type.slice(1)} Interview
            </h2>
            <div className="px-3 py-1 rounded-full bg-white/5 text-text-secondary text-xs font-medium border border-white/10 capitalize flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${config.difficulty === 'easy' ? 'bg-emerald-400' :
                  config.difficulty === 'medium' ? 'bg-amber-400' :
                    'bg-rose-400'
                }`}></span>
              {config.difficulty}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 font-mono text-lg font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/5 ${timeLeft < 300 ? 'text-rose-500 animate-pulse bg-rose-500/10 border-rose-500/20' : 'text-gray-300'}`}>
              <Clock size={16} />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={() => window.confirm('Are you sure you want to end the interview?') && endInterview(responses)}
              className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-colors border border-red-500/20 flex items-center gap-2"
            >
              <X size={16} /> End Session
            </button>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">

          {/* Left: Problem Statement */}
          <div className="col-span-3 border-r border-white/5 bg-bg-secondary flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/2">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle size={12} /> Progress
              </h3>
              <div className="flex gap-1.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < questionIndex ? 'bg-emerald-500' : i === questionIndex ? 'bg-accent-primary animate-pulse' : 'bg-white/10'}`}></div>
                ))}
              </div>
              <div className="text-xs text-text-secondary text-right font-medium">Question {questionIndex + 1} of 5</div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <h1 className="text-xl font-bold text-white mb-6 leading-tight">{currentQuestion?.question}</h1>

              <div className="prose prose-invert prose-sm max-w-none">
                <div className="bg-white/5 p-5 rounded-xl border border-white/5 mb-6 shadow-inner">
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {currentQuestion?.context || 'No specific context provided. Solve the problem based on the description.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-400" /> Hints
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex gap-3 items-start text-sm text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2 shrink-0 shadow-[0_0_5px_rgba(99,102,241,0.5)]"></span>
                      <span className="leading-relaxed">Consider edge cases with empty inputs to ensure robustness.</span>
                    </li>
                    <li className="flex gap-3 items-start text-sm text-text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2 shrink-0 shadow-[0_0_5px_rgba(99,102,241,0.5)]"></span>
                      <span className="leading-relaxed">Analyze time complexity before coding. Can you optimize O(n²)?</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Code Editor */}
          <div className="col-span-6 flex flex-col bg-[#1e1e1e]">
            <div className="h-10 border-b border-white/5 bg-[#1e1e1e] flex items-center px-4 justify-between shrink-0">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <Code size={14} className="text-blue-400" /> JavaScript Environment
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCode('// Write your solution here...\n')}
                  className="text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10 font-medium"
                >
                  Reset Template
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 20 },
                  fontFamily: "'JetBrains Mono', monospace",
                  renderLineHighlight: 'line',
                  contextmenu: true
                }}
              />
            </div>
            <div className="p-4 border-t border-white/5 bg-[#1e1e1e] flex justify-between items-center">
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <Terminal size={14} /> Console Ready
              </div>
              <button
                onClick={submitResponse}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-violet text-white font-medium flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/40 hover:scale-[1.02]"
              >
                {isSubmitting ? <span className="animate-spin">⌛</span> : <Play size={16} fill="currentColor" />}
                Run & Submit
              </button>
            </div>
          </div>

          {/* Right: AI Interviewer Chat */}
          <div className="col-span-3 border-l border-white/5 bg-bg-secondary flex flex-col">
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/2 backdrop-blur-sm">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                  <Brain size={20} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-bg-secondary rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Interviewer</h3>
                <p className="text-[10px] text-emerald-400 font-medium tracking-wide uppercase flex items-center gap-1">
                  <Zap size={10} fill="currentColor" /> Online
                </p>
              </div>
              <div className="ml-auto">
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors">
                  <Settings size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-bg-secondary/50">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'bg-accent-primary text-white rounded-tr-none shadow-[0_2px_8px_rgba(99,102,241,0.25)]'
                    : 'bg-[#1e1e24] text-gray-200 rounded-tl-none border border-white/10'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-white/5 bg-bg-secondary">
              <div className="relative">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask for a hint or clarify..."
                  className="w-full bg-[#1e1e24] border border-white/10 rounded-xl pl-4 pr-12 py-3.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-primary/50 focus:bg-[#25252b] transition-all shadow-inner"
                  onKeyDown={(e) => e.key === 'Enter' && setChatHistory(prev => [...prev, { role: 'user', content: chatMessage }, { role: 'ai', content: "I see. Could you explain your thought process regarding the time complexity?" }])}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Mic size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (chatMessage.trim()) {
                        setChatHistory(prev => [...prev, { role: 'user', content: chatMessage }, { role: 'ai', content: "I see. Could you explain your thought process regarding the time complexity?" }]);
                        setChatMessage('');
                      }
                    }}
                    className="p-1.5 rounded-lg text-accent-primary hover:bg-accent-primary/10 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard / Category Selection
  return (
    <div className="container py-20 px-6 max-w-[1600px]">
      <SetupInterviewModal
        isOpen={setupOpen}
        onClose={() => setSetupOpen(false)}
        onStart={startInterview}
        config={config}
      />

      <div className="text-center mb-16 animate-fade-up">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
          AI Interview Simulation
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Experience a realistic interview environment. Our AI adapts to your responses,
          provides real-time hints, and evaluates your performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-fade-up delay-100 max-w-6xl mx-auto">
        {interviewTypes.map((type) => {
          const Icon = type.icon;
          const configColors = {
            blue: { bg: 'bg-blue-500', glow: 'shadow-blue-500/20', border: 'hover:border-blue-500/40' },
            purple: { bg: 'bg-purple-500', glow: 'shadow-purple-500/20', border: 'hover:border-purple-500/40' },
            green: { bg: 'bg-emerald-500', glow: 'shadow-emerald-500/20', border: 'hover:border-emerald-500/40' }
          };
          const colors = configColors[type.color];

          return (
            <div
              key={type.value}
              onClick={() => handleStartSetup(type.value)}
              className="group relative cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-${type.color}-500 to-${type.color}-700 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 rounded-3xl`}></div>
              <div className={`relative h-full glass-panel p-8 rounded-3xl border border-white/10 ${colors.border} bg-[#0a0a0c] transition-all duration-300 group-hover:-translate-y-2`}>
                <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-8 shadow-lg ${colors.glow} transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={28} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">{type.label}</h3>
                <p className="text-text-secondary mb-8 leading-relaxed h-12 text-sm">
                  {type.desc}
                </p>

                <div className="flex items-center text-white font-medium text-sm group-hover:gap-2 transition-all">
                  Start Simulation <ChevronRight size={16} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Section with Glassmorphism */}
      <div className="glass-panel p-10 rounded-3xl border border-white/5 relative overflow-hidden animate-fade-up delay-200 max-w-6xl mx-auto">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Brain size={250} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Performance Analytics</h3>
            <p className="text-text-secondary max-w-md text-sm leading-relaxed">
              Track your progress over time. We analyze your code quality,
              communication skills, and problem-solving speed to give you detailed insights.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">12</div>
              <div className="text-xs text-text-secondary uppercase tracking-wider font-bold">Interviews</div>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-1">8.5</div>
              <div className="text-xs text-text-secondary uppercase tracking-wider font-bold">Avg Score</div>
            </div>
            <div className="w-px h-16 bg-white/10 hidden md:block"></div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-1">85%</div>
              <div className="text-xs text-text-secondary uppercase tracking-wider font-bold">Success</div>
            </div>
          </div>

          <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all hover:scale-105">
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
}
