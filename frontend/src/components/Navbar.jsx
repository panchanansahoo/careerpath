import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Menu, X, Code2, ChevronRight, User, LogOut, BookOpen, Settings } from 'lucide-react';

import logo from '../assets/logo.svg';

export default function Navbar({ hasSidebar, onMobileMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
  const publicPaths = ['/', '/login', '/signup', '/pricing', '/blog', '/about', '/contact', '/verify-email', '/dsa-patterns', '/library'];
  const isPublicPage = publicPaths.includes(location.pathname);

  // Render Public Navbar if not logged in OR if on a public page
  if (!user || isPublicPage) {
    return (
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-content">
          <Link to="/" className="nav-brand">
            <div className="brand-logo">
              <img src={logo} alt="PrepLoop" className="h-8 w-8 object-contain" />
            </div>
            <span className="brand-text">PrepLoop</span>
          </Link>

          {/* Desktop Nav */}
          <div className="nav-links desktop-only">
            <a href="/#features" className="nav-link">Features</a>
            <Link to="/library" className="nav-link">Library</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
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
            <Link to="/dashboard" className="mobile-link">Dashboard</Link>
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
        <div className="nav-brand flex items-center gap-4">
          <button
            className="icon-btn mobile-only"
            onClick={onMobileMenuToggle}
          >
            <Menu size={24} />
          </button>

          <div className="opacity-0 desktop-only">
            {/* Hidden spacer or logo if needed */}
          </div>
        </div>

        <div className="topbar-right flex items-center gap-6 ml-auto">
          <div className="search-bar desktop-only">
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

          <div className="relative" ref={dropdownRef}>
            <button
              className="user-avatar cursor-pointer hover:ring-2 ring-primary/50 transition-all duration-300"
              title={user.fullName}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {getInitials()}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl glass-panel border border-white/10 shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-white/5 bg-white/5">
                  <p className="font-medium text-white truncate">{user.fullName}</p>
                  <p className="text-xs text-muted truncate">{user.email}</p>
                </div>

                <div className="p-2">


                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <User size={16} className="text-gray-400" />
                    My Profile
                  </Link>

                  <div className="h-px bg-white/5 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
