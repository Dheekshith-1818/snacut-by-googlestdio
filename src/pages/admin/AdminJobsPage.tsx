import React, { useState } from 'react';
import {
  Film,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  RefreshCw,
  FileImage,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useSnapCut } from '../../lib/store';

export const AdminJobsPage: React.FC = () => {
  const { jobs, retryJob } = useSnapCut();
  const [filter, setFilter] = useState('all');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Live Job Queue & Error Inspection
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Monitor real-time image processing jobs, inspect AI provider error codes, and audit storage lifecycle.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-cyan-400" />
              All Tenant Jobs
            </h2>
            <span className="text-xs font-mono text-slate-400">{jobs.length} total jobs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-6">Job ID</th>
                  <th className="py-3 px-6">File</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Provider</th>
                  <th className="py-3 px-6">Failure Detail</th>
                  <th className="py-3 px-6 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-6 font-semibold text-cyan-400">{job.id}</td>
                    <td className="py-3 px-6 font-sans text-white">{job.original_filename}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          job.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : job.status === 'failed'
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-slate-400">{job.provider}</td>
                    <td className="py-3 px-6 text-red-300 font-sans text-xs">
                      {job.failure_message || '—'}
                    </td>
                    <td className="py-3 px-6 text-right text-slate-500">
                      {new Date(job.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
