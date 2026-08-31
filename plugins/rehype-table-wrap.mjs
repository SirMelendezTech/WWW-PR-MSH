/**
 * Wrap every markdown table in `<div class="table-wrap">` so it scrolls inside
 * its own box instead of pushing the page sideways on phones (the `table` rule
 * in global.css sets a 640px min-width to keep columns readable).
 *
 * Astro runs user rehype plugins *before* rehype-raw, so a table an author
 * already wrapped by hand still has its `<div class="table-wrap">` sitting
 * beside it as a raw node. Skip those so the wrappers don't nest.
 */
const isWhitespace = (node) => node.type === "text" && node.value.trim() === "";

function previousMeaningfulSibling(parent, index) {
  for (let i = index - 1; i >= 0; i--) {
    if (!isWhitespace(parent.children[i])) return parent.children[i];
  }
  return null;
}

function isManualWrap(node) {
  return Boolean(node) && node.type === "raw" && node.value.includes("table-wrap");
}

export default function rehypeTableWrap() {
  return (tree) => {
    const walk = (node) => {
      if (!Array.isArray(node.children)) return;
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        walk(child);
        if (child.type !== "element" || child.tagName !== "table") continue;
        if (isManualWrap(previousMeaningfulSibling(node, i))) continue;
        node.children[i] = {
          type: "element",
          tagName: "div",
          properties: { className: ["table-wrap"] },
          children: [child],
        };
      }
    };
    walk(tree);
  };
}
