---
title: Recommended Settings
description: Puerto Rico community configuration guidance for region, node roles, broadcast intervals, Neighbor Info, and MQTT.
order: 3
section: Documentation
---

<div class="callout callout--warning">
<span class="callout-label">Community defaults, not official ones</span>
These values start from what other Meshtastic community networks have field-tested, and are being tuned for Puerto Rico. Each one is labeled <span class="badge badge--verified">Verified</span> when multiple Puerto Rico operators have confirmed it in the field, or <span class="badge badge--proposed">Proposed</span> when it's a reasonable starting point that hasn't been broadly tested yet. Firmware behavior changes between releases — current Meshtastic documentation wins over this page.
</div>

Each setting shows where to find it in the Meshtastic app on Android and iPhone. Every path starts from the app's **Settings** screen.

## Region and Frequency

Meshtastic requires every device to declare a **LoRa region**, which sets the legal frequency band, power limits, and duty cycle for where the radio operates. <span class="badge badge--verified">Verified</span>

**Android:** Radio configuration → LoRa → Region → **US**. **iPhone:** Radio Configuration → LoRa → Region → **US**.

Puerto Rico falls under United States frequency allocation for the unlicensed ISM band that Meshtastic uses. Set your region accordingly, and confirm against the [official Meshtastic region list](https://meshtastic.org/docs/configuration/radio/lora/#region) — this list is maintained upstream and is the authoritative source, not this page.

Do not guess a region or copy one from another country's community. An incorrect region setting can transmit outside legal limits and won't reliably talk to correctly-configured local nodes.

Region isn't the only thing that sets your frequency. The **primary channel's name** hashes to a frequency slot, so renaming it, reordering channels, or importing a channel QR can silently move a node off the regional frequency — see [The Channel You Moved Wasn't a Channel — It Was Your Frequency](/blog/channel-order-frequency-slot-en/) for how that happens and when to pin `lora.channel_num` on purpose.

## Node Roles

Choosing the right role matters more for the health of the shared mesh than almost any other setting.

<div class="table-wrap table-wrap--fit">

| Role | Use case | Notes |
|---|---|---|
| **Client Mute** | Mobile nodes — backpacks, vehicles, personal handhelds | Participates in messaging but doesn't relay other nodes' traffic. The right default for anything that moves. |
| **Client** | Indoor or portable — your everyday node at home or in the office | Sends messages and helps relay mesh traffic. |
| **Client Base** | Recommended for outdoors — rooftop or mast nodes | Prioritizes relaying to/from your favorite nodes (mark your indoor ones as favorites) and helps the mesh like a Client with the rest of the traffic. |
| **Router / Router Late** | Carefully chosen, permanent, elevated locations only | Prioritizes relaying over its own messaging and alters mesh timing behavior. Only meaningful where the node genuinely bridges coverage others can't. |

</div>

**Android:** Radio configuration → Device → Device Role. **iPhone:** Device Configuration → Device → Device Role.

<div class="callout callout--warning">
<span class="callout-label">Router is not "more powerful client"</span>
A Router or Router Late role changes how a node participates in mesh timing and flood routing. Setting it on a node without real elevation or coverage advantage adds airtime congestion without adding useful coverage — it can make the local mesh <em>worse</em> for everyone. If you're not sure your node qualifies, run it as Client.
</div>

<span class="badge badge--proposed">Proposed</span> — mobile/handheld nodes default to Client Mute; home nodes default to Client; a rooftop node relaying mainly for your own gear should run Client Base with your indoor nodes favorited, not Router Late; Router/Router Late reserved for rooftop or ridge sites confirmed to extend coverage, agreed on with other local operators first.

For the full reasoning behind Client Base vs. Router Late — including why a rooftop set to Router Late usually adds congestion instead of coverage — see [Puerto Rico's Mesh Has No Backbone](/blog/client-base-rooftop-nodes/).

If a site genuinely does qualify as infrastructure, the next question is which of the three infrastructure roles it should run — `ROUTER` preempts its neighbors, `ROUTER_LATE` never does, and `REPEATER` is invisible to the nodes list, the map, and traceroute. See [Router, Router Late, or Repeater](/blog/router-vs-router-late-vs-repeater-en/).

## Max Hops

A node can't transmit and receive at the same time — every hop a message takes is airtime every other node has to wait through. The hop limit caps how many times a message can be relayed before the mesh gives up on it (see [Hops](/how-it-works/#hops)). Higher isn't safer; it just means a lost or looping packet burns more shared airtime before it's dropped.

<div class="table-wrap table-wrap--fit">

| Node type | Hop limit | Why |
|---|---|---|
| Default | 3 | Covers most real routes without over-spending airtime. |
| Well-connected exterior node | 4 | Only if it's genuinely reaching farther nodes at 3 and needs the extra reach. |
| Edge of the mesh / Client Mute | 5 | Isolated nodes with no closer relay sometimes need it — treat as the ceiling, not the default. |

</div>

**Android:** Radio configuration → LoRa → Hop limit. **iPhone:** Radio Configuration → LoRa → Hop limit.

<span class="badge badge--proposed">Proposed</span> — never go higher than 5. A node set to 6+ "just in case" doesn't get better reach, it just makes every failed delivery more expensive for the whole mesh.

## Favoriting Nodes

Favorites aren't just a shortcut in the app's node list — on the roles above, they change how two separate mechanisms behave. Both key off the same favorites list, but on different fields, so it's worth being deliberate about who you favorite and why.

- **Client Base's priority relaying** looks at who a packet is *from or to*. On a rooftop Client Base node, favorite your own indoor gear — handhelds, base radio — so their traffic gets first priority through the one radio that actually has a clear view of the sky.
- **Zero-Cost Hops** (firmware 2.7.11+) looks at *which node relayed the packet just before you*. It preserves the hop counter when that previous relay is a favorited Router or Router Late. Favorite the legitimate infrastructure Router/Router Late sites near you so their traffic doesn't spend one of its hops just crossing your roof on the way in.

Favoriting a Router does **not** turn a Client Base node into something that repeats all of its traffic — that's the first mechanism's job, and it only applies to your own favorited gear. The two lists overlap in the UI but not in effect.

**In the app:** long-press a node in the node list → **Favorite**.

<span class="badge badge--proposed">Proposed</span> — on a Client Base rooftop node: favorite every node you own that lives indoors, plus any legitimate local Router/Router Late sites, then run a traceroute before and after to confirm it actually changed the path.

## Broadcast Intervals

How often a node announces its position and telemetry directly trades off **freshness** against **airtime** — every broadcast is airtime every other node has to wait through. The baseline below uses smart-position broadcasting for mobile nodes (send on movement, not just on a timer) and long, lean intervals for anything stationary.

For why a fixed rooftop node on default timers quietly degrades everyone's range, and how to walk each interval out to the baseline, see [Your Stationary Node Is Talking Too Much](/blog/broadcast-intervals-airtime-en/).

<div class="table-wrap table-wrap--fit">

| Setting | Mobile nodes | Stationary nodes | Notes |
|---|---|---|---|
| Node info broadcast | 3 hours | 6 hours | Node info rarely changes — no need to broadcast it often. |
| Smart position broadcast | On — min. 100 m moved, min. 60 sec between | Off | Sends position updates automatically when moving; a stationary node isn't moving, so smart positioning isn't needed. |
| Position broadcast | 1 hour | 12 hours | Fallback interval when GPS is enabled. A stationary node's position is fixed, so a longer interval is fine. |
| GPS update interval | 5 min | 6 hours | How often the device checks its own GPS fix. Minimal checks are fine when the node doesn't move. |
| Device telemetry | 1 hour | 6 hours | Battery and voltage. Matters more on mobile, where battery is actually draining. |
| Environment telemetry | 1 hour | 6 hours | Sensor data, if attached (temp, humidity, etc). Same logic as device telemetry. |
| Power telemetry | N/A | 1 hour | Solar/charge-controller stats. The exception to "fixed = longer" — a solar node's charge health is worth checking often. |
| Map report | 1 hour | 6 hours | Sends position to the map server; less frequent for a stationary node since its position doesn't change. |

</div>

**Android:** node info broadcast is under Radio configuration → Device; position and GPS intervals under Radio configuration → Position; telemetry under Module configuration → Telemetry; map report under Module configuration → MQTT.

**iPhone:** node info broadcast is under Device Configuration → Device; position and GPS intervals under Device Configuration → Position; telemetry under Module Configuration → Telemetry; map report under Module Configuration → MQTT.

<span class="badge badge--proposed">Proposed</span> — a field-tested starting baseline, not yet re-tuned for Puerto Rico's terrain or mesh density. Coordinate with nearby operators before broadcasting more frequently than this on a shared channel.

<details>
<summary>Position Flags — mobile vs. fixed nodes</summary>

Position Flags control which fields ride inside every Position packet. Fewer flags means a smaller packet and less airtime — worth trimming on a fixed node that doesn't need to report speed or heading.

<div class="table-wrap table-wrap--fit">

| Flag | Mobile nodes | Fixed nodes | Notes |
|---|---|---|---|
| Altitude | On | On | Useful for coverage/elevation context either way. |
| Altitude MSL | On | On | Mean-sea-level reference, pairs with Altitude. |
| Speed | On | Off | Meaningless on a node that never moves. |
| Heading | On | Off | Same — skip it, save the bytes. |
| Sats in View | On | Off | Handy for diagnosing GPS fix quality while moving; a fixed node's fix doesn't change. |
| Geoidal Separation | Off | On | Improves elevation accuracy on a node whose altitude matters for planning. |

</div>

**In the app:** Position Flags and Fixed Position are under Radio configuration → Position on Android, and Device Configuration → Position on iPhone. On a fixed node, also turn on **Fixed Position**.

</details>

## Neighbor Info

Neighbor Info lets a node report which other nodes it can directly hear, along with signal quality — this is what turns the mesh from a black box into something you can actually visualize and debug. Enabling it on stationary and rooftop nodes helps build a real picture of Puerto Rico coverage over time (see [Puerto Rico Mesh](/pr-mesh/)).

Requires Meshtastic app/firmware 2.2.0 or newer. Enable both the module and "Transmit Over LoRa".

<div class="table-wrap table-wrap--fit">

| Node type | Update interval |
|---|---|
| Mobile / handheld | 4 hours |
| Stationary / rooftop | 11 hours |

</div>

**Android:** Module configuration → Neighbor Info. **iPhone:** Module Configuration → Neighbor Info. Turn on the module and Transmit Over LoRa, then set the update interval.

Impact on channel congestion is minimal at these intervals — enable it, but don't set it aggressively low on relay-heavy nodes. <span class="badge badge--proposed">Proposed</span>

## MQTT

MQTT is a way to bridge mesh traffic to the internet — a node with an internet connection can publish what it hears to an MQTT server, which lets tools like coverage dashboards and node maps show mesh activity without every viewer needing their own radio.

**This is separate from the radio mesh itself.** Two Meshtastic nodes with no internet access at all can still talk to each other over LoRa — that's the whole point of the network, and it keeps working through internet and cell outages regardless of MQTT. MQTT only affects whether that activity is *also* visible online. It carries diagnostic metadata — position, battery, signal metrics, channel utilization — not the content of encrypted channels or private messages.

If you do bridge a node to MQTT, settings matter beyond the broker credentials themselves.

For a step-by-step walkthrough of the whole chain — root topic, OK to MQTT, uplink-only, and the position settings that decide whether you show up at all — see [Getting Your Node Onto the Puerto Rico Mesh Map](/blog/mqtt-bridge-pr-map-en/).

### Bridge setup

- **OK to MQTT** — in LoRa settings (Radio configuration → LoRa on Android, Radio Configuration → LoRa on iPhone), turn on **OK to MQTT**.
- **Uplink on, downlink off** — open each channel under Radio configuration → Channels (iPhone: Radio Configuration → Channels) and set **Uplink** on, **Downlink** off.
- **Root topic** — Puerto Rico traffic on the public MQTT server publishes under **`msh/US/PR`**, following the standard `msh/<country>/<region>` structure. Confirm this matches your node's configured root topic before bridging, so your traffic lands where PR coverage tools expect it. Set it under Module configuration → MQTT (iPhone: Module Configuration → MQTT). <span class="badge badge--verified">Verified</span>

<div class="callout callout--warning">
<span class="callout-label">Keep downlink off</span>
Downlink pipes internet-side MQTT traffic back onto the radio mesh. Left on, it can flood the mesh with traffic that never needed to hit LoRa at all. Uplink-only is the safe default for a bridge node.
</div>

<div class="callout callout--warning">
<span class="callout-label">No credentials published here</span>
This site does not publish MQTT server addresses, usernames, passwords, or private channel keys. If you want your node bridged to a community monitoring server, coordinate directly with the operator of that server — see <a href="/links/">Links &amp; Resources</a> and <a href="/community/">Community</a>.
</div>

If you run your own MQTT bridge, treat the credentials the same as any other server login: don't reuse them, and don't commit them to a public repo or config export.
