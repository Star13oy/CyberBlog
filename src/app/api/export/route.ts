import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// 导出数据
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all' // posts, daily-logs, stats, all
    const format = searchParams.get('format') || 'json' // json, csv

    const exportData: Record<string, unknown> = {}

    if (type === 'posts' || type === 'all') {
      const posts = await prisma.posts.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          author: { select: { username: true, name: true } },
          category: { select: { name: true } },
          tags: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
      exportData.posts = posts.map(p => ({
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        viewCount: p.viewCount,
        likeCount: p.likeCount,
        commentCount: p.commentCount,
        category: p.category?.name || '',
        tags: p.tags.map(t => t.name).join(', '),
        author: p.author.name || p.author.username,
        createdAt: p.createdAt.toISOString(),
        publishedAt: p.publishedAt?.toISOString() || '',
      }))
    }

    if (type === 'daily-logs' || type === 'all') {
      const dailyLogs = await prisma.daily_logs.findMany({
        include: {
          author: { select: { username: true, name: true } },
          tasks: true,
        },
        orderBy: { date: 'desc' },
      })
      exportData.dailyLogs = dailyLogs.map(log => ({
        date: log.date.toISOString().split('T')[0],
        title: log.title || '',
        content: log.content,
        tasks: log.tasks.map(t => ({
          title: t.title,
          status: t.status,
          progress: t.progress,
        })),
        totalTasks: log.tasks.length,
        completedTasks: log.tasks.filter(t => t.status === 'DONE').length,
        author: log.author.name || log.author.username,
        createdAt: log.createdAt.toISOString(),
      }))
    }

    if (type === 'stats' || type === 'all') {
      const [postCount, totalViews, dailyLogCount, taskStats] = await Promise.all([
        prisma.posts.count({ where: { status: 'PUBLISHED' } }),
        prisma.posts.aggregate({
          where: { status: 'PUBLISHED' },
          _sum: { viewCount: true },
        }),
        prisma.daily_logs.count(),
        prisma.tasks.groupBy({
          by: ['status'],
          _count: true,
        }),
      ])

      exportData.stats = {
        postCount,
        totalViews: totalViews._sum.viewCount || 0,
        dailyLogCount,
        taskStats: taskStats.reduce((acc, t) => {
          acc[t.status] = t._count
          return acc
        }, {} as Record<string, number>),
        exportedAt: new Date().toISOString(),
      }
    }

    // 返回 JSON 格式
    if (format === 'json') {
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="cyberblog-export-${new Date().toISOString().split('T')[0]}.json"`,
        },
      })
    }

    // 返回 CSV 格式
    if (format === 'csv') {
      let csv = ''

      // 文章 CSV
      if (exportData.posts) {
        csv += '# 文章数据\n'
        csv += '标题,链接,摘要,阅读量,点赞数,评论数,分类,标签,作者,发布时间\n'
        for (const post of exportData.posts as Array<Record<string, unknown>>) {
          csv += `"${post.title}","${post.slug}","${(post.excerpt as string || '').replace(/"/g, '""')}",${post.viewCount},${post.likeCount},${post.commentCount},"${post.category}","${post.tags}","${post.author}","${post.publishedAt}"\n`
        }
        csv += '\n'
      }

      // 日报 CSV
      if (exportData.dailyLogs) {
        csv += '# 日报数据\n'
        csv += '日期,标题,任务数,完成任务,完成率,作者\n'
        for (const log of exportData.dailyLogs as Array<Record<string, unknown>>) {
          const tasks = log.tasks as Array<Record<string, unknown>>
          const completed = log.completedTasks as number
          const total = log.totalTasks as number
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0
          csv += `"${log.date}","${log.title}",${total},${completed},${progress}%,"${log.author}"\n`
        }
        csv += '\n'
      }

      // 统计 CSV
      if (exportData.stats) {
        const stats = exportData.stats as Record<string, unknown>
        csv += '# 统计数据\n'
        csv += '指标,数值\n'
        csv += `文章总数,${stats.postCount}\n`
        csv += `总阅读量,${stats.totalViews}\n`
        csv += `日报总数,${stats.dailyLogCount}\n`
        const taskStats = stats.taskStats as Record<string, number>
        csv += `待办任务,${taskStats.TODO || 0}\n`
        csv += `进行中任务,${taskStats.IN_PROGRESS || 0}\n`
        csv += `已完成任务,${taskStats.DONE || 0}\n`
      }

      return new NextResponse('\uFEFF' + csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="cyberblog-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({ success: false, error: '不支持的格式' }, { status: 400 })
  } catch (error) {
    console.error('导出数据错误:', error)
    return NextResponse.json(
      { success: false, error: '导出失败' },
      { status: 500 }
    )
  }
}