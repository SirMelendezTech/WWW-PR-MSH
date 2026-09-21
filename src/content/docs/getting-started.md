---
title: Getting Started with Meshtastic
description: Everything you need to unbox a radio, join the Puerto Rico mesh, and send your first message.
order: 1
section: Documentation
---

## What is Meshtastic?

Meshtastic is open-source firmware that runs on small, inexpensive LoRa radios. Two or more devices running it can send text messages, share GPS position, and relay traffic for each other — no cell tower, no Wi-Fi, no monthly bill. Each radio is a **node**. When a message can't reach its destination directly, nearby nodes automatically **relay** it, hop by hop, until it arrives. That relaying is what makes it a *mesh*.

In Puerto Rico, where hurricanes and grid failures have repeatedly knocked out cellular service for days or weeks at a time, that off-grid property is the whole point. A pocket radio that keeps talking to your family, your hiking group, or your barrio after the towers go dark is worth understanding before you need it.

## What hardware do I need?

At minimum: **one Meshtastic-compatible LoRa radio** and **a phone or computer** to configure it and read messages. Two people talking to each other need two radios — Meshtastic is a network, not a walkie-talkie app that works alone.

If you haven't bought hardware yet, read [Recommended Hardware](/hardware/) first — it breaks devices down by how you'll actually use them (backpack, home base, rooftop, solar) instead of listing specs.

## Installing the Meshtastic app

1. Install the official Meshtastic app for [Android](https://play.google.com/store/apps/details?id=com.geeksville.mesh), [iOS](https://apps.apple.com/us/app/meshtastic/id1586432531), or use the [web/desktop client](https://client.meshtastic.org) over USB.
2. Update your radio to the **current stable firmware** before configuring anything. Follow the [official flashing instructions](https://meshtastic.org/docs/getting-started/flashing-firmware/) — firmware changes often enough that we intentionally don't mirror version-specific steps here.
3. Pair the app with your radio over Bluetooth, or connect via USB cable.

<div class="callout callout--warning">
<span class="callout-label">Before you transmit</span>
Radio regulations vary and change. Confirm the current rules that apply to unlicensed LoRa/ISM-band devices in Puerto Rico and the region setting that matches them before keying up. This site does not substitute for official regulatory guidance.
</div>

## Connecting your radio

Open the app and tap **Connect a device** (or the **+** button), then choose **Bluetooth**. Select your radio from the list of nearby devices and confirm the pairing code shown on both your phone and the radio. Once paired, the app reads your radio's current configuration automatically — no typing required.

<div class="callout">
<span class="callout-label">Prefer the command line?</span>
Most devices also connect over <strong>USB serial</strong> to the desktop/web client. If Bluetooth pairing fails, try a direct USB connection first — it rules out phone-side Bluetooth stack issues and gives you console output if something's wrong: run <code>meshtastic --port /dev/ttyUSB0 --info</code> to confirm the connection. Use the <a href="https://meshtastic.org/docs/software/python/cli/">Meshtastic CLI</a> for anything beyond basic setup — it's scriptable and shows you exactly what a device is configured to do.
</div>

## Configuring your region

Every radio must be set to the correct **LoRa region**, which determines the legal frequency band and duty cycle it operates under. This is not optional and not a matter of preference — it must match where the radio physically operates. In the app, open **Radio Configuration → LoRa** and choose your region from the list.

See [Recommended Settings → Region and Frequency](/settings/#region-and-frequency) for what applies in Puerto Rico specifically.

<div class="callout">
<span class="callout-label">Prefer the command line?</span>
Set the region from the CLI with <code>meshtastic --set lora.region US</code>.
</div>

## Choosing a node role

New radios default to a general-purpose **Client** role, which is the right choice for almost everyone starting out. Roles like **Client Mute** and **Router** exist for specific placements and can hurt the network if misapplied — read [Recommended Settings → Node Roles](/settings/#node-roles) before changing this.

## Joining the Puerto Rico mesh

Meshtastic nodes talk on **channels** — shared encryption keys and names that determine who can read your traffic. Out of the box, every device ships with a `LongFast` primary channel using default keys, which lets you talk to *any* nearby Meshtastic node worldwide using default settings. That's a fine starting point for testing range with a friend.

To find and coordinate with other Puerto Rico operators, see [Puerto Rico Mesh](/pr-mesh/) and the [Community](/community/) page — node operators regularly share coverage info and, where they choose to, additional channel details there.

## Sending your first message

Open the app, select a channel, and send a message on the default `LongFast` channel to confirm your radio transmits and receives. Try it with two devices a room apart before you try it across a mountain.

## Understanding channels

A channel bundles a **name**, a **pre-shared key**, and modem settings. Anyone with the same channel configuration can decrypt and read traffic on it. Public default channels are exactly that — public. Treat anything sensitive as unencrypted-by-default unless you've configured and distributed your own private channel key.

## Understanding nodes and hops

Every message carries a **hop limit** — the maximum number of times other nodes will relay it before giving up. Each relay is a **hop**. A message from your handheld to a friend three ridgelines away might take three or four hops through other people's nodes to arrive. This is why coverage depends on *participation*: the more well-placed nodes on the mesh, the farther messages travel. See [How Meshtastic Works](/how-it-works/) for the mechanics, and [Puerto Rico Mesh](/pr-mesh/) for where coverage currently stands.
