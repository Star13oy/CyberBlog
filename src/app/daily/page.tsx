import { prisma } from '@/lib/prisma'

// 动态渲染，不在构建时查询数据库
export const dynamic = 'force-dynamic'

export default async function DailyPage() {
  // 获取日报列表
  const logs = await prisma.dailyLog.findMany({
    take: 20,
    orderBy: { date: 'desc' },
    include: {
      author: { select: { id: true, username: true, name: true } },
      tasks: true,
    },
  })

  // 获取今日日期
  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div className="min-h-screen pt-[72px]">
      {/* 主内容 */}
      <main className="max-w-4xl mx-auto px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white font-mono">
            <span className="text-[#00d4ff]" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>{'//'}</span> 每日日报
          </h1>
          <span className="text-sm text-[#607080]">📅 {today}</span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-20 text-[#607080]">
            <p className="text-4xl mb-4">📋</p>
            <p>暂无日报</p>
          </div>
        ) : (
          <div className="space-y-6">
            {logs.map((log) => {
              const doneTasks = log.tasks.filter(t => t.status === 'DONE').length
              const totalTasks = log.tasks.length
              const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

              return (
                <div key={log.id} className="cyber-card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {log.title || `${new Date(log.date).toLocaleDateString('zh-CN')} 日报`}
                      </h3>
                      {log.aiGenerated && (
                        <span className="text-xs text-[#30d158] bg-[rgba(48,209,88,0.1)] px-2 py-1 rounded mt-1 inline-block">
                          🤖 AI 生成
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-[#607080]">
                      {new Date(log.date).toLocaleDateString('zh-CN')}
                    </span>
                  </div>

                  <p className="text-sm text-[#a8b8c8] mb-4 line-clamp-3">{log.content}</p>

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
      </main>
    </div>
  )
}