import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Code, Zap, CheckCircle, ChevronDown, ChevronUp, Clock, Target } from 'lucide-react';
import axios from 'axios';

export default function AIModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState(null);
  const [activeTab, setActiveTab] = useState('theory');
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModuleData();
  }, [moduleId]);

  const fetchModuleData = async () => {
    try {
      const response = await axios.get('/api/user/learning-paths/ai');
      const modules = response.data.modules || response.data?.modules;
      const module = modules.find(m => m.id === moduleId);
      setModuleData(module);
    } catch (error) {
      console.error('Error fetching module data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-text-muted animate-pulse">Loading Module...</p>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="container py-20 text-center animate-fade-up">
        <div className="inline-block p-6 rounded-full bg-white/5 mb-6">
          <BookOpen size={48} className="text-text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Module Not Found</h2>
        <p className="text-text-secondary mb-8">The module you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/dashboard/learning-path/ai')}
          className="btn btn-primary"
        >
          Back to AI Learning Path
        </button>
      </div>
    );
  }

  const problems = Array.isArray(moduleData.problems) ? moduleData.problems : [];

  return (
    <div className="container py-10 px-6 max-w-[1200px] animate-fade-up">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/learning-path/ai')}
        className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8 group"
      >
        <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
          <ArrowLeft size={16} />
        </div>
        <span>Back to AI Learning Path</span>
      </button>

      {/* Module Header */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl mb-10 border border-white/10 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-br from-rose-500 to-pink-600 opacity-15 blur-3xl pointer-events-none rounded-full"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-rose-500/10 text-rose-400 border-rose-500/20">
              AI & ML
            </span>
            {moduleData.estimatedTime && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-white/5 text-text-secondary border-white/10 flex items-center gap-1.5">
                <Clock size={12} /> {moduleData.estimatedTime}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {moduleData.title}
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl leading-relaxed mb-8">
            {moduleData.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {moduleData.topics.map((topic, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-[#0a0a0c] text-gray-400 border border-white/5 text-xs font-medium hover:text-white transition-colors"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-white/10 pb-0">
        {[
          { id: 'theory', label: 'Theory', icon: <BookOpen size={16} /> },
          { id: 'problems', label: 'Problems', icon: <Code size={16} /> },
          { id: 'patterns', label: 'Patterns', icon: <Zap size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-[1px] ${activeTab === tab.id
                ? 'border-accent-primary text-white'
                : 'border-transparent text-text-secondary hover:text-white hover:border-white/20'
              }`}
            style={{ background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent', cursor: 'pointer' }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Theory Tab */}
      {activeTab === 'theory' && moduleData.theory && (
        <div className="space-y-6">
          {/* Introduction */}
          <div className="glass-panel rounded-2xl p-8 border border-white/5">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-accent" />
              Introduction
            </h2>
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
              {moduleData.theory.introduction}
            </p>
          </div>

          {/* Key Topics */}
          {moduleData.theory.keyTopics && moduleData.theory.keyTopics.map((topic, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl border border-white/5 overflow-hidden"
            >
              <button
                onClick={() => setExpandedTopic(expandedTopic === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <h3 className="text-lg font-bold text-white">{topic.title}</h3>
                <div className="text-text-secondary">
                  {expandedTopic === idx ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                </div>
              </button>

              {expandedTopic === idx && (
                <div className="px-6 pb-6 pt-0 border-t border-white/5">
                  <div className="text-text-secondary leading-relaxed whitespace-pre-wrap mt-4 mb-5">
                    {topic.content}
                  </div>

                  {topic.example && (
                    <div className="rounded-xl overflow-hidden border border-white/10">
                      <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-xs text-text-muted font-mono uppercase tracking-wider">
                        Example Code
                      </div>
                      <pre className="p-5 bg-[#0a0a0c] text-emerald-300 font-mono text-sm overflow-x-auto leading-relaxed">
                        <code>{topic.example}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Patterns Section */}
          {moduleData.theory.patterns && moduleData.theory.patterns.length > 0 && (
            <div className="glass-panel rounded-2xl p-8 border border-white/5">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap size={20} className="text-amber-400" />
                Common Patterns
              </h2>
              <div className="space-y-4">
                {moduleData.theory.patterns.map((pattern, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-[#0a0a0c]/50 border border-white/5 border-l-4 border-l-accent-primary hover:border-white/10 transition-colors"
                  >
                    <h4 className="text-white font-bold mb-2">{pattern.name}</h4>
                    <p className="text-text-secondary text-sm mb-3">{pattern.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                      <span><strong className="text-text-secondary">Use Case:</strong> {pattern.useCase}</span>
                      {pattern.complexity && <span><strong className="text-text-secondary">Complexity:</strong> {pattern.complexity}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Problems Tab */}
      {activeTab === 'problems' && problems.length > 0 && (
        <div className="space-y-6">
          {problems.map((problem, idx) => (
            <div
              key={problem.id || idx}
              className="glass-panel rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {idx + 1}. {problem.title}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${problem.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : problem.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                    {problem.difficulty}
                  </span>
                </div>
              </div>

              <p className="text-text-secondary mb-6 leading-relaxed">
                {problem.description}
              </p>

              {problem.hints && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Hints</h4>
                  <ul className="space-y-2">
                    {problem.hints.map((hint, i) => (
                      <li key={i} className="flex gap-3 text-sm text-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2 flex-shrink-0"></span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {problem.solution && (
                <details className="group">
                  <summary className="cursor-pointer px-4 py-3 bg-white/5 rounded-xl font-bold text-sm text-white hover:bg-white/[0.08] transition-colors border border-white/5 list-none flex items-center gap-2">
                    <ChevronDown size={16} className="group-open:rotate-180 transition-transform" />
                    View Solution
                  </summary>
                  <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                    <div className="px-4 py-2 bg-white/5 border-b border-white/5 text-xs text-text-muted font-mono uppercase tracking-wider">
                      Solution
                    </div>
                    <pre className="p-5 bg-[#0a0a0c] text-emerald-300 font-mono text-sm overflow-x-auto leading-relaxed">
                      <code>{problem.solution}</code>
                    </pre>
                  </div>
                </details>
              )}

              {problem.testCases && (
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Test Cases</h4>
                  <div className="space-y-2">
                    {problem.testCases.map((testCase, i) => (
                      <div key={i} className="px-4 py-3 bg-[#0a0a0c] rounded-lg border border-white/5 font-mono text-xs text-text-secondary">
                        {typeof testCase === 'string' ? testCase : JSON.stringify(testCase)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="btn btn-primary mt-6 text-sm"
                onClick={() => navigate('/code-practice')}
              >
                <Code size={16} />
                Solve Problem
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'problems' && problems.length === 0 && (
        <div className="glass-panel rounded-2xl p-12 text-center border border-white/5">
          <Code size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Problems Available</h3>
          <p className="text-text-secondary">Problems for this module are coming soon.</p>
        </div>
      )}

      {/* Patterns Tab */}
      {activeTab === 'patterns' && moduleData.theory && moduleData.theory.patterns && (
        <div className="grid gap-6 md:grid-cols-2">
          {moduleData.theory.patterns.map((pattern, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                  <Zap size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">{pattern.name}</h3>
              </div>

              <p className="text-text-secondary text-sm mb-5 leading-relaxed">
                {pattern.description}
              </p>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-[#0a0a0c] border border-white/5">
                  <div className="text-[11px] text-text-muted uppercase tracking-wider font-bold mb-1">Use Case</div>
                  <div className="text-sm text-white font-medium">{pattern.useCase}</div>
                </div>

                {pattern.implementation && (
                  <div className="p-3 rounded-lg bg-[#0a0a0c] border border-white/5">
                    <div className="text-[11px] text-text-muted uppercase tracking-wider font-bold mb-1">Implementation</div>
                    <div className="text-sm text-white font-medium">{pattern.implementation}</div>
                  </div>
                )}

                {pattern.complexity && (
                  <div className="p-3 rounded-lg bg-[#0a0a0c] border border-white/5">
                    <div className="text-[11px] text-text-muted uppercase tracking-wider font-bold mb-1">Complexity</div>
                    <div className="text-sm text-white font-mono">{pattern.complexity}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'patterns' && (!moduleData.theory || !moduleData.theory.patterns) && (
        <div className="glass-panel rounded-2xl p-12 text-center border border-white/5">
          <Zap size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Patterns Available</h3>
          <p className="text-text-secondary">Patterns for this module are coming soon.</p>
        </div>
      )}
    </div>
  );
}
