import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Settings, X, CheckCircle, AlertCircle, Loader2, Video, Volume2 } from 'lucide-react';

export default function SetupInterviewModal({ isOpen, onClose, onStart, config }) {
  const [permissions, setPermissions] = useState({ camera: false, mic: false });
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      checkPermissions();
    } else {
      stopStream();
    }
    return () => stopStream();
  }, [isOpen]);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const checkPermissions = async () => {
    setChecking(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermissions({ camera: true, mic: true });
    } catch (err) {
      console.error("Permission error:", err);
      setError("Please allow camera and microphone access to continue.");
      setPermissions({ camera: false, mic: false });
    } finally {
      setChecking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0a0a0c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/2">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary border border-accent-primary/20">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">System Check</h2>
              <p className="text-sm text-text-secondary">Configure your environment before starting</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-text-muted hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Video Preview */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-inner group">
              {permissions.camera ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover transform scale-x-[-1]" 
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted bg-white/5">
                  <Camera size={48} className="mb-3 opacity-30" />
                  <span className="text-sm font-medium">Camera preview unavailable</span>
                </div>
              )}
              
              {/* Status Overlay */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 text-xs font-medium text-white backdrop-blur-md border border-white/10 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${permissions.camera ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                {permissions.camera ? 'Live Stream' : 'Camera Off'}
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <button 
                onClick={checkPermissions}
                className="text-xs text-accent-primary hover:text-accent-violet hover:underline flex items-center gap-1.5 transition-colors font-medium"
              >
                <Settings size={12} /> Check permissions again
              </button>
            </div>
          </div>

          {/* Checklist & Config */}
          <div className="space-y-6 flex flex-col justify-center">
            <div className="space-y-3">
              <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${permissions.camera ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${permissions.camera ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    <Video size={18} />
                  </div>
                  <span className="text-sm font-medium text-white">Camera Access</span>
                </div>
                {checking ? <Loader2 size={18} className="animate-spin text-accent-primary" /> : (
                  permissions.camera ? <CheckCircle size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-rose-400" />
                )}
              </div>

              <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${permissions.mic ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${permissions.mic ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    <Volume2 size={18} />
                  </div>
                  <span className="text-sm font-medium text-white">Microphone Details</span>
                </div>
                {checking ? <Loader2 size={18} className="animate-spin text-accent-primary" /> : (
                  permissions.mic ? <CheckCircle size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-rose-400" />
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <h4 className="text-xs font-bold text-text-muted mb-4 uppercase tracking-wider">Session Configuration</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-xs text-text-secondary block mb-1">Interview Type</span>
                  <span className="text-sm font-bold text-white capitalize">{config?.type || 'Technical'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-xs text-text-secondary block mb-1">Difficulty</span>
                  <span className="text-sm font-bold text-white capitalize">{config?.difficulty || 'Medium'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-white/2 flex justify-end gap-3 rounded-b-3xl">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            Cancel
          </button>
          <button 
            onClick={onStart}
            disabled={!permissions.camera || !permissions.mic}
            className="px-8 py-3 rounded-xl font-bold text-white bg-accent-primary hover:bg-accent-violet disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-95 flex items-center gap-2"
          >
            Start Session <CheckCircle size={16} />
          </button>
        </div>

        {error && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-lg shadow-lg animate-in slide-in-from-bottom-2 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </div>
    </div>
  );
}
