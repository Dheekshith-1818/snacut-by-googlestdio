import React, { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  Clock,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useSnapCut } from '../../lib/store';

export const SettingsPage: React.FC = () => {
  const { user } = useSnapCut();
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      user.display_name = displayName;
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Account & Security Settings
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Manage your personal profile, notification preferences, and privacy settings.
          </p>
        </div>

        {savedNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile settings saved successfully.</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            Personal Information
          </h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-semibold text-xs shadow hover:opacity-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Security & Retention Details */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-400" />
            Security & Retention Policies
          </h2>
          <div className="space-y-2 text-xs text-slate-400">
            <p>
              • <strong>Temporary Storage:</strong> Uploaded images and generated transparent PNGs reside in private Cloudinary storage with signed delivery URLs.
            </p>
            <p>
              • <strong>24-Hour Purge:</strong> Both original and processed assets are permanently deleted within 24 hours of generation by our n8n scheduled cleanup workflow.
            </p>
            <p>
              • <strong>Authentication:</strong> Encrypted password hashing and Google OAuth handled through Supabase Auth.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
