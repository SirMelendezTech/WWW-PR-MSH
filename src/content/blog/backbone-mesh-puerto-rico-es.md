---
title: La red mesh de Puerto Rico no tiene backbone — y no es un problema de configuración
description: Por qué CLIENT_BASE, y no ROUTER_LATE, es el rol correcto para un nodo de techo — y por qué el verdadero arreglo para la malla frágil de Puerto Rico es que un puñado de torres costeras se pongan de acuerdo para correr ROUTER.
pubDate: 2026-07-20
author: WP4TZV
category: Tutorials
tags: [roles-de-nodo, router-late, client-base, zero-cost-hops]
readingTime: 11 min
lang: es
translationKey: client-base-rooftop-nodes
---

Si has estado mirando la malla local, seguro lo has visto: alguien pone un nodo en el techo, lo configura como `ROUTER_LATE`, y anuncia que está "ayudando a la red". Lo he visto varias veces por aquí, y yo mismo creía parte de ese razonamiento hasta que me senté a leer cómo funciona realmente la lógica de retransmisión.

La versión corta: `CLIENT_BASE` es el rol correcto para un nodo de techo o ático. `ROUTER_LATE` no lo es. Y `CLIENT_BASE` no es un cliente que "se convierte en router más tarde" — ese modelo mental está al revés, y te va a llevar a configurarlo mal.

Quiero primero explicar cómo funcionan los roles de verdad, porque la conclusión a la que llegué al final me sorprendió: la razón por la que nuestra malla se siente frágil tiene poco que ver con el rol que tenga configurado cada quien, y mucho que ver con que ninguno de nosotros ha hablado con los demás al respecto.

## Tres ventanas, no dos

Meshtastic no corre un protocolo de enrutamiento. No hay OSPF, no hay BGP, no hay base de datos de estado de enlace. Cada nodo escucha un paquete y decide por su cuenta si lo repite y, sobre todo, *cuándo*. Ese "cuándo" es todo el juego, porque todos estamos compartiendo una sola frecuencia.

Hay tres ventanas de tiempo en las que puede caer una retransmisión:

| Ventana | Quién transmite aquí | Qué significa |
|---|---|---|
| **Temprana (Early)** | `ROUTER`, `REPEATER` y `CLIENT_BASE` (condicionalmente) | Va primero. Se adelanta a todos los demás y puede hacer que los nodos normales cancelen su propia retransmisión por completo. |
| **Normal (Default)** | Todos los demás roles, incluyendo `CLIENT` | La ventana normal, donde se retransmite la mayoría del tráfico. |
| **Tardía (Late)** | Solo `ROUTER_LATE` | La última ventana. `ROUTER_LATE` espera aquí si ya escuchó a otro nodo repetir el paquete. |

Dentro de cada ventana hay un retraso aleatorio, ajustado según la relación señal-ruido (SNR) del paquete recibido. Las señales más débiles reciben un retraso más corto. La idea es que un nodo que te escuchó mal probablemente está lejos, así que le toca el primer turno para repetir y el paquete viaja más distancia por salto.

Fíjate que `CLIENT_BASE` y `ROUTER_LATE` están en extremos opuestos de esa tabla. No son variaciones el uno del otro.

## Qué hace realmente CLIENT_BASE

`CLIENT_BASE` usa la ventana temprana **únicamente** cuando el paquete va dirigido a, o viene de, un nodo que tú hayas marcado como favorito. Cualquier otro paquete que escuche lo trata exactamente igual que un `CLIENT` normal y lo retransmite en la ventana normal, si acaso.

Esta es la parte que la gente pasa por alto, así que lo digo claro:

> Si pones tu nodo de techo en `CLIENT_BASE` y nunca marcas nada como favorito, lo que configuraste fue un `CLIENT` con pasos adicionales.

La lista de favoritos no es un adorno opcional. Es el mecanismo. Pon el nodo de techo en `CLIENT_BASE` y luego márcale como favoritos tus portátiles, tu radio base, y cualquier otro equipo tuyo que esté adentro detrás del hormigón. Ahora esos nodos específicos reciben retransmisión prioritaria a través del único radio que tienes con vista real al horizonte.

Ese es el uso real. Es un rol de infraestructura *personal*, no de infraestructura pública.

## Por qué ROUTER_LATE no va allá arriba

`ROUTER_LATE` es un rol de retransmisión obligatoria. Repite todo lo que escucha que todavía tenga saltos disponibles. Eso es por diseño — existe para sitios que de verdad son necesarios para que un grupo de nodos pueda alcanzar el resto de la malla. Un grupo detrás de una loma. Un valle. El lado equivocado de un cerro.

Un techo en zona poblada es la situación opuesta. Desde ahí arriba escuchas mucho, y repetir todo eso mete una cantidad enorme de tráfico extra en un canal compartido en el que todos los que están dentro del alcance tienen que turnarse. Con suficiente de eso llegan las colisiones, las retransmisiones y los paquetes perdidos — la malla empeora para todo el mundo, incluyéndote a ti. En presets lentos como `LONG_FAST` esto pasa más rápido de lo que uno esperaría.

La guía oficial del proyecto es directa en esto: para un nodo de techo, usa `CLIENT_BASE` o `CLIENT`. `ROUTER` y `REPEATER` son aún menos apropiados, porque se adelantan a los demás nodos y pueden silenciar rutas locales que estaban funcionando perfectamente bien.

Si de todos modos vas a correr `ROUTER_LATE` en un techo, por lo menos monitoréalo. Vigila la utilización del canal y el tiempo al aire de tu propio nodo. Si el ChUtil pasa de aproximadamente 25%, o tu AirUtilTX pasa de 7–8%, eres parte del problema de congestión y deberías cambiar el rol.

La conclusión incómoda para mí fue esta: ver muchos nodos `ROUTER_LATE` en techos no es evidencia de que funcione. Es evidencia de un error de configuración común — precisamente el error al que `CLIENT_BASE` vino a darle una mejor respuesta.

## Zero-Cost Hops abarata el nodo de techo

Hay una segunda razón para correr `CLIENT_BASE` en un techo, y es más reciente. Se llama **Zero-Cost Hops** (saltos sin costo), disponible desde el firmware 2.7.11.

Normalmente cada retransmisión descuenta del contador de saltos, y solo tienes siete. Si tu nodo de techo gasta uno de esos saltos nada más para bajar un mensaje desde el router del vecindario hasta tu portátil en la sala, ese es un salto que ya no tienes para llegar a alguien interesante.

Zero-Cost Hops preserva el contador cuando se cumplen estas tres condiciones:

1. El nodo que retransmite es `ROUTER`, `ROUTER_LATE` o `CLIENT_BASE`.
2. No es el primer salto del paquete.
3. El nodo que retransmitió antes está en tus favoritos **y** es `ROUTER` o `ROUTER_LATE`.

Si falla cualquiera de las tres, el contador de saltos baja como siempre.

Para un nodo de techo el efecto práctico es que el tráfico que llega desde un router favorito de infraestructura aterriza en tu techo gratis, así el mensaje no se muere en el techo antes de llegar a los radios dentro de tu casa.

### Un detalle importante

Son dos mecanismos distintos compartiendo una sola lista de favoritos, y cada uno mira un campo diferente. La regla de ventana temprana de `CLIENT_BASE` mira de quién viene y a quién va el paquete. Zero-Cost Hops mira qué nodo lo retransmitió. Marcar un router como favorito **no** convierte tu `CLIENT_BASE` en algo que repite todo el tráfico.

Así que tu lista de favoritos termina haciendo dos trabajos a la vez:

- **Marca tus propios nodos internos** → retransmisión prioritaria para tu propio tráfico.
- **Marca los `ROUTER` / `ROUTER_LATE` locales** → saltos gratis en el tráfico entrante.

También vale saber: el techo sigue siendo siete saltos. Zero-Cost Hops no sube el límite, solo evita que gastes saltos en enlaces de infraestructura. Y únicamente los nodos `ROUTER`, `ROUTER_LATE` y `CLIENT_BASE` necesitan el firmware nuevo — los clientes normales no requieren ningún cambio.

## La configuración, en orden

1. Nodo de techo o ático → rol `CLIENT_BASE`.
2. En ese nodo, marca como favorito cada equipo tuyo que viva adentro.
3. En ese mismo nodo, marca también los sitios `ROUTER` / `ROUTER_LATE` legítimos de tu área.
4. Portátiles internos → `CLIENT`, o `CLIENT_MUTE` si están pegados al nodo de techo en una zona congestionada.
5. Corre un traceroute antes y después. Si no cambió nada, algo del paso 2 o 3 no está como tú crees que está.

## Una advertencia para los que estamos en mallas pequeñas

Zero-Cost Hops solo rinde si hay infraestructura real cerca de ti para marcar como favorita. Si la malla en tu área es mayormente nodos `CLIENT` en ventanas — que describe buena parte de la isla ahora mismo — puedes configurar todo lo anterior correctamente y no ver ningún cambio en tus traceroutes. Eso no es un bug. Sencillamente todavía no hay ningún router favorito en la ruta.

Los favoritos de `CLIENT_BASE` para tus propios radios internos ayudan de todos modos. Esa parte funciona sin coordinación de nadie más, y por eso yo empezaría por ahí.

## Lo que de verdad le falta a la isla

Mira el mapa alrededor de Puerto Rico y vas a notar algo: muchos sitios buenos ya están ocupados. Torres, altos costeros, antenas decentes. Y casi todos corriendo `CLIENT`.

Mi primer instinto fue que esos operadores deberían cambiar a `CLIENT_BASE`. Ese instinto estaba equivocado, y vale la pena explicar por qué, porque me tomó un rato verlo.

**`CLIENT_BASE` en una torre no le hace nada a la malla.** Es un rol de beneficio personal. Cambia cómo ese nodo trata los paquetes que van hacia y desde los favoritos *del dueño*, y nada más. El tráfico de los demás se retransmite exactamente igual que antes. Una torre corriendo `CLIENT_BASE` sigue siendo, desde el punto de vista de la red, un `CLIENT`.

**El bloqueo está aguas arriba, no aguas abajo.** Vuelve a las tres condiciones del salto sin costo. La tercera dice que el nodo que retransmitió el paquete *antes* que tú tiene que ser un `ROUTER` o `ROUTER_LATE` marcado como favorito. Eso significa que tiene que existir infraestructura del lado que envía para que el ahorro ocurra.

Si todas las torres de la costa son `CLIENT`, entonces no hay ni un solo salto sin costo en toda la isla. Ni uno. No importa con cuánto cuidado configures tu propio nodo de techo, y no importa a cuánta gente convenzas de cambiar a `CLIENT_BASE`. Alguien tiene que correr `ROUTER` o `ROUTER_LATE` de verdad antes de que el mecanismo tenga con qué trabajar.

### ¿Entonces qué debería ser una torre costera?

Lo más probable es que `ROUTER`. Ese rol está pensado para sitios con una huella de cobertura genuinamente excelente, y una torre con línea de vista abierta sobre el mar se acerca al caso de libro de texto — sobre agua, LoRa llega lejísimos y no hay nada en la zona de Fresnel con qué pelear.

`ROUTER_LATE` es el otro candidato, y le queda a un tipo de sitio distinto: uno que no es un concentrador de área amplia, pero del cual un grupo de nodos depende realmente para alcanzar el resto de la malla. Detrás de una cresta, en un valle, del lado equivocado de la Cordillera.

El riesgo con `ROUTER` es que el rol es una *afirmación*, y una afirmación falsa hace daño real. Un `ROUTER` se adelanta a todo lo que tiene alrededor y obliga a los nodos cercanos a cancelar sus propias retransmisiones. Ponlo en un sitio de cobertura mediocre y lo que hiciste fue silenciar un conjunto de rutas locales perfectamente buenas para gastar saltos en una peor. Así que esto no es un experimento de "lo pongo y vemos qué pasa". Es una decisión que se toma con los datos de cobertura en la mano, e idealmente con el resto de la malla local en la conversación.

### La parte interesante no es técnica

Los saltos sin costo entre dos torres requieren favoritos *mutuos*. El operador A marca a B, y B marca a A. Ninguno de los dos puede hacerlo solo.

Eso convierte esto en un problema de coordinación disfrazado de problema de configuración. La función no premia al operador que lea la documentación más rápido. Premia al grupo que habla entre sí.

Imagínate cómo se vería aquí. Un anillo de sitios `ROUTER` mutuamente marcados como favoritos alrededor de la costa, más un par en la Cordillera Central para cargar las rutas norte-sur que hoy las montañas rompen. El tráfico que entra a ese anillo cruza la isla por aproximadamente un salto de costo en lugar de cinco o seis. Todo lo que ahorras se va a la primera y la última milla, que es exactamente donde hace falta — el portátil en el estacionamiento, el nodo en el apartamento de hormigón.

Eso no es una función que se instala. Son unos cuantos operadores poniéndose de acuerdo sobre roles y listas de favoritos, y después manteniendo el firmware al día.

### Y para que quede claro sobre las torres que ya están

Nada de lo anterior significa que esas torres en `CLIENT` estén rotas o sean inútiles. Retransmiten. Extienden cobertura. Están haciendo aquello para lo que las montaron, y en una red sin backbone coordinado, `CLIENT` es una decisión defendible y segura — es lo que el proyecto recomienda cuando uno no está seguro.

El argumento para cambiarlas no es "tu nodo no está haciendo nada". Es que un puñado de ellas, escogidas deliberadamente y configuradas en conjunto, podría convertir un montón de nodos individualmente útiles en un backbone de verdad.

---

**Fuentes**

- [Demystifying ROUTER_LATE](https://meshtastic.org/blog/demystifying-router-late/) — blog de Meshtastic
- [Zero-Cost Hops for Favorite Routers](https://meshtastic.org/blog/zero-cost-hops-favorite-routers/) — blog de Meshtastic
- [Choosing The Right Device Role](https://meshtastic.org/blog/choosing-the-right-device-role/) — blog de Meshtastic
- [Configuration Tips](https://meshtastic.org/docs/configuration/tips/) — documentación de Meshtastic

*73 de WP4TZV*
