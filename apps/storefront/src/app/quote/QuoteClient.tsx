"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  Cpu,
  FileText,
  Layers,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldBlock, MetricTile, SummaryRow } from "@/components/ui/storefront-primitives";
import { useAuthState } from "@/components/providers/AuthProvider";
import { useRuntimeCapabilities } from "@/context/RuntimeCapabilitiesContext";

const materials = [
  { id: "pla", name: "PLA", description: "Reliable entry point for prototype reviews" },
  { id: "abs", name: "ABS", description: "Durable and heat-tolerant for functional parts" },
  { id: "petg", name: "PETG", description: "Balanced strength and flexibility" },
  { id: "tpu", name: "TPU", description: "Flexible and impact-resistant for grips, seals, and living hinges" },
];

const services = [
  { id: "3d-printing", name: "3D Printing", icon: Layers, available: true },
  { id: "dfm-review", name: "Design Review", icon: Cpu, available: true },
  { id: "rapid-prototyping", name: "Rapid Prototyping", icon: Zap, available: true },
  { id: "cnc", name: "CNC Machining", icon: Clock, available: false },
];

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface SubmissionResult {
  quoteNumber: string;
  email: string;
}

export default function QuotePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { session } = useAuthState();
  const { quoteSubmissionAvailable } = useRuntimeCapabilities();

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedService, setSelectedService] = useState("3d-printing");
  const [selectedMaterial, setSelectedMaterial] = useState("pla");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;
    setName((current) => current || session.user.name || "");
    setEmail((current) => current || session.user.email || "");
  }, [session]);

  const selectedServiceLabel = useMemo(
    () => services.find((service) => service.id === selectedService)?.name ?? "Not selected",
    [selectedService]
  );
  const selectedMaterialLabel = useMemo(
    () => materials.find((material) => material.id === selectedMaterial)?.name ?? "Not selected",
    [selectedMaterial]
  );

  const canSubmit =
    quoteSubmissionAvailable &&
    files.length > 0 &&
    Boolean(selectedService) &&
    Boolean(selectedMaterial) &&
    Boolean(name.trim()) &&
    Boolean(email.trim()) &&
    Number(quantity) > 0;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });
  const leftImageY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const rightImageY = useTransform(scrollYProgress, [0, 1], [0, -42]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.14]);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(event.dataTransfer.files));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(Array.from(event.target.files));
      event.target.value = "";
    }
  };

  const handleFiles = (incomingFiles: File[]) => {
    const nextFiles = incomingFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    }));

    setFiles((current) => {
      const seen = new Set(current.map((file) => `${file.name}-${file.size}`));
      return [...current, ...nextFiles.filter((file) => !seen.has(`${file.name}-${file.size}`))];
    });
  };

  const removeFile = (id: string) => {
    setFiles((current) => current.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const resetForm = () => {
    setFiles([]);
    setSelectedService("3d-printing");
    setSelectedMaterial("pla");
    setQuantity("1");
    setNotes("");
    setPhone("");
    setFormError(null);
    setSubmissionResult(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canSubmit) {
      setFormError("Add contact details, choose a service and material, and attach at least one file.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          phone: phone.trim() || undefined,
          service: selectedServiceLabel,
          material: selectedMaterialLabel,
          quantity: Number(quantity),
          notes: notes.trim() || undefined,
          files: files.map((file) => ({
            originalFilename: file.name,
            fileSize: file.size,
            fileType: file.type,
            reviewOnly: true,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit quote request");
      }

      setSubmissionResult({ quoteNumber: data.quoteNumber, email: email.trim() });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to submit quote request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionResult) {
    return (
      <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="luxury-card rounded-[2.2rem] px-8 py-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[var(--surface-highlight)]">
              <CheckCircle className="h-10 w-10 text-[var(--accent)]" />
            </div>
            <span className="luxury-kicker mt-8 block">Request received</span>
            <h1 className="display-font mt-4 text-4xl text-[var(--text-primary)]">Your files are in review.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-[var(--text-secondary)]">
              We’ve logged the request and will respond at <span className="text-[var(--text-primary)]">{submissionResult.email}</span> with reviewed pricing, production guidance, and next steps.
            </p>
            <div className="mx-auto mt-8 max-w-sm rounded-[1.6rem] border border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-6">
              <p className="luxury-metric-label">Reference number</p>
              <p className="mt-3 font-mono text-2xl text-[var(--accent)]">{submissionResult.quoteNumber}</p>
            </div>
            <Button variant="primary" className="mt-8" onClick={resetForm}>
              Submit Another Request
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <section ref={heroRef} className="luxury-panel relative overflow-hidden rounded-[2.3rem] px-6 py-8 sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <motion.img
              src="/showcase/bambu-p1s.jpg"
              alt="Bambu Lab P1S background"
              className="absolute left-[-6%] top-[8%] hidden h-[74%] w-[42%] rounded-[2rem] object-cover opacity-30 lg:block"
              style={{ y: leftImageY, scale: imageScale }}
            />
            <motion.img
              src="/showcase/bambu-a1-combo.jpg"
              alt="Bambu Lab A1 Combo background"
              className="absolute right-[-8%] bottom-[-2%] hidden h-[72%] w-[46%] rounded-[2rem] object-cover opacity-30 lg:block"
              style={{ y: rightImageY, scale: imageScale }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,11,0.9)_0%,rgba(9,9,11,0.46)_40%,rgba(9,9,11,0.9)_100%)]" />
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="relative z-10 max-w-3xl">
              <span className="luxury-kicker">AKAAR build request</span>
              <h1 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
                Send us your file. We’ll review it and quote you.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
                Add your CAD file, choose a material, and describe what the part needs to do. We review every request and reply with pricing and next steps within 48 hours.
              </p>
            </div>

            <div className="relative z-10 grid gap-px overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3 lg:self-end">
              <MetricCard label="Review window" value="48 hours" />
              <MetricCard label="Asset types" value="STL · STEP · IGES" />
              <MetricCard label="Output" value="Reviewed quote" />
            </div>
          </div>
        </section>

        {!quoteSubmissionAvailable ? (
          <div className="mt-6 rounded-[1.6rem] border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
            Quote submission is unavailable in this environment until the required backend configuration is present.
          </div>
        ) : null}

        {formError ? (
          <div className="mt-6 flex items-start gap-3 rounded-[1.6rem] border border-red-500/35 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-10 grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-8">
            <section className="luxury-card rounded-[2rem] p-6 sm:p-7">
              <div className="mb-5">
                <span className="luxury-kicker">Upload</span>
                <h2 className="display-font mt-3 text-3xl text-[var(--text-primary)]">Attach geometry</h2>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`luxury-stage cursor-pointer rounded-[1.8rem] border-2 border-dashed px-6 py-12 text-center transition-all sm:px-10 ${
                  isDragging ? "border-[var(--accent)] bg-[var(--surface-highlight)]" : "border-[var(--border-accent)]"
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
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[var(--bg-primary)]/40">
                  <Upload className="h-7 w-7 text-[var(--accent)]" />
                </div>
                <p className="mt-5 text-lg font-medium text-[var(--text-primary)]">Drop files here or browse</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">STL, OBJ, STEP, IGES, 3MF, and FBX are all accepted.</p>
              </div>

              {files.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between gap-4 rounded-[1.3rem] border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText className="h-5 w-5 flex-shrink-0 text-[var(--accent)]" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[var(--text-primary)]">{file.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{formatFileSize(file.size)} attached for review</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeFile(file.id)} className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </section>

            <section className="grid gap-8 lg:grid-cols-2">
              <div className="luxury-card rounded-[2rem] p-6 sm:p-7">
                <span className="luxury-kicker">Service line</span>
                <h2 className="display-font mt-3 text-3xl text-[var(--text-primary)]">Pick the workflow</h2>
                <div className="mt-6 grid gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      disabled={!service.available}
                      onClick={() => service.available && setSelectedService(service.id)}
                      className={`rounded-[1.3rem] border px-4 py-4 text-left transition-all ${
                        selectedService === service.id
                          ? "border-[var(--accent)] bg-[var(--surface-highlight)]"
                          : "border-[var(--border)] bg-[var(--bg-secondary)]"
                      } ${service.available ? "hover:border-[var(--border-accent)]" : "cursor-not-allowed opacity-50"}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <service.icon className="h-5 w-5 text-[var(--accent)]" />
                          <div>
                            <p className="text-sm uppercase tracking-[0.12em] text-[var(--text-primary)]">{service.name}</p>
                            <p className="mt-1 text-xs text-[var(--text-muted)]">{service.available ? "Available now" : "Coming soon"}</p>
                          </div>
                        </div>
                        {!service.available ? <span className="luxury-metric-label">Soon</span> : null}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="luxury-card rounded-[2rem] p-6 sm:p-7">
                <span className="luxury-kicker">Material intent</span>
                <h2 className="display-font mt-3 text-3xl text-[var(--text-primary)]">Choose a likely material</h2>
                <div className="mt-6 grid gap-3">
                  {materials.map((material) => (
                    <button
                      key={material.id}
                      type="button"
                      onClick={() => setSelectedMaterial(material.id)}
                      className={`rounded-[1.3rem] border px-4 py-4 text-left transition-all ${
                        selectedMaterial === material.id
                          ? "border-[var(--accent)] bg-[var(--surface-highlight)]"
                          : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--border-accent)]"
                      }`}
                    >
                      <p className="text-sm uppercase tracking-[0.12em] text-[var(--text-primary)]">{material.name}</p>
                      <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">{material.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="luxury-card rounded-[2rem] p-6 sm:p-7">
              <span className="luxury-kicker">Build notes</span>
              <h2 className="display-font mt-3 text-3xl text-[var(--text-primary)]">Describe the part</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <span className="luxury-label-row">
                    <span className="luxury-label">Quantity *</span>
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    className="luxury-input w-full rounded-full px-5 py-3"
                  />
                </div>
                <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-4">
                  <p className="luxury-metric-label">Current setup</p>
                  <p className="mt-3 text-sm text-[var(--text-primary)]">{selectedServiceLabel}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{selectedMaterialLabel}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="luxury-label-row">
                    <span className="luxury-label">Additional notes</span>
                  </span>
                  <textarea
                    rows={5}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Tolerances, finish expectations, fit concerns, assembly details, or delivery constraints."
                    className="luxury-input min-h-[160px] w-full rounded-[1.6rem] px-5 py-4"
                  />
                </div>
              </div>
            </section>
          </div>

          <aside className="xl:pl-2">
            <div className="sticky top-28 space-y-6">
              <section className="luxury-card rounded-[2rem] p-6 sm:p-7">
                <span className="luxury-kicker">Contact</span>
                <h2 className="display-font mt-3 text-3xl text-[var(--text-primary)]">Who should we reply to?</h2>
                <div className="mt-6 space-y-4">
                  <FieldBlock label="Name *">
                    <input type="text" required value={name} onChange={(event) => setName(event.target.value)} className="luxury-input w-full rounded-full px-5 py-3" />
                  </FieldBlock>
                  <FieldBlock label="Email *">
                    <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="luxury-input w-full rounded-full px-5 py-3" />
                  </FieldBlock>
                  <FieldBlock label="Company">
                    <input type="text" value={company} onChange={(event) => setCompany(event.target.value)} className="luxury-input w-full rounded-full px-5 py-3" />
                  </FieldBlock>
                  <FieldBlock label="Phone">
                    <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="luxury-input w-full rounded-full px-5 py-3" />
                  </FieldBlock>
                </div>
              </section>

              <section className="luxury-card rounded-[2rem] p-6 sm:p-7">
                <span className="luxury-kicker">Request summary</span>
                <div className="mt-5 grid gap-px overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--border)]">
                  <SummaryRow label="Files" value={`${files.length} attached`} />
                  <SummaryRow label="Service" value={selectedServiceLabel} />
                  <SummaryRow label="Material" value={selectedMaterialLabel} />
                  <SummaryRow label="Quantity" value={`${quantity || "0"} units`} />
                </div>

                <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting || !canSubmit}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                  {!isSubmitting ? <ArrowRight className="ml-2 h-4 w-4" /> : null}
                </Button>

                <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
                  We typically respond within one business day with reviewed guidance and pricing.
                </p>
              </section>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <MetricTile label={label} value={value} className="py-6" />
  );
}
