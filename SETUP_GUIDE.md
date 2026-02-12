# Thita.ai Setup Guide

This guide will help you set up and run the Thita.ai platform locally.

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **PostgreSQL** (v14 or higher)
   - Download from: https://www.postgresql.org/download/
   - Verify: `psql --version`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify: `git --version`

4. **OpenAI API Key** (Optional but recommended)
   - Sign up at: https://platform.openai.com/
   - Get API key from: https://platform.openai.com/api-keys

## Step-by-Step Setup

### 1. Clone the Repository (if not already done)

```bash
git clone <repository-url>
cd thita-ai-platform
```

### 2. Install Dependencies

The dependencies should already be installed, but if not:

```bash
npm install
```

This will install all required packages including:
- Express.js for backend
- React for frontend
- PostgreSQL driver
- OpenAI SDK
- Monaco Editor
- And many more...

### 3. Set Up PostgreSQL Database

#### Option A: Using PostgreSQL locally

1. Start PostgreSQL service:
   ```bash
   # On macOS
   brew services start postgresql
   
   # On Ubuntu/Debian
   sudo systemctl start postgresql
   
   # On Windows
   # PostgreSQL should start automatically
   ```

2. Create the database:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres
   
   # Create database
   CREATE DATABASE thita_ai;
   
   # Exit
   \q
   ```

#### Option B: Using Docker

```bash
docker run --name thita-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=thita_ai \
  -p 5432:5432 \
  -d postgres:14
```

### 4. Configure Environment Variables

The `.env` file has been created with default values. Update it if needed:

```bash
# Open .env in your editor
nano .env  # or vim, code, etc.
```

**Important configurations:**

```env
# Database - Update if your PostgreSQL uses different credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=thita_ai
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Secret - CHANGE THIS for production!
JWT_SECRET=thita-ai-super-secret-jwt-key-change-in-production-12345

# OpenAI API Key - Add your key here for AI features
OPENAI_API_KEY=sk-your-actual-openai-key-here
```

**Note:** The app works without OpenAI API key (uses mock responses), but AI features won't be as powerful.

### 5. Initialize Database Schema and Seed Data

Run the setup script to create tables and add initial data:

```bash
npm run setup
```

This will:
- Create all database tables (users, patterns, problems, etc.)
- Seed 6 DSA patterns (Two Pointers, Sliding Window, Binary Search, etc.)
- Seed 3 practice problems with test cases
- Set up indexes for better performance

You should see output like:
```
🚀 Starting database setup...
📋 Creating database schema...
✅ Schema created successfully!
🌱 Seeding database...
🌱 Seeding patterns...
🌱 Seeding problems...
✅ Database seeded successfully!
🎉 Setup completed successfully!
```

### 6. Start the Development Servers

Start both backend and frontend servers:

```bash
npm run dev
```

This will start:
- **Backend API** on http://localhost:3000
- **Frontend React app** on http://localhost:5173

You should see:
```
🚀 Server running on http://localhost:3000
📚 API documentation available at http://localhost:3000/api
✅ Database connected successfully

> VITE v5.x.x ready in xxx ms
> ➜ Local: http://localhost:5173/
```

### 7. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/health (for health check)

## Testing the Setup

### 1. Create an Account

1. Go to http://localhost:5173
2. Click "Sign Up"
3. Fill in:
   - Full Name: Test User
   - Email: test@example.com
   - Password: password123
4. Click "Sign Up"

### 2. Explore Features

After logging in, you can:

- **Dashboard**: View your progress and statistics
- **DSA Patterns**: Browse 6+ algorithmic patterns
- **Code Practice**: Solve problems with Monaco editor
- **System Design**: Design systems with AI feedback
- **Mock Interview**: Practice with AI interviewer
- **Resume Analysis**: Get ATS score and suggestions

### 3. Try a Coding Problem

1. Go to "DSA Patterns"
2. Click on "Two Pointers" pattern
3. Click on "Two Sum" problem
4. Write your solution in the code editor
5. Click "Run Code" to test
6. Click "Submit" to submit solution
7. Get AI feedback on your code

## Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use:

```bash
# Change PORT in .env
PORT=3001

# Or kill the process using the port
# On macOS/Linux
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Error

```
❌ Unexpected error on idle client
```

**Solutions:**
1. Check if PostgreSQL is running:
   ```bash
   # macOS/Linux
   pg_isready
   
   # Or check service status
   brew services list  # macOS
   systemctl status postgresql  # Linux
   ```

2. Verify database credentials in `.env`
3. Make sure database `thita_ai` exists:
   ```bash
   psql -U postgres -l
   ```

4. Test connection manually:
   ```bash
   psql -h localhost -U postgres -d thita_ai
   ```

### Module Not Found Errors

If you see module import errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### AI Features Not Working

If AI features return mock data:

1. Check if `OPENAI_API_KEY` is set in `.env`
2. Verify API key is valid
3. Check OpenAI API status: https://status.openai.com/
4. Ensure you have API credits: https://platform.openai.com/usage

### React/Vite Build Errors

```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

## Development Tips

### Running Servers Separately

Instead of `npm run dev`, you can run servers separately:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Adding More Problems

To add more DSA problems, you can:

1. Insert directly into database:
   ```sql
   INSERT INTO problems (pattern_id, title, description, difficulty, ...)
   VALUES (1, 'New Problem', 'Description', 'Medium', ...);
   ```

2. Or modify `server/db/seed.js` and re-run setup

### Database Management

View data:
```bash
psql -U postgres -d thita_ai

# List tables
\dt

# View patterns
SELECT * FROM patterns;

# View problems
SELECT * FROM problems;

# View users
SELECT id, email, full_name FROM users;
```

Reset database:
```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE thita_ai;"
psql -U postgres -c "CREATE DATABASE thita_ai;"

# Re-run setup
npm run setup
```

### API Testing

Test API endpoints with curl:

```bash
# Health check
curl http://localhost:3000/health

# Get patterns
curl http://localhost:3000/api/dsa/patterns

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Production Deployment

For production deployment:

1. **Update environment variables:**
   - Use strong `JWT_SECRET`
   - Use production database URL
   - Set `NODE_ENV=production`

2. **Build frontend:**
   ```bash
   npm run build
   ```

3. **Use process manager:**
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name thita-api
   ```

4. **Set up reverse proxy (Nginx):**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     
     location / {
       root /path/to/dist;
       try_files $uri $uri/ /index.html;
     }
     
     location /api {
       proxy_pass http://localhost:3000;
     }
   }
   ```

5. **Enable HTTPS with Let's Encrypt**
6. **Set up database backups**
7. **Configure monitoring and logging**

## Support

If you encounter issues:

1. Check the console for error messages
2. Review server logs
3. Check database connectivity
4. Verify environment variables
5. Look at the troubleshooting section above

For more help, create an issue in the repository with:
- Error message
- Steps to reproduce
- Your environment (OS, Node version, etc.)

## Next Steps

- Explore all features
- Try solving DSA problems
- Practice mock interviews
- Analyze your resume
- Design scalable systems
- Track your progress

Happy coding! 🚀
