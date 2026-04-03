import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing sample products (production mode - no sample data)
  console.log("🧹 Clearing sample products...");

  // Delete sample products if they exist
  await prisma.product.deleteMany({
    where: {
      slug: {
        in: ["replacement-gear", "minimalist-phone-stand", "voronoi-lamp-shade"]
      }
    }
  });

  // Delete sample mesh files if they exist
  await prisma.mesh_File.deleteMany({
    where: {
      s3Key: {
        in: [
          "product-meshes/gear.stl",
          "product-meshes/phone-stand.stl",
          "product-meshes/voronoi-lamp.stl"
        ]
      }
    }
  });

  console.log("✅ Sample data cleared - ready for production");
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
