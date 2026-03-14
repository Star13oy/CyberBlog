# CyberBlog 项目开发规则

## 核心原则

### 1. 文档先行 (Documentation First)
- 所有功能开发前必须先编写文档
- 文档包括：功能说明、API 设计、数据模型设计
- 文档存放在 `docs/` 目录下
- 代码实现必须与文档保持一致

### 2. 数据库安全 (Database Safety)
- **危险操作必须谨慎**：DROP、TRUNCATE、DELETE 全表等操作
- 所有数据库迁移必须生成迁移文件，禁止直接执行
- 生产环境数据库操作必须备份
- 敏感数据必须加密存储
- 数据库连接信息必须使用环境变量

### 3. 代码规范
- 使用 TypeScript strict 模式
- 遵循 ESLint 和 Prettier 配置
- 组件命名：PascalCase
- 函数命名：camelCase
- 常量命名：UPPER_SNAKE_CASE
- 文件命名：kebab-case

### 4. Git 提交规范
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试相关
- chore: 构建/工具相关

## 技术栈

- **前端**: Next.js 15 + React 18 + TypeScript
- **样式**: Tailwind CSS + CSS Modules
- **数据库**: MySQL + Prisma ORM
- **认证**: NextAuth.js
- **AI 集成**: Claude API

## 项目结构

```
CyberBlog2.0/
├── docs/                    # 文档目录（文档先行）
│   ├── architecture.md      # 架构设计
│   ├── api-design.md        # API 设计
│   ├── data-model.md        # 数据模型
│   └── features/            # 功能文档
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React 组件
│   ├── lib/                 # 工具库
│   ├── types/               # TypeScript 类型
│   └── styles/              # 样式文件
├── prisma/                  # 数据库相关
│   ├── schema.prisma        # 数据模型
│   └── migrations/          # 迁移文件
├── tests/                   # 测试文件
└── design/                  # 原型设计
```

## 开发流程

1. **需求分析** → 编写功能文档
2. **数据设计** → 设计数据模型，生成迁移
3. **API 开发** → 实现后端接口
4. **前端开发** → 实现页面和组件
5. **测试验证** → 编写测试，验证功能
6. **文档更新** → 更新相关文档

## 禁止事项

- 禁止直接执行 DROP DATABASE / DROP TABLE
- 禁止在代码中硬编码数据库密码
- 禁止提交 .env 文件到版本控制
- 禁止未经测试直接推送生产代码