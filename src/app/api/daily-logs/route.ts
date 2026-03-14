import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取日报列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const authorId = searchParams.get('authorId')

    const skip = (page - 1) * pageSize

    const where: Record<string, unknown> = {}
    if (authorId) where.authorId = authorId

    const [logs, total] = await Promise.all([
      prisma.dailyLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { date: 'desc' },
        include: {
          author: {
            select: { id: true, username: true, name: true },
          },
          tasks: true,
        },
      }),
      prisma.dailyLog.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        data: logs,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('获取日报列表错误:', error)
    return NextResponse.json(
      { success: false, error: '获取日报列表失败' },
      { status: 500 }
    )
  }
}

// 创建日报
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, title, content, tasks, authorId, aiGenerated } = body

    // 检查该日期是否已有日报
    const existingLog = await prisma.dailyLog.findFirst({
      where: {
        date: new Date(date),
        authorId: authorId || 'default-user',
      },
    })

    if (existingLog) {
      return NextResponse.json(
        { success: false, error: '该日期已有日报' },
        { status: 400 }
      )
    }

    const dailyLog = await prisma.dailyLog.create({
      data: {
        date: new Date(date),
        title,
        content,
        aiGenerated: aiGenerated || false,
        authorId: authorId || 'default-user',
        tasks: tasks
          ? {
              create: tasks.map((task: { title: string; description?: string; status?: string; progress?: number }) => ({
                title: task.title,
                description: task.description,
                status: task.status || 'TODO',
                progress: task.progress || 0,
              })),
            }
          : undefined,
      },
      include: {
        tasks: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: dailyLog,
      message: '日报创建成功',
    })
  } catch (error) {
    console.error('创建日报错误:', error)
    return NextResponse.json(
      { success: false, error: '创建日报失败' },
      { status: 500 }
    )
  }
}