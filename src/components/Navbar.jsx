import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Menu, X, Code2, ChevronRight } from 'lucide-react';

export default function Navbar({ hasSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = () => {
    if (!user) return '?';
    const name = user.fullName || user.email || '';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Define public paths that should show the public navbar
  const publicPaths = ['/', '/login', '/signup', '/pricing', '/blog', '/about', '/contact', '/verify-email', '/dsa-patterns', '/dsa-patterns-sheet', '/library'];
  const isPublicPage = publicPaths.includes(location.pathname);

  // Render Public Navbar if not logged in OR if on a public page
  if (!user || isPublicPage) {
    return (
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-content">
          <Link to="/" className="nav-brand">
            <div className="brand-logo">
              <Code2 size={24} color="white" />
            </div>
            <span className="brand-text">CareerLoop</span>
          </Link>

          {/* Desktop Nav */}
          <div className="nav-links desktop-only">
            <a href="/#features" className="nav-link">Features</a>
            <Link to="/library" className="nav-link">Library</Link>
            <Link to="/dsa-patterns-sheet" className="nav-link">DSA Patterns</Link>
            <a href="/#pricing" className="nav-link">Pricing</a>
            <a href="/#faq" className="nav-link">FAQ</a>
            <Link to="/blog" className="nav-link">Blog</Link>
          </div>

          <div className="nav-actions desktop-only">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary glow-effect">
                Go to Dashboard <ChevronRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Sign In</Link>
                <Link to="/signup" className="btn btn-primary glow-effect">
                  Get Started <ChevronRight size={16} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <a href="/#features" className="mobile-link">Features</a>
            <Link to="/library" className="mobile-link">Library</Link>
            <Link to="/dsa-patterns-sheet" className="mobile-link">DSA Patterns</Link>
            <a href="/#pricing" className="mobile-link">Pricing</a>
            <a href="/#faq" className="mobile-link">FAQ</a>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="mobile-link">Sign In</Link>
                <Link to="/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </nav>
    );
  }

  // Dashboard Navbar
  return (
    <div className="navbar navbar-dashboard glass-panel">
      <div className="container nav-content w-full px-6">
        <div className="nav-brand opacity-0">
          {/* Hidden spacer */}
        </div>

        <div className="topbar-right flex items-center gap-6 ml-auto">
          <div className="search-bar">
            <Search size={16} className="search-icon text-muted" />
            <input
              type="text"
              placeholder="Search problems..."
              className="search-input"
            />
          </div>

          <button className="icon-btn">
            <Bell size={20} />
          </button>

          <div
            className="user-avatar"
            title={user.fullName}
          >
            {getInitials()}
          </div>
        </div>
      </div>
    </div>
  );
}
