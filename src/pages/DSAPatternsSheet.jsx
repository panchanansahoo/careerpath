import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, Circle, Search, Filter, Download, TrendingUp, 
  Star, BarChart3, ChevronDown, ChevronUp, ExternalLink,
  CheckSquare, Square, Minus, Layers, Code2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DSAPatternsSheet() {
  const [problems, setProblems] = useState([]);
  const [allPatterns, setAllPatterns] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    status: 'all',
    pattern: 'all',
    company: 'all',
    search: ''
  });
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [expandedPattern, setExpandedPattern] = useState(null);
  const [selectedProblems, setSelectedProblems] = useState(new Set());
  const [groupByPattern] = useState(true); // Always true for Thita.ai style
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, [filters]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });

      const [problemsRes, patternsRes, companiesRes, progressRes] = await Promise.all([
        axios.get(`/api/practice/all-problems?${params.toString()}`),
        axios.get('/api/practice/patterns-list'),
        axios.get('/api/practice/companies-list'),
        axios.get('/api/user/progress').catch(() => ({ data: { progress: {} } }))
      ]);

      setProblems(problemsRes.data.problems || []);
      setAllPatterns(patternsRes.data.patterns || []);
      setAllCompanies(companiesRes.data.companies || []);
      setUserProgress(progressRes.data.progress || {});
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedProblems = [...problems].sort((a, b) => {
    let aVal, bVal;
    switch (sortBy) {
      case 'id': aVal = a.id; bVal = b.id; break;
      case 'title': aVal = a.title.toLowerCase(); bVal = b.title.toLowerCase(); break;
      case 'difficulty':
        const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        aVal = diffOrder[a.difficulty];
        bVal = diffOrder[b.difficulty];
        break;
      case 'pattern': aVal = a.pattern.toLowerCase(); bVal = b.pattern.toLowerCase(); break;
      default: return 0;
    }
    return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  const groupedProblems = {};
  const patternKeys = [];
  if (groupByPattern) {
    sortedProblems.forEach(problem => {
      if (!groupedProblems[problem.pattern]) {
        groupedProblems[problem.pattern] = [];
        patternKeys.push(problem.pattern);
      }
      groupedProblems[problem.pattern].push(problem);
    });
  }

  const stats = {
    total: problems.length,
    solved: problems.filter(p => userProgress[`problem_${p.id}`]?.solved).length,
    easy: problems.filter(p => p.difficulty === 'Easy').length,
    medium: problems.filter(p => p.difficulty === 'Medium').length,
    hard: problems.filter(p => p.difficulty === 'Hard').length
  };

  const patternStats = {};
  problems.forEach(p => {
    if (!patternStats[p.pattern]) {
      patternStats[p.pattern] = { total: 0, solved: 0 };
    }
    patternStats[p.pattern].total++;
    if (userProgress[`problem_${p.id}`]?.solved) {
      patternStats[p.pattern].solved++;
    }
  });

  const exportProgress = () => {
    const data = sortedProblems.map(p => ({
      id: p.id,
      title: p.title,
      pattern: p.pattern,
      difficulty: p.difficulty,
      status: userProgress[`problem_${p.id}`]?.solved ? 'Solved' : 'Unsolved',
      companies: p.companies?.join(', ') || '',
      leetcode: p.leetcode || ''
    }));

    const csv = [
      ['#', 'Title', 'Pattern', 'Difficulty', 'Status', 'Companies', 'LeetCode'],
      ...data.map(d => [d.id, d.title, d.pattern, d.difficulty, d.status, d.companies, d.leetcode])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa-sheet-${Date.now()}.csv`;
    a.click();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Hard': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const toggleProblemSelection = (problemId) => {
    const newSelected = new Set(selectedProblems);
    if (newSelected.has(problemId)) {
      newSelected.delete(problemId);
    } else {
      newSelected.add(problemId);
    }
    setSelectedProblems(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedProblems.size === sortedProblems.length) {
      setSelectedProblems(new Set());
    } else {
      setSelectedProblems(new Set(sortedProblems.map(p => p.id)));
    }
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-text-muted animate-pulse">Loading 425 DSA problems...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">D</div>
            <div>
              <h1 className="text-xl font-bold text-white">DSA Pattern Mastery</h1>
              <p className="text-xs text-slate-400">Systematic approach to Data Structures & Algorithms</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
            Sign In
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search problems, patterns..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
            />
          </div>
          
          <Select 
            value={filters.pattern}
            onChange={(e) => setFilters({ ...filters, pattern: e.target.value })}
            options={[
              { value: 'all', label: 'All' },
              ...allPatterns.map(p => ({ value: p, label: p }))
            ]}
          />

          <Select 
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'solved', label: '✓ Solved' },
              { value: 'unsolved', label: '○ Unsolved' }
            ]}
          />
        </div>

        {/* Value Proposition Banner */}
        <div className="mb-8 p-6 border border-slate-700/50 rounded-lg bg-gradient-to-r from-slate-800/50 to-slate-800/30 backdrop-blur">
          <h2 className="text-2xl font-bold text-white mb-3">Solving Problems Alone Won't Get You Hired</h2>
          <p className="text-slate-300 mb-4 text-sm">
            Pair this sheet with AI mock interviews, instant code feedback, and a structured 90-day roadmap. See what plan fits your prep.
          </p>
          <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors text-sm flex items-center gap-2">
            See Plans & Pricing <ChevronDown size={16} className="rotate-[-90deg]" />
          </button>
        </div>

        {/* DSA Pattern Mastery Section */}
        <div className="border border-slate-700/50 rounded-lg bg-slate-800/30 backdrop-blur p-6 mb-8">
          <h2 className="text-xl font-bold text-white">DSA Pattern Mastery</h2>
          <p className="text-slate-400 text-sm">Systematic approach to Data Structures & Algorithms</p>
        </div>

        {/* Patterns Grid */}
        <div className="space-y-3">
          {Object.keys(groupedProblems).sort().map((pattern, patternIndex) => {
            const patternProblems = groupedProblems[pattern];
            const solved = patternProblems.filter(p => userProgress[`problem_${p.id}`]?.solved).length;
            
            return (
              <div key={pattern} className="border border-slate-700 rounded-xl bg-slate-900/40 overflow-hidden hover:border-slate-600 transition-colors">
                {/* Pattern Header */}
                <div
                  onClick={() => setExpandedPattern(expandedPattern === pattern ? null : pattern)}
                  className="p-5 cursor-pointer flex items-center justify-between hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <ChevronDown 
                      size={18} 
                      className={`text-slate-400 transition-transform ${expandedPattern === pattern ? 'rotate-180' : ''}`}
                    />
                    <div className="w-7 h-7 flex items-center justify-center rounded bg-blue-600/30 text-blue-400 font-bold text-xs border border-blue-500/30">
                      ⓘ
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-base">{pattern}</h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 ml-4">
                    <div className="text-center">
                      <div className="text-white font-bold text-sm">{patternIndex + 1}/{Object.keys(groupedProblems).length}</div>
                      <div className="text-slate-400 text-xs">pattern</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-bold text-sm">{patternProblems.length}</div>
                      <div className="text-slate-400 text-xs">problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-emerald-400 font-bold text-sm">{solved}</div>
                      <div className="text-slate-400 text-xs">attempted</div>
                    </div>
                  </div>
                </div>

                {/* Expanded Problems */}
                {expandedPattern === pattern && (
                  <div className="border-t border-slate-700/50 divide-y divide-slate-700/50">
                    {patternProblems.map((problem, idx) => {
                      const isSolved = userProgress[`problem_${problem.id}`]?.solved;
                      return (
                        <div
                          key={problem.id}
                          className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer group"
                          onClick={() => navigate(`/problems/${problem.id}`)}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-slate-500 text-sm font-medium min-w-fit">{idx + 1}/{patternProblems.length}</span>
                              <div className="flex-1">
                                <p className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
                                  {problem.title}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Theory
                              </span>
                              <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                                ▶ Watch
                              </span>
                              <span className="text-slate-400 text-xs font-medium px-1">
                                {problem.companies?.length || 0} problems
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                                isSolved 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                  : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                              }`}>
                                {isSolved ? '✓ attempted' : '0 attempted'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Filter Bar */}
        <div className="fixed right-4 top-1/2 -translate-y-1/2 bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 backdrop-blur hidden lg:flex flex-col gap-3">
          <button 
            onClick={() => setFilters({ difficulty: 'all', status: 'all', pattern: 'all', company: 'all', search: '' })}
            className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            title="Reset Filters"
          >
            <Filter size={18} />
          </button>
          <div className="w-6 h-px bg-slate-700/50"></div>
          <button className="p-2 rounded text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors" title="Theme">
            <Star size={18} />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700/50 text-center">
          <p className="text-slate-400 text-sm">
            {sortedProblems.length} problems • {((stats.solved / stats.total) * 100).toFixed(1)}% complete
          </p>
        </div>
      </div>
    </div>
  );
}

// Subcomponents
function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-slate-800/50 border border-slate-700/50 rounded-lg py-2.5 pl-4 pr-10 text-slate-300 focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer hover:border-slate-600/50 text-sm"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  );
}
