// DSA Learning Path - Complete Curriculum with all patterns and study materials
import { all425Problems } from './allProblems.js';

export const dsaLearningPath = {
  id: 'dsa',
  title: 'Complete DSA Mastery Path',
  slug: 'dsa',
  description: 'Master Data Structures & Algorithms with 425 curated problems across 14 patterns',
  duration: '12-16 weeks',
  difficulty: 'All Levels',
  totalProblems: 425,
  totalModules: 14,
  color: '#3b82f6',
  icon: 'Code',
  
  overview: {
    objectives: [
      'Master all fundamental data structures and algorithms',
      'Solve 425 hand-picked interview problems',
      'Learn 14 essential problem-solving patterns',
      'Build confidence for technical interviews',
      'Understand time and space complexity analysis',
      'Practice with real FAANG interview questions'
    ],
    prerequisites: [
      'Basic programming knowledge in any language',
      'Understanding of variables, loops, and functions',
      'Familiarity with object-oriented concepts (helpful but not required)'
    ],
    outcomes: [
      'Solve complex algorithmic problems efficiently',
      'Identify patterns in interview questions quickly',
      'Write clean, optimized code under pressure',
      'Ace technical interviews at top tech companies',
      'Build scalable software solutions',
      'Think algorithmically about real-world problems'
    ],
    skillsGained: [
      'Problem Solving',
      'Algorithm Design',
      'Complexity Analysis',
      'Pattern Recognition',
      'Code Optimization',
      'Technical Communication',
      'Debugging Skills',
      'System Thinking'
    ]
  },

  studyPlan: {
    beginner: {
      duration: '16 weeks',
      hoursPerWeek: '10-12 hours',
      approach: 'Start with Easy problems, focus on understanding concepts deeply',
      weeklyGoals: 'Complete 1 pattern per week, solve 15-20 problems'
    },
    intermediate: {
      duration: '12 weeks',
      hoursPerWeek: '12-15 hours',
      approach: 'Mix of Easy and Medium problems, focus on pattern recognition',
      weeklyGoals: 'Complete 1-2 patterns per week, solve 25-30 problems'
    },
    advanced: {
      duration: '8 weeks',
      hoursPerWeek: '15-20 hours',
      approach: 'Focus on Medium and Hard problems, optimize solutions',
      weeklyGoals: 'Complete 2 patterns per week, solve 35-40 problems'
    }
  },

  modules: [
    {
      id: 1,
      slug: 'array',
      title: 'Array Fundamentals',
      description: 'Master array manipulation, traversal, and problem-solving techniques',
      difficulty: 'Beginner to Advanced',
      estimatedTime: '1-2 weeks',
      problemCount: 45,
      topics: [
        'Array Basics & Operations',
        'Two Pointers Technique',
        'Sliding Window',
        'Prefix Sum & Difference Array',
        'Matrix Manipulation',
        'Array Sorting & Searching',
        'Kadane\'s Algorithm',
        'Dutch National Flag'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Array Data Structure Deep Dive',
          duration: '45 min',
          description: 'Comprehensive overview of arrays, memory layout, and operations',
          difficulty: 'Beginner'
        },
        {
          type: 'article',
          title: 'Two Pointers Pattern Explained',
          duration: '30 min',
          description: 'Learn when and how to use the two pointers technique',
          difficulty: 'Beginner'
        },
        {
          type: 'video',
          title: 'Sliding Window Technique',
          duration: '40 min',
          description: 'Master the sliding window pattern for subarray problems',
          difficulty: 'Intermediate'
        },
        {
          type: 'article',
          title: 'Advanced Array Algorithms',
          duration: '50 min',
          description: 'Kadane\'s algorithm, Dutch National Flag, and more',
          difficulty: 'Advanced'
        },
        {
          type: 'interactive',
          title: 'Array Visualization Tool',
          duration: '20 min',
          description: 'Interactive tool to visualize array operations',
          difficulty: 'All Levels'
        }
      ],
      keyProblems: [
        { id: 1, title: 'Two Sum', difficulty: 'Easy', mustSolve: true },
        { id: 5, title: 'Maximum Subarray', difficulty: 'Easy', mustSolve: true },
        { id: 4, title: 'Product of Array Except Self', difficulty: 'Medium', mustSolve: true },
        { id: 9, title: 'Container With Most Water', difficulty: 'Medium', mustSolve: true },
        { id: 36, title: 'First Missing Positive', difficulty: 'Hard', mustSolve: true }
      ],
      practiceStrategy: 'Start with Easy problems to build confidence. Focus on understanding different traversal patterns before moving to optimization.',
      commonMistakes: [
        'Not considering edge cases (empty array, single element)',
        'Forgetting about index boundaries',
        'Inefficient nested loops when better solutions exist',
        'Not handling negative numbers correctly'
      ],
      tips: [
        'Always check if the array is sorted - it opens up binary search',
        'Draw out examples before coding',
        'Consider using hash maps for O(1) lookups',
        'Think about whether you need extra space or can modify in-place'
      ]
    },
    {
      id: 2,
      slug: 'two-pointers',
      title: 'Two Pointers Pattern',
      description: 'Master the two pointers technique for efficient array and linked list problems',
      difficulty: 'Beginner to Intermediate',
      estimatedTime: '1 week',
      problemCount: 35,
      topics: [
        'Opposite Direction Pointers',
        'Same Direction Pointers',
        'Fast & Slow Pointers',
        'Collision Detection',
        'Palindrome Checking',
        'Array Partitioning',
        'Merging Sorted Arrays',
        'Cycle Detection'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Two Pointers Masterclass',
          duration: '35 min',
          description: 'Complete guide to two pointers with multiple examples',
          difficulty: 'Beginner'
        },
        {
          type: 'article',
          title: 'When to Use Two Pointers',
          duration: '25 min',
          description: 'Pattern recognition guide for two pointer problems',
          difficulty: 'Beginner'
        },
        {
          type: 'video',
          title: 'Fast & Slow Pointers for Cycle Detection',
          duration: '30 min',
          description: 'Floyd\'s algorithm and its applications',
          difficulty: 'Intermediate'
        },
        {
          type: 'practice',
          title: '15 Must-Solve Two Pointer Problems',
          duration: '4 hours',
          description: 'Curated problem set covering all variations',
          difficulty: 'Mixed'
        }
      ],
      keyProblems: [
        { id: 46, title: 'Valid Palindrome', difficulty: 'Easy', mustSolve: true },
        { id: 9, title: 'Container With Most Water', difficulty: 'Medium', mustSolve: true },
        { id: 64, title: 'Trapping Rain Water', difficulty: 'Hard', mustSolve: true },
        { id: 71, title: 'Linked List Cycle', difficulty: 'Easy', mustSolve: true },
        { id: 77, title: 'Find the Duplicate Number', difficulty: 'Medium', mustSolve: true }
      ],
      practiceStrategy: 'Understand when pointers move together vs opposite directions. Practice visualizing pointer movement.',
      commonMistakes: [
        'Moving pointers incorrectly based on conditions',
        'Not handling the meeting point correctly',
        'Infinite loops due to wrong termination conditions',
        'Off-by-one errors in pointer positions'
      ],
      tips: [
        'Draw pointer positions at each step',
        'Check if the problem involves pairs or triplets',
        'Consider if sorting would help',
        'Use two pointers when you need O(1) space'
      ]
    },
    {
      id: 3,
      slug: 'sliding-window',
      title: 'Sliding Window Technique',
      description: 'Learn to solve subarray and substring problems efficiently',
      difficulty: 'Intermediate',
      estimatedTime: '1 week',
      problemCount: 30,
      topics: [
        'Fixed Window Size',
        'Variable Window Size',
        'Window with Conditions',
        'Maximum/Minimum in Window',
        'Substring Problems',
        'Frequency Counter in Window',
        'Longest/Shortest Subarray',
        'K-distinct Elements'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Sliding Window Pattern Deep Dive',
          duration: '50 min',
          description: 'Complete guide to fixed and variable window problems',
          difficulty: 'Intermediate'
        },
        {
          type: 'article',
          title: 'Template for Sliding Window Problems',
          duration: '35 min',
          description: 'Reusable template that works for most window problems',
          difficulty: 'Intermediate'
        },
        {
          type: 'video',
          title: 'Advanced Sliding Window Techniques',
          duration: '45 min',
          description: 'Handle complex conditions and multiple pointers',
          difficulty: 'Advanced'
        },
        {
          type: 'interactive',
          title: 'Window Visualization Tool',
          duration: '15 min',
          description: 'See how the window expands and contracts',
          difficulty: 'All Levels'
        }
      ],
      keyProblems: [
        { id: 81, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', mustSolve: true },
        { id: 83, title: 'Minimum Window Substring', difficulty: 'Hard', mustSolve: true },
        { id: 91, title: 'Max Consecutive Ones III', difficulty: 'Medium', mustSolve: true },
        { id: 88, title: 'Minimum Size Subarray Sum', difficulty: 'Medium', mustSolve: true },
        { id: 86, title: 'Find All Anagrams in a String', difficulty: 'Medium', mustSolve: true }
      ],
      practiceStrategy: 'Master the template first. Identify when window should expand vs contract. Use hash maps for frequency tracking.',
      commonMistakes: [
        'Not knowing when to expand vs shrink the window',
        'Incorrectly updating the frequency map',
        'Missing edge cases with empty strings',
        'Not resetting window state properly'
      ],
      tips: [
        'Keep a frequency map to track window contents',
        'Window should always be valid or actively fixing itself',
        'Use while loop to shrink window when condition breaks',
        'Track both window bounds carefully'
      ]
    },
    {
      id: 4,
      slug: 'fast-slow-pointers',
      title: 'Fast & Slow Pointers',
      description: 'Master Floyd\'s cycle detection and linked list problems',
      difficulty: 'Intermediate',
      estimatedTime: '3-4 days',
      problemCount: 15,
      topics: [
        'Cycle Detection (Floyd\'s Algorithm)',
        'Finding Middle Element',
        'Palindrome Detection',
        'Cycle Start Point',
        'LinkedList Intersection',
        'Reordering Lists',
        'Finding Nth Node from End',
        'Happy Number Problem'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Floyd\'s Cycle Detection Algorithm',
          duration: '40 min',
          description: 'Mathematical proof and implementation',
          difficulty: 'Intermediate'
        },
        {
          type: 'article',
          title: 'Fast & Slow Pointers Applications',
          duration: '30 min',
          description: 'All use cases of the tortoise and hare algorithm',
          difficulty: 'Intermediate'
        },
        {
          type: 'interactive',
          title: 'Cycle Detection Visualizer',
          duration: '20 min',
          description: 'See pointers moving through linked lists',
          difficulty: 'All Levels'
        }
      ],
      keyProblems: [
        { id: 112, title: 'Detect Cycle in LinkedList', difficulty: 'Easy', mustSolve: true },
        { id: 113, title: 'Start of Cycle in LinkedList', difficulty: 'Medium', mustSolve: true },
        { id: 111, title: 'Find the Middle Node', difficulty: 'Easy', mustSolve: true },
        { id: 117, title: 'Palindrome Linked List', difficulty: 'Easy', mustSolve: true },
        { id: 115, title: 'Happy Number', difficulty: 'Easy', mustSolve: true }
      ],
      practiceStrategy: 'Understand why fast pointer moves twice as fast. Draw diagrams to visualize pointer movements in cycles.',
      commonMistakes: [
        'Not handling null pointers correctly',
        'Wrong speed ratio for pointers',
        'Not finding cycle start correctly',
        'Modifying the list when it should be preserved'
      ],
      tips: [
        'Fast moves 2x, slow moves 1x for cycle detection',
        'To find middle, fast moves 2x until end',
        'After cycle detected, reset one pointer to start',
        'Always check for null before accessing next'
      ]
    },
    {
      id: 5,
      slug: 'linked-list',
      title: 'Linked List Mastery',
      description: 'Master all linked list operations and patterns',
      difficulty: 'Beginner to Advanced',
      estimatedTime: '1 week',
      problemCount: 25,
      topics: [
        'List Reversal',
        'Merging Lists',
        'List Reordering',
        'Detecting Cycles',
        'List Intersection',
        'Removing Nodes',
        'Copying Lists',
        'Doubly Linked Lists'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Linked List Fundamentals',
          duration: '45 min',
          description: 'Singly and doubly linked lists from scratch',
          difficulty: 'Beginner'
        },
        {
          type: 'article',
          title: 'Pointer Manipulation Techniques',
          duration: '40 min',
          description: 'Master the art of pointer updates',
          difficulty: 'Intermediate'
        },
        {
          type: 'video',
          title: 'Advanced Linked List Problems',
          duration: '55 min',
          description: 'LRU Cache, skip lists, and more',
          difficulty: 'Advanced'
        }
      ],
      keyProblems: [
        { id: 126, title: 'Reverse Linked List', difficulty: 'Easy', mustSolve: true },
        { id: 128, title: 'Reverse Nodes in k-Group', difficulty: 'Hard', mustSolve: true },
        { id: 133, title: 'Merge K Sorted Lists', difficulty: 'Hard', mustSolve: true },
        { id: 134, title: 'Copy List with Random Pointer', difficulty: 'Medium', mustSolve: true },
        { id: 144, title: 'LRU Cache', difficulty: 'Medium', mustSolve: true }
      ],
      practiceStrategy: 'Draw out the pointer changes before coding. Practice reversing lists until it becomes second nature.',
      commonMistakes: [
        'Losing reference to nodes during reversal',
        'Not handling edge cases (empty, single node)',
        'Memory leaks in languages without garbage collection',
        'Not updating all necessary pointers'
      ],
      tips: [
        'Use dummy node to simplify edge cases',
        'Draw the pointer changes on paper first',
        'Keep track of prev, curr, and next',
        'Test with lists of length 0, 1, and 2'
      ]
    },
    {
      id: 6,
      slug: 'stack',
      title: 'Stack & Monotonic Stack',
      description: 'Master stack-based solutions and monotonic stack pattern',
      difficulty: 'Beginner to Advanced',
      estimatedTime: '1 week',
      problemCount: 30,
      topics: [
        'Basic Stack Operations',
        'Parentheses Matching',
        'Expression Evaluation',
        'Monotonic Stack',
        'Next Greater Element',
        'Histogram Problems',
        'Stack-based Parsing',
        'Min/Max Stack'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Stack Data Structure Complete Guide',
          duration: '40 min',
          description: 'LIFO principle and common applications',
          difficulty: 'Beginner'
        },
        {
          type: 'article',
          title: 'Monotonic Stack Pattern',
          duration: '45 min',
          description: 'The secret weapon for many hard problems',
          difficulty: 'Advanced'
        },
        {
          type: 'video',
          title: 'Expression Evaluation Using Stacks',
          duration: '50 min',
          description: 'Infix, postfix, and calculator problems',
          difficulty: 'Intermediate'
        }
      ],
      keyProblems: [
        { id: 151, title: 'Valid Parentheses', difficulty: 'Easy', mustSolve: true },
        { id: 153, title: 'Min Stack', difficulty: 'Easy', mustSolve: true },
        { id: 169, title: 'Daily Temperatures', difficulty: 'Medium', mustSolve: true },
        { id: 173, title: 'Largest Rectangle in Histogram', difficulty: 'Hard', mustSolve: true },
        { id: 166, title: 'Decode String', difficulty: 'Medium', mustSolve: true }
      ],
      practiceStrategy: 'Recognize when you need to track "most recent" or "waiting for match" - that\'s when stack shines.',
      commonMistakes: [
        'Not checking if stack is empty before pop',
        'Wrong order when building result from stack',
        'Not maintaining auxiliary information in stack',
        'Using stack when simpler solution exists'
      ],
      tips: [
        'Stack for "most recent unmatched" elements',
        'Monotonic stack for "next greater/smaller"',
        'Check stack.isEmpty() before stack.pop()',
        'Use stack to reverse order efficiently'
      ]
    },
    {
      id: 7,
      slug: 'binary-search',
      title: 'Binary Search & Its Variants',
      description: 'Master binary search template and all its applications',
      difficulty: 'Intermediate to Advanced',
      estimatedTime: '1-2 weeks',
      problemCount: 35,
      topics: [
        'Classic Binary Search',
        'Search in Rotated Array',
        'First/Last Occurrence',
        'Binary Search on Answer',
        'Peak Finding',
        'Search in 2D Matrix',
        'Capacity Problems',
        'Minimum Maximum Problems'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Binary Search From Scratch',
          duration: '35 min',
          description: 'The algorithm that every developer must know',
          difficulty: 'Beginner'
        },
        {
          type: 'article',
          title: 'Binary Search Template',
          duration: '40 min',
          description: 'One template to rule them all - handles all edge cases',
          difficulty: 'Intermediate'
        },
        {
          type: 'video',
          title: 'Binary Search on Answer Space',
          duration: '50 min',
          description: 'Advanced technique for optimization problems',
          difficulty: 'Advanced'
        }
      ],
      keyProblems: [
        { id: 181, title: 'Binary Search', difficulty: 'Easy', mustSolve: true },
        { id: 190, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', mustSolve: true },
        { id: 198, title: 'Koko Eating Bananas', difficulty: 'Medium', mustSolve: true },
        { id: 200, title: 'Split Array Largest Sum', difficulty: 'Hard', mustSolve: true },
        { id: 211, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', mustSolve: true }
      ],
      practiceStrategy: 'Master the template first. Learn to identify search space and feasibility function.',
      commonMistakes: [
        'Off-by-one errors in boundary conditions',
        'Infinite loops from wrong mid calculation',
        'Not handling duplicate elements',
        'Wrong return value for "not found" case'
      ],
      tips: [
        'Use left + (right - left) / 2 to avoid overflow',
        'Think about invariants: what does [left, right] represent',
        'For "binary search on answer", define feasibility check',
        'Always test with arrays of size 0, 1, 2'
      ]
    },
    {
      id: 8,
      slug: 'tree',
      title: 'Binary Trees & BST',
      description: 'Master tree traversals, BST operations, and tree-based algorithms',
      difficulty: 'Intermediate to Advanced',
      estimatedTime: '2 weeks',
      problemCount: 40,
      topics: [
        'Tree Traversals (Inorder, Preorder, Postorder)',
        'Level Order Traversal (BFS)',
        'BST Operations',
        'Path Problems',
        'Tree Construction',
        'Lowest Common Ancestor',
        'Serialization',
        'Tree DP'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Binary Trees Complete Course',
          duration: '60 min',
          description: 'Everything about binary trees in one video',
          difficulty: 'Beginner'
        },
        {
          type: 'article',
          title: 'Tree Traversal Patterns',
          duration: '45 min',
          description: 'When to use which traversal',
          difficulty: 'Intermediate'
        },
        {
          type: 'video',
          title: 'Advanced Tree Algorithms',
          duration: '55 min',
          description: 'LCA, serialization, and tree DP',
          difficulty: 'Advanced'
        },
        {
          type: 'interactive',
          title: 'Tree Visualizer',
          duration: '20 min',
          description: 'Visualize traversals and operations',
          difficulty: 'All Levels'
        }
      ],
      keyProblems: [
        { id: 216, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', mustSolve: true },
        { id: 233, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', mustSolve: true },
        { id: 232, title: 'Lowest Common Ancestor of Binary Tree', difficulty: 'Medium', mustSolve: true },
        { id: 241, title: 'Validate Binary Search Tree', difficulty: 'Medium', mustSolve: true },
        { id: 229, title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', mustSolve: true }
      ],
      practiceStrategy: 'Master recursion first. Understand when to use DFS vs BFS. Practice drawing recursion trees.',
      commonMistakes: [
        'Confusing left and right subtrees',
        'Not handling null nodes properly',
        'Wrong base case in recursion',
        'Forgetting to return values from recursive calls'
      ],
      tips: [
        'Use recursion for most tree problems',
        'BFS (level order) for level-based problems',
        'For BST, inorder gives sorted order',
        'Post-order for bottom-up calculations'
      ]
    },
    {
      id: 9,
      slug: 'graph',
      title: 'Graph Algorithms',
      description: 'Master graph traversals, shortest paths, and advanced graph algorithms',
      difficulty: 'Intermediate to Advanced',
      estimatedTime: '2 weeks',
      problemCount: 35,
      topics: [
        'Graph Representation',
        'DFS & BFS',
        'Cycle Detection',
        'Topological Sort',
        'Union Find',
        'Shortest Path (Dijkstra, Bellman-Ford)',
        'Minimum Spanning Tree',
        'Graph Coloring'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Graph Theory Fundamentals',
          duration: '50 min',
          description: 'Complete introduction to graphs',
          difficulty: 'Beginner'
        },
        {
          type: 'article',
          title: 'DFS vs BFS - When to Use Which',
          duration: '35 min',
          description: 'Complete guide to graph traversals',
          difficulty: 'Intermediate'
        },
        {
          type: 'video',
          title: 'Advanced Graph Algorithms',
          duration: '70 min',
          description: 'Dijkstra, Union-Find, and more',
          difficulty: 'Advanced'
        },
        {
          type: 'interactive',
          title: 'Graph Algorithm Visualizer',
          duration: '25 min',
          description: 'See algorithms in action',
          difficulty: 'All Levels'
        }
      ],
      keyProblems: [
        { id: 256, title: 'Number of Islands', difficulty: 'Medium', mustSolve: true },
        { id: 260, title: 'Clone Graph', difficulty: 'Medium', mustSolve: true },
        { id: 270, title: 'Course Schedule', difficulty: 'Medium', mustSolve: true },
        { id: 276, title: 'Network Delay Time', difficulty: 'Medium', mustSolve: true },
        { id: 281, title: 'Word Ladder', difficulty: 'Hard', mustSolve: true }
      ],
      practiceStrategy: 'Start with DFS/BFS mastery. Learn to model problems as graphs. Practice Union-Find separately.',
      commonMistakes: [
        'Not marking visited nodes',
        'Wrong graph representation choice',
        'Not handling disconnected components',
        'Inefficient visited tracking'
      ],
      tips: [
        'Use adjacency list for sparse graphs',
        'DFS for paths, BFS for shortest paths',
        'Mark visited to avoid infinite loops',
        'Union-Find for connectivity problems'
      ]
    },
    {
      id: 10,
      slug: 'dynamic-programming',
      title: 'Dynamic Programming',
      description: 'Master the art of breaking problems into subproblems',
      difficulty: 'Advanced',
      estimatedTime: '3-4 weeks',
      problemCount: 50,
      topics: [
        'DP Fundamentals',
        '1D DP',
        '2D DP',
        'Knapsack Problems',
        'LCS & Edit Distance',
        'DP on Strings',
        'DP on Trees',
        'State Machine DP',
        'Digit DP',
        'Bitmask DP'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Dynamic Programming from Scratch',
          duration: '90 min',
          description: 'Complete DP course - from basics to advanced',
          difficulty: 'Beginner'
        },
        {
          type: 'article',
          title: 'DP Pattern Recognition Guide',
          duration: '60 min',
          description: 'Learn to identify DP problems and choose approach',
          difficulty: 'Intermediate'
        },
        {
          type: 'video',
          title: 'Advanced DP Techniques',
          duration: '75 min',
          description: 'State optimization, dimension reduction, and more',
          difficulty: 'Advanced'
        },
        {
          type: 'practice',
          title: 'DP Problem Set - 50 Essential Problems',
          duration: '40 hours',
          description: 'Curated set covering all DP patterns',
          difficulty: 'Mixed'
        }
      ],
      keyProblems: [
        { id: 291, title: 'Climbing Stairs', difficulty: 'Easy', mustSolve: true },
        { id: 293, title: 'House Robber', difficulty: 'Medium', mustSolve: true },
        { id: 296, title: 'Coin Change', difficulty: 'Medium', mustSolve: true },
        { id: 302, title: 'Unique Paths', difficulty: 'Medium', mustSolve: true },
        { id: 308, title: 'Longest Palindromic Substring', difficulty: 'Medium', mustSolve: true },
        { id: 311, title: 'Longest Common Subsequence', difficulty: 'Medium', mustSolve: true },
        { id: 312, title: 'Edit Distance', difficulty: 'Hard', mustSolve: true }
      ],
      practiceStrategy: 'Start with 1D DP, then 2D. Learn to write recurrence relations. Practice converting recursion to DP.',
      commonMistakes: [
        'Not identifying overlapping subproblems',
        'Wrong state definition',
        'Off-by-one errors in array indexing',
        'Not considering base cases carefully'
      ],
      tips: [
        'Write recursive solution first, then memoize',
        'Clearly define what dp[i] or dp[i][j] represents',
        'Draw state transition diagram',
        'Consider if you can optimize space'
      ]
    },
    {
      id: 11,
      slug: 'backtracking',
      title: 'Backtracking',
      description: 'Master recursive exploration and constraint satisfaction problems',
      difficulty: 'Intermediate to Advanced',
      estimatedTime: '1-2 weeks',
      problemCount: 30,
      topics: [
        'Backtracking Fundamentals',
        'Permutations & Combinations',
        'Subset Generation',
        'Constraint Satisfaction',
        'Pruning Techniques',
        'N-Queens Problem',
        'Sudoku Solver',
        'Word Search'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Backtracking Algorithm Explained',
          duration: '45 min',
          description: 'Learn the decision tree approach',
          difficulty: 'Intermediate'
        },
        {
          type: 'article',
          title: 'Backtracking Template',
          duration: '35 min',
          description: 'Universal template for backtracking problems',
          difficulty: 'Intermediate'
        },
        {
          type: 'video',
          title: 'Advanced Backtracking & Pruning',
          duration: '50 min',
          description: 'Optimize your backtracking solutions',
          difficulty: 'Advanced'
        }
      ],
      keyProblems: [
        { id: 341, title: 'Subsets', difficulty: 'Medium', mustSolve: true },
        { id: 343, title: 'Permutations', difficulty: 'Medium', mustSolve: true },
        { id: 345, title: 'Combination Sum', difficulty: 'Medium', mustSolve: true },
        { id: 355, title: 'N-Queens', difficulty: 'Hard', mustSolve: true },
        { id: 357, title: 'Sudoku Solver', difficulty: 'Hard', mustSolve: true }
      ],
      practiceStrategy: 'Draw decision trees. Understand the choose-explore-unchoose pattern. Practice identifying when to prune.',
      commonMistakes: [
        'Not backtracking (not undoing choices)',
        'Modifying shared state incorrectly',
        'Not handling duplicate elements',
        'Inefficient pruning or no pruning at all'
      ],
      tips: [
        'Draw the decision tree first',
        'Remember to backtrack (undo changes)',
        'Use visited set or array to track state',
        'Add pruning conditions early'
      ]
    },
    {
      id: 12,
      slug: 'heap',
      title: 'Heap & Priority Queue',
      description: 'Master heap operations and priority queue patterns',
      difficulty: 'Intermediate',
      estimatedTime: '1 week',
      problemCount: 20,
      topics: [
        'Min Heap & Max Heap',
        'Heap Operations',
        'K-th Largest/Smallest',
        'Top K Elements',
        'Merge K Sorted',
        'Median Maintenance',
        'Scheduling Problems',
        'Meeting Rooms'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Heap Data Structure Complete Guide',
          duration: '40 min',
          description: 'Binary heap implementation and operations',
          difficulty: 'Intermediate'
        },
        {
          type: 'article',
          title: 'When to Use a Heap',
          duration: '30 min',
          description: 'Pattern recognition for heap problems',
          difficulty: 'Intermediate'
        },
        {
          type: 'video',
          title: 'Advanced Heap Applications',
          duration: '45 min',
          description: 'Two heaps, lazy deletion, and more',
          difficulty: 'Advanced'
        }
      ],
      keyProblems: [
        { id: 371, title: 'Kth Largest Element in an Array', difficulty: 'Medium', mustSolve: true },
        { id: 375, title: 'K Closest Points to Origin', difficulty: 'Medium', mustSolve: true },
        { id: 381, title: 'Merge K Sorted Lists', difficulty: 'Hard', mustSolve: true },
        { id: 382, title: 'Find Median from Data Stream', difficulty: 'Hard', mustSolve: true },
        { id: 380, title: 'Task Scheduler', difficulty: 'Medium', mustSolve: true }
      ],
      practiceStrategy: 'Understand heap invariant. Learn when min heap vs max heap. Practice two heap pattern for median.',
      commonMistakes: [
        'Using wrong heap type (min vs max)',
        'Not maintaining heap property',
        'Inefficient heap operations',
        'Not considering custom comparators'
      ],
      tips: [
        'Use heap when you need min/max repeatedly',
        'Two heaps for median problems',
        'Heap size K for "top K" problems',
        'Consider lazy deletion for efficiency'
      ]
    },
    {
      id: 13,
      slug: 'trie',
      title: 'Trie (Prefix Tree)',
      description: 'Master trie data structure for string problems',
      difficulty: 'Intermediate to Advanced',
      estimatedTime: '3-4 days',
      problemCount: 15,
      topics: [
        'Trie Construction',
        'Prefix Search',
        'Word Search',
        'Autocomplete',
        'XOR Trie',
        'Suffix Trie',
        'Word Break Problems',
        'Dictionary Problems'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Trie Data Structure Explained',
          duration: '35 min',
          description: 'Implementation and common operations',
          difficulty: 'Intermediate'
        },
        {
          type: 'article',
          title: 'Trie Applications',
          duration: '30 min',
          description: 'When and why to use a trie',
          difficulty: 'Intermediate'
        },
        {
          type: 'video',
          title: 'Advanced Trie Algorithms',
          duration: '40 min',
          description: 'XOR trie, compressed trie, and more',
          difficulty: 'Advanced'
        }
      ],
      keyProblems: [
        { id: 391, title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', mustSolve: true },
        { id: 392, title: 'Design Add and Search Words', difficulty: 'Medium', mustSolve: true },
        { id: 397, title: 'Word Search II', difficulty: 'Hard', mustSolve: true },
        { id: 402, title: 'Maximum XOR of Two Numbers', difficulty: 'Medium', mustSolve: true }
      ],
      practiceStrategy: 'Understand trie structure. Practice building trie from scratch. Learn XOR trie for bit manipulation problems.',
      commonMistakes: [
        'Memory inefficiency in implementation',
        'Not handling word endings correctly',
        'Wrong traversal logic',
        'Not considering space optimization'
      ],
      tips: [
        'Each node represents a character',
        'Mark word endings with a flag',
        'Use DFS for word search problems',
        'Consider space-time tradeoffs'
      ]
    },
    {
      id: 14,
      slug: 'greedy',
      title: 'Greedy Algorithms',
      description: 'Master greedy choice property and optimization problems',
      difficulty: 'Intermediate to Advanced',
      estimatedTime: '1 week',
      problemCount: 20,
      topics: [
        'Greedy Fundamentals',
        'Activity Selection',
        'Interval Problems',
        'Jump Game',
        'Gas Station',
        'Task Scheduling',
        'Huffman Coding',
        'Fractional Knapsack'
      ],
      studyMaterials: [
        {
          type: 'video',
          title: 'Greedy Algorithms Masterclass',
          duration: '50 min',
          description: 'When greedy works and when it doesn\'t',
          difficulty: 'Intermediate'
        },
        {
          type: 'article',
          title: 'Proving Greedy Correctness',
          duration: '40 min',
          description: 'Learn to verify your greedy approach',
          difficulty: 'Advanced'
        },
        {
          type: 'practice',
          title: '15 Classic Greedy Problems',
          duration: '6 hours',
          description: 'Essential greedy problem patterns',
          difficulty: 'Mixed'
        }
      ],
      keyProblems: [
        { id: 406, title: 'Jump Game', difficulty: 'Medium', mustSolve: true },
        { id: 407, title: 'Jump Game II', difficulty: 'Medium', mustSolve: true },
        { id: 408, title: 'Gas Station', difficulty: 'Medium', mustSolve: true },
        { id: 411, title: 'Partition Labels', difficulty: 'Medium', mustSolve: true },
        { id: 412, title: 'Non-overlapping Intervals', difficulty: 'Medium', mustSolve: true }
      ],
      practiceStrategy: 'Learn to identify greedy choice property. Practice proving correctness. Compare with DP solutions.',
      commonMistakes: [
        'Applying greedy when it doesn\'t work',
        'Wrong sorting criteria',
        'Not considering all edge cases',
        'Not proving correctness'
      ],
      tips: [
        'Sort the input first (often)',
        'Make locally optimal choice',
        'Verify greedy works with small examples',
        'If greedy feels wrong, try DP'
      ]
    }
  ],

  resources: {
    books: [
      {
        title: 'Introduction to Algorithms (CLRS)',
        author: 'Cormen, Leiserson, Rivest, Stein',
        difficulty: 'Advanced',
        topics: ['All DSA Topics'],
        description: 'The definitive computer science textbook'
      },
      {
        title: 'Cracking the Coding Interview',
        author: 'Gayle Laakmann McDowell',
        difficulty: 'Intermediate',
        topics: ['Interview Preparation'],
        description: '189 programming questions and solutions'
      },
      {
        title: 'Elements of Programming Interviews',
        author: 'Aziz, Lee, Prakash',
        difficulty: 'Advanced',
        topics: ['Interview Problems'],
        description: 'Comprehensive interview preparation'
      },
      {
        title: 'Algorithm Design Manual',
        author: 'Steven Skiena',
        difficulty: 'Intermediate',
        topics: ['Algorithm Design'],
        description: 'Practical approach to algorithms'
      }
    ],
    websites: [
      {
        name: 'LeetCode',
        url: 'https://leetcode.com',
        type: 'Practice Platform',
        description: 'Best platform for interview preparation'
      },
      {
        name: 'GeeksforGeeks',
        url: 'https://www.geeksforgeeks.org',
        type: 'Tutorials',
        description: 'Comprehensive tutorials and articles'
      },
      {
        name: 'Visualgo',
        url: 'https://visualgo.net',
        type: 'Visualization',
        description: 'Algorithm visualizations'
      },
      {
        name: 'Big-O Cheat Sheet',
        url: 'https://www.bigocheatsheet.com',
        type: 'Reference',
        description: 'Time and space complexity reference'
      }
    ],
    videos: [
      {
        title: 'MIT 6.006 Introduction to Algorithms',
        platform: 'YouTube',
        instructor: 'MIT OpenCourseWare',
        duration: '24 lectures',
        difficulty: 'Advanced'
      },
      {
        title: 'CS50 Algorithms',
        platform: 'YouTube',
        instructor: 'Harvard University',
        duration: '10 lectures',
        difficulty: 'Beginner'
      }
    ]
  },

  tips: {
    general: [
      'Solve problems consistently every day',
      'Focus on understanding patterns, not memorizing solutions',
      'Always analyze time and space complexity',
      'Start with brute force, then optimize',
      'Practice explaining your solution out loud',
      'Review problems you couldn\'t solve',
      'Track your progress and weak areas'
    ],
    beforeInterview: [
      'Review key patterns one week before',
      'Do mock interviews with peers',
      'Practice on a whiteboard or paper',
      'Time yourself while solving',
      'Prepare questions to ask interviewers',
      'Sleep well the night before'
    ],
    duringInterview: [
      'Ask clarifying questions',
      'Explain your thought process',
      'Start with brute force',
      'Consider edge cases',
      'Test with examples',
      'Communicate complexity analysis'
    ]
  },

  faqs: [
    {
      question: 'How long will it take to complete this path?',
      answer: 'Typically 12-16 weeks with 10-15 hours per week. However, it depends on your experience level and pace.'
    },
    {
      question: 'Do I need to solve all 425 problems?',
      answer: 'Focus on understanding patterns first. Solve the "must-solve" problems in each module, then practice more based on your needs.'
    },
    {
      question: 'What programming language should I use?',
      answer: 'Use the language you\'re most comfortable with. Python, Java, and C++ are most common for interviews.'
    },
    {
      question: 'How do I know if I\'m ready for interviews?',
      answer: 'When you can solve most Medium problems in 30-45 minutes and identify patterns quickly, you\'re ready.'
    },
    {
      question: 'Should I learn all patterns or focus on a few?',
      answer: 'Master the first 8 patterns thoroughly. They cover 80% of interview problems.'
    }
  ]
};

// Function to get problems for a specific module
export const getModuleProblems = (moduleSlug) => {
  const module = dsaLearningPath.modules.find(m => m.slug === moduleSlug);
  if (!module) return [];
  
  return all425Problems.filter(p => {
    const pattern = p.pattern.toLowerCase().replace(/[&\s]/g, '-');
    return pattern.includes(moduleSlug) || moduleSlug.includes(pattern);
  });
};

// Function to get progress for a module
export const getModuleProgress = (moduleSlug, userProgress) => {
  const problems = getModuleProblems(moduleSlug);
  const solved = problems.filter(p => userProgress[`problem_${p.id}`]?.solved).length;
  
  return {
    total: problems.length,
    solved,
    percentage: problems.length > 0 ? Math.round((solved / problems.length) * 100) : 0
  };
};

export default dsaLearningPath;
