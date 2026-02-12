import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart3, CheckCircle, Circle, BookOpen, Clock, Target, TrendingUp,
    ChevronRight, ChevronDown, Database, PieChart, FlaskConical, BrainCircuit,
    Table2, LineChart, Sigma, FileSpreadsheet, Code, Briefcase
} from 'lucide-react';

const modules = [
    {
        id: 'stats-foundations',
        title: 'Statistics & Probability Foundations',
        icon: <Sigma size={20} />,
        color: 'text-violet-400',
        bgColor: 'bg-violet-500/10',
        borderColor: 'border-violet-500/20',
        duration: '2 weeks',
        problems: 18,
        topics: ['Descriptive Statistics', 'Probability Distributions', 'Hypothesis Testing', 'Bayesian Inference', 'Confidence Intervals', 'A/B Testing'],
        lessons: [
            { title: 'Mean, Median, Mode & Variance', type: 'theory', done: true },
            { title: 'Normal & Binomial Distributions', type: 'theory', done: true },
            { title: 'Central Limit Theorem', type: 'theory', done: true },
            { title: 'Hypothesis Testing (t-test, chi-square)', type: 'practice', done: false },
            { title: 'A/B Testing Design & Analysis', type: 'project', done: false }
        ]
    },
    {
        id: 'python-data',
        title: 'Python for Data Analysis',
        icon: <Table2 size={20} />,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        duration: '2 weeks',
        problems: 22,
        topics: ['NumPy', 'Pandas', 'Data Wrangling', 'Missing Data', 'Feature Engineering', 'EDA'],
        lessons: [
            { title: 'NumPy Arrays & Vectorized Operations', type: 'theory', done: true },
            { title: 'Pandas DataFrames & Series', type: 'practice', done: true },
            { title: 'Data Cleaning & Missing Values', type: 'practice', done: false },
            { title: 'GroupBy, Merge & Pivot Tables', type: 'practice', done: false },
            { title: 'Exploratory Data Analysis Project', type: 'project', done: false }
        ]
    },
    {
        id: 'data-viz',
        title: 'Data Visualization & Storytelling',
        icon: <LineChart size={20} />,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/20',
        duration: '1 week',
        problems: 12,
        topics: ['Matplotlib', 'Seaborn', 'Plotly', 'Dashboard Design', 'Storytelling with Data'],
        lessons: [
            { title: 'Matplotlib & Seaborn Fundamentals', type: 'theory', done: true },
            { title: 'Interactive Plots with Plotly', type: 'practice', done: false },
            { title: 'Dashboard Design Principles', type: 'theory', done: false },
            { title: 'End-to-End EDA Visualization Project', type: 'project', done: false }
        ]
    },
    {
        id: 'ml-fundamentals',
        title: 'Machine Learning Fundamentals',
        icon: <BrainCircuit size={20} />,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/20',
        duration: '3 weeks',
        problems: 30,
        topics: ['Linear Regression', 'Logistic Regression', 'Decision Trees', 'Random Forest', 'SVM', 'KNN', 'Model Evaluation'],
        lessons: [
            { title: 'Supervised vs. Unsupervised Learning', type: 'theory', done: false },
            { title: 'Linear & Logistic Regression from Scratch', type: 'practice', done: false },
            { title: 'Tree-Based Models & Ensembles', type: 'theory', done: false },
            { title: 'Cross-Validation & Hyperparameter Tuning', type: 'practice', done: false },
            { title: 'End-to-End ML Pipeline Project', type: 'project', done: false }
        ]
    },
    {
        id: 'sql-analytics',
        title: 'SQL for Analytics',
        icon: <Database size={20} />,
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/20',
        duration: '2 weeks',
        problems: 25,
        topics: ['Joins', 'Window Functions', 'CTEs', 'Subqueries', 'Query Optimization', 'Data Modeling'],
        lessons: [
            { title: 'Complex Joins & Set Operations', type: 'theory', done: false },
            { title: 'Window Functions (ROW_NUMBER, RANK, LAG)', type: 'practice', done: false },
            { title: 'CTEs & Recursive Queries', type: 'practice', done: false },
            { title: 'Query Optimization & Indexing', type: 'theory', done: false },
            { title: 'Analytics Dashboard SQL Project', type: 'project', done: false }
        ]
    },
    {
        id: 'deep-learning',
        title: 'Deep Learning & Neural Networks',
        icon: <FlaskConical size={20} />,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
        duration: '3 weeks',
        problems: 20,
        topics: ['Neural Networks', 'CNNs', 'RNNs', 'Transfer Learning', 'NLP Basics', 'PyTorch/TensorFlow'],
        lessons: [
            { title: 'Perceptrons & Activation Functions', type: 'theory', done: false },
            { title: 'Building Neural Networks with PyTorch', type: 'practice', done: false },
            { title: 'Convolutional Neural Networks', type: 'theory', done: false },
            { title: 'Sequence Models & Attention', type: 'theory', done: false },
            { title: 'Image Classification Project', type: 'project', done: false }
        ]
    }
];

export default function DataScienceLearningPath() {
    const [expanded, setExpanded] = useState(null);

    const totalProblems = modules.reduce((a, m) => a + m.problems, 0);
    const doneLessons = modules.reduce((a, m) => a + m.lessons.filter(l => l.done).length, 0);
    const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
    const pct = Math.round((doneLessons / totalLessons) * 100);

    return (
        <div className="container py-10 px-6 max-w-[1400px] animate-fade-up">
            {/* Hero */}
            <div className="glass-panel p-8 md:p-12 rounded-3xl mb-10 border border-white/10 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-br from-violet-500 to-emerald-500 opacity-20 blur-3xl pointer-events-none rounded-full"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                            <PieChart size={24} />
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-violet-500/10 text-violet-400 border-violet-500/20">
                            Learning Path
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-sm">
                        Data Science & Analytics
                    </h1>
                    <p className="text-xl text-text-secondary max-w-3xl leading-relaxed mb-10 font-light">
                        Master statistics, Python data analysis, machine learning, SQL, and deep learning — everything you need to ace data science interviews at top companies.
                    </p>

                    <div className="flex flex-wrap gap-6 md:gap-12 text-sm text-text-muted mb-8">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-white/5 text-gray-400"><Clock size={16} /></div>
                            <span>13 Weeks</span>
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
                            className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-1000 ease-out"
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
                                        <span className="flex items-center gap-1.5"><Code size={12} /> {mod.problems} problems</span>
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

                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${l.type === 'project' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
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
