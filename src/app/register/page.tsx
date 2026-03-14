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
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 text-2xl font-bold text-white mb-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#bf5af2] flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(0,212,255,0.4)]">
            🤖
          </div>
          <span>Cyber<span className="text-[#00d4ff]">Blog</span></span>
        </Link>

        {/* 注册表单 */}
        <div className="cyber-card p-8">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">注册</h1>

          {error && (
            <div className="mb-4 p-3 bg-[rgba(255,69,58,0.1)] border border-[rgba(255,69,58,0.3)] rounded-lg text-sm text-[#ff453a]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[#a8b8c8] mb-2">邮箱</label>
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
              <label className="block text-sm text-[#a8b8c8] mb-2">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="cyber-input"
                placeholder="username"
                minLength={3}
                maxLength={20}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#a8b8c8] mb-2">密码</label>
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
              <label className="block text-sm text-[#a8b8c8] mb-2">确认密码</label>
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

          <div className="mt-6 text-center text-sm text-[#607080]">
            已有账户？{' '}
            <Link href="/login" className="text-[#00d4ff] hover:underline">
              登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}