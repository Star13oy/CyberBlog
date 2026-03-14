import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取文章详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        category: true,
        tags: true,
        comments: {
          where: { parentId: null },
          include: {
            author: {
              select: { id: true, username: true, name: true, avatar: true },
            },
            replies: {
              include: {
                author: {
                  select: { id: true, username: true, name: true, avatar: true },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

    // 增加阅读量
    await prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json({
      success: true,
      data: post,
    })
  } catch (error) {
    console.error('获取文章详情错误:', error)
    return NextResponse.json(
      { success: false, error: '获取文章详情失败' },
      { status: 500 }
    )
  }
}

// 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { title, content, excerpt, categoryId, tags, status } = body

    const post = await prisma.post.update({
      where: { slug },
      data: {
        title,
        content,
        excerpt,
        categoryId,
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
        tags: tags
          ? {
              set: [],
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
      message: '文章更新成功',
    })
  } catch (error) {
    console.error('更新文章错误:', error)
    return NextResponse.json(
      { success: false, error: '更新文章失败' },
      { status: 500 }
    )
  }
}

// 删除文章 (软删除，改为 ARCHIVED 状态)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // 安全操作：将文章状态改为 ARCHIVED 而不是真正删除
    const post = await prisma.post.update({
      where: { slug },
      data: { status: 'ARCHIVED' },
    })

    return NextResponse.json({
      success: true,
      message: '文章已归档',
    })
  } catch (error) {
    console.error('删除文章错误:', error)
    return NextResponse.json(
      { success: false, error: '删除文章失败' },
      { status: 500 }
    )
  }
}