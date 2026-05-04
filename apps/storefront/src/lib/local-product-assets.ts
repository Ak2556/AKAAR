import path from "path";
import { mkdir, unlink, writeFile } from "fs/promises";

const PRODUCT_UPLOAD_ROOT = path.join(
  process.cwd(),
  "public",
  "uploads",
  "products"
);

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);
const MODEL_EXTENSIONS = new Set([".glb", ".gltf"]);

export function slugifyProductName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function getExtension(filename: string): string {
  const extension = path.extname(filename || "").toLowerCase();
  return extension || "";
}

function sanitizeFilename(filename: string): string {
  const parsed = path.parse(filename);
  const base = parsed.name.replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/-+/g, "-");
  const extension = parsed.ext.replace(/[^a-zA-Z0-9.]/g, "").toLowerCase();
  return `${base || "file"}${extension}`;
}

export function isAllowedPreviewImage(filename: string): boolean {
  return IMAGE_EXTENSIONS.has(getExtension(filename));
}

export function isAllowedPreviewModel(filename: string): boolean {
  return MODEL_EXTENSIONS.has(getExtension(filename));
}

export interface SavedProductAsset {
  absolutePath: string;
  publicPath: string;
  storedFilename: string;
}

export async function saveProductAsset(options: {
  file: File;
  slug: string;
  kind: "image" | "model";
}): Promise<SavedProductAsset> {
  const sanitizedName = sanitizeFilename(options.file.name);
  const timestamp = Date.now();
  const storedFilename = `${options.kind}-${timestamp}-${sanitizedName}`;
  const targetDirectory = path.join(PRODUCT_UPLOAD_ROOT, options.slug);
  const absolutePath = path.join(targetDirectory, storedFilename);

  await mkdir(targetDirectory, { recursive: true });

  const arrayBuffer = await options.file.arrayBuffer();
  await writeFile(absolutePath, Buffer.from(arrayBuffer));

  return {
    absolutePath,
    publicPath: `/uploads/products/${options.slug}/${storedFilename}`,
    storedFilename,
  };
}

export async function removeSavedAsset(absolutePath: string): Promise<void> {
  try {
    await unlink(absolutePath);
  } catch {}
}
