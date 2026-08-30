---
translationKey: power-budget-solar-node
title: Power Budget for a Node That Survives a Long Outage
description: The arithmetic behind sizing a solar Meshtastic node for Puerto Rico's worst case — where the power actually goes, nRF52 vs. ESP32, GPS duty-cycling, panel voltage traps, and the tropical heat problem nobody plans for.
pubDate: 2026-08-19
author: WP4TZV
category: Node Builds
tags: [solar, power, gps, battery]
readingTime: 14 min
---

# Power budget for a node that survives a long outage

Every Meshtastic solar node conversation eventually reaches the same question: how long does it run when the sun stops?

In Puerto Rico that question is not academic. We lose power. Sometimes for hours, sometimes for weeks. And the failure mode people plan for — a dark night — is the easy one. The hard one is five consecutive overcast days in the middle of hurricane season, which is exactly when you'd want the mesh to work.

This post is the arithmetic. What the node actually spends, where the two MCU families differ, how to size a panel that recovers instead of just breaking even, and the one thing about tropical heat that ruins otherwise correct designs.

## First: where the energy actually goes

The instinct is to look at transmissions. That instinct is wrong, and the size of the error is the most useful thing in this post.

For any node that is listening — meaning any node that isn't asleep — **the receiver dominates everything else combined.** A LoRa receiver in continuous RX doesn't care whether traffic exists. It burns current waiting.

Run the numbers on a LongFast position beacon. Using the Semtech time-on-air formula, a 16-byte packet at SF11/250 kHz takes about **354 ms** on air. A real Meshtastic position packet with headers is bigger — call it 40 to 60 bytes, which works out to roughly 550–700 ms.

Take 500 ms as a round figure and price it:

| Radio | TX current | Energy per beacon | 48 beacons/day (every 30 min) |
|---|---|---|---|
| SX1262 @ 22 dBm | ~118 mA | 0.016 mAh | **0.8 mAh/day** |
| E22 module @ 30 dBm | ~600 mA | 0.083 mAh | **4.0 mAh/day** |

Now the receiver, running continuously:

| Platform | RX current | Per day |
|---|---|---|
| nRF52840 node | ~15 mA | **360 mAh/day** |
| ESP32 node | ~50 mA | **1,200 mAh/day** |

Look at the ratio. A position beacon every 30 minutes costs about **0.2%** of an nRF52 node's daily budget at 22 dBm, and about **1%** at 30 dBm.

So here is the first real conclusion:

> Spacing out your telemetry intervals does essentially nothing for battery life. If you're doing it to save power, you're optimizing the wrong term by two orders of magnitude.

There is still an excellent reason to space them out — airtime on a shared channel, which is the argument from the LongFast/congestion discussion. But that's about being a good neighbor, not about your battery.

## The GPS is the expensive part, not the beacon

Here's what people actually mean when they say "position updates drain my battery." It isn't the transmission. It's the receiver that produces the position.

Take a common module as the reference. The Quectel L76K is specified at **29 mA** in acquisition and tracking, and breakout boards that add an LNA and SAW filter measure around **41 mA** active with **360 µA** in standby. Time to first fix is **under 30 seconds from cold** and **under 2 seconds warm or hot**.

That cold-vs-warm gap is the whole game, and I'll come back to it.

| GPS strategy | Cost per day |
|---|---|
| Always on (40 mA continuous) | **~960 mAh/day** |
| Duty-cycled (see table below) | 2–25 mAh/day |
| Off, fixed position configured | **0** |

Always-on GPS costs nearly **three times** an entire nRF52 node's budget. Duty-cycling it drops that by one to two orders of magnitude. Turning it off is free.

For a fixed rooftop or tower node, the answer is obvious: set a fixed position in the config and disable the GPS. You know where the node is. It isn't going anywhere.

**But there's a catch, and it connects to something from the clock post.** If your board has no hardware RTC, the GPS may be its only good time source. Disable it and the node falls back to mesh time — the lowest-priority tier, the one meant for unconfigured devices. You'll have saved almost a thousand mAh a day and created exactly the symptom I wrote about: a node that can't hold the correct time and looks deaf on the monitor.

If you're going to kill the GPS on a board with no RTC, either accept that the node depends on hearing a better time source, or add an RTC. On a design where the GPS *is* the system time source, that tradeoff has to be made deliberately rather than discovered later.

## GPS polling intervals: the crossover nobody mentions

For a mobile node you can't just turn the GPS off, so the question becomes how often to poll it. And there's a non-obvious result buried in the TTFF numbers.

You have two strategies:

**Keep the backup rail alive.** The module holds its ephemeris and time base, so every fix is a warm start — about 2 seconds plus settling, call it 5 s at 40 mA. The price is a continuous 360 µA, which is **8.6 mAh/day** whether you poll or not.

**Cut power completely.** Zero standby draw, but every fix is a cold start: 30 seconds at 40 mA, roughly **0.33 mAh per fix**, fifteen times the cost of a warm one.

Priced out:

| Interval | Fixes/day | Warm (backup alive) | Cold (full power-down) |
|---|---|---|---|
| 5 min | 288 | 24.7 mAh/day | 96 mAh/day |
| 15 min | 96 | 14.0 mAh/day | 32 mAh/day |
| 30 min | 48 | 11.3 mAh/day | 16 mAh/day |
| 1 h | 24 | 9.9 mAh/day | 8.0 mAh/day |
| 4 h | 6 | 8.9 mAh/day | 2.0 mAh/day |
| 12 h | 2 | 8.7 mAh/day | 0.7 mAh/day |

The two columns cross at about **45 minutes**. Which gives a rule that's easy to remember:

> Polling more often than ~45 min: keep the backup rail alive and take warm starts.
> Polling less often than ~45 min: cut the module's power entirely and eat the cold start.

And notice the top of the warm column: once the 8.6 mAh/day standby floor is there, stretching from 30 minutes to 4 hours saves you 2.4 mAh/day. Nothing. If you're keeping the backup rail alive anyway, poll as often as you actually need — the interval is nearly free.

**One caveat that overrides all of this:** if the GPS is also your system time source (no hardware RTC), you can't cut its power without losing the time base. The backup rail stays alive regardless of what the arithmetic says.

### What to actually set, by MCU

The recommendation differs because the *denominator* differs.

**nRF52840 — worth tuning.** Baseline is around 360 mAh/day. GPS at 5-minute polling is ~25 mAh/day, or 7% of the budget; at 30 minutes it's ~11 mAh/day, or 3%. Meaningful, and cheap to improve.

| Use case | Interval | Strategy |
|---|---|---|
| Fixed node | GPS off, fixed position | — |
| Occasional position | 30–60 min | Backup rail alive |
| Very infrequent | 4–12 h | Full power-down |
| Real tracking | 30–120 s | Backup rail alive, accept ~25–40 mAh/day |

**ESP32 / ESP32-S3 — don't bother.** Baseline is around 1,200 mAh/day. GPS at 5-minute polling is ~25 mAh/day, or **2%** of the budget. You could delete the GPS entirely and barely see it on the graph.

If you're trying to save power on an ESP32 node, the GPS interval is the wrong knob by a wide margin. Turn off the screen, disable WiFi if you're not using MQTT, and enable light sleep — those are worth ten to fifty times more than anything you'll do to the GPS. Then, if you still need more, switch platforms.

Also worth enabling regardless of MCU: **smart position broadcast**, which suppresses transmissions when the node hasn't actually moved. It doesn't reduce the GPS cost, but it keeps a stationary "mobile" node from beaconing the same coordinates all day and burning shared airtime.

## nRF52 vs ESP32: the difference is structural

Both families run the same SX1262. The LoRa performance is essentially identical when the antenna is equal — the difference is entirely in what the MCU does around it.

**ESP32 / ESP32-S3.** Dual-core, WiFi, more RAM. In LoRa receive mode, typical current runs **40–80 mA**. Measured in a real deployment: a Heltec V3 with screen, BLE, and a message every minute averages about **130 mA**, which on a 2,500 mAh battery is roughly **19 hours**. That is a node with no solar margin at all.

**nRF52840.** Designed for wearables and sensors, with much lower idle and active draw. In one controlled comparison the consumption attributable to enabling Bluetooth on an nRF52840 module was *not even measurable*.

Light sleep changes the picture but doesn't close the gap: enabling it takes an ESP32 device from roughly a dozen hours to over a hundred, while the nRF52 platform is already low in its default mode and reaches hundreds of hours with the same setting.

What that means when you translate it into hardware you have to buy and mount:

| | nRF52840 node | ESP32 node |
|---|---|---|
| Daily load (listening, no GPS) | ~1.3 Wh | ~4.4 Wh |
| Battery for 7 days autonomy | ~3,400 mAh (one 18650) | ~10,500 mAh (three or four) |
| Panel to ride out a 1-PSH overcast day | ~2 W | ~6–7 W |

That's a **3–4× difference in both the battery bank and the panel**, on a node doing the same job. For a mains-powered node, or a handheld you charge every night, ESP32 is fine and you get WiFi and MQTT out of it. For an unattended solar site, the platform choice is most of your power budget decided before you write a single config line.

## Your role setting is a power budget decision

This is the part that ties back to the first post in this series.

A `CLIENT_MUTE` node can sleep aggressively — it never rebroadcasts, so missing packets while asleep costs the mesh nothing. A `CLIENT` can duty-cycle somewhat. A `ROUTER`, `ROUTER_LATE`, or `CLIENT_BASE` **cannot meaningfully sleep at all**, because a receiver that's asleep is a receiver that drops the packet it was supposed to relay.

So when you decide that your tower node should be a `ROUTER`, you have also decided that it runs a continuous receiver forever. There's no power-saving mode that's compatible with being infrastructure. Budget accordingly — infrastructure roles are the expensive ones, and that cost is the price of the job, not a configuration mistake.

## Sizing the panel: it has two jobs, not one

The most common sizing error is treating the panel as though it only has to cover the daily load. It has to do that *and* refill what the cloudy stretch drained. A panel sized to exactly break even never recovers — it just holds the battery wherever the last bad week left it.

The method:

**1. Measure your actual load.** Not a datasheet figure. Put a recording power meter on the node for several hours and read watt-hours or amp-hours over time — a plain multimeter can't do this, because you need the integral, not an instantaneous reading. Run it in its real configuration, with the real role, for at least a few hours.

**2. Apply honest derates.** The panel's nameplate rating is a laboratory number:

| Loss | Factor |
|---|---|
| Soiling, salt, aging | 0.90 |
| Cell temperature (see below) | 0.80–0.85 |
| MPPT converter efficiency | 0.90–0.95 |
| Battery round-trip | 0.95 |
| **Combined** | **≈ 0.65–0.70** |

**3. Size for the worst realistic sun, not the average.** San Juan averages roughly 5–5.5 peak sun hours annually. During a sustained overcast stretch, you get **1 to 1.5**. If you size for the annual average, your node dies exactly when the weather is bad — which correlates almost perfectly with when the power is out.

**4. Then oversize for recovery.** After the reserve is drained, the panel needs surplus above the daily load to put it back. A useful rule: size for the worst-case sun hours, then multiply by 1.5–2× so there's headroom to recharge.

### Panels are sold as "6V 5W" — and the voltage is the part that matters

Every listing gives you two numbers: a nominal voltage and a wattage. Almost everyone reads the wattage and ignores the voltage. That's backwards for what we're doing.

**Wattage determines how fast you charge. Voltage determines whether you charge at all in low light.**

That second sentence is the whole cloudy-day problem. Under heavy overcast the panel's current collapses *and* its voltage sags. A panel with barely enough voltage headroom in full sun produces nothing usable under clouds, because the charger never reaches its start threshold. You get a node that charges beautifully on the days it doesn't need to and not at all on the days it does.

For a single-cell Li-ion system (4.2 V full charge), here's how the common nominal ratings actually behave:

| Listing says | Vmp (real) | Voc (open circuit) | For 1S Li-ion |
|---|---|---|---|
| **5V** | ~5.0–5.5 V | ~6.0–6.5 V | Marginal — sags below the charger's start point under cloud |
| **6V** | ~5.5–6.5 V | ~7.0–7.5 V | The usual match. Enough headroom to keep working in poor light |
| **9V** | ~8–9 V | ~10–11 V | More low-light headroom; more loss if the charger is linear rather than MPPT |
| **12V** | ~17–18 V | **~21–22 V** | ⚠️ Trap. "12V" nominal is really ~21 V open circuit |
| **18V** | ~18–20 V | **~22–23 V** | ⚠️ Same trap, worse |

Two rules that follow from that table:

**Design against Voc, not the number in the listing.** Open-circuit voltage is what your charger sees before any load is drawn, and it's roughly 20–25% above Vmp. A "12V 10W" panel will present about 21 V to a charger input that may be rated for far less. This is a common and expensive way to destroy a charge controller, and the listing gives you no warning at all. Check your charger's absolute maximum input against the panel's **Voc**, and leave margin.

**Voltage headroom is cloudy-day insurance.** This is the real argument for choosing 6V over 5V on a 1S system, and it costs nothing.

### Sizing in the units you'll actually be shopping in

Running the method above through to the numbers on a listing, with worst-case sun at 1.2 PSH and a 0.68 system derate:

| Node | Daily load | Break-even | With 2× recovery | Nearest common size |
|---|---|---|---|---|
| nRF52, GPS off | ~1.35 Wh/day | 1.7 W | 3.4 W | **6V 5W** |
| nRF52, GPS duty-cycled | ~1.5 Wh/day | 1.8 W | 3.7 W | **6V 5W** |
| ESP32, optimized (no screen/WiFi, light sleep) | ~4.4 Wh/day | 5.4 W | 10.8 W | **6V 10W** |
| ESP32, unoptimized (screen + BLE, ~130 mA) | ~11.5 Wh/day | 14.1 W | 28 W | **12V 30W** ⚠️ check Voc |

That last row is the argument for the whole platform section in one line. **An unoptimized ESP32 node needs roughly six times the panel of an nRF52 node** — and it pushes you into the 12V class, where the Voc trap is waiting.

If you need more than about 10 W and want to stay in the 6V class, two 6V panels in parallel give you the current without raising the voltage. Series wiring doubles the voltage and walks you straight into the problem above.

## Cloudy days: what "autonomy" actually means

Autonomy is battery capacity divided by daily load, adjusted for how deep you're willing to discharge.

For an nRF52 node at 1.3 Wh/day, with a 3,400 mAh 18650 at 3.7 V and 80% depth of discharge:

```
Usable energy = 3.4 Ah × 3.7 V × 0.8 = 10.1 Wh
Autonomy      = 10.1 Wh / 1.3 Wh per day ≈ 7.7 days
```

Nearly eight days of complete darkness. That's a real hurricane-grade number, on one cell.

The same calculation for an ESP32 node at 4.4 Wh/day gives about **2.3 days** on the same cell. To reach a week you need three or four cells.

Two things that quietly eat into this:

- **Depth of discharge is a lifetime decision.** Running Li-ion to 100% DoD repeatedly will cost you most of your cycle life. 80% is a reasonable compromise; 50% is what you'd pick if you wanted the node to last years without a visit.
- **A dead battery doesn't restart cleanly.** If the pack drops below the protection cutoff, some charge controllers won't restart from a weak panel in poor light. The node then stays dead through the entire cloudy stretch even though there's *some* sun. Worth checking your charger's behavior at low input.

## The tropical problem nobody mentions: heat

Here's the one that catches good designs.

Lithium-ion charge controllers stop charging above roughly 45 °C, and they should — charging a hot Li-ion cell degrades it fast and is a genuine safety issue. Now consider a sealed black enclosure on a Puerto Rican roof in August. Internal temperatures of 55–70 °C are entirely achievable.

Which means: **on the sunniest days, when you have the most energy available, your charger may be refusing to charge.**

It gets worse. Panel output itself falls with temperature — silicon loses roughly 0.4% per °C above 25 °C, and cell temperature on a roof here runs far above ambient. And Li-ion calendar aging accelerates sharply with heat, so a pack that should last five years may last two.

What to do about it:

- **Light-colored, vented enclosure.** Not black. This is the cheapest fix available and the one most often skipped.
- **Separate the battery from the panel thermally.** Don't mount the pack directly behind the panel where it gets both the sun and the panel's waste heat.
- **Use a charger with a real temperature sense loop** (an NTC on the pack, JEITA profile) so it throttles rather than blindly charging a hot cell.
- **Consider LiFePO4.** Wider usable temperature range, far better cycle life, much better thermal safety margin. The costs are lower energy density and a 3.2 V nominal cell that needs a different charger and a boost stage to feed 3.3 V logic. For an unattended tropical site, that tradeoff often goes LiFePO4's way.

## Worked example: a rooftop CLIENT_BASE that should survive a week

Requirements: nRF52840 board, `CLIENT_BASE`, no GPS (fixed position configured), no screen, seven days of autonomy, must recover afterward.

```
Load
  RX continuous, ~15 mA @ 3.7 V        = 1.33 Wh/day
  Beacon every 30 min @ 22 dBm         ≈ 0.003 Wh/day  (negligible)
  Total                                ≈ 1.35 Wh/day

Battery
  7 days × 1.35 Wh / 0.8 DoD           = 11.8 Wh
  @ 3.7 V                              = 3,200 mAh → one good 18650

Panel
  Worst-case sun: 1.2 PSH
  System derate: 0.68
  Break-even     = 1.35 / (1.2 × 0.68) = 1.65 W
  With 2× recovery headroom            ≈ 3.5 W
```

A **6V 5W** panel and a single 18650. That is a genuinely small, cheap, roof-mountable node that rides out a week of no sun and then recharges — and the 6V class keeps enough voltage headroom to keep charging under cloud.

Run the same requirements on an ESP32 and you land at four cells and a 10 W panel — a fundamentally different mechanical problem, a different enclosure, a different mount.

## Checklist

1. **Measure the real load** with a recording meter, in the node's real role and configuration.
2. **Fixed nodes: set a fixed position and turn the GPS off.** Biggest single saving available. Check whether the board has an RTC first.
3. **Mobile nodes: pick the GPS strategy by interval.** Faster than ~45 min, keep the backup rail alive for warm starts. Slower than that, cut power entirely. On an ESP32, skip this — fix light sleep, the screen, and WiFi instead.
4. **Pick the MCU for the deployment**, not for the feature list. nRF52 for unattended solar, ESP32 where you need WiFi/MQTT or have mains power.
5. **Size the panel for worst-case sun hours, then double it** so it can recover, not just break even.
6. **Read the panel's Voc, not the nominal rating on the listing**, and check it against your charger's absolute maximum input. A "12V" panel is really ~21 V open circuit.
7. **Size the battery for the outage you actually plan for**, at 80% DoD or less.
8. **Solve the heat problem before it solves you.** Light enclosure, vented, temperature-sensing charger, LiFePO4 if you can take the tradeoffs.
9. **Don't bother tuning telemetry intervals for battery life.** Tune them for airtime — that's the reason that actually holds up.

---

**Sources**

- [LoRa Airtime & Duty-Cycle Calculator](https://d-central.tech/lora-airtime-calculator/) — Semtech AN1200.13 time-on-air figures for LongFast
- [Compare the power consumption of Meshtastic devices](https://tutoduino.fr/en/power-consumption-meshtastic/) — bench measurements, Heltec V3 vs XIAO ESP32S3 vs XIAO nRF52840
- [Quectel L76K specifications](https://www.4gltemall.com/quectel-l76k.html) — acquisition/tracking current, TTFF cold vs warm vs hot
- [L76K GNSS Module datasheet](https://files.seeedstudio.com/wiki/SenseCAP/SenseCAP_LoRaWAN_Starter_Kit/109100021_L76K%20GNSS%20Module%20for%20Seeed%20Studio%20XIAO%20Datasheet.pdf) — module-level active and standby figures
- [Meshtastic Hardware Guide](https://smartnmagic.com/blogs/solutions/meshtastic-hardware-the-complete-guide) — ESP32 receive-mode current ranges
- [How to Measure Device Power Consumption](https://openelab.io/blogs/getting-started/meshtastic-guide-how-to-measure-device-power-consumption) — measurement method
- [Supported Hardware Overview](https://meshtastic.org/docs/hardware/devices/) — Meshtastic docs on platform power characteristics
- Previous posts: *Puerto Rico's Mesh Has No Backbone*, *Nodes with the Wrong Time*, *Height vs. Power*

*73 de WP4TZV*
