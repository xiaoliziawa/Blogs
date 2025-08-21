<ModInfo 
  curseForgeId="kubeloader" 
  modName="KubeLoader" 
  projectId="1205072"
  modrinthId="kubeloader"
  modrinthSlug="kubeloader"
/>

# KubeLoader

## 模组简介

KubeLoader 是下一代 KubeJS 开发框架，它不仅仅是另一个 KubeJS 附属模组，而是一个面向未来的模块化开发平台，彻底革新了脚本的创建、分发和管理方式。

KubeLoader 引入了革命性的 **ContentPack 系统**，重新定义了 KubeJS 脚本的分发和加载方式，使脚本能够像一等公民模组一样被对待。

## 核心特性

### 🚀 **ContentPack 系统**
- **多格式支持**：从文件夹、ZIP 压缩包和 JAR 文件读取 ContentPack
- **快速开发**：快速创建 ContentPack 项目并导出为 JAR 模组
- **模块化架构**：将脚本视为独立、可重用的模块

### ⚡ **增强事件系统**
- **扩展事件**：添加新的 Forge 事件以增强脚本开发能力
- **高级工具**：额外的实用类来简化 KubeJS 开发
- **生命周期管理**：对 ContentPack 初始化和执行的全面控制

### 🔗 **依赖管理**
- **智能依赖解析**：自动排序和加载 ContentPack 依赖
- **跨包通信**：通过 API 在 ContentPack 之间进行安全的数据共享和通信
- **版本兼容性**：强大的版本要求和冲突处理

### 📦 **资源集成**
- **资源与数据支持**：ContentPack 可以包含资源和数据资源
- **自动资源包处理**：与 Minecraft 资源系统的无缝集成
- **命名空间管理**：适当的命名空间隔离和冲突预防

### 🛠️ **开发者体验**
- **命令集成**：`/kl pack` 和 `/kl mod` 命令用于轻松的 ContentPack 管理

## 什么是 KubeLoader？

KubeLoader 是 KubeJS 的下一代开发框架。它提供了一个完整的模块化系统——**ContentPacks**——允许开发者以"类似模组"的方式构建、集成和发布 KubeJS 功能，完全消除了传统脚本的扁平化和耦合特性。

> **注意**：ContentPacks 不仅仅是脚本包；它们可以同时携带资源和数据内容，使其成为资源包 + 数据包的超集。

使用 KubeLoader，开发者不再只是编写脚本——他们开发可重用的功能模块。您可以：

- **像开发模组一样开发脚本**：享受独立的依赖管理、命名空间和生命周期控制
- **像安装模组一样加载功能**：轻松集成他人开发的 ContentPack 来快速构建复杂项目
- **像发布模组一样分享内容包**：一键导出为 .jar 文件并直接发布到 CurseForge 或 Modrinth 作为正式模组

KubeLoader 旨在成为 KubeJS 生态系统的"脚本操作系统"——管理模块、协调依赖、扩展能力，并为整个社区提供统一的开发范式。

## 前置模组

- **KubeJS** - 必需的前置模组

## ContentPack 系统

### 什么是 ContentPack？

ContentPack 是 KubeLoader 的核心概念，它是一种类似于"资源包"或"数据包"的 KubeJS 脚本和资源集合。ContentPack 支持两种读取方式：

1. **从内容包文件夹**：在 `kubejs/contentpacks/` 下放置文件夹或 ZIP 格式压缩包
2. **从模组资源**：直接从模组的资源中读取

### ContentPack 结构

ContentPack 可以包含：
- **脚本文件**：KubeJS 脚本
- **资源文件**：材质、模型、语言文件等
- **数据文件**：配方、战利品表、标签等
- **配置文件**：ContentPack 的元数据和配置

### 加载机制

当 KubeLoader 检测到 ContentPack 时，会：
1. 在常规脚本路径下创建 `contentpack_scripts` 文件夹来存放脚本
2. 创建 `pack_resources` 文件夹用于存放内容包的资源（assets + data）
3. 自动处理依赖关系和加载顺序

> ⚠️ **重要提示**：不要修改 `contentpack_scripts` 文件夹下的任何内容！这些文件由 KubeLoader 自动管理。

## 开发者命令

KubeLoader 提供了便捷的命令来管理 ContentPack：

- `/kl pack` - ContentPack 管理命令
- `/kl mod` - 模组相关命令

## 安装说明

1. 确保已安装 **KubeJS** 前置模组
2. 将 KubeLoader 模组文件放入 `mods` 文件夹
3. 启动游戏，KubeLoader 会自动创建必要的文件夹结构

## 注意事项

- 📁 **文件夹结构**：首次运行时会自动创建 `kubejs/contentpacks/` 目录
- 🔄 **自动管理**：`contentpack_scripts` 和 `pack_resources` 文件夹由模组自动管理
- 🎯 **版本支持**：目前主要支持 Forge 1.20.1，其他版本支持正在开发中
- 📦 **模块化思维**：建议以模块化的思维方式开发和发布 ContentPack

## 适用版本

- **Minecraft**: 1.20.1 - 1.20.6
- **Mod Loader**: Forge
- **环境**: 客户端和服务端均需安装

## 相关链接

- [MC百科页面](https://www.mcmod.cn/class/18512.html)
- [GitHub 仓库](https://github.com/WhiseNT/kubeloader)
- [Wiki 文档](https://github.com/WhiseNT/kubeloader_wiki-en)

## 开发团队

- **WhiseNT** - 所有者/程序开发
- **LirxOwO** - 吉祥物

---

*KubeLoader 正处于早期开发阶段，功能和 API 可能会发生变化。欢迎各位去Github反馈和建议！*
