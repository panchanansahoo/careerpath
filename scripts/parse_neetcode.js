import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const projectRoot = path.join(__dirname, '..');
    const inputFile = path.join(projectRoot, 'dsa_scrape_data.txt');
    const outputDir = path.join(projectRoot, 'src', 'context');
    const outputFile = path.join(outputDir, 'neetcode150.js');

    console.log(`Reading from: ${inputFile}`);
    if (!fs.existsSync(inputFile)) {
        throw new Error(`Input file not found: ${inputFile}`);
    }

    const rawData = fs.readFileSync(inputFile, 'utf-8');
    const lines = rawData.split('\n').map(line => line.trim()).filter(line => line);

    const categories = [];
    let currentCategory = null;

    // Regex helpers
    // Matches Roman Numerals I to XX strictly on a line
    const romanRegex = /^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX)$/; 
    const problemStartRegex = /^\d+\.$/; // e.g., 1.

    // Mapping Roman to Category Name based on file content observation
    // I -> Two Pointer Patterns
    // II -> Sliding Window Patterns
    // etc.
    
    // We scan the file.
    // If we see a Roman Numeral, we look for the next non-numeric line to be the Category Name.
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (romanRegex.test(line)) {
            // Found a Super Category Start
            // Look ahead for the name.
            // Usually:
            // I
            // Two Pointer Patterns
            // 7
            // patterns
            
            // Or
            // I
            // ...
            
            let name = "Unknown Category";
            // Try next lines
            for (let j = 1; j <= 3; j++) {
                if (i + j < lines.length) {
                    const potentialName = lines[i+j];
                    // Exclude if it's just a number
                    // Exclude if it's EXACTLY "patterns" (the count label)
                    // Exclude if it's another Roman numeral (unlikely in this range but safe)
                    if (!/^\d+$/.test(potentialName) && !/^patterns$/i.test(potentialName) && !romanRegex.test(potentialName)) {
                        name = potentialName;
                        break;
                    }
                }
            }
            
            // If we already have this category, use it (unlikely in this file structure but good safety)
            let existingCat = categories.find(c => c.category === name);
            if (!existingCat) {
                currentCategory = {
                    category: name,
                    problems: [] // Flattening sub-patterns into this main category
                };
                categories.push(currentCategory);
            } else {
                currentCategory = existingCat;
            }
        }

        // Problem extraction
        if (problemStartRegex.test(line)) {
            if (i + 2 < lines.length) {
                const title = lines[i+1];
                const difficultyLine = lines[i+2];
                
                if (/^\[(E|M|H)\]$/.test(difficultyLine)) {
                    const difficulty = difficultyLine === '[E]' ? 'Easy' : difficultyLine === '[M]' ? 'Medium' : 'Hard';
                    
                    if (currentCategory) {
                        // Check for duplicates within this category
                        const exists = currentCategory.problems.find(p => p.title === title);
                        if (!exists) {
                            currentCategory.problems.push({
                                id: title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
                                title: title,
                                difficulty: difficulty,
                                status: 'unsolved',
                                links: {
                                    youtube: `https://www.youtube.com/results?search_query=neetcode+${title.replace(/\s+/g, '+')}`,
                                    leetcode: `https://leetcode.com/problems/${title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}/`,
                                    article: null
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    // Filter out empty categories
    const validCategories = categories.filter(c => c.problems.length > 0);

    const content = `export const neetcode150 = ${JSON.stringify(validCategories, null, 2)};`;
    fs.writeFileSync(outputFile, content);
    console.log(`Success! Wrote ${validCategories.length} populated categories to ${outputFile}`);
    console.log(`Total Problems: ${validCategories.reduce((acc, c) => acc + c.problems.length, 0)}`);

} catch (err) {
    console.error("FATAL ERROR:", err);
    process.exit(1);
}
