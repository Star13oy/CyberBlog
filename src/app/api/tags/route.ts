import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取所有标签
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const where = search
      ? { name: { contains: search } }
      : {}

    const tags = await prisma.tags.findMany({
      where,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { posts: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: tags,
    })
  } catch (error) {
    console.error('获取标签错误:', error)
    return NextResponse.json(
      { success: false, error: '获取标签失败' },
      { status: 500 }
    )
  }
}