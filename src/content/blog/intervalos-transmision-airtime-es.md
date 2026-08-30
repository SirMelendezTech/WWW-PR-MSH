---
translationKey: broadcast-intervals-airtime
title: "Tu nodo estacionario habla demasiado"
description: La mala configuración más común en la malla de Puerto Rico — un nodo fijo de techo transmitiendo con temporizadores de nodo móvil — y la matemática de airtime que explica por qué degrada el alcance de todos.
pubDate: 2026-08-30
author: WP4TZV
category: Field Reports
tags: [intervalo-transmision, airtime, utilizacion-canal, congestion]
readingTime: 9 min
lang: es
---

# Tu nodo estacionario habla demasiado

Cada paquete que envía tu nodo es tiempo en el que ningún otro nodo del canal puede transmitir. LoRa con los ajustes que usa Puerto Rico es lento — un solo paquete de posición puede ocupar el aire una buena fracción de segundo, y solo un nodo al alcance puede hablar a la vez. Así que la pregunta que de verdad importa para un nodo de techo no es "qué tan fresca está mi telemetría" — es "cuánto del canal compartido estoy gastando, y en qué".

La respuesta más común, en los nodos que revisamos, es: muchísimo, en información que nunca cambia.

## A dónde se va el airtime

Un nodo estacionario con los valores por defecto del firmware a menudo transmite:

- su **posición** cada 15 minutos — una posición que, por definición, es fija
- **telemetría de dispositivo** (batería, voltaje) cada 30 minutos
- **node info** cada par de horas
- y, si está activada, telemetría ambiental y de potencia en temporizadores similares

Multiplica eso por cada nodo en un área densa y suma las retransmisiones que genera cada salto, y un canal que debería estar mayormente inactivo está en cambio ocupado varios por ciento del tiempo — a veces bien entrado en dos dígitos. Meshtastic expone esto como **utilización de canal** y **airtime** en las métricas del dispositivo. Por encima de aproximadamente 25% de utilización, las colisiones de paquetes suben rápido y la malla empieza a descartar tráfico que de otro modo habría llevado.

Los nodos que sufren primero son los lejanos — los enlaces marginales a dos o tres saltos que solo pasan cuando el canal está tranquilo. Un nodo hablador en el área metro no solo se cuesta a sí mismo; acorta el alcance efectivo de todos.

## La posición de un nodo fijo es fija

Esta es la parte que hace fácil el arreglo. Un nodo de techo no se mueve. Transmitir su posición cada 15 minutos no comunica nada que una transmisión cada 12 horas no comunique. Lo mismo aplica al GPS en sí — no hay razón para que un nodo estacionario queme energía revisando su propio fix cada pocos minutos cuando la respuesta siempre son las mismas coordenadas.

Configura la posición una vez, márcala como fija, y deja que los temporizadores vayan largos:

```
meshtastic --setlat 18.4655 --setlon -66.1057
meshtastic --set position.fixed_position true
meshtastic --set position.position_broadcast_secs 43200
meshtastic --set position.gps_update_interval 21600
meshtastic --set position.position_broadcast_smart_enabled false
```

El smart position broadcasting — enviar al moverse en lugar de por temporizador — es una función de nodo móvil. En un nodo fijo no hace nada útil, así que desactívalo y confía en el intervalo de respaldo largo.

## Telemetría: larga, con una excepción

La telemetría de batería y ambiental de un nodo de techo alimentado por la red es de bajo valor a alta frecuencia — la batería no se está drenando, la curva de temperatura no necesita resolución de minutos. Alarga esos intervalos:

```
meshtastic --set telemetry.device_update_interval 21600
meshtastic --set telemetry.environment_update_interval 21600
```

La excepción es un nodo **solar**, donde la salud de carga sí vale la pena vigilar:

```
meshtastic --set telemetry.power_update_interval 3600
```

Ese es un intercambio deliberado — un paquete útil por hora, contra muchos inútiles.

## Recorta los paquetes que sí envías

Un nodo fijo no necesita reportar velocidad, rumbo, ni satélites a la vista — esos campos solo tienen sentido en algo que se mueve. Quitarlos hace más pequeño cada paquete de posición, lo que significa menos airtime por transmisión:

```
meshtastic --set position.position_flags ALTITUDE,ALTITUDE_MSL,GEOIDAL_SEPARATION
```

## La base, en un solo lugar

Punto de partida sugerido de Puerto Rico para un nodo estacionario:

| Ajuste | Valor |
|---|---|
| Position broadcast | 12 horas |
| GPS update interval | 6 horas |
| Smart position | desactivado |
| Node info broadcast | 6 horas |
| Telemetría de dispositivo / ambiental | 6 horas |
| Telemetría de potencia (solo solar) | 1 hora |
| Map report | 6 horas |

La tabla completa, con los valores de nodo móvil al lado y el bloque de CLI para ambos, está en [Configuración Recomendada → Intervalos de Transmisión](/es/settings/#intervalos-de-transmisión). Trátala como un piso desde el cual coordinar hacia arriba, no como una meta hacia la cual correr hacia abajo — si quieres transmitir más seguido que esto en un canal compartido, habla primero con los operadores a tu alrededor.

## Verifica tu trabajo

Después de cambiar los intervalos, observa las métricas del dispositivo por un día. La utilización de canal en el canal primario debería quedar baja — unos pocos por ciento en un área normal. Si sigue alta con tu nodo callado, la carga viene de otro lado de la malla, y esa es una conversación para la [comunidad](/es/community/), no un cambio de ajustes de tu parte.

Este es el mismo tema que [el problema del backbone de la malla de Puerto Rico](/es/blog/backbone-mesh-puerto-rico-es/): la red rara vez necesita *más* de un solo nodo. Necesita que cada nodo gaste el canal compartido de forma deliberada.
