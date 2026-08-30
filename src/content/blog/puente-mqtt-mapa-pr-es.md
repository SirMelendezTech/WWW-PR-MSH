---
translationKey: mqtt-bridge-pr-map
title: "Cómo poner tu nodo en el mapa de la malla de Puerto Rico"
description: Qué tiene que ser cierto para que tu nodo aparezca en el mapa de cobertura de PR — el root topic MQTT msh/US/PR, OK to MQTT, solo-uplink, y los ajustes de posición que deciden si apareces.
pubDate: 2026-08-30
author: Meshtastic PR
category: Tutorials
tags: [mqtt, mapa, msh-us-pr, monitor]
readingTime: 8 min
lang: es
---

# Cómo poner tu nodo en el mapa de la malla de Puerto Rico

El [Mapa de Nodos](/es/map/) se construye con lo que los nodos publican a MQTT bajo el tema de Puerto Rico. Si tu nodo no está ahí, no es un error del mapa — significa que tu nodo no está puenteando a MQTT, no publica bajo el tema que el mapa lee, o no envía posición. Los tres se arreglan en unos minutos.

Este post recorre toda la cadena. Nada de esto cambia cómo tu nodo habla por LoRa — MQTT es un canal lateral hacia internet, y la malla de radio sigue funcionando durante apagones sin importar MQTT. Consulta [Configuración Recomendada → MQTT](/es/settings/#mqtt) para la tabla de referencia que esto amplía.

## Qué requiere realmente "estar en el mapa"

Cuatro cosas tienen que alinearse:

1. **Tu nodo alcanza internet.** O el nodo tiene WiFi/Ethernet, o un teléfono con la app está puenteando sus paquetes. Un nodo sin ruta a internet nunca publica nada.
2. **MQTT está activado y apuntando al servidor público** con el root topic correcto.
3. **"OK to MQTT" está activado**, y el canal que quieres visible tiene **uplink activado**.
4. **Tu nodo envía una posición.** Sin paquete de posición, no hay marcador — el mapa no tiene nada que colocar.

Si falla cualquiera, eres invisible, normalmente sin ningún error que te diga cuál.

## El root topic es la parte que la gente equivoca

Meshtastic construye el tema MQTT completo a partir de un **root topic** que tú configuras, más el nombre del canal y otros segmentos que añade automáticamente. El tráfico de Puerto Rico en el servidor público vive bajo:

```
msh/US/PR
```

siguiendo la estructura estándar `msh/<país>/<región>`. El mapa de PR y las herramientas de cobertura se suscriben a esa ruta. Si tu root topic sigue siendo el valor por defecto del firmware (`msh`) o algo personalizado, tus paquetes van *a algún lado* — pero no a donde nada en Puerto Rico está escuchando.

Configúralo y confírmalo antes de asumir que el puente está roto:

```
meshtastic --set mqtt.root msh/US/PR
meshtastic --get mqtt.root
```

## El resto de los ajustes MQTT

```
meshtastic --set mqtt.enabled true
meshtastic --set mqtt.address mqtt.meshtastic.org
meshtastic --set lora.config_ok_to_mqtt true
```

`config_ok_to_mqtt` (aparece como **"OK to MQTT"** en las apps) es una bandera a nivel de firmware que le dice a otros nodos que tu tráfico puede subirse. Sin ella, un nodo puente bien portado no reenviará tus paquetes aunque todo lo demás esté correcto.

Luego, **por canal**, activa uplink y desactiva downlink:

```
meshtastic --ch-set uplink_enabled true --ch-index 0
meshtastic --ch-set downlink_enabled false --ch-index 0
```

El canal índice 0 es tu primario. Activa uplink solo en canales que de verdad quieras reflejados a internet.

### Deja el downlink desactivado

El downlink canaliza el tráfico MQTT del lado de internet de vuelta a la malla de radio. En un canal compartido eso significa que cada paquete de cada nodo puenteado en cualquier lado compite por airtime local que nunca necesitó gastarse. Solo-uplink es el valor por defecto correcto para un nodo puente de Puerto Rico — estás aportando visibilidad, no importando carga. Es el mismo razonamiento detrás de mantener [los intervalos de transmisión largos en nodos estacionarios](/es/blog/intervalos-transmision-airtime-es/).

## Aún necesitas enviar una posición

El mapa coloca un marcador donde tu nodo dice que está. Esa posición puede venir de:

- un GPS a bordo con fix, o
- una **posición fija** que configuras manualmente en un nodo que no se mueve.

Para un nodo de techo o base, la posición fija suele ser lo correcto — es precisa, cuesta cero airtime adquirirla, y no deriva:

```
meshtastic --setlat 18.2013 --setlon -67.1397
meshtastic --set position.fixed_position true
```

Si prefieres no transmitir una ubicación precisa, Meshtastic te deja reducir la **precisión de posición** para que el mapa muestre un área aproximada en lugar de tu techo exacto. El mapa nunca afina una posición más allá de lo que tu nodo reporta — ese control se queda enteramente en tu equipo.

## Cuánto tarda en aparecer

El mapa se reconstruye con los datos del monitor, no se actualiza en vivo en tu navegador. Después de que tu nodo publique su primera posición bajo `msh/US/PR`, espera verlo en el próximo refresco — minutos a unas horas, no al instante. Si sigue faltando después de eso:

- Revisa `meshtastic --get mqtt` y confirma `enabled: true`, `root: msh/US/PR`, y un `address` alcanzable.
- Confirma que el nodo tiene una ruta real a internet (la app muestra el estado de MQTT).
- Confirma que el nodo de verdad ha enviado una posición — revisa que su propio campo de posición esté poblado.
- Confirma que uplink está activado en el canal primario.

## Qué expone y qué no expone MQTT

Lleva metadatos de diagnóstico: posición (a la precisión que elijas), batería, métricas de señal, utilización de canal. **No** lleva el contenido de canales cifrados ni mensajes directos. Puentear un nodo a MQTT hace visible su *actividad* en línea; no hace públicos tus mensajes.

Si corres tu propio broker en lugar del servidor público, trata esas credenciales como cualquier otro inicio de sesión de servidor — no las reutilices, y no las subas a un repo público ni a una exportación de configuración.

---

Una vez que estás en el mapa, también eres parte del panorama de cobertura que la comunidad usa para planear dónde deben ir los próximos nodos — consulta [Malla de Puerto Rico](/es/pr-mesh/).
