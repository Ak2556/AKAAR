import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Seed Products and associated Mesh Files
  console.log("🌱 Seeding products...");

  // 1. Create mock Mesh_File entries first
  const meshFile1 = await prisma.mesh_File.upsert({
    where: { s3Key: "product-meshes/gear.stl" },
    update: {},
    create: {
      originalFilename: "gear.stl",
      storedFilename: "gear.stl",
      storagePath: "meshes/gear.stl",
      fileType: "STL",
      fileSize: 1024,
      s3Key: "product-meshes/gear.stl",
      s3Bucket: "akaar-meshes",
      volumeMm3: 10000,
      boundingBoxX: 50,
      boundingBoxY: 50,
      boundingBoxZ: 10,
      isProcessed: true,
    },
  });

  const meshFile2 = await prisma.mesh_File.upsert({
    where: { s3Key: "product-meshes/phone-stand.stl" },
    update: {},
    create: {
      originalFilename: "phone-stand.stl",
      storedFilename: "phone-stand.stl",
      storagePath: "meshes/phone-stand.stl",
      fileType: "STL",
      fileSize: 2048,
      s3Key: "product-meshes/phone-stand.stl",
      s3Bucket: "akaar-meshes",
      volumeMm3: 25000,
      boundingBoxX: 80,
      boundingBoxY: 100,
      boundingBoxZ: 60,
      isProcessed: true,
    },
  });

  const meshFile3 = await prisma.mesh_File.upsert({
    where: { s3Key: "product-meshes/voronoi-lamp.stl" },
    update: {},
    create: {
      originalFilename: "voronoi-lamp.stl",
      storedFilename: "voronoi-lamp.stl",
      storagePath: "meshes/voronoi-lamp.stl",
      fileType: "STL",
      fileSize: 4096,
      s3Key: "product-meshes/voronoi-lamp.stl",
      s3Bucket: "akaar-meshes",
      volumeMm3: 150000,
      boundingBoxX: 120,
      boundingBoxY: 120,
      boundingBoxZ: 200,
      isProcessed: true,
    },
  });

  // 2. Create Product entries that link to the Mesh_Files
  const products = [
    {
      name: "Replacement Gear",
      slug: "replacement-gear",
      description:
        "A standard replacement gear for small machinery. Highly durable and printed with precision for a perfect fit. Ideal for repairs and DIY projects.",
      shortDescription: "Durable 50mm replacement gear.",
      imageUrl: "/placeholders/gear.png", // Placeholder path
      category: "Mechanical Parts",
      meshFileId: meshFile1.id,
      isActive: true,
      sortOrder: 1,
    },
    {
      name: "Minimalist Phone Stand",
      slug: "minimalist-phone-stand",
      description:
        "A sleek and minimalist phone stand, perfect for your desk. Holds your phone vertically or horizontally for easy viewing. Lightweight yet sturdy.",
      shortDescription: "Sleek and sturdy phone stand.",
      imageUrl: "/placeholders/phone-stand.png", // Placeholder path
      category: "Desk Accessories",
      meshFileId: meshFile2.id,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "Voronoi Lamp Shade",
      slug: "voronoi-lamp-shade",
      description:
        "A beautiful Voronoi pattern lamp shade that creates stunning light patterns. A perfect centerpiece for any room. (Note: Lamp base and bulb not included).",
      shortDescription: "Stylish Voronoi pattern lamp shade.",
      imageUrl: "/placeholders/voronoi-lamp.png", // Placeholder path
      category: "Home Decor",
      meshFileId: meshFile3.id,
      isActive: true,
      sortOrder: 3,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`✅ Seeded ${products.length} products`);

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
