import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, RotateCcw, Save, Clock, CheckCircle, XCircle, Code2, Terminal, Copy } from 'lucide-react';
import Editor from '@monaco-editor/react';

export default function CodePractice() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [executionTime, setExecutionTime] = useState(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript', starter: '// Write your JavaScript code here\n\nfunction solution() {\n  console.log("Hello, World!");\n}\n\nsolution();' },
    { value: 'python', label: 'Python', starter: '# Write your Python code here\n\ndef solution():\n    print("Hello, World!")\n\nsolution()' },
    { value: 'java', label: 'Java', starter: '// Write your Java code here\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
    { value: 'cpp', label: 'C++', starter: '// Write your C++ code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}' },
    { value: 'typescript', label: 'TypeScript', starter: '// Write your TypeScript code here\n\nfunction solution(): void {\n  console.log("Hello, World!");\n}\n\nsolution();' }
  ];

  useEffect(() => {
    loadSavedSnippets();
    const lang = languages.find(l => l.value === selectedLanguage);
    setCode(lang.starter);
  }, []);

  const loadSavedSnippets = async () => {
    try {
      const response = await axios.get('/api/practice/snippets');
      setSavedSnippets(response.data.snippets);
    } catch (error) {
      console.error('Error loading snippets:', error);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setExecutionTime(null);

    const startTime = Date.now();

    try {
      const response = await axios.post('/api/practice/execute', {
        code,
        language: selectedLanguage,
        input: customInput
      });

      const endTime = Date.now();
      setExecutionTime(endTime - startTime);

      if (response.data.success) {
        setOutput(response.data.output || 'Code executed successfully (no output)');
      } else {
        setOutput(`Error: ${response.data.error}`);
      }
    } catch (error) {
      setOutput(`Execution failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    const lang = languages.find(l => l.value === selectedLanguage);
    setCode(lang.starter);
    setOutput('');
    setCustomInput('');
    setExecutionTime(null);
  };

  const saveSnippet = async () => {
    const name = prompt('Enter a name for this snippet:');
    if (!name) return;

    try {
      await axios.post('/api/practice/snippets', {
        name,
        code,
        language: selectedLanguage
      });
      alert('Snippet saved successfully!');
      loadSavedSnippets();
    } catch (error) {
      alert('Failed to save snippet');
    }
  };

  const loadSnippet = (snippet) => {
    setCode(snippet.code);
    setSelectedLanguage(snippet.language);
  };

  const handleLanguageChange = (newLang) => {
    if (code && code !== languages.find(l => l.value === selectedLanguage).starter) {
      if (!window.confirm('Changing language will reset your code. Continue?')) {
        return;
      }
    }
    setSelectedLanguage(newLang);
    const lang = languages.find(l => l.value === newLang);
    setCode(lang.starter);
    setOutput('');
  };

  return (
    <div className="container py-10 px-6 max-w-[1600px]">
      <div className="text-center mb-10 animate-fade-up">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Code Playground
        </h1>
        <p className="text-xl text-secondary">
          Write, test, and debug code in multiple programming languages
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 animate-fade-up delay-100">
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Code2 size={16} className="text-accent" /> Language
            </h3>
            <div className="flex flex-col gap-2">
              {languages.map(lang => (
                <button
                  key={lang.value}
                  onClick={() => handleLanguageChange(lang.value)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left flex items-center justify-between ${selectedLanguage === lang.value
                      ? 'bg-accent text-white shadow-lg shadow-accent/20'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {lang.label}
                  {selectedLanguage === lang.value && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </button>
              ))}
            </div>
          </div>

          {savedSnippets.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Save size={16} className="text-yellow-400" /> Saved Snippets
              </h3>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {savedSnippets.slice(0, 5).map((snippet, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadSnippet(snippet)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-all group"
                  >
                    <div className="font-medium text-gray-200 group-hover:text-white mb-1 truncate">{snippet.name}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">{snippet.language}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 flex flex-col h-[600px]">
            <div className="px-6 py-4 border-b border-white/5 bg-white/2 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <Terminal size={18} className="text-blue-400" />
                Editor
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveSnippet}
                  className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={resetCode}
                  className="px-4 py-2 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-green-500/20"
                >
                  {isRunning ? <span className="animate-spin">⌛</span> : <Play size={16} fill="currentColor" />}
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
              </div>
            </div>

            <div className="flex-1 relative bg-[#1e1e1e]">
              <Editor
                height="100%"
                language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
                value={code}
                onChange={(value) => setCode(value)}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  fontFamily: "'JetBrains Mono', monospace",
                  padding: { top: 20 }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 flex flex-col h-[250px]">
              <div className="px-5 py-3 border-b border-white/5 bg-white/2 text-sm font-bold text-gray-300">
                Custom Input
              </div>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter custom input here (optional)..."
                className="w-full h-full p-4 bg-transparent resize-none focus:outline-none font-mono text-sm text-gray-300 placeholder:text-gray-600"
              />
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 flex flex-col h-[250px]">
              <div className="px-5 py-3 border-b border-white/5 bg-white/2 flex justify-between items-center text-sm font-bold text-gray-300">
                <span>Output</span>
                {executionTime !== null && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-normal">
                    <Clock size={12} />
                    {executionTime}ms
                  </div>
                )}
              </div>
              <div className={`flex-1 p-4 overflow-y-auto font-mono text-sm whitespace-pre-wrap ${output.startsWith('Error') || output.includes('failed') ? 'text-red-400 bg-red-500/5' : 'text-gray-300'
                }`}>
                {output || <span className="text-gray-600 italic">Run code to see output...</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
