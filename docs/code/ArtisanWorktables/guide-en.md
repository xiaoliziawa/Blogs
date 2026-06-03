---
title: ArtisanWorktables Recipe Scripting Guide (EN)
---

# ArtisanWorktables Recipe Scripting Guide (CraftTweaker & KubeJS)

This document explains how to add custom recipes for ArtisanWorktables' worktables using **CraftTweaker (ZenScript)** and **KubeJS (JavaScript)**.

> The mod supports both scripting systems — pick whichever you prefer. **KubeJS** is recommended for new projects; CraftTweaker remains fully supported.

---

## 1. Core Concepts

### 1.1 Table Type

Each profession corresponds to one table type, and recipes are bound one-to-one to a table type. There are 15 in total:

`tailor`, `carpenter`, `mason`, `blacksmith`, `jeweler`, `basic`, `engineer`, `mage`, `scribe`, `chemist`, `farmer`, `chef`, `designer`, `tanner`, `potter`

### 1.2 Tier

Each table type has three tiers; a higher tier can use lower-tier recipes:

| Tier | Name | id |
|------|------|----|
| Worktable | `worktable` | 0 |
| Workstation | `workstation` | 1 |
| Workshop | `workshop` | 2 |

Recipes use `minimumTier` / `maximumTier` (0–2) to limit which tiers they can be used on. Defaults are `minimumTier=0` and `maximumTier=2` (available on all tiers).

### 1.3 Recipe Types

- **Shaped recipe**: Arranged by `pattern` + `key` (symbol mapping), similar to vanilla shaped crafting.
- **Shapeless recipe**: Only considers ingredient type and count, not placement.

### 1.4 Configurable Recipe Fields

| Field | Meaning | Default |
|------|------|--------|
| `result` | Primary output item | Required |
| `pattern` + `key` | Shaped recipe pattern (shaped only) | Required for shaped |
| `ingredients` | Shapeless ingredient list (shapeless only) | Required for shapeless |
| `tools` | Required tools (up to 3), each with durability cost and optional NBT matching (`matchNbt`) | None |
| `secondaryIngredients` | Secondary ingredients (up to 9, placed in secondary input slots) | None |
| `consumeSecondaryIngredients` | Whether secondary ingredients are consumed | `true` |
| `fluidIngredient` | Fluid consumption | None |
| `extraOutput` | Extra outputs (up to 3, may have a chance) | None |
| `minimumTier` / `maximumTier` | Tier restriction (0–2) | `0` / `2` |
| `experienceRequired` | Experience points required | `0` |
| `levelRequired` | Experience level required | `0` |
| `consumeExperience` | Whether experience/levels are consumed | `true` |
| `mirrored` | Whether shaped recipes allow mirrored matching (shaped only) | `true` |
| `group` | Recipe group (merged display in JEI) | Empty |

---

## 2. CraftTweaker (ZenScript)

Scripts go in the `scripts/` directory with the `.zs` extension.

### 2.1 Entry Point and Chained Syntax

```zenscript
import mods.artisanworktables.Recipe;
import mods.artisanworktables.Type;
import mods.artisanworktables.Tier;

// Start with Recipe.type(tableType), chain the options, and finish with register()
Recipe.type(Type.BLACKSMITH)
    .shaped([
        [<item:minecraft:iron_ingot>, <item:minecraft:iron_ingot>],
        [<item:minecraft:iron_ingot>, <item:minecraft:iron_ingot>]
    ])
    .output(<item:minecraft:iron_block>)
    .register();
```

### 2.2 Available Methods

| Method | Description |
|------|------|
| `Recipe.type(Type.XXX)` | Specify the table type, returns the recipe builder |
| `.shaped(IIngredient[][])` | Shaped recipe; the 2D array is the pattern (pattern/key generated automatically) |
| `.shapeless(IIngredient[])` | Shapeless recipe |
| `.output(IItemStack)` | Primary output |
| `.tool(IIngredient, int damage)` | Add a tool and its durability cost (callable up to 3 times) |
| `.fluid(IFluidStack)` | Fluid consumption |
| `.secondary(IIngredient[])` | Secondary ingredients (consumed by default) |
| `.secondary(IIngredient[], bool consume)` | Secondary ingredients, specifying whether they are consumed |
| `.extra(IItemStack, float chance)` | Extra output and chance (0.0–1.0, up to 3) |
| `.mirrored(bool)` | Whether mirroring is allowed (shaped only) |
| `.restrict(Tier min)` | Minimum tier restriction (maximum defaults to WORKSHOP) |
| `.restrict(Tier min, Tier max)` | Tier range restriction |
| `.experience(int)` / `.experience(int, bool consume)` | Experience points required |
| `.level(int)` / `.level(int, bool consume)` | Experience level required |
| `.register()` | Register (recipe name generated automatically) |
| `.register(String name)` | Register with a specified recipe name |

> Note: `.experience(...)` and `.level(...)` are mutually exclusive; calling one resets the other to zero.

### 2.3 Full Example

```zenscript
import mods.artisanworktables.Recipe;
import mods.artisanworktables.Type;
import mods.artisanworktables.Tier;

// Blacksmith shaped recipe: requires a diamond pickaxe (costs 10 durability), consumes 1000mB water,
// restricted to workstation tier and above, requires level 5, and has a 50% chance of an extra diamond.
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

// Chef shapeless recipe
Recipe.type(Type.CHEF)
    .shapeless([<item:minecraft:wheat>, <item:minecraft:wheat>, <item:minecraft:wheat>])
    .output(<item:minecraft:bread>)
    .register();
```

---

## 3. KubeJS (JavaScript)

Scripts go in the `kubejs/server_scripts/` directory with the `.js` extension. Recipes are added inside the `ServerEvents.recipes` event.

### 3.1 Access

Each table type has two recipe functions:

```
event.recipes.artisanworktables.<tableType>_shaped(result, pattern, key)
event.recipes.artisanworktables.<tableType>_shapeless(result, ingredients)
```

For example, `event.recipes.artisanworktables.blacksmith_shaped(...)`, `event.recipes.artisanworktables.chef_shapeless(...)`.

### 3.2 Constructor Parameters

- **Shaped**: `(result, pattern, key)`
  - `result`: item (string id or `Item.of(...)`)
  - `pattern`: array of strings, e.g. `['XXX', 'X X', 'XXX']`
  - `key`: object mapping symbol → ingredient, e.g. `{ X: 'minecraft:iron_ingot' }`
- **Shapeless**: `(result, ingredients)`
  - `ingredients`: array of ingredients, e.g. `['minecraft:wheat', 'minecraft:wheat']`

### 3.3 Chainable Options (builder methods)

After construction you can chain the following methods (method names match the field names):

| Method | Description |
|------|------|
| `.mirrored(bool)` | Whether mirrored (shaped only) |
| `.group(string)` | Recipe group |
| `.secondaryIngredients([...])` | Secondary ingredients array |
| `.consumeSecondaryIngredients(bool)` | Whether secondary ingredients are consumed |
| `.tools([...])` | Tools array (see format below) |
| `.extraOutput([...])` | Extra output array (see format below) |
| `.fluidIngredient({...})` | Fluid consumption (see format below) |
| `.minimumTier(int)` / `.maximumTier(int)` | Tier range (0–2) |
| `.experienceRequired(int)` | Experience points required |
| `.levelRequired(int)` | Experience level required |
| `.consumeExperience(bool)` | Whether experience/levels are consumed |

### 3.4 JSON Format for Special Fields

`tools` / `extraOutput` / `fluidIngredient` use the mod's native JSON structure, written directly as JS objects:

```js
// Tool: item/tag is the ingredient, damage is the durability cost
.tools([
  { item: 'minecraft:diamond_pickaxe', damage: 10 },
  { tag: 'forge:tools/hammers',        damage: 5  }
])

// Extra output: item + count + chance (probability 0.0–1.0)
.extraOutput([
  { item: 'minecraft:diamond', count: 1, chance: 0.5 }
])

// Fluid: fluid + amount (millibuckets, mB)
.fluidIngredient({ fluid: 'minecraft:water', amount: 1000 })
```

### 3.5 Full Example

```js
ServerEvents.recipes(event => {

  // Blacksmith shaped recipe
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

  // Chef shapeless recipe
  event.recipes.artisanworktables.chef_shapeless(
    'minecraft:bread',
    ['minecraft:wheat', 'minecraft:wheat', 'minecraft:wheat']
  )
})
```

### 3.6 Removing Recipes

KubeJS can remove recipes by recipe type:

```js
ServerEvents.recipes(event => {
  // Remove all shaped recipes for a table type
  event.remove({ type: 'artisanworktables:blacksmith_shaped' })
  // Remove by output
  event.remove({ output: 'minecraft:iron_block' })
})
```

---

## 4. Field Cross-Reference (CraftTweaker ↔ KubeJS ↔ JSON)

| Meaning | CraftTweaker | KubeJS | JSON field |
|------|--------------|--------|-----------|
| Primary output | `.output(stack)` | constructor param `result` | `result` |
| Shaped pattern | `.shaped([[...]])` | constructor params `pattern` + `key` | `pattern` + `key` |
| Shapeless ingredients | `.shapeless([...])` | constructor param `ingredients` | `ingredients` |
| Tools | `.tool(ing, dmg)` | `.tools([{item,damage}])` | `tools` |
| Secondary ingredients | `.secondary([...], consume)` | `.secondaryIngredients([...])` + `.consumeSecondaryIngredients(b)` | `secondaryIngredients` / `consumeSecondaryIngredients` |
| Fluid | `.fluid(fluidStack)` | `.fluidIngredient({fluid,amount})` | `fluidIngredient` |
| Extra output | `.extra(stack, chance)` | `.extraOutput([{item,count,chance}])` | `extraOutput` |
| Tier range | `.restrict(min, max)` | `.minimumTier(n)` + `.maximumTier(n)` | `minimumTier` / `maximumTier` |
| Experience points | `.experience(n)` | `.experienceRequired(n)` + `.consumeExperience(b)` | `experienceRequired` / `consumeExperience` |
| Experience level | `.level(n)` | `.levelRequired(n)` | `levelRequired` |
| Mirrored | `.mirrored(b)` | `.mirrored(b)` | `mirrored` |
| Group | — | `.group(s)` | `group` |

---

## 5. Tag Support

**Input** fields support item tags, while **output and fluid fields do not**.

| Location | Tag allowed |
|------|-----------|
| Primary ingredients (shaped `key` / shapeless `ingredients`) | ✅ Yes |
| Secondary ingredients `secondaryIngredients` | ✅ Yes |
| Tools `tools` | ✅ Yes |
| Primary output `result` | ❌ Must be a concrete item |
| Extra output `extraOutput` | ❌ Must be a concrete item |
| Fluid `fluidIngredient` | ❌ Must be a concrete fluid id |

> This mod runs on **1.20.1 Forge**, so item tags use the `forge:` namespace (e.g. `forge:ingots/iron`), not the `c:` namespace from 1.21+.

### 5.1 CraftTweaker

CrT uses `<tag:items:...>`, which can be used directly as an ingredient/tool and supports `* count`:

```zenscript
Recipe.type(Type.BLACKSMITH)
    .shaped([
        [<tag:items:forge:ingots/iron>, <tag:items:forge:ingots/iron>],
        [<tag:items:forge:ingots/iron>, <tag:items:forge:ingots/iron>]
    ])
    .tool(<tag:items:minecraft:pickaxes>, 1)            // tool by tag
    .secondary([<tag:items:forge:gems/diamond>], false)  // secondary ingredient by tag
    .output(<item:minecraft:anvil>)                      // output is still a concrete item
    .register("blacksmith_anvil_tag");
```

### 5.2 KubeJS

`key` / `ingredients` / `secondaryIngredients` use `'#namespace:path'`; `tools`, because they pass through native JSON, use `{ tag: 'namespace:path' }` (**without the `#`**):

```js
event.recipes.artisanworktables.blacksmith_shaped(
  'minecraft:anvil',
  ['II', 'II'],
  { I: '#forge:ingots/iron' }                            // key by tag
)
  .tools([{ tag: 'minecraft:pickaxes', damage: 1 }])   // tool tag: use the tag field, no #
  .secondaryIngredients(['#forge:gems/diamond'])         // secondary ingredient by tag
  .consumeSecondaryIngredients(false)

event.recipes.artisanworktables.basic_shapeless(
  Item.of('minecraft:stick', 4),
  ['#minecraft:logs']                                    // ingredients by tag
)
```

> **Common mistake**: In KubeJS, `tools` tags go in the `tag` field **without a `#`**, unlike the `#` prefix used for `ingredients`/`key`.

---

## 6. NBT Support

Both input and output support NBT, but the default **input** behavior of the two scripting systems is opposite.

| | Output (`result` / `extraOutput`) | Input (`ingredients` / `key` / `secondaryIngredients` / `tools`) |
|---|---|---|
| Supported | ✅ | ✅ |
| Mod-layer basis | `CraftingHelper.getItemStack` reads the `nbt` field (**`data` is forbidden**) | `Ingredient.fromJson` recognizes Forge's NBT matching type |

- **CraftTweaker**: Output uses `<item:...>.withTag({...})`; an input `IItemStack` **compares NBT by default**, so `.withTag({...})` requires the NBT to match.
- **KubeJS**: Output uses `Item.of('id', '{...SNBT...}')`; input **ignores NBT by default**, so to match by NBT you must explicitly call `.strongNBT()` (strict full match) or `.weakNBT()` (partial match).

> ⚠️ The default input NBT behavior is opposite: **CrT is strict by default, KubeJS ignores by default**. This is the most common pitfall.

### 6.1 CraftTweaker (output a book with Sharpness V)

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

### 6.2 KubeJS (output an enchanted book / require a specific NBT input)

```js
// Output an enchanted book with Sharpness V
event.recipes.artisanworktables.mage_shaped(
  Item.of('minecraft:enchanted_book', '{StoredEnchantments:[{id:"minecraft:sharpness",lvl:5s}]}'),
  ['LBL', 'LEL'],
  { L: 'minecraft:lapis_lazuli', B: 'minecraft:book', E: 'minecraft:experience_bottle' }
).levelRequired(5)

// To require "a specific NBT item must be placed" as an ingredient, explicitly use strongNBT (strict) or weakNBT (partial)
event.recipes.artisanworktables.basic_shapeless(
  'minecraft:book',
  [Item.of('minecraft:enchanted_book', '{StoredEnchantments:[{id:"minecraft:sharpness",lvl:5s}]}').strongNBT()]
)
```

> - In SNBT, the enchantment level `lvl` must be a **short**: write `5s` in KubeJS, `5 as short` in CrT; writing a plain integer will fail to match/write.
> - Output NBT uses `nbt` (KubeJS handles it automatically, CrT uses `.withTag`); **do not use `data`** (the mod will error out directly).

### 6.3 Matching Tools by NBT (`matchNbt` flag)

By default, recipe tools match only by **item type** and ignore NBT (any pickaxe of the same type works). Adding the `matchNbt` flag to a tool additionally requires the tool's NBT to match — and **automatically ignores durability (`Damage`)**, so worn tools still work. This is commonly used to require, for example, "a hammer with a specific name".

**CraftTweaker**: `.tool(tool, durabilityCost, matchNbt)`, pass `true` as the third argument:

```zenscript
val hammer = <item:minecraft:iron_pickaxe>.withTag({display: {Name: "{\"text\":\"Hammer\"}"}});

Recipe.type(Type.BASIC)
    .shapeless([<item:minecraft:stone>])
    .tool(hammer, 10, true)   // must be a pickaxe named Hammer
    .output(<item:minecraft:cobblestone>)
    .register("hammer_cobble");
```

**KubeJS**: Add `matchNbt: true` to the `tools` entry, and supply the expected NBT via `nbt`:

```js
.tools([
  { item: 'minecraft:iron_pickaxe', damage: 10, matchNbt: true, nbt: '{display:{Name:\'{"text":"Hammer"}\'}}' }
])
```

> - `matchNbt` defaults to `false`, so existing recipes behave unchanged (backward compatible).
> - Durability is **ignored** during comparison, so worn tools still match.
> - For custom tools like Tinkers' Construct, whose NBT contains per-tool material/modifier data, `matchNbt` is usually impractical; for "any-material variant of a TCon tool", keep the default (do not enable `matchNbt`).

---

## 7. FAQ

- **Recipe not working?** Verify the table type name is spelled correctly (all lowercase) and the item/fluid id exists. You can check against the corresponding table category in JEI.
- **Tool not recognized?** The `item`/`tag` in `tools` must be a valid ingredient, and `damage` is the durability consumed per craft; also confirm the tool is supported by the corresponding tool handler.
- **Tier restriction not working?** `minimumTier`/`maximumTier` take values 0 (worktable), 1 (workstation), 2 (workshop).
- **Reload after changes:** KubeJS uses `/reload`; CraftTweaker uses `/reload` (some changes require re-entering the save).
