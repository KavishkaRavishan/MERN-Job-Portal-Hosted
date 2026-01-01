import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiBriefcase, FiUser, FiLogIn, FiLogOut, FiFileText } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleMenuToggler = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      await Swal.fire({
        title: 'Logged Out',
        text: 'You have been successfully logged out',
        icon: 'success',
        confirmButtonColor: '#10b981',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl'
        },
        timer: 1500,
        showConfirmButton: false
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { path: "/", title: "Find Jobs", icon: FiBriefcase },
    ...(currentUser ? [
      { path: "/my-job", title: "My Jobs", icon: FiUser },
      { path: "/job-applications", title: "Applications", icon: FiFileText },
      { path: "/post-job", title: "Post a Job", icon: FiBriefcase },
    ] : [])
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass backdrop-blur-lg border-b border-white/20 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center py-4">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
                <FiBriefcase className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-display font-bold gradient-text">
                JobPortal
              </h1>
              <p className="text-xs text-secondary-600 -mt-1">Find Your Dream Job</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-1">
            {navItems.map(({ path, title, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-secondary-700 hover:bg-white/50 hover:text-primary-600'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{title}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-secondary-900">
                      {currentUser.displayName || currentUser.email}
                    </p>
                    <p className="text-xs text-secondary-600">Welcome back!</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary text-sm px-4 py-2 flex items-center space-x-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary text-sm px-4 py-2 flex items-center space-x-2"
                >
                  <FiLogIn className="w-4 h-4" />
                  <span>Log in</span>
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary text-sm px-4 py-2 flex items-center space-x-2"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Sign up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-secondary-700 hover:bg-white/20 transition-all duration-200 focus-ring"
            onClick={handleMenuToggler}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isMenuOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0'
      }`}>
        <div className="glass border-t border-white/20 mx-4 mb-4 rounded-2xl p-6">
          {/* Mobile Navigation Links */}
          <ul className="space-y-3 mb-6">
            {navItems.map(({ path, title, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-secondary-700 hover:bg-white/50 hover:text-primary-600'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          
          {/* Mobile Auth Buttons */}
          <div className="space-y-3 pt-4 border-t border-white/20">
            {currentUser ? (
              <>
                <div className="text-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-semibold">
                      {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-secondary-900">
                    {currentUser.displayName || currentUser.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="btn btn-secondary w-full justify-center text-sm py-3 flex items-center space-x-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-secondary w-full justify-center text-sm py-3 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiLogIn className="w-4 h-4" />
                  <span>Log in</span>
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary w-full justify-center text-sm py-3 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="w-4 h-4" />
                  <span>Sign up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
