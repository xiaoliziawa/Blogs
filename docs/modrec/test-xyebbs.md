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

## 功能说明

现在 XyeBBS 的信息会在一个独立的区域显示，包含：

### XyeBBS 独立信息区域
- **平台标识**: 红色的 XyeBBS 标识徽章
- **模组描述**: 完整的模组描述信息
- **统计信息网格**:
  - 下载量
  - 作者
  - 创建日期
  - 最后更新日期
- **支持版本**: Minecraft 版本标签
- **模组加载器**: Forge/Fabric/NeoForge 等
- **标签**: 模组分类标签

### 设计特点
- **独立显示**: XyeBBS 信息不与 CurseForge/Modrinth 混合
- **视觉区分**: 使用红色主题色区分 XyeBBS 内容
- **响应式设计**: 适配移动端显示
- **丰富信息**: 显示更多 XyeBBS 特有的信息

如果一切正常，上面应该显示包含 XyeBBS 独立信息区域的模组卡片。
