import { prisma } from "@akaar/db";
import { appendLocalAuditLog } from "@/lib/local-data-store";
import { isLocalDataMode } from "@/lib/local-runtime";

// Audit action types matching Prisma enum
export type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "REGISTER"
  | "PASSWORD_RESET_REQUEST"
  | "PASSWORD_RESET_SUCCESS"
  | "PASSWORD_CHANGE"
  | "PROFILE_UPDATE"
  | "ADDRESS_CREATE"
  | "ADDRESS_UPDATE"
  | "ADDRESS_DELETE"
  | "ORDER_CREATE"
  | "ORDER_UPDATE"
  | "ORDER_CANCEL"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "QUOTE_CREATE"
  | "QUOTE_UPDATE"
  | "ADMIN_USER_UPDATE"
  | "ADMIN_ORDER_UPDATE"
  | "ADMIN_PRODUCT_CREATE"
  | "ADMIN_PRODUCT_UPDATE"
  | "ADMIN_PRODUCT_DELETE";

export type AuditStatus = "SUCCESS" | "FAILED" | "BLOCKED";

interface AuditLogParams {
  userId?: string | null;
  action: AuditAction;
  entityType: string;
  entityId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
  status?: AuditStatus;
  errorMessage?: string | null;
}

/**
 * Create an audit log entry for tracking sensitive operations
 */
export async function createAuditLog(params: AuditLogParams): Promise<void> {
  try {
    if (isLocalDataMode()) {
      await appendLocalAuditLog({
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        metadata: params.metadata ?? null,
        status: params.status,
        errorMessage: params.errorMessage,
      });
      return;
    }

    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
        status: params.status ?? "SUCCESS",
        errorMessage: params.errorMessage,
      },
    });
  } catch (error) {
    // Log to console but don't fail the main operation
    console.error("Failed to create audit log:", error);
  }
}

/**
 * Extract IP address from request headers
 */
export function getIpFromRequest(request: Request): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return null;
}

/**
 * Extract user agent from request headers
 */
export function getUserAgentFromRequest(request: Request): string | null {
  return request.headers.get("user-agent");
}

/**
 * Helper to create audit context from a request
 */
export function getAuditContext(request: Request): {
  ipAddress: string | null;
  userAgent: string | null;
} {
  return {
    ipAddress: getIpFromRequest(request),
    userAgent: getUserAgentFromRequest(request),
  };
}
