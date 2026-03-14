#!/usr/bin/env node

/**
 * CyberBlog MCP Server
 * 提供博客系统的上下文信息，便于 Claude Code 自动识别项目
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import fs from 'fs'
import path from 'path'

const PROJECT_ROOT = process.env.PROJECT_ROOT || process.cwd()

// 项目信息
const PROJECT_INFO = {
  name: 'CyberBlog 2.0',
  description: '赛博朋克风格的 AI 驱动技术博客系统',
  techStack: ['Next.js 15', 'React 18', 'TypeScript', 'Prisma', 'MySQL', 'Tailwind CSS'],
  features: ['博客文章管理', '每日日报(AI生成)', '用户认证', '统计面板'],
}

// API 端点信息
const API_ENDPOINTS = [
  { path: '/api/posts', method: 'GET, POST', description: '博客文章列表/创建' },
  { path: '/api/posts/[slug]', method: 'GET, PUT, DELETE', description: '博客文章详情/更新/删除' },
  { path: '/api/daily-logs', method: 'GET, POST', description: '每日日报列表/创建' },
  { path: '/api/daily-logs/[id]', method: 'GET, PUT, DELETE', description: '日报详情/更新/删除' },
  { path: '/api/auth/login', method: 'POST', description: '用户登录' },
  { path: '/api/auth/register', method: 'POST', description: '用户注册' },
  { path: '/api/auth/me', method: 'GET', description: '获取当前用户' },
  { path: '/api/auth/logout', method: 'POST', description: '用户登出' },
  { path: '/api/comments', method: 'GET, POST, DELETE', description: '评论管理' },
  { path: '/api/tags', method: 'GET, POST', description: '标签管理' },
  { path: '/api/tasks', method: 'GET, POST, PUT, DELETE', description: '任务管理' },
  { path: '/api/stats', method: 'GET', description: '统计数据' },
]

// 数据库模型
const DB_MODELS = [
  { name: 'users', description: '用户表', fields: ['id', 'email', 'username', 'password', 'name', 'role', 'status'] },
  { name: 'posts', description: '文章表', fields: ['id', 'title', 'slug', 'content', 'excerpt', 'viewCount', 'status'] },
  { name: 'daily_logs', description: '日报表', fields: ['id', 'date', 'title', 'content', 'aiGenerated'] },
  { name: 'categories', description: '分类表', fields: ['id', 'name', 'slug', 'color'] },
  { name: 'tags', description: '标签表', fields: ['id', 'name', 'slug'] },
  { name: 'comments', description: '评论表', fields: ['id', 'content', 'postId', 'authorId'] },
  { name: 'tasks', description: '任务表', fields: ['id', 'title', 'status', 'progress', 'dailyLogId'] },
]

// 创建服务器
const server = new Server(
  { name: 'cyberblog-mcp', version: '1.0.0' },
  { capabilities: { resources: {}, tools: {} } }
)

// 列出可用工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_project_info',
        description: '获取 CyberBlog 项目信息',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_api_endpoints',
        description: '获取所有 API 端点列表',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_db_models',
        description: '获取数据库模型信息',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_dev_server_status',
        description: '检查开发服务器状态',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_recent_changes',
        description: '获取最近的代码变更',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'suggest_next_task',
        description: '根据项目状态建议下一步工作',
        inputSchema: { type: 'object', properties: {} },
      },
    ],
  }
})

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params

  switch (name) {
    case 'get_project_info':
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            ...PROJECT_INFO,
            projectRoot: PROJECT_ROOT,
            packageManager: 'npm',
            devCommand: 'npm run dev',
            buildCommand: 'npm run build',
          }, null, 2),
        }],
      }

    case 'get_api_endpoints':
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(API_ENDPOINTS, null, 2),
        }],
      }

    case 'get_db_models':
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(DB_MODELS, null, 2),
        }],
      }

    case 'get_dev_server_status':
      // 检查是否有运行中的开发服务器
      const port = 3000
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            projectRoot: PROJECT_ROOT,
            devPort: port,
            devCommand: 'npm run dev',
            hint: '运行 npm run dev 启动开发服务器',
          }, null, 2),
        }],
      }

    case 'get_recent_changes':
      // 读取最近的 git 变更
      try {
        const gitLogPath = path.join(PROJECT_ROOT, '.git', 'logs', 'HEAD')
        if (fs.existsSync(gitLogPath)) {
          const log = fs.readFileSync(gitLogPath, 'utf-8').split('\n').slice(-5)
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({ recentCommits: log.filter(l => l.trim()) }, null, 2),
            }],
          }
        }
      } catch (e) {
        // ignore
      }
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ message: '无法读取 git 历史' }, null, 2),
        }],
      }

    case 'suggest_next_task':
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            suggestions: [
              '检查开发服务器是否运行 (npm run dev)',
              '查看最近的日报记录',
              '检查是否有未完成的任务',
              '查看博客文章列表',
              '运行数据库迁移 (npx prisma migrate dev)',
            ],
            defaultLogin: { username: 'admin', password: 'Admin123' },
          }, null, 2),
        }],
      }

    default:
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ error: '未知工具' }, null, 2),
        }],
      }
  }
})

// 列出资源
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'cyberblog://project/info',
        name: 'CyberBlog 项目信息',
        mimeType: 'application/json',
      },
      {
        uri: 'cyberblog://api/endpoints',
        name: 'API 端点列表',
        mimeType: 'application/json',
      },
      {
        uri: 'cyberblog://db/models',
        name: '数据库模型',
        mimeType: 'application/json',
      },
    ],
  }
})

// 读取资源
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params

  if (uri === 'cyberblog://project/info') {
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(PROJECT_INFO, null, 2),
      }],
    }
  }

  if (uri === 'cyberblog://api/endpoints') {
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(API_ENDPOINTS, null, 2),
      }],
    }
  }

  if (uri === 'cyberblog://db/models') {
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(DB_MODELS, null, 2),
      }],
    }
  }

  return { contents: [] }
})

// 启动服务器
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('CyberBlog MCP Server started')
}

main().catch(console.error)