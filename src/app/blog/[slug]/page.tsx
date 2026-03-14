'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    username: string
    name: string | null
    avatar: string | null
  }
  replies: Array<{
    id: string
    content: string
    createdAt: string
    author: {
      id: string
      username: string
      name: string | null
      avatar: string | null
    }
  }>
}

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  viewCount: number
  status: string
  createdAt: string
  publishedAt: string | null
  author: {
    id: string
    username: string
    name: string | null
    avatar: string | null
  }
  category: {
    id: string
    name: string
    slug: string
  } | null
  tags: Array<{ id: string; name: string; slug: string }>
  comments: Comment[]
}

interface TocItem {
  id: string
  text: string
  level: number
}

// 从 Markdown 内容提取标题
function extractHeadings(content: string): TocItem[] {
  const headings: TocItem[] = []
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    const match = line.match(/^(#{1,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      const id = `heading-${index}`
      headings.push({ id, text, level })
    }
  })

  return headings
}

// 侧边大纲栏
function TableOfContents({ headings, activeId }: { headings: TocItem[]; activeId: string }) {
  if (headings.length === 0) return null

  return (
    <nav className="toc-nav">
      <h4 className="toc-title">{'//'} 目录</h4>
      <ul className="toc-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`toc-item toc-item-level-${heading.level} ${activeId === heading.id ? 'active' : ''}`}
          >
            <a href={`#${heading.id}`} className="toc-link">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<Post | null>(null)
  const [error, setError] = useState('')
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [activeHeading, setActiveHeading] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // 提取标题
  const headings = useMemo(() => {
    if (!post) return []
    return extractHeadings(post.content)
  }, [post?.content])

  // 监听滚动高亮当前标题
  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id))
      const scrollPosition = window.scrollY + 150

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i]
        if (el && el.offsetTop <= scrollPosition) {
          setActiveHeading(headings[i].id)
          return
        }
      }
      setActiveHeading(headings[0]?.id || '')
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`)
        const data = await res.json()

        if (data.success) {
          setPost(data.data)
        } else {
          setError(data.error || '文章不存在')
        }
      } catch (err) {
        setError('加载文章失败')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  // 检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        setIsLoggedIn(res.ok)
      } catch {
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-muted">加载中...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--danger)] mb-4">{error || '文章不存在'}</p>
          <Link href="/blog" className="text-accent hover:underline">
            返回博客列表
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post?.id,
          content: newComment.trim(),
        }),
      })

      const data = await res.json()
      if (data.success) {
        const postRes = await fetch(`/api/posts/${slug}`)
        const postData = await postRes.json()
        if (postData.success) {
          setPost(postData.data)
        }
        setNewComment('')
      } else {
        alert(data.error || '发表失败')
      }
    } catch (err) {
      alert('发表评论失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post?.id,
          content: replyContent.trim(),
          parentId,
        }),
      })

      const data = await res.json()
      if (data.success) {
        const postRes = await fetch(`/api/posts/${slug}`)
        const postData = await postRes.json()
        if (postData.success) {
          setPost(postData.data)
        }
        setReplyTo(null)
        setReplyContent('')
      } else {
        alert(data.error || '回复失败')
      }
    } catch (err) {
      alert('回复失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇文章吗？文章将被归档。')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success) {
        router.push('/blog')
      } else {
        alert(data.error || '删除失败')
      }
    } catch (err) {
      console.error('删除文章失败:', err)
      alert('删除失败')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="page-container">
      {/* 侧边大纲栏 */}
      {headings.length > 0 && (
        <TableOfContents headings={headings} activeId={activeHeading} />
      )}

      <main className="post-main">
        {/* 文章头部 */}
        <header className="post-header">
          {/* 标签 */}
          {post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map(tag => (
                <span key={tag.id} className="tag-cyan">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* 标题 */}
          <h1 className="post-title">
            <span className="page-title-prefix">{'//'}</span> {post.title}
          </h1>

          {/* 元信息 */}
          <div className="post-meta">
            <span className="meta-item">
              <span className="meta-icon">👤</span>
              <span>{post.author.name || post.author.username}</span>
            </span>
            <span className="meta-item">
              <span className="meta-icon">📅</span>
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </span>
            <span className="meta-item">
              <span className="meta-icon">👁</span>
              <span>{post.viewCount} 次阅读</span>
            </span>
            {post.category && (
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="meta-item meta-link"
              >
                <span className="meta-icon">📁</span>
                <span>{post.category.name}</span>
              </Link>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="post-actions">
            {isLoggedIn && (
              <>
                <Link
                  href={`/blog/${post.slug}/edit`}
                  className="cyber-btn cyber-btn-sm cyber-btn-primary"
                >
                  ✏️ 编辑
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="cyber-btn cyber-btn-sm border-[#ff453a] text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] disabled:opacity-50"
                >
                  {deleting ? '删除中...' : '🗑️ 删除'}
                </button>
              </>
            )}
            <Link
              href="/blog"
              className="cyber-btn cyber-btn-sm"
            >
              ← 返回列表
            </Link>
          </div>
        </header>

        {/* 文章内容 */}
        <article className="post-content cyber-card">
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children, ...props }) => {
                  const text = String(children)
                  const index = headings.findIndex(h => h.text === text && h.level === 1)
                  const id = index >= 0 ? headings[index].id : undefined
                  return (
                    <h1 id={id} className="md-h1" {...props}>
                      {children}
                    </h1>
                  )
                },
                h2: ({ children, ...props }) => {
                  const text = String(children)
                  const index = headings.findIndex(h => h.text === text && h.level === 2)
                  const id = index >= 0 ? headings[index].id : undefined
                  return (
                    <h2 id={id} className="md-h2" {...props}>
                      {children}
                    </h2>
                  )
                },
                h3: ({ children, ...props }) => {
                  const text = String(children)
                  const index = headings.findIndex(h => h.text === text && h.level === 3)
                  const id = index >= 0 ? headings[index].id : undefined
                  return (
                    <h3 id={id} className="md-h3" {...props}>
                      {children}
                    </h3>
                  )
                },
                h4: ({ children }) => (
                  <h4 className="md-h4">{children}</h4>
                ),
                p: ({ children }) => (
                  <p className="md-p">{children}</p>
                ),
                code: ({ className, children, ...props }) => {
                  // react-markdown 使用 node 属性来判断是否内联
                  // 代码块会有 className 或者是多行内容
                  const isInline = !className && typeof children === 'string' && !children.includes('\n')
                  const match = /language-(\w+)/.exec(className || '')
                  return isInline ? (
                    <code className="md-code-inline" {...props}>{children}</code>
                  ) : (
                    <div className="md-code-block">
                      {match && (
                        <div className="md-code-lang">{match[1]}</div>
                      )}
                      <pre className="md-pre">
                        <code className={className} {...props}>{children}</code>
                      </pre>
                    </div>
                  )
                },
                pre: ({ children }) => (
                  <>{children}</>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="md-blockquote">{children}</blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="md-ul">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="md-ol">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="md-li">{children}</li>
                ),
                a: ({ href, children }) => (
                  <a href={href} className="md-a" target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>
                    {children}
                  </a>
                ),
                hr: () => (
                  <hr className="md-hr" />
                ),
                table: ({ children }) => (
                  <div className="md-table-wrapper">
                    <table className="md-table">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="md-th">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="md-td">{children}</td>
                ),
                img: ({ src, alt }) => (
                  <figure className="md-figure">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={alt} className="md-img" />
                    {alt && <figcaption className="md-figcaption">{alt}</figcaption>}
                  </figure>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* 评论区 */}
        <section className="post-comments cyber-card">
          <h2 className="section-title">
            <span className="page-title-prefix">{'//'}</span> 评论 ({post.comments.length})
          </h2>

          {/* 评论表单 */}
          <form onSubmit={handleSubmitComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="写下你的评论..."
              className="cyber-textarea"
              rows={4}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="cyber-btn cyber-btn-primary"
            >
              {submitting ? '发表中...' : '发表评论'}
            </button>
          </form>

          {/* 评论列表 */}
          {post.comments.length > 0 ? (
            <div className="comment-list">
              {post.comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">
                    {comment.author.name?.[0] || comment.author.username[0]}
                  </div>
                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.author.name || comment.author.username}
                      </span>
                      <span className="comment-date">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="comment-content">{comment.content}</p>

                    {/* 回复按钮 */}
                    <button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="comment-reply-btn"
                    >
                      {replyTo === comment.id ? '取消回复' : '回复'}
                    </button>

                    {/* 回复表单 */}
                    {replyTo === comment.id && (
                      <div className="reply-form">
                        <textarea
                          value={replyContent}
                          onChange={e => setReplyContent(e.target.value)}
                          placeholder="写下你的回复..."
                          className="cyber-textarea cyber-textarea-sm"
                          rows={3}
                        />
                        <button
                          onClick={() => handleSubmitReply(comment.id)}
                          disabled={submitting || !replyContent.trim()}
                          className="cyber-btn cyber-btn-sm cyber-btn-primary"
                        >
                          发送回复
                        </button>
                      </div>
                    )}

                    {/* 回复列表 */}
                    {comment.replies.length > 0 && (
                      <div className="reply-list">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="reply-item">
                            <div className="reply-avatar">
                              {reply.author.name?.[0] || reply.author.username[0]}
                            </div>
                            <div className="reply-body">
                              <div className="reply-header">
                                <span className="reply-author">
                                  {reply.author.name || reply.author.username}
                                </span>
                                <span className="reply-date">
                                  {formatDate(reply.createdAt)}
                                </span>
                              </div>
                              <p className="reply-content">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="comment-empty">暂无评论，来抢沙发吧~</p>
          )}
        </section>
      </main>
    </div>
  )
}