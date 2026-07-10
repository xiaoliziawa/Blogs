---
title: KeyboardJS Server-Side Key Event Guide
---

# KeyboardJS Server-Side Key Event Guide

This guide applies to Minecraft 1.20.1 Forge, KubeJS 2001.6.4, and KeyboardJS.


## File Location

Place server-side key handling code in:

```text
kubejs/server_scripts/keyboard.js
```

Run `/reload` after modifying the script. KeyboardJS will automatically synchronize the required input actions again, so players do not need to reconnect.

## Available Events

```js
KeyboardEvents.serverPressed(event => {})
KeyboardEvents.serverReleased(event => {})
KeyboardEvents.serverRepeated(event => {})
```

All three events support key filters. Filter names are case-insensitive:

```js
KeyboardEvents.serverPressed('G', event => {})
KeyboardEvents.serverPressed('mouse_left', event => {})
```

Common event properties:

| Property | Description |
| --- | --- |
| `event.player` | The server-side player who sent the input |
| `event.server` | The current `MinecraftServer` |
| `event.key` | The key name, such as `G`, `L_SHIFT`, or `MOUSE_LEFT` |
| `event.keyType` | The corresponding `Keys` enum value |
| `event.pressed` | Whether the current action represents a held-down state |
| `event.released` | Whether the current action is a release |
| `event.repeated` | Whether the current action is a GLFW key-repeat event |
| `event.mouseButton` | Whether the input is a mouse button |
| `event.shiftDown` | Whether the Shift modifier is held |
| `event.controlDown` | Whether the Ctrl modifier is held |
| `event.altDown` | Whether the Alt modifier is held |
| `event.superDown` | Whether the Win/Super modifier is held |

## Example 1: Detecting the G Key

```js
KeyboardEvents.serverPressed('G', event => {
    let player = event.player

    player.tell(Text.green('You pressed the G key'))
})
```

This code is placed entirely in `server_scripts`. KeyboardJS automatically sends the client input to the server through its custom network packet.

## Example 2: Ctrl + R Ability with a Cooldown

```js
const abilityCooldowns = new Map()
const COOLDOWN_TICKS = 20 * 5

KeyboardEvents.serverPressed('R', event => {
    if (!event.controlDown) {
        return
    }

    let player = event.player
    let playerId = String(player.uuid)
    let now = event.server.tickCount
    let readyAt = abilityCooldowns.get(playerId) ?? 0

    if (now < readyAt) {
        player.tell(Text.red(`Ability on cooldown: ${Math.ceil((readyAt - now) / 20)} seconds remaining`))
        return
    }

    abilityCooldowns.set(playerId, now + COOLDOWN_TICKS)
    player.boostElytraFlight()
    player.tell(Text.aqua('Elytra boost activated'))
})
```

The cooldown is stored and checked by the server. Do not allow the client to decide when a cooldown has ended.

## Example 3: Measuring How Long a Key Is Held

```js
const pressTimes = new Map()

KeyboardEvents.serverPressed('V', event => {
    pressTimes.set(String(event.player.uuid), event.server.tickCount)
})

KeyboardEvents.serverReleased('V', event => {
    let playerId = String(event.player.uuid)
    let pressedAt = pressTimes.get(playerId)
    pressTimes.delete(playerId)

    if (pressedAt == null) {
        return
    }

    const heldTicks = event.server.tickCount - pressedAt
    event.player.tell(Text.yellow(`V was held for ${heldTicks} ticks`))

    if (heldTicks >= 40) {
        event.player.addXPLevels(1)
    }
})
```

The server-side network layer rejects release packets without a matching press state and also rejects forged duplicate press packets.

## Example 4: Restricting a Server Command to Administrators

```js
KeyboardEvents.serverPressed('F8', event => {
    let player = event.player

    if (!player.hasPermissions(2)) {
        player.tell(Text.red('You do not have permission to use this key action'))
        return
    }

    event.server.runCommandSilent('weather clear')
    player.tell(Text.green('Weather cleared'))
})
```

## Global and Mouse Input Listeners

Omit the key name to receive every key press:

```js
KeyboardEvents.serverPressed(event => {
    console.info(`${event.player.username} pressed ${event.key}`)
})
```

Use the following names for mouse buttons:

```js
KeyboardEvents.serverPressed('MOUSE_LEFT', event => {
    event.player.tell(Text.gray('Left mouse button pressed'))
})
```

Supported names are `MOUSE_LEFT`, `MOUSE_RIGHT`, `MOUSE_MIDDLE`, and `MOUSE_4` through `MOUSE_8`.

## ⚠️ Security Considerations

Custom network packets solve the problem of transferring input to the server, but they cannot prove that a player physically pressed a key. Players using modified clients may still forge correctly formatted packets. Server scripts must therefore follow these rules:

- Validate permissions, cooldowns, item consumption, distance, and game stages entirely on the server.
- Never grant administrator permissions or execute unrestricted commands solely because a key packet was received.
- High-value abilities should validate the player's state and use a server-side cooldown.
- `serverRepeated` fires continuously while a key is held and should only be registered when it is actually needed.
