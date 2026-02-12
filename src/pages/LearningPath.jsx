import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CheckCircle, Circle, Lock, Book, Code, Award, TrendingUp, Calendar,
  BookOpen, ChevronRight, Zap, Target, Star, Layout, Brain, Terminal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LearningPath() {
  const [paths, setPaths] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchLearningPaths();
    fetchUserProgress();
  }, []);

  const fetchLearningPaths = async () => {
    try {
      const response = await axios.get('/api/user/learning-paths');
      setPaths(response.data.paths);
    } catch (error) {
      console.error('Error fetching learning paths:', error);
      setPaths(getDefaultPaths());
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get('/api/user/progress');
      setUserProgress(response.data.progress);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const getDefaultPaths = () => [
    {
      id: 'dsa-basics',
      title: 'DSA Basics',
      description: 'Build a rock-solid foundation in data structures and algorithms from scratch.',
      duration: '6-8 weeks',
      difficulty: 'Beginner',
      icon: Code,
      color: 'green',
      modules: Array(6).fill({ unlocked: false }).map((_, i) => ({ id: i + 1 }))
    },
    {
      id: 'dsa',
      title: 'Advanced DSA',
      description: 'Master complex algorithms and optimization techniques for top-tier interviews.',
      duration: '10-12 weeks',
      difficulty: 'Advanced',
      icon: Terminal,
      color: 'blue',
      modules: Array(8).fill({ unlocked: false }).map((_, i) => ({ id: i + 1 }))
    },
    {
      id: 'hld',
      title: 'System Design (HLD)',
      description: 'Architect scalable, distributed systems like a senior engineer.',
      duration: '8-10 weeks',
      difficulty: 'Advanced',
      icon: Layout,
      color: 'purple',
      modules: Array(5).fill({ unlocked: false }).map((_, i) => ({ id: i + 1 }))
    },
    {
      id: 'lld',
      title: 'Object-Oriented Design (LLD)',
      description: 'Master design patterns, SOLID principles, and clean code architecture.',
      duration: '6-8 weeks',
      difficulty: 'Intermediate',
      icon: Box, // Placeholder, defined below
      color: 'amber',
      modules: Array(5).fill({ unlocked: false }).map((_, i) => ({ id: i + 1 }))
    },
    {
      id: 'ai',
      title: 'AI & Machine Learning',
      description: 'Deep dive into neural networks, deep learning, and modern AI applications.',
      duration: '10-12 weeks',
      difficulty: 'Advanced',
      icon: Brain,
      color: 'rose',
      modules: Array(6).fill({ unlocked: false }).map((_, i) => ({ id: i + 1 }))
    },
    {
      id: 'data-science',
      title: 'Data Science',
      description: 'Master statistics, Python, and ML algorithms for data-driven roles.',
      duration: '8-10 weeks',
      difficulty: 'Intermediate',
      icon: TrendingUp,
      color: 'cyan',
      modules: Array(5).fill({ unlocked: false }).map((_, i) => ({ id: i + 1 }))
    },
    {
      id: 'pm',
      title: 'Product Management',
      description: 'Learn product sense, strategy, and execution for PM roles.',
      duration: '6-8 weeks',
      difficulty: 'Intermediate',
      icon: Target,
      color: 'orange',
      modules: Array(4).fill({ unlocked: false }).map((_, i) => ({ id: i + 1 }))
    }
  ];

  // Helper component for LLD icon since Box isn't imported from lucide-react directly in some versions or I missed it
  const Box = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
  );

  const calculateProgress = (path) => {
    const completedModules = path.modules.filter(m =>
      userProgress[`module_${m.id}`]?.completed
    ).length;

    // Mock progress for visuals
    if (path.id === 'dsa-basics') return 45;
    if (path.id === 'dsa') return 20;

    return Math.round((completedModules / path.modules.length) * 100) || 0;
  };

  const viewPathDetails = (path) => {
    navigate(`/dashboard/learning-path/${path.id}`);
  };

  const getColorClasses = (color) => {
    const colors = {
      green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', gradient: 'from-emerald-500 to-teal-600', hoverBorder: 'group-hover:border-emerald-500/40' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', gradient: 'from-blue-500 to-indigo-600', hoverBorder: 'group-hover:border-blue-500/40' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', gradient: 'from-purple-500 to-violet-600', hoverBorder: 'group-hover:border-purple-500/40' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', gradient: 'from-amber-500 to-orange-600', hoverBorder: 'group-hover:border-amber-500/40' },
      rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', gradient: 'from-rose-500 to-pink-600', hoverBorder: 'group-hover:border-rose-500/40' },
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', gradient: 'from-cyan-500 to-sky-600', hoverBorder: 'group-hover:border-cyan-500/40' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', gradient: 'from-orange-500 to-red-600', hoverBorder: 'group-hover:border-orange-500/40' },
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-text-muted animate-pulse">Loading Your Journey...</p>
      </div>
    );
  }

  return (
    <div className="container py-16 px-6 max-w-[1600px] animate-fade-up">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
          Learning Paths
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Master your target role with structured, expert-curated paths.
          From basics to advanced system design, we guide every step of your journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-20">
        {paths.map((path, index) => {
          const colors = getColorClasses(path.color || 'blue');
          const Icon = path.icon || BookOpen;
          const progress = calculateProgress(path);

          return (
            <div
              key={path.id}
              onClick={() => viewPathDetails(path)}
              className="group relative cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-15 blur-2xl transition-all duration-500 rounded-3xl -z-10`}></div>

              <div className={`glass-panel p-8 rounded-3xl h-full border border-white/10 ${colors.hoverBorder} transition-all duration-300 relative overflow-hidden group-hover:-translate-y-2`}>

                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors.bg} ${colors.text} shadow-lg ring-1 ring-inset ring-white/10`}>
                    <Icon size={28} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${path.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        path.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                      {path.difficulty}
                    </span>
                    {path.id === 'ai' && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-accent-primary animate-pulse bg-accent-primary/10 px-2 py-0.5 rounded-full border border-accent-primary/20">
                        <Zap size={10} fill="currentColor" /> NEW
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                  {path.title}
                </h3>
                <p className="text-text-secondary text-sm mb-8 leading-relaxed h-10 line-clamp-2">
                  {path.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-6 text-xs text-text-muted font-medium mb-8 border-y border-white/5 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-text-secondary" />
                    {path.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-text-secondary" />
                    {path.modules.length} Modules
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-auto">
                  <div className="flex justify-between text-xs mb-2 font-bold tracking-wide">
                    <span className="text-text-muted">PROGRESS</span>
                    <span className={colors.text}>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${colors.gradient}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Arrow hint */}
                <div className="absolute bottom-8 right-8 text-white/5 group-hover:text-white/20 transition-colors transform group-hover:translate-x-1 duration-300">
                  <ChevronRight size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Highlights */}
      <div className="glass-panel p-12 rounded-3xl border border-white/5 bg-white/[0.02] relative overflow-hidden animate-fade-up delay-200">
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-accent-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

        <h2 className="text-3xl font-bold text-white mb-10 text-center relative z-10">Why Follow a Learning Path?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="text-center p-6 rounded-2xl hover:bg-white/5 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center mx-auto mb-6 border border-blue-500/10">
              <Target size={32} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Structured Roadmap</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Stop guessing what to learn next. Follow a battle-tested curriculum designed by FAANG engineers to cover every gap.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl hover:bg-white/5 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center mx-auto mb-6 border border-purple-500/10">
              <TrendingUp size={32} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Track Growth</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Visualize your progress with detailed analytics. Watch your skills grow from beginner to advanced with every module.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl hover:bg-white/5 transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 flex items-center justify-center mx-auto mb-6 border border-amber-500/10">
              <Award size={32} className="text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Earn Certification</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Complete the path to earn a certificate of mastery. Validate your skills and showcase your achievement to recruiters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
