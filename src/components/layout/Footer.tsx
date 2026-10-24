import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Clock, Lock, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">24-Hour Auto-Purge</p>
                <p className="text-xs text-slate-400">Temporary images automatically destroyed within 24h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-950/60 border border-purple-800/50 text-purple-400">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">Zero AI Training on User Data</p>
                <p className="text-xs text-slate-400">Your uploads are never stored or used to train models</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-200">Razorpay Encrypted Payments</p>
                <p className="text-xs text-slate-400">Verified server-side signature validation & idempotency</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                SnapCut <span className="text-cyan-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm">
              Commercial-grade AI background removal SaaS. Instant cutouts, transparent PNGs, strict privacy, and developer REST APIs.
            </p>
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} SnapCut AI Technologies. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Product</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/features" className="hover:text-cyan-400 transition-colors">Features</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-cyan-400 transition-colors">Pricing & Packs</Link>
              </li>
              <li>
                <Link to="/api-docs" className="hover:text-cyan-400 transition-colors">Developer API</Link>
              </li>
              <li>
                <Link to="/app/remove-background" className="hover:text-cyan-400 transition-colors">Upload Tool</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-cyan-400 transition-colors">Blog & Guides</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Legal & Trust</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-cyan-400 transition-colors">Refund Policy</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-cyan-400 text-xs text-slate-600 transition-colors">Staff Portal</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
