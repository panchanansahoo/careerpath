import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, Trophy, Info, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [displayDate, setDisplayDate] = useState(new Date());
    const [timeLeft, setTimeLeft] = useState('');
    const [streak, setStreak] = useState({ current: 0, best: 0 });

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 59, 999);

            const diff = endOfDay - now;

            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft(
                `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
            );
        };

        const calculateStreaks = () => {
            try {
                const savedData = localStorage.getItem('guest_activityData');
                if (!savedData) return;

                const data = JSON.parse(savedData);
                const activityMap = new Map();
                data.forEach(d => {
                    if (d.seconds_active > 0) {
                        activityMap.set(d.date, d.seconds_active);
                    }
                });

                const todayKey = new Date().toISOString().split('T')[0];
                let current = 0;
                let checkDate = new Date();

                // Check today
                if (activityMap.has(todayKey)) {
                    current = 1;
                }

                // Check backwards
                checkDate.setDate(checkDate.getDate() - 1);
                while (true) {
                    const key = checkDate.toISOString().split('T')[0];
                    if (activityMap.has(key)) {
                        current++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else {
                        break;
                    }
                }

                // Calculate Best Streak
                let best = 0;
                let tempStreak = 0;
                const sortedDates = [...activityMap.keys()].sort();

                if (sortedDates.length > 0) {
                    let prevDate = new Date(sortedDates[0]);
                    tempStreak = 1;
                    best = 1;

                    for (let i = 1; i < sortedDates.length; i++) {
                        const currDate = new Date(sortedDates[i]);
                        const diffTime = Math.abs(currDate - prevDate);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays === 1) {
                            tempStreak++;
                        } else {
                            tempStreak = 1;
                        }
                        best = Math.max(best, tempStreak);
                        prevDate = currDate;
                    }
                }

                setStreak({ current, best });

            } catch (e) {
                console.error("Streak calculation error", e);
            }
        };

        const timer = setInterval(() => {
            updateTimer();
            calculateStreaks();
        }, 1000);

        updateTimer();
        calculateStreaks();

        return () => clearInterval(timer);
    }, []);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        // Previous month days
        const prevMonthDays = new Date(year, month, 0).getDate();

        return { days, firstDay, prevMonthDays };
    };

    const { days, firstDay, prevMonthDays } = getDaysInMonth(displayDate);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1));
    };

    const isToday = (day) => {
        return day === currentDate.getDate() &&
            displayDate.getMonth() === currentDate.getMonth() &&
            displayDate.getFullYear() === currentDate.getFullYear();
    };

    return (
        <div className="relative h-full flex flex-col bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5 transition-all duration-300 hover:border-white/10">

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            {/* Top Glint */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>

            {/* Header */}
            <div className="relative z-10 p-3 pb-1">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={prevMonth} className="group p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-zinc-400 hover:text-white">
                        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>

                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-1">Month</span>
                        <h2 className="text-lg font-bold text-white tracking-wide">
                            {months[displayDate.getMonth()]} <span className="text-zinc-500">{displayDate.getFullYear()}</span>
                        </h2>
                    </div>

                    <button onClick={nextMonth} className="group p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-zinc-400 hover:text-white">
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>

                {/* Daily Info Card */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 p-3 mb-2">
                    <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex justify-between items-end">
                        <div>
                            <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-indigo-300 mb-0.5">
                                <CalendarIcon size={9} /> Today
                            </span>
                            <div className="text-xl font-bold text-white tracking-tight">
                                {currentDate.getDate()} {months[currentDate.getMonth()].slice(0, 3)}
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-purple-300 mb-0.5 block">Day End In</span>
                            <div className="text-xs font-mono text-white/90 font-medium tracking-wider">
                                {timeLeft}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="relative z-10 flex-1 min-h-0 px-4 py-2">
                <div className="grid grid-cols-7 place-items-center">
                    {/* Weekday Headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                        <div key={`header-${i}`} className="h-8 flex items-center justify-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                            {day}
                        </div>
                    ))}

                    {/* Previous Month Empty Slots */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-8 w-8" />
                    ))}

                    {/* Current Month Days */}
                    {Array.from({ length: days }).map((_, i) => {
                        const day = i + 1;
                        const today = isToday(day);

                        return (
                            <div
                                key={day}
                                className={`
                                    relative h-8 w-8 flex items-center justify-center text-xs font-medium rounded-full transition-all duration-300 group cursor-pointer
                                    ${today
                                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110 z-10'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                                    }
                                `}
                            >
                                {today && (
                                    <div className="absolute inset-0 rounded-full animate-pulse opacity-30 bg-indigo-400 blur-sm"></div>
                                )}
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Stats Area */}
            <div className="relative z-10 p-3 pt-1">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors duration-300">
                    {/* Current */}
                    <div className="flex items-center gap-3 flex-1 pl-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/10">
                            <Flame size={18} className="text-orange-400" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">Current</div>
                            <div className="text-xl font-bold text-white tracking-tight">{streak.current} <span className="text-[10px] text-zinc-600 font-medium">Days</span></div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/10 to-transparent mx-2"></div>

                    {/* Best */}
                    <div className="flex items-center gap-3 flex-1 pl-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/10">
                            <Trophy size={18} className="text-yellow-400" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">Best</div>
                            <div className="text-xl font-bold text-white tracking-tight">{streak.best} <span className="text-[10px] text-zinc-600 font-medium">Days</span></div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-medium">
                    <Info size={12} />
                    <span>Consistency is key to mastery</span>
                </div>
            </div>
        </div>
    );
}
