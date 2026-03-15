import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Noto_Sans_SC } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-chinese',
  display: 'swap',
})

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
    <html lang="zh" className={`${inter.variable} ${jetbrainsMono.variable} ${notoSansSC.variable}`}>
      <body className="font-sans">
        <ThemeProvider>
          {/* 深色科技网格背景 */}
          <div className="fixed inset-0 transition-colors duration-300" style={{ background: 'var(--bg-dark)', zIndex: -10 }} />
          {/* 渐变光晕 */}
          <div className="fixed inset-0 transition-colors duration-300" style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(0,212,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(191,90,242,0.1) 0%, transparent 50%)',
            zIndex: -9
          }} />
          {/* 科技网格线 */}
          <div className="fixed inset-0 transition-colors duration-300" style={{
            backgroundImage: 'linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            zIndex: -8
          }} />
          {/* 扫描线效果 */}
          <div className="fixed inset-0 pointer-events-none transition-colors duration-300" style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.02) 2px, rgba(0,212,255,0.02) 4px)',
            zIndex: -7
          }} />
          {/* 共用导航栏 */}
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}