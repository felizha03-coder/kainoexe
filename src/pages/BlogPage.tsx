import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { BlogCategory } from '../types/niel';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

const BLOG_CATEGORIES: ('All' | BlogCategory)[] = [
  'All',
  'Programming',
  'Technology',
  'AI',
  'Web Development',
  'Student Life',
  'Tutorials',
];

export const BlogPage: React.FC = () => {
  const { blogPosts, navigate } = usePlatform();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | BlogCategory>('All');

  const publishedPosts = blogPosts.filter((p) => p.published);
  const featured = publishedPosts.find((p) => p.featured) || publishedPosts[0];

  const filtered = publishedPosts.filter((p) => {
    const matchCat = category === 'All' || p.category === category;
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 min-h-[80vh]">
      <header className="space-y-3">
        <p className="font-marker text-base text-[#791EFF] dark:text-[#C8FF24]">
          NIEL WRITING
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
          THOUGHTS, TECH &amp; DISCOVERIES.
        </h1>
        <p className="text-base text-slate-600 dark:text-[#A5A7B2] max-w-2xl">
          Notes on programming fundamentals, software architecture, AI workflows, and life
          as an Informatics Engineering student.
        </p>
      </header>

      {/* Featured Spotlight */}
      {featured && (
        <section className="rounded-2xl bg-[#151720] text-white border border-white/10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <p className="font-mono text-xs text-[#C8FF24]">
              Featured Article · {featured.category} · {featured.publishedAt} ·{' '}
              {featured.readingTimeMin} min read
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              {featured.title}
            </h2>
            <p className="text-sm sm:text-base text-[#A5A7B2] leading-relaxed">
              {featured.excerpt}
            </p>
          </div>
          <button
            onClick={() => navigate('blog-detail', featured.slug)}
            className="px-6 py-3 rounded-xl bg-[#C8FF24] hover:bg-[#D5FF57] text-[#08090D] font-display font-bold text-sm shrink-0 cursor-pointer"
          >
            Read Featured →
          </button>
        </section>
      )}

      {/* Search & Category Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative w-full lg:max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                category === cat
                  ? 'bg-[#791EFF] text-white'
                  : 'bg-slate-100 dark:bg-[#151720] text-slate-600 dark:text-[#A5A7B2]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <article
            key={post.id}
            onClick={() => navigate('blog-detail', post.slug)}
            className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 flex flex-col justify-between gap-4 hover:border-[#791EFF] dark:hover:border-[#C8FF24] transition-colors cursor-pointer"
          >
            <div className="space-y-3">
              <p className="font-mono text-xs text-slate-500 dark:text-[#35CFFF]">
                {post.category} · {post.publishedAt} · {post.readingTimeMin} min read
              </p>
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-[#A5A7B2] leading-relaxed">
                {post.excerpt}
              </p>
            </div>
            <span className="text-sm font-display font-semibold text-[#791EFF] dark:text-[#C8FF24]">
              Read Article →
            </span>
          </article>
        ))}
      </div>
    </main>
  );
};

export const BlogDetailPage: React.FC = () => {
  const { blogPosts, selectedSlug, navigate } = usePlatform();
  const post = blogPosts.find((p) => p.slug === selectedSlug) || blogPosts[0];

  if (!post) return null;

  const related = blogPosts
    .filter((p) => p.id !== post.id && p.published)
    .slice(0, 3);

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      <button
        onClick={() => navigate('blog')}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-[#A5A7B2] hover:text-[#791EFF] dark:hover:text-[#C8FF24] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Blog</span>
      </button>

      <header className="space-y-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <p className="font-mono text-xs text-[#791EFF] dark:text-[#35CFFF]">
          {post.category} · {post.publishedAt} · {post.readingTimeMin} min read
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-tight">
          {post.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#A5A7B2]">
          {post.excerpt}
        </p>
      </header>

      <article className="py-2">
        <MarkdownRenderer content={post.content} />
      </article>

      {related.length > 0 && (
        <section className="pt-8 border-t border-slate-200 dark:border-white/10 space-y-4">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <button
                key={r.id}
                onClick={() => navigate('blog-detail', r.slug)}
                className="text-left p-4 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 hover:border-[#791EFF] cursor-pointer space-y-1.5"
              >
                <p className="font-mono text-[11px] text-[#35CFFF]">{r.category}</p>
                <p className="font-display font-bold text-sm text-slate-950 dark:text-white">
                  {r.title}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
