import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Code, CheckCircle, Circle, Lock, BookOpen, Video, FileText,
  Clock, Target, Award, TrendingUp, Zap, Star, ChevronRight,
  ChevronDown, ChevronUp, PlayCircle, Download, Share2,
  BookMarked, Lightbulb, AlertCircle, ExternalLink, Users, Calendar
} from 'lucide-react';

export default function DSALearningPath() {
  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('intermediate');
  const [showResources, setShowResources] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLearningPath();
  }, []);

  const fetchLearningPath = async () => {
    try {
      const response = await axios.get('/api/user/learning-path/dsa');
      setPathData(response.data);
    } catch (error) {
      console.error('Error fetching learning path:', error);
      // Fallback mock data if API fails
      setPathData({
        title: 'Advanced Data Structures & Algorithms',
        description: 'Master the core concepts of DSA to crack coding interviews at top tech companies.',
        difficulty: 'Advanced',
        duration: '12 Weeks',
        totalModules: 8,
        modules: Array(8).fill({
          id: 1,
          title: 'Arrays & Hashing',
          description: 'Learn how to store and access data efficiently.',
          problemCount: 15,
          estimatedTime: '1 Week',
          difficulty: 'Easy',
          topics: ['Array', 'Hash Table', 'Prefix Sum'],
          unlocked: true,
          progress: { solved: 5, total: 15, percentage: 33 },
          studyMaterials: [
            { title: 'Array Basics', type: 'article', duration: '10 min', difficulty: 'Easy' },
            { title: 'Hashing Techniques', type: 'video', duration: '25 min', difficulty: 'Medium' }
          ],
          keyProblems: [
            { id: 1, title: 'Two Sum' },
            { id: 2, title: 'Contains Duplicate' }
          ]
        }).map((m, i) => ({ ...m, id: i + 1, title: `Module ${i + 1}: ${['Arrays', 'Pointers', 'Sliding Window', 'Stack', 'Binary Search', 'Linked List', 'Trees', 'Graphs'][i] || 'Topic'}` })),
        studyPlan: {
          beginner: { duration: '16 Weeks', hoursPerWeek: '10 hrs', weeklyGoals: '1 Module' },
          intermediate: { duration: '12 Weeks', hoursPerWeek: '15 hrs', weeklyGoals: '1.5 Modules' },
          advanced: { duration: '8 Weeks', hoursPerWeek: '20 hrs', weeklyGoals: '2 Modules' }
        },
        overview: {
          outcomes: [
            'Master all major data structures',
            'Analyze time and space complexity',
            'Solve 150+ LeetCode problems',
            'Pattern recognition for interviews'
          ]
        },
        resources: {
          books: [{ title: 'Cracking the Coding Interview', author: 'Gayle Laakmann McDowell', description: 'The bible of coding interviews.' }],
          websites: [{ name: 'LeetCode', url: 'https://leetcode.com', description: 'Practice problems.' }],
          videos: [{ title: 'Dynamic Programming', instructor: 'FreeCodeCamp', duration: '5 hrs', difficulty: 'Hard' }]
        },
        tips: {
          general: ['Consistency is key.', 'Understand, don\'t memorize.'],
          beforeInterview: ['Review patterns.', 'Mock interviews.'],
          duringInterview: ['Think out loud.', 'Clarify requirements.']
        },
        faqs: [
          { question: 'Prerequisites?', answer: 'Basic programming knowledge.' },
          { question: 'Language?', answer: 'Any language is fine, Python/Java recommended.' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColorClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'article': return <FileText size={16} />;
      case 'reading': return <BookOpen size={16} />;
      case 'practice': return <Code size={16} />;
      case 'interactive': return <PlayCircle size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-text-muted animate-pulse">Loading Path...</p>
      </div>
    );
  }

  if (!pathData) return null;

  const totalProblems = pathData.modules.reduce((acc, m) => acc + (m.problemCount || 0), 0);
  const solvedProblems = pathData.modules.reduce((acc, m) => acc + (m.progress?.solved || 0), 0);
  const overallProgress = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

  return (
    <div className="container py-10 px-6 max-w-[1400px] animate-fade-up">
      {/* Hero Section */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl mb-10 border border-white/10 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-3xl pointer-events-none rounded-full"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getDifficultyColorClass(pathData.difficulty)}`}>
              {pathData.difficulty}
            </span>
            <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-white/5 text-text-secondary border-white/10 flex items-center gap-2">
              <Clock size={12} /> {pathData.duration}
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-sm">
            {pathData.title}
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl leading-relaxed mb-10 font-light">
            {pathData.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="flex items-center gap-3 text-text-secondary">
              <Code size={20} className="text-accent-primary" />
              <span className="font-medium text-white">{totalProblems} Problems</span>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <BookOpen size={20} className="text-accent-secondary" />
              <span className="font-medium text-white">{pathData.totalModules} Modules</span>
            </div>
            <div className="flex items-center gap-3 text-text-secondary">
              <Target size={20} className="text-emerald-400" />
              <span className="font-medium text-white">{overallProgress}% Complete</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="mt-3 text-sm font-medium text-text-muted text-right">
            {solvedProblems} / {totalProblems} problems solved
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8">
        {/* Main Content */}
        <div className="space-y-10">

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {pathData.modules.filter(m => (m.progress?.percentage || 0) === 100).length}
                  </div>
                  <div className="text-xs text-text-muted uppercase font-bold tracking-wider">Completed</div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                  <Zap size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {pathData.modules.filter(m => (m.progress?.solved || 0) > 0).length}
                  </div>
                  <div className="text-xs text-text-muted uppercase font-bold tracking-wider">In Progress</div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                  <Award size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {overallProgress}%
                  </div>
                  <div className="text-xs text-text-muted uppercase font-bold tracking-wider">Total Progress</div>
                </div>
              </div>
            </div>
          </div>

          {/* Modules List */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5">
                <Code size={20} />
              </div>
              Learning Modules
            </h2>

            <div className="space-y-4">
              {pathData.modules.map((module, idx) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  index={idx}
                  isExpanded={expandedModule === module.id}
                  onToggle={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                  getDifficultyColorClass={getDifficultyColorClass}
                  getIconForType={getIconForType}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">

          {/* Study Plan */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-accent-primary" /> Study Plan
            </h3>

            <div className="space-y-3">
              {['beginner', 'intermediate', 'advanced'].map(level => {
                const plan = pathData.studyPlan[level];
                const isSelected = selectedLevel === level;

                return (
                  <div
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelected
                        ? 'bg-accent-primary/10 border-accent-primary/40'
                        : 'bg-white/5 border-transparent hover:bg-white/10'
                      }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className={`font-bold capitalize ${isSelected ? 'text-accent-primary' : 'text-white'}`}>
                        {level}
                      </h4>
                      {isSelected && <CheckCircle size={16} className="text-accent-primary" />}
                    </div>
                    <div className="space-y-1 text-xs text-text-secondary">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="text-white">{plan.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time/Week:</span>
                        <span className="text-white">{plan.hoursPerWeek}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outcomes */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Star size={18} className="text-amber-400" /> Outcomes
            </h3>
            <ul className="space-y-4">
              {pathData.overview.outcomes.map((outcome, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-text-secondary">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_5px_currentColor]"></div>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Toggle */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-white/[0.02]">
            <div
              onClick={() => setShowResources(!showResources)}
              className="flex items-center justify-between cursor-pointer group"
            >
              <h3 className="text-lg font-bold text-white flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                <BookMarked size={18} /> Resources
              </h3>
              {showResources ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {showResources && (
              <div className="mt-6 space-y-6 animate-fade-in">
                <div>
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Top Books</h4>
                  <div className="space-y-3">
                    {pathData.resources.books.slice(0, 2).map((book, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5 text-sm">
                        <div className="font-bold text-white mb-1">{book.title}</div>
                        <div className="text-xs text-text-muted">{book.author}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Links</h4>
                  <div className="space-y-2">
                    {pathData.resources.websites.map((site, i) => (
                      <a
                        key={i}
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline p-2 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <ExternalLink size={14} /> {site.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Module Card Component
function ModuleCard({ module, index, isExpanded, onToggle, getDifficultyColorClass, getIconForType, navigate }) {
  const progress = module.progress || { solved: 0, total: 0, percentage: 0 };
  const isCompleted = progress.percentage === 100;

  return (
    <div className={`glass-panel rounded-2xl overflow-hidden border transition-all duration-300 ${isCompleted ? 'border-emerald-500/30' : 'border-white/5 hover:border-white/20'
      }`}>

      {/* Header */}
      <div
        onClick={onToggle}
        className={`p-6 cursor-pointer transition-colors ${isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.02]'}`}
      >
        <div className="flex items-start gap-5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg shadow-inner ${isCompleted
              ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
              : 'bg-white/5 text-white ring-1 ring-white/10'
            }`}>
            {isCompleted ? <CheckCircle size={24} /> : index + 1}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{module.title}</h3>
                <p className="text-sm text-text-secondary line-clamp-1">{module.description}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                {isExpanded ? <ChevronUp size={20} className="text-text-muted" /> : <ChevronDown size={20} className="text-text-muted" />}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-text-muted mt-4">
              <span className="flex items-center gap-1.5"><Code size={14} /> {module.problemCount} Problems</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {module.estimatedTime}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${getDifficultyColorClass(module.difficulty)} bg-transparent border`}>
                {module.difficulty}
              </span>
            </div>

            {/* Mini Progress */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <span className="text-xs text-text-secondary font-mono">{progress.percentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Body */}
      {isExpanded && (
        <div className="border-t border-white/5 bg-black/20 p-6 animate-fade-in">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Topics</h4>
              <div className="flex flex-wrap gap-2">
                {module.topics.map((topic, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-[#0a0a0c] border border-white/10 text-gray-300 text-xs hover:border-white/20 transition-colors cursor-default">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {module.keyProblems && (
              <div>
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Key Problems</h4>
                <div className="space-y-2">
                  {module.keyProblems.map((prob, i) => (
                    <div
                      key={i}
                      onClick={() => navigate(`/problems/${prob.id}`)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
                    >
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
                        <Star size={14} className="text-amber-500/50 group-hover:text-amber-400" />
                        {prob.title}
                      </span>
                      <ChevronRight size={14} className="text-white/20 group-hover:text-white/60" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
            <button
              onClick={() => navigate('/dsa-patterns-sheet')}
              className="btn btn-primary px-6 py-2.5 shadow-lg shadow-accent-primary/20"
            >
              Start Module <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
