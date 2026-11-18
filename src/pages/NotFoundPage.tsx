import React from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';

export const NotFoundPage: React.FC = () => {
  const { navigate } = usePlatform();

  return (
    <main className="py-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#791EFF]/15 text-[#791EFF] dark:text-[#C8FF24] flex items-center justify-center mx-auto">
        <Compass className="w-8 h-8" />
      </div>
      <p className="font-mono text-sm text-[#791EFF] dark:text-[#35CFFF] font-semibold">
        404 · Route Not Found
      </p>
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-950 dark:text-white">
        Lost in the codebase?
      </h1>
      <p className="text-base text-slate-600 dark:text-[#A5A7B2]">
        The page you requested does not exist in Niel&apos;s workspace. Head back home or launch Niel AI.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button
          onClick={() => navigate('home')}
          className="px-6 py-3 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] text-white font-display font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </button>
        <button
          onClick={() => navigate('ai')}
          className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-display font-semibold text-sm cursor-pointer"
        >
          Open Niel AI
        </button>
      </div>
    </main>
  );
};
