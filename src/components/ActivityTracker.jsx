import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Activity, Clock, BarChart3, ChevronDown, Trophy, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ActivityTracker = () => {
    const [timeSpent, setTimeSpent] = useState(0);
    const [activityData, setActivityData] = useState([]);
    const [selectedDateIndex, setSelectedDateIndex] = useState(6);
    const [isHovered, setIsHovered] = useState(false);
    const timeRef = useRef(0);
    const unsavedChangesRef = useRef(false);

    useEffect(() => {
        const fetchActivity = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            // Check for guest mode
            const isGuest = localStorage.getItem('isGuest') === 'true';

            if (!session && !isGuest) return;

            if (isGuest) {
                // Guest Logic: Load from localStorage
                try {
                    const savedTime = localStorage.getItem('guest_timeSpent');
                    const savedData = localStorage.getItem('guest_activityData');

                    if (savedTime) {
                        setTimeSpent(parseInt(savedTime, 10));
                        timeRef.current = parseInt(savedTime, 10);
                    }

                    if (savedData) {
                        setActivityData(JSON.parse(savedData));
                    } else {
                        // Initialize empty structure if needed or just let it build up
                        setActivityData([]);
                    }
                } catch (e) {
                    console.error("Failed to load guest data", e);
                }
                return;
            }

            // Authenticated Logic
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/activity/weekly`, {
                    headers: { 'Authorization': `Bearer ${session.access_token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setActivityData(data);

                    const todayStr = new Date().toISOString().split('T')[0];
                    const todayData = data.find(d => d.date === todayStr);
                    const initialTime = todayData ? todayData.seconds_active : 0;

                    setTimeSpent(initialTime);
                    timeRef.current = initialTime;
                }
            } catch (error) {
                console.error("Failed to fetch activity:", error);
            }
        };

        fetchActivity();

        const interval = setInterval(() => {
            setTimeSpent(prev => {
                const newTime = prev + 1;
                timeRef.current = newTime;
                unsavedChangesRef.current = true;
                return newTime;
            });
        }, 1000);

        const syncInterval = setInterval(syncData, 5000); // More frequent save for local feeling

        return () => {
            clearInterval(interval);
            clearInterval(syncInterval);
            syncData();
        };
    }, []);

    const syncData = async () => {
        if (!unsavedChangesRef.current) return;

        const isGuest = localStorage.getItem('isGuest') === 'true';

        if (isGuest) {
            // Guest Logic: Save to localStorage
            localStorage.setItem('guest_timeSpent', timeRef.current.toString());
            // Optionally update activityData array for the chart
            // For now just saving total time, graph logic might need a refresh to show live updates effectively from local
            try {
                // Simple local update for the chart's data source if we want it to reflect immediately
                const todayStr = new Date().toISOString().split('T')[0];
                const storedData = localStorage.getItem('guest_activityData');
                let data = storedData ? JSON.parse(storedData) : [];

                const existingIndex = data.findIndex(d => d.date === todayStr);
                if (existingIndex >= 0) {
                    data[existingIndex].seconds_active = timeRef.current;
                } else {
                    data.push({ date: todayStr, seconds_active: timeRef.current });
                }
                localStorage.setItem('guest_activityData', JSON.stringify(data));
                setActivityData(data); // Update state to reflect in chart
            } catch (e) {
                console.error("Error saving guest activity", e);
            }

            unsavedChangesRef.current = false;
            return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/activity/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    date: new Date().toISOString().split('T')[0],
                    seconds: timeRef.current
                })
            });
            unsavedChangesRef.current = false;
        } catch (error) {
            console.error("Sync failed:", error);
        }
    };

    const processedData = useMemo(() => {
        const data = [];
        const today = new Date();
        const storedData = {};

        activityData.forEach(item => {
            const dateKey = item.date.split('T')[0];
            storedData[dateKey] = item.seconds_active;
        });

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const fullDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            const isToday = i === 0;
            const seconds = isToday ? timeSpent : (storedData[dateStr] || 0);

            data.push({
                day: dayName,
                date: dateStr,
                fullDate: fullDate,
                seconds: seconds,
                isToday: isToday
            });
        }
        return data;
    }, [activityData, timeSpent]);

    const selectedDay = processedData[selectedDateIndex] || processedData[processedData.length - 1] || { seconds: 0 };

    const formatTimeDetailed = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);

        return (
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    {h}
                </span>
                <span className="text-sm text-zinc-500 font-medium mr-2">hr</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {m}
                </span>
                <span className="text-sm text-zinc-500 font-medium">min</span>
            </div>
        );
    };

    const [taskStats, setTaskStats] = useState({ today: 0, pending: 0 });

    useEffect(() => {
        const updateStats = () => {
            try {
                const saved = localStorage.getItem('todo_list_v2');
                if (saved) {
                    const tasks = JSON.parse(saved);
                    const todayStr = new Date().toISOString().split('T')[0];

                    const todayCount = tasks.filter(t => t.dueDate === todayStr).length;
                    const pendingCount = tasks.filter(t => !t.completed).length;

                    setTaskStats({ today: todayCount, pending: pendingCount });
                }
            } catch (e) {
                console.error("Failed to parse tasks", e);
            }
        };

        updateStats();
        const interval = setInterval(updateStats, 2000);
        return () => clearInterval(interval);
    }, []);

    const hours = Math.floor(timeSpent / 3600);
    const minutes = Math.floor((timeSpent % 3600) / 60);

    // Calculate progress for circular chart (max 12h for full circle visual)
    const maxDailySeconds = 12 * 60 * 60;
    const progressPercent = Math.min((timeSpent / maxDailySeconds) * 100, 100);
    const circumference = 2 * Math.PI * 74;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
        <div
            className="group w-full h-full [perspective:1000px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${isHovered ? '[transform:rotateY(180deg)]' : ''}`}>

                {/* --- FRONT FACE --- */}
                <div className="absolute inset-0 [backface-visibility:hidden] bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl ring-1 ring-white/5">
                    {/* Ambient Glows */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

                    {/* Header */}
                    <div className="relative z-10 flex flex-col items-center justify-center mb-2 w-full text-center">
                        <div className="mb-2 p-2.5 rounded-full bg-linear-to-b from-white/10 to-transparent border border-white/10 shadow-inner shadow-white/5">
                            <Activity size={16} className="text-blue-400" />
                        </div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] drop-shadow-md leading-none">
                            Digital Wellbeing
                        </h3>
                        <div className="mt-3 h-px w-8 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                    </div>

                    {/* Circular Chart */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full"></div>

                            <svg className="w-full h-full -rotate-90 transform drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]" viewBox="0 0 160 160">
                                {/* Track */}
                                <circle
                                    cx="80" cy="80" r="74"
                                    fill="transparent"
                                    stroke="rgba(255,255,255,0.03)"
                                    strokeWidth="6"
                                />
                                {/* Indicator */}
                                <circle
                                    cx="80" cy="80" r="74"
                                    fill="transparent"
                                    stroke="url(#gradient-usage)"
                                    strokeWidth="6"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                                <defs>
                                    <linearGradient id="gradient-usage" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#60A5FA" />
                                        <stop offset="100%" stopColor="#818CF8" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <div className="flex items-baseline gap-0.5 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                    <span className="text-4xl font-bold text-white tracking-tighter">{hours}</span>
                                    <span className="text-sm text-zinc-400 font-medium mb-1">h</span>
                                    <span className="text-4xl font-bold text-white tracking-tighter ml-2">{minutes}</span>
                                    <span className="text-sm text-zinc-400 font-medium mb-1">m</span>
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-2">Active Time</div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Tiles */}
                    <div className="relative z-10 grid grid-cols-2 gap-3 mt-auto">
                        <div className="relative group/opt overflow-hidden rounded-xl bg-white/[0.03] border border-white/5 p-3 hover:bg-white/[0.06] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                            <div className="flex items-center gap-2 mb-1.5 text-zinc-400">
                                <Zap size={12} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Today</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-white">{taskStats.today}</span>
                                <span className="text-xs text-zinc-500">tasks</span>
                            </div>
                        </div>

                        <div className="relative group/opt overflow-hidden rounded-xl bg-white/[0.03] border border-white/5 p-3 hover:bg-white/[0.06] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                            <div className="flex items-center gap-2 mb-1.5 text-zinc-400">
                                <Clock size={12} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Pending</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-white">{taskStats.pending}</span>
                                <span className="text-xs text-zinc-500">tasks</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BACK FACE --- */}
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#0a0a0c]/90 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 flex flex-col shadow-2xl ring-1 ring-white/5">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>

                    {/* Header */}
                    <div className="relative z-10 flex flex-col items-center justify-center mb-6 w-full text-center">
                        <div className="mb-2 p-2.5 rounded-full bg-linear-to-b from-white/10 to-transparent border border-white/10 shadow-inner shadow-white/5">
                            <BarChart3 size={16} className="text-purple-400" />
                        </div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] drop-shadow-md leading-none">
                            Weekly Analysis
                        </h3>
                        <div className="mt-3 h-px w-8 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                    </div>

                    {/* Main Stats Display */}
                    <div className="relative z-10 mb-6 flex flex-col items-center text-center">
                        <div className="drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                            {formatTimeDetailed(selectedDay.seconds)}
                        </div>
                        <div className="text-xs text-zinc-500 font-medium mt-2 flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-white/[0.03] border border-white/[0.05]">
                            <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${selectedDay.isToday ? 'bg-green-400 text-green-400' : 'bg-zinc-500 text-zinc-500'}`}></span>
                            {selectedDay.isToday ? 'Today' : selectedDay.fullDate}
                        </div>
                    </div>

                    {/* Chart Container */}
                    <div className="relative z-10 flex-1 w-full flex flex-col justify-end">
                        {/* Bars Area */}
                        <div className="flex items-end justify-between h-32 gap-2">
                            {processedData.map((d, i) => {
                                const isSelected = i === selectedDateIndex;
                                // Scale height, max at 8 hours visual for chart dynamics
                                const heightPercent = Math.min((d.seconds / (8 * 3600)) * 100, 100);

                                return (
                                    <div
                                        key={i}
                                        className="flex flex-col items-center flex-1 gap-2 cursor-pointer group/bar h-full justify-end"
                                        onMouseEnter={() => setSelectedDateIndex(i)}
                                    >
                                        <div className="w-full relative flex items-end justify-center h-full">
                                            {/* Bar */}
                                            <div
                                                className={`w-full max-w-[12px] rounded-t-[4px] transition-all duration-500 ease-out relative overflow-hidden ${isSelected
                                                    ? 'bg-gradient-to-t from-blue-500 via-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                                                    : 'bg-white/10 group-hover/bar:bg-white/20'
                                                    }`}
                                                style={{ height: `${Math.max(heightPercent, 4)}%` }}
                                            >
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-medium transition-colors uppercase tracking-wider ${isSelected ? 'text-white' : 'text-zinc-600 group-hover/bar:text-zinc-400'
                                            }`}>
                                            {d.day.charAt(0)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ActivityTracker;
