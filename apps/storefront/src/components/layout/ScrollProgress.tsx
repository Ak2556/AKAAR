"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.22,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.02, 1], [0, 0.9, 1]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70]">
      <motion.div
        aria-hidden="true"
        className="scroll-progress-track"
        style={{ opacity }}
      >
        <motion.div
          className="scroll-progress-bar origin-left"
          style={{ scaleX }}
        />
      </motion.div>
    </div>
  );
}
