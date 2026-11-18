import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Code2,
  Copy,
  Check,
  MessageSquare,
  PanelLeft,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { MASCOT_HERO_IMAGE } from '../data/seedData';
import { AIConversation, AIMessage, AIMode } from '../types/niel';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

const SUGGESTED_CARDS: {
  title: string;
  mode: AIMode;
  prompt: string;
  desc: string;
}[] = [
  {
    title: '1. Learn Something New',
    mode: 'tutor',
    prompt: 'Teach me how REST APIs and HTTP status codes work with a clear simple example.',
    desc: 'Structured beginner-to-intermediate CS lessons.',
  },
  {
    title: '2. Generate Code',
    mode: 'coding',
    prompt: 'Create a responsive HTML, CSS, and JavaScript interactive counter card.',
    desc: 'Clean, modular code ready for the workspace.',
  },
  {
    title: '3. Debug My Code',
    mode: 'coding',
    prompt:
      'Why does `arr.sort()` in JavaScript sort `[10, 2, 1]` as `[1, 10, 2]` and how do I fix it?',
    desc: 'Find root causes and clear bug fixes.',
  },
  {
    title: '4. Explain IT Concepts',
    mode: 'tutor',
    prompt: 'Jelaskan perbedaan SQL dan NoSQL dengan bahasa yang mudah dipahami mahasiswa.',
    desc: 'Bilingual Indonesian & English explanations.',
  },
];

const DEFAULT_WORKSPACE_HTML = `<div class="card">
  <h2>Hello from Niel AI Workspace!</h2>
  <p id="status">Edit HTML, CSS, or JS and click Run.</p>
  <button onclick="boost()">Click Me</button>
</div>`;

const DEFAULT_WORKSPACE_CSS = `body {
  font-family: system-ui, sans-serif;
  background: #08090D;
  color: #ffffff;
  display: grid;
  place-items: center;
  min-height: 90vh;
  margin: 0;
}
.card {
  background: #1B1D27;
  border: 1px solid #791EFF;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
}
button {
  margin-top: 12px;
  background: #C8FF24;
  color: #08090D;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}`;

const DEFAULT_WORKSPACE_JS = `let clicks = 0;
function boost() {
  clicks += 1;
  document.getElementById('status').textContent = 'Clicked ' + clicks + ' times!';
  console.log('Button clicked:', clicks);
}`;

export const AIAssistantPage: React.FC = () => {
  const { anonSessionId, lang: siteLang } = usePlatform();

  const storageKey = `niel_ai_conversations_${anonSessionId}`;
  const [conversations, setConversations] = useState<AIConversation[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch {
      return [];
    }
  });
  const [activeId, setActiveId] = useState<string | null>(
    () => conversations[0]?.id || null
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState<AIMode>('tutor');
  const [aiLang, setAiLang] = useState<'auto' | 'en' | 'id'>('auto');
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const [quota, setQuota] = useState<{
    remaining: number;
    dailyLimit: number;
    maxInputLength: number;
    configured: boolean;
  }>({
    remaining: 30,
    dailyLimit: 30,
    maxInputLength: 2000,
    configured: true,
  });

  // Coding Workspace Drawer/Split State
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [editorLang, setEditorLang] = useState<'web' | 'python' | 'sql' | 'java'>('web');
  const [wsHtml, setWsHtml] = useState(DEFAULT_WORKSPACE_HTML);
  const [wsCss, setWsCss] = useState(DEFAULT_WORKSPACE_CSS);
  const [wsJs, setWsJs] = useState(DEFAULT_WORKSPACE_JS);
  const [wsOtherCode, setWsOtherCode] = useState(
    `def greet(name: str) -> str:\n    return f"Hello, {name}!"\n\nprint(greet("Niel"))`
  );
  const [activeWebTab, setActiveWebTab] = useState<'html' | 'css' | 'js'>('html');
  const [iframeSrcDoc, setIframeSrcDoc] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<{ type: string; text: string }[]>([]);
  const [wsCopied, setWsCopied] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(conversations));
    } catch {
      // ignore storage errors
    }
  }, [conversations, storageKey]);

  useEffect(() => {
    fetch(`/api/ai/status?sessionId=${encodeURIComponent(anonSessionId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.remaining === 'number') {
          setQuota({
            remaining: data.remaining,
            dailyLimit: data.dailyLimit,
            maxInputLength: data.maxInputLength,
            configured: Boolean(data.configured),
          });
        }
      })
      .catch(() => {});
  }, [anonSessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeId, streaming]);

  useEffect(() => {
    const onMsg = (ev: MessageEvent) => {
      if (ev.data && ev.data.source === 'niel-sandbox') {
        setConsoleLogs((prev) => [
          ...prev.slice(-25),
          { type: ev.data.level || 'log', text: String(ev.data.message || '') },
        ]);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const activeConv = conversations.find((c) => c.id === activeId) || null;

  const createNewChat = () => {
    setActiveId(null);
    setError(null);
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (activeId === id) setActiveId(next[0]?.id || null);
      return next;
    });
  };

  const clearAllHistory = () => {
    setConversations([]);
    setActiveId(null);
  };

  const sendMessage = async (textToSend?: string, overrideMode?: AIMode) => {
    const trimmed = (textToSend ?? input).trim();
    if (!trimmed || streaming) return;
    if (trimmed.length > quota.maxInputLength) {
      setError(`Input exceeds maximum length of ${quota.maxInputLength} characters.`);
      return;
    }

    setError(null);
    const usedMode = overrideMode || mode;
    if (overrideMode) setMode(overrideMode);
    if (!textToSend) setInput('');

    let targetConvId = activeId;
    const userMsg: AIMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
      mode: usedMode,
    };
    const assistantMsgId = `a-${Date.now() + 1}`;
    const placeholderAssistant: AIMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      mode: usedMode,
    };

    let priorHistory: { role: string; content: string }[] = [];

    if (!targetConvId) {
      targetConvId = `conv-${Date.now()}`;
      const newConv: AIConversation = {
        id: targetConvId,
        title: trimmed.slice(0, 48) + (trimmed.length > 48 ? '...' : ''),
        mode: usedMode,
        language: aiLang,
        messages: [userMsg, placeholderAssistant],
        updatedAt: new Date().toISOString(),
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(targetConvId);
    } else {
      const existing = conversations.find((c) => c.id === targetConvId);
      priorHistory = (existing?.messages || []).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConvId
            ? {
                ...c,
                mode: usedMode,
                messages: [...c.messages, userMsg, placeholderAssistant],
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    }

    setStreaming(true);

    try {
      const res = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': anonSessionId,
        },
        body: JSON.stringify({
          message: trimmed,
          history: priorHistory,
          mode: usedMode,
          language: aiLang,
          conversationId: targetConvId,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Request failed (${res.status})`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Streaming response unavailable.');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payloadStr = line.slice(6).trim();
          if (!payloadStr) continue;
          const parsed = JSON.parse(payloadStr) as {
            chunk?: string;
            done?: boolean;
            remaining?: number;
            error?: string;
          };
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.chunk) {
            fullText += parsed.chunk;
            setConversations((prev) =>
              prev.map((c) =>
                c.id === targetConvId
                  ? {
                      ...c,
                      messages: c.messages.map((m) =>
                        m.id === assistantMsgId ? { ...m, content: fullText } : m
                      ),
                    }
                  : c
              )
            );
          }
          if (typeof parsed.remaining === 'number') {
            setQuota((q) => ({ ...q, remaining: parsed.remaining! }));
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to Niel AI.';
      setError(msg);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConvId
            ? {
                ...c,
                messages: c.messages.filter(
                  (m) => !(m.id === assistantMsgId && !m.content)
                ),
              }
            : c
        )
      );
    } finally {
      setStreaming(false);
    }
  };

  const regenerateLast = () => {
    if (!activeConv || streaming) return;
    const lastUser = [...activeConv.messages].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    sendMessage(lastUser.content, activeConv.mode);
  };

  const runSandbox = () => {
    setConsoleLogs([]);
    const src = `<!doctype html>
<html>
<head><style>${wsCss}</style></head>
<body>
${wsHtml}
<script>
(function() {
  const send = (level, args) => {
    window.parent.postMessage({
      source: 'niel-sandbox',
      level,
      message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
    }, '*');
  };
  console.log = (...a) => send('log', a);
  console.error = (...a) => send('error', a);
  window.onerror = (msg, _s, line) => send('error', [msg + ' (line ' + line + ')']);
})();
try {
${wsJs}
} catch (err) {
  console.error(err && err.message ? err.message : String(err));
}
</script>
</body>
</html>`;
    setIframeSrcDoc(src);
  };

  const loadCodeInWorkspace = (code: string, language: string) => {
    setWorkspaceOpen(true);
    const low = language.toLowerCase();
    if (low === 'html') {
      setEditorLang('web');
      setWsHtml(code);
      setActiveWebTab('html');
    } else if (low === 'css') {
      setEditorLang('web');
      setWsCss(code);
      setActiveWebTab('css');
    } else if (low === 'js' || low === 'javascript') {
      setEditorLang('web');
      setWsJs(code);
      setActiveWebTab('js');
    } else {
      setEditorLang(low === 'sql' ? 'sql' : low === 'java' ? 'java' : 'python');
      setWsOtherCode(code);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-65px)] flex bg-slate-50 dark:bg-[#08090D] text-slate-900 dark:text-white">
      {/* Left Sidebar: Chat History */}
      {sidebarOpen && (
        <aside className="w-72 shrink-0 bg-white dark:bg-[#151720] border-r border-slate-200 dark:border-white/10 flex flex-col justify-between p-4 max-h-[calc(100vh-65px)] sticky top-16">
          <div className="space-y-4 overflow-y-auto flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#791EFF] dark:text-[#C8FF24]" />
                <span className="font-display font-bold text-base">NIEL AI</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1B1D27] cursor-pointer"
                aria-label="Hide sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={createNewChat}
              className="w-full py-2.5 px-3 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] text-white font-display font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-[#08090D] border border-slate-200 dark:border-white/10 text-xs focus:outline-none focus:border-[#791EFF]"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-mono text-slate-500 dark:text-[#A5A7B2] px-1">
                Recent Conversations
              </p>
              {filteredConversations.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-[#A5A7B2] px-1 py-2">
                  No conversations yet.
                </p>
              ) : (
                filteredConversations.map((c) => (
                  <div
                    key={c.id}
                    className={`group flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs cursor-pointer ${
                      c.id === activeId
                        ? 'bg-[#791EFF]/15 text-[#791EFF] dark:text-[#C8FF24] font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-[#1B1D27] text-slate-700 dark:text-[#A5A7B2]'
                    }`}
                  >
                    <button
                      onClick={() => setActiveId(c.id)}
                      className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{c.title}</span>
                    </button>
                    <button
                      onClick={() => deleteConversation(c.id)}
                      aria-label="Delete conversation"
                      className="opacity-60 hover:opacity-100 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-2.5 text-xs">
            <div className="flex items-center justify-between font-mono text-slate-500 dark:text-[#A5A7B2]">
              <span>Daily Session Quota</span>
              <span className="text-slate-900 dark:text-[#C8FF24] font-semibold tabular-nums">
                {quota.remaining}/{quota.dailyLimit}
              </span>
            </div>
            {conversations.length > 0 && (
              <button
                onClick={clearAllHistory}
                className="w-full py-2 px-3 rounded-lg bg-slate-100 dark:bg-[#1B1D27] hover:bg-rose-500/15 hover:text-rose-500 text-xs font-medium cursor-pointer"
              >
                Clear Chat History
              </button>
            )}
          </div>
        </aside>
      )}

      {/* Main Content Area (Chat + Optional Coding Workspace) */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0">
        {/* Chat Column */}
        <section
          className={`flex-1 flex flex-col min-w-0 ${
            workspaceOpen ? 'lg:w-1/2 border-r border-slate-200 dark:border-white/10' : 'w-full'
          }`}
        >
          {/* Top Utility Toolbar */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#151720]/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 cursor-pointer"
                  aria-label="Open chat history sidebar"
                >
                  <PanelLeft className="w-4 h-4" />
                </button>
              )}
              <div>
                <h1 className="font-display font-bold text-sm sm:text-base">
                  NIEL AI
                </h1>
                <p className="font-mono text-[11px] text-slate-500 dark:text-[#A5A7B2]">
                  YOUR PERSONAL IT LEARNING &amp; CODING COMPANION.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setWorkspaceOpen((w) => !w)}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-semibold inline-flex items-center gap-1.5 cursor-pointer border ${
                  workspaceOpen
                    ? 'bg-[#C8FF24] text-[#08090D] border-[#C8FF24]'
                    : 'bg-slate-100 dark:bg-[#1B1D27] text-slate-800 dark:text-white border-slate-200 dark:border-white/10'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{workspaceOpen ? 'Hide Workspace' : 'Coding Workspace'}</span>
              </button>
            </div>
          </div>

          {/* Error Notification if API Key missing or rate limit hit */}
          {(!quota.configured || error) && (
            <div className="mx-4 mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-xs sm:text-sm text-amber-700 dark:text-amber-300">
              {error ||
                'Server AI key is not configured yet. Add GEMINI_API_KEY in Settings > Secrets to enable live responses.'}
            </div>
          )}

          {/* Messages or Welcome Screen */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
            {!activeConv ? (
              <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-8 text-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#791EFF] dark:border-[#C8FF24] mx-auto bg-[#08090D]">
                  <img
                    src={MASCOT_HERO_IMAGE}
                    alt="Niel AI Mascot"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-2">
                  <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
                    HEY, WHAT ARE WE BUILDING TODAY?
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-[#A5A7B2] max-w-xl mx-auto">
                    {siteLang === 'id'
                      ? 'Ajukan pertanyaan IT, pelajari konsep baru, debug kode, dan eksplorasi teknologi bersama Niel AI.'
                      : 'Ask questions, learn new concepts, solve coding problems, and explore the world of Information Technology with Niel AI.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  {SUGGESTED_CARDS.map((card) => (
                    <button
                      key={card.title}
                      onClick={() => sendMessage(card.prompt, card.mode)}
                      className="p-4 rounded-xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 hover:border-[#791EFF] dark:hover:border-[#C8FF24] transition-colors cursor-pointer space-y-1.5"
                    >
                      <p className="font-display font-bold text-sm text-[#791EFF] dark:text-[#C8FF24]">
                        {card.title}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-[#A5A7B2]">
                        {card.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-5">
                {activeConv.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[92%] sm:max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-[#791EFF] text-white'
                          : 'bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </p>
                      ) : msg.content ? (
                        <MarkdownRenderer
                          content={msg.content}
                          onSendToEditor={loadCodeInWorkspace}
                        />
                      ) : (
                        <span className="text-xs font-mono text-[#35CFFF]">
                          Thinking &amp; writing response...
                        </span>
                      )}
                    </div>

                    {msg.role === 'assistant' && msg.content && !streaming && (
                      <div className="flex items-center gap-3 mt-1.5 px-1 text-xs text-slate-500 dark:text-[#A5A7B2]">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.content).catch(() => {});
                            setCopiedMsgId(msg.id);
                            window.setTimeout(() => setCopiedMsgId(null), 1500);
                          }}
                          className="inline-flex items-center gap-1 hover:text-[#791EFF] dark:hover:text-[#C8FF24] cursor-pointer"
                        >
                          {copiedMsgId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#C8FF24]" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                        <button
                          onClick={regenerateLast}
                          className="inline-flex items-center gap-1 hover:text-[#791EFF] dark:hover:text-[#C8FF24] cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" /> Regenerate
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Bottom Composer */}
          <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#151720]">
            <div className="max-w-3xl mx-auto space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-[#08090D] border border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => setMode('tutor')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      mode === 'tutor'
                        ? 'bg-[#791EFF] text-white'
                        : 'text-slate-600 dark:text-[#A5A7B2]'
                    }`}
                  >
                    AI Tutor
                  </button>
                  <button
                    onClick={() => setMode('coding')}
                    className={`px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      mode === 'coding'
                        ? 'bg-[#C8FF24] text-[#08090D]'
                        : 'text-slate-600 dark:text-[#A5A7B2]'
                    }`}
                  >
                    Coding Assistant
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <select
                    value={aiLang}
                    onChange={(e) =>
                      setAiLang(e.target.value as 'auto' | 'en' | 'id')
                    }
                    aria-label="AI Response Language"
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#08090D] border border-slate-200 dark:border-white/10 text-xs"
                  >
                    <option value="auto">Lang: Auto (ID / EN)</option>
                    <option value="en">English</option>
                    <option value="id">Bahasa Indonesia</option>
                  </select>
                  <span className="text-slate-400 tabular-nums">
                    {input.length}/{quota.maxInputLength}
                  </span>
                </div>
              </div>

              <div className="flex items-end gap-2">
                <textarea
                  rows={2}
                  value={input}
                  maxLength={quota.maxInputLength}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={
                    mode === 'tutor'
                      ? 'Ask Niel AI to explain any IT topic (English or Bahasa Indonesia)...'
                      : 'Ask Niel AI to generate, review, convert, or debug code...'
                  }
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#08090D] border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-[#791EFF] dark:focus:border-[#C8FF24] resize-none"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={streaming || !input.trim()}
                  className="px-4 py-3 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] disabled:opacity-50 text-white font-display font-semibold text-sm inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Optional Coding Workspace Split Panel */}
        {workspaceOpen && (
          <section className="lg:w-1/2 flex flex-col bg-[#0D0F16] text-white min-h-[520px]">
            <div className="px-4 py-3 bg-[#151720] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C8FF24]" />
                <span className="font-display font-bold text-sm">
                  Coding Workspace
                </span>
                <select
                  value={editorLang}
                  onChange={(e) =>
                    setEditorLang(e.target.value as 'web' | 'python' | 'sql' | 'java')
                  }
                  className="px-2 py-1 rounded bg-[#08090D] border border-white/10 text-xs font-mono text-[#35CFFF]"
                >
                  <option value="web">HTML / CSS / JS (Live Sandbox)</option>
                  <option value="python">Python (Draft &amp; AI Review)</option>
                  <option value="sql">SQL (Draft &amp; AI Review)</option>
                  <option value="java">Java (Draft &amp; AI Review)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const codeText =
                      editorLang === 'web'
                        ? activeWebTab === 'html'
                          ? wsHtml
                          : activeWebTab === 'css'
                          ? wsCss
                          : wsJs
                        : wsOtherCode;
                    navigator.clipboard.writeText(codeText).catch(() => {});
                    setWsCopied(true);
                    window.setTimeout(() => setWsCopied(false), 1500);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono inline-flex items-center gap-1 cursor-pointer"
                >
                  {wsCopied ? <Check className="w-3.5 h-3.5 text-[#C8FF24]" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
                <button
                  onClick={() => {
                    setWsHtml(DEFAULT_WORKSPACE_HTML);
                    setWsCss(DEFAULT_WORKSPACE_CSS);
                    setWsJs(DEFAULT_WORKSPACE_JS);
                    setIframeSrcDoc('');
                    setConsoleLogs([]);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
                {editorLang === 'web' && (
                  <button
                    onClick={runSandbox}
                    className="px-3 py-1.5 rounded-lg bg-[#C8FF24] text-[#08090D] font-display font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" /> Run
                  </button>
                )}
              </div>
            </div>

            {editorLang === 'web' ? (
              <div className="flex-1 flex flex-col">
                <div className="flex gap-1 px-4 pt-2 bg-[#151720] border-b border-white/10">
                  {(['html', 'css', 'js'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveWebTab(tab)}
                      className={`px-3 py-1.5 text-xs font-mono uppercase rounded-t-lg cursor-pointer ${
                        activeWebTab === tab
                          ? 'bg-[#0D0F16] text-[#C8FF24] border-t border-x border-white/10'
                          : 'text-[#A5A7B2]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <textarea
                  value={
                    activeWebTab === 'html'
                      ? wsHtml
                      : activeWebTab === 'css'
                      ? wsCss
                      : wsJs
                  }
                  onChange={(e) => {
                    const v = e.target.value;
                    if (activeWebTab === 'html') setWsHtml(v);
                    else if (activeWebTab === 'css') setWsCss(v);
                    else setWsJs(v);
                  }}
                  spellCheck={false}
                  className="w-full h-52 p-4 bg-[#0D0F16] text-slate-100 font-mono text-xs sm:text-sm focus:outline-none resize-y border-b border-white/10"
                />

                <div className="flex-1 grid grid-rows-[1fr_110px]">
                  <div className="bg-white relative min-h-[200px]">
                    {iframeSrcDoc ? (
                      <iframe
                        title="Niel AI Sandbox Output"
                        sandbox="allow-scripts"
                        srcDoc={iframeSrcDoc}
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#08090D] flex items-center justify-center text-xs font-mono text-[#A5A7B2]">
                        Click &ldquo;Run&rdquo; to execute HTML/CSS/JS inside an isolated iframe sandbox.
                      </div>
                    )}
                  </div>
                  <div className="bg-[#08090D] border-t border-white/10 p-3 overflow-y-auto font-mono text-xs space-y-1">
                    <p className="text-[#A5A7B2]">Console Output:</p>
                    {consoleLogs.map((l, i) => (
                      <p
                        key={i}
                        className={
                          l.type === 'error' ? 'text-rose-400' : 'text-[#C8FF24]'
                        }
                      >
                        {l.text}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col p-4 space-y-3">
                <div className="p-3 rounded-xl bg-[#151720] border border-white/10 text-xs text-[#A5A7B2]">
                  Browser sandboxes execute HTML, CSS, and JavaScript directly. For{' '}
                  <strong className="text-white uppercase">{editorLang}</strong>, draft
                  your snippet below and click &ldquo;Ask Niel AI to Review&rdquo; for
                  step-by-step analysis and expected output.
                </div>
                <textarea
                  value={wsOtherCode}
                  onChange={(e) => setWsOtherCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 p-4 rounded-xl bg-[#08090D] border border-white/10 font-mono text-xs sm:text-sm text-slate-100 focus:outline-none"
                />
                <button
                  onClick={() =>
                    sendMessage(
                      `Please review and explain this ${editorLang} code, including expected output:\n\n\`\`\`${editorLang}\n${wsOtherCode}\n\`\`\``,
                      'coding'
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] text-white font-display font-semibold text-xs cursor-pointer self-start"
                >
                  Ask Niel AI to Explain &amp; Review
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
