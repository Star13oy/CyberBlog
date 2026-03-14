// 用户类型
export interface User {
  id: string
  email: string
  username: string
  name: string | null
  avatar: string | null
  role: 'USER' | 'ADMIN' | 'AI_AGENT'
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
  createdAt: Date
  updatedAt: Date
}

// 文章类型
export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  categoryId: string | null
  viewCount: number
  likeCount: number
  commentCount: number
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  isFeatured: boolean
  publishedAt: Date | null
  aiGenerated: boolean
  aiSummary: string | null
  authorId: string
  createdAt: Date
  updatedAt: Date
  author?: User
  category?: Category
  tags?: Tag[]
}

// 分类类型
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  createdAt: Date
  updatedAt: Date
}

// 标签类型
export interface Tag {
  id: string
  name: string
  slug: string
  color: string | null
  createdAt: Date
}

// 评论类型
export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
  parentId: string | null
  createdAt: Date
  updatedAt: Date
  author?: User
  replies?: Comment[]
}

// 日报类型
export interface DailyLog {
  id: string
  date: Date
  title: string | null
  content: string
  aiGenerated: boolean
  authorId: string
  createdAt: Date
  updatedAt: Date
  tasks?: Task[]
}

// 任务类型
export interface Task {
  id: string
  title: string
  description: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
  progress: number
  dailyLogId: string
  createdAt: Date
  updatedAt: Date
}

// 统计类型
export interface Statistic {
  id: string
  date: Date
  postCount: number
  viewCount: number
  taskTotal: number
  taskDone: number
  commitCount: number
  codeLines: number
  createdAt: Date
}

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 分页类型
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}