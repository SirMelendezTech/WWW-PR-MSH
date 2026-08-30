---
title: Why elevation beats wattage every time
description: A field comparison of two rooftop nodes in the same neighborhood — one higher, one stronger — and what it means for where you put your next radio.
pubDate: 2026-06-02
author: Meshtastic PR
category: Field Reports
tags: [antennas, range, rooftop]
readingTime: 5 min
---

We ran an informal test with two nodes about four blocks apart in a hillside neighborhood: one on a third-floor balcony with a higher-gain antenna, one on a two-story roof with a modest whip antenna but a genuinely clear line of sight over the surrounding rooftops. The lower-gain, better-placed node consistently reached three additional nodes the balcony node couldn't hear at all — including one nearly two kilometers away across a valley.

## The setup

Both nodes ran the same firmware and transmit power. The difference was entirely in what the antenna could actually "see." The balcony node had a clear view down the street, but tree cover and a taller building blocked most other directions. The rooftop node cleared the tree line in almost every direction.

## What we measured

Over 48 hours, the rooftop node logged direct contact (zero hops) with 9 distinct nodes. The balcony node logged 5, and needed a relay through the rooftop node to reach several nodes it could otherwise not see at all — proof, in this case, of the mesh doing exactly what it's supposed to do.

## The takeaway

If you're choosing between a stronger antenna and a better vantage point, take the vantage point. This lines up with what [Recommended Hardware → Antennas](/hardware/#antennas) already recommends: mounting height changes range more reliably than almost any other single factor. A $15 antenna up high will usually beat a $60 antenna behind glass.

For the physical-layer reasoning behind this result — the FCC power ceiling, path-loss exponents, and Fresnel-zone clearance — see [Height vs. Power: Why You Can't Buy More Range](/blog/height-vs-power-en/).

If you're mapping out where Puerto Rico still needs coverage, see [Puerto Rico Mesh](/pr-mesh/) — line-of-sight gaps, not raw radio count, are usually the limiting factor.
