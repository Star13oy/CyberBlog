import { z } from 'zod'

// 用户注册验证
export const registerSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  username: z.string().min(3, '用户名至少3个字符').max(20, '用户名最多20个字符'),
  password: z.string().min(8, '密码至少8个字符').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    '密码必须包含大小写字母和数字'
  ),
  name: z.string().optional(),
})

// 用户登录验证
export const loginSchema = z.object({
  email: z.string().email('邮箱格式不正确'),
  password: z.string().min(1, '请输入密码'),
})

// 文章创建验证
export const createPostSchema = z.object({
  title: z.string().min(1, '标题不能为空').max(200, '标题最多200个字符'),
  content: z.string().min(1, '内容不能为空'),
  excerpt: z.string().max(500, '摘要最多500个字符').optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
})

// 日报创建验证
export const createDailyLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式不正确'),
  title: z.string().max(100, '标题最多100个字符').optional(),
  content: z.string().min(1, '内容不能为空'),
  tasks: z.array(z.object({
    title: z.string().min(1, '任务标题不能为空'),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED']).default('TODO'),
    progress: z.number().min(0).max(100).default(0),
  })).optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type CreateDailyLogInput = z.infer<typeof createDailyLogSchema>