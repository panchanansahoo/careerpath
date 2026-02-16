
// Basic cost model (approximate monthly cost)
const COST_MODEL = {
  service: { base: 29, per_replica: 29, unit: 't3.small' },
  database: { base: 60, per_replica: 60, unit: 'RDS Small' },
  queue: { base: 10, per_msg: 0.0000004, unit: 'SQS' },
  load_balancer: { base: 20, per_gb: 0.008, unit: 'ALB' },
  cache: { base: 40, unit: 'Redis' },
  client: { base: 0 },
  // AI Components
  llm: { 
    base: 0, 
    per_1k_input: 0.03, 
    per_1k_output: 0.06, 
    unit: 'GPT-4' 
  },
  vector_db: { 
    base: 70, 
    per_gb: 0.10, 
    unit: 'Pinecone S1' 
  }
};

export const calculateTotalCost = (nodes, edges, trafficRPS = 0) => {
  let totalCost = 0;
  const breakdown = {};

  nodes.forEach(node => {
    const type = node.type;
    const model = COST_MODEL[type];
    
    if (!model) return;

    let nodeCost = model.base;

    // Add load-based scaling cost (very simple linear model for MVP)
    if (trafficRPS > 0) {
      if (type === 'service') {
        const neededReplicas = Math.ceil(trafficRPS / 50);
        nodeCost = neededReplicas * model.per_replica;
      } else if (type === 'llm') {
        // Assume avg 500 input tokens, 200 output tokens per request
        const inputTokens = trafficRPS * 60 * 60 * 500; // per hour
        const outputTokens = trafficRPS * 60 * 60 * 200; // per hour
        nodeCost = (inputTokens / 1000 * model.per_1k_input) + (outputTokens / 1000 * model.per_1k_output);
      }
    }

    totalCost += nodeCost;
    breakdown[node.id] = nodeCost;
  });

  return {
    total: Math.floor(totalCost),
    breakdown
  };
};

export const simulateTraffic = (nodes, edges, startRPS) => {
  // Simple BFS/Propagate flow
  // 1. Find client nodes
  // 2. Push RPS to connected nodes

  const nodeRPS = {};
  
  // Initialize
  nodes.forEach(n => nodeRPS[n.id] = 0);

  // Find clients (sources) - Only if they are not dead
  const clients = nodes.filter(n => n.type === 'client' && n.data?.stats?.status !== 'dead');
  clients.forEach(c => nodeRPS[c.id] = startRPS);

  // Propagate (simplified: just split RPS evenly among targets)
  // Real sim needs queueing theory, but this is MVP visual
  
  // Create adjacency list
  const adj = {};
  edges.forEach(e => {
    if(!adj[e.source]) adj[e.source] = [];
    adj[e.source].push(e.target);
  });

  const queue = [...clients.map(c => c.id)];
  const visited = new Set();
  
  while(queue.length > 0) {
    const currId = queue.shift();
    if(visited.has(currId)) continue;
    
    // Check if current node is dead (except if it was a source we already filtered)
    const currNode = nodes.find(n => n.id === currId);
    if (currNode && currNode.data?.stats?.status === 'dead') {
        // Traffic dies here
        nodeRPS[currId] = 0; 
        continue;
    }

    const targets = adj[currId] || [];
    if (targets.length > 0) {
      // Filter out dead targets from distribution to make it smarter?
      // For now, let's say load balancer sends to dead nodes and requests fail there.
      // So we propagate traffic to them, but they won't propagate further.
      
      const rpsPerTarget = nodeRPS[currId] / targets.length;
      targets.forEach(tid => {
        nodeRPS[tid] += rpsPerTarget;
        queue.push(tid);
      });
    }
    
    visited.add(currId);
  }

  return nodeRPS;
};
