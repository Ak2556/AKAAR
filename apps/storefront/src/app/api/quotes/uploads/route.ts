import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import {
  BUCKET_NAME,
  generateQuoteFileKey,
  getPresignedUploadUrl,
  hasS3UploadConfig,
} from "@/lib/s3";
import { MAX_QUOTE_FILE_SIZE, isValidQuoteFile } from "@/lib/quote-files";
import { withRateLimit, rateLimitPresets } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimitResult = await withRateLimit(request, rateLimitPresets.strict);
  if (rateLimitResult) return rateLimitResult;

  try {
    if (!hasS3UploadConfig()) {
      return NextResponse.json({ error: "File uploads are not configured" }, { status: 503 });
    }

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
    }

    const filename = typeof body.filename === "string" ? body.filename.trim() : "";
    const contentType = typeof body.contentType === "string" && body.contentType.trim()
      ? body.contentType.trim()
      : "application/octet-stream";
    const fileSize = Number(body.fileSize);

    if (!filename || !isValidQuoteFile(filename)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > MAX_QUOTE_FILE_SIZE) {
      return NextResponse.json({ error: "Files must be 100MB or smaller" }, { status: 400 });
    }

    const uploadGroupId = `pending-${nanoid(12)}`;
    const s3Key = generateQuoteFileKey(uploadGroupId, filename);
    const uploadUrl = await getPresignedUploadUrl(s3Key, contentType, 900);

    return NextResponse.json({
      uploadUrl,
      s3Key,
      s3Bucket: BUCKET_NAME,
      storedFilename: s3Key.split("/").pop() ?? filename,
      fileType: contentType,
    });
  } catch (error) {
    console.error("Error preparing quote upload:", error);
    return NextResponse.json({ error: "Failed to prepare file upload" }, { status: 500 });
  }
}
