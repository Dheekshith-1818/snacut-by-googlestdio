import React from 'react';
import {
  BarChart3,
  CreditCard,
  Repeat,
  Workflow,
  ScrollText,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useSnapCut } from '../../lib/store';

export const AdminAnalyticsPage: React.FC = () => {
  const { transactions, jobs } = useSnapCut();
  const successfulRevenue = transactions
    .filter((t) => t.status === 'successful')
    .reduce((sum, t) => sum + t.amount_minor_units / 100, 0);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Revenue & Usage Analytics
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Conversion metrics, plan distributions, and daily job volume trends.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-mono uppercase">Gross Processed Volume</span>
            <div className="text-3xl font-extrabold text-white mt-2 flex items-baseline gap-1.5">
              <span className="text-xs font-mono text-emerald-400 font-bold">INR</span>
              <span className="font-mono">{successfulRevenue.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5" /> 100% Indian INR
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-mono uppercase">Active Pro Subscribers</span>
            <div className="text-3xl font-extrabold text-cyan-400 font-mono mt-2">12</div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">₹5,988 ARR Run Rate</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 font-mono uppercase">Daily Cutout Velocity</span>
            <div className="text-3xl font-extrabold text-purple-400 font-mono mt-2">
              {jobs.length * 4 + 18}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">Peak hour: 14:00 - 18:00 IST</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminPaymentsPage: React.FC = () => {
  const { transactions } = useSnapCut();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Razorpay Payment & Webhook Ledger
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Audit raw Razorpay transactions, server-side signature verifications, and idempotency status.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-6">Transaction ID</th>
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Payment ID</th>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-6 font-semibold text-cyan-400">{tx.id}</td>
                    <td className="py-3 px-6 text-slate-400">{tx.provider_order_id}</td>
                    <td className="py-3 px-6 text-slate-400">{tx.provider_payment_id || '—'}</td>
                    <td className="py-3 px-6 font-sans text-white capitalize">{tx.transaction_type.replace('_', ' ')}</td>
                    <td className="py-3 px-6 text-emerald-400 font-bold">₹{tx.amount_minor_units / 100}</td>
                    <td className="py-3 px-6 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminSubscriptionsPage: React.FC = () => {
  const { subscription } = useSnapCut();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Subscriptions & Recurring Revenue
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Track active customer renewal dates, cancellation pending states, and dunning cycles.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Active Pro Subscriptions</h2>
          {subscription ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div>
                <p className="text-white font-semibold">Sub ID: {subscription.id}</p>
                <p className="text-slate-400 text-[10px]">
                  Cycle: {new Date(subscription.current_period_start).toLocaleDateString()} — {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                {subscription.status}
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4">No active subscriptions currently on record.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminWorkflowsPage: React.FC = () => {
  const workflows = [
    { id: 'wf_a', name: 'Workflow A: AI Background Removal Pipeline', schedule: 'Triggered on POST /api/v1/jobs', status: 'Healthy', lastRun: '2 mins ago' },
    { id: 'wf_b', name: 'Workflow B: Razorpay Order Creation & Validation', schedule: 'Triggered on Checkout', status: 'Healthy', lastRun: '15 mins ago' },
    { id: 'wf_c', name: 'Workflow C: Razorpay Webhook & Ledger Credit Grant', schedule: 'Triggered on Webhook', status: 'Healthy', lastRun: '15 mins ago' },
    { id: 'wf_d', name: 'Workflow D: Ephemeral Cloudinary Asset Auto-Purge', schedule: 'Scheduled Hourly (0 * * * *)', status: 'Healthy', lastRun: '28 mins ago' },
    { id: 'wf_e', name: 'Workflow E: Operational Error & Quota Alert Monitor', schedule: 'Scheduled Every 15m (*/15 * * * *)', status: 'Healthy', lastRun: '12 mins ago' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            n8n Automation Workflows & Scheduled Jobs
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Health status of backend automation workflows, hourly asset purges, and webhook triggers.
          </p>
        </div>

        <div className="space-y-4">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-purple-400" />
                  <h3 className="font-semibold text-white text-sm">{wf.name}</h3>
                </div>
                <p className="text-xs text-slate-400 font-mono">{wf.schedule}</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-500">Last run: {wf.lastRun}</span>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {wf.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs } = useSnapCut();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Security & Administration Audit Trail
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Immutable log of all administrative credit overrides, role modifications, and system events.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-6">Timestamp</th>
                  <th className="py-3 px-6">Actor</th>
                  <th className="py-3 px-6">Action</th>
                  <th className="py-3 px-6">Target</th>
                  <th className="py-3 px-6 text-right">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-6 text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-6 font-semibold text-white">{log.actor_email}</td>
                    <td className="py-3.5 px-6 text-amber-400 font-bold">{log.action}</td>
                    <td className="py-3.5 px-6 text-slate-400">
                      {log.target_type} ({log.target_id})
                    </td>
                    <td className="py-3.5 px-6 text-right text-slate-500 max-w-xs truncate">
                      {JSON.stringify(log.metadata)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
