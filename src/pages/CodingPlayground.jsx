import { useEffect, useMemo, useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Bug, Clock3, Lightbulb, Maximize2, Minimize2, Play, RefreshCw } from 'lucide-react';

const LANGUAGE_TEMPLATES = {
  javascript: {
    template: `// JavaScript Playground
function solve() {
  // Write your code here
  console.log("Hello, World!");
}

solve();`,
    mode: 'javascript'
  },
  python: {
    template: `# Python Playground
def solve():
    # Write your code here
    print("Hello, World!")

solve()`,
    mode: 'python'
  },
  java: {
    template: `// Java Playground
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    mode: 'java'
  },
  cpp: {
    template: `// C++ Playground
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    mode: 'cpp'
  },
  typescript: {
    template: `// TypeScript Playground
function solve(): void {
  // Write your code here
  console.log("Hello, World!");
}

solve();`,
    mode: 'typescript'
  }
};

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'typescript', label: 'TypeScript' }
];

export default function CodingPlayground() {
  const containerRef = useRef(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript.template);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [activePanel, setActivePanel] = useState('console');
  const [reportProblem, setReportProblem] = useState('');
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [editorTheme, setEditorTheme] = useState('vs-light');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const suggestionWords = ['Array', 'Two Pointers', 'Sliding Window', 'Prefix Sum', 'Hash Map', 'Edge Cases'];

  useEffect(() => {
    if (!stopwatchRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [stopwatchRunning]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const timerLabel = useMemo(() => {
    const hours = Math.floor(elapsedSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((elapsedSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }, [elapsedSeconds]);

  const buildHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(LANGUAGE_TEMPLATES[newLang].template);
    setOutput('');
  };

  const executeCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');

    const executionLanguage = language === 'typescript' ? 'javascript' : language;

    try {
      const response = await fetch('/api/practice/execute', {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          language: executionLanguage,
          code,
          input
        })
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Execution failed (${response.status}): ${errBody}`);
      }

      const data = await response.json();

      if (data.success) {
        const executionTime = typeof data.executionTime === 'number' ? `${data.executionTime}ms` : 'N/A';
        setOutput(`Execution Time: ${executionTime}\n\n${data.output || 'Code executed successfully.'}`);
        return { ok: true, data };
      } else {
        setOutput(`Error:\n${data.error || 'Execution failed'}`);
        return { ok: false, data };
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      return { ok: false, error };
    } finally {
      setIsRunning(false);
    }
  };

  const handleRun = async () => {
    await executeCode();
    setActivePanel('console');
  };

  const handleDebug = async () => {
    setIsRunning(true);
    setOutput('Debugging...');

    try {
      const result = await executeCode();
      if (result.ok) {
        setOutput(prev => `${prev}\n\n🛠 Debug Notes:\n- Validate boundary cases\n- Verify output format\n- Re-check complexity assumptions`);
      } else {
        setOutput(prev => `${prev}\n\n🛠 Debug Notes:\n- Check syntax and runtime errors\n- Inspect input parsing\n- Add incremental console logs`);
      }
      setActivePanel('console');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(LANGUAGE_TEMPLATES[language].template);
    setInput('');
    setOutput('');
    setReportProblem('');
  };

  const toggleStopwatch = () => {
    if (!stopwatchRunning) {
      setElapsedSeconds(0);
    }
    setStopwatchRunning(prev => !prev);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      setOutput(`Fullscreen error: ${error.message}`);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${isFullscreen ? 'h-screen p-0' : 'h-[calc(100vh-64px)] p-3'} w-full bg-[#f3f4f6]`}
    >
      <div className="h-full rounded-md border border-[#d1d5db] bg-white overflow-hidden flex flex-col">
        <div className="h-11 border-b border-[#d1d5db] bg-[#f9fafb] px-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="h-7 rounded border border-[#d1d5db] bg-white px-2 text-sm text-[#111827] focus:outline-none"
            >
              {LANGUAGE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <div className="h-5 w-px bg-[#d1d5db]" />

            <div className="flex items-center gap-2 text-[#111827] text-sm">
              <Clock3 size={15} />
              <span className="font-medium">{timerLabel}</span>
            </div>

            <button
              onClick={toggleStopwatch}
              className={`h-7 px-2 rounded border text-xs font-semibold ${stopwatchRunning ? 'border-[#10b981] bg-[#ecfdf5] text-[#047857]' : 'border-[#d1d5db] bg-white text-[#374151]'}`}
              title="Stopwatch"
            >
              {stopwatchRunning ? 'Stopwatch On' : 'Stopwatch Off'}
            </button>

            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value)}
              className="h-7 rounded border border-[#d1d5db] bg-white px-2 text-xs text-[#111827] focus:outline-none"
              title="Theme"
            >
              <option value="vs-light">Light</option>
              <option value="vs-dark">Dark</option>
              <option value="hc-black">High Contrast</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="h-7 w-7 rounded border border-[#d1d5db] bg-white text-[#374151] inline-flex items-center justify-center"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>

            <button
              onClick={handleReset}
              className="h-7 px-2 rounded border border-[#d1d5db] bg-white text-[#374151] inline-flex items-center justify-center text-xs font-semibold"
              title="Reset"
            >
              <RefreshCw size={12} className="mr-1" /> Reset
            </button>

            <button
              onClick={handleDebug}
              disabled={isRunning}
              className="h-7 px-2 rounded border border-[#fcd34d] bg-[#f59e0b] text-white inline-flex items-center justify-center disabled:opacity-60 text-xs font-semibold"
              title="Debug"
            >
              <Bug size={12} className="mr-1" /> Debug
            </button>

            <button
              onClick={handleRun}
              disabled={isRunning}
              className="h-7 px-2 rounded border border-[#86efac] bg-[#22c55e] text-white inline-flex items-center justify-center disabled:opacity-60 text-xs font-semibold"
              title="Run"
            >
              <Play size={12} fill="currentColor" className="mr-1" /> Run
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            language={LANGUAGE_TEMPLATES[language].mode}
            theme={editorTheme}
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              fontSize: 18,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              glyphMargin: true,
              folding: true,
              lineNumbersMinChars: 3
            }}
          />
        </div>

        <div className="h-40 border-t border-[#d1d5db] bg-[#f9fafb] flex flex-col">
          <div className="h-12 px-3 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => setActivePanel('console')}
                className={`pb-1 border-b-2 ${activePanel === 'console' ? 'border-[#6366f1] text-[#4f46e5]' : 'border-transparent text-[#6b7280]'}`}
              >
                Console
              </button>
              <button
                onClick={() => setActivePanel('report')}
                className={`pb-1 border-b-2 ${activePanel === 'report' ? 'border-[#6366f1] text-[#4f46e5]' : 'border-transparent text-[#6b7280]'}`}
              >
                Suggestion Word
              </button>
            </div>

            <div className="text-xs text-[#6b7280]">Use top-right controls</div>
          </div>

          <div className="flex-1 px-3 pb-3">
            {activePanel === 'console' ? (
              <div className="h-full rounded border border-[#d1d5db] bg-white p-3 text-sm text-[#111827] overflow-auto whitespace-pre-wrap">
                {output || 'Run code to see output.'}
              </div>
            ) : (
              <div className="h-full rounded border border-[#d1d5db] bg-white p-3 text-sm text-[#111827] overflow-auto space-y-2">
                <div className="font-semibold text-[#374151] flex items-center gap-2">
                  <Lightbulb size={14} /> Suggestion Word
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestionWords.map((word, index) => (
                    <span key={`${word}-${index}`} className="px-2 py-0.5 rounded bg-[#eef2ff] text-[#4f46e5] text-xs border border-[#c7d2fe]">
                      {word}
                    </span>
                  ))}
                </div>
                <textarea
                  value={reportProblem}
                  onChange={(e) => setReportProblem(e.target.value)}
                  placeholder="Add your own suggestion notes..."
                  className="h-[70px] w-full rounded border border-[#d1d5db] bg-white p-2 text-sm text-[#111827] resize-none focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
