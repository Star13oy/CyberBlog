import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取文章列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '10')
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'PUBLISHED'
    const search = searchParams.get('search')

    const skip = (page - 1) * pageSize

    // 构建查询条件
    const where: Record<string, unknown> = { status }

    if (category) {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ]
    }

    // 查询文章
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, username: true, name: true, avatar: true },
          },
          category: true,
          tags: true,
        },
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        data: posts,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('获取文章列表错误:', error)
    return NextResponse.json(
      { success: false, error: '获取文章列表失败' },
      { status: 500 }
    )
  }
}

// 创建文章
export async function POST(request: NextRequest) {
  try {
    // TODO: 添加认证中间件
    const body = await request.json()
    const { title, content, excerpt, categoryId, tags, authorId, status } = body

    // 生成 slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '')

    // 创建文章
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        categoryId,
        authorId: authorId || 'default-user',
        status: status || 'DRAFT',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        tags: tags
          ? {
              connectOrCreate: tags.map((tag: string) => ({
                where: { name: tag },
                create: {
                  name: tag,
                  slug: tag.toLowerCase().replace(/\s+/g, '-'),
                },
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        tags: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: post,
      message: '文章创建成功',
    })
  } catch (error) {
    console.error('创建文章错误:', error)
    return NextResponse.json(
      { success: false, error: '创建文章失败' },
      { status: 500 }
    )
  }
}