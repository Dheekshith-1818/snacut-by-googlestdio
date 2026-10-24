import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  KeyRound,
  Plus,
  Trash2,
  Copy,
  Check,
  ShieldAlert,
  Terminal,
  ExternalLink,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useSnapCut } from '../../lib/store';

export const ApiKeysPage: React.FC = () => {
  const { apiKeys, generateApiKey, revokeApiKey } = useSnapCut();
  const [newKeyName, setNewKeyName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [oneTimeSecret, setOneTimeSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setIsGenerating(true);
    try {
      const res = await generateApiKey(newKeyName.trim());
      setOneTimeSecret(res.key);
      setNewKeyName('');
    } finally {
      setIsGenerating(false);
    }
  };

  const copySecret = () => {
    if (!oneTimeSecret) return;
    navigator.clipboard.writeText(oneTimeSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Developer API Keys
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Generate cryptographically secure API keys to integrate background removal into automated workflows and applications.
            </p>
          </div>
          <Link
            to="/api-docs"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 hover:text-cyan-300 self-start sm:self-auto"
          >
            <Terminal className="w-4 h-4" />
            View REST API Specs
          </Link>
        </div>

        {/* Secret Display Alert (Shown once upon generation) */}
        {oneTimeSecret && (
          <div className="p-6 rounded-2xl bg-amber-950/60 border border-amber-500/50 space-y-3 shadow-xl">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>Copy Your Secret Key Now</span>
            </div>
            <p className="text-xs text-amber-200/80">
              For security reasons, this secret key is only displayed once. We only store a one-way cryptographic SHA-256 hash in the database.
            </p>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-amber-500/40">
              <code className="text-xs font-mono text-amber-300 flex-1 break-all">
                {oneTimeSecret}
              </code>
              <button
                onClick={copySecret}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <button
              onClick={() => setOneTimeSecret(null)}
              className="text-[11px] font-medium text-amber-400 hover:underline"
            >
              I have saved my key securely in my environment variables
            </button>
          </div>
        )}

        {/* Generate New Key Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            Generate New API Key
          </h2>
          <form onSubmit={handleCreateKey} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="e.g. Production Shopify Webhook or Mobile App"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-bold text-xs shadow hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <KeyRound className="w-3.5 h-3.5" />
              {isGenerating ? 'Generating...' : 'Create Secret Key'}
            </button>
          </form>
        </div>

        {/* Keys List */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Active & Revoked Keys</h3>
            <span className="text-xs font-mono text-slate-500">
              Bearer scheme authorization
            </span>
          </div>

          {apiKeys.length === 0 ? (
            <p className="text-center py-12 text-xs text-slate-500">
              No API keys generated yet. Create one above to get started.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Prefix</th>
                    <th className="py-3 px-6">Created</th>
                    <th className="py-3 px-6">Last Used</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Revoke</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-6 font-semibold text-white">{key.name}</td>
                      <td className="py-3.5 px-6 font-mono text-cyan-400">
                        {key.key_prefix}...
                      </td>
                      <td className="py-3.5 px-6 text-slate-400">
                        {new Date(key.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-6 text-slate-400 font-mono">
                        {key.last_used_at
                          ? new Date(key.last_used_at).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="py-3.5 px-6">
                        {key.revoked_at ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-400 border border-red-800">
                            Revoked
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        {!key.revoked_at && (
                          <button
                            onClick={() => revokeApiKey(key.id)}
                            title="Revoke this API Key"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
