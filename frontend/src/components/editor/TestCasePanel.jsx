import { useState, useEffect } from 'react';
import {
  Play, Plus, Trash2, ChevronDown, ChevronRight, CheckCircle2,
  XCircle, Clock, Cpu, AlertTriangle, Zap, Shuffle, FlaskConical
} from 'lucide-react';
import {
  EDGE_CASE_TEMPLATES, createTestCase, runTestCases,
  generateStressTests, detectProblemType
} from '../../data/testCaseEngine';

const TABS = [
  { id: 'tests', label: 'Test Cases', icon: Play },
  { id: 'custom', label: 'Custom Tests', icon: Plus },
  { id: 'stress', label: 'Stress Test', icon: Zap },
];

export default function TestCasePanel({
  code = '', language = 'python', problemId = '', problemDescription = '',
  onTestResults
}) {
  const [activeTab, setActiveTab] = useState('tests');
  const [testCases, setTestCases] = useState([
    createTestCase('nums = [2,7,11,15], target = 9', '[0,1]', 'Example 1'),
    createTestCase('nums = [3,2,4], target = 6', '[1,2]', 'Example 2'),
    createTestCase('nums = [3,3], target = 6', '[0,1]', 'Example 3'),
  ]);
  const [running, setRunning] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customExpected, setCustomExpected] = useState('');
  const [customName, setCustomName] = useState('');
  const [stressSize, setStressSize] = useState(100);
  const [stressTests, setStressTests] = useState([]);
  const [expandedTest, setExpandedTest] = useState(null);

  const problemType = detectProblemType(problemDescription);

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      const results = runTestCases(code, language, testCases);
      setTestCases(results);
      setRunning(false);
      const passed = results.filter(t => t.status === 'passed').length;
      onTestResults?.({ passed, total: results.length, results });
    }, 800 + Math.random() * 700);
  };

  const addCustomTest = () => {
    if (!customInput.trim()) return;
    const tc = createTestCase(customInput, customExpected || '—', customName || `Custom ${testCases.length + 1}`);
    setTestCases(prev => [...prev, tc]);
    setCustomInput('');
    setCustomExpected('');
    setCustomName('');
    setActiveTab('tests');
  };

  const removeTest = (id) => {
    setTestCases(prev => prev.filter(t => t.id !== id));
  };

  const runStress = () => {
    setRunning(true);
    const tests = generateStressTests(problemType, 5, stressSize);
    setTimeout(() => {
      const results = tests.map(t => ({
        ...t,
        status: Math.random() > 0.1 ? 'passed' : 'failed',
        runtime: `${Math.floor(stressSize * 0.05 + Math.random() * 50)}ms`,
        memory: `${(14 + Math.random() * 10).toFixed(1)}MB`,
        actualOutput: 'Mock output',
      }));
      setStressTests(results);
      setRunning(false);
    }, 1200);
  };

  const passedCount = testCases.filter(t => t.status === 'passed').length;
  const failedCount = testCases.filter(t => t.status === 'failed').length;
  const hasResults = testCases.some(t => t.status !== 'pending');

  return (
    <div style={{
      background: 'rgba(10,10,26,0.95)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 12px',
      }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: '10px 16px', cursor: 'pointer',
                background: 'transparent',
                borderBottom: activeTab === tab.id ? '2px solid #8b5cf6' : '2px solid transparent',
                border: 'none', borderBottomStyle: 'solid', borderBottomWidth: 2,
                borderBottomColor: activeTab === tab.id ? '#8b5cf6' : 'transparent',
                color: activeTab === tab.id ? '#c084fc' : 'rgba(255,255,255,0.4)',
                fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s ease',
              }}>
                <Icon size={12} /> {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {hasResults && (
            <div style={{ display: 'flex', gap: 8, fontSize: 11, fontWeight: 700 }}>
              <span style={{ color: '#22c55e' }}>{passedCount} passed</span>
              {failedCount > 0 && <span style={{ color: '#ef4444' }}>{failedCount} failed</span>}
            </div>
          )}
          <button onClick={handleRun} disabled={running} style={{
            padding: '6px 14px', borderRadius: 8, cursor: running ? 'not-allowed' : 'pointer',
            background: running ? 'rgba(139,92,246,0.1)' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            border: 'none', color: '#fff', fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 5,
            boxShadow: running ? 'none' : '0 2px 8px rgba(139,92,246,0.3)',
            opacity: running ? 0.7 : 1,
          }}>
            <Play size={11} /> {running ? 'Running...' : 'Run All'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 12, overflowY: 'auto', maxHeight: 260 }}>
        {/* Test Cases Tab */}
        {activeTab === 'tests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {testCases.map((tc, i) => (
              <div key={tc.id} style={{
                borderRadius: 10, overflow: 'hidden',
                border: `1px solid ${
                  tc.status === 'passed' ? 'rgba(34,197,94,0.2)' :
                  tc.status === 'failed' ? 'rgba(239,68,68,0.2)' :
                  'rgba(255,255,255,0.06)'
                }`,
                background: tc.status === 'passed' ? 'rgba(34,197,94,0.03)' :
                            tc.status === 'failed' ? 'rgba(239,68,68,0.03)' :
                            'rgba(255,255,255,0.02)',
              }}>
                <div
                  onClick={() => setExpandedTest(expandedTest === tc.id ? null : tc.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {tc.status === 'passed' ? <CheckCircle2 size={14} color="#22c55e" /> :
                     tc.status === 'failed' ? <XCircle size={14} color="#ef4444" /> :
                     <div style={{
                       width: 14, height: 14, borderRadius: '50%',
                       border: '2px solid rgba(255,255,255,0.15)',
                     }} />}
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: tc.status === 'passed' ? '#4ade80' :
                             tc.status === 'failed' ? '#f87171' :
                             'rgba(255,255,255,0.7)',
                    }}>{tc.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {tc.runtime && (
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={9} /> {tc.runtime}
                      </span>
                    )}
                    {tc.memory && (
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Cpu size={9} /> {tc.memory}
                      </span>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); removeTest(tc.id); }} style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                      color: 'rgba(255,255,255,0.2)',
                    }}>
                      <Trash2 size={12} />
                    </button>
                    {expandedTest === tc.id ? <ChevronDown size={12} color="rgba(255,255,255,0.3)" /> :
                     <ChevronRight size={12} color="rgba(255,255,255,0.3)" />}
                  </div>
                </div>

                {expandedTest === tc.id && (
                  <div style={{
                    padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.04)',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                  }}>
                    <div style={{ marginBottom: 6 }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>Input: </span>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{tc.input}</span>
                    </div>
                    <div style={{ marginBottom: 6 }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>Expected: </span>
                      <span style={{ color: '#60a5fa' }}>{tc.expectedOutput}</span>
                    </div>
                    {tc.actualOutput && (
                      <div>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>Output: </span>
                        <span style={{ color: tc.status === 'passed' ? '#4ade80' : '#f87171' }}>
                          {tc.actualOutput}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Custom Test Tab */}
        {activeTab === 'custom' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              placeholder="Test name (optional)"
              style={{
                padding: '8px 12px', borderRadius: 8, fontSize: 12,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', outline: 'none', fontFamily: "'Inter', sans-serif",
              }}
            />
            <textarea
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder="Input (e.g., nums = [1,2,3], target = 5)"
              rows={3}
              style={{
                padding: '8px 12px', borderRadius: 8, fontSize: 12, resize: 'vertical',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', outline: 'none', fontFamily: "'JetBrains Mono', monospace",
              }}
            />
            <textarea
              value={customExpected}
              onChange={e => setCustomExpected(e.target.value)}
              placeholder="Expected output (optional)"
              rows={2}
              style={{
                padding: '8px 12px', borderRadius: 8, fontSize: 12, resize: 'vertical',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#fff', outline: 'none', fontFamily: "'JetBrains Mono', monospace",
              }}
            />

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={addCustomTest} style={{
                flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(96,165,250,0.2))',
                border: '1px solid rgba(139,92,246,0.3)', color: '#c084fc',
                fontSize: 11, fontWeight: 700,
              }}>
                <Plus size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                Add Test Case
              </button>
            </div>

            {/* Edge case quick-add */}
            <div style={{ marginTop: 8 }}>
              <div style={{
                fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
              }}>Quick Add Edge Cases ({problemType})</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(EDGE_CASE_TEMPLATES[problemType] || EDGE_CASE_TEMPLATES.array).slice(0, 6).map((edge, i) => (
                  <button key={i} onClick={() => {
                    const tc = createTestCase(edge.input, '—', edge.name);
                    setTestCases(prev => [...prev, tc]);
                  }} style={{
                    padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 600,
                  }} title={edge.description}>
                    {edge.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stress Test Tab */}
        {activeTab === 'stress' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6,
                }}>Max Input Size</div>
                <input
                  type="range" min="10" max="10000" step="10"
                  value={stressSize}
                  onChange={e => setStressSize(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#8b5cf6' }}
                />
                <div style={{
                  fontSize: 11, color: '#c084fc', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                  marginTop: 4,
                }}>n = {stressSize.toLocaleString()}</div>
              </div>
              <button onClick={runStress} disabled={running} style={{
                padding: '10px 20px', borderRadius: 8, cursor: running ? 'not-allowed' : 'pointer',
                background: running ? 'rgba(139,92,246,0.1)' : 'linear-gradient(135deg, #f59e0b, #ef4444)',
                border: 'none', color: '#fff', fontSize: 11, fontWeight: 700,
                boxShadow: running ? 'none' : '0 2px 8px rgba(245,158,11,0.3)',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <FlaskConical size={14} /> {running ? 'Testing...' : 'Stress Test'}
              </button>
            </div>

            {stressTests.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {stressTests.map(st => (
                  <div key={st.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', borderRadius: 8,
                    background: st.status === 'passed' ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)',
                    border: `1px solid ${st.status === 'passed' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {st.status === 'passed' ?
                        <CheckCircle2 size={13} color="#22c55e" /> :
                        <XCircle size={13} color="#ef4444" />}
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                        {st.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={9} /> {st.runtime}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Cpu size={9} /> {st.memory}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
