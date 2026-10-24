import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileImage,
  X,
  ArrowRight,
  AlertCircle,
  Scissors,
  CheckCircle2,
  RefreshCw,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useSnapCut } from '../../lib/store';

export const RemoveBackgroundPage: React.FC = () => {
  const navigate = useNavigate();
  const { createJob, getEntitlements } = useSnapCut();
  const entitlements = getEntitlements();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepState, setStepState] = useState<'idle' | 'uploading' | 'ai_segmentation'>('idle');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setError(null);

    // Format check
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Unsupported file type. Please provide JPG, PNG, or WEBP.');
      return;
    }

    // Size check: <= 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File exceeds maximum 10 MB limit. Please compress or select a smaller image.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Read natural dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width > 5000 || img.height > 5000) {
        setError(`Image resolution ${img.width}×${img.height} exceeds the 5000×5000 px limit.`);
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      setDimensions({ width: img.width, height: img.height });
    };
    img.src = objectUrl;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleStartProcessing = async () => {
    if (!selectedFile) return;

    if (entitlements.total_available_credits <= 0) {
      setError('You have exhausted your daily quota and credit pack balance. Please upgrade or top up.');
      return;
    }

    setIsProcessing(true);
    setStepState('uploading');

    try {
      const res = await createJob(selectedFile);
      if ('error' in res) {
        setError(res.error);
        setIsProcessing(false);
        setStepState('idle');
        return;
      }

      setStepState('ai_segmentation');

      // Navigate to dedicated result inspection view
      setTimeout(() => {
        navigate(`/app/result/${res.jobId}`);
      }, 1200);
    } catch {
      setError('An unexpected error occurred during processing.');
      setIsProcessing(false);
      setStepState('idle');
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDimensions(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Background Removal Workspace
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Upload high-resolution photography for automated background cutout and transparent PNG generation.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Container */}
        {!selectedFile ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`rounded-3xl border-2 border-dashed p-10 sm:p-16 text-center transition-all duration-200 bg-slate-900/60 backdrop-blur-sm ${
              dragOver
                ? 'border-cyan-400 bg-cyan-950/20 scale-[1.01]'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              id="app-upload"
              className="hidden"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  validateAndSetFile(e.target.files[0]);
                }
              }}
            />
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="app-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:opacity-95"
                >
                  Choose an Image
                  <ArrowRight className="w-4 h-4" />
                </label>
                <p className="text-xs text-slate-400 pt-1">
                  or drag and drop your photo anywhere in this frame
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 font-mono pt-4 border-t border-slate-800/80 w-full max-w-md">
                <span>JPG • PNG • WEBP</span>
                <span>Max 10 MB</span>
                <span>Max 5000 × 5000 px</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
            {/* Selected File Details */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-44 h-44 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center relative shrink-0">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                )}
                {!isProcessing && (
                  <button
                    onClick={clearSelection}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base truncate max-w-sm">
                    {selectedFile.name}
                  </h3>
                  <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                    {selectedFile.type.replace('image/', '')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">
                      File Size
                    </span>
                    <span className="text-slate-200 font-mono font-medium">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">
                      Resolution
                    </span>
                    <span className="text-slate-200 font-mono font-medium">
                      {dimensions ? `${dimensions.width} × ${dimensions.height} px` : 'Calculating...'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px] uppercase font-mono">
                      Cost
                    </span>
                    <span className="text-cyan-400 font-mono font-medium">
                      1 Credit / Quota
                    </span>
                  </div>
                </div>

                {/* Progress Status */}
                {isProcessing && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-cyan-400 flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        {stepState === 'uploading'
                          ? 'Uploading image to temporary storage...'
                          : 'Executing AI edge matting and alpha extraction...'}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">In Progress</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{
                          width: stepState === 'uploading' ? '45%' : '90%',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!isProcessing && (
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleStartProcessing}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-semibold text-xs shadow-md shadow-sky-500/20 hover:opacity-95 transition-all flex items-center gap-2"
                    >
                      <Scissors className="w-4 h-4" />
                      Remove Background Now
                    </button>
                    <button
                      onClick={clearSelection}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors"
                    >
                      Replace File
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>
            Uploaded images are stored in temporary encrypted private storage and automatically purged after 24 hours. Zero model training.
          </span>
        </div>
      </div>
    </AppLayout>
  );
};
