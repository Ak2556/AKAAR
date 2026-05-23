/**
 * Seed script: upload product images to Supabase storage and insert product records.
 * Run from apps/storefront/: node --env-file .env.local scripts/seed-products.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { tmpdir } from "os";
import { join, extname } from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const PHOTOS_DIR = "/Users/aena/Downloads/Photos-3-001 (2)";
const BUCKET = "product-assets";

// Each product may declare a single `image_file` (legacy) or an array of
// `image_files` (preferred — the first entry becomes the cover image).
const products = [
  {
    name: "Lord Hanuman Dhyan Mudra Figurine",
    slug: "hanuman-dhyan-mudra",
    category: "Figurine",
    price: 599,
    short_description:
      "A meditation-pose Hanuman with 'राम' scripture — white PLA, every bead and drape resolved in print.",
    description:
      "Lord Hanuman sits in Dhyan Mudra — hands resting on folded legs, eyes closed in devotion. The 'राम' scripture plaque rests before him. Every detail is resolved in the print: the crown, mala beads, arm bands, and the fine folds of the dhoti. Printed in pure white PLA with FDM additive manufacturing at the AKAAR studio, Jaipur. Lightweight, desk or altar-ready.",
    image_files: [`${PHOTOS_DIR}/20260428_065416.jpg`],
  },
  {
    name: "Ganesha Temple Mandap",
    slug: "ganesha-temple-mandap",
    category: "Figurine",
    price: 599,
    short_description:
      "Saffron mandap with white Ganesha inside — a complete two-piece altar scene, gift-ready.",
    description:
      "A complete altar composition in two parts: the saffron-orange temple pavilion with carved columns, arched gateway, and tiered dome — and the white Ganesha figurine seated inside. Each piece is printed separately and assembled as a scene. The contrast between the warm orange shell and the white figure is intentional. Makes a complete gift or home altar piece.",
    image_files: [`${PHOTOS_DIR}/IMG-20260416-WA0059.jpg`],
  },
  {
    name: "The EARTH Lamp",
    slug: "plant-grow-light",
    category: "Lamp",
    price: 1999,
    short_description:
      "A 3D-printed grow light enclosure with warm LED — clean geometry, desk or windowsill ready.",
    description:
      "A rounded-square enclosure with a warm LED grow light built into the ceiling cavity, illuminating the open planter tray below. Clean white PLA with precise tolerances — the light module sits flush, the base is flat and stable. Works with herbs, wheatgrass, succulents, or any compact indoor plant. Plug it in, add your plants.",
    image_files: [`${PHOTOS_DIR}/20260502_105551.jpg`],
  },
];

async function uploadImage(imagePath, slug, index, timestamp) {
  if (!existsSync(imagePath)) {
    throw new Error(`Image not found: ${imagePath}`);
  }

  // Resize to max 2000px on longest side to keep under upload limits
  const ext = extname(imagePath);
  const suffix = index === 0 ? "" : `-${index + 1}`;
  const tmpPath = join(tmpdir(), `akaar-${slug}${suffix}${ext}`);
  execSync(`sips -Z 2000 "${imagePath}" --out "${tmpPath}" 2>/dev/null`);

  const fileBuffer = readFileSync(tmpPath);
  const storagePath = `images/${timestamp}-${slug}${suffix}${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    contentType: "image/jpeg",
    cacheControl: "31536000",
    upsert: true,
  });

  if (error) throw new Error(`Upload failed for ${slug}${suffix}: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function seedProduct(product) {
  console.log(`\n▶ ${product.name}`);

  const files = Array.isArray(product.image_files) && product.image_files.length
    ? product.image_files
    : product.image_file
    ? [product.image_file]
    : [];

  if (!files.length) throw new Error(`No image files declared for ${product.slug}`);

  const timestamp = Date.now();
  const imageUrls = [];
  for (let i = 0; i < files.length; i++) {
    const url = await uploadImage(files[i], product.slug, i, timestamp);
    imageUrls.push(url);
    console.log(`  ✓ Image ${i + 1}/${files.length} uploaded: ${url}`);
  }

  const { error } = await supabase.from("products").upsert(
    {
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price,
      short_description: product.short_description,
      description: product.description,
      image_url: imageUrls[0],
      images: imageUrls,
      is_active: true,
    },
    { onConflict: "slug" }
  );

  if (error) throw new Error(`DB insert failed for ${product.slug}: ${error.message}`);
  console.log(`  ✓ Product record upserted with ${imageUrls.length} image(s)`);
}

(async () => {
  console.log("AKAAR product seed script");
  console.log(`Supabase: ${SUPABASE_URL}`);
  console.log(`Bucket:   ${BUCKET}\n`);

  for (const product of products) {
    try {
      await seedProduct(product);
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
      process.exit(1);
    }
  }

  console.log("\n✅ All products seeded successfully.");
})();
