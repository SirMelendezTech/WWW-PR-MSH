---
title: Malla de Puerto Rico
description: Cómo se está desarrollando la red Meshtastic por todo Puerto Rico, región por región, y dónde la cobertura aún necesita nodos.
order: 5
section: Documentación
lang: es
---

La malla de Puerto Rico se construye un nodo a la vez, por quien sea que decida poner una radio en algún lugar útil. No hay una autoridad central desplegando infraestructura — la cobertura existe donde los operadores la han colocado, y crece exactamente al ritmo en que la comunidad añade nodos bien posicionados.

Cuatro cosas determinan si un área dada tiene cobertura utilizable:

- **Ubicación del nodo** — una radio en un valle cubre un valle; una radio en una cresta puede cubrir varios valles.
- **Terreno** — la Cordillera Central de Puerto Rico bloquea la línea de vista igual que bloquea el clima. La elevación es la palanca más grande sobre el alcance.
- **Hardware y antena** — consulta [Hardware Recomendado](/es/hardware/); una buena antena en alto le gana a una radio potente en una ventana.
- **Participación** — cada nodo Client adicional amplía el *alcance* de la malla, incluso sin retransmitir, simplemente dándole a otros nodos algo por donde saltar.

Si estás decidiendo dónde poner un nodo, prioriza la elevación y la línea de vista genuina hacia centros de población por encima de la conveniencia. Un nodo en un techo mirando hacia una pared de edificios vecinos hace menos por la malla que una antena modesta con vista despejada hacia un valle.

## Cobertura por región

<div class="region-grid">
  <div class="region-card"><h3>Área Metro de San Juan</h3><p>La mayor densidad de nodos de la isla. El terreno urbano denso significa que la ubicación en interiores y techos importa más que la cantidad bruta de radios.</p></div>
  <div class="region-card"><h3>Bayamón</h3><p>Cobertura en crecimiento extendiéndose al oeste desde el área metro; los sitios en cresta hacia el interior siguen siendo la mayor oportunidad.</p></div>
  <div class="region-card"><h3>Carolina</h3><p>La cobertura costera se beneficia de líneas de vista abiertas a lo largo de la costa; conectar hacia el interior requiere puntos de retransmisión elevados.</p></div>
  <div class="region-card"><h3>Caguas</h3><p>Está en un valle rodeado de montañas — un caso de libro de texto para que un nodo de cresta bien ubicado abra cobertura en todas las direcciones.</p></div>
  <div class="region-card"><h3>Ponce</h3><p>El desarrollo en la costa sur está en etapa temprana. La línea de vista a través de la llanura costera favorece a un número pequeño de nodos bien elevados por encima de muchos nodos bajos.</p></div>
  <div class="region-card"><h3>Mayagüez</h3><p>La cobertura en la costa oeste aún se está formando. El terreno hacia el interior es escarpado — la ubicación costera y en cimas ambas tienen un papel que jugar.</p></div>
  <div class="region-card"><h3>Arecibo</h3><p>El terreno kárstico genera línea de vista irregular a distancias cortas; los operadores locales aún están mapeando qué funciona mejor aquí.</p></div>
  <div class="region-card"><h3>Otras regiones</h3><p>La cobertura en el resto de la isla crece a medida que se unen operadores y comparten lo que han desplegado. Cada región empieza igual: un buen nodo.</p></div>
</div>

<div class="callout">
<span class="callout-label">¿Tienes un nodo activo, o planeas uno?</span>
La información de cobertura aquí refleja lo que ha compartido la comunidad. Consulta el <a href="/es/map/">Mapa de Nodos</a> para posiciones en vivo donde los operadores han optado por participar, y la página de <a href="/es/community/">Comunidad</a> para coordinar con otros operadores antes de elegir un sitio.
</div>

## Mapa de cobertura en vivo

<div class="map-placeholder">
  <p><strong>Mapa de cobertura en vivo</strong></p>
  <p>La página dedicada del <a href="/es/map/">Mapa de Nodos</a> muestra las posiciones actuales de los nodos, obtenidas del Meshtastic PR Network Monitor en cada compilación del sitio.</p>
  <a href="/es/map/" class="btn btn-secondary">Abrir el Mapa de Nodos →</a>
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
