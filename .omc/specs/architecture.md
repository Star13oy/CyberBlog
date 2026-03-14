# CyberBlog 架构设计文档

## 1. 系统架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 App Router                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Pages     │  │  Server     │  │   API       │          │
│  │  (SSR/ISR)  │  │  Actions    │  │   Routes    │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│    Prisma     │    │  NextAuth.js  │    │  Claude API   │
│     ORM       │    │   (Auth)      │    │   (AI)        │
└───────────────┘    └───────────────┘    └───────────────┘
        │
        ▼
┌───────────────┐
│    MySQL      │
│   Database    │
└───────────────┘
```

---

## 2. 数据模型设计 (Prisma Schema)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ==================== 用户相关 ====================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  password      String    // bcrypt 加密
  name          String?
  avatar        String?
  role          Role      @default(USER)
  status        Status    @default(ACTIVE)

  // 关联
  posts         Post[]
  dailyLogs     DailyLog[]
  comments      Comment[]
  sessions      Session[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([email])
  @@index([username])
}

enum Role {
  USER
  ADMIN
  AI_AGENT
}

enum Status {
  ACTIVE
  INACTIVE
  BANNED
}

// ==================== 文章相关 ====================

model Post {
  id            String      @id @default(cuid())
  title         String      @db.VarChar(200)
  slug          String      @unique
  content       String      @db.Text
  excerpt       String?     @db.VarChar(500)
  coverImage    String?

  // 分类和标签
  categoryId    String?
  category      Category?   @relation(fields: [categoryId], references: [id])
  tags          Tag[]

  // 统计
  viewCount     Int         @default(0)
  likeCount     Int         @default(0)
  commentCount  Int         @default(0)

  // 状态
  status        PostStatus  @default(DRAFT)
  isFeatured    Boolean     @default(false)
  publishedAt   DateTime?

  // AI 相关
  aiGenerated   Boolean     @default(false)
  aiSummary     String?     @db.Text

  // 关联
  authorId      String
  author        User        @relation(fields: [authorId], references: [id])
  comments      Comment[]

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([slug])
  @@index([categoryId])
  @@index([status])
  @@index([publishedAt])
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Category {
  id            String      @id @default(cuid())
  name          String      @unique
  slug          String      @unique
  description   String?
  icon          String?
  color         String?     // 赛博朋克配色

  posts         Post[]

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([slug])
}

model Tag {
  id            String      @id @default(cuid())
  name          String      @unique
  slug          String      @unique
  color         String?     // 霓虹色

  posts         Post[]

  createdAt     DateTime    @default(now())

  @@index([slug])
}

model Comment {
  id            String      @id @default(cuid())
  content       String      @db.Text

  postId        String
  post          Post        @relation(fields: [postId], references: [id])

  authorId      String
  author        User        @relation(fields: [authorId], references: [id])

  parentId      String?
  parent        Comment?    @relation("CommentReplies", fields: [parentId], references: [id])
  replies       Comment[]   @relation("CommentReplies")

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([postId])
}

// ==================== 日报相关 ====================

model DailyLog {
  id            String        @id @default(cuid())
  date          DateTime      @db.Date
  title         String?
  content       String        @db.Text

  // AI 生成
  aiGenerated   Boolean       @default(false)

  // 任务列表
  tasks         Task[]

  // 关联
  authorId      String
  author        User          @relation(fields: [authorId], references: [id])

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@unique([date, authorId])
  @@index([date])
}

model Task {
  id            String        @id @default(cuid())
  title         String
  description   String?
  status        TaskStatus    @default(TODO)
  progress      Int           @default(0) // 0-100

  dailyLogId    String
  dailyLog      DailyLog      @relation(fields: [dailyLogId], references: [id])

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([status])
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
  CANCELLED
}

// ==================== 统计相关 ====================

model Statistic {
  id            String      @id @default(cuid())
  date          DateTime    @db.Date

  // 文章统计
  postCount     Int         @default(0)
  viewCount     Int         @default(0)

  // 任务统计
  taskTotal     Int         @default(0)
  taskDone      Int         @default(0)

  // 代码统计
  commitCount   Int         @default(0)
  codeLines     Int         @default(0)

  createdAt     DateTime    @default(now())

  @@unique([date])
  @@index([date])
}

// ==================== 系统相关 ====================

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  expires      DateTime

  @@index([sessionToken])
}

model Setting {
  id          String    @id @default(cuid())
  key         String    @unique
  value       String    @db.Text
  description String?

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([key])
}
```

---

## 3. API 路由设计

### 3.1 认证 API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |
| POST | `/api/auth/logout` | 用户登出 |
| POST | `/api/auth/forgot-password` | 忘记密码 |
| POST | `/api/auth/reset-password` | 重置密码 |

### 3.2 文章 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/posts` | 文章列表 |
| GET | `/api/posts/[slug]` | 文章详情 |
| POST | `/api/posts` | 创建文章 |
| PUT | `/api/posts/[slug]` | 更新文章 |
| DELETE | `/api/posts/[slug]` | 删除文章 |

### 3.3 日报 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/daily-logs` | 日报列表 |
| GET | `/api/daily-logs/[date]` | 日报详情 |
| POST | `/api/daily-logs` | 创建日报 |
| PUT | `/api/daily-logs/[date]` | 更新日报 |
| POST | `/api/daily-logs/generate` | AI 生成日报 |

### 3.4 统计 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/stats` | 获取统计数据 |
| GET | `/api/stats/trends` | 趋势数据 |

### 3.5 AI API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/ai/generate-daily` | 生成日报 |
| POST | `/api/ai/extract-tags` | 提取标签 |
| POST | `/api/ai/summarize` | 生成摘要 |

---

## 4. 组件架构设计

### 4.1 页面组件

```
src/app/
├── layout.tsx              # 根布局
├── page.tsx                # 首页
├── (auth)/
│   ├── login/page.tsx      # 登录页
│   ├── register/page.tsx   # 注册页
│   └── forgot-password/    # 忘记密码
├── blog/
│   ├── page.tsx            # 博客列表
│   └── [slug]/page.tsx     # 文章详情
├── daily/
│   ├── page.tsx            # 日报列表
│   └── [date]/page.tsx     # 日报详情
├── admin/
│   ├── layout.tsx          # 管理后台布局
│   ├── posts/page.tsx      # 文章管理
│   └── settings/page.tsx   # 系统设置
└── api/                    # API 路由
```

### 4.2 公共组件

```
src/components/
├── ui/                     # 基础 UI 组件
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── Toast.tsx
├── layout/                 # 布局组件
│   ├── Header.tsx          # 导航栏
│   ├── Sidebar.tsx         # 侧边栏
│   └── Footer.tsx          # 页脚
├── blog/                   # 博客组件
│   ├── PostCard.tsx        # 文章卡片
│   ├── PostEditor.tsx      # 文章编辑器
│   └── PostList.tsx        # 文章列表
├── daily/                  # 日报组件
│   ├── DailyCard.tsx       # 日报卡片
│   └── TaskList.tsx        # 任务列表
├── stats/                  # 统计组件
│   ├── StatCard.tsx        # 统计卡片
│   └── TrendChart.tsx      # 趋势图表
└── cyber/                  # 赛博朋克特效
    ├── NeonText.tsx        # 霓虹文字
    ├── GlitchText.tsx      # 故障文字
    └── ParticleBg.tsx      # 粒子背景
```

---

## 5. 安全架构设计

### 5.1 认证流程

```
用户登录请求
    │
    ▼
验证邮箱/密码 ──────► 失败 ──► 返回错误
    │
    ▼ 成功
生成 JWT Token
    │
    ▼
设置 HttpOnly Cookie
    │
    ▼
返回用户信息
```

### 5.2 权限控制

| 角色 | 权限 |
|------|------|
| USER | 查看文章、评论、个人日报 |
| ADMIN | 所有功能、用户管理、系统设置 |
| AI_AGENT | 生成日报、提取标签 |

### 5.3 数据安全

- 密码：bcrypt 加密，salt rounds = 12
- 敏感数据：AES-256 加密存储
- API 密钥：环境变量，不提交代码
- 数据库：禁止硬编码连接信息

---

## 6. 部署架构

### 6.1 开发环境

```yaml
# docker-compose.dev.yml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://user:pass@db:3306/cyberblog
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=cyberblog
    volumes:
      - mysql_data:/var/lib/mysql
```

### 6.2 生产环境

```
┌─────────────┐     ┌─────────────┐
│   Nginx     │────►│  Next.js    │
│  (反向代理)  │     │  (多实例)   │
└─────────────┘     └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   MySQL     │
                   │  (主从复制)  │
                   └─────────────┘
```

---

## 7. 性能优化策略

### 7.1 前端优化
- ISR (增量静态生成) 用于文章页面
- 图片懒加载 + WebP 格式
- 代码分割 + 动态导入

### 7.2 后端优化
- 数据库连接池
- Redis 缓存热门数据
- API 响应压缩

### 7.3 数据库优化
- 合理设置索引
- 读写分离
- 定期归档旧数据