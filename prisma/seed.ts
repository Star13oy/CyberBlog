import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始种子数据...')

  // 创建管理员用户
  const hashedPassword = await bcrypt.hash('Admin123', 12)
  const admin = await prisma.users.upsert({
    where: { email: 'admin@cyberblog.com' },
    update: {},
    create: {
      id: 'user-admin',
      email: 'admin@cyberblog.com',
      username: 'admin',
      password: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
      status: 'ACTIVE',
      updatedAt: new Date(),
    },
  })
  console.log('✅ 创建管理员用户:', admin.username)

  // 创建分类
  const categories = await Promise.all([
    prisma.categories.upsert({
      where: { slug: 'frontend' },
      update: {},
      create: { id: 'cat-frontend', name: '前端开发', slug: 'frontend', color: '#00d4ff', updatedAt: new Date() },
    }),
    prisma.categories.upsert({
      where: { slug: 'backend' },
      update: {},
      create: { id: 'cat-backend', name: '后端架构', slug: 'backend', color: '#bf5af2', updatedAt: new Date() },
    }),
    prisma.categories.upsert({
      where: { slug: 'ai' },
      update: {},
      create: { id: 'cat-ai', name: 'AI / ML', slug: 'ai', color: '#30d158', updatedAt: new Date() },
    }),
    prisma.categories.upsert({
      where: { slug: 'devops' },
      update: {},
      create: { id: 'cat-devops', name: 'DevOps', slug: 'devops', color: '#ffd60a', updatedAt: new Date() },
    }),
  ])
  console.log('✅ 创建分类:', categories.length)

  // 创建标签
  const tags = await Promise.all([
    prisma.tags.upsert({ where: { slug: 'vue3' }, update: {}, create: { id: 'tag-vue', name: 'Vue3', slug: 'vue3' } }),
    prisma.tags.upsert({ where: { slug: 'react' }, update: {}, create: { id: 'tag-react', name: 'React', slug: 'react' } }),
    prisma.tags.upsert({ where: { slug: 'typescript' }, update: {}, create: { id: 'tag-typescript', name: 'TypeScript', slug: 'typescript' } }),
    prisma.tags.upsert({ where: { slug: 'nodejs' }, update: {}, create: { id: 'tag-nodejs', name: 'Node.js', slug: 'nodejs' } }),
    prisma.tags.upsert({ where: { slug: 'llm' }, update: {}, create: { id: 'tag-llm', name: 'LLM', slug: 'llm' } }),
    prisma.tags.upsert({ where: { slug: 'rag' }, update: {}, create: { id: 'tag-rag', name: 'RAG', slug: 'rag' } }),
  ])
  console.log('✅ 创建标签:', tags.length)

  console.log('🎉 种子数据完成!')
}

main()
  .catch((e) => {
    console.error('❌ 种子数据失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })