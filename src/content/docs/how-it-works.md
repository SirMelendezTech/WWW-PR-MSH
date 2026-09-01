---
title: How Meshtastic Works
description: LoRa, mesh routing, hops, signal strength, GPS, channels, encryption, MQTT, and store-and-forward, explained simply.
order: 4
section: Documentation
---

## The path a message takes

<div class="hop-diagram" role="img" aria-label="Diagram: phone connects over Bluetooth to a Meshtastic radio, which sends over LoRa to a nearby node, which relays through another node, arriving at the destination node">
  <div class="hop-step" style="--i:0"><span class="hop-icon">📱</span><span>Your phone</span></div>
  <div class="hop-arrow" style="--i:0">Bluetooth</div>
  <div class="hop-step" style="--i:1"><span class="hop-icon">📻</span><span>Your radio</span></div>
  <div class="hop-arrow" style="--i:1">LoRa</div>
  <div class="hop-step" style="--i:2"><span class="hop-icon">🟢</span><span>Nearby node</span></div>
  <div class="hop-arrow" style="--i:2">LoRa relay</div>
  <div class="hop-step" style="--i:3"><span class="hop-icon">🟢</span><span>Relay node</span></div>
  <div class="hop-arrow" style="--i:3">LoRa relay</div>
  <div class="hop-step" style="--i:4"><span class="hop-icon">🔵</span><span>Destination node</span></div>
</div>

Your phone doesn't transmit over LoRa at all — it talks to your radio over Bluetooth (or USB), and the radio does the actual long-range transmission. From there, the message moves node to node until it reaches its destination or runs out of hops.

## LoRa

**LoRa** (Long Range) is a radio modulation technique that trades bandwidth for range and resistance to interference. It's why a $30 radio can reliably send a short text message several kilometers with clear line of sight, on milliwatts of power — something a Wi-Fi or Bluetooth radio can't do. The trade-off is throughput: LoRa is built for small, infrequent messages, not for streaming data.

## Mesh networking

A **mesh** network has no central tower or base station. Every node is a peer, and every node can potentially relay traffic for every other node. This is precisely what makes it resilient during disasters: there's no single point of failure to knock out, unlike a cell tower.

## Nodes

A **node** is any device running Meshtastic firmware — a handheld in your pocket, a home unit by the window, a solar repeater on a hill. Every node has a unique ID, and every node that hears a broadcast learns about the node that sent it, building up a picture of the local mesh over time.

## Hops

When your node can't reach the destination directly, another node **relays** the message on its behalf — that's one **hop**. Every message carries a hop limit that caps how many times it can be relayed before the network gives up on it, which keeps a single message from circulating the mesh forever.

Rebroadcasting isn't a free-for-all. Meshtastic uses **managed flooding**: before rebroadcasting, a node briefly listens to see whether another node has already relayed the same packet, and skips it if so. How long it waits before jumping in depends on signal quality — nodes hearing a *weaker* signal wait a shorter random window and tend to relay first, since they're more likely to be the ones extending the packet's reach. Nodes running the Router role get priority and will rebroadcast even if they hear someone else already did.

More hops mean more reach, but also more airtime consumed and more delay. This is the core reason node *placement* matters so much — a well-placed relay node can turn a 4-hop message into a 1-hop message for an entire neighborhood. It's also why very large meshes throttle themselves: past roughly 40 active nodes in range of each other, devices automatically stretch out their own broadcast intervals so the shared airtime doesn't collapse under everyone's routine traffic.

## Signal strength

Meshtastic reports **RSSI** (Received Signal Strength Indicator) for every node it hears — roughly, how loud the signal arrived. Lower (more negative) numbers mean a weaker signal. It's a useful first check when a link seems unreliable, but RSSI alone doesn't tell you *why* — that's what SNR is for.

## SNR

**SNR** (Signal-to-Noise Ratio) measures how much stronger the signal is than the background radio noise. A link can have decent RSSI but poor SNR if there's a lot of interference nearby — and a weak-but-clean RSSI can still decode fine if SNR is good. Look at both together when diagnosing a marginal link.

## GPS

Devices with GPS can broadcast their position, which is what makes coverage maps and Neighbor Info visualizations possible (see [Puerto Rico Mesh](/pr-mesh/)). Position broadcasting is configurable and optional — a node doesn't need GPS, or need to share its position, to send and receive messages.

## Channels

A **channel** is a named, pre-shared encryption key that determines who can read a given set of messages. There's a detail here that surprises people: the channel *name* isn't just a label — it's hashed to pick which LoRa frequency slot the radio actually transmits on within your region's band. Two nodes with the same channel name and key aren't just able to read each other's messages, they're on the same frequency in the first place.

Every device ships with a default public channel so strangers can test connectivity with each other; anything you actually want private needs its own channel with a key you generate and share only with people you trust. See [Understanding channels](/getting-started/#understanding-channels) for the practical setup.

## Encryption

Meshtastic channels are encrypted with AES — 128-bit for a standard key, 256-bit if you generate a longer one — so nodes without the matching channel key can't read message content. But they can still see that *a* message passed through, since routing metadata isn't hidden the same way. Encryption protects content, not the fact that your node exists on the mesh.

## MQTT

**MQTT** is an optional bridge from the radio mesh to the internet: a node with internet access can publish what it hears to an MQTT server, powering things like public coverage maps. It is entirely separate from the mesh itself — LoRa keeps working with zero internet involved.

Position data shared this way is typically rounded to a coarser precision than the node's actual GPS fix before it's published — the same precision setting that governs what shows up on the [Node Map](/map/). MQTT can also get overloaded: the public default server carries a lot of traffic on the shared default channel, and a node uplinking to it can end up struggling to keep up. See [Recommended Settings → MQTT](/settings/#mqtt) for how Puerto Rico operators use it, and what we deliberately don't publish here.

## Store and forward

**Store and forward** lets a capable node cache messages and replay them to devices that were briefly out of range or asleep when the message first went out — useful for nodes that sleep to save battery, or for catching a handheld up after it reconnects. It only works on boards with a chunk of extra onboard memory (PSRAM) to hold the message queue — the ESP32-based boards mentioned in [Recommended Hardware](/hardware/) qualify, most simpler nRF52840 handhelds don't. A board with default settings can typically hold on the order of several thousand recent messages before the oldest ones age out.

## MeshCore

**MeshCore** is a separate LoRa mesh firmware — a different project from Meshtastic, running on much of the same hardware, and the two networks cannot talk to each other. It turns up on this site only where a shared resource covers both, like the device and antenna tables at [RF Index](https://www.rfindex.com/): a board listed there for MeshCore will not join the Puerto Rico mesh until you flash Meshtastic onto it.

<style>
  .hop-diagram {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem;
    margin: 1.5rem 0 2rem;
    background: var(--bg-sunken);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
  }
  .hop-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--ink-soft);
    text-align: center;
    min-width: 84px;
  }
  .hop-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6rem;
    animation: hop-bump 4s ease-in-out infinite;
    animation-delay: calc(var(--i) * 0.8s);
  }
  .hop-icon::before {
    content: "";
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    background: var(--secondary);
    opacity: 0;
    animation: hop-ring 4s ease-in-out infinite;
    animation-delay: calc(var(--i) * 0.8s);
  }
  .hop-arrow {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary);
    padding: 0.2em 0.5em;
    white-space: nowrap;
    animation: hop-relay 4s ease-in-out infinite;
    animation-delay: calc((var(--i) + 0.5) * 0.8s);
  }

  @keyframes hop-bump {
    0%, 100% { transform: scale(1); }
    40% { transform: scale(1.22); }
  }
  @keyframes hop-ring {
    0%, 100% { transform: scale(1); opacity: 0.22; }
    40% { transform: scale(1.9); opacity: 0; }
  }
  @keyframes hop-relay {
    0%, 100% { color: var(--secondary); opacity: 0.7; }
    50% { color: var(--accent); opacity: 1; }
  }
</style>
