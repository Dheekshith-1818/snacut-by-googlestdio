import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  Image as ImageIcon,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileCheck,
  ShoppingBag,
  Share2,
  Palette,
  Code2,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { BeforeAfterSlider } from '../../components/ui/BeforeAfterSlider';
import { useSnapCut, CREDIT_PACKS } from '../../lib/store';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, createJob } = useSnapCut();
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const handleFileDrop = async (file: File) => {
    if (!user) {
      navigate('/login?redirect=/app/remove-background');
      return;
    }
    const res = await createJob(file);
    if ('jobId' in res) {
      navigate(`/app/result/${res.jobId}`);
    } else {
      setUploadError(res.error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileDrop(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileDrop(e.target.files[0]);
    }
  };

  const faqs = [
    {
      q: 'How does SnapCut AI achieve pixel-perfect cutout edges?',
      a: 'We combine state-of-the-art vision models and high-frequency edge feathering that automatically distinguish complex foreground objects (hair, jewelry, fur, transparent glass) from diverse backgrounds.',
    },
    {
      q: 'What is the temporary file retention policy?',
      a: 'We adhere to strict zero-retention principles. All uploaded original images and processed transparent PNGs are stored in temporary Cloudinary private storage and automatically purged within 24 hours.',
    },
    {
      q: 'Can I use SnapCut AI outputs commercially?',
      a: 'Yes! All images processed under Free, Pro, and Credit Pack accounts carry full commercial rights for e-commerce, marketing campaigns, print, and digital media.',
    },
    {
      q: 'What file formats and image resolutions are supported?',
      a: 'We support JPG, JPEG, PNG, and WEBP formats up to 10 MB in file size and up to 5000 × 5000 pixels in dimension.',
    },
    {
      q: 'Is there an API for developers and business workflows?',
      a: 'Yes, Pro and business users receive dedicated REST API keys (`POST /api/v1/remove-background`) with webhook support, idempotency keys, and SDK documentation.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-cyan-400 font-medium shadow-inner">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Background Removal Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Remove Image Backgrounds{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 bg-clip-text text-transparent">
                in Seconds
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Upload any image and get an ultra-crisp transparent PNG cutout instantly. Built for e-commerce stores, creators, designers, and high-volume automated business workflows.
            </p>
          </div>

          {/* Interactive Drag & Drop Upload Zone */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-200 bg-slate-900/50 backdrop-blur-md ${
                dragActive
                  ? 'border-cyan-400 bg-cyan-950/20 scale-[1.01]'
                  : 'border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <input
                type="file"
                id="hero-file-upload"
                className="hidden"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <label
                    htmlFor="hero-file-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:opacity-95 transition-all"
                  >
                    Select an Image
                    <ArrowRight className="w-4 h-4" />
                  </label>
                  <p className="mt-2 text-xs text-slate-400">
                    or drag and drop your photo anywhere here
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium pt-2">
                  <span>JPG, PNG, WEBP</span>
                  <span>•</span>
                  <span>Up to 10 MB</span>
                  <span>•</span>
                  <span>Max 5000 × 5000 px</span>
                </div>
              </div>
            </div>

            {uploadError && (
              <div className="mt-3 p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-xs text-red-300 text-center">
                {uploadError}
              </div>
            )}
          </div>

          {/* Interactive Live Comparison Slider */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="text-center mb-4">
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
                Live Interactive Comparison
              </span>
              <p className="text-sm text-slate-300">
                Drag the slider below to inspect edge hair fidelity and transparency
              </p>
            </div>
            <BeforeAfterSlider
              originalUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80"
              processedUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80"
              originalAlt="Portrait with original studio background"
              processedAlt="Portrait with transparent background removed"
            />
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-20 bg-slate-900/30 border-y border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Three Simple Steps to Flawless Transparency
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              No manual clipping paths, no lasso tools, and no steep learning curve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center font-bold text-cyan-400 text-lg">
                1
              </div>
              <h3 className="text-lg font-semibold text-white">Upload Your File</h3>
              <p className="text-sm text-slate-400">
                Drag and drop your product shoot, portrait, graphic, or signature in any common image format.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center font-bold text-purple-400 text-lg">
                2
              </div>
              <h3 className="text-lg font-semibold text-white">Instant AI Segmentation</h3>
              <p className="text-sm text-slate-400">
                Our neural segmentation model separates foreground subjects with sub-pixel edge matting and hair detail.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center font-bold text-emerald-400 text-lg">
                3
              </div>
              <h3 className="text-lg font-semibold text-white">Preview & Download</h3>
              <p className="text-sm text-slate-400">
                Inspect your clean cutout over an authentic checkerboard canvas and download high-res PNG instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Use Cases */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Designed for Real-World Workflows
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Trusted by creators, high-converting e-commerce sellers, and enterprise engineering teams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center text-sky-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white">E-Commerce Sellers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standardize product catalogs on pure white or transparent backings for Amazon, Shopify, and Flipkart.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white">Social Media Creators</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Produce YouTube thumbnails, Instagram reels stickers, and promotional posters in seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-950 border border-pink-800 flex items-center justify-center text-pink-400">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white">Design Agencies</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accelerate client asset prep without tedious pen tool tracing, preserving natural subject shadows.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-white">Developers & APIs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Embed programmatic background removal into your apps with low-latency REST endpoints and webhooks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-slate-900/40 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              Simple & Transparent Pricing
            </span>
            <h2 className="mt-2 text-3xl font-bold text-white tracking-tight">
              Pay As You Grow
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              Start with 5 free daily images or unlock high-speed processing with affordable monthly plans and credit packs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Free Starter</h3>
                <div className="mt-4 flex items-baseline text-3xl font-extrabold text-white">
                  ₹0
                  <span className="ml-1 text-sm font-medium text-slate-400">/ forever</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">Perfect for casual one-off cutouts.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    5 free removals per day
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Standard resolution output
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    24h temporary file storage
                  </li>
                </ul>
              </div>

              <Link
                to="/register"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Monthly */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500 shadow-xl shadow-cyan-500/10 flex flex-col justify-between relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider">
                Most Popular
              </span>

              <div>
                <h3 className="text-lg font-bold text-white">Pro Monthly</h3>
                <div className="mt-4 flex items-baseline text-3xl font-extrabold text-white">
                  ₹499
                  <span className="ml-1 text-sm font-medium text-slate-400">/ month</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">Unlimited creative velocity for pros.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Up to 200 removals / day
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Full resolution up to 5000×5000 px
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Developer REST API access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Priority processing queue
                  </li>
                </ul>
              </div>

              <Link
                to="/pricing"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-bold text-sm shadow-md hover:opacity-95 transition-all"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Credit Packs */}
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Credit Packs</h3>
                <div className="mt-4 flex items-baseline text-3xl font-extrabold text-white">
                  From ₹99
                  <span className="ml-1 text-sm font-medium text-slate-400">/ pack</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">One-time purchase, credits never expire.</p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    25 images: ₹99
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    100 images: ₹299
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    500 images: ₹999
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    No recurring subscription
                  </li>
                </ul>
              </div>

              <Link
                to="/pricing"
                className="mt-8 block text-center py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
              >
                Browse Packs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Clear answers regarding privacy, file retention, and commercial licensing.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = faqOpen === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-slate-200 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-gradient-to-r from-cyan-950/40 via-sky-950/40 to-purple-950/40 border-t border-slate-800 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to Cut Out Tedious Editing?
          </h2>
          <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto">
            Join thousands of creators and businesses saving hours on background removal every week.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/app/remove-background"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 hover:opacity-95 transition-all"
            >
              Upload Photo Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
