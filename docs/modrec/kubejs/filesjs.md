<ModInfo 
  curseForgeId="filesjs" 
  modName="FilesJS" 
  projectId="1156187"
  modrinthId=""
  modrinthSlug=""
/>

# FilesJS

## 模组简介

FilesJS 是一个 KubeJS 附属模组，允许你通过 KubeJS 脚本对文件进行有限的操作。该模组提供了删除、读取、写入文件等功能，为整合包制作者和服务器管理员提供了强大的文件管理能力。

## 主要特性

- **文件读写**：在 Minecraft 实例文件夹内进行文件的读取和写入操作
- **文件删除**：删除指定的文件
- **文件备份**：创建文件的备份副本
- **事件监听**：支持文件操作相关的事件监听
- **安全限制**：文件操作仅限于 Minecraft 实例文件夹内，无法访问外部文件

## 前置模组

- **KubeJS** - 必需的前置模组

## 使用方法

### 基本文件操作

#### 写入多行文本
```javascript
FilesJS.writeLines("kubejs/server_scripts/src/test.js", ["test1", "test2", "test3"])
```

#### 删除文件
```javascript
FilesJS.delete("kubejs/server_scripts/src/test.js")
```

#### 备份文件
```javascript
FilesJS.backupFile("kubejs/README.txt")
```

### 事件监听

#### 物品右键事件触发文件备份
```javascript
ItemEvents.rightClicked('nether_star', event => {
    FilesJS.backupFile("kubejs/README.txt")
})
```

#### 文件备份创建事件
```javascript
Files.fileBackupCreated(event => {
    event.server.tell("File backup path:", event.getPath())
})
```

## 安全注意事项

⚠️ **重要安全提醒**：
- 在 1.20.1 的 1.3 版本和 1.21.1 的 1.0 版本中，模组解除了安全限制
- 可以直接调用 File 类，没有路径检查，没有后缀检查
- 可以直接操作系统文件
- 由于 KubeJS 可以使用 Java 反射，安全检查不再受支持
- **请各位开发者谨慎使用！**

## 适用版本

- **Minecraft**: 1.20.1, 1.21.1
- **Mod Loader**: Forge / NeoForge
- **环境**: 客户端需装，服务端需装

## 相关链接

- [CurseForge](https://www.curseforge.com/minecraft/mc-mods/filesjs)
- [MC百科页面](https://www.mcmod.cn/class/17414.html)
- [GitHub 仓库](https://github.com/xiaoliziawa/Files-JS)

## 模组作者/开发团队

- **LirxOwO** (所有者/程序/策划)
- **3093FengMing** (吉祥物)
- **zhenshiz** (吉祥物)

## 使用示例

### 配置文件管理
```javascript
// 创建配置文件
FilesJS.writeLines("config/mymod.json", [
    '{',
    '  "enabled": true,',
    '  "debug": false',
    '}'
])

// 备份重要配置
FilesJS.backupFile("config/important.json")
```

### 日志记录
```javascript
// 记录玩家操作日志
PlayerEvents.loggedIn(event => {
    let logEntry = `${new Date().toISOString()}: Player ${event.player.name} logged in`
    FilesJS.writeLines("logs/player_activity.log", [logEntry])
})
```

## 注意事项

- 📁 **文件路径**：所有文件操作都相对于 Minecraft 实例根目录
- 🔒 **权限控制**：较新版本移除了安全限制，使用时需要格外小心
- 💾 **备份建议**：在进行重要文件操作前，建议先创建备份
- 🚫 **服务器使用**：在服务器环境中使用时要特别注意安全性
