---
title: Configuración Recomendada
description: Guía de configuración de la comunidad de Puerto Rico para región, roles de nodo, intervalos de transmisión, Neighbor Info y MQTT.
order: 3
section: Documentación
lang: es
---

Estos son **valores por defecto propuestos por la comunidad** — no valores por defecto oficiales del proyecto Meshtastic, y no un sustituto de la documentación vigente del firmware. Donde un ajuste depende de un comportamiento del firmware que cambia entre versiones, se indica explícitamente.

La guía de intervalos y roles de abajo parte de valores que otras redes comunitarias de Meshtastic ya han probado en el campo, adaptados como base para Puerto Rico. Son un punto de partida, no una recomendación terminada específica de PR — espera que estos números se ajusten a medida que más operadores de Puerto Rico reporten qué funciona de verdad para nuestro terreno y densidad de malla.

<div class="callout callout--warning">
<span class="callout-label">Verifica antes de depender de esto</span>
Los ajustes de abajo se marcan como <span class="badge badge--verified">Verificado</span> cuando varios operadores de Puerto Rico los han confirmado en el campo, o <span class="badge badge--proposed">Propuesto</span> cuando son un punto de partida razonable que aún no se ha probado ampliamente en el campo. Trata "Propuesto" como un lugar para empezar a experimentar, no como una recomendación asentada.
</div>

## Región y Frecuencia

Meshtastic requiere que cada equipo declare una **región LoRa**, que fija la banda de frecuencia legal, los límites de potencia y el ciclo de trabajo para donde opera la radio. <span class="badge badge--verified">Verificado</span>

```
meshtastic --set lora.region US
```

Puerto Rico cae bajo la asignación de frecuencia de Estados Unidos para la banda ISM sin licencia que usa Meshtastic. Configura tu región en consecuencia, y confírmalo contra la [lista oficial de regiones de Meshtastic](https://meshtastic.org/docs/configuration/radio/lora/#region) — esta lista se mantiene upstream y es la fuente autoritativa, no esta página.

No adivines una región ni copies una de la comunidad de otro país. Un ajuste de región incorrecto puede transmitir fuera de los límites legales y no se comunicará de forma confiable con los nodos locales configurados correctamente.

La región no es lo único que fija tu frecuencia. El **nombre del canal primario** se hashea a un slot de frecuencia, así que renombrarlo, reordenar canales o importar un QR de canal puede mover un nodo fuera de la frecuencia regional sin avisar — consulta [El canal que moviste no era un canal — era tu frecuencia](/es/blog/orden-canales-slot-frecuencia-es/) para saber cómo pasa eso y cuándo fijar `lora.channel_num` a propósito.

## Roles de Nodo

Elegir el rol correcto importa más para la salud de la malla compartida que casi cualquier otro ajuste.

| Rol | Caso de uso | Notas |
|---|---|---|
| **Client Mute** | Nodos móviles — mochilas, vehículos, equipos de mano personales | Participa en la mensajería pero no retransmite el tráfico de otros nodos. El valor por defecto correcto para cualquier cosa que se mueva. |
| **Client** | Nodos residenciales y comunitarios estacionarios | Retransmite tráfico para la malla mientras sigue siendo un nodo de mensajería normal. Buen valor por defecto para un nodo casero cerca de una ventana. |
| **Client Base** | Nodos en techo que retransmiten principalmente para tus propios equipos interiores | Se comporta exactamente como Client para el tráfico de todos los demás — solo prioriza retransmitir hacia/desde nodos que hayas marcado como favoritos. Sin una lista de favoritos configurada, es un Client con pasos extra. |
| **Router / Router Late** | Solo ubicaciones elevadas, permanentes y cuidadosamente elegidas | Prioriza la retransmisión sobre su propia mensajería y altera el comportamiento de temporización de la malla. Solo tiene sentido donde el nodo de verdad puentea cobertura que otros no pueden. |

```
meshtastic --set device.role CLIENT
```

<div class="callout callout--warning">
<span class="callout-label">Router no es un "client más potente"</span>
Un rol Router o Router Late cambia cómo un nodo participa en la temporización de la malla y en el enrutamiento por inundación. Ponerlo en un nodo sin una ventaja real de elevación o cobertura añade congestión de tiempo de aire sin añadir cobertura útil — puede hacer la malla local *peor* para todos. Si no estás seguro de que tu nodo califica, córrelo como Client.
</div>

<span class="badge badge--proposed">Propuesto</span> — los nodos móviles/de mano por defecto a Client Mute; los nodos caseros por defecto a Client; un nodo en techo que retransmite principalmente para tu propio equipo debe correr Client Base con tus nodos interiores como favoritos, no Router Late; Router/Router Late reservado para sitios en techo o cresta confirmados de que extienden cobertura, acordados con otros operadores locales primero.

Para el razonamiento completo detrás de Client Base vs. Router Late — incluyendo por qué un techo configurado como Router Late usualmente añade congestión en lugar de cobertura — consulta [La red mesh de Puerto Rico no tiene backbone](/es/blog/backbone-mesh-puerto-rico-es/).

## Máximo de Saltos

Un nodo no puede transmitir y recibir al mismo tiempo — cada salto que toma un mensaje es tiempo de aire que todos los demás nodos tienen que esperar. El límite de saltos topa cuántas veces se puede retransmitir un mensaje antes de que la malla se rinda con él (consulta [Saltos](/es/how-it-works/#saltos)). Más alto no es más seguro; solo significa que un paquete perdido o en bucle quema más tiempo de aire compartido antes de que se descarte.

<div class="table-wrap">

| Tipo de nodo | Límite de saltos | Por qué |
|---|---|---|
| Por defecto | 3 | Cubre la mayoría de las rutas reales sin gastar de más en tiempo de aire. |
| Nodo exterior bien conectado | 4 | Solo si de verdad está alcanzando nodos más lejanos a 3 y necesita el alcance extra. |
| Borde de la malla / Client Mute | 5 | Los nodos aislados sin retransmisión más cercana a veces lo necesitan — trátalo como el techo, no el valor por defecto. |

</div>

```
meshtastic --set lora.hop_limit 3
```

<span class="badge badge--proposed">Propuesto</span> — nunca subas de 5. Un nodo configurado a 6+ "por si acaso" no obtiene mejor alcance, solo hace cada entrega fallida más cara para toda la malla.

## Marcar Nodos como Favoritos

Los favoritos no son solo un atajo en la lista de nodos de la app — en los roles de arriba, cambian cómo se comportan dos mecanismos separados. Ambos se basan en la misma lista de favoritos, pero en campos distintos, así que vale la pena ser deliberado sobre a quién marcas como favorito y por qué.

- **La retransmisión prioritaria de Client Base** mira de quién es *o hacia quién va* un paquete. En un nodo Client Base en techo, marca como favorito tu propio equipo interior — equipos de mano, radio base — para que su tráfico tenga primera prioridad a través de la única radio que de verdad tiene vista despejada del cielo.
- **Zero-Cost Hops** (firmware 2.7.11+) mira *qué nodo retransmitió el paquete justo antes que tú*. Preserva el contador de saltos cuando esa retransmisión previa es un Router o Router Late marcado como favorito. Marca como favoritos los sitios legítimos de infraestructura Router/Router Late cerca de ti para que su tráfico no queme uno de sus siete saltos solo cruzando tu techo de camino a entrar.

Marcar un Router como favorito **no** convierte un nodo Client Base en algo que repite todo su tráfico — ese es el trabajo del primer mecanismo, y solo aplica a tu propio equipo marcado como favorito. Las dos listas se solapan en la interfaz pero no en efecto.

```
meshtastic --set-favorite-node !a1b2c3d4
```

La misma acción está disponible en la app: mantén presionado un nodo en la lista de nodos → **Favorito**.

<span class="badge badge--proposed">Propuesto</span> — en un nodo Client Base en techo: marca como favorito cada nodo tuyo que viva en interiores, más cualquier sitio local legítimo Router/Router Late, luego corre un traceroute antes y después para confirmar que de verdad cambió la ruta.

## Intervalos de Transmisión

Con qué frecuencia un nodo anuncia su posición y telemetría intercambia directamente **frescura** por **tiempo de aire** — cada transmisión es tiempo de aire que todos los demás nodos tienen que esperar. La base de abajo usa transmisión de posición inteligente para los nodos móviles (envía al moverse, no solo por temporizador) e intervalos largos y magros para cualquier cosa estacionaria.

Para entender por qué un nodo fijo de techo con los temporizadores por defecto degrada el alcance de todos, y cómo alargar cada intervalo hasta la base, consulta [Tu nodo estacionario habla demasiado](/es/blog/intervalos-transmision-airtime-es/).

<div class="table-wrap">

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

<details>
<summary>Comandos CLI — móvil y estacionario</summary>

```
# Nodos móviles
meshtastic --set position.position_broadcast_secs 3600
meshtastic --set position.gps_update_interval 300
meshtastic --set position.broadcast_smart_minimum_distance 100
meshtastic --set position.broadcast_smart_minimum_interval_secs 60
meshtastic --set position.position_broadcast_smart_enabled true
meshtastic --set telemetry.device_update_interval 3600
meshtastic --set telemetry.environment_update_interval 3600

# Nodos estacionarios
meshtastic --set position.position_broadcast_secs 43200
meshtastic --set position.gps_update_interval 21600
meshtastic --set position.position_broadcast_smart_enabled false
meshtastic --set telemetry.device_update_interval 21600
meshtastic --set telemetry.environment_update_interval 21600
meshtastic --set telemetry.power_update_interval 3600
```

</details>

<span class="badge badge--proposed">Propuesto</span> — una base de partida probada en el campo, aún no reajustada para el terreno o la densidad de malla de Puerto Rico. Coordina con operadores cercanos antes de transmitir más frecuentemente que esto en un canal compartido.

<details>
<summary>Position Flags — nodos móviles vs. fijos</summary>

Los Position Flags controlan qué campos viajan dentro de cada paquete de Posición. Menos flags significa un paquete más pequeño y menos tiempo de aire — vale la pena recortarlos en un nodo fijo que no necesita reportar velocidad ni rumbo.

<div class="table-wrap">

| Flag | Nodos móviles | Nodos fijos | Notas |
|---|---|---|---|
| Altitud | Activado | Activado | Útil para contexto de cobertura/elevación en cualquier caso. |
| Altitud MSL | Activado | Activado | Referencia sobre el nivel medio del mar, va con Altitud. |
| Velocidad | Activado | Desactivado | Sin sentido en un nodo que nunca se mueve. |
| Rumbo | Activado | Desactivado | Igual — omítelo, ahorra los bytes. |
| Satélites a la vista | Activado | Desactivado | Práctico para diagnosticar la calidad de la ubicación GPS mientras se mueve; la ubicación de un nodo fijo no cambia. |
| Separación geoidal | Desactivado | Activado | Mejora la precisión de elevación en un nodo cuya altitud importa para la planificación. |

</div>

```
# Móvil
meshtastic --set position.position_flags ALTITUDE,ALTITUDE_MSL,SPEED,HEADING,SATINVIEW

# Fijo
meshtastic --set position.position_flags ALTITUDE,ALTITUDE_MSL,GEOIDAL_SEPARATION
meshtastic --set position.fixed_position true
```

</details>

## Neighbor Info

Neighbor Info permite que un nodo reporte qué otros nodos puede escuchar directamente, junto con la calidad de señal — esto es lo que convierte la malla de una caja negra en algo que de verdad puedes visualizar y depurar. Activarlo en nodos estacionarios y en techo ayuda a construir una imagen real de la cobertura de Puerto Rico con el tiempo (consulta [Malla de Puerto Rico](/es/pr-mesh/)).

Requiere la app/firmware de Meshtastic 2.2.0 o más nuevo. Activa tanto el módulo como "Transmit Over LoRa" — la app de iOS actualmente no puede configurar este módulo, así que usa el cliente web o el CLI en su lugar.

<div class="table-wrap">

| Tipo de nodo | Intervalo de actualización |
|---|---|
| Móvil / de mano | 4 horas |
| Estacionario / en techo | 11 horas |

</div>

<details>
<summary>Comandos CLI</summary>

```
meshtastic --set neighbor_info.enabled true
meshtastic --set neighbor_info.transmit_over_lora true
meshtastic --set neighbor_info.update_interval 39600   # 11h, estacionario — usa 14400 (4h) para móvil
```

</details>

El impacto en la congestión del canal es mínimo en estos intervalos — actívalo, pero no lo pongas agresivamente bajo en nodos con mucha retransmisión. <span class="badge badge--proposed">Propuesto</span>

## MQTT

MQTT es una forma de puentear el tráfico de la malla hacia internet — un nodo con conexión a internet puede publicar lo que escucha a un servidor MQTT, lo que permite que herramientas como paneles de cobertura y mapas de nodos muestren actividad de la malla sin que cada espectador necesite su propia radio.

**Esto es separado de la malla de radio en sí.** Dos nodos de Meshtastic sin ningún acceso a internet pueden aún hablarse por LoRa — ese es todo el punto de la red, y sigue funcionando a través de apagones de internet y celular sin importar MQTT. MQTT solo afecta si esa actividad es *además* visible en línea. Lleva metadatos de diagnóstico — posición, batería, métricas de señal, utilización del canal — no el contenido de canales cifrados ni mensajes privados.

Si sí puenteas un nodo a MQTT, los ajustes importan más allá de las credenciales del broker en sí.

Para un recorrido paso a paso de toda la cadena — root topic, OK to MQTT, solo-uplink, y los ajustes de posición que deciden si apareces — consulta [Cómo poner tu nodo en el mapa de la malla de Puerto Rico](/es/blog/puente-mqtt-mapa-pr-es/).

<details>
<summary>Configuración del puente — ajustes requeridos y root topic</summary>

- Activa **"OK to MQTT"** bajo los ajustes de LoRa.
- Por canal, configura **Uplink activado, Downlink desactivado**.
- Root topic — el tráfico de Puerto Rico en el servidor MQTT público se publica bajo **`msh/US/PR`**, siguiendo la estructura estándar `msh/<país>/<región>`. Confirma que esto corresponde al root topic configurado de tu nodo antes de puentear, para que tu tráfico aterrice donde las herramientas de cobertura de PR lo esperan. <span class="badge badge--verified">Verificado</span>

</details>

<div class="callout callout--warning">
<span class="callout-label">Mantén el downlink desactivado</span>
El downlink canaliza el tráfico MQTT del lado de internet de vuelta a la malla de radio. Dejado activado, puede inundar la malla con tráfico que nunca necesitó llegar a LoRa. Solo-uplink es el valor por defecto seguro para un nodo puente.
</div>

<div class="callout callout--warning">
<span class="callout-label">Aquí no se publican credenciales</span>
Este sitio no publica direcciones de servidores MQTT, nombres de usuario, contraseñas ni claves de canales privados. Si quieres tu nodo puenteado a un servidor de monitoreo comunitario, coordina directamente con el operador de ese servidor — consulta <a href="/es/links/">Enlaces y Recursos</a> y <a href="/es/community/">Comunidad</a>.
</div>

Si corres tu propio puente MQTT, trata las credenciales igual que cualquier otro inicio de sesión de servidor: no las reutilices, y no las subas a un repo público ni a una exportación de configuración.
