import React, { useState } from 'react';
import {
  CheckCircle, Circle, BookOpen, Clock, Target, TrendingUp,
  ChevronRight, ChevronDown, Code2, Binary, Hash,
  ListTree, Layers, GitBranch, Repeat, PlayCircle, FileText
} from 'lucide-react';

const modules = [
  {
    id: 'complexity',
    title: 'Time & Space Complexity',
    icon: <Clock size={20} />,
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    duration: '3 days',
    problems: 8,
    topics: ['Big-O Notation', 'Big-Ω', 'Big-Θ', 'Amortized Analysis', 'Space Complexity', 'Recursion Cost'],
    lessons: [
      { title: 'Understanding Big-O, Big-Ω, Big-Θ', type: 'theory', done: true },
      { title: 'Analyzing Loop & Recursion Complexity', type: 'practice', done: true },
      { title: 'Space Complexity Analysis', type: 'practice', done: true },
      { title: 'Complexity Quiz & Exercises', type: 'practice', done: false }
    ]
  },
  {
    id: 'arrays-strings',
    title: 'Arrays & Strings',
    icon: <Hash size={20} />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    duration: '1 week',
    problems: 20,
    topics: ['Array Traversal', 'Prefix Sum', 'Two Pointers', 'Sliding Window', 'String Manipulation', 'Hashing'],
    lessons: [
      { title: 'Array Fundamentals & Common Patterns', type: 'theory', done: true },
      { title: 'Prefix Sum & Difference Arrays', type: 'practice', done: true },
      { title: 'Two Pointer Technique', type: 'practice', done: false },
      { title: 'Sliding Window Problems', type: 'practice', done: false },
      { title: 'String Hashing & Manipulation', type: 'practice', done: false }
    ]
  },
  {
    id: 'linkedlists',
    title: 'Linked Lists',
    icon: <GitBranch size={20} />,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    duration: '5 days',
    problems: 14,
    topics: ['Singly Linked List', 'Doubly Linked List', 'Fast/Slow Pointers', 'Reversal', 'Merge', 'Cycle Detection'],
    lessons: [
      { title: 'Linked List Implementation & Operations', type: 'theory', done: false },
      { title: 'Reverse, Merge & Sort Linked Lists', type: 'practice', done: false },
      { title: 'Fast/Slow Pointer Technique', type: 'practice', done: false },
      { title: 'Linked List Interview Problems', type: 'practice', done: false }
    ]
  },
  {
    id: 'stacks-queues',
    title: 'Stacks & Queues',
    icon: <Layers size={20} />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    duration: '5 days',
    problems: 14,
    topics: ['Stack Implementation', 'Monotonic Stack', 'Queue', 'Deque', 'Priority Queue', 'Parentheses Problems'],
    lessons: [
      { title: 'Stack & Queue Fundamentals', type: 'theory', done: false },
      { title: 'Monotonic Stack Pattern', type: 'practice', done: false },
      { title: 'Priority Queue / Heap Basics', type: 'practice', done: false },
      { title: 'Classic Stack Problems', type: 'practice', done: false }
    ]
  },
  {
    id: 'trees',
    title: 'Trees & Binary Search Trees',
    icon: <ListTree size={20} />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    duration: '1.5 weeks',
    problems: 22,
    topics: ['Binary Tree', 'BST', 'Tree Traversals', 'DFS/BFS', 'Height/Depth', 'LCA', 'Trie'],
    lessons: [
      { title: 'Binary Tree Fundamentals & Traversals', type: 'theory', done: false },
      { title: 'Binary Search Tree Operations', type: 'practice', done: false },
      { title: 'DFS & BFS on Trees', type: 'practice', done: false },
      { title: 'Lowest Common Ancestor & Diameter', type: 'practice', done: false },
      { title: 'Trie Data Structure', type: 'theory', done: false }
    ]
  },
  {
    id: 'recursion-backtracking',
    title: 'Recursion & Backtracking',
    icon: <Repeat size={20} />,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    duration: '1 week',
    problems: 16,
    topics: ['Recursion Basics', 'Backtracking', 'Permutations', 'Combinations', 'Subsets', 'N-Queens'],
    lessons: [
      { title: 'Recursive Thinking & Base Cases', type: 'theory', done: false },
      { title: 'Subsets, Permutations & Combinations', type: 'practice', done: false },
      { title: 'Backtracking Template', type: 'theory', done: false },
      { title: 'N-Queens, Sudoku Solver', type: 'practice', done: false }
    ]
  },
  {
    id: 'sorting-searching',
    title: 'Sorting & Searching',
    icon: <Binary size={20} />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    duration: '1 week',
    problems: 16,
    topics: ['Merge Sort', 'Quick Sort', 'Binary Search', 'Search in Rotated Array', 'Counting Sort', 'Bucket Sort'],
    lessons: [
      { title: 'Comparison-Based Sorting Algorithms', type: 'theory', done: false },
      { title: 'Binary Search Patterns', type: 'practice', done: false },
      { title: 'Search in Specialized Arrays', type: 'practice', done: false },
      { title: 'Non-Comparison Sorts', type: 'theory', done: false }
    ]
  }
];

export default function DSABasicsLearningPath() {
  const [expanded, setExpanded] = useState(null);

  const totalProblems = modules.reduce((a, m) => a + m.problems, 0);
  const doneLessons = modules.reduce((a, m) => a + m.lessons.filter(l => l.done).length, 0);
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  const pct = Math.round((doneLessons / totalLessons) * 100);

  return (
    <div className="container py-10 px-6 max-w-[1400px] animate-fade-up">
      {/* Hero */}
      <div className="glass-panel p-8 md:p-12 rounded-3xl mb-10 border border-white/10 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-20 blur-3xl pointer-events-none rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Code2 size={24} />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-blue-500/10 text-blue-400 border-blue-500/20">
              Learning Path
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-sm">
            DSA Fundamentals
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl leading-relaxed mb-10 font-light">
            Build a rock-solid foundation in data structures and algorithms — from complexity analysis to trees, sorting, and backtracking. Perfect for beginners starting their coding interview prep.
          </p>

          <div className="flex flex-wrap gap-6 md:gap-12 text-sm text-text-muted mb-8">
            <div className="flex items-center gap-2">
               <div className="p-1.5 rounded-md bg-white/5 text-gray-400"><Clock size={16} /></div>
               <span>6 Weeks</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="p-1.5 rounded-md bg-white/5 text-gray-400"><BookOpen size={16} /></div>
               <span>{modules.length} Modules</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="p-1.5 rounded-md bg-white/5 text-gray-400"><Target size={16} /></div>
               <span>{totalProblems} Problems</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="p-1.5 rounded-md bg-white/5 text-gray-400"><TrendingUp size={16} /></div>
               <span>{pct}% Complete</span>
            </div>
          </div>

          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-out" 
              style={{ width: `${pct}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {modules.map((mod, idx) => {
          const done = mod.lessons.filter(l => l.done).length;
          const modPct = Math.round((done / mod.lessons.length) * 100);
          const isOpen = expanded === idx;

          return (
            <div key={mod.id} className="glass-panel rounded-2xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-white/10">
              <button
                onClick={() => setExpanded(isOpen ? null : idx)}
                className={`w-full p-6 flex items-center gap-5 cursor-pointer text-left transition-colors ${isOpen ? 'bg-white/[0.02]' : 'hover:bg-white/[0.02]'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${mod.bgColor} ${mod.color} shadow-inner ring-1 ring-white/10`}>
                  {mod.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-2">{mod.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {mod.duration}</span>
                    <span className="flex items-center gap-1.5"><Code2 size={12} /> {mod.problems} problems</span>
                    <span className="flex items-center gap-1.5"><CheckCircle size={12} /> {done}/{mod.lessons.length} lessons</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-sm font-bold ${modPct === 100 ? 'text-emerald-400' : 'text-text-secondary'}`}>
                    {modPct}%
                  </span>
                  {isOpen ? <ChevronDown size={20} className="text-text-muted" /> : <ChevronRight size={20} className="text-text-muted" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/5 bg-black/20 p-6 animate-fade-in">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {mod.topics.map((t, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-[#0a0a0c] text-text-secondary border border-white/10 text-xs font-medium hover:text-white transition-colors cursor-default">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {mod.lessons.map((l, li) => (
                      <div key={li} className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${l.done ? 'bg-emerald-500/5 border border-emerald-500/10' : 'hover:bg-white/5 border border-transparent'}`}>
                        {l.done ? <CheckCircle size={18} className="text-emerald-500 shrink-0" /> : <Circle size={18} className="text-white/20 shrink-0" />}
                        
                        <span className={`flex-1 text-sm font-medium ${l.done ? 'text-text-muted line-through' : 'text-gray-200'}`}>
                          {l.title}
                        </span>
                        
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                          l.type === 'theory' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                          l.type === 'practice' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {l.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
