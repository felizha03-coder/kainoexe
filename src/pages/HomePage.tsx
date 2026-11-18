import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  Code2,
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { MASCOT_HERO_IMAGE } from '../data/seedData';

export const HomePage: React.FC = () => {
  const { navigate, projects, profile, lang } = usePlatform();
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 5);

  const scrollToProjects = () => {
    document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 niel-grid-bg">
        {/* Subtle organic purple aura */}
        <div
          aria-hidden="true"
          className="absolute -top-24 right-0 w-[420px] h-[420px] rounded-full bg-[#791EFF]/20 blur-[110px] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-6 space-y-6"
          >
            <p className="font-marker text-lg sm:text-xl text-[#791EFF] dark:text-[#C8FF24] tracking-wide">
              HEY THERE!
            </p>

            <div className="space-y-3">
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-950 dark:text-white leading-[1.03]">
                I&apos;m NIEL<span className="text-[#791EFF] dark:text-[#C8FF24]">.</span>
              </h1>
              <p className="font-mono text-sm sm:text-base font-semibold tracking-wider text-[#0EA5E9] dark:text-[#35CFFF]">
                {profile.subtitle}
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-600 dark:text-[#A5A7B2] max-w-xl leading-relaxed">
              {lang === 'id'
                ? 'Menjelajahi dunia teknologi, membangun pengalaman digital kreatif, dan mengubah ide menjadi kode.'
                : 'Exploring the world of technology, building creative digital experiences, and turning ideas into code.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('projects')}
                className="px-6 py-3.5 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] text-white font-display font-semibold text-sm sm:text-base inline-flex items-center gap-2 niel-doodle-glow transition-transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <span>{lang === 'id' ? 'Lihat Proyek Saya' : 'Explore My Projects'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('ai')}
                className="px-6 py-3.5 rounded-xl bg-[#C8FF24] hover:bg-[#D5FF57] text-[#08090D] font-display font-bold text-sm sm:text-base inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>{lang === 'id' ? 'Tanya Niel AI' : 'Ask Niel AI'}</span>
              </button>
            </div>

            <p className="font-mono text-xs text-slate-500 dark:text-[#A5A7B2] pt-2">
              {profile.tagline}
            </p>
          </motion.div>

          {/* Right Content: Mascot + Hand-Drawn SVG Doodles + Speech Bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-6 relative flex flex-col items-center"
          >
            {/* Hand-drawn speech bubble */}
            <div className="mb-4 self-start sm:self-center sm:-translate-x-10 bg-white dark:bg-[#1B1D27] border-2 border-[#791EFF] dark:border-[#C8FF24] rounded-2xl px-4 py-2.5 shadow-lg relative z-20">
              <p className="font-marker text-sm sm:text-base text-slate-900 dark:text-[#C8FF24]">
                &ldquo;LET&apos;S BUILD SOMETHING AWESOME!&rdquo;
              </p>
            </div>

            <div className="relative w-full max-w-[440px] aspect-square">
              {/* Organic Purple Accent Backing */}
              <div
                aria-hidden="true"
                className="absolute inset-4 rounded-[2.5rem] bg-[#791EFF] rotate-3 opacity-85"
              />
              <div
                aria-hidden="true"
                className="absolute inset-4 rounded-[2.5rem] border-2 border-[#C8FF24] -rotate-2"
              />

              {/* Mascot Portrait */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 w-full h-full rounded-[2.25rem] overflow-hidden border-2 border-slate-900/20 dark:border-white/15 bg-[#08090D]"
              >
                <img
                  src={MASCOT_HERO_IMAGE}
                  alt="Niel Informatics Engineering Mascot"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Surrounding Code & Tech Doodles */}
              <div
                aria-hidden="true"
                className="hidden sm:flex absolute -top-4 -right-4 z-20 w-12 h-12 rounded-2xl bg-[#151720] border border-[#35CFFF]/50 text-[#35CFFF] items-center justify-center shadow-lg"
              >
                <Code2 className="w-6 h-6" />
              </div>
              <div
                aria-hidden="true"
                className="hidden sm:flex absolute bottom-6 -left-5 z-20 w-12 h-12 rounded-2xl bg-[#151720] border border-[#C8FF24]/60 text-[#C8FF24] items-center justify-center shadow-lg"
              >
                <Zap className="w-6 h-6" />
              </div>
              <div
                aria-hidden="true"
                className="hidden sm:flex absolute top-1/2 -right-6 z-20 w-11 h-11 rounded-full bg-[#791EFF] text-white items-center justify-center shadow-lg"
              >
                <Terminal className="w-5 h-5" />
              </div>

              {/* Hand-drawn SVG arrow pointing toward mascot */}
              <svg
                aria-hidden="true"
                viewBox="0 0 120 60"
                className="hidden md:block absolute -bottom-10 left-8 w-24 h-12 text-[#C8FF24] z-20"
                fill="none"
              >
                <path
                  d="M10 48 C 35 45, 65 30, 96 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                />
                <path
                  d="M84 8 L98 9 L93 22"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="max-w-7xl mx-auto mt-12 flex justify-center">
          <button
            onClick={scrollToProjects}
            aria-label="Scroll to featured projects"
            className="inline-flex flex-col items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-[#A5A7B2] hover:text-[#791EFF] dark:hover:text-[#C8FF24] cursor-pointer"
          >
            <span>Scroll to explore</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section
        id="featured-projects"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#151720] border-y border-slate-200 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
                THINGS I&apos;VE BUILT.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-[#A5A7B2] max-w-xl">
                Interactive software experiments, student systems, and developer tools
                managed directly from the platform workspace.
              </p>
            </div>

            <button
              onClick={() => navigate('projects')}
              className="text-sm font-display font-semibold text-[#791EFF] dark:text-[#C8FF24] hover:underline inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>View All Projects</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, idx) => (
              <article
                key={project.id}
                className={`rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-1 ${
                  idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div>
                  <div className="aspect-[16/10] bg-[#08090D] overflow-hidden">
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <p className="text-xs font-mono text-slate-500 dark:text-[#35CFFF]">
                      {project.category} · {project.technologies.slice(0, 4).join(' · ')}
                    </p>
                    <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-[#A5A7B2] leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-4 border-t border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => navigate('project-detail', project.slug)}
                    className="text-sm font-display font-semibold text-[#791EFF] dark:text-[#C8FF24] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Project</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-slate-600 dark:text-[#A5A7B2] hover:text-slate-950 dark:hover:text-white inline-flex items-center gap-1.5"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED AI SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="font-marker text-base text-[#791EFF] dark:text-[#35CFFF]">
              BILINGUAL IT ASSISTANT
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
              MEET YOUR NEW IT COMPANION.
            </h2>
            <p className="text-base text-slate-600 dark:text-[#A5A7B2] leading-relaxed">
              Need help understanding programming, solving coding problems, or exploring
              technology? Niel AI is here to help — in both English and Bahasa Indonesia.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('ai')}
                className="px-6 py-3 rounded-xl bg-[#C8FF24] hover:bg-[#D5FF57] text-[#08090D] font-display font-bold text-sm inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Bot className="w-4 h-4" />
                <span>Try Niel AI</span>
              </button>
              <button
                onClick={() => navigate('playground')}
                className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-[#1B1D27] hover:bg-slate-200 dark:hover:bg-[#242736] text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 font-display font-semibold text-sm cursor-pointer whitespace-nowrap"
              >
                Explore Code Playground
              </button>
            </div>
          </div>

          {/* Interactive AI Preview Mockup Window */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-[#151720] border border-white/10 p-5 sm:p-6 space-y-4 text-white shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-display font-semibold text-sm text-[#C8FF24]">
                  NIEL AI · Tutor &amp; Coding Assistant
                </span>
                <span className="font-mono text-xs text-[#35CFFF]">ID / EN</span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="bg-[#1B1D27] rounded-xl p-3.5 max-w-[85%] ml-auto text-white border border-white/10">
                  Jelasin konsep Binary Search dong, plus contoh JavaScript-nya!
                </div>
                <div className="bg-[#791EFF]/20 border border-[#791EFF]/40 rounded-xl p-4 space-y-2">
                  <p className="font-semibold text-[#C8FF24] text-xs font-mono">
                    1. Simple Explanation
                  </p>
                  <p className="text-slate-200 leading-relaxed">
                    Binary Search membagi data terurut menjadi dua bagian setiap langkah,
                    sehingga pencarian jauh lebih cepat (O(log n)) dibanding mengecek satu
                    per satu.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#A5A7B2]">
                <span>Real-time streaming &amp; live HTML/CSS/JS sandbox</span>
                <button
                  onClick={() => navigate('ai')}
                  className="text-[#C8FF24] hover:underline cursor-pointer"
                >
                  Launch Workspace →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS PREVIEW */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#151720] border-y border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
                Technologies I Explore
              </h2>
              <p className="text-sm text-slate-600 dark:text-[#A5A7B2]">
                Starter skill list — editable and confirmable directly from the Admin
                Dashboard.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {profile.skills.map((skill) => (
              <div
                key={skill.name}
                className="rounded-xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-4 flex flex-col justify-between gap-1 hover:border-[#791EFF] dark:hover:border-[#C8FF24] transition-colors"
              >
                <span className="font-display font-semibold text-base text-slate-900 dark:text-white">
                  {skill.name}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-[#A5A7B2]">
                  {skill.category}
                  {skill.confirmed ? ' · Confirmed' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-[#08090D] aspect-square max-w-sm mx-auto">
              <img
                src={MASCOT_HERO_IMAGE}
                alt="Portrait illustration of Niel"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="md:col-span-7 space-y-5">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white">
              Curious Mind Behind the Screen.
            </h2>
            <p className="text-base text-slate-600 dark:text-[#A5A7B2] leading-relaxed whitespace-pre-line">
              {profile.aboutIntro}
            </p>
            <button
              onClick={() => navigate('about')}
              className="px-5 py-3 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] text-white font-display font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <span>More About Me</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CONTACT PREVIEW */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#151720] text-white border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="font-marker text-base text-[#C8FF24]">OPEN FOR COLLABORATION</p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
            LET&apos;S CREATE SOMETHING COOL!
          </h2>
          <p className="text-base text-[#A5A7B2] max-w-xl mx-auto">
            Have a software idea, study project, or creative concept? Reach out anytime.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('contact')}
              className="px-6 py-3.5 rounded-xl bg-[#C8FF24] hover:bg-[#D5FF57] text-[#08090D] font-display font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Send a Message</span>
            </button>
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-[#1B1D27] border border-white/10 hover:border-[#35CFFF] text-white"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-[#1B1D27] border border-white/10 hover:border-[#35CFFF] text-white"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={profile.contact.instagram}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-[#1B1D27] border border-white/10 hover:border-[#35CFFF] text-white"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};
