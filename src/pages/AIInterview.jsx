import React, { useState, useEffect, useRef } from 'react';
import {
    Mic, MicOff, Video, VideoOff, Phone, Settings,
    MessageSquare, ChevronLeft, Volume2, Info, Lightbulb,
    MoreHorizontal, Minimize2, User, Clock, CheckCircle,
    Layout, Server, Database, Brain, Globe, Cpu, StopCircle,
    PlayCircle, RefreshCw, Award, BarChart
} from 'lucide-react';
import SetupInterviewModal from '../components/SetupInterviewModal';
import { useAuth } from '../context/AuthContext';
import { MOCK_INTERVIEW_QUESTIONS } from '../data/mockInterviewQuestions';
import { useNavigate } from 'react-router-dom';

// Utility for Text-to-Speech
const speakText = (text, onEnd) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
};

// Utility for Speech-to-Text (Browser support check)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function AIInterview() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Phases: 'SELECTION' | 'SETUP' | 'INTERVIEW' | 'REPORT'
    const [phase, setPhase] = useState('SELECTION');

    // Selection State
    const [selectedRole, setSelectedRole] = useState(null);

    // Interview State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState([]); // Array of { role: 'ai'|'user', text: '' }
    const [timeLeft, setTimeLeft] = useState(0);
    const [mediaState, setMediaState] = useState({ mic: true, video: true });

    // Report State
    const [sessionDuration, setSessionDuration] = useState(0);

    // Refs
    const recognitionRef = useRef(null);
    const videoRef = useRef(null);
    const timerRef = useRef(null);

    // --- 1. SELECTION PHASE HELPERS ---
    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setPhase('SETUP');
    };

    // --- 2. SETUP PHASE HELPERS ---
    const handleStartInterview = () => {
        setPhase('INTERVIEW');
        setCurrentQuestionIndex(0);
        setTranscript([]);
        setTimeLeft(30 * 60); // 30 mins default
    };

    // --- 3. INTERVIEW MAIN LOGIC ---

    // Initialize Interview
    useEffect(() => {
        if (phase === 'INTERVIEW' && selectedRole) {
            // Start Timer
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 0) {
                        endInterview();
                        return 0;
                    }
                    return prev - 1;
                });
                setSessionDuration(prev => prev + 1);
            }, 1000);

            // Initialize Speech Recognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onresult = (event) => {
                    let interimTranscript = '';
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }

                    if (finalTranscript) {
                        setTranscript(prev => [...prev, { role: 'user', text: finalTranscript, timestamp: new Date() }]);
                    }
                };

                recognition.onend = () => {
                    // Restart listener if we are still supposed to be listening
                    if (isListening && phase === 'INTERVIEW') {
                        try { recognition.start(); } catch (e) { console.log("Recognition restart error", e); }
                    }
                };

                recognitionRef.current = recognition;
            }

            // Ask first question
            // Small delay to allow UI to settle
            setTimeout(() => askQuestion(0), 1000);

            // Start Camera
            startCamera();

            return () => {
                clearInterval(timerRef.current);
                if (recognitionRef.current) recognitionRef.current.stop();
                stopCamera();
                window.speechSynthesis.cancel();
            };
        }
    }, [phase]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
            console.error("Camera error", err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const askQuestion = (index) => {
        if (!selectedRole || !selectedRole.questions[index]) return;

        const question = selectedRole.questions[index];

        // Add AI question to transcript
        setTranscript(prev => [...prev, { role: 'ai', text: question.text, timestamp: new Date() }]);

        // Speak
        setIsAiSpeaking(true);
        setIsListening(false);
        if (recognitionRef.current) recognitionRef.current.stop();

        speakText(question.text, () => {
            setIsAiSpeaking(false);
            // Start listening after question
            if (mediaState.mic && SpeechRecognition) {
                setIsListening(true);
                try { recognitionRef.current.start(); } catch (e) { }
            }
        });
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < (selectedRole?.questions?.length || 0) - 1) {
            const nextIdx = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIdx);
            askQuestion(nextIdx);
        } else {
            endInterview();
        }
    };

    const endInterview = () => {
        setPhase('REPORT');
        stopCamera();
        window.speechSynthesis.cancel();
        if (recognitionRef.current) recognitionRef.current.stop();
        clearInterval(timerRef.current);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // --- RENDERERS ---

    if (phase === 'SELECTION') {
        return (
            <div className="min-h-screen bg-[#050505] p-8 text-white flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />

                <div className="max-w-6xl w-full z-10">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
                            <Brain size={14} /> AI-Powered Simulation
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight">
                            Interview Mastery
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                            Select your target role to begin a realistic, adaptative mock interview session powered by advanced AI.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {MOCK_INTERVIEW_QUESTIONS.roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => handleRoleSelect(role)}
                                className="group relative p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 text-left flex flex-col gap-6 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                                    {role.icon === 'Layout' && <Layout className="text-gray-400 group-hover:text-blue-400" />}
                                    {role.icon === 'Server' && <Server className="text-gray-400 group-hover:text-blue-400" />}
                                    {role.icon === 'Briefcase' && <Brain className="text-gray-400 group-hover:text-blue-400" />}
                                    {role.icon === 'BarChart' && <BarChart className="text-gray-400 group-hover:text-blue-400" />}
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-100 group-hover:text-white mb-2 transition-colors">
                                        {role.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors line-clamp-2">
                                        {role.description}
                                    </p>
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                                        <Clock size={12} /> 30 Mins
                                    </span>
                                    <span className="text-xs font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                        Start Journey &rarr;
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <SetupInterviewModal
                    isOpen={phase === 'SETUP'}
                    onClose={() => setPhase('SELECTION')}
                    onStart={handleStartInterview}
                    config={{ type: selectedRole?.title, difficulty: 'Adaptive' }}
                />
            </div>
        );
    }

    if (phase === 'REPORT') {
        return (
            <div className="min-h-screen bg-[#050505] p-8 text-white flex justify-center items-center">
                <div className="max-w-3xl w-full bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/10 text-emerald-400 mb-4">
                            <Award size={32} />
                        </div>
                        <h2 className="text-3xl font-bold">Session Complete!</h2>
                        <p className="text-gray-400">Great job completing your mock interview for {selectedRole?.title}.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <span className="text-sm text-gray-500 block mb-1">Duration</span>
                            <span className="text-xl font-mono text-white">{formatTime(sessionDuration)}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <span className="text-sm text-gray-500 block mb-1">Questions Answered</span>
                            <span className="text-xl font-mono text-white">{transcript.filter(t => t.role === 'ai').length}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-bold border-b border-white/10 pb-2">Session Transcript</h3>
                        <div className="h-64 overflow-y-auto space-y-4 pr-2 custom-scrollbar p-2">
                            {transcript.map((t, i) => (
                                <div key={i} className={`flex gap-3 ${t.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.role === 'ai' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                        {t.role === 'ai' ? <Brain size={14} /> : <User size={14} />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${t.role === 'ai' ? 'bg-white/5 text-gray-300' : 'bg-emerald-500/10 text-white'}`}>
                                        {t.text}
                                    </div>
                                </div>
                            ))}
                            {transcript.length === 0 && <p className="text-gray-500 text-center italic">No transcript available.</p>}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setPhase('SELECTION')} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors">
                            Back to Home
                        </button>
                        <button onClick={() => setPhase('SELECTION')} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors">
                            Start New Session
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- INTERVIEW UI ---
    const currentQ = selectedRole?.questions[currentQuestionIndex];

    return (
        <div className="h-[calc(100vh-var(--navbar-height))] bg-[#080808] text-white overflow-hidden flex flex-col font-sans">
            {/* Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#080808]">
                <div className="flex items-center gap-4">
                    <button onClick={endInterview} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h2 className="font-bold text-white leading-tight">{selectedRole?.title} Mock Interview</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Live Session
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <Clock size={16} className="text-blue-400" />
                    <span className="font-mono text-lg font-medium">{formatTime(timeLeft)}</span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-12 overflow-hidden">

                {/* LEFT: Context & Question */}
                <div className="col-span-12 lg:col-span-3 border-r border-white/10 bg-[#0A0A0A] flex flex-col">
                    <div className="p-6 border-b border-white/10">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 block">Question {currentQuestionIndex + 1} of {selectedRole?.questions?.length}</span>
                        <h3 className="text-xl font-bold leading-relaxed mb-4">{currentQ?.text}</h3>
                        <div className="flex flex-wrap gap-2">
                            {currentQ?.topics?.map(topic => (
                                <span key={topic} className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/5 text-gray-400">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 mb-6">
                            <h4 className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
                                <Lightbulb size={14} /> AI Hint
                            </h4>
                            <ul className="space-y-2">
                                {currentQ?.hints?.map((hint, i) => (
                                    <li key={i} className="text-sm text-gray-400 leading-relaxed flex gap-2">
                                        <span className="block w-1 h-1 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                                        {hint}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live Transcript</h4>
                            <div className="space-y-3">
                                {transcript.slice(-3).map((t, i) => (
                                    <div key={i} className={`text-sm p-3 rounded-lg ${t.role === 'ai' ? 'bg-white/5 text-gray-400' : 'bg-emerald-500/10 text-emerald-100 border border-emerald-500/20'}`}>
                                        <span className="text-[10px] uppercase font-bold opacity-50 block mb-1">{t.role === 'ai' ? 'Interviewer' : 'You'}</span>
                                        {t.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CENTER: Main Stage */}
                <div className="col-span-12 lg:col-span-6 bg-black relative flex flex-col items-center justify-center p-8">
                    {/* AI Visualizer */}
                    <div className="relative w-48 h-48 mb-8">
                        <div className={`absolute inset-0 rounded-full border-2 ${isAiSpeaking ? 'border-blue-500 animate-ping opacity-20' : 'border-white/10'}`}></div>
                        <div className={`absolute inset-0 rounded-full border-2 ${isListening ? 'border-emerald-500 animate-ping opacity-20' : 'border-transparent'}`}></div>
                        <div className="absolute inset-2 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shadow-2xl">
                            <BotAvatar speaking={isAiSpeaking} />
                        </div>
                        {isAiSpeaking && <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-blue-400 text-sm font-medium animate-pulse">Speaking...</div>}
                        {isListening && <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-emerald-400 text-sm font-medium animate-pulse">Listening...</div>}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-6 mt-8">
                        <button
                            onClick={() => setMediaState(p => ({ ...p, mic: !p.mic }))}
                            className={`p-4 rounded-full transition-all duration-300 ${mediaState.mic ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                        >
                            {mediaState.mic ? <Mic size={24} /> : <MicOff size={24} />}
                        </button>

                        <button
                            onClick={nextQuestion}
                            className="px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2"
                        >
                            Next Question <ChevronLeft size={18} className="rotate-180" />
                        </button>

                        <button
                            onClick={() => setMediaState(p => ({ ...p, video: !p.video }))}
                            className={`p-4 rounded-full transition-all duration-300 ${mediaState.video ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                        >
                            {mediaState.video ? <Video size={24} /> : <VideoOff size={24} />}
                        </button>
                    </div>
                </div>

                {/* RIGHT: User Camera */}
                <div className="col-span-12 lg:col-span-3 bg-[#0C0C0C] border-l border-white/10 p-6 flex flex-col">
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl ring-1 ring-white/5">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover transform scale-x-[-1] ${!mediaState.video && 'opacity-0'}`}
                        />
                        {!mediaState.video && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                                <VideoOff size={32} />
                            </div>
                        )}
                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 backdrop-blur text-[10px] font-bold text-white rounded border border-white/10 uppercase tracking-wider">
                            You
                        </div>
                        <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${mediaState.mic ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Simple Avatar Component for visualization
function BotAvatar({ speaking }) {
    return (
        <div className="w-full h-full flex items-center justify-center bg-[#111]">
            <div className="relative">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center transform transition-all duration-300 ${speaking ? 'scale-110' : 'scale-100'}`}>
                    <Brain size={32} className="text-white" />
                </div>
                {/* Audio Waves */}
                {speaking && (
                    <>
                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500/50 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="absolute -right-7 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500/50 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="absolute -left-7 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </>
                )}
            </div>
        </div>
    );
}
