import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scissors,
  Zap,
  Coins,
  History,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Download,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  FileImage,
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useSnapCut } from '../../lib/store';

export const DashboardPage: React.FC = () => {
  const { user, jobs, getEntitlements, subscription, transactions, apiKeys } = useSnapCut();
  const entitlements = getEntitlements();

  const recentJobs = jobs.slice(0, 5);
  const recentTxs = transactions.slice(0, 3);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Greeting & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
                Active Workspace
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {user?.role.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user?.display_name || 'Creator'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Ready to remove backgrounds with sub-pixel edge fidelity? Upload single photos or batch process via API.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <Link
              to="/app/remove-background"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all"
            >
              <Scissors className="w-4 h-4" />
              Upload Image
            </Link>
            <Link
              to="/app/credits"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              Add Credits
            </Link>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Daily Allowance */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Daily Allowance</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-white font-mono">
                {entitlements.daily_remaining}
                <span className="text-sm text-slate-500 font-sans ml-1">
                  / {entitlements.daily_limit} left
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Resets at 00:00 UTC daily.
              </p>
            </div>
            <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (entitlements.daily_used / (entitlements.daily_limit || 1)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Purchased Credits */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Purchased Credits</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-amber-300 font-mono">
                {entitlements.purchased_credits}
                <span className="text-sm text-slate-500 font-sans ml-1">credits</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Permanent balance. Never expires.
              </p>
            </div>
            <Link
              to="/app/credits"
              className="mt-4 text-xs font-semibold text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              Purchase more packs →
            </Link>
          </div>

          {/* Active Plan & Subscription */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Current Membership</span>
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-4">
              <div className="text-xl font-bold text-white">
                {entitlements.plan.name}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {subscription?.status === 'active'
                  ? `Renews on ${new Date(subscription.current_period_end).toLocaleDateString()}`
                  : 'Upgrade to Pro for 200 removals/day'}
              </p>
            </div>
            <Link
              to="/app/billing"
              className="mt-4 text-xs font-semibold text-cyan-400 hover:underline inline-flex items-center gap-1"
            >
              Manage subscription & billing →
            </Link>
          </div>
        </div>

        {/* Recent Jobs Table */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Recent Cutout Jobs</h2>
            </div>
            <Link
              to="/app/history"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              View Full History →
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="text-center py-12 p-4">
              <FileImage className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">No processing jobs yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Upload your first image to preview transparent background removal.
              </p>
              <Link
                to="/app/remove-background"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-cyan-400 hover:bg-slate-700"
              >
                Upload Photo Now
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-6">File Name</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Duration</th>
                    <th className="py-3 px-6">Timestamp</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {recentJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 border border-slate-700">
                          {job.processed_asset_url ? (
                            <img
                              src={job.processed_asset_url}
                              alt="thumb"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileImage className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <span className="truncate max-w-xs">{job.original_filename}</span>
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            job.status === 'completed'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                              : job.status === 'failed'
                              ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                              : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-mono text-slate-400">
                        {job.processing_duration_ms ? `${job.processing_duration_ms} ms` : '—'}
                      </td>
                      <td className="py-3.5 px-6 text-slate-400">
                        {new Date(job.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <Link
                          to={`/app/result/${job.id}`}
                          className="font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                        >
                          Inspect
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 2 Bottom Columns: Payment History & Developer API Snippet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Activity */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                Recent Transactions
              </h3>
              <Link to="/app/billing" className="text-xs text-slate-400 hover:text-white">
                View Ledger
              </Link>
            </div>
            {recentTxs.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No payment events on record.</p>
            ) : (
              <div className="space-y-3">
                {recentTxs.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-200">
                        {tx.transaction_type === 'subscription' ? 'Pro Monthly Plan' : 'Credit Pack Purchase'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {tx.provider_order_id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-white">
                        ₹{tx.amount_minor_units / 100}
                      </p>
                      <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Developer API Quick Status */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  Developer API Access
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold">
                  {apiKeys.length} active key(s)
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Programmatically send images to <code className="text-cyan-300 font-mono">/api/v1/remove-background</code> from your server-side scripts or Zapier/n8n webhooks.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Endpoint: POST v1</span>
              <Link
                to="/app/api-keys"
                className="text-xs font-semibold text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                Manage API Keys →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
