# CareerPath - AI Interview Prep Platform

A comprehensive, full-stack AI-powered interview preparation platform featuring DSA patterns, system design, mock interviews, and resume analysis.

## Features

### 🎯 Core Features
- **90+ DSA Patterns**: Structured algorithmic patterns with 400+ curated problems
- **AI Code Practice**: Real-time code execution with AI-powered feedback
- **System Design Canvas**: Interactive system design with component selection and AI feedback
- **Mock Interviews**: AI interviewer with natural conversations and follow-up questions
- **Resume Analysis**: ATS score calculation with detailed suggestions
- **Progress Tracking**: Comprehensive analytics and learning path tracking

### 🤖 AI Integration
- OpenAI GPT-4 integration for:
  - Code feedback and optimization suggestions
  - Mock interview conversations
  - System design evaluation
  - Resume analysis and ATS scoring
  - Intelligent hints and explanations

### 🔐 Authentication & User Management
- JWT-based authentication
- User profiles with experience levels
- Progress persistence across sessions

## Tech Stack

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **OpenAI API** for AI features
- **JWT** for authentication
- **Helmet** and rate limiting for security

### Frontend
- **React 18** with Hooks
- **Vite** for fast development
- **Monaco Editor** for code editing
- **Axios** for API calls
- **React Router** for navigation
- **Lucide React** for icons

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- OpenAI API key (optional - works with mock data without it)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd careerpath
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/careerpath
DB_HOST=localhost
DB_PORT=5432
DB_NAME=careerpath
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key-here
FRONTEND_URL=http://localhost:5173
```

4. Set up the database:

Create PostgreSQL database:
```bash
createdb careerpath
```

Run setup script:
```bash
npm run setup
```

This will:
- Create all database tables
- Seed initial DSA patterns and problems

5. Start the development servers:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3000
- Frontend dev server on http://localhost:5173

## Project Structure

```
careerpath/
├── server/
│   ├── db/
│   │   ├── index.js          # Database connection
│   │   ├── schema.sql        # Database schema
│   │   └── seed.js           # Seed data
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── routes/
│   │   ├── auth.js           # Auth routes
│   │   ├── dsa.js            # DSA patterns/problems
│   │   ├── practice.js       # Code submission
│   │   ├── ai.js             # AI features
│   │   ├── resume.js         # Resume analysis
│   │   ├── systemDesign.js   # System design
│   │   └── user.js           # User management
│   ├── index.js              # Express server
│   └── setup.js              # Database setup script
├── src/
│   ├── components/
│   │   └── Navbar.jsx        # Navigation component
│   ├── context/
│   │   └── AuthContext.jsx   # Auth state management
│   ├── pages/
│   │   ├── Home.jsx          # Landing page
│   │   ├── Login.jsx         # Login page
│   │   ├── Signup.jsx        # Signup page
│   │   ├── Dashboard.jsx     # User dashboard
│   │   ├── DSAPatterns.jsx   # Pattern listing
│   │   ├── PatternDetail.jsx # Pattern details
│   │   ├── ProblemSolver.jsx # Code editor
│   │   ├── SystemDesign.jsx  # System design canvas
│   │   ├── MockInterview.jsx # AI interview
│   │   └── ResumeAnalysis.jsx # Resume analyzer
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
└── package.json              # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login

### DSA Patterns
- `GET /api/dsa/patterns` - List all patterns
- `GET /api/dsa/patterns/:id` - Get pattern details
- `GET /api/dsa/problems/:id` - Get problem details
- `GET /api/dsa/progress` - Get user progress

### Practice
- `POST /api/practice/submit` - Submit solution
- `POST /api/practice/run` - Run code
- `GET /api/practice/submissions` - Get submissions

### AI Features
- `POST /api/ai/code-feedback` - Get AI code feedback
- `POST /api/ai/mock-interview` - Mock interview
- `POST /api/ai/hint` - Get hint for problem
- `POST /api/ai/explain` - Explain code

### System Design
- `GET /api/system-design/topics` - List topics
- `POST /api/system-design/feedback` - Get design feedback

### Resume
- `POST /api/resume/analyze` - Analyze resume
- `GET /api/resume/history` - Get analysis history

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/dashboard` - Get dashboard data

## Features in Detail

### DSA Patterns
- Organized by category (Array, Graph, Dynamic Programming, etc.)
- Multiple difficulty levels
- Starter code in Python, JavaScript, and C++
- Test cases for validation
- Company tags for each problem

### AI Code Feedback
- Time and space complexity analysis
- Code quality assessment
- Optimization suggestions
- Best practices recommendations

### System Design Canvas
- Pre-defined topics (Twitter, Netflix, Uber, etc.)
- Component library
- Scale estimations
- AI-powered design review

### Mock Interviews
- Multiple interview types (Coding, System Design, Behavioral)
- Conversational AI interviewer
- Follow-up questions
- Real-time feedback

### Resume Analysis
- ATS score calculation
- Strength and weakness identification
- Keyword matching
- Actionable improvement suggestions

## Database Schema

The platform uses PostgreSQL with the following main tables:
- `users` - User accounts
- `patterns` - DSA patterns
- `problems` - Coding problems
- `user_progress` - Problem solving progress
- `submissions` - Code submissions
- `mock_interviews` - Interview sessions
- `resume_analyses` - Resume analysis results

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Helmet.js for HTTP headers
- Input validation with express-validator
- CORS configuration

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Environment Variables
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `FRONTEND_URL` - Frontend URL for CORS

## Notes

- The platform works with or without OpenAI API key (uses mock data as fallback)
- Code execution is simulated (can integrate with Judge0 or similar for real execution)
- Database should be properly indexed for production use
- Consider implementing Redis for caching in production

## Future Enhancements

- Real code execution environment
- Video mock interviews
- Peer-to-peer practice sessions
- More DSA patterns and problems
- Mobile app
- Team/organization features
- Learning path recommendations
- Spaced repetition system

## License

MIT

## Support

For issues and feature requests, please create an issue in the repository.
