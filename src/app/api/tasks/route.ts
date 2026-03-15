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

// 创建任务
export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { dailyLogId, title, description, status, progress } = body

    if (!dailyLogId || !title) {
      return NextResponse.json(
        { success: false, error: '日报ID和任务标题不能为空' },
        { status: 400 }
      )
    }

    // 检查日报是否存在及权限
    const dailyLog = await prisma.daily_logs.findUnique({
      where: { id: dailyLogId },
      select: { id: true, authorId: true },
    })

    if (!dailyLog) {
      return NextResponse.json(
        { success: false, error: '日报不存在' },
        { status: 404 }
      )
    }

    if (dailyLog.authorId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '没有权限添加任务' },
        { status: 403 }
      )
    }

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        progress: progress || 0,
        dailyLogId,
      },
    })

    return NextResponse.json({
      success: true,
      data: task,
      message: '任务创建成功',
    })
  } catch (error) {
    console.error('创建任务错误:', error)
    return NextResponse.json(
      { success: false, error: '创建任务失败' },
      { status: 500 }
    )
  }
}

// 更新任务状态
export async function PUT(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { taskId, title, description, status, progress } = body

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: '任务ID不能为空' },
        { status: 400 }
      )
    }

    // 检查任务是否存在及权限
    const task = await prisma.tasks.findUnique({
      where: { id: taskId },
      include: {
        dailyLog: {
          select: { authorId: true },
        },
      },
    })

    if (!task) {
      return NextResponse.json(
        { success: false, error: '任务不存在' },
        { status: 404 }
      )
    }

    if (task.dailyLog.authorId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '没有权限编辑此任务' },
        { status: 403 }
      )
    }

    const updatedTask = await prisma.tasks.update({
      where: { id: taskId },
      data: {
        title,
        description,
        status,
        progress,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: '任务更新成功',
    })
  } catch (error) {
    console.error('更新任务错误:', error)
    return NextResponse.json(
      { success: false, error: '更新任务失败' },
      { status: 500 }
    )
  }
}

// 删除任务
export async function DELETE(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: '任务ID不能为空' },
        { status: 400 }
      )
    }

    const task = await prisma.tasks.findUnique({
      where: { id: taskId },
      include: {
        dailyLog: {
          select: { authorId: true },
        },
      },
    })

    if (!task) {
      return NextResponse.json(
        { success: false, error: '任务不存在' },
        { status: 404 }
      )
    }

    if (task.dailyLog.authorId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '没有权限删除此任务' },
        { status: 403 }
      )
    }

    await prisma.tasks.delete({
      where: { id: taskId },
    })

    return NextResponse.json({
      success: true,
      message: '任务删除成功',
    })
  } catch (error) {
    console.error('删除任务错误:', error)
    return NextResponse.json(
      { success: false, error: '删除任务失败' },
      { status: 500 }
    )
  }
}