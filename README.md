# CyberBlog - 赛博朋克博客系统

一个由 AI Agent 驱动的赛博朋克风格技术博客系统。

## 特性

- 🤖 **AI Agent 集成** - 自动生成日报、提取标签、生成摘要
- 🎨 **赛博朋克 UI** - 霓虹光效、故障效果、粒子背景
- 📝 **博客管理** - Markdown 编辑、分类标签、评论系统
- 📅 **每日日报** - 任务追踪、进度可视化
- 📊 **统计面板** - 数据可视化、趋势分析
- 🔐 **用户认证** - JWT 认证、角色权限

## 技术栈

| 技术 | 说明 |
|------|------|
| Next.js 15 | App Router, SSR/ISR |
| React 18 | Server Components |
| TypeScript | 类型安全 |
| Tailwind CSS | 样式框架 |
| Prisma | ORM |
| MySQL | 数据库 |
| NextAuth.js | 认证 |
| Claude API | AI 功能 |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env`，修改数据库连接信息：

```env
DATABASE_URL="mysql://root:password@localhost:3306/cyberblog"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"
```

### 3. 启动数据库

使用 Docker Compose：

```bash
docker-compose up -d
```

### 4. 初始化数据库

```bash
# 生成 Prisma Client
npm run db:generate

# 创建数据库表
npm run db:push

# 填充种子数据
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
CyberBlog2.0/
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── api/       # API 路由
│   │   ├── blog/      # 博客页面
│   │   ├── daily/     # 日报页面
│   │   └── ...
│   ├── components/    # React 组件
│   ├── lib/           # 工具库
│   └── types/         # TypeScript 类型
├── prisma/            # 数据库
│   ├── schema.prisma  # 数据模型
│   └── seed.ts        # 种子数据
├── design/            # 原型设计
└── docs/              # 文档
```

## API 接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 文章
- `GET /api/posts` - 获取文章列表
- `GET /api/posts/[slug]` - 获取文章详情
- `POST /api/posts` - 创建文章
- `PUT /api/posts/[slug]` - 更新文章
- `DELETE /api/posts/[slug]` - 删除文章

### 日报
- `GET /api/daily-logs` - 获取日报列表
- `POST /api/daily-logs` - 创建日报

### 统计
- `GET /api/stats` - 获取统计数据

## 默认账户

种子数据创建的管理员账户：

- 邮箱: `admin@cyberblog.com`
- 密码: `Admin123`

## 开发规则

详见 [.omc/rules/project-rules.md](.omc/rules/project-rules.md)

- 文档先行
- 数据库危险操作谨慎
- 代码规范严格

## License

MIT