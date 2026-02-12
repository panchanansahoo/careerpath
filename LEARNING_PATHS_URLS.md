# Learning Paths - Quick Reference

## All Learning Path URLs

### Overview Page
- **URL**: `/dashboard/learning-path`
- **Description**: Main learning paths page showing all available paths
- **Access**: Requires authentication

### Individual Learning Paths

#### 1. DSA Basics
- **URL**: `/dashboard/learning-path/dsa-basics`
- **Equivalent**: `https://thita.ai/dashboard/learning-path/dsa-basics`
- **Level**: Beginner
- **Focus**: Fundamental data structures and algorithms

#### 2. Advanced DSA
- **URL**: `/dashboard/learning-path/dsa`
- **Equivalent**: `https://thita.ai/dashboard/learning-path/dsa`
- **Level**: Advanced
- **Focus**: Complex algorithms for FAANG interviews

#### 3. Data Science Interview Prep
- **URL**: `/dashboard/learning-path/data-science`
- **Equivalent**: `https://thita.ai/dashboard/learning-path/data-science`
- **Level**: Intermediate
- **Focus**: Statistics, ML, and Python for DS roles

#### 4. AI & Machine Learning
- **URL**: `/dashboard/learning-path/ai`
- **Equivalent**: `https://thita.ai/dashboard/learning-path/ai`
- **Level**: Advanced
- **Focus**: Deep learning and neural networks

#### 5. Low Level Design
- **URL**: `/dashboard/learning-path/lld`
- **Equivalent**: `https://thita.ai/dashboard/learning-path/lld`
- **Level**: Intermediate
- **Focus**: OOP and design patterns

#### 6. High Level Design
- **URL**: `/dashboard/learning-path/hld`
- **Equivalent**: `https://thita.ai/dashboard/learning-path/hld`
- **Level**: Advanced
- **Focus**: System design and distributed systems

## Route Structure

```
/dashboard/learning-path                    → Overview of all paths
/dashboard/learning-path/:pathId            → Detailed view of specific path
```

### Valid Path IDs
- `dsa-basics`
- `dsa`
- `data-science`
- `ai`
- `lld`
- `hld`
- `beginner` (Interview Prep Bootcamp - legacy)

## Navigation Pattern

```
Home → Dashboard → Learning Path (overview) → Specific Path (detail) → Practice
```

## Integration Points

Each learning path integrates with existing platform features:

### DSA Basics & Advanced DSA
- Practice: `/dsa-patterns`
- Problems: `/problems/:id`
- Patterns: `/patterns/:id`

### Data Science & AI
- Practice: `/code-practice`
- Custom coding environment

### Low Level Design & High Level Design
- Practice: `/system-design`
- Design canvas and diagrams

## API Integration

### Frontend Requests
```javascript
// Get all paths
axios.get('/api/user/learning-paths')

// Get specific path
axios.get('/api/user/learning-paths/:pathId')

// Get user progress
axios.get('/api/user/progress')
```

### Backend Endpoints
```javascript
router.get('/learning-paths', authenticateToken, ...)
router.get('/learning-paths/:pathId', authenticateToken, ...)
router.get('/progress', authenticateToken, ...)
```

## Access Control

All learning path routes require authentication:
- Users must be logged in
- Token validation via `authenticateToken` middleware
- Redirects to `/login` if not authenticated

## User Flow Example

1. User logs in
2. Goes to Dashboard
3. Clicks "Learning Path" in navigation
4. Views all 6 learning paths
5. Clicks "DSA Basics" card
6. Sees 6 modules with detailed curriculum
7. Clicks "Start Learning" on Module 1
8. Redirected to `/dsa-patterns` for practice
9. Progress tracked and saved
10. Returns to learning path to continue

## Features Per Path

Each path includes:
- ✅ Prerequisites clearly stated
- ✅ Learning outcomes listed
- ✅ Module breakdown with lessons
- ✅ Topic tags for each module
- ✅ Time estimates (per lesson and module)
- ✅ Practice problem counts
- ✅ Progress tracking
- ✅ Sequential unlock system
- ✅ Visual status indicators

## Implementation Status

✅ Frontend routes configured
✅ Backend API endpoints created
✅ Component structure complete
✅ Navigation flow working
✅ Progress tracking implemented
✅ Visual design polished
✅ Responsive layouts
✅ Authentication required
✅ All 6 paths configured
✅ Documentation complete

## Next Steps for Enhancement

1. Connect to database for progress persistence
2. Add lesson content pages
3. Implement quiz/assessment per module
4. Add video player integration
5. Create practice problem sets per module
6. Build recommendation engine
7. Add social features (discussion forums)
8. Generate certificates on completion
9. Mobile app version
10. Analytics dashboard for learning patterns
