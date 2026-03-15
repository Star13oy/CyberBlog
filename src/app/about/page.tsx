import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const [postCount, dailyLogCount, userCount] = await Promise.all([
    prisma.posts.count({ where: { status: 'PUBLISHED' } }),
    prisma.daily_logs.count(),
    prisma.users.count(),
  ])

  return (
    <div className="page-container">
      <main className="max-w-4xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title">
            <span className="page-title-prefix">{'//'}</span> 关于
          </h1>
          <p className="text-secondary mt-2">CyberBlog 2.0 - 赛博朋克风格博客系统</p>
        </div>

        {/* Intro */}
        <div className="cyber-card p-8 mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">项目简介</h2>
          <p className="text-secondary leading-relaxed mb-4">
            CyberBlog 是一个由 AI Agent 驱动的技术博客系统，采用赛博朋克风格设计，
            支持博客文章发布、每日日报记录、评论互动等功能。
          </p>
          <p className="text-secondary leading-relaxed">
            系统使用 Next.js 15 + React 18 + TypeScript + Prisma + MySQL 技术栈构建，
            支持 Markdown 编辑，具备完整的用户认证和权限控制系统。
          </p>
        </div>

        {/* Tech Stack */}
        <div className="cyber-card p-8 mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">技术栈</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Next.js 15', icon: '⚛️', desc: 'React 框架' },
              { name: 'React 18', icon: '🔷', desc: 'UI 库' },
              { name: 'TypeScript', icon: '📝', desc: '类型安全' },
              { name: 'Prisma', icon: '🗄️', desc: 'ORM' },
              { name: 'MySQL', icon: '🐬', desc: '数据库' },
              { name: 'Tailwind CSS', icon: '🎨', desc: '样式框架' },
              { name: 'JWT', icon: '🔐', desc: '身份认证' },
              { name: 'Markdown', icon: '📄', desc: '内容编辑' },
            ].map((tech) => (
              <div
                key={tech.name}
                className="p-4 bg-[rgba(0,0,0,0.3)] rounded-lg border border-[var(--border-color)] hover:border-[var(--primary)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{tech.icon}</span>
                  <span className="text-primary font-medium">{tech.name}</span>
                </div>
                <span className="text-xs text-muted">{tech.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="cyber-card p-8 mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">站点统计</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent font-mono">{postCount}</div>
              <div className="text-sm text-muted mt-1">篇文章</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent font-mono">{dailyLogCount}</div>
              <div className="text-sm text-muted mt-1">篇日报</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent font-mono">{userCount}</div>
              <div className="text-sm text-muted mt-1">位用户</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="cyber-card p-8 mb-8">
          <h2 className="text-xl font-bold text-primary mb-4">功能特性</h2>
          <div className="space-y-3">
            {[
              { icon: '📝', text: 'Markdown 编辑器，支持实时预览' },
              { icon: '🏷️', text: '标签系统，自动创建和关联' },
              { icon: '💬', text: '评论系统，支持回复和层级显示' },
              { icon: '🔍', text: '全文搜索，快速定位内容' },
              { icon: '📅', text: '每日日报，记录开发进度' },
              { icon: '📊', text: '统计面板，数据可视化' },
              { icon: '🔐', text: 'JWT 认证，安全可靠' },
              { icon: '🌙', text: '赛博朋克风格，深色/浅色主题' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-secondary">
                <span>{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-muted text-sm">
          <p>CyberBlog v2.0 | Powered by AI Agent | © 2026</p>
        </div>
      </main>
    </div>
  )
}