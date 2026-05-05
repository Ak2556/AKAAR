import { createAdminClient } from '@/lib/supabase/admin'

export type AuditAction =
  | 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'REGISTER'
  | 'PASSWORD_RESET_REQUEST' | 'PASSWORD_RESET_SUCCESS' | 'PASSWORD_CHANGE'
  | 'PROFILE_UPDATE' | 'ADDRESS_CREATE' | 'ADDRESS_UPDATE' | 'ADDRESS_DELETE'
  | 'ORDER_CREATE' | 'ORDER_UPDATE' | 'ORDER_CANCEL'
  | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED'
  | 'QUOTE_CREATE' | 'QUOTE_UPDATE'
  | 'ADMIN_USER_UPDATE' | 'ADMIN_ORDER_UPDATE'
  | 'ADMIN_PRODUCT_CREATE' | 'ADMIN_PRODUCT_UPDATE' | 'ADMIN_PRODUCT_DELETE'

export type AuditStatus = 'SUCCESS' | 'FAILED' | 'BLOCKED'

interface AuditLogParams {
  userId?: string | null
  action: AuditAction
  entityType: string
  entityId?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  metadata?: Record<string, unknown> | null
  status?: AuditStatus
  errorMessage?: string | null
}

export async function createAuditLog(params: AuditLogParams): Promise<void> {
  try {
    const admin = createAdminClient()
    await admin.from('audit_logs').insert({
      user_id:       params.userId ?? null,
      action:        params.action,
      entity_type:   params.entityType,
      entity_id:     params.entityId ?? undefined,
      ip_address:    params.ipAddress ?? null,
      user_agent:    params.userAgent ?? null,
      metadata:      params.metadata ?? null,
      status:        params.status ?? 'SUCCESS',
      error_message: params.errorMessage ?? null,
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}

export function getIpFromRequest(request: Request): string | null {
  const fwd = request.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return request.headers.get('x-real-ip')
}

export function getUserAgentFromRequest(request: Request): string | null {
  return request.headers.get('user-agent')
}

export function getAuditContext(request: Request) {
  return {
    ipAddress: getIpFromRequest(request),
    userAgent: getUserAgentFromRequest(request),
  }
}
