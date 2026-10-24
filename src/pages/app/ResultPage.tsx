import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Download,
  Scissors,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Sliders,
  Layers,
  Sparkles,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { BeforeAfterSlider } from '../../components/ui/BeforeAfterSlider';
import { useSnapCut } from '../../lib/store';

export const ResultPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { jobs, retryJob } = useSnapCut();

  const [viewMode, setViewMode] = useState<'slider' | 'cutout' | 'side_by_side'>('slider');
  const [retrying, setRetrying] = useState(false);

  const job = jobs.find((j) => j.id === jobId);

  if (!job) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto text-center py-16 space-y-4">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Job Not Found or Expired</h2>
          <p className="text-xs text-slate-400">
            This processing job does not exist or has passed its 24-hour retention window.
          </p>
          <Link
            to="/app/remove-background"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Start New Cutout
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleDownload = () => {
    if (!job.processed_asset_url) return;
    const link = document.createElement('a');
    link.href = job.processed_asset_url;
    link.download = `snapcut_${job.original_filename.replace(/\.[^/.]+$/, '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRetry = async () => {
    setRetrying(true);
    await retryJob(job.id);
    setRetrying(false);
  };

  // Calculate remaining retention time
  const expiresDate = new Date(job.expires_at);
  const now = new Date();
  const diffHours = Math.max(0, Math.round((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60)));

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Link
              to="/app/dashboard"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{job.original_filename}</h1>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                    job.status === 'completed'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                      : job.status === 'failed'
                      ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                      : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                  }`}
                >
                  {job.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>PNG Output</span>
                <span>•</span>
                <span>{job.input_width} × {job.input_height} px</span>
                {job.processing_duration_ms && (
                  <>
                    <span>•</span>
                    <span className="text-cyan-400 font-mono">
                      Processed in {job.processing_duration_ms} ms
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {job.status === 'completed' && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-sky-500/20 hover:opacity-95"
              >
                <Download className="w-4 h-4" />
                Download Transparent PNG
              </button>
            )}

            <Link
              to="/app/remove-background"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
            >
              <Scissors className="w-4 h-4" />
              Process Another Image
            </Link>
          </div>
        </div>

        {/* Failed Job Banner */}
        {job.status === 'failed' && (
          <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-4">
            <div className="flex items-center gap-3 text-red-400 font-semibold text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>AI Background Removal Failed: {job.failure_message || 'Inference error'}</span>
            </div>
            <p className="text-xs text-slate-400">
              Your reserved credit has been safely restored to your account ledger. You can retry with adjusted parameters or select another image.
            </p>
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
              {retrying ? 'Retrying Job...' : 'Retry Processing'}
            </button>
          </div>
        )}

        {/* Completed Job Workspace */}
        {job.status === 'completed' && job.processed_asset_url && (
          <div className="space-y-4">
            {/* View Mode Controls */}
            <div className="flex items-center justify-between">
              <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium">
                <button
                  onClick={() => setViewMode('slider')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === 'slider'
                      ? 'bg-slate-800 text-cyan-400 font-semibold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Comparison Slider
                </button>
                <button
                  onClick={() => setViewMode('cutout')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === 'cutout'
                      ? 'bg-slate-800 text-cyan-400 font-semibold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Transparent Cutout
                </button>
                <button
                  onClick={() => setViewMode('side_by_side')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    viewMode === 'side_by_side'
                      ? 'bg-slate-800 text-cyan-400 font-semibold shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Side-by-Side
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Temporary asset expires in {diffHours}h</span>
              </div>
            </div>

            {/* Display Canvas based on view mode */}
            {viewMode === 'slider' && (
              <BeforeAfterSlider
                originalUrl={job.original_asset_url}
                processedUrl={job.processed_asset_url}
                originalAlt={job.original_filename}
                processedAlt={`Cutout of ${job.original_filename}`}
                heightClass="h-[460px] md:h-[560px]"
              />
            )}

            {viewMode === 'cutout' && (
              <div className="w-full h-[460px] md:h-[560px] rounded-2xl border border-slate-800 bg-checkerboard flex items-center justify-center p-6 relative overflow-hidden shadow-2xl">
                <img
                  src={job.processed_asset_url}
                  alt="Transparent cutout"
                  className="max-h-full max-w-full object-contain drop-shadow-xl"
                />
                <span className="absolute bottom-4 right-4 px-3 py-1 rounded-md bg-slate-900/80 border border-slate-800 text-xs text-cyan-400">
                  Transparent RGBA Output
                </span>
              </div>
            )}

            {viewMode === 'side_by_side' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[400px] rounded-2xl border border-slate-800 bg-slate-950 p-4 flex flex-col items-center justify-center relative">
                  <span className="absolute top-3 left-3 text-xs font-mono text-slate-400">
                    Original Input
                  </span>
                  <img
                    src={job.original_asset_url}
                    alt="Original"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="h-[400px] rounded-2xl border border-slate-800 bg-checkerboard p-4 flex flex-col items-center justify-center relative">
                  <span className="absolute top-3 left-3 text-xs font-mono text-cyan-400">
                    Isolated Foreground
                  </span>
                  <img
                    src={job.processed_asset_url}
                    alt="Processed"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Job Metadata Footer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px] font-mono uppercase">Provider</span>
                <span className="text-slate-200 font-mono">{job.provider}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px] font-mono uppercase">Inference Time</span>
                <span className="text-cyan-400 font-mono font-semibold">
                  {job.processing_duration_ms ? `${job.processing_duration_ms} ms` : '—'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px] font-mono uppercase">Cloudinary Asset</span>
                <span className="text-slate-200 font-mono truncate block">{job.processed_asset_id}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px] font-mono uppercase">Auto Deletion</span>
                <span className="text-amber-400 font-mono">{diffHours} hours remaining</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
