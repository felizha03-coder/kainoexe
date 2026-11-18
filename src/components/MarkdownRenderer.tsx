import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy, Play } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  onSendToEditor?: (code: string, language: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  onSendToEditor,
}) => {
  return (
    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const rawCode = String(children).replace(/\n$/, '');
            const isBlock = Boolean(match) || rawCode.includes('\n');

            if (!isBlock) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-[#08090D] text-[#791EFF] dark:text-[#C8FF24] font-mono text-[0.85em]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            const lang = match?.[1] || 'code';
            return (
              <CodeBlock
                code={rawCode}
                language={lang}
                onSendToEditor={onSendToEditor}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const CodeBlock: React.FC<{
  code: string;
  language: string;
  onSendToEditor?: (code: string, language: string) => void;
}> = ({ code, language, onSendToEditor }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-300 dark:border-white/10 bg-[#0D0F16] text-slate-100">
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#151720] border-b border-white/10 text-xs font-mono">
        <span className="text-[#35CFFF] uppercase">{language}</span>
        <div className="flex items-center gap-2">
          {onSendToEditor &&
            ['html', 'css', 'javascript', 'js'].includes(language.toLowerCase()) && (
              <button
                type="button"
                onClick={() => onSendToEditor(code, language)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#791EFF] hover:bg-[#8D42FF] text-white cursor-pointer"
              >
                <Play className="w-3 h-3" /> Load in Workspace
              </button>
            )}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#C8FF24]" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy Code
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
};
