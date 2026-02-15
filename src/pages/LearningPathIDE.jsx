import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import {
  Play,
  Send,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Lock,
  CheckCircle,
  Circle,
  Lightbulb,
  BookOpen,
  Video,
  MessageSquare,
  Share2
} from 'lucide-react';

const LANGUAGE_TEMPLATES = {
  javascript: {
    template: (functionName) => `function ${functionName}(params) {
  // Write your solution here

}`,
    mode: 'javascript'
  },
  python: {
    template: (functionName) => `def ${functionName}(params):
    # Write your solution here
    pass`,
    mode: 'python'
  },
  java: {
    template: (functionName) => `class Solution {
    public ReturnType ${functionName}(ParamType params) {
        // Write your solution here

    }
}`,
    mode: 'java'
  },
  cpp: {
    template: (functionName) => `class Solution {
public:
    ReturnType ${functionName}(ParamType params) {
        // Write your solution here

    }
};`,
    mode: 'cpp'
  }
};

export default function LearningPathIDE() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    loadProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      setCode(LANGUAGE_TEMPLATES[language].template(problem.functionName || 'solve'));
    }
  }, [language, problem]);

  const loadProblem = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/dsa/problems/${problemId}`);
      const data = await response.json();
      setProblem(data);
      setCode(LANGUAGE_TEMPLATES[language].template(data.functionName || 'solve'));
    } catch (error) {
      console.error('Error loading problem:', error);
      // Fallback to mock data
      setProblem(getMockProblem(problemId));
      setCode(LANGUAGE_TEMPLATES[language].template('solve'));
    }
  };

  const getMockProblem = (id) => ({
    id,
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Array',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    testCases: [
      { input: '[2,7,11,15], 9', output: '[0,1]', hidden: false },
      { input: '[3,2,4], 6', output: '[1,2]', hidden: false },
      { input: '[3,3], 6', output: '[0,1]', hidden: true }
    ],
    hints: [
      'A brute force approach would be to use nested loops to check all pairs.',
      'Can you optimize using a hash map to store values you\'ve seen?',
      'For each number, check if target - number exists in your hash map.'
    ],
    solution: {
      approach: 'Hash Map',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `function twoSum(nums, target) {
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }

    return [];
}`
    },
    functionName: 'twoSum',
    topics: ['Array', 'Hash Table'],
    companies: ['Amazon', 'Google', 'Facebook'],
    acceptance: 49.5,
    totalSubmissions: 12500000
  });

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    setTestResults([]);

    try {
      // Run visible test cases
      const visibleTests = problem.testCases.filter(tc => !tc.hidden);
      const results = [];

      for (const testCase of visibleTests) {
        const response = await fetch('http://localhost:5000/api/practice/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language,
            code,
            input: testCase.input
          })
        });

        const data = await response.json();
        results.push({
          input: testCase.input,
          expected: testCase.output,
          actual: data.output?.trim(),
          passed: data.output?.trim() === testCase.output,
          error: data.error
        });
      }

      setTestResults(results);
      setActiveTab('testcases');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Run all test cases including hidden ones
      await handleRun();

      // Simulate submission
      setTimeout(() => {
        const allPassed = testResults.every(r => r.passed);
        if (allPassed) {
          alert('✅ All test cases passed! Solution submitted successfully.');
          // Mark problem as solved
          markProblemSolved(problemId);
        } else {
          alert('❌ Some test cases failed. Please review your solution.');
        }
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      alert('Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const markProblemSolved = (id) => {
    const solved = JSON.parse(localStorage.getItem('solved_problems') || '[]');
    if (!solved.includes(id)) {
      solved.push(id);
      localStorage.setItem('solved_problems', JSON.stringify(solved));
    }
  };

  const handleReset = () => {
    setCode(LANGUAGE_TEMPLATES[language].template(problem?.functionName || 'solve'));
    setTestResults([]);
    setOutput('');
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading problem...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-white font-semibold text-lg">{problem.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs px-2 py-1 rounded ${
                problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {problem.difficulty}
              </span>
              <span className="text-xs text-gray-400">{problem.category}</span>
              <span className="text-xs text-gray-400">Acceptance: {problem.acceptance}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <button
            onClick={handleReset}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <RotateCcw size={16} className="inline mr-2" />
            Reset
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <Play size={16} />
            {isRunning ? 'Running...' : 'Run'}
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <Send size={16} />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-gray-700 flex flex-col bg-gray-800/50">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {['description', 'solutions', 'discuss'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'text-blue-400 border-blue-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                {tab === 'description' && <><BookOpen size={16} className="inline mr-2" />Description</>}
                {tab === 'solutions' && <><Lightbulb size={16} className="inline mr-2" />Solutions</>}
                {tab === 'discuss' && <><MessageSquare size={16} className="inline mr-2" />Discuss</>}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'description' && (
              <div className="text-gray-300 space-y-6">
                <div>
                  <p className="text-base leading-relaxed whitespace-pre-line">{problem.description}</p>
                </div>

                {problem.examples && problem.examples.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Examples</h3>
                    {problem.examples.map((example, idx) => (
                      <div key={idx} className="bg-gray-900/50 p-4 rounded-lg mb-3 border border-gray-700">
                        <p className="text-sm mb-1"><span className="font-semibold">Input:</span> {example.input}</p>
                        <p className="text-sm mb-1"><span className="font-semibold">Output:</span> {example.output}</p>
                        {example.explanation && (
                          <p className="text-sm text-gray-400"><span className="font-semibold">Explanation:</span> {example.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {problem.constraints && problem.constraints.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Constraints</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {problem.constraints.map((constraint, idx) => (
                        <li key={idx}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {problem.topics && problem.topics.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Related Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {problem.topics.map((topic, idx) => (
                        <span key={idx} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {problem.companies && problem.companies.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Asked by Companies</h3>
                    <div className="flex flex-wrap gap-2">
                      {problem.companies.map((company, idx) => (
                        <span key={idx} className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hints */}
                <div>
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors flex items-center gap-2"
                  >
                    <Lightbulb size={16} />
                    {showHints ? 'Hide Hints' : 'Show Hints'}
                  </button>
                  {showHints && problem.hints && (
                    <div className="mt-3 space-y-2">
                      {problem.hints.map((hint, idx) => (
                        <div key={idx} className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-sm">
                          <span className="font-semibold">Hint {idx + 1}:</span> {hint}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'solutions' && (
              <div className="text-gray-300 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg">Solution Approach</h3>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    {showSolution ? 'Hide Solution' : 'Show Solution'}
                  </button>
                </div>

                {showSolution && problem.solution && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Approach: {problem.solution.approach}</h4>
                      <div className="flex gap-4 text-sm">
                        <span>Time: <span className="text-green-400">{problem.solution.timeComplexity}</span></span>
                        <span>Space: <span className="text-blue-400">{problem.solution.spaceComplexity}</span></span>
                      </div>
                    </div>

                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <pre className="text-sm overflow-auto">
                        <code>{problem.solution.code}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {!showSolution && (
                  <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-8 text-center">
                    <Lock size={48} className="mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400">Click "Show Solution" to reveal the optimal approach</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'discuss' && (
              <div className="text-gray-300 text-center py-12">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">Discussion feature coming soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Code Editor */}
          <div className="flex-1 bg-gray-900">
            <Editor
              height="100%"
              language={LANGUAGE_TEMPLATES[language].mode}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>

          {/* Bottom Panel - Test Cases */}
          <div className="h-64 bg-gray-800 border-t border-gray-700">
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('testcases')}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'testcases'
                    ? 'text-blue-400 border-blue-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Test Cases
              </button>
              <button
                onClick={() => setActiveTab('result')}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === 'result'
                    ? 'text-blue-400 border-blue-400'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                Test Result
              </button>
            </div>

            <div className="p-4 overflow-auto h-[calc(100%-49px)]">
              {activeTab === 'testcases' && (
                <div className="space-y-3">
                  {problem.testCases?.filter(tc => !tc.hidden).map((testCase, idx) => (
                    <div key={idx} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                      <p className="text-white text-sm mb-1"><span className="font-semibold">Input:</span> {testCase.input}</p>
                      <p className="text-white text-sm"><span className="font-semibold">Expected:</span> {testCase.output}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'result' && (
                <div className="space-y-3">
                  {testResults.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">Run your code to see test results</p>
                  ) : (
                    testResults.map((result, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border ${
                        result.passed
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {result.passed ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : (
                            <Circle size={16} className="text-red-400" />
                          )}
                          <span className={result.passed ? 'text-green-400' : 'text-red-400'}>
                            Test Case {idx + 1}: {result.passed ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-1"><span className="font-semibold">Input:</span> {result.input}</p>
                        <p className="text-sm text-gray-300 mb-1"><span className="font-semibold">Expected:</span> {result.expected}</p>
                        <p className="text-sm text-gray-300"><span className="font-semibold">Actual:</span> {result.actual || result.error}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
