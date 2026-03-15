'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Task {
  id?: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  progress: number
}

export default function NewDailyLogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    title: '',
    content: '',
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '' })

  const addTask = () => {
    if (!newTask.title.trim()) return
    setTasks([...tasks, {
      title: newTask.title,
      description: newTask.description,
      status: 'TODO',
      progress: 0,
    }])
    setNewTask({ title: '', description: '' })
  }

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const updateTaskStatus = (index: number, status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    const updated = [...tasks]
    updated[index].status = status
    updated[index].progress = status === 'DONE' ? 100 : status === 'IN_PROGRESS' ? 50 : 0
    setTasks(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/daily-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          title: formData.title,
          content: formData.content,
          tasks: tasks.map(t => ({
            title: t.title,
            description: t.description,
            status: t.status,
            progress: t.progress,
          })),
        }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/daily')
      } else {
        setError(data.error || '创建失败')
      }
    } catch (err) {
      setError('创建失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-[72px]">
      <main className="max-w-4xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white font-mono">
            <span className="text-[#00d4ff]">{'//'}</span> 创建日报
          </h1>
          <Link
            href="/daily"
            className="text-sm text-[#607080] hover:text-[#00d4ff] transition-colors"
          >
            ← 返回列表
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-[rgba(255,69,58,0.1)] border border-[rgba(255,69,58,0.3)] rounded-lg text-sm text-[#ff453a]">
              {error}
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-base font-medium text-white mb-2">📅 日期</label>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="cyber-input w-full text-base py-3"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-[#a8b8c8] mb-2">标题（可选）</label>
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
              placeholder="今日工作总结..."
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
            {tasks.length > 0 && (
              <div className="space-y-3">
                {tasks.map((task, index) => {
                  const progress = task.progress
                  const progressColor = task.status === 'DONE' ? 'from-[#30d158] to-[#30d158]' :
                                        task.status === 'IN_PROGRESS' ? 'from-[#ffd60a] to-[#ff9500]' :
                                        'from-[#ff453a] to-[#ff453a]'

                  return (
                    <div
                      key={index}
                      className="p-4 bg-[rgba(0,0,0,0.3)] rounded-lg border border-[rgba(0,212,255,0.1)]"
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
                            onChange={e => updateTaskStatus(index, e.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE')}
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
                            onClick={() => removeTask(index)}
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
            )}

            {tasks.length === 0 && (
              <p className="text-center text-[#607080] py-4">暂无任务，添加一些任务吧</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="cyber-btn cyber-btn-primary px-8 py-3 disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建日报'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="cyber-btn px-8 py-3 border-[#607080] text-[#607080]"
            >
              取消
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}