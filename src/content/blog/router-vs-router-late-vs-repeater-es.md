---
translationKey: router-vs-router-late-vs-repeater
title: "Router, Router Late o Repeater: escoger el rol para un sitio de infraestructura real"
description: Los tres roles de infraestructura se diferencian en dos ejes — cuándo transmites, y si alguien puede verte. ROUTER interrumpe, ROUTER_LATE nunca lo hace, y REPEATER es invisible. Cuál debe correr un sitio en Puerto Rico, y por qué la invisibilidad aquí es un pasivo.
pubDate: 2026-08-30
author: WP4TZV
category: Tutorials
tags: [roles-nodo, router, router-late, repeater, rebroadcast-mode]
readingTime: 11 min
lang: es
---

# Router, Router Late o Repeater: escoger el rol para un sitio de infraestructura real

Casi todas las preguntas de rol en esta isla se contestan con "corre `CLIENT`". Ya [hice ese argumento largo](/es/blog/backbone-mesh-puerto-rico-es/): un techo en un vecindario poblado no es infraestructura, y ponerlo en `ROUTER_LATE` porque está alto empeora la malla.

Este post es para el otro caso — ese donde sí pasaste la barra. Una torre con vista despejada al mar. Un sitio en una cresta del que depende un valle entero. Algo permanente, elevado, y que de verdad puentea cobertura que nadie más alcanza.

Ahora tienes tres roles entre los cuales escoger, y la documentación los describe con un lenguaje que los hace sonar como grados de la misma cosa: `ROUTER`, `ROUTER_LATE`, `REPEATER`. No son grados. Se diferencian en dos ejes independientes, y escoger mal le cuesta a la malla de dos formas distintas.

## Los dos ejes

**Eje uno: cuándo transmites.** Cada retransmisión cae en una ventana de contención, y la ventana decide si te metes delante de tus vecinos o esperas detrás de ellos.

**Eje dos: si alguien puede verte.** A este casi nadie le presta atención y en una malla tan joven como la nuestra importa muchísimo.

Así caen los tres:

| Rol | Momento de retransmisión | ¿Interrumpe a otros? | ¿Visible en la malla? |
|---|---|---|---|
| **`ROUTER`** | Ventana temprana, siempre retransmite una vez | **Sí** — los nodos cercanos cancelan su propia repetición | Sí — aparece en la lista de nodos, envía telemetría |
| **`ROUTER_LATE`** | Ventana por defecto; **difiere** a la ventana tardía si escucha a otro retransmitir primero | **No** | Sí — aparece en la lista de nodos, envía telemetría |
| **`REPEATER`** | Ventana temprana, siempre retransmite una vez | **Sí** — misma agresividad que `ROUTER` | **No** — no se muestra en la lista de nodos ni en la topología, sin telemetría |

Lee esa tabla dos veces. `ROUTER` y `REPEATER` están en la misma casilla del eje uno y en extremos opuestos del eje dos. `ROUTER_LATE` es el único de los tres que nunca interrumpe a nadie.

## ROUTER: el rol que hace una afirmación

`ROUTER` siempre retransmite un paquete una vez, en la ventana temprana, y lo hace **incluso si ya escuchó a otro nodo retransmitir ese paquete**. Los nodos ordinarios que escuchan al router ir primero cancelan su propia retransmisión por completo.

Ese es todo el punto, y también todo el riesgo. Poner `ROUTER` es afirmar que tu cobertura desde ese sitio es mejor que la de los nodos que estás callando. Cuando la afirmación es cierta, el tráfico cruza la isla en menos saltos y la malla queda más tranquila y más rápida. Cuando es falsa, silenciaste un conjunto de rutas locales perfectamente buenas y gastaste un salto en una peor.

Una torre costera con camino sobre el mar es prácticamente el caso de libro de texto — sobre agua no hay nada en la zona de Fresnel que discutir, y LoRa llega lejos. Esa es la forma de sitio para la que se escribió `ROUTER`.

El modo de falla es un `ROUTER` en una altura mediocre. Interrumpe, gana la carrera, y entonces el paquete muere un salto antes de donde un `CLIENT` normal lo hubiera llevado. Todos a su alrededor reciben peor servicio y nadie puede decir por qué, porque desde afuera el router se ve funcionando — *sí* está retransmitiendo, solo que mal.

## ROUTER_LATE: cobertura sin la afirmación

`ROUTER_LATE` es el más malinterpretado de los tres, y el comportamiento real es más interesante de lo que sugiere el nombre.

**No** simplemente "transmite tarde". Normalmente usa la ventana por defecto, exactamente como un `CLIENT`. La diferencia aparece cuando escucha a alguien más retransmitir el paquete primero. Un cliente ordinario, en ese punto, cancela — ya alguien lo tiene, no hace falta. Un `ROUTER_LATE` en cambio **difiere** su retransmisión a la ventana tardía y la envía de todos modos.

La documentación de Meshtastic lo dice claro: aparte del mayor tiempo al aire, *"el impacto de desplegar un nodo `ROUTER_LATE` es idéntico a como si se desplegara un `CLIENT` en esa ubicación".*

Esa oración es todo el rol. Obtienes retransmisión garantizada — el paquete definitivamente sale desde tu sitio — con cero interrupción de quien esté a tu alrededor. Lo pagas en tiempo al aire, porque estás transmitiendo paquetes que ya se retransmitieron con éxito.

Lo que lo hace correcto para una forma específica de sitio: **un bolsillo de nodos sin línea de vista a un `ROUTER` existente.** Detrás de una cresta. En un valle. Del lado equivocado de la Cordillera. Un lugar que no es un concentrador de área amplia, pero del que un grupo de nodos de verdad depende para alcanzar el resto de la malla.

Si tu sitio es el *único* camino para alguien, `ROUTER_LATE` garantiza ese camino sin que tengas que afirmar que eres mejor que tus vecinos.

## REPEATER: máxima agresividad, cero visibilidad

`REPEATER` tiene la misma prioridad de retransmisión que `ROUTER` — ventana temprana, retransmite incluso si escuchó a otro hacerlo. Después va más allá en una dirección que no tiene nada que ver con enrutamiento: **apaga todo lo que el nodo diría por cuenta propia.**

Sin telemetría. Sin transmisiones de posición. Sin node info. Solo responde a paquetes de otros nodos; nunca origina. La pantalla está apagada por defecto. Y de forma crítica, según la documentación del dispositivo, **no se muestra en la lista de nodos ni en la topología.**

Hay un argumento real para esto. Un relé puro que nunca origina tráfico no gasta nada del canal compartido en contarle a todo el mundo cómo va su batería. En un canal congestionado eso es un ahorro genuino, y por eso existe el rol.

Pero piensa en lo que entregas a cambio en una isla donde la malla todavía se está mapeando:

- **No aparecerá en el [Mapa de Nodos](/es/map/).** Sin transmisión de posición no hay nada que colocar. Tu sitio aporta cobertura que nadie que planifique el próximo nodo puede ver.
- **El traceroute lo muestra como "Unknown"** si no está en la lista del nodo que consulta — así que cuando alguien depure una ruta por tu sitio, obtiene un salto misterioso.
- **No puedes revisarlo remotamente.** Sin telemetría no hay utilización de canal, no hay voltaje de batería, no hay forma de saber que está sano salvo manejar hasta allá. Para un sitio solar en una cresta, ese es un costo operativo real — consulta [el post de presupuesto de energía](/es/blog/presupuesto-energia-nodo-solar-es/) para ver a ciegas de qué estarías volando.
- **Nadie puede saber que es tuyo.** En una malla cuyo problema real es [que los operadores no se hablan](/es/blog/backbone-mesh-puerto-rico-es/), un nodo anónimo que interrumpe a sus vecinos no es una gran aportación a la conversación.

También hay un detalle mecánico que vale saber: `rebroadcast_mode` es un ajuste aparte del rol, y la mayoría de sus valores funcionan en cualquier rol. Solo **`ALL_SKIP_DECODING`** — retransmitir sin siquiera decodificar el paquete — está restringido a `REPEATER`. Si lo que de verdad querías era filtrar *qué* se retransmite (`LOCAL_ONLY` para ignorar mallas ajenas, `KNOWN_ONLY` para retransmitir solo a nodos en tu NodeDB, `CORE_PORTNUMS_ONLY` para descartar tráfico TAK y de range-test), puedes ponerlo en un `ROUTER` y conservar tu visibilidad. No tienes que volverte invisible para ser selectivo.

## Entonces cuál

Para Puerto Rico específicamente, mi lectura:

**Usa `ROUTER`** si el sitio tiene una huella de cobertura genuinamente dominante — una torre costera con camino al mar, un sitio en la Cordillera que ve un área grande — *y* lo acordaste con los operadores a tu alrededor. Este es el rol que construye un backbone, y es el que hace daño cuando la afirmación es falsa.

**Usa `ROUTER_LATE`** si el sitio es el único camino para un bolsillo de nodos pero no es un concentrador de área amplia. Garantizas el enlace sin callar a nadie. También es la opción más segura cuando no estás seguro de que tu cobertura le gane a la de tus vecinos — falla con gracia, porque en el peor caso eres un `CLIENT` que gasta tiempo al aire de más.

**Piensa bien antes de `REPEATER`.** El tiempo al aire que ahorra es real pero pequeño; la visibilidad que cuesta es grande mientras seguimos construyendo el mapa. Si el canal está tan congestionado que la telemetría propia de un router es el problema, la mejor primera jugada es [alargar los intervalos de transmisión de ese nodo](/es/blog/intervalos-transmision-airtime-es/) — mantienes el nodo visible y obtienes casi todo el ahorro. Reserva `REPEATER` para un sitio donde ya mediste la congestión, ya alargaste los intervalos, y aceptas deliberadamente que el nodo desaparezca de la vista de todos.

Y una deprecación que anotar: **`ROUTER_CLIENT` se eliminó en el firmware 2.3.15.** Si estás leyendo una guía vieja que lo recomienda, esa guía es anterior a como tres años de cambios de enrutamiento — trata el resto de sus consejos con la misma sospecha.

## Mide antes y después

Escojas el que escojas, el rol es una hipótesis. Pruébala:

- **Traceroute a través del sitio** antes y después del cambio. Si las rutas no cambiaron, el rol no hizo lo que creías.
- **Vigila la utilización de canal.** Pasando aproximadamente 25% en el canal primario, las colisiones suben rápido y la malla empieza a descartar tráfico que de otro modo habría llevado.
- **Vigila tu propio AirUtilTX.** Pasando 7–8% tu sitio es una parte significativa de la congestión local — lo cual es señal de bajar de `ROUTER` a `ROUTER_LATE`, no de empujar más fuerte.
- **Pregúntale a un vecino.** El nodo mejor posicionado para decirte si tu router ayudó es el que podrías estar interrumpiendo.

Si los números empeoran después de promover un nodo, la jugada honesta es devolverlo. Un `CLIENT` en un buen sitio es una contribución genuina. Un `ROUTER` en un sitio mediocre es un neto negativo muy difícil de ver desde adentro.

## Lista de verificación

1. **¿El sitio pasa la barra de infraestructura?** Permanente, elevado, puenteando cobertura que otros no alcanzan. Si no, corre `CLIENT` y detente aquí.
2. **¿Es un concentrador de área amplia, o el único camino para un bolsillo?** Concentrador → `ROUTER`. Único camino → `ROUTER_LATE`.
3. **¿No estás seguro?** `ROUTER_LATE`. Falla con gracia; `ROUTER` no.
4. **¿Considerando `REPEATER`?** Prueba primero intervalos largos en un `ROUTER`, y confirma que estás dispuesto a perder el mapa, los traceroutes y las revisiones remotas de salud.
5. **¿Quieres retransmisión selectiva?** Configura `rebroadcast_mode` — no necesitas `REPEATER` para nada excepto `ALL_SKIP_DECODING`.
6. **Habla con los operadores a tu alrededor antes de promover un nodo**, y haz traceroute antes y después.

Los roles son herramientas para una red que tiene backbone. Escoger entre ellos con criterio es como llegamos a tener uno.

---

**Fuentes**

- [Device Configuration](https://meshtastic.org/docs/configuration/radio/device/) — documentación de Meshtastic: definiciones de roles, valores de `rebroadcast_mode`, `REPEATER` no se muestra en la lista de nodos ni en la topología, `ROUTER_CLIENT` deprecado en 2.3.15
- [Demystifying ROUTER_LATE](https://meshtastic.org/blog/demystifying-router-late/) — blog de Meshtastic: el comportamiento de diferir en vez de cancelar y la comparación "idéntico a un CLIENT en esa ubicación"
- [Choosing The Right Device Role](https://meshtastic.org/blog/choosing-the-right-device-role/) — blog de Meshtastic: `REPEATER` apagando el tráfico transmitido
- [Mesh Broadcast Algorithm](https://meshtastic.org/docs/overview/mesh-algo/) — documentación de Meshtastic: ventanas de contención y flooding administrado
- Post anterior: *[La red mesh de Puerto Rico no tiene backbone](/es/blog/backbone-mesh-puerto-rico-es/)*

*73 de WP4TZV*
