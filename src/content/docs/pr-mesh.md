---
title: Puerto Rico Mesh
description: How the Meshtastic network across Puerto Rico is developing, region by region, and where coverage still needs nodes.
order: 5
section: Documentation
---

Puerto Rico's mesh is built one node at a time, by whoever decides to put a radio somewhere useful. There's no central authority deploying infrastructure — coverage exists where operators have placed it, and grows exactly as fast as the community adds well-positioned nodes.

Four things determine whether a given area has usable coverage:

- **Node placement** — a radio in a valley covers a valley; a radio on a ridge can cover several valleys.
- **Terrain** — Puerto Rico's Cordillera Central blocks line of sight the same way it blocks weather. Elevation is the single biggest lever on range.
- **Hardware and antenna** — see [Recommended Hardware](/hardware/); a good antenna up high beats a strong radio in a window.
- **Participation** — every additional Client node extends the *reach* of the mesh, even without relaying, simply by giving other nodes something to hop through.

If you're deciding where to put a node, prioritize elevation and genuine line of sight to population centers over convenience. A rooftop node facing a wall of neighboring buildings does less for the mesh than a modest antenna with a clear view down a valley.

## Coverage by region

<div class="region-grid">
  <div class="region-card"><h3>San Juan Metro</h3><p>Highest node density on the island. Dense urban terrain means indoor and rooftop placement matter more than raw radio count.</p></div>
  <div class="region-card"><h3>Bayamón</h3><p>Growing coverage extending west from the metro area; ridge sites toward the interior remain the biggest opportunity.</p></div>
  <div class="region-card"><h3>Carolina</h3><p>Coastal coverage benefits from open sightlines along the shore; connecting inland requires elevated relay points.</p></div>
  <div class="region-card"><h3>Caguas</h3><p>Sits in a valley surrounded by mountains — a textbook case for a well-placed ridge node to unlock coverage in every direction.</p></div>
  <div class="region-card"><h3>Ponce</h3><p>South coast development is early-stage. Line of sight across the coastal plain favors a small number of well-elevated nodes over many low ones.</p></div>
  <div class="region-card"><h3>Mayagüez</h3><p>West coast coverage is still forming. Terrain toward the interior is steep — coastal and hilltop placement both have a role to play.</p></div>
  <div class="region-card"><h3>Arecibo</h3><p>Karst terrain makes for uneven line of sight over short distances; local operators are still mapping what works best here.</p></div>
  <div class="region-card"><h3>Other regions</h3><p>Coverage across the rest of the island grows as operators join and share what they've deployed. Every region starts the same way: one good node.</p></div>
</div>

<div class="callout">
<span class="callout-label">Have a node up, or planning one?</span>
Coverage information here reflects what's been shared by the community. See the <a href="/map/">Node Map</a> for live positions where operators have opted in, and the <a href="/community/">Community</a> page to connect with other operators before choosing a site.
</div>

## Live coverage map

<div class="map-placeholder">
  <p><strong>Live coverage map</strong></p>
  <p>The dedicated <a href="/map/">Node Map</a> page shows current node positions, pulled from the Meshtastic PR Network Monitor at each site build.</p>
  <a href="/map/" class="btn btn-secondary">Open the Node Map →</a>
</div>

<style>
  .region-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    margin: 1.75rem 0;
  }
  .region-card {
    background: var(--bg-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 1.1rem 1.2rem;
  }
  .region-card h3 { font-size: 1rem; margin-bottom: 0.4rem; color: var(--secondary); }
  .region-card p { font-size: 0.88rem; margin: 0; }

  .map-placeholder {
    border: 1.5px dashed var(--border-strong);
    border-radius: var(--radius-lg);
    padding: 2rem;
    text-align: center;
    margin: 2rem 0;
    background: var(--bg-sunken);
  }
  .map-placeholder p { max-width: 52ch; margin-inline: auto; }
</style>
