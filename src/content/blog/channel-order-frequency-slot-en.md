---
translationKey: channel-order-frequency-slot
title: "The Channel You Moved Wasn't a Channel — It Was Your Frequency"
description: In Meshtastic there is no "channel order" to change — index 0 is the primary, its name hashes to your LoRa frequency slot, and one added channel or imported QR can silently move you eight megahertz off the regional mesh. When pinning the slot is the right call, and when it isn't.
pubDate: 2026-08-30
author: WP4TZV
category: Tutorials
tags: [channels, frequency-slot, lora, congestion]
readingTime: 13 min
---

# The channel you moved wasn't a channel — it was your frequency

A node goes quiet. Not offline: it boots, the screen works, the app connects, telemetry updates. It just stops existing as far as the rest of the mesh is concerned. Nobody hears it, it hears nobody.

And it still talks perfectly to the one other node you happened to reconfigure at the same time, which is exactly what makes this take days to figure out.

If somebody recently added, removed, or reordered a channel on that node, you already know what happened. They changed the frequency. They just didn't know that's what they were doing.

## What actually determines your frequency

Meshtastic doesn't ask you to pick a frequency. It derives one.

From the official documentation: a hash of the **PRIMARY** channel's name sets the LoRa frequency slot, which determines the actual frequency you transmit on within the band.

That hash takes three inputs, not one:

1. The name of the primary channel
2. Your region
3. Your bandwidth (which comes from the modem preset)

Change any of the three and the slot moves.

For the US region at 250 kHz bandwidth, the band divides into 104 slots:

```
num_slots     = (928 - 902) / 0.25 = 104
slot n center = 902 + 0.125 + (n-1) × 0.25   MHz
```

Two concrete values worth memorizing, because they show how far the slot travels:

| Primary channel name | Slot | Frequency |
|---|---|---|
| `LongFast` | 20 | 906.875 MHz |
| `MediumSlow` | 52 | 914.875 MHz |

Different names don't nudge you a little. They put you eight megahertz away, on the other side of the band, deaf to everyone.

And one more consequence that surprises people: **every channel on the node shares the primary's slot.** Your secondary channels don't get their own frequencies. They ride on whatever the primary's name hashed to.

## There is no "channel order" to change

Here's the part that makes this a trap rather than a quirk.

You cannot move the primary role from one channel to another. There's no flag for it. **Index 0 *is* the primary**, by definition. The index range is 0 through 7, indexing cannot be modified, and active channels have to be consecutive — you can't leave a disabled gap in the middle.

Which means reordering channels is *always* the same operation as changing which channel is primary. And changing which channel is primary is *always* changing your frequency. There is no version of "just reordering" that leaves the radio alone.

## The way people actually hit this

Almost nobody reorders channels deliberately. The realistic scenario is this:

> You want a private channel for your family, your club, or your emergency group. You add it. It lands at index 0. `LongFast` gets pushed to index 1.

You have now left the public mesh. You didn't touch a radio setting. You didn't change the preset or the region. The app didn't warn you. Your private channel works beautifully with everyone you set up in person, and the regional mesh has vanished.

Three sibling traps that produce the same silent failure:

- **Changing the modem preset.** Bandwidth changes the slot count, and the hash is taken modulo that count. Same channel name, different preset, different slot.
- **Changing the region.** Different band, different slot map.
- **Importing a channel URL or QR code from someone else.** This can rewrite your whole channel set, including which one lands at index 0. It's the most common way this happens to someone who never edited a channel at all.

## When moving the slot is the right call

All of the above is about doing it by accident. Doing it on purpose is a legitimate and sometimes excellent tool. Here's when.

### 1. Pin the slot so you can rename freely

This is the inverse of the warning and probably the most useful case for most people.

Say you want your primary channel called `PR-Mesh` instead of `LongFast`, for organization or identity. Normally that would move you off the regional frequency and isolate you. But if you explicitly set the frequency slot, the name no longer controls the radio. **Pin slot 20, name the channel whatever you like, stay on the same frequency as everyone else.**

The documentation is explicit that this is the supported approach: to make devices with different primary channel names transmit on the same frequency, set the LoRa frequency slot explicitly.

### 2. Escape a congested slot — and understand why a new PSK doesn't do this

This is the one most people get wrong, and it's worth being precise about.

A private channel with a different PSK gives you **privacy**. It does not give you **airtime**. You're still on the same frequency as the public mesh. Your radio still receives every LongFast packet, still spends time on it, still has to wait its turn behind it. You fail to decrypt it and throw it away — after paying for it.

A different frequency slot gives you both. You don't hear their traffic and they don't hear yours, so neither group is contending for the other's airtime.

If your local LongFast slot is saturated — channel utilization climbing past 25%, messages arriving late or not at all — moving a group to its own slot is a genuine fix in a way that a new PSK is not.

### 3. Get away from a local interferer

902–928 MHz is a busy ISM band. Smart meters, industrial telemetry, LoRaWAN gateways, cordless devices — any of these can be sitting on top of your slot and nowhere else. If one specific site has terrible performance while nearby nodes are fine, a different slot is worth testing before you blame the antenna.

### 4. Separate two meshes that share RF space but not purpose

Two towns close enough to hear each other, with no reason to interconnect. On one slot, each pays airtime for the other's traffic forever. On separate slots, both get quieter meshes. This is a coordination decision between two communities, not something one operator should do unilaterally.

### 5. Bench testing

Put your test node on a slot nobody uses. You can hammer it, flood it, break it, and reflash it without putting a single packet on the live mesh. This is the safest and least controversial reason on the list, and more people should do it.

### 6. Temporary or event meshes

A mesh for a specific event, deployment, or exercise that shouldn't dump its traffic onto the regional network. Give it its own slot, run the event, tear it down.

### What it costs you

Moving off the default slot is not free, and the costs are worth stating plainly:

- **You become undiscoverable.** Nobody finds you by default. A newcomer flashing a node in your area will never see you.
- **You lose the big mesh's relay property.** On the public slot, some stranger's node might carry your packet. On your own slot, only your own nodes will.
- **Coordination becomes mandatory.** Everyone must be given the exact slot number, and it has to be right. One person off by one and they're alone.
- **For emergency use, this cuts against you.** Being findable on the default slot is a feature when the situation is bad and the people who need to reach you haven't been briefed on your config.

The honest summary: move deliberately when airtime or isolation is the goal and you control everyone who needs to be there. Stay on the default when discoverability matters more than quiet.

## How to pin it

The setting is `lora.channel_num`. It controls the actual hardware frequency, expressed as a slot between 1 and the maximum for your region and preset. Set it to 0 or leave it unset and the device falls back to the channel-name hash. Set it to a number and that number wins.

So:

```
meshtastic --set lora.channel_num 20
```

Once it's pinned, renaming, reordering, adding, and removing channels can no longer move your frequency. Which is the real recommendation of this post:

> If you run infrastructure, pin the slot. Not because you plan to reorder anything, but so that the day someone imports a config or adds a channel, the radio doesn't move.

## How to tell this is what happened to you

The signature is specific enough to diagnose from the couch:

1. **The node works — it just has no peers.** Boots, connects, screen fine, zero nodes in range.
2. **It talks to whatever you configured alongside it**, which makes it look like the radio is healthy. It is.
3. **Nothing changed in the LoRa settings.** People check region, preset, and TX power, find them untouched, and conclude the problem is hardware.
4. **Something changed in the channel list** — added, removed, reordered, or imported — right before it went quiet.

Check the primary channel's name against what the rest of your mesh is using. Then check the computed slot with one of the community calculators, or just read the frequency off the device.

And note how this looks from the outside: on a monitor, a node that moved slots is indistinguishable from a node that's deaf. It's another entry for the list of false positives I wrote about in the clock post — before you tell somebody their antenna is bad, check that they're still on your frequency.

## For Puerto Rico specifically

Two things that matter locally.

**If a group here wants a private primary channel, everyone pins the same slot or the group scatters.** Each person's node hashes their own name into its own slot and every one of them concludes that everyone else's node is off. The failure is silent and mutual.

**If you also want to stay reachable on the regional mesh, `LongFast` has to remain your primary — or you pin slot 20 by hand.** You can have a private channel and public reachability at the same time, but only if the frequency stays put. That's the whole trick: private channels are for message separation, and the slot is for RF separation. They're independent, and confusing them is how a node disappears.

## Checklist

1. **Before touching channels, write down your current frequency slot.** It's the thing you're about to change without meaning to.
2. **Pin `lora.channel_num` on anything you can't easily reach.** Rooftop, tower, remote site — pin it.
3. **Adding a private channel? Check what ended up at index 0.**
4. **Importing a QR or URL from someone else? Assume it rewrote your channel order** and verify afterward.
5. **Want a custom primary channel name and public reachability? Pin the slot first, rename second.**
6. **Want quiet, not privacy? Move the slot.** A new PSK alone won't buy you airtime.
7. **Node went silent after a config change? Check the frequency before you check the antenna.**

---

**Sources**

- [Channel Configuration](https://meshtastic.org/docs/configuration/radio/channels/) — Meshtastic docs: the primary channel name hash sets the frequency slot; index rules
- [LoRa Configuration](https://meshtastic.org/docs/configuration/radio/lora/) — `lora.channel_num` behavior and the 0/UNSET fallback
- [Frequency slot calculator](https://github.com/heypete/meshtastic_frequency_slot_calculator) — slot values for named channels, including LongFast = 20 and MediumSlow = 52
- [Mesh radio calculator](https://meshradiocalc.yycmesh.com/) — slot and center frequency by region, bandwidth, and primary channel name
- Previous posts: *Puerto Rico's Mesh Has No Backbone*, *Nodes with the Wrong Time*, *Height vs. Power*

*73 de WP4TZV*
