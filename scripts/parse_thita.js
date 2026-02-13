import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawText = fs.readFileSync(path.join(__dirname, '../dsa_scrape_data.txt'), 'utf8');
const lines = rawText.split('\n').map(l => l.trim()).filter(l => l);

const data = [];
let currentCategory = null;
let currentPattern = null;

const romanNumerals = /^([IVX]+)$/;
const patternIndex = /^(\d+)\/93$/;
const problemIndex = /^(\d+)\.$/;
const difficultyRegex = /^\[([EMH])\]$/;

// Pattern Categories to look for (from the text)
const Categories = [
    "Two Pointer Patterns", "Sliding Window Patterns", "Tree Traversal Patterns (DFS & BFS)",
    "Graph Traversal Patterns (DFS & BFS)", "Dynamic Programming (DP) Patterns", "Heap (Priority Queue) Patterns",
    "Backtracking Patterns", "Greedy Patterns", "Binary Search Patterns", "Stack Patterns",
    "Bit Manipulation Patterns", "Linked List Manipulation Patterns", "Array/Matrix Manipulation Patterns",
    "String Manipulation Patterns", "Design Patterns", "Tries"
];

let i = 0;
while (i < lines.length) {
    const line = lines[i];

    // Check for Category (Roman Numeral followed by known category name)
    if (romanNumerals.test(line)) {
        // Look ahead to see if next line is a category
        const nextLine = lines[i+1];
        if (Categories.includes(nextLine) || (nextLine && nextLine.includes("Patterns"))) {
            currentCategory = {
                id: line,
                title: nextLine,
                patterns: []
            };
            data.push(currentCategory);
            i += 2;
            continue;
        }
    }

    // Check for Pattern (e.g. 1/93)
    if (patternIndex.test(line)) {
        const nextLine = lines[i+1];
        currentPattern = {
            index: line,
            title: nextLine,
            problems: []
        };
        // If we have a category, add it. If not, and we are at the start, maybe we missed the category?
        // Or if the pattern is "Tries" at the end, it might be its own thing or part of Design.
        // Actually "Tries" is usually its own or under data structures.
        // In the text: "XV Design Patterns ... 93/93 Tries" -> Tries is likely under Design or separate.
        // Let's just add to currentCategory.
        if (currentCategory) {
            currentCategory.patterns.push(currentPattern);
        } else {
            console.error("Found pattern before category: " + line);
             // Create dummy
             currentCategory = { id: 'UNKNOWN', title: 'Unknown Category', patterns: [currentPattern] };
             data.push(currentCategory);
        }
        i += 2;
        continue;
    }

    // Check for Problem (e.g. 1.)
    if (problemIndex.test(line)) {
        // Look ahead for Title and Badge
        // 1.
        // Container With Most Water
        // [M]
        
        // Sometimes there might be extra lines or "Problem" header? No, usually straight to number.
        
        if (i + 2 < lines.length) {
            const title = lines[i+1];
            const difficultyStr = lines[i+2];
            
            if (difficultyRegex.test(difficultyStr)) {
                const difficulty = difficultyStr.replace('[', '').replace(']', '');
                const problem = {
                    title: title,
                    difficulty: difficulty === 'E' ? 'Easy' : difficulty === 'M' ? 'Medium' : 'Hard',
                };
                if (currentPattern) {
                    currentPattern.problems.push(problem);
                }
                i += 3; 
                continue;
            }
        }
    }

    i++;
}

console.log(JSON.stringify(data, null, 2));
