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

## 部署指南

### 方式一：Vercel 部署（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/cyberblog)

1. Fork 本仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

### 方式二：Docker 部署

#### 使用 Docker Compose（完整栈）

```bash
# 构建并启动
docker-compose -f docker-compose.prod.yml up -d --build

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f
```

#### 单独构建镜像

```bash
# 构建镜像
docker build -t cyberblog:latest .

# 运行容器
docker run -d \
  --name cyberblog \
  -p 3000:3000 \
  -e DATABASE_URL="mysql://root:password@host:3306/cyberblog" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e JWT_SECRET="your-jwt-secret" \
  cyberblog:latest
```

### 方式三：传统服务器部署

#### 1. 环境准备

```bash
# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
npm install -g pm2

# 安装 MySQL
sudo apt-get install mysql-server
```

#### 2. 构建项目

```bash
# 安装依赖
npm ci --production

# 生成 Prisma Client
npm run db:generate

# 构建项目
npm run build
```

#### 3. 启动服务

```bash
# 使用 PM2 启动
pm2 start npm --name "cyberblog" -- start

# 设置开机自启
pm2 startup
pm2 save
```

### 生产环境变量配置

创建 `.env.production` 文件：

```env
# 数据库
DATABASE_URL="mysql://user:password@host:3306/cyberblog?sslaccept=strict"

# 认证
NEXTAUTH_SECRET="your-secure-random-string-at-least-32-chars"
NEXTAUTH_URL="https://your-domain.com"
JWT_SECRET="another-secure-random-string"

# AI 功能（可选）
ANTHROPIC_API_KEY="your-claude-api-key"

# 其他
NODE_ENV="production"
```

### Nginx 反向代理配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## MCP 服务器配置

本项目集成了 MCP (Model Context Protocol) 服务器，用于 AI 助手连接项目上下文。

### 启用 MCP

在 Claude Code 中配置 `.mcp.json`：

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

### MCP 提供的功能

| 工具名称 | 功能描述 |
|---------|---------|
| `get_project_info` | 获取项目基本信息 |
| `get_api_endpoints` | 获取所有 API 端点列表 |
| `get_db_models` | 获取数据库模型信息 |
| `get_dev_server_status` | 检查开发服务器状态 |

## License

MIT