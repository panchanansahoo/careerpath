// ─── Test Case Engine ───
// Edge case templates, random input generator, and stress testing utilities

// ─── Edge Case Templates ───
export const EDGE_CASE_TEMPLATES = {
  array: [
    { name: 'Empty array', input: '[]', description: 'Handle zero-length input' },
    { name: 'Single element', input: '[1]', description: 'Handle single element' },
    { name: 'Two elements', input: '[1, 2]', description: 'Minimum pair' },
    { name: 'All same elements', input: '[5, 5, 5, 5, 5]', description: 'Duplicate values' },
    { name: 'Already sorted', input: '[1, 2, 3, 4, 5]', description: 'Pre-sorted input' },
    { name: 'Reverse sorted', input: '[5, 4, 3, 2, 1]', description: 'Worst case for many sorts' },
    { name: 'Negatives', input: '[-3, -1, -2, -5, -4]', description: 'All negative values' },
    { name: 'Mixed signs', input: '[-2, 0, 3, -1, 5]', description: 'Mix of neg, zero, pos' },
    { name: 'Large values', input: '[1000000, -1000000, 999999]', description: 'Boundary values' },
    { name: 'Contains zero', input: '[0, 0, 0, 1]', description: 'Zero handling' },
  ],
  string: [
    { name: 'Empty string', input: '""', description: 'Handle empty input' },
    { name: 'Single char', input: '"a"', description: 'Single character' },
    { name: 'Palindrome', input: '"racecar"', description: 'Palindromic string' },
    { name: 'All same chars', input: '"aaaaa"', description: 'Repeated characters' },
    { name: 'Special chars', input: '"a!@#b"', description: 'Special characters' },
    { name: 'With spaces', input: '"hello world"', description: 'Whitespace handling' },
    { name: 'Very long', input: '"abcdefghij".repeat(100)', description: 'Large input' },
  ],
  linkedList: [
    { name: 'Empty list', input: 'null', description: 'Handle null head' },
    { name: 'Single node', input: '[1]', description: 'Single element list' },
    { name: 'Two nodes', input: '[1, 2]', description: 'Minimum traversal' },
    { name: 'Has cycle', input: '[1, 2, 3] (cycle at 1)', description: 'Cycle detection' },
  ],
  tree: [
    { name: 'Empty tree', input: 'null', description: 'Handle null root' },
    { name: 'Single node', input: '[1]', description: 'Leaf-only tree' },
    { name: 'Left-skewed', input: '[1, 2, null, 3]', description: 'All left children' },
    { name: 'Right-skewed', input: '[1, null, 2, null, 3]', description: 'All right children' },
    { name: 'Perfect tree', input: '[1, 2, 3, 4, 5, 6, 7]', description: 'Complete binary tree' },
  ],
  graph: [
    { name: 'Empty graph', input: '0 nodes, 0 edges', description: 'No elements' },
    { name: 'Single node', input: '1 node, 0 edges', description: 'Isolated node' },
    { name: 'Disconnected', input: 'Multiple components', description: 'Not fully connected' },
    { name: 'Self loop', input: 'Edge from A to A', description: 'Self-referencing edge' },
    { name: 'Complete graph', input: 'All nodes connected', description: 'Dense graph' },
  ],
};

// ─── Random Input Generator ───
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomArray(size = 10, min = -100, max = 100) {
  return Array.from({ length: size }, () => randomInt(min, max));
}

export function generateSortedArray(size = 10, min = 0, max = 1000) {
  return generateRandomArray(size, min, max).sort((a, b) => a - b);
}

export function generateRandomString(length = 10, charset = 'abcdefghijklmnopqrstuvwxyz') {
  return Array.from({ length }, () => charset[randomInt(0, charset.length - 1)]).join('');
}

export function generateRandomMatrix(rows = 3, cols = 3, min = 0, max = 9) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => randomInt(min, max))
  );
}

export function generateRandomGraph(nodes = 5, edgeProbability = 0.4) {
  const edges = [];
  for (let i = 0; i < nodes; i++) {
    for (let j = i + 1; j < nodes; j++) {
      if (Math.random() < edgeProbability) {
        edges.push([i, j]);
      }
    }
  }
  return { nodes, edges };
}

// ─── Test Case Runner (Mock) ───
export function createTestCase(input, expectedOutput, name = '') {
  return {
    id: Date.now() + Math.random().toString(36).substr(2, 5),
    name: name || `Test ${Date.now()}`,
    input,
    expectedOutput,
    actualOutput: null,
    status: 'pending', // pending | running | passed | failed | error
    runtime: null,
    memory: null,
  };
}

export function runTestCases(code, language, testCases) {
  // Mock execution - simulates running test cases
  return testCases.map((tc, i) => {
    const delay = randomInt(10, 120);
    const memoryUsage = randomInt(12, 18);
    const shouldPass = Math.random() > 0.2; // 80% pass rate for mock

    return {
      ...tc,
      status: shouldPass ? 'passed' : 'failed',
      actualOutput: shouldPass ? tc.expectedOutput : 'Wrong Answer',
      runtime: `${delay}ms`,
      memory: `${memoryUsage}.${randomInt(0, 9)}MB`,
    };
  });
}

// ─── Stress Test Generator ───
export function generateStressTests(problemType = 'array', count = 5, maxSize = 1000) {
  const tests = [];
  const sizes = [10, 100, 500, 1000, maxSize].slice(0, count);

  for (const size of sizes) {
    let input;
    switch (problemType) {
      case 'array':
        input = JSON.stringify(generateRandomArray(size));
        break;
      case 'sorted-array':
        input = JSON.stringify(generateSortedArray(size));
        break;
      case 'string':
        input = `"${generateRandomString(size)}"`;
        break;
      case 'matrix':
        input = JSON.stringify(generateRandomMatrix(Math.min(size, 50), Math.min(size, 50)));
        break;
      default:
        input = JSON.stringify(generateRandomArray(size));
    }

    tests.push({
      id: `stress-${size}-${Date.now()}`,
      name: `Stress Test (n=${size})`,
      input,
      expectedOutput: '—',
      status: 'pending',
      runtime: null,
      memory: null,
      isStressTest: true,
    });
  }

  return tests;
}

// ─── Default test cases for common problems ───
export const DEFAULT_TEST_CASES = {
  'two-sum': [
    createTestCase('nums = [2,7,11,15], target = 9', '[0,1]', 'Basic case'),
    createTestCase('nums = [3,2,4], target = 6', '[1,2]', 'Middle elements'),
    createTestCase('nums = [3,3], target = 6', '[0,1]', 'Duplicate values'),
  ],
  'valid-palindrome': [
    createTestCase('"A man, a plan, a canal: Panama"', 'true', 'Classic palindrome'),
    createTestCase('"race a car"', 'false', 'Not palindrome'),
    createTestCase('" "', 'true', 'Empty/space string'),
  ],
  'contains-duplicate': [
    createTestCase('[1,2,3,1]', 'true', 'Has duplicate'),
    createTestCase('[1,2,3,4]', 'false', 'All unique'),
    createTestCase('[1,1,1,3,3,4,3,2,4,2]', 'true', 'Multiple duplicates'),
  ],
};

// ─── Problem type detection for edge cases ───
export function detectProblemType(description = '') {
  const desc = description.toLowerCase();
  if (desc.includes('tree') || desc.includes('binary')) return 'tree';
  if (desc.includes('linked list') || desc.includes('listnode')) return 'linkedList';
  if (desc.includes('graph') || desc.includes('node') && desc.includes('edge')) return 'graph';
  if (desc.includes('string') || desc.includes('substring') || desc.includes('character')) return 'string';
  return 'array';
}
