import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Github, Search } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { ProjectCategory } from '../types/niel';

const CATEGORIES: ('All' | ProjectCategory)[] = [
  'All',
  'Web Development',
  'UI/UX Design',
  'Academic Projects',
  'Software Development',
  'Experiments',
];

export const ProjectsPage: React.FC = () => {
  const { projects, navigate } = usePlatform();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | ProjectCategory>('All');

  const filtered = projects.filter((p) => {
    const matchesCat = category === 'All' || p.category === category;
    const q = search.trim().toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.technologies.some((t) => t.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 min-h-[80vh]">
      <header className="space-y-3">
        <p className="font-marker text-base text-[#791EFF] dark:text-[#C8FF24]">
          PORTFOLIO ARCHIVE
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
          MY CREATIVE WORKSPACE.
        </h1>
        <p className="text-base text-slate-600 dark:text-[#A5A7B2] max-w-2xl">
          Browse Informatics Engineering projects, web interfaces, and technical builds.
          Select any card to read the complete engineering case study.
        </p>
      </header>

      {/* Search & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative w-full lg:max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects or technologies..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#791EFF] dark:focus:border-[#C8FF24]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                category === cat
                  ? 'bg-[#791EFF] text-white'
                  : 'bg-slate-100 dark:bg-[#151720] text-slate-700 dark:text-[#A5A7B2] hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 p-12 text-center space-y-2">
          <p className="font-display text-lg font-semibold text-slate-900 dark:text-white">
            No matching projects found
          </p>
          <p className="text-sm text-slate-600 dark:text-[#A5A7B2]">
            Try clearing your search filter or switching categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <article
              key={project.id}
              className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="aspect-[4/3] bg-[#08090D] overflow-hidden">
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-5 space-y-2.5">
                  <p className="text-xs font-mono text-slate-500 dark:text-[#35CFFF]">
                    {project.category} · {project.technologies.join(' · ')}
                  </p>
                  <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                    {project.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-[#A5A7B2] leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-3">
                <button
                  onClick={() => navigate('project-detail', project.slug)}
                  className="text-sm font-display font-semibold text-[#791EFF] dark:text-[#C8FF24] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Case Study</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-slate-600 dark:text-[#A5A7B2] hover:text-slate-950 dark:hover:text-white inline-flex items-center gap-1.5"
                >
                  <Github className="w-4 h-4" />
                  <span>Code</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export const ProjectDetailPage: React.FC = () => {
  const { projects, selectedSlug, navigate } = usePlatform();
  const project = projects.find((p) => p.slug === selectedSlug) || projects[0];

  if (!project) {
    return (
      <main className="py-20 px-4 text-center">
        <p className="text-slate-500">Project not found.</p>
      </main>
    );
  }

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <button
        onClick={() => navigate('projects')}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-[#A5A7B2] hover:text-[#791EFF] dark:hover:text-[#C8FF24] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </button>

      <header className="space-y-4">
        <p className="font-mono text-xs text-slate-500 dark:text-[#35CFFF]">
          {project.category} · {project.technologies.join(' · ')}
        </p>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-slate-950 dark:text-white">
          {project.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#A5A7B2] leading-relaxed">
          {project.overview}
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] text-white font-display font-semibold text-sm inline-flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
          </a>
          {project.liveUrl && (
            <button
              onClick={() => {
                if (project.liveUrl.startsWith('#')) {
                  const routeName = project.liveUrl.slice(1) as 'home' | 'ai' | 'learning' | 'playground' | 'projects';
                  navigate(routeName || 'home');
                } else {
                  window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-[#C8FF24] hover:bg-[#D5FF57] text-[#08090D] font-display font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Preview</span>
            </button>
          )}
        </div>
      </header>

      <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-[#08090D] aspect-video">
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="rounded-2xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Problem Statement
          </h2>
          <p className="text-sm text-slate-600 dark:text-[#A5A7B2] leading-relaxed">
            {project.problemStatement}
          </p>
        </section>

        <section className="rounded-2xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Project Objectives
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-[#A5A7B2] list-disc pl-5">
            {project.objectives.map((obj, idx) => (
              <li key={idx}>{obj}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Key Features
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-[#A5A7B2] list-disc pl-5">
            {project.features.map((feat, idx) => (
              <li key={idx}>{feat}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 p-6 space-y-3">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Technologies Used
          </h2>
          <p className="font-mono text-sm text-[#791EFF] dark:text-[#C8FF24]">
            {project.technologies.join(' · ')}
          </p>
        </section>
      </div>

      <section className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Development Process
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#A5A7B2] leading-relaxed">
            {project.developmentProcess}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Challenges &amp; Solutions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#A5A7B2] leading-relaxed">
            {project.challengesAndSolutions}
          </p>
        </div>
      </section>
    </main>
  );
};
