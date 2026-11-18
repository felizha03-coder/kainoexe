import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Bot,
  CheckCircle2,
  FolderGit2,
  ImagePlus,
  Inbox,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import {
  AIConfig,
  BlogCategory,
  BlogPost,
  ContactSubmission,
  LearningResource,
  ProfileData,
  Project,
  ProjectCategory,
  SkillItem,
} from '../types/niel';

type AdminTab = 'overview' | 'projects' | 'blog' | 'learning' | 'profile' | 'ai';

interface AdminStatsPayload {
  totalRequests: number;
  totalConversations: number;
  activeSessions: number;
  aiConfig: AIConfig;
  recentErrors: { timestamp: string; message: string }[];
  contactMessages: ContactSubmission[];
  adminEmail: string | null;
}

const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Web Development',
  'UI/UX Design',
  'Academic Projects',
  'Software Development',
  'Experiments',
];

const BLOG_CATEGORIES: BlogCategory[] = [
  'Programming',
  'Technology',
  'AI',
  'Web Development',
  'Student Life',
  'Tutorials',
];

const DEFAULT_PROJECT_FORM: Project = {
  id: '',
  slug: '',
  title: '',
  category: 'Web Development',
  shortDescription: '',
  overview: '',
  problemStatement: '',
  objectives: ['Build clean, maintainable architecture'],
  features: ['Responsive UI', 'Interactive experience'],
  technologies: ['TypeScript', 'React'],
  developmentProcess: '',
  challengesAndSolutions: '',
  thumbnailUrl: '/src/assets/images/project_portfolio_thumb_1794896484418.jpg',
  githubUrl: 'https://github.com',
  liveUrl: '',
  featured: false,
};

const DEFAULT_BLOG_FORM: BlogPost = {
  id: '',
  slug: '',
  title: '',
  category: 'Programming',
  excerpt: '',
  content: '## Introduction\n\nWrite your article in clean Markdown...',
  readingTimeMin: 5,
  publishedAt: new Date().toISOString().slice(0, 10),
  published: true,
  featured: false,
};

const DEFAULT_LEARNING_FORM: LearningResource = {
  id: '',
  title: '',
  category: 'Algorithms & Data Structures',
  level: 'Beginner',
  readingTimeMin: 8,
  summary: '',
  content: '### Overview\n\nWrite structured study notes in Markdown...',
  keyTakeaways: ['Understand core intuition', 'Practice with code examples'],
  roadmapId: 'cs-core',
};

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function compressImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file.'));
      img.onload = () => {
        const maxWidth = 960;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export const AdminDashboardPage: React.FC = () => {
  const {
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
  } = usePlatform();

  const [tab, setTab] = useState<AdminTab>('overview');
  const [authStatus, setAuthStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');
  const [authError, setAuthError] = useState('');
  const [stats, setStats] = useState<AdminStatsPayload | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [banner, setBanner] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Project editor state
  const [projectForm, setProjectForm] = useState<Project>(DEFAULT_PROJECT_FORM);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Blog editor state
  const [blogForm, setBlogForm] = useState<BlogPost>(DEFAULT_BLOG_FORM);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);

  // Learning resource editor state
  const [learningForm, setLearningForm] = useState<LearningResource>(DEFAULT_LEARNING_FORM);
  const [editingLearningId, setEditingLearningId] = useState<string | null>(null);

  // Profile editor state
  const [profileDraft, setProfileDraft] = useState<ProfileData>(profile);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCat, setNewSkillCat] = useState('Language');

  // AI config state
  const [aiDraft, setAiDraft] = useState<AIConfig>({
    dailyLimit: 30,
    maxInputLength: 2000,
    modelName: 'gemini-4-hydrogen',
    customSystemAddon: '',
  });
  const [savingAi, setSavingAi] = useState(false);

  useEffect(() => {
    setProfileDraft(profile);
  }, [profile]);

  const notify = (type: 'ok' | 'err', text: string) => {
    setBanner({ type, text });
    window.setTimeout(() => setBanner(null), 4500);
  };

  const fetchAdminStats = useCallback(async () => {
    if (!user) {
      setAuthStatus('unauthorized');
      setStats(null);
      return;
    }

    setLoadingStats(true);
    setAuthError('');
    try {
      const token = await getAuthToken();
      if (!token) {
        setAuthStatus('unauthorized');
        return;
      }
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setAuthStatus('unauthorized');
        setAuthError(data.error || 'This Google account is not authorized as platform admin.');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to load admin statistics.');
      }

      const data = (await res.json()) as AdminStatsPayload;
      setStats(data);
      setAiDraft(data.aiConfig);
      setAuthStatus('authorized');
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Unable to reach admin server.');
      setAuthStatus('unauthorized');
    } finally {
      setLoadingStats(false);
    }
  }, [user, getAuthToken]);

  useEffect(() => {
    if (!authReady) return;
    if (!user) {
      setAuthStatus('unauthorized');
      setStats(null);
      return;
    }
    setAuthStatus('checking');
    fetchAdminStats();
  }, [authReady, user, fetchAdminStats]);

  const handleSignIn = async () => {
    setAuthError('');
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : 'Google Sign-In failed.');
    }
  };

  // Project handlers
  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageToDataUrl(file);
      setProjectForm((prev) => ({ ...prev, thumbnailUrl: compressed }));
      notify('ok', 'Thumbnail image loaded and compressed.');
    } catch (err: unknown) {
      notify('err', err instanceof Error ? err.message : 'Failed to process image.');
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title.trim()) {
      notify('err', 'Project title is required.');
      return;
    }
    const id = editingProjectId || `proj-${Date.now()}`;
    const slug = projectForm.slug.trim() || toSlug(projectForm.title);
    const nextProject: Project = {
      ...projectForm,
      id,
      slug,
      updatedAt: new Date().toISOString(),
    };
    try {
      await upsertProject(nextProject);
      setProjectForm(DEFAULT_PROJECT_FORM);
      setEditingProjectId(null);
      notify('ok', editingProjectId ? 'Project updated.' : 'Project added.');
    } catch {
      notify('err', 'Failed to save project to Firestore.');
    }
  };

  const startEditProject = (p: Project) => {
    setProjectForm(p);
    setEditingProjectId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Blog handlers
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title.trim()) {
      notify('err', 'Blog post title is required.');
      return;
    }
    const id = editingBlogId || `post-${Date.now()}`;
    const slug = blogForm.slug.trim() || toSlug(blogForm.title);
    const nextPost: BlogPost = {
      ...blogForm,
      id,
      slug,
    };
    try {
      await upsertBlogPost(nextPost);
      setBlogForm(DEFAULT_BLOG_FORM);
      setEditingBlogId(null);
      notify('ok', editingBlogId ? 'Article updated.' : 'Article published.');
    } catch {
      notify('err', 'Failed to save blog post.');
    }
  };

  const startEditBlog = (post: BlogPost) => {
    setBlogForm(post);
    setEditingBlogId(post.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Learning handlers
  const handleSaveLearning = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!learningForm.title.trim()) {
      notify('err', 'Module title is required.');
      return;
    }
    const id = editingLearningId || `learn-${Date.now()}`;
    const nextItem: LearningResource = {
      ...learningForm,
      id,
    };
    try {
      await upsertLearningResource(nextItem);
      setLearningForm(DEFAULT_LEARNING_FORM);
      setEditingLearningId(null);
      notify('ok', editingLearningId ? 'Learning module updated.' : 'Learning module added.');
    } catch {
      notify('err', 'Failed to save learning module.');
    }
  };

  // Profile handlers
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const nextSkill: SkillItem = {
      name: newSkillName.trim(),
      category: newSkillCat,
      confirmed: true,
    };
    setProfileDraft((prev) => ({ ...prev, skills: [...prev.skills, nextSkill] }));
    setNewSkillName('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfile(profileDraft);
      notify('ok', 'Profile, Education & Contact info saved.');
    } catch {
      notify('err', 'Failed to save profile settings.');
    }
  };

  // AI config save
  const handleSaveAiConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAi(true);
    try {
      const token = await getAuthToken();
      const res = await fetch('/api/admin/ai-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(aiDraft),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error || 'Failed to update AI settings.');
      }
      const data = (await res.json()) as { aiConfig: AIConfig };
      setAiDraft(data.aiConfig);
      notify('ok', 'Niel AI server configuration updated.');
    } catch (err: unknown) {
      notify('err', err instanceof Error ? err.message : 'Unable to save AI config.');
    } finally {
      setSavingAi(false);
    }
  };

  if (!authReady || (user && authStatus === 'checking')) {
    return (
      <main className="py-24 px-4 flex items-center justify-center">
        <div className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-8 text-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-[#791EFF] dark:text-[#C8FF24] mx-auto" />
          <p className="font-mono text-sm text-slate-600 dark:text-[#A5A7B2]">
            Verifying admin session...
          </p>
        </div>
      </main>
    );
  }

  if (!user || authStatus !== 'authorized') {
    return (
      <main className="py-20 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
        <div className="rounded-3xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-8 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#791EFF]/15 text-[#791EFF] dark:text-[#C8FF24] flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white">
              NIEL. Admin Workspace
            </h1>
            <p className="text-sm text-slate-600 dark:text-[#A5A7B2]">
              Protected platform management for projects, articles, learning resources, profile details, and Niel AI usage controls.
            </p>
          </div>

          {user && authStatus === 'unauthorized' && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-left space-y-2">
              <p className="text-xs font-mono font-semibold text-red-500">
                Unauthorized Account ({user.email})
              </p>
              <p className="text-xs text-slate-700 dark:text-[#A5A7B2]">
                {authError || 'Only the configured site owner account can access admin routes.'}
              </p>
            </div>
          )}

          {!user && authError && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-500">
              {authError}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {!user ? (
              <button
                onClick={handleSignIn}
                className="w-full py-3 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] text-white font-display font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign in with Google</span>
              </button>
            ) : (
              <button
                onClick={signOutUser}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-display font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out &amp; Switch Account</span>
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div className="space-y-1">
          <p className="font-mono text-xs text-[#791EFF] dark:text-[#C8FF24] font-semibold">
            Authenticated Admin · {stats?.adminEmail || user.email}
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white">
            Platform Control Center
          </h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchAdminStats}
            disabled={loadingStats}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 text-xs font-mono font-semibold text-slate-800 dark:text-white inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingStats ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={signOutUser}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono font-semibold text-red-500 inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {banner && (
        <div
          className={`rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2 border ${
            banner.type === 'ok'
              ? 'bg-[#C8FF24]/15 border-[#C8FF24]/40 text-slate-900 dark:text-[#C8FF24]'
              : 'bg-red-500/15 border-red-500/40 text-red-500'
          }`}
        >
          {banner.type === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{banner.text}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <nav aria-label="Admin sections" className="flex flex-wrap gap-2">
        {(
          [
            { id: 'overview', label: 'Overview & Inbox', icon: BarChart3 },
            { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
            { id: 'blog', label: `Blog (${blogPosts.length})`, icon: BookOpen },
            { id: 'learning', label: `Learning Hub (${learningResources.length})`, icon: BookOpen },
            { id: 'profile', label: 'Profile & Education', icon: UserCheck },
            { id: 'ai', label: 'AI Config & Logs', icon: Bot },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-display font-semibold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
                active
                  ? 'bg-[#791EFF] text-white'
                  : 'bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-[#A5A7B2] hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* TAB: OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-5 space-y-1">
              <p className="font-mono text-xs text-slate-500 dark:text-[#A5A7B2]">Total Projects</p>
              <p className="font-display text-3xl font-bold text-[#791EFF] dark:text-[#C8FF24]">
                {projects.length}
              </p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-5 space-y-1">
              <p className="font-mono text-xs text-slate-500 dark:text-[#A5A7B2]">Blog Articles</p>
              <p className="font-display text-3xl font-bold text-slate-950 dark:text-white">
                {blogPosts.length}
              </p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-5 space-y-1">
              <p className="font-mono text-xs text-slate-500 dark:text-[#A5A7B2]">AI Requests</p>
              <p className="font-display text-3xl font-bold text-[#35CFFF]">
                {stats?.totalRequests ?? 0}
              </p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-5 space-y-1">
              <p className="font-mono text-xs text-slate-500 dark:text-[#A5A7B2]">
                AI Conversations
              </p>
              <p className="font-display text-3xl font-bold text-slate-950 dark:text-white">
                {stats?.totalConversations ?? 0}
              </p>
            </div>
          </div>

          <section className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#791EFF] dark:text-[#C8FF24]" />
              <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                Contact Form Inbox
              </h2>
            </div>

            {!stats?.contactMessages.length ? (
              <p className="text-sm text-slate-500 dark:text-[#A5A7B2]">
                No contact messages received yet. Submissions from the Contact page appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.contactMessages.map((msg) => (
                  <article
                    key={msg.id}
                    className="rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display font-bold text-sm text-slate-950 dark:text-white">
                        {msg.subject}
                      </h3>
                      <span className="font-mono text-xs text-slate-500 dark:text-[#35CFFF]">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-600 dark:text-[#A5A7B2]">
                      From: {msg.name} &lt;{msg.email}&gt;
                    </p>
                    <p className="text-sm text-slate-700 dark:text-white/90 whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* TAB: PROJECTS */}
      {tab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form
            onSubmit={handleSaveProject}
            className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 space-y-4 h-fit"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                {editingProjectId ? 'Edit Project' : 'Add New Project'}
              </h2>
              {editingProjectId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProjectId(null);
                    setProjectForm(DEFAULT_PROJECT_FORM);
                  }}
                  className="text-xs font-mono text-[#791EFF] dark:text-[#C8FF24] cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  Title
                </label>
                <input
                  value={projectForm.title}
                  onChange={(e) => setProjectForm((p) => ({ ...p, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                    Category
                  </label>
                  <select
                    value={projectForm.category}
                    onChange={(e) =>
                      setProjectForm((p) => ({
                        ...p,
                        category: e.target.value as ProjectCategory,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                  >
                    {PROJECT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                    Slug (optional)
                  </label>
                  <input
                    value={projectForm.slug}
                    onChange={(e) => setProjectForm((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="auto-generated"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  Short Description
                </label>
                <input
                  value={projectForm.shortDescription}
                  onChange={(e) =>
                    setProjectForm((p) => ({ ...p, shortDescription: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  Overview
                </label>
                <textarea
                  rows={2}
                  value={projectForm.overview}
                  onChange={(e) => setProjectForm((p) => ({ ...p, overview: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  Problem Statement
                </label>
                <textarea
                  rows={2}
                  value={projectForm.problemStatement}
                  onChange={(e) =>
                    setProjectForm((p) => ({ ...p, problemStatement: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  Technologies (comma separated)
                </label>
                <input
                  value={projectForm.technologies.join(', ')}
                  onChange={(e) =>
                    setProjectForm((p) => ({
                      ...p,
                      technologies: e.target.value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  Thumbnail URL or Upload
                </label>
                <div className="flex gap-2">
                  <input
                    value={projectForm.thumbnailUrl}
                    onChange={(e) =>
                      setProjectForm((p) => ({ ...p, thumbnailUrl: e.target.value }))
                    }
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white text-xs"
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-xs font-mono cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                    <ImagePlus className="w-4 h-4 text-[#791EFF] dark:text-[#C8FF24]" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProjectImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                    GitHub URL
                  </label>
                  <input
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm((p) => ({ ...p, githubUrl: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                    Live URL / Route
                  </label>
                  <input
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm((p) => ({ ...p, liveUrl: e.target.value }))}
                    placeholder="https://... or #ai"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white text-xs"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-[#A5A7B2] cursor-pointer">
                <input
                  type="checkbox"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm((p) => ({ ...p, featured: e.target.checked }))}
                />
                <span>Feature on Home Page</span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] text-white font-display font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingProjectId ? 'Update Project' : 'Save Project'}</span>
              </button>
            </div>
          </form>

          <div className="lg:col-span-3 space-y-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={proj.thumbnailUrl}
                    alt={proj.title}
                    className="w-20 h-14 rounded-xl object-cover bg-slate-900 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 space-y-1">
                    <p className="font-mono text-[11px] text-[#35CFFF]">
                      {proj.category} {proj.featured ? '· Featured' : ''}
                    </p>
                    <h3 className="font-display font-bold text-base text-slate-950 dark:text-white truncate">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#A5A7B2] line-clamp-1">
                      {proj.shortDescription}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startEditProject(proj)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#151720] text-xs font-mono text-slate-800 dark:text-white inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteProject(proj.id)}
                    aria-label={`Delete ${proj.title}`}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: BLOG */}
      {tab === 'blog' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form
            onSubmit={handleSaveBlog}
            className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 space-y-4 h-fit"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                {editingBlogId ? 'Edit Article' : 'Write New Article'}
              </h2>
              {editingBlogId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingBlogId(null);
                    setBlogForm(DEFAULT_BLOG_FORM);
                  }}
                  className="text-xs font-mono text-[#791EFF] dark:text-[#C8FF24] cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="space-y-3 text-sm">
              <input
                value={blogForm.title}
                onChange={(e) => setBlogForm((b) => ({ ...b, title: e.target.value }))}
                placeholder="Article Title"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={blogForm.category}
                  onChange={(e) =>
                    setBlogForm((b) => ({ ...b, category: e.target.value as BlogCategory }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                >
                  {BLOG_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={blogForm.readingTimeMin}
                  onChange={(e) =>
                    setBlogForm((b) => ({ ...b, readingTimeMin: Number(e.target.value) || 5 }))
                  }
                  placeholder="Min read"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>

              <textarea
                rows={2}
                value={blogForm.excerpt}
                onChange={(e) => setBlogForm((b) => ({ ...b, excerpt: e.target.value }))}
                placeholder="Short summary..."
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
              />

              <textarea
                rows={7}
                value={blogForm.content}
                onChange={(e) => setBlogForm((b) => ({ ...b, content: e.target.value }))}
                placeholder="Markdown article body..."
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-950 dark:text-white"
              />

              <div className="flex items-center gap-6 text-xs font-mono text-slate-700 dark:text-[#A5A7B2]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogForm.published}
                    onChange={(e) => setBlogForm((b) => ({ ...b, published: e.target.checked }))}
                  />
                  <span>Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blogForm.featured}
                    onChange={(e) => setBlogForm((b) => ({ ...b, featured: e.target.checked }))}
                  />
                  <span>Featured</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] text-white font-display font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingBlogId ? 'Update Article' : 'Publish Article'}</span>
              </button>
            </div>
          </form>

          <div className="lg:col-span-3 space-y-4">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-5 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center"
              >
                <div className="space-y-1">
                  <p className="font-mono text-[11px] text-[#35CFFF]">
                    {post.category} · {post.publishedAt} ·{' '}
                    {post.published ? 'Published' : 'Draft'}
                    {post.featured ? ' · Featured' : ''}
                  </p>
                  <h3 className="font-display font-bold text-base text-slate-950 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-[#A5A7B2] line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => upsertBlogPost({ ...post, published: !post.published })}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#151720] text-xs font-mono text-slate-800 dark:text-white cursor-pointer whitespace-nowrap"
                  >
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => startEditBlog(post)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#151720] text-xs font-mono text-slate-800 dark:text-white inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => deleteBlogPost(post.id)}
                    aria-label={`Delete ${post.title}`}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: LEARNING HUB */}
      {tab === 'learning' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form
            onSubmit={handleSaveLearning}
            className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 space-y-4 h-fit"
          >
            <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
              {editingLearningId ? 'Edit Learning Module' : 'Add Learning Module'}
            </h2>
            <div className="space-y-3 text-sm">
              <input
                value={learningForm.title}
                onChange={(e) => setLearningForm((l) => ({ ...l, title: e.target.value }))}
                placeholder="Module Title"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
              />
              <input
                value={learningForm.category}
                onChange={(e) => setLearningForm((l) => ({ ...l, category: e.target.value }))}
                placeholder="Category (e.g. Web Development)"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={learningForm.level}
                  onChange={(e) =>
                    setLearningForm((l) => ({
                      ...l,
                      level: e.target.value as LearningResource['level'],
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <input
                  type="number"
                  min={2}
                  max={60}
                  value={learningForm.readingTimeMin}
                  onChange={(e) =>
                    setLearningForm((l) => ({
                      ...l,
                      readingTimeMin: Number(e.target.value) || 8,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>
              <textarea
                rows={2}
                value={learningForm.summary}
                onChange={(e) => setLearningForm((l) => ({ ...l, summary: e.target.value }))}
                placeholder="Summary..."
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
              />
              <textarea
                rows={6}
                value={learningForm.content}
                onChange={(e) => setLearningForm((l) => ({ ...l, content: e.target.value }))}
                placeholder="Markdown study material..."
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-950 dark:text-white"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] text-white font-display font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingLearningId ? 'Update Module' : 'Save Module'}</span>
              </button>
            </div>
          </form>

          <div className="lg:col-span-3 space-y-3">
            {learningResources.map((res) => (
              <div
                key={res.id}
                className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-4 flex justify-between items-center gap-4"
              >
                <div className="space-y-1">
                  <p className="font-mono text-[11px] text-[#35CFFF]">
                    {res.category} · {res.level} · {res.readingTimeMin} min
                  </p>
                  <h3 className="font-display font-bold text-base text-slate-950 dark:text-white">
                    {res.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setLearningForm(res);
                      setEditingLearningId(res.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#151720] text-xs font-mono text-slate-800 dark:text-white cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteLearningResource(res.id)}
                    aria-label={`Delete ${res.title}`}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PROFILE & EDUCATION */}
      {tab === 'profile' && (
        <form
          onSubmit={handleSaveProfile}
          className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 space-y-6"
        >
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Profile, Education, Skills &amp; Contact Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  University Name
                </label>
                <input
                  value={profileDraft.education.universityName}
                  onChange={(e) =>
                    setProfileDraft((d) => ({
                      ...d,
                      education: { ...d.education, universityName: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                    Major
                  </label>
                  <input
                    value={profileDraft.education.major}
                    onChange={(e) =>
                      setProfileDraft((d) => ({
                        ...d,
                        education: { ...d.education, major: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                    Enrollment Year
                  </label>
                  <input
                    value={profileDraft.education.enrollmentYear}
                    onChange={(e) =>
                      setProfileDraft((d) => ({
                        ...d,
                        education: { ...d.education, enrollmentYear: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  Relevant Courses (comma separated)
                </label>
                <textarea
                  rows={3}
                  value={profileDraft.education.courses.join(', ')}
                  onChange={(e) =>
                    setProfileDraft((d) => ({
                      ...d,
                      education: {
                        ...d.education,
                        courses: e.target.value
                          .split(',')
                          .map((c) => c.trim())
                          .filter(Boolean),
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  Contact Email
                </label>
                <input
                  value={profileDraft.contact.email}
                  onChange={(e) =>
                    setProfileDraft((d) => ({
                      ...d,
                      contact: { ...d.contact, email: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  GitHub URL
                </label>
                <input
                  value={profileDraft.contact.github}
                  onChange={(e) =>
                    setProfileDraft((d) => ({
                      ...d,
                      contact: { ...d.contact, github: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  LinkedIn URL
                </label>
                <input
                  value={profileDraft.contact.linkedin}
                  onChange={(e) =>
                    setProfileDraft((d) => ({
                      ...d,
                      contact: { ...d.contact, linkedin: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  Instagram URL
                </label>
                <input
                  value={profileDraft.contact.instagram}
                  onChange={(e) =>
                    setProfileDraft((d) => ({
                      ...d,
                      contact: { ...d.contact, instagram: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Skills Manager */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
            <h3 className="font-display font-bold text-base text-slate-950 dark:text-white">
              Technical Skills (Toggle Confirmed Status)
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileDraft.skills.map((sk, idx) => (
                <div
                  key={`${sk.name}-${idx}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-xs"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setProfileDraft((d) => ({
                        ...d,
                        skills: d.skills.map((item, i) =>
                          i === idx ? { ...item, confirmed: !item.confirmed } : item
                        ),
                      }))
                    }
                    className={`font-semibold cursor-pointer ${
                      sk.confirmed
                        ? 'text-[#791EFF] dark:text-[#C8FF24]'
                        : 'text-slate-600 dark:text-[#A5A7B2]'
                    }`}
                  >
                    {sk.name} {sk.confirmed ? '✓' : ''}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProfileDraft((d) => ({
                        ...d,
                        skills: d.skills.filter((_, i) => i !== idx),
                      }))
                    }
                    className="text-red-500 cursor-pointer"
                    aria-label={`Remove ${sk.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <input
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="New skill (e.g. TypeScript)"
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-xs text-slate-950 dark:text-white"
              />
              <input
                value={newSkillCat}
                onChange={(e) => setNewSkillCat(e.target.value)}
                placeholder="Category"
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-xs text-slate-950 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-800 dark:text-white inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] text-white font-display font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </form>
      )}

      {/* TAB: AI CONFIG & LOGS */}
      {tab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form
            onSubmit={handleSaveAiConfig}
            className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 space-y-4"
          >
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              Niel AI Usage Limits &amp; Model Config
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  Daily Message Limit per Anonymous Session
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={aiDraft.dailyLimit}
                  onChange={(e) =>
                    setAiDraft((a) => ({ ...a, dailyLimit: Number(e.target.value) || 30 }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  Max Prompt Input Length (characters)
                </label>
                <input
                  type="number"
                  min={100}
                  max={8000}
                  value={aiDraft.maxInputLength}
                  onChange={(e) =>
                    setAiDraft((a) => ({ ...a, maxInputLength: Number(e.target.value) || 2000 }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  Active Gemini Model
                </label>
                <select
                  value={aiDraft.modelName}
                  onChange={(e) => setAiDraft((a) => ({ ...a, modelName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                >
                  <option value="gemini-4-hydrogen">gemini-4-hydrogen (Recommended)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs mb-1 text-slate-600 dark:text-[#A5A7B2]">
                  Custom System Prompt Addon (optional)
                </label>
                <textarea
                  rows={4}
                  value={aiDraft.customSystemAddon}
                  onChange={(e) =>
                    setAiDraft((a) => ({ ...a, customSystemAddon: e.target.value }))
                  }
                  placeholder="Optional extra tutoring instructions or focus areas..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#151720] border border-slate-200 dark:border-white/10 text-slate-950 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={savingAi}
                className="px-5 py-2.5 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] disabled:opacity-50 text-white font-display font-bold text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{savingAi ? 'Saving...' : 'Save Server AI Config'}</span>
              </button>
            </div>
          </form>

          <section className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
              Recent AI Upstream Logs
            </h2>
            {!stats?.recentErrors.length ? (
              <p className="text-sm text-slate-500 dark:text-[#A5A7B2]">
                No recent AI errors logged. All endpoints are operating cleanly.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentErrors.map((err, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 space-y-1"
                  >
                    <p className="font-mono text-[11px] text-red-500">
                      {new Date(err.timestamp).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-800 dark:text-white/90 break-words">
                      {err.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
};
