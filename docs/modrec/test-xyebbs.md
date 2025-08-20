# XyeBBS 独立信息测试页面

这是一个测试页面，用于验证 XyeBBS 模组信息的独立显示功能。

## 示例 1: 仅 XyeBBS 信息 - 对话框模组 (ChatBox)

<ModInfo
  modName="对话框 (ChatBox)"
  xyebbsId="chatbox"
/>

## 示例 2: 混合信息 - OneEnoughItem 模组

<ModInfo
  curseForgeId="one-enough-item"
  modName="One Enough Item"
  projectId="1312660"
  xyebbsId="oneenoughitem"
/>

## 示例 3: 仅 XyeBBS 信息 - OneEnoughItem 模组

<ModInfo
  modName="One Enough Item"
  xyebbsId="oneenoughitem"
/>

## 新功能说明

现在 XyeBBS 的信息具有展开/收缩功能，包含：

### 🎯 展开/收缩功能
- **主区域展开**: 点击 "XyeBBS 信息" 徽章可展开/收缩整个信息区域
- **文档展开**: 点击 "详细文档" 标题可单独展开/收缩详细文档内容
- **平滑动画**: 使用 CSS3 动画实现流畅的展开/收缩效果
- **图标指示**: 箭头图标会根据展开状态旋转

### 📋 XyeBBS 独立信息区域
- **平台标识**: 红色的 XyeBBS 标识徽章（可点击展开/收缩）
- **模组描述**: 完整的模组描述信息
- **详细文档**: 支持 Markdown 格式的详细文档（可单独展开/收缩）
- **统计信息网格**:
  - 下载量
  - 作者
  - 创建日期
  - 最后更新日期
- **支持版本**: Minecraft 版本标签
- **模组加载器**: Forge/Fabric/NeoForge 等
- **标签**: 模组分类标签

### ✨ 设计特点
- **节省空间**: 默认收缩状态，避免占用过多页面空间
- **按需展开**: 用户可根据需要展开查看详细信息
- **独立控制**: 主区域和文档区域可独立展开/收缩
- **视觉反馈**: 悬停效果和动画提供良好的交互体验
- **响应式设计**: 完美适配各种设备尺寸

### 🎨 动画效果
- **主区域**: 缩放 + 淡入淡出 + 垂直移动
- **文档区域**: 高度变化 + 淡入淡出 + 垂直移动
- **图标旋转**: 180度旋转指示展开状态
- **悬停效果**: 徽章和标题的悬停动画

点击上面的 XyeBBS 信息徽章试试展开/收缩功能！
