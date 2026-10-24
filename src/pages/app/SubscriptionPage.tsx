import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useSnapCut } from '../../lib/store';

export const SubscriptionPage: React.FC = () => {
  const { subscription, cancelSubscription, createOrder, verifyPayment } = useSnapCut();
  const [cancelling, setCancelling] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const handleCancel = () => {
    setCancelling(true);
    cancelSubscription();
    setCancelling(false);
  };

  const handleSubscribePro = async () => {
    setUpgrading(true);
    try {
      const tx = await createOrder('plan_pro_monthly', true);
      setTimeout(async () => {
        await verifyPayment({
          razorpay_order_id: tx.provider_order_id,
          razorpay_payment_id: `pay_${Date.now()}_sub`,
          razorpay_signature: `sig_verified_${Date.now()}`,
          transaction_id: tx.id,
        });
        setUpgrading(false);
      }, 1000);
    } catch {
      setUpgrading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Subscription Management
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            View active subscription renewal terms, manage payment status, or modify your recurring membership.
          </p>
        </div>

        {subscription?.status === 'active' ? (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400">
                  Recurring Plan
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">Pro Monthly Membership</h2>
                <p className="text-xs text-slate-400">₹499 per month • Paid via Razorpay</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 self-start sm:self-auto">
                {subscription.cancel_at_period_end ? 'Cancellation Scheduled' : 'Active & Auto-Renewing'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] font-mono uppercase mb-1">
                  Current Billing Cycle
                </span>
                <p className="text-slate-200 font-medium">
                  {new Date(subscription.current_period_start).toLocaleDateString()} —{' '}
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px] font-mono uppercase mb-1">
                  Entitlement Allowance
                </span>
                <p className="text-cyan-400 font-medium">
                  200 images / day • Full 5000px Resolution
                </p>
              </div>
            </div>

            {subscription.cancel_at_period_end ? (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300">
                Your subscription has been marked for cancellation. You will retain full Pro access until the end of the billing period on {new Date(subscription.current_period_end).toLocaleDateString()}.
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Cancel anytime. No penalties or cancellation fees.
                </span>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-red-950/40 text-xs font-semibold text-red-400 border border-slate-700 transition-colors"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-800 mx-auto flex items-center justify-center text-cyan-400">
              <Zap className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl font-bold text-white">You are on the Free Starter Tier</h2>
              <p className="text-xs text-slate-400">
                Upgrade to Pro Monthly (₹499/mo) to unlock 200 removals per day, full camera resolution, developer REST API keys, and priority processing.
              </p>
            </div>
            <button
              onClick={handleSubscribePro}
              disabled={upgrading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-sky-500/25 hover:opacity-95"
            >
              {upgrading ? 'Connecting to Razorpay...' : 'Activate Pro Monthly — ₹499/mo'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
