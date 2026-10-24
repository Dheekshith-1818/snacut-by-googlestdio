import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Shield, Clock, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <header className="border-b border-slate-800 pb-8">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              Legal & Compliance
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              Privacy & Ephemeral Data Retention Policy
            </h1>
            <p className="mt-2 text-xs text-slate-400 font-mono">
              Effective Date: October 2026 • Version 1.4
            </p>
          </header>

          <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                1. 24-Hour Automated Asset Destruction
              </h2>
              <p>
                SnapCut AI does not store user photos permanently. When an image is uploaded for background removal, it is uploaded to temporary private storage using encrypted signed URLs. Both the original input file and the processed transparent PNG are automatically queued for irreversible cryptographic deletion within 24 hours of creation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                2. Zero AI Training on User Content
              </h2>
              <p>
                Your visual content is your proprietary asset. SnapCut AI does not use, inspect, repurpose, or permit third-party partners to train generative foundation models on user uploaded photos or output masks.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. Information Collected</h2>
              <p>
                We only collect minimal technical data necessary to provide service: your account email, hashed passwords via Supabase Auth, transactional records required for Indian taxation and Razorpay ledger compliance, and sanitized operational server logs.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <header className="border-b border-slate-800 pb-8">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              User Agreement
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              Terms of Service
            </h1>
            <p className="mt-2 text-xs text-slate-400 font-mono">
              Last Updated: October 2026
            </p>
          </header>

          <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. Service Scope & Fair Use</h2>
              <p>
                SnapCut AI grants users access to automated cloud background removal tools. Free accounts are limited to 5 successful processing jobs per day. Pro subscriptions include high-priority processing up to 200 jobs/day subject to reasonable fair-use abuse controls.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. Prohibited Content</h2>
              <p>
                Users agree not to upload illegal, defamatory, non-consensual imagery, or malware. Violation results in immediate account suspension and API key revocation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. Commercial Rights</h2>
              <p>
                You retain complete ownership and commercial reproduction rights over all output images processed through your account.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
          <header className="border-b border-slate-800 pb-8">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              Payment & Billing
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">
              Refund & Cancellation Policy
            </h1>
            <p className="mt-2 text-xs text-slate-400 font-mono">
              Processed via Razorpay Payment Gateway
            </p>
          </header>

          <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. Subscription Cancellation</h2>
              <p>
                You may cancel your Pro Monthly subscription anytime through the Billing section of your dashboard. Upon cancellation, your Pro benefits remain active until the conclusion of your current billing period.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. Refund Eligibility</h2>
              <p>
                If you encounter verified system outages or persistent AI processing errors within 7 days of subscription billing or credit pack purchase, our support team will process a full refund to your original payment method via Razorpay.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
