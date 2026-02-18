import React, { useMemo } from 'react';

export default function StreakHeatmap({ activityHistory = {}, currentStreak = 0, bestStreak = 0 }) {
  const { weeks, months } = useMemo(() => {
    const today = new Date();
    const endDate = new Date(today);
    // Start from ~52 weeks ago (Sunday)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    while (startDate.getDay() !== 0) startDate.setDate(startDate.getDate() - 1);

    const weeks = [];
    let currentWeek = [];
    const d = new Date(startDate);
    const monthLabels = [];
    let lastMonth = -1;

    while (d <= endDate) {
      const key = d.toISOString().split('T')[0];
      const monthNum = d.getMonth();
      if (monthNum !== lastMonth && d.getDay() === 0) {
        monthLabels.push({ month: d.toLocaleDateString('en-US', { month: 'short' }), weekIndex: weeks.length });
        lastMonth = monthNum;
      }
      currentWeek.push({
        date: key,
        count: activityHistory[key]?.solved || 0,
        xp: activityHistory[key]?.xp || 0,
        isToday: key === today.toISOString().split('T')[0],
        isFuture: d > today,
      });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      d.setDate(d.getDate() + 1);
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);
    return { weeks, months: monthLabels };
  }, [activityHistory]);

  const getColor = (count, isFuture) => {
    if (isFuture) return 'rgba(255,255,255,0.02)';
    if (count === 0) return 'rgba(255,255,255,0.06)';
    if (count === 1) return 'rgba(139,92,246,0.3)';
    if (count === 2) return 'rgba(139,92,246,0.5)';
    if (count <= 4) return 'rgba(139,92,246,0.7)';
    return 'rgba(139,92,246,0.9)';
  };

  const cellSize = 13;
  const gap = 3;
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.06)',
      padding: '20px 24px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Activity Heatmap</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Your solving journey over the past year</div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#a78bfa', lineHeight: 1 }}>{currentStreak}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>Current</div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#f59e0b', lineHeight: 1 }}>{bestStreak}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>Best</div>
          </div>
        </div>
      </div>

      {/* Month labels */}
      <div style={{ display: 'flex', paddingLeft: 30, marginBottom: 4 }}>
        {months.map((m, i) => (
          <div key={i} style={{
            fontSize: 10, color: 'rgba(255,255,255,0.35)', position: 'absolute',
            left: 30 + m.weekIndex * (cellSize + gap),
          }}>{m.month}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'flex', gap: 0, marginTop: 18, position: 'relative', overflow: 'hidden' }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap, marginRight: 6, flexShrink: 0 }}>
          {dayLabels.map((label, i) => (
            <div key={i} style={{ height: cellSize, fontSize: 9, color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 24 }}>
              {label}
            </div>
          ))}
        </div>

        {/* Weeks */}
        <div style={{ display: 'flex', gap, overflow: 'auto', scrollbarWidth: 'none' }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap }}>
              {week.map((day, di) => (
                <div key={di} title={`${day.date}: ${day.count} solved, ${day.xp} XP`} style={{
                  width: cellSize, height: cellSize,
                  borderRadius: 3,
                  background: getColor(day.count, day.isFuture),
                  border: day.isToday ? '2px solid rgba(139,92,246,0.8)' : '1px solid rgba(255,255,255,0.03)',
                  cursor: 'default',
                  transition: 'transform 0.15s, background 0.2s',
                }} onMouseEnter={e => e.target.style.transform = 'scale(1.3)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, marginTop: 12 }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Less</span>
        {[0, 1, 2, 3, 5].map((c, i) => (
          <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: getColor(c, false) }} />
        ))}
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>More</span>
      </div>
    </div>
  );
}
