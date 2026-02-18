import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Lightbulb, X, GripVertical } from 'lucide-react';
import DSAToolbar from '../components/editor/DSAToolbar';
import ProblemDescriptionPanel from '../components/editor/ProblemDescriptionPanel';
import VisualizationPanel from '../components/editor/VisualizationPanel';
import TestCasePanel from '../components/editor/TestCasePanel';
import HintsPanel from '../components/solver/HintsPanel';
import { LANGUAGES, ALGORITHM_TEMPLATES, DATA_STRUCTURE_TEMPLATES, PATTERN_HINTS } from '../data/dsaTemplates';
import { PROBLEMS } from '../data/problemsDatabase';

// ─── Starter code per language ───
const STARTER_CODE = {
  python: (name) => `class Solution:
    def ${name || 'solve'}(self, nums):
        # Write your solution here
        pass`,
  javascript: (name) => `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function ${name || 'solve'}(nums) {
  // Write your solution here

}`,
  cpp: (name) => `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> ${name || 'solve'}(vector<int>& nums) {
        // Write your solution here

    }
};`,
  java: (name) => `import java.util.*;

class Solution {
    public int[] ${name || 'solve'}(int[] nums) {
        // Write your solution here

    }
}`,
  go: (name) => `package main

func ${name || 'solve'}(nums []int) []int {
    // Write your solution here

    return nil
}`,
};

// ─── Timer ───
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function DSACodeEditor() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  // Problem state
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editor state
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('dsa-editor-lang') || 'python';
  });
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // UI state
  const [showHints, setShowHints] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [leftWidth, setLeftWidth] = useState(28);
  const [rightWidth, setRightWidth] = useState(30);
  const [bottomHeight, setBottomHeight] = useState(220);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [testResults, setTestResults] = useState(null);

  // ─── Resizing ───
  const draggingRef = useRef(null);

  const handleMouseDown = (panel) => (e) => {
    e.preventDefault();
    draggingRef.current = { panel, startX: e.clientX, startY: e.clientY, leftWidth, rightWidth, bottomHeight };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e) => {
    const d = draggingRef.current;
    if (!d) return;
    const totalWidth = window.innerWidth;

    if (d.panel === 'left') {
      const dx = e.clientX - d.startX;
      const pct = (dx / totalWidth) * 100;
      setLeftWidth(Math.max(15, Math.min(45, d.leftWidth + pct)));
    } else if (d.panel === 'right') {
      const dx = d.startX - e.clientX;
      const pct = (dx / totalWidth) * 100;
      setRightWidth(Math.max(15, Math.min(45, d.rightWidth + pct)));
    } else if (d.panel === 'bottom') {
      const dy = d.startY - e.clientY;
      setBottomHeight(Math.max(100, Math.min(500, d.bottomHeight + dy)));
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    draggingRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  // ─── Timer ───
  useEffect(() => {
    if (!timerActive) return;
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [timerActive]);

  // ─── Fetch problem ───
  useEffect(() => {
    setLoading(true);
    // Try to find from local data first (supports numeric or string IDs)
    const numId = parseInt(problemId);
    const localProblem = PROBLEMS.find(p =>
      p.id === numId ||
      p.id === problemId ||
      p.title.toLowerCase().replace(/\s+/g, '-') === problemId
    );
    if (localProblem) {
      setProblem({
        ...localProblem,
        pattern_name: localProblem.pattern || localProblem.patterns?.[0]?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '',
      });
      setLoading(false);
    } else {
      // Fallback demo problem
      setProblem({
        id: problemId || 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        pattern_name: 'Arrays & Hashing',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
          { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
          { input: 'nums = [3,3], target = 6', output: '[0,1]' },
        ],
        constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
        companies: ['Google', 'Amazon', 'Apple', 'Meta', 'Bloomberg'],
      });
      setLoading(false);
    }
  }, [problemId]);

  // ─── Load saved code or starter code ───
  useEffect(() => {
    if (!problem) return;
    const saved = localStorage.getItem(`dsa-code-${problem.id}-${language}`);
    if (saved) {
      setCode(saved);
    } else {
      const funcName = problem.title
        ? problem.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
        : 'solve';
      setCode(STARTER_CODE[language]?.(funcName) || '');
    }
  }, [problem, language]);

  // ─── Auto-save code ───
  useEffect(() => {
    if (!problem || !code) return;
    const timeout = setTimeout(() => {
      localStorage.setItem(`dsa-code-${problem.id}-${language}`, code);
    }, 500);
    return () => clearTimeout(timeout);
  }, [code, problem, language]);

  // ─── Save language preference ───
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('dsa-editor-lang', lang);
  };

  // ─── Insert template ───
  const handleInsertTemplate = (template) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const position = editor.getPosition();
      const range = {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      };
      editor.executeEdits('insert-template', [{
        range,
        text: '\n' + template + '\n',
      }]);
      editor.focus();
    } else {
      setCode(prev => prev + '\n\n' + template);
    }
  };

  // ─── Run code (mock) ───
  const handleRun = useCallback(() => {
    setRunning(true);
    setOutput(null);
    setFeedback(null);

    setTimeout(() => {
      setOutput({
        success: true,
        output: '[0, 1]',
        message: 'All test cases passed!',
      });
      setRunning(false);
    }, 800 + Math.random() * 700);
  }, [code, language]);

  // ─── Submit code (mock) ───
  const handleSubmit = useCallback(() => {
    setRunning(true);
    setOutput(null);
    setFeedback(null);

    setTimeout(() => {
      const accepted = Math.random() > 0.2;
      setOutput({
        success: accepted,
        submission: {
          status: accepted ? 'accepted' : 'wrong_answer',
          runtime: `${Math.floor(40 + Math.random() * 80)}ms`,
          memory: `${(14 + Math.random() * 6).toFixed(1)}MB`,
          percentile: `${(60 + Math.random() * 38).toFixed(1)}%`,
        },
        message: accepted
          ? `Accepted — Runtime: ${Math.floor(40 + Math.random() * 80)}ms`
          : 'Wrong Answer on test case 3',
      });

      if (accepted) {
        setFeedback({
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(n)',
          suggestions: 'Great solution using a hash map! This achieves optimal O(n) time complexity. Consider handling edge cases like empty arrays or arrays with a single element for robustness.',
        });
        setTimerActive(false); // Stop timer on accept
      }
      setRunning(false);
    }, 1200 + Math.random() * 800);
  }, [code, language]);

  // ─── Keyboard shortcuts ───
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleRun();
      } else if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        setShowHints(s => !s);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRun, handleSubmit]);

  // ─── Detect pattern from problem ───
  const detectedPattern = problem?.pattern_name || null;

  // ─── Monaco editor setup ───
  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    // Custom editor theme
    monaco.editor.defineTheme('dsa-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c678dd', fontStyle: 'bold' },
        { token: 'string', foreground: '98c379' },
        { token: 'number', foreground: 'd19a66' },
        { token: 'type', foreground: 'e5c07b' },
        { token: 'variable', foreground: 'e06c75' },
        { token: 'function', foreground: '61afef' },
        { token: 'operator', foreground: '56b6c2' },
      ],
      colors: {
        'editor.background': '#0a0a1a',
        'editor.foreground': '#abb2bf',
        'editor.lineHighlightBackground': '#1a1a3e30',
        'editorCursor.foreground': '#8b5cf6',
        'editor.selectionBackground': '#3b3f5c50',
        'editorLineNumber.foreground': '#3b3f5c',
        'editorLineNumber.activeForeground': '#8b5cf6',
        'editorIndentGuide.background': '#1a1a3e40',
        'editorGutter.background': '#0a0a1a',
        'scrollbar.shadow': '#00000000',
        'editorScrollbar.background': '#0a0a1a',
      },
    });

    monaco.editor.setTheme('dsa-dark');

    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => handleRun(),
    });
  };

  const langInfo = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a1a', color: '#c084fc',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid rgba(139,92,246,0.2)',
            borderTopColor: '#8b5cf6', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ fontSize: 13, fontWeight: 600 }}>Loading editor...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: '#0a0a1a', overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Top Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'rgba(10,10,26,0.98)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        {/* Back button */}
        <button onClick={() => navigate('/problems')} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px',
          height: 48, cursor: 'pointer',
          background: 'none', border: 'none', borderRight: '1px solid rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
        }}>
          <ArrowLeft size={14} /> Problems
        </button>

        <div style={{ flex: 1 }}>
          <DSAToolbar
            language={language}
            onLanguageChange={handleLanguageChange}
            onRun={handleRun}
            onSubmit={handleSubmit}
            onInsertTemplate={handleInsertTemplate}
            running={running}
            timer={formatTime(timer)}
            onToggleFocus={() => setFocusMode(f => !f)}
            focusMode={focusMode}
          />
        </div>
      </div>

      {/* Main 3-panel layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Left: Problem Description */}
        {!focusMode && (
          <>
            <div style={{
              width: `${leftWidth}%`, minWidth: 200, overflow: 'hidden',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              position: 'relative',
            }}>
              <ProblemDescriptionPanel
                problem={problem}
                onShowHints={() => setShowHints(s => !s)}
                showHints={showHints}
              />
            </div>

            {/* Left resize handle */}
            <div
              onMouseDown={handleMouseDown('left')}
              style={{
                width: 5, cursor: 'col-resize', zIndex: 10,
                background: 'transparent', flexShrink: 0,
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 3, height: 30, borderRadius: 2,
                background: 'rgba(255,255,255,0.06)',
                transition: 'background 0.2s',
              }} />
            </div>
          </>
        )}

        {/* Center: Code Editor + Test Cases */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          overflow: 'hidden', minWidth: 300,
        }}>
          {/* Editor */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <Editor
              height="100%"
              language={langInfo.monacoId}
              value={code}
              onChange={val => setCode(val || '')}
              onMount={handleEditorMount}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                padding: { top: 16 },
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true, indentation: true },
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
                folding: true,
                wordWrap: 'on',
                suggestOnTriggerCharacters: true,
                tabSize: 4,
                detectIndentation: true,
              }}
            />

            {/* Pattern recognition badge */}
            {detectedPattern && (
              <div style={{
                position: 'absolute', top: 12, right: 12,
                padding: '4px 12px', borderRadius: 8,
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.2)',
                backdropFilter: 'blur(8px)',
                color: '#c084fc', fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 5, zIndex: 5,
              }}>
                🧩 {detectedPattern}
              </div>
            )}
          </div>

          {/* Bottom: Test Cases */}
          <div
            style={{
              height: bottomHeight, flexShrink: 0,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              position: 'relative',
            }}
          >
            {/* Bottom resize handle */}
            <div
              onMouseDown={handleMouseDown('bottom')}
              style={{
                position: 'absolute', top: -3, left: 0, right: 0,
                height: 6, cursor: 'row-resize', zIndex: 10,
              }}
            >
              <div style={{
                position: 'absolute', top: 2, left: '50%',
                transform: 'translateX(-50%)',
                width: 30, height: 3, borderRadius: 2,
                background: 'rgba(255,255,255,0.06)',
              }} />
            </div>
            <TestCasePanel
              code={code}
              language={language}
              problemId={problemId}
              problemDescription={problem?.description}
              onTestResults={setTestResults}
            />
          </div>
        </div>

        {/* Right resize handle */}
        {!focusMode && (
          <div
            onMouseDown={handleMouseDown('right')}
            style={{
              width: 5, cursor: 'col-resize', zIndex: 10,
              background: 'transparent', flexShrink: 0,
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 3, height: 30, borderRadius: 2,
              background: 'rgba(255,255,255,0.06)',
            }} />
          </div>
        )}

        {/* Right: Visualization / Output Panel */}
        {!focusMode && (
          <div style={{
            width: `${rightWidth}%`, minWidth: 200, overflow: 'hidden',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
          }}>
            <VisualizationPanel
              output={output}
              feedback={feedback}
            />
          </div>
        )}

        {/* AI Hints Overlay */}
        {showHints && (
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0,
            width: 380, zIndex: 50,
            background: 'rgba(10,10,26,0.98)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column',
            animation: 'slideIn 0.25s ease-out',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{
                fontSize: 13, fontWeight: 800, color: '#fbbf24',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Lightbulb size={15} /> AI Assistant
              </span>
              <button onClick={() => setShowHints(false)} style={{
                width: 28, height: 28, borderRadius: 6, cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <X size={14} />
              </button>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <HintsPanel
                problemId={problemId}
                code={code}
                language={language}
                patternName={detectedPattern}
                onInsertTemplate={handleInsertTemplate}
              />
            </div>
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
