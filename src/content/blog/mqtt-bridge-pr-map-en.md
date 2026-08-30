---
translationKey: mqtt-bridge-pr-map
title: "Getting Your Node Onto the Puerto Rico Mesh Map"
description: What actually has to be true for your node to show up on the PR coverage map — the MQTT root topic msh/US/PR, OK to MQTT, uplink-only, and the position settings that decide whether you appear at all.
pubDate: 2026-08-30
author: Meshtastic PR
category: Tutorials
tags: [mqtt, map, msh-us-pr, monitor]
readingTime: 8 min
---

# Getting Your Node Onto the Puerto Rico Mesh Map

The [Node Map](/map/) is built from what nodes publish to MQTT under the Puerto Rico topic. If your node isn't on it, that's not a bug in the map — it means your node either isn't bridging to MQTT, isn't publishing under the topic the map reads, or isn't sending a position at all. All three are fixable in a few minutes.

This post walks the whole chain. None of it changes how your node talks over LoRa — MQTT is a side channel to the internet, and the radio mesh keeps working through outages regardless. See [Recommended Settings → MQTT](/settings/#mqtt) for the reference table this expands on.

## What "being on the map" actually requires

Four things have to line up:

1. **Your node reaches the internet.** Either the node itself has WiFi/Ethernet, or a phone running the app is bridging its packets. A node with no internet path never publishes anything.
2. **MQTT is enabled and pointed at the public server** with the correct root topic.
3. **"OK to MQTT" is on**, and the channel you want visible has **uplink enabled**.
4. **Your node sends a position.** No position packet, no marker — the map has nothing to place.

Miss any one and you're invisible, usually with no error to tell you which.

## The root topic is the part people get wrong

Meshtastic builds its full MQTT topic from a **root topic** you set, plus the channel name and other segments it appends automatically. Puerto Rico traffic on the public server lives under:

```
msh/US/PR
```

following the standard `msh/<country>/<region>` structure. The PR map and coverage tools subscribe to that path. If your root topic is still the firmware default (`msh`) or something custom, your packets are going *somewhere* — just not where anything in Puerto Rico is listening.

Set it and confirm it before you assume the bridge is broken:

```
meshtastic --set mqtt.root msh/US/PR
meshtastic --get mqtt.root
```

## The rest of the MQTT settings

```
meshtastic --set mqtt.enabled true
meshtastic --set mqtt.address mqtt.meshtastic.org
meshtastic --set lora.config_ok_to_mqtt true
```

`config_ok_to_mqtt` (shown as **"OK to MQTT"** in the apps) is a firmware-level flag that tells other nodes your traffic is allowed to be uplinked. Without it, a well-behaved bridge node won't forward your packets even if everything else is correct.

Then, **per channel**, set uplink on and downlink off:

```
meshtastic --ch-set uplink_enabled true --ch-index 0
meshtastic --ch-set downlink_enabled false --ch-index 0
```

Channel index 0 is your primary. Only enable uplink on channels you actually want mirrored to the internet.

### Leave downlink off

Downlink pipes internet-side MQTT traffic back down onto the radio mesh. On a shared channel that means every packet from every bridged node elsewhere competes for local airtime that never needed to be spent. Uplink-only is the correct default for a Puerto Rico bridge node — you're contributing visibility, not importing load. This is the same reasoning behind keeping [broadcast intervals long on stationary nodes](/blog/broadcast-intervals-airtime-en/).

## You still need to send a position

The map places a marker where your node says it is. That position can come from:

- an onboard GPS with a fix, or
- a **fixed position** you set manually on a node that doesn't move.

For a rooftop or base node, fixed position is usually the right call — it's accurate, it costs zero airtime to acquire, and it doesn't drift:

```
meshtastic --setlat 18.2013 --setlon -67.1397
meshtastic --set position.fixed_position true
```

If you'd rather not broadcast a precise location, Meshtastic lets you reduce **position precision** so the map shows an approximate area instead of your exact roof. The map never sharpens a position beyond what your node reports — that control stays entirely on your device.

## How long until you show up

The map is rebuilt from the monitor's data, not updated live in your browser. After your node publishes its first position under `msh/US/PR`, expect it to appear on the next refresh — minutes to a few hours, not instantly. If it's still missing after that:

- Check `meshtastic --get mqtt` and confirm `enabled: true`, `root: msh/US/PR`, and a reachable `address`.
- Confirm the node has a real internet path (the app shows MQTT status).
- Confirm the node has actually sent a position — check its own position field is populated.
- Confirm uplink is enabled on the primary channel.

## What MQTT does and doesn't expose

It carries diagnostic metadata: position (at your chosen precision), battery, signal metrics, channel utilization. It does **not** carry the contents of encrypted channels or direct messages. Bridging a node to MQTT makes its *activity* visible online; it doesn't make your messages public.

If you run your own broker instead of the public server, treat those credentials like any other server login — don't reuse them, and don't commit them to a public repo or a config export.

---

Once you're on the map, you're also part of the coverage picture the community uses to plan where the next nodes should go — see [Puerto Rico Mesh](/pr-mesh/).
