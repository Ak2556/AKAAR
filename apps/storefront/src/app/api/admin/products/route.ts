import { NextResponse } from "next/server";
import { prisma } from "@akaar/db";
import { auth } from "@/lib/auth";
import {
  createLocalProduct,
  getLocalProductBySlug,
  getLocalUserById,
} from "@/lib/local-data-store";
import {
  isAllowedPreviewImage,
  isAllowedPreviewModel,
  removeSavedAsset,
  saveProductAsset,
  slugifyProductName,
} from "@/lib/local-product-assets";
import { isLocalDataMode } from "@/lib/local-runtime";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_MODEL_SIZE_BYTES = 50 * 1024 * 1024;

async function requireAdminUser() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = isLocalDataMode()
    ? await getLocalUserById(session.user.id)
    : await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, role: true },
      });

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return user;
}

export async function POST(request: Request) {
  const adminUser = await requireAdminUser();

  if (!adminUser) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const formData = await request.formData();
  const name = String(formData.get("name") || "").trim();
  const providedSlug = String(formData.get("slug") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const shortDescription = String(formData.get("shortDescription") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const rawPrice = String(formData.get("price") || "").trim();
  const isActive = formData.get("isActive") === "true";
  const previewImage = formData.get("previewImage");
  const modelFile = formData.get("modelFile");

  if (!name) {
    return NextResponse.json({ error: "Product name is required" }, { status: 400 });
  }

  const slug = slugifyProductName(providedSlug || name);
  if (!slug) {
    return NextResponse.json({ error: "A valid slug is required" }, { status: 400 });
  }

  const price = Number(rawPrice);
  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "Price must be a positive number" }, { status: 400 });
  }

  if (!(modelFile instanceof File) || modelFile.size === 0) {
    return NextResponse.json({ error: "A GLB or GLTF model file is required" }, { status: 400 });
  }

  if (!isAllowedPreviewModel(modelFile.name)) {
    return NextResponse.json(
      { error: "Only .glb and .gltf files are supported for product previews" },
      { status: 400 }
    );
  }

  if (modelFile.size > MAX_MODEL_SIZE_BYTES) {
    return NextResponse.json(
      { error: "3D model file must be 50 MB or smaller" },
      { status: 400 }
    );
  }

  if (previewImage instanceof File && previewImage.size > 0) {
    if (!isAllowedPreviewImage(previewImage.name)) {
      return NextResponse.json(
        { error: "Preview image must be PNG, JPG, WEBP, or AVIF" },
        { status: 400 }
      );
    }

    if (previewImage.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Preview image must be 10 MB or smaller" },
        { status: 400 }
      );
    }
  }

  const existingProduct = isLocalDataMode()
    ? await getLocalProductBySlug(slug)
    : await prisma.product.findUnique({
        where: { slug },
        select: { id: true },
      });

  if (existingProduct) {
    return NextResponse.json(
      { error: "A product with this slug already exists" },
      { status: 409 }
    );
  }

  const savedAssets: string[] = [];

  try {
    const savedModel = await saveProductAsset({
      file: modelFile,
      slug,
      kind: "model",
    });
    savedAssets.push(savedModel.absolutePath);

    const savedImage =
      previewImage instanceof File && previewImage.size > 0
        ? await saveProductAsset({
            file: previewImage,
            slug,
            kind: "image",
          })
        : null;

    if (savedImage) {
      savedAssets.push(savedImage.absolutePath);
    }

    const product = isLocalDataMode()
      ? await createLocalProduct({
          name,
          slug,
          category: category || null,
          shortDescription: shortDescription || null,
          description: description || null,
          imageUrl: savedImage?.publicPath || null,
          price,
          isActive,
          modelFile: {
            originalFilename: modelFile.name,
            storedFilename: savedModel.storedFilename,
            storagePath: savedModel.publicPath,
            fileType: modelFile.type || "model/gltf-binary",
            fileSize: modelFile.size,
          },
        })
      : await prisma.product.create({
          data: {
            name,
            slug,
            category: category || null,
            shortDescription: shortDescription || null,
            description: description || null,
            imageUrl: savedImage?.publicPath || null,
            price,
            isActive,
            meshFile: {
              create: {
                originalFilename: modelFile.name,
                storedFilename: savedModel.storedFilename,
                storagePath: savedModel.publicPath,
                fileType: modelFile.type || "model/gltf-binary",
                fileSize: modelFile.size,
                isProcessed: true,
              },
            },
          },
          include: {
            meshFile: true,
          },
        });

    return NextResponse.json(
      {
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    await Promise.all(savedAssets.map((assetPath) => removeSavedAsset(assetPath)));
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
