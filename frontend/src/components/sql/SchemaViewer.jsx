import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Key, Link2, Star, AlertCircle, Search, Table2, Eye } from 'lucide-react';

const constraintIcon = (col) => {
    if (col.primaryKey) return <Key size={12} style={{ color: '#f59e0b' }} title="Primary Key" />;
    if (col.foreignKey) return <Link2 size={12} style={{ color: '#3b82f6' }} title={`FK → ${col.foreignKey.table}.${col.foreignKey.column}`} />;
    if (col.unique) return <Star size={12} style={{ color: '#8b5cf6' }} title="Unique" />;
    if (!col.nullable) return <AlertCircle size={12} style={{ color: '#ef4444' }} title="NOT NULL" />;
    return null;
};

export default function SchemaViewer({ schema }) {
    const [expandedTables, setExpandedTables] = useState(() => {
        const set = new Set();
        if (schema?.tables?.length) set.add(schema.tables[0].name);
        return set;
    });
    const [showSample, setShowSample] = useState({});
    const [search, setSearch] = useState('');

    if (!schema) return <div style={{ padding: 24, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>No schema loaded</div>;

    const toggleTable = (name) => {
        setExpandedTables(prev => {
            const next = new Set(prev);
            next.has(name) ? next.delete(name) : next.add(name);
            return next;
        });
    };

    const filteredTables = schema.tables.filter(t =>
        !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.columns.some(c => c.name.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0d0d1f', color: '#e2e8f0' }}>
            {/* Header */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{schema.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: schema.color }}>{schema.name}</span>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: 8, top: 8, color: 'rgba(255,255,255,0.3)' }} />
                    <input
                        type="text" placeholder="Search tables & columns..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '6px 8px 6px 28px', color: '#e2e8f0', fontSize: 12, outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>
            </div>

            {/* Tables */}
            <div style={{ flex: 1, overflow: 'auto', padding: '8px 12px' }}>
                {filteredTables.map(table => {
                    const isOpen = expandedTables.has(table.name);
                    const showingSample = showSample[table.name];
                    return (
                        <div key={table.name} style={{ marginBottom: 8, border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                            {/* Table header */}
                            <div
                                onClick={() => toggleTable(table.name)}
                                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', background: isOpen ? 'rgba(255,255,255,0.04)' : 'transparent', transition: 'background 0.15s' }}
                            >
                                {isOpen ? <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.4)' }} /> : <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />}
                                <Table2 size={14} style={{ color: schema.color }} />
                                <span style={{ fontWeight: 600, fontSize: 13, fontFamily: 'monospace' }}>{table.name}</span>
                                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{table.columns.length} cols</span>
                            </div>

                            {/* Columns */}
                            {isOpen && (
                                <div style={{ padding: '0 12px 8px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                                        <thead>
                                            <tr style={{ color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                                <th style={{ textAlign: 'left', padding: '4px 6px', fontWeight: 500 }}>Column</th>
                                                <th style={{ textAlign: 'left', padding: '4px 6px', fontWeight: 500 }}>Type</th>
                                                <th style={{ textAlign: 'center', padding: '4px 6px', fontWeight: 500, width: 30 }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {table.columns.map(col => (
                                                <tr key={col.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                    <td style={{ padding: '3px 6px', fontFamily: 'monospace', color: col.primaryKey ? '#f59e0b' : col.foreignKey ? '#60a5fa' : '#e2e8f0' }}>
                                                        {col.name}
                                                    </td>
                                                    <td style={{ padding: '3px 6px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', fontSize: 10 }}>
                                                        {col.type}
                                                    </td>
                                                    <td style={{ padding: '3px 6px', textAlign: 'center' }}>
                                                        {constraintIcon(col)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {/* FK references */}
                                    {table.columns.filter(c => c.foreignKey).map(col => (
                                        <div key={col.name} style={{ fontSize: 10, color: '#60a5fa', padding: '2px 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Link2 size={10} /> {col.name} → {col.foreignKey.table}.{col.foreignKey.column}
                                        </div>
                                    ))}

                                    {/* Sample data toggle */}
                                    {table.sampleData && (
                                        <button
                                            onClick={() => setShowSample(prev => ({ ...prev, [table.name]: !prev[table.name] }))}
                                            style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, padding: '3px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, color: 'rgba(255,255,255,0.5)', fontSize: 10, cursor: 'pointer' }}
                                        >
                                            <Eye size={10} /> {showingSample ? 'Hide' : 'Show'} sample data
                                        </button>
                                    )}

                                    {/* Sample data table */}
                                    {showingSample && table.sampleData && (
                                        <div style={{ marginTop: 6, overflow: 'auto', maxHeight: 140 }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
                                                <thead>
                                                    <tr>
                                                        {table.columns.map(c => (
                                                            <th key={c.name} style={{ padding: '3px 6px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 500, whiteSpace: 'nowrap', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'monospace' }}>{c.name}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {table.sampleData.map((row, i) => (
                                                        <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                                                            {row.map((val, j) => (
                                                                <td key={j} style={{ padding: '2px 6px', whiteSpace: 'nowrap', fontFamily: 'monospace', color: val === null ? 'rgba(255,255,255,0.25)' : '#e2e8f0' }}>
                                                                    {val === null ? 'NULL' : String(val)}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Relationships */}
                {schema.relationships && schema.relationships.length > 0 && (
                    <div style={{ marginTop: 12, padding: '8px 12px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Relationships</div>
                        {schema.relationships.map((rel, i) => (
                            <div key={i} style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', padding: '2px 0', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ color: '#60a5fa' }}>{rel.from}</span>
                                <span>→</span>
                                <span style={{ color: '#10b981' }}>{rel.to}</span>
                                <span style={{ marginLeft: 8, color: 'rgba(255,255,255,0.2)', fontSize: 9 }}>({rel.type})</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
