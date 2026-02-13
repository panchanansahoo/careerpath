import React from 'react';
import {
    MessageSquare, Brain, BookOpen, Grid3X3,
    FileText, Code, Settings, User, Mic,
    Calendar, Flame, Trophy, Target, ArrowRight,
    Sparkles, Crown, Layers as LayersIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CursorGlow from '../components/CursorGlow';

const FeatureCard = ({ icon: Icon, title, description, to }) => {
    return (
        <Link
            to={to}
            className="group relative flex flex-col p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-white/10 shadow-lg shadow-black/20"
        >
            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-white/5 border border-white/5 text-white group-hover:scale-110 transition-transform">
                <Icon size={24} className="opacity-80 group-hover:opacity-100" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-4 flex-1">
                {description}
            </p>
            <div className="flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                Explore <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
        </Link>
    );
};

const StatBadge = ({ icon: Icon, value, label }) => (
    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-sm">
        <Icon size={18} className="text-zinc-400" />
        <div>
            <div className="font-bold text-white leading-none">{value}</div>
            <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">{label}</div>
        </div>
    </div>
);

export default function Dashboard() {
    const { user } = useAuth();
    const userName = user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'Engineer';

    return (
        <div className="min-h-screen bg-[#020305] text-white font-sans selection:bg-white/10 pb-20 relative overflow-hidden">
            <CursorGlow />

            {/* Subtle Background - removed colorful blobs, kept noise */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            
            {/* Very Grid Pattern or specific subtle background if needed, leveraging clean dark background for now */}

            <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">

                {/* Top Section: Welcome & Stats */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                                    {userName[0]}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">Good morning, {userName}</h1>
                                    <p className="text-zinc-400">Ready to accelerate your career?</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <StatBadge icon={Flame} value="0" label="Streak" />
                            <StatBadge icon={Trophy} value="0" label="Sessions" />
                            <StatBadge icon={Target} value="0.0" label="Avg Score" />
                            <Link to="/pricing" className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-all shadow-lg shadow-white/10">
                                <Crown size={16} /> Upgrade
                            </Link>
                        </div>
                    </div>

                    {/* Action Banners */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Completion */}
                        <div className="lg:col-span-1 bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                        Complete Profile
                                    </div>
                                    <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-zinc-300">0%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full mb-4 overflow-hidden">
                                    <div className="h-full bg-white w-0 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                </div>
                                <p className="text-xs text-zinc-400 mb-4">
                                    Get <strong>1 Free AI Interview</strong> + Resume Analysis by completing your setup.
                                </p>
                                <Link to="/profile" className="block w-full text-center py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-sm font-medium transition-colors text-zinc-200">
                                    Complete Setup
                                </Link>
                            </div>
                        </div>

                        {/* Continue Learning */}
                        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group backdrop-blur-sm">
                            <div className="absolute inset-0 bg-white/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
                                    <Sparkles size={14} /> Recommended
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">Data Structures & Algorithms</h3>
                                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                                    Start your structured learning journey
                                </div>
                            </div>
                            <Link to="/dsa-patterns" className="relative z-10 whitespace-nowrap px-6 py-3 bg-white text-black hover:bg-zinc-200 rounded-xl font-semibold transition-all shadow-lg shadow-white/5">
                                Start Learning
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Core Features Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Core Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <FeatureCard
                            to="/ai-interview"
                            icon={Mic}
                            title="AI Mock Interviews"
                            description="Real-time voice interviews with our advanced AI across DSA, System Design, and Behavioral topics."
                        />
                        <FeatureCard
                            to="/ai-coach"
                            icon={Brain}
                            title="AI Coach"
                            description="Personalized AI tutor that explains complex concepts, reviews code, and helps you unblock."
                        />
                        <FeatureCard
                            to="/dsa-patterns-sheet"
                            icon={Grid3X3}
                            title="DSA Patterns Sheet"
                            description="Master 93+ essential coding patterns. The structured roadmap to ace technical rounds."
                        />
                        <FeatureCard
                            to="/system-design"
                            icon={LayersIcon} 
                            title="System Design"
                            description="Learn how to design scalable systems. Deep dives into distributed systems concepts."
                        />
                        <FeatureCard
                            to="/resume-analysis"
                            icon={FileText}
                            title="Resume Analyzer"
                            description="ATS-friendly optimization. Get detailed feedback to ensure your resume stands out."
                        />
                        <FeatureCard
                            to="/code-practice"
                            icon={Code}
                            title="AI Code Practice"
                            description="Practice coding problems with an AI assistant that provides hints and complexity analysis."
                        />
                    </div>
                </div>

                {/* Secondary/Community Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                             Recent Blogs
                        </h3>
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="flex gap-4 group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors">
                                    <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/5 flex-shrink-0"></div>
                                    <div>
                                        <h4 className="font-semibold text-zinc-200 group-hover:text-white mb-1">System Design: Scaling to 1M Users</h4>
                                        <p className="text-xs text-zinc-500">5 min read • System Design</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-white mb-2">Join the Community</h3>
                            <p className="text-zinc-400 text-sm mb-6">Connect with thousands of other engineers preparing for their interviews.</p>
                            <Link to="/community" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-sm font-medium transition-colors text-white">
                                <User size={16} /> Explore Community
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

