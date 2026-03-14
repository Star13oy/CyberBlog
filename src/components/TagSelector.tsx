'use client'

import { useState, useEffect, useRef } from 'react'

interface Tag {
  id: string
  name: string
  slug: string
  _count?: { posts: number }
}

interface TagSelectorProps {
  selectedTags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export default function TagSelector({ selectedTags, onChange, placeholder = '输入标签名...' }: TagSelectorProps) {
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [inputValue, setInputValue] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 加载所有标签
  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/tags')
        const data = await res.json()
        if (data.success) {
          setAllTags(data.data)
        }
      } catch (err) {
        console.error('加载标签失败:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTags()
  }, [])

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 过滤标签
  const filteredTags = allTags.filter(
    tag =>
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.includes(tag.name)
  )

  // 添加标签
  const addTag = (tagName: string) => {
    const trimmed = tagName.trim()
    if (trimmed && !selectedTags.includes(trimmed)) {
      onChange([...selectedTags, trimmed])
    }
    setInputValue('')
    setShowDropdown(false)
  }

  // 移除标签
  const removeTag = (tagName: string) => {
    onChange(selectedTags.filter(t => t !== tagName))
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1])
    }
  }

  return (
    <div className="relative">
      {/* 已选标签 + 输入框 */}
      <div
        className="cyber-input min-h-[42px] flex flex-wrap gap-2 items-center cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {selectedTags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-[rgba(0,212,255,0.1)] text-[#00d4ff] rounded text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(tag)
              }}
              className="hover:text-white transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-primary text-sm"
        />
      </div>

      {/* 下拉选择框 */}
      {showDropdown && (inputValue || filteredTags.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-48 overflow-y-auto"
        >
          {loading ? (
            <div className="px-3 py-2 text-muted text-sm">加载中...</div>
          ) : filteredTags.length > 0 ? (
            filteredTags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => addTag(tag.name)}
                className="w-full px-3 py-2 text-left text-sm text-primary hover:bg-[rgba(0,212,255,0.1)] transition-colors flex justify-between items-center"
              >
                <span>{tag.name}</span>
                {tag._count && (
                  <span className="text-xs text-muted">{tag._count.posts} 篇</span>
                )}
              </button>
            ))
          ) : inputValue && !selectedTags.includes(inputValue) ? (
            <button
              type="button"
              onClick={() => addTag(inputValue)}
              className="w-full px-3 py-2 text-left text-sm text-accent hover:bg-[rgba(0,212,255,0.1)] transition-colors"
            >
              + 创建新标签 &ldquo;{inputValue}&rdquo;
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}