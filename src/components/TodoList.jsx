import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Calendar, Trash2, Check, Sparkles,
    Circle, AlertCircle, GripVertical, CheckCircle2
} from 'lucide-react';

export default function TodoList() {
    // Initial state
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem('todo_list_v4');
        return saved ? JSON.parse(saved) : [
            { id: 1, text: 'Review system design patterns', subject: 'System Design', priority: 'High', dueDate: '2026-02-14', completed: false },
            { id: 2, text: 'Solve Daily LeetCode Challenge', subject: 'DSA', priority: 'Medium', dueDate: '2026-02-13', completed: true },
        ];
    });

    const [newTaskText, setNewTaskText] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('Low');
    const [newTaskDate, setNewTaskDate] = useState(new Date().toISOString().split('T')[0]);
    const listRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('todo_list_v4', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (!newTaskText.trim()) return;
        const newTask = {
            id: Date.now(),
            text: newTaskText,
            subject: 'General',
            priority: newTaskPriority,
            dueDate: newTaskDate,
            createdAt: new Date().toISOString(),
            completed: false
        };
        setTasks([newTask, ...tasks]);
        setNewTaskText('');
    };

    const updateTask = (id, field, value) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const toggleComplete = (id) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    // Style helpers
    const getPriorityColor = (p) => {
        switch (p) {
            case 'High': return 'text-rose-400 decoration-rose-400/30';
            case 'Medium': return 'text-orange-400 decoration-orange-400/30';
            case 'Low': return 'text-emerald-400 decoration-emerald-400/30';
            default: return 'text-zinc-400';
        }
    };

    return (
        <div className="relative h-full flex flex-col group/container">
            {/* Main Glass Container */}
            <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-3xl border border-white/5 rounded-[32px] shadow-2xl overflow-hidden ring-1 ring-white/5">
                {/* Ambient Glows */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none animate-pulse-slow"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-rose-500/5 rounded-full blur-[80px] pointer-events-none animate-pulse-slow delay-700"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex flex-col h-full p-8">

                {/* Header */}
                <div className="relative flex items-center justify-between mb-8">
                    {/* Placeholder for balance */}
                    <div className="w-10"></div>

                    <div className="flex flex-col items-center">
                        <h2 className="text-2xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 uppercase drop-shadow-sm">
                            Tasks
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-[1px] w-4 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                            <span className="text-[10px] font-medium text-zinc-500 tracking-wider uppercase">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
                            </span>
                            <div className="h-[1px] w-4 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                        </div>
                    </div>

                    {/* Completion Ring */}
                    <div className="relative group/ring w-10 flex justify-end">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover/ring:opacity-100 transition-opacity"></div>
                        <svg className="w-10 h-10 -rotate-90 text-indigo-500">
                            <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-white/5" />
                            <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent"
                                strokeDasharray={2 * Math.PI * 16}
                                strokeDashoffset={2 * Math.PI * 16 - (tasks.length ? (tasks.filter(t => t.completed).length / tasks.length) : 0) * 2 * Math.PI * 16}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                            />
                        </svg>
                    </div>
                </div>

                {/* Input Area (Premium Single Row) */}
                <div className="relative mb-8 z-20 mx-2 md:mx-4 group/input">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-rose-500/20 rounded-2xl opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-500 blur-md"></div>
                    <div className="relative flex items-center bg-[#0F0F10] border border-white/10 rounded-2xl shadow-xl p-1.5 ring-1 ring-white/5 transition-all duration-300 hover:border-white/20">

                        {/* Priority Pill - Premium Glass */}
                        <div className="pl-1 pr-2 border-r border-white/5 flex-shrink-0">
                            <button
                                onClick={() => {
                                    const p = ['High', 'Medium', 'Low'];
                                    const next = p[(p.indexOf(newTaskPriority) + 1) % 3];
                                    setNewTaskPriority(next);
                                }}
                                className={`h-9 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 group ${newTaskPriority === 'High' ? 'text-rose-400' :
                                    newTaskPriority === 'Medium' ? 'text-orange-400' :
                                        'text-emerald-400'
                                    }`}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] transition-transform duration-300 group-hover:scale-125 ${newTaskPriority === 'High' ? 'bg-rose-500' :
                                    newTaskPriority === 'Medium' ? 'bg-orange-500' : 'bg-emerald-500'
                                    }`}></div>
                                <span className="text-zinc-400 group-hover:text-white transition-colors">{newTaskPriority}</span>
                            </button>
                        </div>

                        {/* Input Field */}
                        <input
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTask()}
                            placeholder="Add a new task..."
                            className="flex-1 bg-transparent border-none py-2 px-4 text-sm text-white placeholder-zinc-500 focus:ring-0 focus:outline-none h-10 font-medium tracking-wide min-w-[100px]"
                        />

                        {/* Actions Right */}
                        <div className="flex items-center gap-2 flex-shrink-0 pr-1">
                            <div className="relative group/date hidden sm:block">
                                <input
                                    type="date"
                                    value={newTaskDate}
                                    onChange={(e) => setNewTaskDate(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                />
                                <div className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/5">
                                    <Calendar size={18} />
                                </div>
                            </div>

                            {/* Premium Add Button - Ultimate Glass */}
                            <button
                                onClick={addTask}
                                className="relative h-9 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest transition-all duration-300 backdrop-blur-md border border-white/10 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_-4px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group overflow-hidden"
                            >
                                <span className="relative z-10 drop-shadow-sm bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent group-hover:to-white transition-all">ADD</span>
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-white/40 transition-all"></div>
                                <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-transparent via-white/5 to-transparent"></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Scrollable List - 2 Column Grid */}
                <div
                    ref={listRef}
                    className="flex-1 overflow-y-auto px-2 pb-6 pt-2 mask-image-gradient-b custom-scrollbar"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tasks.sort((a, b) => {
                            if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
                            const priorityOrder = { High: 3, Medium: 2, Low: 1 };
                            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
                        }).map((task, idx) => (
                            <div
                                key={task.id}
                                className={`group flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${task.completed
                                    ? 'opacity-50 grayscale'
                                    : ''
                                    }`}
                            >
                                <button
                                    onClick={() => toggleComplete(task.id)}
                                    className={`mt-1.5 flex-shrink-0 relative w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${task.completed
                                        ? 'bg-zinc-500 border-zinc-500 text-black'
                                        : 'bg-transparent border-zinc-600 hover:border-white/50 text-transparent'
                                        }`}
                                >
                                    <Check size={12} strokeWidth={3} className={`transition-transform ${task.completed ? 'scale-100' : 'scale-0'}`} />
                                </button>

                                <div className="flex-1 min-w-0">
                                    <input
                                        type="text"
                                        value={task.text}
                                        onChange={(e) => updateTask(task.id, 'text', e.target.value)}
                                        className={`w-full bg-transparent border-none p-0 text-sm font-medium focus:ring-0 transition-colors ${task.completed
                                            ? 'text-zinc-500 line-through decoration-zinc-800'
                                            : 'text-zinc-200 group-hover:text-white'
                                            }`}
                                    />
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <div className={`flex items-center gap-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white/5 ${getPriorityColor(task.priority)}`}>
                                            <Circle size={6} fill="currentColor" />
                                            {task.priority}
                                        </div>
                                        {task.createdAt && (
                                            <span className="text-zinc-500 text-[10px] font-mono ml-2 border-l border-white/10 pl-2 flex items-center gap-1">
                                                {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                        <span className="text-zinc-500 text-[10px] font-mono ml-auto">
                                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 transition-all p-1"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {tasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2 opacity-50 py-12">
                            <Sparkles size={24} />
                            <p className="text-sm">No active tasks</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
