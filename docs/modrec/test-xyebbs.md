# XyeBBS 独立组件测试页面

这是一个测试页面，用于验证新的独立 XyebbsInfo 组件功能。

## 示例 1: 对话框模组 (ChatBox)

<XyebbsInfo 
  xyebbsId="chatbox" 
/>

## 示例 2: OneEnoughItem 模组

<ModInfo
  curseForgeId="one-enough-item"
  modName="One Enough Item"
  projectId="1312660"
/>

<XyebbsInfo 
  xyebbsId="oneenoughitem" 
/>

## 🎉 全新的独立 XyebbsInfo 组件

现在 XyeBBS 信息已经完全独立出来，成为一个单独的组件！

### 🔧 组件分离的优势

#### ✅ **ModInfo 组件简化**
- 移除了所有 XyeBBS 相关代码
- 专注于 CurseForge 和 Modrinth 信息
- 代码更简洁，维护更容易

#### 🎯 **XyebbsInfo 独立组件**
- 专门处理 XyeBBS 数据
- 独立的样式和交互逻辑
- 可以在任何地方单独使用

### 📋 XyebbsInfo 组件功能

#### 🎨 **美观的卡片设计**
- **收缩状态**: 显示红色徽章和下载量
- **展开状态**: 显示完整的模组信息
- **平滑动画**: 流畅的展开/收缩效果

#### 📖 **完整的 Markdown 支持**
- **正确解析**: 使用 markdown-it 正确处理 Markdown 格式
- **图片处理**: 自动处理 XyeBBS 图片链接
- **代码高亮**: 支持代码块和内联代码
- **链接跳转**: 支持链接点击跳转
- **列表和引用**: 完整的 Markdown 元素支持

#### 🚀 **性能优化**
- **懒加载**: 只有展开时才获取数据
- **缓存机制**: 避免重复请求
- **响应式设计**: 适配各种设备

### 🎯 使用方法

#### **简单使用**
```vue
<XyebbsInfo xyebbsId="chatbox" />
```

#### **与 ModInfo 组合使用**
```vue
<ModInfo
  curseForgeId="mod-id"
  modName="模组名称"
  projectId="123456"
/>

<XyebbsInfo xyebbsId="xyebbs-id" />
```

### ✨ 主要特性

- **🎨 美观设计**: 红色主题的专业卡片设计
- **📱 响应式**: 完美适配移动端和桌面端
- **⚡ 懒加载**: 提升页面初始加载速度
- **📖 Markdown**: 完整支持 Markdown 格式
- **🖼️ 图片处理**: 自动处理和优化图片显示
- **🔗 链接支持**: 支持外部链接跳转
- **� 动画效果**: 平滑的展开/收缩动画

现在点击上面的红色 XyeBBS 卡片试试新的独立组件功能！
