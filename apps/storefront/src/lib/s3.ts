import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  ALLOWED_QUOTE_EXTENSIONS,
  MAX_QUOTE_FILE_SIZE,
  isValidQuoteFile,
} from "@/lib/quote-files";

let _s3Client: S3Client | null = null;

function hasValue(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function hasS3UploadConfig(): boolean {
  return (
    hasValue(process.env.AWS_ACCESS_KEY_ID) &&
    hasValue(process.env.AWS_SECRET_ACCESS_KEY) &&
    hasValue(process.env.AWS_S3_BUCKET)
  );
}

function getS3Client(): S3Client {
  if (!_s3Client) {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("AWS credentials not configured");
    }
    _s3Client = new S3Client({
      region: process.env.AWS_REGION || "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return _s3Client;
}

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "akaar-uploads";

export interface UploadResult {
  key: string;
  bucket: string;
  url: string;
}

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

  return getSignedUrl(getS3Client(), command, { expiresIn });
}

export async function getPresignedDownloadUrl(
  key: string,
  expiresIn = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(getS3Client(), command, { expiresIn });
}

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

  await getS3Client().send(command);

  return {
    key,
    bucket: BUCKET_NAME,
    url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "ap-south-1"}.amazonaws.com/${key}`,
  };
}

export async function deleteFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await getS3Client().send(command);
}

export async function objectExistsInS3(key: string): Promise<boolean> {
  const command = new HeadObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  try {
    await getS3Client().send(command);
    return true;
  } catch {
    return false;
  }
}

export function generateQuoteFileKey(
  quoteId: string,
  filename: string
): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `quotes/${quoteId}/${timestamp}-${sanitizedFilename}`;
}

export function generateMeshFileKey(filename: string): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `meshes/${timestamp}-${sanitizedFilename}`;
}

export const ALLOWED_QUOTE_FILE_TYPES = [
  "model/stl",
  "application/sla",
  "model/obj",
  "application/x-tgif",
  "model/gltf-binary",
  "model/gltf+json",
  "application/octet-stream",
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/zip",
  "application/x-rar-compressed",
];

export const ALLOWED_EXTENSIONS = [
  ...ALLOWED_QUOTE_EXTENSIONS,
];

export const MAX_FILE_SIZE = MAX_QUOTE_FILE_SIZE;

export function isValidFileType(filename: string): boolean {
  return isValidQuoteFile(filename);
}

export { BUCKET_NAME };
