import React, { useState } from 'react';
import {
  CheckCircle2,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Send,
} from 'lucide-react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { usePlatform } from '../context/PlatformContext';

export const ContactPage: React.FC = () => {
  const { profile } = usePlatform();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please complete all fields before sending.');
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit contact form.');
      }

      // Also record in Firestore with strict schema validation
      const msgId = `contact_${Date.now()}`;
      try {
        await setDoc(doc(db, 'contact_messages', msgId), {
          name: name.trim().slice(0, 120),
          email: email.trim().slice(0, 180),
          subject: subject.trim().slice(0, 200),
          message: message.trim().slice(0, 4000),
          createdAt: serverTimestamp(),
        });
      } catch {
        // Server persistence already succeeded
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <p className="font-marker text-base text-[#791EFF] dark:text-[#C8FF24]">
            CONTACT NIEL
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
            LET&apos;S BUILD SOMETHING AWESOME.
          </h1>
          <p className="text-base text-slate-600 dark:text-[#A5A7B2] leading-relaxed">
            Have an interesting idea, collaboration opportunity, or project? Let&apos;s
            connect!
          </p>

          <div className="space-y-3 pt-2">
            <a
              href={`mailto:${profile.contact.email}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 hover:border-[#791EFF] dark:hover:border-[#C8FF24] transition-colors"
            >
              <Mail className="w-5 h-5 text-[#791EFF] dark:text-[#C8FF24]" />
              <div>
                <p className="text-xs font-mono text-slate-500 dark:text-[#A5A7B2]">
                  Email (Editable in Admin)
                </p>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                  {profile.contact.email}
                </p>
              </div>
            </a>

            <a
              href={profile.contact.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 hover:border-[#791EFF] dark:hover:border-[#35CFFF] transition-colors"
            >
              <Github className="w-5 h-5 text-slate-900 dark:text-white" />
              <div>
                <p className="text-xs font-mono text-slate-500 dark:text-[#A5A7B2]">
                  GitHub
                </p>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                  {profile.contact.github}
                </p>
              </div>
            </a>

            <a
              href={profile.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 hover:border-[#791EFF] dark:hover:border-[#35CFFF] transition-colors"
            >
              <Linkedin className="w-5 h-5 text-[#0EA5E9]" />
              <div>
                <p className="text-xs font-mono text-slate-500 dark:text-[#A5A7B2]">
                  LinkedIn
                </p>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                  {profile.contact.linkedin}
                </p>
              </div>
            </a>

            <a
              href={profile.contact.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 hover:border-[#791EFF] dark:hover:border-[#C8FF24] transition-colors"
            >
              <Instagram className="w-5 h-5 text-[#791EFF]" />
              <div>
                <p className="text-xs font-mono text-slate-500 dark:text-[#A5A7B2]">
                  Instagram
                </p>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">
                  {profile.contact.instagram}
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white dark:bg-[#1B1D27] border border-slate-200 dark:border-white/10 p-6 sm:p-8 space-y-5"
          >
            <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
              Send a Direct Message
            </h2>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-sm text-rose-600 dark:text-rose-300">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  Message sent successfully! Thank you for reaching out to Niel.
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-[#A5A7B2] mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#08090D] border border-slate-200 dark:border-white/10 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-[#791EFF] dark:focus:border-[#C8FF24]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-[#A5A7B2] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  maxLength={180}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#08090D] border border-slate-200 dark:border-white/10 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-[#791EFF] dark:focus:border-[#C8FF24]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-[#A5A7B2] mb-1.5">
                Subject
              </label>
              <input
                type="text"
                required
                maxLength={200}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Project collaboration, study idea, feedback..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#08090D] border border-slate-200 dark:border-white/10 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-[#791EFF] dark:focus:border-[#C8FF24]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-[#A5A7B2] mb-1.5">
                Message
              </label>
              <textarea
                rows={5}
                required
                maxLength={4000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#08090D] border border-slate-200 dark:border-white/10 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-[#791EFF] dark:focus:border-[#C8FF24]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#791EFF] hover:bg-[#8E42FF] disabled:opacity-60 text-white font-display font-semibold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};
