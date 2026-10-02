"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { duration, ease, gsap, prefersReducedMotion } from "@/lib/motion";

type Message = { role: "user" | "assistant"; content: string };

function Spark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
      <path d="M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15z" />
    </svg>
  );
}

/**
 * AI assistant that answers questions about Wided's background and work
 * (backed by /api/chat). A pink pill opens a panel styled like the rest of
 * the site: warm black, hairlines, mono labels, accent for the visitor.
 */
export function ChatWidget({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.chat;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  // Panel grows from the button corner.
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    if (open) {
      gsap.set(el, { display: "flex" });
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 16, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: duration.short, ease: ease.out },
        );
      }
      field.current?.focus();
    } else {
      gsap.to(el, {
        opacity: 0,
        y: 12,
        duration: prefersReducedMotion() ? 0 : duration.micro,
        ease: ease.soft,
        onComplete: () => gsap.set(el, { display: "none" }),
      });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages, loading]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || loading) return;
    setError(false);
    const history = messages;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, lang: locale }),
      });
      const data = await res.json();
      if (!res.ok || !data.reply) throw new Error(data?.error ?? "chat_failed");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        ref={panel}
        id="chat-panel"
        role="dialog"
        aria-label={t.label}
        className="fixed bottom-24 right-4 z-[70] hidden h-[min(34rem,72svh)] w-[min(24rem,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-line bg-[#141412] text-[#f2efe9] shadow-[0_24px_80px_rgb(0_0_0/0.5)] md:right-6"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="text-meta flex items-center gap-2">
            <Spark className="size-4 text-accent" />
            {t.label}
          </p>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              toggle.current?.focus();
            }}
            aria-label={t.close}
            className="text-meta grid size-9 place-items-center rounded-full text-fg-muted transition-colors hover:text-fg"
            data-cursor="link"
          >
            ✕
          </button>
        </header>

        <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite" data-lenis-prevent>
          <p className="text-sm leading-relaxed text-fg-muted">{t.intro}</p>
          {messages.length === 0 && (
            <ul className="flex flex-wrap gap-2">
              {t.suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-line px-3 py-1.5 text-left text-sm transition-colors duration-200 hover:border-accent hover:text-accent"
                    data-cursor="link"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "ml-8" : "mr-8"}>
              <p className={`text-meta mb-1 ${m.role === "user" ? "text-right text-accent" : "text-fg-muted"}`}>
                {m.role === "user" ? t.you : t.assistant}
              </p>
              <p
                className={`whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-accent text-ink" : "border border-line"
                }`}
              >
                {m.content}
              </p>
            </div>
          ))}
          {loading && <p className="text-meta animate-pulse text-fg-muted">{t.thinking}</p>}
          {error && <p className="text-sm text-accent">{t.error}</p>}
        </div>

        <form
          className="flex items-end gap-2 border-t border-line p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <label htmlFor="chat-input" className="sr-only">
            {t.placeholder}
          </label>
          <textarea
            ref={field}
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder={t.placeholder}
            rows={1}
            maxLength={1000}
            className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-line bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-fg-muted focus:border-accent"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label={t.send}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-ink transition-opacity disabled:opacity-40"
            data-cursor="link"
          >
            ↑
          </button>
        </form>
      </div>

      <button
        ref={toggle}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? t.close : t.open}
        className="group/chat fixed bottom-4 right-4 z-[70] grid size-14 place-items-center rounded-full bg-accent text-ink shadow-[0_8px_32px_rgb(210_255_58/0.35)] transition-transform duration-300 ease-out hover:scale-105 active:scale-95 md:bottom-6 md:right-6"
        data-cursor="link"
      >
        <span className="transition-transform duration-500 ease-out group-hover/chat:rotate-90">
          {open ? <span className="text-lg leading-none">✕</span> : <Spark className="size-6" />}
        </span>
      </button>
    </>
  );
}
