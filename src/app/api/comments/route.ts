import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest, requireOwnerOrAdmin } from '@/lib/auth'

// 获取评论列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { success: false, error: '缺少文章ID' },
        { status: 400 }
      )
    }

    const commentsData = await prisma.comments.findMany({
      where: { postId, parentId: null },
      include: {
        users: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        other_comments: {
          include: {
            users: {
              select: { id: true, username: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform the response to use 'author' instead of 'users'
    const comments = commentsData.map(comment => ({
      ...comment,
      author: comment.users,
      replies: comment.other_comments.map(reply => ({
        ...reply,
        author: reply.users,
      })),
    }))

    return NextResponse.json({ success: true, data: comments })
  } catch (error) {
    console.error('获取评论错误:', error)
    return NextResponse.json(
      { success: false, error: '获取评论失败' },
      { status: 500 }
    )
  }
}

// 创建评论
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
    const { postId, content, parentId } = body

    if (!postId || !content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: '文章ID和评论内容不能为空' },
        { status: 400 }
      )
    }

    // 验证文章存在
    const post = await prisma.posts.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

    // 如果是回复，验证父评论存在
    if (parentId) {
      const parentComment = await prisma.comments.findUnique({
        where: { id: parentId },
      })
      if (!parentComment) {
        return NextResponse.json(
          { success: false, error: '父评论不存在' },
          { status: 404 }
        )
      }
    }

    const commentData = await prisma.comments.create({
      data: {
        id: `comment-${Date.now()}`,
        content: content.trim(),
        postId,
        authorId: user.userId,
        parentId: parentId || null,
        updatedAt: new Date(),
      },
      include: {
        users: {
          select: { id: true, username: true, name: true, avatar: true },
        },
      },
    })

    // Transform the response to use 'author' instead of 'users'
    const comment = {
      ...commentData,
      author: commentData.users,
    }

    // 更新文章评论数
    await prisma.posts.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } },
    })

    return NextResponse.json({
      success: true,
      data: comment,
      message: '评论发表成功',
    })
  } catch (error) {
    console.error('创建评论错误:', error)
    return NextResponse.json(
      { success: false, error: '发表评论失败' },
      { status: 500 }
    )
  }
}

// 删除评论
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
    const commentId = searchParams.get('commentId')

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: '缺少评论ID' },
        { status: 400 }
      )
    }

    const comment = await prisma.comments.findUnique({
      where: { id: commentId },
      include: { other_comments: true },
    })

    if (!comment) {
      return NextResponse.json(
        { success: false, error: '评论不存在' },
        { status: 404 }
      )
    }

    // 验证权限：只有评论作者或管理员可以删除
    if (comment.authorId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: '无权删除此评论' },
        { status: 403 }
      )
    }

    // 删除评论（包括回复）
    const replyCount = comment.other_comments.length
    await prisma.comments.delete({
      where: { id: commentId },
    })

    // 更新文章评论数
    await prisma.posts.update({
      where: { id: comment.postId },
      data: { commentCount: { decrement: 1 + replyCount } },
    })

    return NextResponse.json({
      success: true,
      message: '评论删除成功',
    })
  } catch (error) {
    console.error('删除评论错误:', error)
    return NextResponse.json(
      { success: false, error: '删除评论失败' },
      { status: 500 }
    )
  }
}