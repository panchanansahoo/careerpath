import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Server, Database, Layers, Box, Globe, Cpu, Brain, Disc } from 'lucide-react';

const NodeWrapper = ({ children, selected, color = 'blue', isOverloaded = false }) => {
    const finalColor = isOverloaded ? 'red' : color;

    return (
        <div className={`
      relative px-4 py-3 rounded-xl bg-white transition-all min-w-[150px]
      ${selected
                ? `border-2 border-${finalColor}-500 shadow-xl shadow-${finalColor}-500/10 scale-105`
                : isOverloaded
                    ? `border-2 border-red-500 shadow-lg shadow-red-500/20 bg-red-50`
                    : 'border border-slate-200 shadow-md hover:shadow-lg hover:-translate-y-0.5'}
    `}>
            {children}
        </div>
    );
};

const NodeHeader = ({ icon: Icon, label, color = 'blue' }) => (
    <div className="flex items-center gap-3 mb-3">
        <div className={`p-1.5 rounded-lg bg-${color}-50 text-${color}-600`}>
            <Icon size={16} />
        </div>
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{label}</span>
    </div>
);

const NodeStats = ({ stats }) => (
    <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
        {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="flex justify-between text-[10px] text-slate-500 font-medium font-mono">
                <span>{key}</span>
                <span className="text-slate-700 font-bold">{value}</span>
            </div>
        ))}
    </div>
);

export const ServiceNode = memo(({ data, selected }) => {
    const cpu = parseInt(data.stats?.cpu || 0);
    const isOverloaded = cpu > 80;

    return (
        <NodeWrapper selected={selected} color="blue" isOverloaded={isOverloaded}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-[#18181B]" />
            <NodeHeader icon={Server} label={data.label || 'Service'} color={isOverloaded ? 'red' : 'blue'} />
            <NodeStats stats={{
                RPS: data.stats?.rps || '0',
                CPU: (data.stats?.cpu || '0') + '%'
            }} />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500 border-2 border-[#18181B]" />
        </NodeWrapper>
    );
});

export const DatabaseNode = memo(({ data, selected }) => {
    const rps = parseInt(data.stats?.rps || 0);
    // Arbitrary threshold for DB overload visualization
    const isOverloaded = rps > 500;

    return (
        <NodeWrapper selected={selected} color="green" isOverloaded={isOverloaded}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-green-500 border-2 border-[#18181B]" />
            <NodeHeader icon={Database} label={data.label || 'Database'} color={isOverloaded ? 'red' : 'green'} />
            <NodeStats stats={{
                IOPS: data.stats?.rps ? Math.floor(data.stats.rps * 0.2) : '0',
                Size: '10GB'
            }} />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-[#18181B]" />
        </NodeWrapper>
    );
});

export const ClientNode = memo(({ data, selected }) => {
    return (
        <NodeWrapper selected={selected} color="purple">
            <NodeHeader icon={Globe} label={data.label || 'Client'} color="purple" />
            <NodeStats stats={{
                Users: '1000',
                RPS: data.stats?.rps || '0'
            }} />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-purple-500 border-2 border-[#18181B]" />
        </NodeWrapper>
    );
});

export const QueueNode = memo(({ data, selected }) => {
    return (
        <NodeWrapper selected={selected} color="yellow">
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-yellow-500 border-2 border-[#18181B]" />
            <NodeHeader icon={Layers} label={data.label || 'Queue'} color="yellow" />
            <NodeStats stats={{
                Msgs: data.stats?.rps || '0',
                Lag: '0ms'
            }} />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-yellow-500 border-2 border-[#18181B]" />
        </NodeWrapper>
    );
});

export const LoadBalancerNode = memo(({ data, selected }) => {
    return (
        <NodeWrapper selected={selected} color="orange">
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-orange-500 border-2 border-[#18181B]" />
            <NodeHeader icon={Box} label={data.label || 'Load Balancer'} color="orange" />
            <NodeStats stats={{
                RPS: data.stats?.rps || '0'
            }} />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-orange-500 border-2 border-[#18181B]" />
        </NodeWrapper>
    );
});

export const LLMNode = memo(({ data, selected }) => {
    const rps = parseInt(data.stats?.rps || 0);
    const isOverloaded = rps > 50; // Low threshold for expensive LLMs

    return (
        <NodeWrapper selected={selected} color="pink" isOverloaded={isOverloaded}>
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-pink-500 border-2 border-[#18181B]" />
            <NodeHeader icon={Brain} label={data.label || 'LLM Model'} color={isOverloaded ? 'red' : 'pink'} />
            <NodeStats stats={{
                Model: data.config?.model || 'GPT-4',
                Tokens: `${data.stats?.tokens || 0}/s`,
                Cost: `$${data.stats?.cost || 0}/hr`
            }} />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-pink-500 border-2 border-[#18181B]" />
        </NodeWrapper>
    );
});

export const VectorDBNode = memo(({ data, selected }) => {
    return (
        <NodeWrapper selected={selected} color="cyan">
            <Handle type="target" position={Position.Left} className="w-3 h-3 bg-cyan-500 border-2 border-[#18181B]" />
            <NodeHeader icon={Disc} label={data.label || 'Vector DB'} color="cyan" />
            <NodeStats stats={{
                Dim: data.config?.dimensions || '1536',
                QPS: data.stats?.rps || '0'
            }} />
            <Handle type="source" position={Position.Right} className="w-3 h-3 bg-cyan-500 border-2 border-[#18181B]" />
        </NodeWrapper>
    );
});
