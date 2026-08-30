---
title: "Presupuesto de energía para un nodo que sobreviva un apagón largo"
description: La aritmética detrás de dimensionar un nodo solar de Meshtastic para el peor escenario de Puerto Rico — a dónde se va la energía de verdad, nRF52 vs. ESP32, el ciclo del GPS, las trampas de voltaje en los paneles, y el problema del calor tropical que casi nadie planifica.
pubDate: 2026-08-19
author: WP4TZV
category: Node Builds
tags: [solar, energia, gps, bateria]
readingTime: 15 min
lang: es
translationKey: power-budget-solar-node
---

# Presupuesto de energía para un nodo que sobreviva un apagón largo

Toda conversación sobre nodos Meshtastic solares llega tarde o temprano a la misma pregunta: ¿cuánto aguanta cuando se va el sol?

En Puerto Rico esa pregunta no es teórica. Aquí se va la luz. A veces horas, a veces semanas. Y el escenario para el que la gente diseña —una noche oscura— es el fácil. El difícil son cinco días nublados seguidos en plena temporada de huracanes, que es exactamente cuando uno querría que la malla funcionara.

Este post es la aritmética. Qué gasta el nodo de verdad, dónde está la diferencia entre las dos familias de microcontroladores, cómo dimensionar un panel que **recupere** en vez de solo empatar, y la cosa del calor tropical que arruina diseños que por lo demás están bien.

## Primero: dónde se va la energía de verdad

El instinto es mirar las transmisiones. Ese instinto está equivocado, y el tamaño del error es lo más útil de este post.

Para cualquier nodo que esté escuchando —o sea, cualquier nodo que no esté dormido— **el receptor domina todo lo demás junto.** Un receptor LoRa en RX continuo no le importa si hay tráfico o no. Consume esperando.

Saquemos los números de un beacon de posición en LongFast. Usando la fórmula de tiempo al aire de Semtech, un paquete de 16 bytes en SF11/250 kHz toma unos **354 ms** al aire. Un paquete de posición real de Meshtastic, con encabezados, es más grande — digamos de 40 a 60 bytes, que da entre 550 y 700 ms.

Tomemos 500 ms como cifra redonda y pongámosle precio:

| Radio | Corriente TX | Energía por beacon | 48 beacons/día (cada 30 min) |
|---|---|---|---|
| SX1262 @ 22 dBm | ~118 mA | 0.016 mAh | **0.8 mAh/día** |
| Módulo E22 @ 30 dBm | ~600 mA | 0.083 mAh | **4.0 mAh/día** |

Ahora el receptor, corriendo continuo:

| Plataforma | Corriente RX | Por día |
|---|---|---|
| Nodo nRF52840 | ~15 mA | **360 mAh/día** |
| Nodo ESP32 | ~50 mA | **1,200 mAh/día** |

Mira la proporción. Un beacon de posición cada 30 minutos cuesta cerca del **0.2%** del presupuesto diario de un nodo nRF52 a 22 dBm, y como **1%** a 30 dBm.

De ahí sale la primera conclusión real:

> Espaciar los intervalos de telemetría no hace prácticamente nada por la batería. Si lo estás haciendo para ahorrar energía, estás optimizando el término equivocado por dos órdenes de magnitud.

Sigue habiendo una razón excelente para espaciarlos —el tiempo al aire en un canal compartido, que es el argumento de la congestión— pero eso es sobre ser buen vecino, no sobre tu batería.

## El GPS es lo caro, no el beacon

Esto es lo que la gente realmente quiere decir cuando dice "las actualizaciones de posición me acaban la batería". No es la transmisión. Es el receptor que produce la posición.

Tomemos un módulo común como referencia. El Quectel L76K está especificado en **29 mA** en adquisición y rastreo, y las placas que le añaden LNA y filtro SAW miden alrededor de **41 mA** activo con **360 µA** en reposo. El tiempo al primer fijo es de **menos de 30 segundos en frío** y **menos de 2 segundos en caliente**.

Esa diferencia entre frío y caliente es todo el juego, y vuelvo a ella enseguida.

| Estrategia de GPS | Costo diario |
|---|---|
| Siempre encendido (40 mA continuos) | **~960 mAh/día** |
| Ciclado (ver tabla abajo) | 2–25 mAh/día |
| Apagado, posición fija configurada | **0** |

El GPS siempre encendido cuesta casi **tres veces** el presupuesto completo de un nodo nRF52. Ciclarlo baja eso uno o dos órdenes de magnitud. Apagarlo es gratis.

Para un nodo fijo de techo o de torre la respuesta es obvia: configura una posición fija y deshabilita el GPS. Ya sabes dónde está el nodo. No se va a mover.

**Pero hay una trampa, y conecta con el post de los relojes.** Si tu placa no tiene RTC de hardware, el GPS puede ser su única fuente buena de hora. Lo apagas y el nodo cae a la hora de malla — el escalón de menor prioridad, el que está pensado para dispositivos sin configurar. Habrás ahorrado casi mil mAh al día y creado exactamente el síntoma del que escribí: un nodo que no logra mantener la hora correcta y que se ve sordo en el monitor.

Si vas a apagar el GPS en una placa sin RTC, o aceptas que el nodo depende de escuchar una fuente mejor, o le pones un RTC. En un diseño donde el GPS **es** la fuente de hora del sistema, ese intercambio hay que hacerlo a propósito, no descubrirlo después.

## Intervalos de sondeo del GPS: el cruce que nadie menciona

En un nodo móvil no puedes simplemente apagar el GPS, así que la pregunta pasa a ser cada cuánto sondearlo. Y hay un resultado nada obvio escondido en las cifras de TTFF.

Tienes dos estrategias:

**Mantener viva la alimentación de respaldo.** El módulo conserva sus efemérides y su base de tiempo, así que cada fijo es un arranque caliente — unos 2 segundos más el asentamiento, digamos 5 s a 40 mA. El precio son 360 µA continuos, que son **8.6 mAh/día** sondees o no.

**Cortarle la corriente por completo.** Cero consumo en reposo, pero cada fijo es un arranque en frío: 30 segundos a 40 mA, aproximadamente **0.33 mAh por fijo**, quince veces lo que cuesta uno caliente.

Con precios:

| Intervalo | Fijos/día | Caliente (respaldo vivo) | Frío (apagado total) |
|---|---|---|---|
| 5 min | 288 | 24.7 mAh/día | 96 mAh/día |
| 15 min | 96 | 14.0 mAh/día | 32 mAh/día |
| 30 min | 48 | 11.3 mAh/día | 16 mAh/día |
| 1 h | 24 | 9.9 mAh/día | 8.0 mAh/día |
| 4 h | 6 | 8.9 mAh/día | 2.0 mAh/día |
| 12 h | 2 | 8.7 mAh/día | 0.7 mAh/día |

Las dos columnas se cruzan alrededor de los **45 minutos**. De ahí sale una regla fácil de recordar:

> Sondeando más seguido que ~45 min: mantén viva la alimentación de respaldo y aprovecha los arranques calientes.
> Sondeando menos seguido que ~45 min: córtale la corriente al módulo y cómete el arranque en frío.

Y fíjate en la parte de arriba de la columna caliente: una vez que tienes ese piso de 8.6 mAh/día, estirar de 30 minutos a 4 horas te ahorra 2.4 mAh/día. Nada. Si vas a mantener el respaldo vivo de todos modos, sondea tan seguido como de verdad lo necesites — el intervalo sale casi gratis.

**Una salvedad que manda sobre todo lo anterior:** si el GPS es también tu fuente de hora del sistema (sin RTC de hardware), no le puedes cortar la corriente sin perder la base de tiempo. El respaldo se queda vivo diga lo que diga la aritmética.

### Qué configurar de verdad, según el MCU

La recomendación cambia porque cambia el **denominador**.

**nRF52840 — vale la pena ajustarlo.** La base anda por 360 mAh/día. El GPS sondeando cada 5 minutos son ~25 mAh/día, o sea 7% del presupuesto; cada 30 minutos son ~11 mAh/día, un 3%. Significativo, y barato de mejorar.

| Caso de uso | Intervalo | Estrategia |
|---|---|---|
| Nodo fijo | GPS apagado, posición fija | — |
| Posición ocasional | 30–60 min | Respaldo vivo |
| Muy infrecuente | 4–12 h | Apagado total |
| Rastreo real | 30–120 s | Respaldo vivo, acepta ~25–40 mAh/día |

**ESP32 / ESP32-S3 — ni te molestes.** La base anda por 1,200 mAh/día. El GPS sondeando cada 5 minutos son ~25 mAh/día, un **2%** del presupuesto. Podrías borrar el GPS por completo y apenas se notaría en la gráfica.

Si estás tratando de ahorrar energía en un nodo ESP32, el intervalo del GPS es la perilla equivocada por muchísimo. Apaga la pantalla, deshabilita el WiFi si no estás usando MQTT, y activa el sueño ligero — eso vale de diez a cincuenta veces más que cualquier cosa que le hagas al GPS. Y si aún así necesitas más, cambia de plataforma.

Y algo que conviene activar sin importar el MCU: **el broadcast inteligente de posición**, que suprime las transmisiones cuando el nodo en realidad no se ha movido. No reduce el costo del GPS, pero evita que un nodo "móvil" que está quieto ande anunciando las mismas coordenadas todo el día quemando tiempo al aire compartido.

## nRF52 vs ESP32: la diferencia es estructural

Las dos familias corren el mismo SX1262. El desempeño LoRa es esencialmente idéntico cuando la antena es igual — la diferencia está toda en lo que hace el microcontrolador alrededor.

**ESP32 / ESP32-S3.** Doble núcleo, WiFi, más RAM. En modo de recepción LoRa la corriente típica anda entre **40 y 80 mA**. Medido en un despliegue real: un Heltec V3 con pantalla, BLE y un mensaje por minuto promedia unos **130 mA**, que con una batería de 2,500 mAh da alrededor de **19 horas**. Eso es un nodo sin ningún margen solar.

**nRF52840.** Diseñado para wearables y sensores, con consumo mucho menor tanto en reposo como activo. En una comparación controlada, el consumo atribuible a activar Bluetooth en un módulo nRF52840 *ni siquiera era medible*.

El modo de sueño ligero cambia el panorama pero no cierra la brecha: activarlo lleva a un dispositivo ESP32 de una docena de horas a más de cien, mientras que la plataforma nRF52 ya viene baja de fábrica y llega a cientos de horas con ese mismo ajuste.

Lo que eso significa traducido a hardware que hay que comprar y montar:

| | Nodo nRF52840 | Nodo ESP32 |
|---|---|---|
| Carga diaria (escuchando, sin GPS) | ~1.3 Wh | ~4.4 Wh |
| Batería para 7 días de autonomía | ~3,400 mAh (un 18650) | ~10,500 mAh (tres o cuatro) |
| Panel para aguantar un día nublado de 1 HSP | ~2 W | ~6–7 W |

Eso es una diferencia de **3 a 4 veces tanto en banco de baterías como en panel**, para un nodo haciendo el mismo trabajo. Para un nodo con corriente de pared, o un portátil que cargas todas las noches, el ESP32 está bien y encima te da WiFi y MQTT. Para un sitio solar desatendido, la elección de plataforma es la mayor parte de tu presupuesto energético decidida antes de escribir una sola línea de configuración.

## El rol que escogiste es una decisión de energía

Esta es la parte que conecta con el primer post de la serie.

Un nodo `CLIENT_MUTE` puede dormir agresivamente — nunca retransmite, así que perder paquetes mientras duerme no le cuesta nada a la malla. Un `CLIENT` puede ciclar algo. Un `ROUTER`, `ROUTER_LATE` o `CLIENT_BASE` **no puede dormir de forma significativa**, porque un receptor dormido es un receptor que pierde el paquete que se suponía que retransmitiera.

Así que cuando decides que tu nodo de torre va a ser `ROUTER`, también decidiste que corre un receptor continuo para siempre. No hay modo de ahorro compatible con ser infraestructura. Presupuesta en consecuencia: los roles de infraestructura son los caros, y ese costo es el precio del trabajo, no un error de configuración.

## Dimensionar el panel: tiene dos trabajos, no uno

El error de dimensionamiento más común es tratar el panel como si solo tuviera que cubrir la carga diaria. Tiene que hacer eso **y** reponer lo que el periodo nublado drenó. Un panel dimensionado para empatar exactamente nunca se recupera — simplemente deja la batería donde la dejó la última mala semana.

El método:

**1. Mide tu carga real.** No una cifra de hoja de datos. Ponle un medidor con registro al nodo por varias horas y lee vatios-hora o amperios-hora acumulados — un multímetro común no sirve, porque necesitas la integral, no una lectura instantánea. Córrelo en su configuración real, con su rol real, por lo menos unas horas.

**2. Aplica pérdidas honestas.** La cifra de placa del panel es un número de laboratorio:

| Pérdida | Factor |
|---|---|
| Suciedad, salitre, envejecimiento | 0.90 |
| Temperatura de celda (ver abajo) | 0.80–0.85 |
| Eficiencia del convertidor MPPT | 0.90–0.95 |
| Ida y vuelta de la batería | 0.95 |
| **Combinado** | **≈ 0.65–0.70** |

**3. Dimensiona para el peor sol realista, no para el promedio.** San Juan promedia unas 5 a 5.5 horas solares pico al año. Durante una racha nublada sostenida sacas **1 a 1.5**. Si dimensionas para el promedio anual, tu nodo se muere justo cuando el tiempo está malo — que coincide casi perfectamente con cuando no hay luz.

**4. Después sobredimensiona para recuperar.** Una vez drenada la reserva, el panel necesita excedente por encima de la carga diaria para reponerla. Regla útil: dimensiona para el peor caso de horas solares y multiplica por 1.5 a 2 para tener margen de recarga.

### Los paneles se venden como "6V 5W" — y el voltaje es la parte que importa

Todo anuncio te da dos números: un voltaje nominal y un vataje. Casi todo el mundo lee el vataje e ignora el voltaje. Para lo que estamos haciendo, eso está al revés.

**El vataje determina qué tan rápido cargas. El voltaje determina si cargas del todo con poca luz.**

Esa segunda frase es el problema completo de los días nublados. Con nublado fuerte la corriente del panel se desploma **y** su voltaje se hunde. Un panel con apenas suficiente margen de voltaje a pleno sol no produce nada aprovechable bajo nubes, porque el cargador nunca llega a su umbral de arranque. Terminas con un nodo que carga precioso los días que no lo necesita y nada los días que sí.

Para un sistema de una sola celda de litio (4.2 V a plena carga), así se comportan de verdad los nominales comunes:

| El anuncio dice | Vmp (real) | Voc (circuito abierto) | Para litio 1S |
|---|---|---|---|
| **5V** | ~5.0–5.5 V | ~6.0–6.5 V | Marginal — se cae por debajo del arranque del cargador con nublado |
| **6V** | ~5.5–6.5 V | ~7.0–7.5 V | El emparejamiento habitual. Margen suficiente para seguir trabajando con poca luz |
| **9V** | ~8–9 V | ~10–11 V | Más margen con poca luz; más pérdida si el cargador es lineal en vez de MPPT |
| **12V** | ~17–18 V | **~21–22 V** | ⚠️ Trampa. "12V" nominal son en realidad ~21 V en circuito abierto |
| **18V** | ~18–20 V | **~22–23 V** | ⚠️ Misma trampa, peor |

De esa tabla salen dos reglas:

**Diseña contra el Voc, no contra el número del anuncio.** El voltaje de circuito abierto es lo que ve tu cargador antes de que se le extraiga carga, y anda entre 20 y 25% por encima del Vmp. Un panel de "12V 10W" le va a presentar unos 21 V a una entrada de cargador que quizás esté especificada para mucho menos. Esta es una forma común y cara de destruir un controlador de carga, y el anuncio no te avisa de nada. Compara el máximo absoluto de entrada de tu cargador contra el **Voc** del panel, y deja margen.

**El margen de voltaje es tu seguro para días nublados.** Ese es el argumento real para escoger 6V en vez de 5V en un sistema 1S, y no cuesta nada.

### Dimensionando en las unidades en las que vas a comprar

Pasando el método de arriba hasta los números de un anuncio, con peor sol de 1.2 HSP y pérdidas de sistema de 0.68:

| Nodo | Carga diaria | Equilibrio | Con recuperación 2× | Tamaño común más cercano |
|---|---|---|---|---|
| nRF52, GPS apagado | ~1.35 Wh/día | 1.7 W | 3.4 W | **6V 5W** |
| nRF52, GPS ciclado | ~1.5 Wh/día | 1.8 W | 3.7 W | **6V 5W** |
| ESP32, optimizado (sin pantalla/WiFi, sueño ligero) | ~4.4 Wh/día | 5.4 W | 10.8 W | **6V 10W** |
| ESP32, sin optimizar (pantalla + BLE, ~130 mA) | ~11.5 Wh/día | 14.1 W | 28 W | **12V 30W** ⚠️ revisa el Voc |

Esa última fila es el argumento de toda la sección de plataformas en una línea. **Un nodo ESP32 sin optimizar necesita alrededor de seis veces el panel de un nodo nRF52** — y te empuja a la clase de 12V, donde está esperando la trampa del Voc.

Si necesitas más de unos 10 W y quieres quedarte en la clase de 6V, dos paneles de 6V en paralelo te dan la corriente sin subir el voltaje. Conectarlos en serie duplica el voltaje y te mete de cabeza en el problema de arriba.

## Días nublados: qué significa "autonomía" de verdad

Autonomía es capacidad de batería dividida entre carga diaria, ajustada por qué tan profundo estás dispuesto a descargar.

Para un nodo nRF52 con 1.3 Wh/día, con un 18650 de 3,400 mAh a 3.7 V y 80% de profundidad de descarga:

```
Energía utilizable = 3.4 Ah × 3.7 V × 0.8 = 10.1 Wh
Autonomía          = 10.1 Wh / 1.3 Wh por día ≈ 7.7 días
```

Casi ocho días de oscuridad total. Eso es una cifra de grado huracán, con una sola celda.

El mismo cálculo para un nodo ESP32 a 4.4 Wh/día da unos **2.3 días** con la misma celda. Para llegar a una semana necesitas tres o cuatro.

Dos cosas que se comen esto en silencio:

- **La profundidad de descarga es una decisión de vida útil.** Llevar el litio al 100% de descarga repetidamente te cuesta la mayor parte de los ciclos. 80% es un compromiso razonable; 50% es lo que escogerías si quieres que el nodo dure años sin visitarlo.
- **Una batería muerta no arranca limpio.** Si el paquete cae por debajo del corte de protección, algunos controladores de carga no reinician con un panel débil en poca luz. El nodo entonces se queda muerto toda la racha nublada aunque *haya* algo de sol. Vale la pena revisar cómo se comporta tu cargador con entrada baja.

## El problema tropical que nadie menciona: el calor

Este es el que agarra a los diseños buenos.

Los controladores de carga de litio dejan de cargar por encima de unos 45 °C, y hacen bien — cargar una celda de litio caliente la degrada rápido y es un asunto real de seguridad. Ahora imagina una caja negra sellada en un techo puertorriqueño en agosto. Temperaturas internas de 55 a 70 °C son perfectamente alcanzables.

O sea: **en los días de más sol, cuando tienes más energía disponible, tu cargador puede estar negándose a cargar.**

Y empeora. La salida del panel también cae con la temperatura — el silicio pierde alrededor de 0.4% por cada °C sobre 25 °C, y la temperatura de celda en un techo de aquí anda muy por encima de la ambiente. Además el envejecimiento calendario del litio se acelera fuerte con el calor, así que un paquete que debería durar cinco años puede durar dos.

Qué hacer:

- **Caja de color claro y ventilada.** No negra. Es el arreglo más barato que existe y el que más se salta la gente.
- **Separa térmicamente la batería del panel.** No montes el paquete directamente detrás del panel, donde le cae el sol y además el calor de desecho del panel.
- **Usa un cargador con lazo real de sensado de temperatura** (un NTC en el paquete, perfil JEITA) para que module en vez de cargar a ciegas una celda caliente.
- **Considera LiFePO4.** Rango de temperatura utilizable más amplio, muchísima mejor vida en ciclos, mucho mejor margen de seguridad térmica. El costo es menor densidad de energía y una celda de 3.2 V nominales que necesita otro cargador y una etapa elevadora para alimentar lógica de 3.3 V. Para un sitio tropical desatendido, ese intercambio suele inclinarse del lado del LiFePO4.

## Ejemplo trabajado: un CLIENT_BASE de techo que debe aguantar una semana

Requisitos: placa nRF52840, `CLIENT_BASE`, sin GPS (posición fija configurada), sin pantalla, siete días de autonomía, y que después se recupere.

```
Carga
  RX continuo, ~15 mA @ 3.7 V           = 1.33 Wh/día
  Beacon cada 30 min @ 22 dBm           ≈ 0.003 Wh/día  (despreciable)
  Total                                 ≈ 1.35 Wh/día

Batería
  7 días × 1.35 Wh / 0.8 de descarga    = 11.8 Wh
  @ 3.7 V                               = 3,200 mAh → un buen 18650

Panel
  Peor sol: 1.2 HSP
  Pérdidas del sistema: 0.68
  Punto de equilibrio = 1.35 / (1.2 × 0.68) = 1.65 W
  Con margen de recuperación 2×             ≈ 3.5 W
```

Un panel **6V 5W** y un solo 18650. Ese es un nodo genuinamente pequeño, barato y montable en un techo, que aguanta una semana sin sol y después se recarga — y la clase de 6V le deja suficiente margen de voltaje para seguir cargando bajo nubes.

Corre los mismos requisitos con un ESP32 y aterrizas en cuatro celdas y un panel de 10 W — un problema mecánico completamente distinto, otra caja, otro montaje.

## Lista de comprobación

1. **Mide la carga real** con un medidor con registro, en el rol y la configuración reales del nodo.
2. **Nodos fijos: pon posición fija y apaga el GPS.** El mayor ahorro disponible. Revisa primero si la placa tiene RTC.
3. **Nodos móviles: escoge la estrategia de GPS según el intervalo.** Más rápido que ~45 min, mantén viva la alimentación de respaldo para arranques calientes. Más lento que eso, córtale la corriente por completo. En ESP32, sáltate esto — arregla el sueño ligero, la pantalla y el WiFi.
4. **Escoge el microcontrolador por el despliegue**, no por la lista de características. nRF52 para solar desatendido, ESP32 donde necesites WiFi/MQTT o tengas corriente de pared.
5. **Dimensiona el panel para el peor sol y después duplícalo**, para que pueda recuperar y no solo empatar.
6. **Lee el Voc del panel, no el nominal del anuncio**, y compáralo con el máximo absoluto de entrada de tu cargador. Un panel de "12V" son en realidad ~21 V en circuito abierto.
7. **Dimensiona la batería para el apagón que de verdad esperas**, al 80% de descarga o menos.
8. **Resuelve el calor antes de que él te resuelva a ti.** Caja clara, ventilada, cargador con sensado de temperatura, LiFePO4 si aguantas los intercambios.
9. **No pierdas tiempo ajustando intervalos de telemetría por la batería.** Ajústalos por el tiempo al aire — esa sí es la razón que se sostiene.

---

**Fuentes**

- [LoRa Airtime & Duty-Cycle Calculator](https://d-central.tech/lora-airtime-calculator/) — cifras de tiempo al aire para LongFast según Semtech AN1200.13
- [Compare the power consumption of Meshtastic devices](https://tutoduino.fr/en/power-consumption-meshtastic/) — mediciones de banco, Heltec V3 vs XIAO ESP32S3 vs XIAO nRF52840
- [Especificaciones del Quectel L76K](https://www.4gltemall.com/quectel-l76k.html) — corriente en adquisición y rastreo, TTFF frío vs caliente
- [Hoja de datos del módulo L76K GNSS](https://files.seeedstudio.com/wiki/SenseCAP/SenseCAP_LoRaWAN_Starter_Kit/109100021_L76K%20GNSS%20Module%20for%20Seeed%20Studio%20XIAO%20Datasheet.pdf) — cifras de activo y reposo a nivel de módulo
- [Meshtastic Hardware Guide](https://smartnmagic.com/blogs/solutions/meshtastic-hardware-the-complete-guide) — rangos de corriente en modo recepción del ESP32
- [How to Measure Device Power Consumption](https://openelab.io/blogs/getting-started/meshtastic-guide-how-to-measure-device-power-consumption) — método de medición
- [Supported Hardware Overview](https://meshtastic.org/docs/hardware/devices/) — documentación de Meshtastic sobre características de energía por plataforma
- Posts anteriores: *La red mesh de Puerto Rico no tiene backbone*, *Nodos fuera de hora*, *Altura vs. potencia*

*73 de WP4TZV*
