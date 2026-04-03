"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import {
  Upload, FileText, X, CheckCircle, AlertCircle,
  Cpu, Layers, Zap, Clock, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const materials = [
  { id: "pla", name: "PLA", description: "Standard, eco-friendly" },
  { id: "abs", name: "ABS", description: "Durable, heat-resistant" },
  { id: "petg", name: "PETG", description: "Strong, flexible" },
  { id: "nylon", name: "Nylon PA12", description: "Industrial grade" },
  { id: "resin", name: "Resin (SLA)", description: "High detail" },
  { id: "metal", name: "Metal", description: "Stainless, Aluminum" },
];

const services = [
  { id: "3d-printing", name: "3D Printing", icon: Layers },
  { id: "cnc", name: "CNC Machining", icon: Cpu },
  { id: "prototyping", name: "Rapid Prototyping", icon: Zap },
  { id: "production", name: "Production Run", icon: Clock },
];

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "success" | "error";
}

export default function QuotePage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: "success" as const,
    }));
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-8 border border-[var(--accent)] rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[var(--accent)]" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Quote Request Received</h1>
            <p className="text-[var(--text-secondary)] mb-8">
              Thank you for your request. Our engineering team will review your files
              and send you a detailed quote within 24 hours.
            </p>
            <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] mb-8">
              <p className="text-sm text-[var(--text-muted)] mb-2">Reference Number</p>
              <p className="text-2xl font-mono text-[var(--accent)]">
                QR-{Math.random().toString(36).substr(2, 8).toUpperCase()}
              </p>
            </div>
            <Button variant="primary" onClick={() => setIsSubmitted(false)}>
              Submit Another Quote
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-12"
        >
          <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
            We Give AKAAR to Ideas
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Upload CAD / <span className="gradient-text">Get Quote</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Drop your mesh file. Our algorithmic engine calculates pricing
            based on volume, material, and infill density. Instant results.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* File Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="border border-[var(--border)] rounded-xl p-6 bg-[var(--bg-secondary)]"
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[var(--accent)]" />
                  Upload Files
                </h2>

                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-[var(--accent)] bg-[var(--accent)]/5"
                      : "border-[var(--border)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".stl,.obj,.step,.stp,.iges,.igs,.3mf,.fbx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="w-16 h-16 mx-auto mb-4 border border-[var(--accent)]/30 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-[var(--accent)]" />
                  </div>
                  <p className="text-lg font-medium mb-2">
                    Drop your files here or click to browse
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    Supported: STL, OBJ, STEP, IGES, 3MF, FBX (Max 100MB per file)
                  </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)]"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[var(--accent)]" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {file.status === "success" && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {file.status === "error" && (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-[var(--text-muted)]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Service Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border border-[var(--border)] rounded-xl p-6 bg-[var(--bg-secondary)]"
              >
                <h2 className="text-xl font-semibold mb-6">Select Service</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedService(service.id)}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        selectedService === service.id
                          ? "border-[var(--accent)] bg-[var(--accent)]/10"
                          : "border-[var(--border)] hover:border-[var(--accent)]/50"
                      }`}
                    >
                      <service.icon className={`w-6 h-6 mb-2 ${
                        selectedService === service.id ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                      }`} />
                      <p className="font-medium">{service.name}</p>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Material Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border border-[var(--border)] rounded-xl p-6 bg-[var(--bg-secondary)]"
              >
                <h2 className="text-xl font-semibold mb-6">Select Material</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {materials.map((material) => (
                    <button
                      key={material.id}
                      type="button"
                      onClick={() => setSelectedMaterial(material.id)}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        selectedMaterial === material.id
                          ? "border-[var(--accent)] bg-[var(--accent)]/10"
                          : "border-[var(--border)] hover:border-[var(--accent)]/50"
                      }`}
                    >
                      <p className="font-medium">{material.name}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {material.description}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Quantity & Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="border border-[var(--border)] rounded-xl p-6 bg-[var(--bg-secondary)]"
              >
                <h2 className="text-xl font-semibold mb-6">Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific requirements, tolerances, or finishing details..."
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="sticky top-24 border border-[var(--border)] rounded-xl p-6 bg-[var(--bg-secondary)]"
              >
                <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[var(--border)]">
                  <h3 className="font-medium mb-4">Quote Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Files</span>
                      <span>{files.length} uploaded</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Service</span>
                      <span>{selectedService || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Material</span>
                      <span>{selectedMaterial || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Quantity</span>
                      <span>{quantity} units</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-6"
                  disabled={isSubmitting || files.length === 0}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Quote Request
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-[var(--text-muted)] text-center mt-4">
                  We typically respond within 24 hours
                </p>
              </motion.div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
