<ModInfo 
  curseForgeId="vault-patcher" 
  modName="保险库补丁（Vault Patcher）" 
  projectId="967052"
/>

## 基本信息

- **支持平台**: JAVA版 (JAVA Edition)
- **运作方式**: Forge, Fabric, Quilt, NeoForge
- **运行环境**: 客户端需装, 服务端需装
- **支持的MC版本**:
  - **NeoForge**: 1.20.1-1.21.4
  - **Forge**: 1.6.2-1.21.4
  - **Fabric**: 1.14-1.21.4
  - **Quilt**: 1.14-1.21.4

## 模组介绍

保险库补丁是一个功能强大的工具模组，能够让模组中的硬编码字符串匹配替换为自定义的字符串，或修改增加模组中的代码内容。

该模组有三类替换方式：
1. **动态替换**：匹配替换显示内容，只需写原文和替换的内容，不用指定位置（支持1.17+版本）
2. **普通替换**：可以替换字符串常量，还可以替换存在变量、返回值等里面的字符串类型内容
3. **补丁文件**：可以增改删减代码，可以做非汉化相关的改动，自由度更高

选择本模组进行硬编码汉化有以下几个优势：
- **分发更轻松**：模块文件为json后缀的文本文件，体量极小，可以上传到补丁库
- **维护更快，兼容性强**：模组更新后，只要硬编码内容没改动，就可以沿用生效
- **制作模块补丁简单快速**：掌握后基本是固定流程，不需要学习完整的Java或编写mixin模组

::: warning 温馨提醒
本模组在1.2.11后完全重构，作为CoreMod使用ASM替换，效率大幅提升。
在1.4.2后，模组支持了字节码修改模组代码，功能更加强大。
:::

## 相关链接

- [CurseForge](https://www.curseforge.com/minecraft/mc-mods/vault-patcher)
- [Modrinth](https://modrinth.com/mod/vault-patcher)
- [GitHub](https://github.com/3093FengMing/VaultPatcher)

## 模组作者/开发团队

- 3093FengMing (所有者/程序)
- teddyxlandlee (程序/贡献者)
- KlparetlR (贡献者)

> 信息来源: [MC百科 - [VP]保险库补丁](https://www.mcmod.cn/class/8765.html)
