#!/bin/bash
# CyberBlog Daily Report Hook
# 当用户说"今日工作结束"时自动触发日报创建

# 这个hook会在检测到关键词时被触发
# 它会读取会话中完成的任务并创建日报

echo "DAILY_REPORT_TRIGGER=true"