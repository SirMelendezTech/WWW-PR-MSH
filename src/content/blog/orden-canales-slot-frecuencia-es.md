---
translationKey: channel-order-frequency-slot
title: "El canal que moviste no era un canal — era tu frecuencia"
description: En Meshtastic no hay "orden de canales" que cambiar — el índice 0 es el primario, su nombre se hashea a tu slot de frecuencia LoRa, y un canal añadido o un QR importado puede moverte ocho megahercios fuera de la malla regional sin avisar. Cuándo fijar el slot es lo correcto, y cuándo no.
pubDate: 2026-08-30
author: WP4TZV
category: Tutorials
tags: [canales, slot-frecuencia, lora, congestion]
readingTime: 13 min
lang: es
---

# El canal que moviste no era un canal — era tu frecuencia

Un nodo se queda callado. No apagado: arranca, la pantalla funciona, la app conecta, la telemetría se actualiza. Simplemente deja de existir para el resto de la malla. Nadie lo escucha, él no escucha a nadie.

Y sigue hablando perfecto con el otro nodo que casualmente reconfiguraste al mismo tiempo, que es justo lo que hace que uno tarde días en darse cuenta.

Si alguien recientemente añadió, quitó o reordenó un canal en ese nodo, ya sabes lo que pasó. Le cambiaron la frecuencia. Solo que no sabían que eso era lo que estaban haciendo.

## Qué determina tu frecuencia de verdad

Meshtastic no te pide que escojas una frecuencia. La deriva.

De la documentación oficial: un hash del nombre del canal **PRIMARY** fija el slot de frecuencia LoRa, que es lo que determina la frecuencia real en la que transmites dentro de la banda.

Ese hash toma tres entradas, no una:

1. El nombre del canal primario
2. Tu región
3. Tu ancho de banda (que sale del preset de módem)

Cambia cualquiera de las tres y el slot se mueve.

Para la región de EE.UU. con ancho de banda de 250 kHz, la banda se divide en 104 slots:

```
num_slots       = (928 - 902) / 0.25 = 104
centro del slot n = 902 + 0.125 + (n-1) × 0.25   MHz
```

Dos valores concretos que vale la pena memorizar, porque muestran qué tan lejos viaja el slot:

| Nombre del canal primario | Slot | Frecuencia |
|---|---|---|
| `LongFast` | 20 | 906.875 MHz |
| `MediumSlow` | 52 | 914.875 MHz |

Nombres distintos no te corren un poquito. Te ponen a ocho megahercios de distancia, al otro lado de la banda, sordo para todo el mundo.

Y una consecuencia más que sorprende: **todos los canales del nodo comparten el slot del primario.** Tus canales secundarios no tienen frecuencia propia. Viajan en la que el nombre del primario haya generado.

## No existe un "orden de canales" que puedas cambiar

Aquí está lo que convierte esto en una trampa y no en una rareza.

No puedes mover el rol de primario de un canal a otro. No hay una bandera para eso. **El índice 0 *es* el primario**, por definición. El rango de índices va del 0 al 7, el índice no se puede modificar, y los canales activos tienen que ser consecutivos — no puedes dejar un hueco deshabilitado en el medio.

O sea que reordenar canales es *siempre* la misma operación que cambiar cuál canal es el primario. Y cambiar cuál es el primario es *siempre* cambiar tu frecuencia. No existe una versión de "solo reordené" que deje el radio quieto.

## Cómo cae la gente en esto de verdad

Casi nadie reordena canales a propósito. El escenario realista es este:

> Quieres un canal privado para tu familia, tu club o tu grupo de emergencias. Lo añades. Cae en el índice 0. `LongFast` se va empujado al índice 1.

Acabas de salirte de la malla pública. No tocaste ninguna configuración de radio. No cambiaste el preset ni la región. La app no te avisó. Tu canal privado funciona precioso con todos los que configuraste en persona, y la malla regional se esfumó.

Tres trampas hermanas que producen la misma falla silenciosa:

- **Cambiar el preset de módem.** El ancho de banda cambia la cantidad de slots, y el hash se toma módulo esa cantidad. Mismo nombre de canal, otro preset, otro slot.
- **Cambiar de región.** Otra banda, otro mapa de slots.
- **Importar una URL o un código QR de canales de otra persona.** Eso puede reescribirte el conjunto completo de canales, incluyendo cuál queda en el índice 0. Es la forma más común de que esto le pase a alguien que nunca editó un canal.

## Cuándo mover el slot es lo correcto

Todo lo anterior es sobre hacerlo por accidente. Hacerlo a propósito es una herramienta legítima y a veces excelente. Aquí va cuándo.

### 1. Fijar el slot para poder renombrar libremente

Este es el inverso de la advertencia y probablemente el caso más útil para la mayoría.

Digamos que quieres tu canal primario llamado `PR-Mesh` en vez de `LongFast`, por organización o identidad. Normalmente eso te sacaría de la frecuencia regional y te aislaría. Pero si fijas el slot de frecuencia explícitamente, el nombre deja de controlar el radio. **Fijas el slot 20, le pones al canal el nombre que quieras, y te quedas en la misma frecuencia que todos.**

La documentación es explícita en que este es el camino soportado: para que equipos con nombres de canal primario distintos transmitan en la misma frecuencia, hay que fijar el slot de frecuencia LoRa explícitamente.

### 2. Escaparte de un slot congestionado — y por qué un PSK nuevo no logra esto

Esta es la que más gente entiende mal, y vale la pena ser preciso.

Un canal privado con otro PSK te da **privacidad**. No te da **tiempo al aire**. Sigues en la misma frecuencia que la malla pública. Tu radio sigue recibiendo cada paquete de LongFast, sigue gastando tiempo en él, sigue teniendo que esperar su turno detrás de él. No logras descifrarlo y lo botas — después de haberlo pagado.

Un slot de frecuencia distinto te da las dos cosas. No escuchas su tráfico y ellos no escuchan el tuyo, así que ningún grupo está compitiendo por el tiempo al aire del otro.

Si tu slot local de LongFast está saturado —utilización de canal por encima del 25%, mensajes que llegan tarde o no llegan— mover un grupo a su propio slot es un arreglo real de una manera que un PSK nuevo no lo es.

### 3. Alejarte de un interferente local

902–928 MHz es una banda ISM ocupada. Contadores inteligentes, telemetría industrial, gateways LoRaWAN, equipos inalámbricos — cualquiera de esos puede estar sentado justo encima de tu slot y en ningún otro lado. Si un sitio específico tiene un desempeño horrible mientras los nodos cercanos están bien, vale la pena probar otro slot antes de culpar a la antena.

### 4. Separar dos mallas que comparten espacio RF pero no propósito

Dos pueblos lo bastante cerca como para escucharse, sin razón para interconectarse. En un solo slot, cada uno paga tiempo al aire por el tráfico del otro para siempre. En slots separados, ambos consiguen mallas más tranquilas. Esta es una decisión de coordinación entre dos comunidades, no algo que un operador deba hacer por su cuenta.

### 5. Pruebas de banco

Pon tu nodo de pruebas en un slot que nadie usa. Lo puedes martillar, inundar, romper y reflashear sin poner un solo paquete en la malla viva. Es la razón más segura y menos discutible de la lista, y más gente debería hacerlo.

### 6. Mallas temporales o de evento

Una malla para un evento, un despliegue o un ejercicio específico que no debería volcar su tráfico en la red regional. Le das su propio slot, corres el evento, la desmontas.

### Lo que te cuesta

Salirte del slot por defecto no es gratis, y los costos hay que decirlos claros:

- **Te vuelves indescubrible.** Nadie te encuentra por defecto. Alguien nuevo que flashee un nodo en tu área nunca te va a ver.
- **Pierdes la propiedad de relevo de la malla grande.** En el slot público, el nodo de un desconocido podría cargar tu paquete. En tu propio slot, solo tus nodos lo harán.
- **La coordinación se vuelve obligatoria.** A todos hay que darles el número exacto de slot, y tiene que estar bien. Uno solo que se equivoque por uno se queda solo.
- **Para uso de emergencia esto juega en tu contra.** Ser encontrable en el slot por defecto es una ventaja cuando la situación está mala y la gente que necesita alcanzarte no fue instruida sobre tu configuración.

El resumen honesto: muévete a propósito cuando el objetivo sea tiempo al aire o aislamiento y controles a todos los que necesitan estar ahí. Quédate en el default cuando la descubribilidad importe más que la tranquilidad.

## Cómo fijarlo

El ajuste es `lora.channel_num`. Controla la frecuencia real del hardware, expresada como un slot entre 1 y el máximo para tu región y preset. Ponlo en 0 o déjalo sin definir y el equipo cae de vuelta al hash del nombre del canal. Ponle un número y ese número manda.

O sea:

```
meshtastic --set lora.channel_num 20
```

Una vez fijado, renombrar, reordenar, añadir y quitar canales ya no te puede mover la frecuencia. Que es la recomendación real de este post:

> Si corres infraestructura, fija el slot. No porque planees reordenar nada, sino para que el día que alguien importe una configuración o añada un canal, el radio no se mueva.

## Cómo saber que esto fue lo que te pasó

La firma es lo bastante específica como para diagnosticarla desde el sofá:

1. **El nodo funciona — simplemente no tiene pares.** Arranca, conecta, pantalla bien, cero nodos al alcance.
2. **Habla con lo que hayas configurado junto a él**, lo cual hace parecer que el radio está sano. Lo está.
3. **Nada cambió en los ajustes de LoRa.** La gente revisa región, preset y potencia, los encuentra intactos, y concluye que el problema es de hardware.
4. **Algo cambió en la lista de canales** — añadido, quitado, reordenado o importado — justo antes de que se callara.

Compara el nombre del canal primario contra el que está usando el resto de tu malla. Después verifica el slot calculado con uno de los calculadores de la comunidad, o simplemente lee la frecuencia en el equipo.

Y fíjate cómo se ve esto desde afuera: en un monitor, un nodo que se movió de slot es indistinguible de un nodo sordo. Es otra entrada más para la lista de falsos positivos de la que escribí en el post de los relojes — antes de decirle a alguien que su antena está mala, verifica que siga en tu frecuencia.

## Para Puerto Rico en particular

Dos cosas que importan localmente.

**Si un grupo de aquí quiere un canal primario privado, todos fijan el mismo slot o el grupo se dispersa.** El nodo de cada persona convierte su propio nombre en su propio slot y cada uno concluye que los nodos de los demás están apagados. La falla es silenciosa y mutua.

**Y si además quieres seguir alcanzable en la malla regional, `LongFast` tiene que quedarse de primario — o fijas el slot 20 a mano.** Puedes tener un canal privado y alcance público al mismo tiempo, pero solo si la frecuencia se queda quieta. Ese es todo el truco: los canales privados son para separar mensajes, y el slot es para separar RF. Son independientes, y confundirlos es cómo desaparece un nodo.

## Lista de comprobación

1. **Antes de tocar canales, anota tu slot de frecuencia actual.** Es lo que estás a punto de cambiar sin querer.
2. **Fija `lora.channel_num` en todo lo que no puedas alcanzar fácil.** Techo, torre, sitio remoto — fíjalo.
3. **¿Añadiendo un canal privado? Revisa qué quedó en el índice 0.**
4. **¿Importando un QR o una URL de otra persona? Asume que te reescribió el orden de canales** y verifica después.
5. **¿Quieres nombre de canal primario propio y alcance público? Fija el slot primero, renombra después.**
6. **¿Quieres tranquilidad, no privacidad? Mueve el slot.** Un PSK nuevo por sí solo no te compra tiempo al aire.
7. **¿El nodo se calló después de un cambio de configuración? Revisa la frecuencia antes de revisar la antena.**

---

**Fuentes**

- [Channel Configuration](https://meshtastic.org/docs/configuration/radio/channels/) — documentación de Meshtastic: el hash del nombre del canal primario fija el slot de frecuencia; reglas de índice
- [LoRa Configuration](https://meshtastic.org/docs/configuration/radio/lora/) — comportamiento de `lora.channel_num` y el respaldo cuando está en 0/UNSET
- [Calculador de slot de frecuencia](https://github.com/heypete/meshtastic_frequency_slot_calculator) — valores de slot para canales nombrados, incluyendo LongFast = 20 y MediumSlow = 52
- [Mesh radio calculator](https://meshradiocalc.yycmesh.com/) — slot y frecuencia central por región, ancho de banda y nombre del canal primario
- Posts anteriores: *La red mesh de Puerto Rico no tiene backbone*, *Nodos fuera de hora*, *Altura vs. potencia*

*73 de WP4TZV*
