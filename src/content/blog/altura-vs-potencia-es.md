---
title: "Altura vs. potencia: por qué no puedes comprar más alcance"
description: El argumento de capa física contra subir la potencia primero — la regla de la FCC de 6 dBi de ganancia de antena, por qué duplicar la potencia rara vez duplica el alcance en terreno con obstáculos, y por qué el despeje de la zona de Fresnel gana a ambos.
pubDate: 2026-08-17
author: WP4TZV
category: Hardware
tags: [antenas, fisica-rf, fcc-parte-15, zona-fresnel, elevacion]
readingTime: 10 min
lang: es
translationKey: height-vs-power
---

# Altura vs. potencia: por qué no puedes comprar más alcance

En el post sobre el backbone argumenté que la malla de Puerto Rico no tiene problema de configuración, sino de coordinación. En el de los relojes mencioné de pasada que una antena mala con 30 dBm te da "un nodo ruidoso y sordo — el peor vecino posible".

Este post es la otra mitad de los dos: la capa física. Porque la primera reacción de casi todo el mundo cuando un nodo no llega es subirle la potencia, y esa es, casi siempre, la palanca equivocada.

No por filosofía. Por tres razones concretas: la potencia está topada por ley, compra muy poco en terreno con obstáculos, y no arregla el lado del enlace que suele estar roto.

## Primero, el techo legal

Esto sorprende a mucha gente, incluyendo a operadores con años de experiencia.

Meshtastic en 915 MHz opera bajo la Parte 15, sección 15.247. La regla de potencia dice: para sistemas con modulación digital en la banda de 902–928 MHz, el máximo de potencia conducida es **1 vatio** — 30 dBm.

Pero hay una segunda mitad que casi nadie lee: ese límite está basado en el uso de antenas con ganancia direccional que no excede **6 dBi**, y si usas una antena de más de 6 dBi, la potencia conducida se tiene que reducir por debajo del límite **en la misma cantidad de dB en que la ganancia excede los 6 dBi**.

Dicho de otra forma: el techo de PIRE es 36 dBm y es fijo. Cada dB de ganancia de antena por encima de 6 dBi te lo tienes que descontar de la potencia del transmisor.

¿Compraste una colineal de 9 dBi para el techo? Legalmente te toca bajar el TX a 27 dBm. ¿Una de 12 dBi? A 24 dBm. La PIRE no se mueve.

### Y no, la excepción de punto a punto no aplica aquí

Aquí es donde tropieza la gente que viene del mundo de WiFi. Sí existe una excepción para enlaces fijos punto a punto — pero solo cubre dos bandas: en 2400–2483.5 MHz puedes exceder los 6 dBi reduciendo la potencia solo 1 dB por cada 3 dB de ganancia extra, y en 5725–5850 MHz puedes exceder los 6 dBi **sin ninguna reducción** de potencia.

Lee la lista otra vez. **902–928 MHz no está.** No hay alivio de punto a punto en la banda de Meshtastic. La reducción dB por dB aplica siempre, sin importar si tu enlace es un backbone fijo entre dos torres.

Así que el resultado práctico es sencillo: **en 915 MHz no puedes comprar más PIRE.** Está agotada de fábrica. Es la única variable de este problema que tiene un tope legal duro.

*(Nota para los licenciados: 902–928 MHz también es banda de aficionado en la Región 2, y bajo la Parte 97 los límites de potencia son otros. Pero la Parte 97 prohíbe los mensajes codificados con el propósito de ocultar su significado — o sea, adiós al cifrado de canal y a los DMs con PKC. Cambias potencia por toda la seguridad de la que hablé en el post anterior. Para una malla comunitaria no es un intercambio que valga la pena.)*

## Segundo: la potencia compra menos de lo que crees

Supón que ignoras lo anterior y subes de 22 dBm a 30 dBm — 8 dB, prácticamente todo el rango disponible.

Cuánto alcance te da eso depende del exponente de pérdida de trayectoria, que es una forma técnica de decir "cuánta cosa hay en el medio":

| Entorno | Exponente | Alcance que te dan 8 dB |
|---|---|---|
| Espacio libre / sobre agua | n = 2 | 2.5× |
| Suburbano con obstrucción parcial | n = 3 | 1.85× |
| Urbano / vegetación densa | n = 4 | 1.58× |

Y en la dirección contraria, lo que cuesta **duplicar** el alcance:

| Entorno | dB necesarios | Potencia necesaria |
|---|---|---|
| n = 2 | 6 dB | 4× |
| n = 3 | 9 dB | 8× |
| n = 4 | 12 dB | 16× |

En un barrio con casas y vegetación —o sea, casi cualquier sitio en el área metro— duplicar el alcance por potencia requiere 16 veces la potencia. No tienes 16 veces. Tienes, como mucho, 6.3 veces (8 dB), y solo si partías de 22 dBm.

## Tercero: la altura no suma dB, cambia el régimen

Aquí está la diferencia conceptual que hace que la comparación no sea justa.

Subir la potencia te mueve **dentro** de una curva de pérdida. Subir la antena te puede mover **a otra curva**.

Un nodo a 2 metros en un barrio está dentro del desorden: cercas, carros, techos de vecinos, árboles. Está operando con n = 4. Ese mismo nodo a 12 metros, por encima de la línea de techos, puede estar operando cerca de n = 2. Ese salto no vale 3 dB ni 8 dB — vale decenas de dB de pérdida evitada, y ningún ajuste de potencia lo compra.

El horizonte de radio da la parte fácil de calcular. Con la aproximación estándar de radio terrestre 4/3:

**d (km) ≈ 4.12 × √h (metros)**

| Altura | Horizonte |
|---|---|
| 2 m (portátil en la mano) | 5.8 km |
| 5 m (poste corto) | 9.2 km |
| 10 m (techo de casa) | 13.0 km |
| 30 m (torre) | 22.6 km |
| 100 m (loma) | 41.2 km |
| 1000 m (Cordillera Central) | 130 km |

Para un enlace entre dos nodos, se suman los dos horizontes. Dos portátiles a 2 m: 11.6 km. Un portátil a 2 m y un sitio a 100 m: **47 km**. La altura del otro extremo es la mitad del problema, y es la mitad que la comunidad puede resolver poniendo un sitio bueno — es literalmente el argumento del post del backbone, visto desde la física.

### La corrección honesta a mi propia frase

En un post anterior escribí que "3 metros más de altura le ganan a 3 dB más de potencia". Escribiéndolo con números, hay que matizarlo.

De 2 m a 5 m: el horizonte pasa de 5.8 a 9.2 km — 1.59×. Tres dB de potencia en n = 4 te dan 1.19×. La altura gana claramente.

De 10 m a 13 m: el horizonte pasa de 13.0 a 14.9 km — 1.14×. Tres dB en n = 4 dan 1.19×. Empatan, o la potencia gana por poco.

O sea: la frase es cierta **cerca del suelo**, donde tres metros te sacan del desorden. Más arriba, el horizonte tiene rendimientos decrecientes y la restricción que manda deja de ser el horizonte.

Pasa a ser esta otra.

## La zona de Fresnel: el número que arruina los planes

Tener línea de vista no es suficiente. El enlace también necesita despeje **alrededor** de la línea recta, porque la energía RF no viaja por un hilo — viaja por un elipsoide. Si un obstáculo invade ese volumen, pierdes señal aunque veas el otro extremo perfectamente.

El radio de la primera zona de Fresnel en el punto medio, a 915 MHz:

**r (m) ≈ 9.05 × √D (km)**

La regla práctica es despejar al menos el **60%** de ese radio:

| Largo del enlace | Radio Fresnel | Despeje necesario (60%) |
|---|---|---|
| 1 km | 9.1 m | 5.4 m |
| 5 km | 20.2 m | 12.1 m |
| 10 km | 28.6 m | 17.2 m |
| 20 km | 40.5 m | 24.3 m |
| 40 km | 57.2 m | 34.3 m |

Léelo despacio, porque explica muchísimo de lo que se ve en la malla.

**Un enlace de 10 km necesita 17 metros de despeje sobre cualquier obstáculo en el punto medio.** Eso es un edificio de cinco pisos de margen. Un nodo a 10 metros en un barrio de casas de 10 metros tiene línea de vista y **cero** despeje de Fresnel. Funciona a duras penas, con enlaces marginales y asimétricos, y ninguna cantidad de potencia lo arregla — porque el problema es geométrico, no energético.

Esto también explica por qué los enlaces sobre agua son tan buenos aquí. Sobre el mar no hay nada que invada el elipsoide, y estás en n = 2. Una torre costera con vista despejada al mar es, de verdad, un caso de libro de texto.

*(Y una advertencia sobre eso: los enlaces sobre agua a veces producen contactos rarísimos por conductos atmosféricos —ducting— que aparecen y desaparecen con las condiciones. Está buenísimo cuando pasa. No diseñes el backbone asumiendo que va a estar ahí mañana.)*

## La cuarta palanca, que casi nadie usa

Hay una razón más para no gastar el esfuerzo en potencia, y es la que menos se menciona.

**La potencia de transmisión solo ayuda cuando transmites. La ganancia de antena ayuda en las dos direcciones.**

Por reciprocidad, una antena con 3 dB más de ganancia te da 3 dB al transmitir y 3 dB al recibir. Tres dB de potencia extra te dan 3 dB de ida y nada de vuelta.

Ahí está el nodo sordo del post de los relojes, explicado del todo. Si tu enlace falla en recepción, la potencia no toca el problema. Puedes subir a 30 dBm y lograr que te escuchen perfectamente mientras tú sigues sin escuchar a nadie — y el síntoma que produces es precisamente el enlace asimétrico que describí allá: un nodo al que el monitor oye pero que no consigue ni la hora.

Y el costo social: ese nodo está ocupando el canal compartido con transmisiones fuertes que no resuelven nada. Un vecino ruidoso, sordo, y en una malla donde todos se turnan la misma frecuencia.

## Puerto Rico en particular

Tres cosas de aquí que cambian los números.

**La Cordillera Central.** No es un obstáculo que se rodee con potencia. Un nodo del norte y uno del sur no se van a escuchar por más vatios que le pongas — necesitan un sitio alto en el medio, y eso es geometría, no energía. Los sitios de la Cordillera no son "un nodo más": son la única forma de que exista una ruta norte-sur.

**La vegetación.** A 915 MHz la atenuación por follaje es considerable, y empeora bastante cuando está mojado. Un enlace que funciona en seco puede caerse en un aguacero — y aquí llueve. Si tu enlace depende de pasar rozando la copa de unos árboles, no es un enlace, es una casualidad estacional.

**Los apagones.** Un sitio alto que se apaga no sirve de nada, y aquí eso pasa. La altura solo cuenta si el nodo sigue encendido — pero eso es tema para otro post.

## Qué hacer en la práctica

En orden de retorno por esfuerzo:

1. **Sube la antena.** Antes que nada. Cada metro por debajo de la línea de techos es el más caro de todos.
2. **Cambia la antena antes de tocar la potencia.** La ganancia trabaja en ambas direcciones y no te hace mal vecino. Ojo con el límite de 6 dBi: por encima de eso hay que bajar el TX.
3. **Revisa el conector y el cable.** Es la falla más común y la más barata de arreglar. Un pigtail malo o agua en un SMA te come más dB que cualquier ajuste de configuración.
4. **Calcula el despeje de Fresnel antes de subir a un techo.** Si el enlace que quieres tiene 10 km y hay una loma en el medio, ya sabes el resultado sin haberte movido de la silla.
5. **La potencia, de último**, y sabiendo que estás gastando el recurso compartido de todo el mundo para comprar muy poco.

## Lo que me llevo

La potencia es la única variable de este problema que tiene un tope legal, que compra menos mientras peor sea el terreno, que no ayuda en recepción, y que le cuesta algo al resto de la malla.

La altura no tiene tope, cambia el régimen de propagación completo en vez de sumar unos dB, ayuda en las dos direcciones, y no le quita nada a nadie.

Cuando alguien pregunte por qué su nodo no llega, la primera pregunta no es cuántos dBm tiene. Es a cuántos metros está.

---

**Fuentes**

- [47 CFR § 15.247](https://www.ecfr.gov/current/title-47/chapter-I/subchapter-A/part-15/subpart-C/subject-group-ECFR2f2e5828339709e/section-15.247) — límites de potencia, la reducción por ganancia sobre 6 dBi, y las excepciones de punto a punto (que no incluyen 902–928 MHz)
- Post anterior: *La red mesh de Puerto Rico no tiene backbone*
- Post anterior: *Nodos fuera de hora*

*73 de WP4TZV*
