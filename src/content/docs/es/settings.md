---
title: Configuración Recomendada
description: Guía de configuración de la comunidad de Puerto Rico para región, roles de nodo, intervalos de transmisión, Neighbor Info y MQTT.
order: 3
section: Documentación
lang: es
---

<div class="callout callout--warning">
<span class="callout-label">Valores de la comunidad, no oficiales</span>
Estos valores parten de lo que otras redes comunitarias de Meshtastic han probado en el campo, y se están ajustando para Puerto Rico. Cada uno se marca como <span class="badge badge--verified">Verificado</span> cuando varios operadores de Puerto Rico lo han confirmado en el campo, o <span class="badge badge--proposed">Propuesto</span> cuando es un punto de partida razonable que aún no se ha probado ampliamente. El comportamiento del firmware cambia entre versiones — la documentación vigente de Meshtastic manda sobre esta página.
</div>

Cada ajuste indica dónde encontrarlo en la app de Meshtastic en Android y iPhone. Todas las rutas empiezan en la pantalla **Settings** de la app, y usan los nombres de menú en inglés.

## Región y Frecuencia

Meshtastic requiere que cada equipo declare una **región LoRa**, que fija la banda de frecuencia legal, los límites de potencia y el ciclo de trabajo para donde opera la radio. <span class="badge badge--verified">Verificado</span>

<div class="app-paths" role="group" aria-label="Dónde encontrarlo en la app">
<p><span class="platform platform--android">Android</span><span>Radio configuration → LoRa → Region → <strong>US</strong></span></p>
<p><span class="platform platform--ios">iPhone</span><span>Radio Configuration → LoRa → Region → <strong>US</strong></span></p>
</div>

Puerto Rico cae bajo la asignación de frecuencia de Estados Unidos para la banda ISM sin licencia que usa Meshtastic. Configura tu región en consecuencia, y confírmalo contra la [lista oficial de regiones de Meshtastic](https://meshtastic.org/docs/configuration/radio/lora/#region) — esta lista se mantiene upstream y es la fuente autoritativa, no esta página.

No adivines una región ni copies una de la comunidad de otro país. Un ajuste de región incorrecto puede transmitir fuera de los límites legales y no se comunicará de forma confiable con los nodos locales configurados correctamente.

La región no es lo único que fija tu frecuencia. El **nombre del canal primario** se hashea a un slot de frecuencia, así que renombrarlo, reordenar canales o importar un QR de canal puede mover un nodo fuera de la frecuencia regional sin avisar — consulta [El canal que moviste no era un canal — era tu frecuencia](/es/blog/orden-canales-slot-frecuencia-es/) para saber cómo pasa eso y cuándo fijar `lora.channel_num` a propósito.

## Roles de Nodo

Elegir el rol correcto importa más para la salud de la malla compartida que casi cualquier otro ajuste.

<div class="table-wrap table-wrap--fit">

| Rol | Caso de uso | Notas |
|---|---|---|
| **Client Mute** | Nodos móviles — mochilas, vehículos, equipos de mano personales | Participa en la mensajería pero no retransmite el tráfico de otros nodos. El valor por defecto correcto para cualquier cosa que se mueva. |
| **Client** | Interior o portátil — tu nodo de uso diario en casa u oficina | Envía mensajes y ayuda a retransmitir tráfico de la malla. |
| **Client Base** | Recomendado para exteriores — nodos en techo o mástil | Prioriza retransmitir hacia y desde tus nodos favoritos (marca los de interior como favoritos) y ayuda a la malla igual que un Client con el resto del tráfico. |
| **Router / Router Late** | Solo ubicaciones elevadas, permanentes y cuidadosamente elegidas | Prioriza la retransmisión sobre su propia mensajería y altera el comportamiento de temporización de la malla. Solo tiene sentido donde el nodo de verdad puentea cobertura que otros no pueden. |

</div>

<div class="app-paths" role="group" aria-label="Dónde encontrarlo en la app">
<p><span class="platform platform--android">Android</span><span>Radio configuration → Device → Device Role</span></p>
<p><span class="platform platform--ios">iPhone</span><span>Device Configuration → Device → Device Role</span></p>
</div>

<div class="callout callout--warning">
<span class="callout-label">Router no es un "client más potente"</span>
Un rol Router o Router Late cambia cómo un nodo participa en la temporización de la malla y en el enrutamiento por inundación. Ponerlo en un nodo sin una ventaja real de elevación o cobertura añade congestión de tiempo de aire sin añadir cobertura útil — puede hacer la malla local <em>peor</em> para todos. Si no estás seguro de que tu nodo califica, córrelo como Client.
</div>

<span class="badge badge--proposed">Propuesto</span> — los nodos móviles/de mano por defecto a Client Mute; los nodos caseros por defecto a Client; un nodo en techo que retransmite principalmente para tu propio equipo debe correr Client Base con tus nodos interiores como favoritos, no Router Late; Router/Router Late reservado para sitios en techo o cresta confirmados de que extienden cobertura, acordados con otros operadores locales primero.

Para el razonamiento completo detrás de Client Base vs. Router Late — incluyendo por qué un techo configurado como Router Late usualmente añade congestión en lugar de cobertura — consulta [La red mesh de Puerto Rico no tiene backbone](/es/blog/backbone-mesh-puerto-rico-es/).

Si un sitio sí califica como infraestructura, la próxima pregunta es cuál de los tres roles de infraestructura debe correr — `ROUTER` interrumpe a sus vecinos, `ROUTER_LATE` nunca lo hace, y `REPEATER` es invisible para la lista de nodos, el mapa y el traceroute. Consulta [Router, Router Late o Repeater](/es/blog/router-vs-router-late-vs-repeater-es/).

## Máximo de Saltos

Un nodo no puede transmitir y recibir al mismo tiempo — cada salto que toma un mensaje es tiempo de aire que todos los demás nodos tienen que esperar. El límite de saltos topa cuántas veces se puede retransmitir un mensaje antes de que la malla se rinda con él (consulta [Saltos](/es/how-it-works/#saltos)). Más alto no es más seguro; solo significa que un paquete perdido o en bucle quema más tiempo de aire compartido antes de que se descarte.

<div class="table-wrap table-wrap--fit">

| Tipo de nodo | Límite de saltos | Por qué |
|---|---|---|
| Por defecto | 3 | Cubre la mayoría de las rutas reales sin gastar de más en tiempo de aire. |
| Nodo exterior bien conectado | 4 | Solo si de verdad está alcanzando nodos más lejanos a 3 y necesita el alcance extra. |
| Borde de la malla / Client Mute | 5 | Los nodos aislados sin retransmisión más cercana a veces lo necesitan — trátalo como el techo, no el valor por defecto. |

</div>

<div class="app-paths" role="group" aria-label="Dónde encontrarlo en la app">
<p><span class="platform platform--android">Android</span><span>Radio configuration → LoRa → Hop limit</span></p>
<p><span class="platform platform--ios">iPhone</span><span>Radio Configuration → LoRa → Hop limit</span></p>
</div>

<span class="badge badge--proposed">Propuesto</span> — nunca subas de 5. Un nodo configurado a 6+ "por si acaso" no obtiene mejor alcance, solo hace cada entrega fallida más cara para toda la malla.

## Marcar Nodos como Favoritos

Los favoritos no son solo un atajo en la lista de nodos de la app — en los roles de arriba, cambian cómo se comportan dos mecanismos separados. Ambos se basan en la misma lista de favoritos, pero en campos distintos, así que vale la pena ser deliberado sobre a quién marcas como favorito y por qué.

- **La retransmisión prioritaria de Client Base** mira de quién es *o hacia quién va* un paquete. En un nodo Client Base en techo, marca como favorito tu propio equipo interior — equipos de mano, radio base — para que su tráfico tenga primera prioridad a través de la única radio que de verdad tiene vista despejada del cielo.
- **Zero-Cost Hops** (firmware 2.7.11+) mira *qué nodo retransmitió el paquete justo antes que tú*. Preserva el contador de saltos cuando esa retransmisión previa es un Router o Router Late marcado como favorito. Marca como favoritos los sitios legítimos de infraestructura Router/Router Late cerca de ti para que su tráfico no gaste uno de sus saltos solo cruzando tu techo de camino a entrar.

Marcar un Router como favorito **no** convierte un nodo Client Base en algo que repite todo su tráfico — ese es el trabajo del primer mecanismo, y solo aplica a tu propio equipo marcado como favorito. Las dos listas se solapan en la interfaz pero no en efecto.

**En la app:** mantén presionado un nodo en la lista de nodos → **Favorite**.

<span class="badge badge--proposed">Propuesto</span> — en un nodo Client Base en techo: marca como favorito cada nodo tuyo que viva en interiores, más cualquier sitio local legítimo Router/Router Late, luego corre un traceroute antes y después para confirmar que de verdad cambió la ruta.

## Intervalos de Transmisión

Con qué frecuencia un nodo anuncia su posición y telemetría intercambia directamente **frescura** por **tiempo de aire** — cada transmisión es tiempo de aire que todos los demás nodos tienen que esperar. La base de abajo usa transmisión de posición inteligente para los nodos móviles (envía al moverse, no solo por temporizador) e intervalos largos y magros para cualquier cosa estacionaria.

Para entender por qué un nodo fijo de techo con los temporizadores por defecto degrada el alcance de todos, y cómo alargar cada intervalo hasta la base, consulta [Tu nodo estacionario habla demasiado](/es/blog/intervalos-transmision-airtime-es/).

<div class="table-wrap table-wrap--fit">

| Ajuste | Nodos móviles | Nodos estacionarios | Notas |
|---|---|---|---|
| Transmisión de info del nodo | 3 horas | 6 horas | La info del nodo rara vez cambia — no hay necesidad de transmitirla seguido. |
| Transmisión de posición inteligente | Activada — mín. 100 m movidos, mín. 60 seg entre envíos | Desactivada | Envía actualizaciones de posición automáticamente al moverse; un nodo estacionario no se mueve, así que no se necesita el posicionamiento inteligente. |
| Transmisión de posición | 1 hora | 12 horas | Intervalo de respaldo cuando el GPS está activado. La posición de un nodo estacionario es fija, así que un intervalo más largo está bien. |
| Intervalo de actualización GPS | 5 min | 6 horas | Con qué frecuencia el equipo revisa su propia ubicación GPS. Revisiones mínimas están bien cuando el nodo no se mueve. |
| Telemetría del equipo | 1 hora | 6 horas | Batería y voltaje. Importa más en móvil, donde la batería de verdad se está drenando. |
| Telemetría de ambiente | 1 hora | 6 horas | Datos de sensores, si están conectados (temp, humedad, etc). Misma lógica que la telemetría del equipo. |
| Telemetría de energía | N/A | 1 hora | Estadísticas de solar/controlador de carga. La excepción a "fijo = más largo" — la salud de carga de un nodo solar vale la pena revisarla seguido. |
| Reporte al mapa | 1 hora | 6 horas | Envía la posición al servidor del mapa; menos frecuente para un nodo estacionario ya que su posición no cambia. |

</div>

Dónde encontrar cada uno en la app:

<div class="table-wrap table-wrap--fit">

| Ajuste | <span class="platform platform--android">Android</span> | <span class="platform platform--ios">iPhone</span> |
|---|---|---|
| Transmisión de info del nodo | Radio configuration → Device | Device Configuration → Device |
| Posición, posición inteligente, GPS | Radio configuration → Position | Device Configuration → Position |
| Telemetría del equipo, ambiente y energía | Module configuration → Telemetry | Module Configuration → Telemetry |
| Reporte al mapa | Module configuration → MQTT | Module Configuration → MQTT |

</div>

<span class="badge badge--proposed">Propuesto</span> — una base de partida probada en el campo, aún no reajustada para el terreno o la densidad de malla de Puerto Rico. Coordina con operadores cercanos antes de transmitir más frecuentemente que esto en un canal compartido.

<details>
<summary>Position Flags — nodos móviles vs. fijos</summary>

Los Position Flags controlan qué campos viajan dentro de cada paquete de Posición. Menos flags significa un paquete más pequeño y menos tiempo de aire — vale la pena recortarlos en un nodo fijo que no necesita reportar velocidad ni rumbo.

<div class="table-wrap table-wrap--fit">

| Flag | Nodos móviles | Nodos fijos | Notas |
|---|---|---|---|
| Altitud | Activado | Activado | Útil para contexto de cobertura/elevación en cualquier caso. |
| Altitud MSL | Activado | Activado | Referencia sobre el nivel medio del mar, va con Altitud. |
| Velocidad | Activado | Desactivado | Sin sentido en un nodo que nunca se mueve. |
| Rumbo | Activado | Desactivado | Igual — omítelo, ahorra los bytes. |
| Satélites a la vista | Activado | Desactivado | Práctico para diagnosticar la calidad de la ubicación GPS mientras se mueve; la ubicación de un nodo fijo no cambia. |
| Separación geoidal | Desactivado | Activado | Mejora la precisión de elevación en un nodo cuya altitud importa para la planificación. |

</div>

Position Flags y Fixed Position están en la pantalla Position. En un nodo fijo, activa también **Fixed Position**.

<div class="app-paths" role="group" aria-label="Dónde encontrarlo en la app">
<p><span class="platform platform--android">Android</span><span>Radio configuration → Position</span></p>
<p><span class="platform platform--ios">iPhone</span><span>Device Configuration → Position</span></p>
</div>

</details>

## Neighbor Info

Neighbor Info permite que un nodo reporte qué otros nodos puede escuchar directamente, junto con la calidad de señal — esto es lo que convierte la malla de una caja negra en algo que de verdad puedes visualizar y depurar. Activarlo en nodos estacionarios y en techo ayuda a construir una imagen real de la cobertura de Puerto Rico con el tiempo (consulta [Malla de Puerto Rico](/es/pr-mesh/)).

Requiere la app/firmware de Meshtastic 2.2.0 o más nuevo. Activa tanto el módulo como "Transmit Over LoRa".

<div class="table-wrap table-wrap--fit">

| Tipo de nodo | Intervalo de actualización |
|---|---|
| Móvil / de mano | 4 horas |
| Estacionario / en techo | 11 horas |

</div>

<div class="app-paths" role="group" aria-label="Dónde encontrarlo en la app">
<p><span class="platform platform--android">Android</span><span>Module configuration → Neighbor Info</span></p>
<p><span class="platform platform--ios">iPhone</span><span>Module Configuration → Neighbor Info</span></p>
</div>

Activa el módulo y Transmit Over LoRa, y luego fija el intervalo de actualización.

El impacto en la congestión del canal es mínimo en estos intervalos — actívalo, pero no lo pongas agresivamente bajo en nodos con mucha retransmisión. <span class="badge badge--proposed">Propuesto</span>

## MQTT

MQTT es una forma de puentear el tráfico de la malla hacia internet — un nodo con conexión a internet puede publicar lo que escucha a un servidor MQTT, lo que permite que herramientas como paneles de cobertura y mapas de nodos muestren actividad de la malla sin que cada espectador necesite su propia radio.

**Esto es separado de la malla de radio en sí.** Dos nodos de Meshtastic sin ningún acceso a internet pueden aún hablarse por LoRa — ese es todo el punto de la red, y sigue funcionando a través de apagones de internet y celular sin importar MQTT. MQTT solo afecta si esa actividad es *además* visible en línea. Lleva metadatos de diagnóstico — posición, batería, métricas de señal, utilización del canal — no el contenido de canales cifrados ni mensajes privados.

Si sí puenteas un nodo a MQTT, los ajustes importan más allá de las credenciales del broker en sí.

Para un recorrido paso a paso de toda la cadena — root topic, OK to MQTT, solo-uplink, y los ajustes de posición que deciden si apareces — consulta [Cómo poner tu nodo en el mapa de la malla de Puerto Rico](/es/blog/puente-mqtt-mapa-pr-es/).

### Configuración del puente

- **OK to MQTT** — actívalo en los ajustes de LoRa.
- **Uplink activado, downlink desactivado** — en cada canal que puentees.
- **Root topic** — el tráfico de Puerto Rico en el servidor MQTT público se publica bajo **`msh/US/PR`**, siguiendo la estructura estándar `msh/<país>/<región>`. Confirma que esto corresponde al root topic configurado de tu nodo antes de puentear, para que tu tráfico aterrice donde las herramientas de cobertura de PR lo esperan. <span class="badge badge--verified">Verificado</span>

Dónde encontrar cada uno en la app:

<div class="table-wrap table-wrap--fit">

| Ajuste | <span class="platform platform--android">Android</span> | <span class="platform platform--ios">iPhone</span> |
|---|---|---|
| OK to MQTT | Radio configuration → LoRa | Radio Configuration → LoRa |
| Uplink / downlink (por canal) | Radio configuration → Channels | Radio Configuration → Channels |
| Root topic | Module configuration → MQTT | Module Configuration → MQTT |

</div>

<div class="callout callout--warning">
<span class="callout-label">Mantén el downlink desactivado</span>
El downlink canaliza el tráfico MQTT del lado de internet de vuelta a la malla de radio. Dejado activado, puede inundar la malla con tráfico que nunca necesitó llegar a LoRa. Solo-uplink es el valor por defecto seguro para un nodo puente.
</div>

<div class="callout callout--warning">
<span class="callout-label">Aquí no se publican credenciales</span>
Este sitio no publica direcciones de servidores MQTT, nombres de usuario, contraseñas ni claves de canales privados. Si quieres tu nodo puenteado a un servidor de monitoreo comunitario, coordina directamente con el operador de ese servidor — consulta <a href="/es/links/">Enlaces y Recursos</a> y <a href="/es/community/">Comunidad</a>.
</div>

Si corres tu propio puente MQTT, trata las credenciales igual que cualquier otro inicio de sesión de servidor: no las reutilices, y no las subas a un repo público ni a una exportación de configuración.
