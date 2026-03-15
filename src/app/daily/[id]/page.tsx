'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
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
  createdAt: string
  updatedAt: string
}

export default function DailyLogDetailPage() {
  const router = useRouter()
  const params = useParams()
  const logId = params.id as string

  const [loading, setLoading] = useState(true)
  const [log, setLog] = useState<DailyLog | null>(null)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await fetch(`/api/daily-logs/${logId}`)
        const data = await res.json()

        if (data.success) {
          setLog(data.data)
        } else {
          setError(data.error || '加载失败')
        }
      } catch (err) {
        setError('加载日报失败')
      } finally {
        setLoading(false)
      }
    }

    fetchLog()
  }, [logId])

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇日报吗？此操作不可恢复。')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/daily-logs/${logId}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success) {
        router.push('/daily')
      } else {
        alert(data.error || '删除失败')
      }
    } catch (err) {
      console.error('删除日报失败:', err)
      alert('删除失败')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-[72px] flex items-center justify-center">
        <div className="text-[#607080]">加载中...</div>
      </div>
    )
  }

  if (error || !log) {
    return (
      <div className="min-h-screen pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#ff453a] mb-4">{error || '日报不存在'}</p>
          <Link href="/daily" className="cyber-btn px-4 py-2 border-[#00d4ff] text-[#00d4ff]">
            返回列表
          </Link>
        </div>
      </div>
    )
  }

  const doneTasks = log.tasks.filter(t => t.status === 'DONE').length
  const totalTasks = log.tasks.length
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  // 解析Markdown内容为HTML
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      // 标题
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold text-[#00d4ff] mt-6 mb-3">{line.slice(4)}</h3>
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold text-white mt-8 mb-4">{line.slice(3)}</h2>
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>
      }
      // 列表项
      if (line.startsWith('- ')) {
        return <li key={index} className="text-[#a8b8c8] ml-4 mb-1 list-disc">{line.slice(2)}</li>
      }
      // 空行
      if (line.trim() === '') {
        return <br key={index} />
      }
      // 普通文本
      return <p key={index} className="text-[#a8b8c8] mb-2">{line}</p>
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'text-[#30d158]'
      case 'IN_PROGRESS': return 'text-[#ffd60a]'
      default: return 'text-[#ff453a]'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DONE': return '已完成'
      case 'IN_PROGRESS': return '进行中'
      default: return '待办'
    }
  }

  return (
    <div className="min-h-screen pt-[72px]">
      <main className="max-w-4xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white font-mono">
              <span className="text-[#00d4ff]">{'//'}</span> {log.title || `${new Date(log.date).toLocaleDateString('zh-CN')} 日报`}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-[#607080]">
              <span>📅 {new Date(log.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
              <span>👤 {log.author.name || log.author.username}</span>
              {log.aiGenerated && (
                <span className="text-[#30d158] bg-[rgba(48,209,88,0.1)] px-2 py-0.5 rounded">🤖 AI 生成</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/daily"
              className="cyber-btn px-4 py-2 border-[#607080] text-[#607080] hover:text-white"
            >
              ← 返回
            </Link>
            <Link
              href={`/daily/${logId}/edit`}
              className="cyber-btn px-4 py-2 border-[#00d4ff] text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)]"
            >
              ✏️ 编辑
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="cyber-btn px-4 py-2 border-[#ff453a] text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] disabled:opacity-50"
            >
              {deleting ? '删除中...' : '🗑️ 删除'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="cyber-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#00d4ff]">📋</span> 工作内容
              </h2>
              <div className="prose prose-invert max-w-none">
                {renderContent(log.content)}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="cyber-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#30d158]">📊</span> 任务进度
              </h2>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-white font-mono">{progress}%</div>
                <div className="text-sm text-[#607080]">{doneTasks}/{totalTasks} 任务完成</div>
              </div>
              <div className="h-3 bg-[rgba(0,212,255,0.1)] rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00d4ff] to-[#30d158] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Tasks Card */}
            {totalTasks > 0 && (
              <div className="cyber-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-[#ffd60a]">✅</span> 任务列表
                </h2>
                <div className="space-y-3">
                  {log.tasks.map((task) => (
                    <div key={task.id} className="p-3 bg-[rgba(0,0,0,0.3)] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm font-medium">{task.title}</span>
                        <span className={`text-xs ${getStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-[#607080] text-xs mb-2">{task.description}</p>
                      )}
                      <div className="h-1.5 bg-[rgba(0,212,255,0.1)] rounded overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            task.status === 'DONE' ? 'bg-[#30d158]' :
                            task.status === 'IN_PROGRESS' ? 'bg-[#ffd60a]' : 'bg-[#ff453a]'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meta Card */}
            <div className="cyber-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-[#bf5af2]">📅</span> 时间信息
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#607080]">创建时间</span>
                  <span className="text-[#a8b8c8]">{new Date(log.createdAt).toLocaleString('zh-CN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#607080]">更新时间</span>
                  <span className="text-[#a8b8c8]">{new Date(log.updatedAt).toLocaleString('zh-CN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}