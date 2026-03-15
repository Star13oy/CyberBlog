---
name: daily-report
description: 自动生成今日工作日报到 CyberBlog 系统
triggers:
  - 今日工作已结束
  - 下班
  - 收工
  - 日报
  - 今日总结
  - 工作结束
  - 结束工作
argument-hint: "[自定义内容]"
---

# Daily Report Skill

## Purpose

当用户表示工作结束时，自动汇总当天的工作内容并生成日报，发布到 CyberBlog 系统的日报模块。

## When to Activate

当用户消息包含以下任一关键词时自动触发：
- "今日工作已结束"
- "下班"
- "收工"
- "日报"
- "今日总结"
- "工作结束"
- "结束工作"

## Workflow

### Step 1: 收集今日工作信息

1. **查看 Git 提交记录**
   ```bash
   git log --since="today 00:00:00" --until="now" --oneline
   ```

2. **查看当前会话完成的任务**
   - 检查 TaskList 中的已完成任务
   - 回顾对话中的重要操作

### Step 2: 生成日报内容

根据收集的信息，生成结构化的日报内容：

```markdown
## 今日工作总结

### 已完成任务
- [任务1描述]
- [任务2描述]

### 技术要点
- [关键技术点/解决方案]

### 明日计划
- [待办事项]
```

### Step 3: 发布日报

1. 获取用户 ID：
   ```bash
   PGPASSWORD=cyberblog123 psql -h localhost -U cyberblog -d cyberblog -c "SELECT id FROM users LIMIT 1;"
   ```

2. 调用日报 API：
   ```bash
   curl -X POST http://localhost:3000/api/daily-logs \
     -H "Content-Type: application/json" \
     -d '{
       "date": "YYYY-MM-DD",
       "title": "日报标题",
       "content": "日报内容...",
       "authorId": "用户ID",
       "aiGenerated": true,
       "tasks": [...]
     }'
   ```

### Step 4: 确认发布

向用户展示日报摘要并确认发布成功。

## Notes

- 如果今日已有日报，则更新而非新建
- 日报默认标记为 AI 生成 (`aiGenerated: true`)
- 任务状态根据完成情况设置为 TODO/IN_PROGRESS/DONE
- 作者 ID 从数据库查询，默认使用 admin 用户
- 开发服务器需要在运行 (localhost:3000)