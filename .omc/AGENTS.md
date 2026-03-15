# CyberBlog Project Agents Configuration

## Project Overview

CyberBlog 2.0 - 赛博朋克 AI 博客系统

## Custom Magic Keywords

<keyword_detection>

| Keyword(s) | Skill | Action |
|-------------|-------|--------|
| "今日工作已结束", "下班", "收工", "今日总结", "工作结束" | `daily-report` | Read `.omc/skills/daily-report/SKILL.md`, 自动生成并发布今日日报 |

Detection rules:
- Keywords are case-insensitive and match anywhere in the user's message
- When triggered, immediately execute the daily-report skill workflow

</keyword_detection>

## Project-Specific Skills

### daily-report

**Triggers:** 今日工作已结束, 下班, 收工, 日报, 今日总结, 工作结束

**Purpose:** 自动汇总当日工作并发布到日报系统

**Location:** `.omc/skills/daily-report/SKILL.md`