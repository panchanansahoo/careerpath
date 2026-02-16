import React from 'react';
import { Activity, DollarSign, Clock, Zap, Cpu, Server } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, color }) => (
  <div className={`p-4 rounded-xl bg-white border border-slate-100 shadow-sm flex flex-col gap-1 relative overflow-hidden group hover:shadow-md transition-all`}>
    <div className={`absolute -right-2 -top-2 p-2 opacity-5 text-${color}-500 transform rotate-12 group-hover:scale-110 transition-transform`}>
      <Icon size={64} />
    </div>
    <div className="flex items-center gap-2 z-10">
      <div className={`p-1 rounded-md bg-${color}-50 text-${color}-600`}>
        <Icon size={12} />
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <span className="text-xl font-bold text-slate-800 font-sans z-10">{value}</span>
  </div>
);

export function PropertiesPanel({ selectedNode, simulationStats, onRunSimulation, onKillNode }) {
  // If no detailed stats calculated yet, just show placeholder
  const nodeStats = simulationStats?.nodeStats?.[selectedNode?.id] || {};
  const isDead = nodeStats.status === 'dead';

  return (
    <div className="flex flex-col h-auto bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Activity size={16} className="text-blue-600" />
          <span>Simulation Metrics</span>
        </h2>
        {simulationStats && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold animate-pulse">
                LIVE
            </span>
        )}
      </div>

      <div className="p-5 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {/* Global Stats Section */}
        <div>
          <div className="grid grid-cols-1 gap-3">
            <MetricCard 
              icon={Zap} 
              label="Traffic" 
              value={`${simulationStats?.totalRPS || 0} RPS`} 
              color="yellow" 
            />
            <MetricCard 
              icon={DollarSign} 
              label="Monthly Cost" 
              value={`$${(simulationStats?.totalCost || 0).toLocaleString()}`} 
              color="green" 
            />
            <MetricCard 
              icon={Clock} 
              label="Latency" 
              value={`${simulationStats?.avgLatency || 0}ms`} 
              color="purple" 
            />
          </div>
        </div>

        {/* Selected Node Details */}
        {selectedNode ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <ServerIcon className="w-3 h-3" /> Selected
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-mono">
                {selectedNode.id}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-100 shadow-sm text-blue-600">
                  <Server size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-700">{selectedNode.data?.label}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">{selectedNode.type}</div>
                </div>
              </div>

              <div className="h-px bg-slate-200" />

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Throughput</span>
                  <span className="font-mono font-bold text-slate-700">{nodeStats.rps || 0} RPS</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">CPU Load</span>
                    <span className={`font-mono font-bold ${getLoadColor(nodeStats.cpu)}`}>
                      {nodeStats.cpu || 0}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getLoadBarColor(nodeStats.cpu)}`}
                      style={{ width: `${Math.min(nodeStats.cpu || 0, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Chaos Engineering Controls */}
              <div className="pt-3 border-t border-slate-200">
                <button 
                  onClick={() => onKillNode(selectedNode.id)}
                  disabled={isDead}
                  className={`w-full py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                    isDead 
                    ? 'bg-red-50 text-red-300 cursor-not-allowed' 
                    : 'bg-white border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 shadow-sm'
                  }`}
                >
                  <Zap size={10} />
                  {isDead ? 'Terminated' : 'Simulate Failure'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-xl">
            <p className="text-slate-400 text-xs font-medium">
              Select component to view details
            </p>
          </div>
        )}
        
         <button 
          onClick={onRunSimulation}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          <Zap size={16} className="fill-white group-hover:scale-110 transition-transform" />
          <span>Run Simulation</span>
        </button>
      </div>
    </div>
  );
}

function GlobeIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
  )
}

function ServerIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="8" x="2" y="2" rx="2" ry="2" /><rect width="20" height="8" x="2" y="14" rx="2" ry="2" /><line x1="6" x2="6.01" y1="6" y2="6" /><line x1="6" x2="6.01" y1="18" y2="18" /></svg>
  )
}

const getLoadColor = (load = 0) => {
  if (load > 90) return 'text-red-500';
  if (load > 70) return 'text-orange-500';
  return 'text-green-500';
};

const getLoadBarColor = (load = 0) => {
  if (load > 90) return 'bg-red-500';
  if (load > 70) return 'bg-orange-500';
  return 'bg-green-500';
};
