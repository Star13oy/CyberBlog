'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('两次密码不一致')
      return
    }

    if (password.length < 8) {
      setError('密码至少8个字符')
      return
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('密码必须包含大小写字母和数字')
      return
    }

    if (username.length < 3 || username.length > 20) {
      setError('用户名需要3-20个字符')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      })

      const data = await res.json()

      if (data.success) {
        window.location.href = '/login?registered=true'
      } else {
        setError(data.error || '注册失败')
      }
    } catch (err) {
      setError('注册失败，请重试')
    } finally {
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

        {/* 注册表单 */}
        <div className="form-card">
          <h1 className="form-title">注册</h1>

          {error && (
            <div className="form-error">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cyber-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="form-label">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="cyber-input"
                placeholder="3-20个字符"
                minLength={3}
                maxLength={20}
                required
              />
            </div>

            <div>
              <label className="form-label">
                密码
                <span className="text-muted text-xs ml-2">（需包含大小写字母和数字）</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cyber-input"
                placeholder="至少8个字符"
                minLength={8}
                required
              />
            </div>

            <div>
              <label className="form-label">确认密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="cyber-input"
                placeholder="再次输入密码"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cyber-btn cyber-btn-primary w-full py-3 disabled:opacity-50"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className="form-footer">
            已有账户？{' '}
            <Link href="/login" className="form-link">
              登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}