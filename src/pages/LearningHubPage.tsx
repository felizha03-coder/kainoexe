import React, { useState } from 'react';
import {
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  HelpCircle,
  Map,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { LEARNING_CATEGORIES, LEARNING_ROADMAPS } from '../data/seedData';
import { LearningResource } from '../types/niel';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

type HubTab = 'materials' | 'roadmaps' | 'quiz' | 'snippets';

export const LearningHubPage: React.FC = () => {
  const {
    learningResources,
    quizzes,
    snippets,
    completedLessons,
    toggleLessonComplete,
    bookmarkedLessons,
    toggleLessonBookmark,
  } = usePlatform();

  const [tab, setTab] = useState<HubTab>('materials');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [readingLesson, setReadingLesson] = useState<LearningResource | null>(null);

  // Quiz State
  const [quizTopic, setQuizTopic] = useState('All');
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Snippets State
  const [snippetCat, setSnippetCat] = useState('All');
  const [snippetSearch, setSnippetSearch] = useState('');
  const [copiedSnipId, setCopiedSnipId] = useState<string | null>(null);

  const filteredMaterials = learningResources.filter((r) => {
    const matchCat = category === 'All' || r.category === category;
    const matchBook = !onlyBookmarked || bookmarkedLessons.includes(r.id);
    const q = search.trim().toLowerCase();
    const matchQuery =
      !q || r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q);
    return matchCat && matchBook && matchQuery;
  });

  const activeQuizzes = quizzes.filter(
    (q) => quizTopic === 'All' || q.topic === quizTopic
  );
  const currentQuestion = activeQuizzes[quizIdx];

  const snippetCategories = [
    'All',
    'HTML Templates',
    'CSS Components',
    'JavaScript Functions',
    'Python Examples',
    'PHP Examples',
    'SQL Queries',
  ];

  const filteredSnippets = snippets.filter((s) => {
    const matchCat = snippetCat === 'All' || s.category === snippetCat;
    const q = snippetSearch.trim().toLowerCase();
    const matchQ =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const progressPct = learningResources.length
    ? Math.round((completedLessons.length / learningResources.length) * 100)
    : 0;

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 min-h-[80vh]">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3">
          <p className="font-marker text-base text-[#791EFF] dark:text-[#C8FF24]">
            IT LEARNING HUB
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
            EXPLORE. LEARN. BUILD.
          </h1>
          <p className="text-base text-slate-600 dark:text-[#A5A7B2] max-w-2xl">
            Structured Computer Science fundamentals, roadmaps, interactive quizzes, and
            reusable code snippets.
          </p>
        </div>

        {/* Learning Progress Indicator */}
        <div className="w-full lg:w-72 p-4 rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500 dark:text-[#A5A7B2]">Study Progress</span>
            <span className="font-bold text-[#791EFF] dark:text-[#C8FF24] tabular-nums">
              {completedLessons.length}/{learningResources.length} ({progressPct}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-[#08090D] overflow-hidden">
            <div
              className="h-full bg-[#791EFF] dark:bg-[#C8FF24] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </header>

      {/* Hub Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
        {[
          { id: 'materials', label: 'Learning Materials', icon: BookOpen },
          { id: 'roadmaps', label: 'Learning Roadmaps', icon: Map },
          { id: 'quiz', label: 'IT Quiz', icon: HelpCircle },
          { id: 'snippets', label: 'Code Snippets', icon: Code2 },
        ].map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id as HubTab)}
              className={`px-4 py-2.5 rounded-xl text-sm font-display font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors ${
                active
                  ? 'bg-[#791EFF] text-white'
                  : 'bg-slate-100 dark:bg-[#151720] text-slate-700 dark:text-[#A5A7B2] hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LEARNING MATERIALS */}
      {tab === 'materials' && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search topics..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-sm"
                />
              </div>

              <button
                onClick={() => setOnlyBookmarked((b) => !b)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer border ${
                  onlyBookmarked
                    ? 'bg-[#C8FF24] text-[#08090D] border-[#C8FF24] font-bold'
                    : 'bg-white dark:bg-[#151720] text-slate-700 dark:text-[#A5A7B2] border-slate-200 dark:border-white/10'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Bookmarked ({bookmarkedLessons.length})</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['All', ...LEARNING_CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  category === cat
                    ? 'bg-[#791EFF] text-white'
                    : 'bg-slate-100 dark:bg-[#151720] text-slate-600 dark:text-[#A5A7B2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMaterials.map((res) => {
              const done = completedLessons.includes(res.id);
              const saved = bookmarkedLessons.includes(res.id);
              return (
                <article
                  key={res.id}
                  className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-mono text-[#791EFF] dark:text-[#35CFFF]">
                        {res.category} · {res.level} · {res.readingTimeMin} min
                      </p>
                      <button
                        onClick={() => toggleLessonBookmark(res.id)}
                        aria-label="Bookmark material"
                        className="cursor-pointer text-slate-400 hover:text-[#C8FF24]"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            saved ? 'fill-[#791EFF] text-[#791EFF] dark:fill-[#C8FF24] dark:text-[#C8FF24]' : ''
                          }`}
                        />
                      </button>
                    </div>
                    <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                      {res.title}
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-[#A5A7B2]">
                      {res.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => setReadingLesson(res)}
                      className="text-sm font-display font-semibold text-[#791EFF] dark:text-[#C8FF24] hover:underline cursor-pointer"
                    >
                      Read Lesson →
                    </button>
                    <button
                      onClick={() => toggleLessonComplete(res.id)}
                      className={`text-xs font-mono inline-flex items-center gap-1 cursor-pointer ${
                        done
                          ? 'text-emerald-600 dark:text-[#C8FF24] font-semibold'
                          : 'text-slate-500 dark:text-[#A5A7B2]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {done ? 'Completed' : 'Mark Done'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LEARNING ROADMAPS */}
      {tab === 'roadmaps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LEARNING_ROADMAPS.map((rm) => (
            <section
              key={rm.id}
              className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 space-y-4"
            >
              <div>
                <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                  {rm.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-[#A5A7B2]">
                  {rm.subtitle}
                </p>
              </div>
              <ol className="space-y-3">
                {rm.steps.map((step, idx) => (
                  <li
                    key={step.title}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/5"
                  >
                    <p className="font-display font-semibold text-sm text-[#791EFF] dark:text-[#C8FF24]">
                      Step {idx + 1}: {step.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-[#A5A7B2] mt-1">
                      {step.topics.join(' · ')}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}

      {/* TAB 3: IT QUIZ */}
      {tab === 'quiz' && (
        <section className="max-w-3xl mx-auto space-y-6">
          <div className="flex flex-wrap gap-1.5">
            {[
              'All',
              'Programming',
              'Database',
              'Networking',
              'Web Development',
              'Computer Science Fundamentals',
            ].map((tp) => (
              <button
                key={tp}
                onClick={() => {
                  setQuizTopic(tp);
                  setQuizIdx(0);
                  setQuizChoice(null);
                  setQuizScore(0);
                  setQuizFinished(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                  quizTopic === tp
                    ? 'bg-[#791EFF] text-white'
                    : 'bg-slate-100 dark:bg-[#151720] text-slate-600 dark:text-[#A5A7B2]'
                }`}
              >
                {tp}
              </button>
            ))}
          </div>

          {quizFinished ? (
            <div className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-8 text-center space-y-4">
              <h2 className="font-display text-2xl font-bold text-[#791EFF] dark:text-[#C8FF24]">
                Quiz Complete!
              </h2>
              <p className="font-mono text-xl font-bold tabular-nums">
                Score: {quizScore} / {activeQuizzes.length}
              </p>
              <button
                onClick={() => {
                  setQuizIdx(0);
                  setQuizChoice(null);
                  setQuizScore(0);
                  setQuizFinished(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#791EFF] text-white font-display font-semibold text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Retry Quiz
              </button>
            </div>
          ) : (
            currentQuestion && (
              <div className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 space-y-5">
                <p className="font-mono text-xs text-slate-500 dark:text-[#35CFFF]">
                  {currentQuestion.topic} · Question {quizIdx + 1} of{' '}
                  {activeQuizzes.length}
                </p>
                <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                  {currentQuestion.question}
                </h2>
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, idx) => {
                    const chosen = quizChoice === idx;
                    const right = currentQuestion.correctIndex === idx;
                    let cls =
                      'bg-slate-50 dark:bg-[#151720] border-slate-200 dark:border-white/10 hover:border-[#791EFF]';
                    if (quizChoice !== null) {
                      if (right)
                        cls =
                          'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300';
                      else if (chosen)
                        cls =
                          'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300';
                    }
                    return (
                      <button
                        key={idx}
                        disabled={quizChoice !== null}
                        onClick={() => {
                          setQuizChoice(idx);
                          if (idx === currentQuestion.correctIndex) {
                            setQuizScore((s) => s + 1);
                          }
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium cursor-pointer ${cls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizChoice !== null && (
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#151720] space-y-3">
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      <strong>Explanation:</strong> {currentQuestion.explanation}
                    </p>
                    <button
                      onClick={() => {
                        if (quizIdx + 1 >= activeQuizzes.length) {
                          setQuizFinished(true);
                        } else {
                          setQuizIdx((i) => i + 1);
                          setQuizChoice(null);
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-[#C8FF24] text-[#08090D] font-display font-bold text-xs cursor-pointer"
                    >
                      {quizIdx + 1 >= activeQuizzes.length
                        ? 'Finish Quiz'
                        : 'Next Question →'}
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </section>
      )}

      {/* TAB 4: CODE SNIPPETS */}
      {tab === 'snippets' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={snippetSearch}
                onChange={(e) => setSnippetSearch(e.target.value)}
                placeholder="Search snippets..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {snippetCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSnippetCat(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    snippetCat === c
                      ? 'bg-[#791EFF] text-white'
                      : 'bg-slate-100 dark:bg-[#151720] text-slate-600 dark:text-[#A5A7B2]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredSnippets.map((snip) => (
              <div
                key={snip.id}
                className="rounded-2xl bg-[#0D0F16] border border-white/10 overflow-hidden text-white flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-mono text-xs text-[#35CFFF]">
                        {snip.category} · {snip.language.toUpperCase()}
                      </p>
                      <h3 className="font-display text-lg font-bold">{snip.title}</h3>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(snip.code).catch(() => {});
                        setCopiedSnipId(snip.id);
                        window.setTimeout(() => setCopiedSnipId(null), 1500);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSnipId === snip.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#C8FF24]" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-[#A5A7B2]">{snip.description}</p>
                </div>
                <pre className="p-4 bg-[#08090D] border-t border-white/10 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
                  <code>{snip.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lesson Article Modal */}
      {readingLesson && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setReadingLesson(null)}
        >
          <article
            className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#151720] border border-slate-200 dark:border-white/10 p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-[#791EFF] dark:text-[#35CFFF]">
                  {readingLesson.category} · {readingLesson.level} ·{' '}
                  {readingLesson.readingTimeMin} min read
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1">
                  {readingLesson.title}
                </h2>
              </div>
              <button
                onClick={() => setReadingLesson(null)}
                aria-label="Close lesson"
                className="p-2 rounded-lg bg-slate-100 dark:bg-[#1B1D27] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <MarkdownRenderer content={readingLesson.content} />

            {readingLesson.keyTakeaways?.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 space-y-2">
                <p className="font-display font-bold text-sm text-[#791EFF] dark:text-[#C8FF24]">
                  Key Takeaways
                </p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-[#A5A7B2] space-y-1">
                  {readingLesson.keyTakeaways.map((k, idx) => (
                    <li key={idx}>{k}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={() => toggleLessonComplete(readingLesson.id)}
                className="px-4 py-2 rounded-xl bg-[#C8FF24] text-[#08090D] font-display font-bold text-xs cursor-pointer"
              >
                {completedLessons.includes(readingLesson.id)
                  ? 'Completed ✓'
                  : 'Mark as Completed'}
              </button>
              <button
                onClick={() => setReadingLesson(null)}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </article>
        </div>
      )}
    </main>
  );
};
