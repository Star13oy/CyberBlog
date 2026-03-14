import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'cyberblog-jwt-secret-2026'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.json(
      { success: false, error: '未登录' },
      { status: 401 }
    )
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }

    return NextResponse.json({
      success: true,
      data: {
        id: decoded.userId,
        username: decoded.email.split('@')[0],
        name: decoded.email.split('@')[0],
        role: decoded.role,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Token无效' },
      { status: 401 }
    )
  }
}