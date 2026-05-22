export const ALLOWED_QUOTE_EXTENSIONS = [
  ".stl",
  ".obj",
  ".step",
  ".stp",
  ".iges",
  ".igs",
  ".3mf",
  ".fbx",
  ".gltf",
  ".glb",
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".zip",
  ".rar",
] as const;

export const MAX_QUOTE_FILE_SIZE = 100 * 1024 * 1024;

export function getFileExtension(filename: string): string {
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : "";
}

export function isValidQuoteFile(filename: string): boolean {
  const extension = getFileExtension(filename);
  return ALLOWED_QUOTE_EXTENSIONS.some((allowed) => allowed === extension);
}
