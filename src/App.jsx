import React, { useState, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Overview from './pages/Overview';
import Dashboard from './pages/Dashboard';
import DSAPatterns from './pages/DSAPatterns';
import PatternDetail from './pages/PatternDetail';
import ProblemSolver from './pages/ProblemSolver';
import SystemDesign from './pages/SystemDesign';
import ResumeAnalysis from './pages/ResumeAnalysis';
import AIInterview from './pages/AIInterview';
import AptitudeMastery from './pages/AptitudeMastery';
import SQLMastery from './pages/SQLMastery';
import LearningPath from './pages/LearningPath';
import LearningPathDetail from './pages/LearningPathDetail';
import DSALearningPath from './pages/DSALearningPath';
import LLDLearningPath from './pages/LLDLearningPath';
import AIModuleDetail from './pages/AIModuleDetail';
import DSAPatternsSheet from './pages/DSAPatternsSheet';
import CodePractice from './pages/CodePractice';
import Community from './pages/Community';
import Pricing from './pages/Pricing';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import CreateBlog from './pages/CreateBlog';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import About from './pages/About';
import Library from './pages/Library';
import Contact from './pages/Contact';
import VerifyEmail from './pages/VerifyEmail';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import StudyPlan from './pages/StudyPlan';
import DataScienceLearningPath from './pages/DataScienceLearningPath';
import PMLearningPath from './pages/PMLearningPath';
import DSABasicsLearningPath from './pages/DSABasicsLearningPath';
import HLDLearningPath from './pages/HLDLearningPath';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Code2 } from 'lucide-react';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('App crash:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: '#ef4444', background: '#050507', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h1>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 20, fontSize: 14, color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', padding: 20, borderRadius: 12 }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ marginTop: 24 }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Public pages that don't show sidebar
  const publicPaths = ['/', '/login', '/signup', '/pricing', '/blog', '/about', '/contact', '/verify-email', '/dsa-patterns', '/privacy', '/terms', '/library'];
  const isPublicPage = publicPaths.includes(location.pathname);
  const showSidebar = user && !isPublicPage;

  return (
    <div className="app-layout">
      {showSidebar && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(prev => !prev)}
        />
      )}

      <div className={`main-content ${showSidebar ? (sidebarCollapsed ? 'sidebar-collapsed' : '') : 'no-sidebar'}`}>
        <Navbar hasSidebar={showSidebar} />

        <div className={showSidebar ? 'page-content' : ''}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute><Dashboard /></PrivateRoute>}
            />
            <Route
              path="/overview"
              element={<PrivateRoute><Overview /></PrivateRoute>}
            />
            <Route path="/dsa-patterns" element={<DSAPatterns />} />
            <Route path="/patterns/:id" element={<PatternDetail />} />
            <Route
              path="/problems/:id"
              element={<PrivateRoute><ProblemSolver /></PrivateRoute>}
            />
            <Route path="/system-design" element={<SystemDesign />} />
            <Route
              path="/resume-analysis"
              element={<PrivateRoute><ResumeAnalysis /></PrivateRoute>}
            />
            <Route
              path="/ai-interview"
              element={<PrivateRoute><AIInterview /></PrivateRoute>}
            />
            <Route
              path="/aptitude-mastery"
              element={<PrivateRoute><AptitudeMastery /></PrivateRoute>}
            />
            <Route
              path="/sql-mastery"
              element={<PrivateRoute><SQLMastery /></PrivateRoute>}
            />

            <Route
              path="/dashboard/learning-path"
              element={<PrivateRoute><LearningPath /></PrivateRoute>}
            />
            <Route
              path="/dashboard/learning-path/:pathId"
              element={<PrivateRoute><LearningPathDetail /></PrivateRoute>}
            />
            <Route path="/dashboard/learning-path/dsa" element={<DSALearningPath />} />
            <Route path="/dashboard/learning-path/lld" element={<LLDLearningPath />} />
            <Route path="/dashboard/learning-path/data-science" element={<DataScienceLearningPath />} />
            <Route path="/dashboard/learning-path/pm" element={<PMLearningPath />} />
            <Route path="/dashboard/learning-path/dsa-basics" element={<DSABasicsLearningPath />} />
            <Route path="/dashboard/learning-path/hld" element={<HLDLearningPath />} />
            <Route
              path="/dashboard/learning-path/ai/module/:moduleId"
              element={<PrivateRoute><AIModuleDetail /></PrivateRoute>}
            />
            <Route path="/dsa-patterns-sheet" element={<DSAPatternsSheet />} />
            <Route path="/code-practice" element={<CodePractice />} />
            <Route path="/community" element={<Community />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/library" element={<Library />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/new" element={<PrivateRoute><CreateBlog /></PrivateRoute>} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path="/dashboard/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/dashboard/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/dashboard/study-plan" element={<PrivateRoute><StudyPlan /></PrivateRoute>} />
            <Route path="/dashboard/history" element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path="/resume-analyzer" element={<Navigate to="/resume-analysis" />} />
          </Routes>
        </div>

        {!showSidebar && <Footer />}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="text-gradient">
              <Code2 size={24} />
              CareerLoop
            </h3>
            <p>
              Comprehensive interview preparation platform helping engineers land their dream jobs at top tech companies.
            </p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul className="footer-links">
              <li><a href="/#features">Features</a></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><Link to="/dsa-patterns-sheet">DSA Sheet</Link></li>
              <li><Link to="/community">Community</Link></li>
              <li><Link to="/dashboard/learning-path">Learning Paths</Link></li>
              <li><a href="/#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 CareerLoop. All rights reserved. Made with ❤️ for engineers.
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
