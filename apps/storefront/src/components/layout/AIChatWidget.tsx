"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Sparkles, RotateCcw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi, I'm ARIA — your AKAAR 3D guide. Ask me about our materials, print specs, or how to get a quote!",
};

const SUGGESTIONS = [
  "What materials do you offer?",
  "How do I request a quote?",
  "What's the lead time for printing?",
];

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

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      };

      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, botMsg]);
      setInput("");
      setIsStreaming(true);

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        const history = [...messages, userMsg].map(({ role, content }) => ({
          role,
          content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: ctrl.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error("Request failed");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === botMsg.id
                      ? { ...m, content: m.content + delta }
                      : m
                  )
                );
              }
            } catch {
              // ignore malformed SSE chunks
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsg.id
                ? {
                    ...m,
                    content:
                      "Sorry, something went wrong. Please try again or reach us on WhatsApp.",
                  }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, isStreaming]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([WELCOME]);
    setIsStreaming(false);
  };

  const showSuggestions = messages.length === 1 && !isStreaming;

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close ARIA chat" : "Open ARIA chat assistant"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-20 left-4 z-[95] flex h-14 w-14 items-center justify-center rounded-full shadow-lg md:bottom-6 md:left-6"
        style={{
          background:
            "linear-gradient(135deg, var(--accent) 0%, #b8902e 100%)",
          boxShadow: "0 0 20px var(--accent-glow), 0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6 text-[var(--bg-primary)]" strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Sparkles className="h-6 w-6 text-[var(--bg-primary)]" strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed bottom-36 left-4 z-[95] flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl md:bottom-24 md:left-6 md:w-96"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-accent)",
              boxShadow:
                "0 0 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(214,178,114,0.08)",
            }}
            role="dialog"
            aria-label="ARIA — AKAAR's AI assistant"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-2.5">
                {/* ARIA avatar */}
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold tracking-wider"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent) 0%, #b8902e 100%)",
                    color: "var(--bg-primary)",
                    fontFamily: "var(--font-syne)",
                  }}
                >
                  A
                </div>
                <div>
                  <p
                    className="text-sm font-semibold leading-none"
                    style={{
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-syne)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    ARIA
                  </p>
                  <p
                    className="mt-0.5 text-[10px] leading-none"
                    style={{ color: "var(--accent)", fontFamily: "var(--font-ibm-plex-mono)" }}
                  >
                    AKAAR&apos;S AI GUIDE
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  aria-label="Clear conversation"
                  className="rounded-md p-1.5 transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{ color: "var(--text-muted)" }}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="rounded-md p-1.5 transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" style={{ maxHeight: "340px", minHeight: "200px" }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div
                      className="mr-2 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                      style={{
                        background: "linear-gradient(135deg, var(--accent) 0%, #b8902e 100%)",
                        color: "var(--bg-primary)",
                        fontFamily: "var(--font-syne)",
                      }}
                    >
                      A
                    </div>
                  )}
                  <div
                    className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
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
                    {msg.content || (msg.role === "assistant" && isStreaming ? (
                      <TypingDots />
                    ) : null)}
                  </div>
                </motion.div>
              ))}

              {/* Suggestion chips */}
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 flex flex-col gap-1.5"
                >
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="rounded-xl px-3 py-2 text-left text-xs transition-colors"
                      style={{
                        background: "var(--bg-tertiary)",
                        border: "1px solid var(--border-accent)",
                        color: "var(--accent)",
                        fontFamily: "var(--font-ibm-plex-mono)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 p-3"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask ARIA anything…"
                disabled={isStreaming}
                className="flex-1 rounded-xl bg-[var(--bg-tertiary)] px-3.5 py-2.5 text-sm outline-none placeholder:text-[var(--text-muted)] disabled:opacity-50"
                style={{
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                  fontFamily: "var(--font-manrope)",
                }}
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isStreaming}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Send message"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, var(--accent) 0%, #b8902e 100%)",
                  color: "var(--bg-primary)",
                }}
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
