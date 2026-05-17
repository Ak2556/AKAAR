"use client";

import dynamic from "next/dynamic";

const AIChatWidget = dynamic(
  () => import("@/components/layout/AIChatWidget").then((mod) => mod.AIChatWidget),
  { ssr: false }
);

export function LazyAIChatWidget() {
  return <AIChatWidget />;
}
