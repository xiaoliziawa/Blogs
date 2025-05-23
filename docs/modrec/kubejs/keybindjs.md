<ModInfo 
  curseForgeId="keybindjs" 
  modName="KeyBindJS" 
  projectId="1212200"
  modrinthId="g3ouhJY7"
  modrinthSlug="keybindjs"
/>

# KeyBindJS

## 模组简介

KeyBindJS 是一个允许整合包作者通过 KubeJS 脚本来动态管理按键绑定的客户端模组。它提供了注册新按键、修改现有按键绑定、更改按键类别等功能，为整合包制作者提供了强大的按键自定义能力。

## 主要特性

- **按键修改**：修改现有mod的按键绑定
- **按键注册**：通过脚本注册新的自定义按键
- **按键移除**：删除不需要的按键绑定
- **类别管理**：重新分类按键到不同的类别
- **修饰键支持**：支持 Ctrl、Alt、Shift 等修饰键组合

## 前置模组

- **KubeJS** - 必需的前置模组

## 使用方法

### 基本语法

在 KubeJS 脚本中使用 `KeyBindEvents` 事件来管理按键：

```javascript
KeyBindEvents.modify(event => {
    // 在这里编写按键修改代码
})
```
> **注意**：在 1.21.1 版本中，为避免与未来 KubeJS 可能添加的 KeyBindEvents 重名，事件名称改为 `KeyBindJSEvents`。

### 修改按键示例

将好奇饰品栏的默认按键改为 ALT+X，并移到原版的杂项分类下：

```javascript
KeyBindEvents.modify(event => {
    // 修改按键为 X
    event.modifyKey('key.curios.open.desc', GLFW.GLFW_KEY_X)
    // 添加 ALT 修饰键
    event.modifyModifier('key.curios.open.desc', KeyModifier.ALT)
    // 修改按键类别
    event.modifyCategory('key.curios.open.desc', 'key.categories.misc')
})
```

### 移除按键示例

删除跳跃按键：

```javascript
KeyBindEvents.modify(event => {
    event.remove('key.jump')
})
```

## 常用按键代码

### GLFW 按键代码

- `GLFW.GLFW_KEY_X` - X 键
- `GLFW.GLFW_KEY_Z` - Z 键  
- `GLFW.GLFW_KEY_C` - C 键
- `GLFW.GLFW_KEY_V` - V 键
- `GLFW.GLFW_KEY_F1` - F1 键
- 等等...

### 修饰键

- `KeyModifier.ALT` - Alt 键
- `KeyModifier.CTRL` - Ctrl 键
- `KeyModifier.SHIFT` - Shift 键

### 原版按键类别

- `key.categories.movement` - 移动
- `key.categories.misc` - 杂项
- `key.categories.gameplay` - 游戏玩法
- `key.categories.inventory` - 物品栏
- `key.categories.creative` - 创造模式## 安装说明

1. 确保已安装 **KubeJS** 前置模组
2. 将 KeyBindJS 模组文件放入 `mods` 文件夹
3. **重要**：切勿在服务端安装此模组，这是纯客户端模组

## 注意事项

- ⚠️ **仅限客户端安装**：此模组是客户端专用，不要安装在服务器上
- 📝 **脚本位置**：按键修改脚本应放在 `kubejs/client_scripts/` 目录下
- 🔄 **版本兼容**：1.21.1 版本使用 `KeyBindJSEvents` 而不是 `KeyBindEvents`
- 💾 **重载**：修改脚本后可使用 `/kubejs reload client_scripts` 重载

## 适用版本

- **Minecraft**: 1.19.2, 1.20.1, 1.21.1
- **Mod Loader**: Forge / NeoForge
- **环境**: 客户端必需，服务端无效

## 相关链接

- [MC百科页面](https://www.mcmod.cn/class/18686.html)
- [GitHub 仓库](https://github.com/yiran1457/KeyBindJS)