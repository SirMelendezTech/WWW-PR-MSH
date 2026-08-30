---
title: Recommended Hardware
description: A use-case-first guide to choosing Meshtastic hardware for Puerto Rico — handheld, home, rooftop, solar, and antennas.
order: 2
section: Documentation
---

Meshtastic hardware ranges from $25 development boards to purpose-built solar repeaters. Rather than ranking devices, this guide is organized by **where you'll put it and what job it needs to do** — that decides more about the right hardware than any spec sheet.

<div class="callout">
<span class="callout-label">Community recommendation, not endorsement</span>
Everything below reflects what Puerto Rico node operators have found reliable in practice. Prices and availability are approximate and will drift — check current listings before buying. No manufacturer sponsors this page, and watch for knockoff boards and antennas on general marketplaces; buy from a board's official store or a known Meshtastic retailer when possible.
</div>

## Choosing a chip: nRF52840 vs. ESP32

Almost every board on this page is built around one of two chip families, and it's worth understanding the trade-off before picking a device:

- **nRF52840** — sips power. Days to weeks on a single charge, no Wi-Fi. The right choice for anything battery-powered: handhelds, solar nodes.
- **ESP32 / ESP32-S3** — adds Wi-Fi and more processing headroom, at the cost of battery life (often 1–2 days on internal battery). Makes sense for a node that's plugged in anyway — home base station, rooftop repeater, or a Wi-Fi/MQTT gateway.

## Portable / handheld nodes

For a backpack, glovebox, belt clip, or pocket. Priorities: battery life, size, and a display you can read outdoors. These almost always run as **Client** or **Client Mute** — see [Node Roles](/settings/#node-roles).

- **Budget entry point**: boards like the Seeed Wio Tracker L1 (~$30, 800 mAh, built-in GPS, small OLED) get you on the mesh cheaply. The L1 Pro variant (~$43) adds a bigger screen and solar charging.
- **Best battery life**: boards that take a standard 18650 cell — the Heltec T114 is a common example (~$25–45 depending on configuration) — can stretch to roughly a week between charges, versus 2–3 days for smaller fixed-battery boards.
- **Sunlight-readable**: E-ink displays stay visible in direct sun and sip almost no power to hold an image — the LILYGO T-Echo (~$60–68) is a common pick, typically good for 5–7 days of normal use. E-ink boards built on the SX1262 radio can be permanently damaged if powered on with no antenna attached — always connect the antenna before powering up.
- **Premium / most rugged**: boards like the RAK WisMesh Pocket V2 (~$89–99, IP66-rated, external SMA antenna) trade size for a bigger battery and better sealing — a reasonable step up for daily carry or boat use.
- **Card-style trackers**: slim, sealed trackers like the RAK WisMesh Tag or SenseCAP T-1000e (~$39 each) trade a display and swappable antenna for pocketability — fine as a location beacon, less useful as a primary messaging device.

An **IP-rated case** or a cheap dry bag matters more in Puerto Rico's humidity and rain than almost anywhere on the mainland U.S. — factor it into the budget for any board that doesn't already ship sealed.

## Comparison table

A quick side-by-side of specific handheld models mentioned above — useful once you've narrowed it down to "which exact board."

<details>
<summary>Show the full spec table</summary>

<div class="table-wrap">

| Device | Battery | Est. battery life | Screen | Price | Best for |
|---|---|---|---|---|---|
| Wio Tracker L1 | 800 mAh | ~2–3 days | 0.96" OLED | ~$30 | Budget pick |
| Wio Tracker L1 Pro | 2000 mAh | ~2.5 days | 1.3" OLED | ~$43 | Budget with joystick + solar |
| Heltec T114 | 800–3000 mAh | Up to a week (18650) | 1.14" color | ~$25–45 | Best battery life |
| LILYGO T-Echo | 850 mAh | ~5–7 days | 1.54" e-ink, sunlight-readable | ~$60–68 | Mid-range, outdoor use |
| RAK WisMesh Pocket V2 | 3200 mAh | ~3+ days with GPS on | 1.3" OLED | ~$89–99 | Best overall, IP66 rugged |
| LILYGO T-Deck Plus | 2000 mAh | ~1–2 days | 2.8" color LCD, full keyboard | ~$77–87 | Standalone messaging, no phone needed |

</div>

Prices and specs shift as manufacturers revise boards — treat this as a starting shortlist, not a final spec sheet, and confirm current numbers before buying.

</details>

## Home / stationary nodes

Indoor nodes running off USB power, usually placed near a window for the best indoor-to-outdoor signal path. This is the easiest and cheapest way to become part of the mesh — most of the network is built from nodes exactly like this. A plugged-in ESP32-based board (see chip comparison above) is a reasonable, inexpensive choice here since battery life doesn't matter.

- Plug-and-forget: pick a device you can leave powered 24/7 without worrying about it.
- Window placement beats a more powerful radio buried in a closet. LoRa is line-of-sight-sensitive; a few feet of positioning matters more than a few dB of transmit power.

## Rooftop / high elevation nodes

Permanent installations meant to extend coverage for the wider community, not just one household. These matter most on ridgelines and rooftops with genuine line of sight to other nodes or population centers — see [Puerto Rico Mesh](/pr-mesh/) for where coverage gaps currently exist.

- **Budget option**: a plugged-in ESP32 board (e.g. Heltec LoRa32 V4 class, ~$25–30) with an external antenna covers most rooftop deployments without needing GPS — the node's position can be set manually since it isn't moving.
- **High-power option**: boosted boards running a 1W (30 dBm) LoRa module exist for genuinely hard-to-cover terrain, but check the math before reaching for one — U.S. rules cap effective radiated power at 36 dBm, so a 1W radio paired with a high-gain antenna can get close to that ceiling fast. More power isn't automatically better; it raises your own airtime footprint for everyone nearby too.
- Weatherproof enclosure is non-negotiable — expect sun, salt air, and hurricane-season rain.
- Consider whether this node should run as **Router** or **Router Late** — and read the warning in [Recommended Settings](/settings/#node-roles) first. A rooftop node run as a plain Client is often still the better choice.

## Solar nodes

Remote or unattended locations without reliable mains power — a finca, a trailhead, a hilltop with no structure nearby. Solar nodes are what keep the mesh alive when the grid doesn't. Pre-built solar kits exist (small panel + battery + weatherproof housing bundled together) if you'd rather not source and enclose the parts yourself — expect roughly $70–200 depending on panel size and battery capacity.

- Size the panel and battery for Puerto Rico's **rainy-season worst case**, not a sunny afternoon — several consecutive overcast days should not take the node offline.
- LiFePO4 battery packs handle heat better than generic lithium-ion, which matters for anything mounted outdoors in direct sun.
- Budget for a low-power sleep/duty-cycle configuration if the deployment needs to survive on a small panel.

<details>
<summary>Choosing a site — tools, checklist, and workflow</summary>

A solar node is usually permanent and hard to relocate once it's mounted, so it's worth verifying the site before anything gets bolted down. Don't trust a single map — combine a coverage predictor, a terrain-visibility tool, and a physical site visit.

**Tools worth using together:**

- **[Meshtastic Site Planner](https://site.meshtastic.org/)** — the official planning tool, and the best starting point. Enter coordinates, antenna height, frequency, power, and gain, and it predicts coverage from terrain elevation data. Point-to-point mode checks line-of-sight, Fresnel-zone clearance, and link margin between two sites; "Snap to highest point" helps surface promising elevated spots nearby.
- **[HeyWhatsThat](https://www.heywhatsthat.com/)** — 360° terrain visibility from a single point. Enter the candidate location and antenna height to see what terrain is actually visible from there — useful for spotting a ridge or hill that will quietly block part of your coverage.
- **[HeyWhatsThat WISP](https://wisp.heywhatsthat.com/)** — line-of-sight and Fresnel-zone clearance between two specific points, with a rating showing how much of the first Fresnel zone is unobstructed. Most useful once you already have a second node or area in mind to reach.
- **[MeshSight](https://ranfty.github.io/meshsight/)** — terrain-aware RF coverage planner built specifically for LoRa/Meshtastic. Maps predicted signal reach from a candidate site before you deploy, using the terrain data directly rather than a generic RF calculator.

**Five things to verify before committing:**

1. **Elevation** — higher is generally better, but a slightly lower site with a genuinely clear view can beat a taller one boxed in by terrain or buildings.
2. **Radio line of sight** — check the terrain profile to what you actually want to reach, not just the straight-line distance.
3. **Fresnel clearance** — a visible line between two antennas isn't enough; the first Fresnel zone needs reasonable clearance too, which the Site Planner models directly.
4. **Solar exposure** — a separate check from RF. Use satellite imagery or a sun-path tool to confirm nothing — trees, buildings, a neighbor's antenna mast — will shade the panel through the year.
5. **Real-world obstructions** — terrain tools model elevation, not trees or buildings. The Site Planner's own documentation is explicit about this limitation; treat its output as a prediction to verify on-site, not a guarantee.

**Workflow**: candidate locations → Site Planner → HeyWhatsThat → satellite imagery for solar exposure → physical site visit → field test.

<div class="table-wrap">

| Factor | What a good candidate looks like |
|---|---|
| Elevation | High relative to the surrounding area |
| Line of sight | Clear toward the nodes or areas that matter |
| Fresnel zone | Mostly unobstructed |
| Solar exposure | Strong, year-round — no seasonal shading |
| Trees / structures | Minimal near the antenna and panel |
| Antenna height | As high above the surroundings as practical |
| Existing mesh | Can already hear or reach several useful nodes |
| Access | Realistic for install and future maintenance |

</div>

Simulation is prediction, not proof — field-test the finalists before making anything permanent. Meshtastic's built-in Range Test module (Modules → Range Test) is the practical way to confirm a candidate site performs the way the tools predicted.

</details>

## Antennas

The antenna usually matters more than the radio it's attached to.

**Omnidirectional vs. directional**

<div class="table-wrap">

| Type | Radiation pattern | Use it for |
|---|---|---|
| Omnidirectional | 360° horizontal coverage | Most rooftop and home nodes — coverage in every direction |
| Directional (yagi) | Focused in one direction | Bridging two specific, distant, known points |

</div>

**Starting points by antenna model** — real-world results vary by terrain and mounting height, but these are common, well-regarded picks in the community:

<div class="table-wrap">

| Antenna | Gain | Approx. price | Best for |
|---|---|---|---|
| Rokland 5.8 dBi fiberglass | 5.8 dBi | ~$30–40 | All-around rooftop (32" tall) |
| Rokland 8 dBi low-profile | 8 dBi | ~$50 | Flat terrain, maximum range |
| ALFA AOA-915-5ACM | 5 dBi | ~$25–35 | Compact outdoor mount (7" tall) |
| RAK WisMesh Blade | ~3 dBi | ~$15–20 | Budget outdoor |
| 17cm whip (SMA) | — | ~$12 | Handheld upgrade over the stock stub |
| 4 dBi gooseneck (SMA) | 4 dBi | ~$20–25 | Handheld upgrade, more forgiving orientation |

</div>

- **Connector type**: most boards ship with **SMA** or **U.FL/IPEX** connectors — confirm which before ordering an antenna, and use a pigtail adapter rather than forcing an incompatible connector.
- **Frequency match**: an antenna tuned for the wrong band will transmit poorly even if it physically fits. Match it to your configured LoRa region and frequency.
- **Gain and terrain**: a 5–6 dBi omnidirectional antenna is a reasonable default for a suburban rooftop. In mountainous terrain — which describes a lot of Puerto Rico's interior — higher gain isn't automatically better: gain trades vertical coverage angle for horizontal reach, so an 8–10 dBi antenna's narrow beam can actually undershoot nearby nodes that sit above or below it in elevation. A more moderate 3–5 dBi antenna often performs better once terrain gets hilly. Directional (yagi) antennas make sense for bridging two specific, distant, known points rather than general area coverage.
- **Mounting height** improves line-of-sight range more reliably than almost any other single change — a mediocre antenna up high consistently beats a great antenna in a windowsill.
- **Cable loss** adds up fast at these frequencies. Use LMR-240 or better coax, and keep outdoor runs to 10 feet or less where practical — every extra foot of cheap cable quietly gives back gain you paid for in the antenna.
- **Weatherproofing**: seal every outdoor connector with quality coax seal tape, not just electrical tape — salt air and rain will find any gap within a season.

For real-world gain and range numbers on specific antenna models, see the [Meshtastic Antenna Reports](https://github.com/meshtastic/antenna-reports) — a community-submitted, crowd-sourced dataset from operators worldwide. It isn't vetted by Meshtastic PR, but it's a useful second opinion beyond manufacturer spec sheets. If you run your own antenna tests here in Puerto Rico, consider submitting a report there too.

## Trusted retailers

Knockoff boards and antennas circulate on general marketplaces, sold as if they were the genuine board — buy from a manufacturer's official store or one of the retailers below when possible.

<div class="table-wrap">

| Retailer | Site | Known for |
|---|---|---|
| Rokland | store.rokland.com | US-based, fast shipping, strong antenna selection |
| RAK Wireless | store.rakwireless.com | WisMesh Pocket, Repeater, Tag, 1W booster |
| B&Q Consulting | shop.uniteng.com | Station G2, Nano G2 Ultra — engineering-focused RF gear |
| Muziworks | muzi.works | Cases, antennas, the R1 Neo — assembled in the USA |
| Seeed Studio | seeedstudio.com | Wio Tracker, SenseCAP, Solar P1 |
| Atlavox | atlavox.com | Pre-built solar nodes and accessories |
| PeakMesh (Etsy) | Etsy shop | Pre-built solar nodes on RAK hardware, ships from FL |

</div>

## Pre-built solar nodes (no assembly required)

If sourcing a panel, battery, charge controller, and enclosure separately isn't appealing, several small builders sell fully assembled solar nodes ready to mount and power on:

<div class="table-wrap">

| Device | Solar | Battery | GPS | Approx. price | Where |
|---|---|---|---|---|---|
| RAK WisMesh Repeater | Built in | Built in | No | ~$70–90 | RAK Wireless |
| SenseCAP Solar P1 Pro | 5W panel | 4× 18650, included | Yes | ~$90 | Seeed Studio |
| Atlavox Beacon | Built in | Built in | Yes | ~$150–200 | Atlavox |
| Heltec V4 solar node | 25W panel | 6× 18650 | No | ~$120–180 | Etsy builders |

</div>

PeakMesh's Etsy shop specializes in this category and is a frequent recommendation for well-built, discreet mounts:

<div class="table-wrap">

| Model | Solar | Battery | Approx. price | Best for |
|---|---|---|---|---|
| MicroMag | 1W panel | 3500 mAh 18650 | ~$85 | Stealth pole or sign mount |
| Ultimate | 2× 1W panels | 2× 5000 mAh 21700 | ~$135 | Maximum battery life |
| Altitude | Solar | 2× 5000 mAh 21700 | ~$130 | Tree-hanging deployments |
| Birdhouse | Solar | 2× 5000 mAh 21700 | ~$135 | Disguised as a birdhouse |
| Magnet Climber | Solar | 2× 5000 mAh 21700 | ~$135 | Magnetic mount, 5 dBi antenna included |

</div>

As always: this is a starting list, not an endorsement — prices and stock move fast on small-batch Etsy builds, and none of these sellers sponsor this page.

## Hardware comparison

Every category above, side by side — price, battery, GPS, waterproofing, and the main trade-off for each.

<details>
<summary>Show the full comparison table</summary>

<div class="table-wrap">

| Device | Approx. price | Battery | GPS | Display | Antenna connector | Waterproof | Solar-ready | Recommended use | Trade-off |
|---|---|---|---|---|---|---|---|---|---|
| Budget handheld (e.g. Wio Tracker L1 class) | ~$30 | 800 mAh, 2–3 days | Yes, built in | Small OLED | U.FL / IPEX | No, needs a case | L1 Pro variant only | First device, learning the app | Small battery limits multi-day use |
| Long-battery handheld (e.g. Heltec T114 class) | ~$25–45 | Swappable 18650, up to ~1 week | Yes, built in | Color TFT | U.FL / IPEX | No, needs a case | Solar input on some variants | Daily carry, extended trips | Bulkier once an 18650 cell is fitted |
| E-ink handheld (e.g. LILYGO T-Echo class) | ~$60–68 | ~850 mAh, 5–7 days | Yes, built in | E-ink, sunlight-readable | U.FL / IPEX | Better sealed than dev boards | With add-on panel | Outdoor/EDC carry, multi-day trips | Never power on without the antenna attached |
| Rugged premium handheld (e.g. RAK WisMesh Pocket class) | ~$89–99 | ~3200 mAh, 3+ days with GPS on | Yes, built in | OLED | External SMA | Yes, IP66 | Yes, solar input | Boat, daily-driver, harsh environments | Higher upfront cost |
| Plugged-in home/rooftop board (e.g. Heltec LoRa32 V4 class) | ~$25–30 | None — mains/USB powered | No, set manually | Small OLED | External | Depends on enclosure | With external panel + charge controller | Home base station, budget rooftop node | No battery backup unless you add one |
| Pre-built solar repeater kit | ~$70–200 | Built-in, sized to panel | Varies by model | Usually none (unattended) | External SMA | Yes, purpose-built | Yes, built for it | Unattended rooftop/hilltop coverage nodes | Highest cost; needs a genuine mounting site |

</div>

Device names above describe **classes of hardware** common in the Meshtastic ecosystem — the specific board revision within each class changes as manufacturers iterate, and availability shifts often. Cross-check current specifications against the [official Meshtastic hardware list](https://meshtastic.org/docs/hardware/devices/) before buying, and confirm firmware support for whatever you pick.

Looking to go beyond the boards above — external sensors, unusual builds, less common boards? See the community-maintained [Awesome Meshtastic hardware & sensors list](https://github.com/SignalGap/awesome-meshtastic#hardware-and-sensors) for a broader, crowd-sourced roundup. It isn't vetted by Meshtastic PR — treat it as a jumping-off point, not a recommendation.

</details>
