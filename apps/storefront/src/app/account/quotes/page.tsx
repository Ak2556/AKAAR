"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Plus,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSettings } from "@/context/SettingsContext";

interface Quote {
  id: string;
  quoteNumber: string;
  createdAt: string;
  status: string;
  service: string;
  material: string;
  quantity: number;
  estimatedPrice?: number;
  notes?: string;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  PENDING: { icon: Clock, color: "text-yellow-400 bg-yellow-400/10", label: "Pending Review" },
  REVIEWING: { icon: FileText, color: "text-blue-400 bg-blue-400/10", label: "Under Review" },
  QUOTED: { icon: CheckCircle, color: "text-green-400 bg-green-400/10", label: "Quote Ready" },
  ACCEPTED: { icon: CheckCircle, color: "text-cyan-400 bg-cyan-400/10", label: "Accepted" },
  REJECTED: { icon: XCircle, color: "text-red-400 bg-red-400/10", label: "Declined" },
  EXPIRED: { icon: AlertCircle, color: "text-gray-400 bg-gray-400/10", label: "Expired" },
};

export default function QuotesPage() {
  const { formatPrice } = useSettings();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/user/quotes");
      if (res.ok) {
        const data = await res.json();
        setQuotes(data.quotes || []);
      }
    } catch (error) {
      console.error("Failed to fetch quotes:", error);
      // Mock data for demo
      setQuotes([
        {
          id: "1",
          quoteNumber: "QT-2024-001",
          createdAt: "2024-02-20",
          status: "QUOTED",
          service: "3D Printing",
          material: "PLA",
          quantity: 50,
          estimatedPrice: 15000,
          notes: "Custom bracket design for industrial use",
        },
        {
          id: "2",
          quoteNumber: "QT-2024-002",
          createdAt: "2024-02-18",
          status: "REVIEWING",
          service: "CNC Machining",
          material: "Aluminum",
          quantity: 10,
          notes: "Precision parts for automotive",
        },
        {
          id: "3",
          quoteNumber: "QT-2024-003",
          createdAt: "2024-02-15",
          status: "ACCEPTED",
          service: "3D Printing",
          material: "Resin",
          quantity: 100,
          estimatedPrice: 45000,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quotes.filter((quote) =>
    quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
      >
        <div>
          <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
            Account
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            <span className="gradient-text">My Quotes</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Track your custom project quote requests
          </p>
        </div>
        <Link href="/quote">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Quote Request
          </Button>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by quote number or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </motion.div>

      {/* Quotes List */}
      {filteredQuotes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]"
        >
          <FileText className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
          <h3 className="text-xl font-semibold mb-2">No quotes found</h3>
          <p className="text-[var(--text-muted)] mb-6">
            {quotes.length === 0
              ? "You haven't requested any quotes yet."
              : "No quotes match your search criteria."}
          </p>
          {quotes.length === 0 && (
            <Link href="/quote">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Request a Quote
              </Button>
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote, index) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] overflow-hidden"
            >
              {/* Quote Header */}
              <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border border-[var(--border)] rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="font-mono font-semibold">{quote.quoteNumber}</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {new Date(quote.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={quote.status} />
                  {quote.estimatedPrice && (
                    <span className="text-lg font-bold">
                      {formatPrice(quote.estimatedPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quote Details */}
              <div className="p-4">
                <div className="grid sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Service</p>
                    <p className="font-medium">{quote.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Material</p>
                    <p className="font-medium">{quote.material}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-muted)]">Quantity</p>
                    <p className="font-medium">{quote.quantity} units</p>
                  </div>
                </div>

                {quote.notes && (
                  <div className="mb-4 p-3 bg-[var(--bg-primary)] rounded-lg">
                    <p className="text-sm text-[var(--text-secondary)]">
                      {quote.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {quote.status === "QUOTED" && (
                    <>
                      <Button size="sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Quote
                      </Button>
                      <Button variant="secondary" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Negotiate
                      </Button>
                    </>
                  )}
                  {quote.estimatedPrice && (
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
