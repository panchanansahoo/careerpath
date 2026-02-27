import { useState } from 'react';
import {
  ChevronDown, ChevronRight, Tag, Building2, Target,
  BarChart3, Lightbulb, BookOpen, ExternalLink, Link2,
  FileText, Clock, CheckCircle2, Eye, EyeOff,
  ChevronUp, AlertCircle, Code2, History
} from 'lucide-react';

export default function ProblemDescriptionPanel({
  problem, onShowHints, showHints = false
}) {
  const [activeTopTab, setActiveTopTab] = useState('problem');
  const [activeSubTab, setActiveSubTab] = useState('description');
  const [showConstraints, setShowConstraints] = useState(true);
  const [showExamples, setShowExamples] = useState(true);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showAllTopics, setShowAllTopics] = useState(false);

  if (!problem) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', color: 'rgba(255,255,255,0.3)', fontSize: 13,
      }}>
        Loading problem...
      </div>
    );
  }

  const diffColors = {
    Easy: { bg: 'rgba(34,197,94,0.1)', text: '#4ade80', border: 'rgba(34,197,94,0.2)' },
    Medium: { bg: 'rgba(250,204,21,0.1)', text: '#fbbf24', border: 'rgba(250,204,21,0.2)' },
    Hard: { bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.2)' },
  };

  const dc = diffColors[problem.difficulty] || diffColors.Medium;
  const topics = problem.topics || [];
  const hints = problem.hints || [];
  const visibleTopics = showAllTopics ? topics : topics.slice(0, 3);
  const hiddenCount = topics.length - 3;

  // Mock submission history
  const submissionHistory = [
    { id: 1, status: 'Accepted', language: 'Python', runtime: '42ms', memory: '14.2MB', time: '2 hours ago' },
    { id: 2, status: 'Wrong Answer', language: 'Python', runtime: '—', memory: '—', time: '3 hours ago' },
    { id: 3, status: 'Time Limit Exceeded', language: 'JavaScript', runtime: '—', memory: '—', time: '1 day ago' },
  ];

  // ─── Top-level tabs ───
  const topTabs = [
    { id: 'problem', label: 'Problem', icon: FileText },
    { id: 'solution', label: 'Solution', icon: Code2 },
    { id: 'history', label: 'History', icon: History },
  ];

  // ─── Sub-tabs (inside Problem) ───
  const subTabs = [
    { id: 'description', label: 'Description', icon: BookOpen },
    { id: 'testcases', label: 'Test Cases', icon: CheckCircle2 },
    { id: 'hints', label: 'Hints', icon: Lightbulb },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: 'rgba(10,10,26,0.95)',
    }}>

      {/* ═══ Top Tabs: Problem | Solution | History ═══ */}
      <div style={{
        display: 'flex', flexShrink: 0,
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {topTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTopTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTopTab(tab.id)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, padding: '10px 8px', cursor: 'pointer',
              background: isActive ? 'rgba(139,92,246,0.08)' : 'transparent',
              border: 'none',
              borderBottom: `2px solid ${isActive ? '#8b5cf6' : 'transparent'}`,
              color: isActive ? '#c084fc' : 'rgba(255,255,255,0.4)',
              fontSize: 12, fontWeight: 700,
              transition: 'all 0.2s ease',
              letterSpacing: 0.3,
            }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══ PROBLEM TAB ═══ */}
      {activeTopTab === 'problem' && (
        <>
          {/* Title + Badges */}
          <div style={{
            padding: '14px 16px 10px', flexShrink: 0,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <h2 style={{
              fontSize: 17, fontWeight: 800, color: '#fff',
              margin: '0 0 10px 0', lineHeight: 1.3,
            }}>{problem.title}</h2>

            {/* Difficulty + DSA badge */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
              <span style={{
                padding: '3px 10px', borderRadius: 6,
                background: dc.bg, color: dc.text, border: `1px solid ${dc.border}`,
                fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                {problem.difficulty}
              </span>
              <span style={{
                padding: '3px 10px', borderRadius: 6,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700,
              }}>
                DSA
              </span>
            </div>

            {/* Topics tags */}
            {topics.length > 0 && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700,
                  marginRight: 2,
                }}>Topics:</span>
                {visibleTopics.map(topic => (
                  <span key={topic} style={{
                    padding: '3px 10px', borderRadius: 6,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 700,
                    cursor: 'default', transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(139,92,246,0.1)';
                      e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)';
                      e.currentTarget.style.color = '#c084fc';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    {topic}
                  </span>
                ))}
                {!showAllTopics && hiddenCount > 0 && (
                  <button onClick={() => setShowAllTopics(true)} style={{
                    padding: '3px 8px', borderRadius: 6, cursor: 'pointer',
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.15)',
                    color: '#a78bfa', fontSize: 10, fontWeight: 700,
                    transition: 'all 0.2s ease',
                  }}>
                    +{hiddenCount} more
                  </button>
                )}
                {showAllTopics && hiddenCount > 0 && (
                  <button onClick={() => setShowAllTopics(false)} style={{
                    padding: '3px 8px', borderRadius: 6, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700,
                  }}>
                    less
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ─── Sub-tabs: Description | Test Cases | Hints ─── */}
          <div style={{
            display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '0 12px', flexShrink: 0,
            background: 'rgba(255,255,255,0.01)',
          }}>
            {subTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '8px 14px', cursor: 'pointer',
                  background: 'transparent', border: 'none',
                  borderBottom: `2px solid ${isActive ? '#8b5cf6' : 'transparent'}`,
                  color: isActive ? '#c084fc' : 'rgba(255,255,255,0.4)',
                  fontSize: 11, fontWeight: 700, transition: 'all 0.2s ease',
                }}>
                  <Icon size={12} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ─── Sub-tab Content ─── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

            {/* ── Description ── */}
            {activeSubTab === 'description' && (
              <>
                <div style={{
                  fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8,
                  marginBottom: 20,
                }}>
                  <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{problem.description}</p>
                </div>

                {/* Examples */}
                {problem.examples && (
                  <div style={{ marginBottom: 20 }}>
                    <button onClick={() => setShowExamples(s => !s)} style={{
                      display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                      background: 'none', border: 'none', padding: 0, marginBottom: 10,
                      color: '#fff', fontSize: 13, fontWeight: 800,
                    }}>
                      {showExamples ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      Examples ({problem.examples.length})
                    </button>
                    {showExamples && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {problem.examples.map((ex, i) => (
                          <div key={i} style={{
                            padding: 12, borderRadius: 10,
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                          }}>
                            <div style={{ marginBottom: 4 }}>
                              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }}>
                                Example {i + 1}
                              </span>
                            </div>
                            <div style={{ marginBottom: 4 }}>
                              <span style={{ color: 'rgba(255,255,255,0.4)' }}>Input: </span>
                              <span style={{ color: '#e2e8f0' }}>{ex.input}</span>
                            </div>
                            <div style={{ marginBottom: ex.explanation ? 4 : 0 }}>
                              <span style={{ color: 'rgba(255,255,255,0.4)' }}>Output: </span>
                              <span style={{ color: '#4ade80' }}>{ex.output}</span>
                            </div>
                            {ex.explanation && (
                              <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                <span style={{ color: 'rgba(255,255,255,0.3)' }}>Explanation: </span>
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{ex.explanation}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && (
                  <div style={{ marginBottom: 20 }}>
                    <button onClick={() => setShowConstraints(s => !s)} style={{
                      display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                      background: 'none', border: 'none', padding: 0, marginBottom: 10,
                      color: '#fff', fontSize: 13, fontWeight: 800,
                    }}>
                      {showConstraints ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      Constraints
                    </button>
                    {showConstraints && (
                      <div style={{
                        padding: 12, borderRadius: 10,
                        background: 'rgba(250,204,21,0.03)',
                        border: '1px solid rgba(250,204,21,0.08)',
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                        color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-wrap', lineHeight: 1.8,
                      }}>
                        {problem.constraints}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ── Test Cases ── */}
            {activeSubTab === 'testcases' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{
                  fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
                }}>Example Test Cases</div>
                {(problem.examples || []).map((ex, i) => (
                  <div key={i} style={{
                    padding: 14, borderRadius: 10,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s ease',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                    }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: 10,
                    }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                        <CheckCircle2 size={13} color="rgba(74,222,128,0.5)" />
                        Test Case {i + 1}
                      </span>
                    </div>
                    <div style={{
                      padding: '8px 10px', borderRadius: 8,
                      background: 'rgba(0,0,0,0.2)',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      marginBottom: 6,
                    }}>
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>INPUT</span>
                      </div>
                      <div style={{ color: '#e2e8f0' }}>{ex.input}</div>
                    </div>
                    <div style={{
                      padding: '8px 10px', borderRadius: 8,
                      background: 'rgba(0,0,0,0.2)',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                    }}>
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>EXPECTED OUTPUT</span>
                      </div>
                      <div style={{ color: '#4ade80' }}>{ex.output}</div>
                    </div>
                  </div>
                ))}
                {(!problem.examples || problem.examples.length === 0) && (
                  <div style={{
                    textAlign: 'center', padding: '40px 20px',
                    color: 'rgba(255,255,255,0.3)',
                  }}>
                    <AlertCircle size={28} style={{ marginBottom: 10, opacity: 0.3 }} />
                    <p style={{ fontSize: 12, fontWeight: 600 }}>No test cases available</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Hints ── */}
            {activeSubTab === 'hints' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{
                  fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
                }}>Progressive Hints</div>
                {hints.length > 0 ? (
                  <>
                    {hints.map((hint, i) => {
                      const isRevealed = i < revealedHints;
                      return (
                        <div key={i} style={{
                          borderRadius: 10,
                          background: isRevealed
                            ? 'rgba(250,204,21,0.04)'
                            : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isRevealed ? 'rgba(250,204,21,0.12)' : 'rgba(255,255,255,0.05)'}`,
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                        }}>
                          <div style={{
                            padding: '10px 14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          }}>
                            <span style={{
                              fontSize: 12, fontWeight: 700,
                              color: isRevealed ? '#fbbf24' : 'rgba(255,255,255,0.5)',
                              display: 'flex', alignItems: 'center', gap: 6,
                            }}>
                              <Lightbulb size={13} />
                              Hint {i + 1}
                            </span>
                            {!isRevealed && i === revealedHints && (
                              <button
                                onClick={() => setRevealedHints(r => r + 1)}
                                style={{
                                  padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                                  background: 'rgba(250,204,21,0.08)',
                                  border: '1px solid rgba(250,204,21,0.15)',
                                  color: '#fbbf24', fontSize: 10, fontWeight: 700,
                                  display: 'flex', alignItems: 'center', gap: 4,
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <Eye size={11} /> Reveal
                              </button>
                            )}
                            {!isRevealed && i !== revealedHints && (
                              <span style={{
                                fontSize: 10, color: 'rgba(255,255,255,0.25)', fontWeight: 600,
                              }}>🔒 Locked</span>
                            )}
                          </div>
                          {isRevealed && (
                            <div style={{
                              padding: '0 14px 12px',
                              fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7,
                            }}>
                              {hint}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {revealedHints > 0 && (
                      <button
                        onClick={() => setRevealedHints(0)}
                        style={{
                          padding: '8px 0', borderRadius: 8, cursor: 'pointer',
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                        }}
                      >
                        <EyeOff size={12} /> Reset Hints
                      </button>
                    )}
                  </>
                ) : (
                  <div style={{
                    textAlign: 'center', padding: '40px 20px',
                    color: 'rgba(255,255,255,0.3)',
                  }}>
                    <Lightbulb size={28} style={{ marginBottom: 10, opacity: 0.3 }} />
                    <p style={{ fontSize: 12, fontWeight: 600 }}>No hints available for this problem</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom: AI Hints toggle */}
          <div style={{
            padding: '10px 16px', flexShrink: 0,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <button onClick={onShowHints} style={{
              width: '100%', padding: '10px 0', borderRadius: 10, cursor: 'pointer',
              background: showHints
                ? 'linear-gradient(135deg, rgba(250,204,21,0.1), rgba(139,92,246,0.1))'
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${showHints ? 'rgba(250,204,21,0.2)' : 'rgba(255,255,255,0.06)'}`,
              color: showHints ? '#fbbf24' : 'rgba(255,255,255,0.5)',
              fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s ease',
            }}>
              <Lightbulb size={14} />
              {showHints ? 'Hide AI Assistant' : '💡 AI Assistant — Get Hints & Analysis'}
            </button>
          </div>
        </>
      )}

      {/* ═══ SOLUTION TAB ═══ */}
      {activeTopTab === 'solution' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            textAlign: 'center', padding: '40px 30px',
            color: 'rgba(255,255,255,0.3)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'rgba(139,92,246,0.08)',
              border: '1px solid rgba(139,92,246,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Code2 size={24} color="#8b5cf6" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
              Solution Locked
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
              Submit an accepted solution to unlock the editorial and optimal approach.
            </p>
            <div style={{
              marginTop: 20, padding: '10px 20px', borderRadius: 10,
              background: 'rgba(139,92,246,0.06)',
              border: '1px solid rgba(139,92,246,0.12)',
              color: '#a78bfa', fontSize: 11, fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <CheckCircle2 size={13} /> Submit your solution first
            </div>
          </div>
        </div>
      )}

      {/* ═══ HISTORY TAB ═══ */}
      {activeTopTab === 'history' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          <div style={{
            fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
          }}>Submission History</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {submissionHistory.map((sub) => {
              const isAccepted = sub.status === 'Accepted';
              const statusColor = isAccepted
                ? '#4ade80'
                : sub.status === 'Wrong Answer' ? '#f87171' : '#fbbf24';
              return (
                <div key={sub.id} style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 6,
                  }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: statusColor,
                    }}>
                      {sub.status}
                    </span>
                    <span style={{
                      fontSize: 10, color: 'rgba(255,255,255,0.25)',
                    }}>
                      {sub.time}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex', gap: 12, fontSize: 10, color: 'rgba(255,255,255,0.4)',
                  }}>
                    <span>{sub.language}</span>
                    {isAccepted && (
                      <>
                        <span>⚡ {sub.runtime}</span>
                        <span>💾 {sub.memory}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
