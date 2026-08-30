---
translationKey: client-base-rooftop-nodes
title: Puerto Rico's Mesh Has No Backbone — And It's Not a Config Problem
description: Why CLIENT_BASE, not ROUTER_LATE, is the correct role for a rooftop node — and why the real fix for Puerto Rico's fragile mesh is a handful of coastal towers agreeing to run ROUTER together.
pubDate: 2026-07-20
author: WP4TZV
category: Tutorials
tags: [node-roles, router-late, client-base, zero-cost-hops]
readingTime: 10 min
---

If you have been watching your local mesh, you have probably seen it: someone puts a node on their roof, sets it to `ROUTER_LATE`, and announces they are "helping the mesh." I have seen this several times in my area, and I believed some of that reasoning myself until I sat down and read how the rebroadcast logic actually works.

The short version: `CLIENT_BASE` is the correct role for a rooftop node. `ROUTER_LATE` is not. And `CLIENT_BASE` is not a client that "becomes a router later" — that mental model is backwards, and it will lead you to configure it wrong.

I want to walk through how the roles actually work first, because the conclusion I reached at the end of it surprised me: the reason our mesh feels fragile has very little to do with anybody's role setting, and quite a lot to do with the fact that none of us have talked to each other about it.

## Three windows, not two

Meshtastic does not run a routing protocol. There is no OSPF, no BGP, no link-state database. Every node hears a packet and decides on its own whether to repeat it, and *when*. That "when" is the whole game, because everyone is sharing one frequency.

There are three timing windows a rebroadcast can land in:

| Window | Who transmits here | What it means |
|---|---|---|
| **Early** | `ROUTER`, `REPEATER`, and `CLIENT_BASE` (conditionally) | Goes first. Cuts in line ahead of everyone else, and can make ordinary nodes cancel their own repeat entirely. |
| **Default** | Every other role, including plain `CLIENT` | The normal timeslot where most traffic gets relayed. |
| **Late** | `ROUTER_LATE` only | The last slot. `ROUTER_LATE` waits here if it already heard somebody else repeat the packet. |

Within each window there is a random delay, biased by the signal-to-noise ratio of the received packet. Weaker signals get a shorter delay. The idea is that a node that heard you badly is probably far away, so it gets first shot at the repeat and the packet travels further per hop.

Notice that `CLIENT_BASE` and `ROUTER_LATE` sit at opposite ends of that table. They are not variations of each other.

## What CLIENT_BASE actually does

`CLIENT_BASE` uses the early window **only** when the packet is addressed to or coming from a node you have marked as a favorite. Every other packet it hears, it treats exactly like a plain `CLIENT` and repeats in the default window, if at all.

This is the part people miss, so I will say it plainly:

> If you set your roof node to `CLIENT_BASE` and never favorite anything, you have configured a `CLIENT` with extra steps.

The favorites list is not optional decoration. It is the mechanism. Set your roof node to `CLIENT_BASE`, then open it and favorite your handhelds, your base radio, whatever else you own that sits indoors behind concrete. Now those specific nodes get priority relaying through the one radio you own that actually has a view of the horizon.

That is the real use case. It is a personal-infrastructure role, not a public-infrastructure role.

## Why not ROUTER_LATE up there

`ROUTER_LATE` is a mandatory-rebroadcast role. It repeats everything it hears that still has hops left. That is by design — it exists for sites that are genuinely required for a pocket of nodes to reach the rest of the mesh at all. A cluster behind a ridge. A valley. The wrong side of a hill.

A rooftop in a populated area is the opposite situation. From up there you hear a lot, and repeating all of it puts a large amount of extra traffic on a shared channel that everyone in radio range has to take turns using. Enough of that and you get collisions, retries, and dropped packets — the mesh gets worse for everybody, including you. On slower presets like `LONG_FAST` this happens faster than you would expect.

The project's own guidance is direct about this: for a rooftop node, use `CLIENT_BASE` or `CLIENT`. `ROUTER` and `REPEATER` are even less appropriate, because they preempt other nodes and can silence perfectly good local paths.

If you are going to run `ROUTER_LATE` on a roof anyway, at least instrument it. Watch channel utilization and your own node's transmit airtime. If ChUtil climbs past roughly 25%, or your AirUtilTX passes 7–8%, you are part of the congestion problem and should change the role.

The uncomfortable conclusion for me was this: seeing lots of `ROUTER_LATE` nodes on rooftops is not evidence that it works. It is evidence of a common misconfiguration — one that `CLIENT_BASE` was specifically created to give people a better answer to.

## Zero-Cost Hops make the roof node cheaper

There is a second reason to run `CLIENT_BASE` on a roof, and it is newer. It is called **Zero-Cost Hops** (firmware 2.7.11 and later).

Normally every relay decrements the hop counter, and you only get seven. If your roof node burns one of those hops just to get a message from the neighborhood router down to your handheld in the living room, that is a hop you no longer have for reaching anyone interesting.

Zero-Cost Hops preserves the counter when all three of these are true:

1. The relaying node is `ROUTER`, `ROUTER_LATE`, or `CLIENT_BASE`.
2. It is not the first hop of the packet.
3. The node that relayed it previously is in your favorites **and** is a `ROUTER` or `ROUTER_LATE`.

Miss any one condition and the hop counter ticks down like always.

For a roof node the practical effect is that traffic arriving from a favorited infrastructure router lands on your roof for free, so the message does not die on the roof before it reaches the radios inside your house.

### One thing to be careful about

These are two separate mechanisms sharing one favorites list, and they key off different fields. The `CLIENT_BASE` early-window rule looks at who the packet is from or to. Zero-Cost Hops looks at which node relayed it. Favoriting a router does **not** turn your `CLIENT_BASE` into something that repeats all traffic.

So your favorites list ends up doing two jobs at once:

- **Favorite your own indoor nodes** → priority relaying for your own traffic.
- **Favorite the local ROUTER / ROUTER_LATE nodes** → free hops on inbound traffic.

Also worth knowing: the hop ceiling is still seven. Zero-Cost Hops does not raise the limit, it just stops you from wasting hops on infrastructure links. And only the `ROUTER`, `ROUTER_LATE`, and `CLIENT_BASE` nodes need the newer firmware — ordinary clients need no changes.

## The configuration, in order

1. Roof node → role `CLIENT_BASE`.
2. On that node, favorite every node you own that lives indoors.
3. On that node, also favorite the legitimate `ROUTER` / `ROUTER_LATE` sites in your area.
4. Indoor handhelds → `CLIENT`, or `CLIENT_MUTE` if they are sitting right next to the roof node in a busy area.
5. Run a traceroute before and after. If nothing changed, something in step 2 or 3 is not set the way you think it is.

## A caveat for those of us on smaller meshes

Zero-Cost Hops only pays off if there is real infrastructure near you to favorite. If the mesh in your area is mostly `CLIENT` nodes on windowsills — which describes a fair amount of the island right now — you can configure everything above correctly and see no change in your traceroutes at all. That is not a bug. There is simply no favorited router in the path yet.

The `CLIENT_BASE` favorites for your own indoor radios still help regardless. That part works with zero coordination from anyone else, which is why I would start there.

## What our island is actually missing

Look at the map around Puerto Rico and you will notice something: a lot of good sites are already occupied. Towers, coastal high ground, decent antennas. And nearly all of them are running `CLIENT`.

My first instinct was that those operators should switch to `CLIENT_BASE`. That instinct was wrong, and it is worth explaining why, because it took me a while to see it.

**`CLIENT_BASE` on a tower does nothing for the mesh.** It is a personal-benefit role. It changes how that node treats packets going to and from *the owner's* favorited nodes, and nothing else. Other people's traffic gets relayed exactly the same as before. A tower running `CLIENT_BASE` is still, from the network's point of view, a `CLIENT`.

**The blocker is upstream, not downstream.** Go back to the three conditions for a zero-cost hop. The third one is that the node which relayed the packet *before* you must be a favorited `ROUTER` or `ROUTER_LATE`. That means infrastructure has to exist on the sending side for the saving to happen at all.

If every tower on the coast is a `CLIENT`, then there is no zero-cost hop anywhere on this island. Not one. It does not matter how carefully you configure your own roof node, and it does not matter how many people you convince to switch to `CLIENT_BASE`. Somebody has to actually run `ROUTER` or `ROUTER_LATE` before the mechanism has anything to work with.

### So what should a coastal tower be?

Most likely `ROUTER`. That role is meant for sites with a genuinely excellent coverage footprint, and a tower with an open sea path is close to the textbook case — over water, LoRa goes a long way with nothing in the Fresnel zone to argue about.

`ROUTER_LATE` is the other candidate, and it fits a different shape of site: somewhere that is not a wide-area hub, but which a pocket of nodes genuinely depends on to reach the rest of the mesh. Behind a ridge, down a valley, the wrong side of the Cordillera.

The risk with `ROUTER` is that the role is a *claim*, and a false claim causes real damage. A `ROUTER` preempts everything around it and forces nearby nodes to cancel their own rebroadcasts. Put that on a site with mediocre coverage and you have silenced a set of perfectly good local paths and spent hops on a worse one. So this is not a "set it and see" experiment. It is a decision that should be made with the coverage data in hand, and ideally with the rest of the local mesh in the conversation.

### The interesting part is not technical

Zero-cost hops between two towers requires *mutual* favoriting. Operator A favorites B, and B favorites A. Neither one can do it alone.

That makes this a coordination problem wearing a configuration problem's clothes. The feature does not reward the operator who reads the docs fastest. It rewards the group that talks to each other.

Sketch out what that would look like here. A ring of mutually favorited `ROUTER` sites around the coast, plus a couple in the Cordillera Central to carry the north-south paths that the mountains currently break. Traffic entering that ring crosses the island for roughly one hop of cost instead of five or six. Everything you save goes to the first and last mile, which is exactly where it is needed — the handheld in the parking lot, the node in the concrete apartment.

That is not a feature you can install. It is a few operators agreeing on roles and favorites lists, and then keeping firmware current.

### And to be clear about the existing tower nodes

None of the above means those `CLIENT` towers are broken or useless. They relay. They extend coverage. They are doing the thing they were put up to do, and in a network with no coordinated backbone, `CLIENT` is a defensible and safe choice — it is what the project recommends when you are not sure.

The argument for changing them is not "your node is doing nothing." It is that a handful of them, chosen deliberately and configured together, could turn a collection of individually useful nodes into an actual backbone.

---

**Sources**

- [Demystifying ROUTER_LATE](https://meshtastic.org/blog/demystifying-router-late/) — Meshtastic blog
- [Zero-Cost Hops for Favorite Routers](https://meshtastic.org/blog/zero-cost-hops-favorite-routers/) — Meshtastic blog
- [Choosing The Right Device Role](https://meshtastic.org/blog/choosing-the-right-device-role/) — Meshtastic blog
- [Configuration Tips](https://meshtastic.org/docs/configuration/tips/) — Meshtastic docs

*73 de WP4TZV*
