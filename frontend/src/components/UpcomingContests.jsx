import React, { useState, useEffect, useCallback } from 'react';

const PLATFORM_META = {
    LeetCode: { color: '#f59e0b', icon: '🏆', link: 'https://leetcode.com/contest/' },
    Codeforces: { color: '#ef4444', icon: '⚔️', link: 'https://codeforces.com/contests' },
    CodeChef: { color: '#22c55e', icon: '🍳', link: 'https://www.codechef.com/contests' },
    AtCoder: { color: '#38bdf8', icon: '🎌', link: 'https://atcoder.jp/contests/' },
    GeeksforGeeks: { color: '#10b981', icon: '📗', link: 'https://practice.geeksforgeeks.org/events' },
};

const CACHE_KEY = 'upcoming_contests_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getCachedContests() {
    try {
        const cache = JSON.parse(localStorage.getItem(CACHE_KEY));
        if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
            return cache.contests.map(c => ({ ...c, date: new Date(c.date) }));
        }
    } catch { /* ignore */ }
    return null;
}

function setCachedContests(contests) {
    try {
        const serialized = contests.map(c => ({ ...c, date: c.date instanceof Date ? c.date.toISOString() : c.date }));
        localStorage.setItem(CACHE_KEY, JSON.stringify({ contests: serialized, timestamp: Date.now() }));
    } catch { /* ignore */ }
}

// ── Codeforces API (live data, CORS-friendly) ──
async function fetchCodeforcesContests() {
    try {
        const res = await fetch('https://codeforces.com/api/contest.list', { signal: AbortSignal.timeout(8000) });
        const data = await res.json();
        if (data.status !== 'OK') return [];
        return data.result
            .filter(c => c.phase === 'BEFORE')
            .slice(0, 3)
            .map(c => ({
                platform: 'Codeforces',
                name: c.name,
                date: new Date(c.startTimeSeconds * 1000),
                duration: `${Math.round(c.durationSeconds / 3600)} hrs`,
                link: `https://codeforces.com/contest/${c.id}`,
                live: true,
            }));
    } catch { return []; }
}

// ── Schedule-based contests for platforms with known recurring patterns ──
// These platforms run contests on fixed weekly schedules. We compute the
// next upcoming dates dynamically so they always stay current.

function getNextDayOfWeek(dayOfWeek, hour = 0, minute = 0) {
    // dayOfWeek: 0=Sun, 1=Mon, ..., 6=Sat
    // hour/minute in IST (UTC+5:30)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(now.getTime() + istOffset);

    const result = new Date(nowIST);
    result.setUTCHours(hour - 5, minute - 30, 0, 0); // Convert IST to UTC

    const diff = (dayOfWeek - nowIST.getUTCDay() + 7) % 7;
    result.setUTCDate(result.getUTCDate() + (diff === 0 && result <= now ? 7 : diff));

    return result;
}

function getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now - start) / 86400000 + start.getDay() + 1) / 7);
}

function generateScheduledContests() {
    const weekNum = getWeekNumber();
    const contests = [];

    // ── LeetCode ──
    // Weekly Contest: Every Sunday 8:00 AM IST
    const lcWeeklyNum = 438 + (weekNum - 9); // approximate numbering
    contests.push({
        platform: 'LeetCode',
        name: `Weekly Contest ${lcWeeklyNum}`,
        date: getNextDayOfWeek(0, 8, 0), // Sunday 8 AM IST
        duration: '1.5 hrs',
        link: 'https://leetcode.com/contest/',
        live: false,
    });
    // Biweekly Contest: Every other Saturday 8:00 PM IST
    if (weekNum % 2 === 0) {
        const lcBiweeklyNum = 149 + Math.floor((weekNum - 8) / 2);
        contests.push({
            platform: 'LeetCode',
            name: `Biweekly Contest ${lcBiweeklyNum}`,
            date: getNextDayOfWeek(6, 20, 0), // Saturday 8 PM IST
            duration: '1.5 hrs',
            link: 'https://leetcode.com/contest/',
            live: false,
        });
    }

    // ── CodeChef ──
    // Starters: Every Wednesday 8:00 PM IST
    const ccStartersNum = 175 + (weekNum - 9);
    contests.push({
        platform: 'CodeChef',
        name: `Starters ${ccStartersNum}`,
        date: getNextDayOfWeek(3, 20, 0), // Wednesday 8 PM IST
        duration: '2 hrs',
        link: 'https://www.codechef.com/contests',
        live: false,
    });

    // ── AtCoder ──
    // ABC: Every Saturday 5:30 PM IST
    const atcoderNum = 392 + (weekNum - 9);
    contests.push({
        platform: 'AtCoder',
        name: `ABC ${atcoderNum}`,
        date: getNextDayOfWeek(6, 17, 30), // Saturday 5:30 PM IST
        duration: '1.5 hrs',
        link: 'https://atcoder.jp/contests/',
        live: false,
    });

    // ── GeeksforGeeks ──
    // Weekly Coding Contest: Every Sunday 7:00 PM IST
    contests.push({
        platform: 'GeeksforGeeks',
        name: `GFG Weekly Contest ${188 + (weekNum - 9)}`,
        date: getNextDayOfWeek(0, 19, 0), // Sunday 7 PM IST
        duration: '1.5 hrs',
        link: 'https://practice.geeksforgeeks.org/events',
        live: false,
    });

    return contests.filter(c => c.date > new Date());
}

// ── Formatting helpers ──

function formatDate(date) {
    try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d)) return '—';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
    } catch { return '—'; }
}

function formatTime(date) {
    try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d)) return '';
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
    } catch { return ''; }
}

function getDaysUntil(date) {
    try {
        const d = date instanceof Date ? date : new Date(date);
        if (isNaN(d)) return '—';
        const now = new Date();
        const diffMs = d - now;
        if (diffMs < 0) return 'Ongoing';
        const diffH = Math.floor(diffMs / 3600000);
        if (diffH < 1) return 'Starting soon';
        if (diffH < 24) return `${diffH}h left`;
        const diffD = Math.ceil(diffMs / 86400000);
        if (diffD === 1) return 'Tomorrow';
        return `${diffD} days`;
    } catch { return '—'; }
}

function getLastRefreshLabel(timestamp) {
    if (!timestamp) return '';
    const ago = Math.floor((Date.now() - timestamp) / 60000);
    if (ago < 1) return 'Just now';
    if (ago < 60) return `${ago}m ago`;
    const hours = Math.floor(ago / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

// ── Main component ──

export default function UpcomingContests() {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(null);

    const fetchAll = useCallback(async (force = false) => {
        if (!force) {
            const cached = getCachedContests();
            if (cached) {
                setContests(cached);
                setLoading(false);
                try {
                    const c = JSON.parse(localStorage.getItem(CACHE_KEY));
                    setLastRefresh(c?.timestamp);
                } catch { /* ignore */ }
                return;
            }
        }

        setLoading(true);
        try {
            // Fetch live Codeforces data
            const cfContests = await fetchCodeforcesContests();

            // Generate schedule-based contests for other platforms
            const scheduledContests = generateScheduledContests();

            // Merge: live Codeforces + scheduled others
            const all = [...cfContests, ...scheduledContests];

            // Sort by date, take closest 8
            const sorted = all
                .filter(c => c.date > new Date())
                .sort((a, b) => a.date - b.date)
                .slice(0, 8);

            setContests(sorted);
            setCachedContests(sorted);
            setLastRefresh(Date.now());
        } catch { /* silent */ }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        fetchAll();
        // Auto-refresh every 24 hours
        const interval = setInterval(() => {
            const cache = getCachedContests();
            if (!cache) fetchAll(true);
        }, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchAll]);

    const handleRefresh = () => {
        localStorage.removeItem(CACHE_KEY);
        fetchAll(true);
    };

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
                        🏅 Upcoming Contests
                        <span style={{
                            fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 6,
                            background: 'rgba(34,197,94,0.15)', color: '#22c55e', letterSpacing: 0.5,
                        }}>LIVE</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                        Auto-updates daily · {lastRefresh ? `Refreshed ${getLastRefreshLabel(lastRefresh)}` : 'Loading...'}
                    </div>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    title="Refresh contests"
                    style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 8, padding: '6px 10px', cursor: loading ? 'not-allowed' : 'pointer',
                        color: 'rgba(255,255,255,0.5)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; } }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >
                    <span style={{ display: 'inline-block', animation: loading ? 'spin 1s linear infinite' : 'none' }}>🔄</span>
                    {loading ? 'Updating…' : 'Refresh'}
                </button>
            </div>

            {/* Loading skeleton */}
            {loading && contests.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                            height: 56, borderRadius: 12, background: 'rgba(255,255,255,0.03)',
                            animation: 'pulse 1.5s ease-in-out infinite',
                        }} />
                    ))}
                </div>
            )}

            {/* Contest List — shows 5, rest scrollable */}
            {contests.length > 0 && (
                <div className="contests-scroll" style={{
                    display: 'flex', flexDirection: 'column', gap: 10,
                    maxHeight: 5 * 66 + 4 * 10, // 5 items × ~66px height + 4 gaps × 10px
                    overflowY: 'auto',
                    paddingRight: contests.length > 5 ? 4 : 0,
                }}>
                    {contests.map((contest, i) => {
                        const meta = PLATFORM_META[contest.platform] || { color: '#94a3b8', icon: '📌', link: '#' };
                        return (
                            <a key={i} href={contest.link} target="_blank" rel="noreferrer" style={{
                                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
                                borderRadius: 12, background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none',
                                transition: 'all 0.2s', cursor: 'pointer', flexShrink: 0,
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
                            >
                                {/* Platform Icon */}
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', fontSize: 20,
                                    background: `${meta.color}15`, flexShrink: 0,
                                }}>{meta.icon}</div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2,
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        display: 'flex', alignItems: 'center', gap: 6,
                                    }}>
                                        {contest.name}
                                        {contest.live && (
                                            <span style={{
                                                fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 4,
                                                background: 'rgba(239,68,68,0.15)', color: '#ef4444', letterSpacing: 0.3,
                                            }}>API</span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                                        {contest.platform} · {contest.duration} · {formatTime(contest.date)}
                                    </div>
                                </div>

                                {/* Countdown */}
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: meta.color }}>{getDaysUntil(contest.date)}</div>
                                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{formatDate(contest.date)}</div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            )}

            {/* Animations */}
            <style>{`
                @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.15; } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .contests-scroll::-webkit-scrollbar { width: 4px; }
                .contests-scroll::-webkit-scrollbar-track { background: transparent; }
                .contests-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
                .contests-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
}
