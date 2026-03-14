'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

interface User {
  id: string
  username: string
  name: string | null
  role: string
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.success) {
          setUser(data.data)
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
    } catch {
      console.error('Logout failed')
    }
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const navLinkClass = (path: string) => {
    const baseClass = 'px-4 py-2 text-sm rounded-lg transition-all duration-300 font-medium'
    if (isActive(path)) {
      return `${baseClass} nav-link-active`
    }
    return `${baseClass} nav-link`
  }

  return (
    <nav className="navbar">
      {/* HUD 装饰线 */}
      <div className="navbar-glow" />

      {/* Logo */}
      <Link href="/" className="navbar-logo">
        <div className="navbar-logo-icon">
          🤖
        </div>
        <span className="navbar-logo-text">
          <span className="logo-cyber">Cyber</span>
          <span className="logo-blog">Blog</span>
        </span>
      </Link>

      {/* 导航链接 */}
      <div className="navbar-links">
        <Link href="/" className={navLinkClass('/')}>首页</Link>
        <Link href="/blog" className={navLinkClass('/blog')}>博客</Link>
        <Link href="/daily" className={navLinkClass('/daily')}>日报</Link>
        <Link href="/dashboard" className={navLinkClass('/dashboard')}>统计</Link>
        <Link href="/about" className={navLinkClass('/about')}>关于</Link>
      </div>

      {/* 右侧操作区 */}
      <div className="navbar-actions">
        <input
          type="text"
          placeholder="搜索..."
          className="navbar-search"
        />

        {/* 主题切换 */}
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title={theme === 'dark' ? '切换到日间模式' : '切换到夜间模式'}
        >
          <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>

        {user ? (
          <>
            <Link href="/blog/new" className="nav-btn-primary">
              + 新建文章
            </Link>
            <div className="user-info">
              <span className="user-name">{user.name || user.username}</span>
              <button onClick={handleLogout} className="logout-btn">
                退出
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="nav-link-text">登录</Link>
            <Link href="/register" className="nav-btn-primary">注册</Link>
          </>
        )}
      </div>
    </nav>
  )
}