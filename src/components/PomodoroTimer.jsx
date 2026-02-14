
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, X, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

const PomodoroTimer = () => {
    const [mode, setMode] = useState('pomodoro'); // pomodoro, short, long
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const containerRef = useRef(null);
    const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

    // Settings State
    const [settings, setSettings] = useState({
        pomodoro: 25,
        short: 5,
        long: 15,
        alarmEnabled: true,
        volume: 0.5
    });

    const modes = {
        pomodoro: {
            label: 'Focus',
            time: settings.pomodoro * 60,
            color: 'text-indigo-400',
            progressColor: 'stroke-indigo-500',
            glowColor: 'bg-indigo-500/20',
            btnColor: 'shadow-indigo-500/20',
            activeBtn: 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20'
        },
        short: {
            label: 'Short Break',
            time: settings.short * 60,
            color: 'text-teal-400',
            progressColor: 'stroke-teal-500',
            glowColor: 'bg-teal-500/20',
            btnColor: 'shadow-teal-500/20',
            activeBtn: 'bg-teal-500/10 text-teal-500 hover:bg-teal-500/20'
        },
        long: {
            label: 'Long Break',
            time: settings.long * 60,
            color: 'text-blue-400',
            progressColor: 'stroke-blue-500',
            glowColor: 'bg-blue-500/20',
            btnColor: 'shadow-blue-500/20',
            activeBtn: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
        },
    };

    // Update timeLeft when settings change if not active
    useEffect(() => {
        if (!isActive) {
            setTimeLeft(modes[mode].time);
        }
    }, [settings.pomodoro, settings.short, settings.long]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((timeLeft) => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (settings.alarmEnabled) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.log("Audio play failed", e));
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, settings.alarmEnabled]);

    // Handle Full Screen Logic
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullScreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
    }, []);

    const switchMode = (newMode) => {
        setMode(newMode);
        setTimeLeft(modes[newMode].time);
        setIsActive(false);
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(modes[mode].time);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress for circle
    const totalTime = modes[mode].time;
    const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div
            ref={containerRef}
            className={`relative h-full flex flex-col items-center justify-between p-6 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5 transition-all duration-500 ${isFullScreen ? 'rounded-none border-0' : ''}`}
        >

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

            {/* Header / Mode Switcher - Floating Dock Style */}
            <div className="z-10 w-full flex justify-center mb-8">
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full p-1 shadow-2xl ring-1 ring-white/5">
                    {Object.keys(modes).map((key) => (
                        <button
                            key={key}
                            onClick={() => switchMode(key)}
                            className={`relative px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ease-out ${mode === key
                                ? 'text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                }`}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {mode === key && (
                                    <span className={`w-1 h-1 rounded-full ${modes[key].color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor] animate-pulse-slow`}></span>
                                )}
                                {modes[key].label}
                            </span>

                            {/* Active Glint */}
                            {mode === key && (
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Circular Timer Display */}
            <div className={`relative z-10 flex items-center justify-center mb-8 group transition-all duration-500 ${isFullScreen ? 'scale-125' : ''}`}>
                {/* Outer Glow */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${modes[mode].glowColor.replace('bg-', 'from-')} to-purple-500/20 blur-3xl rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-700`}></div>

                <div className="relative w-80 h-80 flex items-center justify-center">
                    {/* SVG Progress Circle */}
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                        {/* Define Gradients */}
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="white" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="white" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>

                        {/* Tick Marks (Chronograph style) */}
                        {Array.from({ length: 60 }).map((_, i) => {
                            const angle = (i * 6) * (Math.PI / 180);
                            const x1 = 50 + 44 * Math.cos(angle);
                            const y1 = 50 + 44 * Math.sin(angle);
                            const x2 = 50 + 47 * Math.cos(angle);
                            const y2 = 50 + 47 * Math.sin(angle);
                            const isMajor = i % 5 === 0;
                            return (
                                <line
                                    key={i}
                                    x1={`${x1}%`} y1={`${y1}%`}
                                    x2={`${x2}%`} y2={`${y2}%`}
                                    className={`${isMajor ? 'stroke-white/30' : 'stroke-white/10'} transition-all duration-300`}
                                    strokeWidth={isMajor ? '2' : '1'}
                                />
                            );
                        })}

                        {/* Track */}
                        <circle
                            cx="50%"
                            cy="50%"
                            r={radius}
                            fill="none"
                            className="stroke-white/5"
                            strokeWidth="2"
                        />
                        {/* Progress */}
                        <circle
                            cx="50%"
                            cy="50%"
                            r={radius}
                            fill="none"
                            className={`${modes[mode].progressColor} transition-all duration-1000 ease-linear drop-shadow-[0_0_10px_currentColor]`}
                            strokeWidth="3"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Time Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className={`text-7xl font-bold text-white tracking-tighter font-mono tabular-nums mb-2 drop-shadow-lg ${isActive ? 'animate-pulse-slow' : ''}`}>
                            {formatTime(timeLeft)}
                        </div>
                        <p className={`text-xs tracking-[0.2em] uppercase ${modes[mode].color} font-semibold opacity-90`}>
                            {isActive ? 'Simulating High Focus' : 'Ready to Start'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="z-10 w-full flex items-center justify-center gap-8">
                <button
                    onClick={resetTimer}
                    className="group relative p-4 rounded-full bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-300 backdrop-blur-md"
                    title="Reset Timer"
                >
                    <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                    <RotateCcw size={20} className="relative z-10 group-hover:-rotate-180 transition-transform duration-500" />
                </button>

                <button
                    onClick={toggleTimer}
                    className={`group relative px-8 py-4 rounded-full min-w-[140px] flex items-center justify-center transition-all duration-500 transform hover:scale-105 active:scale-95 ${isActive
                        ? `shadow-[0_0_30px_-5px_${modes[mode].color.replace('text-', '#').replace('400', '500')}40]`
                        : 'shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.2)]'
                        }`}
                >
                    {/* Glass Container Background */}
                    <div className={`absolute inset-0 rounded-full backdrop-blur-3xl transition-all duration-500 ${isActive ? 'bg-black/40' : 'bg-white/5 group-hover:bg-white/10'}`}></div>

                    {/* 3D Glass Edge Border */}
                    {/* Top Highlight (Strong) */}
                    <div className="absolute inset-0 rounded-full border-t border-white/30 pointer-events-none"></div>
                    {/* Bottom Lowlight (Subtle) */}
                    <div className="absolute inset-0 rounded-full border-b border-white/5 pointer-events-none"></div>
                    {/* Side Rims (Faint) */}
                    <div className="absolute inset-0 rounded-full border-x border-white/10 pointer-events-none opacity-50"></div>

                    {/* Inner Top Reflection (Inset) */}
                    <div className="absolute inset-[1px] rounded-full shadow-[inset_0_2px_4px_0_rgba(255,255,255,0.15)] pointer-events-none"></div>

                    {/* Bottom Glow Reflection */}
                    <div className="absolute bottom-0 left-4 right-4 h-1/2 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-b-full pointer-events-none"></div>

                    {/* Active Glow Pulse */}
                    {isActive && (
                        <div className={`absolute inset-0 rounded-full opacity-30 blur-md animate-pulse-slow ${modes[mode].activeBtn.split(' ')[0].replace('bg-', 'bg-')}`}></div>
                    )}

                    {/* Content */}
                    <div className="relative z-10 flex items-center justify-center">
                        {isActive ? (
                            <span className={`text-sm font-medium tracking-[0.3em] uppercase ${modes[mode].color} drop-shadow-[0_0_8px_currentColor]`}>Pause</span>
                        ) : (
                            <span className="text-sm font-medium tracking-[0.3em] uppercase text-white group-hover:text-white/90 drop-shadow-md">Start</span>
                        )}
                    </div>
                </button>

                <button
                    onClick={() => setShowSettings(true)}
                    className="group relative p-4 rounded-full bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-300 backdrop-blur-md"
                    title="Settings"
                >
                    <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                    <Settings size={20} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
                </button>
            </div>

            {/* Full Screen Toggle (Bottom Left) */}
            <div className="absolute bottom-6 left-6 z-20">
                <button
                    onClick={toggleFullScreen}
                    className="group p-3 rounded-full bg-white/5 border border-white/5 text-zinc-500 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-300 backdrop-blur-md"
                    title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
                >
                    {isFullScreen ? (
                        <Minimize2 size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    ) : (
                        <Maximize2 size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    )}
                </button>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-0 pointer-events-none"></div>

            {/* Settings Modal - Ultra Premium Polish */}
            {showSettings && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>

                    <div className="w-full max-w-sm relative overflow-hidden rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 ring-1 ring-white/10">
                        {/* Background & Texture */}
                        <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-2xl"></div>
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                        {/* 3D Glass Borders */}
                        <div className="absolute inset-0 rounded-3xl border-t border-white/10 pointer-events-none"></div>
                        <div className="absolute inset-0 rounded-3xl border-b border-black/40 pointer-events-none"></div>

                        <div className="relative p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                <h3 className="text-sm font-medium text-white/90 flex items-center gap-2">
                                    <Settings size={16} className="text-indigo-400" />
                                    <span className="tracking-widest uppercase text-xs">Timer Settings</span>
                                </h3>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="p-1.5 rounded-full hover:bg-white/10 text-zinc-500 hover:text-white transition-all duration-200 group"
                                >
                                    <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Duration Settings */}
                                <div className="space-y-3">
                                    {[
                                        { key: 'pomodoro', label: 'Pro Focus', color: 'text-indigo-400', border: 'group-hover:border-indigo-500/30' },
                                        { key: 'short', label: 'Short Break', color: 'text-teal-400', border: 'group-hover:border-teal-500/30' },
                                        { key: 'long', label: 'Long Break', color: 'text-blue-400', border: 'group-hover:border-blue-500/30' }
                                    ].map(({ key, label, color, border }) => (
                                        <div key={key} className={`group flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] ${border} transition-all duration-300`}>
                                            <span className={`text-sm font-medium ${color} tracking-wide`}>{label}</span>

                                            {/* Custom Stepper */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setSettings(s => ({ ...s, [key]: Math.max(1, s[key] - 1) }))}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 active:scale-90 transition-all text-white/70 hover:text-white"
                                                >
                                                    -
                                                </button>

                                                <div className="w-8 text-center">
                                                    <span className="text-white font-mono font-bold">{settings[key]}</span>
                                                </div>

                                                <button
                                                    onClick={() => setSettings(s => ({ ...s, [key]: Math.min(90, s[key] + 1) }))}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 active:scale-90 transition-all text-white/70 hover:text-white"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Preferences */}
                                <div className="space-y-3 pt-2 border-t border-white/5">
                                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl transition-colors duration-300 ${settings.alarmEnabled ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_-5px_indigo]' : 'bg-black/20 text-zinc-600'}`}>
                                                {settings.alarmEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                                            </div>
                                            <span className="text-sm font-medium text-white/90">Sound Effects</span>
                                        </div>

                                        {/* Premium Switch */}
                                        <button
                                            onClick={() => setSettings({ ...settings, alarmEnabled: !settings.alarmEnabled })}
                                            className={`relative w-11 h-6 rounded-full transition-all duration-300 border ${settings.alarmEnabled
                                                ? 'bg-indigo-500/20 border-indigo-500/50'
                                                : 'bg-white/5 border-white/10'}`}
                                        >
                                            <div className={`absolute top-1 left-1 w-3.5 h-3.5 rounded-full shadow-md transition-all duration-300 transform ${settings.alarmEnabled
                                                ? 'translate-x-[20px] bg-indigo-400 shadow-[0_0_8px_indigo]'
                                                : 'translate-x-0 bg-zinc-500'
                                                }`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Done Action */}
                            <button
                                onClick={() => setShowSettings(false)}
                                className="w-full group relative py-3 rounded-xl overflow-hidden active:scale-[0.98] transition-transform"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                <span className="relative text-xs font-bold text-white tracking-[0.2em] uppercase">Save Changes</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PomodoroTimer;
