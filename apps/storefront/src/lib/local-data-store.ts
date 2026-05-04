import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

export type LocalUserRole = "CUSTOMER" | "ADMIN";
export type LocalOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type LocalPaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "REFUNDED";
export type LocalQuoteStatus =
  | "PENDING"
  | "REVIEWING"
  | "QUOTED"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED";

export interface LocalUserRecord {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  password: string | null;
  role: LocalUserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LocalMeshFileRecord {
  id: string;
  originalFilename: string;
  storedFilename: string | null;
  storagePath: string | null;
  fileType: string;
  fileSize: number;
  s3Key: string | null;
  isProcessed: boolean;
  createdAt: string;
}

export interface LocalProductRecord {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
  category: string | null;
  sortOrder: number;
  isActive: boolean;
  price: number | null;
  meshFileId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalAddressRecord {
  id: string;
  userId: string;
  label: string | null;
  type: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LocalOrderItemRecord {
  id: string;
  orderId: string;
  productId: string | null;
  name: string;
  slug: string | null;
  material: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}

export interface LocalOrderRecord {
  id: string;
  orderNumber: string;
  userId: string | null;
  status: LocalOrderStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingMethod: string;
  shippingAddress: Record<string, unknown>;
  paymentMethod: string | null;
  paymentStatus: LocalPaymentStatus;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  email: string;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LocalQuoteFileRecord {
  id: string;
  quoteRequestId: string;
  originalFilename: string;
  storedFilename: string;
  s3Key: string;
  s3Bucket: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

export interface LocalQuoteRecord {
  id: string;
  quoteNumber: string;
  userId: string | null;
  status: LocalQuoteStatus;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  service: string;
  material: string;
  quantity: number;
  notes: string | null;
  quotedPrice: number | null;
  responseNotes: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LocalAuditLogRecord {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  status: string;
  errorMessage: string | null;
  createdAt: string;
}

interface LocalPasswordResetTokenRecord {
  id: string;
  email: string;
  token: string;
  expires: string;
  createdAt: string;
}

interface LocalDataStore {
  users: LocalUserRecord[];
  meshFiles: LocalMeshFileRecord[];
  products: LocalProductRecord[];
  addresses: LocalAddressRecord[];
  orders: LocalOrderRecord[];
  orderItems: LocalOrderItemRecord[];
  quoteRequests: LocalQuoteRecord[];
  quoteFiles: LocalQuoteFileRecord[];
  auditLogs: LocalAuditLogRecord[];
  passwordResetTokens: LocalPasswordResetTokenRecord[];
}

const DATA_DIRECTORY = path.join(process.cwd(), "apps", "storefront", ".local-data");
const DATA_FILE = path.join(DATA_DIRECTORY, "storefront-dev-data.json");

const defaultStore = (): LocalDataStore => ({
  users: [],
  meshFiles: [],
  products: [],
  addresses: [],
  orders: [],
  orderItems: [],
  quoteRequests: [],
  quoteFiles: [],
  auditLogs: [],
  passwordResetTokens: [],
});

let mutationQueue: Promise<unknown> = Promise.resolve();

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function nowIso(): string {
  return new Date().toISOString();
}

function createId(prefix: string): string {
  return `${prefix}_${nanoid(12)}`;
}

function normalizeStore(store: Partial<LocalDataStore> | null | undefined): LocalDataStore {
  const fallback = defaultStore();

  return {
    users: store?.users ?? fallback.users,
    meshFiles: store?.meshFiles ?? fallback.meshFiles,
    products: store?.products ?? fallback.products,
    addresses: store?.addresses ?? fallback.addresses,
    orders: store?.orders ?? fallback.orders,
    orderItems: store?.orderItems ?? fallback.orderItems,
    quoteRequests: store?.quoteRequests ?? fallback.quoteRequests,
    quoteFiles: store?.quoteFiles ?? fallback.quoteFiles,
    auditLogs: store?.auditLogs ?? fallback.auditLogs,
    passwordResetTokens: store?.passwordResetTokens ?? fallback.passwordResetTokens,
  };
}

async function ensureStoreFile(): Promise<void> {
  await mkdir(DATA_DIRECTORY, { recursive: true });

  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, JSON.stringify(defaultStore(), null, 2), "utf8");
  }
}

async function readStore(): Promise<LocalDataStore> {
  await ensureStoreFile();
  const contents = await readFile(DATA_FILE, "utf8");
  return normalizeStore(JSON.parse(contents) as Partial<LocalDataStore>);
}

async function writeStore(store: LocalDataStore): Promise<void> {
  await ensureStoreFile();
  await writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
}

async function mutateStore<T>(mutator: (store: LocalDataStore) => T | Promise<T>): Promise<T> {
  const task = mutationQueue.then(async () => {
    const store = await readStore();
    const result = await mutator(store);
    await writeStore(store);
    return result;
  });

  mutationQueue = task.then(
    () => undefined,
    () => undefined
  );

  return task;
}

function attachMeshFile(product: LocalProductRecord, meshFiles: LocalMeshFileRecord[]) {
  const meshFile = meshFiles.find((entry) => entry.id === product.meshFileId) ?? null;
  return {
    ...clone(product),
    meshFile: meshFile ? clone(meshFile) : null,
  };
}

export async function getLocalUserByEmail(email: string): Promise<LocalUserRecord | null> {
  const store = await readStore();
  const user = store.users.find(
    (entry) => entry.email.toLowerCase() === email.trim().toLowerCase()
  );
  return user ? clone(user) : null;
}

export async function getLocalUserById(id: string): Promise<LocalUserRecord | null> {
  const store = await readStore();
  const user = store.users.find((entry) => entry.id === id);
  return user ? clone(user) : null;
}

export async function countLocalAdminUsers(): Promise<number> {
  const store = await readStore();
  return store.users.filter((user) => user.role === "ADMIN").length;
}

export async function createLocalUser(input: {
  name: string;
  email: string;
  password: string;
  role: LocalUserRole;
}): Promise<LocalUserRecord> {
  return mutateStore((store) => {
    const timestamp = nowIso();
    const user: LocalUserRecord = {
      id: createId("usr"),
      name: input.name,
      email: input.email.trim().toLowerCase(),
      image: null,
      password: input.password,
      role: input.role,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.users.push(user);
    return clone(user);
  });
}

export async function updateLocalUser(input: {
  id: string;
  name?: string | null;
  password?: string | null;
  image?: string | null;
}): Promise<LocalUserRecord | null> {
  return mutateStore((store) => {
    const user = store.users.find((entry) => entry.id === input.id);
    if (!user) {
      return null;
    }

    if (input.name !== undefined) {
      user.name = input.name;
    }
    if (input.password !== undefined) {
      user.password = input.password;
    }
    if (input.image !== undefined) {
      user.image = input.image;
    }
    user.updatedAt = nowIso();

    return clone(user);
  });
}

export async function upsertLocalOAuthUser(input: {
  email: string;
  name?: string | null;
  image?: string | null;
}): Promise<LocalUserRecord> {
  return mutateStore((store) => {
    const existingUser = store.users.find(
      (entry) => entry.email.toLowerCase() === input.email.trim().toLowerCase()
    );

    if (existingUser) {
      if (input.name !== undefined) {
        existingUser.name = input.name;
      }
      if (input.image !== undefined) {
        existingUser.image = input.image;
      }
      existingUser.updatedAt = nowIso();
      return clone(existingUser);
    }

    const timestamp = nowIso();
    const adminUserCount = store.users.filter((user) => user.role === "ADMIN").length;
    const user: LocalUserRecord = {
      id: createId("usr"),
      name: input.name ?? null,
      email: input.email.trim().toLowerCase(),
      image: input.image ?? null,
      password: null,
      role:
        process.env.NODE_ENV !== "production" && adminUserCount === 0
          ? "ADMIN"
          : "CUSTOMER",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.users.push(user);
    return clone(user);
  });
}

export async function listLocalAdminProducts(limit = 24) {
  const store = await readStore();

  return store.products
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, limit)
    .map((product) => clone(product));
}

export async function createLocalProduct(input: {
  name: string;
  slug: string;
  category: string | null;
  shortDescription: string | null;
  description: string | null;
  imageUrl: string | null;
  price: number;
  isActive: boolean;
  modelFile: {
    originalFilename: string;
    storedFilename: string | null;
    storagePath: string | null;
    fileType: string;
    fileSize: number;
  };
}) {
  return mutateStore((store) => {
    const timestamp = nowIso();
    const meshFile: LocalMeshFileRecord = {
      id: createId("mesh"),
      originalFilename: input.modelFile.originalFilename,
      storedFilename: input.modelFile.storedFilename,
      storagePath: input.modelFile.storagePath,
      fileType: input.modelFile.fileType,
      fileSize: input.modelFile.fileSize,
      s3Key: null,
      isProcessed: true,
      createdAt: timestamp,
    };

    const product: LocalProductRecord = {
      id: createId("prd"),
      name: input.name,
      slug: input.slug,
      category: input.category,
      shortDescription: input.shortDescription,
      description: input.description,
      imageUrl: input.imageUrl,
      price: input.price,
      isActive: input.isActive,
      sortOrder: 0,
      meshFileId: meshFile.id,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.meshFiles.push(meshFile);
    store.products.push(product);

    return attachMeshFile(product, [meshFile]);
  });
}

export async function getLocalProductBySlug(slug: string) {
  const store = await readStore();
  const product = store.products.find((entry) => entry.slug === slug && entry.isActive);
  if (!product) {
    return null;
  }

  return attachMeshFile(product, store.meshFiles);
}

export async function listLocalProducts(input: {
  page: number;
  limit: number;
  category: string | null;
  search: string | null;
  sortBy: string;
  sortOrder: string;
}) {
  const store = await readStore();
  const normalizedSearch = input.search?.trim().toLowerCase() ?? "";
  const normalizedCategory = input.category?.trim().toLowerCase() ?? "";

  let filtered = store.products.filter((product) => product.isActive);

  if (normalizedCategory && normalizedCategory !== "all") {
    filtered = filtered.filter(
      (product) => product.category?.toLowerCase() === normalizedCategory
    );
  }

  if (normalizedSearch) {
    filtered = filtered.filter((product) =>
      [product.name, product.description, product.shortDescription]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedSearch))
    );
  }

  const categoryCounts = new Map<string, number>();
  store.products
    .filter((product) => product.isActive)
    .filter((product) => {
      if (!normalizedSearch) {
        return true;
      }

      return [product.name, product.description, product.shortDescription]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedSearch));
    })
    .forEach((product) => {
      if (!product.category) {
        return;
      }

      categoryCounts.set(product.category, (categoryCounts.get(product.category) ?? 0) + 1);
    });

  filtered.sort((left, right) => {
    if (input.sortBy === "price") {
      const leftPrice = left.price ?? 0;
      const rightPrice = right.price ?? 0;
      return input.sortOrder === "desc" ? rightPrice - leftPrice : leftPrice - rightPrice;
    }

    if (input.sortBy === "name") {
      return input.sortOrder === "desc"
        ? right.name.localeCompare(left.name)
        : left.name.localeCompare(right.name);
    }

    if (input.sortBy === "createdAt") {
      return input.sortOrder === "asc"
        ? left.createdAt.localeCompare(right.createdAt)
        : right.createdAt.localeCompare(left.createdAt);
    }

    return left.sortOrder - right.sortOrder || left.name.localeCompare(right.name);
  });

  const total = filtered.length;
  const start = Math.max(0, (input.page - 1) * input.limit);
  const pageProducts = filtered.slice(start, start + input.limit).map((product) =>
    attachMeshFile(product, store.meshFiles)
  );

  const categories = Array.from(categoryCounts.entries())
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([label, count]) => ({
      id: label.toLowerCase(),
      label,
      count,
    }));

  return {
    products: pageProducts,
    total,
    categories,
  };
}

export async function listLocalRelatedProducts(productId: string, category: string | null, take = 4) {
  const store = await readStore();

  return store.products
    .filter(
      (product) =>
        product.isActive &&
        product.id !== productId &&
        product.category === category
    )
    .slice(0, take)
    .map((product) => attachMeshFile(product, store.meshFiles));
}

export async function listLocalOrdersForUser(userId: string) {
  const store = await readStore();

  return store.orders
    .filter((order) => order.userId === userId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((order) => ({
      ...clone(order),
      items: store.orderItems
        .filter((item) => item.orderId === order.id)
        .sort((left, right) => left.createdAt.localeCompare(right.createdAt))
        .map((item) => clone(item)),
    }));
}

export async function createLocalOrder(input: {
  orderNumber: string;
  userId: string | null;
  status: LocalOrderStatus;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingMethod: string;
  shippingAddress: Record<string, unknown>;
  paymentMethod: string | null;
  paymentStatus: LocalPaymentStatus;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  email: string;
  phone: string | null;
  notes: string | null;
  items: Array<{
    productId: string | null;
    name: string;
    slug: string | null;
    material: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}) {
  return mutateStore((store) => {
    const timestamp = nowIso();
    const order: LocalOrderRecord = {
      id: createId("ord"),
      orderNumber: input.orderNumber,
      userId: input.userId,
      status: input.status,
      subtotal: input.subtotal,
      shippingCost: input.shippingCost,
      tax: input.tax,
      total: input.total,
      shippingMethod: input.shippingMethod,
      shippingAddress: clone(input.shippingAddress),
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentStatus,
      razorpayOrderId: input.razorpayOrderId,
      razorpayPaymentId: input.razorpayPaymentId,
      razorpaySignature: input.razorpaySignature,
      email: input.email,
      phone: input.phone,
      notes: input.notes,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const items = input.items.map<LocalOrderItemRecord>((item) => ({
      id: createId("itm"),
      orderId: order.id,
      productId: item.productId,
      name: item.name,
      slug: item.slug,
      material: item.material,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      createdAt: timestamp,
    }));

    store.orders.push(order);
    store.orderItems.push(...items);

    return {
      ...clone(order),
      items: items.map((item) => clone(item)),
    };
  });
}

export async function listLocalAddressesForUser(userId: string) {
  const store = await readStore();
  return store.addresses
    .filter((address) => address.userId === userId)
    .sort((left, right) => Number(right.isDefault) - Number(left.isDefault))
    .map((address) => clone(address));
}

export async function getLocalAddressForUser(userId: string, id: string) {
  const store = await readStore();
  const address = store.addresses.find((entry) => entry.userId === userId && entry.id === id);
  return address ? clone(address) : null;
}

export async function createLocalAddress(
  userId: string,
  input: Omit<LocalAddressRecord, "id" | "userId" | "createdAt" | "updatedAt">
) {
  return mutateStore((store) => {
    const timestamp = nowIso();

    if (input.isDefault) {
      store.addresses.forEach((address) => {
        if (address.userId === userId) {
          address.isDefault = false;
          address.updatedAt = timestamp;
        }
      });
    }

    const address: LocalAddressRecord = {
      id: createId("adr"),
      userId,
      ...input,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    store.addresses.push(address);
    return clone(address);
  });
}

export async function updateLocalAddress(
  userId: string,
  id: string,
  input: Omit<LocalAddressRecord, "id" | "userId" | "createdAt" | "updatedAt">
) {
  return mutateStore((store) => {
    const existing = store.addresses.find((address) => address.userId === userId && address.id === id);
    if (!existing) {
      return null;
    }

    const timestamp = nowIso();

    if (input.isDefault) {
      store.addresses.forEach((address) => {
        if (address.userId === userId && address.id !== id) {
          address.isDefault = false;
          address.updatedAt = timestamp;
        }
      });
    }

    Object.assign(existing, input, { updatedAt: timestamp });
    return clone(existing);
  });
}

export async function deleteLocalAddress(userId: string, id: string): Promise<boolean> {
  return mutateStore((store) => {
    const index = store.addresses.findIndex((address) => address.userId === userId && address.id === id);
    if (index === -1) {
      return false;
    }

    store.addresses.splice(index, 1);
    return true;
  });
}

export async function listLocalQuotesForUser(userId: string) {
  const store = await readStore();

  return store.quoteRequests
    .filter((quote) => quote.userId === userId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map((quote) => ({
      ...clone(quote),
      files: store.quoteFiles
        .filter((file) => file.quoteRequestId === quote.id)
        .map((file) => clone(file)),
    }));
}

export async function createLocalQuote(input: {
  quoteNumber: string;
  userId: string | null;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  service: string;
  material: string;
  quantity: number;
  notes: string | null;
  files: Array<{
    originalFilename: string;
    storedFilename: string;
    s3Key: string;
    s3Bucket: string;
    fileSize: number;
    fileType: string;
  }>;
}) {
  return mutateStore((store) => {
    const timestamp = nowIso();
    const quote: LocalQuoteRecord = {
      id: createId("qte"),
      quoteNumber: input.quoteNumber,
      userId: input.userId,
      status: "PENDING",
      name: input.name,
      email: input.email,
      company: input.company,
      phone: input.phone,
      service: input.service,
      material: input.material,
      quantity: input.quantity,
      notes: input.notes,
      quotedPrice: null,
      responseNotes: null,
      respondedAt: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const files = input.files.map<LocalQuoteFileRecord>((file) => ({
      id: createId("qf"),
      quoteRequestId: quote.id,
      originalFilename: file.originalFilename,
      storedFilename: file.storedFilename,
      s3Key: file.s3Key,
      s3Bucket: file.s3Bucket,
      fileSize: file.fileSize,
      fileType: file.fileType,
      uploadedAt: timestamp,
    }));

    store.quoteRequests.push(quote);
    store.quoteFiles.push(...files);

    return {
      ...clone(quote),
      files: files.map((file) => clone(file)),
    };
  });
}

export async function appendLocalAuditLog(input: {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
  status?: string;
  errorMessage?: string | null;
}) {
  return mutateStore((store) => {
    store.auditLogs.push({
      id: createId("log"),
      userId: input.userId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
      metadata: input.metadata ? clone(input.metadata) : null,
      status: input.status ?? "SUCCESS",
      errorMessage: input.errorMessage ?? null,
      createdAt: nowIso(),
    });
  });
}

export async function createLocalPasswordResetToken(email: string, token: string, expires: Date) {
  return mutateStore((store) => {
    store.passwordResetTokens = store.passwordResetTokens.filter(
      (entry) => entry.email.toLowerCase() !== email.toLowerCase()
    );

    const record: LocalPasswordResetTokenRecord = {
      id: createId("prt"),
      email,
      token,
      expires: expires.toISOString(),
      createdAt: nowIso(),
    };

    store.passwordResetTokens.push(record);
    return clone(record);
  });
}

export async function getLocalPasswordResetToken(token: string) {
  const store = await readStore();
  const record = store.passwordResetTokens.find((entry) => entry.token === token);
  return record ? clone(record) : null;
}

export async function deleteLocalPasswordResetToken(token: string) {
  return mutateStore((store) => {
    store.passwordResetTokens = store.passwordResetTokens.filter((entry) => entry.token !== token);
  });
}
