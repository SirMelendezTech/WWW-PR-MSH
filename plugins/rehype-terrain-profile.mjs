/**
 * Turn a placeholder in Markdown into the Ponce → Cerro de Punta → Arecibo
 * hop diagram, drawn from real elevation (src/data/profile.json, written by
 * `npm run terrain`).
 *
 * In the .md file, write one HTML block with no blank lines inside it:
 *
 *   <figure data-terrain-profile
 *     data-aria="…" data-hop="Hop {n}: {km} km" data-blocked="Blocked"
 *     data-scale="Height exaggerated about {x}×">
 *   <figcaption>…</figcaption>
 *   </figure>
 *
 * The data-* attributes carry every word the diagram shows, so the same
 * plugin serves the English and Spanish pages. Place names and units are
 * the same in both languages.
 *
 * Astro runs user rehype plugins before rehype-raw, so the placeholder
 * arrives as a single `raw` node; it is replaced with another raw node.
 *
 * Line of sight is computed here, not drawn by hand: each link uses a 10 m
 * antenna at both ends and subtracts Earth's curvature with the usual 4/3
 * radio-horizon factor. If new data ever puts a hop below the terrain, the
 * diagram draws it as blocked instead of lying about it.
 *
 * Astro caches rendered Markdown. After changing this file or profile.json,
 * delete .astro/data-store.json before building, or the old diagram stays.
 */
import { readFileSync } from "node:fs";

const profile = JSON.parse(readFileSync(new URL("../src/data/profile.json", import.meta.url), "utf8"));

const ANTENNA_M = 10;
const K_EARTH_KM = 6371 * (4 / 3);
const W = 1000;
const H = 330;
const TOP = 34;
const BOTTOM = 14;
const MAX_M = 1400;
const SIDE = 14; // keeps the end nodes inside the drawing

const total = profile.stops[profile.stops.length - 1].km;
const x = (km) => SIDE + (km / total) * (W - 2 * SIDE);
const y = (m) => H - BOTTOM - (m / MAX_M) * (H - TOP - BOTTOM);
const pct = (v, of) => `${((v / of) * 100).toFixed(2)}%`;
const r1 = (v) => Math.round(v * 10) / 10;

const bulge = (d1, d2) => ((d1 * d2) / (2 * K_EARTH_KM)) * 1000;

/** The point where terrain rises furthest above the straight radio path
 *  from a to b, or null when the path is clear end to end. The worst point,
 *  not the first: a town in a shallow bowl is "blocked" by a rise 500 m away,
 *  but the Cordillera is what a reader needs to see. */
function obstruction(a, b) {
  const ha = a.m + ANTENNA_M;
  const hb = b.m + ANTENNA_M;
  let worst = null;
  for (const p of profile.points) {
    if (p.km <= a.km || p.km >= b.km) continue;
    const t = (p.km - a.km) / (b.km - a.km);
    const line = ha + (hb - ha) * t;
    const over = p.m + bulge(p.km - a.km, b.km - p.km) - line;
    if (over > 0 && (!worst || over > worst.over)) worst = { km: p.km, m: line, over };
  }
  return worst;
}

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function render(attrs, figcaption) {
  const stops = profile.stops;
  const first = stops[0];
  const last = stops[stops.length - 1];

  const ground =
    `M0,${y(0)} ` +
    profile.points.map((p) => `L${r1(x(p.km))},${r1(y(p.m))}`).join(" ") +
    ` L${W},${y(0)} Z`;

  const top = (s) => ({ x: x(s.km), y: y(s.m + ANTENNA_M) });

  // Direct path, first stop to last, with an × where the terrain stands
  // furthest above it.
  const block = obstruction(first, last);
  const a = top(first);
  const z = top(last);
  let svg = `<line class="tp-direct" x1="${r1(a.x)}" y1="${r1(a.y)}" x2="${r1(z.x)}" y2="${r1(z.y)}"/>`;
  const mark = block ? { x: x(block.km), y: y(block.m) } : null;
  if (mark) {
    const { x: bx, y: by } = mark;
    svg += `<path class="tp-x" d="M${r1(bx - 9)},${r1(by - 9)} L${r1(bx + 9)},${r1(by + 9)} M${r1(bx + 9)},${r1(by - 9)} L${r1(bx - 9)},${r1(by + 9)}"/>`;
  }

  let labels = "";
  stops.slice(0, -1).forEach((s, i) => {
    const t = stops[i + 1];
    const p = top(s);
    const q = top(t);
    const ok = !obstruction(s, t);
    svg += `<line class="tp-hop${ok ? "" : " is-blocked"}" x1="${r1(p.x)}" y1="${r1(p.y)}" x2="${r1(q.x)}" y2="${r1(q.y)}"/>`;
    const text = (attrs.hop || "{n}: {km} km")
      .replace("{n}", String(i + 1))
      .replace("{km}", String(Math.round(t.km - s.km)));
    labels += `<span class="tp-hop-label" style="left:${pct((p.x + q.x) / 2, W)};top:${pct((p.y + q.y) / 2, H)}">${esc(text)}</span>`;
  });

  if (block && attrs.blocked) {
    labels += `<span class="tp-blocked-label" style="left:${pct(mark.x, W)};top:${pct(mark.y, H)}">${esc(attrs.blocked)}</span>`;
  }

  stops.forEach((s, i) => {
    const p = top(s);
    svg += `<circle class="tp-node" cx="${r1(p.x)}" cy="${r1(p.y)}" r="6"/>`;
    const edge = i === 0 ? " is-start" : i === stops.length - 1 ? " is-end" : "";
    labels += `<span class="tp-stop${edge}" style="left:${pct(p.x, W)};top:${pct(p.y, H)}"><strong>${esc(s.name)}</strong> ${s.m.toLocaleString("en-US")} m</span>`;
  });

  const unitsPerM = (H - TOP - BOTTOM) / MAX_M;
  const unitsPerMHoriz = (W - 2 * SIDE) / (total * 1000);
  const exaggeration = Math.round(unitsPerM / unitsPerMHoriz);
  const scale = attrs.scale ? `<p class="tp-scale">${esc(attrs.scale.replace("{x}", String(exaggeration)))}</p>` : "";

  return (
    `<figure class="terrain-profile">` +
    `<div class="tp-plot">` +
    `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(attrs.aria || "")}">` +
    `<path class="tp-ground" d="${ground}"/>` +
    `<line class="tp-sea" x1="0" y1="${y(0)}" x2="${W}" y2="${y(0)}"/>` +
    svg +
    `</svg>` +
    `<div class="tp-labels" aria-hidden="true">${labels}</div>` +
    `</div>` +
    scale +
    figcaption +
    `</figure>`
  );
}

export default function rehypeTerrainProfile() {
  return (tree) => {
    const walk = (node) => {
      if (!Array.isArray(node.children)) return;
      for (const child of node.children) {
        if (child.type === "raw" && child.value.includes("data-terrain-profile")) {
          const attrs = {};
          for (const m of child.value.matchAll(/data-([a-z-]+)="([^"]*)"/g)) attrs[m[1]] = m[2];
          const caption = child.value.match(/<figcaption>[\s\S]*?<\/figcaption>/)?.[0] ?? "";
          child.value = render(attrs, caption);
        } else {
          walk(child);
        }
      }
    };
    walk(tree);
  };
}
