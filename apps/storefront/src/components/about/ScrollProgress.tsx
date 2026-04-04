"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: "hero", label: "Intro" },
  { id: "mission", label: "Mission" },
  { id: "values", label: "Values" },
  { id: "capabilities", label: "What We Do" },
  { id: "journey", label: "Journey" },
  { id: "testimonials", label: "Testimonials" },
  { id: "work", label: "Our Work" },
  { id: "team", label: "Team" },
  { id: "cta", label: "Get Started" },
];

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Side navigation dots */}
      <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <ul className="space-y-3">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className="group flex items-center gap-3"
                aria-label={`Scroll to ${section.label}`}
              >
                {/* Label - appears on hover */}
                <span
                  className={`text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 ${
                    activeSection === section.id
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {section.label}
                </span>

                {/* Dot */}
                <span
                  className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-[var(--accent)] scale-100"
                      : "bg-[var(--border)] scale-75 group-hover:scale-100 group-hover:bg-[var(--text-muted)]"
                  }`}
                >
                  {activeSection === section.id && (
                    <span className="absolute inset-0 bg-[var(--accent)] rounded-full animate-ping opacity-50" />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
