import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleAuthProvider,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  DEFAULT_PROFILE,
  INITIAL_BLOG_POSTS,
  INITIAL_CODE_SNIPPETS,
  INITIAL_LEARNING_RESOURCES,
  INITIAL_PROJECTS,
  INITIAL_QUIZZES,
} from '../data/seedData';
import {
  BlogPost,
  CodeSnippet,
  LanguageCode,
  LearningResource,
  PageRoute,
  ProfileData,
  Project,
  QuizQuestion,
} from '../types/niel';

const ROUTE_PATHS: Record<string, PageRoute> = {
  '/': 'home',
  '/home': 'home',
  '/projects': 'projects',
  '/about': 'about',
  '/ai': 'ai',
  '/learning': 'learning',
  '/playground': 'playground',
  '/blog': 'blog',
  '/contact': 'contact',
  '/admin': 'admin',
};

const ROUTE_TITLES: Record<PageRoute, { title: string; desc: string }> = {
  home: {
    title: 'NIEL. — Informatics Engineering Student & AI Platform',
    desc: 'Personal developer portfolio, Niel AI Tutor & Coding Assistant, IT Learning Hub, and Code Playground.',
  },
  projects: {
    title: 'Projects — NIEL. Creative Workspace',
    desc: 'Explore Informatics Engineering projects, web apps, software prototypes, and technical case studies.',
  },
  'project-detail': {
    title: 'Project Case Study — NIEL.',
    desc: 'Detailed engineering breakdown, architecture, challenges, and live demos.',
  },
  about: {
    title: 'About Niel — Informatics Engineering Student',
    desc: 'Learn about Niel, academic journey in Informatics Engineering, interests, skills, and goals.',
  },
  ai: {
    title: 'Niel AI — Bilingual IT Tutor & Coding Assistant',
    desc: 'Interactive AI Tutor and Coding Assistant supporting English and Bahasa Indonesia.',
  },
  learning: {
    title: 'IT Learning Hub — NIEL.',
    desc: 'Curated IT tutorials, roadmaps, interactive quizzes, and searchable code snippets.',
  },
  playground: {
    title: 'Code Playground — NIEL.',
    desc: 'Experiment live with HTML, CSS, and JavaScript inside an isolated browser sandbox.',
  },
  blog: {
    title: 'Blog — Thoughts, Tech & Discoveries | NIEL.',
    desc: 'Articles and tutorials on programming, AI, web architecture, and student developer life.',
  },
  'blog-detail': {
    title: 'Article — NIEL. Blog',
    desc: 'Read technical deep-dives and tutorials from Niel.',
  },
  contact: {
    title: 'Contact — NIEL.',
    desc: 'Connect with Niel for collaborations, student projects, and technical ideas.',
  },
  admin: {
    title: 'Admin Workspace — NIEL.',
    desc: 'Protected content management and AI usage analytics dashboard.',
  },
};

function getInitialAnonSessionId(): string {
  try {
    const existing = localStorage.getItem('niel_anon_session_v1');
    if (existing && existing.length >= 8) return existing;
    const created =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem('niel_anon_session_v1', created);
    return created;
  } catch {
    return `sess-${Date.now()}`;
  }
}

function parseBrowserRoute(): {
  route: PageRoute | 'not-found';
  slug: string | null;
} {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path.startsWith('/projects/')) {
    return { route: 'project-detail', slug: decodeURIComponent(path.slice('/projects/'.length)) };
  }
  if (path.startsWith('/blog/')) {
    return { route: 'blog-detail', slug: decodeURIComponent(path.slice('/blog/'.length)) };
  }
  const matched = ROUTE_PATHS[path];
  if (matched) return { route: matched, slug: null };
  return { route: 'not-found', slug: null };
}

interface PlatformContextValue {
  route: PageRoute | 'not-found';
  selectedSlug: string | null;
  navigate: (target: PageRoute, slug?: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  lang: LanguageCode;
  setLang: (l: LanguageCode) => void;
  anonSessionId: string;
  user: User | null;
  authReady: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
  profile: ProfileData;
  saveProfile: (next: ProfileData) => Promise<void>;
  projects: Project[];
  upsertProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  blogPosts: BlogPost[];
  upsertBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  learningResources: LearningResource[];
  upsertLearningResource: (res: LearningResource) => Promise<void>;
  deleteLearningResource: (id: string) => Promise<void>;
  quizzes: QuizQuestion[];
  snippets: CodeSnippet[];
  completedLessons: string[];
  toggleLessonComplete: (id: string) => void;
  bookmarkedLessons: string[];
  toggleLessonBookmark: (id: string) => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = parseBrowserRoute();
  const [route, setRoute] = useState<PageRoute | 'not-found'>(initial.route);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initial.slug);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return localStorage.getItem('niel_theme') === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [lang, setLang] = useState<LanguageCode>(() => {
    try {
      return localStorage.getItem('niel_lang') === 'id' ? 'id' : 'en';
    } catch {
      return 'en';
    }
  });

  const [anonSessionId] = useState<string>(() => getInitialAnonSessionId());
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [learningResources, setLearningResources] = useState<LearningResource[]>(
    INITIAL_LEARNING_RESOURCES
  );
  const [quizzes] = useState<QuizQuestion[]>(INITIAL_QUIZZES);
  const [snippets] = useState<CodeSnippet[]>(INITIAL_CODE_SNIPPETS);

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('niel_completed_lessons') || '[]');
    } catch {
      return [];
    }
  });
  const [bookmarkedLessons, setBookmarkedLessons] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('niel_bookmarked_lessons') || '[]');
    } catch {
      return [];
    }
  });

  // Sync theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('niel_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('niel_lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  // Sync dynamic SEO title & meta description
  useEffect(() => {
    const meta =
      route === 'not-found'
        ? {
            title: '404 Page Not Found — NIEL.',
            desc: 'The requested page could not be found in Niel’s developer workspace.',
          }
        : ROUTE_TITLES[route];

    document.title = meta.title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', meta.desc);
  }, [route]);

  // Listen to browser back/forward
  useEffect(() => {
    const onPop = () => {
      const parsed = parseBrowserRoute();
      setRoute(parsed.route);
      setSelectedSlug(parsed.slug);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Real-time Firestore content subscriptions (non-empty docs override starter seed cleanly)
  useEffect(() => {
    const unsubProjects = onSnapshot(
      collection(db, 'projects'),
      (snap) => {
        if (!snap.empty) {
          const loaded = snap.docs.map((d) => d.data() as Project);
          setProjects(loaded);
        }
      },
      (err) => {
        console.warn('Projects sync note:', err.message);
      }
    );

    const unsubLearning = onSnapshot(
      collection(db, 'learning_resources'),
      (snap) => {
        if (!snap.empty) {
          setLearningResources(snap.docs.map((d) => d.data() as LearningResource));
        }
      },
      (err) => {
        console.warn('Learning resources sync note:', err.message);
      }
    );

    const unsubProfile = onSnapshot(
      doc(db, 'site_settings', 'public_profile'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as { profile?: ProfileData };
          if (data.profile) setProfile(data.profile);
        }
      },
      (err) => {
        console.warn('Profile sync note:', err.message);
      }
    );

    return () => {
      unsubProjects();
      unsubLearning();
      unsubProfile();
    };
  }, []);

  // Blog subscription (respecting published status for public vs admin)
  useEffect(() => {
    const unsubBlogs = onSnapshot(
      collection(db, 'blog_posts'),
      (snap) => {
        if (!snap.empty) {
          setBlogPosts(snap.docs.map((d) => d.data() as BlogPost));
        }
      },
      () => {
        // Fallback smoothly to starter posts if unauthenticated list hits draft security rule
        setBlogPosts(INITIAL_BLOG_POSTS);
      }
    );
    return () => unsubBlogs();
  }, [user]);

  const navigate = useCallback((target: PageRoute, slug?: string) => {
    let url = '/';
    if (target === 'project-detail' && slug) url = `/projects/${encodeURIComponent(slug)}`;
    else if (target === 'blog-detail' && slug) url = `/blog/${encodeURIComponent(slug)}`;
    else if (target !== 'home') url = `/${target}`;

    window.history.pushState({}, '', url);
    setRoute(target);
    setSelectedSlug(slug || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleAuthProvider);
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
  }, []);

  const getAuthToken = useCallback(async () => {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  }, []);

  const saveProfile = useCallback(async (next: ProfileData) => {
    setProfile(next);
    try {
      await setDoc(doc(db, 'site_settings', 'public_profile'), {
        key: 'public_profile',
        profile: next,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'site_settings/public_profile');
    }
  }, []);

  const upsertProject = useCallback(async (project: Project) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      return idx >= 0
        ? prev.map((p) => (p.id === project.id ? project : p))
        : [project, ...prev];
    });
    try {
      await setDoc(doc(db, 'projects', project.id), project);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${project.id}`);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }
  }, []);

  const upsertBlogPost = useCallback(async (post: BlogPost) => {
    setBlogPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === post.id);
      return idx >= 0
        ? prev.map((p) => (p.id === post.id ? post : p))
        : [post, ...prev];
    });
    try {
      await setDoc(doc(db, 'blog_posts', post.id), post);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `blog_posts/${post.id}`);
    }
  }, []);

  const deleteBlogPost = useCallback(async (id: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteDoc(doc(db, 'blog_posts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `blog_posts/${id}`);
    }
  }, []);

  const upsertLearningResource = useCallback(async (res: LearningResource) => {
    setLearningResources((prev) => {
      const idx = prev.findIndex((r) => r.id === res.id);
      return idx >= 0
        ? prev.map((r) => (r.id === res.id ? res : r))
        : [res, ...prev];
    });
    try {
      await setDoc(doc(db, 'learning_resources', res.id), res);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `learning_resources/${res.id}`);
    }
  }, []);

  const deleteLearningResource = useCallback(async (id: string) => {
    setLearningResources((prev) => prev.filter((r) => r.id !== id));
    try {
      await deleteDoc(doc(db, 'learning_resources', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `learning_resources/${id}`);
    }
  }, []);

  const toggleLessonComplete = useCallback((id: string) => {
    setCompletedLessons((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem('niel_completed_lessons', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const toggleLessonBookmark = useCallback((id: string) => {
    setBookmarkedLessons((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem('niel_bookmarked_lessons', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <PlatformContext.Provider
      value={{
        route,
        selectedSlug,
        navigate,
        theme,
        toggleTheme,
        lang,
        setLang,
        anonSessionId,
        user,
        authReady,
        signInWithGoogle,
        signOutUser,
        getAuthToken,
        profile,
        saveProfile,
        projects,
        upsertProject,
        deleteProject,
        blogPosts,
        upsertBlogPost,
        deleteBlogPost,
        learningResources,
        upsertLearningResource,
        deleteLearningResource,
        quizzes,
        snippets,
        completedLessons,
        toggleLessonComplete,
        bookmarkedLessons,
        toggleLessonBookmark,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}
