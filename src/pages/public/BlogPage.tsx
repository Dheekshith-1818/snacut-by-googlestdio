import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

export const BLOG_POSTS = [
  {
    slug: 'optimizing-ecommerce-conversions-with-clean-white-backgrounds',
    title: 'How Pure White and Transparent Product Backdrops Boost E-Commerce Conversions by 34%',
    excerpt: 'Explore research data on buyer trust, visual clutter reduction, and marketplace compliance across Amazon, Shopify, and Flipkart.',
    date: 'October 18, 2026',
    readTime: '4 min read',
    category: 'E-Commerce',
    author: 'Sarah Chen, Head of Growth',
    content: `
Online shoppers cannot touch or feel physical products before purchasing. Consequently, image clarity serves as the primary proxy for product quality. Studies consistently demonstrate that removing messy room backgrounds in favor of transparent or crisp white backgrounds leads to a 34% increase in conversion rates.

### Key Marketplace Compliance Rules
Marketplaces like Amazon, Google Shopping, and Flipkart have strict guidelines mandating main product images to possess a pure white (RGB 255, 255, 255) background without watermarks or secondary clutter. 

### Why AI Segmentation Beats Manual Pen Tools
Traditional clipping paths require 10 to 15 minutes of manual labor per photo. With automated neural edge detection, batch catalogs of 500 images can be processed in under 5 minutes with higher consistency around organic borders like fur, leather textures, and hair.
    `,
  },
  {
    slug: 'sub-pixel-edge-matting-technical-breakdown',
    title: 'Inside Sub-Pixel Edge Matting: How AI Distinguishes Hair From Background Noise',
    excerpt: 'A deep-dive into semantic alpha matting, color distance heuristics, and feathering algorithms for complex photo cutouts.',
    date: 'October 12, 2026',
    readTime: '6 min read',
    category: 'Engineering',
    author: 'Devon Patel, Senior Vision Architect',
    content: `
Alpha matting is mathematically fundamentally an under-constrained inverse problem: for every pixel, we must solve for both foreground color, background color, and the alpha opacity value simultaneously.

### The Trimap Strategy
State-of-the-art background segmentation models generate an implicit trimap dividing the image into three regions: definite foreground, definite background, and an unknown transition zone.

### Preserving Semitransparent Objects
Objects like wine glasses, smoke, and fine curly hair require fractional alpha values (0 < alpha < 255). SnapCut AI applies localized edge gradient analysis to calculate natural transparency curves rather than harsh binary cutoffs.
    `,
  },
  {
    slug: 'automating-catalog-workflows-with-snapcut-api',
    title: 'Automating Mass Catalog Processing With n8n and the SnapCut REST API',
    excerpt: 'Step-by-step blueprint to connect incoming supplier Google Drive or S3 folders directly to automated background removal pipelines.',
    date: 'October 5, 2026',
    readTime: '5 min read',
    category: 'Automation',
    author: 'Alex Vance, Platform Engineer',
    content: `
High-volume retail operations frequently ingest thousands of raw supplier photos every week. Manually uploading each photo through a graphical interface creates an untenable bottleneck.

### Setting Up the Automation Loop
By deploying the official SnapCut n8n workflow, you can listen for new images in Cloudinary or AWS S3, authenticate with a SnapCut Bearer key, and write back transparent PNG assets directly into your digital asset manager (DAM).
    `,
  },
];

export const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase font-mono tracking-widest text-cyan-400">
              SnapCut Journal
            </span>
            <h1 className="mt-2 text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
              Insights & Tutorials
            </h1>
            <p className="mt-4 text-base text-slate-400">
              Articles on e-commerce photography, computer vision engineering, and automated asset workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-medium">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-white mb-2 leading-snug">
                    <Link to={`/blog/${post.slug}`} className="hover:text-cyan-400 transition-colors">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">{post.date}</span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    Read Story
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
