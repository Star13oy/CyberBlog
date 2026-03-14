import Link from 'next/link'
import { prisma } from '@/lib/prisma'

// 动态渲染，不在构建时查询数据库
export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  // 获取文章列表
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { id: true, username: true, name: true } },
      category: true,
      tags: true,
    },
  })

  return (
    <div className="min-h-screen pt-[72px]">
      {/* 主内容 */}
      <main className="max-w-6xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8 font-mono">
          <span className="text-[#00d4ff]" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>{'//'}</span> 博客文章
        </h1>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-[#607080]">
            <p className="text-4xl mb-4">📭</p>
            <p>暂无文章</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {posts.map((post) => (
              <article key={post.id} className="cyber-card overflow-hidden hover:translate-y-[-8px] relative group">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00d4ff] to-[#bf5af2] scale-x-0 group-hover:scale-x-100 transition-transform" />
                <div className="p-7">
                  {post.category && (
                    <span className="inline-block px-3 py-1 bg-[rgba(191,90,242,0.12)] text-[#bf5af2] text-xs font-semibold rounded mb-4 border border-[rgba(191,90,242,0.25)]">
                      {post.category.name}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#00d4ff] transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-[#a8b8c8] leading-relaxed">{post.excerpt}</p>
                  )}
                </div>
                <div className="flex justify-between items-center px-7 py-5 bg-[rgba(0,212,255,0.03)] border-t border-[rgba(0,212,255,0.1)]">
                  <div className="flex gap-5 text-xs text-[#607080]">
                    <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>👁 {post.viewCount}</span>
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex gap-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag.id} className="text-xs text-[#00d4ff] bg-[rgba(0,212,255,0.1)] px-2 py-1 rounded">
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
      </main>
    </div>
  )
}