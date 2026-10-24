import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Scissors,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Image,
  CloudLightning,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: Scissors,
      title: 'Sub-Pixel Edge Matting',
      desc: 'Advanced semantic segmentation effortlessly handles intricate hair strands, wisps, transparent glass, and complex borders.',
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      desc: 'Optimized inference pipelines return full-fidelity transparent PNGs within hundreds of milliseconds.',
    },
    {
      icon: Layers,
      title: 'True Alpha Channel PNG Output',
      desc: 'Pure RGBA transparency ready for instant compositing across websites, Figma, Photoshop, and video editors.',
    },
    {
      icon: CloudLightning,
      title: 'High Resolution (Up to 5000px)',
      desc: 'Retain maximum camera sensor sharpness for print and 4K digital catalogs without downsampling.',
    },
    {
      icon: Lock,
      title: '24-Hour Ephemeral Privacy',
      desc: 'Your files exist only in short-lived encrypted temporary storage and are permanently purged after 24 hours.',
    },
    {
      icon: Cpu,
      title: 'Developer REST API & SDKs',
      desc: 'Automate mass catalog uploads with versioned endpoints, idempotency guarantees, and signed delivery URLs.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              Technology & Capabilities
            </span>
            <h1 className="mt-2 text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
              Engineered for Production Accuracy
            </h1>
            <p className="mt-4 text-base text-slate-400">
              SnapCut AI replaces clunky desktop editors with automated cloud neural networks designed for speed, edge precision, and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-950/40 to-purple-950/40 border border-slate-800 text-center max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Test It With Your Own Photo
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8">
              Experience the edge accuracy firsthand. 5 free daily images with no credit card required.
            </p>
            <Link
              to="/app/remove-background"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 hover:opacity-95"
            >
              Start Free Cutout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
