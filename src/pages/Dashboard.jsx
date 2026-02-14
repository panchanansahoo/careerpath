import React from 'react';
import { useAuth } from '../context/AuthContext';
import CursorGlow from '../components/CursorGlow';
import PomodoroTimer from '../components/PomodoroTimer';
import ActivityTracker from '../components/ActivityTracker';
import TodoList from '../components/TodoList';
import CalendarWidget from '../components/CalendarWidget';
import DailyChallenge from '../components/DailyChallenge';


export default function Dashboard() {
    const { user } = useAuth();
    const userName = user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'Engineer';

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
            <CursorGlow />

            {/* Subtle Background Noise & Gradient */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="fixed inset-0 bg-gradient-to-b from-purple-900/10 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-8 pt-24 relative z-10 flex flex-col gap-12">

                {/* Top Section: Welcome & Stats */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="mb-2">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-500 tracking-tighter mb-4">
                            {(() => {
                                const hour = new Date().getHours();
                                if (hour < 12) return 'Good morning';
                                if (hour < 18) return 'Good afternoon';
                                return 'Good evening';
                            })()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{userName}</span>
                        </h1>
                        <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                            Ready to level up your engineering career today?
                        </p>
                    </div>
                </div>

                {/* Productivity Station */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto">
                    <div className="lg:col-span-2 h-full">
                        <TodoList />
                    </div>
                    <div className="lg:col-span-1 h-full">
                        <CalendarWidget />
                    </div>
                </div>

                {/* Daily Company Challenge */}
                <div>
                    <DailyChallenge />
                </div>

                {/* Action Banners */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pomodoro Timer */}
                    <div className="lg:col-span-2">
                        <PomodoroTimer />
                    </div>

                    {/* Activity Tracker */}
                    <div className="lg:col-span-1">
                        <ActivityTracker />
                    </div>
                </div>

            </div>
        </div>
    );
}
