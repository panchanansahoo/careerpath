import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Sidebar } from './Sidebar';
import { PropertiesPanel } from './PropertiesPanel';

import { ServiceNode, DatabaseNode, ClientNode, QueueNode, LoadBalancerNode, LLMNode, VectorDBNode } from './CustomNodes';
import { calculateTotalCost, simulateTraffic } from './SimulationEngine';

// Define custom node types
const nodeTypes = {
  service: ServiceNode,
  database: DatabaseNode,
  client: ClientNode,
  queue: QueueNode,
  load_balancer: LoadBalancerNode,
  llm: LLMNode,
  vector_db: VectorDBNode,
};

// Default nodes for testing
const initialNodes = [
  { id: '1', position: { x: 50, y: 50 }, data: { label: 'Client' }, type: 'client' },
  { id: '2', position: { x: 300, y: 50 }, data: { label: 'Load Balancer' }, type: 'load_balancer' },
  { id: '3', position: { x: 550, y: 50 }, data: { label: 'Auth Service' }, type: 'service' },
  { id: '4', position: { x: 550, y: 200 }, data: { label: 'Database' }, type: 'database' },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4' },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

function SimulatorContent() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [simulationStats, setSimulationStats] = useState(null);

  const selectedNode = nodes.find((n) => n.selected);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `New ${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const handleRunSimulation = useCallback(() => {
    // 1. Calculate Traffic Spread
    // Assume 1000 RPS for now from every client
    const trafficStats = simulateTraffic(nodes, edges, 1000);

    // 2. Calculate Cost based on traffic
    // We sum up the RPS to pass to cost calculator (simplification)
    const totalRPS = Object.values(trafficStats).reduce((a, b) => a + b, 0); // This is technically sum of all nodes, identifying system load roughly

    // For cost, we need per-node RPS. The calculator now expects (nodes, edges, globalRPS?) 
    // Actually my calculator implementation uses global RPS for service scaling. 
    // Let's improve it to use the per-node traffic if possible, but for MVP sticking to current loop.
    // I'll update the calculator call to pass the traffic map in a future iteration, 
    // for now let's just pass the max traffic found as a proxy for "system load"
    const maxRPS = Math.max(...Object.values(trafficStats));

    const costStats = calculateTotalCost(nodes, edges, maxRPS);

    // 3. Estimate Latency (Randomized with base + load)
    const avgLatency = 25 + Math.floor(maxRPS * 0.01) + Math.floor(Math.random() * 20);

    // 4. Update Node Data with Stats (for visualization on nodes)
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          stats: {
            rps: Math.floor(trafficStats[node.id] || 0),
            cpu: Math.min(Math.floor((trafficStats[node.id] || 0) / 10), 100) // Mock CPU calc
          }
        }
      }))
    );

    setSimulationStats({
      totalRPS: Math.floor(maxRPS), // Using max flow as "system throughput" equivalent
      totalCost: costStats.total,
      avgLatency,
      nodeStats: Object.keys(trafficStats).reduce((acc, nodeId) => {
        acc[nodeId] = {
          rps: Math.floor(trafficStats[nodeId]),
          cpu: Math.min(Math.floor(trafficStats[nodeId] / 10), 100)
        };
        return acc;
      }, {})
    });

  }, [nodes, edges, setNodes]);

  const handleKillNode = useCallback((nodeId) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              stats: { ...node.data.stats, status: 'dead' } // Mark as dead in data
            },
            style: { opacity: 0.5, filter: 'grayscale(100%)' } // Visual indication
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  return (
    <div className="relative h-full w-full bg-[#f8fafc] overflow-hidden font-sans">
      {/* Main Canvas - Full Screen Z-0 */}
      <div className="absolute inset-0 z-0" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background color="#cbd5e1" gap={24} size={1} />
          <Controls className="bg-white border border-slate-200 shadow-sm rounded-lg text-slate-600 fill-slate-600" />
          <MiniMap
            className="bg-white border border-slate-200 shadow-sm rounded-lg"
            nodeColor="#3b82f6"
            maskColor="rgba(241, 245, 249, 0.7)"
          />
        </ReactFlow>
      </div>

      {/* Floating Sidebar - Left Z-10 */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-4">
        <Sidebar />
      </div>

      {/* Floating Properties Panel - Right Z-10 */}
      <div className="absolute top-6 right-6 z-10 w-80 max-h-[calc(100vh-3rem)] flex flex-col pointer-events-none">
        {/* We need pointer-events-auto on the children to allow interaction */}
        <div className="pointer-events-auto">
          <PropertiesPanel
            selectedNode={selectedNode}
            simulationStats={simulationStats}
            onRunSimulation={handleRunSimulation}
            onKillNode={handleKillNode}
          />
        </div>
      </div>
    </div>
  );
}

export default function SimulatorLayout() {
  return (
    <ReactFlowProvider>
      <SimulatorContent />
    </ReactFlowProvider>
  );
}
