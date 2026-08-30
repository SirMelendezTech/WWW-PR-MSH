---
translationKey: router-vs-router-late-vs-repeater
title: "Router, Router Late, or Repeater: Picking a Role for a Real Infrastructure Site"
description: The three infrastructure roles differ on two axes — when you transmit, and whether anyone can see you. ROUTER preempts, ROUTER_LATE never does, and REPEATER is invisible. Which one a Puerto Rico site should actually run, and why invisibility is a liability here.
pubDate: 2026-08-30
author: WP4TZV
category: Tutorials
tags: [node-roles, router, router-late, repeater, rebroadcast-mode]
readingTime: 11 min
---

# Router, Router Late, or Repeater: picking a role for a real infrastructure site

Most role questions on this island are answered by "run `CLIENT`." I've [made that argument at length](/blog/client-base-rooftop-nodes/): a rooftop in a populated neighborhood is not infrastructure, and setting it to `ROUTER_LATE` because it's high up makes the mesh worse.

This post is for the other case — the one where you cleared that bar. A tower with an open sea path. A ridge site that a whole valley depends on. Something permanent, elevated, and genuinely bridging coverage nobody else can reach.

Now you have three roles to choose between, and the documentation describes them in language that makes them sound like grades of the same thing: `ROUTER`, `ROUTER_LATE`, `REPEATER`. They are not grades. They differ on two independent axes, and picking wrong costs the mesh in two different ways.

## The two axes

**Axis one: when you transmit.** Every rebroadcast lands in a contention window, and the window decides whether you cut in front of your neighbors or wait behind them.

**Axis two: whether anyone can see you.** This one gets almost no attention and matters enormously in a mesh as young as ours.

Here's how the three land:

| Role | Rebroadcast timing | Preempts others? | Visible on the mesh? |
|---|---|---|---|
| **`ROUTER`** | Early window, always rebroadcasts once | **Yes** — nearby nodes cancel their own repeat | Yes — appears in the nodes list, sends telemetry |
| **`ROUTER_LATE`** | Default window; **defers** to the late window if it hears someone else relay first | **No** | Yes — appears in the nodes list, sends telemetry |
| **`REPEATER`** | Early window, always rebroadcasts once | **Yes** — same aggression as `ROUTER` | **No** — not shown in the nodes list or topology, no telemetry |

Read that table twice. `ROUTER` and `REPEATER` sit in the same slot on axis one and opposite ends of axis two. `ROUTER_LATE` is the only one of the three that never preempts anybody.

## ROUTER: the role that makes a claim

`ROUTER` always rebroadcasts a packet once, in the early window, and it does so **even if it already heard another node relay that packet**. Ordinary nodes that hear the router go first will cancel their own rebroadcast entirely.

That is the whole point, and it's also the whole risk. Setting `ROUTER` is a claim that your coverage from that site is better than the coverage of the nodes you're silencing. When the claim is true, traffic crosses the island in fewer hops and the mesh gets quieter and faster. When it's false, you've muted a set of perfectly good local paths and spent a hop on a worse one.

A coastal tower with a sea path is close to the textbook case — over water there's nothing in the Fresnel zone to argue about, and LoRa goes a long way. That's the shape of site `ROUTER` was written for.

The failure mode is a `ROUTER` on mediocre high ground. It preempts, it wins the race, and then the packet dies one hop short of where a plain `CLIENT` would have carried it. Everyone around it gets worse service and nobody can tell why, because from the outside the router looks like it's working — it *is* relaying, just badly.

## ROUTER_LATE: coverage without the claim

`ROUTER_LATE` is the most misunderstood of the three, and the actual behavior is more interesting than the name suggests.

It does **not** simply "transmit late." Normally it uses the default window, exactly like a `CLIENT`. The difference shows up when it hears somebody else rebroadcast the packet first. An ordinary client, at that point, cancels — somebody's got it, no need. A `ROUTER_LATE` instead **defers** its rebroadcast to the late window and sends it anyway.

The Meshtastic documentation puts the consequence plainly: other than the higher airtime, *"the impact of deploying a `ROUTER_LATE` node is identical to as if a `CLIENT` were deployed at that location."*

That sentence is the whole role. You get guaranteed relaying — the packet definitely goes out from your site — with zero preemption of anyone around you. You pay for it in airtime, because you're transmitting packets that were already successfully relayed.

Which makes it right for a specific shape of site: **a pocket of nodes with no line of sight to an existing `ROUTER`.** Behind a ridge. Down a valley. The wrong side of the Cordillera. Somewhere that isn't a wide-area hub, but that a group of nodes genuinely depends on to reach the rest of the mesh at all.

If your site is the *only* path for somebody, `ROUTER_LATE` guarantees the path without you having to claim you're better than your neighbors.

## REPEATER: maximum aggression, zero visibility

`REPEATER` has the same rebroadcast priority as `ROUTER` — early window, relays even if it heard someone else do it. Then it goes further in a direction that has nothing to do with routing: it **turns off everything the node would otherwise say on its own behalf.**

No telemetry. No position broadcasts. No node info. It only responds to other nodes' packets; it never originates. The screen is off by default. And critically, per the device docs, it is **not shown in the nodes list and not shown in topology.**

There's a real argument for this. A pure relay that never originates traffic spends none of the shared channel on telling everyone how its battery is doing. On a congested channel that's a genuine saving, and it's why the role exists.

But think about what you give up on an island where the mesh is still being mapped:

- **It won't appear on the [Node Map](/map/).** No position broadcast means nothing to place. Your site contributes coverage that no one planning the next node can see.
- **Traceroute shows it as "Unknown"** if it isn't in the querying node's list — so when somebody debugs a path through your site, they get a mystery hop.
- **You can't check on it remotely.** No telemetry means no channel utilization, no battery voltage, no way to know it's healthy short of driving there. For a solar site on a ridge, that's a real operational cost — see [the power budget post](/blog/power-budget-solar-node-en/) for what you'd be flying blind on.
- **Nobody can tell it's yours.** In a mesh whose actual problem is [operators not talking to each other](/blog/client-base-rooftop-nodes/), an anonymous node that preempts its neighbors is not a great contribution to the conversation.

There's also a mechanical detail worth knowing: `rebroadcast_mode` is a separate setting from role, and most of its values work on any role. Only **`ALL_SKIP_DECODING`** — rebroadcast without even decoding the packet — is restricted to `REPEATER`. If what you actually wanted was to filter *what* gets relayed (`LOCAL_ONLY` to ignore foreign meshes, `KNOWN_ONLY` to relay only for nodes in your NodeDB, `CORE_PORTNUMS_ONLY` to drop TAK and range-test traffic), you can set that on a `ROUTER` and keep your visibility. You do not have to go invisible to get selective.

## So which one

For Puerto Rico specifically, my read:

**Use `ROUTER`** if the site has a genuinely dominant coverage footprint — a coastal tower with a sea path, a Cordillera site that sees a large area — *and* you've agreed on it with the operators around you. This is the role that builds a backbone, and it's the one that does damage when the claim is wrong.

**Use `ROUTER_LATE`** if the site is the only path for a pocket of nodes but isn't a wide-area hub. You guarantee the link without silencing anybody. This is also the safer choice when you're not certain your coverage beats your neighbors' — it fails gracefully, because worst case you're a `CLIENT` that spends extra airtime.

**Think hard before `REPEATER`.** The airtime it saves is real but small; the visibility it costs is large while we're still building the map. If the channel is congested enough that a router's own telemetry is the problem, the better first move is [stretching that node's broadcast intervals](/blog/broadcast-intervals-airtime-en/) — you keep the node visible and get most of the saving. Reserve `REPEATER` for a site where you've measured the congestion, you've already lengthened the intervals, and you're deliberately accepting that the node disappears from everyone's view.

And one deprecation to note: **`ROUTER_CLIENT` was removed in firmware 2.3.15.** If you're reading an older guide that recommends it, that guide predates roughly three years of routing changes — treat the rest of its advice with the same suspicion.

## Measure before and after

Whichever you pick, the role is a hypothesis. Test it:

- **Traceroute across the site** before and after the change. If paths didn't change, the role didn't do what you thought.
- **Watch channel utilization.** Past roughly 25% on the primary channel, collisions climb fast and the mesh starts dropping traffic it would otherwise have carried.
- **Watch your own AirUtilTX.** Past 7–8% and your site is a meaningful part of the local congestion — which is a signal to step down from `ROUTER` to `ROUTER_LATE`, not to push harder.
- **Ask a neighbor.** The node best positioned to tell you whether your router helped is the one you might be preempting.

If the numbers get worse after you promote a node, the honest move is to put it back. A `CLIENT` in a good spot is a genuine contribution. A `ROUTER` in a mediocre spot is a net negative that's very hard to see from the inside.

## Checklist

1. **Does the site clear the infrastructure bar at all?** Permanent, elevated, bridging coverage others can't. If not, run `CLIENT` and stop here.
2. **Is it a wide-area hub, or the only path for a pocket?** Hub → `ROUTER`. Only path → `ROUTER_LATE`.
3. **Not sure?** `ROUTER_LATE`. It fails gracefully; `ROUTER` doesn't.
4. **Considering `REPEATER`?** Try long broadcast intervals on a `ROUTER` first, and confirm you're willing to lose the map, the traceroutes, and remote health checks.
5. **Want selective relaying?** Set `rebroadcast_mode` — you don't need `REPEATER` for anything except `ALL_SKIP_DECODING`.
6. **Talk to the operators around you before promoting a node**, and traceroute before and after.

The roles are tools for a network that has a backbone. Choosing between them thoughtfully is how we get one.

---

**Sources**

- [Device Configuration](https://meshtastic.org/docs/configuration/radio/device/) — Meshtastic docs: role definitions, `rebroadcast_mode` values, `REPEATER` not shown in nodes list or topology, `ROUTER_CLIENT` deprecated in 2.3.15
- [Demystifying ROUTER_LATE](https://meshtastic.org/blog/demystifying-router-late/) — Meshtastic blog: the defer-instead-of-cancel behavior and the "identical to a CLIENT at that location" comparison
- [Choosing The Right Device Role](https://meshtastic.org/blog/choosing-the-right-device-role/) — Meshtastic blog: `REPEATER` turning off broadcasted traffic
- [Mesh Broadcast Algorithm](https://meshtastic.org/docs/overview/mesh-algo/) — Meshtastic docs: contention windows and managed flooding
- Previous post: *[Puerto Rico's Mesh Has No Backbone](/blog/client-base-rooftop-nodes/)*

*73 de WP4TZV*
