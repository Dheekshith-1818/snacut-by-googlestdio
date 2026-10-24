import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useSnapCut } from '../../lib/store';

export const AdminUsersPage: React.FC = () => {
  const { user, creditAccount, adminAdjustCredits } = useSnapCut();
  const [search, setSearch] = useState('');
  const [selectedUserForAdjustment, setSelectedUserForAdjustment] = useState<string | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(10);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');
  const [notice, setNotice] = useState<string | null>(null);

  const mockUsers = [
    {
      id: user?.id || 'usr_demo_01',
      email: user?.email || 'demo@snapcut.ai',
      display_name: user?.display_name || 'Alex Vance',
      role: user?.role || 'user',
      purchased_credits: creditAccount.purchased_balance,
      created_at: '2026-10-15',
    },
    {
      id: 'usr_sarah_02',
      email: 'sarah.c@shopifybrand.com',
      display_name: 'Sarah Chen',
      role: 'pro',
      purchased_credits: 145,
      created_at: '2026-10-18',
    },
    {
      id: 'usr_devon_03',
      email: 'devon@agency.io',
      display_name: 'Devon Patel',
      role: 'user',
      purchased_credits: 0,
      created_at: '2026-10-21',
    },
  ];

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForAdjustment || !adjustmentReason.trim()) {
      alert('A valid reason is required for administrative credit adjustments.');
      return;
    }

    const ok = adminAdjustCredits(selectedUserForAdjustment, adjustmentAmount, adjustmentReason);
    if (ok) {
      setNotice(`Granted ${adjustmentAmount} credits to ${selectedUserForAdjustment} with audit logging.`);
      setSelectedUserForAdjustment(null);
      setAdjustmentReason('');
      setTimeout(() => setNotice(null), 4000);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              User Directory & Entitlement Controls
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Inspect user roles, credit accounts, and record audited administrative balance overrides.
            </p>
          </div>
        </div>

        {notice && (
          <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notice}</span>
          </div>
        )}

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Registered Users</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {mockUsers.length} accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Credit Balance</th>
                  <th className="py-3 px-6">Registration</th>
                  <th className="py-3 px-6 text-right">Credit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {mockUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-6 font-medium text-white">
                      <div>{u.display_name}</div>
                      <span className="text-[10px] text-slate-500 font-mono">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-mono font-bold text-amber-300">
                      {u.purchased_credits}
                    </td>
                    <td className="py-3.5 px-6 text-slate-400 font-mono">{u.created_at}</td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedUserForAdjustment(u.id)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                      >
                        Adjust Credits
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Audited Credit Adjustment */}
        {selectedUserForAdjustment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  Manual Credit Adjustment
                </h3>
                <button
                  onClick={() => setSelectedUserForAdjustment(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleApplyAdjustment} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Target User ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedUserForAdjustment}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Credit Adjustment (+ or -)
                  </label>
                  <input
                    type="number"
                    value={adjustmentAmount}
                    onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Mandatory Operational Audit Reason
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Compensating customer for provider timeout on job_81920"
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUserForAdjustment(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow"
                  >
                    Commit Adjustment & Audit Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
