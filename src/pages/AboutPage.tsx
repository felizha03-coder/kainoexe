import React from 'react';
import { ArrowUpRight, BookOpen, GraduationCap, Target } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { MASCOT_HERO_IMAGE } from '../data/seedData';

export const AboutPage: React.FC = () => {
  const { profile, navigate } = usePlatform();

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
      {/* A. Personal Introduction */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5">
          <p className="font-marker text-base text-[#791EFF] dark:text-[#C8FF24]">
            A. PERSONAL INTRODUCTION
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
            THE PERSON BEHIND THE CODE.
          </h1>
          <p className="text-base text-slate-600 dark:text-[#A5A7B2] leading-relaxed whitespace-pre-line">
            {profile.aboutIntro}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => navigate('projects')}
              className="px-5 py-3 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] text-white font-display font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
            >
              <span>See Projects</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('contact')}
              className="px-5 py-3 rounded-xl bg-[#C8FF24] hover:bg-[#D5FF57] text-[#08090D] font-display font-bold text-sm cursor-pointer"
            >
              Get in Touch
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-[#08090D] aspect-square max-w-md mx-auto">
            <img
              src={MASCOT_HERO_IMAGE}
              alt="Niel Developer Mascot"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* B. Education Timeline */}
      <section className="rounded-2xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-[#791EFF] dark:text-[#C8FF24]" />
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              B. Education
            </h2>
          </div>
          <span className="font-mono text-xs text-slate-500 dark:text-[#A5A7B2]">
            Editable in Admin Dashboard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-5 space-y-2">
            <p className="font-mono text-xs text-[#791EFF] dark:text-[#35CFFF]">
              {profile.education.enrollmentYear}
            </p>
            <h3 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              {profile.education.universityName}
            </h3>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Major: {profile.education.major}
            </p>
            <div className="pt-3 space-y-1.5">
              <p className="text-xs font-mono text-slate-500 dark:text-[#A5A7B2]">
                Academic Activities
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-[#A5A7B2] space-y-1">
                {profile.education.activities.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#791EFF] dark:text-[#C8FF24]" />
              <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                Relevant Courses
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-[#A5A7B2]">
              {profile.education.courses.map((course, idx) => (
                <li
                  key={idx}
                  className="py-1.5 border-b border-slate-100 dark:border-white/5"
                >
                  {course}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* C. Interests & D. Learning Journey */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 space-y-4">
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
            C. Interests
          </h2>
          <ul className="space-y-2.5 text-sm sm:text-base text-slate-600 dark:text-[#A5A7B2]">
            {profile.interests.map((item, idx) => (
              <li
                key={idx}
                className="py-2 border-b border-slate-100 dark:border-white/5 flex items-center justify-between"
              >
                <span>{item}</span>
                <span className="font-mono text-xs text-[#791EFF] dark:text-[#C8FF24]">
                  0{idx + 1}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 space-y-5">
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
            D. Learning Journey
          </h2>
          <div className="space-y-4">
            {profile.journeyMilestones.map((m) => (
              <div
                key={m.phase}
                className="p-4 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/5 space-y-1"
              >
                <p className="font-mono text-xs text-[#791EFF] dark:text-[#35CFFF]">
                  {m.phase}
                </p>
                <h3 className="font-display font-bold text-base text-slate-950 dark:text-white">
                  {m.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-[#A5A7B2]">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* E. Skills & F. Personal Goals */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 rounded-2xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 p-6 space-y-4">
          <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
            E. Skills &amp; Technologies
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#A5A7B2]">
            Placeholder technical skills list — toggle confirmation or edit inside Admin.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {profile.skills.map((skill) => (
              <div
                key={skill.name}
                className="p-3 rounded-xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10"
              >
                <p className="font-display font-semibold text-sm text-slate-950 dark:text-white">
                  {skill.name}
                </p>
                <p className="font-mono text-xs text-slate-500 dark:text-[#A5A7B2]">
                  {skill.category}
                  {skill.confirmed ? ' · Verified' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl bg-[#151720] border border-white/10 text-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#C8FF24]" />
            <h2 className="font-display text-2xl font-bold">F. Personal Goals</h2>
          </div>
          <ul className="space-y-3 text-sm text-[#A5A7B2]">
            {profile.goals.map((goal, idx) => (
              <li
                key={idx}
                className="p-3 rounded-xl bg-[#1B1D27] border border-white/10 leading-relaxed"
              >
                {goal}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};
