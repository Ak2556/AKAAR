-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM (
    'LOGIN_SUCCESS',
    'LOGIN_FAILED',
    'LOGOUT',
    'REGISTER',
    'PASSWORD_RESET_REQUEST',
    'PASSWORD_RESET_SUCCESS',
    'PASSWORD_CHANGE',
    'PROFILE_UPDATE',
    'ADDRESS_CREATE',
    'ADDRESS_UPDATE',
    'ADDRESS_DELETE',
    'ORDER_CREATE',
    'ORDER_UPDATE',
    'ORDER_CANCEL',
    'PAYMENT_SUCCESS',
    'PAYMENT_FAILED',
    'QUOTE_CREATE',
    'QUOTE_UPDATE',
    'ADMIN_USER_UPDATE',
    'ADMIN_ORDER_UPDATE',
    'ADMIN_PRODUCT_CREATE',
    'ADMIN_PRODUCT_UPDATE',
    'ADMIN_PRODUCT_DELETE'
);

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('SUCCESS', 'FAILED', 'BLOCKED');

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "status" "AuditStatus" NOT NULL DEFAULT 'SUCCESS',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
