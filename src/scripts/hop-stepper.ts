// Drives the step-through diagram built by plugins/rehype-hop-stepper.mjs.
// The figure arrives with step 1 drawn and every step's text listed, so it
// reads fine without this script; here we show one step at a time and wire
// the step tabs and the previous/next buttons.

type Step = { hops: number; tx: string; edges: string[]; state: Record<string, string> };
const STATES = ["tx", "heard", "quiet", "idle", "stop", "out"];

document.querySelectorAll<HTMLElement>(".hop-stepper").forEach((fig) => {
  let steps: Step[];
  try {
    steps = JSON.parse(fig.dataset.steps || "[]");
  } catch {
    return;
  }
  if (!steps.length) return;

  const tabs = [...fig.querySelectorAll<HTMLButtonElement>(".hs-tab")];
  const texts = [...fig.querySelectorAll<HTMLElement>(".hs-text")];
  const nodes = [...fig.querySelectorAll<SVGGElement>(".hs-node")];
  const edges = [...fig.querySelectorAll<SVGLineElement>(".hs-edge")];
  const pips = [...fig.querySelectorAll<HTMLElement>(".hs-pip")];
  const hopsN = fig.querySelector<HTMLElement>(".hs-hops-n");
  const count = fig.querySelector<HTMLElement>(".hs-count");
  const countSr = fig.querySelector<HTMLElement>(".hs-count-sr");
  const controls = fig.querySelector<HTMLElement>(".hs-controls");
  const prev = fig.querySelector<HTMLButtonElement>(".hs-prev");
  const next = fig.querySelector<HTMLButtonElement>(".hs-next");
  const stepOf = fig.dataset.stepOf || "{n} / {total}";

  fig.classList.add("is-interactive");
  if (controls) controls.hidden = false;

  let current = 0;

  const show = (i: number) => {
    current = Math.max(0, Math.min(steps.length - 1, i));
    const s = steps[current];

    tabs.forEach((t, k) => (k === current ? t.setAttribute("aria-current", "step") : t.removeAttribute("aria-current")));
    texts.forEach((t, k) => (t.hidden = k !== current));

    nodes.forEach((g) => {
      const id = g.dataset.node || "";
      const st = id === s.tx ? "tx" : s.state[id] || "idle";
      STATES.forEach((x) => g.classList.toggle(`is-${x}`, x === st));
    });
    edges.forEach((e) => e.classList.toggle("is-on", s.edges.includes(e.dataset.edge || "")));

    pips.forEach((p, k) => p.classList.toggle("is-on", k < s.hops));
    if (hopsN) hopsN.textContent = String(s.hops);

    const label = stepOf.replace("{n}", String(current + 1)).replace("{total}", String(steps.length));
    if (count) count.textContent = label;
    if (countSr) countSr.textContent = label;

    // aria-disabled, not disabled: the button keeps focus at either end.
    prev?.setAttribute("aria-disabled", String(current === 0));
    next?.setAttribute("aria-disabled", String(current === steps.length - 1));
  };

  tabs.forEach((t, k) => t.addEventListener("click", () => show(k)));
  prev?.addEventListener("click", () => show(current - 1));
  next?.addEventListener("click", () => show(current + 1));

  show(0);
});
