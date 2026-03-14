import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// 浮动粒子 - 增强发光效果
function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -5 }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-[2px] h-[2px] rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? '#00d4ff' : '#bf5af2',
            boxShadow: i % 2 === 0
              ? '0 0 6px #00d4ff, 0 0 12px #00d4ff, 0 0 20px rgba(0,212,255,0.5)'
              : '0 0 6px #bf5af2, 0 0 12px #bf5af2, 0 0 20px rgba(191,90,242,0.5)',
            animation: `floatUp ${18 + Math.random() * 12}s infinite`,
            animationDelay: `${Math.random() * 20}s`,
          }}
        />
      ))}
    </div>
  )
}

// 侧边栏 - HUD 风格
function Sidebar() {
  return (
    <aside className="w-[280px] fixed top-[72px] bottom-0 left-0 bg-[rgba(5,10,18,0.9)] border-r border-[rgba(0,212,255,0.3)] p-6 overflow-y-auto backdrop-blur-sm hidden lg:block" style={{ zIndex: 20 }}>
      {/* Agent 状态 */}
      <div className="mb-8">
        <h3 className="text-[11px] font-semibold text-[#00d4ff] uppercase tracking-[2px] mb-4 pb-2 border-b border-[rgba(0,212,255,0.3)] font-mono" style={{ textShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }}>
          {'// AGENT_STATUS'}
        </h3>
        <div className="bg-[rgba(0,10,20,0.8)] border border-[rgba(0,212,255,0.3)] rounded-lg p-5 relative overflow-hidden" style={{ boxShadow: '0 0 20px rgba(0,212,255,0.15), inset 0 0 20px rgba(0,212,255,0.05)' }}>
          {/* 顶部动态渐变线 */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00d4ff] via-[#bf5af2] to-[#00d4ff] bg-[length:200%_100%] animate-[gradientMove_3s_linear_infinite]" />
          {/* 头像和信息 */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-[rgba(0,10,20,0.8)] border border-[#00d4ff] flex items-center justify-center text-2xl" style={{ boxShadow: '0 0 15px rgba(0,212,255,0.4), inset 0 0 10px rgba(0,212,255,0.1)' }}>
              🤖
            </div>
            <div>
              <h4 className="text-[15px] font-semibold text-white font-mono" style={{ textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>Cyber Agent</h4>
              <div className="flex items-center gap-2 text-[12px] text-[#30d158]">
                <span className="w-2 h-2 rounded-full bg-[#30d158] animate-[statusPulse_2s_infinite]" style={{ boxShadow: '0 0 10px #30d158' }} />
                <span className="font-mono">ONLINE</span>
              </div>
            </div>
          </div>
          {/* 统计数据 - HUD 风格 */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[rgba(0,212,255,0.2)]">
            <div className="text-center p-3 bg-[rgba(0,212,255,0.05)] rounded border border-[rgba(0,212,255,0.2)]">
              <div className="text-[20px] font-bold text-[#00d4ff] font-mono hud-data">99.9%</div>
              <div className="text-[10px] text-[#405060] mt-1 font-mono uppercase">Uptime</div>
            </div>
            <div className="text-center p-3 bg-[rgba(0,212,255,0.05)] rounded border border-[rgba(0,212,255,0.2)]">
              <div className="text-[20px] font-bold text-[#00d4ff] font-mono hud-data">2.3s</div>
              <div className="text-[10px] text-[#405060] mt-1 font-mono uppercase">Latency</div>
            </div>
          </div>
        </div>
      </div>

      {/* 分类导航 */}
      <div className="mb-8">
        <h3 className="text-[11px] font-semibold text-[#00d4ff] uppercase tracking-[2px] mb-4 pb-2 border-b border-[rgba(0,212,255,0.3)] font-mono" style={{ textShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }}>
          {'// CATEGORIES'}
        </h3>
        <ul className="space-y-1.5">
          {[
            { icon: '📄', name: '全部文章', count: 128 },
            { icon: '🎨', name: '前端开发', count: 42 },
            { icon: '⚙️', name: '后端架构', count: 35 },
            { icon: '🧠', name: 'AI / ML', count: 28 },
            { icon: '💻', name: 'DevOps', count: 23 },
          ].map((item, i) => (
            <li
              key={i}
              className={`flex items-center justify-between px-4 py-3 rounded cursor-pointer transition-all border font-mono text-[13px]
                ${i === 0
                  ? 'bg-[rgba(0,212,255,0.1)] text-[#00d4ff] border-[rgba(0,212,255,0.4)]'
                  : 'text-[#607080] bg-[rgba(0,10,20,0.5)] border-[rgba(0,212,255,0.1)] hover:bg-[rgba(0,212,255,0.05)] hover:text-[#00d4ff] hover:border-[rgba(0,212,255,0.2)]'}`}
              style={i === 0 ? { boxShadow: '0 0 15px rgba(0,212,255,0.2), inset 0 0 15px rgba(0,212,255,0.05)' } : {}}
            >
              <span className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${i === 0 ? 'bg-[rgba(0,212,255,0.2)] text-[#00d4ff]' : 'bg-[rgba(0,212,255,0.1)] text-[#405060]'}`}>
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 热门标签 */}
      <div>
        <h3 className="text-[11px] font-semibold text-[#00d4ff] uppercase tracking-[2px] mb-4 pb-2 border-b border-[rgba(0,212,255,0.3)] font-mono" style={{ textShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }}>
          {'// HOT_TAGS'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Vue3', 'React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'LLM', 'RAG'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-[rgba(191,90,242,0.1)] border border-[rgba(191,90,242,0.3)] rounded text-[11px] text-[#bf5af2] cursor-pointer transition-all hover:bg-[rgba(191,90,242,0.2)] hover:border-[#bf5af2] hover:text-white font-mono"
              style={{ textShadow: '0 0 5px rgba(191,90,242,0.3)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}

// 终端模拟器 - HUD 风格
function Terminal() {
  return (
    <div className="bg-[rgba(0,10,20,0.9)] border border-[rgba(0,212,255,0.3)] rounded-lg overflow-hidden relative" style={{ boxShadow: '0 0 30px rgba(0,212,255,0.2), inset 0 0 30px rgba(0,212,255,0.05)' }}>
      {/* 顶部渐变线 */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent opacity-60" />
      {/* 终端标题栏 */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-[rgba(0,212,255,0.05)] border-b border-[rgba(0,212,255,0.2)]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" style={{ boxShadow: '0 0 8px rgba(255,95,87,0.5)' }} />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" style={{ boxShadow: '0 0 8px rgba(254,188,46,0.5)' }} />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" style={{ boxShadow: '0 0 8px rgba(40,200,64,0.5)' }} />
        <span className="ml-4 text-[12px] text-[#00d4ff] font-mono" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>CYBER-BLOG@AGENT:~</span>
      </div>
      {/* 终端内容 */}
      <div className="p-6 font-mono text-[13px] min-h-[180px] leading-relaxed relative">
        {/* 扫描线效果 */}
        <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,212,255,0.02)_2px,rgba(0,212,255,0.02)_4px)]" />
        <div className="relative z-10">
          <div className="mb-2">
            <span className="text-[#30d158]" style={{ textShadow: '0 0 10px rgba(48,209,88,0.5)' }}>$ </span>
            <span className="text-[#00d4ff]" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>npm run build</span>
          </div>
          <div className="text-[#405060]">✓ Compiled successfully in 2.3s</div>
          <div className="text-[#405060]">✓ Generating static pages (12/12)</div>
          <div className="text-[#30d158] mt-2" style={{ textShadow: '0 0 10px rgba(48,209,88,0.4)' }}>✓ Build completed!</div>
          {/* 光标行 */}
          <div className="mt-5 flex items-center">
            <span className="text-[#30d158]" style={{ textShadow: '0 0 10px rgba(48,209,88,0.5)' }}>$ </span>
            <span className="inline-block w-[8px] h-[16px] bg-[#00d4ff] ml-1 animate-pulse" style={{ boxShadow: '0 0 10px #00d4ff' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// 统计卡片 - HUD 风格
function StatCard({ icon, value, label, color }: { icon: string; value: number; label: string; color: string }) {
  const colorStyles: Record<string, { border: string; glow: string; text: string }> = {
    blue: { border: 'border-[rgba(0,212,255,0.4)]', glow: '0 0 20px rgba(0,212,255,0.3)', text: '#00d4ff' },
    green: { border: 'border-[rgba(48,209,88,0.4)]', glow: '0 0 20px rgba(48,209,88,0.3)', text: '#30d158' },
    purple: { border: 'border-[rgba(191,90,242,0.4)]', glow: '0 0 20px rgba(191,90,242,0.3)', text: '#bf5af2' },
    yellow: { border: 'border-[rgba(255,214,10,0.4)]', glow: '0 0 20px rgba(255,214,10,0.3)', text: '#ffd60a' },
  }
  const style = colorStyles[color]

  return (
    <div className="relative p-6 bg-[rgba(0,10,20,0.8)] rounded-lg border overflow-hidden group cursor-pointer transition-all hover:-translate-y-1"
      style={{ borderColor: `rgba(0,212,255,0.2)`, boxShadow: `${style.glow}, inset 0 0 30px rgba(0,212,255,0.05)` }}>
      {/* 顶部渐变线 */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-current to-transparent opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: style.text }} />
      {/* 图标 */}
      <div className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center text-xl bg-[rgba(0,10,20,0.8)] border"
        style={{ borderColor: `${style.text}40`, boxShadow: `0 0 15px ${style.text}30, inset 0 0 10px ${style.text}10` }}>
        {icon}
      </div>
      {/* 数值 - 霓虹发光 */}
      <div className="text-[36px] font-bold text-center font-mono mb-1"
        style={{ color: style.text, textShadow: `0 0 10px ${style.text}, 0 0 20px ${style.text}, 0 0 30px ${style.text}80` }}>
        {value}
      </div>
      {/* 标签 */}
      <div className="text-[11px] text-center text-[#405060] font-mono uppercase tracking-wider">{label}</div>
    </div>
  )
}

// 任务项 - HUD 风格
function TaskItem({ title, desc, status, progress }: { title: string; desc: string; status: string; progress: number }) {
  const statusStyles: Record<string, { color: string; glow: string; icon: string }> = {
    done: { color: '#30d158', glow: '0 0 15px rgba(48,209,88,0.4)', icon: '✓' },
    'in-progress': { color: '#ffd60a', glow: '0 0 15px rgba(255,214,10,0.4)', icon: '●' },
    todo: { color: '#405060', glow: 'none', icon: '○' },
  }
  const style = statusStyles[status]

  return (
    <div className="flex items-center gap-4 p-4 bg-[rgba(0,10,20,0.6)] rounded border border-[rgba(0,212,255,0.15)] transition-all hover:bg-[rgba(0,10,20,0.8)] hover:border-[rgba(0,212,255,0.3)] cursor-pointer">
      {/* 状态图标 */}
      <div className="w-9 h-9 rounded flex items-center justify-center text-sm font-mono"
        style={{
          color: style.color,
          border: `1px solid ${style.color}40`,
          boxShadow: style.glow,
          background: `${style.color}15`
        }}>
        {style.icon}
      </div>
      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium text-white font-mono truncate">{title}</div>
        <div className="text-[12px] text-[#405060] truncate">{desc}</div>
      </div>
      {/* 进度 */}
      <div className="text-[14px] font-semibold text-[#00d4ff] font-mono shrink-0" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>
        {progress}%
      </div>
    </div>
  )
}

// 文章卡片 - HUD 风格
function PostCard({ title, excerpt, category, date, views }: { title: string; excerpt: string; category: string; date: string; views: number }) {
  return (
    <article className="bg-[rgba(0,10,20,0.8)] border border-[rgba(0,212,255,0.2)] rounded-lg overflow-hidden transition-all hover:border-[rgba(0,212,255,0.4)] hover:-translate-y-1 relative group cursor-pointer"
      style={{ boxShadow: '0 0 20px rgba(0,212,255,0.1), inset 0 0 20px rgba(0,212,255,0.03)' }}>
      {/* 顶部渐变线 */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00d4ff] to-[#bf5af2] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      {/* 内容区 */}
      <div className="p-6">
        {/* 分类标签 */}
        <span className="inline-block px-3 py-1 bg-[rgba(191,90,242,0.1)] text-[#bf5af2] text-[10px] font-semibold rounded border border-[rgba(191,90,242,0.3)] mb-4 font-mono uppercase">
          {category}
        </span>
        {/* 标题 */}
        <h3 className="text-[17px] font-semibold text-white mb-3 group-hover:text-[#00d4ff] transition-colors font-mono leading-snug" style={{ transition: 'color 0.3s, text-shadow 0.3s' }}>
          {title}
        </h3>
        {/* 摘要 */}
        <p className="text-[13px] text-[#607080] leading-relaxed line-clamp-2">{excerpt}</p>
      </div>
      {/* 底部元信息 */}
      <div className="flex justify-between items-center px-6 py-4 bg-[rgba(0,212,255,0.03)] border-t border-[rgba(0,212,255,0.15)]">
        <div className="flex gap-5 text-[12px] text-[#405060] font-mono">
          <span>📅 {date}</span>
          <span>👁 {views}</span>
        </div>
      </div>
    </article>
  )
}

export default async function HomePage() {
  const [postCount, dailyLogCount] = await Promise.all([
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.dailyLog.count(),
  ])

  return (
    <div className="min-h-screen relative">
      <Particles />

      <Sidebar />

      {/* 主内容 */}
      <main className="lg:ml-[280px] pt-[72px]">
        <div className="max-w-[1100px] mx-auto px-8 py-6">
          {/* Hero - HUD 风格 */}
          <section className="text-center py-8 relative">
            {/* HUD 角落装饰 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent opacity-50" />

            {/* Badge 标签 - HUD 风格 */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-[rgba(0,10,20,0.8)] border border-[#00d4ff] rounded text-sm text-[#00d4ff] mb-6 relative" style={{ boxShadow: '0 0 20px rgba(0,212,255,0.3), inset 0 0 20px rgba(0,212,255,0.1)' }}>
              <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" style={{ boxShadow: '0 0 10px #00d4ff' }} />
              <span className="font-mono tracking-wider">AI AGENT 自动维护的开发日志系统</span>
            </div>

            {/* 主标题 - Glitch 故障动画 */}
            <h1 className="text-[72px] font-bold mb-4 leading-tight relative font-['Orbitron']">
              <span className="neon-title-cyber inline-block">CYBER</span>
              <span className="neon-title-blog inline-block ml-4">BLOG</span>
            </h1>

            {/* 副标题 - 全息文字 */}
            <p className="text-base text-[#a8b8c8] max-w-xl mx-auto mb-6 leading-relaxed tracking-wide">
              一个由 <span className="text-[#00d4ff]" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>AI Agent</span> 驱动的技术博客系统
              <br />
              <span className="text-[#607080]">自动记录开发进程 · 整理技术笔记 · 生成每日日报</span>
            </p>

            {/* 操作按钮 - HUD 风格 */}
            <div className="flex justify-center gap-4">
              <button className="neon-btn px-8 py-3 rounded font-semibold text-sm tracking-wide">
                📚 浏览文章
              </button>
              <button className="neon-btn px-8 py-3 rounded font-semibold text-sm tracking-wide border-[#bf5af2] text-[#bf5af2]" style={{ boxShadow: '0 0 10px rgba(191,90,242,0.3), inset 0 0 10px rgba(191,90,242,0.1)', textShadow: '0 0 10px rgba(191,90,242,0.5)' }}>
                🔄 了解更多
              </button>
            </div>
          </section>

          {/* 统计卡片 */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="📄" value={postCount} label="文章总数" color="blue" />
            <StatCard icon="📅" value={dailyLogCount} label="每日日报" color="green" />
            <StatCard icon="⏱️" value={15} label="活跃天数" color="purple" />
            <StatCard icon="👁️" value={2847} label="总阅读量" color="yellow" />
          </section>

          {/* 今日进度 */}
          <section className="bg-[rgba(13,20,35,0.85)] border border-[rgba(0,212,255,0.15)] rounded-lg p-6 mb-8 relative overflow-hidden">
            {/* 顶部渐变线 */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff] to-[#bf5af2] opacity-60" />
            {/* 标题栏 */}
            <div className="flex justify-between items-center mb-7 pb-5 border-b border-[rgba(0,212,255,0.1)]">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.15)' }}>
                <span className="w-1 h-7 bg-gradient-to-b from-[#00d4ff] to-[#bf5af2] rounded shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
                今日进度
              </h2>
              <span className="text-sm text-[#607080] flex items-center gap-2">
                <span className="text-[#00d4ff]">📅</span>
                {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
              </span>
            </div>
            {/* 任务列表 */}
            <div className="space-y-3.5">
              <TaskItem title="完成博客系统架构重构" desc="迁移至 Next.js 15 + TypeScript + Prisma" status="done" progress={100} />
              <TaskItem title="实现用户认证功能" desc="集成 JWT 认证，支持注册登录" status="done" progress={100} />
              <TaskItem title="前端性能优化" desc="SSR + ISR 混合渲染，首屏加载优化" status="in-progress" progress={65} />
              <TaskItem title="部署至生产环境" desc="Docker 容器化 + 集群部署" status="todo" progress={20} />
            </div>
          </section>

          {/* 终端 */}
          <section className="mb-12">
            <Terminal />
          </section>

          {/* 最新文章 */}
          <section>
            <div className="flex justify-between items-center mb-7">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.15)' }}>
                <span className="w-1 h-7 bg-gradient-to-b from-[#00d4ff] to-[#bf5af2] rounded shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
                最新文章
              </h2>
              <Link href="/blog" className="text-sm text-[#00d4ff] hover:translate-x-1 transition-all flex items-center gap-1.5 group hover:text-[#4de8ff]">
                查看全部
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              <PostCard title="Vue3 组合式 API 最佳实践指南" excerpt="深入探讨 Vue3 Composition API 在大型项目中的应用，包括响应式原理、组合式函数设计模式..." category="前端开发" date="2026-03-11" views={1234} />
              <PostCard title="RAG 系统设计与实现详解" excerpt="从零构建企业级 RAG 检索增强生成系统，涵盖向量数据库选型、Embedding 优化..." category="AI / ML" date="2026-03-10" views={2156} />
              <PostCard title="微服务架构演进之路" excerpt="从单体应用逐步演进到微服务架构的实践经验，分享服务拆分策略与治理方案..." category="后端架构" date="2026-03-09" views={1876} />
              <PostCard title="Next.js 15 新特性深度解析" excerpt="详细介绍 Next.js 15 的 Turbopack、Server Actions、部分预渲染等核心特性..." category="前端开发" date="2026-03-08" views={3421} />
            </div>
          </section>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="lg:ml-[280px] border-t border-[rgba(0,212,255,0.1)] py-12 text-center relative">
        {/* 顶部渐变线 */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff] to-[#bf5af2] opacity-40" />
        {/* 链接区 */}
        <div className="flex justify-center gap-12 mb-6">
          <Link href="#" className="text-sm text-[#a8b8c8] hover:text-[#00d4ff] hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all">GitHub</Link>
          <Link href="#" className="text-sm text-[#a8b8c8] hover:text-[#00d4ff] hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all">API 文档</Link>
          <Link href="#" className="text-sm text-[#a8b8c8] hover:text-[#00d4ff] hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all">RSS 订阅</Link>
          <Link href="#" className="text-sm text-[#a8b8c8] hover:text-[#00d4ff] hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all">关于我们</Link>
        </div>
        {/* 版权信息 */}
        <p className="text-[13px] text-[#607080]">
          CyberBlog v2.0 | Powered by AI Agent | © 2026
        </p>
      </footer>
    </div>
  )
}