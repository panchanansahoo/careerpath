import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, ArrowUpDown } from 'lucide-react';

export default function SQLResultsPanel({ results, expectedOutput, status, executionTime }) {
    const [activeTab, setActiveTab] = useState('results');
    const [sortCol, setSortCol] = useState(null);
    const [sortDir, setSortDir] = useState('asc');

    const tabs = [
        { id: 'results', label: 'Results' },
        { id: 'expected', label: 'Expected Output' },
    ];

    const statusBadge = () => {
        if (!status) return null;
        const styles = {
            accepted: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', icon: CheckCircle, text: 'Accepted' },
            wrong: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', icon: XCircle, text: 'Wrong Answer' },
            running: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', icon: Clock, text: 'Running...' },
            error: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', icon: XCircle, text: 'Error' },
        };
        const s = styles[status] || styles.error;
        const Icon = s.icon;
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 6, background: s.bg, color: s.color, fontSize: 12, fontWeight: 600 }}>
                <Icon size={14} /> {s.text}
            </div>
        );
    };

    const sortData = (data, columns) => {
        if (!sortCol || !data) return data;
        const colIndex = columns.indexOf(sortCol);
        if (colIndex === -1) return data;
        return [...data].sort((a, b) => {
            const av = a[colIndex], bv = b[colIndex];
            if (av === null && bv === null) return 0;
            if (av === null) return 1;
            if (bv === null) return -1;
            if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
            return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
        });
    };

    const handleSort = (col) => {
        if (sortCol === col) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); }
        else { setSortCol(col); setSortDir('asc'); }
    };

    const renderTable = (data) => {
        if (!data || !data.columns || !data.rows) {
            return <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Run your query to see results</div>;
        }
        const sorted = sortData(data.rows, data.columns);
        return (
            <div style={{ overflow: 'auto', flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                        <tr>
                            {data.columns.map(col => (
                                <th
                                    key={col}
                                    onClick={() => handleSort(col)}
                                    style={{ position: 'sticky', top: 0, padding: '6px 10px', textAlign: 'left', fontWeight: 600, color: 'rgba(255,255,255,0.6)', background: '#0d0d1f', borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none', fontFamily: 'monospace', fontSize: 11 }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {col}
                                        <ArrowUpDown size={10} style={{ opacity: sortCol === col ? 0.8 : 0.2 }} />
                                    </span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((row, i) => (
                            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', transition: 'background 0.1s' }}>
                                {row.map((val, j) => (
                                    <td key={j} style={{ padding: '4px 10px', fontFamily: 'monospace', fontSize: 11, whiteSpace: 'nowrap', color: val === null ? 'rgba(255,255,255,0.25)' : '#e2e8f0', fontStyle: val === null ? 'italic' : 'normal', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        {val === null ? 'NULL' : String(val)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const currentData = activeTab === 'results' ? results : expectedOutput;

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0d0d1f', color: '#e2e8f0' }}>
            {/* Tabs + status */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{ padding: '8px 14px', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #8b5cf6' : '2px solid transparent', color: activeTab === tab.id ? '#e2e8f0' : 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                    >
                        {tab.label}
                    </button>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
                    {executionTime && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{currentData?.rows?.length || 0} rows • {executionTime}ms</span>}
                    {statusBadge()}
                </div>
            </div>

            {/* Content */}
            {renderTable(currentData)}
        </div>
    );
}
