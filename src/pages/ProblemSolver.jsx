import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Play, Send, Lightbulb, CheckCircle, XCircle, Loader, Code2, Clock, Cpu, Award } from 'lucide-react';

export default function ProblemSolver() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (problem?.starter_code) {
      setCode(problem.starter_code[language] || '');
    }
  }, [language, problem]);

  const fetchProblem = async () => {
    try {
      const response = await axios.get(`/api/dsa/problems/${id}`);
      setProblem(response.data.problem);
      if (response.data.problem.starter_code) {
        setCode(response.data.problem.starter_code.python || '');
      }
    } catch (error) {
      // Fallback for demo
      setProblem({
        id: id,
        title: "Two Sum",
        difficulty: "Easy",
        pattern_name: "Hash Map",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        examples: [
          { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
          { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
        ],
        constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists."
      });
      setCode("class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass");
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    setSubmitting(true);
    try {
      // Mock run for demo
      setTimeout(() => {
        setOutput({ success: true, message: "Test cases passed: 3/3\nRuntime: 45ms\nMemory: 14.2MB" });
        setSubmitting(false);
      }, 1000);
    } catch (error) {
      setOutput({ success: false, output: 'Error executing code' });
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Mock submit for demo
      setTimeout(() => {
        setOutput({
          success: true,
          message: "Accepted",
          submission: { status: 'accepted', runtime: '42ms', memory: '14.1MB' }
        });
        fetchFeedback(); // Mock feedback trigger
        setSubmitting(false);
      }, 1500);
    } catch (error) {
      setOutput({ success: false, message: 'Submission failed' });
      setSubmitting(false);
    }
  };

  const fetchFeedback = async () => {
    // Mock feedback
    setFeedback({
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      suggestions: "Great job! Using a hash map to store complements is the optimal O(n) approach. Your code cleanly handles the lookup and return. One minor suggestion: you could add a type hint for the return value for better readability."
    });
  };

  const getHint = async () => {
    setShowHint("Try using a hash map to store the numbers you've seen so far and their indices. For each number x, check if (target - x) is already in the map.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#020617]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#020617] text-white">
        <h2 className="text-2xl font-bold mb-4">Problem not found</h2>
        <Link to="/dsa-patterns" className="btn btn-primary">Back to Patterns</Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#020617] text-white overflow-hidden animate-fade-in">
      {/* Left Panel: Problem Description */}
      <div className="w-[40%] flex flex-col border-r border-white/10 bg-black/20">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <Link
            to={`/patterns/${problem.pattern_id || '1'}`}
            className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back to Pattern
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl font-bold text-white leading-tight">{problem.title}</h1>
          </div>

          <div className="flex gap-2 mb-6">
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
              {problem.difficulty}
            </span>
            {problem.pattern_name && (
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border bg-purple-500/10 text-purple-400 border-purple-500/20">
                {problem.pattern_name}
              </span>
            )}
          </div>

          <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed mb-8">
            <p className="whitespace-pre-wrap">{problem.description}</p>
          </div>

          {problem.examples && (
            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">Examples</h3>
              {problem.examples.map((ex, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4 font-mono text-xs">
                  <div className="mb-2"><span className="text-gray-500">Input:</span> <span className="text-gray-300">{ex.input}</span></div>
                  <div className="mb-2"><span className="text-gray-500">Output:</span> <span className="text-gray-300">{ex.output}</span></div>
                  {ex.explanation && (
                    <div><span className="text-gray-500">Explanation:</span> <span className="text-gray-400">{ex.explanation}</span></div>
                  )}
                </div>
              ))}
            </div>
          )}

          {problem.constraints && (
            <div className="mb-8">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-3">Constraints</h3>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 font-mono text-xs text-gray-300 whitespace-pre-wrap">
                {problem.constraints}
              </div>
            </div>
          )}

          {!showHint ? (
            <button
              onClick={getHint}
              className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all text-sm font-medium flex items-center justify-center gap-2"
            >
              <Lightbulb size={16} /> Show Hint
            </button>
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 animate-fade-up">
              <h4 className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <Lightbulb size={14} /> Hint
              </h4>
              <p className="text-yellow-200/90 text-sm leading-relaxed">
                {showHint}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Code Editor */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e]">
        {/* Editor Toolbar */}
        <div className="h-14 border-b border-black/40 bg-[#1e1e1e] flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 text-xs">
              <Code2 size={14} />
              <span>Editor</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-gray-300 text-xs font-medium border-none outline-none cursor-pointer hover:text-white"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRun}
              disabled={submitting}
              className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 text-xs font-medium flex items-center gap-2 transition-all"
            >
              <Play size={14} className={submitting ? 'opacity-50' : ''} /> Run
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-500/20"
            >
              {submitting ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
              Submit
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            language={language === 'cpp' ? 'cpp' : language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 20, bottom: 20 },
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
            }}
          />
        </div>

        {/* Output / Feedback Panel */}
        {(output || feedback) && (
          <div className="h-1/3 border-t border-black/40 bg-[#1e1e1e] flex flex-col">
            <div className="flex border-b border-white/5">
              <button className="px-4 py-2 text-xs font-medium border-b-2 border-accent text-white">
                {feedback ? 'AI Feedback' : 'Console Output'}
              </button>
              <button onClick={() => { setOutput(null); setFeedback(null); }} className="ml-auto px-4 text-gray-500 hover:text-white">
                <XCircle size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
              {output && !feedback && (
                <div className={output.success ? 'text-green-400' : 'text-red-400'}>
                  <div className="flex items-center gap-2 mb-2 font-bold">
                    {output.success ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    {output.success ? 'Success' : 'Error'}
                  </div>
                  <pre className="whitespace-pre-wrap text-gray-300">{output.message || output.output}</pre>
                </div>
              )}

              {feedback && (
                <div className="grid grid-cols-2 gap-8 h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                      <span className="text-gray-400 text-xs">Time Complexity</span>
                      <span className="text-green-400 font-bold">{feedback.timeComplexity}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5">
                      <span className="text-gray-400 text-xs">Space Complexity</span>
                      <span className="text-blue-400 font-bold">{feedback.spaceComplexity}</span>
                    </div>
                    {output?.submission && (
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <span className="flex items-center gap-1"><Clock size={12} /> {output.submission.runtime}</span>
                        <span className="flex items-center gap-1"><Cpu size={12} /> {output.submission.memory}</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 overflow-y-auto">
                    <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Award size={14} /> AI Suggestions
                    </h4>
                    <p className="text-blue-200/80 leading-relaxed text-xs">
                      {feedback.suggestions}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
