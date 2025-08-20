# 纯 XyeBBS 模组示例

这个页面展示了如何只使用 XyeBBS 信息来显示模组，无需填写其他平台的信息。

<ModInfo 
  modName="对话框 (ChatBox)" 
  xyebbsId="chatbox"
/>

## 简化的使用方法

现在你只需要提供两个必要的参数：

```vue
<ModInfo 
  modName="模组名称" 
  xyebbsId="xyebbs-模组标识符"
/>
```

### 必需参数
- **`modName`**: 模组的显示名称
- **`xyebbsId`**: XyeBBS 平台上的模组标识符

### 可选参数
- **`iconUrl`**: 自定义图标 URL（如果不提供，会使用 XyeBBS 的图标）
- **`curseForgeId`**: 如果模组也在 CurseForge 上
- **`projectId`**: CurseForge 项目 ID
- **`modrinthId`**: 如果模组也在 Modrinth 上
- **`modrinthSlug`**: Modrinth 模组标识符

## 显示内容

当只使用 XyeBBS 信息时，会显示：

### 🎯 模组头部
- 模组名称
- XyeBBS 下载量徽章（红色主题）
- 指向 XyeBBS 页面的链接

### 📋 XyeBBS 独立信息区域
- **平台标识**: 红色的 "XyeBBS 信息" 徽章
- **模组描述**: 完整的模组描述
- **统计信息**: 下载量、作者、创建日期、更新日期
- **版本支持**: Minecraft 版本标签
- **模组加载器**: Forge/Fabric/NeoForge 标签
- **分类标签**: 模组特性和分类标签

## 优势

✅ **简化配置**: 只需要两个参数就能完整展示模组信息  
✅ **独立显示**: XyeBBS 信息有自己的专属区域  
✅ **丰富内容**: 显示比其他平台更多的详细信息  
✅ **视觉区分**: 使用红色主题突出 XyeBBS 特色  
✅ **响应式设计**: 完美适配各种设备  

这样就不需要填写一堆空的参数了！
