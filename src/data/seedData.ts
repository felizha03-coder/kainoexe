import {
  BlogPost,
  CodeSnippet,
  LearningResource,
  LearningRoadmap,
  ProfileData,
  Project,
  QuizQuestion,
} from '../types/niel';

export const MASCOT_HERO_IMAGE = '/src/assets/images/niel_mascot_hero_1794896483808.jpg';

export const DEFAULT_PROFILE: ProfileData = {
  name: 'NIEL.',
  tagline: 'CREATE. CODE. INNOVATE.',
  subtitle: 'INFORMATICS ENGINEERING STUDENT',
  bio: 'A curious Informatics Engineering student exploring technology, building digital experiences, and turning ideas into meaningful creations.',
  aboutIntro:
    "Hi! I'm Niel, an Informatics Engineering student who enjoys exploring technology, programming, and digital creativity.\n\nI'm interested in understanding how software works, developing useful applications, and creating digital solutions.\n\nI enjoy learning new technologies, experimenting with ideas, and continuously improving my development skills.",
  interests: [
    'Full-Stack Web Engineering',
    'Applied Artificial Intelligence',
    'Developer Tools & Playgrounds',
    'Clean UI/UX Architecture',
    'Algorithms & Problem Solving',
  ],
  journeyMilestones: [
    {
      phase: '01. Foundations',
      title: 'Algorithmic Thinking & Core Syntax',
      detail:
        'Started with structured logic, flowcharts, C/Python fundamentals, and solving classic computational problems.',
    },
    {
      phase: '02. Web Craft',
      title: 'Interactive Frontend & Databases',
      detail:
        'Built responsive interfaces using HTML, CSS, JavaScript, React, and relational/document data models.',
    },
    {
      phase: '03. Full-Stack & AI',
      title: 'Connecting Servers, APIs & AI',
      detail:
        'Designing integrated applications combining Express APIs, cloud persistence, sandboxes, and LLM-powered workflows.',
    },
  ],
  goals: [
    'Build open, practical tools that help fellow IT students learn faster.',
    'Deepen understanding of distributed systems, clean architecture, and security.',
    'Collaborate on real-world software products from ideation to deployment.',
  ],
  education: {
    universityName: 'Your University Name (Editable in Admin)',
    major: 'Informatics Engineering',
    enrollmentYear: 'Editable Enrollment Year',
    activities: [
      'Student coding experiments & peer study sessions (editable)',
      'Building portfolio & academic software prototypes (editable)',
    ],
    courses: [
      'Algorithms & Data Structures',
      'Database Management Systems',
      'Web Programming',
      'Computer Networks',
      'Operating Systems',
      'Software Engineering',
    ],
  },
  skills: [
    { name: 'HTML', category: 'Frontend', confirmed: false },
    { name: 'CSS', category: 'Frontend', confirmed: false },
    { name: 'JavaScript', category: 'Language', confirmed: false },
    { name: 'Python', category: 'Language', confirmed: false },
    { name: 'PHP', category: 'Backend', confirmed: false },
    { name: 'Java', category: 'Language', confirmed: false },
    { name: 'React', category: 'Framework', confirmed: false },
    { name: 'MySQL', category: 'Database', confirmed: false },
    { name: 'Git', category: 'Tools', confirmed: false },
    { name: 'GitHub', category: 'Tools', confirmed: false },
    { name: 'Figma', category: 'Design', confirmed: false },
  ],
  contact: {
    email: 'niel.dev@example.com',
    github: 'https://github.com/your-handle',
    linkedin: 'https://linkedin.com/in/your-handle',
    instagram: 'https://instagram.com/your-handle',
  },
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-portfolio',
    slug: 'niel-personal-portfolio-platform',
    title: 'Personal Portfolio Website',
    category: 'Web Development',
    shortDescription:
      'A dark-mode developer ecosystem combining personal portfolio showcases, interactive code sandboxes, and AI workflows.',
    overview:
      'Designed as an expressive digital home for an Informatics Engineering student, unifying project storytelling, interactive playgrounds, and study resources in one cohesive platform.',
    problemStatement:
      'Standard static portfolio pages rarely demonstrate real engineering workflows, live interactivity, or active technical thinking.',
    objectives: [
      'Deliver fast multi-page navigation with bold visual identity.',
      'Integrate live coding sandboxes and an AI tutor directly inside the site.',
      'Enable full content editing through a protected admin dashboard.',
    ],
    features: [
      'Responsive dark/light dual theme with zero contrast breaks',
      'Dynamic project detail pages and category filtering',
      'Protected admin management backed by cloud persistence',
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Express', 'Framer Motion'],
    developmentProcess:
      'Structured modularly with a clear separation between public presentation routes, sandboxed execution frames, and server-side API endpoints.',
    challengesAndSolutions:
      'Solved theme switching consistency across nested editor panels by pairing CSS semantic variables with Tailwind v4 custom dark variants.',
    thumbnailUrl: '/src/assets/images/project_portfolio_thumb_1794896484418.jpg',
    githubUrl: 'https://github.com/your-handle/niel-portfolio',
    liveUrl: '#home',
    featured: true,
    updatedAt: '2026-09-01',
  },
  {
    id: 'proj-student-mgmt',
    slug: 'student-management-system',
    title: 'Student Management System',
    category: 'Academic Projects',
    shortDescription:
      'Structured academic portal prototype for tracking course schedules, attendance logs, and student records.',
    overview:
      'An academic administration concept built to organize semester courses, student enrollment records, and study milestones cleanly.',
    problemStatement:
      'Course schedules and task deadlines are often scattered across spreadsheets and messaging threads.',
    objectives: [
      'Centralize student profiles, courses, and schedule lookups.',
      'Provide clean filtering and fast record updates.',
    ],
    features: [
      'Structured student directory & course assignment views',
      'Validation-guarded CRUD workflows',
      'Export-ready schedule summaries',
    ],
    technologies: ['React', 'PHP', 'MySQL', 'Tailwind CSS'],
    developmentProcess:
      'Modeled normalized entities for students, courses, and enrollments before building the responsive dashboard UI.',
    challengesAndSolutions:
      'Reduced schedule lookup friction by indexing courses by day and time slot with instant search.',
    thumbnailUrl: '/src/assets/images/project_student_sys_thumb_1794896485473.jpg',
    githubUrl: 'https://github.com/your-handle/student-management-system',
    liveUrl: '#projects',
    featured: true,
    updatedAt: '2026-08-18',
  },
  {
    id: 'proj-digital-library',
    slug: 'digital-library-platform',
    title: 'Digital Library',
    category: 'Software Development',
    shortDescription:
      'Searchable catalog application for discovering technical books, computing papers, and reading collections.',
    overview:
      'A clean catalog system helping students index, search, and bookmark technical reading materials across computer science subjects.',
    problemStatement:
      'Finding curated study references across programming and networking courses takes unnecessary searching time.',
    objectives: [
      'Support fast keyword and topic search.',
      'Organize reading collections with clean status tracking.',
    ],
    features: [
      'Instant title, author, and subject search',
      'Curated reading lists and bookmark states',
      'Detail drawers with metadata summaries',
    ],
    technologies: ['JavaScript', 'HTML', 'CSS', 'MySQL', 'Node.js'],
    developmentProcess:
      'Started with entity schema modeling and built keyboard-friendly search filters for quick lookup.',
    challengesAndSolutions:
      'Improved search relevance by matching normalized keywords across titles, authors, and topic tags.',
    thumbnailUrl: '/src/assets/images/project_library_thumb_1794896486171.jpg',
    githubUrl: 'https://github.com/your-handle/digital-library',
    liveUrl: '#learning',
    featured: true,
    updatedAt: '2026-08-05',
  },
  {
    id: 'proj-web-sandbox',
    slug: 'interactive-web-playground',
    title: 'Web Application Playground',
    category: 'UI/UX Design',
    shortDescription:
      'Browser-isolated HTML, CSS, and JavaScript experiment environment with live rendering and console capture.',
    overview:
      'A lightweight frontend experiment studio built for rapid UI prototyping without leaving the browser.',
    problemStatement:
      'Testing small CSS layouts or JavaScript DOM behaviors often requires spinning up separate local folders.',
    objectives: [
      'Run frontend experiments inside a sandboxed iframe safely.',
      'Capture runtime console logs and errors cleanly.',
    ],
    features: [
      'Split-pane live HTML/CSS/JS editor',
      'Sandboxed iframe execution with zero host leakage',
      'One-click reset and snippet copy',
    ],
    technologies: ['TypeScript', 'React', 'HTML', 'CSS'],
    developmentProcess:
      'Designed strict iframe sandbox attributes and postMessage listeners to surface runtime errors gracefully.',
    challengesAndSolutions:
      'Isolated script execution inside `sandbox="allow-scripts"` srcdoc frames so user code never accesses parent state.',
    thumbnailUrl: '/src/assets/images/project_portfolio_thumb_1794896484418.jpg',
    githubUrl: 'https://github.com/your-handle/web-playground',
    liveUrl: '#playground',
    featured: false,
    updatedAt: '2026-07-22',
  },
  {
    id: 'proj-niel-ai',
    slug: 'niel-ai-assistant-project',
    title: 'AI Assistant Project',
    category: 'Experiments',
    shortDescription:
      'Bilingual AI Tutor and Coding Assistant powered by server-side Gemini integration with coding workspace.',
    overview:
      'An educational companion built to help Informatics students understand complex CS topics and inspect code examples in Indonesian or English.',
    problemStatement:
      'Beginners often get raw code snippets from generic chatbots without clear explanations of why the solution works.',
    objectives: [
      'Separate AI Tutor mode from Coding Assistant mode.',
      'Enforce server-side rate limiting and anonymous session persistence.',
    ],
    features: [
      'Bilingual Indonesian & English auto-detection',
      'Streaming responses with syntax-highlighted code blocks',
      'Integrated Coding Workspace with live frontend preview',
    ],
    technologies: ['React', 'Express', 'Gemini API', 'TypeScript'],
    developmentProcess:
      'Built dedicated Express endpoints that enforce input length caps, session rate limits, and structured system instructions.',
    challengesAndSolutions:
      'Used Server-Sent Events (SSE) for responsive streaming while keeping API keys strictly on the backend.',
    thumbnailUrl: '/src/assets/images/project_ai_companion_thumb_1794896485897.jpg',
    githubUrl: 'https://github.com/your-handle/niel-ai',
    liveUrl: '#ai',
    featured: true,
    updatedAt: '2026-09-10',
  },
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'how-i-approach-learning-algorithms',
    title: 'How I Approach Learning Algorithms Without Memorizing Code',
    category: 'Programming',
    excerpt:
      'Why tracing state transitions on paper beats memorizing syntax when tackling sorting, trees, and recursion.',
    content: `Learning data structures and algorithms can feel overwhelming if you try to memorize dozens of implementations line by line.

### 1. Trace the State Visually First
Before writing a single loop, draw an array of five elements and walk through one iteration step by step. Notice what invariant stays true after each step.

### 2. Separate Strategy from Syntax
Whether you write Python, Java, or TypeScript, binary search always answers the same question: can we safely discard half of the search space?

### 3. Build Small Mental Checkpoints
Ask yourself three questions before running code:
- What is the base case or termination condition?
- Does the search space shrink on every iteration?
- What happens on empty or single-item input?`,
    readingTimeMin: 4,
    publishedAt: '2026-09-12',
    published: true,
    featured: true,
  },
  {
    id: 'blog-2',
    slug: 'building-safe-code-playgrounds-in-browser',
    title: 'Designing Safe Frontend Code Playgrounds Using Sandboxed Iframes',
    category: 'Web Development',
    excerpt:
      'Understanding how iframe sandboxing lets visitors test HTML, CSS, and JavaScript without compromising the host app.',
    content: `Interactive playgrounds make technical blogs and learning hubs dramatically more engaging. However, running user-typed JavaScript directly inside your main React tree can leak cookies or crash the page.

### Why Sandboxed Iframes Matter
Using \`sandbox="allow-scripts"\` without \`allow-same-origin\` gives preview code its own isolated origin. It cannot inspect the parent window DOM or read host storage.

### Capturing Console Output Cleanly
Injecting a lightweight \`window.postMessage\` bridge inside the iframe template forwards \`console.log\` and uncaught errors directly back to the UI output console.`,
    readingTimeMin: 5,
    publishedAt: '2026-09-04',
    published: true,
    featured: false,
  },
  {
    id: 'blog-3',
    slug: 'why-ai-tutors-need-structured-explanations',
    title: 'Why Good AI Tutors Explain the Reasoning Before Giving Code',
    category: 'AI',
    excerpt:
      'Lessons from designing Niel AI to act like a patient Informatics study partner instead of a copy-paste machine.',
    content: `As students, getting an instant code dump might clear an immediate bug, but it rarely builds intuition for the next problem.

### Designing Educational System Instructions
In Niel AI's Tutor Mode, responses follow a predictable structure:
1. Plain-language intuition
2. Technical breakdown
3. Concrete runnable example
4. Key pitfalls to watch out for

That small structure makes complex topics like TCP handshakes, SQL joins, or React hooks far easier to absorb.`,
    readingTimeMin: 4,
    publishedAt: '2026-08-29',
    published: true,
    featured: false,
  },
  {
    id: 'blog-4',
    slug: 'balancing-university-courses-and-side-projects',
    title: 'Balancing Informatics Coursework with Creative Side Projects',
    category: 'Student Life',
    excerpt:
      'Turning theory from Databases and Operating Systems lectures into small weekend prototypes that actually stick.',
    content: `One of the fastest ways to enjoy Informatics Engineering is connecting classroom theory directly to small projects you genuinely want to build.

When studying SQL normalization in Database Systems, try designing a miniature catalog schema for something you care about—like a music tracker or digital library. Theory clicks immediately once you hit real edge cases.`,
    readingTimeMin: 3,
    publishedAt: '2026-08-14',
    published: true,
    featured: false,
  },
  {
    id: 'blog-5',
    slug: 'sql-joins-explained-visually',
    title: 'SQL Joins Explained with Clear Everyday Examples',
    category: 'Tutorials',
    excerpt:
      'A practical visual refresher on INNER JOIN, LEFT JOIN, and foreign-key relationships for student projects.',
    content: `Relational databases shine when tables stay focused on one entity each and connect cleanly through foreign keys.

### INNER JOIN vs LEFT JOIN
- **INNER JOIN** returns only rows that have matching keys in both tables.
- **LEFT JOIN** keeps every row from the left table, even when no matching child row exists yet (filling missing columns with \`NULL\`).

Always double-check your \`ON\` condition so you don't accidentally create a Cartesian product!`,
    readingTimeMin: 4,
    publishedAt: '2026-08-02',
    published: true,
    featured: false,
  },
  {
    id: 'blog-6',
    slug: 'developer-tooling-habits-that-save-hours',
    title: 'Small Git & Debugging Habits That Save Hours Every Week',
    category: 'Technology',
    excerpt:
      'Meaningful commits, reading stack traces from top to bottom, and isolating reproducible cases.',
    content: `Productivity in software engineering rarely comes from typing faster—it comes from reducing wasted cycles while debugging.

Keep commits focused, inspect network payloads before guessing UI bugs, and write down what changed right before something broke.`,
    readingTimeMin: 3,
    publishedAt: '2026-07-21',
    published: true,
    featured: false,
  },
];

export const LEARNING_CATEGORIES = [
  'Programming Fundamentals',
  'Web Development',
  'Database Management',
  'Computer Networks',
  'Data Structures & Algorithms',
  'Software Engineering',
  'Artificial Intelligence',
  'Cybersecurity Fundamentals',
];

export const INITIAL_LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'learn-1',
    title: 'Variables, Control Flow & Functions Clearly Explained',
    category: 'Programming Fundamentals',
    level: 'Beginner',
    readingTimeMin: 6,
    summary:
      'Build a rock-solid mental model of memory binding, conditionals, loops, and reusable pure functions.',
    content: `Every program transforms input data through structured decisions and repetition.

### Core Building Blocks
- **Variables**: Named references pointing to values in memory. Prefer \`const\` unless reassignment is genuinely required.
- **Conditionals**: Branch execution cleanly while avoiding deeply nested \`if/else\` pyramids via early returns.
- **Functions**: Break complex logic into small single-purpose blocks with clear parameters and return types.`,
    keyTakeaways: [
      'Use descriptive names that communicate intent.',
      'Prefer early returns to keep logic flat and readable.',
      'Test edge inputs like 0, empty strings, and empty arrays.',
    ],
    roadmapId: 'roadmap-python',
  },
  {
    id: 'learn-2',
    title: 'Modern Semantic HTML, CSS Grid & React State',
    category: 'Web Development',
    level: 'Beginner',
    readingTimeMin: 8,
    summary:
      'Understand how browsers parse the DOM, compose two-dimensional layouts, and synchronize UI with React state.',
    content: `Great web applications start with semantic markup (\`<header>\`, \`<main>\`, \`<nav>\`, \`<article>\`) before styling or JavaScript behavior.

### Layout & State Tips
- Use CSS Flexbox for 1D alignment and CSS Grid for 2D page structures.
- Keep React state minimal: derive filtered lists or totals during render instead of duplicating state.`,
    keyTakeaways: [
      'Semantic HTML boosts both accessibility and SEO.',
      'Derive computed values instead of storing redundant state.',
      'Always manage async loading and error boundaries.',
    ],
    roadmapId: 'roadmap-frontend',
  },
  {
    id: 'learn-3',
    title: 'Normalization, Indexing & Foreign Keys in Relational DBs',
    category: 'Database Management',
    level: 'Intermediate',
    readingTimeMin: 7,
    summary:
      'Design clean schemas up to 3NF, prevent redundant updates, and speed up lookups with B-tree indexes.',
    content: `Good database design protects data integrity before a single frontend form is rendered.

### Three Key Principles
1. **First Normal Form (1NF)**: Atomic column values—avoid comma-separated lists inside one cell.
2. **Primary & Foreign Keys**: Enforce valid relationships between parent and child records.
3. **Indexes**: Index columns frequently used in \`WHERE\`, \`JOIN\`, and \`ORDER BY\` clauses.`,
    keyTakeaways: [
      'Normalize first, denormalize only with measured read bottlenecks.',
      'Validate constraints both on server APIs and at the database layer.',
    ],
    roadmapId: 'roadmap-database',
  },
  {
    id: 'learn-4',
    title: 'HTTP, DNS, TCP/IP & How Web Requests Travel',
    category: 'Computer Networks',
    level: 'Beginner',
    readingTimeMin: 6,
    summary:
      'Follow a single browser request from DNS resolution and TCP/TLS handshake to REST JSON responses.',
    content: `When you visit a URL or call \`fetch('/api/ai')\`, several network layers coordinate seamlessly:

1. **DNS Lookup**: Translates the domain name into an IP address.
2. **TCP + TLS Handshake**: Establishes a reliable, encrypted transport channel.
3. **HTTP Request / Response**: Sends method, headers, and JSON body; receives status code (\`200\`, \`400\`, \`401\`, \`500\`) and payload.`,
    keyTakeaways: [
      'Understand HTTP status code families (2xx, 4xx, 5xx).',
      'Inspect browser DevTools Network tab to diagnose API issues quickly.',
    ],
    roadmapId: 'roadmap-backend',
  },
  {
    id: 'learn-5',
    title: 'Big-O Complexity, Hash Maps & Trees',
    category: 'Data Structures & Algorithms',
    level: 'Intermediate',
    readingTimeMin: 9,
    summary:
      'Compare O(1), O(log n), O(n), and O(n log n) growth and pick the right structure for each task.',
    content: `Choosing the right data structure often turns an \`O(n²)\` bottleneck into an instant \`O(n)\` pass.

- **Arrays**: Fast indexed reads \`O(1)\`, linear search \`O(n)\`.
- **Hash Maps / Sets**: Average \`O(1)\` lookups and deduplication.
- **Trees & Graphs**: Represent hierarchies, DOM nodes, routes, and dependency networks.`,
    keyTakeaways: [
      'Big-O measures how operations scale as input size grows.',
      'Replace nested search loops with a Set or Map whenever possible.',
    ],
    roadmapId: 'roadmap-fullstack',
  },
  {
    id: 'learn-6',
    title: 'Modular Architecture, Git Flow & Clean API Contracts',
    category: 'Software Engineering',
    level: 'Intermediate',
    readingTimeMin: 7,
    summary:
      'Organize growing codebases with clear boundaries, typed DTOs, and predictable REST conventions.',
    content: `As applications grow beyond one file, clean boundaries keep features easy to maintain and debug.

Keep UI components focused on presentation, isolate API/database helpers into service modules, and validate incoming payloads at every trust boundary.`,
    keyTakeaways: [
      'Separate UI, domain types, and backend persistence.',
      'Write focused commits and verify TypeScript types before shipping.',
    ],
    roadmapId: 'roadmap-fullstack',
  },
  {
    id: 'learn-7',
    title: 'LLM Prompting, System Instructions & Streaming APIs',
    category: 'Artificial Intelligence',
    level: 'Intermediate',
    readingTimeMin: 7,
    summary:
      'Learn how modern LLM APIs structure system prompts, multi-turn conversation history, and server-side streaming.',
    content: `Building reliable AI applications relies on clear system instructions, server-side secret protection, and thoughtful error states.

### Best Practices
- Always invoke model APIs from a secure backend endpoint rather than exposing secrets in browser bundles.
- Stream responses via Server-Sent Events (SSE) for immediate perceived speed.
- Enforce token/input limits and graceful fallback messages.`,
    keyTakeaways: [
      'Keep API credentials strictly server-side.',
      'Tailor system instructions to guide tone and formatting.',
    ],
  },
  {
    id: 'learn-8',
    title: 'OWASP Basics: XSS, Auth Boundaries & Rate Limiting',
    category: 'Cybersecurity Fundamentals',
    level: 'Beginner',
    readingTimeMin: 6,
    summary:
      'Essential defensive habits for web developers: sanitizing outputs, protecting admin routes, and throttling abuse.',
    content: `Security is not an afterthought—it starts with understanding trust boundaries:

- **Never trust client input**: Validate lengths, types, and formats on the server.
- **Prevent XSS**: Avoid injecting raw untrusted HTML; isolate previews in sandboxed iframes.
- **Protect Admin Endpoints**: Verify signed server tokens rather than trusting client flags.
- **Rate Limit Public APIs**: Protect AI and form endpoints against automated abuse.`,
    keyTakeaways: [
      'Enforce authorization checks on every protected backend route.',
      'Isolate untrusted code previews inside sandboxed iframes.',
    ],
  },
];

export const LEARNING_ROADMAPS: LearningRoadmap[] = [
  {
    id: 'roadmap-frontend',
    title: 'Frontend Developer Roadmap',
    subtitle: 'From semantic markup to reactive TypeScript interfaces',
    steps: [
      { title: 'HTML5 & Accessibility', topics: ['Semantic tags', 'Forms & validation', 'ARIA basics'] },
      { title: 'Modern CSS & Tailwind', topics: ['Flexbox & Grid', 'Responsive breakpoints', 'Design tokens'] },
      { title: 'JavaScript & TypeScript', topics: ['ES6+ modules', 'Async/Await & Fetch', 'Static typing'] },
      { title: 'React Ecosystem', topics: ['Hooks & state flow', 'Routing & performance', 'Testing UI states'] },
    ],
  },
  {
    id: 'roadmap-backend',
    title: 'Backend Developer Roadmap',
    subtitle: 'APIs, authentication, security, and reliable servers',
    steps: [
      { title: 'Node.js & Express', topics: ['REST routing', 'Middleware pipelines', 'Error handling'] },
      { title: 'Authentication & Security', topics: ['Token verification', 'CORS & headers', 'Rate limiting'] },
      { title: 'Databases & Caching', topics: ['SQL vs NoSQL', 'Schema validation', 'Query indexing'] },
      { title: 'Deployment & Monitoring', topics: ['Environment config', 'Health checks', 'Structured logging'] },
    ],
  },
  {
    id: 'roadmap-fullstack',
    title: 'Full Stack Developer Roadmap',
    subtitle: 'Bridging polished UI with scalable backend services',
    steps: [
      { title: 'Shared Domain Types', topics: ['End-to-end TypeScript', 'API contracts'] },
      { title: 'Client + Server Integration', topics: ['Optimistic UI', 'Streaming SSE', 'Pagination'] },
      { title: 'Cloud Persistence & Rules', topics: ['Access policies', 'Input sanitization'] },
      { title: 'CI/CD & Production Polish', topics: ['Build optimization', 'SEO & error boundaries'] },
    ],
  },
  {
    id: 'roadmap-python',
    title: 'Python Developer Roadmap',
    subtitle: 'Clean scripting, data structures, and backend services',
    steps: [
      { title: 'Core Python Syntax', topics: ['List comprehensions', 'Dictionaries & sets', 'Virtualenvs'] },
      { title: 'OOP & Modules', topics: ['Classes & dataclasses', 'Package layout', 'Pytest basics'] },
      { title: 'Data & APIs', topics: ['FastAPI / Flask', 'Working with JSON & files'] },
    ],
  },
  {
    id: 'roadmap-database',
    title: 'Database Learning Roadmap',
    subtitle: 'Modeling, querying, and securing persistent data',
    steps: [
      { title: 'Relational Modeling', topics: ['ER diagrams', '1NF to 3NF', 'Foreign keys'] },
      { title: 'SQL Mastery', topics: ['JOINs & GROUP BY', 'Aggregations', 'Transactions'] },
      { title: 'Cloud Databases & Rules', topics: ['Indexing strategies', 'Least-privilege rules'] },
    ],
  },
];

export const INITIAL_QUIZZES: QuizQuestion[] = [
  {
    id: 'quiz-1',
    topic: 'Programming',
    question: 'What is the average time complexity of looking up a key in a Hash Map?',
    options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
    correctIndex: 0,
    explanation: 'Hash maps compute a bucket index directly from the key hash, giving average O(1) lookup time.',
  },
  {
    id: 'quiz-2',
    topic: 'Database',
    question: 'Which SQL JOIN returns all rows from the left table and matched rows from the right table?',
    options: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'SELF JOIN'],
    correctIndex: 1,
    explanation: 'LEFT JOIN preserves every row from the left table and fills unmatched right columns with NULL.',
  },
  {
    id: 'quiz-3',
    topic: 'Networking',
    question: 'Which HTTP status code indicates the client failed authentication (missing/invalid credentials)?',
    options: ['200 OK', '301 Moved Permanently', '401 Unauthorized', '503 Service Unavailable'],
    correctIndex: 2,
    explanation: '401 Unauthorized signals missing or invalid authentication credentials.',
  },
  {
    id: 'quiz-4',
    topic: 'Web Development',
    question: 'Why should untrusted user HTML/JS previews run inside `<iframe sandbox="allow-scripts">` without `allow-same-origin`?',
    options: [
      'To make CSS animations run at 120fps',
      'To isolate the preview origin so scripts cannot access parent cookies or DOM',
      'To automatically compile TypeScript inside the browser',
      'To connect directly to a PostgreSQL database',
    ],
    correctIndex: 1,
    explanation: 'Omitting `allow-same-origin` forces a unique opaque origin so preview scripts stay strictly isolated.',
  },
  {
    id: 'quiz-5',
    topic: 'Computer Science Fundamentals',
    question: 'Which data structure follows Last-In, First-Out (LIFO) ordering?',
    options: ['Queue', 'Stack', 'Binary Search Tree', 'Linked Hash Set'],
    correctIndex: 1,
    explanation: 'A Stack pushes and pops elements from the top, following LIFO order (used in call stacks).',
  },
];

export const INITIAL_CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'snip-html',
    title: 'Accessible Hero Card Skeleton',
    category: 'HTML Templates',
    language: 'html',
    description: 'Clean semantic article card with descriptive headings and action link.',
    code: `<article class="card">
  <header>
    <p class="meta">Web Development · 2026</p>
    <h2>Interactive Project Title</h2>
  </header>
  <p>Short concise summary explaining what the tool solves.</p>
  <a href="#projects" class="btn">View Details</a>
</article>`,
  },
  {
    id: 'snip-css',
    title: 'Responsive CSS Auto-Fit Bento Grid',
    category: 'CSS Components',
    language: 'css',
    description: 'Fluid multi-column grid that adapts cleanly without extra media queries.',
    code: `.bento-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.bento-card {
  background: #1B1D27;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
}`,
  },
  {
    id: 'snip-js',
    title: 'Debounced Search Helper',
    category: 'JavaScript Functions',
    language: 'javascript',
    description: 'Prevents excessive filtering or API requests while a user is typing.',
    code: `export function debounce(fn, delayMs = 250) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delayMs);
  };
}`,
  },
  {
    id: 'snip-python',
    title: 'Binary Search (Iterative)',
    category: 'Python Examples',
    language: 'python',
    description: 'Clean O(log n) binary search on a sorted Python list.',
    code: `def binary_search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
  },
  {
    id: 'snip-php',
    title: 'Prepared PDO Query Example',
    category: 'PHP Examples',
    language: 'php',
    description: 'Safe parameterized SQL query using PHP PDO to prevent SQL injection.',
    code: `<?php
$stmt = $pdo->prepare('SELECT id, title FROM projects WHERE category = :category');
$stmt->execute(['category' => $category]);
$projects = $stmt->fetchAll(PDO::FETCH_ASSOC);`,
  },
  {
    id: 'snip-sql',
    title: 'Top Categories Query with Aggregation',
    category: 'SQL Queries',
    language: 'sql',
    description: 'Count published articles per category ordered by popularity.',
    code: `SELECT
  category,
  COUNT(*) AS total_posts,
  ROUND(AVG(reading_time_min), 1) AS avg_read_min
FROM blog_posts
WHERE published = TRUE
GROUP BY category
ORDER BY total_posts DESC;`,
  },
];
