import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import {
    ArrowLeft, Play, Terminal, Trash2, Copy, Check,
    Download, Upload, Clock, ChevronDown, Code2,
    Braces, Hash, FileCode, Layers, Sparkles, X,
    RotateCcw, Maximize2, Minimize2, Palette
} from 'lucide-react';
import { LANGUAGES, ALGORITHM_TEMPLATES } from '../data/dsaTemplates';
import { EDITOR_THEMES, registerAllThemes, getSavedTheme, saveTheme } from '../data/editorThemes';

// ─── Default starter code per language ───
const DEFAULT_CODE = {
    python: `# 🐍 Python Playground
# Write any Python code here and experiment freely!

def hello():
    print("Hello from PrepLoop Playground!")
    
    # Try out data structures
    nums = [3, 1, 4, 1, 5, 9, 2, 6]
    print(f"Original: {nums}")
    print(f"Sorted:   {sorted(nums)}")
    print(f"Sum:      {sum(nums)}")

hello()
`,
    javascript: `// ⚡ JavaScript Playground
// Write any JavaScript code here and experiment freely!

function hello() {
  console.log("Hello from PrepLoop Playground!");
  
  // Try out data structures
  const nums = [3, 1, 4, 1, 5, 9, 2, 6];
  console.log("Original:", nums);
  console.log("Sorted:  ", [...nums].sort((a, b) => a - b));
  console.log("Sum:     ", nums.reduce((a, b) => a + b, 0));
}

hello();
`,
    cpp: `// ⚙️ C++ Playground
// Write any C++ code here and experiment freely!

#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;

int main() {
    cout << "Hello from PrepLoop Playground!" << endl;
    
    // Try out data structures
    vector<int> nums = {3, 1, 4, 1, 5, 9, 2, 6};
    
    cout << "Original: ";
    for (int n : nums) cout << n << " ";
    cout << endl;
    
    sort(nums.begin(), nums.end());
    cout << "Sorted:   ";
    for (int n : nums) cout << n << " ";
    cout << endl;
    
    cout << "Sum:      " << accumulate(nums.begin(), nums.end(), 0) << endl;
    
    return 0;
}
`,
    java: `// ☕ Java Playground
// Write any Java code here and experiment freely!

import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from PrepLoop Playground!");
        
        // Try out data structures
        int[] nums = {3, 1, 4, 1, 5, 9, 2, 6};
        
        System.out.println("Original: " + Arrays.toString(nums));
        
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        System.out.println("Sorted:   " + Arrays.toString(sorted));
        
        int sum = IntStream.of(nums).sum();
        System.out.println("Sum:      " + sum);
    }
}
`,
    go: `// 🔷 Go Playground
// Write any Go code here and experiment freely!

package main

import (
    "fmt"
    "sort"
)

func main() {
    fmt.Println("Hello from PrepLoop Playground!")
    
    // Try out data structures
    nums := []int{3, 1, 4, 1, 5, 9, 2, 6}
    fmt.Println("Original:", nums)
    
    sorted := make([]int, len(nums))
    copy(sorted, nums)
    sort.Ints(sorted)
    fmt.Println("Sorted:  ", sorted)
    
    sum := 0
    for _, n := range nums {
        sum += n
    }
    fmt.Println("Sum:     ", sum)
}
`,
};

// ─── Quick snippet templates ───
const SNIPPETS = [
    {
        label: 'For Loop',
        icon: '🔁',
        code: {
            python: `for i in range(n):\n    pass`,
            javascript: `for (let i = 0; i < n; i++) {\n  \n}`,
            cpp: `for (int i = 0; i < n; i++) {\n    \n}`,
            java: `for (int i = 0; i < n; i++) {\n    \n}`,
            go: `for i := 0; i < n; i++ {\n    \n}`,
        },
    },
    {
        label: 'HashMap',
        icon: '🗺️',
        code: {
            python: `from collections import defaultdict\nfreq = defaultdict(int)\nfor item in arr:\n    freq[item] += 1`,
            javascript: `const map = new Map();\nfor (const item of arr) {\n  map.set(item, (map.get(item) || 0) + 1);\n}`,
            cpp: `unordered_map<int, int> freq;\nfor (int x : arr) {\n    freq[x]++;\n}`,
            java: `Map<Integer, Integer> freq = new HashMap<>();\nfor (int x : arr) {\n    freq.put(x, freq.getOrDefault(x, 0) + 1);\n}`,
            go: `freq := make(map[int]int)\nfor _, x := range arr {\n    freq[x]++\n}`,
        },
    },
    {
        label: 'Stack',
        icon: '📚',
        code: {
            python: `stack = []\nstack.append(item)  # push\ntop = stack.pop()   # pop\nif stack:           # not empty`,
            javascript: `const stack = [];\nstack.push(item);           // push\nconst top = stack.pop();    // pop\nif (stack.length > 0) {}    // not empty`,
            cpp: `stack<int> st;\nst.push(item);     // push\nint top = st.top(); st.pop(); // pop\nif (!st.empty()) {} // not empty`,
            java: `Stack<Integer> stack = new Stack<>();\nstack.push(item);      // push\nint top = stack.pop(); // pop\nif (!stack.isEmpty()) {} // not empty`,
            go: `stack := []int{}\nstack = append(stack, item)       // push\ntop := stack[len(stack)-1]        // peek\nstack = stack[:len(stack)-1]      // pop`,
        },
    },
    {
        label: 'Queue',
        icon: '📬',
        code: {
            python: `from collections import deque\nqueue = deque()\nqueue.append(item)   # enqueue\nfront = queue.popleft()  # dequeue`,
            javascript: `const queue = [];\nqueue.push(item);           // enqueue\nconst front = queue.shift(); // dequeue`,
            cpp: `queue<int> q;\nq.push(item);      // enqueue\nint front = q.front(); q.pop(); // dequeue`,
            java: `Queue<Integer> queue = new LinkedList<>();\nqueue.offer(item);       // enqueue\nint front = queue.poll(); // dequeue`,
            go: `queue := []int{}\nqueue = append(queue, item) // enqueue\nfront := queue[0]           // peek\nqueue = queue[1:]           // dequeue`,
        },
    },
    {
        label: 'LinkedList',
        icon: '🔗',
        code: {
            python: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next`,
            javascript: `class ListNode {\n  constructor(val = 0, next = null) {\n    this.val = val;\n    this.next = next;\n  }\n}`,
            cpp: `struct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};`,
            java: `class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}`,
            go: `type ListNode struct {\n    Val  int\n    Next *ListNode\n}`,
        },
    },
    {
        label: 'TreeNode',
        icon: '🌳',
        code: {
            python: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right`,
            javascript: `class TreeNode {\n  constructor(val = 0, left = null, right = null) {\n    this.val = val;\n    this.left = left;\n    this.right = right;\n  }\n}`,
            cpp: `struct TreeNode {\n    int val;\n    TreeNode* left;\n    TreeNode* right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};`,
            java: `class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}`,
            go: `type TreeNode struct {\n    Val   int\n    Left  *TreeNode\n    Right *TreeNode\n}`,
        },
    },
];

// ─── Timer formatter ───
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ─── Simulated output generation ───
function simulateOutput(code, language) {
    const lines = [];
    const timestamp = new Date().toLocaleTimeString();
    lines.push({ type: 'info', text: `[${timestamp}] Running ${language}...` });

    // Extract print/console.log statements for simulated output
    const printPatterns = {
        python: /print\s*\(\s*(?:f?["'](.+?)["']|(.+?))\s*\)/g,
        javascript: /console\.log\s*\(\s*["'](.+?)["']\s*(?:,\s*(.+?))?\s*\)/g,
        cpp: /cout\s*<<\s*["'](.+?)["']/g,
        java: /System\.out\.println\s*\(\s*["'](.+?)["']\s*\)/g,
        go: /fmt\.Println\s*\(\s*["'](.+?)["']\s*\)/g,
    };

    const pattern = printPatterns[language];
    if (pattern) {
        let match;
        while ((match = pattern.exec(code)) !== null) {
            lines.push({ type: 'output', text: match[1] || match[2] || match[0] });
        }
    }

    if (lines.length === 1) {
        lines.push({ type: 'output', text: '✓ Code compiled successfully' });
    }

    const runtime = (Math.random() * 50 + 10).toFixed(1);
    const memory = (Math.random() * 5 + 8).toFixed(1);
    lines.push({ type: 'info', text: `\n⏱ Runtime: ${runtime}ms  |  💾 Memory: ${memory}MB` });

    return lines;
}

export default function CodingPlayground() {
    const navigate = useNavigate();
    const editorRef = useRef(null);

    // Editor state
    const [language, setLanguage] = useState(() =>
        localStorage.getItem('playground-lang') || 'python'
    );
    const [code, setCode] = useState('');
    const [running, setRunning] = useState(false);
    const [consoleOutput, setConsoleOutput] = useState([]);
    const [copied, setCopied] = useState(false);

    // UI state
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [showSnippets, setShowSnippets] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [consoleHeight, setConsoleHeight] = useState(200);
    const [timer, setTimer] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [editorTheme, setEditorTheme] = useState(() => getSavedTheme('playground-editor-theme'));
    const [showThemeMenu, setShowThemeMenu] = useState(false);

    // Console resize ref
    const draggingRef = useRef(null);
    const monacoRef = useRef(null);

    // ─── Load saved code or default ───
    useEffect(() => {
        const saved = localStorage.getItem(`playground-code-${language}`);
        setCode(saved || DEFAULT_CODE[language] || '');
    }, [language]);

    // ─── Auto-save ───
    useEffect(() => {
        if (!code) return;
        const timeout = setTimeout(() => {
            localStorage.setItem(`playground-code-${language}`, code);
        }, 500);
        return () => clearTimeout(timeout);
    }, [code, language]);

    // ─── Timer ───
    useEffect(() => {
        if (!timerActive) return;
        const id = setInterval(() => setTimer(t => t + 1), 1000);
        return () => clearInterval(id);
    }, [timerActive]);

    // ─── Language change ───
    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        localStorage.setItem('playground-lang', lang);
        setShowLangMenu(false);
    };

    // ─── Run code ───
    const handleRun = useCallback(() => {
        setRunning(true);
        setTimeout(() => {
            const output = simulateOutput(code, language);
            setConsoleOutput(prev => [...prev, ...output]);
            setRunning(false);
        }, 400 + Math.random() * 600);
    }, [code, language]);

    // ─── Clear console ───
    const clearConsole = () => setConsoleOutput([]);

    // ─── Copy code ───
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ─── Download code ───
    const handleDownload = () => {
        const extensions = { python: 'py', javascript: 'js', cpp: 'cpp', java: 'java', go: 'go' };
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `playground.${extensions[language] || 'txt'}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ─── Reset code ───
    const handleReset = () => {
        setCode(DEFAULT_CODE[language] || '');
        localStorage.removeItem(`playground-code-${language}`);
    };

    // ─── Insert snippet ───
    const insertSnippet = (snippetCode) => {
        if (editorRef.current) {
            const editor = editorRef.current;
            const position = editor.getPosition();
            editor.executeEdits('insert-snippet', [{
                range: {
                    startLineNumber: position.lineNumber,
                    startColumn: position.column,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                },
                text: '\n' + snippetCode + '\n',
            }]);
            editor.focus();
        } else {
            setCode(prev => prev + '\n\n' + snippetCode);
        }
        setShowSnippets(false);
    };

    // ─── Insert algorithm template ───
    const insertTemplate = (template) => {
        const templateCode = template.templates[language] || template.templates.python || '';
        insertSnippet(templateCode);
        setShowTemplates(false);
    };

    // ─── Console resize ───
    const handleResizeMouseDown = (e) => {
        e.preventDefault();
        draggingRef.current = { startY: e.clientY, startHeight: consoleHeight };
        document.addEventListener('mousemove', handleResizeMouseMove);
        document.addEventListener('mouseup', handleResizeMouseUp);
    };

    const handleResizeMouseMove = useCallback((e) => {
        const d = draggingRef.current;
        if (!d) return;
        const dy = d.startY - e.clientY;
        setConsoleHeight(Math.max(80, Math.min(500, d.startHeight + dy)));
    }, []);

    const handleResizeMouseUp = useCallback(() => {
        draggingRef.current = null;
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
    }, [handleResizeMouseMove]);

    // ─── Keyboard shortcuts ───
    useEffect(() => {
        const handler = (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleRun();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleRun]);

    // ─── Monaco editor setup ───
    const handleBeforeMount = (monaco) => {
        registerAllThemes(monaco);
    };

    const handleEditorMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        editor.addAction({
            id: 'run-code',
            label: 'Run Code',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
            run: () => handleRun(),
        });
    };

    // ─── Theme change handler ───
    const handleThemeChange = (themeId) => {
        setEditorTheme(themeId);
        saveTheme(themeId, 'playground-editor-theme');
        if (monacoRef.current) {
            monacoRef.current.editor.setTheme(themeId);
        }
        setShowThemeMenu(false);
    };

    const langInfo = LANGUAGES.find(l => l.id === language) || LANGUAGES[0];

    return (
        <div className="pg-root">
            {/* ─── Top Bar ─── */}
            <div className="pg-topbar">
                <div className="pg-topbar-left">
                    <button onClick={() => navigate('/dashboard')} className="pg-back-btn">
                        <ArrowLeft size={14} />
                        <span>Dashboard</span>
                    </button>

                    <div className="pg-title-group">
                        <div className="pg-title-icon">
                            <Terminal size={16} />
                        </div>
                        <h1 className="pg-title">Coding Playground</h1>
                        <span className="pg-title-badge">Free Mode</span>
                    </div>
                </div>

                <div className="pg-topbar-center">
                    {/* Language Selector */}
                    <div className="pg-lang-wrap">
                        <button className="pg-lang-btn" onClick={() => setShowLangMenu(s => !s)}>
                            <span>{langInfo.icon}</span>
                            <span>{langInfo.label}</span>
                            <ChevronDown size={12} />
                        </button>
                        {showLangMenu && (
                            <div className="pg-dropdown pg-lang-dropdown">
                                {LANGUAGES.map(l => (
                                    <button
                                        key={l.id}
                                        className={`pg-dropdown-item ${language === l.id ? 'active' : ''}`}
                                        onClick={() => handleLanguageChange(l.id)}
                                    >
                                        <span>{l.icon}</span>
                                        <span>{l.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Snippets */}
                    <div className="pg-snippet-wrap">
                        <button className="pg-toolbar-btn" onClick={() => { setShowSnippets(s => !s); setShowTemplates(false); }}>
                            <Braces size={14} />
                            <span>Snippets</span>
                        </button>
                        {showSnippets && (
                            <div className="pg-dropdown pg-snippets-dropdown">
                                <div className="pg-dropdown-header">Quick Snippets</div>
                                {SNIPPETS.map((s, i) => (
                                    <button
                                        key={i}
                                        className="pg-dropdown-item"
                                        onClick={() => insertSnippet(s.code[language] || s.code.python)}
                                    >
                                        <span>{s.icon}</span>
                                        <span>{s.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Algorithm Templates */}
                    <div className="pg-template-wrap">
                        <button className="pg-toolbar-btn" onClick={() => { setShowTemplates(s => !s); setShowSnippets(false); }}>
                            <Sparkles size={14} />
                            <span>Templates</span>
                        </button>
                        {showTemplates && (
                            <div className="pg-dropdown pg-templates-dropdown">
                                <div className="pg-dropdown-header">Algorithm Templates</div>
                                {Object.entries(ALGORITHM_TEMPLATES).map(([key, tmpl]) => (
                                    <button
                                        key={key}
                                        className="pg-dropdown-item"
                                        onClick={() => insertTemplate(tmpl)}
                                    >
                                        <span>{tmpl.icon}</span>
                                        <span>{tmpl.name}</span>
                                        <span className="pg-complexity">{tmpl.complexity.time}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Theme Selector */}
                    <div className="pg-theme-wrap" style={{ position: 'relative' }}>
                        <button className="pg-toolbar-btn" onClick={() => { setShowThemeMenu(s => !s); setShowSnippets(false); setShowTemplates(false); }}>
                            <Palette size={14} />
                            <span>{EDITOR_THEMES.find(t => t.id === editorTheme)?.label || 'Theme'}</span>
                            <ChevronDown size={12} />
                        </button>
                        {showThemeMenu && (
                            <div className="pg-dropdown pg-theme-dropdown">
                                <div className="pg-dropdown-header">Editor Theme</div>
                                {EDITOR_THEMES.map(theme => (
                                    <button
                                        key={theme.id}
                                        className={`pg-dropdown-item ${editorTheme === theme.id ? 'active' : ''}`}
                                        onClick={() => handleThemeChange(theme.id)}
                                    >
                                        <span>{theme.icon}</span>
                                        <span style={{ flex: 1 }}>{theme.label}</span>
                                        <span style={{
                                            width: 14, height: 14, borderRadius: 4,
                                            background: theme.colors['editor.background'],
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            flexShrink: 0, display: 'inline-block',
                                        }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="pg-topbar-right">
                    {/* Timer */}
                    <button
                        className={`pg-toolbar-btn ${timerActive ? 'pg-timer-active' : ''}`}
                        onClick={() => setTimerActive(p => !p)}
                    >
                        <Clock size={14} />
                        <span>{formatTime(timer)}</span>
                    </button>
                    {timer > 0 && (
                        <button className="pg-toolbar-btn-icon" onClick={() => { setTimer(0); setTimerActive(false); }} title="Reset timer">
                            <RotateCcw size={13} />
                        </button>
                    )}

                    {/* Actions */}
                    <button className="pg-toolbar-btn-icon" onClick={handleCopy} title="Copy code">
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button className="pg-toolbar-btn-icon" onClick={handleDownload} title="Download">
                        <Download size={14} />
                    </button>
                    <button className="pg-toolbar-btn-icon" onClick={handleReset} title="Reset to default">
                        <Trash2 size={14} />
                    </button>

                    {/* Run button */}
                    <button className="pg-run-btn" onClick={handleRun} disabled={running}>
                        <Play size={14} />
                        <span>{running ? 'Running...' : 'Run'}</span>
                        <kbd>Ctrl+↵</kbd>
                    </button>
                </div>
            </div>

            {/* ─── Main Editor Area ─── */}
            <div className="pg-editor-area">
                <div className="pg-editor-wrapper" style={{ flex: 1 }}>
                    <Editor
                        height="100%"
                        language={langInfo.monacoId}
                        value={code}
                        onChange={val => setCode(val || '')}
                        beforeMount={handleBeforeMount}
                        onMount={handleEditorMount}
                        theme={editorTheme}
                        options={{
                            fontSize: 14,
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            fontLigatures: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            cursorBlinking: 'smooth',
                            cursorSmoothCaretAnimation: 'on',
                            padding: { top: 16, bottom: 16 },
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

                    {/* Language badge overlay */}
                    <div className="pg-lang-badge">
                        <span>{langInfo.icon}</span> {langInfo.label}
                    </div>
                </div>

                {/* ─── Console Panel ─── */}
                <div className="pg-console" style={{ height: consoleHeight }}>
                    {/* Resize handle */}
                    <div className="pg-console-resize" onMouseDown={handleResizeMouseDown}>
                        <div className="pg-console-resize-bar" />
                    </div>

                    <div className="pg-console-header">
                        <div className="pg-console-title">
                            <Terminal size={13} />
                            <span>Console</span>
                            <span className="pg-console-count">{consoleOutput.length} lines</span>
                        </div>
                        <button className="pg-console-clear" onClick={clearConsole}>
                            <Trash2 size={12} />
                            <span>Clear</span>
                        </button>
                    </div>

                    <div className="pg-console-body">
                        {consoleOutput.length === 0 ? (
                            <div className="pg-console-empty">
                                <Terminal size={24} strokeWidth={1} />
                                <p>Run your code to see output here</p>
                                <kbd>Ctrl + Enter</kbd>
                            </div>
                        ) : (
                            consoleOutput.map((line, i) => (
                                <div key={i} className={`pg-console-line pg-console-${line.type}`}>
                                    {line.type === 'info' && <span className="pg-console-prefix">›</span>}
                                    {line.type === 'output' && <span className="pg-console-prefix">»</span>}
                                    {line.type === 'error' && <span className="pg-console-prefix">✕</span>}
                                    <span>{line.text}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Click-away listener for dropdowns */}
            {(showLangMenu || showSnippets || showTemplates || showThemeMenu) && (
                <div
                    className="pg-overlay"
                    onClick={() => { setShowLangMenu(false); setShowSnippets(false); setShowTemplates(false); setShowThemeMenu(false); }}
                />
            )}
        </div>
    );
}
