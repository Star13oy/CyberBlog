'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import TagSelector from '@/components/TagSelector'

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'DRAFT',
    selectedTags: [] as string[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt || formData.content.slice(0, 200),
          status: formData.status,
          tags: formData.selectedTags,
        }),
      })

      const data = await res.json()

      if (data.success) {
        router.push(`/blog/${data.data.slug}`)
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
    <div className="page-container">
      <main className="editor-container">
        {/* Header */}
        <div className="editor-header">
          <h1 className="editor-title">
            <span className="page-title-prefix">{'//'}</span> 创建文章
          </h1>
          <div className="editor-actions">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`preview-toggle ${showPreview ? 'active' : ''}`}
            >
              {showPreview ? '隐藏预览' : '显示预览'}
            </button>
            <Link
              href="/blog"
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              ← 返回列表
            </Link>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="form-error">{error}</div>
          )}

          {/* Title */}
          <div>
            <label className="editor-label">标题 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="cyber-input w-full"
              placeholder="输入文章标题"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="editor-label">摘要</label>
            <input
              type="text"
              value={formData.excerpt}
              onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
              className="cyber-input w-full"
              placeholder="简短描述（可选，默认截取内容前200字）"
            />
          </div>

          {/* Content with Preview */}
          <div className={showPreview ? 'grid grid-cols-2 gap-4' : ''}>
            <div>
              <label className="editor-label">内容 * (支持 Markdown)</label>
              <textarea
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className="cyber-input w-full min-h-[400px] font-mono text-sm"
                placeholder={`# 标题\n\n文章内容...`}
                required
              />
            </div>

            {showPreview && (
              <div>
                <label className="editor-label">预览</label>
                <div className="cyber-card p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
                  {formData.title && (
                    <h1 className="text-2xl font-bold text-primary mb-4">{formData.title}</h1>
                  )}
                  {formData.content ? (
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-2xl font-bold text-primary mb-4 mt-6">{children}</h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-xl font-bold text-primary mb-3 mt-5">{children}</h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-lg font-bold text-accent mb-2 mt-4">{children}</h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-secondary mb-4 leading-relaxed">{children}</p>
                          ),
                          code: ({ className, children }) => {
                            const isInline = !className
                            return isInline ? (
                              <code className="bg-[rgba(0,0,0,0.3)] text-accent px-1.5 py-0.5 rounded text-sm font-mono">
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-[rgba(0,0,0,0.3)] p-4 rounded-lg text-sm font-mono overflow-x-auto">
                                {children}
                              </code>
                            )
                          },
                          pre: ({ children }) => (
                            <pre className="bg-[rgba(0,0,0,0.3)] p-4 rounded-lg mb-4 overflow-x-auto">
                              {children}
                            </pre>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent pl-4 my-4 text-secondary italic">
                              {children}
                            </blockquote>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside text-secondary mb-4 space-y-1">{children}</ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside text-secondary mb-4 space-y-1">{children}</ol>
                          ),
                          a: ({ href, children }) => (
                            <a href={href} className="text-accent hover:underline">{children}</a>
                          ),
                        }}
                      >
                        {formData.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-muted text-center py-20">开始输入内容以预览...</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="editor-label">标签</label>
            <TagSelector
              selectedTags={formData.selectedTags}
              onChange={(tags) => setFormData({ ...formData, selectedTags: tags })}
              placeholder="输入标签名后按 Enter 添加..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="editor-label">状态</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="DRAFT"
                  checked={formData.status === 'DRAFT'}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="accent-[var(--primary)]"
                />
                <span className="text-secondary">草稿</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="PUBLISHED"
                  checked={formData.status === 'PUBLISHED'}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="accent-[var(--success)]"
                />
                <span className="text-secondary">发布</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="cyber-btn cyber-btn-primary px-8 py-3 disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建文章'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="cyber-btn cyber-btn-ghost px-8 py-3"
            >
              取消
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}