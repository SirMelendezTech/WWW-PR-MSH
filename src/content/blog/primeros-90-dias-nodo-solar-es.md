---
title: "Los primeros 90 días de un nodo solar"
description: Notas sobre la construcción y el despliegue de un nodo alimentado por energía solar y sin supervisión, incluyendo lo que funcionó, lo que falló y lo que cambiaríamos.
pubDate: 2026-05-14
author: Meshtastic PR
category: Node Builds
tags: [solar, energia, despliegue]
readingTime: 7 min
lang: es
translationKey: solar-node-first-90-days
---

Hace noventa días desplegamos un nodo alimentado por energía solar en un sitio sin suministro eléctrico de la red y donde nadie lo revisa más de una vez al mes. Esto es lo que resistió y lo que necesitó un segundo intento.

## Lo que construimos

Una caja impermeabilizada que alberga la radio, un paquete de baterías LiFePO4, un pequeño controlador de carga y una antena externa montada en un mástil corto. El sistema fue dimensionado deliberadamente para la temporada de lluvias de Puerto Rico, en lugar de basarnos en un día soleado en las mejores condiciones. Consulta [Hardware recomendado → Nodos solares](/hardware/#solar-nodes) para conocer el razonamiento.

## Lo que salió bien

La batería nunca bajó del 60 % de carga, incluso durante un período de cinco días consecutivos de cielos nublados en junio. La tolerancia al calor de las baterías LiFePO4 resultó ser más importante de lo esperado: la caja alcanzaba regularmente temperaturas que habrían reducido la vida útil de un paquete de baterías de ion de litio convencional.

## Lo que cambiaríamos

La primera junta de la caja no estaba clasificada para soportar las variaciones de humedad del sitio, y después de unas seis semanas encontramos una ligera condensación en el interior. La reemplazamos por una caja con clasificación IP66 adecuada y, desde entonces, no hemos vuelto a detectar humedad. Lección: no hay que escatimar en la caja para ahorrar en el presupuesto de los componentes electrónicos; una junta de ocho dólares no es el lugar adecuado para economizar.

## Impacto en la cobertura

Los nodos Client cercanos que antes necesitaban dos saltos para llegar al resto de la malla ahora lo hacen en un solo salto, a través de este nodo. No está funcionando como Router, sino como un Client normal con una buena elevación, lo que resultó ser suficiente. Consulta [Configuración recomendada → Roles de los nodos](/settings/#node-roles) para entender por qué tomamos esta decisión deliberadamente en lugar de utilizar Router por defecto.

Si estás considerando un despliegue similar, [Comunidad](/community/) es el lugar indicado para intercambiar experiencias con otros operadores antes de comprometerte con un sitio.
