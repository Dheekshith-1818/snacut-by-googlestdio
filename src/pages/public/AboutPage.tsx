import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Sparkles, ShieldCheck, Target, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              Our Mission
            </span>
            <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
              Background Removal Made Frictionless
            </h1>
            <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We started SnapCut AI to liberate creators and digital businesses from the tedious friction of manual lasso selections and costly desktop licenses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Uncompromising Edge Quality</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We obsess over the fine details — hair wisps, translucent drapery, reflective jewelry, and tricky shadows. If the edge isn’t pristine, the tool isn’t ready.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Ethical Privacy Commitment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your images belong solely to you. We never train generative foundation models on user uploads and enforce automated 24-hour file destruction.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white">Our Architecture Principles</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              SnapCut AI is engineered around strict zero-trust principles: verified server-side payment signatures (Razorpay), atomic PostgreSQL credit locking, provider failover adapters, and signed delivery URLs.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
