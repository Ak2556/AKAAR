"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Sparkles, RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SESSION_KEY = "aria-messages";
const PINGED_KEY  = "aria-pinged";
const EXIT_KEY    = "aria-exit-fired";
const PING_DELAY  = 15_000;

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content: "Hi, I'm ARIA — your AKAAR 3D guide. Ask me about materials, print specs, or how to get a quote. I'm here to help you bring your idea to life!",
};

const EXIT_MESSAGE: Message = {
  id: "exit-intent",
  role: "assistant",
  content: "Wait — still thinking about your print? Tell me what you need and I'll help you get a quote before you go.",
};

const SUGGESTIONS = [
  "Get a quote for my project →",
  "Which material suits my design?",
  "How fast can I receive my print?",
  "Can you handle bulk orders?",
];

const WHATSAPP_URL = "https://wa.me/917300431301?text=Hi%20AKAAR%2C%20I%27d%20like%20to%20enquire%20about%20a%20print.";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadSession(): Message[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return [WELCOME];
    const parsed = JSON.parse(raw) as Message[];
    return parsed.length ? parsed : [WELCOME];
  } catch {
    return [WELCOME];
  }
}

function saveSession(messages: Message[]) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
  } catch {
    // ignore quota errors
  }
}

/** Lightweight markdown → JSX (bold, italic, bullets, line breaks) */
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (!listItems.length) return;
    elements.push(
      <ul key={`ul-${elements.length}`} className="my-1 list-disc space-y-0.5 pl-4">
        {listItems.map((item, i) => (
          <li key={i}>{inlineFormat(item)}</li>
        ))}
      </ul>
    );
    listItems = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("- ") || line.startsWith("• ")) {
      listItems.push(line.slice(2));
    } else {
      flushList();
      if (line.trim() === "") {
        if (i < lines.length - 1) elements.push(<br key={`br-${i}`} />);
      } else {
        elements.push(<span key={`line-${i}`}>{inlineFormat(line)}<br /></span>);
      }
    }
  }
  flushList();
  return <>{elements}</>;
}

function inlineFormat(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

/** Detect which CTA buttons to show based on message content */
function getCtas(content: string): { label: string; href: string }[] {
  const lower = content.toLowerCase();
  const ctaSet: { label: string; href: string }[] = [];
  if (lower.includes("quote") || lower.includes("get started") || lower.includes("upload"))
    ctaSet.push({ label: "📋 Request a Quote →", href: "/quote" });
  if (lower.includes("whatsapp") || lower.includes("contact") || lower.includes("reach us"))
    ctaSet.push({ label: "💬 WhatsApp Us →", href: WHATSAPP_URL });
  if (lower.includes("browse") || lower.includes("products") || lower.includes("catalog"))
    ctaSet.push({ label: "📦 Browse Products →", href: "/products" });
  return ctaSet;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function MessageBubble({
  msg,
  isLastBot,
  isStreaming,
  showAvatar,
}: {
  msg: Message;
  isLastBot: boolean;
  isStreaming: boolean;
  showAvatar: boolean;
}) {
  const ctaButtons = isLastBot && !isStreaming ? getCtas(msg.content) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
    >
      {msg.role === "assistant" && (
        <div className="mr-2 mt-1 w-6 flex-shrink-0">
          {showAvatar && (
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold"
              style={{
                background: "linear-gradient(135deg, var(--accent) 0%, #b8902e 100%)",
                color: "var(--bg-primary)",
                fontFamily: "var(--font-syne)",
              }}
            >
              A
            </div>
          )}
        </div>
      )}

      <div className="flex max-w-[85%] flex-col gap-1.5">
        <div
          className="rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
          style={
            msg.role === "user"
              ? {
                  background: "var(--accent)",
                  color: "var(--bg-primary)",
                  borderBottomRightRadius: "4px",
                  fontWeight: 500,
                }
              : {
                  background: "var(--bg-tertiary)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  borderBottomLeftRadius: "4px",
                }
          }
        >
          {msg.role === "assistant"
            ? msg.content
              ? renderMarkdown(msg.content)
              : isStreaming
              ? <TypingDots />
              : null
            : msg.content}
        </div>

        {/* Inline CTA buttons */}
        {ctaButtons.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pl-0.5">
            {ctaButtons.map((cta) => (
              <a
                key={cta.href}
                href={cta.href}
                target={cta.href.startsWith("http") ? "_blank" : undefined}
                rel={cta.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="rounded-full px-3 py-1 text-xs font-medium transition-colors hover:opacity-80"
                style={{
                  border: "1px solid var(--accent)",
                  color: "var(--accent)",
                  background: "transparent",
                  fontFamily: "var(--font-ibm-plex-mono)",
                }}
              >
                {cta.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AIChatWidget() {
  const pathname = usePathname();

  const [isOpen, setIsOpen]         = useState(false);
  const [messages, setMessages]     = useState<Message[]>(() => loadSession());
  const [input, setInput]           = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasBadge, setHasBadge]     = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);

  const abortRef    = useRef<AbortController | null>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);

  // Persist messages to sessionStorage on every change
  useEffect(() => {
    saveSession(messages);
  }, [messages]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Escape key closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // ── Proactive ping after 15s (once per session) ──────────────────────────
  useEffect(() => {
    if (sessionStorage.getItem(PINGED_KEY)) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem(PINGED_KEY, "1");
      setHasBadge(true);
      setShowTeaser(true);
      // Auto-dismiss teaser on mobile after 6s
      setTimeout(() => setShowTeaser(false), 6_000);
    }, PING_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // ── Exit intent (desktop: mouse leaves top; mobile: tab hidden) ──────────
  useEffect(() => {
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 5) return;
      if (sessionStorage.getItem(EXIT_KEY)) return;
      sessionStorage.setItem(EXIT_KEY, "1");
      setIsOpen(true);
      setHasBadge(false);
      setShowTeaser(false);
      setMessages((prev) => {
        const already = prev.some((m) => m.id === EXIT_MESSAGE.id);
        return already ? prev : [...prev, { ...EXIT_MESSAGE }];
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "hidden") return;
      if (sessionStorage.getItem(EXIT_KEY)) return;
      sessionStorage.setItem(EXIT_KEY, "1");
      setHasBadge(true);
    };

    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  // ── Open handler (clears badge) ───────────────────────────────────────────
  const handleOpen = () => {
    setIsOpen((v) => !v);
    setHasBadge(false);
    setShowTeaser(false);
  };

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: trimmed };
      const botMsg: Message  = { id: crypto.randomUUID(), role: "assistant", content: "" };

      setMessages((prev) => [...prev, userMsg, botMsg]);
      setInput("");
      setIsStreaming(true);

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const history = [...messages, userMsg].map(({ role, content }) => ({ role, content }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, page: pathname }),
          signal: ctrl.signal,
        });

        const json = await res.json();

        if (!res.ok) {
          console.error("[ARIA] API error", res.status, json);
          throw new Error(json.detail || json.error || "API error");
        }

        const content: string = json.content ?? "";
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsg.id ? { ...m, content } : m))
        );
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsg.id
                ? { ...m, content: "Something went wrong. Please try again or reach us on WhatsApp." }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, isStreaming, pathname]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([WELCOME]);
    setIsStreaming(false);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const showSuggestions = messages.length === 1 && !isStreaming;
  const lastBotId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <>
      {/* ── Teaser bubble ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.button
            key="teaser"
            initial={{ opacity: 0, x: -12, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={handleOpen}
            className="fixed bottom-[88px] left-4 z-[95] max-w-[220px] rounded-2xl px-4 py-2.5 text-left text-xs leading-snug shadow-xl md:bottom-[82px] md:left-6"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-accent)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-manrope)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(214,178,114,0.1)",
            }}
          >
            👋 Not sure where to start? I can help you choose the right material and get a quote.
            {/* Tail */}
            <span
              className="absolute -bottom-2 left-5 h-0 w-0"
              style={{
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "8px solid var(--border-accent)",
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Floating trigger button ───────────────────────────────────────── */}
      <motion.button
        onClick={handleOpen}
        aria-label={isOpen ? "Close ARIA chat" : "Open ARIA chat assistant"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-20 left-4 z-[95] flex h-14 w-14 items-center justify-center rounded-full shadow-lg md:bottom-6 md:left-6"
        style={{
          background: "linear-gradient(135deg, var(--accent) 0%, #b8902e 100%)",
          boxShadow: hasBadge
            ? "0 0 0 3px var(--accent), 0 0 24px var(--accent-glow), 0 4px 16px rgba(0,0,0,0.4)"
            : "0 0 20px var(--accent-glow), 0 4px 16px rgba(0,0,0,0.4)",
        }}
        animate={hasBadge ? { scale: [1, 1.06, 1] } : {}}
        transition={hasBadge ? { duration: 1.8, repeat: Infinity } : {}}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="h-6 w-6 text-[var(--bg-primary)]" strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Sparkles className="h-6 w-6 text-[var(--bg-primary)]" strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {hasBadge && !isOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            1
          </span>
        )}
      </motion.button>

      {/* ── Chat panel ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed bottom-36 left-4 z-[95] flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl md:bottom-24 md:left-6 md:w-[400px]"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-accent)",
              boxShadow: "0 0 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(214,178,114,0.08)",
            }}
            role="dialog"
            aria-label="ARIA — AKAAR's AI assistant"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold tracking-wider"
                  style={{ background: "linear-gradient(135deg, var(--accent) 0%, #b8902e 100%)", color: "var(--bg-primary)", fontFamily: "var(--font-syne)" }}
                >
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none" style={{ color: "var(--text-primary)", fontFamily: "var(--font-syne)", letterSpacing: "0.04em" }}>
                    ARIA
                  </p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    {/* Online dot */}
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <p className="text-[10px] leading-none" style={{ color: "var(--accent)", fontFamily: "var(--font-ibm-plex-mono)" }}>
                      AKAAR&apos;S AI GUIDE · ONLINE
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={clearChat} aria-label="Clear conversation" className="rounded-md p-1.5 transition-colors hover:bg-[var(--bg-tertiary)]" style={{ color: "var(--text-muted)" }}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="rounded-md p-1.5 transition-colors hover:bg-[var(--bg-tertiary)]" style={{ color: "var(--text-muted)" }}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 overflow-y-auto p-4" style={{ maxHeight: "320px", minHeight: "180px" }}>
              {messages.map((msg, i) => {
                const prevMsg = messages[i - 1];
                const showAvatar = msg.role === "assistant" && prevMsg?.role !== "assistant";
                return (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    isLastBot={msg.id === lastBotId}
                    isStreaming={isStreaming}
                    showAvatar={showAvatar}
                  />
                );
              })}

              {/* Suggestion chips */}
              {showSuggestions && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 flex flex-col gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s.replace(" →", ""))}
                      className="rounded-xl px-3 py-2 text-left text-xs transition-colors hover:opacity-80"
                      style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border-accent)", color: "var(--accent)", fontFamily: "var(--font-ibm-plex-mono)" }}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick Actions bar */}
            <div className="flex items-center gap-1.5 px-3 py-2" style={{ borderTop: "1px solid var(--border)", background: "var(--bg-tertiary)" }}>
              <a
                href="/quote"
                className="flex-1 rounded-lg py-1.5 text-center text-[11px] font-medium transition-colors hover:opacity-80"
                style={{ background: "var(--accent)", color: "var(--bg-primary)", fontFamily: "var(--font-ibm-plex-mono)" }}
              >
                📋 Quote
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg py-1.5 text-center text-[11px] font-medium transition-colors hover:opacity-80"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-accent)", color: "var(--text-primary)", fontFamily: "var(--font-ibm-plex-mono)" }}
              >
                💬 WhatsApp
              </a>
              <a
                href="/products"
                className="flex-1 rounded-lg py-1.5 text-center text-[11px] font-medium transition-colors hover:opacity-80"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-accent)", color: "var(--text-primary)", fontFamily: "var(--font-ibm-plex-mono)" }}
              >
                📦 Products
              </a>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3" style={{ borderTop: "1px solid var(--border)" }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask ARIA anything…"
                disabled={isStreaming}
                className="flex-1 rounded-xl bg-[var(--bg-tertiary)] px-3.5 py-2.5 text-sm outline-none placeholder:text-[var(--text-muted)] disabled:opacity-50"
                style={{ color: "var(--text-primary)", border: "1px solid var(--border)", fontFamily: "var(--font-manrope)" }}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isStreaming}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Send message"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, var(--accent) 0%, #b8902e 100%)", color: "var(--bg-primary)" }}
              >
                <Send className="h-4 w-4" strokeWidth={2.5} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
