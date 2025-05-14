<ModInfo 
  curseForgeId="enchantlevelbrek" 
  modName="附魔等级上限突破2（EnchantmentLevelBreak）" 
  projectId="1110220"
  modrinthId="HZEbpmoE"
  modrinthSlug="enchantmentlevelbreak"
/>

# EnchantmentLevelBreak


## 基本信息

- **支持平台**: JAVA版 (JAVA Edition)
- **运作方式**: Forge, Fabric, NeoForge
- **运行环境**: 客户端需装, 服务端需装
- **支持的MC版本**:
  - **NeoForge**: 1.21.5, 1.21.4, 1.21.3, 1.21.1, 1.21
  - **Fabric**: 1.21.5, 1.21.4, 1.21.3, 1.21.1, 1.20.1, 1.19.2, 1.18.2
  - **Forge**: 1.20.1, 1.19.2, 1.18.2

## 模组介绍

此模组修改了原版的附魔等级上限，将原版的上限从 255 修改到了 2147483647。

如果附魔等级超出了最大等级，那么返回的等级将会变成 1 级。

此外添加了一个新的指令 `/cenchant` 指令，可以对任意的物品进行附魔。也可以使用原版的 `/enchant` 指令来进行附魔，但是只能对应物品进行附魔，不能所有物品都进行附魔。

### 特性

可以使用铁砧进行附魔等级的叠加，机制如下：
- 原版：4+4 = 5 ❎
- 模组：4+4 = 8 ✅

同样你可以使用配置文件来进行开关，关闭等级叠加的话将采用原版的等级叠加机制进行附魔合并，但仍然不受等级限制，可以一直堆叠到2147483647级。

配置文件可以对等级的限制进行修改，修改的范围最小为255，最大为2147483647。

::: warning 注意事项
1. 附魔等级不要填写的过高，不然会导致一些物品无法正常使用或者游戏崩溃（例如：击退，抢夺）。
2. 此模组仅支持原版类型的附魔书种类，如 [莱特兰-恶意] 以及 [星月附魔] 里面和原版不一样的附魔书是不支持的。
3. Fabric 版本可能与一些模组冲突。例如：[通用附魔] 的 `/enchant` 指令和本模组的 `/enchant` 指令存在冲突，要想体验效果请使用本模组自带的 `/cenchant` 指令进行附魔。
4. Fabric版本如果在铁砧里面进行等级堆叠显示过于昂贵的话，是可以直接取出的，消耗50级经验（默认超过50级的附魔都将固定为消耗50级经验）。
5. Forge/NeoForge/Fabric版本都支持使用config配置文件来开关部分功能。
:::

::: warning 温馨提醒
如果遇到更新Mod后配置文件内容不变的，以及功能不生效的，请删除原来的配置文件，重启游戏即可！
:::

该模组是 [ELB]附魔等级上限突破 的 Fork 修改版本，移植到了 1.20.1 并增加了新的功能。

**WARN：该模组可能会破坏游戏平衡，请谨慎使用！**

## 相关链接

- [CurseForge](https://www.curseforge.com/minecraft/mc-mods/enchantlevelbrek)
- [Modrinth](https://modrinth.com/mod/enchantmentlevelbreak)
- [GitHub](https://github.com/xiaoliziawa/EnchantmentLevelBreak)

## 模组作者/开发团队

- LirxOwO (所有者/程序)
- 英里Miles (美术)
- Crychic (团队吉祥物)
- 孤梦 (吉祥物)

> 信息来源: [MC百科 - [ELB2]附魔等级上限突破2](https://www.mcmod.cn/class/16646.html) 