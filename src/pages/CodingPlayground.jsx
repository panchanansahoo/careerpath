import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, RotateCcw, Save, Upload, Download, Settings, Moon, Sun } from 'lucide-react';

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
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript.template);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [savedSnippets, setSavedSnippets] = useState([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadSavedSnippets();
  }, []);

  const loadSavedSnippets = () => {
    const saved = localStorage.getItem('playground_snippets');
    if (saved) {
      setSavedSnippets(JSON.parse(saved));
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(LANGUAGE_TEMPLATES[newLang].template);
    setOutput('');
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');

    try {
      const response = await fetch('http://localhost:5000/api/practice/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code,
          input
        })
      });

      const data = await response.json();

      if (data.success) {
        setOutput(`Execution Time: ${data.executionTime}ms\n\n${data.output}`);
      } else {
        setOutput(`Error:\n${data.error || 'Execution failed'}`);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}\nMake sure the backend server is running.`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(LANGUAGE_TEMPLATES[language].template);
    setInput('');
    setOutput('');
  };

  const handleSave = () => {
    const snippetName = prompt('Enter a name for this snippet:');
    if (snippetName) {
      const newSnippet = {
        id: Date.now(),
        name: snippetName,
        language,
        code,
        timestamp: new Date().toISOString()
      };

      const updated = [...savedSnippets, newSnippet];
      setSavedSnippets(updated);
      localStorage.setItem('playground_snippets', JSON.stringify(updated));
      alert('Snippet saved successfully!');
    }
  };

  const handleLoadSnippet = (snippet) => {
    setLanguage(snippet.language);
    setCode(snippet.code);
  };

  const handleExport = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'cpp' ? 'cpp' : language === 'python' ? 'py' : language === 'java' ? 'java' : 'js'}`;
    a.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCode(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Coding Playground</h1>
              <p className="text-gray-400 text-sm">Write, run, and test your code in multiple languages</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LANGUAGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* Action Buttons */}
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Play size={18} />
                {isRunning ? 'Running...' : 'Run'}
              </button>

              <button
                onClick={handleReset}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                title="Reset Code"
              >
                <RotateCcw size={18} />
              </button>

              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                title="Save Snippet"
              >
                <Save size={18} />
              </button>

              <button
                onClick={handleExport}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                title="Export Code"
              >
                <Download size={18} />
              </button>

              <label className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer">
                <Upload size={18} />
                <input
                  type="file"
                  onChange={handleImport}
                  accept=".js,.py,.java,.cpp,.ts"
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                title="Settings"
              >
                <Settings size={18} />
              </button>

              <button
                onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                title="Toggle Theme"
              >
                {theme === 'vs-dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <label className="text-white text-sm">Font Size:</label>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-white text-sm">{fontSize}px</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
          {/* Saved Snippets Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 h-full overflow-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Saved Snippets</h3>
              {savedSnippets.length === 0 ? (
                <p className="text-gray-400 text-sm">No saved snippets yet</p>
              ) : (
                <div className="space-y-2">
                  {savedSnippets.map(snippet => (
                    <div
                      key={snippet.id}
                      onClick={() => handleLoadSnippet(snippet)}
                      className="bg-gray-700/50 p-3 rounded-lg border border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium text-sm">{snippet.name}</h4>
                        <span className="text-xs text-gray-400">{snippet.language}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(snippet.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Code Editor */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden h-[60%]">
              <div className="bg-gray-700/50 px-4 py-2 border-b border-gray-600">
                <h3 className="text-white font-medium">Code Editor</h3>
              </div>
              <Editor
                height="100%"
                language={LANGUAGE_TEMPLATES[language].mode}
                theme={theme}
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  formatOnPaste: true,
                  formatOnType: true,
                }}
              />
            </div>

            {/* Input/Output Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[35%]">
              {/* Input */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-700/50 px-4 py-2 border-b border-gray-600">
                  <h3 className="text-white font-medium">Input</h3>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter input (if needed)..."
                  className="w-full h-[calc(100%-42px)] bg-gray-900/50 text-white p-4 resize-none focus:outline-none font-mono text-sm"
                />
              </div>

              {/* Output */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-700/50 px-4 py-2 border-b border-gray-600">
                  <h3 className="text-white font-medium">Output</h3>
                </div>
                <pre className="w-full h-[calc(100%-42px)] bg-gray-900/50 text-green-400 p-4 overflow-auto font-mono text-sm">
                  {output || 'Output will appear here...'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
