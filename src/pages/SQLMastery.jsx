import React from 'react';
import { Database, Search, Table, Braces, ArrowRight, Sparkles } from 'lucide-react';


const SQLCard = ({ title, description, icon: Icon, color, details }) => (
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
                Start Querying <ArrowRight size={16} className="ml-2" />
            </button>
        </div>
    </div>
);

const PremiumQuestionCard = () => {
    const options = [
        "SELECT department, AVG(salary) FROM employees;",
        "SELECT department, AVG(salary) FROM employees GROUP BY department;",
        "SELECT department, salary FROM employees GROUP BY department;",
        "SELECT AVG(salary) OVER (department) FROM employees;"
    ];

    return (
        <div className="relative mt-16 rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#0b0f1f] via-[#0a1328] to-[#180f2a] p-8 md:p-10 shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-hidden">
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-cyan-400/20 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-20 -left-16 w-52 h-52 bg-fuchsia-500/20 blur-3xl rounded-full"></div>

            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-400/10 border border-cyan-300/30 mb-6">
                    <Database size={14} />
                    Premium SQL Challenge
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Question of the Day</h2>
                <p className="text-zinc-300 mb-6 leading-relaxed">
                    You need the average salary per department from an <span className="text-cyan-300 font-semibold">employees</span> table.
                    Which query is correct?
                </p>

                <div className="rounded-2xl bg-black/40 border border-white/10 p-5 mb-6">
                    <code className="text-sm md:text-base text-cyan-200 whitespace-pre-wrap">
                        SELECT department, AVG(salary) as avg_salary\nFROM employees\n_____;
                    </code>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`group rounded-xl border p-4 transition-all duration-300 ${
                                index === 1
                                    ? 'border-emerald-400/50 bg-emerald-500/10 hover:bg-emerald-500/20'
                                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                            }`}
                        >
                            <div className="flex items-start gap-3">
                                <span className={`mt-0.5 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                                    index === 1
                                        ? 'bg-emerald-400 text-black'
                                        : 'bg-zinc-700 text-zinc-200 group-hover:bg-zinc-600'
                                }`}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <p className="text-sm text-zinc-200 leading-relaxed">{option}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="mt-5 text-sm text-emerald-300 font-medium">
                    ✓ Correct Answer: B — Use <span className="font-bold">GROUP BY department</span> to aggregate by each department.
                </p>
            </div>
        </div>
    );
};

export default function SQLMastery() {
    return (
        <div className="min-h-screen bg-[#050507] text-white selection:bg-cyan-500/30">


            <div className="max-w-7xl mx-auto px-6 py-12 pt-24 relative z-10">
                <div className="mb-16 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6">
                        <Sparkles size={12} />
                        New Feature
                    </div>
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-500">
                        SQL Mastery
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed">
                        Master database querying, optimization, and design. From basic SELECT statements to complex window functions and CTEs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <SQLCard
                        title="Basic & Intermediate SQL"
                        description="Foundation of database interaction. Filtering, sorting, and aggregating data."
                        icon={Search}
                        color="#22d3ee"
                        details={[
                            "SELECT, WHERE, ORDER BY",
                            "Joins (Inner, Left, Right, Full)",
                            "GROUP BY & HAVING",
                            "String & Date Functions"
                        ]}
                    />

                    <SQLCard
                        title="Advanced SQL"
                        description="Complex queries for data analysis and reporting."
                        icon={Braces}
                        color="#a78bfa"
                        details={[
                            "Window Functions (RANK, LEAD)",
                            "Common Table Expressions (CTEs)",
                            "Subqueries & EXISTS",
                            "Stored Procedures & Triggers"
                        ]}
                    />

                    <SQLCard
                        title="Database Design"
                        description="Schema design, normalization, and performance optimization."
                        icon={Table}
                        color="#f472b6"
                        details={[
                            "Normalization (1NF to 3NF)",
                            "Indexing & Performance Tuning",
                            "ACID Properties",
                            "Sharding & Partitioning"
                        ]}
                    />
                </div>

                <PremiumQuestionCard />
            </div>
        </div>
    );
}
