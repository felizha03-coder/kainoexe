import React, { useEffect, useState } from 'react';
import { Check, Copy, Play, RotateCcw, Terminal } from 'lucide-react';

const STARTER_HTML = `<main class="wrap">
  <h1>NIEL. Code Playground</h1>
  <p id="msg">Experiment with HTML, CSS, and JavaScript safely in an isolated iframe.</p>
  <button id="btn">Run Counter Test</button>
</main>`;

const STARTER_CSS = `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #08090D;
  color: #ffffff;
  font-family: system-ui, sans-serif;
}
.wrap {
  max-width: 440px;
  padding: 28px;
  border-radius: 18px;
  background: #1B1D27;
  border: 1px solid #791EFF;
  text-align: center;
}
h1 { margin-top: 0; color: #C8FF24; font-size: 1.5rem; }
button {
  margin-top: 12px;
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: #35CFFF;
  color: #08090D;
  font-weight: 700;
  cursor: pointer;
}`;

const STARTER_JS = `let count = 0;
const btn = document.getElementById('btn');
const msg = document.getElementById('msg');

btn.addEventListener('click', () => {
  count++;
  msg.textContent = 'Interactive clicks: ' + count;
  console.log('Playground click count =', count);
});`;

export const PlaygroundPage: React.FC = () => {
  const [html, setHtml] = useState(STARTER_HTML);
  const [css, setCss] = useState(STARTER_CSS);
  const [js, setJs] = useState(STARTER_JS);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [srcDoc, setSrcDoc] = useState('');
  const [logs, setLogs] = useState<{ level: string; text: string }[]>([]);
  const [copied, setCopied] = useState(false);

  const runCode = () => {
    setLogs([]);
    const bundle = `<!doctype html>
<html>
<head><style>${css}</style></head>
<body>
${html}
<script>
(function(){
  const post = (level, args) => window.parent.postMessage({
    source: 'niel-playground',
    level,
    text: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
  }, '*');
  console.log = (...a) => post('log', a);
  console.error = (...a) => post('error', a);
  window.onerror = (m, _s, line) => post('error', [m + ' (line ' + line + ')']);
})();
try {
${js}
} catch (err) {
  console.error(err && err.message ? err.message : String(err));
}
</script>
</body>
</html>`;
    setSrcDoc(bundle);
  };

  useEffect(() => {
    runCode();
    const handler = (ev: MessageEvent) => {
      if (ev.data && ev.data.source === 'niel-playground') {
        setLogs((prev) => [...prev.slice(-30), { level: ev.data.level, text: ev.data.text }]);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReset = () => {
    setHtml(STARTER_HTML);
    setCss(STARTER_CSS);
    setJs(STARTER_JS);
    setLogs([]);
  };

  const handleCopyAll = () => {
    const combined = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}\n\n// JS\n${js}`;
    navigator.clipboard.writeText(combined).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#791EFF] dark:text-[#35CFFF]">
            <Terminal className="w-5 h-5" />
            <span className="font-mono text-xs font-semibold">
              ISOLATED IFRAME SANDBOX
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 dark:text-white">
            Developer Code Playground
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyAll}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 text-xs font-mono font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#C8FF24]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 text-xs font-mono font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={runCode}
            className="px-5 py-2 rounded-xl bg-[#C8FF24] hover:bg-[#D5FF57] text-[#08090D] font-display font-bold text-sm inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[560px]">
        {/* Left Editor */}
        <section className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-[#0D0F16] text-white flex flex-col">
          <div className="flex items-center gap-1 px-4 pt-3 bg-[#151720] border-b border-white/10">
            {(['html', 'css', 'js'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-mono uppercase rounded-t-lg cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#0D0F16] text-[#C8FF24] border-t border-x border-white/10 font-bold'
                    : 'text-[#A5A7B2] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <textarea
            value={activeTab === 'html' ? html : activeTab === 'css' ? css : js}
            onChange={(e) => {
              const val = e.target.value;
              if (activeTab === 'html') setHtml(val);
              else if (activeTab === 'css') setCss(val);
              else setJs(val);
            }}
            spellCheck={false}
            aria-label={`${activeTab.toUpperCase()} code editor`}
            className="flex-1 min-h-[420px] p-4 bg-[#0D0F16] font-mono text-xs sm:text-sm text-slate-100 focus:outline-none resize-none leading-relaxed"
          />
        </section>

        {/* Right Preview + Console */}
        <section className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-[#0D0F16] flex flex-col">
          <div className="px-4 py-2.5 bg-[#151720] border-b border-white/10 text-xs font-mono text-[#35CFFF]">
            Live Preview (`sandbox=&quot;allow-scripts&quot;`)
          </div>
          <div className="flex-1 min-h-[340px] bg-[#08090D]">
            <iframe
              title="Playground Preview"
              sandbox="allow-scripts"
              srcDoc={srcDoc}
              className="w-full h-full min-h-[340px] border-0"
            />
          </div>
          <div className="h-36 bg-[#08090D] border-t border-white/10 p-3 overflow-y-auto font-mono text-xs space-y-1">
            <p className="text-[#A5A7B2]">Sandbox Console:</p>
            {logs.length === 0 ? (
              <p className="text-slate-500">No console messages yet.</p>
            ) : (
              logs.map((l, idx) => (
                <p
                  key={idx}
                  className={l.level === 'error' ? 'text-rose-400' : 'text-[#C8FF24]'}
                >
                  {l.text}
                </p>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
