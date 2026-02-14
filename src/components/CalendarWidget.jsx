import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame, Trophy, Info, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarWidget() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [displayDate, setDisplayDate] = useState(new Date());
    const [timeLeft, setTimeLeft] = useState('');

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

        const timer = setInterval(updateTimer, 1000);
        updateTimer(); // Initial call

        return () => clearInterval(timer);
    }, []);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(displayDate);
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
            <div className="relative z-10 flex-1 min-h-0 px-4">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="text-[10px] font-bold text-zinc-600 uppercase">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1 gap-y-1 text-center">
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {Array.from({ length: days }).map((_, i) => {
                        const day = i + 1;
                        const today = isToday(day);

                        return (
                            <div
                                key={day}
                                className={`
                                    relative h-7 w-7 mx-auto flex items-center justify-center text-xs font-medium rounded-full transition-all duration-300
                                    ${today
                                        ? 'bg-indigo-500 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.6)] scale-110 z-10'
                                        : 'text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer'
                                    }
                                `}
                            >
                                {today && (
                                    <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-indigo-500"></div>
                                )}
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Stats Area */}
            <div className="relative z-10 p-3 pt-1">
                <div className="grid grid-cols-2 gap-3">
                    <div className="group bg-white/5 border border-white/5 rounded-xl p-2 hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                            <Flame size={14} className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Current</span>
                        </div>
                        <div className="text-lg font-bold text-white group-hover:scale-105 transition-transform origin-left">
                            0 <span className="text-[10px] font-normal text-zinc-500 ml-1">Days</span>
                        </div>
                    </div>

                    <div className="group bg-white/5 border border-white/5 rounded-xl p-2 hover:bg-white/10 transition-all cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy size={14} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Best</span>
                        </div>
                        <div className="text-lg font-bold text-white group-hover:scale-105 transition-transform origin-left">
                            0 <span className="text-[10px] font-normal text-zinc-500 ml-1">Days</span>
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
