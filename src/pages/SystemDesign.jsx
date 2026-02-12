import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Lightbulb, Loader, Server, Database, Cloud, Shield, Globe, Cpu,
  Layers, MessageSquare, Save, Terminal, TrendingUp, CheckCircle,
  AlertTriangle, MousePointer2, Box, ArrowRight
} from 'lucide-react';

export default function SystemDesign() {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [design, setDesign] = useState('');
  const [components, setComponents] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/api/system-design/topics');
      setTopics(response.data.topics);
      if (response.data.topics.length > 0) {
        setSelectedTopic(response.data.topics[0]);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      // Fallback data
      setTopics([
        { id: 'url-shortener', title: 'Design a URL Shortener', difficulty: 'Beginner', description: 'Design a system like Bit.ly that takes long URLs and returns short aliases.', estimations: 'Traffic: 100M new URLs/month, 100:1 read/write ratio.' },
        { id: 'chat-app', title: 'Design WhatsApp', difficulty: 'Intermediate', description: 'Design a real-time messaging application with 1-on-1 and group chat features.', estimations: 'DAU: 500M, Messages: 50B/day.' },
        { id: 'instagram', title: 'Design Instagram', difficulty: 'Advanced', description: 'Design a photo-sharing social network with news feed generation.', estimations: 'DAU: 500M, Photos: 100M/day.' },
        { id: 'uber', title: 'Design Uber Backend', difficulty: 'Advanced', description: 'Design a ride-sharing platform connecting riders with drivers in real-time.', estimations: 'Rides: 1M/day, Drivers: 500k active.' },
      ]);
      setSelectedTopic({
        id: 'url-shortener', title: 'Design a URL Shortener', difficulty: 'Beginner', description: 'Design a system like Bit.ly that takes long URLs and returns short aliases.', estimations: 'Traffic: 100M new URLs/month, 100:1 read/write ratio.'
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleGetFeedback = async () => {
    if (!selectedTopic || !design) {
      alert('Please select a topic and describe your design');
      return;
    }

    setLoading(true);
    setFeedback(null);

    // Simulate API call delay for better UX feel (or actual call)
    try {
      const response = await axios.post('/api/system-design/feedback', {
        topicId: selectedTopic.id,
        design,
        components
      });
      setFeedback(response.data.feedback);
    } catch (error) {
      // Mock feedback for demo if API fails
      setTimeout(() => {
        setFeedback({
          score: 85,
          strengths: ['Good choice of NoSQL for high write throughput', 'Cache layer implementation is correct', 'API Gateway usage is appropriate'],
          improvements: ['Consider adding a Bloom Filter for quick lookups', 'Discuss data retention policy'],
          detailedFeedback: 'Your design handles the core requirements well. The separation of read and write paths is a good practice for this read-heavy system. However, you missed handling hash collisions in your generation service logic. Consider how you would handle unique ID generation at scale.'
        });
        setLoading(false);
      }, 2000);
    }
  };

  const availableComponents = [
    { name: 'Load Balancer', icon: <Layers size={14} /> },
    { name: 'API Gateway', icon: <Globe size={14} /> },
    { name: 'Application Server', icon: <Server size={14} /> },
    { name: 'Database (SQL)', icon: <Database size={14} /> },
    { name: 'Database (NoSQL)', icon: <Database size={14} /> },
    { name: 'Cache (Redis)', icon: <Cpu size={14} /> },
    { name: 'CDN', icon: <Cloud size={14} /> },
    { name: 'Message Queue', icon: <Terminal size={14} /> },
    { name: 'File Storage', icon: <Save size={14} /> },
    { name: 'Search Engine', icon: <Globe size={14} /> },
    { name: 'Auth Service', icon: <Shield size={14} /> },
  ];

  const toggleComponent = (componentName) => {
    setComponents(prev =>
      prev.includes(componentName)
        ? prev.filter(c => c !== componentName)
        : [...prev, componentName]
    );
  };

  if (dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-text-muted animate-pulse">Loading System Design Studio...</p>
      </div>
    );
  }

  return (
    <div className="container py-10 px-6 max-w-[1600px] animate-fade-up">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
          System Design Studio
        </h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          Architect scalable systems on our interactive canvas and get instant AI feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Sidebar: Topics & Components */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col h-[500px]">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 sticky top-0 bg-transparent backdrop-blur-md z-10 pb-2 border-b border-white/5">
              <Layers size={18} className="text-accent-primary" /> Select Scenario
            </h2>
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {topics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setFeedback(null);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${selectedTopic?.id === topic.id
                    ? 'bg-accent-primary/10 border-accent-primary/40 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                    : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-semibold transition-colors ${selectedTopic?.id === topic.id ? 'text-accent-primary' : 'text-white group-hover:text-accent-primary'}`}>
                      {topic.title}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border ${topic.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      topic.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <TrendingUp size={12} />
                    {topic.estimations ? 'High Scale' : 'Standard'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Box size={18} className="text-accent-secondary" /> Toolbox
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {availableComponents.map((comp) => (
                <button
                  key={comp.name}
                  onClick={() => toggleComponent(comp.name)}
                  className={`flex items-center gap-2 p-3 rounded-lg text-xs font-medium transition-all border ${components.includes(comp.name)
                    ? 'bg-accent-secondary/20 border-accent-secondary/40 text-accent-secondary shadow-[0_0_10px_rgba(236,72,153,0.15)]'
                    : 'bg-white/5 border-transparent text-text-secondary hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {comp.icon}
                  {comp.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content: Design Area */}
        <div className="lg:col-span-9 space-y-6">
          {selectedTopic ? (
            <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden relative min-h-[700px] flex flex-col">
              {/* Background Grid Pattern */}
              <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />

              <div className="relative z-10 p-8 flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/5 pb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                      {selectedTopic.title}
                      <span className={`text-xs px-3 py-1 rounded-full border ${selectedTopic.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        selectedTopic.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                        {selectedTopic.difficulty}
                      </span>
                    </h2>
                    <p className="text-text-secondary text-lg">
                      {selectedTopic.description}
                    </p>
                  </div>

                  {selectedTopic.estimations && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-w-sm backdrop-blur-sm">
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                        <TrendingUp size={14} className="text-accent-primary" /> Scale Constraints
                      </h4>
                      <p className="text-white font-mono text-xs leading-relaxed">
                        {selectedTopic.estimations}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Terminal size={18} className="text-accent-primary" /> Architecture Definition
                    </h3>

                    {components.length > 0 && (
                      <div className="flex flex-wrap gap-2 max-w-md justify-end">
                        {components.map(c => (
                          <span key={c} className="text-[10px] bg-accent-secondary/10 border border-accent-secondary/20 px-2 py-1 rounded text-accent-secondary font-medium whitespace-nowrap">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="relative flex-1 min-h-[400px]">
                    <textarea
                      className="w-full h-full bg-[#0d0d11]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-gray-200 focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/50 transition-all font-mono text-sm leading-relaxed resize-none custom-scrollbar"
                      value={design}
                      onChange={(e) => setDesign(e.target.value)}
                      placeholder={`Draft your system architecture here...

1. High Level Design
   - Client -> Load Balancer -> Service Cluster
   
2. Data Model
   - User Table (SQL): id, name, email...
   
3. Key Components
   - Redis for caching hot data...
   - Kafka for async processing...`}
                    />

                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <div className="text-xs text-text-muted bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 backdrop-blur-md">
                        {design.length} chars
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleGetFeedback}
                      disabled={loading || !design}
                      className={`px-8 py-3 rounded-xl font-bold text-md flex items-center justify-center gap-3 transition-all ${loading || !design
                        ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-accent-primary to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white hover:scale-[1.02]'
                        }`}
                    >
                      {loading ? (
                        <>
                          <Loader size={18} className="animate-spin" />
                          Analyzing Architecture...
                        </>
                      ) : (
                        <>
                          <Lightbulb size={18} />
                          Review Architecture
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center h-[600px] relative overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                  backgroundSize: '32px 32px'
                }}
              />
              <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-text-muted relative z-10 group hover:scale-110 transition-transform duration-500">
                <MousePointer2 size={40} className="group-hover:text-accent-primary transition-colors duration-300" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2 relative z-10">Select a Challenge</h3>
              <p className="text-text-secondary max-w-sm relative z-10 mb-8">
                Choose a system design scenario from the left panel to begin architecting your solution.
              </p>

              <div className="flex gap-4 relative z-10">
                <div className="flex items-center gap-2 text-xs text-text-muted bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <Box size={14} /> Drag & Drop (Coming Soon)
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <Cpu size={14} /> AI Powered
                </div>
              </div>
            </div>
          )}

          {/* Feedback Section */}
          {feedback && (
            <div className="glass-panel p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1e1e24] to-[#0f0f13] animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Lightbulb size={200} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      AI Architect Review
                    </h3>
                    <p className="text-text-secondary text-sm mt-1">Analysis based on modern scalability patterns</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Overall Score</div>
                      <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-cyan">
                        {feedback.score}/100
                      </div>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                      <svg className="absolute inset-0 transform -rotate-90" width="64" height="64">
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-accent-primary" strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * feedback.score) / 100} />
                      </svg>
                      <span className="text-sm font-bold text-white">{feedback.score}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {feedback.strengths && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 hover:bg-emerald-500/10 transition-colors">
                      <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                        <CheckCircle size={18} /> Strengths
                      </h4>
                      <ul className="space-y-3">
                        {feedback.strengths.map((s, i) => (
                          <li key={i} className="text-emerald-200/90 text-sm flex gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 shadow-[0_0_5px_currentColor]" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feedback.improvements && (
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 hover:bg-amber-500/10 transition-colors">
                      <h4 className="text-amber-400 font-bold mb-4 flex items-center gap-2">
                        <AlertTriangle size={18} /> Areas for Improvement
                      </h4>
                      <ul className="space-y-3">
                        {feedback.improvements.map((s, i) => (
                          <li key={i} className="text-amber-200/90 text-sm flex gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 shadow-[0_0_5px_currentColor]" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                    <MessageSquare size={18} className="text-accent-violet" /> Detailed Analysis
                  </h4>
                  <p className="text-gray-300 text-sm leading-7">
                    {feedback.detailedFeedback}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
