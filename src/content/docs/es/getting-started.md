---
title: Primeros Pasos con Meshtastic
description: Todo lo que necesitas para desempacar una radio, unirte a la malla de Puerto Rico y enviar tu primer mensaje.
order: 1
section: Documentación
lang: es
---

## ¿Qué es Meshtastic?

Meshtastic es firmware de código abierto que corre en radios LoRa pequeñas y económicas. Dos o más equipos que lo ejecutan pueden enviar mensajes de texto, compartir posición GPS y retransmitir tráfico entre sí — sin torre celular, sin Wi-Fi, sin factura mensual. Cada radio es un **nodo**. Cuando un mensaje no puede llegar a su destino directamente, los nodos cercanos lo **retransmiten** automáticamente, salto por salto, hasta que llega. Esa retransmisión es lo que la convierte en una *malla* (*mesh*).

En Puerto Rico, donde los huracanes y las fallas de la red eléctrica han dejado repetidamente sin servicio celular por días o semanas, esa propiedad de funcionar sin infraestructura es el punto central. Una radio de bolsillo que sigue comunicándose con tu familia, tu grupo de excursión o tu barrio después de que las torres se apagan vale la pena entenderla antes de necesitarla.

## ¿Qué hardware necesito?

Como mínimo: **una radio LoRa compatible con Meshtastic** y **un teléfono o computadora** para configurarla y leer mensajes. Dos personas que quieran hablarse necesitan dos radios — Meshtastic es una red, no una app de walkie-talkie que funcione sola.

Si aún no has comprado hardware, lee primero [Hardware Recomendado](/es/hardware/) — desglosa los equipos según cómo los vas a usar de verdad (mochila, base en casa, techo, solar) en lugar de listar especificaciones.

## Instalar la app de Meshtastic

1. Instala la app oficial de Meshtastic para [Android](https://play.google.com/store/apps/details?id=com.geeksville.mesh), [iOS](https://apps.apple.com/us/app/meshtastic/id1586432531), o usa el [cliente web/escritorio](https://client.meshtastic.org) por USB.
2. Actualiza tu radio al **firmware estable vigente** antes de configurar nada. Sigue las [instrucciones oficiales de grabado](https://meshtastic.org/docs/getting-started/flashing-firmware/) — el firmware cambia con suficiente frecuencia como para que intencionalmente no repitamos aquí los pasos específicos de cada versión.
3. Empareja la app con tu radio por Bluetooth, o conéctala por cable USB.

<div class="callout callout--warning">
<span class="callout-label">Antes de transmitir</span>
Las regulaciones de radio varían y cambian. Confirma las reglas vigentes que aplican a los equipos LoRa/banda ISM sin licencia en Puerto Rico y el ajuste de región que las cumple antes de transmitir. Este sitio no sustituye la orientación regulatoria oficial.
</div>

## Conectar tu radio

La mayoría de los equipos se conectan por **Bluetooth Low Energy** a la app del teléfono, o por **USB serial** al cliente de escritorio/web. Si el emparejamiento Bluetooth falla, prueba primero una conexión USB directa — descarta problemas del stack Bluetooth del teléfono y te da salida de consola si algo anda mal.

```
meshtastic --port /dev/ttyUSB0 --info
```

Usa el [CLI de Meshtastic](https://meshtastic.org/docs/software/python/cli/) para cualquier cosa más allá de la configuración básica — es programable y te muestra exactamente para qué está configurado un equipo.

## Configurar tu región

Toda radio debe estar configurada a la **región LoRa** correcta, que determina la banda de frecuencia legal y el ciclo de trabajo bajo el que opera. Esto no es opcional ni cuestión de preferencia — debe corresponder al lugar donde la radio opera físicamente.

```
meshtastic --set lora.region US
```

Consulta [Configuración Recomendada → Región y Frecuencia](/es/settings/#región-y-frecuencia) para lo que aplica en Puerto Rico específicamente.

## Elegir un rol de nodo

Las radios nuevas vienen por defecto con un rol **Client** de propósito general, que es la opción correcta para casi todos los que empiezan. Roles como **Client Mute** y **Router** existen para ubicaciones específicas y pueden dañar la red si se aplican mal — lee [Configuración Recomendada → Roles de Nodo](/es/settings/#roles-de-nodo) antes de cambiar esto.

## Unirte a la malla de Puerto Rico

Los nodos de Meshtastic se comunican en **canales** — claves de cifrado y nombres compartidos que determinan quién puede leer tu tráfico. De fábrica, cada equipo viene con un canal primario `LongFast` usando claves por defecto, lo que te permite hablar con *cualquier* nodo Meshtastic cercano en el mundo usando la configuración por defecto. Ese es un buen punto de partida para probar alcance con un amigo.

Para encontrar y coordinar con otros operadores de Puerto Rico, consulta [Malla de Puerto Rico](/es/pr-mesh/) y la página de [Comunidad](/es/community/) — los operadores de nodos comparten regularmente información de cobertura y, donde así lo eligen, detalles adicionales de canales.

## Enviar tu primer mensaje

Abre la app, selecciona un canal y envía un mensaje en el canal `LongFast` por defecto para confirmar que tu radio transmite y recibe. Pruébalo con dos equipos a un cuarto de distancia antes de intentarlo a través de una montaña.

## Entender los canales

Un canal agrupa un **nombre**, una **clave precompartida** y ajustes de módem. Cualquiera con la misma configuración de canal puede descifrar y leer el tráfico en él. Los canales públicos por defecto son exactamente eso — públicos. Trata cualquier cosa sensible como no cifrada por defecto a menos que hayas configurado y distribuido tu propia clave de canal privado.

## Entender los nodos y los saltos

Cada mensaje lleva un **límite de saltos** — el número máximo de veces que otros nodos lo retransmitirán antes de rendirse. Cada retransmisión es un **salto** (*hop*). Un mensaje desde tu equipo de mano hasta un amigo a tres cordilleras de distancia podría tomar tres o cuatro saltos a través de los nodos de otras personas para llegar. Por esto la cobertura depende de la *participación*: mientras más nodos bien ubicados haya en la malla, más lejos viajan los mensajes. Consulta [Cómo Funciona Meshtastic](/es/how-it-works/) para la mecánica, y [Malla de Puerto Rico](/es/pr-mesh/) para dónde está la cobertura actualmente.
