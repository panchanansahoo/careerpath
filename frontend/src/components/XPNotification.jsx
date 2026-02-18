import React, { useEffect, useState } from 'react';
import { X, Zap, Trophy, ArrowUp } from 'lucide-react';
import { BADGES, BADGE_TIERS } from '../data/gamificationData';

export default function XPNotification({ notification, onDismiss }) {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        if (notification) {
            setVisible(true);
            setExiting(false);
            const timer = setTimeout(() => {
                setExiting(true);
                setTimeout(() => { setVisible(false); onDismiss?.(); }, 400);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [notification, onDismiss]);

    if (!visible || !notification) return null;

    const isBadge = notification.type === 'badge';
    const isLevelUp = notification.type === 'levelup';

    return (
        <div style={{
            position: 'fixed', top: 24, right: 24, zIndex: 9999,
            animation: exiting ? 'xpSlideOut 0.4s ease-in forwards' : 'xpSlideIn 0.4s ease-out forwards',
        }}>
            <div style={{
                background: isBadge
                    ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(139,92,246,0.15))'
                    : isLevelUp
                        ? 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.15))'
                        : 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.1))',
                backdropFilter: 'blur(20px)',
                border: isBadge ? '1px solid rgba(255,215,0,0.3)' : isLevelUp ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(16,185,129,0.3)',
                borderRadius: 16, padding: '16px 20px', minWidth: 280, maxWidth: 380,
                boxShadow: isBadge
                    ? '0 8px 32px rgba(255,215,0,0.2)'
                    : isLevelUp
                        ? '0 8px 32px rgba(139,92,246,0.2)'
                        : '0 8px 32px rgba(16,185,129,0.15)',
                display: 'flex', alignItems: 'center', gap: 14,
            }}>
                {/* Icon */}
                <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: isBadge
                        ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                        : isLevelUp
                            ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
                            : 'linear-gradient(135deg, #10b981, #3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    animation: 'xpPulse 1s ease-in-out infinite',
                }}>
                    {isBadge ? <Trophy size={22} color="#fff" /> : isLevelUp ? <ArrowUp size={22} color="#fff" /> : <Zap size={22} color="#fff" />}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isBadge ? '#fbbf24' : isLevelUp ? '#c084fc' : '#6ee7b7', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 2 }}>
                        {isBadge ? '🏆 Badge Unlocked!' : isLevelUp ? '🎉 Level Up!' : '⚡ XP Earned'}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                        {isBadge && notification.badge ? notification.badge.name : isLevelUp ? `${notification.level?.icon} ${notification.level?.name}` : notification.action}
                    </div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
                        +{notification.xp} XP
                    </div>
                </div>

                {/* Dismiss */}
                <button onClick={() => { setExiting(true); setTimeout(() => { setVisible(false); onDismiss?.(); }, 400); }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                    <X size={16} />
                </button>
            </div>

            <style>{`
        @keyframes xpSlideIn {
          from { opacity: 0; transform: translateX(100px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes xpSlideOut {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to { opacity: 0; transform: translateX(100px) scale(0.9); }
        }
        @keyframes xpPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
        </div>
    );
}
