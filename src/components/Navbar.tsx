import React, { useState } from 'react';
import {
  Menu,
  Moon,
  Sun,
  X,
  Terminal,
  Sparkles,
  BookOpen,
  Shield,
  Globe,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { PageRoute } from '../types/niel';

const PRIMARY_NAV: { id: PageRoute; labelEn: string; labelId: string }[] = [
  { id: 'home', labelEn: 'Home', labelId: 'Beranda' },
  { id: 'projects', labelEn: 'Projects', labelId: 'Proyek' },
  { id: 'about', labelEn: 'About', labelId: 'Tentang' },
  { id: 'ai', labelEn: 'AI Assistant', labelId: 'Asisten AI' },
  { id: 'learning', labelEn: 'Learning Hub', labelId: 'Belajar IT' },
  { id: 'blog', labelEn: 'Blog', labelId: 'Blog' },
  { id: 'contact', labelEn: 'Contact', labelId: 'Kontak' },
];

export const Navbar: React.FC = () => {
  const { route, navigate, theme, toggleTheme, lang, setLang } = usePlatform();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const go = (target: PageRoute) => {
    setDrawerOpen(false);
    navigate(target);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-[#08090D]/85 border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => go('home')}
            className="font-display text-2xl font-bold tracking-tight text-slate-950 dark:text-white whitespace-nowrap shrink-0 cursor-pointer hover:text-[#791EFF] dark:hover:text-[#C8FF24] transition-colors"
          >
            NIEL<span className="text-[#791EFF] dark:text-[#C8FF24]">.</span>
          </button>

          {/* Zone 2: Primary Text Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-6 text-sm font-medium"
          >
            {PRIMARY_NAV.map((item) => {
              const active =
                route === item.id ||
                (item.id === 'projects' && route === 'project-detail') ||
                (item.id === 'blog' && route === 'blog-detail');
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={`whitespace-nowrap shrink-0 py-1 cursor-pointer transition-colors relative ${
                    active
                      ? 'text-[#791EFF] dark:text-[#C8FF24] font-semibold'
                      : 'text-slate-600 dark:text-[#A5A7B2] hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {lang === 'id' ? item.labelId : item.labelEn}
                  {active && (
                    <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#791EFF] dark:bg-[#C8FF24]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Theme Toggle + Language + Purple Circular Menu Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
              aria-label="Switch interface language"
              title="Toggle ID / EN"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-slate-700 dark:text-[#A5A7B2] hover:bg-slate-100 dark:hover:bg-[#1B1D27] border border-slate-200 dark:border-white/10 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-[#791EFF] dark:text-[#35CFFF]" />
              {lang.toUpperCase()}
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Toggle dark and light theme"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-[#1B1D27] text-slate-800 dark:text-[#C8FF24] border border-slate-200 dark:border-white/10 hover:scale-105 transition-transform cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open platform menu"
              className="w-10 h-10 rounded-full bg-[#791EFF] hover:bg-[#8D42FF] text-white flex items-center justify-center niel-doodle-glow hover:scale-105 transition-transform cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Full Creative Navigation & Tools Drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end"
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            className="w-full max-w-sm bg-white dark:bg-[#151720] border-l border-slate-200 dark:border-white/10 h-full p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-bold text-slate-950 dark:text-white">
                  NIEL<span className="text-[#791EFF] dark:text-[#C8FF24]">.</span>
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1B1D27] flex items-center justify-center text-slate-800 dark:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-mono text-slate-500 dark:text-[#A5A7B2] mb-2">
                  {lang === 'id' ? 'Navigasi Utama' : 'Main Pages'}
                </p>
                {PRIMARY_NAV.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => go(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-base font-display font-semibold cursor-pointer transition-colors ${
                      route === item.id
                        ? 'bg-[#791EFF] text-white'
                        : 'text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-[#1B1D27]'
                    }`}
                  >
                    {lang === 'id' ? item.labelId : item.labelEn}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2">
                <p className="text-xs font-mono text-slate-500 dark:text-[#A5A7B2] mb-2">
                  {lang === 'id' ? 'Alat & Ruang Kerja' : 'Interactive Tools'}
                </p>
                <button
                  onClick={() => go('playground')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-white bg-slate-100 dark:bg-[#1B1D27] hover:border-[#35CFFF] border border-transparent cursor-pointer"
                >
                  <Terminal className="w-4 h-4 text-[#35CFFF]" />
                  <span>Code Playground (HTML / CSS / JS)</span>
                </button>
                <button
                  onClick={() => go('ai')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-white bg-slate-100 dark:bg-[#1B1D27] hover:border-[#C8FF24] border border-transparent cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#791EFF] dark:text-[#C8FF24]" />
                  <span>Niel AI Tutor &amp; Coding Workspace</span>
                </button>
                <button
                  onClick={() => go('learning')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-white bg-slate-100 dark:bg-[#1B1D27] hover:border-[#791EFF] border border-transparent cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#791EFF]" />
                  <span>IT Roadmaps, Quiz &amp; Snippets</span>
                </button>
                <button
                  onClick={() => go('admin')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-white bg-slate-100 dark:bg-[#1B1D27] hover:border-[#791EFF] border border-transparent cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-[#791EFF]" />
                  <span>Admin Dashboard</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <button
                onClick={() => setLang(lang === 'en' ? 'id' : 'en')}
                className="px-3 py-2 rounded-lg text-xs font-mono font-semibold bg-slate-100 dark:bg-[#1B1D27] text-slate-800 dark:text-white cursor-pointer"
              >
                Language: {lang === 'en' ? 'English (EN)' : 'Indonesia (ID)'}
              </button>
              <button
                onClick={toggleTheme}
                className="px-3 py-2 rounded-lg text-xs font-mono font-semibold bg-slate-100 dark:bg-[#1B1D27] text-slate-800 dark:text-[#C8FF24] cursor-pointer"
              >
                {theme === 'dark' ? 'Dark' : 'Light'}
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
