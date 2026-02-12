# Learning Paths Testing Guide

## Quick Verification

Run this after starting the application:

### 1. Start Application
```bash
# Terminal 1 - Start backend
npm run server

# Terminal 2 - Start frontend
npm run client
```

### 2. Access URLs

Open browser and test each URL:

#### Overview Page
```
http://localhost:5173/dashboard/learning-path
```
**Expected**: Grid of 6 learning path cards with hover effects

#### Individual Path Pages

1. **DSA Basics**
   ```
   http://localhost:5173/dashboard/learning-path/dsa-basics
   ```
   Expected: 6 modules (Arrays, Hash Tables, Linked Lists, Stacks, Recursion, Sorting)

2. **Advanced DSA**
   ```
   http://localhost:5173/dashboard/learning-path/dsa
   ```
   Expected: 6 modules (Trees, Graphs, DP, Heaps, Advanced Trees, Backtracking)

3. **Data Science**
   ```
   http://localhost:5173/dashboard/learning-path/data-science
   ```
   Expected: 5 modules (Python, Statistics, SQL, ML, Feature Engineering)

4. **AI & Machine Learning**
   ```
   http://localhost:5173/dashboard/learning-path/ai
   ```
   Expected: 5 modules (Neural Networks, CNN, RNN, Transformers, Generative AI)

5. **Low Level Design**
   ```
   http://localhost:5173/dashboard/learning-path/lld
   ```
   Expected: 5 modules (OOP, Creational, Structural, Behavioral, Case Studies)

6. **High Level Design**
   ```
   http://localhost:5173/dashboard/learning-path/hld
   ```
   Expected: 5 modules (Fundamentals, Databases, Distributed, API, Case Studies)

### 3. API Testing

Test backend endpoints:

```bash
# Get all paths (requires authentication token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/user/learning-paths

# Get specific path
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/user/learning-paths/dsa-basics
```

## Manual Testing Checklist

### Overview Page (`/dashboard/learning-path`)
- [ ] Page loads without errors
- [ ] All 6 learning paths visible
- [ ] Difficulty badges display correct colors
- [ ] Duration and module count shown
- [ ] Progress bars visible (even if 0%)
- [ ] Hover effects work on cards
- [ ] Click on card navigates to detail page
- [ ] "Why Choose" section displays at bottom
- [ ] Navigation bar present
- [ ] Page is responsive on mobile

### Detail Pages (`/dashboard/learning-path/:pathId`)
- [ ] Page loads for each path ID
- [ ] Path title and description display
- [ ] Difficulty badge shows correct color
- [ ] Stats cards show (Duration, Modules, Progress)
- [ ] Prerequisites section visible
- [ ] Learning outcomes listed (4+ items)
- [ ] All modules render
- [ ] Module numbers sequential (1, 2, 3...)
- [ ] Topic tags display for each module
- [ ] Lesson breakdown shows with icons
- [ ] Time estimates visible
- [ ] Problem counts shown
- [ ] "Back to Learning Paths" button works
- [ ] Status icons correct (star for unlocked, lock for locked)
- [ ] "Start Learning" button enabled for unlocked modules
- [ ] Click "Start Learning" redirects appropriately
- [ ] Page is responsive on mobile

### Navigation Flow
- [ ] Dashboard → Learning Path works
- [ ] Learning Path → Detail Page works
- [ ] Detail Page → Back to Learning Path works
- [ ] Detail Page → Start Learning → Practice Area works
- [ ] Browser back/forward buttons work
- [ ] Direct URL access works (when logged in)
- [ ] Redirects to login if not authenticated

### Visual Testing
- [ ] Colors consistent with platform design
- [ ] Typography readable
- [ ] Spacing looks good
- [ ] Icons load correctly
- [ ] No layout shifts
- [ ] Smooth hover transitions
- [ ] Progress bars animate smoothly
- [ ] No overlapping text
- [ ] Cards aligned properly in grid

### Browser Testing
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Works on mobile Safari
- [ ] Works on mobile Chrome

### Console Testing
Open browser console (F12) and check:
- [ ] No JavaScript errors
- [ ] No React warnings
- [ ] No 404s for assets
- [ ] API calls succeed (200 status)
- [ ] No CORS errors

## Common Issues & Solutions

### Issue: "Page not found"
**Solution**: Ensure you're logged in first. Visit `/login` then go to learning path.

### Issue: "Cannot read property of undefined"
**Solution**: Check that backend server is running on port 3000.

### Issue: "Network Error"
**Solution**: 
1. Verify backend is running: `curl http://localhost:3000/health`
2. Check CORS settings in server

### Issue: Cards not displaying
**Solution**: 
1. Check browser console for errors
2. Verify API endpoint returns data
3. Check authentication token is valid

### Issue: Styling looks broken
**Solution**:
1. Clear browser cache
2. Check that all imports are correct
3. Verify lucide-react is installed

## Performance Testing

### Load Time
- [ ] Overview page loads < 2 seconds
- [ ] Detail page loads < 2 seconds
- [ ] Navigation transitions smooth
- [ ] No janky animations

### Memory
- [ ] No memory leaks when navigating
- [ ] Components unmount properly
- [ ] No excessive re-renders

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab key navigates through cards
- [ ] Enter key activates cards
- [ ] Focus visible on all interactive elements
- [ ] Escape key closes modals (if any)

### Screen Reader
- [ ] Headings read in correct order
- [ ] Card content accessible
- [ ] Status announced (locked/unlocked)
- [ ] Navigation landmarks present

## Data Validation

### Path IDs
Valid: `dsa-basics`, `dsa`, `data-science`, `ai`, `lld`, `hld`
Invalid: `invalid-id` (should show 404 or error)

### Module Counts
- DSA Basics: 6 modules
- Advanced DSA: 6 modules
- Data Science: 5 modules
- AI & ML: 5 modules
- Low Level Design: 5 modules
- High Level Design: 5 modules

### Total Lessons
Each module should have 3-5 lessons listed

### Problem Counts
Each module should show number of practice problems

## Integration Testing

### With Authentication
- [ ] Logged out users redirected to /login
- [ ] Logged in users can access all paths
- [ ] Token passed correctly to API
- [ ] Token expiry handled gracefully

### With Progress Tracking
- [ ] Progress saves (if persistence implemented)
- [ ] Progress loads correctly
- [ ] Progress bars update
- [ ] Completion status persists

### With Practice Features
- [ ] DSA paths → /dsa-patterns works
- [ ] DS/AI paths → /code-practice works
- [ ] LLD/HLD paths → /system-design works

## Regression Testing

Ensure existing features still work:
- [ ] Home page loads
- [ ] Login/Signup works
- [ ] Dashboard displays
- [ ] DSA Patterns accessible
- [ ] System Design accessible
- [ ] Mock Interview accessible
- [ ] Resume Analysis accessible

## Production Readiness

- [ ] No console.log statements in production
- [ ] Error boundaries in place
- [ ] Loading states for all async operations
- [ ] Error messages user-friendly
- [ ] Analytics tracking (if implemented)
- [ ] SEO meta tags (if needed)
- [ ] Social sharing (if needed)

## Sign-off Checklist

Before marking complete:
- [ ] All 6 paths accessible via URL
- [ ] All modules display correctly
- [ ] Navigation works end-to-end
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Documented
- [ ] Code reviewed
- [ ] Tested in production-like environment

## Test Credentials

For testing, use:
- **Email**: test@example.com (or create new account)
- **Password**: password123 (or your test password)

## Automated Testing (Future)

Recommended test files to create:

```javascript
// src/__tests__/LearningPath.test.jsx
describe('LearningPath Overview', () => {
  it('renders all 6 paths');
  it('navigates to detail on click');
  it('shows progress bars');
});

// src/__tests__/LearningPathDetail.test.jsx
describe('LearningPath Detail', () => {
  it('loads path data');
  it('displays modules');
  it('shows lessons');
  it('handles invalid path ID');
});

// server/__tests__/learningPaths.test.js
describe('Learning Paths API', () => {
  it('GET /learning-paths returns array');
  it('GET /learning-paths/:id returns path');
  it('requires authentication');
});
```

## Success Criteria

✅ **All tests pass**
✅ **No critical bugs**
✅ **User can complete full journey**
✅ **Documentation complete**
✅ **Code is production-ready**
