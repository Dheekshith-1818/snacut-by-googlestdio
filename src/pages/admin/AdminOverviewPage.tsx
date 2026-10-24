import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Film,
  TrendingUp,
  CreditCard,
  Activity,
  Workflow,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Server,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useSnapCut } from '../../lib/store';

export const AdminOverviewPage: React.FC = () => {
  const { jobs, transactions, auditLogs } = useSnapCut();

  const totalRevenue = transactions
    .filter((t) => t.status === 'successful')
    .reduce((sum, t) => sum + t.amount_minor_units / 100, 0);

  const completedJobs = jobs.filter((j) => j.status === 'completed').length;
  const failedJobs = jobs.filter((j) => j.status === 'failed').length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-widest text-amber-400">
              Administrative Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            System Health & Fleet Telemetry
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Real-time infrastructure health, provider SLA uptime, job throughput, and financial performance.
          </p>
        </div>

        {/* 4 Fleet Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-mono uppercase text-slate-400">Total Revenue (Gross)</span>
            <div className="text-3xl font-extrabold text-white mt-2 flex items-baseline gap-1.5">
              <span className="text-xs font-mono text-emerald-400 font-bold">INR</span>
              <span className="font-mono">{totalRevenue.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" /> Razorpay Settled
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-mono uppercase text-slate-400">Total Jobs Ingested</span>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono mt-2">
              {jobs.length}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              {completedJobs} completed • {failedJobs} failed
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-mono uppercase text-slate-400">AI Provider SLA</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-2">
              99.9%
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              Remove.bg & Clipdrop Active
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-mono uppercase text-slate-400">Automated Workflows</span>
            <div className="text-3xl font-extrabold text-purple-400 font-mono mt-2">
              5 / 5
            </div>
            <p className="text-[11px] text-purple-300 mt-2 font-mono">
              n8n Cloud Sync Active
            </p>
          </div>
        </div>

        {/* 2 Grids: Provider Health & Audit Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Provider Health Matrix */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Integration Services Status
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                All Operational
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-white font-sans font-semibold">Remove.bg Core API</p>
                  <p className="text-slate-500 text-[10px]">Primary AI segmentation gateway</p>
                </div>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Normal (480ms)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-white font-sans font-semibold">Cloudinary Storage</p>
                  <p className="text-slate-500 text-[10px]">Signed ephemeral asset delivery & purge</p>
                </div>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-white font-sans font-semibold">Razorpay Payments Gateway</p>
                  <p className="text-slate-500 text-[10px]">Webhook HMAC signature verifier</p>
                </div>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-white font-sans font-semibold">Supabase PostgreSQL</p>
                  <p className="text-slate-500 text-[10px]">RLS isolation & atomic transactions</p>
                </div>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </span>
              </div>
            </div>
          </div>

          {/* Recent Audit Logs */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Security Audit Trail
              </h3>
              <Link to="/admin/audit-logs" className="text-xs text-amber-400 hover:underline">
                View Full Logs →
              </Link>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 text-xs">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 font-mono"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-amber-300 font-bold">{log.action}</span>
                    <span className="text-slate-500 text-[10px]">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] truncate">
                    Actor: {log.actor_email} • Target: {log.target_type} ({log.target_id})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
