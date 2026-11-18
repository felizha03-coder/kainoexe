import React from 'react';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

export const Footer: React.FC = () => {
  const { navigate, profile, lang } = usePlatform();

  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#08090D] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2 space-y-3">
          <button
            onClick={() => navigate('home')}
            className="font-display text-2xl font-bold text-slate-950 dark:text-white cursor-pointer"
          >
            NIEL<span className="text-[#791EFF] dark:text-[#C8FF24]">.</span>
          </button>
          <p className="text-sm text-slate-600 dark:text-[#A5A7B2] max-w-md leading-relaxed">
            {profile.bio}
          </p>
          <p className="font-mono text-xs text-[#791EFF] dark:text-[#C8FF24] font-semibold">
            {profile.tagline}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
            {lang === 'id' ? 'Jelajahi' : 'Explore'}
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-[#A5A7B2]">
            <li>
              <button
                onClick={() => navigate('projects')}
                className="hover:text-[#791EFF] dark:hover:text-[#C8FF24] cursor-pointer"
              >
                Projects
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('ai')}
                className="hover:text-[#791EFF] dark:hover:text-[#C8FF24] cursor-pointer"
              >
                Niel AI Assistant
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('learning')}
                className="hover:text-[#791EFF] dark:hover:text-[#C8FF24] cursor-pointer"
              >
                IT Learning Hub
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('playground')}
                className="hover:text-[#791EFF] dark:hover:text-[#C8FF24] cursor-pointer"
              >
                Code Playground
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('blog')}
                className="hover:text-[#791EFF] dark:hover:text-[#C8FF24] cursor-pointer"
              >
                Blog
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
            {lang === 'id' ? 'Terhubung' : 'Connect'}
          </h3>
          <div className="flex items-center gap-3">
            <a
              href={`mailto:${profile.contact.email}`}
              aria-label="Email Niel"
              className="w-9 h-9 rounded-lg bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white hover:border-[#791EFF] dark:hover:border-[#C8FF24] transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="w-9 h-9 rounded-lg bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white hover:border-[#791EFF] dark:hover:border-[#C8FF24] transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-lg bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white hover:border-[#791EFF] dark:hover:border-[#C8FF24] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={profile.contact.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-lg bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white hover:border-[#791EFF] dark:hover:border-[#C8FF24] transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#A5A7B2] pt-2">
            © {new Date().getFullYear()} NIEL. Informatics Engineering Portfolio.
          </p>
        </div>
      </div>
    </footer>
  );
};
