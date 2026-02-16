import React from 'react';
import { Link } from 'react-router-dom';
import { Server, Database, Layers, ArrowRight, Box, Cpu, Globe, BookOpen, Activity } from 'lucide-react';

const SystemDesignCard = ({ title, description, icon: Icon, link, color }) => (
    <Link to={link} className="block group">
        <div className={`
            relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 
            hover:bg-white/10 transition-all duration-500 p-8 h-full
            hover:shadow-2xl hover:shadow-${color}-500/10 hover:border-${color}-500/20
        `}>
            <div className={`
                absolute top-0 right-0 w-64 h-64 bg-${color}-500/10 blur-3xl 
                rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-${color}-500/20 
                transition-all duration-500
            `} />
            
            <div className="relative z-10 flex flex-col h-full">
                <div className={`
                    w-14 h-14 rounded-xl bg-gradient-to-br from-${color}-500/20 to-${color}-500/5
                    border border-${color}-500/20 flex items-center justify-center mb-6
                    group-hover:scale-110 transition-transform duration-500
                `}>
                    <Icon size={28} className={`text-${color}-400`} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-${color}-400 transition-colors">
                    {title}
                </h3>
                
                <p className="text-zinc-400 mb-8 flex-grow leading-relaxed">
                    {description}
                </p>
                
                <div className="flex items-center text-sm font-semibold text-white/50 group-hover:text-white transition-colors">
                    <span>Start Learning</span>
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    </Link>
);

const FeatureItem = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-3 text-zinc-400">
        <div className="p-2 rounded-lg bg-white/5 border border-white/5">
            <Icon size={16} className="text-blue-400" />
        </div>
        <span>{text}</span>
    </div>
);

export default function SystemDesign() {
    return (
        <div className="min-h-screen bg-[#020305] text-white font-sans pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
                        <Server size={14} />
                        <span>System Design Mastery</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 mb-6 tracking-tight">
                        Architect Scalable <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Distributed Systems
                        </span>
                    </h1>
                    
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Master the art of designing large-scale systems. From high-level architecture to low-level component design, prepare for your next big tech interview.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
                    <SystemDesignCard 
                        title="High Level Design (HLD)"
                        description="Learn to design complex verifiable distributed systems. Master concepts like Load Balancing, Caching, Sharding, and Consistency patterns."
                        icon={Globe}
                        link="/dashboard/learning-path/hld"
                        color="blue"
                    />
                    
                    <SystemDesignCard 
                        title="Low Level Design (LLD)"
                        description="Deep dive into Object Oriented Design, Design Patterns, and Schema Design. Learn to write clean, maintainable, and extensible code."
                        icon={Layers}
                        link="/dashboard/learning-path/lld"
                        color="purple"
                    />

                    <SystemDesignCard 
                        title="System Architecture Simulator"
                        description="Design and test scalable architectures with our interactive simulator. Visualise traffic flow, bottlenecks, and estimate potential costs in real-time."
                        icon={Activity}
                        link="/system-design/simulator"
                        color="green"
                    />
                </div>

                {/* Features Section */}
                <div className="max-w-4xl mx-auto rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm p-10">
                    <h3 className="text-xl font-bold text-white mb-8 text-center">Everything you need to crack System Design</h3>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <FeatureItem icon={Server} text="Distributed Systems" />
                            <FeatureItem icon={Database} text="Database Sharding" />
                        </div>
                        <div className="space-y-4">
                            <FeatureItem icon={Box} text="Microservices" />
                            <FeatureItem icon={Cpu} text="API Design" />
                        </div>
                        <div className="space-y-4">
                            <FeatureItem icon={Globe} text="Content Delivery Networks" />
                            <FeatureItem icon={BookOpen} text="Real-world Case Studies" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
