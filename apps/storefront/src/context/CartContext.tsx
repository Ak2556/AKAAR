"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  material?: string;
  image?: string;
  variantId?: string | null;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_KEY = "akaar-cart";

function lineKey(item: Pick<CartItem, "id" | "variantId" | "material">) {
  return `${item.id}::${item.variantId ?? ""}::${item.material ?? ""}`;
}

function mergeCarts(a: CartItem[], b: CartItem[]): CartItem[] {
  const byKey = new Map<string, CartItem>();
  for (const item of [...a, ...b]) {
    const key = lineKey(item);
    const existing = byKey.get(key);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      byKey.set(key, { ...item });
    }
  }
  return Array.from(byKey.values());
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const skipNextSync = useRef(true);     // first hydration shouldn't sync

  // ── 1. Read from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    let initial: CartItem[] = [];
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) initial = JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse cart:", e);
    }
    setItems(initial);
    setIsInitialized(true);
  }, []);

  // ── 2. Watch auth state. On sign-in, merge local cart with server cart
  //      and push the merged result. On sign-out, drop the cart entirely.
  useEffect(() => {
    const supabase = createClient();

    let mounted = true;
    const hydrateForSession = async (userId: string | null) => {
      if (!userId) {
        setSignedIn(false);
        return;
      }
      setSignedIn(true);
      try {
        const res = await fetch("/api/user/cart", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const remote: CartItem[] = Array.isArray(data.items) ? data.items : [];
        if (!mounted) return;
        // Merge local + remote, then mark "skip next sync" so the merge
        // result doesn't immediately re-upload before remote arrives.
        setItems((local) => {
          const merged = mergeCarts(local, remote);
          // Only push back when the merge actually changed something
          if (
            local.length !== merged.length ||
            remote.length !== merged.length
          ) {
            skipNextSync.current = false;
          }
          return merged;
        });
      } catch (e) {
        console.error("Cart hydrate failed:", e);
      }
    };

    supabase.auth.getUser().then(({ data: { user } }) => {
      hydrateForSession(user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setItems([]);
        setSignedIn(false);
        localStorage.removeItem(LOCAL_KEY);
        return;
      }
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
        await hydrateForSession(session?.user?.id ?? null);
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ── 3. Persist to localStorage always; debounced sync to server when
  //      the user is signed in.
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));

    if (!signedIn) return;
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }
    const handle = setTimeout(() => {
      fetch("/api/user/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      }).catch(() => {});
    }, 600);
    return () => clearTimeout(handle);
  }, [items, signedIn, isInitialized]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => lineKey(i) === lineKey(item as CartItem));
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { ...item, quantity }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setItems([]);
    if (signedIn) {
      fetch("/api/user/cart", { method: "DELETE" }).catch(() => {});
    }
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        openCart,
        closeCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
