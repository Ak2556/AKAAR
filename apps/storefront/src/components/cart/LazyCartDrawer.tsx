"use client";

import dynamic from "next/dynamic";
import { useCart } from "@/context/CartContext";

const CartDrawer = dynamic(
  () => import("@/components/cart/CartDrawer").then((mod) => mod.CartDrawer),
  { ssr: false }
);

export function LazyCartDrawer() {
  const { isOpen } = useCart();

  if (!isOpen) {
    return null;
  }

  return <CartDrawer />;
}
