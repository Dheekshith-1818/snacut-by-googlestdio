import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Zap, Coins, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { useSnapCut, INITIAL_PLANS, CREDIT_PACKS } from '../../lib/store';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, createOrder, verifyPayment } = useSnapCut();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successModal, setSuccessModal] = useState<string | null>(null);

  const handlePurchase = async (id: string, isSubscription: boolean) => {
    if (!user) {
      navigate('/login?redirect=/pricing');
      return;
    }

    try {
      setProcessingId(id);
      // Create backend transaction
      const tx = await createOrder(id, isSubscription);

      // In production, Razorpay Checkout SDK is triggered:
      // window.Razorpay({...})
      // Here we simulate the verified server-side signature webhook response
      setTimeout(async () => {
        const verified = await verifyPayment({
          razorpay_order_id: tx.provider_order_id,
          razorpay_payment_id: `pay_${Date.now()}_test`,
          razorpay_signature: `sig_verified_${Date.now()}`,
          transaction_id: tx.id,
        });

        setProcessingId(null);
        if (verified) {
          setSuccessModal(
            isSubscription
              ? 'Pro Monthly Subscription activated successfully! 200 daily high-speed removals are now live.'
              : 'Credit Pack added to your account! Your credits never expire.'
          );
        }
      }, 1000);
    } catch {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              Clear & Predictable Pricing
            </span>
            <h1 className="mt-2 text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
              Choose the Plan That Fits Your Scale
            </h1>
            <p className="mt-4 text-base text-slate-400">
              Transparent Indian Rupee (INR) pricing. All prices include applicable taxes. No hidden charges or automatic lock-in.
            </p>
          </div>

          {/* Subscription Plans Grid */}
          <div className="mb-20">
            <h2 className="text-xl font-bold text-slate-200 mb-8 text-center flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Monthly Subscription Plans
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Starter */}
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Free Starter</h3>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold text-white">
                    ₹0
                    <span className="ml-1 text-sm font-medium text-slate-400">/ forever</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Get started with zero payment commitment.
                  </p>

                  <ul className="mt-8 space-y-3.5 text-sm text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      5 free successfully processed images / day
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      Standard resolution PNG output
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      Interactive transparency preview
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      24-hour temporary file retention
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => navigate('/app/remove-background')}
                  className="mt-8 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
                >
                  Current Free Allowance
                </button>
              </div>

              {/* Pro Monthly */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500 shadow-2xl shadow-cyan-500/15 flex flex-col justify-between relative">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider">
                  Recommended For Creators
                </span>

                <div>
                  <h3 className="text-xl font-bold text-white">Pro Monthly</h3>
                  <div className="mt-4 flex items-baseline text-4xl font-extrabold text-white">
                    ₹499
                    <span className="ml-1 text-sm font-medium text-slate-400">/ month</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Launch price. Cancel anytime in one click.
                  </p>

                  <ul className="mt-8 space-y-3.5 text-sm text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      Up to 200 images / day (6,000/mo fair use)
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      Full resolution up to 5000 × 5000 px
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      Priority AI inference queue
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      Commercial rights & Developer API keys
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      Extended 7-day job history metadata
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => handlePurchase('plan_pro_monthly', true)}
                  disabled={processingId === 'plan_pro_monthly'}
                  className="mt-8 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {processingId === 'plan_pro_monthly' ? (
                    'Connecting to Razorpay...'
                  ) : (
                    <>
                      <span>Upgrade to Pro — ₹499/mo</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Credit Packs */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-xl font-bold text-slate-200 flex items-center justify-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                Pay-As-You-Go Credit Packs
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Don’t want a monthly subscription? Purchase credits on-demand. Credits never expire and rollover automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {CREDIT_PACKS.map((pack) => (
                <div
                  key={pack.id}
                  className={`p-6 rounded-2xl bg-slate-900 border flex flex-col justify-between ${
                    pack.popular
                      ? 'border-amber-500/80 shadow-lg shadow-amber-500/10'
                      : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base">{pack.name}</h3>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-950/60 text-amber-400 border border-amber-500/30">
                        {pack.badge}
                      </span>
                    </div>

                    <div className="mt-4 flex items-baseline text-3xl font-extrabold text-white">
                      ₹{pack.price_minor_units / 100}
                    </div>
                    <p className="mt-1 text-xs text-slate-400 font-medium">
                      {pack.credits} processing credits
                    </p>

                    <ul className="mt-6 space-y-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        No expiration date
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        Full resolution downloads
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                        Razorpay encrypted checkout
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => handlePurchase(pack.id, false)}
                    disabled={processingId === pack.id}
                    className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    {processingId === pack.id ? 'Securing Order...' : `Buy ${pack.credits} Credits`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Payment Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-emerald-500/40 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-500/60 mx-auto flex items-center justify-center text-emerald-400 mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Payment Confirmed</h3>
            <p className="text-sm text-slate-300 mb-6">{successModal}</p>
            <button
              onClick={() => {
                setSuccessModal(null);
                navigate('/app/dashboard');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-semibold text-sm"
            >
              Continue to Workspace
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
