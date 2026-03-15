'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface OverviewStats {
  postCount: number
  totalViews: number
  dailyLogCount: number
  taskStats: Record<string, number>
  categoryStats: Array<{ name: string; count: number }>
}

interface TrendData {
  date: string
  pageViews: number
  visitors: number
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState<OverviewStats | null>(null)
  const [trends, setTrends] = useState<TrendData[]>([])
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [overviewRes, trendsRes] = await Promise.all([
          fetch('/api/stats?type=overview'),
          fetch('/api/stats?type=trends'),
        ])

        const overviewData = await overviewRes.json()
        const trendsData = await trendsRes.json()

        if (overviewData.success) {
          setOverview(overviewData.data)
        }
        if (trendsData.success) {
          setTrends(trendsData.data)
        }
      } catch (err) {
        console.error('获取统计数据失败:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen pt-[72px] flex items-center justify-center">
        <div className="text-[#607080]">加载中...</div>
      </div>
    )
  }

  const todoTasks = overview?.taskStats?.TODO || 0
  const inProgressTasks = overview?.taskStats?.IN_PROGRESS || 0
  const doneTasks = overview?.taskStats?.DONE || 0
  const totalTasks = todoTasks + inProgressTasks + doneTasks
  const taskProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const handleExport = async (format: 'json' | 'csv') => {
    setExporting(true)
    try {
      const res = await fetch(`/api/export?format=${format}&type=all`)
      if (!res.ok) {
        alert('导出失败')
        return
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `cyberblog-export-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('导出失败:', err)
      alert('导出失败')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen pt-[72px]">
      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white font-mono">
            <span className="text-[#00d4ff]" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>{'//'}</span> 统计面板
          </h1>
          <p className="text-[#607080] mt-2">数据概览与趋势分析</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 文章数 */}
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#607080]">文章总数</span>
              <span className="text-2xl">📝</span>
            </div>
            <div className="text-3xl font-bold text-white font-mono">
              {overview?.postCount || 0}
            </div>
            <Link href="/blog" className="text-sm text-[#00d4ff] hover:underline mt-2 inline-block">
              查看文章 →
            </Link>
          </div>

          {/* 总浏览量 */}
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#607080]">总浏览量</span>
              <span className="text-2xl">👁️</span>
            </div>
            <div className="text-3xl font-bold text-white font-mono">
              {(overview?.totalViews || 0).toLocaleString()}
            </div>
            <p className="text-xs text-[#607080] mt-2">累计访问次数</p>
          </div>

          {/* 日报数 */}
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#607080]">日报总数</span>
              <span className="text-2xl">📋</span>
            </div>
            <div className="text-3xl font-bold text-white font-mono">
              {overview?.dailyLogCount || 0}
            </div>
            <Link href="/daily" className="text-sm text-[#00d4ff] hover:underline mt-2 inline-block">
              查看日报 →
            </Link>
          </div>

          {/* 任务完成率 */}
          <div className="cyber-card p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[#607080]">任务完成率</span>
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-3xl font-bold text-white font-mono">
              {taskProgress}%
            </div>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="text-[#ff453a]">待办 {todoTasks}</span>
              <span className="text-[#ffd60a]">进行 {inProgressTasks}</span>
              <span className="text-[#30d158]">完成 {doneTasks}</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 任务状态分布 */}
          <div className="cyber-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">任务状态分布</h2>
            {totalTasks > 0 ? (
              <div className="space-y-4">
                {/* TODO */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#ff453a]">待办</span>
                    <span className="text-white">{todoTasks} ({totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0}%)</span>
                  </div>
                  <div className="h-3 bg-[rgba(255,69,58,0.1)] rounded overflow-hidden">
                    <div
                      className="h-full bg-[#ff453a] transition-all"
                      style={{ width: `${totalTasks > 0 ? (todoTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* IN_PROGRESS */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#ffd60a]">进行中</span>
                    <span className="text-white">{inProgressTasks} ({totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0}%)</span>
                  </div>
                  <div className="h-3 bg-[rgba(255,214,10,0.1)] rounded overflow-hidden">
                    <div
                      className="h-full bg-[#ffd60a] transition-all"
                      style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* DONE */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#30d158]">已完成</span>
                    <span className="text-white">{doneTasks} ({totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%)</span>
                  </div>
                  <div className="h-3 bg-[rgba(48,209,88,0.1)] rounded overflow-hidden">
                    <div
                      className="h-full bg-[#30d158] transition-all"
                      style={{ width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-[#607080] py-8">暂无任务数据</p>
            )}
          </div>

          {/* 分类统计 */}
          <div className="cyber-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">分类文章分布</h2>
            {overview?.categoryStats && overview.categoryStats.length > 0 ? (
              <div className="space-y-3">
                {overview.categoryStats.map((cat, index) => {
                  const maxCount = Math.max(...overview.categoryStats.map(c => c.count))
                  const percentage = maxCount > 0 ? (cat.count / maxCount) * 100 : 0
                  const colors = ['#00d4ff', '#30d158', '#ffd60a', '#ff453a', '#bf5af2']
                  const color = colors[index % colors.length]

                  return (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#a8b8c8]">{cat.name}</span>
                        <span className="text-white">{cat.count}</span>
                      </div>
                      <div className="h-2 bg-[rgba(0,0,0,0.3)] rounded overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{ width: `${percentage}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-[#607080] py-8">暂无分类数据</p>
            )}
          </div>

          {/* 趋势数据 */}
          <div className="cyber-card p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-white mb-4">访问趋势（最近7天）</h2>
            {trends.length > 0 ? (
              <div className="h-48 flex items-end gap-2">
                {trends.map((trend, index) => {
                  const maxViews = Math.max(...trends.map(t => t.pageViews))
                  const height = maxViews > 0 ? (trend.pageViews / maxViews) * 100 : 0
                  const date = new Date(trend.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-[rgba(0,212,255,0.1)] rounded-t relative" style={{ height: '150px' }}>
                        <div
                          className="absolute bottom-0 w-full bg-gradient-to-t from-[#00d4ff] to-[#30d158] rounded-t transition-all"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#607080] mt-2">{date}</span>
                      <span className="text-xs text-white">{trend.pageViews}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-[#607080] py-12">暂无趋势数据</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 cyber-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">快捷操作</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/blog/new" className="cyber-btn cyber-btn-primary px-4 py-2">
              + 新建文章
            </Link>
            <Link href="/daily/new" className="cyber-btn px-4 py-2 border-[#00d4ff] text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)]">
              + 新建日报
            </Link>
            <Link href="/blog" className="cyber-btn px-4 py-2 border-[#607080] text-[#607080]">
              浏览文章
            </Link>
            <Link href="/daily" className="cyber-btn px-4 py-2 border-[#607080] text-[#607080]">
              查看日报
            </Link>
          </div>
        </div>

        {/* Data Export */}
        <div className="mt-6 cyber-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">数据导出</h2>
          <p className="text-[#607080] text-sm mb-4">导出文章、日报和统计数据</p>
          <div className="flex gap-4">
            <button
              onClick={() => handleExport('json')}
              disabled={exporting}
              className="cyber-btn px-4 py-2 border-[#bf5af2] text-[#bf5af2] hover:bg-[rgba(191,90,242,0.1)] disabled:opacity-50"
            >
              {exporting ? '导出中...' : '📥 导出 JSON'}
            </button>
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="cyber-btn px-4 py-2 border-[#30d158] text-[#30d158] hover:bg-[rgba(48,209,88,0.1)] disabled:opacity-50"
            >
              {exporting ? '导出中...' : '📥 导出 CSV'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}