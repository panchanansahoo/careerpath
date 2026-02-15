import React, { useState } from 'react';
import { CheckCircle2, Circle, ExternalLink, X, ChevronRight } from 'lucide-react';

const roadmapData = [
    {
        id: 'arrays',
        title: 'Arrays & Hashing',
        problems: [
            { id: 1, title: 'Contains Duplicate', difficulty: 'Easy', link: 'https://leetcode.com/problems/contains-duplicate/' },
            { id: 2, title: 'Valid Anagram', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-anagram/' },
            { id: 3, title: 'Two Sum', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum/' },
            { id: 4, title: 'Group Anagrams', difficulty: 'Medium', link: 'https://leetcode.com/problems/group-anagrams/' },
            { id: 5, title: 'Top K Frequent Elements', difficulty: 'Medium', link: 'https://leetcode.com/problems/top-k-frequent-elements/' },
            { id: 6, title: 'Product of Array Except Self', difficulty: 'Medium', link: 'https://leetcode.com/problems/product-of-array-except-self/' },
            { id: 7, title: 'Valid Sudoku', difficulty: 'Medium', link: 'https://leetcode.com/problems/valid-sudoku/' },
            { id: 8, title: 'Encode and Decode Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/encode-and-decode-strings/' },
            { id: 9, title: 'Longest Consecutive Sequence', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-consecutive-sequence/' }
        ],
        x: 50, y: 50,
        next: ['two-pointers', 'stack']
    },
    {
        id: 'two-pointers',
        title: 'Two Pointers',
        problems: [
            { id: 10, title: 'Valid Palindrome', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-palindrome/' },
            { id: 11, title: 'Two Sum II', difficulty: 'Medium', link: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
            { id: 12, title: '3Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/3sum/' },
            { id: 13, title: 'Container With Most Water', difficulty: 'Medium', link: 'https://leetcode.com/problems/container-with-most-water/' },
            { id: 14, title: 'Trapping Rain Water', difficulty: 'Hard', link: 'https://leetcode.com/problems/trapping-rain-water/' }
        ],
        x: 20, y: 200,
        next: ['binary-search', 'sliding-window', 'linked-list']
    },
    {
        id: 'stack',
        title: 'Stack',
        problems: [
            { id: 15, title: 'Valid Parentheses', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-parentheses/' },
            { id: 16, title: 'Min Stack', difficulty: 'Medium', link: 'https://leetcode.com/problems/min-stack/' },
            { id: 17, title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', link: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/' },
            { id: 18, title: 'Generate Parentheses', difficulty: 'Medium', link: 'https://leetcode.com/problems/generate-parentheses/' },
            { id: 19, title: 'Daily Temperatures', difficulty: 'Medium', link: 'https://leetcode.com/problems/daily-temperatures/' },
            { id: 20, title: 'Car Fleet', difficulty: 'Medium', link: 'https://leetcode.com/problems/car-fleet/' },
            { id: 21, title: 'Largest Rectangle in Histogram', difficulty: 'Hard', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' }
        ],
        x: 80, y: 200,
        next: []
    },
    {
        id: 'binary-search',
        title: 'Binary Search',
        problems: [
            { id: 22, title: 'Binary Search', difficulty: 'Easy', link: 'https://leetcode.com/problems/binary-search/' },
            { id: 23, title: 'Search a 2D Matrix', difficulty: 'Medium', link: 'https://leetcode.com/problems/search-a-2d-matrix/' },
            { id: 24, title: 'Koko Eating Bananas', difficulty: 'Medium', link: 'https://leetcode.com/problems/koko-eating-bananas/' },
            { id: 25, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
            { id: 26, title: 'Search in Rotated Sorted Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
            { id: 27, title: 'Time Based Key-Value Store', difficulty: 'Medium', link: 'https://leetcode.com/problems/time-based-key-value-store/' },
            { id: 28, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' }
        ],
        x: 10, y: 350,
        next: ['trees']
    },
    {
        id: 'sliding-window',
        title: 'Sliding Window',
        problems: [
            { id: 29, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
            { id: 30, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
            { id: 31, title: 'Longest Repeating Character Replacement', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
            { id: 32, title: 'Permutation in String', difficulty: 'Medium', link: 'https://leetcode.com/problems/permutation-in-string/' },
            { id: 33, title: 'Minimum Window Substring', difficulty: 'Hard', link: 'https://leetcode.com/problems/minimum-window-substring/' },
            { id: 34, title: 'Sliding Window Maximum', difficulty: 'Hard', link: 'https://leetcode.com/problems/sliding-window-maximum/' }
        ],
        x: 35, y: 350,
        next: []
    },
    {
        id: 'linked-list',
        title: 'Linked List',
        problems: [
            { id: 35, title: 'Reverse Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-linked-list/' },
            { id: 36, title: 'Merge Two Sorted Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
            { id: 37, title: 'Reorder List', difficulty: 'Medium', link: 'https://leetcode.com/problems/reorder-list/' },
            { id: 38, title: 'Remove Nth Node From End of List', difficulty: 'Medium', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
            { id: 39, title: 'Copy List with Random Pointer', difficulty: 'Medium', link: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
            { id: 40, title: 'Add Two Numbers', difficulty: 'Medium', link: 'https://leetcode.com/problems/add-two-numbers/' },
            { id: 41, title: 'Linked List Cycle', difficulty: 'Easy', link: 'https://leetcode.com/problems/linked-list-cycle/' },
            { id: 42, title: 'Find the Duplicate Number', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-the-duplicate-number/' },
            { id: 43, title: 'LRU Cache', difficulty: 'Medium', link: 'https://leetcode.com/problems/lru-cache/' },
            { id: 44, title: 'Merge k Sorted Lists', difficulty: 'Hard', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
            { id: 45, title: 'Reverse Nodes in k-Group', difficulty: 'Hard', link: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' }
        ],
        x: 60, y: 350,
        next: ['trees']
    },
    {
        id: 'trees',
        title: 'Trees',
        problems: [
            { id: 46, title: 'Invert Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/invert-binary-tree/' },
            { id: 47, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
            { id: 48, title: 'Diameter of Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
            { id: 49, title: 'Balanced Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/balanced-binary-tree/' },
            { id: 50, title: 'Same Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/same-tree/' },
            { id: 51, title: 'Subtree of Another Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/subtree-of-another-tree/' },
            { id: 52, title: 'Lowest Common Ancestor of a Binary Search Tree', difficulty: 'Medium', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
            { id: 53, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
            { id: 54, title: 'Validate Binary Search Tree', difficulty: 'Medium', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
            { id: 55, title: 'Kth Smallest Element in a BST', difficulty: 'Medium', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
            { id: 56, title: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium', link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
            { id: 57, title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
            { id: 58, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' }
        ],
        x: 50, y: 500,
        next: ['tries', 'backtracking', 'heap']
    },
    {
        id: 'tries',
        title: 'Tries',
        problems: [
            { id: 59, title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', link: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
            { id: 60, title: 'Design Add and Search Words Data Structure', difficulty: 'Medium', link: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
            { id: 61, title: 'Word Search II', difficulty: 'Hard', link: 'https://leetcode.com/problems/word-search-ii/' }
        ],
        x: 20, y: 650,
        next: []
    },
    {
        id: 'backtracking',
        title: 'Backtracking',
        problems: [
            { id: 69, title: 'Subsets', difficulty: 'Medium', link: 'https://leetcode.com/problems/subsets/' },
            { id: 70, title: 'Combination Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/combination-sum/' },
            { id: 71, title: 'Permutations', difficulty: 'Medium', link: 'https://leetcode.com/problems/permutations/' },
            { id: 72, title: 'Subsets II', difficulty: 'Medium', link: 'https://leetcode.com/problems/subsets-ii/' },
            { id: 73, title: 'Combination Sum II', difficulty: 'Medium', link: 'https://leetcode.com/problems/combination-sum-ii/' },
            { id: 74, title: 'Word Search', difficulty: 'Medium', link: 'https://leetcode.com/problems/word-search/' },
            { id: 75, title: 'Palindrome Partitioning', difficulty: 'Medium', link: 'https://leetcode.com/problems/palindrome-partitioning/' },
            { id: 76, title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', link: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
            { id: 77, title: 'N-Queens', difficulty: 'Hard', link: 'https://leetcode.com/problems/n-queens/' }
        ],
        x: 50, y: 650,
        next: ['graphs', '1d-dp']
    },
    {
        id: 'heap',
        title: 'Heap / PQ',
        problems: [
            { id: 62, title: 'Kth Largest Element in a Stream', difficulty: 'Easy', link: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/' },
            { id: 63, title: 'Last Stone Weight', difficulty: 'Easy', link: 'https://leetcode.com/problems/last-stone-weight/' },
            { id: 64, title: 'K Closest Points to Origin', difficulty: 'Medium', link: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
            { id: 65, title: 'Kth Largest Element in an Array', difficulty: 'Medium', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
            { id: 66, title: 'Task Scheduler', difficulty: 'Medium', link: 'https://leetcode.com/problems/task-scheduler/' },
            { id: 67, title: 'Design Twitter', difficulty: 'Medium', link: 'https://leetcode.com/problems/design-twitter/' },
            { id: 68, title: 'Find Median from Data Stream', difficulty: 'Hard', link: 'https://leetcode.com/problems/find-median-from-data-stream/' }
        ],
        x: 80, y: 650,
        next: ['intervals', 'greedy', 'advanced-graphs']
    },
    {
        id: 'graphs',
        title: 'Graphs',
        problems: [
            { id: 78, title: 'Number of Islands', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-islands/' },
            { id: 79, title: 'Max Area of Island', difficulty: 'Medium', link: 'https://leetcode.com/problems/max-area-of-island/' },
            { id: 80, title: 'Clone Graph', difficulty: 'Medium', link: 'https://leetcode.com/problems/clone-graph/' },
            { id: 81, title: 'Walls and Gates', difficulty: 'Medium', link: 'https://leetcode.com/problems/walls-and-gates/' },
            { id: 82, title: 'Rotting Oranges', difficulty: 'Medium', link: 'https://leetcode.com/problems/rotting-oranges/' },
            { id: 83, title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', link: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
            { id: 84, title: 'Surrounded Regions', difficulty: 'Medium', link: 'https://leetcode.com/problems/surrounded-regions/' },
            { id: 85, title: 'Course Schedule', difficulty: 'Medium', link: 'https://leetcode.com/problems/course-schedule/' },
            { id: 86, title: 'Course Schedule II', difficulty: 'Medium', link: 'https://leetcode.com/problems/course-schedule-ii/' },
            { id: 87, title: 'Graph Valid Tree', difficulty: 'Medium', link: 'https://leetcode.com/problems/graph-valid-tree/' },
            { id: 88, title: 'Number of Connected Components in an Undirected Graph', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
            { id: 89, title: 'Redundant Connection', difficulty: 'Medium', link: 'https://leetcode.com/problems/redundant-connection/' },
            { id: 90, title: 'Word Ladder', difficulty: 'Hard', link: 'https://leetcode.com/problems/word-ladder/' }
        ],
        x: 35, y: 800,
        next: ['math', 'bit-manipulation']
    },
    {
        id: '1d-dp',
        title: '1-D DP',
        problems: [
            { id: 91, title: 'Climbing Stairs', difficulty: 'Easy', link: 'https://leetcode.com/problems/climbing-stairs/' },
            { id: 92, title: 'Min Cost Climbing Stairs', difficulty: 'Easy', link: 'https://leetcode.com/problems/min-cost-climbing-stairs/' },
            { id: 93, title: 'House Robber', difficulty: 'Medium', link: 'https://leetcode.com/problems/house-robber/' },
            { id: 94, title: 'House Robber II', difficulty: 'Medium', link: 'https://leetcode.com/problems/house-robber-ii/' },
            { id: 95, title: 'Longest Palindromic Substring', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
            { id: 96, title: 'Palindromic Substrings', difficulty: 'Medium', link: 'https://leetcode.com/problems/palindromic-substrings/' },
            { id: 97, title: 'Decode Ways', difficulty: 'Medium', link: 'https://leetcode.com/problems/decode-ways/' },
            { id: 98, title: 'Coin Change', difficulty: 'Medium', link: 'https://leetcode.com/problems/coin-change/' },
            { id: 99, title: 'Maximum Product Subarray', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-product-subarray/' },
            { id: 100, title: 'Word Break', difficulty: 'Medium', link: 'https://leetcode.com/problems/word-break/' },
            { id: 101, title: 'Longest Increasing Subsequence', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
            { id: 102, title: 'Partition Equal Subset Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/partition-equal-subset-sum/' }
        ],
        x: 65, y: 800,
        next: ['2d-dp']
    },
    {
        id: 'intervals',
        title: 'Intervals',
        problems: [
            { id: 103, title: 'Insert Interval', difficulty: 'Medium', link: 'https://leetcode.com/problems/insert-interval/' },
            { id: 104, title: 'Merge Intervals', difficulty: 'Medium', link: 'https://leetcode.com/problems/merge-intervals/' },
            { id: 105, title: 'Non-overlapping Intervals', difficulty: 'Medium', link: 'https://leetcode.com/problems/non-overlapping-intervals/' },
            { id: 106, title: 'Meeting Rooms', difficulty: 'Easy', link: 'https://leetcode.com/problems/meeting-rooms/' },
            { id: 107, title: 'Meeting Rooms II', difficulty: 'Medium', link: 'https://leetcode.com/problems/meeting-rooms-ii/' },
            { id: 108, title: 'Minimum Interval to Include Each Query', difficulty: 'Hard', link: 'https://leetcode.com/problems/minimum-interval-to-include-each-query/' }
        ],
        x: 80, y: 750,
        next: []
    },
    {
        id: 'greedy',
        title: 'Greedy',
        problems: [
            { id: 109, title: 'Maximum Subarray', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-subarray/' },
            { id: 110, title: 'Jump Game', difficulty: 'Medium', link: 'https://leetcode.com/problems/jump-game/' },
            { id: 111, title: 'Jump Game II', difficulty: 'Medium', link: 'https://leetcode.com/problems/jump-game-ii/' },
            { id: 112, title: 'Gas Station', difficulty: 'Medium', link: 'https://leetcode.com/problems/gas-station/' },
            { id: 113, title: 'Hand of Straights', difficulty: 'Medium', link: 'https://leetcode.com/problems/hand-of-straights/' },
            { id: 114, title: 'Merge Triplets to Form Target Triplet', difficulty: 'Medium', link: 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/' },
            { id: 115, title: 'Partition Labels', difficulty: 'Medium', link: 'https://leetcode.com/problems/partition-labels/' },
            { id: 116, title: 'Valid Parenthesis String', difficulty: 'Medium', link: 'https://leetcode.com/problems/valid-parenthesis-string/' }
        ],
        x: 90, y: 800,
        next: []
    },
    {
        id: 'advanced-graphs',
        title: 'Adv Graphs',
        problems: [
            { id: 117, title: 'Reconstruct Itinerary', difficulty: 'Hard', link: 'https://leetcode.com/problems/reconstruct-itinerary/' },
            { id: 118, title: 'Min Cost to Connect All Points', difficulty: 'Medium', link: 'https://leetcode.com/problems/min-cost-to-connect-all-points/' },
            { id: 119, title: 'Network Delay Time', difficulty: 'Medium', link: 'https://leetcode.com/problems/network-delay-time/' },
            { id: 120, title: 'Swim in Rising Water', difficulty: 'Hard', link: 'https://leetcode.com/problems/swim-in-rising-water/' },
            { id: 121, title: 'Alien Dictionary', difficulty: 'Hard', link: 'https://leetcode.com/problems/alien-dictionary/' },
            { id: 122, title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', link: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' }
        ],
        x: 90, y: 900,
        next: []
    },
    {
        id: '2d-dp',
        title: '2-D DP',
        problems: [
            { id: 123, title: 'Unique Paths', difficulty: 'Medium', link: 'https://leetcode.com/problems/unique-paths/' },
            { id: 124, title: 'Longest Common Subsequence', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-common-subsequence/' },
            { id: 125, title: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'Medium', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/' },
            { id: 126, title: 'Coin Change II', difficulty: 'Medium', link: 'https://leetcode.com/problems/coin-change-ii/' },
            { id: 127, title: 'Target Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/target-sum/' },
            { id: 128, title: 'Interleaving String', difficulty: 'Medium', link: 'https://leetcode.com/problems/interleaving-string/' },
            { id: 129, title: 'Longest Increasing Path in a Matrix', difficulty: 'Hard', link: 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/' },
            { id: 130, title: 'Distinct Subsequences', difficulty: 'Hard', link: 'https://leetcode.com/problems/distinct-subsequences/' },
            { id: 131, title: 'Edit Distance', difficulty: 'Hard', link: 'https://leetcode.com/problems/edit-distance/' },
            { id: 132, title: 'Burst Balloons', difficulty: 'Hard', link: 'https://leetcode.com/problems/burst-balloons/' },
            { id: 133, title: 'Regular Expression Matching', difficulty: 'Hard', link: 'https://leetcode.com/problems/regular-expression-matching/' }
        ],
        x: 65, y: 950,
        next: []
    },
    {
        id: 'bit-manipulation',
        title: 'Bit Manipulation',
        problems: [
            { id: 134, title: 'Single Number', difficulty: 'Easy', link: 'https://leetcode.com/problems/single-number/' },
            { id: 135, title: 'Number of 1 Bits', difficulty: 'Easy', link: 'https://leetcode.com/problems/number-of-1-bits/' },
            { id: 136, title: 'Counting Bits', difficulty: 'Easy', link: 'https://leetcode.com/problems/counting-bits/' },
            { id: 137, title: 'Reverse Bits', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-bits/' },
            { id: 138, title: 'Missing Number', difficulty: 'Easy', link: 'https://leetcode.com/problems/missing-number/' },
            { id: 139, title: 'Sum of Two Integers', difficulty: 'Medium', link: 'https://leetcode.com/problems/sum-of-two-integers/' },
            { id: 140, title: 'Reverse Integer', difficulty: 'Medium', link: 'https://leetcode.com/problems/reverse-integer/' }
        ],
        x: 45, y: 950,
        next: []
    },
    {
        id: 'math',
        title: 'Math & Geometry',
        problems: [
            { id: 141, title: 'Rotate Image', difficulty: 'Medium', link: 'https://leetcode.com/problems/rotate-image/' },
            { id: 142, title: 'Spiral Matrix', difficulty: 'Medium', link: 'https://leetcode.com/problems/spiral-matrix/' },
            { id: 143, title: 'Set Matrix Zeroes', difficulty: 'Medium', link: 'https://leetcode.com/problems/set-matrix-zeroes/' },
            { id: 144, title: 'Happy Number', difficulty: 'Easy', link: 'https://leetcode.com/problems/happy-number/' },
            { id: 145, title: 'Plus One', difficulty: 'Easy', link: 'https://leetcode.com/problems/plus-one/' },
            { id: 146, title: 'Pow(x, n)', difficulty: 'Medium', link: 'https://leetcode.com/problems/powx-n/' },
            { id: 147, title: 'Multiply Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/multiply-strings/' },
            { id: 148, title: 'Detect Squares', difficulty: 'Medium', link: 'https://leetcode.com/problems/detect-squares/' }
        ],
        x: 25, y: 950,
        next: []
    }
];

// Helper to draw orthogonal "circuit-like" connections
const ConnectionPath = ({ start, end }) => {
    // We are using a viewBox of 0 0 100 1200
    // x is 0-100, y is pixels (0-1200)
    
    // Orthogonal Path Logic:
    // 1. Move to Start (x1, y1)
    // 2. Line to vertical midpoint (x1, midY)
    // 3. Line to horizontal target (x2, midY)
    // 4. Line to End (x2, y2)
    
    const x1 = start.x;
    const y1 = start.y;
    const x2 = end.x;
    const y2 = end.y;
    
    // Calculate midpoint for the bend
    const midY = y1 + (y2 - y1) / 2;
    
    // path d attribute
    const pathD = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;

    return (
       <g>
         {/* Glow effect */}
         <path 
            d={pathD}
            stroke="rgba(99, 102, 241, 0.5)" // Indigo-500 optimized for glow
            strokeWidth="3"     // Thicker for glow
            fill="none"
            className="blur-[3px]"
            vectorEffect="non-scaling-stroke" // Keep stroke width constant despite scaling
         />
         {/* Main Line */}
         <path 
            d={pathD}
            stroke="url(#lineGradient)"
            strokeWidth="2"
            fill="none"
            strokeLinejoin="round" // Rounded corners
            strokeLinecap="round"
            className="opacity-90"
            vectorEffect="non-scaling-stroke"
        />
       </g>
    );
};

export default function Roadmap() {
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [completedProblems, setCompletedProblems] = useState([]);

    const toggleProblem = (id) => {
        if (completedProblems.includes(id)) {
            setCompletedProblems(completedProblems.filter(pId => pId !== id));
        } else {
            setCompletedProblems([...completedProblems, id]);
        }
    };

    return (
        <div className="min-h-screen bg-[#020203] overflow-x-hidden text-white pt-24 pb-20 font-sans selection:bg-purple-500/30">
             <header className="mb-12 text-center px-4">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        LeetCode Roadmap
                    </span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    A comprehensive, interactive roadmap to ace your technical interviews.
                    <br />
                    <span className="text-sm text-gray-500">Based on the NeetCode 150 list.</span>
                </p>
            </header>

            <div className="relative w-full max-w-7xl mx-auto px-4 overflow-auto custom-scrollbar pb-20" style={{ height: '1200px' }}>
                <div className="relative w-full h-full min-w-[1000px] pl-10 pr-10">
                    
                    {/* SVG Layer */}
                    <svg 
                        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
                        viewBox="0 0 100 1200"
                        preserveAspectRatio="none"
                    >
                         <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#818cf8" />    {/* Indigo-400 */}
                                <stop offset="100%" stopColor="#c084fc" />   {/* Purple-400 */}
                            </linearGradient>
                        </defs>
                        {roadmapData.map(node => 
                            node.next.map(nextId => {
                                const nextNode = roadmapData.find(n => n.id === nextId);
                                if (!nextNode) return null;
                                return <ConnectionPath key={`${node.id}-${nextId}`} start={node} end={nextNode} />;
                            })
                        )}
                    </svg>

                    {/* Nodes Layer */}
                    {roadmapData.map((topic) => {
                        const completedCount = topic.problems.filter(p => completedProblems.includes(p.id)).length;
                        const isCompleted = completedCount === topic.problems.length && topic.problems.length > 0;
                        
                        return (
                            <div 
                                key={topic.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                                style={{ left: `${topic.x}%`, top: `${topic.y}px`, width: '180px' }}
                                onClick={() => setSelectedTopic(topic)}
                            >
                                <div className={`
                                    relative p-3 rounded-lg border transition-all duration-200 group
                                    ${isCompleted
                                        ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20'
                                        : 'bg-[#121216] border-white/10 hover:border-white/30 hover:bg-white/5'
                                    }
                                `}>
                                    <div className="text-center">
                                        <h3 className={`font-semibold text-sm ${isCompleted ? 'text-green-400' : 'text-gray-200 group-hover:text-white'}`}>
                                            {topic.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal */}
            {selectedTopic && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-[#0a0a0c] border border-white/10 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col scale-100 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#121216]">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {selectedTopic.title}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5 font-medium">
                                    {selectedTopic.problems.length} Challenges
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedTopic(null)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-400 hover:text-white" />
                            </button>
                        </div>

                        <div className="p-0 overflow-y-auto custom-scrollbar flex-1 bg-[#0a0a0c]">
                            <div className="divide-y divide-white/5">
                                {selectedTopic.problems.map((problem) => (
                                    <div
                                        key={problem.id}
                                        className="flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors group"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <button
                                                onClick={() => toggleProblem(problem.id)}
                                                className={`transition-colors ${completedProblems.includes(problem.id) ? 'text-green-500' : 'text-gray-600 hover:text-gray-400'}`}
                                            >
                                                {completedProblems.includes(problem.id) ? (
                                                    <CheckCircle2 size={20} className="fill-green-500/10" />
                                                ) : (
                                                    <Circle size={20} />
                                                )}
                                            </button>
                                            <a
                                                href={problem.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`text-sm font-medium transition-colors hover:underline underline-offset-4 decoration-white/20 ${completedProblems.includes(problem.id) ? 'text-gray-500' : 'text-gray-200 group-hover:text-white'}`}
                                            >
                                                {problem.title}
                                            </a>
                                        </div>

                                        <div className="flex items-center gap-3 pl-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${problem.difficulty === 'Easy' ? 'border-green-500/20 text-green-500 bg-green-500/5' :
                                                    problem.difficulty === 'Medium' ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5' :
                                                        'border-red-500/20 text-red-500 bg-red-500/5'
                                                }`}>
                                                {problem.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/10 bg-[#121216]">
                            <div className="flex justify-between items-center text-xs text-gray-400 font-medium mb-2">
                                <span>Progress</span>
                                <span>{Math.round((selectedTopic.problems.filter(p => completedProblems.includes(p.id)).length / selectedTopic.problems.length) * 100)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 transition-all duration-300"
                                    style={{
                                        width: `${(selectedTopic.problems.filter(p => completedProblems.includes(p.id)).length / selectedTopic.problems.length) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
