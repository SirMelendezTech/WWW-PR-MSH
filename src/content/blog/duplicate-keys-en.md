---
translationKey: duplicate-keys
title: "Duplicate Keys in the Puerto Rico Mesh: What That Red Warning Means"
description: What MeshMonitor's duplicate-key warning actually means, the critical CVE behind it, and why a good chunk of what's flagged right now is a harmless firmware 2.8 renumbering artifact rather than a breach.
pubDate: 2026-08-11
author: WP4TZV
category: Field Reports
tags: [security, monitor, encryption]
readingTime: 11 min
---

# Duplicate Keys in the Puerto Rico Mesh: What That Red Warning Means

On the monitor's Security page, there is a second thing that stands out besides the clocks: nodes flagged with **duplicate keys**. 

It is worth understanding exactly what that means, because it is the most serious warning the monitor can give you—and because a significant portion of what you are seeing right now is probably not a security problem at all, but an artifact of the upgrade to 2.8.

Both things can be true at once. Let's break it down.

## First: Which Key Are We Talking About?

There are two different things in Meshtastic that people call "the key," and confusing them makes this conversation go nowhere.

**The channel PSK** is the shared channel key. Everyone on `LongFast` shares the same PSK—by design. That is not duplication; that is how a channel works. If someone says, "But we all have the same key," they are referring to this, and it is not what the monitor is flagging.

**The device key pair** is something else: since version 2.5, each node generates its own X25519 public/private key pair when it starts for the first time. The public key is announced in NodeInfo; the private key never leaves the device. This is what makes encrypted end-to-end direct messages and authenticated remote administration possible.

What the monitor flags as duplicated is **the device's public key**, not the channel PSK. And because there is a one-to-one relationship between the public and private keys, two nodes with the same public key also have the same private key.

That's the entire problem in one sentence.

## Why It Matters: CVE-2025-52464

This isn't theoretical. It is a published CVE with **critical severity, CVSS v4 score of 9.5**.

The project's official advisory, published in June 2025, describes two issues that were discovered together:

1. **The flashing procedure used by several manufacturers was producing duplicate key pairs.** In other words, devices were leaving the factory sharing a key with other devices from the same batch.
2. **Meshtastic's use of the rweather/crypto library was not properly initializing the internal randomness pool on some platforms**, which could result in low-entropy keys.

The affected versions range from 2.5.0 up to, but not including, 2.6.11.

### The Impact, Specifically

For direct messages, the advisory is straightforward: when a user with an affected key pair sent DMs, those messages could be captured and decrypted by an attacker who had collected the list of compromised keys.

Remote administration is affected in two different ways:

* If a compromised key is added as a remote administrator, anyone possessing that private key can administer the node.
* The reverse case is more complicated: if the remotely administered node is the one with the compromised key pair, an attacker would need to determine the public key of an authorized administrator, use the compromised private key to produce the resulting `shared_key`, and then impersonate the administrator and send commands to the node.

Translated into what this means for a mesh operator: **a node with a duplicate key does not have private DMs, and potentially does not have exclusive control over its own node.**

And there is a second part that almost nobody mentions: if *you* send a DM to a node with a duplicate key, that message isn't private either. The compromised key belongs to the other node, but the message is yours. It isn't just the other person's problem.

### How It Was Fixed

Version 2.6.11 did three things: it warns the user when it detects a compromised key, **delays key generation until the LoRa region is configured for the first time**—which eliminates the factory-cloning problem at its root, because nobody in the distribution chain gets access to the keys—and adds multiple sources of randomness to RNG initialization.

Version 2.6.12 went further: it was announced to automatically delete known compromised keys when they are detected.

## Before You Panic: The 2.8 False Positive

This is the part that changes how the monitor should be interpreted right now, in August 2026, with many people upgrading to 2.8.

There is a regression in firmware 2.8 where, on the first boot, **the node is renumbered to `crc32(publicKey)` while keeping the same key**. The previous NodeNum—the one derived from the MAC address before 2.8—becomes orphaned.

The result: a single physical node appears under two different NodeNums while sharing the same key.

That looks **exactly like** a real key collision. Same symptom, completely benign cause.

MeshMonitor detects and suppresses this specific pattern: when a group of two NodeNums has exactly one equal to `crc32(publicKey)`—the new, active 2.8 identity—and the other has become inactive, it treats it as an upgrade renumbering and does not flag it as a security risk.

But notice the limits of that suppression:

* If **both** nodes are still transmitting actively, it is flagged.
* If **neither** NodeNum matches `crc32(publicKey)`, it is flagged.
* The scanner explicitly **leans toward keeping the warning when the case is ambiguous.**

That last point is both the good news and the bad news: it means the scanner prefers a false positive over letting a real problem slip through. Correct from a design perspective, but it also means that **you cannot assume everything being flagged is an incident.**

## The Two Detections Are Not the Same Thing

The monitor flags two different conditions, and mixing them together leads to incorrect conclusions:

|                  | **Low Entropy**                                                                          | **Duplicate Key**                                                             |
| ---------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| What it compares | Your public key against a database of known weak keys that have been publicly documented | The public keys of nodes against each other within the monitor's own database |
| Scope            | Global — your key is on a published list                                                 | Local — these nodes share a key *with each other*                             |
| When it runs     | In real time, when a node is discovered or updated                                       | Background scanner: 5 minutes after startup, then every 24 hours by default   |
| What it implies  | Someone with the list can decrypt your DMs                                               | Device cloning, backup restoration, or the 2.8 artifact                       |

A node can have both flags at the same time. That is the highest-priority case: weak *and* shared key.

It is also worth knowing the limitations documented by the project itself: the low-entropy detector only recognizes keys that are already in its database, **it cannot detect newly generated weak keys**, and it requires the node to have announced its public key. The absence of a warning is not proof that the key is good.

## How to Investigate Without Causing Harm

If you see a group of duplicates in the monitor, the sensible order is:

1. **Rule out the 2.8 renumbering.** Does one of the NodeNums equal `crc32` of the public key? Did the other stop transmitting? Then it is one node, not two, and there is no incident.
2. **Check whether both are still active.** Two nodes transmitting at the same time with the same key is not an upgrade. That is real cloning.
3. **Record the firmware version.** Anything from 2.5.0 through 2.6.11 falls within the CVE range. A node in that range with a duplicate key is almost certainly the factory case described in the advisory.
4. **Force a scan if you just fixed something.** Flags are not automatically cleared until the next cycle, which can be up to 24 hours. There is an endpoint to trigger it manually.

And a note about old firmware that applies to everything above: there was a separate flaw, fixed in 2.6.3, where an attacker could send a NodeInfo with an empty public key to erase the stored key of a known node, and then send a new key that would be saved in the NodeDB. On nodes below 2.6.3, the public key you see being advertised is not necessarily authentic. That complicates any conclusion you want to draw from the monitor about nodes running old firmware.

## How to Fix Your Own Node

The official advisory gives the direct path:

```text
meshtastic --factory-reset-device
```

This clears a factory-cloned key. But the advisory itself warns that **the resulting key may still have low entropy depending on the platform**.

If you need a genuinely high-entropy key, the recommendation is to generate it outside the device:

```text
openssl genpkey -algorithm x25519 -outform DER | tail -c32 | base64
```

Then enter that value as the node's private key.

Update the firmware first, in any case. Since 2.6.11, the device no longer generates the key until you configure the region, so a clean flash on current firmware produces a key that nobody else has ever seen.

## When You Already Reported It and Nothing Happened

The standard recommendation is to contact the operator privately. That has already been done here, and there was no response. So the real question is not whether to report it—the question is what to do when reporting it doesn't work.

This post *is* the next step. Public disclosure of the issue, without names. And that distinction isn't timidity; it is the part that matters.

**Why it is still a bad idea to publish the list of affected nodes**, even if their owners ignored you: the damage does not fall only on them. It falls on everyone who sends them a message.

If you publish that node X has a compromised key, you aren't punishing the negligent operator—you are telling anyone with a receiver exactly which conversations are worth capturing, including conversations belonging to people who have nothing to do with the issue.

The official advisory is explicit that the attack requires having collected the list of compromised keys. Publishing the correlation of "this key, this node, this area" is doing half the attacker's work for them.

And there is an uncomfortable detail: if the private warning was sent by DM to the affected node, that warning wasn't private either. A node with a compromised key cannot receive a confidential message—not even one telling the operator that their key is compromised.

**What does work when the other side doesn't respond:**

* **Publish numbers without names.** "The PR mesh has N flagged nodes, in M duplicate-key groups" creates pressure and gives people an idea of the size of the problem without handing anyone a map. If the number is high, the number itself is the argument.
* **Set a date.** Coordinated disclosure has always worked this way: "If this isn't fixed by this date, I will publish the details." It gives the operator a concrete reason to act and gives you a defensible position if you eventually publish.
* **Escalate one level.** If the node is at a shared site, a club repeater, or belongs to someone identifiable within a local group, the group administrator may have more reach than a DM.
* **Accept that some nodes won't be fixed.** Many of these are unattended nodes: someone installed them, they worked, and nobody ever looked at them again. An operator who doesn't read messages isn't going to read a blog either.

And that's the shift that changes who you're writing this for.

**If the owners aren't going to fix it, the audience for this post is everyone else.** The goal stops being "fix your nodes" and becomes "check the node's status before sending it something sensitive."

That is entirely within the reader's control, doesn't depend on anyone cooperating, and is the only part of this problem that doesn't require a third party to do something.

**One note about the tone, though.** Practically none of these cases are malicious. The dominant cause, according to the advisory itself, is that certain manufacturers flashed the devices incorrectly—the operator did nothing wrong. The second most common cause is someone restoring a backup to a second device, which is an honest mistake.

Being ignored is frustrating, but a post that sounds accusatory gives people an excuse to argue about the tone instead of the problem.

## What I Take Away

The duplicate-key warning is real and serious: a critical 9.5 CVE that completely breaks the privacy of direct messages and opens the door to remote-administrator impersonation.

And at the same time, right now, some of what is being flagged is noise from a 2.8 regression, and the scanner is designed to prefer a false positive.

Both things are true.

The pattern repeats from the previous post about clocks: the monitor gives you a useful signal along with a few known false positives, and the work is separating them before drawing conclusions.

But what separates this case from the clocks case is that the work has already been done and the operators have already been notified.

If I am writing this publicly, it is not because I failed to try the private route—it is because that route has been exhausted.

And because the fix depends on people who aren't responding, the useful part of this post isn't the part that talks to them.

**It's the part that tells you, the person reading this, how to check your own node and how to know who you're talking to.**

---

## Sources

* [Puerto Rico Mesh Monitor](https://meshtasticpr.duckdns.org/source/d9d92629-16d4-4de9-839d-30f62216e354/security) — Security page where these observations come from
* [GHSA-gq7v-jr8c-mfr7 — Repeated Public/Private Keypairs](https://github.com/meshtastic/firmware/security/advisories/GHSA-gq7v-jr8c-mfr7) — Official Meshtastic advisory
* [CVE-2025-52464](https://nvd.nist.gov/vuln/detail/CVE-2025-52464) — NVD
* [CVE-2025-55293](https://nvd.nist.gov/vuln/detail/cve-2025-55293) — Public-key overwrite via NodeInfo, fixed in 2.6.3
* [MeshMonitor — Security Features](https://meshmonitor.org/features/security.html) — Detection mechanics and the 2.8 renumbering exception
* [MeshMonitor — Duplicate Encryption Keys](https://meshmonitor.org/security-duplicate-keys.html) — Explanatory page for affected operators

*73 de WP4TZV*
