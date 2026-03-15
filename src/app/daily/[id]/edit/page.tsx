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

export default function EditDailyLogPage() {
  const router = useRouter()
  const params = useParams()
  const logId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    content: '',
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '' })

  // 加载日报数据
  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await fetch(`/api/daily-logs/${logId}`)
        const data = await res.json()

        if (data.success) {
          setFormData({
            date: new Date(data.data.date).toISOString().split('T')[0],
            title: data.data.title || '',
            content: data.data.content,
          })
          setTasks(data.data.tasks || [])
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

  const addTask = async () => {
    if (!newTask.title.trim()) return

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyLogId: logId,
          title: newTask.title,
          description: newTask.description,
          status: 'TODO',
          progress: 0,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setTasks([...tasks, data.data])
        setNewTask({ title: '', description: '' })
      }
    } catch (err) {
      setError('添加任务失败')
    }
  }

  const removeTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks?taskId=${taskId}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (data.success) {
        setTasks(tasks.filter(t => t.id !== taskId))
      }
    } catch (err) {
      setError('删除任务失败')
    }
  }

  const updateTaskStatus = async (taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    const progress = status === 'DONE' ? 100 : status === 'IN_PROGRESS' ? 50 : 0

    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          status,
          progress,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status, progress } : t))
      }
    } catch (err) {
      setError('更新任务失败')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/daily-logs/${logId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
        }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/daily')
      } else {
        setError(data.error || '保存失败')
      }
    } catch (err) {
      setError('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇日报吗？此操作不可恢复。')) return

    try {
      const res = await fetch(`/api/daily-logs/${logId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success) {
        router.push('/daily')
      } else {
        setError(data.error || '删除失败')
      }
    } catch (err) {
      setError('删除失败')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-[72px] flex items-center justify-center">
        <div className="text-[#607080]">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-[72px]">
      <main className="max-w-4xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white font-mono">
            <span className="text-[#00d4ff]">{'//'}</span> 编辑日报
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/daily"
              className="text-sm text-[#607080] hover:text-[#00d4ff] transition-colors"
            >
              返回列表
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-[rgba(255,69,58,0.1)] border border-[rgba(255,69,58,0.3)] rounded-lg text-sm text-[#ff453a]">
              {error}
            </div>
          )}

          {/* Date (readonly) */}
          <div>
            <label className="block text-sm text-[#a8b8c8] mb-2">日期</label>
            <input
              type="date"
              value={formData.date}
              disabled
              className="cyber-input w-full bg-[rgba(0,0,0,0.3)] cursor-not-allowed"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-[#a8b8c8] mb-2">标题</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="cyber-input w-full"
              placeholder="默认为日期日报"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm text-[#a8b8c8] mb-2">内容 *</label>
            <textarea
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              className="cyber-input w-full min-h-[200px] font-mono text-sm"
              required
            />
          </div>

          {/* Tasks Section */}
          <div className="cyber-card p-4">
            <h3 className="text-lg font-semibold text-white mb-4">任务列表</h3>

            {/* Add Task Form */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4 p-4 bg-[rgba(0,0,0,0.2)] rounded-lg">
              <input
                type="text"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                className="cyber-input flex-1 py-2.5"
                placeholder="✏️ 输入任务标题"
              />
              <input
                type="text"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                className="cyber-input flex-1 py-2.5"
                placeholder="📝 任务描述（可选）"
              />
              <button
                type="button"
                onClick={addTask}
                className="cyber-btn px-6 py-2.5 border-[#00d4ff] text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)] font-medium"
              >
                ➕ 添加
              </button>
            </div>

            {/* Task List */}
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => {
                  const progress = task.progress
                  const progressColor = task.status === 'DONE' ? 'from-[#30d158] to-[#30d158]' :
                                        task.status === 'IN_PROGRESS' ? 'from-[#ffd60a] to-[#ff9500]' :
                                        'from-[#ff453a] to-[#ff453a]'

                  return (
                    <div
                      key={task.id}
                      className="p-4 bg-[rgba(0,0,0,0.3)] rounded-lg border border-[rgba(0,212,255,0.1)] hover:border-[rgba(0,212,255,0.3)] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="text-white font-medium">{task.title}</div>
                          {task.description && (
                            <div className="text-[#607080] text-sm mt-1">{task.description}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={task.status}
                            onChange={e => updateTaskStatus(task.id, e.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE')}
                            className={`cyber-input py-2 px-3 text-sm font-medium rounded ${
                              task.status === 'DONE' ? 'text-[#30d158] border-[#30d158]' :
                              task.status === 'IN_PROGRESS' ? 'text-[#ffd60a] border-[#ffd60a]' :
                              'text-[#ff453a] border-[#ff453a]'
                            }`}
                          >
                            <option value="TODO">🔴 待办</option>
                            <option value="IN_PROGRESS">🟡 进行中</option>
                            <option value="DONE">🟢 完成</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => removeTask(task.id)}
                            className="text-[#607080] hover:text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)] p-2 rounded transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      {/* Progress Bar */}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-[rgba(0,212,255,0.1)] rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-300`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold min-w-[48px] text-right ${
                          task.status === 'DONE' ? 'text-[#30d158]' :
                          task.status === 'IN_PROGRESS' ? 'text-[#ffd60a]' :
                          'text-[#ff453a]'
                        }`}>
                          {progress}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-[#607080] py-4">暂无任务，添加一些任务吧</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="cyber-btn px-6 py-3 border-[#ff453a] text-[#ff453a] hover:bg-[rgba(255,69,58,0.1)]"
            >
              删除日报
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="cyber-btn px-8 py-3 border-[#607080] text-[#607080]"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={saving}
                className="cyber-btn cyber-btn-primary px-8 py-3 disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存修改'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}