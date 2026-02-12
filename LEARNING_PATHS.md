# Learning Paths Documentation

## Overview

The CareerPath platform now includes comprehensive learning paths for various technical domains. Each path is designed to guide users through structured learning journeys with modules, lessons, and practice problems.

## Available Learning Paths

### 1. DSA Basics (`/dashboard/learning-path/dsa-basics`)
- **Duration**: 6-8 weeks
- **Difficulty**: Beginner
- **Prerequisite**: Basic programming knowledge
- **Modules**: 6
  - Arrays & Strings
  - Hash Tables & Maps
  - Linked Lists
  - Stacks & Queues
  - Recursion Basics
  - Sorting & Searching

### 2. Advanced DSA (`/dashboard/learning-path/dsa`)
- **Duration**: 10-12 weeks
- **Difficulty**: Advanced
- **Prerequisite**: Strong foundation in basic DSA
- **Modules**: 6
  - Binary Trees & BST
  - Graph Algorithms
  - Dynamic Programming
  - Heaps & Priority Queues
  - Advanced Tree Structures (Trie, Segment Tree, Fenwick Tree)
  - Backtracking & Recursion

### 3. Data Science Interview Prep (`/dashboard/learning-path/data-science`)
- **Duration**: 8-10 weeks
- **Difficulty**: Intermediate
- **Prerequisite**: Python programming, basic statistics
- **Modules**: 5
  - Python for Data Science (NumPy, Pandas)
  - Statistics & Probability
  - SQL & Database Skills
  - Machine Learning Algorithms
  - Feature Engineering & Model Selection

### 4. AI & Machine Learning (`/dashboard/learning-path/ai`)
- **Duration**: 10-12 weeks
- **Difficulty**: Advanced
- **Prerequisite**: ML fundamentals, calculus, linear algebra
- **Modules**: 5
  - Neural Networks Fundamentals
  - Convolutional Neural Networks (CNN)
  - RNN & Natural Language Processing
  - Transformers & Modern NLP
  - Generative AI (GANs, VAEs, Diffusion Models)

### 5. Low Level Design (`/dashboard/learning-path/lld`)
- **Duration**: 6-8 weeks
- **Difficulty**: Intermediate
- **Prerequisite**: OOP concepts, programming experience
- **Modules**: 5
  - OOP & SOLID Principles
  - Creational Design Patterns
  - Structural Design Patterns
  - Behavioral Design Patterns
  - LLD Case Studies (Parking Lot, Library System, Chess Game, etc.)

### 6. High Level Design (`/dashboard/learning-path/hld`)
- **Duration**: 8-10 weeks
- **Difficulty**: Advanced
- **Prerequisite**: Basic system design concepts, databases
- **Modules**: 5
  - System Design Fundamentals
  - Databases & Storage
  - Distributed Systems
  - API Design & Communication
  - System Design Case Studies (Twitter, Instagram, Netflix, Uber, etc.)

## Features

### Path Overview Page (`/dashboard/learning-path`)
- Grid layout showing all available learning paths
- Visual difficulty indicators (Beginner, Intermediate, Advanced)
- Duration and module count for each path
- Progress tracking for enrolled paths
- Hover effects and smooth navigation

### Path Detail Page (`/dashboard/learning-path/:pathId`)
- Comprehensive path information
- Prerequisites and learning outcomes
- Detailed module breakdown with:
  - Module title and description
  - Topics covered
  - Individual lessons with type indicators (video, reading, practice)
  - Estimated time for each lesson
  - Practice problem count
  - Progress tracking per module
  - Unlock system (complete previous modules to unlock next)

### Module Features
Each module includes:
- **Lessons**: Video lectures, reading materials, and practice exercises
- **Topics**: Specific subjects covered in the module
- **Problems**: Practice problems with difficulty levels
- **Progress Tracking**: Visual progress bars showing completion percentage
- **Time Estimates**: Realistic time requirements for each lesson and module

### Visual Design
- Clean, modern UI with consistent color scheme
- Difficulty-based color coding:
  - Beginner: Blue (#dbeafe)
  - Intermediate: Yellow (#fef3c7)
  - Advanced: Red (#fee2e2)
- Progress indicators with smooth animations
- Icon-based status (completed, unlocked, locked)
- Responsive grid layouts
- Hover effects for better interactivity

## API Endpoints

### Get All Learning Paths
```
GET /api/user/learning-paths
Authorization: Bearer {token}
```

Returns array of all learning paths with basic information.

### Get Learning Path Details
```
GET /api/user/learning-paths/:pathId
Authorization: Bearer {token}
```

Returns detailed information for a specific learning path including all modules, lessons, and progress.

### Get User Progress
```
GET /api/user/progress
Authorization: Bearer {token}
```

Returns user's progress across all learning paths and modules.

## Navigation Flow

1. User visits `/dashboard/learning-path`
2. Sees all available learning paths in a grid
3. Clicks on a path card
4. Navigates to `/dashboard/learning-path/:pathId`
5. Views detailed curriculum and modules
6. Clicks "Start Learning" on an unlocked module
7. Redirects to appropriate practice page:
   - DSA paths → `/dsa-patterns`
   - Data Science/AI paths → `/code-practice`
   - LLD/HLD paths → `/system-design`

## Progress Tracking

- Modules unlock sequentially (complete previous to unlock next)
- Progress bars show completion percentage per module
- Visual indicators: checkmark (completed), star (unlocked), lock (locked)
- Overall path progress calculated from completed modules
- User progress persists across sessions

## Future Enhancements

1. **Personalized Recommendations**: AI-driven path suggestions based on user's background
2. **Adaptive Learning**: Adjust difficulty based on user performance
3. **Community Features**: Discussion forums per module
4. **Certificates**: Issue completion certificates for paths
5. **Leaderboards**: Compare progress with peers
6. **Time Tracking**: Actual time spent vs estimated
7. **Flashcards**: Quick revision tools for each module
8. **Mock Assessments**: Module-wise tests before unlocking next
9. **Mentor Support**: Connect with mentors for guidance
10. **Custom Paths**: Allow users to create custom learning paths

## Implementation Notes

### Frontend Components
- `src/pages/LearningPath.jsx`: Overview page with all paths
- `src/pages/LearningPathDetail.jsx`: Detailed path view with modules
- Routes configured in `src/App.jsx`

### Backend Routes
- `server/routes/user.js`: Contains learning path endpoints
- Mock data currently used, can be replaced with database queries

### Styling
- Inline styles for easy customization
- Consistent with existing platform design
- Mobile-responsive layouts

## Testing Checklist

- [ ] All 6 learning paths render correctly
- [ ] Navigation from overview to detail pages works
- [ ] Module unlock logic functions properly
- [ ] Progress bars update correctly
- [ ] Hover effects work on all cards
- [ ] Lesson type icons display correctly
- [ ] Responsive layout on mobile devices
- [ ] API endpoints return correct data
- [ ] Authentication required for protected routes
- [ ] Back navigation works from detail to overview
