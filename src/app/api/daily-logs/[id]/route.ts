import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'cyberblog-jwt-secret-2026'

function getUserFromRequest(request: NextRequest): { userId: string; role: string } | null {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
  } catch {
    return null
  }
}

// 获取日报详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const dailyLogData = await prisma.daily_logs.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        tasks: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!dailyLogData) {
      return NextResponse.json(
        { success: false, error: '日报不存在' },
        { status: 404 }
      )
    }

    // Transform response
    const dailyLog = { ...dailyLogData, author: dailyLogData.users }

    return NextResponse.json({
      success: true,
      data: dailyLog,
    })
  } catch (error) {
    console.error('获取日报详情错误:', error)
    return NextResponse.json(
      { success: false, error: '获取日报详情失败' },
      { status: 500 }
    )
  }
}

// 更新日报
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { id } = await params

    const existingLog = await prisma.daily_logs.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    })

    if (!existingLog) {
      return NextResponse.json(
        { success: false, error: '日报不存在' },
        { status: 404 }
      )
    }

    if (existingLog.authorId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '没有权限编辑此日报' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, content } = body

    const dailyLogData = await prisma.daily_logs.update({
      where: { id },
      data: { title, content, updatedAt: new Date() },
      include: {
        tasks: true,
        users: {
          select: { id: true, username: true, name: true },
        },
      },
    })

    // Transform response
    const dailyLog = { ...dailyLogData, author: dailyLogData.users }

    return NextResponse.json({
      success: true,
      data: dailyLog,
      message: '日报更新成功',
    })
  } catch (error) {
    console.error('更新日报错误:', error)
    return NextResponse.json(
      { success: false, error: '更新日报失败' },
      { status: 500 }
    )
  }
}

// 删除日报
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { id } = await params

    const existingLog = await prisma.daily_logs.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    })

    if (!existingLog) {
      return NextResponse.json(
        { success: false, error: '日报不存在' },
        { status: 404 }
      )
    }

    if (existingLog.authorId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '没有权限删除此日报' },
        { status: 403 }
      )
    }

    await prisma.tasks.deleteMany({ where: { dailyLogId: id } })
    await prisma.daily_logs.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: '日报删除成功',
    })
  } catch (error) {
    console.error('删除日报错误:', error)
    return NextResponse.json(
      { success: false, error: '删除日报失败' },
      { status: 500 }
    )
  }
}