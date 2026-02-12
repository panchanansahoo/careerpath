# Quick Start Guide

Get CareerPath running in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Steps

1. **Install Dependencies** (if not already done)
```bash
npm install
```

2. **Set Up PostgreSQL**
```bash
# Create database
createdb careerpath

# Or using psql
psql -U postgres -c "CREATE DATABASE careerpath;"
```

3. **Configure Environment**

The `.env` file is already created. Update these if needed:
```env
DB_USER=postgres          # Your PostgreSQL username
DB_PASSWORD=postgres      # Your PostgreSQL password
OPENAI_API_KEY=sk-xxx     # Optional: Add for AI features
```

4. **Initialize Database**
```bash
npm run setup
```

Expected output:
```
✅ Schema created successfully!
✅ Database seeded successfully!
🎉 Setup completed successfully!
```

5. **Start Development Server**
```bash
npm run dev
```

6. **Open Application**

Visit: http://localhost:5173

## First Time Setup

1. Click "Sign Up"
2. Create account with any email/password
3. Explore the dashboard!

## Without OpenAI API Key

The app works without an OpenAI API key - it uses mock responses. To enable full AI features:

1. Get key from: https://platform.openai.com/api-keys
2. Add to `.env`: `OPENAI_API_KEY=sk-your-key`
3. Restart server

## Quick Test

After signup:

1. Go to "DSA Patterns"
2. Click "Two Pointers"
3. Click "Two Sum" problem
4. Write solution and submit
5. Get feedback!

## Troubleshooting

**Database error?**
```bash
# Check PostgreSQL is running
pg_isready

# Verify database exists
psql -U postgres -l | grep careerpath
```

**Port in use?**
```bash
# Change port in .env
PORT=3001
```

**Can't connect?**
- Backend: http://localhost:3000/health
- Frontend: http://localhost:5173

## What's Included

✅ 6 DSA Patterns (Two Pointers, Sliding Window, Binary Search, etc.)
✅ 3 Practice Problems with solutions
✅ AI Mock Interview system
✅ System Design canvas
✅ Resume analysis tool
✅ Progress tracking
✅ User authentication

## Next Steps

- Solve more problems
- Try mock interview
- Design a system
- Analyze your resume
- Track your progress

Need help? Check SETUP_GUIDE.md for detailed instructions.
