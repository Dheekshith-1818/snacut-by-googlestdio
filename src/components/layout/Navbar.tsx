import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useSnapCut } from '../../lib/store';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, getEntitlements } = useSnapCut();
  const entitlements = getEntitlements();

  const navLinks = [
    { label: 'Features', path: '/features' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'API Docs', path: '/api-docs' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-purple-600 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              SnapCut <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">AI</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-white ${
                isActive(link.path) ? 'text-cyan-400 font-semibold' : 'text-slate-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  <strong className="text-white">{entitlements.total_available_credits}</strong> credits
                </span>
              </div>
              <Link
                to="/app/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:opacity-95 hover:shadow-sky-500/40"
              >
                Go to Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-500/20 hover:opacity-95 transition-all"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path) ? 'bg-slate-900 text-cyan-400' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            {user ? (
              <Link
                to="/app/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Open Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-sm font-medium text-slate-300 border border-slate-800 rounded-lg hover:bg-slate-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-purple-600 rounded-lg shadow-md"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
