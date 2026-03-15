# CyberBlog 2.0 - 赛博朋克 AI 博客系统

一个由 AI Agent 驱动的赛博朋克风格技术博客系统。

## 特性

- 🤖 **AI Agent 集成** - 自动生成日报、智能标签提取
- 🎨 **赛博朋克 UI** - 霓虹光效、故障效果、HUD 风格界面
- 📝 **博客管理** - Markdown 支持、分类标签、文章发布
- 📅 **每日日报** - 任务追踪、进度可视化、AI 辅助生成
- 📊 **统计面板** - 数据可视化、文章/访问统计
- 🔐 **用户认证** - JWT 认证、角色权限管理

## 技术栈

| 技术 | 说明 |
|------|------|
| Next.js 15 | App Router, SSR/ISR |
| React 18 | Server Components |
| TypeScript | 类型安全 |
| Tailwind CSS | 样式框架 |
| Prisma | ORM |
| PostgreSQL | 数据库 |
| JWT | 认证 |

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env`，修改配置：

```env
# 数据库 (PostgreSQL)
DATABASE_URL="postgresql://cyberblog:cyberblog123@localhost:5432/cyberblog?schema=public"

# 认证
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-change-in-production"
JWT_SECRET="your-jwt-secret-change-in-production"

# AI 功能（可选）
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

### 3. 启动数据库

使用 Docker Compose：

```bash
docker-compose up -d
```

或使用本地 PostgreSQL：

```bash
# 确保 PostgreSQL 运行中
pg_isready -h localhost -p 5432
```

### 4. 初始化数据库

```bash
# 生成 Prisma Client
npm run db:generate

# 创建数据库表
npm run db:push

# 填充种子数据（可选）
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 项目结构

```
CyberBlog/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API 路由
│   │   │   ├── auth/     # 认证接口
│   │   │   ├── posts/    # 文章接口
│   │   │   ├── daily-logs/ # 日报接口
│   │   │   ├── stats/    # 统计接口
│   │   │   ├── tags/     # 标签接口
│   │   │   ├── tasks/    # 任务接口
│   │   │   ├── comments/ # 评论接口
│   │   │   └── export/   # 导出接口
│   │   ├── blog/         # 博客页面
│   │   ├── daily/        # 日报页面
│   │   ├── dashboard/    # 仪表盘页面
│   │   ├── about/        # 关于页面
│   │   ├── login/        # 登录页面
│   │   └── register/     # 注册页面
│   ├── components/       # React 组件
│   ├── lib/              # 工具库
│   └── types/            # TypeScript 类型
├── prisma/               # 数据库
│   ├── schema.prisma     # 数据模型
│   └── seed.ts           # 种子数据
├── .omc/                 # 项目配置
│   ├── skills/           # 自定义 Skills
│   └── AGENTS.md         # Agent 配置
└── .mcp/                 # MCP 服务器
```

## API 接口

### 认证
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/logout | 用户登出 |
| GET | /api/auth/me | 获取当前用户 |

### 文章
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/posts | 获取文章列表 |
| GET | /api/posts/[slug] | 获取文章详情 |
| POST | /api/posts | 创建文章 |
| PUT | /api/posts/[slug] | 更新文章 |
| DELETE | /api/posts/[slug] | 删除文章 |

### 日报
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/daily-logs | 获取日报列表 |
| GET | /api/daily-logs/[id] | 获取日报详情 |
| POST | /api/daily-logs | 创建日报 |
| PUT | /api/daily-logs/[id] | 更新日报 |

### 其他
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/stats | 获取统计数据 |
| GET | /api/tags | 获取标签列表 |
| GET | /api/tasks | 获取任务列表 |
| POST | /api/tasks | 创建任务 |
| GET | /api/comments | 获取评论列表 |
| POST | /api/comments | 创建评论 |
| GET | /api/export | 导出数据 |

## 默认账户

种子数据创建的管理员账户：

- 用户名: `admin`
- 邮箱: `admin@cyberblog.com`
- 密码: `Admin123`

## 开发规则

详见 [.omc/rules/project-rules.md](.omc/rules/project-rules.md)

- **文档先行** - 代码改动前先更新文档
- **数据库操作谨慎** - 危险操作需确认
- **TypeScript 严格模式** - 类型安全

## AI Agent 集成

### 日报自动化

当用户说 "今日工作已结束"、"下班" 等关键词时，AI Agent 会自动：
1. 收集今日 Git 提交记录
2. 汇总会话中完成的任务
3. 生成结构化日报
4. 发布到日报系统

详见 [.omc/skills/daily-report/SKILL.md](.omc/skills/daily-report/SKILL.md)

## MCP 服务器配置

本项目集成了 MCP (Model Context Protocol) 服务器。

### 启用 MCP

在 Claude Code 中配置：

```json
{
  "mcpServers": {
    "cyberblog": {
      "command": "node",
      "args": ["./.mcp/server.mjs"],
      "env": {
        "PROJECT_ROOT": "."
      }
    }
  }
}
```

### MCP 工具

| 工具名称 | 功能描述 |
|---------|---------|
| `get_project_info` | 获取项目基本信息 |
| `get_api_endpoints` | 获取所有 API 端点列表 |
| `get_db_models` | 获取数据库模型信息 |
| `get_dev_server_status` | 检查开发服务器状态 |

## 部署指南

### Vercel 部署（推荐）

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

### Docker 部署

```bash
# 构建镜像
docker build -t cyberblog:latest .

# 运行容器
docker run -d \
  --name cyberblog \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/cyberblog" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e JWT_SECRET="your-jwt-secret" \
  cyberblog:latest
```

### 传统服务器部署

```bash
# 安装依赖
npm ci --production

# 生成 Prisma Client
npm run db:generate

# 构建项目
npm run build

# 使用 PM2 启动
pm2 start npm --name "cyberblog" -- start
pm2 startup
pm2 save
```

## License

MIT