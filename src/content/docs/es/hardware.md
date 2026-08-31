---
title: Hardware Recomendado
description: Una guía centrada en el caso de uso para elegir hardware de Meshtastic en Puerto Rico — de mano, casa, techo, solar y antenas.
order: 2
section: Documentación
lang: es
---

El hardware de Meshtastic va desde placas de desarrollo de $25 hasta repetidores solares hechos a propósito. En lugar de rankear equipos, esta guía está organizada por **dónde lo vas a poner y qué trabajo necesita hacer** — eso decide más sobre el hardware correcto que cualquier hoja de especificaciones.

<div class="callout">
<span class="callout-label">Recomendación de la comunidad, no un respaldo</span>
Todo lo de abajo refleja lo que los operadores de nodos de Puerto Rico han encontrado confiable en la práctica. Los precios y la disponibilidad son aproximados y cambiarán — revisa los listados actuales antes de comprar. Ningún fabricante patrocina esta página, y ten cuidado con las placas y antenas de imitación en los mercados generales; compra de la tienda oficial de una placa o de un vendedor Meshtastic conocido cuando sea posible.
</div>

## Elegir un chip: nRF52840 vs. ESP32

Casi todas las placas de esta página están construidas alrededor de una de dos familias de chips, y vale la pena entender el compromiso antes de elegir un equipo:

- **nRF52840** — consume poquísima energía. Días a semanas con una sola carga, sin Wi-Fi. La opción correcta para cualquier cosa alimentada por batería: equipos de mano, nodos solares.
- **ESP32 / ESP32-S3** — añade Wi-Fi y más capacidad de procesamiento, a costa de la duración de la batería (a menudo 1–2 días con batería interna). Tiene sentido para un nodo que ya está enchufado de todos modos — estación base en casa, repetidor en techo, o gateway Wi-Fi/MQTT.

## Nodos portátiles / de mano

Para una mochila, guantera, clip de cinturón o bolsillo. Prioridades: duración de batería, tamaño y una pantalla que puedas leer al aire libre. Estos casi siempre corren como **Client** o **Client Mute** — consulta [Roles de Nodo](/es/settings/#roles-de-nodo).

- **Punto de entrada económico**: placas como la Seeed Wio Tracker L1 (~$30, 800 mAh, GPS integrado, OLED pequeña) te ponen en la malla barato. La variante L1 Pro (~$43) añade una pantalla más grande y carga solar.
- **Mejor duración de batería**: placas que usan una celda 18650 estándar — la Heltec T114 es un ejemplo común (~$25–45 según la configuración) — pueden estirarse a cerca de una semana entre cargas, frente a 2–3 días para placas más pequeñas de batería fija.
- **Legible bajo el sol**: las pantallas de tinta electrónica se mantienen visibles bajo sol directo y consumen casi nada de energía para retener una imagen — la LILYGO T-Echo (~$60–68) es una elección común, típicamente buena para 5–7 días de uso normal. Las placas de tinta electrónica construidas sobre la radio SX1262 pueden dañarse permanentemente si se encienden sin antena conectada — siempre conecta la antena antes de encender.
- **Premium / más robusto**: placas como la RAK WisMesh Pocket V2 (~$89–99, con certificación IP66, antena SMA externa) cambian tamaño por una batería más grande y mejor sellado — un paso razonable hacia arriba para carga diaria o uso en bote.
- **Rastreadores tipo tarjeta**: rastreadores delgados y sellados como el RAK WisMesh Tag o el SenseCAP T-1000e (~$39 cada uno) cambian pantalla y antena intercambiable por portabilidad — bien como baliza de ubicación, menos útil como equipo de mensajería principal.

Un **estuche con certificación IP** o una bolsa seca barata importa más en la humedad y la lluvia de Puerto Rico que en casi cualquier lugar de EE. UU. continental — inclúyelo en el presupuesto de cualquier placa que no venga ya sellada.

## Tabla comparativa

Una comparación rápida lado a lado de modelos de mano específicos mencionados arriba — útil una vez que lo has reducido a "cuál placa exacta".

<details>
<summary>Mostrar la tabla completa de especificaciones</summary>

<div class="table-wrap">

| Equipo | Batería | Duración estimada | Pantalla | Precio | Mejor para |
|---|---|---|---|---|---|
| Wio Tracker L1 | 800 mAh | ~2–3 días | OLED 0.96" | ~$30 | Opción económica |
| Wio Tracker L1 Pro | 2000 mAh | ~2.5 días | OLED 1.3" | ~$43 | Económica con joystick + solar |
| Heltec T114 | 800–3000 mAh | Hasta una semana (18650) | Color 1.14" | ~$25–45 | Mejor duración de batería |
| LILYGO T-Echo | 850 mAh | ~5–7 días | Tinta electrónica 1.54", legible bajo el sol | ~$60–68 | Gama media, uso al aire libre |
| RAK WisMesh Pocket V2 | 3200 mAh | ~3+ días con GPS activado | OLED 1.3" | ~$89–99 | La mejor en general, robusta IP66 |
| LILYGO T-Deck Plus | 2000 mAh | ~1–2 días | LCD color 2.8", teclado completo | ~$77–87 | Mensajería autónoma, sin teléfono |

</div>

Los precios y las especificaciones cambian a medida que los fabricantes revisan las placas — trata esto como una lista corta de partida, no una hoja de especificaciones final, y confirma los números actuales antes de comprar.

</details>

## Nodos de casa / estacionarios

Nodos interiores que corren con alimentación USB, usualmente colocados cerca de una ventana para el mejor camino de señal de interior a exterior. Esta es la forma más fácil y barata de volverte parte de la malla — la mayor parte de la red está construida con nodos exactamente así. Una placa basada en ESP32 enchufada (consulta la comparación de chips arriba) es una elección razonable y económica aquí ya que la duración de la batería no importa.

- Enchufar y olvidar: elige un equipo que puedas dejar encendido 24/7 sin preocuparte por él.
- La ubicación en la ventana le gana a una radio más potente enterrada en un clóset. LoRa es sensible a la línea de vista; unos pocos pies de posicionamiento importan más que unos pocos dB de potencia de transmisión.

## Nodos en techo / de gran elevación

Instalaciones permanentes destinadas a extender la cobertura para la comunidad más amplia, no solo un hogar. Estos importan más en crestas y techos con línea de vista genuina hacia otros nodos o centros de población — consulta [Malla de Puerto Rico](/es/pr-mesh/) para dónde existen actualmente los huecos de cobertura.

- **Opción económica**: una placa ESP32 enchufada (p. ej. clase Heltec LoRa32 V4, ~$25–30) con una antena externa cubre la mayoría de los despliegues en techo sin necesitar GPS — la posición del nodo se puede fijar manualmente ya que no se está moviendo.
- **Opción de alta potencia**: existen placas potenciadas que corren un módulo LoRa de 1W (30 dBm) para terreno genuinamente difícil de cubrir, pero revisa las cuentas antes de recurrir a una — las reglas de EE. UU. topan la potencia radiada efectiva a 36 dBm, así que una radio de 1W emparejada con una antena de alta ganancia puede acercarse a ese techo rápido. Más potencia no es automáticamente mejor; también eleva tu propia huella de tiempo de aire para todos los cercanos.
- Un gabinete a prueba de intemperie no es negociable — espera sol, aire salado y lluvia de temporada de huracanes.
- Considera si este nodo debe correr como **Router** o **Router Late** — y lee primero la advertencia en [Configuración Recomendada](/es/settings/#roles-de-nodo). Un nodo en techo corrido como Client simple a menudo sigue siendo la mejor opción.

## Nodos solares

Ubicaciones remotas o desatendidas sin alimentación de red confiable — una finca, el inicio de una vereda, una cima sin estructura cerca. Los nodos solares son lo que mantiene la malla viva cuando la red eléctrica no lo hace. Existen kits solares prearmados (panel pequeño + batería + carcasa a prueba de intemperie agrupados) si prefieres no conseguir y encerrar las partes tú mismo — espera cerca de $70–200 según el tamaño del panel y la capacidad de la batería.

- Dimensiona el panel y la batería para el **peor caso de la temporada de lluvia** de Puerto Rico, no una tarde soleada — varios días nublados consecutivos no deberían dejar el nodo fuera de línea.
- Los paquetes de batería LiFePO4 manejan el calor mejor que el litio-ion genérico, lo que importa para cualquier cosa montada al aire libre bajo sol directo.
- Presupuesta para una configuración de sueño/ciclo de trabajo de bajo consumo si el despliegue necesita sobrevivir con un panel pequeño.

<details>
<summary>Elegir un sitio — herramientas, lista de verificación y flujo de trabajo</summary>

Un nodo solar usualmente es permanente y difícil de reubicar una vez montado, así que vale la pena verificar el sitio antes de que se atornille nada. No confíes en un solo mapa — combina un predictor de cobertura, una herramienta de visibilidad de terreno y una visita física al sitio.

**Herramientas que vale la pena usar juntas:**

- **[Meshtastic Site Planner](https://site.meshtastic.org/)** — la herramienta oficial de planificación, y el mejor punto de partida. Ingresa coordenadas, altura de antena, frecuencia, potencia y ganancia, y predice la cobertura a partir de datos de elevación del terreno. El modo punto a punto revisa la línea de vista, el despeje de la zona de Fresnel y el margen de enlace entre dos sitios; "Snap to highest point" ayuda a sacar a la luz puntos elevados prometedores cercanos.
- **[HeyWhatsThat](https://www.heywhatsthat.com/)** — visibilidad de terreno de 360° desde un solo punto. Ingresa la ubicación candidata y la altura de antena para ver qué terreno es realmente visible desde ahí — útil para detectar una cresta o cerro que bloqueará silenciosamente parte de tu cobertura.
- **[HeyWhatsThat WISP](https://wisp.heywhatsthat.com/)** — línea de vista y despeje de zona de Fresnel entre dos puntos específicos, con una calificación que muestra cuánto de la primera zona de Fresnel está sin obstruir. Más útil una vez que ya tienes un segundo nodo o área en mente que alcanzar.
- **[MeshSight](https://ranfty.github.io/meshsight/)** — planificador de cobertura RF con consciencia del terreno construido específicamente para LoRa/Meshtastic. Mapea el alcance de señal predicho desde un sitio candidato antes de que despliegues, usando los datos de terreno directamente en lugar de una calculadora RF genérica.

**Cinco cosas que verificar antes de comprometerte:**

1. **Elevación** — más alto generalmente es mejor, pero un sitio un poco más bajo con una vista genuinamente despejada puede ganarle a uno más alto encajonado por terreno o edificios.
2. **Línea de vista de radio** — revisa el perfil del terreno hacia lo que de verdad quieres alcanzar, no solo la distancia en línea recta.
3. **Despeje de Fresnel** — una línea visible entre dos antenas no es suficiente; la primera zona de Fresnel también necesita un despeje razonable, que el Site Planner modela directamente.
4. **Exposición solar** — una revisión aparte de la RF. Usa imágenes satelitales o una herramienta de trayectoria solar para confirmar que nada — árboles, edificios, el mástil de antena de un vecino — dará sombra al panel durante el año.
5. **Obstrucciones del mundo real** — las herramientas de terreno modelan elevación, no árboles ni edificios. La propia documentación del Site Planner es explícita sobre esta limitación; trata su salida como una predicción a verificar en sitio, no una garantía.

**Flujo de trabajo**: ubicaciones candidatas → Site Planner → HeyWhatsThat → imágenes satelitales para exposición solar → visita física al sitio → prueba de campo.

<div class="table-wrap">

| Factor | Cómo se ve un buen candidato |
|---|---|
| Elevación | Alta respecto al área circundante |
| Línea de vista | Despejada hacia los nodos o áreas que importan |
| Zona de Fresnel | Mayormente sin obstruir |
| Exposición solar | Fuerte, todo el año — sin sombra estacional |
| Árboles / estructuras | Mínimos cerca de la antena y el panel |
| Altura de antena | Tan alta sobre los alrededores como sea práctico |
| Malla existente | Ya puede escuchar o alcanzar varios nodos útiles |
| Acceso | Realista para la instalación y el mantenimiento futuro |

</div>

La simulación es predicción, no prueba — haz pruebas de campo a los finalistas antes de hacer algo permanente. El módulo Range Test integrado de Meshtastic (Modules → Range Test) es la forma práctica de confirmar que un sitio candidato rinde como predijeron las herramientas.

</details>

## Antenas

La antena usualmente importa más que la radio a la que está conectada.

**Omnidireccional vs. direccional**

<div class="table-wrap">

| Tipo | Patrón de radiación | Úsala para |
|---|---|---|
| Omnidireccional | Cobertura horizontal de 360° | La mayoría de nodos en techo y casa — cobertura en todas las direcciones |
| Direccional (yagi) | Enfocada en una dirección | Puentear dos puntos específicos, distantes y conocidos |

</div>

**Puntos de partida por modelo de antena** — los resultados del mundo real varían según el terreno y la altura de montaje, pero estas son elecciones comunes y bien consideradas en la comunidad:

<div class="table-wrap">

| Antena | Ganancia | Precio aprox. | Mejor para |
|---|---|---|---|
| Rokland 5.8 dBi fibra de vidrio | 5.8 dBi | ~$30–40 | Techo de propósito general (32" de alto) |
| Rokland 8 dBi bajo perfil | 8 dBi | ~$50 | Terreno plano, alcance máximo |
| ALFA AOA-915-5ACM | 5 dBi | ~$25–35 | Montaje exterior compacto (7" de alto) |
| RAK WisMesh Blade | ~3 dBi | ~$15–20 | Exterior económico |
| Látigo de 17cm (SMA) | — | ~$12 | Mejora de mano sobre el stub de fábrica |
| Cuello de ganso 4 dBi (SMA) | 4 dBi | ~$20–25 | Mejora de mano, orientación más tolerante |

</div>

- **Tipo de conector**: la mayoría de las placas vienen con conectores **SMA** o **U.FL/IPEX** — confirma cuál antes de pedir una antena, y usa un adaptador pigtail en lugar de forzar un conector incompatible.
- **Coincidencia de frecuencia**: una antena sintonizada para la banda equivocada transmitirá mal aunque encaje físicamente. Empátala con tu región y frecuencia LoRa configuradas.
- **Ganancia y terreno**: una antena omnidireccional de 5–6 dBi es un valor por defecto razonable para un techo suburbano. En terreno montañoso — que describe gran parte del interior de Puerto Rico — más ganancia no es automáticamente mejor: la ganancia cambia ángulo de cobertura vertical por alcance horizontal, así que el haz estrecho de una antena de 8–10 dBi puede de hecho pasar por debajo de nodos cercanos que están por encima o por debajo de ella en elevación. Una antena más moderada de 3–5 dBi a menudo rinde mejor una vez que el terreno se pone empinado. Las antenas direccionales (yagi) tienen sentido para puentear dos puntos específicos, distantes y conocidos, en lugar de cobertura de área general.
- **La altura de montaje** mejora el alcance de línea de vista de forma más confiable que casi cualquier otro cambio individual — una antena mediocre en alto le gana consistentemente a una gran antena en el alféizar de una ventana.
- **La pérdida de cable** se acumula rápido a estas frecuencias. Usa coaxial LMR-240 o mejor, y mantén los tramos exteriores a 10 pies o menos donde sea práctico — cada pie extra de cable barato calladamente te devuelve ganancia que pagaste en la antena.
- **Impermeabilización**: sella cada conector exterior con cinta selladora de coaxial de calidad, no solo cinta eléctrica — el aire salado y la lluvia encontrarán cualquier hueco en una temporada.

Para números reales de ganancia y alcance en modelos de antena específicos, consulta los [Meshtastic Antenna Reports](https://github.com/meshtastic/antenna-reports) — un conjunto de datos colaborativo, enviado por la comunidad de operadores de todo el mundo. No está revisado por Meshtastic PR, pero es una segunda opinión útil más allá de las hojas de especificaciones del fabricante. Si haces tus propias pruebas de antena aquí en Puerto Rico, considera enviar un reporte ahí también.

Para la otra mitad del cuadro — si la antena de verdad está sintonizada a 915 MHz — [RF Index](https://www.rfindex.com/mesh/antennas) publica mediciones de VSWR en banco y gráficas de barrido de SWR para modelos específicos, junto con especificaciones y enlaces de compra. Los reportes de campo te dicen cómo se comportó una antena en el aire; un barrido de SWR te dice cuánta potencia refleja de vuelta al radio en lugar de radiarla. Vale la pena leer ambos antes de comprar, y una antena barata que barre mal en 915 MHz es la razón más común de que un nodo rinda por debajo de su hoja de especificaciones. RF Index lo mantiene la comunidad de Austin Mesh y cubre hardware de MeshCore además de Meshtastic, así que verifica a cuál se refiere cada ficha. No está revisado por Meshtastic PR.

## Vendedores confiables

Las placas y antenas de imitación circulan en los mercados generales, vendidas como si fueran la placa genuina — compra de la tienda oficial de un fabricante o de uno de los vendedores de abajo cuando sea posible.

<div class="table-wrap">

| Vendedor | Sitio | Conocido por |
|---|---|---|
| Rokland | store.rokland.com | Con base en EE. UU., envío rápido, fuerte selección de antenas |
| RAK Wireless | store.rakwireless.com | WisMesh Pocket, Repeater, Tag, potenciador de 1W |
| B&Q Consulting | shop.uniteng.com | Station G2, Nano G2 Ultra — equipo RF con enfoque de ingeniería |
| Muziworks | muzi.works | Estuches, antenas, la R1 Neo — ensamblada en EE. UU. |
| Seeed Studio | seeedstudio.com | Wio Tracker, SenseCAP, Solar P1 |
| Atlavox | atlavox.com | Nodos solares prearmados y accesorios |
| PeakMesh (Etsy) | Tienda Etsy | Nodos solares prearmados sobre hardware RAK, envía desde FL |

</div>

## Nodos solares prearmados (sin ensamblaje requerido)

Si conseguir un panel, batería, controlador de carga y gabinete por separado no te atrae, varios pequeños armadores venden nodos solares totalmente ensamblados listos para montar y encender:

<div class="table-wrap">

| Equipo | Solar | Batería | GPS | Precio aprox. | Dónde |
|---|---|---|---|---|---|
| RAK WisMesh Repeater | Integrado | Integrada | No | ~$70–90 | RAK Wireless |
| SenseCAP Solar P1 Pro | Panel de 5W | 4× 18650, incluidas | Sí | ~$90 | Seeed Studio |
| Atlavox Beacon | Integrado | Integrada | Sí | ~$150–200 | Atlavox |
| Nodo solar Heltec V4 | Panel de 25W | 6× 18650 | No | ~$120–180 | Armadores de Etsy |

</div>

La tienda Etsy de PeakMesh se especializa en esta categoría y es una recomendación frecuente por sus montajes bien construidos y discretos:

<div class="table-wrap">

| Modelo | Solar | Batería | Precio aprox. | Mejor para |
|---|---|---|---|---|
| MicroMag | Panel de 1W | 18650 de 3500 mAh | ~$85 | Montaje sigiloso en poste o letrero |
| Ultimate | 2× paneles de 1W | 2× 21700 de 5000 mAh | ~$135 | Máxima duración de batería |
| Altitude | Solar | 2× 21700 de 5000 mAh | ~$130 | Despliegues colgados de árboles |
| Birdhouse | Solar | 2× 21700 de 5000 mAh | ~$135 | Disfrazado de casita de pájaros |
| Magnet Climber | Solar | 2× 21700 de 5000 mAh | ~$135 | Montaje magnético, antena de 5 dBi incluida |

</div>

Como siempre: esta es una lista de partida, no un respaldo — los precios y el inventario se mueven rápido en los armados de lote pequeño de Etsy, y ninguno de estos vendedores patrocina esta página.

## Comparación de hardware

Cada categoría de arriba, lado a lado — precio, batería, GPS, impermeabilización y el compromiso principal de cada una.

<details>
<summary>Mostrar la tabla comparativa completa</summary>

<div class="table-wrap">

| Equipo | Precio aprox. | Batería | GPS | Pantalla | Conector de antena | Impermeable | Listo para solar | Uso recomendado | Compromiso |
|---|---|---|---|---|---|---|---|---|---|
| De mano económico (p. ej. clase Wio Tracker L1) | ~$30 | 800 mAh, 2–3 días | Sí, integrado | OLED pequeña | U.FL / IPEX | No, necesita estuche | Solo la variante L1 Pro | Primer equipo, aprender la app | La batería pequeña limita el uso de varios días |
| De mano de batería larga (p. ej. clase Heltec T114) | ~$25–45 | 18650 intercambiable, hasta ~1 semana | Sí, integrado | TFT color | U.FL / IPEX | No, necesita estuche | Entrada solar en algunas variantes | Carga diaria, viajes largos | Más voluminoso una vez que se coloca una celda 18650 |
| De mano de tinta electrónica (p. ej. clase LILYGO T-Echo) | ~$60–68 | ~850 mAh, 5–7 días | Sí, integrado | Tinta electrónica, legible bajo el sol | U.FL / IPEX | Mejor sellado que las placas de desarrollo | Con panel adicional | Carga al aire libre/EDC, viajes de varios días | Nunca encender sin la antena conectada |
| De mano premium robusto (p. ej. clase RAK WisMesh Pocket) | ~$89–99 | ~3200 mAh, 3+ días con GPS activado | Sí, integrado | OLED | SMA externa | Sí, IP66 | Sí, entrada solar | Bote, uso diario, entornos duros | Mayor costo inicial |
| Placa de casa/techo enchufada (p. ej. clase Heltec LoRa32 V4) | ~$25–30 | Ninguna — alimentada por red/USB | No, se fija manualmente | OLED pequeña | Externa | Depende del gabinete | Con panel externo + controlador de carga | Estación base en casa, nodo económico en techo | Sin respaldo de batería a menos que añadas uno |
| Kit de repetidor solar prearmado | ~$70–200 | Integrada, dimensionada al panel | Varía según el modelo | Usualmente ninguna (desatendido) | SMA externa | Sí, hecho a propósito | Sí, construido para eso | Nodos de cobertura desatendidos en techo/cima | El costo más alto; necesita un sitio de montaje genuino |

</div>

Los nombres de equipos de arriba describen **clases de hardware** comunes en el ecosistema de Meshtastic — la revisión de placa específica dentro de cada clase cambia a medida que los fabricantes iteran, y la disponibilidad se mueve seguido. Contrasta las especificaciones actuales contra la [lista oficial de hardware de Meshtastic](https://meshtastic.org/docs/hardware/devices/) antes de comprar, y confirma el soporte de firmware para lo que elijas.

¿Buscas ir más allá de las placas de arriba — sensores externos, armados inusuales, placas menos comunes? Consulta la [lista de hardware y sensores de Awesome Meshtastic](https://github.com/SignalGap/awesome-meshtastic#hardware-and-sensors) mantenida por la comunidad para una recopilación más amplia y colaborativa. No está revisada por Meshtastic PR — trátala como un punto de partida, no una recomendación.

Para una placa que no esté en la lista corta de arriba, [RF Index](https://www.rfindex.com/mesh/devices) compara equipos lado a lado con especificaciones actuales, precios y enlaces de compra. La tabla de arriba es una lista corta curada para Puerto Rico; RF Index es el catálogo amplio contra el cual verificar un modelo específico. También lista equipos de MeshCore, así que confirma que una placa corra Meshtastic antes de ordenar.

</details>
