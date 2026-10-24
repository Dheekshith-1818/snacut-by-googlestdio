import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Copy,
  Check,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const ApiDocsPage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const curlSnippet = `curl -X POST https://snapcut.ai/api/v1/remove-background \\
  -H "Authorization: Bearer sc_live_9a4f8b2c1e7d..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "image_url": "https://example.com/product.jpg",
    "output_format": "png",
    "idempotency_key": "order_sku_98210"
  }'`;

  const jsonResponse = `{
  "success": true,
  "job_id": "job_98a72b1c",
  "status": "completed",
  "result_url": "https://res.cloudinary.com/snapcut/image/upload/s--xyz--/v1/proc_98a72b1c.png",
  "processing_duration_ms": 520,
  "width": 1920,
  "height": 1080,
  "expires_at": "2026-10-24T18:00:00Z"
}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              Developer Documentation
            </span>
            <h1 className="mt-2 text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
              SnapCut AI REST API
            </h1>
            <p className="mt-4 text-base text-slate-400">
              Integrate background removal directly into your mobile apps, Shopify stores, and enterprise asset workflows.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link
                to="/app/api-keys"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-xs font-semibold text-white shadow-md shadow-sky-500/20 hover:opacity-95"
              >
                <KeyRound className="w-4 h-4" />
                Generate API Key in Dashboard
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Documentation Overview */}
            <div className="space-y-8">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  Authentication
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authenticate requests by passing your high-entropy secret key in the <code className="text-cyan-300 font-mono">Authorization</code> header using the Bearer scheme.
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400">
                  Authorization: Bearer sc_live_xxxxxxxxxxxxxxxx
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h2 className="text-lg font-bold text-white">Rate Limits & Quotas</h2>
                <ul className="text-xs text-slate-400 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-slate-200">Pro Plan:</span>
                    <span>120 requests / minute, up to 5,000 requests / month.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-slate-200">Credit Packs:</span>
                    <span>Consumes 1 credit per successful 200 OK processing response.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-slate-200">Idempotency:</span>
                    <span>Pass an <code className="text-cyan-400 font-mono">idempotency_key</code> to avoid duplicate credit consumption on retried network requests.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h2 className="text-lg font-bold text-white">HTTP Error Status Codes</h2>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-emerald-400">200 OK</span>
                    <span className="text-slate-400">Cutout processed and returned successfully</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-amber-400">400 Bad Request</span>
                    <span className="text-slate-400">Unsupported format or file exceeds 10 MB</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-red-400">401 Unauthorized</span>
                    <span className="text-slate-400">Invalid or revoked API key</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-red-400">402 Payment Required</span>
                    <span className="text-slate-400">Daily quota and credit balance exhausted</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-purple-400">429 Rate Limit</span>
                    <span className="text-slate-400">Rate limit exceeded, back off with jitter</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <div className="space-y-6">
              {/* Request */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold">
                      POST
                    </span>
                    /api/v1/remove-background
                  </span>
                  <button
                    onClick={() => copyToClipboard(curlSnippet, 1)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Copy cURL command"
                  >
                    {copiedIndex === 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                  {curlSnippet}
                </pre>
              </div>

              {/* Response */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      200
                    </span>
                    Response JSON
                  </span>
                  <button
                    onClick={() => copyToClipboard(jsonResponse, 2)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Copy JSON response"
                  >
                    {copiedIndex === 2 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-purple-300 overflow-x-auto leading-relaxed">
                  {jsonResponse}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
