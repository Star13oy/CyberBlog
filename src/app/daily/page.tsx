'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Task {
  id: string
  title: string
  status: string
  progress: number
}

interface DailyLog {
  id: string
  date: string
  title: string | null
  content: string
  aiGenerated: boolean
  author: {
    id: string
    username: string
    name: string | null
  }
  tasks: Task[]
}

// 格式化预览文本，移除Markdown符号
const formatPreview = (content: string, maxLength: number = 150): string => {
  let text = content
    // 移除标题符号
    .replace(/^#{1,6}\s+/gm, '')
    // 移除粗体/斜体
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    // 移除列表符号
    .replace(/^[-*+]\s+/gm, '')
    // 移除代码块
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`(.+?)`/g, '$1')
    // 移除链接
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    // 合并多个空白
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length > maxLength) {
    text = text.slice(0, maxLength) + '...'
  }
  return text
}

export default function DailyPage() {
  const router = useRouter()
  const [logs, setLogs] = useState<DailyLog[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 10

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('pageSize', pageSize.toString())

      const res = await fetch(`/api/daily-logs?${params}`)
      const data = await res.json()

      if (data.success) {
        setLogs(data.data.data)
        setTotal(data.data.total)
      }
    } catch (err) {
      console.error('获取日报失败:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [page])

  const totalPages = Math.ceil(total / pageSize)

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div className="page-container">
      <main className="max-w-4xl mx-auto px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="page-title">
            <span className="page-title-prefix">{'//'}</span> 每日日报
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-base text-[#00d4ff] font-medium bg-[rgba(0,212,255,0.1)] px-4 py-2 rounded-lg">
              📅 {today}
            </span>
            <Link
              href="/daily/new"
              className="cyber-btn cyber-btn-primary px-4 py-2 text-sm"
            >
              + 创建日报
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#607080]">加载中...</div>
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">📋</p>
            <p>暂无日报</p>
          </div>
        ) : (
          <div className="space-y-6">
            {logs.map((log) => {
              const doneTasks = log.tasks.filter(t => t.status === 'DONE').length
              const totalTasks = log.tasks.length
              const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

              return (
                <div
                  key={log.id}
                  className="cyber-card p-6 hover:border-[#00d4ff] transition-colors cursor-pointer relative group card-hover"
                  onClick={() => router.push(`/daily/${log.id}`)}
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--primary)] to-[#30d158] scale-x-0 group-hover:scale-x-100 transition-transform" />

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">
                        {log.title || `${new Date(log.date).toLocaleDateString('zh-CN')} 日报`}
                      </h3>
                      {log.aiGenerated && (
                        <span className="text-xs text-[#30d158] bg-[rgba(48,209,88,0.1)] px-2 py-1 rounded mt-1 inline-block">
                          🤖 AI 生成
                        </span>
                      )}
                    </div>
                    <span className="text-lg text-[#00d4ff] font-semibold bg-[rgba(0,212,255,0.1)] px-3 py-1 rounded">
                      {new Date(log.date).toLocaleDateString('zh-CN')}
                    </span>
                  </div>

                  <p className="text-sm text-secondary leading-relaxed mb-4 line-clamp-3">{formatPreview(log.content)}</p>

                  {log.tasks.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#607080]">任务进度</span>
                        <span className="text-[#00d4ff]">{doneTasks}/{totalTasks}</span>
                      </div>
                      <div className="h-2 bg-[rgba(0,212,255,0.1)] rounded overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00d4ff] to-[#30d158] transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
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