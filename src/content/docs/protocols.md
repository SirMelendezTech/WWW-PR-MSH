---
title: Meshtastic vs MeshCore
description: How the two LoRa mesh protocols differ — who relays, routing, range, encryption, apps, and licensing — and why PRMSH runs Meshtastic.
order: 6
section: Documentation
---

<div class="callout">
<span class="callout-label">Checked October 2026</span>
Compared against Meshtastic 2.7.26 (stable), Meshtastic 2.8.1 (alpha), and MeshCore 1.18.0. Both projects move fast — their official documentation wins over this page. Comparison adapted from <a href="https://nodakmesh.org/protocols" target="_blank" rel="noopener">NoDak Mesh</a>.
</div>

Meshtastic and MeshCore both send text messages over LoRa radios with no cell service and no internet. The difference that drives everything else is **who relays**: in Meshtastic, every node can relay by default; in MeshCore, only dedicated **repeaters** relay, and personal radios only send and receive.

**PRMSH runs Meshtastic.** Everything else on this site — settings, roles, the map — is written for Meshtastic. Its sister network, [MeshCore Puerto Rico](https://meshcore.prmsh.com/), runs MeshCore across the island.

## The short answer

<div class="table-wrap table-wrap--fit">

| Pick Meshtastic if… | Pick MeshCore if… |
|---|---|
| You want radios to talk right away, with no setup | You're building town or regional coverage with repeaters on high points |
| You're hiking, at an event, or off-grid with no fixed infrastructure | Many users share the mesh and airtime is the bottleneck |
| You want fully open-source firmware **and** apps | You want direct messages to follow a fixed, learned path |
| Your local mesh runs Meshtastic — **in Puerto Rico, it does** | Your local mesh runs MeshCore |

</div>

<div class="callout callout--warning">
<span class="callout-label">They can't hear each other</span>
The two protocols use different packet formats, encryption, LoRa sync words, and usually different frequencies. A MeshCore radio is invisible to the Puerto Rico Meshtastic mesh, and the reverse. Most boards run either firmware, so you can reflash — but identity, contacts, and settings don't carry over.
</div>

## Side by side

<div class="table-wrap table-wrap--fit">

| | Meshtastic | MeshCore |
|---|---|---|
| **Who relays** | Every node by default (`CLIENT`), plus routers | Repeaters only — companion radios don't relay |
| **How messages travel** | Managed flooding; DMs switch to next-hop routing once a route is known (since 2.6) | Channels flood through repeaters; DMs flood once, then follow a learned path |
| **Hop limit** | 1–7, default 3 | Up to 63 (1-byte paths), or 32 / 21 with larger path IDs |
| **Message length** | 200 bytes in the apps | 160 bytes (150 in DMs, less in channels) |
| **Encryption** | AES channels, public-key DMs (2.5), signed broadcasts (2.8) | Ed25519 identities, signed adverts, AES-128 DMs and channels |
| **Phone app** | Free and open source | Free; not open source; an in-app purchase removes a wait timer on remote repeater management |
| **Firmware license** | GPL-3.0 | MIT |
| **Default US preset** | LongFast — 906.875 MHz, 250 kHz, SF11 | Recommended — 910.525 MHz, 62.5 kHz, SF7 |
| **Infrastructure needed** | None — two handhelds already form a mesh | At least one repeater to go beyond direct range |
| **Started** | 2020 | 2025 |

</div>

## How each one moves a message

### Meshtastic: managed flooding

- A node that hears a packet waits briefly and listens before rebroadcasting. Nodes with weaker signal — usually farther away — get to relay first, which pushes the message outward.
- The **hop limit** (default 3, max 7) stops a message from spreading forever.
- Since 2.6, direct messages learn a **next-hop** route after a reply, and fall back to flooding if that neighbor goes quiet.
- Roles set relay behavior: `CLIENT` relays when needed, `CLIENT_MUTE` never relays, `ROUTER` and `ROUTER_LATE` always rebroadcast. See [Recommended Settings](/settings/#node-roles) for which role fits Puerto Rico nodes.
- In 2.8, background broadcasts lower their own hop limit once channel utilization reaches about 20%. Chat keeps the full limit.

### MeshCore: repeaters and learned paths

- Three roles: **companion** (personal radio, doesn't relay), **repeater** (relays for everyone), and **room server** (a login-based message board).
- The first DM to a contact floods. The recipient's delivery report carries the path back, and the sender stores it and embeds it in later messages.
- Repeaters keep no routing tables — the path lives with the sender.
- Channel messages always flood. Repeater owners can cap how far floods travel.
- Since 1.14, 2- or 3-byte path IDs avoid ID collisions, but repeaters older than 1.14 drop those packets.

## Which has more range?

Neither, by protocol alone. Range per hop comes from radio settings, transmit power, antenna, height, and terrain.

- On paper, Meshtastic's LongFast (SF11) has roughly **4 dB more link budget** per hop than MeshCore's SF7 preset.
- MeshCore's narrower preset uses less airtime per message and sits in a smaller slice of noisy spectrum.
- Some MeshCore regions run SF8 or SF9, which narrows the gap.

The number and placement of relays matter more than the preset — which in Puerto Rico's terrain means elevation. See [Why Elevation Beats Wattage](/blog/why-elevation-beats-wattage/).

## Encryption and privacy

- **Meshtastic:** channels share an AES key, and the default channel's key is public. DMs use public-key encryption since 2.5. Version 2.8 signs broadcasts, but still accepts unsigned packets from older firmware by default.
- **MeshCore:** each node has its own Ed25519 key and signs its adverts. DMs use an AES-128 key derived from a shared secret. Channel keys are shared, and the Public channel's key is published.

In both systems, **anyone on the mesh can read the default public channel**. Use a private channel or a direct message for anything sensitive.

## Apps and hardware

- **Same boards:** Heltec V3 and V4, RAK WisBlock, LilyGo T-Beam, T-Echo, T-Deck, and Seeed T1000-E run either firmware. See [Recommended Hardware](/hardware/).
- **Meshtastic apps:** free and open source for Android, iPhone, and web. They connect over Bluetooth, Wi-Fi, or USB.
- **MeshCore app:** the official app is free on Android, iPhone, desktop, and web, but closed source. The firmware is open, and community clients exist. Standalone devices like the T-Deck run MeshCore without a phone.

## What's new in 2026

### Meshtastic 2.8 (alpha)

<div class="callout callout--warning">
<span class="callout-label">LongTurbo can't hear LongFast</span>
New US nodes set up on-device or with the current Android app start on the <strong>LongTurbo</strong> preset. A LongTurbo node can't hear the Puerto Rico mesh, which runs LongFast. If a new radio sees no one, check the preset first.
</div>

- Signed broadcasts.
- Node IDs derive from the public key, so updated nodes get new IDs.
- Position sharing on public channels and all telemetry broadcasts become opt-in.
- Automatic hop scaling and rate limits on busy meshes.
- 2.7.26 stays the stable release — run stable on any node others depend on.

### MeshCore 1.18

- A command line for companions, including commands from allowed contacts.
- Bluetooth and Wi-Fi together in one companion build on several ESP32 boards.
- A gentler default for repeater loop detection.
- Builds on 1.14's larger path IDs and 1.15's over-the-air updates for nRF52 companions.

## Frequently asked questions

**Can Meshtastic and MeshCore talk to each other?**
No. Packet format, encryption, sync word, and presets all differ.

**Can one radio switch between them?**
Yes, by reflashing. Set region and preset again afterward — nothing carries over.

**Which is better?**
It depends on the network. MeshCore suits planned, repeater-based networks, especially dense cities where airtime runs short. Meshtastic suits groups with no fixed infrastructure. In practice, run whatever your local mesh runs.

**Should I use MeshCore in Puerto Rico?**
To reach the PRMSH mesh, no — it runs Meshtastic, and a MeshCore radio won't see it. Start with [Getting Started](/getting-started/). If MeshCore fits you better, join the sister network, [MeshCore Puerto Rico](https://meshcore.prmsh.com/).

**Is MeshCore free?**
Yes. The firmware is MIT-licensed and the app is free, with an optional purchase for phone-based repeater management without the wait timer.
