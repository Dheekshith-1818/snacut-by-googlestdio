import React, { useState } from 'react';
import {
  Coins,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useSnapCut, CREDIT_PACKS } from '../../lib/store';

export const CreditsPage: React.FC = () => {
  const { creditAccount, createOrder, verifyPayment, ledger } = useSnapCut();
  const [buyingPackId, setBuyingPackId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleBuyPack = async (packId: string) => {
    setBuyingPackId(packId);
    try {
      const tx = await createOrder(packId, false);
      setTimeout(async () => {
        await verifyPayment({
          razorpay_order_id: tx.provider_order_id,
          razorpay_payment_id: `pay_${Date.now()}_credits`,
          razorpay_signature: `sig_verified_${Date.now()}`,
          transaction_id: tx.id,
        });
        setBuyingPackId(null);
        setSuccessNotice('Credits successfully credited to your account ledger!');
        setTimeout(() => setSuccessNotice(null), 4000);
      }, 1000);
    } catch {
      setBuyingPackId(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Purchase Processing Credits
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              One-time credit packs for on-demand image processing. Credits never expire and rollover automatically.
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center gap-2 self-start sm:self-auto">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Current Balance: <strong>{creditAccount.purchased_balance}</strong> credits</span>
          </div>
        </div>

        {successNotice && (
          <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Credit Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`p-6 rounded-3xl bg-slate-900 border flex flex-col justify-between relative ${
                pack.popular
                  ? 'border-amber-500/80 shadow-2xl shadow-amber-500/10'
                  : 'border-slate-800'
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase font-mono tracking-wider">
                  Best Value
                </span>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">{pack.name}</h3>
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                    {pack.badge}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline text-3xl font-extrabold text-white">
                  ₹{pack.price_minor_units / 100}
                </div>
                <p className="mt-1 text-xs text-slate-400 font-mono">
                  {pack.credits} image processing credits
                </p>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    Permanent validity (never expire)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    Full resolution output up to 5000px
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    Instant activation via Razorpay
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    Commercial reproduction license
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleBuyPack(pack.id)}
                disabled={buyingPackId === pack.id}
                className="mt-8 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                {buyingPackId === pack.id ? 'Connecting Gateway...' : `Buy ${pack.credits} Credits`}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Credit Rules Callout */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            Credit Accounting Guarantees
          </h4>
          <p>
            • <strong>Reserved Atomically:</strong> A credit is locked while processing and only permanently consumed upon successful PNG output.
          </p>
          <p>
            • <strong>Automatic Release:</strong> If an AI provider times out or an uploaded image fails validation, your reserved credit is automatically restored to your balance.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};
