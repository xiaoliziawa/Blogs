---
title: ArtisanWorktables 配方编写指南
---

# ArtisanWorktables 配方编写指南（CraftTweaker & KubeJS）

本文档介绍如何通过 **CraftTweaker（ZenScript）** 和 **KubeJS（JavaScript）** 为 ArtisanWorktables 的工作台添加自定义配方。

> 模组同时支持两套脚本系统，二选一即可。新项目推荐使用 **KubeJS**；CraftTweaker 仍然完全可用。

---

## 一、基础概念

### 1.1 桌型（Table Type）

每种职业对应一种桌型，配方与桌型一一绑定。共 15 种：

`tailor`（裁缝）、`carpenter`（木匠）、`mason`（石匠）、`blacksmith`（铁匠）、`jeweler`（珠宝匠）、`basic`（基础）、`engineer`（工程师）、`mage`（法师）、`scribe`（抄写员）、`chemist`（化学家）、`farmer`（农夫）、`chef`（厨师）、`designer`（设计师）、`tanner`（制革匠）、`potter`（陶工）

### 1.2 等级（Tier）

每种桌型有三个等级，高等级可使用低等级配方：

| 等级 | 名称 | id |
|------|------|----|
| 工作台 | `worktable` | 0 |
| 工作站 | `workstation` | 1 |
| 工坊 | `workshop` | 2 |

配方通过 `minimumTier` / `maximumTier`（0~2）限定可在哪些等级使用。默认 `minimumTier=0`、`maximumTier=2`（全等级可用）。

### 1.3 配方类型

- **有序配方（shaped）**：按 `pattern`（图案）+ `key`（符号映射）摆放，类似工作台有序合成。
- **无序配方（shapeless）**：只看材料种类与数量，不看摆放位置。

### 1.4 配方可配置项一览

| 字段 | 含义 | 默认值 |
|------|------|--------|
| `result` | 主输出物品 | 必填 |
| `pattern` + `key` | 有序配方图案（仅 shaped） | shaped 必填 |
| `ingredients` | 无序配方材料列表（仅 shapeless） | shapeless 必填 |
| `tools` | 所需工具（最多 3 个），每个含耐久消耗、可选 NBT 匹配（`matchNbt`） | 无 |
| `secondaryIngredients` | 副材料（最多 9 个，放在副输入格） | 无 |
| `consumeSecondaryIngredients` | 是否消耗副材料 | `true` |
| `fluidIngredient` | 流体消耗 | 无 |
| `extraOutput` | 额外产出（最多 3 个，可带概率） | 无 |
| `minimumTier` / `maximumTier` | 等级限制（0~2） | `0` / `2` |
| `experienceRequired` | 所需经验点数 | `0` |
| `levelRequired` | 所需经验等级 | `0` |
| `consumeExperience` | 是否消耗经验/等级 | `true` |
| `mirrored` | 有序配方是否允许镜像匹配（仅 shaped） | `true` |
| `group` | 配方分组（JEI 合并显示） | 空 |

---

## 二、CraftTweaker（ZenScript）

脚本放在 `scripts/` 目录，文件后缀 `.zs`。

### 2.1 入口与链式写法

```zenscript
import mods.artisanworktables.Recipe;
import mods.artisanworktables.Type;
import mods.artisanworktables.Tier;

// 通过 Recipe.type(桌型) 开始，链式调用各项，最后 register()
Recipe.type(Type.BLACKSMITH)
    .shaped([
        [<item:minecraft:iron_ingot>, <item:minecraft:iron_ingot>],
        [<item:minecraft:iron_ingot>, <item:minecraft:iron_ingot>]
    ])
    .output(<item:minecraft:iron_block>)
    .register();
```

### 2.2 可用方法

| 方法 | 说明 |
|------|------|
| `Recipe.type(Type.XXX)` | 指定桌型，返回配方构建器 |
| `.shaped(IIngredient[][])` | 有序配方，二维数组即图案（自动生成 pattern/key） |
| `.shapeless(IIngredient[])` | 无序配方 |
| `.output(IItemStack)` | 主输出 |
| `.tool(IIngredient, int damage)` | 添加一个工具及其耐久消耗（最多调用 3 次） |
| `.fluid(IFluidStack)` | 流体消耗 |
| `.secondary(IIngredient[])` | 副材料（默认消耗） |
| `.secondary(IIngredient[], bool consume)` | 副材料，并指定是否消耗 |
| `.extra(IItemStack, float chance)` | 额外产出及概率（0.0~1.0，最多 3 个） |
| `.mirrored(bool)` | 是否允许镜像（仅 shaped） |
| `.restrict(Tier min)` | 最低等级限制（最高默认 WORKSHOP） |
| `.restrict(Tier min, Tier max)` | 等级范围限制 |
| `.experience(int)` / `.experience(int, bool consume)` | 所需经验点数 |
| `.level(int)` / `.level(int, bool consume)` | 所需经验等级 |
| `.register()` | 注册（自动生成配方名） |
| `.register(String name)` | 注册并指定配方名 |

> 注意：`.experience(...)` 与 `.level(...)` 互斥，调用其一会清零另一项。

### 2.3 完整示例

```zenscript
import mods.artisanworktables.Recipe;
import mods.artisanworktables.Type;
import mods.artisanworktables.Tier;

// 铁匠有序配方：需要钻石镐（消耗 10 耐久），消耗 1000mB 水，
// 限定工作站及以上等级，需 5 级经验，并有 50% 概率额外产出钻石。
Recipe.type(Type.BLACKSMITH)
    .shaped([
        [<item:minecraft:iron_ingot>, <item:minecraft:iron_ingot>, <item:minecraft:iron_ingot>],
        [<item:minecraft:iron_ingot>, <item:minecraft:stick>,      <item:minecraft:iron_ingot>],
        [<item:minecraft:air>,        <item:minecraft:stick>,      <item:minecraft:air>]
    ])
    .tool(<item:minecraft:diamond_pickaxe>, 10)
    .fluid(<fluid:minecraft:water> * 1000)
    .secondary([<item:minecraft:coal>], false)
    .extra(<item:minecraft:diamond>, 0.5)
    .restrict(Tier.WORKSTATION, Tier.WORKSHOP)
    .level(5)
    .mirrored(true)
    .register("my_iron_machine");

// 厨师无序配方
Recipe.type(Type.CHEF)
    .shapeless([<item:minecraft:wheat>, <item:minecraft:wheat>, <item:minecraft:wheat>])
    .output(<item:minecraft:bread>)
    .register();
```

---

## 三、KubeJS（JavaScript）

脚本放在 `kubejs/server_scripts/` 目录，文件后缀 `.js`。配方在 `ServerEvents.recipes` 事件中添加。

### 3.1 访问方式

每个桌型有两个配方函数：

```
event.recipes.artisanworktables.<桌型>_shaped(result, pattern, key)
event.recipes.artisanworktables.<桌型>_shapeless(result, ingredients)
```

例如 `event.recipes.artisanworktables.blacksmith_shaped(...)`、`event.recipes.artisanworktables.chef_shapeless(...)`。

### 3.2 构造参数

- **有序**：`(result, pattern, key)`
  - `result`：物品（字符串 id 或 `Item.of(...)`）
  - `pattern`：字符串数组，如 `['XXX', 'X X', 'XXX']`
  - `key`：符号→材料 的对象，如 `{ X: 'minecraft:iron_ingot' }`
- **无序**：`(result, ingredients)`
  - `ingredients`：材料数组，如 `['minecraft:wheat', 'minecraft:wheat']`

### 3.3 链式可选项（builder 方法）

构造后可链式调用以下方法（方法名与字段同名）：

| 方法 | 说明 |
|------|------|
| `.mirrored(bool)` | 是否镜像（仅 shaped） |
| `.group(string)` | 配方分组 |
| `.secondaryIngredients([...])` | 副材料数组 |
| `.consumeSecondaryIngredients(bool)` | 是否消耗副材料 |
| `.tools([...])` | 工具数组（见下方格式） |
| `.extraOutput([...])` | 额外产出数组（见下方格式） |
| `.fluidIngredient({...})` | 流体消耗（见下方格式） |
| `.minimumTier(int)` / `.maximumTier(int)` | 等级范围（0~2） |
| `.experienceRequired(int)` | 所需经验点数 |
| `.levelRequired(int)` | 所需经验等级 |
| `.consumeExperience(bool)` | 是否消耗经验/等级 |

### 3.4 特殊字段的 JSON 格式

`tools` / `extraOutput` / `fluidIngredient` 使用模组原生 JSON 结构，直接以 JS 对象书写：

```js
// 工具：item/tag 为材料，damage 为耐久消耗
.tools([
  { item: 'minecraft:diamond_pickaxe', damage: 10 },
  { tag: 'forge:tools/hammers',        damage: 5  }
])

// 额外产出：item + count + chance（概率 0.0~1.0）
.extraOutput([
  { item: 'minecraft:diamond', count: 1, chance: 0.5 }
])

// 流体：fluid + amount（毫桶 mB）
.fluidIngredient({ fluid: 'minecraft:water', amount: 1000 })
```

### 3.5 完整示例

```js
ServerEvents.recipes(event => {

  // 铁匠有序配方
  event.recipes.artisanworktables.blacksmith_shaped(
    'minecraft:iron_block',
    [
      'III',
      'ISI',
      ' S '
    ],
    {
      I: 'minecraft:iron_ingot',
      S: 'minecraft:stick'
    }
  )
    .tools([{ item: 'minecraft:diamond_pickaxe', damage: 10 }])
    .fluidIngredient({ fluid: 'minecraft:water', amount: 1000 })
    .secondaryIngredients(['minecraft:coal'])
    .consumeSecondaryIngredients(false)
    .extraOutput([{ item: 'minecraft:diamond', count: 1, chance: 0.5 }])
    .minimumTier(1)
    .maximumTier(2)
    .levelRequired(5)
    .mirrored(true)

  // 厨师无序配方
  event.recipes.artisanworktables.chef_shapeless(
    'minecraft:bread',
    ['minecraft:wheat', 'minecraft:wheat', 'minecraft:wheat']
  )
})
```

### 3.6 移除配方

KubeJS 可按配方类型移除：

```js
ServerEvents.recipes(event => {
  // 移除某桌型的全部有序配方
  event.remove({ type: 'artisanworktables:blacksmith_shaped' })
  // 按输出移除
  event.remove({ output: 'minecraft:iron_block' })
})
```

---

## 四、字段对照表（CraftTweaker ↔ KubeJS ↔ JSON）

| 含义 | CraftTweaker | KubeJS | JSON 字段 |
|------|--------------|--------|-----------|
| 主输出 | `.output(stack)` | 构造参数 `result` | `result` |
| 有序图案 | `.shaped([[...]])` | 构造参数 `pattern` + `key` | `pattern` + `key` |
| 无序材料 | `.shapeless([...])` | 构造参数 `ingredients` | `ingredients` |
| 工具 | `.tool(ing, dmg)` | `.tools([{item,damage}])` | `tools` |
| 副材料 | `.secondary([...], consume)` | `.secondaryIngredients([...])` + `.consumeSecondaryIngredients(b)` | `secondaryIngredients` / `consumeSecondaryIngredients` |
| 流体 | `.fluid(fluidStack)` | `.fluidIngredient({fluid,amount})` | `fluidIngredient` |
| 额外产出 | `.extra(stack, chance)` | `.extraOutput([{item,count,chance}])` | `extraOutput` |
| 等级范围 | `.restrict(min, max)` | `.minimumTier(n)` + `.maximumTier(n)` | `minimumTier` / `maximumTier` |
| 经验点数 | `.experience(n)` | `.experienceRequired(n)` + `.consumeExperience(b)` | `experienceRequired` / `consumeExperience` |
| 经验等级 | `.level(n)` | `.levelRequired(n)` | `levelRequired` |
| 镜像 | `.mirrored(b)` | `.mirrored(b)` | `mirrored` |
| 分组 | — | `.group(s)` | `group` |

---

## 五、标签（Tag）支持

**输入类**字段支持物品标签（tag），**输出类与流体不支持**。

| 位置 | 能否用 tag |
|------|-----------|
| 主材料（shaped 的 `key` / shapeless 的 `ingredients`） | ✅ 支持 |
| 副材料 `secondaryIngredients` | ✅ 支持 |
| 工具 `tools` | ✅ 支持 |
| 主输出 `result` | ❌ 必须为具体物品 |
| 额外产出 `extraOutput` | ❌ 必须为具体物品 |
| 流体 `fluidIngredient` | ❌ 必须为具体流体 id |

> 本模组运行于 **1.20.1 Forge**，物品标签命名空间用 `forge:`（如 `forge:ingots/iron`），不是 1.21+ 的 `c:`。

### 5.1 CraftTweaker

CrT 使用 `<tag:items:...>`，可直接作为材料/工具，并支持 `* 数量`：

```zenscript
Recipe.type(Type.BLACKSMITH)
    .shaped([
        [<tag:items:forge:ingots/iron>, <tag:items:forge:ingots/iron>],
        [<tag:items:forge:ingots/iron>, <tag:items:forge:ingots/iron>]
    ])
    .tool(<tag:items:minecraft:pickaxes>, 1)            // 工具用 tag
    .secondary([<tag:items:forge:gems/diamond>], false)  // 副材料用 tag
    .output(<item:minecraft:anvil>)                      // 输出仍为具体物品
    .register("blacksmith_anvil_tag");
```

### 5.2 KubeJS

`key` / `ingredients` / `secondaryIngredients` 用 `'#命名空间:路径'`；`tools` 因走原生 JSON 透传，用 `{ tag: '命名空间:路径' }`（**不带 `#`**）：

```js
event.recipes.artisanworktables.blacksmith_shaped(
  'minecraft:anvil',
  ['II', 'II'],
  { I: '#forge:ingots/iron' }                            // key 用 tag
)
  .tools([{ tag: 'minecraft:pickaxes', damage: 1 }])   // 工具 tag：用 tag 字段，不加 #
  .secondaryIngredients(['#forge:gems/diamond'])         // 副材料用 tag
  .consumeSecondaryIngredients(false)

event.recipes.artisanworktables.basic_shapeless(
  Item.of('minecraft:stick', 4),
  ['#minecraft:logs']                                    // ingredients 用 tag
)
```

> **易错点**：KubeJS 中 `tools` 的标签写在 `tag` 字段且**不加 `#`**，与 `ingredients`/`key` 的 `#` 前缀写法不同。

---

## 六、NBT 支持

输入与输出都支持 NBT，但两套脚本的**输入**默认行为相反。

| | 输出（`result` / `extraOutput`） | 输入（`ingredients` / `key` / `secondaryIngredients` / `tools`） |
|---|---|---|
| 是否支持 | ✅ | ✅ |
| 模组层依据 | `CraftingHelper.getItemStack` 读 `nbt` 字段（**禁止 `data`**） | `Ingredient.fromJson` 识别 Forge 的 NBT 匹配类型 |

- **CraftTweaker**：输出用 `<item:...>.withTag({...})`；输入的 `IItemStack` **默认就带 NBT 比对**，`.withTag({...})` 即要求 NBT 一致。
- **KubeJS**：输出用 `Item.of('id', '{...SNBT...}')`；输入**默认忽略 NBT**，要按 NBT 匹配须显式调 `.strongNBT()`（严格全等）或 `.weakNBT()`（部分匹配）。

> ⚠️ 输入 NBT 默认行为相反：**CrT 默认严格，KubeJS 默认忽略**。这是最易踩的坑。

### 6.1 CraftTweaker（输出一本带锋利 V 的书）

```zenscript
Recipe.type(Type.MAGE)
    .shaped([
        [<item:minecraft:lapis_lazuli>, <item:minecraft:book>, <item:minecraft:lapis_lazuli>],
        [<item:minecraft:lapis_lazuli>, <item:minecraft:experience_bottle>, <item:minecraft:lapis_lazuli>]
    ])
    .level(5)
    .output(<item:minecraft:enchanted_book>.withTag({StoredEnchantments: [{id: "minecraft:sharpness" as string, lvl: 5 as short}]}))
    .register("mage_sharpness_book");
```

### 6.2 KubeJS（输出带附魔的书 / 要求特定 NBT 输入）

```js
// 输出一本带锋利 V 的附魔书
event.recipes.artisanworktables.mage_shaped(
  Item.of('minecraft:enchanted_book', '{StoredEnchantments:[{id:"minecraft:sharpness",lvl:5s}]}'),
  ['LBL', 'LEL'],
  { L: 'minecraft:lapis_lazuli', B: 'minecraft:book', E: 'minecraft:experience_bottle' }
).levelRequired(5)

// 要求“必须放入特定 NBT 物品”作为材料时，须显式 strongNBT（严格）或 weakNBT（部分）
event.recipes.artisanworktables.basic_shapeless(
  'minecraft:book',
  [Item.of('minecraft:enchanted_book', '{StoredEnchantments:[{id:"minecraft:sharpness",lvl:5s}]}').strongNBT()]
)
```

> - SNBT 里附魔等级 `lvl` 必须是 **short**：KubeJS 写 `5s`、CrT 写 `5 as short`；写成普通整数会匹配/写入失败。
> - 输出 NBT 用 `nbt`（KubeJS 自动处理，CrT 用 `.withTag`），**不要用 `data`**（模组会直接报错）。

### 6.3 工具按 NBT 匹配（`matchNbt` 开关）

默认情况下，配方工具只按**物品类型**匹配、忽略 NBT（任意同种镐都能用）。给工具加 `matchNbt` 开关后，会额外要求工具的 NBT 一致——并**自动忽略耐久（`Damage`）**，所以磨损的工具仍可用。常用于要求「特定名字的锤子」等。

**CraftTweaker**：`.tool(工具, 耐久消耗, matchNbt)`，第三个参数传 `true`：

```zenscript
val hammer = <item:minecraft:iron_pickaxe>.withTag({display: {Name: "{\"text\":\"Hammer\"}"}});

Recipe.type(Type.BASIC)
    .shapeless([<item:minecraft:stone>])
    .tool(hammer, 10, true)   // 必须是名为 Hammer 的镐
    .output(<item:minecraft:cobblestone>)
    .register("hammer_cobble");
```

**KubeJS**：`tools` 项加 `matchNbt: true`，并用 `nbt` 提供期望 NBT：

```js
.tools([
  { item: 'minecraft:iron_pickaxe', damage: 10, matchNbt: true, nbt: '{display:{Name:\'{"text":"Hammer"}\'}}' }
])
```

> - `matchNbt` 默认 `false`，老配方行为不变（向后兼容）。
> - 比较时**忽略耐久**，工具用旧了仍能匹配。
> - 对 Tinkers' Construct 等定制工具，其 NBT 含材料/修饰信息且每把不同，`matchNbt` 通常不实用；想要「任意材料的某种 TCon 工具」保持默认（不开 `matchNbt`）即可。

---

## 七、常见问题

- **配方不生效？** 确认桌型名拼写正确（全小写），且物品/流体 id 存在。可在 JEI 中查看对应桌型分类核对。
- **工具不被识别？** `tools` 中的 `item`/`tag` 必须是合法材料，`damage` 是单次合成消耗的耐久；并确认该工具在对应工具处理器支持范围内。
- **等级限制无效？** `minimumTier`/`maximumTier` 取值 0（工作台）、1（工作站）、2（工坊）。
- **修改后需重载：** KubeJS 用 `/reload`；CraftTweaker 用 `/reload`（部分改动需重进存档）。
