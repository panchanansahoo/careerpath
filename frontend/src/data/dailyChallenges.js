import { Globe, Server, Cloud, Code, Database, Cpu, Shield, Smartphone, PenTool, Radio } from 'lucide-react';

export const dailyChallenges = [
    {
        id: 'google',
        name: 'Google',
        type: 'Product',
        icon: Globe,
        color: 'text-blue-400',
        dsa: [
            { title: 'Two Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/' },
            { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
            { title: 'Longest Palindromic Substring', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-palindromic-substring/' },
            { title: 'Container With Most Water', difficulty: 'Medium', url: 'https://leetcode.com/problems/container-with-most-water/' },
            { title: 'Merge k Sorted Lists', difficulty: 'Hard', url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
        ],
        sql: [
            { title: 'Big Countries', difficulty: 'Easy', url: 'https://leetcode.com/problems/big-countries/' },
            { title: 'Second Highest Salary', difficulty: 'Medium', url: 'https://leetcode.com/problems/second-highest-salary/' },
            { title: 'Nth Highest Salary', difficulty: 'Medium', url: 'https://leetcode.com/problems/nth-highest-salary/' },
            { title: 'Rank Scores', difficulty: 'Medium', url: 'https://leetcode.com/problems/rank-scores/' },
            { title: 'Consecutive Numbers', difficulty: 'Medium', url: 'https://leetcode.com/problems/consecutive-numbers/' },
        ]
    },
    {
        id: 'microsoft',
        name: 'Microsoft',
        type: 'Product',
        icon: Server,
        color: 'text-sky-400',
        dsa: [
            { title: 'Valid Parentheses', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-parentheses/' },
            { title: 'Merge Two Sorted Lists', difficulty: 'Easy', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
            { title: 'Group Anagrams', difficulty: 'Medium', url: 'https://leetcode.com/problems/group-anagrams/' },
            { title: 'Spiral Matrix', difficulty: 'Medium', url: 'https://leetcode.com/problems/spiral-matrix/' },
            { title: 'Reverse Nodes in k-Group', difficulty: 'Hard', url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
        ],
        sql: [
            { title: 'Combine Two Tables', difficulty: 'Easy', url: 'https://leetcode.com/problems/combine-two-tables/' },
            { title: 'Employees Earning More Than Their Managers', difficulty: 'Easy', url: 'https://leetcode.com/problems/employees-earning-more-than-their-managers/' },
            { title: 'Duplicate Emails', difficulty: 'Easy', url: 'https://leetcode.com/problems/duplicate-emails/' },
            { title: 'Department Top Three Salaries', difficulty: 'Hard', url: 'https://leetcode.com/problems/department-top-three-salaries/' },
            { title: 'Trips and Users', difficulty: 'Hard', url: 'https://leetcode.com/problems/trips-and-users/' },
        ]
    },
    {
        id: 'amazon',
        name: 'Amazon',
        type: 'Product',
        icon: Cloud,
        color: 'text-orange-400',
        dsa: [
            { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
            { title: '3Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum/' },
            { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
            { title: 'Word Ladder', difficulty: 'Hard', url: 'https://leetcode.com/problems/word-ladder/' },
            { title: 'LRU Cache', difficulty: 'Medium', url: 'https://leetcode.com/problems/lru-cache/' },
        ],
        sql: [
            { title: 'Delete Duplicate Emails', difficulty: 'Easy', url: 'https://leetcode.com/problems/delete-duplicate-emails/' },
            { title: 'Rising Temperature', difficulty: 'Easy', url: 'https://leetcode.com/problems/rising-temperature/' },
            { title: 'Game Play Analysis I', difficulty: 'Easy', url: 'https://leetcode.com/problems/game-play-analysis-i/' },
            { title: 'Market Analysis I', difficulty: 'Medium', url: 'https://leetcode.com/problems/market-analysis-i/' },
            { title: 'Capital Gain/Loss', difficulty: 'Medium', url: 'https://leetcode.com/problems/capital-gainloss/' },
        ]
    },
    {
        id: 'tcs',
        name: 'TCS',
        type: 'Service',
        icon: Code,
        color: 'text-indigo-400',
        dsa: [
            { title: 'Reverse Integer', difficulty: 'Medium', url: 'https://leetcode.com/problems/reverse-integer/' },
            { title: 'Palindrome Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/palindrome-number/' },
            { title: 'Fibonacci Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/fibonacci-number/' },
            { title: 'Climbing Stairs', difficulty: 'Easy', url: 'https://leetcode.com/problems/climbing-stairs/' },
            { title: 'Power of Two', difficulty: 'Easy', url: 'https://leetcode.com/problems/power-of-two/' },
        ],
        sql: [
            { title: 'Select All', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/select-all-sql/problem' },
            { title: 'Revising the Select Query I', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/revising-the-select-query/problem' },
            { title: 'Japanese Cities Names', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/japanese-cities-name/problem' },
            { title: 'Weather Observation Station 1', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/weather-observation-station-1/problem' },
            { title: 'Employee Salaries', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/salary-of-employees/problem' },
        ]
    },
    {
        id: 'infosys',
        name: 'Infosys',
        type: 'Service',
        icon: Cpu,
        color: 'text-blue-600',
        dsa: [
            { title: 'Maximum Subarray', difficulty: 'Medium', url: 'https://leetcode.com/problems/maximum-subarray/' },
            { title: 'Move Zeroes', difficulty: 'Easy', url: 'https://leetcode.com/problems/move-zeroes/' },
            { title: 'Missing Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/missing-number/' },
            { title: 'Single Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/single-number/' },
            { title: 'Intersection of Two Arrays', difficulty: 'Easy', url: 'https://leetcode.com/problems/intersection-of-two-arrays/' },
        ],
        sql: [
            { title: 'Higher Than 75 Marks', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/more-than-75-marks/problem' },
            { title: 'Employee Names', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/name-of-employees/problem' },
            { title: 'Top Earners', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/earnings-of-employees/problem' },
            { title: 'Weather Observation Station 3', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/weather-observation-station-3/problem' },
            { title: 'Occupations', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/occupations/problem' },
        ]
    },
    {
        id: 'wipro',
        name: 'Wipro',
        type: 'Service',
        icon: Database,
        color: 'text-green-500',
        dsa: [
            { title: 'Valid Anagram', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-anagram/' },
            { title: 'First Unique Character in a String', difficulty: 'Easy', url: 'https://leetcode.com/problems/first-unique-character-in-a-string/' },
            { title: 'Reverse String', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-string/' },
            { title: 'Fizz Buzz', difficulty: 'Easy', url: 'https://leetcode.com/problems/fizz-buzz/' },
            { title: 'Majority Element', difficulty: 'Easy', url: 'https://leetcode.com/problems/majority-element/' },
        ],
        sql: [
            { title: 'Average Population of Each Continent', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/average-population-of-each-continent/problem' },
            { title: 'The Report', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/the-report/problem' },
            { title: 'Population Census', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/asian-population/problem' },
            { title: 'African Cities', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/african-cities/problem' },
            { title: 'Type of Triangle', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/what-type-of-triangle/problem' },
        ]
    },
    {
        id: 'accenture',
        name: 'Accenture',
        type: 'Service',
        icon: Shield,
        color: 'text-purple-500',
        dsa: [
            { title: 'Count Primes', difficulty: 'Medium', url: 'https://leetcode.com/problems/count-primes/' },
            { title: 'Rat in a Maze', difficulty: 'Medium', url: 'https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1' },
            { title: 'Find Duplicate Number', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-the-duplicate-number/' },
            { title: 'Rotate Image', difficulty: 'Medium', url: 'https://leetcode.com/problems/rotate-image/' },
            { title: 'Set Matrix Zeroes', difficulty: 'Medium', url: 'https://leetcode.com/problems/set-matrix-zeroes/' },
        ],
        sql: [
            { title: 'Binary Tree Nodes', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/binary-search-tree-1/problem' },
            { title: 'New Companies', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/the-company/problem' },
            { title: 'Weather Observation Station 18', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/weather-observation-station-18/problem' },
            { title: 'The PADS', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/the-pads/problem' },
            { title: 'Symmetric Pairs', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/symmetric-pairs/problem' },
        ]
    },
     {
        id: 'cognizant',
        name: 'Cognizant',
        type: 'Service',
        icon: Smartphone,
        color: 'text-teal-400',
        dsa: [
            { title: 'Binary Search', difficulty: 'Easy', url: 'https://leetcode.com/problems/binary-search/' },
            { title: 'Search Insert Position', difficulty: 'Easy', url: 'https://leetcode.com/problems/search-insert-position/' },
            { title: 'Merge Sorted Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/merge-sorted-array/' },
            { title: 'Pascal Triangle', difficulty: 'Easy', url: 'https://leetcode.com/problems/pascals-triangle/' },
            { title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
        ],
        sql: [
            { title: 'Challenges', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/challenges/problem' },
            { title: 'Contest Leaderboard', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/contest-leaderboard/problem' },
            { title: 'Project Planning', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/projects/problem' },
            { title: 'Placements', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/placements/problem' },
            { title: 'Symmetric Pairs', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/symmetric-pairs/problem' },
        ]
    },
    {
        id: 'capgemini',
        name: 'Capgemini',
        type: 'Service',
        icon: PenTool,
        color: 'text-blue-500',
        dsa: [
            { title: 'Length of Last Word', difficulty: 'Easy', url: 'https://leetcode.com/problems/length-of-last-word/' },
            { title: 'Plus One', difficulty: 'Easy', url: 'https://leetcode.com/problems/plus-one/' },
            { title: 'Sqrt(x)', difficulty: 'Easy', url: 'https://leetcode.com/problems/sqrtx/' },
            { title: 'Happy Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/happy-number/' },
            { title: 'Remove Linked List Elements', difficulty: 'Easy', url: 'https://leetcode.com/problems/remove-linked-list-elements/' },
        ],
        sql: [
            { title: 'Draw The Triangle 1', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/draw-the-triangle-1/problem' },
            { title: 'Draw The Triangle 2', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/draw-the-triangle-2/problem' },
            { title: 'Print Prime Numbers', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/print-prime-numbers/problem' },
            { title: 'Weather Observation Station 20', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/weather-observation-station-20/problem' },
            { title: 'Interviews', difficulty: 'Hard', url: 'https://www.hackerrank.com/challenges/interviews/problem' },
        ]
    },
    {
        id: 'hcl',
        name: 'HCL',
        type: 'Service',
        icon: Radio,
        color: 'text-pink-500',
        dsa: [
            { title: 'Factorial Trailing Zeroes', difficulty: 'Medium', url: 'https://leetcode.com/problems/factorial-trailing-zeroes/' },
            { title: 'Excel Sheet Column Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/excel-sheet-column-number/' },
            { title: 'Isomorphic Strings', difficulty: 'Easy', url: 'https://leetcode.com/problems/isomorphic-strings/' },
            { title: 'Contains Duplicate', difficulty: 'Easy', url: 'https://leetcode.com/problems/contains-duplicate/' },
            { title: 'Power of Three', difficulty: 'Easy', url: 'https://leetcode.com/problems/power-of-three/' },
        ],
        sql: [
            { title: '15 Days of Learning SQL', difficulty: 'Hard', url: 'https://www.hackerrank.com/challenges/15-days-of-learning-sql/problem' },
            { title: 'SQL Project Planning', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/sql-projects/problem' },
            { title: 'Ollivander\'s Inventory', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/harry-potter-and-wands/problem' },
            { title: 'Top Competitors', difficulty: 'Medium', url: 'https://www.hackerrank.com/challenges/full-score/problem' },
            { title: 'The Blunder', difficulty: 'Easy', url: 'https://www.hackerrank.com/challenges/the-blunder/problem' },
        ]
    }
];
