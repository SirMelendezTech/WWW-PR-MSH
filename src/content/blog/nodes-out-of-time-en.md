---
translationKey: nodes-out-of-time
title: "Nodes Out of Time: The Free Diagnostic That Almost Nobody Is Reading"
description: What a wrong clock on the Puerto Rico mesh monitor actually tells you about reception — and the four unrelated causes that produce the exact same symptom.
pubDate: 2026-08-03
author: WP4TZV
category: Field Reports
tags: [monitor, diagnostics, gps, antennas]
readingTime: 10 min
---

# Nodes Out of Time: The Free Diagnostic That Almost Nobody Is Reading

Looking at the [Puerto Rico mesh monitor](https://monitor.prmsh.com/source/d9d92629-16d4-4de9-839d-30f62216e354/security), there is a recurring pattern: a lot of nodes have the wrong time. Not off by a few seconds—wrong by a lot, with timestamps that make no sense.

My first reaction was: those nodes are deaf. If Meshtastic distributes time through the mesh, a node with the wrong time is a node that isn't hearing anyone. And from there came the obvious conclusion: the likely cause is the antenna, because the official antenna-testing repository lists several factory antennas as not recommended.

That chain of reasoning is *partially* correct, and the incorrect part is the interesting one. The clock really can be a reception diagnostic—but only after ruling out four things that produce exactly the same symptom without anything being wrong with the radio.

## How Meshtastic Gets the Time

This is surprisingly poorly documented. It doesn't appear in the official user documentation; you have to go to the code or repository discussions.

There is a hierarchy of time sources, with priority. According to one of the project's maintainers:

* **GPS** — considered the equivalent of Stratum 1. The most reliable source.
* **NTP** — through Wi-Fi/Ethernet. Less reliable than GPS.
* **Mesh time** — less reliable than NTP.
* **Nothing** — the device starts without a valid time.

The priority list lives in `src/gps/RTC.h` in the firmware, with additional settings for boards that include a dedicated RTC module.

Notice where mesh time falls: **last**. The maintainer describes it as a fallback source for an *unconfigured* device. It is not an NTP-like synchronization protocol running over LoRa. It is a fallback mechanism so that a node with nothing else can at least start with something reasonable.

And as for how often it is propagated, the maintainer's honest answer was that he believes it is carried in messages and NodeInfo, but that he would have to read the code—and that it would be good to document it. In other words, even the project itself doesn't have this written down anywhere.

It's worth saying this because it changes expectations. If your node has no GPS, no Wi-Fi with NTP, and isn't paired to a phone, the time it has came from listening to someone else.

Period.

## That's Why the Clock Is an RX Diagnostic

Here is the part of the reasoning that *does* hold up, and it is genuinely useful:

> For a node with no GPS, no NTP, and no phone, having the correct time is **proof that it heard someone** who had a better clock.

That turns a boring column in the monitor into a reception indicator that costs nothing to obtain. No traceroute, no need to ask anyone for anything, and no need to visit the site. The time is already there.

The problem is the converse.

"Correct time ⇒ heard someone" is valid.

"Wrong time ⇒ heard nobody" **does not** automatically follow, because there are other ways to produce the same symptom.

## Four Ways to Have the Wrong Time Without Being Deaf

### 1. The Neighborhood Doesn't Have the Correct Time Either

If a node only hears other nodes that also have no GPS, no NTP, and no phone, they will all have the wrong time. The node may have excellent reception and still have no reliable source from which to obtain the correct time.

This isn't a radio problem. It's a source problem—the same infrastructure problem I discussed in the previous post about the backbone.

A deaf node and a node that is well connected to a neighborhood without a clock can look identical in the monitor.

### 2. A Firmware Bug, Currently Open

This is the one that made me rewrite the post.

There is a bug reported in March 2026 against firmware 2.7.20: on platforms **without a hardware RTC**, the node loses the time it received from the network immediately after receiving it.

The root cause is a January 2026 PR that removed an `#if HAS_RTC` guard around a call to `readFromRTC()`.

On platforms without a physical RTC, that function falls into a branch that calls `gettimeofday()`. On the RP2040, this returns *uptime*—seconds since boot—instead of wall-clock time.

The sequence becomes:

1. The firmware correctly sets the network time—a value around ~1.77 billion.
2. Immediately afterward, it calls `readFromRTC()`.
3. That function reads the uptime—a value such as 21.
4. It then overwrites the time with 21.

From that point on, the node thinks it is in 1970.

The consequences reported by the bug author go far beyond an ugly clock: the `rx_time` of all received packets becomes based on uptime, the `last_heard` value of newly heard nodes does as well, and because nodes loaded from flash still have real timestamps, newly heard nodes appear to be the "oldest" and the NodeDB immediately removes them.

The report documents 222 evictions during a single session of roughly three hours.

Think about what that means for the monitor.

A node affected by this bug looks like the deafest node on the mesh—absurd time and constant neighbor rotation—when in reality its radio is perfectly fine and what is broken is a line of C code.

At the time of writing, the issue remains open, labeled `bug`, `help wanted`, and `triaged`. **Check its current status before repeating this claim**, because it may have been fixed.

### 3. It Booted Five Minutes Ago

A freshly flashed node, or one that has just rebooted after a power outage, does not have a valid time until it hears someone.

If the monitor catches it during that window, it appears "out of time" even though nothing is broken.

On an island where power outages are not unusual, this is not a rare scenario.

### 4. What the Monitor Measures Isn't What You Think

This was the one that took me the longest to accept.

An important point, and I include myself here: the [**Security** page](https://monitor.prmsh.com/source/d9d92629-16d4-4de9-839d-30f62216e354/security) I was looking at is not a clock page.

In MeshMonitor, that view is designed to detect nodes with weak encryption keys (low entropy) and duplicate keys shared between multiple nodes.

If you are seeing strange timestamps there, you are most likely reading a **`last_heard`** column, which is a different thing from "the time the node thinks it is."

The difference matters:

* **The node's own time** tells you where it got its clock from.
* **`last_heard`** tells you when *your* receiving node last heard it—and that value is generated by the monitor node, not the remote node.

These are two different measurements with different failure modes.

Before publishing any conclusion, you have to know which one you're looking at.

Two additional confounding factors of the same kind:

* **MQTT.** If the monitor ingests nodes from an MQTT broker in addition to radio, nodes entering through that path have completely different timestamp semantics. They are not RF observations.
* **A single point of view.** The monitor listens from only one node. A node that looks deaf from that location may be perfectly healthy in its own neighborhood, communicating with nodes the monitor cannot reach.

## So When *Does* It Point to an RX Problem?

When there is **asymmetry**.

And this is a real case, not a theoretical one.

If the monitor is hearing the node—that is, the node appears in the list and its packets are arriving—but the node cannot obtain the correct time, you have evidence that its TX is working while its RX is not.

That asymmetric link is the signature of a reception problem, and it is exactly the scenario worth investigating.

Why can this happen?

An antenna is reciprocal: it is equally good at transmitting and receiving. But the *link budget* is not necessarily symmetrical if the two ends transmit at different power levels.

A node running 30 dBm with a mediocre antenna can be heard without difficulty, while neighboring nodes transmitting at 22 dBm cannot reach it.

You increase the power and mask the symptom in one direction while the underlying problem remains in the other.

This is, by the way, another argument against increasing power as the first response.

A bad antenna combined with 30 dBm gives you a **noisy and deaf node—the worst possible neighbor on a shared mesh.**

## The Antenna: What the Reports Say—and What They Don't

The `meshtastic/antenna-reports` repository collects measurements performed by the community using vector network analyzers.

What it says about factory antennas is significant: the stock antennas for the LoRa32, T-Beam, and T-Echo are all listed as **not recommended**. The Ziisor TX915-JZ-5, one of the inexpensive generic antennas, is also listed.

And there is a warning that goes beyond performance: the Seeed 318020612 antenna, advertised as covering 860–930 MHz, measured a VSWR above 8:1 near 860 MHz—a level that the repository warns **can damage the hardware**.

Now, what those reports **do not** say—and this needs to be clear before using them as evidence:

* **They are VSWR measurements, not gain or radiation-pattern measurements.** The repository itself warns that manufacturers often exaggerate gain, and that the listed figures are manufacturer specifications, not measured values. Poor VSWR tells you there is an impedance mismatch. It does not tell you where the antenna radiates or how efficient it is.
* **A bad antenna degrades TX and RX equally.** By reciprocity. So a node with a truly bad antenna tends to *disappear* from the monitor, rather than appear with the wrong time. The "heard but deaf" case requires the power asymmetry mentioned above, or something worse.
* **"Something worse" includes things the antenna itself doesn't explain:** SMA vs. RP-SMA connector mismatch, a cheap lossy pigtail, water inside the connector—which is certainly not exotic here—or an LNA being saturated by a nearby transmitter.

In other words: the antenna is a reasonable hypothesis, not a conclusion.

And it is the most expensive hypothesis to test because it requires climbing up to the site.

## How to Actually Verify It

Before telling anyone to change their antenna, go from cheapest to most expensive:

1. **Determine what your monitor is measuring.** The node's own time or `last_heard`. Without this, you don't have enough information.
2. **Filter out nodes entering through MQTT.** They are not RF observations.
3. **Record the firmware version and hardware.** If it is a platform without a hardware RTC and is running firmware affected by the bug, you already have an explanation and don't need to go further.
4. **Check whether the node has complete NODEINFO.** MeshMonitor marks nodes as "incomplete" when they are missing a name or hardware information, which on encrypted channels indicates that their NODEINFO packet never arrived. A node with the wrong time **and** incomplete NODEINFO is a much stronger candidate for an RX problem.
5. **Compare SNR in both directions.** A traceroute gives you the SNR for each hop in each direction. Significant asymmetry = a problem on one side of the link.
6. **Only then talk about antennas.** And when you do, ask about the connector and cable first, not the antenna.

There is also a shortcut that solves the problem instead of diagnosing it: MeshMonitor can automatically synchronize the time on nodes with remote administration enabled, sending them a *Set Time* command using the server's time.

It is useful for keeping the mesh consistent—but be careful: if you enable it, **you lose the diagnostic**.

You can no longer use the clock as a reception indicator because you are supplying the time yourself.

## What I Take Away

The clock is a good RX indicator, but it is an indicator with four known false positives, one of which is an open firmware bug that produces exactly the symptom we are looking for.

Publishing "these nodes are deaf, change your antennas" based on that column would, at best, be guessing.

And in a small community like ours, sending half a dozen operators onto their roofs to replace an antenna that wasn't the problem is a quick way to make them stop listening to you.

What *is* worth publishing is the checklist.

If someone in the community wants to run it against their own node and share the results—firmware version, hardware, SNR in both directions—then we start getting **data instead of correlation**.

---

## Sources

* [Puerto Rico Mesh Monitor](https://monitor.prmsh.com/source/d9d92629-16d4-4de9-839d-30f62216e354/security) — the MeshMonitor instance from which the observations in this post come
* [Proposal: Accurate-ish time/date/clock/NTP sync across mesh](https://github.com/meshtastic/firmware/discussions/7273) — Discussion #7273, maintainer response regarding the time-source hierarchy
* [`src/gps/RTC.h`](https://github.com/meshtastic/firmware/blob/master/src/gps/RTC.h) — priority list in the code
* [Bug: RTC time overwritten with uptime on platforms without hardware RTC](https://github.com/meshtastic/firmware/issues/9828) — Issue #9828
* [meshtastic/antenna-reports](https://github.com/meshtastic/antenna-reports) — community VSWR reports
* [MeshMonitor — Automation](https://meshmonitor.org/features/automation.html) and [Settings](https://meshmonitor.org/features/settings.html)

*73 de WP4TZV*
