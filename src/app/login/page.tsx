'use client'

import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (data.success) {
        // 使用完整页面刷新确保 cookie 生效
        window.location.href = redirect
      } else {
        setError(data.error || '登录失败')
        setLoading(false)
      }
    } catch (err) {
      setError('登录失败，请重试')
      setLoading(false)
    }
  }

  return (
    <div className="page-container flex items-center justify-center px-5">
      <div className="form-container w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-10">
          <div className="logo-icon">🤖</div>
          <span className="logo-text">
            Cyber<span className="logo-highlight">Blog</span>
          </span>
        </Link>

        {/* 登录表单 */}
        <div className="form-card">
          <h1 className="form-title">登录</h1>

          {error && (
            <div className="form-error">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">用户名 / 邮箱</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="cyber-input"
                placeholder="用户名或邮箱"
                required
              />
            </div>

            <div>
              <label className="form-label">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cyber-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cyber-btn cyber-btn-primary w-full py-3 disabled:opacity-50"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="form-footer">
            还没有账户？{' '}
            <Link href="/register" className="form-link">
              注册
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="page-container flex items-center justify-center">
        <div className="text-muted">加载中...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}