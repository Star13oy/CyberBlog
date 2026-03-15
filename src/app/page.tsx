import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// 浮动粒子
function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -5 }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-[2px] h-[2px] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? 'var(--primary)' : '#bf5af2',
            boxShadow: i % 2 === 0
              ? '0 0 6px var(--primary), 0 0 12px var(--primary), 0 0 20px rgba(0,212,255,0.5)'
              : '0 0 6px #bf5af2, 0 0 12px #bf5af2, 0 0 20px rgba(191,90,242,0.5)',
            animation: `floatUp ${18 + Math.random() * 12}s infinite`,
            animationDelay: `${Math.random() * 20}s`,
          }}
        />
      ))}
    </div>
  )
}

// 侧边栏
function Sidebar({ postCount, dailyLogCount }: { postCount: number; dailyLogCount: number }) {
  return (
    <aside className="w-[280px] fixed top-[72px] bottom-0 left-0 p-6 overflow-y-auto backdrop-blur-sm hidden lg:block sidebar" style={{ zIndex: 20 }}>
      {/* Agent 状态 */}
      <div className="mb-8">
        <h3 className="sidebar-title">{'//'} AGENT_STATUS</h3>
        <div className="sidebar-card">
          {/* 顶部动态渐变线 */}
          <div className="gradient-line-top" />
          {/* 头像和信息 */}
          <div className="flex items-center gap-4 mb-4">
            <div className="sidebar-avatar">🤖</div>
            <div>
              <h4 className="sidebar-name">Cyber Agent</h4>
              <div className="sidebar-status">
                <span className="status-dot" />
                <span>ONLINE</span>
              </div>
            </div>
          </div>
          {/* 统计数据 */}
          <div className="sidebar-stats">
            <div className="sidebar-stat-item">
              <div className="sidebar-stat-value">{postCount}</div>
              <div className="sidebar-stat-label">文章</div>
            </div>
            <div className="sidebar-stat-item">
              <div className="sidebar-stat-value">{dailyLogCount}</div>
              <div className="sidebar-stat-label">日报</div>
            </div>
          </div>
        </div>
      </div>

      {/* 快速导航 */}
      <div className="mb-8">
        <h3 className="sidebar-title">{'//'} NAVIGATION</h3>
        <ul className="space-y-1.5">
          <li className="sidebar-nav-item active">
            <Link href="/" className="flex items-center justify-between w-full">
              <span className="flex items-center gap-3">
                <span>🏠</span>
                <span>首页</span>
              </span>
            </Link>
          </li>
          <li className="sidebar-nav-item">
            <Link href="/blog" className="flex items-center justify-between w-full">
              <span className="flex items-center gap-3">
                <span>📚</span>
                <span>博客文章</span>
              </span>
              <span className="sidebar-nav-count">{postCount}</span>
            </Link>
          </li>
          <li className="sidebar-nav-item">
            <Link href="/daily" className="flex items-center justify-between w-full">
              <span className="flex items-center gap-3">
                <span>📅</span>
                <span>每日日报</span>
              </span>
              <span className="sidebar-nav-count">{dailyLogCount}</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* 热门标签 */}
      <div>
        <h3 className="sidebar-title">{'//'} TECH_STACK</h3>
        <div className="flex flex-wrap gap-2">
          {['Next.js', 'TypeScript', 'Prisma', 'MySQL', 'Tailwind', 'Claude'].map((tag) => (
            <span key={tag} className="sidebar-tag">{tag}</span>
          ))}
        </div>
      </div>
    </aside>
  )
}

// 终端模拟器
function Terminal() {
  return (
    <div className="terminal">
      {/* 顶部渐变线 */}
      <div className="gradient-line-top" />
      {/* 终端标题栏 */}
      <div className="terminal-header">
        <span className="terminal-dot red" />
        <span className="terminal-dot yellow" />
        <span className="terminal-dot green" />
        <span className="terminal-title">CYBER-BLOG@AGENT:~</span>
      </div>
      {/* 终端内容 */}
      <div className="terminal-content">
        <div className="relative z-10">
          <div className="mb-2">
            <span className="terminal-prompt">$ </span>
            <span className="terminal-command">claude --version</span>
          </div>
          <div className="terminal-output">Claude Code v2.1.72</div>
          <div className="terminal-output">Model: claude-sonnet-4-6</div>
          <div className="terminal-success mt-2">✓ AI Agent Ready</div>
          {/* 光标行 */}
          <div className="mt-5 flex items-center">
            <span className="terminal-prompt">$ </span>
            <span className="terminal-cursor" />
          </div>
        </div>
      </div>
    </div>
  )
}

// 统计卡片
function StatCard({ icon, value, label, color, href }: { icon: string; value: number; label: string; color: string; href?: string }) {
  const content = (
    <>
      {/* 图标 */}
      <div className="stat-icon">{icon}</div>
      {/* 数值 */}
      <div className="stat-value">{value}</div>
      {/* 标签 */}
      <div className="stat-label">{label}</div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={`stat-card stat-card-${color} block hover:scale-105 transition-transform cursor-pointer`}>
        {content}
      </Link>
    )
  }

  return (
    <div className={`stat-card stat-card-${color}`}>
      {content}
    </div>
  )
}

// 文章卡片
function PostCard({ title, excerpt, category, date, views, slug }: { title: string; excerpt: string; category: string; date: string; views: number; slug: string }) {
  return (
    <Link href={`/blog/${slug}`}>
      <article className="post-card">
        {/* 顶部渐变线 */}
        <div className="gradient-line-hover" />
        {/* 内容区 */}
        <div className="p-6">
          {/* 分类标签 */}
          <span className="tag-purple">{category}</span>
          {/* 标题 */}
          <h3 className="post-card-title">{title}</h3>
          {/* 摘要 */}
          <p className="post-card-excerpt">{excerpt}</p>
        </div>
        {/* 底部元信息 */}
        <div className="post-card-footer">
          <div className="flex gap-5 meta-text">
            <span>📅 {date}</span>
            <span>👁 {views}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default async function HomePage() {
  const [postCount, dailyLogCount, recentPostsData] = await Promise.all([
    prisma.posts.count({ where: { status: 'PUBLISHED' } }),
    prisma.daily_logs.count(),
    prisma.posts.findMany({
      where: { status: 'PUBLISHED' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        categories: true,
        users: {
          select: { name: true, username: true },
        },
      },
    }),
  ])

  // Transform to match expected format
  const recentPosts = recentPostsData.map(post => ({
    ...post,
    category: post.categories,
    author: post.users,
  }))

  return (
    <div className="min-h-screen relative">
      <Particles />
      <Sidebar postCount={postCount} dailyLogCount={dailyLogCount} />

      {/* 主内容 */}
      <main className="lg:ml-[280px] pt-[72px]">
        <div className="max-w-[1100px] mx-auto px-8 py-6">
          {/* Hero */}
          <section className="text-center py-8 relative">
            {/* HUD 角落装饰 */}
            <div className="hero-line" />

            {/* Badge 标签 */}
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span>AI AGENT 自动维护的开发日志系统</span>
            </div>

            {/* 主标题 */}
            <h1 className="hero-title">
              <span className="neon-title-cyber inline-block">CYBER</span>
              <span className="neon-title-blog inline-block ml-4">BLOG</span>
            </h1>

            {/* 副标题 */}
            <p className="hero-subtitle">
              一个由 <span className="text-accent">AI Agent</span> 驱动的技术博客系统
              <br />
              <span className="text-muted">自动记录开发进程 · 整理技术笔记 · 生成每日日报</span>
            </p>

            {/* 操作按钮 */}
            <div className="flex justify-center gap-4">
              <Link href="/blog" className="neon-btn px-8 py-3 rounded font-semibold text-sm tracking-wide">
                📚 浏览文章
              </Link>
              <Link href="/daily" className="neon-btn px-8 py-3 rounded font-semibold text-sm tracking-wide" style={{ borderColor: '#bf5af2', color: '#bf5af2' }}>
                📅 每日日报
              </Link>
            </div>
          </section>

          {/* 统计卡片 */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="📄" value={postCount} label="文章总数" color="blue" href="/blog" />
            <StatCard icon="📅" value={dailyLogCount} label="每日日报" color="green" href="/daily" />
            <StatCard icon="⏱️" value={1} label="活跃天数" color="purple" href="/dashboard" />
            <StatCard icon="👁️" value={recentPosts.reduce((sum, p) => sum + p.viewCount, 0)} label="总阅读量" color="yellow" />
          </section>

          {/* 终端 */}
          <section className="mb-12">
            <Terminal />
          </section>

          {/* 最新文章 */}
          <section>
            <div className="flex justify-between items-center mb-7">
              <h2 className="progress-title">
                <span className="progress-title-bar" />
                最新文章
              </h2>
              <Link href="/blog" className="text-sm text-accent hover:translate-x-1 transition-all flex items-center gap-1.5 group hover:text-[var(--primary-light)]">
                查看全部
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {recentPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                {recentPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    title={post.title}
                    excerpt={post.excerpt || post.content.slice(0, 100) + '...'}
                    category={post.category?.name || '未分类'}
                    date={new Date(post.createdAt).toLocaleDateString('zh-CN')}
                    views={post.viewCount}
                    slug={post.slug}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <p>暂无文章，敬请期待...</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="lg:ml-[280px] border-t py-12 text-center relative footer">
        {/* 顶部渐变线 */}
        <div className="gradient-line-footer" />
        {/* 链接区 */}
        <div className="flex justify-center gap-12 mb-6">
          <Link href="https://github.com" className="footer-link" target="_blank">GitHub</Link>
          <Link href="/blog" className="footer-link">博客文章</Link>
          <Link href="/daily" className="footer-link">每日日报</Link>
        </div>
        {/* 版权信息 */}
        <p className="text-sm text-muted">
          CyberBlog v2.0 | Powered by AI Agent | © 2026
        </p>
      </footer>
    </div>
  )
}