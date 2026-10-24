import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Download,
  Clock,
  ArrowRight,
  FileImage,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useSnapCut } from '../../lib/store';
import { ProcessingJob } from '../../types';

export const HistoryPage: React.FC = () => {
  const { jobs, retryJob } = useSnapCut();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.original_filename.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const handleRetry = async (jobId: string) => {
    setRetryingId(jobId);
    await retryJob(jobId);
    setRetryingId(null);
  };

  const handleDownload = (job: ProcessingJob) => {
    if (!job.processed_asset_url) return;
    const a = document.createElement('a');
    a.href = job.processed_asset_url;
    a.download = `snapcut_${job.original_filename.replace(/\.[^/.]+$/, '')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Processing History & Assets
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Inspect past background removals. Assets are temporarily accessible for 24 hours from creation.
            </p>
          </div>
          <Link
            to="/app/remove-background"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-xs font-semibold text-white shadow-md hover:opacity-95 self-start sm:self-auto"
          >
            Upload New Image
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by image filename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 w-full sm:w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 p-4">
              <FileImage className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No jobs match your search</p>
              <p className="text-xs text-slate-500 mt-1">Try clearing filters or search keywords.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-6">Image</th>
                    <th className="py-3.5 px-6">Filename</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6">Duration</th>
                    <th className="py-3.5 px-6">Retention Window</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredJobs.map((job) => {
                    const isExpired = new Date(job.expires_at).getTime() < Date.now();
                    return (
                      <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-6">
                          <div className="w-10 h-10 rounded-lg bg-checkerboard overflow-hidden border border-slate-800 flex items-center justify-center">
                            {job.processed_asset_url && !isExpired ? (
                              <img
                                src={job.processed_asset_url}
                                alt="thumb"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FileImage className="w-5 h-5 text-slate-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-6 font-medium text-white max-w-xs truncate">
                          {job.original_filename}
                          <span className="block text-[10px] text-slate-500 font-mono">
                            {job.id}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          {isExpired ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                              Expired
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                job.status === 'completed'
                                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                                  : job.status === 'failed'
                                  ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                                  : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {job.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-6 font-mono text-slate-400">
                          {job.processing_duration_ms ? `${job.processing_duration_ms} ms` : '—'}
                        </td>
                        <td className="py-3 px-6 text-slate-400 font-mono text-[11px]">
                          {isExpired ? (
                            <span className="text-slate-500">Purged from storage</span>
                          ) : (
                            <span className="text-cyan-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Active (24h)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {job.status === 'completed' && !isExpired && (
                              <button
                                onClick={() => handleDownload(job)}
                                title="Download transparent PNG"
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {job.status === 'failed' && (
                              <button
                                onClick={() => handleRetry(job.id)}
                                disabled={retryingId === job.id}
                                title="Retry processing"
                                className="p-1.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400 hover:text-white"
                              >
                                <RefreshCw className={`w-3.5 h-3.5 ${retryingId === job.id ? 'animate-spin' : ''}`} />
                              </button>
                            )}

                            <Link
                              to={`/app/result/${job.id}`}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400"
                            >
                              Inspect
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};
