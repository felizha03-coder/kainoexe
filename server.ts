import 'dotenv/config';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { AuthRequest, requireAdmin } from './src/middleware/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;
const STORE_PATH = path.join(__dirname, '.niel-server-store.json');

interface ServerAIConfig {
  dailyLimit: number;
  maxInputLength: number;
  modelName: string;
  customSystemAddon: string;
}

interface SessionUsageRecord {
  dateKey: string;
  count: number;
  conversationIds: string[];
}

interface ServerStore {
  aiConfig: ServerAIConfig;
  totalAiRequests: number;
  sessions: Record<string, SessionUsageRecord>;
  recentErrors: { timestamp: string; message: string }[];
  contactMessages: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
  }[];
}

const ALLOWED_MODELS = new Set([
  'gemini-4-hydrogen',
  'gemini-3.1-flash-lite',
]);

const DEFAULT_STORE: ServerStore = {
  aiConfig: {
    dailyLimit: Number(process.env.AI_DAILY_LIMIT_PER_SESSION) || 30,
    maxInputLength: Number(process.env.AI_MAX_INPUT_LENGTH) || 2000,
    modelName: 'gemini-4-hydrogen',
    customSystemAddon: '',
  },
  totalAiRequests: 0,
  sessions: {},
  recentErrors: [],
  contactMessages: [],
};

const ipBurstTracker = new Map<string, number[]>();

function loadStore(): ServerStore {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8')) as Partial<ServerStore>;
      return {
        aiConfig: { ...DEFAULT_STORE.aiConfig, ...(parsed.aiConfig || {}) },
        totalAiRequests: parsed.totalAiRequests || 0,
        sessions: parsed.sessions || {},
        recentErrors: parsed.recentErrors || [],
        contactMessages: parsed.contactMessages || [],
      };
    }
  } catch {
    // Fallback cleanly to default in-memory store
  }
  return structuredClone(DEFAULT_STORE);
}

function saveStore(store: ServerStore): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch {
    // Ignore disk write error in read-only sandboxes
  }
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildSystemInstruction(
  mode: 'tutor' | 'coding',
  language: 'auto' | 'en' | 'id',
  customAddon: string
): string {
  const baseInstruction = `You are Niel AI, a helpful AI tutor and coding assistant specializing in Information Technology, Informatics Engineering, programming, and software development.

Your purpose is to help visitors understand technical concepts, learn programming, solve coding problems, and improve their development skills.

Always adapt your response to the user's language and knowledge level.

Explain difficult topics using simple language, practical examples, and structured explanations.

When generating code, provide readable, organized, and maintainable code.

When debugging, explain the possible cause of the error and suggest a solution.

Never invent technical facts. Acknowledge uncertainty when necessary.

Prioritize educational value and help users understand the reasoning behind solutions rather than simply providing answers.`;

  const modeAddon =
    mode === 'tutor'
      ? `\n\nACTIVE MODE: AI TUTOR MODE.
Follow this clear educational structure whenever teaching a concept:
1. Simple explanation
2. Detailed explanation
3. Practical example
4. Important points
5. Optional short practice question`
      : `\n\nACTIVE MODE: AI CODING ASSISTANT MODE.
Focus on generating clean, well-structured, syntax-highlighted code blocks, explaining how the code works, listing example inputs/outputs or dependencies when needed, and identifying root causes when debugging. Never claim untested generated code is guaranteed bug-free.`;

  const languageAddon =
    language === 'id'
      ? `\n\nLANGUAGE REQUIREMENT: Respond in natural, clear Bahasa Indonesia while keeping standard technical terms (API, framework, database, debugging, algorithm, frontend, backend).`
      : language === 'en'
      ? `\n\nLANGUAGE REQUIREMENT: Respond in clear, friendly English.`
      : `\n\nBILINGUAL AUTO-DETECTION: Detect the user's language automatically. If the user writes in Bahasa Indonesia, answer in Bahasa Indonesia (keeping standard technical IT terms). If in English, answer in English.`;

  const extra = customAddon.trim() ? `\n\nADMIN CUSTOM INSTRUCTION:\n${customAddon.trim()}` : '';
  return `${baseInstruction}${modeAddon}${languageAddon}${extra}`;
}

function getGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, app: 'NIEL.', timestamp: new Date().toISOString() });
  });

  app.post('/api/session/anonymous', (_req, res) => {
    const sessionId = crypto.randomUUID();
    res.json({ sessionId });
  });

  app.get('/api/ai/status', (req, res) => {
    const sessionId = String(req.headers['x-session-id'] || req.query.sessionId || 'anon');
    const store = loadStore();
    const today = todayKey();
    const rec = store.sessions[sessionId];
    const usedToday = rec && rec.dateKey === today ? rec.count : 0;

    res.json({
      dailyLimit: store.aiConfig.dailyLimit,
      usedToday,
      remaining: Math.max(0, store.aiConfig.dailyLimit - usedToday),
      maxInputLength: store.aiConfig.maxInputLength,
      modelName: store.aiConfig.modelName,
      configured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  app.post('/api/ai/stream', async (req, res) => {
    const store = loadStore();
    const sessionId = String(req.headers['x-session-id'] || req.body?.sessionId || '').trim();
    const clientIp =
      String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'local')
        .split(',')[0]
        .trim();

    if (!sessionId || sessionId.length < 8 || sessionId.length > 128) {
      return res.status(400).json({ error: 'Valid anonymous session identifier required.' });
    }

    // Per-IP burst rate limiting (12 requests per 60 seconds)
    const now = Date.now();
    const recentTimestamps = (ipBurstTracker.get(clientIp) || []).filter(
      (t) => now - t < 60_000
    );
    if (recentTimestamps.length >= 12) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please wait a minute before sending more requests.',
      });
    }
    recentTimestamps.push(now);
    ipBurstTracker.set(clientIp, recentTimestamps);

    // Per-session daily quota check
    const today = todayKey();
    const existingSession = store.sessions[sessionId];
    const usedToday =
      existingSession && existingSession.dateKey === today ? existingSession.count : 0;

    if (usedToday >= store.aiConfig.dailyLimit) {
      return res.status(429).json({
        error: `Daily limit reached (${store.aiConfig.dailyLimit} messages per session). Your quota resets tomorrow!`,
      });
    }

    const {
      message,
      history = [],
      mode = 'tutor',
      language = 'auto',
      conversationId = 'default',
    } = req.body || {};

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    if (message.length > store.aiConfig.maxInputLength) {
      return res.status(400).json({
        error: `Message exceeds maximum length of ${store.aiConfig.maxInputLength} characters.`,
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error:
          'Niel AI requires GEMINI_API_KEY configured on the server (Settings > Secrets).',
      });
    }

    const safeMode: 'tutor' | 'coding' = mode === 'coding' ? 'coding' : 'tutor';
    const safeLang: 'auto' | 'en' | 'id' =
      language === 'en' || language === 'id' ? language : 'auto';
    const safeModel = ALLOWED_MODELS.has(store.aiConfig.modelName)
      ? store.aiConfig.modelName
      : 'gemini-4-hydrogen';

    // Update usage counters before upstream request
    const convSet = new Set(existingSession?.conversationIds || []);
    if (typeof conversationId === 'string' && conversationId) {
      convSet.add(conversationId);
    }
    store.sessions[sessionId] = {
      dateKey: today,
      count: usedToday + 1,
      conversationIds: Array.from(convSet).slice(-50),
    };
    store.totalAiRequests += 1;
    saveStore(store);

    // Format bounded conversation history
    const normalizedHistory = Array.isArray(history)
      ? history
          .slice(-10)
          .filter(
            (m) =>
              m &&
              (m.role === 'user' || m.role === 'assistant') &&
              typeof m.content === 'string'
          )
          .map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content.slice(0, 4000) }],
          }))
      : [];

    const contents = [
      ...normalizedHistory,
      { role: 'user', parts: [{ text: message.trim() }] },
    ];

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    try {
      const ai = getGeminiClient();
      const stream = await ai.models.generateContentStream({
        model: safeModel,
        contents,
        config: {
          systemInstruction: buildSystemInstruction(
            safeMode,
            safeLang,
            store.aiConfig.customSystemAddon
          ),
        },
      });

      for await (const chunk of stream) {
        const textChunk = chunk.text || '';
        if (textChunk) {
          res.write(`data: ${JSON.stringify({ chunk: textChunk })}\n\n`);
        }
      }

      res.write(
        `data: ${JSON.stringify({
          done: true,
          remaining: Math.max(0, store.aiConfig.dailyLimit - (usedToday + 1)),
        })}\n\n`
      );
      res.end();
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Upstream AI error';
      console.error('Gemini API stream error:', errMsg);
      const latestStore = loadStore();
      latestStore.recentErrors = [
        { timestamp: new Date().toISOString(), message: errMsg },
        ...latestStore.recentErrors,
      ].slice(0, 20);
      saveStore(latestStore);

      res.write(`data: ${JSON.stringify({ error: errMsg })}\n\n`);
      res.end();
    }
  });

  app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body || {};
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof subject !== 'string' ||
      typeof message !== 'string'
    ) {
      return res.status(400).json({ error: 'All contact form fields are required.' });
    }
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (!cleanName || cleanName.length > 120) {
      return res.status(400).json({ error: 'Please provide a valid name (max 120 chars).' });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cleanEmail) || cleanEmail.length > 180) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (!cleanSubject || cleanSubject.length > 200) {
      return res.status(400).json({ error: 'Please provide a subject (max 200 chars).' });
    }
    if (!cleanMessage || cleanMessage.length > 4000) {
      return res.status(400).json({ error: 'Please provide a message (max 4000 chars).' });
    }

    const store = loadStore();
    const entry = {
      id: `msg-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
    };
    store.contactMessages = [entry, ...store.contactMessages].slice(0, 100);
    saveStore(store);

    res.status(201).json({ ok: true, submission: entry });
  });

  app.get('/api/admin/stats', requireAdmin, (req: AuthRequest, res) => {
    const store = loadStore();
    const totalConversations = Object.values(store.sessions).reduce(
      (sum, s) => sum + (s.conversationIds?.length || 0),
      0
    );

    res.json({
      totalRequests: store.totalAiRequests,
      totalConversations,
      activeSessions: Object.keys(store.sessions).length,
      aiConfig: store.aiConfig,
      recentErrors: store.recentErrors,
      contactMessages: store.contactMessages,
      adminEmail: req.user?.email || null,
    });
  });

  app.put('/api/admin/ai-config', requireAdmin, (req: AuthRequest, res) => {
    const { dailyLimit, maxInputLength, modelName, customSystemAddon } = req.body || {};
    const store = loadStore();

    if (typeof dailyLimit === 'number' && dailyLimit >= 1 && dailyLimit <= 500) {
      store.aiConfig.dailyLimit = Math.round(dailyLimit);
    }
    if (
      typeof maxInputLength === 'number' &&
      maxInputLength >= 100 &&
      maxInputLength <= 8000
    ) {
      store.aiConfig.maxInputLength = Math.round(maxInputLength);
    }
    if (typeof modelName === 'string' && ALLOWED_MODELS.has(modelName)) {
      store.aiConfig.modelName = modelName;
    }
    if (typeof customSystemAddon === 'string') {
      store.aiConfig.customSystemAddon = customSystemAddon.slice(0, 2000);
    }

    saveStore(store);
    res.json({ ok: true, aiConfig: store.aiConfig });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NIEL. server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
