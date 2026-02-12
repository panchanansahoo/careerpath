# CareerPath Architecture Documentation

## System Overview

CareerPath is a full-stack AI-powered interview preparation platform built with modern web technologies. The system consists of three main layers:

1. **Frontend Layer**: React-based SPA
2. **Backend Layer**: Node.js/Express REST API
3. **Data Layer**: PostgreSQL database
4. **AI Layer**: OpenAI GPT-4 integration

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React 18 + Vite                                       │ │
│  │  - Components (Navbar, Cards, etc.)                    │ │
│  │  - Pages (Home, Dashboard, Problem Solver, etc.)       │ │
│  │  - Context (Auth)                                      │ │
│  │  - Monaco Editor for code editing                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Express)                     │
│  ┌─────────────┬─────────────┬─────────────┬──────────────┐ │
│  │   Auth      │    DSA      │   Practice  │     AI       │ │
│  │   Routes    │   Routes    │   Routes    │   Routes     │ │
│  └─────────────┴─────────────┴─────────────┴──────────────┘ │
│  ┌─────────────┬─────────────┬─────────────┬──────────────┐ │
│  │   Resume    │   System    │    User     │  Middleware  │ │
│  │   Routes    │   Design    │   Routes    │  (Auth, etc) │ │
│  └─────────────┴─────────────┴─────────────┴──────────────┘ │
└─────────────────────────────────────────────────────────────┘
                    ↓                          ↓
         ┌──────────────────┐      ┌──────────────────┐
         │   PostgreSQL     │      │   OpenAI API     │
         │   Database       │      │   (GPT-4)        │
         └──────────────────┘      └──────────────────┘
```

## Technology Stack

### Frontend
- **React 18**: UI library with hooks
- **Vite**: Build tool and dev server
- **React Router v6**: Client-side routing
- **Monaco Editor**: Code editor (VS Code engine)
- **Axios**: HTTP client
- **Lucide React**: Icon library
- **CSS**: Custom styles with CSS variables

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **PostgreSQL**: Relational database
- **pg**: PostgreSQL client for Node.js
- **OpenAI SDK**: AI integration
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing
- **rate-limit**: API rate limiting
- **multer**: File uploads

### DevOps
- **Git**: Version control
- **npm**: Package management
- **dotenv**: Environment configuration

## Database Schema

### Tables

#### users
```sql
id              SERIAL PRIMARY KEY
email           VARCHAR(255) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
full_name       VARCHAR(255) NOT NULL
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
last_login      TIMESTAMP
subscription_tier VARCHAR(50) DEFAULT 'free'
experience_level VARCHAR(50) DEFAULT 'beginner'
```

#### patterns
```sql
id              SERIAL PRIMARY KEY
name            VARCHAR(255) NOT NULL
category        VARCHAR(100) NOT NULL
description     TEXT
difficulty      VARCHAR(50)
theory          TEXT
examples        JSONB
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### problems
```sql
id              SERIAL PRIMARY KEY
pattern_id      INTEGER REFERENCES patterns(id)
title           VARCHAR(500) NOT NULL
description     TEXT NOT NULL
difficulty      VARCHAR(50) NOT NULL
constraints     TEXT
examples        JSONB
hints           JSONB
solution_approach TEXT
starter_code    JSONB
test_cases      JSONB
companies       JSONB
tags            JSONB
created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### user_progress
```sql
id              SERIAL PRIMARY KEY
user_id         INTEGER REFERENCES users(id)
problem_id      INTEGER REFERENCES problems(id)
status          VARCHAR(50) DEFAULT 'not_started'
attempts        INTEGER DEFAULT 0
solved_at       TIMESTAMP
last_attempt    TIMESTAMP
best_time_complexity  VARCHAR(100)
best_space_complexity VARCHAR(100)
UNIQUE(user_id, problem_id)
```

#### submissions
```sql
id              SERIAL PRIMARY KEY
user_id         INTEGER REFERENCES users(id)
problem_id      INTEGER REFERENCES problems(id)
code            TEXT NOT NULL
language        VARCHAR(50) NOT NULL
status          VARCHAR(50) NOT NULL
execution_time  FLOAT
memory_used     FLOAT
test_cases_passed INTEGER
total_test_cases INTEGER
ai_feedback     TEXT
submitted_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### mock_interviews
```sql
id              SERIAL PRIMARY KEY
user_id         INTEGER REFERENCES users(id)
interview_type  VARCHAR(100) NOT NULL
difficulty      VARCHAR(50)
duration        INTEGER
questions       JSONB
responses       JSONB
ai_feedback     TEXT
overall_score   FLOAT
communication_score   FLOAT
technical_score       FLOAT
problem_solving_score FLOAT
started_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
completed_at    TIMESTAMP
```

#### resume_analyses
```sql
id              SERIAL PRIMARY KEY
user_id         INTEGER REFERENCES users(id)
resume_text     TEXT NOT NULL
ats_score       FLOAT
strengths       JSONB
weaknesses      JSONB
suggestions     JSONB
keyword_match   JSONB
analyzed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### DSA Patterns
- `GET /api/dsa/patterns` - List all patterns
- `GET /api/dsa/patterns/:id` - Get pattern with problems
- `GET /api/dsa/problems/:id` - Get problem details
- `GET /api/dsa/progress` - Get user progress stats

### Practice
- `POST /api/practice/submit` - Submit solution
- `POST /api/practice/run` - Run code (test)
- `GET /api/practice/submissions` - Get submission history

### AI Features
- `POST /api/ai/code-feedback` - Get AI code review
- `POST /api/ai/mock-interview` - Conduct mock interview
- `POST /api/ai/hint` - Get problem hint
- `POST /api/ai/explain` - Explain code

### System Design
- `GET /api/system-design/topics` - List topics
- `GET /api/system-design/topics/:id` - Get topic details
- `POST /api/system-design/feedback` - Get design feedback
- `POST /api/system-design/diagram-explain` - Explain diagram

### Resume
- `POST /api/resume/analyze` - Analyze resume
- `GET /api/resume/history` - Get analysis history
- `GET /api/resume/:id` - Get specific analysis

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/dashboard` - Get dashboard data

## Authentication Flow

```
1. User submits credentials
   ↓
2. Backend validates credentials
   ↓
3. Generate JWT token (7 day expiry)
   ↓
4. Return token + user data
   ↓
5. Frontend stores in localStorage
   ↓
6. Include token in Authorization header for protected routes
   ↓
7. Backend middleware validates token
```

## AI Integration

### OpenAI GPT-4 Features

1. **Code Feedback**
   - Analyzes time/space complexity
   - Suggests optimizations
   - Identifies code smells
   - Provides improvement suggestions

2. **Mock Interviews**
   - Generates interview questions
   - Provides follow-up questions
   - Evaluates responses
   - Gives feedback scores

3. **System Design Feedback**
   - Evaluates architecture choices
   - Suggests improvements
   - Identifies scalability issues
   - Provides best practices

4. **Resume Analysis**
   - Calculates ATS score
   - Identifies strengths/weaknesses
   - Suggests keyword improvements
   - Provides formatting advice

### Fallback Mechanism

If OpenAI API key is not configured or API fails:
- Returns mock/default responses
- Maintains functionality
- Degrades gracefully

## Security Features

### Authentication
- JWT tokens with 7-day expiry
- Password hashing with bcrypt (10 rounds)
- Secure HTTP-only cookies (optional)

### API Protection
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- CORS configuration
- Input validation with express-validator
- SQL injection prevention (parameterized queries)

### Data Protection
- Environment variables for secrets
- No sensitive data in client
- Secure password requirements (min 6 chars)

## Performance Optimizations

### Database
- Indexed columns for faster queries
- Efficient JOIN operations
- Connection pooling (max 20 connections)

### Frontend
- Code splitting with React.lazy
- Vite's fast HMR
- Monaco Editor loaded on demand
- Optimized bundle size

### API
- Efficient query patterns
- Minimal data transfer
- Response compression
- Caching headers

## Scalability Considerations

### Current Architecture
- Single server setup
- Connection pooling for database
- Stateless API (JWT)

### Future Enhancements
- Load balancing
- Redis for session management
- CDN for static assets
- Database replication
- Microservices architecture
- Message queue for async tasks
- Horizontal scaling

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev  # Runs both backend and frontend
   ```

2. **Database Changes**
   - Modify schema.sql
   - Run `npm run setup` to reset
   - Update seed.js for test data

3. **Adding Features**
   - Backend: Create routes, controllers
   - Frontend: Create pages, components
   - Test locally

4. **Code Quality**
   - ESLint for linting (can add)
   - Prettier for formatting (can add)
   - Manual testing

## Deployment Strategy

### Production Checklist
- [ ] Update JWT_SECRET
- [ ] Configure production database
- [ ] Add OpenAI API key
- [ ] Build frontend (`npm run build`)
- [ ] Set NODE_ENV=production
- [ ] Configure reverse proxy
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Set up CI/CD

### Recommended Stack
- **Hosting**: DigitalOcean, AWS, Heroku
- **Database**: Managed PostgreSQL
- **CDN**: CloudFlare, AWS CloudFront
- **Monitoring**: DataDog, New Relic
- **Logging**: Winston, Loggly

## Error Handling

### Backend
- Global error handler middleware
- Try-catch blocks in async routes
- Database error handling
- OpenAI API error handling

### Frontend
- Error boundaries (can add)
- Axios interceptors
- User-friendly error messages
- Fallback UI for failures

## Testing Strategy

### Unit Tests (to add)
- Backend route handlers
- Database queries
- Utility functions

### Integration Tests (to add)
- API endpoint testing
- Database operations
- Authentication flow

### E2E Tests (to add)
- User signup/login
- Problem solving flow
- Mock interview flow

## Monitoring & Logging

### Backend Logs
- Request/response logging
- Error logging
- Database query logging
- OpenAI API call logging

### Metrics to Track
- API response times
- Database query performance
- User registration/login rates
- Problem submission rates
- AI feature usage

## Future Enhancements

### Phase 1 (Core Features)
- ✅ Authentication
- ✅ DSA Patterns
- ✅ Code Practice
- ✅ AI Integration
- ✅ System Design
- ✅ Mock Interviews
- ✅ Resume Analysis

### Phase 2 (Enhancements)
- [ ] Real code execution (Judge0 integration)
- [ ] More DSA patterns (90+ total)
- [ ] Video mock interviews
- [ ] Peer-to-peer practice
- [ ] Learning paths
- [ ] Spaced repetition
- [ ] Mobile app

### Phase 3 (Advanced)
- [ ] Team/organization features
- [ ] Interview scheduling
- [ ] Mentor matching
- [ ] Course recommendations
- [ ] Certificates
- [ ] Community forum

## Contributing Guidelines

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request
6. Code review
7. Merge to main

## License

MIT License - See LICENSE file for details
