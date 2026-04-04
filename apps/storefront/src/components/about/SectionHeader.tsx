"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SectionHeaderProps {
  preText?: string;
  highlightText: string;
  postText?: string;
  subtitle?: string;
  enableTyping?: boolean;
  center?: boolean;
}

function TypeWriter({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span className="gradient-text">
      {displayText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-[1em] bg-[var(--accent)] ml-1 align-middle"
        />
      )}
    </span>
  );
}

export function SectionHeader({
  preText,
  highlightText,
  postText,
  subtitle,
  enableTyping = true,
  center = true,
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [shouldType, setShouldType] = useState(false);

  useEffect(() => {
    if (isInView && enableTyping) {
      setShouldType(true);
    }
  }, [isInView, enableTyping]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${center ? "text-center" : ""}`}
    >
      <h2 className="text-3xl md:text-4xl font-bold">
        {preText && <span>{preText} </span>}
        {shouldType && enableTyping ? (
          <TypeWriter text={highlightText} />
        ) : (
          <span className="gradient-text">{highlightText}</span>
        )}
        {postText && <span> {postText}</span>}
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
