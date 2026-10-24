import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { BLOG_POSTS } from './BlogPage';
import { ArrowLeft, Clock, Calendar, User, Tag } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Journal
          </Link>

          <header className="space-y-4 mb-10 pb-8 border-b border-slate-800">
            <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 text-xs font-semibold">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {post.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {post.readTime}
              </span>
            </div>
          </header>

          <article className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-xl font-bold text-white pt-4">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              return <p key={idx}>{paragraph.trim()}</p>;
            })}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};
