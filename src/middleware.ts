import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify, SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'cyberblog-jwt-secret-2026')

// 不需要认证的路径
const PUBLIC_PATHS = [
  '/',
  '/blog',
  '/login',
  '/register',
  '/about',
  '/api/auth/login',
  '/api/auth/register',
]

// 静态资源路径前缀
const PUBLIC_PREFIXES = [
  '/_next',
  '/favicon.ico',
  '/images',
  '/api/auth',
  '/api/posts',
  '/api/stats',
  '/api/daily-logs',
]

function isPublicPath(pathname: string): boolean {
  // 检查完全匹配的公开路径
  if (PUBLIC_PATHS.includes(pathname)) {
    return true
  }

  // 检查前缀匹配的公开路径
  if (PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return true
  }

  // 博客文章详情页是公开的
  if (pathname.match(/^\/blog\/[^/]+$/)) {
    return true
  }

  // 日报详情页是公开的
  if (pathname.match(/^\/daily\/[^/]+$/)) {
    return true
  }

  return false
}

async function verifyToken(token: string): Promise<{ userId: string; email: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string; email: string; role: string }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 公开路径直接放行
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // 获取 token
  const token = request.cookies.get('auth-token')?.value

  // 没有 token，重定向到登录页
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 验证 token
  const payload = await verifyToken(token)

  if (!payload) {
    // token 无效，重定向到登录页
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    const response = NextResponse.redirect(loginUrl)
    // 清除无效的 cookie
    response.cookies.delete('auth-token')
    return response
  }

  // 检查管理员权限
  if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 将用户信息添加到请求头
  const response = NextResponse.next()
  response.headers.set('x-user-id', payload.userId)
  response.headers.set('x-user-email', payload.email)
  response.headers.set('x-user-role', payload.role)

  return response
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     * - public 文件夹中的文件
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}