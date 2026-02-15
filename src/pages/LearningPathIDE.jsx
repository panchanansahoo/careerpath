import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import {
  Bug,
  Clock3,
  Maximize2,
  Minimize2,
  Play,
  RefreshCw,
  ChevronLeft,
  Lightbulb
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

const ARRAY_MOCK_PROBLEMS = {
  'array-two-sum': {
    id: 'array-two-sum',
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
        explanation: 'Because nums[0] + nums[1] == 9, return [0, 1].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i], target <= 10^9',
      'Only one valid answer exists.'
    ],
    testCases: [
      { input: '[2,7,11,15], 9', output: '[0,1]', hidden: false },
      { input: '[3,2,4], 6', output: '[1,2]', hidden: false },
      { input: '[3,3], 6', output: '[0,1]', hidden: true }
    ],
    hints: [
      'Try brute force first to validate correctness.',
      'Use a hash map to find complements in O(1).'
    ],
    solution: {
      approach: 'Hash Map',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need), i];
    map.set(nums[i], i);
  }
  return [];
}`
    },
    functionName: 'twoSum',
    topics: ['Array', 'Hash Table'],
    companies: ['Amazon', 'Google', 'Meta'],
    acceptance: 49.5
  },
  'array-sorted-two-sum': {
    id: 'array-sorted-two-sum',
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Medium',
    category: 'Array',
    description: `Given a 1-indexed array of integers numbers sorted in non-decreasing order, find two numbers such that they add up to a specific target.

Return the indices of the two numbers (1-indexed).`,
    examples: [
      {
        input: 'numbers = [2,7,11,15], target = 9',
        output: '[1,2]',
        explanation: 'numbers[1] + numbers[2] = 9'
      }
    ],
    constraints: ['2 <= numbers.length <= 3 * 10^4', 'numbers is sorted'],
    testCases: [
      { input: '[2,7,11,15], 9', output: '[1,2]', hidden: false },
      { input: '[2,3,4], 6', output: '[1,3]', hidden: false },
      { input: '[-1,0], -1', output: '[1,2]', hidden: true }
    ],
    hints: ['Use two pointers from both ends.', 'Move left/right based on current sum.'],
    solution: {
      approach: 'Two Pointers',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `function twoSum(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`
    },
    functionName: 'twoSum',
    topics: ['Array', 'Two Pointers'],
    companies: ['Adobe', 'Apple'],
    acceptance: 63.1
  },
  'array-max-subarray': {
    id: 'array-max-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    category: 'Array',
    description: `Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: '[4,-1,2,1] has the largest sum = 6'
      }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6', hidden: false },
      { input: '[1]', output: '1', hidden: false },
      { input: '[5,4,-1,7,8]', output: '23', hidden: true }
    ],
    hints: ['Track best sum ending at current index.', 'Reset when carrying hurts future sum.'],
    solution: {
      approach: 'Kadane\'s Algorithm',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `function maxSubArray(nums) {
  let best = nums[0], current = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}`
    },
    functionName: 'maxSubArray',
    topics: ['Array', 'Dynamic Programming'],
    companies: ['Microsoft', 'LinkedIn'],
    acceptance: 52.8
  },
  'array-prefix-range': {
    id: 'array-prefix-range',
    title: 'Range Sum Query - Immutable',
    difficulty: 'Easy',
    category: 'Array',
    description: `Given an integer array nums, handle multiple sumRange(left, right) queries and return the sum of elements in that range (inclusive).`,
    examples: [
      {
        input: 'nums = [-2,0,3,-5,2,-1], sumRange(0,2)',
        output: '1',
        explanation: '-2 + 0 + 3 = 1'
      }
    ],
    constraints: ['1 <= nums.length <= 10^4', 'At most 10^4 queries'],
    testCases: [
      { input: '[-2,0,3,-5,2,-1], [0,2]', output: '1', hidden: false },
      { input: '[-2,0,3,-5,2,-1], [2,5]', output: '-1', hidden: false },
      { input: '[1,2,3,4], [1,3]', output: '9', hidden: true }
    ],
    hints: ['Precompute prefix sums.', 'Range sum = prefix[r+1] - prefix[l].'],
    solution: {
      approach: 'Prefix Sum',
      timeComplexity: 'O(1) query after O(n) preprocess',
      spaceComplexity: 'O(n)',
      code: `function rangeSum(nums, left, right) {
  const prefix = [0];
  for (const value of nums) prefix.push(prefix[prefix.length - 1] + value);
  return prefix[right + 1] - prefix[left];
}`
    },
    functionName: 'rangeSum',
    topics: ['Array', 'Prefix Sum'],
    companies: ['Meta'],
    acceptance: 67.2
  },
  'array-rotate': {
    id: 'array-rotate',
    title: 'Rotate Array',
    difficulty: 'Medium',
    category: 'Array',
    description: `Given an integer array nums, rotate the array to the right by k steps where k is non-negative.`,
    examples: [
      {
        input: 'nums = [1,2,3,4,5,6,7], k = 3',
        output: '[5,6,7,1,2,3,4]',
        explanation: 'Rotate right by 3 steps.'
      }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1', '0 <= k <= 10^5'],
    testCases: [
      { input: '[1,2,3,4,5,6,7], 3', output: '[5,6,7,1,2,3,4]', hidden: false },
      { input: '[-1,-100,3,99], 2', output: '[3,99,-1,-100]', hidden: false },
      { input: '[1,2], 3', output: '[2,1]', hidden: true }
    ],
    hints: ['k can be greater than n.', 'Reverse whole array, then parts.'],
    solution: {
      approach: 'Reverse in-place',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      code: `function rotate(nums, k) {
  const n = nums.length;
  k %= n;
  const reverse = (left, right) => {
    while (left < right) {
      [nums[left], nums[right]] = [nums[right], nums[left]];
      left++; right--;
    }
  };
  reverse(0, n - 1);
  reverse(0, k - 1);
  reverse(k, n - 1);
}`
    },
    functionName: 'rotate',
    topics: ['Array', 'Two Pointers'],
    companies: ['Google'],
    acceptance: 45.7
  }
};

export default function LearningPathIDE() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [activePanel, setActivePanel] = useState('console');
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-light');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const buildHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  useEffect(() => {
    loadProblem();
  }, [problemId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!stopwatchRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [stopwatchRunning]);

  const timerLabel = useMemo(() => {
    const hours = Math.floor(elapsedSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((elapsedSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }, [elapsedSeconds]);

  useEffect(() => {
    if (problem) {
      setCode(LANGUAGE_TEMPLATES[language].template(problem.functionName || 'solve'));
    }
  }, [language, problem]);

  const loadProblem = async () => {
    try {
      const response = await fetch(`/api/dsa/problems/${problemId}`, {
        headers: buildHeaders()
      });
      const data = await response.json();
      const normalized = data.problem || data;

      if (!normalized?.title || !normalized?.description || !normalized?.testCases) {
        throw new Error('Problem payload not in IDE format');
      }

      setProblem(normalized);
      setCode(LANGUAGE_TEMPLATES[language].template(normalized.functionName || 'solve'));
    } catch (error) {
      console.error('Error loading problem:', error);
      // Fallback to mock data
      const fallbackProblem = getMockProblem(problemId);
      setProblem(fallbackProblem);
      setCode(LANGUAGE_TEMPLATES[language].template(fallbackProblem.functionName || 'solve'));
    }
  };

  const getMockProblem = (id) => ARRAY_MOCK_PROBLEMS[id] || ARRAY_MOCK_PROBLEMS['array-two-sum'];

  const executeVisibleTestCases = async () => {
    const executionLanguage = language === 'typescript' ? 'javascript' : language;
    const visibleTests = problem.testCases.filter(tc => !tc.hidden);
    const results = [];

    for (const testCase of visibleTests) {
      const response = await fetch('/api/practice/execute', {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify({
          language: executionLanguage,
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

    return results;
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    setTestResults([]);

    try {
      const results = await executeVisibleTestCases();

      const passedCount = results.filter((result) => result.passed).length;
      const summaryLines = [
        `Result: ${passedCount}/${results.length} test cases passed`
      ];
      results.forEach((result, index) => {
        summaryLines.push(`Case ${index + 1}: ${result.passed ? 'PASS' : 'FAIL'} | expected=${result.expected} | actual=${result.actual || result.error || 'No output'}`);
      });

      setTestResults(results);
      setOutput(summaryLines.join('\n'));
      setActivePanel('console');
      return results;
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      return [];
    } finally {
      setIsRunning(false);
    }
  };

  const handleDebug = async () => {
    setIsRunning(true);
    setOutput('Debugging...');

    try {
      const results = await executeVisibleTestCases();
      setTestResults(results);
      const failed = results.filter((result) => !result.passed);

      const lines = [
        `Debug Summary: ${results.length - failed.length}/${results.length} passed`,
        ''
      ];

      if (failed.length === 0) {
        lines.push('No failing test cases. Your logic passed all visible checks.');
      } else {
        failed.forEach((result, index) => {
          lines.push(`Fail ${index + 1}`);
          lines.push(`Input: ${result.input}`);
          lines.push(`Expected: ${result.expected}`);
          lines.push(`Actual: ${result.actual || result.error || 'No output'}`);
          lines.push('Suggestion: Check edge cases and output format.');
          lines.push('');
        });
      }

      setOutput(lines.join('\n'));
      setActivePanel('console');
    } catch (error) {
      setOutput(`Debug failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(LANGUAGE_TEMPLATES[language].template(problem?.functionName || 'solve'));
    setTestResults([]);
    setOutput('');
  };

  const toggleStopwatch = () => {
    setStopwatchRunning((prev) => !prev);
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

  if (!problem) {
    return (
      <div className="h-[calc(100vh-64px)] w-full bg-[#f3f4f6] flex items-center justify-center">
        <div className="text-[#111827] text-xl font-medium">Loading problem...</div>
      </div>
    );
  }

  const suggestions = problem.hints?.length
    ? problem.hints
    : ['Break the problem into smaller cases.', 'Start with brute force, then optimize.'];

  const suggestionWords = Array.from(new Set([...(problem.topics || []), ...(problem.companies || [])])).slice(0, 8);

  return (
    <div
      ref={containerRef}
      className={`${isFullscreen ? 'h-screen p-0' : 'h-[calc(100vh-64px)] p-3'} w-full bg-[#f3f4f6]`}
    >
      <div className="h-full rounded-md border border-[#d1d5db] bg-white overflow-hidden flex flex-col">
        <div className="h-11 border-b border-[#d1d5db] bg-[#f9fafb] px-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="h-8 w-8 rounded border border-[#d1d5db] bg-white text-[#374151] inline-flex items-center justify-center"
              title="Back"
            >
              <ChevronLeft size={16} />
            </button>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-7 rounded border border-[#d1d5db] bg-white px-2 text-sm text-[#111827] focus:outline-none"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
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

            <div className="ml-2 text-sm text-[#4b5563] font-medium truncate max-w-[320px]">
              {problem.title}
            </div>
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
                onClick={() => setActivePanel('suggestion')}
                className={`pb-1 border-b-2 ${activePanel === 'suggestion' ? 'border-[#6366f1] text-[#4f46e5]' : 'border-transparent text-[#6b7280]'}`}
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
                {suggestionWords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {suggestionWords.map((word, index) => (
                      <span key={`${word}-${index}`} className="px-2 py-0.5 rounded bg-[#eef2ff] text-[#4f46e5] text-xs border border-[#c7d2fe]">
                        {word}
                      </span>
                    ))}
                  </div>
                )}
                {suggestions.map((item, index) => (
                  <div key={index} className="text-[#1f2937]">{index + 1}. {item}</div>
                ))}
                {testResults.length > 0 && (
                  <div className="pt-2 text-[#4b5563]">
                    Last run: {testResults.filter((result) => result.passed).length}/{testResults.length} passed
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
