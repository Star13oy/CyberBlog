import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'cyberblog-jwt-secret-2026'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证输入
    const validatedData = loginSchema.parse(body)

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    // 验证密码
    const isValid = await verifyPassword(validatedData.password, user.password)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: '邮箱或密码错误' },
        { status: 401 }
      )
    }

    // 检查用户状态
    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, error: '账户已被禁用' },
        { status: 403 }
      )
    }

    // 生成 JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user

    const response = NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: '登录成功',
    })

    // 设置 HttpOnly Cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 天
      path: '/',
    })

    return response
  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { success: false, error: '登录失败' },
      { status: 500 }
    )
  }
}