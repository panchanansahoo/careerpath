import React from 'react';
import { Calculator, BrainCircuit, MessageSquareQuote, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import CursorGlow from '../components/CursorGlow';

const AptitudeCard = ({ title, description, icon: Icon, color, details }) => (
    <div className="group relative p-8 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-[${color}]`}>
            <Icon size={120} />
        </div>

        <div className="relative z-10">
            <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-white/5 border border-white/5 text-[${color}] group-hover:scale-110 transition-transform`}>
                <Icon size={28} style={{ color: color }} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-zinc-400 leading-relaxed mb-6">
                {description}
            </p>

            <ul className="space-y-2 mb-8">
                {details.map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-zinc-500">
                        <span className={`w-1.5 h-1.5 rounded-full mr-3`} style={{ backgroundColor: color }}></span>
                        {item}
                    </li>
                ))}
            </ul>

            <button className="flex items-center text-sm font-bold text-white group-hover:translate-x-1 transition-transform">
                Start Practice <ArrowRight size={16} className="ml-2" />
            </button>
        </div>
    </div>
);

export default function AptitudeMastery() {
    return (
        <div className="min-h-screen bg-[#050507] text-white selection:bg-indigo-500/30">
            <CursorGlow />

            <div className="max-w-7xl mx-auto px-6 py-12 pt-24 relative z-10">
                <div className="mb-16 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
                        <Sparkles size={12} />
                        New Feature
                    </div>
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
                        Aptitude Mastery
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed">
                        Master the essential quantitative, logical, and verbal skills required for technical interviews and competitive exams.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AptitudeCard
                        title="Quantitative Aptitude"
                        description="Master numerical ability and mathematical problem-solving skills."
                        icon={Calculator}
                        color="#818cf8"
                        details={[
                            "Number Systems & Algebra",
                            "Arithmetic & Percentage",
                            "Geometry & Mensuration",
                            "Data Interpretation"
                        ]}
                    />

                    <AptitudeCard
                        title="Logical Reasoning"
                        description="Enhance your analytical thinking and pattern recognition capabilities."
                        icon={BrainCircuit}
                        color="#f472b6"
                        details={[
                            "Puzzles & Seating Arrangement",
                            "Coding-Decoding",
                            "Series & Analogies",
                            "Critical Reasoning"
                        ]}
                    />

                    <AptitudeCard
                        title="Verbal Ability"
                        description="Improve your command over English grammar, vocabulary, and comprehension."
                        icon={MessageSquareQuote}
                        color="#34d399"
                        details={[
                            "Reading Comprehension",
                            "Grammar & Correction",
                            "Vocabulary & Synonyms",
                            "Verbal Logic"
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
