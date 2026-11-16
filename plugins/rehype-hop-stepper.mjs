/**
 * Turn a placeholder in Markdown into the step-through "how a message moves"
 * diagram on How Meshtastic Works — the same stepper pattern meshcore.prmsh.com
 * uses, redrawn for Meshtastic's managed flooding and hop limit.
 *
 * In the .md file, write one HTML block with no blank lines inside it:
 *
 *   <figure data-hop-stepper data-title="…" data-flag="…"
 *     data-prev="…" data-next="…" data-step-of="Step {n} of {total}"
 *     data-hops="Hops left" data-legend="Client|Client Mute|Router|Transmits|Hears it, stays quiet">
 *   <ol>
 *   <li data-name="Step name">Step text.</li>   (five of them)
 *   </ol>
 *   <figcaption>…</figcaption>
 *   </figure>
 *
 * Every word comes from the Markdown, so one plugin serves both languages.
 * The topology and what each node does per step live here and in
 * src/scripts/hop-stepper.ts, which reads the per-step state from the
 * data-steps attribute this plugin writes.
 *
 * Without JavaScript the figure still works: step 1 is drawn, and all five
 * step texts are listed in order.
 *
 * Like the terrain plugin, Astro hands raw HTML to user rehype plugins as a
 * single `raw` node, which is replaced with another raw node. Astro caches
 * rendered Markdown: after changing this file, delete .astro/data-store.json
 * before building.
 */

// Conceptual layout on a 560×170 board. Roles follow Meshtastic's names.
const NODES = {
  A: { x: 40, y: 118, role: "client", label: "A" },
  N1: { x: 108, y: 80, role: "client", label: "1" },
  M: { x: 150, y: 140, role: "mute", label: "2" },
  N3: { x: 222, y: 68, role: "client", label: "3" },
  R: { x: 330, y: 44, role: "router", label: "4" },
  N5: { x: 428, y: 90, role: "client", label: "5" },
  B: { x: 488, y: 120, role: "client", label: "B" },
  E: { x: 540, y: 146, role: "client", label: "6" },
};

// Who can hear whom (dashed "reach" lines). Each relay only reaches nodes
// that have not heard the packet yet, because a node drops a packet ID it
// has already seen instead of relaying it twice.
const REACH = [
  ["A", "N1"], ["A", "M"], ["A", "N3"], ["N1", "N3"], ["M", "N1"],
  ["N3", "R"], ["R", "N5"], ["N5", "B"], ["B", "E"],
];

// Per step: the transmitting node, the links its packet travels, and the
// state of every other node. States: tx, heard, quiet (heard it and will not
// relay), idle (not reached yet), stop (got it, hop limit spent), out
// (never reached). `hops` is the hop limit carried by the packet that the
// step's transmitter sends.
const STEPS = [
  {
    hops: 3,
    tx: "A",
    edges: [["A", "N1"], ["A", "M"], ["A", "N3"]],
    state: { N1: "heard", M: "heard", N3: "heard", R: "idle", N5: "idle", B: "idle", E: "idle" },
  },
  {
    hops: 2,
    tx: "N3",
    edges: [["N3", "A"], ["N3", "N1"], ["N3", "R"]],
    state: { A: "heard", N1: "quiet", M: "quiet", R: "heard", N5: "idle", B: "idle", E: "idle" },
  },
  {
    hops: 1,
    tx: "R",
    edges: [["R", "N3"], ["R", "N5"]],
    state: { A: "heard", N1: "quiet", M: "quiet", N3: "heard", N5: "heard", B: "idle", E: "idle" },
  },
  {
    hops: 0,
    tx: "N5",
    edges: [["N5", "R"], ["N5", "B"]],
    state: { A: "heard", N1: "quiet", M: "quiet", N3: "heard", R: "heard", B: "stop", E: "out" },
  },
  {
    // Firmware 2.6+ next-hop routing for direct messages: the next DM to B
    // follows the relays that delivered the first one, all drawn at once.
    hops: 3,
    tx: "A",
    edges: [["A", "N3"], ["N3", "R"], ["R", "N5"], ["N5", "B"]],
    state: { N1: "quiet", M: "quiet", N3: "heard", R: "heard", N5: "heard", B: "stop", E: "idle" },
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

function nodeShape(n) {
  if (n.role === "router") return `<rect class="hs-shape" x="${n.x - 9}" y="${n.y - 9}" width="18" height="18"/>`;
  return `<circle class="hs-shape" cx="${n.x}" cy="${n.y}" r="9"/>`;
}

function render(attrs, items, caption) {
  const first = STEPS[0];
  const legend = (attrs.legend || "").split("|");
  const total = items.length;
  const stepOf = (n) => (attrs["step-of"] || "{n} / {total}").replace("{n}", n).replace("{total}", total);

  const reach = REACH.map(([a, b]) => {
    const p = NODES[a], q = NODES[b];
    return `<line class="hs-reach" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"/>`;
  }).join("");

  // One <line> per possible directed link; the script switches them on.
  const links = new Set(STEPS.flatMap((s) => s.edges.map((e) => e.join("-"))));
  const edges = [...links].map((key) => {
    const [a, b] = key.split("-");
    const p = NODES[a], q = NODES[b];
    const on = first.edges.some((e) => e.join("-") === key);
    return `<line class="hs-edge${on ? " is-on" : ""}" data-edge="${key}" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"/>`;
  }).join("");

  const nodes = Object.entries(NODES).map(([id, n]) => {
    const st = id === first.tx ? "tx" : first.state[id] || "idle";
    return (
      `<g class="hs-node hs-node--${n.role} is-${st}" data-node="${id}">` +
      `<circle class="hs-halo" cx="${n.x}" cy="${n.y}" r="19"/>` +
      nodeShape(n) +
      `<text x="${n.x}" y="${n.y - 25}" text-anchor="middle">${n.label}</text>` +
      `</g>`
    );
  }).join("");

  const tabs = items.map((it, i) =>
    `<li><button type="button" class="hs-tab" data-step="${i}"${i === 0 ? ' aria-current="step"' : ""}>` +
    `<span class="hs-n" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span> ${it.name}</button></li>`
  ).join("");

  const texts = items.map((it, i) =>
    `<li class="hs-text" data-step="${i}"><p class="hs-name">${it.name}</p><p class="hs-body">${it.body}</p></li>`
  ).join("");

  const pips = [0, 1, 2].map((i) => `<span class="hs-pip${i < first.hops ? " is-on" : ""}"></span>`).join("");

  const steps = esc(JSON.stringify(STEPS.map((s) => ({ hops: s.hops, tx: s.tx, edges: s.edges.map((e) => e.join("-")), state: s.state }))));

  return (
    `<figure class="hop-stepper" data-steps="${steps}" data-step-of="${esc(attrs["step-of"] || "")}">` +
    `<div class="hs-head"><p class="hs-title">${attrs.title || ""}</p><span class="hs-flag">${attrs.flag || ""}</span></div>` +
    `<ol class="hs-tabs">${tabs}</ol>` +
    `<div class="hs-stage"><svg viewBox="0 0 560 170" aria-hidden="true" focusable="false">` +
    `<path class="hs-terrain" d="M0 150 C40 146 90 124 130 116 C170 108 196 82 232 80 C262 78 300 52 330 56 C360 60 392 104 432 106 C470 108 500 132 560 136 L560 170 L0 170 Z"/>` +
    `<path class="hs-ridge" d="M0 150 C40 146 90 124 130 116 C170 108 196 82 232 80 C262 78 300 52 330 56 C360 60 392 104 432 106 C470 108 500 132 560 136"/>` +
    reach + edges + nodes +
    `</svg></div>` +
    `<div class="hs-readout" aria-live="polite">` +
    `<p class="sr-only hs-count-sr">${stepOf(1)}</p>` +
    `<ol class="hs-texts">${texts}</ol>` +
    `<p class="hs-hops"><span>${attrs.hops || ""}:</span> <span class="hs-pips" aria-hidden="true">${pips}</span> <span class="hs-hops-n">${first.hops}</span></p>` +
    `</div>` +
    `<div class="hs-controls" hidden>` +
    `<p class="hs-count" aria-hidden="true">${stepOf(1)}</p>` +
    `<div class="hs-buttons">` +
    `<button type="button" class="btn btn-secondary btn-sm hs-prev" aria-disabled="true">${attrs.prev || "‹"}</button>` +
    `<button type="button" class="btn btn-primary btn-sm hs-next">${attrs.next || "›"}</button>` +
    `</div></div>` +
    `<ul class="hs-legend">` +
    `<li><span class="hs-key hs-key--client"></span>${legend[0] || ""}</li>` +
    `<li><span class="hs-key hs-key--mute"></span>${legend[1] || ""}</li>` +
    `<li><span class="hs-key hs-key--router"></span>${legend[2] || ""}</li>` +
    `<li><span class="hs-key hs-key--tx"></span>${legend[3] || ""}</li>` +
    `<li><span class="hs-key hs-key--quiet"></span>${legend[4] || ""}</li>` +
    `</ul>` +
    caption +
    `</figure>`
  );
}

export default function rehypeHopStepper() {
  return (tree) => {
    const walk = (node) => {
      if (!Array.isArray(node.children)) return;
      for (const child of node.children) {
        if (child.type === "raw" && child.value.includes("data-hop-stepper")) {
          const head = child.value.match(/<figure[^>]*>/)?.[0] ?? "";
          const attrs = {};
          for (const m of head.matchAll(/data-([a-z-]+)="([^"]*)"/g)) attrs[m[1]] = m[2];
          const items = [...child.value.matchAll(/<li data-name="([^"]*)">([\s\S]*?)<\/li>/g)].map((m) => ({ name: m[1], body: m[2].trim() }));
          const caption = child.value.match(/<figcaption>[\s\S]*?<\/figcaption>/)?.[0] ?? "";
          child.value = render(attrs, items, caption);
        } else {
          walk(child);
        }
      }
    };
    walk(tree);
  };
}
