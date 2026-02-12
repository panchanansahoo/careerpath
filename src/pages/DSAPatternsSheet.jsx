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
  const [groupByPattern, setGroupByPattern] = useState(false);
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
  if (groupByPattern) {
    sortedProblems.forEach(problem => {
      if (!groupedProblems[problem.pattern]) {
        groupedProblems[problem.pattern] = [];
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
    <div className="container max-w-[1600px] py-10 px-6">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-up">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
          DSA Master Sheet
        </h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto mb-6">
          Complete collection of 425 curated problems for interview preparation
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {allPatterns.slice(0, 5).map(pattern => (
            <span key={pattern} className="px-3 py-1 rounded-full text-xs font-semibold bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20">
              {pattern}
            </span>
          ))}
          {allPatterns.length > 5 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
              +{allPatterns.length - 5} more patterns
            </span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-up delay-100">
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-accent-primary to-accent-violet text-white shadow-lg shadow-accent-primary/20">
          <div className="flex justify-between items-center mb-2">
            <BarChart3 size={24} />
            <Star size={20} className="text-yellow-300" />
          </div>
          <div className="text-4xl font-bold mb-1">
            {stats.solved}/{stats.total}
          </div>
          <div className="text-sm opacity-90">Problems Solved</div>
          <div className="w-full h-2 bg-white/30 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-500 ease-out"
              style={{ width: `${(stats.solved / stats.total) * 100}%` }} 
            />
          </div>
        </div>

        <StatCard 
          label="Easy Problems" 
          count={stats.easy} 
          solved={problems.filter(p => p.difficulty === 'Easy' && userProgress[`problem_${p.id}`]?.solved).length}
          color="emerald"
        />
        <StatCard 
          label="Medium Problems" 
          count={stats.medium} 
          solved={problems.filter(p => p.difficulty === 'Medium' && userProgress[`problem_${p.id}`]?.solved).length}
          color="amber"
        />
        <StatCard 
          label="Hard Problems" 
          count={stats.hard} 
          solved={problems.filter(p => p.difficulty === 'Hard' && userProgress[`problem_${p.id}`]?.solved).length}
          color="rose"
        />
      </div>

      {/* Filters */}
      <div className="glass-panel p-6 rounded-2xl mb-8 animate-fade-up delay-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative col-span-1 md:col-span-2">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search problems..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full bg-bg-secondary/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
            />
          </div>

          <Select 
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            options={[
              { value: 'all', label: 'All Difficulties' },
              { value: 'Easy', label: '✅ Easy' },
              { value: 'Medium', label: '⚠️ Medium' },
              { value: 'Hard', label: '🔥 Hard' }
            ]}
          />

          <Select 
            value={filters.pattern}
            onChange={(e) => setFilters({ ...filters, pattern: e.target.value })}
            options={[
              { value: 'all', label: 'All Patterns' },
              ...allPatterns.map(p => ({ value: p, label: `${p} (${patternStats[p]?.total || 0})` }))
            ]}
          />

          <Select 
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
            options={[
              { value: 'all', label: 'All Companies' },
              ...allCompanies.slice(0, 15).map(c => ({ value: c, label: c }))
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

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-text-secondary hover:text-white transition-colors select-none">
              <input
                type="checkbox"
                checked={groupByPattern}
                onChange={(e) => setGroupByPattern(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent-primary focus:ring-accent-primary/50"
              />
              <span className="flex items-center gap-2"><Layers size={14}/> Group by Pattern</span>
            </label>
            
            {selectedProblems.size > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent-primary/20 text-accent-primary border border-accent-primary/20">
                {selectedProblems.size} selected
              </span>
            )}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilters({ difficulty: 'all', status: 'all', pattern: 'all', company: 'all', search: '' })}
              className="px-4 py-2 rounded-xl bg-white/5 text-text-secondary hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Filter size={16} /> Reset
            </button>
            
            <button
              onClick={exportProgress}
              className="px-4 py-2 rounded-xl bg-accent-primary hover:bg-accent-violet text-white shadow-lg shadow-accent-primary/20 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {groupByPattern ? (
        <div className="space-y-4">
          {Object.keys(groupedProblems).sort().map(pattern => (
            <div key={pattern} className="glass-panel overflow-hidden rounded-xl border border-white/10">
              <div
                onClick={() => setExpandedPattern(expandedPattern === pattern ? null : pattern)}
                className="p-4 bg-white/5 border-b border-white/5 cursor-pointer flex justify-between items-center hover:bg-white/10 transition-colors"
               >
                 <div>
                   <h3 className="text-lg font-bold text-white m-0 flex items-center gap-2">
                     <Layers size={18} className="text-accent-primary"/>
                     {pattern}
                   </h3>
                   <p className="text-text-secondary text-sm m-0 mt-1 pl-7">
                     {groupedProblems[pattern].length} problems • {
                       groupedProblems[pattern].filter(p => userProgress[`problem_${p.id}`]?.solved).length
                     } solved
                   </p>
                 </div>
                 {expandedPattern === pattern ? <ChevronUp size={20} className="text-text-secondary" /> : <ChevronDown size={20} className="text-text-secondary" />}
               </div>
               
               {expandedPattern === pattern && (
                 <div className="p-0">
                   {groupedProblems[pattern].map(problem => (
                     <ProblemRow
                       key={problem.id}
                       problem={problem}
                       isSolved={userProgress[`problem_${problem.id}`]?.solved}
                       isSelected={selectedProblems.has(problem.id)}
                       onToggleSelect={toggleProblemSelection}
                       getDifficultyColor={getDifficultyColor}
                       navigate={navigate}
                     />
                   ))}
                 </div>
               )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel overflow-hidden rounded-xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-left">
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedProblems.size === sortedProblems.length && sortedProblems.length > 0}
                      onChange={toggleAllSelection}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent-primary focus:ring-accent-primary/50 cursor-pointer"
                    />
                  </th>
                  <th className="p-4 w-16 text-center text-text-secondary font-semibold text-sm uppercase tracking-wider">Status</th>
                  <SortableHeader label="#" column="id" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <SortableHeader label="Title" column="title" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <SortableHeader label="Pattern" column="pattern" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <SortableHeader label="Difficulty" column="difficulty" currentSort={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <th className="p-4 text-text-secondary font-semibold text-sm uppercase tracking-wider">Companies</th>
                  <th className="p-4 text-right text-text-secondary font-semibold text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProblems.map((problem) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    isSolved={userProgress[`problem_${problem.id}`]?.solved}
                    isSelected={selectedProblems.has(problem.id)}
                    onToggleSelect={toggleProblemSelection}
                    getDifficultyColor={getDifficultyColor}
                    navigate={navigate}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {sortedProblems.length === 0 && (
            <div className="p-12 text-center text-text-muted">
              <Filter size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium mb-1">No problems found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-8 p-6 glass-panel rounded-xl text-center border-t border-white/10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp size={24} className="text-accent-primary" />
          <span className="font-bold text-lg text-white">
            Keep pushing! Consistency is key 🚀
          </span>
        </div>
        <p className="text-text-secondary text-sm m-0">
          Showing {sortedProblems.length} of 425 problems • {
            ((stats.solved / 425) * 100).toFixed(1)
          }% complete
        </p>
      </div>
    </div>
  );
}

// Subcomponents
function StatCard({ label, count, solved, color }) {
  const colors = {
    emerald: 'text-emerald-400 border-emerald-500/20',
    amber: 'text-amber-400 border-amber-500/20',
    rose: 'text-rose-400 border-rose-500/20'
  };

  return (
    <div className={`glass-panel p-6 rounded-2xl border-l-4 ${colors[color]} hover:translate-y-[-2px] transition-transform duration-300`}>
      <div className={`text-4xl font-bold mb-1 ${colors[color].split(' ')[0]}`}>
        {count}
      </div>
      <div className="text-text-secondary text-sm">{label}</div>
      <div className={`mt-2 text-xs font-medium ${colors[color].split(' ')[0]}`}>
        {solved} solved
      </div>
    </div>
  );
}

function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-bg-secondary/50 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-text-secondary focus:outline-none focus:border-accent-primary transition-colors cursor-pointer hover:bg-white/5"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-bg-tertiary text-white">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
    </div>
  );
}

function SortableHeader({ label, column, currentSort, sortOrder, onSort }) {
  return (
    <th 
      onClick={() => onSort(column)}
      className="p-4 cursor-pointer text-text-secondary font-semibold hover:text-white transition-colors text-sm uppercase tracking-wider text-left"
    >
      <div className="flex items-center gap-1"> 
        {label} 
        {currentSort === column && (
          sortOrder === 'asc' ? <ChevronUp size={14} className="text-accent-primary"/> : <ChevronDown size={14} className="text-accent-primary"/>
        )}
      </div>
    </th>
  );
}

function ProblemRow({ problem, isSolved, isSelected, onToggleSelect, getDifficultyColor, navigate }) {
  return (
    <tr
      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
      onClick={() => navigate(`/problems/${problem.id}`)}
    >
      <td 
        className="p-4 text-center"
        onClick={(e) => { e.stopPropagation(); onToggleSelect(problem.id); }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className="w-4 h-4 rounded border-white/20 bg-white/5 text-accent-primary focus:ring-accent-primary/50 cursor-pointer"
        />
      </td>
      <td className="p-4 text-center">
        {isSolved ? (
          <CheckCircle size={20} className="text-emerald-400 mx-auto" />
        ) : (
          <Circle size={20} className="text-text-muted mx-auto group-hover:text-white transition-colors" />
        )}
      </td>
      <td className="p-4 text-sm text-text-secondary font-mono">
        {problem.id}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white group-hover:text-accent-primary transition-colors">{problem.title}</span>
          {problem.leetcode && (
            <a
              href={`https://leetcode.com/problems/${problem.title.toLowerCase().replace(/ /g, '-')}/`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </td>
      <td className="p-4">
        <span className="px-3 py-1 bg-white/5 rounded-md text-xs font-medium text-text-secondary border border-white/5">
          {problem.pattern}
        </span>
      </td>
      <td className="p-4">
        <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${getDifficultyColor(problem.difficulty)}`}>
          {problem.difficulty}
        </span>
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {problem.companies?.slice(0, 3).map((company, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-medium"
            >
              {company}
            </span>
          ))}
          {problem.companies?.length > 3 && (
            <span className="px-2 py-0.5 text-text-muted text-[10px]">
              +{problem.companies.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="p-4 text-right">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/problems/${problem.id}`);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            isSolved 
              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' 
              : 'bg-accent-primary text-white hover:bg-accent-violet hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]'
          }`}
        >
          {isSolved ? '✓ Review' : 'Solve'}
        </button>
      </td>
    </tr>
  );
}
