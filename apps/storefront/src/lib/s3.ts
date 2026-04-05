import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "akaar-uploads";

export interface UploadResult {
  key: string;
  bucket: string;
  url: string;
}

/**
 * Generate a presigned URL for client-side uploads
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generate a presigned URL for downloading/viewing files
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Upload a file directly to S3 (server-side)
 */
export async function uploadToS3(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<UploadResult> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return {
    key,
    bucket: BUCKET_NAME,
    url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com/${key}`,
  };
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Generate a unique S3 key for quote files
 */
export function generateQuoteFileKey(
  quoteId: string,
  filename: string
): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `quotes/${quoteId}/${timestamp}-${sanitizedFilename}`;
}

/**
 * Generate a unique S3 key for mesh files
 */
export function generateMeshFileKey(filename: string): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `meshes/${timestamp}-${sanitizedFilename}`;
}

// Allowed file types for quote uploads
export const ALLOWED_QUOTE_FILE_TYPES = [
  // 3D Files
  "model/stl",
  "application/sla",
  "model/obj",
  "application/x-tgif",
  "model/gltf-binary",
  "model/gltf+json",
  "application/octet-stream", // For .stl, .obj files
  // Documents
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  // Archives
  "application/zip",
  "application/x-rar-compressed",
];

export const ALLOWED_EXTENSIONS = [
  ".stl",
  ".obj",
  ".step",
  ".stp",
  ".iges",
  ".igs",
  ".3mf",
  ".gltf",
  ".glb",
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".zip",
  ".rar",
];

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function isValidFileType(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));
  return ALLOWED_EXTENSIONS.includes(ext);
}

export { s3Client, BUCKET_NAME };
