import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CheckCircle, Circle, Lock, Code, PlayCircle,
  BookOpen, Award, Clock, TrendingUp, ArrowLeft,
  Target, Zap, Star, ChevronRight, FileText,
  AlertCircle, Layout, Brain, Terminal
} from 'lucide-react';

export default function LearningPathDetail() {
  const { pathId } = useParams();
  const navigate = useNavigate();
  const [pathData, setPathData] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  // Helper component for LLD icon since Box isn't imported from lucide-react directly in some versions
  const Box = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
  );

  useEffect(() => {
    fetchPathData();
    fetchUserProgress();
  }, [pathId]);

  const fetchPathData = async () => {
    try {
      const response = await axios.get(`/api/user/learning-paths/${pathId}`);
      setPathData(response.data);
    } catch (error) {
      console.error('Error fetching path data:', error);
      setPathData(getPathData(pathId));
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get('/api/user/progress');
      setUserProgress(response.data.progress || {});
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const getPathData = (id) => {
    const paths = {
      'dsa-basics': {
        id: 'dsa-basics',
        title: 'DSA Basics',
        description: 'Build a rock-solid foundation in data structures and algorithms from scratch.',
        duration: '6-8 weeks',
        difficulty: 'Beginner',
        prerequisite: 'Basic programming knowledge in any language',
        color: 'green',
        icon: Code,
        outcomes: [
          'Understand core data structures (arrays, linked lists, stacks, queues)',
          'Master basic algorithms and their time complexity analysis',
          'Solve 100+ beginner-friendly problems on LeetCode/HackerRank',
          'Build strong foundation for advanced topics'
        ],
        modules: [
          {
            id: 'arrays-strings',
            title: 'Arrays & Strings',
            description: 'Master the fundamentals of arrays and string manipulation',
            topics: ['Array Basics', 'String Operations', 'Two Pointers', 'Frequency Counter'],
            lessons: [
              { title: 'Introduction to Arrays', duration: '30 min', type: 'video' },
              { title: 'Array Manipulation Techniques', duration: '45 min', type: 'reading' },
              { title: 'String Processing Basics', duration: '40 min', type: 'video' },
              { title: 'Practice Problems', duration: '2 hours', type: 'practice' }
            ],
            problems: 25,
            estimatedTime: '1 week',
            unlocked: true
          },
          {
            id: 'hash-tables',
            title: 'Hash Tables & Maps',
            description: 'Learn efficient lookup and storage with hash-based structures',
            topics: ['Hash Maps', 'Hash Sets', 'Collision Handling', 'Applications'],
            lessons: [
              { title: 'Hash Table Fundamentals', duration: '35 min', type: 'video' },
              { title: 'Implementing Hash Functions', duration: '50 min', type: 'reading' },
              { title: 'Real-world Applications', duration: '30 min', type: 'video' },
              { title: 'Practice Problems', duration: '2.5 hours', type: 'practice' }
            ],
            problems: 20,
            estimatedTime: '1 week',
            unlocked: true
          }
        ]
      },
      'dsa': {
        id: 'dsa',
        title: 'Advanced DSA',
        description: 'Master advanced data structures and complex algorithms for FAANG interviews.',
        duration: '10-12 weeks',
        difficulty: 'Advanced',
        prerequisite: 'Strong foundation in basic DSA',
        color: 'blue',
        icon: Terminal,
        outcomes: [
          'Master advanced data structures (Trees, Graphs, Heaps, Tries)',
          'Solve medium to hard LeetCode problems with optimal efficiency',
          'Understand dynamic programming, greedy algorithms, and backtracking',
          'Ready for top-tier company interviews (Google, Meta, Amazon)'
        ],
        modules: [
          {
            id: 'trees-basic',
            title: 'Binary Trees & BST',
            description: 'Master tree data structures and traversal techniques',
            topics: ['Tree Traversals', 'BST Operations', 'Tree Construction', 'Path Problems'],
            lessons: [
              { title: 'Binary Tree Fundamentals', duration: '45 min', type: 'video' },
              { title: 'BST Properties & Operations', duration: '50 min', type: 'reading' },
              { title: 'Tree Traversal Patterns', duration: '40 min', type: 'video' },
              { title: 'Practice Problems', duration: '3 hours', type: 'practice' }
            ],
            problems: 30,
            estimatedTime: '2 weeks',
            unlocked: true
          }
        ]
      },
      'ai': {
        id: 'ai',
        title: 'AI & Machine Learning',
        description: 'Deep dive into neural networks, deep learning, and modern AI applications.',
        duration: '10-12 weeks',
        difficulty: 'Advanced',
        prerequisite: 'ML fundamentals, calculus, linear algebra',
        color: 'rose',
        icon: Brain,
        outcomes: [
          'Master deep learning architectures (CNN, RNN, Transformers)',
          'Build and train neural networks from scratch using PyTorch',
          'Understand modern AI techniques and real-world applications',
          'Deploy AI models to production environments'
        ],
        modules: [
          {
            id: 'neural-networks',
            title: 'Neural Networks Fundamentals',
            description: 'Build deep learning foundation from scratch',
            topics: ['Perceptrons', 'Backpropagation', 'Activation Functions', 'Optimizers'],
            lessons: [
              { title: 'Neural Network Basics', duration: '60 min', type: 'video' },
              { title: 'Gradient Descent & Backprop', duration: '70 min', type: 'reading' },
              { title: 'Building Your First Network', duration: '50 min', type: 'video' },
              { title: 'Practice Implementation', duration: '4 hours', type: 'practice' }
            ],
            problems: 15,
            estimatedTime: '2 weeks',
            unlocked: true
          },
          {
            id: 'cnn',
            title: 'Convolutional Neural Networks',
            description: 'Master CNNs for computer vision tasks',
            topics: ['Convolutions', 'Pooling', 'Transfer Learning', 'Object Detection'],
            lessons: [
              { title: 'CNN Architecture', duration: '55 min', type: 'video' },
              { title: 'Image Processing Techniques', duration: '60 min', type: 'reading' },
              { title: 'Transfer Learning', duration: '50 min', type: 'video' },
              { title: 'Practice Projects', duration: '5 hours', type: 'practice' }
            ],
            problems: 12,
            estimatedTime: '2.5 weeks',
            unlocked: true
          }
        ]
      }
    };

    return paths[id] || paths['dsa-basics'];
  };

  const calculateProgress = () => {
    if (!pathData) return 0;
    const completed = pathData.modules.filter(m =>
      userProgress[`module_${m.id}`]?.completed
    ).length;
    return Math.round((completed / pathData.modules.length) * 100);
  };

  const startModule = (module) => {
    if (!module.unlocked) {
      return;
    }
    if (pathData.id === 'ai') {
      navigate(`/dashboard/learning-path/ai/module/${module.id}`);
    } else if (pathData.id.includes('dsa')) {
      navigate('/dsa-patterns-sheet');
    } else if (pathData.id === 'data-science') {
      navigate('/code-practice');
    } else if (pathData.id === 'lld' || pathData.id === 'hld') {
      navigate('/system-design');
    }
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return <PlayCircle size={16} />;
      case 'reading': return <FileText size={16} />;
      case 'practice': return <Code size={16} />;
      default: return <Circle size={16} />;
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', gradient: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', gradient: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/20' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
      rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', gradient: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' },
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', gradient: 'from-cyan-500 to-sky-600', shadow: 'shadow-cyan-500/20' },
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-text-muted animate-pulse">Loading Path...</p>
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className="container py-20 text-center">
        <div className="inline-block p-6 rounded-full bg-white/5 mb-6">
          <AlertCircle size={48} className="text-text-muted" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Learning Path Not Found</h2>
        <p className="text-text-secondary mb-8">The path you are looking for doesn't exist or has been moved.</p>
        <button onClick={() => navigate('/dashboard/learning-path')} className="btn btn-primary">
          Back to Learning Paths
        </button>
      </div>
    );
  }

  const colors = getColorClasses(pathData.color || 'blue');
  const Icon = pathData.icon || BookOpen;

  return (
    <div className="container py-10 px-6 max-w-[1400px] animate-fade-up">
      <button
        onClick={() => navigate('/dashboard/learning-path')}
        className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8 group"
      >
        <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
          <ArrowLeft size={16} />
        </div>
        <span>Back to Learning Paths</span>
      </button>

      {/* Hero Header */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl mb-10 border border-white/10 relative overflow-hidden">
        <div className={`absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-br ${colors.gradient} opacity-20 blur-3xl pointer-events-none rounded-full`}></div>
        <div className="absolute top-10 right-10 p-10 opacity-5 pointer-events-none">
          <Icon size={300} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${pathData.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                pathData.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}>
              {pathData.difficulty}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-white/5 text-text-secondary border-white/10`}>
              {pathData.modules.length} Modules
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-sm">
            {pathData.title}
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl leading-relaxed mb-10 font-light">
            {pathData.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#0a0a0c]/50 border border-white/5 backdrop-blur-sm flex items-center gap-4 hover:border-white/10 transition-colors">
              <div className={`p-3 rounded-xl ${colors.bg} ${colors.text}`}>
                <Clock size={24} />
              </div>
              <div>
                <div className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Duration</div>
                <div className="text-white font-bold">{pathData.duration}</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0a0c]/50 border border-white/5 backdrop-blur-sm flex items-center gap-4 hover:border-white/10 transition-colors">
              <div className={`p-3 rounded-xl ${colors.bg} ${colors.text}`}>
                <Target size={24} />
              </div>
              <div>
                <div className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Prerequisite</div>
                <div className="text-white font-bold truncate max-w-[200px]" title={pathData.prerequisite}>
                  {pathData.prerequisite || 'None'}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a0a0c]/50 border border-white/5 backdrop-blur-sm flex items-center gap-4 hover:border-white/10 transition-colors">
              <div className={`p-3 rounded-xl ${colors.bg} ${colors.text}`}>
                <Award size={24} />
              </div>
              <div>
                <div className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Your Progress</div>
                <div className="text-white font-bold">{calculateProgress()}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8">
        {/* Main Content: Modules */}
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white/5`}>
                <Layout size={20} />
              </div>
              Learning Modules
            </h2>
          </div>

          <div className="space-y-6">
            {pathData.modules.map((module, idx) => {
              const isCompleted = userProgress[`module_${module.id}`]?.completed;
              const progress = userProgress[`module_${module.id}`]?.progress || 0;

              return (
                <div
                  key={module.id}
                  className={`glass-panel p-6 md:p-8 rounded-3xl border transition-all duration-300 ${module.unlocked
                    ? 'border-white/5 hover:border-white/20 hover:bg-white/[0.03]'
                    : 'border-transparent opacity-60 bg-black/20'
                    }`}
                >
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Icon Column */}
                    <div className="flex-shrink-0 flex md:block items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${isCompleted ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' :
                        module.unlocked ? `${colors.bg} ${colors.text} ring-1 ring-white/10` :
                          'bg-white/5 text-gray-500'
                        }`}>
                        {isCompleted ? <CheckCircle size={32} /> :
                          module.unlocked ? <div className="font-bold text-xl">{idx + 1}</div> : <Lock size={32} />}
                      </div>
                      <div className="md:hidden flex-1">
                        <div className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-1">Module {idx + 1}</div>
                        <h3 className="text-lg font-bold text-white">{module.title}</h3>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 min-w-0">
                      <div className="hidden md:flex justify-between items-start mb-3">
                        <div>
                          <div className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-1">Module {idx + 1}</div>
                          <h3 className="text-xl font-bold text-white">{module.title}</h3>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-[#0a0a0c] px-3 py-1.5 rounded-lg border border-white/5">
                          <Clock size={12} /> {module.estimatedTime}
                        </span>
                      </div>

                      <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                        {module.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {module.topics.map((topic, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-[#0a0a0c] text-gray-400 border border-white/5 text-xs font-medium hover:text-white transition-colors cursor-default">
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Lessons Preview */}
                      {module.lessons && (
                        <div className="mb-6 space-y-1 bg-[#0a0a0c]/50 rounded-xl border border-white/5 overflow-hidden">
                          <div className="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
                            <div className="text-xs font-bold text-text-muted uppercase tracking-wider">
                              Curriculum
                            </div>
                            <div className="text-xs text-text-muted">
                              {module.lessons.length} Lessons
                            </div>
                          </div>

                          <div className="p-2 space-y-1">
                            {module.lessons.map((lesson, i) => (
                              <div key={i} className="flex items-center justify-between text-sm p-2 hover:bg-white/5 rounded-lg transition-colors group">
                                <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-200 transition-colors">
                                  <span className={`${colors.text}`}>{getLessonIcon(lesson.type)}</span>
                                  <span>{lesson.title}</span>
                                </div>
                                <span className="text-xs text-gray-600 group-hover:text-gray-500">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-6 pt-6 border-t border-white/5">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-2 font-medium">
                            <span className="text-text-muted">{Array.isArray(module.problems) ? module.problems.length : module.problems} practice problems</span>
                            {module.unlocked && <span className={`${colors.text}`}>{progress}% Complete</span>}
                          </div>
                          {module.unlocked && (
                            <div className="w-full h-1.5 bg-[#0a0a0c] rounded-full overflow-hidden border border-white/5">
                              <div
                                className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r ' + colors.gradient}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => startModule(module)}
                          disabled={!module.unlocked}
                          className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${module.unlocked
                            ? (isCompleted ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20' : `bg-white text-black hover:bg-gray-200 ${colors.shadow}`)
                            : 'bg-white/5 text-gray-500 cursor-not-allowed shadow-none'
                            }`}
                        >
                          {isCompleted ? 'Review' : module.unlocked ? 'Start Learning' : 'Locked'}
                          {module.unlocked && <ChevronRight size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Prerequisites */}
          <div className={`glass-panel p-8 rounded-3xl border-l-4 ${colors.border.replace('20', '50')} ${colors.bg}`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${colors.text}`}>
              <Zap size={18} /> Prerequisites
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {pathData.prerequisite}
            </p>
          </div>

          {/* Outcomes */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-400" /> What You'll Learn
            </h3>
            <ul className="space-y-4">
              {pathData.outcomes.map((outcome, idx) => (
                <li key={idx} className="flex gap-4 text-sm text-text-secondary leading-relaxed group hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0 shadow-[0_0_5px_currentColor]" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          {/* Cert */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-5 group-hover:opacity-10 transition-all duration-500`}></div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10">
              <Award size={18} className="text-amber-400" /> Certification
            </h3>
            <p className="text-sm text-text-secondary mb-6 relative z-10">
              Complete all modules to earn your industry-recognized certificate of mastery.
            </p>
            <div className="aspect-video rounded-xl bg-[#0a0a0c] border border-white/10 flex items-center justify-center relative z-10 group-hover:border-white/20 transition-colors">
              <div className="text-center">
                <Award size={32} className="text-white/20 mx-auto mb-2" />
                <span className="text-xs text-white/30 font-mono">CERTIFICATE PREVIEW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
