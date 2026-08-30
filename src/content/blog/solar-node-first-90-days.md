---
translationKey: solar-node-first-90-days
title: A solar node's first 90 days
description: Notes from building and deploying an unattended solar-powered node, including what broke, what didn't, and what we'd change.
pubDate: 2026-05-14
author: Meshtastic PR
category: Node Builds
tags: [solar, power, deployment]
readingTime: 7 min
---

Ninety days ago we deployed a solar-powered node at a site with no mains power and no one checking on it more than once a month. Here's what held up, and what needed a second attempt.

## What we built

A weatherproofed enclosure housing the radio, a LiFePO4 battery pack, a small charge controller, and an external antenna on a short mast. Sized deliberately for Puerto Rico's rainy season rather than a best-case sunny day — see the reasoning in [Recommended Hardware → Solar Nodes](/hardware/#solar-nodes).

## What went right

The battery never dropped below 60% charge, even through a stretch of five consecutive overcast days in June. LiFePO4's heat tolerance mattered more than expected — the enclosure regularly hit temperatures that would have shortened a generic lithium-ion pack's lifespan.

## What we'd change

The first enclosure gasket wasn't rated for the humidity swings at the site, and we found light condensation inside after about six weeks. We replaced it with a properly IP66-rated enclosure and haven't seen moisture since. Lesson: don't cut corners on the enclosure to save on the electronics budget — an eight-dollar gasket is not the place to economize.

## Coverage impact

Nearby Client nodes that previously needed two hops to reach the rest of the mesh now reach it in one, through this node. It isn't running as a Router — it's a plain Client with good elevation, which turned out to be enough. See [Recommended Settings → Node Roles](/settings/#node-roles) for why we made that call deliberately rather than defaulting to Router.

If you're considering a similar deployment, [Community](/community/) is the place to compare notes with other operators before you commit to a site.
