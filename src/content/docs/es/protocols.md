---
title: Meshtastic vs MeshCore
description: En qué se diferencian los dos protocolos de malla LoRa — quién retransmite, enrutamiento, alcance, cifrado, apps y licencias — y por qué PRMSH usa Meshtastic.
order: 6
section: Documentación
lang: es
---

<div class="callout">
<span class="callout-label">Revisado en octubre de 2026</span>
Comparado contra Meshtastic 2.7.26 (estable), Meshtastic 2.8.1 (alpha) y MeshCore 1.18.0. Ambos proyectos cambian rápido — su documentación oficial manda sobre esta página. Comparación adaptada de <a href="https://nodakmesh.org/protocols" target="_blank" rel="noopener">NoDak Mesh</a>.
</div>

Meshtastic y MeshCore envían mensajes de texto por radios LoRa sin servicio celular y sin internet. La diferencia que determina todo lo demás es **quién retransmite**: en Meshtastic, cada nodo puede retransmitir por defecto; en MeshCore, solo los **repetidores** dedicados retransmiten, y las radios personales solo envían y reciben.

**La malla de Puerto Rico usa Meshtastic.** Todo lo demás en este sitio — configuración, roles, el mapa — está escrito para Meshtastic.

## La respuesta corta

<div class="table-wrap table-wrap--fit">

| Escoge Meshtastic si… | Escoge MeshCore si… |
|---|---|
| Quieres que las radios hablen de inmediato, sin configurar nada | Estás armando cobertura de pueblo o región con repetidores en puntos altos |
| Vas de excursión, a un evento, o estás sin infraestructura fija | Muchos usuarios comparten la malla y el tiempo de aire es el cuello de botella |
| Quieres firmware **y** apps totalmente de código abierto | Quieres que los mensajes directos sigan una ruta fija y aprendida |
| Tu malla local usa Meshtastic — **en Puerto Rico, la usa** | Tu malla local usa MeshCore |

</div>

<div class="callout callout--warning">
<span class="callout-label">No se escuchan entre sí</span>
Los dos protocolos usan formatos de paquete, cifrado, palabras de sincronización LoRa y, por lo general, frecuencias distintas. Una radio MeshCore es invisible para la malla Meshtastic de Puerto Rico, y viceversa. La mayoría de las placas corren cualquiera de los dos firmwares, así que puedes regrabarla — pero la identidad, los contactos y la configuración no se transfieren.
</div>

## Lado a lado

<div class="table-wrap table-wrap--fit">

| | Meshtastic | MeshCore |
|---|---|---|
| **Quién retransmite** | Cada nodo por defecto (`CLIENT`), más los routers | Solo repetidores — las radios companion no retransmiten |
| **Cómo viajan los mensajes** | Inundación gestionada; los DM pasan a enrutamiento next-hop cuando conocen la ruta (desde 2.6) | Los canales inundan por los repetidores; los DM inundan una vez y luego siguen una ruta aprendida |
| **Límite de saltos** | 1–7, por defecto 3 | Hasta 63 (rutas de 1 byte), o 32 / 21 con IDs de ruta más grandes |
| **Largo del mensaje** | 200 bytes en las apps | 160 bytes (150 en DM, menos en canales) |
| **Cifrado** | Canales AES, DM con clave pública (2.5), broadcasts firmados (2.8) | Identidades Ed25519, adverts firmados, DM y canales AES-128 |
| **App de teléfono** | Gratis y de código abierto | Gratis; no es de código abierto; una compra dentro de la app quita un temporizador en la gestión remota de repetidores |
| **Licencia del firmware** | GPL-3.0 | MIT |
| **Preset por defecto en EE. UU.** | LongFast — 906.875 MHz, 250 kHz, SF11 | Recomendado — 910.525 MHz, 62.5 kHz, SF7 |
| **Infraestructura necesaria** | Ninguna — dos radios de mano ya forman una malla | Al menos un repetidor para ir más allá del alcance directo |
| **Inicio** | 2020 | 2025 |

</div>

## Cómo mueve cada uno un mensaje

### Meshtastic: inundación gestionada

- Un nodo que escucha un paquete espera un momento y escucha antes de retransmitirlo. Los nodos con señal más débil — normalmente los más lejanos — retransmiten primero, lo que empuja el mensaje hacia afuera.
- El **límite de saltos** (por defecto 3, máximo 7) evita que un mensaje se propague para siempre.
- Desde 2.6, los mensajes directos aprenden una ruta **next-hop** después de una respuesta, y vuelven a inundar si ese vecino deja de responder.
- Los roles fijan cómo retransmite el nodo: `CLIENT` retransmite cuando hace falta, `CLIENT_MUTE` nunca retransmite, `ROUTER` y `ROUTER_LATE` siempre retransmiten. Consulta [Configuración Recomendada](/es/settings/#roles-de-nodo) para ver qué rol le toca a cada nodo en Puerto Rico.
- En 2.8, los broadcasts de fondo bajan su propio límite de saltos cuando la utilización del canal llega a cerca de 20%. El chat mantiene el límite completo.

### MeshCore: repetidores y rutas aprendidas

- Tres roles: **companion** (radio personal, no retransmite), **repeater** (retransmite para todos) y **room server** (un tablón de mensajes con inicio de sesión).
- El primer DM a un contacto inunda la malla. El reporte de entrega del destinatario trae la ruta de vuelta, y el remitente la guarda y la incluye en los mensajes siguientes.
- Los repetidores no guardan tablas de rutas — la ruta vive con el remitente.
- Los mensajes de canal siempre inundan. Los dueños de repetidores pueden limitar hasta dónde llegan.
- Desde 1.14, los IDs de ruta de 2 o 3 bytes evitan colisiones, pero los repetidores anteriores a 1.14 descartan esos paquetes.

## ¿Cuál tiene más alcance?

Ninguno, solo por el protocolo. El alcance por salto depende de la configuración de radio, la potencia, la antena, la altura y el terreno.

- En papel, LongFast (SF11) de Meshtastic tiene unos **4 dB más de presupuesto de enlace** por salto que el preset SF7 de MeshCore.
- El preset más estrecho de MeshCore usa menos tiempo de aire por mensaje y ocupa una franja más pequeña de espectro ruidoso.
- Algunas regiones corren MeshCore en SF8 o SF9, lo que reduce la diferencia.

La cantidad y ubicación de los nodos que retransmiten importa más que el preset — y en el terreno de Puerto Rico eso significa altura. Consulta [Altura vs. potencia](/es/blog/altura-vs-potencia-es/).

## Cifrado y privacidad

- **Meshtastic:** los canales comparten una clave AES, y la clave del canal por defecto es pública. Los DM usan cifrado de clave pública desde 2.5. La versión 2.8 firma los broadcasts, pero por defecto todavía acepta paquetes sin firma de firmware más viejo.
- **MeshCore:** cada nodo tiene su propia clave Ed25519 y firma sus adverts. Los DM usan una clave AES-128 derivada de un secreto compartido. Las claves de canal se comparten, y la del canal Public está publicada.

En ambos sistemas, **cualquiera en la malla puede leer el canal público por defecto**. Usa un canal privado o un mensaje directo para cualquier cosa sensible.

## Apps y hardware

- **Las mismas placas:** Heltec V3 y V4, RAK WisBlock, LilyGo T-Beam, T-Echo, T-Deck y Seeed T1000-E corren cualquiera de los dos firmwares. Consulta [Hardware Recomendado](/es/hardware/).
- **Apps de Meshtastic:** gratis y de código abierto para Android, iPhone y web. Se conectan por Bluetooth, Wi-Fi o USB.
- **App de MeshCore:** la app oficial es gratis en Android, iPhone, escritorio y web, pero de código cerrado. El firmware es abierto, y existen clientes de la comunidad. Equipos autónomos como el T-Deck corren MeshCore sin teléfono.

## Qué hay de nuevo en 2026

### Meshtastic 2.8 (alpha)

<div class="callout callout--warning">
<span class="callout-label">LongTurbo no escucha a LongFast</span>
Los nodos nuevos de EE. UU. configurados en el equipo o con la app actual de Android empiezan en el preset <strong>LongTurbo</strong>. Un nodo en LongTurbo no escucha la malla de Puerto Rico, que usa LongFast. Si una radio nueva no ve a nadie, revisa el preset primero.
</div>

- Broadcasts firmados.
- Los IDs de nodo se derivan de la clave pública, así que los nodos actualizados reciben IDs nuevos.
- Compartir posición en canales públicos y todos los broadcasts de telemetría pasan a ser opcionales (opt-in).
- Escalado automático de saltos y límites de tasa en mallas congestionadas.
- 2.7.26 sigue siendo la versión estable — usa la estable en cualquier nodo del que otros dependan.

### MeshCore 1.18

- Una línea de comandos para radios companion, incluyendo comandos desde contactos autorizados.
- Bluetooth y Wi-Fi juntos en un mismo build companion en varias placas ESP32.
- Un valor por defecto más suave para la detección de bucles en repetidores.
- Se apoya en los IDs de ruta más grandes de 1.14 y en las actualizaciones por aire de 1.15 para companions nRF52.

## Preguntas frecuentes

**¿Meshtastic y MeshCore pueden comunicarse entre sí?**
No. El formato de paquete, el cifrado, la palabra de sincronización y los presets son distintos.

**¿Una misma radio puede cambiar entre ellos?**
Sí, regrabando el firmware. Configura la región y el preset de nuevo después — nada se transfiere.

**¿Cuál es mejor?**
Depende de la red. MeshCore conviene a redes planificadas con repetidores, sobre todo en ciudades densas donde el tiempo de aire escasea. Meshtastic conviene a grupos sin infraestructura fija. En la práctica, usa lo que use tu malla local.

**¿Debo usar MeshCore en Puerto Rico?**
No para llegar a la malla de PRMSH — usa Meshtastic, y una radio MeshCore no la verá. Empieza por [Primeros Pasos](/es/getting-started/).

**¿MeshCore es gratis?**
Sí. El firmware tiene licencia MIT y la app es gratis, con una compra opcional para gestionar repetidores desde el teléfono sin el temporizador.
