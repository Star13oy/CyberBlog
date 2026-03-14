-- 初始化 CyberBlog 数据库
-- 注意：此脚本仅用于开发环境初始化

-- 创建默认管理员用户 (密码: Admin123)
-- 密码使用 bcrypt 加密，salt rounds = 12
INSERT INTO users (id, email, username, password, name, role, status, createdAt, updatedAt) VALUES
('user-admin', 'admin@cyberblog.com', 'admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.WFG.qFJiA0.mCa', 'Administrator', 'ADMIN', 'ACTIVE', NOW(), NOW());

-- 创建默认分类
INSERT INTO categories (id, name, slug, description, color, createdAt, updatedAt) VALUES
('cat-frontend', '前端开发', 'frontend', '前端技术相关文章', '#00d4ff', NOW(), NOW()),
('cat-backend', '后端架构', 'backend', '后端技术与架构设计', '#bf5af2', NOW(), NOW()),
('cat-ai', 'AI / ML', 'ai', '人工智能与机器学习', '#30d158', NOW(), NOW()),
('cat-devops', 'DevOps', 'devops', '运维与部署', '#ffd60a', NOW(), NOW());

-- 创建默认标签
INSERT INTO tags (id, name, slug, color, createdAt) VALUES
('tag-vue', 'Vue3', 'vue3', '#42b883', NOW()),
('tag-react', 'React', 'react', '#61dafb', NOW()),
('tag-typescript', 'TypeScript', 'typescript', '#3178c6', NOW()),
('tag-nodejs', 'Node.js', 'nodejs', '#339933', NOW()),
('tag-python', 'Python', 'python', '#3776ab', NOW()),
('tag-docker', 'Docker', 'docker', '#2496ed', NOW()),
('tag-llm', 'LLM', 'llm', '#ff6b6b', NOW()),
('tag-rag', 'RAG', 'rag', '#a855f7', NOW());

-- 创建示例文章
INSERT INTO posts (id, title, slug, content, excerpt, categoryId, authorId, status, viewCount, publishedAt, createdAt, updatedAt) VALUES
('post-1', 'Vue3 组合式 API 最佳实践指南', 'vue3-composition-api-guide', '# Vue3 组合式 API 最佳实践\n\n本文介绍 Vue3 Composition API 的使用技巧...\n\n## 响应式原理\n\n## 组件设计模式\n\n## 性能优化', '深入探讨 Vue3 Composition API 在大型项目中的应用，包括响应式原理、组件设计模式和性能优化策略。', 'cat-frontend', 'user-admin', 'PUBLISHED', 1234, NOW(), NOW(), NOW()),
('post-2', 'RAG 系统设计与实现详解', 'rag-system-design', '# RAG 系统设计\n\n本文介绍如何从零构建企业级 RAG 系统...\n\n## 向量数据库选型\n\n## Embedding 策略\n\n## 检索优化', '从零构建企业级 RAG 检索增强生成系统，涵盖向量数据库选型、Embedding 策略和检索优化技巧。', 'cat-ai', 'user-admin', 'PUBLISHED', 2156, NOW(), NOW(), NOW());

-- 关联文章标签
INSERT INTO `_PostToTag` (`A`, `B`) VALUES
('post-1', 'tag-vue'),
('post-1', 'tag-typescript'),
('post-2', 'tag-llm'),
('post-2', 'tag-rag');

-- 创建示例日报
INSERT INTO daily_logs (id, date, title, content, aiGenerated, authorId, createdAt, updatedAt) VALUES
('log-1', CURDATE(), '项目初始化完成', '今天完成了 CyberBlog 项目的初始化工作：\n\n1. 创建 Next.js 15 项目结构\n2. 配置 Prisma + MySQL\n3. 实现赛博朋克风格 UI\n4. 完成用户认证 API', false, 'user-admin', NOW(), NOW());

-- 创建示例任务
INSERT INTO tasks (id, title, description, status, progress, dailyLogId, createdAt, updatedAt) VALUES
('task-1', '项目初始化', '创建 Next.js 项目和基础配置', 'DONE', 100, 'log-1', NOW(), NOW()),
('task-2', '数据库设计', '设计 Prisma Schema', 'DONE', 100, 'log-1', NOW(), NOW()),
('task-3', 'UI 开发', '实现赛博朋克风格界面', 'IN_PROGRESS', 80, 'log-1', NOW(), NOW());