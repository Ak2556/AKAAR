/**
 * Product recommendation engine.
 *
 * Uses a MinHeap to rank candidates by a multi-signal score and an LRU Cache
 * to avoid re-scoring the same (target, candidate-set) pair on repeated calls.
 *
 * Scoring signals (all server-safe, no ML required):
 *   Category match    +40 pts  — strongest affinity signal
 *   Price proximity   +30 pts  — ratio of min/max price (0–1 → 0–30)
 *   ID hash tiebreak  +1 pt    — stable shuffle within same score bucket
 */

import { LRUCache, MinHeap } from "./dsa";

export interface ScoredProduct {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | string | null;
  imageUrl: string | null;
  shortDescription?: string | null;
}

// 50-slot LRU: avoids re-ranking for the same target when the page reloads within
// the same Node.js process lifetime (Next.js RSC warm module cache).
const rankCache = new LRUCache<string, ScoredProduct[]>(50);

/** djb2-style: stable 32-bit integer from a string — no external deps. */
export function stableHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h << 5, h) ^ s.charCodeAt(i);
  }
  return h >>> 0; // unsigned
}

function scoreAgainst(target: ScoredProduct, candidate: ScoredProduct): number {
  let score = 0;

  // Category match — dominant signal
  if (
    target.category &&
    candidate.category &&
    target.category.toLowerCase() === candidate.category.toLowerCase()
  ) {
    score += 40;
  }

  // Price proximity — inverse distance, 0–30 pts
  const tp = Math.abs(Number(target.price) || 0);
  const cp = Math.abs(Number(candidate.price) || 0);
  if (tp > 0 && cp > 0) {
    const ratio = Math.min(tp, cp) / Math.max(tp, cp); // 0 < ratio <= 1
    score += ratio * 30;
  }

  // Stable fractional tiebreaker so equal-score products get a consistent order
  score += (stableHash(candidate.id) % 1000) / 1000;

  return score;
}

/**
 * Rank `candidates` against `target` and return up to `limit` best matches.
 *
 * Uses a MaxHeap (MinHeap with negated priority) so each pop() gives the
 * highest-scored candidate in O(log n) time — total complexity O(n log n).
 */
export function rankRelated(
  target: ScoredProduct,
  candidates: ScoredProduct[],
  limit = 4
): ScoredProduct[] {
  const cacheKey = `${target.id}:${candidates.map((c) => c.id).sort().join(",")}:${limit}`;
  const cached = rankCache.get(cacheKey);
  if (cached) return cached;

  const heap = new MinHeap<ScoredProduct>();
  for (const c of candidates) {
    if (c.id === target.id) continue;
    const score = scoreAgainst(target, c);
    heap.push(c, -score); // negate → max-heap behaviour
  }

  const result: ScoredProduct[] = [];
  while (result.length < limit && heap.size > 0) {
    const item = heap.pop();
    if (item) result.push(item);
  }

  rankCache.put(cacheKey, result);
  return result;
}

/**
 * Derive a badge label for a product based on its catalog position.
 *   Rank 1 → "Bestseller"
 *   Ranks 2–3 → "Popular"
 *   Others → undefined
 */
export function badgeForRank(rank: number): string | undefined {
  if (rank === 1) return "Bestseller";
  if (rank <= 3) return "Popular";
  return undefined;
}
