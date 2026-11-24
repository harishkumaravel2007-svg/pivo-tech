import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Founder', path: '/founder' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Clients & Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#101B33]/95 backdrop-blur-md border-b border-[#202E4C] shadow-md py-3'
          : 'bg-[#101B33] border-b border-[#1A2846] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo variant="dark" size="md" />

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#C6A15B] bg-white/5 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Phone Call button */}
            <a
              href="tel:+919944245043"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              title="Call Harish K (+91 99442 45043)"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>+91 99442 45043</span>
            </a>

            {/* Admin Access indicator */}
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1C2C4E] text-[#E5C378] border border-[#C6A15B]/30 hover:bg-[#24375F] transition-colors"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Admin</span>
              </Link>
            ) : null}

            {/* Main Primary CTA */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#C6A15B] text-[#101B33] hover:bg-[#D4AF37] shadow-sm transition-all duration-150 font-semibold active:scale-[0.98]"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 xl:hidden">
            <Link
              to="/contact"
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#C6A15B] text-[#101B33]"
            >
              Contact
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0C1527] border-b border-slate-800 px-4 pt-3 pb-6 space-y-1 animate-fade-in shadow-xl">
          <div className="grid grid-cols-2 gap-1 mb-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#C6A15B] bg-white/10 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span>Theni, Tamil Nadu, India</span>
              <a href="tel:+919944245043" className="text-[#C6A15B] font-medium">+91 99442 45043</a>
            </div>
            <Link
              to="/contact"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#C6A15B] text-[#101B33] text-center"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="w-full text-center py-2 text-xs font-semibold text-[#E5C378] bg-[#1A2744] rounded-lg"
              >
                Open Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="w-full text-center py-1.5 text-xs text-slate-500 hover:text-slate-400"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
