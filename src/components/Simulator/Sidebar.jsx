import { Server, Database, Globe, Layers, Box, Cpu, Brain, Disc } from 'lucide-react';

const DraggableNode = ({ icon: Icon, label, type, color }) => {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className="flex flex-col items-center justify-center p-3 w-20 h-20 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-1 cursor-grab transition-all group"
            onDragStart={(event) => onDragStart(event, type)}
            draggable
        >
            <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-500 mb-1 group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <span className="text-[10px] font-semibold text-slate-500 group-hover:text-slate-700 text-center leading-tight">{label}</span>
        </div>
    );
};

export function Sidebar() {
    return (
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 w-fit">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Toolbox</h2>

            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-[10px] font-bold text-slate-300 uppercase mb-2 px-1">Compute</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <DraggableNode icon={Globe} label="User" type="client" color="purple" />
                        <DraggableNode icon={Server} label="Service" type="service" color="blue" />
                    </div>
                </div>

                <div>
                    <h3 className="text-[10px] font-bold text-slate-300 uppercase mb-2 px-1">Storage</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <DraggableNode icon={Database} label="DB" type="database" color="green" />
                        <DraggableNode icon={Layers} label="Cache" type="cache" color="teal" />
                        <DraggableNode icon={Disc} label="Vector" type="vector_db" color="cyan" />
                    </div>
                </div>

                <div>
                    <h3 className="text-[10px] font-bold text-slate-300 uppercase mb-2 px-1">Network</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <DraggableNode icon={Box} label="Lb" type="load_balancer" color="orange" />
                        <DraggableNode icon={Layers} label="Queue" type="queue" color="yellow" />
                    </div>
                </div>
                <div>
                    <h3 className="text-[10px] font-bold text-slate-300 uppercase mb-2 px-1">AI</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <DraggableNode icon={Brain} label="LLM" type="llm" color="pink" />
                    </div>
                </div>
            </div>
        </div>
    );
}
