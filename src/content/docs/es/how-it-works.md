---
title: Cómo Funciona Meshtastic
description: LoRa, enrutamiento de malla, saltos, intensidad de señal, GPS, canales, cifrado, MQTT y store-and-forward, explicados de forma sencilla.
order: 4
section: Documentación
lang: es
---

## El camino que toma un mensaje

<figure data-hop-stepper data-title="Un mensaje, tres saltos" data-flag="Diagrama conceptual" data-prev="Anterior" data-next="Siguiente" data-step-of="Paso {n} de {total}" data-hops="Saltos restantes" data-legend="Client|Client Mute|Router|Transmite|Lo oye y se calla">
<ol>
<li data-name="Envío">A envía un mensaje en el canal con un límite de 3 saltos. Los nodos 1, 2 y 3 lo oyen. Cada uno que puede retransmitir espera un rato corto y aleatorio antes de hacerlo.</li>
<li data-name="Retransmite el más lejano">El nodo 3 oye a A con la señal más débil, así que espera menos y retransmite primero, con 2 saltos restantes. El nodo 1 oye esa retransmisión y cancela la suya. El nodo 2 es Client Mute y nunca retransmite. A también oye al nodo 3: así sabe que el mensaje salió.</li>
<li data-name="Un Router en lo alto">El nodo 4 es un Router en un cerro. Oye al nodo 3, retransmite con 1 salto restante y llega al nodo 5, al otro lado de la cresta.</li>
<li data-name="Se acaban los saltos">El nodo 5 retransmite con 0 saltos restantes. B recibe el mensaje, pero nadie retransmite un paquete sin saltos, así que el nodo 6 nunca lo recibe. Sube el límite solo si un nodo como el 6 lo necesita: cada salto extra le cuesta tiempo de aire a todos.</li>
<li data-name="Directo a B">Desde 2.6, el próximo mensaje directo a B usa los radios que lo entregaron: los nodos 3, 4 y 5 lo retransmiten y los demás se quedan callados. Solo funciona con mensajes directos. Los mensajes del canal siguen inundando la malla, y si el camino falla, el mensaje directo también vuelve a inundar.</li>
</ol>
<figcaption>Simplificado a partir de la inundación gestionada de Meshtastic: una señal más débil significa una espera más corta, un nodo que oye su paquete retransmitido descarta su copia, y un paquete sin saltos no se retransmite.</figcaption>
</figure>

Tu teléfono no transmite por LoRa en absoluto — se comunica con tu radio por Bluetooth (o USB), y la radio hace la transmisión de largo alcance real. De ahí, el mensaje se mueve de nodo en nodo hasta que llega a su destino o se le acaban los saltos.

## LoRa

**LoRa** (Long Range, largo alcance) es una técnica de modulación de radio que intercambia ancho de banda por alcance y resistencia a la interferencia. Es por lo que una radio de $30 puede enviar de forma confiable un mensaje de texto corto varios kilómetros con línea de vista despejada, con milivatios de potencia — algo que una radio Wi-Fi o Bluetooth no puede hacer. El compromiso es el rendimiento de datos: LoRa está hecho para mensajes pequeños y poco frecuentes, no para transmitir datos en flujo.

## Redes de malla

Una red de **malla** no tiene torre ni estación base central. Cada nodo es un par, y cada nodo puede potencialmente retransmitir tráfico para cualquier otro nodo. Esto es precisamente lo que la hace resiliente durante desastres: no hay un único punto de falla que se pueda tumbar, a diferencia de una torre celular.

## Nodos

Un **nodo** es cualquier equipo que ejecuta el firmware de Meshtastic — un equipo de mano en tu bolsillo, una unidad casera junto a la ventana, un repetidor solar en un cerro. Cada nodo tiene un ID único, y cada nodo que escucha una transmisión aprende sobre el nodo que la envió, construyendo con el tiempo una imagen de la malla local.

## Saltos

Cuando tu nodo no puede alcanzar el destino directamente, otro nodo **retransmite** el mensaje en su nombre — eso es un **salto** (*hop*). Cada mensaje lleva un límite de saltos que topa cuántas veces puede ser retransmitido antes de que la red se rinda con él, lo que evita que un solo mensaje circule por la malla para siempre.

La retransmisión no es una barra libre. Meshtastic usa **inundación gestionada** (*managed flooding*): antes de retransmitir, un nodo escucha brevemente para ver si otro nodo ya retransmitió el mismo paquete, y lo omite si es así. Cuánto espera antes de intervenir depende de la calidad de la señal — los nodos que escuchan una señal *más débil* esperan una ventana aleatoria más corta y tienden a retransmitir primero, ya que es más probable que sean los que extienden el alcance del paquete. Los nodos con el rol Router tienen prioridad y retransmitirán incluso si escuchan que alguien más ya lo hizo.

Más saltos significan más alcance, pero también más tiempo de aire consumido y más retraso. Esta es la razón central por la que la *ubicación* de los nodos importa tanto — un nodo de retransmisión bien ubicado puede convertir un mensaje de 4 saltos en un mensaje de 1 salto para un vecindario entero. También es por lo que las mallas muy grandes se autolimitan: pasado aproximadamente 40 nodos activos dentro del alcance unos de otros, los equipos automáticamente alargan sus propios intervalos de transmisión para que el tiempo de aire compartido no colapse bajo el tráfico rutinario de todos.

<figure data-terrain-profile data-aria="Perfil de elevación de Ponce a Arecibo pasando por Cerro de Punta. Las montañas bloquean el camino directo. Los dos saltos por Cerro de Punta están despejados." data-hop="Salto {n}: {km} km" data-blocked="Bloqueado" data-scale="Altura exagerada unas {x} veces. Antenas a 10 m del suelo.">
<figcaption>Terreno real entre Ponce y Arecibo. La Cordillera Central bloquea el camino directo, así que una radio en Ponce no llega sola a Arecibo. Un solo nodo en Cerro de Punta ve ambos pueblos, y el mensaje llega en dos saltos.</figcaption>
</figure>

## Intensidad de señal

Meshtastic reporta **RSSI** (Received Signal Strength Indicator, indicador de intensidad de señal recibida) para cada nodo que escucha — a grandes rasgos, qué tan fuerte llegó la señal. Números más bajos (más negativos) significan una señal más débil. Es una primera comprobación útil cuando un enlace parece poco confiable, pero el RSSI por sí solo no te dice *por qué* — para eso está el SNR.

## SNR

**SNR** (Signal-to-Noise Ratio, relación señal-ruido) mide cuánto más fuerte es la señal que el ruido de radio de fondo. Un enlace puede tener un RSSI decente pero un SNR pobre si hay mucha interferencia cerca — y un RSSI débil pero limpio puede aún decodificar bien si el SNR es bueno. Mira ambos juntos cuando diagnostiques un enlace marginal.

## GPS

Los equipos con GPS pueden transmitir su posición, que es lo que hace posible los mapas de cobertura y las visualizaciones de Neighbor Info (consulta [Malla de Puerto Rico](/pr-mesh/)). La transmisión de posición es configurable y opcional — un nodo no necesita GPS, ni necesita compartir su posición, para enviar y recibir mensajes.

## Canales

Un **canal** es una clave de cifrado precompartida con nombre que determina quién puede leer un conjunto dado de mensajes. Hay un detalle aquí que sorprende a la gente: el *nombre* del canal no es solo una etiqueta — se convierte en hash para elegir en qué ranura de frecuencia LoRa transmite realmente la radio dentro de la banda de tu región. Dos nodos con el mismo nombre y clave de canal no solo pueden leer los mensajes del otro, están en la misma frecuencia en primer lugar.

Cada equipo viene con un canal público por defecto para que desconocidos puedan probar conectividad entre sí; cualquier cosa que de verdad quieras privada necesita su propio canal con una clave que tú generes y compartas solo con gente en quien confíes. Consulta [Entender los canales](/getting-started/#entender-los-canales) para la configuración práctica.

## Cifrado

Los canales de Meshtastic están cifrados con AES — 128 bits para una clave estándar, 256 bits si generas una más larga — de modo que los nodos sin la clave de canal correspondiente no pueden leer el contenido de los mensajes. Pero aún pueden ver que *un* mensaje pasó por ahí, ya que los metadatos de enrutamiento no se ocultan de la misma manera. El cifrado protege el contenido, no el hecho de que tu nodo exista en la malla.

## MQTT

**MQTT** es un puente opcional desde la malla de radio hacia internet: un nodo con acceso a internet puede publicar lo que escucha a un servidor MQTT, alimentando cosas como mapas públicos de cobertura. Es completamente separado de la malla en sí — LoRa sigue funcionando sin nada de internet involucrado.

Los datos de posición compartidos de esta forma típicamente se redondean a una precisión más gruesa que la ubicación GPS real del nodo antes de publicarse — el mismo ajuste de precisión que gobierna lo que aparece en el [Mapa de Nodos](/map/). MQTT también se puede sobrecargar: el servidor público por defecto carga mucho tráfico en el canal por defecto compartido, y un nodo que sube datos a él puede terminar batallando para mantener el ritmo. Consulta [Configuración Recomendada → MQTT](/settings/#mqtt) para cómo lo usan los operadores de Puerto Rico, y qué deliberadamente no publicamos aquí.

## Store and forward

**Store and forward** (almacenar y reenviar) permite que un nodo capaz guarde mensajes en caché y los reproduzca a equipos que estaban brevemente fuera de alcance o dormidos cuando el mensaje salió por primera vez — útil para nodos que duermen para ahorrar batería, o para poner al día a un equipo de mano después de que se reconecta. Solo funciona en placas con un bloque de memoria interna adicional (PSRAM) para retener la cola de mensajes — las placas basadas en ESP32 mencionadas en [Hardware Recomendado](/hardware/) califican, la mayoría de los equipos de mano nRF52840 más simples no. Una placa con la configuración por defecto típicamente puede retener del orden de varios miles de mensajes recientes antes de que los más viejos venzan.

## MeshCore

**MeshCore** es un firmware de malla LoRa aparte — un proyecto distinto de Meshtastic, que corre en buena parte del mismo hardware, y las dos redes no se hablan entre sí. En este sitio aparece solo donde un recurso compartido cubre ambos, como las tablas de equipos y antenas de [RF Index](https://www.rfindex.com/): una placa listada ahí para MeshCore no se une a la malla de Puerto Rico hasta que le flashees Meshtastic.
