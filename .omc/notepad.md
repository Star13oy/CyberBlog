# Notepad
<!-- Auto-managed by OMC. Manual edits preserved in MANUAL section. -->

## Priority Context
<!-- ALWAYS loaded. Keep under 500 chars. Critical discoveries only. -->
CyberBlog 2.0 - 赛博朋克AI博客系统。技术栈: Next.js 15 + React 18 + TypeScript + Prisma + MySQL。当前Phase 1完成，Phase 2认证模块进行中。核心功能: 博客文章、每日日报(AI生成)、统计面板。开发规则: 文档先行、数据库操作谨慎、TypeScript strict模式。

## Working Memory
<!-- Session notes. Auto-pruned after 7 days. -->

## MANUAL
<!-- User content. Never auto-pruned. -->
### 2026-03-15 06:24
### 2026-03-15 06:26
## 文档先行原则

**规则：所有代码改动必须先修改文档**

执行流程：
1. 收到代码改动需求时，先定位相关文档
2. 更新文档描述改动内容和原因
3. 确认文档更新后再进行代码修改
4. 代码完成后再次检查文档是否同步

适用文档类型：
- README.md
- API 文档
- 代码注释
- CLAUDE.md / AGENTS.md
- 设计文档


## 2026-03-15 06:24
## Daily Report 自动化规则

当用户说以下词汇时自动生成日报：
- 今日工作已结束
- 下班
- 收工
- 今日总结
- 工作结束

执行步骤：
1. 查询今日 Git 提交记录
2. 汇总会话中完成的任务
3. 生成结构化日报内容
4. 调用 POST /api/daily-logs 发布

Skill 位置: .omc/skills/daily-report/SKILL.md


