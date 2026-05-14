/**
 * Core DSA primitives used across the storefront.
 *
 * LRUCache     – O(1) get/put via doubly-linked list + HashMap
 * MinHeap      – O(log n) push/pop binary heap (acts as MaxHeap when priorities are negated)
 * Trie         – O(k) prefix search, k = query length; used for instant autocomplete
 * CircularBuffer – O(1) push, fixed-size ring; used for recently-viewed tracking
 */

// ─── LRU Cache ────────────────────────────────────────────────────────────────

class LRUNode<K, V> {
  key: K;
  value: V;
  prev: LRUNode<K, V> | null = null;
  next: LRUNode<K, V> | null = null;
  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export class LRUCache<K, V> {
  private readonly capacity: number;
  private map = new Map<K, LRUNode<K, V>>();
  // Sentinel nodes eliminate null-checks on every insert/remove
  private head: LRUNode<K, V>;
  private tail: LRUNode<K, V>;

  constructor(capacity: number) {
    this.capacity = Math.max(1, capacity);
    this.head = new LRUNode<K, V>(null as K, null as V);
    this.tail = new LRUNode<K, V>(null as K, null as V);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: K): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;
    this.moveToFront(node);
    return node.value;
  }

  put(key: K, value: V): void {
    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      this.moveToFront(existing);
      return;
    }
    const node = new LRUNode(key, value);
    this.map.set(key, node);
    this.insertFront(node);
    if (this.map.size > this.capacity) {
      const evicted = this.removeTail();
      if (evicted) this.map.delete(evicted.key);
    }
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  get size(): number {
    return this.map.size;
  }

  private insertFront(node: LRUNode<K, V>): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  private removeNode(node: LRUNode<K, V>): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private moveToFront(node: LRUNode<K, V>): void {
    this.removeNode(node);
    this.insertFront(node);
  }

  private removeTail(): LRUNode<K, V> | null {
    const node = this.tail.prev;
    if (!node || node === this.head) return null;
    this.removeNode(node);
    return node;
  }
}

// ─── MinHeap ──────────────────────────────────────────────────────────────────

interface HeapEntry<T> {
  item: T;
  priority: number;
}

export class MinHeap<T> {
  private heap: HeapEntry<T>[] = [];

  push(item: T, priority: number): void {
    this.heap.push({ item, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0].item;
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  peek(): T | undefined {
    return this.heap[0]?.item;
  }

  get size(): number {
    return this.heap.length;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.heap[parent].priority <= this.heap[i].priority) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  private sinkDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.heap[l].priority < this.heap[smallest].priority) smallest = l;
      if (r < n && this.heap[r].priority < this.heap[smallest].priority) smallest = r;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

// ─── Trie ─────────────────────────────────────────────────────────────────────

class TrieNode {
  children = new Map<string, TrieNode>();
  // Each prefix node stores the IDs of products whose name/category starts with it
  productIds: string[] = [];
}

export class Trie {
  private root = new TrieNode();
  private static readonly MAX_IDS_PER_NODE = 12;

  insert(word: string, productId: string): void {
    let node = this.root;
    for (const ch of word.toLowerCase()) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
      if (
        node.productIds.length < Trie.MAX_IDS_PER_NODE &&
        !node.productIds.includes(productId)
      ) {
        node.productIds.push(productId);
      }
    }
  }

  /** Returns up to MAX_IDS_PER_NODE product IDs whose name starts with `prefix`. */
  search(prefix: string): string[] {
    if (!prefix) return [];
    let node = this.root;
    for (const ch of prefix.toLowerCase()) {
      if (!node.children.has(ch)) return [];
      node = node.children.get(ch)!;
    }
    return [...node.productIds];
  }
}

// ─── CircularBuffer ───────────────────────────────────────────────────────────

export class CircularBuffer<T> {
  private buf: (T | undefined)[];
  private readonly cap: number;
  private writeAt = 0;
  private count = 0;

  constructor(capacity: number) {
    this.cap = Math.max(1, capacity);
    this.buf = new Array(this.cap);
  }

  push(item: T): void {
    this.buf[this.writeAt] = item;
    this.writeAt = (this.writeAt + 1) % this.cap;
    if (this.count < this.cap) this.count++;
  }

  /** Returns items oldest-to-newest, then reversed so index 0 = most recent. */
  toArray(): T[] {
    if (this.count === 0) return [];
    const out: T[] = [];
    const start = this.count < this.cap ? 0 : this.writeAt;
    for (let i = 0; i < this.count; i++) {
      out.push(this.buf[(start + i) % this.cap] as T);
    }
    return out.reverse();
  }

  get length(): number {
    return this.count;
  }
}
