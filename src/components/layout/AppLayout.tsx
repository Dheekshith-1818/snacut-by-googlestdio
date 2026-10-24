import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  Scissors,
  History,
  CreditCard,
  Coins,
  KeyRound,
  Activity,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  Zap,
  ChevronRight,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useSnapCut } from '../../lib/store';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, getEntitlements, switchUserRole } = useSnapCut();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const entitlements = getEntitlements();

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Remove Background', href: '/app/remove-background', icon: Scissors, badge: 'New' },
    { name: 'Job History', href: '/app/history', icon: History },
    { name: 'Plans & Billing', href: '/app/billing', icon: CreditCard },
    { name: 'Buy Credits', href: '/app/credits', icon: Coins },
    { name: 'Subscription', href: '/app/subscription', icon: Zap },
    { name: 'API Keys', href: '/app/api-keys', icon: KeyRound },
    { name: 'API Usage', href: '/app/api-usage', icon: Activity },
    { name: 'Account Settings', href: '/app/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">SnapCut AI</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight">SnapCut AI</span>
              <span className="block text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
                {user?.role === 'admin' ? 'Super Admin' : user?.role === 'pro' ? 'Pro Member' : 'Free Tier'}
              </span>
            </div>
          </Link>
        </div>

        {/* Live Entitlements Widget */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Daily Limit</span>
            <span className="text-cyan-400 font-semibold font-mono">
              {entitlements.daily_remaining} / {entitlements.daily_limit} left
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-sky-500 h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  (entitlements.daily_used / (entitlements.daily_limit || 1)) * 100
                )}%`,
              }}
            />
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Purchased:
            </span>
            <span className="font-bold text-amber-300 font-mono">
              {entitlements.purchased_credits} credits
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const active = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-gradient-to-r from-sky-500/15 to-purple-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-amber-400 hover:bg-amber-950/20 hover:text-amber-300 border border-amber-500/20 mt-4"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>

        {/* User Profile & Role Switcher */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
              {user?.display_name ? user.display_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {user?.display_name || 'Guest User'}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Log out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Role switcher for convenient interactive testing */}
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="block mb-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Test Role View:
            </span>
            <div className="grid grid-cols-3 gap-1">
              {(['user', 'pro', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => switchUserRole(r)}
                  className={`py-1 rounded text-center font-mono capitalize transition-all ${
                    user?.role === r
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-y-auto min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-400">Workspace</span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-semibold text-slate-200 capitalize">
              {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/app/remove-background"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-purple-600 text-xs font-semibold text-white shadow-md shadow-sky-500/20 hover:opacity-95"
            >
              <Scissors className="w-3.5 h-3.5" />
              New Removal
            </Link>
            <Link
              to="/app/credits"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-amber-300 hover:border-amber-500/40 transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Top Up
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">{children}</div>
      </main>
    </div>
  );
};
