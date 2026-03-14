'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-[72px] flex justify-between items-center px-10 bg-[rgba(5,10,18,0.95)] border-b border-[rgba(0,212,255,0.3)] backdrop-blur-xl z-50">
      {/* HUD 装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent" style={{ boxShadow: '0 0 10px #00d4ff' }} />

      {/* Logo - 霓虹效果 */}
      <Link href="/" className="flex items-center gap-3 text-xl font-bold group">
        <div className="w-11 h-11 rounded-lg bg-[rgba(0,10,20,0.8)] border border-[#00d4ff] flex items-center justify-center text-2xl" style={{ boxShadow: '0 0 15px rgba(0,212,255,0.4), inset 0 0 15px rgba(0,212,255,0.1)' }}>
          🤖
        </div>
        <span>
          <span className="neon-title-cyber">Cyber</span>
          <span className="neon-title-blog ml-1">Blog</span>
        </span>
      </Link>

      {/* 导航链接 - HUD 风格 */}
      <div className="flex gap-1">
        <Link href="/" className={`px-4 py-2 text-sm rounded transition-all ${isActive('/') ? 'neon-btn' : 'text-[#607080] border border-transparent hover:border-[rgba(0,212,255,0.3)] hover:text-[#00d4ff]'}`}>
          首页
        </Link>
        <Link href="/blog" className={`px-4 py-2 text-sm rounded transition-all ${isActive('/blog') ? 'neon-btn' : 'text-[#607080] border border-transparent hover:border-[rgba(0,212,255,0.3)] hover:text-[#00d4ff]'}`}>
          博客
        </Link>
        <Link href="/daily" className={`px-4 py-2 text-sm rounded transition-all ${isActive('/daily') ? 'neon-btn' : 'text-[#607080] border border-transparent hover:border-[rgba(0,212,255,0.3)] hover:text-[#00d4ff]'}`}>
          日报
        </Link>
        <Link href="/stats" className={`px-4 py-2 text-sm rounded transition-all ${isActive('/stats') ? 'neon-btn' : 'text-[#607080] border border-transparent hover:border-[rgba(0,212,255,0.3)] hover:text-[#00d4ff]'}`}>
          统计
        </Link>
        <Link href="/about" className={`px-4 py-2 text-sm rounded transition-all ${isActive('/about') ? 'neon-btn' : 'text-[#607080] border border-transparent hover:border-[rgba(0,212,255,0.3)] hover:text-[#00d4ff]'}`}>
          关于
        </Link>
      </div>

      {/* 搜索和按钮 */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="搜索..."
          className="w-[180px] px-4 py-2 bg-[rgba(0,10,20,0.8)] border border-[rgba(0,212,255,0.3)] rounded text-sm text-[#00d4ff] placeholder-[#405060] focus:outline-none focus:border-[#00d4ff] transition-all font-mono"
          style={{ boxShadow: 'inset 0 0 10px rgba(0,212,255,0.1)' }}
        />
        <button className="neon-btn px-5 py-2 rounded font-semibold text-sm">
          + 新建文章
        </button>
      </div>
    </nav>
  )
}