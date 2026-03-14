import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证输入
    const validatedData = registerSchema.parse(body)

    // 检查用户是否已存在
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '邮箱或用户名已被注册' },
        { status: 400 }
      )
    }

    // 加密密码
    const hashedPassword = await hashPassword(validatedData.password)

    // 创建用户
    const user = await prisma.users.create({
      data: {
        id: `user-${Date.now()}`,
        email: validatedData.email,
        username: validatedData.username,
        password: hashedPassword,
        name: validatedData.name || validatedData.username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: '注册成功',
    })
  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      { success: false, error: '注册失败，请检查输入' },
      { status: 500 }
    )
  }
}