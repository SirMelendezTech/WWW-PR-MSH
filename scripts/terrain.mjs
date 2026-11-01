/**
 * Generate the terrain data the site draws from: `npm run terrain`.
 *
 * Run it once and commit what it writes. The normal build reads the output
 * and downloads nothing.
 *
 *   src/data/terrain.json  Filled elevation bands for the home map preview,
 *                          already projected into the preview's viewBox.
 *   src/data/profile.json  Elevation profile Ponce → Cerro de Punta → Arecibo
 *                          for the hop diagram on How Meshtastic Works.
 *
 * Source: AWS Open Data "Terrain Tiles" (Terrarium PNG encoding, no API key).
 * Each pixel stores height as R*256 + G + B/256 - 32768 metres. Underlying
 * data: SRTM and USGS 3DEP.
 *
 * The projection comes from src/data/map-frame.json, the same file
 * MeshMapPreview reads. Change the frame there and run this again, or the
 * relief drifts away from the coastline and the nodes.
 */
import { readFile, writeFile } from "node:fs/promises";
import { PNG } from "pngjs";
import { contours } from "d3-contour";

const ROOT = new URL("../", import.meta.url);
const frame = JSON.parse(await readFile(new URL("src/data/map-frame.json", ROOT), "utf8"));

const Z = 10; // ~150 m per pixel at this latitude
const TILE = 256;
const TILE_URL = (x, y) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${x}/${y}.png`;

// Bands for the preview. A 1000-unit-wide card has room for a few steps, not
// ten: these split the island into coast plain, foothills, the karst and the
// Cordillera, which is what explains where radio coverage stops.
const LEVELS = [150, 300, 600, 900];
const GRID_STEP = 0.5; // viewBox units per grid cell (~130 m)
const SIMPLIFY = 0.6; // Ramer–Douglas–Peucker tolerance, viewBox units
const MIN_AREA = 6; // drop rings smaller than this, square viewBox units

// A spike is a cell that sits more than this far above ALL eight neighbours
// (or below all of them). Comparing to the median would also flatten real,
// steep summits such as Cerro de Punta; comparing to the extremes does not.
const SPIKE_M = 150;

const PROFILE_STOPS = [
  { name: "Ponce", lat: 18.0111, lon: -66.6141 },
  { name: "Cerro de Punta", lat: 18.1725, lon: -66.5917 },
  { name: "Arecibo", lat: 18.4724, lon: -66.7157 },
];
const PROFILE_STEP_KM = 0.5;

// Spot checks printed after cleanup, so a bad tile or an over-eager filter
// shows up before anything is committed.
const CHECKS = [
  { name: "Cerro de Punta (~1338 m)", lat: 18.1725, lon: -66.5917 },
  { name: "El Toro, El Yunque (~1074 m; z10 cells average ~150 m)", lat: 18.2717, lon: -65.8381 },
];

// ---------------------------------------------------------------------------
// Web Mercator tile maths

const n = 2 ** Z;
const lonToPx = (lon) => ((lon + 180) / 360) * n * TILE;
const latToPx = (lat) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n * TILE;
};

const PAD = 0.03; // degrees, so bilinear sampling at the frame edge has data
const tx0 = Math.floor(lonToPx(frame.lon0 - PAD) / TILE);
const tx1 = Math.floor(lonToPx(frame.lon1 + PAD) / TILE);
const ty0 = Math.floor(latToPx(frame.lat1 + PAD) / TILE);
const ty1 = Math.floor(latToPx(frame.lat0 - PAD) / TILE);
const MW = (tx1 - tx0 + 1) * TILE;
const MH = (ty1 - ty0 + 1) * TILE;

// ---------------------------------------------------------------------------
// 1. Download and decode

const mosaic = new Float32Array(MW * MH);
const jobs = [];
for (let ty = ty0; ty <= ty1; ty++) {
  for (let tx = tx0; tx <= tx1; tx++) {
    jobs.push(
      (async () => {
        const res = await fetch(TILE_URL(tx, ty));
        if (!res.ok) throw new Error(`Tile ${Z}/${tx}/${ty}: HTTP ${res.status}`);
        const png = PNG.sync.read(Buffer.from(await res.arrayBuffer()));
        const ox = (tx - tx0) * TILE;
        const oy = (ty - ty0) * TILE;
        for (let y = 0; y < TILE; y++) {
          for (let x = 0; x < TILE; x++) {
            const i = (y * TILE + x) * 4;
            const h = png.data[i] * 256 + png.data[i + 1] + png.data[i + 2] / 256 - 32768;
            mosaic[(oy + y) * MW + ox + x] = h;
          }
        }
      })(),
    );
  }
}
await Promise.all(jobs);
console.log(`Downloaded ${jobs.length} tiles at z${Z} (${MW}×${MH} px).`);

// ---------------------------------------------------------------------------
// 2. Remove spikes and pits

let fixed = 0;
for (let pass = 0; pass < 2; pass++) {
  const src = mosaic.slice();
  for (let y = 1; y < MH - 1; y++) {
    for (let x = 1; x < MW - 1; x++) {
      const nb = [];
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) if (dx || dy) nb.push(src[(y + dy) * MW + x + dx]);
      const v = src[y * MW + x];
      const max = Math.max(...nb);
      const min = Math.min(...nb);
      if (v - max > SPIKE_M || min - v > SPIKE_M) {
        nb.sort((a, b) => a - b);
        mosaic[y * MW + x] = (nb[3] + nb[4]) / 2;
        fixed++;
      }
    }
  }
}
console.log(`Cleanup: replaced ${fixed} spike/pit cells.`);

const sample = (lon, lat) => {
  const px = lonToPx(lon) - tx0 * TILE - 0.5;
  const py = latToPx(lat) - ty0 * TILE - 0.5;
  const x0 = Math.floor(px);
  const y0 = Math.floor(py);
  const fx = px - x0;
  const fy = py - y0;
  const at = (x, y) => mosaic[Math.min(MH - 1, Math.max(0, y)) * MW + Math.min(MW - 1, Math.max(0, x))];
  return (
    at(x0, y0) * (1 - fx) * (1 - fy) +
    at(x0 + 1, y0) * fx * (1 - fy) +
    at(x0, y0 + 1) * (1 - fx) * fy +
    at(x0 + 1, y0 + 1) * fx * fy
  );
};

// Peak check: the highest sample within ~300 m, because a named summit's
// published coordinates are rarely on the exact highest pixel.
for (const c of CHECKS) {
  let best = -Infinity;
  for (let dy = -0.003; dy <= 0.003; dy += 0.0005)
    for (let dx = -0.003; dx <= 0.003; dx += 0.0005) best = Math.max(best, sample(c.lon + dx, c.lat + dy));
  console.log(`Check ${c.name}: ${Math.round(best)} m`);
}

// ---------------------------------------------------------------------------
// 3. Resample onto the preview's projection, then smooth

const GW = Math.round(frame.vw / GRID_STEP);
const GH = Math.round(frame.vh / GRID_STEP);
let grid = new Float64Array(GW * GH);
for (let j = 0; j < GH; j++) {
  for (let i = 0; i < GW; i++) {
    const vx = (i + 0.5) * GRID_STEP;
    const vy = (j + 0.5) * GRID_STEP;
    const lon = frame.lon0 + (vx / frame.vw) * (frame.lon1 - frame.lon0);
    const lat = frame.lat1 - (vy / frame.vh) * (frame.lat1 - frame.lat0);
    grid[j * GW + i] = sample(lon, lat);
  }
}

const blur = (g) => {
  const out = new Float64Array(g.length);
  for (let j = 0; j < GH; j++) {
    for (let i = 0; i < GW; i++) {
      let s = 0;
      let c = 0;
      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          const x = i + di;
          const y = j + dj;
          if (x < 0 || y < 0 || x >= GW || y >= GH) continue;
          s += g[y * GW + x];
          c++;
        }
      }
      out[j * GW + i] = s / c;
    }
  }
  return out;
};
// The coastline comes from Natural Earth in the component, not from these
// bands (the lowest band is 150 m), so every pass can smooth freely.
for (let k = 0; k < 3; k++) grid = blur(grid);

// ---------------------------------------------------------------------------
// 4. Contours, 5. simplification

const rdp = (pts, eps) => {
  if (pts.length < 3) return pts;
  const [ax, ay] = pts[0];
  const [bx, by] = pts[pts.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  let maxD = -1;
  let idx = 0;
  for (let k = 1; k < pts.length - 1; k++) {
    const d = Math.abs(dy * pts[k][0] - dx * pts[k][1] + bx * ay - by * ax) / len;
    if (d > maxD) {
      maxD = d;
      idx = k;
    }
  }
  if (maxD <= eps) return [pts[0], pts[pts.length - 1]];
  return [...rdp(pts.slice(0, idx + 1), eps).slice(0, -1), ...rdp(pts.slice(idx), eps)];
};
// RDP on a closed ring: split at the point farthest from the start so the
// first and last points are not both pinned to the same spot.
const simplifyRing = (ring, eps) => {
  const pts = ring.slice(0, -1);
  if (pts.length < 4) return null;
  let far = 0;
  let farD = -1;
  for (let k = 1; k < pts.length; k++) {
    const d = Math.hypot(pts[k][0] - pts[0][0], pts[k][1] - pts[0][1]);
    if (d > farD) {
      farD = d;
      far = k;
    }
  }
  const a = rdp(pts.slice(0, far + 1), eps);
  const b = rdp([...pts.slice(far), pts[0]], eps);
  const out = [...a.slice(0, -1), ...b.slice(0, -1)];
  return out.length >= 3 ? out : null;
};
const area = (pts) => {
  let s = 0;
  for (let k = 0; k < pts.length; k++) {
    const [x1, y1] = pts[k];
    const [x2, y2] = pts[(k + 1) % pts.length];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s / 2);
};
const f = (v) => (Math.round(v * 10) / 10).toString();

const generator = contours().size([GW, GH]).smooth(true).thresholds(LEVELS);
const bands = generator(Array.from(grid)).map((mp) => {
  const parts = [];
  for (const polygon of mp.coordinates) {
    for (const ring of polygon) {
      const scaled = ring.map(([x, y]) => [x * GRID_STEP, y * GRID_STEP]);
      const simple = simplifyRing(scaled, SIMPLIFY);
      if (!simple || area(simple) < MIN_AREA) continue;
      parts.push("M" + simple.map(([x, y]) => `${f(x)},${f(y)}`).join(" ") + "Z");
    }
  }
  return { level: mp.value, d: parts.join("") };
});

// ---------------------------------------------------------------------------
// 6. Elevation profile

const toRad = (d) => (d * Math.PI) / 180;
const distKm = (a, b) => {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

const points = [];
const stops = [];
let offset = 0;
for (let s = 0; s < PROFILE_STOPS.length - 1; s++) {
  const a = PROFILE_STOPS[s];
  const b = PROFILE_STOPS[s + 1];
  const legKm = distKm(a, b);
  const steps = Math.max(1, Math.round(legKm / PROFILE_STEP_KM));
  if (s === 0) stops.push({ name: a.name, km: 0 });
  for (let k = s === 0 ? 0 : 1; k <= steps; k++) {
    const t = k / steps;
    const lat = a.lat + (b.lat - a.lat) * t;
    const lon = a.lon + (b.lon - a.lon) * t;
    points.push({ km: Math.round((offset + legKm * t) * 100) / 100, m: Math.max(0, Math.round(sample(lon, lat))) });
  }
  offset += legKm;
  stops.push({ name: b.name, km: Math.round(offset * 100) / 100 });
}
for (const st of stops) {
  const p = points.reduce((best, q) => (Math.abs(q.km - st.km) < Math.abs(best.km - st.km) ? q : best));
  st.m = p.m;
}

// ---------------------------------------------------------------------------
// 7. Write

const source = "AWS Terrain Tiles (SRTM, USGS 3DEP)";
const terrain = { source, levels: LEVELS, bands };
const terrainJson = JSON.stringify(terrain);
await writeFile(new URL("src/data/terrain.json", ROOT), terrainJson + "\n");
await writeFile(
  new URL("src/data/profile.json", ROOT),
  JSON.stringify({ source, stepKm: PROFILE_STEP_KM, stops, points }) + "\n",
);
console.log(`terrain.json: ${(terrainJson.length / 1024).toFixed(1)} KB, ${bands.length} bands`);
console.log(`profile.json: ${points.length} samples over ${offset.toFixed(1)} km`);
console.log("Stops:", stops.map((s) => `${s.name} ${s.km} km ${s.m} m`).join(" | "));
console.log("Astro caches rendered Markdown: delete .astro/data-store.json before the next build.");
