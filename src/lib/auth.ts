import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const SALT_ROUNDS = 12
const JWT_SECRET = process.env.JWT_SECRET || 'cyberblog-jwt-secret-2026'

/**
 * 加密密码
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * 验证密码
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * 用户信息类型
 */
export interface UserPayload {
  userId: string
  email: string
  role: string
}

/**
 * 从请求中提取用户信息
 */
export function getUserFromRequest(request: NextRequest): UserPayload | null {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload
  } catch {
    return null
  }
}

/**
 * 检查用户是否已登录
 */
export function requireAuth(request: NextRequest): { success: true; user: UserPayload } | { success: false; error: string } {
  const user = getUserFromRequest(request)
  if (!user) {
    return { success: false, error: '请先登录' }
  }
  return { success: true, user }
}

/**
 * 检查用户是否是管理员
 */
export function requireAdmin(request: NextRequest): { success: true; user: UserPayload } | { success: false; error: string } {
  const result = requireAuth(request)
  if (!result.success) return result

  if (result.user.role !== 'ADMIN') {
    return { success: false, error: '需要管理员权限' }
  }
  return result
}

/**
 * 检查用户是否是资源所有者或管理员
 */
export function requireOwnerOrAdmin(
  request: NextRequest,
  resourceOwnerId: string
): { success: true; user: UserPayload } | { success: false; error: string } {
  const result = requireAuth(request)
  if (!result.success) return result

  if (result.user.role !== 'ADMIN' && result.user.userId !== resourceOwnerId) {
    return { success: false, error: '无权操作此资源' }
  }
  return result
}

/**
 * 角色枚举
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const

/**
 * 用户状态枚举
 */
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BANNED: 'BANNED',
} as const