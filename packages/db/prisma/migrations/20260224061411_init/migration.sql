-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "imageUrl" TEXT,
    "category" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "meshFileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mesh_File" (
    "id" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "storedFilename" TEXT,
    "storagePath" TEXT,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "s3Key" TEXT,
    "s3Bucket" TEXT,
    "volumeMm3" DECIMAL(65,30),
    "surfaceAreaMm2" DECIMAL(65,30),
    "boundingBoxX" DECIMAL(65,30),
    "boundingBoxY" DECIMAL(65,30),
    "boundingBoxZ" DECIMAL(65,30),
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mesh_File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_meshFileId_key" ON "Product"("meshFileId");

-- CreateIndex
CREATE UNIQUE INDEX "Mesh_File_s3Key_key" ON "Mesh_File"("s3Key");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_meshFileId_fkey" FOREIGN KEY ("meshFileId") REFERENCES "Mesh_File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
