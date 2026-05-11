"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote, User } from "lucide-react";
import { testimonials, type Testimonial } from "@/lib/team-data";

function TestimonialCard({ testimonial, isActive }: { testimonial: Testimonial; isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.95 }}
      className={`relative p-8 rounded-2xl border transition-all duration-300 ${
        isActive
          ? "bg-[var(--bg-primary)] border-[var(--accent)]/30 shadow-xl shadow-[var(--accent)]/5"
          : "bg-[var(--bg-secondary)] border-[var(--border)]"
      }`}
    >
      {/* Quote icon */}
      <div className="absolute -top-4 -left-2 w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
        <Quote className="w-6 h-6 text-[var(--accent)]" />
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-4 pt-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating
                ? "text-amber-400 fill-amber-400"
                : "text-[var(--text-muted)]"
            }`}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-lg leading-relaxed text-[var(--text-primary)] mb-6">
        "{testimonial.quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] flex items-center justify-center">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-white" />
          )}
        </div>
        <div>
          <div className="font-semibold">{testimonial.name}</div>
          <div className="text-sm text-[var(--text-muted)]">
            {testimonial.role} at {testimonial.company}
          </div>
        </div>
      </div>

      {/* Project tag */}
      {testimonial.project && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <span className="text-xs text-[var(--text-muted)]">Project: </span>
          <span className="text-xs text-[var(--accent)] font-medium">
            {testimonial.project}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main carousel */}
      <div className="relative overflow-hidden">
        <div className="flex gap-6 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="w-full flex-shrink-0 px-4"
            >
              <TestimonialCard
                testimonial={testimonial}
                isActive={index === activeIndex}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all z-10"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all z-10"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-[var(--accent)] w-6"
                : "bg-[var(--border)] hover:bg-[var(--text-muted)]"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Pause indicator */}
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 px-2 py-1 bg-[var(--bg-primary)]/80 backdrop-blur-sm rounded text-xs text-[var(--text-muted)]"
        >
          Paused
        </motion.div>
      )}
    </div>
  );
}
