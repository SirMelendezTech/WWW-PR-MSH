---
translationKey: height-vs-power
title: "Height vs. Power: Why You Can't Buy More Range"
description: The physical-layer case against turning up TX power first — the FCC's 6 dBi antenna-gain rule, why doubling power rarely doubles range in cluttered terrain, and why Fresnel-zone clearance beats both.
pubDate: 2026-08-17
author: WP4TZV
category: Hardware
tags: [antennas, rf-physics, fcc-part-15, fresnel-zone, elevation]
readingTime: 9 min
---

# Height vs. Power: Why You Can't Buy More Range

In the post about the backbone, I argued that Puerto Rico's mesh network does not have a configuration problem, but a coordination problem. In the one about clocks, I briefly mentioned that a bad antenna with 30 dBm gives you "a noisy and deaf node—the worst possible neighbor."

This post is the other half of those two: the physical layer. Because the first reaction almost everyone has when a node doesn't reach is to increase its power, and that is almost always the wrong lever.

Not for philosophical reasons. For three concrete reasons: power is legally capped, it buys very little in terrain with obstacles, and it does not fix the side of the link that is usually broken. 

## First: The Legal Ceiling

This surprises many people, including operators with years of experience.

Meshtastic at 915 MHz operates under Part 15, Section 15.247. The power rule says that for systems using digital modulation in the 902–928 MHz band, the maximum conducted power is **1 watt — 30 dBm**.

But there is a second half that almost nobody reads: that limit is based on using antennas with directional gain not exceeding **6 dBi**. If you use an antenna with more than 6 dBi, the conducted power must be reduced below the limit **by the same number of dB that the antenna gain exceeds 6 dBi**.

In other words: the EIRP ceiling is 36 dBm, and it is fixed. Every dB of antenna gain above 6 dBi has to be subtracted from transmitter power.

Bought a 9 dBi collinear for the roof? Legally, you have to reduce TX to 27 dBm. A 12 dBi antenna? 24 dBm. The EIRP does not move.

### And no, the point-to-point exception does not apply here

This is where people coming from the Wi-Fi world get tripped up. There is an exception for fixed point-to-point links—but it only covers two bands: in 2400–2483.5 MHz, you can exceed 6 dBi by reducing power only 1 dB for every 3 dB of additional gain; and in 5725–5850 MHz, you can exceed 6 dBi **without any power reduction**.

Read the list again. **902–928 MHz is not there.** There is no point-to-point relief in the Meshtastic band. The dB-for-dB reduction always applies, regardless of whether your link is a fixed backbone between two towers.

So the practical result is simple: **at 915 MHz, you cannot buy more EIRP.** It is already exhausted by regulation. It is the only variable in this problem with a hard legal ceiling.

*(Note for licensed operators: 902–928 MHz is also an amateur band in Region 2, and under Part 97 the power limits are different. But Part 97 prohibits encoded messages intended to obscure their meaning—which means goodbye to channel encryption and DMs with PKC. You trade power for all of the security discussed in the previous post. For a community mesh, that is not a trade worth making.)*

## Second: Power Buys Less Than You Think

Suppose you ignore the above and increase power from 22 dBm to 30 dBm—8 dB, practically the entire available range.

How much range that gives you depends on the path-loss exponent, which is a technical way of saying "how much stuff is in the way":

| Environment                       | Exponent | Range from 8 dB |
| --------------------------------- | -------: | --------------: |
| Free space / over water           |    n = 2 |            2.5× |
| Suburban with partial obstruction |    n = 3 |           1.85× |
| Urban / dense vegetation          |    n = 4 |           1.58× |

And in the opposite direction, here is what it costs to **double** the range:

| Environment | Required dB | Required power |
| ----------- | ----------: | -------------: |
| n = 2       |        6 dB |             4× |
| n = 3       |        9 dB |             8× |
| n = 4       |       12 dB |            16× |

In a neighborhood with houses and vegetation—which means almost anywhere in the metro area—doubling range through power requires 16 times the power. You don't have 16 times. You have at most 6.3 times (8 dB), and only if you started at 22 dBm.

## Third: Height Doesn't Add dB—It Changes the Regime

Here is the conceptual difference that makes the comparison unfair.

Increasing power moves you **within** a path-loss curve. Raising the antenna can move you **to an entirely different curve**.

A node at 2 meters in a neighborhood is inside the clutter: fences, cars, neighbors' roofs, trees. It is operating around n = 4. The same node at 12 meters, above the roofline, may be operating closer to n = 2. That jump isn't worth 3 dB or 8 dB—it can be worth tens of dB of avoided loss, and no power adjustment can buy that.

The radio horizon gives us the easy part to calculate. Using the standard 4/3 Earth-radius approximation:

**d (km) ≈ 4.12 × √h (meters)**

| Height                          | Horizon |
| ------------------------------- | ------: |
| 2 m (handheld)                  |  5.8 km |
| 5 m (short mast)                |  9.2 km |
| 10 m (house roof)               | 13.0 km |
| 30 m (tower)                    | 22.6 km |
| 100 m (hilltop)                 | 41.2 km |
| 1000 m (Central Mountain Range) |  130 km |

For a link between two nodes, the two horizons are added. Two handhelds at 2 m: 11.6 km. One handheld at 2 m and one site at 100 m: **47 km**.

The height of the other end is half the problem, and it is the half the community can solve by putting a good site in place—it is literally the argument from the backbone post, viewed from the perspective of physics.

### The Honest Correction to My Own Statement

In an earlier post I wrote that "3 meters more height beats 3 dB more power." Writing it out numerically, that statement needs some qualification.

From 2 m to 5 m: the horizon goes from 5.8 to 9.2 km—1.59×. Three dB of power at n = 4 gives you 1.19×. Height clearly wins.

From 10 m to 13 m: the horizon goes from 13.0 to 14.9 km—1.14×. Three dB at n = 4 gives 1.19×. They are roughly equal, or power wins slightly.

So the statement is true **close to the ground**, where three additional meters can get you out of the clutter. Higher up, the horizon has diminishing returns and the limiting factor stops being the horizon.

It becomes this instead.

## The Fresnel Zone: The Number That Ruins Plans

Having line of sight is not enough. The link also needs clearance **around** the straight line, because RF energy does not travel along a wire—it travels through an ellipsoid. If an obstacle intrudes into that volume, you lose signal even if you can see the other end perfectly.

The first Fresnel-zone radius at the midpoint, at 915 MHz:

**r (m) ≈ 9.05 × √D (km)**

The practical rule is to clear at least **60%** of that radius:

| Link length | Fresnel radius | Required clearance (60%) |
| ----------- | -------------: | -----------------------: |
| 1 km        |          9.1 m |                    5.4 m |
| 5 km        |         20.2 m |                   12.1 m |
| 10 km       |         28.6 m |                   17.2 m |
| 20 km       |         40.5 m |                   24.3 m |
| 40 km       |         57.2 m |                   34.3 m |

Read that slowly, because it explains a huge amount of what we see in the mesh.

**A 10 km link needs 17 meters of clearance above any obstacle at the midpoint.** That's roughly the height of a five-story building as a margin. A node at 10 meters in a neighborhood of 10-meter-tall houses has line of sight and **zero** Fresnel clearance.

It may work barely, with marginal and asymmetric links, and no amount of power will fix it—because the problem is geometric, not energetic.

This also explains why links over water are so good here. Over the ocean there is nothing invading the ellipsoid, and you are operating at n = 2. A coastal tower with a clear view over the ocean is genuinely a textbook case.

*(And a warning about that: links over water can sometimes produce strange contacts due to atmospheric ducting that appear and disappear with conditions. It's great when it happens. Don't design the backbone assuming it will be there tomorrow.)*

## The Fourth Lever That Almost Nobody Uses

There is another reason not to spend your effort on power, and it is the one mentioned least often.

**Transmit power only helps when you transmit. Antenna gain helps in both directions.**

By reciprocity, an antenna with 3 dB more gain gives you 3 dB more when transmitting and 3 dB more when receiving. Three additional dB of transmit power gives you 3 dB in one direction and nothing on the way back.

There is the "deaf node" from the clocks post, fully explained. If your link is failing on reception, power does not address the problem. You can increase to 30 dBm and make everyone hear you perfectly while you still cannot hear anyone—and the symptom you create is precisely the asymmetric link I described there: a node that the monitor can hear but that cannot even get the time.

And the social cost: that node is occupying the shared channel with strong transmissions that don't actually solve anything. A noisy, deaf neighbor on a mesh where everyone takes turns using the same frequency.

## Puerto Rico Specifically

Three things here change the numbers.

**The Central Mountain Range.** It is not an obstacle that can be overcome with more power. A node in the north and one in the south will not hear each other no matter how many watts you throw at them—they need a high site in the middle, and that is geometry, not energy. Sites in the Central Mountain Range are not "just another node": they are the only way a north-south route can exist.

**Vegetation.** At 915 MHz, foliage attenuation is significant and gets considerably worse when wet. A link that works when dry can drop during a rainstorm—and here, it rains. If your link depends on barely clearing the tops of a group of trees, it is not really a link; it is a seasonal coincidence.

**Power outages.** A high site that goes offline is useless, and that happens here. Height only counts if the node remains powered—but that's a topic for another post.

## What to Do in Practice

In order of return on effort:

1. **Raise the antenna.** First and foremost. Every meter below the roofline is the most expensive one.
2. **Change the antenna before touching power.** Gain works in both directions and does not make you a bad neighbor. Watch the 6 dBi limit: above that, TX power must be reduced.
3. **Check the connector and cable.** This is the most common failure and the cheapest to fix. A bad pigtail or water in an SMA connector can cost you more dB than any configuration adjustment.
4. **Calculate Fresnel clearance before climbing onto a roof.** If the link you want is 10 km and there is a hill in the middle, you already know the result without getting out of your chair.
5. **Power last**, knowing that you are consuming a shared resource for everyone else to gain very little.

## What I Take Away

Power is the only variable in this problem that has a legal ceiling, buys less as the terrain gets worse, does not help reception, and costs something to the rest of the mesh.

Height has no such ceiling, changes the entire propagation regime instead of simply adding a few dB, helps in both directions, and takes nothing away from anyone.

When someone asks why their node isn't reaching, the first question isn't how many dBm it has.

**It's how many meters high it is.**

### Sources

* [47 CFR § 15.247](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15/subpart-C/subject-group-ECFR2f2e5828339709e/section-15.247) — power limits, reduction for gain above 6 dBi, and point-to-point exceptions (which do not include 902–928 MHz)
* Previous post: *Puerto Rico's Mesh Network Has No Backbone*
* Previous post: *Nodes Out of Time*
* Field report: [Why elevation beats wattage every time](/blog/why-elevation-beats-wattage/) — the same conclusion, measured across two neighborhood rooftop nodes

*73 de WP4TZV*
