// One-off generator for the default social share image (public/og-default.png).
// Re-run manually with `node scripts/generate-og-image.mjs` if the brand look changes.
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../public/og-default.png");

const W = 1200;
const H = 630;

// Terrain ridge silhouette + hop arcs, mirroring src/components/TerrainSignature.astro
const nodes = [
  { x: 90, y: 430 },
  { x: 320, y: 360 },
  { x: 560, y: 310 },
  { x: 800, y: 355 },
  { x: 1040, y: 320 },
  { x: 1150, y: 400 },
];
const ridge = "M0,470 90,440 220,462 320,370 430,410 560,320 680,382 800,365 900,400 1040,330 1160,410 1200,470 V630 H0 Z";
const hopArcs = nodes
  .slice(0, -1)
  .map((a, i) => {
    const b = nodes[i + 1];
    const mx = (a.x + b.x) / 2;
    const peak = Math.min(a.y, b.y) - 46;
    return `<path d="M${a.x},${a.y - 10} Q${mx},${peak} ${b.x},${b.y - 10}" fill="none" stroke="#2fe0d1" stroke-width="2.5" stroke-linecap="round" opacity="0.85" />`;
  })
  .join("\n");
const nodeMarks = nodes
  .map((n) => `<circle cx="${n.x}" cy="${n.y - 10}" r="6" fill="#2fe0d1" stroke="#082a56" stroke-width="2" />`)
  .join("\n");

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#082a56" />
      <stop offset="100%" stop-color="#0b3d78" />
    </linearGradient>
    <linearGradient id="ridge-fill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f8377" stop-opacity="0.55" />
      <stop offset="100%" stop-color="#0f8377" stop-opacity="0" />
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)" />

  <path d="${ridge}" fill="url(#ridge-fill)" stroke="#1fb8ac" stroke-width="2" stroke-opacity="0.8" />
  ${hopArcs}
  ${nodeMarks}

  <text x="80" y="180" font-family="Arial, sans-serif" font-weight="700" font-size="64" fill="#ffffff" letter-spacing="-1">Meshtastic Puerto Rico</text>
  <text x="80" y="230" font-family="Arial, sans-serif" font-weight="400" font-size="30" fill="#aebfc6">Community mesh network guides, hardware, and field notes</text>

  <rect x="80" y="270" width="64" height="4" fill="#2fe0d1" />
</svg>
`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes)`);
