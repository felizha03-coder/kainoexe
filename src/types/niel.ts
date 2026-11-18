export type PageRoute =
  | 'home'
  | 'projects'
  | 'project-detail'
  | 'about'
  | 'ai'
  | 'learning'
  | 'playground'
  | 'blog'
  | 'blog-detail'
  | 'contact'
  | 'admin';

export type LanguageCode = 'en' | 'id';

export type ProjectCategory =
  | 'Web Development'
  | 'UI/UX Design'
  | 'Academic Projects'
  | 'Software Development'
  | 'Experiments';

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  shortDescription: string;
  overview: string;
  problemStatement: string;
  objectives: string[];
  features: string[];
  technologies: string[];
  developmentProcess: string;
  challengesAndSolutions: string;
  thumbnailUrl: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  updatedAt?: string;
}

export type BlogCategory =
  | 'Programming'
  | 'Technology'
  | 'AI'
  | 'Web Development'
  | 'Student Life'
  | 'Tutorials';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  content: string;
  readingTimeMin: number;
  publishedAt: string;
  published: boolean;
  featured: boolean;
}

export interface LearningResource {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  readingTimeMin: number;
  summary: string;
  content: string;
  keyTakeaways: string[];
  roadmapId?: string;
}

export interface RoadmapStep {
  title: string;
  topics: string[];
  done?: boolean;
}

export interface LearningRoadmap {
  id: string;
  title: string;
  subtitle: string;
  steps: RoadmapStep[];
}

export interface QuizQuestion {
  id: string;
  topic:
    | 'Programming'
    | 'Database'
    | 'Networking'
    | 'Web Development'
    | 'Computer Science Fundamentals';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  category:
    | 'HTML Templates'
    | 'CSS Components'
    | 'JavaScript Functions'
    | 'Python Examples'
    | 'PHP Examples'
    | 'SQL Queries';
  language: string;
  description: string;
  code: string;
}

export interface SkillItem {
  name: string;
  category: string;
  confirmed: boolean;
}

export interface EducationInfo {
  universityName: string;
  major: string;
  enrollmentYear: string;
  activities: string[];
  courses: string[];
}

export interface ProfileData {
  name: string;
  tagline: string;
  subtitle: string;
  bio: string;
  aboutIntro: string;
  interests: string[];
  journeyMilestones: { phase: string; title: string; detail: string }[];
  goals: string[];
  education: EducationInfo;
  skills: SkillItem[];
  contact: {
    email: string;
    github: string;
    linkedin: string;
    instagram: string;
  };
}

export type AIMode = 'tutor' | 'coding';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  mode: AIMode;
}

export interface AIConversation {
  id: string;
  title: string;
  mode: AIMode;
  language: 'auto' | 'en' | 'id';
  messages: AIMessage[];
  updatedAt: string;
}

export interface AIConfig {
  dailyLimit: number;
  maxInputLength: number;
  modelName: string;
  customSystemAddon: string;
}

export interface UsageStats {
  totalRequests: number;
  totalConversations: number;
  sessionRemaining: number;
  dailyLimit: number;
  recentErrors: { timestamp: string; message: string }[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
