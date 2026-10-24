import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Film,
  BarChart3,
  CreditCard,
  Repeat,
  Terminal,
  Workflow,
  ScrollText,
  ArrowLeft,
  Menu,
  X,
  Lock,
} from 'lucide-react';
import { useSnapCut } from '../../lib/store';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, switchUserRole } = useSnapCut();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is not admin, provide explicit authorization warning with 1-click elevation for audit/testing
  const isAdmin = user?.role === 'admin';

  const adminNav = [
    { name: 'System Overview', href: '/admin', icon: ShieldAlert },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Job Monitor', href: '/admin/jobs', icon: Film },
    { name: 'Analytics & Revenue', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Payment Transactions', href: '/admin/payments', icon: CreditCard },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: Repeat },
    { name: 'Developer API Logs', href: '/admin/api-usage', icon: Terminal },
    { name: 'n8n Workflows', href: '/admin/workflows', icon: Workflow },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-red-500/30 text-center shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Administrator Access Required</h2>
          <p className="text-sm text-slate-400 mb-6">
            The admin console is protected by server-side role validation. Your current account ({user?.email || 'Guest'}) has the <code className="text-red-400 font-mono font-bold">{user?.role || 'unauthenticated'}</code> role.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => switchUserRole('admin')}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20"
            >
              Elevate to Administrator Role
            </button>
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
            >
              Return to User Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-amber-500/20 bg-slate-900/90 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span className="font-bold text-white">SnapCut Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-amber-500/20 flex flex-col transform transition-transform duration-200 md:translate-x-0 md:static ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-amber-500/20 bg-amber-950/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white">SnapCut Admin</span>
              <span className="block text-[10px] text-amber-400 font-mono">STAFF CONSOLE</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {adminNav.map((item) => {
            const active = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/40">
          <Link
            to="/app/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors w-full justify-center"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to User App
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <header className="hidden md:flex h-16 items-center justify-between px-8 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/40 px-3 py-1 rounded-full border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            AUTHENTICATED PRODUCTION GATEWAY
          </div>
          <span className="text-xs text-slate-400">Admin Actor: {user.email}</span>
        </header>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};
