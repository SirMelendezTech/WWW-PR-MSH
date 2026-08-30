---
translationKey: broadcast-intervals-airtime
title: "Your Stationary Node Is Talking Too Much"
description: The single most common misconfiguration on the Puerto Rico mesh — a fixed rooftop node broadcasting on mobile-node timers — and the airtime math that explains why it quietly degrades everyone's range.
pubDate: 2026-08-30
author: WP4TZV
category: Field Reports
tags: [broadcast-interval, airtime, channel-utilization, congestion]
readingTime: 9 min
---

# Your Stationary Node Is Talking Too Much

Every packet your node sends is time no other node on the channel can transmit. LoRa at the settings Puerto Rico uses is slow — a single position packet can occupy the air for a good fraction of a second, and only one node in earshot can talk at a time. So the question that actually matters for a rooftop node isn't "how fresh is my telemetry" — it's "how much of the shared channel am I spending, and on what."

The most common answer, on the nodes we look at, is: far too much, on information that never changes.

## Where the airtime goes

A stationary node running firmware defaults is often broadcasting:

- its **position** every 15 minutes — a position that is, by definition, fixed
- **device telemetry** (battery, voltage) every 30 minutes
- **node info** every couple of hours
- and, if enabled, environment and power telemetry on similar timers

Multiply that by every node in a dense area and add the rebroadcasts each hop generates, and a channel that should be mostly idle is instead busy several percent of the time — sometimes well into double digits. Meshtastic exposes this as **channel utilization** and **airtime** in the device metrics. Above roughly 25% utilization, packet collisions climb fast and the mesh starts dropping traffic it would otherwise have carried.

The nodes that suffer first are the far ones — the marginal links two or three hops out that only get through when the channel is quiet. A chatty node in the metro doesn't just cost itself; it shortens everyone's effective range.

## A fixed node's position is fixed

This is the part that makes the fix easy. A rooftop node is not moving. Broadcasting its position every 15 minutes communicates nothing that a broadcast every 12 hours doesn't. The same goes for GPS itself — there's no reason for a stationary node to burn power checking its own fix every few minutes when the answer is always the same coordinates.

Set the position once, mark it fixed, and let the timers go long:

```
meshtastic --setlat 18.4655 --setlon -66.1057
meshtastic --set position.fixed_position true
meshtastic --set position.position_broadcast_secs 43200
meshtastic --set position.gps_update_interval 21600
meshtastic --set position.position_broadcast_smart_enabled false
```

Smart position broadcasting — send on movement instead of on a timer — is a mobile-node feature. On a fixed node it does nothing useful, so turn it off and rely on the long fallback interval.

## Telemetry: long, with one exception

Battery and environment telemetry from a mains-powered rooftop node is low-value at high frequency — the battery isn't draining, the temperature curve doesn't need minute resolution. Push those intervals out:

```
meshtastic --set telemetry.device_update_interval 21600
meshtastic --set telemetry.environment_update_interval 21600
```

The exception is a **solar** node, where charge health is genuinely worth watching:

```
meshtastic --set telemetry.power_update_interval 3600
```

That's a deliberate trade — one useful packet an hour, against many useless ones.

## Trim the packets you do send

A fixed node doesn't need to report speed, heading, or satellites-in-view — those fields are meaningful only on something that moves. Dropping them makes every position packet smaller, which means less airtime per broadcast:

```
meshtastic --set position.position_flags ALTITUDE,ALTITUDE_MSL,GEOIDAL_SEPARATION
```

## The baseline, in one place

Puerto Rico's suggested starting point for a stationary node:

| Setting | Value |
|---|---|
| Position broadcast | 12 hours |
| GPS update interval | 6 hours |
| Smart position | off |
| Node info broadcast | 6 hours |
| Device / environment telemetry | 6 hours |
| Power telemetry (solar only) | 1 hour |
| Map report | 6 hours |

The full table, with mobile-node values alongside and the CLI block for both, is in [Recommended Settings → Broadcast Intervals](/settings/#broadcast-intervals). Treat it as a floor to coordinate up from, not a target to race down toward — if you want to broadcast more often than this on a shared channel, talk to the operators around you first.

## Check your work

After changing intervals, watch the device metrics for a day. Channel utilization on the primary channel should sit low — a few percent in a normal area. If it's still high with your node quieted down, the load is coming from somewhere else on the mesh, and that's a conversation for the [community](/community/), not a settings change on your end.

This is the same theme as [Puerto Rico's mesh backbone problem](/blog/client-base-rooftop-nodes/): the network rarely needs *more* from any single node. It needs each node to spend the shared channel deliberately.
