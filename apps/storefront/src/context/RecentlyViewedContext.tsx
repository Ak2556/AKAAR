"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

export interface RecentlyViewedItem {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  category: string | null;
  imageUrl: string | null;
}

interface RecentlyViewedContextType {
  items: RecentlyViewedItem[];
  trackView: (item: RecentlyViewedItem) => void;
}

const STORAGE_KEY = "akaar-recently-viewed";
const MAX_ITEMS = 8;

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // Clear on sign-out so one user's history doesn't leak to the next
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setItems([]);
        localStorage.removeItem(STORAGE_KEY);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const trackView = useCallback((item: RecentlyViewedItem) => {
    setItems((prev) => {
      // Dedup: remove existing entry for same product, prepend new one, cap at MAX_ITEMS
      const deduped = prev.filter((p) => p.id !== item.id);
      const next = [item, ...deduped].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ items, trackView }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error("useRecentlyViewed must be inside RecentlyViewedProvider");
  return ctx;
}
