# Vue Documentation Project
# Vue 文档项目

This is a Vue.js documentation project built with VitePress, featuring a modern documentation site with Vue 3 integration.

这是一个使用 VitePress 构建的 Vue.js 文档项目，具有现代化的文档站点和 Vue 3 集成功能。

## Project Overview
## 项目概述

- Built with Vue 3 and VitePress
- Includes ECharts integration for data visualization
- Features markdown processing with custom attributes
- Supports Chinese pinyin processing
- Includes unit testing setup with Vitest

- 使用 Vue 3 和 VitePress 构建
- 集成 ECharts 用于数据可视化
- 支持带有自定义属性的 Markdown 处理
- 支持中文拼音处理
- 包含 Vitest 单元测试设置

## 🚀 Quick Start
## 🚀 快速开始

### Prerequisites
### 前置要求

- Node.js (Latest LTS version recommended)
- npm or yarn

- Node.js（推荐最新的 LTS 版本）
- npm 或 yarn

### Installation
### 安装

```bash
# Clone the repository
# 克隆仓库
git clone <your-repo-url>

# Install dependencies
# 安装依赖
npm install
```

### Development
### 开发

```bash
# Start the development server
# 启动开发服务器
npm run docs:dev

# Run unit tests
# 运行单元测试
npm run test:unit
```

### Building for Production
### 生产环境构建

```bash
# Build the documentation
# 构建文档
npm run docs:build

# Preview the production build
# 预览构建
npm run docs:preview
```

## 📦 Project Structure
## 📦 项目结构

- `/docs/` - Documentation source files | 文档源文件
- `/docs/.vitepress/` - VitePress configuration | VitePress 配置
- `/docs/.vitepress/utils/` - Utility functions | 工具函数
- `/tests/` - Unit tests | 单元测试

## 🛠️ Tech Stack
## 🛠️ 技术栈

- Vue 3
- VitePress
- ECharts
- Markdown-it
- Vitest for testing | 用于测试
- FontAwesome icons | FontAwesome 图标

## 📝 Scripts
## 📝 脚本命令

- `npm run dev` - Start Vite development server | 启动 Vite 开发服务器
- `npm run build` - Build for production | 生产环境构建
- `npm run preview` - Preview production build | 预览生产构建
- `npm run test:unit` - Run unit tests | 运行单元测试
- `npm run docs:dev` - Start documentation development server | 启动文档开发服务器
- `npm run docs:build` - Build documentation | 构建文档
- `npm run docs:preview` - Preview documentation build | 预览文档构建

## 🔧 Configuration
## 🔧 配置

The project uses:
项目使用：

- Vite for build tooling | 用于构建工具
- VitePress for documentation | 用于文档
- Custom middleware for HTML handling | 用于 HTML 处理的自定义中间件
- Path aliases for clean imports | 用于清晰导入的路径别名

## 📄 License
## 📄 许可证

This project is licensed under the terms found in the LICENSE file.
本项目遵循 LICENSE 文件中的许可条款。

---

For more detailed documentation, please refer to the `/docs` directory.
有关更详细的文档，请参阅 `/docs` 目录。
