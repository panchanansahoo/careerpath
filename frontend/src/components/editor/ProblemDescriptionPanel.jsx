import { useState } from 'react';
import {
  ChevronDown, ChevronRight, Tag, Building2, Target,
  BarChart3, Lightbulb, BookOpen, ExternalLink, Link2
} from 'lucide-react';

export default function ProblemDescriptionPanel({
  problem, onShowHints, showHints = false
}) {
  const [showConstraints, setShowConstraints] = useState(true);
  const [showExamples, setShowExamples] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('description');

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

  // Mock data for enhanced features
  const companyTags = problem.companies || ['Google', 'Amazon', 'Meta'];
  const acceptanceRate = problem.acceptance_rate || (problem.acceptance ? `${problem.acceptance}%` : '67.4%');
  const relatedProblems = problem.related || [
    { title: '3Sum', difficulty: 'Medium', id: '3sum' },
    { title: 'Two Sum II', difficulty: 'Medium', id: 'two-sum-ii' },
    { title: 'Subarray Sum Equals K', difficulty: 'Medium', id: 'subarray-sum-k' },
  ];

  const subTabs = [
    { id: 'description', label: 'Description' },
    { id: 'editorial', label: 'Editorial' },
    { id: 'related', label: 'Related' },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: 'rgba(10,10,26,0.95)',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px', flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 style={{
          fontSize: 18, fontWeight: 800, color: '#fff',
          margin: '0 0 8px 0', lineHeight: 1.3,
        }}>{problem.title}</h2>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Difficulty */}
          <span style={{
            padding: '3px 10px', borderRadius: 6,
            background: dc.bg, color: dc.text, border: `1px solid ${dc.border}`,
            fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5,
          }}>
            {problem.difficulty}
          </span>

          {/* Pattern */}
          {problem.pattern_name && (
            <span style={{
              padding: '3px 10px', borderRadius: 6,
              background: 'rgba(139,92,246,0.1)', color: '#c084fc',
              border: '1px solid rgba(139,92,246,0.2)',
              fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Target size={9} /> {problem.pattern_name}
            </span>
          )}

          {/* Acceptance rate */}
          <span style={{
            padding: '3px 10px', borderRadius: 6,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <BarChart3 size={9} /> {acceptanceRate}
          </span>
        </div>

        {/* Company tags */}
        <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
          {companyTags.map(company => (
            <span key={company} style={{
              padding: '2px 8px', borderRadius: 4,
              background: 'rgba(96,165,250,0.06)',
              border: '1px solid rgba(96,165,250,0.1)',
              color: 'rgba(96,165,250,0.7)', fontSize: 9, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              <Building2 size={8} /> {company}
            </span>
          ))}
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{
        display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 12px', flexShrink: 0,
      }}>
        {subTabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveSubTab(tab.id)} style={{
            padding: '8px 14px', cursor: 'pointer',
            background: 'transparent', border: 'none',
            borderBottom: `2px solid ${activeSubTab === tab.id ? '#8b5cf6' : 'transparent'}`,
            color: activeSubTab === tab.id ? '#c084fc' : 'rgba(255,255,255,0.4)',
            fontSize: 11, fontWeight: 700, transition: 'all 0.2s ease',
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {activeSubTab === 'description' && (
          <>
            {/* Description */}
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

        {activeSubTab === 'editorial' && (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            color: 'rgba(255,255,255,0.3)',
          }}>
            <BookOpen size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p style={{ fontSize: 13, fontWeight: 600 }}>Editorial unlocks after submission</p>
            <p style={{ fontSize: 11, marginTop: 4 }}>Submit your solution to view the editorial.</p>
          </div>
        )}

        {activeSubTab === 'related' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
            }}>Similar Problems</div>
            {relatedProblems.map((rp, i) => {
              const rdc = diffColors[rp.difficulty] || diffColors.Medium;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Link2 size={12} color="rgba(255,255,255,0.3)" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{rp.title}</span>
                  </div>
                  <span style={{
                    padding: '2px 8px', borderRadius: 4,
                    background: rdc.bg, color: rdc.text, border: `1px solid ${rdc.border}`,
                    fontSize: 9, fontWeight: 800,
                  }}>
                    {rp.difficulty}
                  </span>
                </div>
              );
            })}
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
    </div>
  );
}
