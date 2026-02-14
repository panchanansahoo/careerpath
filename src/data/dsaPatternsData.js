export const dsaPatterns = [
    {
        id: "two-pointers",
        name: "Two Pointers",
        category: "Array & String",
        difficulty: "Medium",
        description: "A pattern where two pointers iterate through the data structure in tandem until one or both of the pointers hit a certain condition.",
        theory: `
### Intuition
As the name implies, a two-pointer pattern refers to an algorithm that utilizes two pointers. A pointer is a variable that represents an index or position within a data structure, like an array or linked list.

Many algorithms just use a single pointer to iterate. Introducing a **second pointer** opens a new world of possibilities. Most importantly, we can now make **comparisons**. With pointers at two different positions, we can compare the elements at those positions and make decisions.

In many cases, such comparisons might otherwise be made using two nested loops, which takes $O(n^2)$ time. Two pointers allow us to process the data in $O(n)$ time by eliminating the need for nested comparisons.

### Two-pointer Strategies

**1. Inward Traversal**
This approach has pointers starting at opposite ends of the data structure and moving inward toward each other. The pointers move toward the center, adjusting their positions based on comparisons, until they meet or cross. This is ideal for problems like:
- checking for palindromes
- finding a pair that sums to a target in a sorted array
- reversing an array

**2. Unidirectional Traversal**
In this approach, both pointers start at the same end (usually the beginning) and move in the same direction. One pointer might move faster than the other, or they might move at different times.
- **Fast and Slow Pointers**: One moves 1 step, the other 2 steps (e.g., detecting cycles).
- **Read/Write Pointers**: One reads elements, the other writes valid elements (e.g., removing duplicates).

**3. Staged Traversal**
In this approach, we traverse with one pointer, and when it lands on an element that meets a certain condition, we traverse with the second pointer. The first pointer is used to search for something, and once found, a second pointer finds additional information.

### When To Use Two Pointers?
- **Linear Data Structures**: The problem involves an array, linked list, or string.
- **Sorted Arrays**: If the input is sorted, two pointers can often be used to find pairs or conditions in $O(n)$ instead of $O(n^2)$.
- **Pairs/Triplets**: The problem asks for a pair or triplet of values that satisfy a condition.
- **Subarrays**: Finding a subarray with specific properties (often combined with Sliding Window).
- **Palindromes**: Checking for symmetry.

### Real-world Example
**Garbage Collection Algorithms**: In memory compaction, a "scan" pointer traverses the heap to identify live objects, while a "free" pointer keeps track of the next available space. Live objects are shifted to the "free" pointer's position, compacting memory.
        `,
        examples: [
            "Removing duplicates from a sorted array",
            "Checking if a string is a palindrome",
            "Finding two numbers in a sorted array that add up to a target",
            "Container with most water (finding max area)",
            "Trapping rain water",
            "Moving zeros to the end of an array"
        ],
        problems: [
            { id: "valid-palindrome", title: "Valid Palindrome", difficulty: "Easy", status: "pending", link: "/problem/valid-palindrome" },
            { id: "two-sum-ii", title: "Two Sum II - Input Array Is Sorted", difficulty: "Medium", status: "pending", link: "/problem/two-sum-ii" },
            { id: "3sum", title: "3Sum", difficulty: "Medium", status: "pending", link: "/problem/3sum" },
            { id: "container-with-most-water", title: "Container With Most Water", difficulty: "Medium", status: "pending", link: "/problem/container-with-most-water" },
            { id: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard", status: "pending", link: "/problem/trapping-rain-water" },
            { id: "move-zeroes", title: "Move Zeroes", difficulty: "Easy", status: "pending", link: "/problem/move-zeroes" }
        ]
    },
    {
        id: "sliding-window",
        name: "Sliding Window",
        category: "Array & String",
        difficulty: "Medium",
        description: "A pattern used to perform a required operation on a specific window size of a given array or linked list.",
        theory: `
### Intuition
The Sliding Window pattern is used to perform a required operation on a specific window size of a given array or linked list, such as finding the longest subarray containing all 1s. Sliding Windows start from the 1st element and keep shifting right by one element and adjust the length of the window according to the problem that you are solving.

In some variance, the window size remains constant and in other variance the window grows or shrinks.

### Types of Sliding Windows

**1. Fixed Window Size**
The window size \`k\` is fixed. We slide the window by one element at a time.
Example: *Find the maximum sum of any contiguous subarray of size k.*

**2. Dynamic Window Size**
The window size grows or shrinks based on constraints.
Example: *Find the smallest subarray with a sum greater than or equal to S.*
        `,
        examples: [
             "Longest substring without repeating characters",
             "Minimum size subarray sum",
             "Longest repeating character replacement",
             "Permutation in string"
        ],
        problems: [
            { id: "longest-substring-without-repeating-characters", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", status: "pending", link: "/problem/longest-substring" },
            { id: "best-time-to-buy-and-sell-stock", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", status: "pending", link: "/problem/best-time-stock" },
            { id: "longest-repeating-character-replacement", title: "Longest Repeating Character Replacement", difficulty: "Medium", status: "pending", link: "/problem/longest-repeating-char" },
            { id: "minimum-window-substring", title: "Minimum Window Substring", difficulty: "Hard", status: "pending", link: "/problem/min-window-substring" }
        ]
    },
    {
         id: "arrays-hashing",
         name: "Arrays & Hashing",
         category: "Array",
         difficulty: "Easy",
         description: "Foundational techniques for manipulating arrays and using hash maps for efficient lookups.",
         theory: "Basic array manipulation and hashing techniques are the building blocks of most complex algorithms.",
         examples: ["Contains Duplicate", "Valid Anagram", "Two Sum"],
         problems: [
             { id: "contains-duplicate", title: "Contains Duplicate", difficulty: "Easy", status: "solved", link: "/problem/contains-duplicate" },
             { id: "valid-anagram", title: "Valid Anagram", difficulty: "Easy", status: "solved", link: "/problem/valid-anagram" },
             { id: "two-sum", title: "Two Sum", difficulty: "Easy", status: "solved", link: "/problem/two-sum" },
             { id: "group-anagrams", title: "Group Anagrams", difficulty: "Medium", status: "pending", link: "/problem/group-anagrams" },
             { id: "top-k-frequent-elements", title: "Top K Frequent Elements", difficulty: "Medium", status: "pending", link: "/problem/top-k-frequent" },
             { id: "product-of-array-except-self", title: "Product of Array Except Self", difficulty: "Medium", status: "pending", link: "/problem/product-array-except-self" }
         ]
    }
];
