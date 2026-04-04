"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Package, Building2, Layers } from "lucide-react";
import { projects, type Project } from "@/lib/team-data";

type Category = "all" | Project["category"];

const categories: { value: Category; label: string; icon: typeof Package }[] = [
  { value: "all", label: "All Work", icon: Layers },
  { value: "industrial", label: "Industrial", icon: Building2 },
  { value: "prototypes", label: "Prototypes", icon: Package },
  { value: "consumer", label: "Consumer", icon: Package },
  { value: "custom", label: "Custom", icon: Package },
];

function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-all duration-300">
        {/* Image placeholder - in production would use actual images */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center">
          <Package className="w-16 h-16 text-[var(--accent)]/30" />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content overlay */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-[var(--bg-primary)]/80 backdrop-blur-sm text-xs font-medium rounded-full border border-[var(--border)] capitalize">
            {project.category}
          </span>
        </div>

        {/* View indicator */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[var(--accent)]/0 group-hover:bg-[var(--accent)] flex items-center justify-center transition-all duration-300">
          <span className="text-white opacity-0 group-hover:opacity-100 text-lg">+</span>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-3xl w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center hover:bg-[var(--accent)]/10 hover:border-[var(--accent)] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image area */}
        <div className="aspect-video bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center">
          <Package className="w-24 h-24 text-[var(--accent)]/30" />
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium rounded-full border border-[var(--accent)]/20 capitalize">
              {project.category}
            </span>
            {project.client && (
              <span className="text-sm text-[var(--text-muted)]">
                for {project.client}
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
          <p className="text-[var(--text-secondary)] mb-6">{project.description}</p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[var(--border)]">
            {project.material && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)]">Material</div>
                  <div className="font-medium">{project.material}</div>
                </div>
              </div>
            )}
            {project.printTime && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)]">Print Time</div>
                  <div className="font-medium">{project.printTime}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WorkGallery() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === cat.value
                ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--accent)]/50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery grid */}
      <motion.div
        layout
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
          <p className="text-[var(--text-muted)]">No projects in this category yet.</p>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
