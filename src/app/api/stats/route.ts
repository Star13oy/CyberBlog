import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取统计数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'

    if (type === 'overview') {
      // 获取总览统计
      const [
        postCount,
        totalViews,
        dailyLogCount,
        taskStats,
        categoryStats,
      ] = await Promise.all([
        prisma.post.count({ where: { status: 'PUBLISHED' } }),
        prisma.post.aggregate({
          _sum: { viewCount: true },
          where: { status: 'PUBLISHED' },
        }),
        prisma.dailyLog.count(),
        prisma.task.groupBy({
          by: ['status'],
          _count: { id: true },
        }),
        prisma.category.findMany({
          include: {
            _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
          },
        }),
      ])

      return NextResponse.json({
        success: true,
        data: {
          postCount,
          totalViews: totalViews._sum.viewCount || 0,
          dailyLogCount,
          taskStats: taskStats.reduce((acc, item) => {
            acc[item.status] = item._count.id
            return acc
          }, {} as Record<string, number>),
          categoryStats: categoryStats.map(c => ({
            name: c.name,
            count: c._count.posts,
          })),
        },
      })
    }

    if (type === 'trends') {
      // 获取趋势数据（最近7天）
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const stats = await prisma.statistic.findMany({
        where: {
          date: { gte: sevenDaysAgo },
        },
        orderBy: { date: 'asc' },
      })

      return NextResponse.json({
        success: true,
        data: stats,
      })
    }

    return NextResponse.json({
      success: false,
      error: '无效的统计类型',
    }, { status: 400 })
  } catch (error) {
    console.error('获取统计数据错误:', error)
    return NextResponse.json(
      { success: false, error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}