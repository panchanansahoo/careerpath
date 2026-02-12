import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, CheckCircle, Circle, BookOpen, Video, FileText,
  Clock, Target, Award, TrendingUp, Zap, Star, ChevronRight,
  ChevronDown, ChevronUp, PlayCircle, Code, Lightbulb,
  AlertCircle, ExternalLink, Users, Layers, Package
} from 'lucide-react';

export default function LLDLearningPath() {
  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('intermediate');
  const [showResources, setShowResources] = useState(false);
  const [showPracticeProblems, setShowPracticeProblems] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLearningPath();
  }, []);

  const fetchLearningPath = async () => {
    try {
      const response = await axios.get('/api/user/learning-path/lld');
      setPathData(response.data);
    } catch (error) {
      console.error('Error fetching learning path:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
      case 'Beginner':
        return '#10b981';
      case 'Medium':
      case 'Intermediate':
        return '#f59e0b';
      case 'Hard':
      case 'Advanced':
        return '#ef4444';
      default:
        return '#64748b';
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
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '20px', color: '#64748b' }}>Loading LLD Learning Path...</p>
      </div>
    );
  }

  if (!pathData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <AlertCircle size={48} style={{ color: '#ef4444', margin: '0 auto 20px' }} />
        <h2>Failed to load learning path</h2>
        <button onClick={fetchLearningPath} style={{
          padding: '10px 20px',
          background: '#8b5cf6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}>
          Try Again
        </button>
      </div>
    );
  }

  const completedModules = pathData.modules.filter(m => (m.progress?.percentage || 0) === 100).length;
  const startedModules = pathData.modules.filter(m => (m.progress?.solved || 0) > 0).length;
  const overallProgress = Math.round(
    pathData.modules.reduce((acc, m) => acc + (m.progress?.percentage || 0), 0) / pathData.modules.length
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        color: 'white',
        padding: '60px 20px',
        marginBottom: '40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Box size={32} />
            <span style={{
              padding: '4px 12px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {pathData.difficulty}
            </span>
          </div>
          
          <h1 style={{ fontSize: '48px', marginBottom: '15px', fontWeight: '700' }}>
            {pathData.title}
          </h1>
          
          <p style={{ fontSize: '20px', marginBottom: '30px', opacity: 0.9, maxWidth: '800px' }}>
            {pathData.description}
          </p>

          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} />
              <span>{pathData.duration}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen size={20} />
              <span>{pathData.totalModules} Modules</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Code size={20} />
              <span>15+ Practice Problems</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target size={20} />
              <span>{overallProgress}% Complete</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '12px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${overallProgress}%`,
              height: '100%',
              background: 'white',
              transition: 'width 0.3s',
              boxShadow: '0 0 10px rgba(255,255,255,0.5)'
            }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px' }}>
        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid #ddd6fe'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#ddd6fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8b5cf6'
              }}>
                <Target size={24} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>
                  {completedModules}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Modules Complete</div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid #fef3c7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b'
              }}>
                <Zap size={24} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>
                  {startedModules}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Modules Started</div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid #dcfce7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981'
              }}>
                <Award size={24} />
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>
                  {overallProgress}%
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Overall Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Study Plan Selector */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#1e293b' }}>
            Choose Your Study Plan
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {['beginner', 'intermediate', 'advanced'].map(level => {
              const plan = pathData.studyPlan[level];
              const isSelected = selectedLevel === level;
              
              return (
                <div
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  style={{
                    padding: '20px',
                    border: `2px solid ${isSelected ? '#8b5cf6' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: isSelected ? '#f5f3ff' : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '18px',
                      color: '#1e293b',
                      textTransform: 'capitalize'
                    }}>
                      {level}
                    </h3>
                    {isSelected && <CheckCircle size={20} style={{ color: '#8b5cf6' }} />}
                  </div>
                  
                  <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Duration:</strong> {plan.duration}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Time/Week:</strong> {plan.hoursPerWeek}
                    </div>
                    <div>
                      <strong>Goal:</strong> {plan.weeklyGoals}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Star size={28} style={{ color: '#f59e0b' }} />
            What You'll Learn
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {pathData.overview.outcomes.map((outcome, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: '12px',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '10px'
              }}>
                <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: '#475569', fontSize: '15px' }}>{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modules */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '24px', color: '#1e293b' }}>
            Learning Modules
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pathData.modules.map((module, idx) => (
              <ModuleCard
                key={module.id}
                module={module}
                index={idx}
                isExpanded={expandedModule === module.id}
                onToggle={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                getDifficultyColor={getDifficultyColor}
                getIconForType={getIconForType}
              />
            ))}
          </div>
        </div>

        {/* Practice Problems */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div
            onClick={() => setShowPracticeProblems(!showPracticeProblems)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <h2 style={{ fontSize: '24px', margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Code size={28} style={{ color: '#8b5cf6' }} />
              15 Practice Problems
            </h2>
            {showPracticeProblems ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>

          {showPracticeProblems && (
            <div style={{ marginTop: '24px', display: 'grid', gap: '12px' }}>
              {pathData.practiceProblems.map((problem, idx) => (
                <div key={problem.id} style={{
                  padding: '20px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', color: '#1e293b', margin: '0 0 8px 0' }}>
                        {idx + 1}. {problem.title}
                      </h3>
                      <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '14px' }}>
                        {problem.description}
                      </p>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: getDifficultyColor(problem.difficulty),
                      background: `${getDifficultyColor(problem.difficulty)}15`,
                      whiteSpace: 'nowrap'
                    }}>
                      {problem.difficulty}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} />
                      <span>{problem.estimatedTime}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                      <Layers size={14} />
                      <span>{problem.topics.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resources Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div
            onClick={() => setShowResources(!showResources)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <h2 style={{ fontSize: '24px', margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BookOpen size={28} style={{ color: '#8b5cf6' }} />
              Learning Resources
            </h2>
            {showResources ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>

          {showResources && (
            <div style={{ marginTop: '24px' }}>
              {/* Books */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#475569' }}>📚 Essential Books</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {pathData.resources.books.map((book, idx) => (
                    <div key={idx} style={{
                      padding: '16px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                        {book.title}
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                        by {book.author}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                        {book.description}
                      </div>
                      <span style={{
                        padding: '2px 8px',
                        background: '#ddd6fe',
                        color: '#8b5cf6',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {book.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Websites */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#475569' }}>🌐 Useful Websites</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                  {pathData.resources.websites.map((site, idx) => (
                    <a
                      key={idx}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '16px',
                        background: '#f8fafc',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'start',
                        gap: '12px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f5f3ff';
                        e.currentTarget.style.borderColor = '#8b5cf6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <ExternalLink size={18} style={{ color: '#8b5cf6', flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                          {site.name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                          {site.description}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Video Courses */}
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#475569' }}>🎥 Video Courses</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {pathData.resources.videos.map((video, idx) => (
                    <a
                      key={idx}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '16px',
                        background: '#f8fafc',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'block',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f5f3ff';
                        e.currentTarget.style.borderColor = '#8b5cf6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                        {video.title}
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                        {video.instructor} • {video.duration}
                      </div>
                      <span style={{
                        padding: '2px 8px',
                        background: '#ddd6fe',
                        color: '#8b5cf6',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {video.difficulty}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Lightbulb size={28} style={{ color: '#f59e0b' }} />
            Pro Tips
          </h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '16px', color: '#475569', marginBottom: '12px' }}>💡 General Tips</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#64748b', lineHeight: '1.8' }}>
                {pathData.tips.general.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', color: '#475569', marginBottom: '12px' }}>📝 Before Interview</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#64748b', lineHeight: '1.8' }}>
                {pathData.tips.beforeInterview.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', color: '#475569', marginBottom: '12px' }}>🎯 During Interview</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#64748b', lineHeight: '1.8' }}>
                {pathData.tips.duringInterview.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', color: '#475569', marginBottom: '12px' }}>⚠️ Anti-Patterns to Avoid</h3>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#64748b', lineHeight: '1.8' }}>
                {pathData.tips.antiPatterns.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#1e293b' }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {pathData.faqs.map((faq, idx) => (
              <div key={idx} style={{
                padding: '20px',
                background: '#f8fafc',
                borderRadius: '10px'
              }}>
                <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px', fontSize: '16px' }}>
                  {faq.question}
                </div>
                <div style={{ color: '#64748b', lineHeight: '1.6' }}>
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Module Card Component
function ModuleCard({ module, index, isExpanded, onToggle, getDifficultyColor, getIconForType }) {
  const progress = module.progress || { solved: 0, total: 0, percentage: 0 };
  const isCompleted = progress.percentage === 100;
  const isStarted = progress.solved > 0;

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      border: isCompleted ? '2px solid #10b981' : '1px solid #e2e8f0'
    }}>
      {/* Module Header */}
      <div
        onClick={onToggle}
        style={{
          padding: '24px',
          background: isExpanded ? '#f8fafc' : 'white',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isCompleted ? '#dcfce7' : '#f1f5f9',
                color: isCompleted ? '#10b981' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {index + 1}
              </span>
              
              <h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>
                {module.title}
              </h3>

              {isCompleted && (
                <CheckCircle size={24} style={{ color: '#10b981' }} />
              )}
            </div>

            <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '15px' }}>
              {module.description}
            </p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '14px', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Code size={16} />
                <span>{module.problemCount} Problems</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} />
                <span>{module.estimatedTime}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={16} />
                <span>{module.difficulty}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: `conic-gradient(#8b5cf6 ${progress.percentage * 3.6}deg, #e2e8f0 ${progress.percentage * 3.6}deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '14px',
                color: '#1e293b'
              }}>
                {progress.percentage}%
              </div>
            </div>
            
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: '#e2e8f0',
          borderRadius: '4px',
          overflow: 'hidden',
          marginTop: '16px'
        }}>
          <div style={{
            width: `${progress.percentage}%`,
            height: '100%',
            background: isCompleted ? '#10b981' : '#8b5cf6',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ padding: '0 24px 24px' }}>
          {/* Topics */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', color: '#475569', marginBottom: '12px' }}>📋 Topics Covered</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {module.topics.map((topic, idx) => (
                <span key={idx} style={{
                  padding: '6px 12px',
                  background: '#f1f5f9',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#475569'
                }}>
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Study Materials */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', color: '#475569', marginBottom: '12px' }}>📚 Study Materials</h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {module.studyMaterials.map((material, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'start',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#ddd6fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8b5cf6',
                    flexShrink: 0
                  }}>
                    {getIconForType(material.type)}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                      {material.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '6px' }}>
                      {material.description}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#64748b' }}>
                      <span>{material.duration}</span>
                      <span>•</span>
                      <span>{material.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Problems */}
          {module.keyProblems && module.keyProblems.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', color: '#475569', marginBottom: '12px' }}>⭐ Must-Solve Problems</h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                {module.keyProblems.map((problem, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 16px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <Star size={16} style={{ color: '#f59e0b' }} />
                        <span style={{ fontWeight: '500', color: '#1e293b' }}>{problem.title}</span>
                      </div>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: getDifficultyColor(problem.difficulty),
                        background: `${getDifficultyColor(problem.difficulty)}15`
                      }}>
                        {problem.difficulty}
                      </span>
                    </div>
                    {problem.description && (
                      <p style={{ margin: '0 0 0 28px', fontSize: '13px', color: '#64748b' }}>
                        {problem.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {module.tips && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', color: '#475569', marginBottom: '12px' }}>💡 Pro Tips</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#64748b', lineHeight: '1.6', fontSize: '14px' }}>
                {module.tips.map((tip, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Common Mistakes */}
          {module.commonMistakes && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', color: '#475569', marginBottom: '12px' }}>⚠️ Common Mistakes</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#64748b', lineHeight: '1.6', fontSize: '14px' }}>
                {module.commonMistakes.map((mistake, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{mistake}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
