import React from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Zap,
  Coins,
  History,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Receipt,
  AlertCircle,
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useSnapCut } from '../../lib/store';

export const BillingPage: React.FC = () => {
  const { user, getEntitlements, transactions, ledger, subscription, cancelSubscription } = useSnapCut();
  const entitlements = getEntitlements();

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Billing & Entitlements
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Overview of your current subscription tier, Razorpay transaction history, and immutable credit ledger.
          </p>
        </div>

        {/* Current Plan Overview Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              Active Tier
            </span>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-white">{entitlements.plan.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                {subscription?.status === 'active' ? 'Active Subscription' : 'Free Allowance'}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              {subscription?.status === 'active'
                ? `Billed at ₹499 / month via Razorpay. Next billing cycle: ${new Date(subscription.current_period_end).toLocaleDateString()}.`
                : 'Free starter tier with 5 removals per day. Upgrade to Pro for 200 removals/day and full resolution.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {subscription?.status === 'active' ? (
              <button
                onClick={cancelSubscription}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-red-950/40 text-xs font-semibold text-slate-300 hover:text-red-400 border border-slate-700 transition-colors"
              >
                {subscription.cancel_at_period_end ? 'Cancellation Pending' : 'Cancel Subscription'}
              </button>
            ) : (
              <Link
                to="/pricing"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-sky-500/20 hover:opacity-95"
              >
                Upgrade to Pro (₹499/mo)
              </Link>
            )}
            <Link
              to="/app/credits"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-slate-700"
            >
              Buy Credit Pack
            </Link>
          </div>
        </div>

        {/* 2 Grids: Transactions & Credit Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Razorpay Transactions */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-cyan-400" />
                Payment Transactions
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                Razorpay Verified
              </span>
            </div>

            {transactions.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No transactions recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {tx.transaction_type === 'subscription' ? 'Pro Monthly Subscription' : 'Credit Pack Top Up'}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Order: {tx.provider_order_id} • {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-slate-100">
                        ₹{tx.amount_minor_units / 100}
                      </p>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Immutable Credit Ledger */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                Immutable Credit Ledger
              </h3>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                Balance: {entitlements.purchased_credits}
              </span>
            </div>

            {ledger.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No ledger entries recorded.</p>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {ledger.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-medium text-slate-200 block truncate max-w-xs">
                        {entry.reason}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(entry.created_at).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`font-mono font-bold ${
                          entry.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {entry.amount > 0 ? `+${entry.amount}` : entry.amount}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-mono">
                        Bal: {entry.balance_after}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
