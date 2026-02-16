import React, { useState, useEffect } from 'react';
import { dailyChallenges } from '../data/dailyChallenges';
import { ExternalLink, Code2, Database, ChevronRight, Sparkles, Building2 } from 'lucide-react';

const DailyChallenge = () => {
    const [challenge, setChallenge] = useState(null);

    useEffect(() => {
        // Seed random based on date to keep it consistent for the day
        const date = new Date();
        const seed = date.getDate() + date.getMonth() * 31 + date.getFullYear() * 366;
        const index = seed % dailyChallenges.length;
        setChallenge(dailyChallenges[index]);
    }, []);

    if (!challenge) return null;

    const Icon = challenge.icon;

    return (
        <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-2xl">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
            <div className={`absolute -top-48 -right-48 w-96 h-96 ${challenge.color.replace('text-', 'bg-')}/20 rounded-full blur-[100px] pointer-events-none`}></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>

            <div className="relative p-8 md:p-10">
                {/* Header */}
                {/* Header */}
                <div className="relative flex flex-col items-center justify-center text-center mb-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-6 backdrop-blur-sm shadow-md">
                        <Sparkles size={12} className="text-yellow-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Daily Challenge</span>
                    </div>

                    {/* Date - Absolute positioned within safe area */}
                    <div className="absolute top-6 right-6 hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase mb-0.5">Today</span>
                        <span className="text-xs font-semibold text-zinc-300 font-mono bg-white/5 px-2 py-1 rounded-md border border-white/5">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${challenge.color} shadow-lg`}>
                            <Icon size={20} />
                        </div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold text-white tracking-tight">{challenge.name}</h3>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/5 ${challenge.type === 'Product' ? 'text-emerald-400 border-emerald-500/20' : 'text-blue-400 border-blue-500/20'
                                }`}>
                                {challenge.type}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
                    {/* DSA Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 text-white/90 font-semibold mb-2">
                            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                                <Code2 size={18} />
                            </div>
                            <h3>Data Structures & Algorithms</h3>
                        </div>
                        <div className="space-y-3">
                            {challenge.dsa.map((q, idx) => (
                                <a
                                    key={idx}
                                    href={q.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/item flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono text-zinc-500 w-4">{idx + 1}</span>
                                        <span className="text-sm text-zinc-200 group-hover/item:text-white transition-colors">{q.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                                            q.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400' :
                                                'bg-rose-500/10 text-rose-400'
                                            }`}>
                                            {q.difficulty}
                                        </span>
                                        <ExternalLink size={14} className="text-zinc-500 group-hover/item:text-white opacity-0 group-hover/item:opacity-100 transition-all" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* SQL Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 text-white/90 font-semibold mb-2">
                            <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400">
                                <Database size={18} />
                            </div>
                            <h3>SQL & Database</h3>
                        </div>
                        <div className="space-y-3">
                            {challenge.sql.map((q, idx) => (
                                <a
                                    key={idx}
                                    href={q.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/item flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono text-zinc-500 w-4">{idx + 1}</span>
                                        <span className="text-sm text-zinc-200 group-hover/item:text-white transition-colors">{q.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' :
                                            q.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400' :
                                                'bg-rose-500/10 text-rose-400'
                                            }`}>
                                            {q.difficulty}
                                        </span>
                                        <ExternalLink size={14} className="text-zinc-500 group-hover/item:text-white opacity-0 group-hover/item:opacity-100 transition-all" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyChallenge;
