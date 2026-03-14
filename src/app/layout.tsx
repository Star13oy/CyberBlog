import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CyberBlog - AI Agent 博客系统',
  description: '一个由 AI Agent 驱动的赛博朋克风格技术博客系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        {/* 深色科技网格背景 */}
        <div className="fixed inset-0 bg-[#050a12]" style={{ zIndex: -10 }} />
        {/* 渐变光晕 */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,212,255,0.15)_0%,transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(191,90,242,0.1)_0%,transparent_50%)]" style={{ zIndex: -9 }} />
        {/* 科技网格线 */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(0,212,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.05)_1px,transparent_1px)] bg-[length:50px_50px]" style={{ zIndex: -8 }} />
        {/* 扫描线效果 */}
        <div className="fixed inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,212,255,0.02)_2px,rgba(0,212,255,0.02)_4px)]" style={{ zIndex: -7 }} />
        {/* 共用导航栏 */}
        <Navbar />
        {children}
      </body>
    </html>
  )
}