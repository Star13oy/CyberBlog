'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  viewCount: number
  createdAt: string
  author: { id: string; username: string; name: string | null }
  category: { id: string; name: string; slug: string } | null
  tags: Array<{ id: string; name: string; slug: string }>
}

export default function BlogPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const categoryFilter = searchParams.get('category') || ''

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchQuery)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('status', 'PUBLISHED')
      params.set('page', page.toString())
      params.set('pageSize', pageSize.toString())
      if (searchQuery) params.set('search', searchQuery)
      if (categoryFilter) params.set('category', categoryFilter)

      const res = await fetch(`/api/posts?${params}`)
      const data = await res.json()

      if (data.success) {
        setPosts(data.data.data)
        setTotal(data.data.total)
      }
    } catch (err) {
      console.error('获取文章失败:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [searchQuery, categoryFilter, page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      window.location.href = `/blog?search=${encodeURIComponent(search.trim())}`
    } else {
      window.location.href = '/blog'
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="page-container">
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="page-title">
            <span className="page-title-prefix">{'//'}</span> 博客文章
          </h1>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 items-center">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索文章..."
              className="cyber-input w-48 text-sm py-2"
            />
            <button type="submit" className="cyber-btn px-3 py-2 text-sm border-[#00d4ff] text-[#00d4ff]">
              🔍
            </button>
            {searchQuery && (
              <Link
                href="/blog"
                className="cyber-btn px-3 py-2 text-sm border-[#607080] text-[#607080]"
              >
                ✕
              </Link>
            )}
          </form>
        </div>

        {/* Search Result Info */}
        {searchQuery && (
          <p className="text-[#a8b8c8] mb-4">
            找到 <span className="text-[#00d4ff]">{total}</span> 篇关于 &ldquo;{searchQuery}&rdquo; 的文章
          </p>
        )}

        {/* Posts */}
        {loading ? (
          <div className="text-center py-12 text-[#607080]">加载中...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📭</p>
            <p>{searchQuery ? '未找到匹配的文章' : '暂无文章'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {posts.map((post) => (
              <article key={post.id} className="cyber-card overflow-hidden hover:translate-y-[-8px] relative group card-hover">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[#bf5af2] scale-x-0 group-hover:scale-x-100 transition-transform" />

                <div className="p-7">
                  {post.category && (
                    <span className="tag-purple">{post.category.name}</span>
                  )}
                  <h3 className="text-lg font-semibold text-primary mb-3 group-hover:text-accent transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-secondary leading-relaxed">{post.excerpt}</p>
                  )}
                </div>
                <div className="flex justify-between items-center px-7 py-5 border-t" style={{ borderColor: 'var(--border-color)', background: 'rgba(0,212,255,0.03)' }}>
                  <div className="flex gap-5 meta-text">
                    <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>👁 {post.viewCount}</span>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex gap-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag.id} className="tag-cyan">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="cyber-btn px-4 py-2 border-[#607080] text-[#607080] disabled:opacity-30"
            >
              ← 上一页
            </button>
            <span className="text-[#a8b8c8] px-4">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="cyber-btn px-4 py-2 border-[#607080] text-[#607080] disabled:opacity-30"
            >
              下一页 →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}