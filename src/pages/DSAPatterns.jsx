import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, ChevronRight, Search, Filter, Layers, Code2 } from 'lucide-react';

export default function DSAPatterns() {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatterns();
  }, []);

  const fetchPatterns = async () => {
    try {
      const response = await axios.get('/api/dsa/patterns');
      setPatterns(response.data.patterns);
    } catch (error) {
      console.error('Error fetching patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  const filteredPatterns = patterns.filter(p => {
    const matchesCategory = filter === 'all' || p.category.toLowerCase() === filter.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', ...new Set(patterns.map(p => p.category))];

  return (
    <div className="container py-10 px-6">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-up">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          DSA Patterns
        </h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto">
          Master 90+ algorithmic patterns covering all major data structures and algorithms.
          Stop memorizing solutions, start seeing patterns.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="glass-panel p-6 rounded-2xl mb-10 flex flex-col md:flex-row gap-6 justify-between items-center animate-fade-up delay-100">
        <div className="relative w-full md:w-96">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input 
            type="text" 
            placeholder="Search patterns..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === category 
                  ? 'bg-accent text-white shadow-lg shadow-accent/30' 
                  : 'bg-white/5 text-secondary hover:bg-white/10 hover:text-white'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatterns.map((pattern, index) => (
          <Link
            key={pattern.id}
            to={`/patterns/${pattern.id}`}
            className="group block animate-fade-up"
            style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
          >
            <div className="h-full glass-panel p-6 rounded-2xl border border-white/5 hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={20} className="text-muted group-hover:text-white transform group-hover:translate-x-1 transition-transform" />
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                  <Layers size={20} />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors line-clamp-1">
                  {pattern.name}
                </h3>
              </div>
              
              <p className="text-secondary text-sm mb-6 line-clamp-2 h-10">
                {pattern.description}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${
                    pattern.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    pattern.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {pattern.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {pattern.category}
                  </span>
                </div>
                {pattern.problem_count > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Code2 size={12} />
                    <span>{pattern.problem_count} problems</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPatterns.length === 0 && (
        <div className="text-center py-20 text-muted">
          <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg">No patterns found matching your criteria</p>
          <button 
            onClick={() => {setFilter('all'); setSearchQuery('')}}
            className="mt-4 text-accent hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
