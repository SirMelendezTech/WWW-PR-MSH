---
title: "Llaves duplicadas en la malla de Puerto Rico: qué significa esa advertencia roja"
description: Qué significa la advertencia de llaves duplicadas en el monitor de seguridad de la malla, y por qué buena parte de lo que se ve ahora mismo es un artefacto de la actualización a 2.8 y no una brecha real.
pubDate: 2026-08-11
author: WP4TZV
category: Field Reports
tags: [seguridad, monitor, cifrado]
readingTime: 12 min
lang: es
translationKey: duplicate-keys
---

En la [página de Security del monitor](https://monitor.prmsh.com/source/d9d92629-16d4-4de9-839d-30f62216e354/security) hay una segunda cosa que llama la atención además de los relojes: nodos marcados con **llaves duplicadas**.

Vale la pena entender exactamente qué significa eso, porque es la advertencia más seria que el monitor puede darte — y porque una parte considerable de lo que estás viendo ahora mismo probablemente no es un problema de seguridad, sino un artefacto de la actualización a 2.8.

Las dos cosas a la vez. Vamos por partes.

## Primero: de qué llave estamos hablando

Hay dos cosas distintas en Meshtastic que la gente llama "la llave", y confundirlas hace que esta conversación no llegue a ningún lado.

**El PSK del canal** es la llave compartida del canal. Todos los que están en `LongFast` comparten el mismo PSK — por diseño. Eso no es una duplicación; es cómo funciona un canal. Si alguien te dice "pero todos tenemos la misma llave", se está refiriendo a esto, y no es lo que el monitor está marcando.

**El par de llaves del dispositivo** es otra cosa: desde la versión 2.5, cada nodo genera su propio par X25519 (pública/privada) al arrancar por primera vez. La pública se anuncia en el NodeInfo; la privada nunca sale del dispositivo. Eso es lo que hace posibles los mensajes directos cifrados de extremo a extremo y la administración remota autenticada.

Lo que el monitor marca como duplicado es **la llave pública del dispositivo**, no el PSK del canal. Y como hay una correspondencia uno-a-uno entre pública y privada, dos nodos con la misma pública tienen también la misma privada.

Ahí está el problema completo, en una frase.

## Por qué importa: CVE-2025-52464

Esto no es teoría. Es un CVE publicado con severidad **crítica, CVSS v4 de 9.5**.

El aviso oficial del proyecto, publicado en junio de 2025, describe dos fallos que se encontraron juntos:

1. **El procedimiento de flasheo de varios fabricantes estaba produciendo pares de llaves duplicados.** Es decir: dispositivos que salieron de fábrica compartiendo llave con otros dispositivos del mismo lote.
2. **El uso que hacía Meshtastic de la librería rweather/crypto no inicializaba correctamente el pool interno de aleatoriedad en algunas plataformas**, lo cual podía generar llaves de baja entropía.

Las versiones afectadas van desde la 2.5.0 hasta antes de la 2.6.11.

### El impacto, en concreto

Sobre los mensajes directos, el aviso es directo: cuando un usuario con un par de llaves afectado enviaba DMs, esos mensajes podían ser capturados y descifrados por un atacante que hubiera recopilado la lista de llaves comprometidas.

Y la administración remota queda afectada por dos vías distintas:

- Si se añade una llave comprometida como administrador remoto, cualquiera que tenga esa llave privada puede administrar el nodo.
- El caso inverso es más elaborado: si el nodo administrado remotamente es el que tiene el par comprometido, un atacante tendría que averiguar la llave pública de un administrador autorizado, usar la privada comprometida para producir la `shared_key` resultante, y con eso suplantar al administrador y enviarle comandos al nodo.

Traducido a lo que significa para un operador de la malla: **un nodo con llave duplicada no tiene DMs privados, y potencialmente no tiene control exclusivo de su propio nodo.**

Y hay una segunda mitad que casi nadie menciona: si *tú* le mandas un DM a un nodo con llave duplicada, ese mensaje tampoco es privado. La llave comprometida es la de él, pero el mensaje es tuyo. No es solo problema del otro.

### Cómo se arregló

La 2.6.11 hizo tres cosas: avisar al usuario cuando detecta una llave comprometida, **retrasar la generación de llaves hasta la primera vez que se configura la región LoRa** — lo cual elimina de raíz el problema del clonado en fábrica, porque nadie en la cadena de distribución llega a tener las llaves —, y añadir múltiples fuentes de aleatoriedad a la inicialización del RNG.

La 2.6.12 se anunció para ir más allá: borrar automáticamente las llaves comprometidas conocidas cuando las encuentre.

## Antes de alarmarte: el falso positivo de la 2.8

Aquí está la parte que cambia cómo hay que leer el monitor ahora mismo, en agosto de 2026, con mucha gente actualizando a 2.8.

Hay una regresión en el firmware 2.8 que, en el primer arranque, **renumera el nodo a `crc32(publicKey)` manteniendo la misma llave**. El NodeNum anterior — el derivado de la MAC, de antes de 2.8 — queda huérfano. Resultado: un solo nodo físico aparece bajo dos NodeNums distintos compartiendo una llave.

Eso se ve **exactamente igual** que una colisión de llaves real. Mismo síntoma, causa completamente benigna.

MeshMonitor detecta y suprime este patrón específico: cuando un grupo de dos NodeNums tiene exactamente uno igual a `crc32(publicKey)` — la identidad nueva y viva de 2.8 — y el otro se quedó inactivo, lo trata como renumeración de actualización y no lo marca como riesgo.

Pero fíjate en los límites de esa supresión:

- Si **ambos** nodos siguen transmitiendo activamente, sí se marca.
- Si **ninguno** de los dos NodeNums coincide con `crc32(publicKey)`, sí se marca.
- El escáner explícitamente **se inclina por mantener la advertencia cuando el caso es ambiguo.**

Esa última es la buena noticia y la mala a la vez: significa que el escáner prefiere un falso positivo antes que dejar pasar un problema real. Correcto desde el punto de vista de diseño, y también significa que **no puedes asumir que todo lo marcado es un incidente.**

## Las dos detecciones no son la misma cosa

El monitor marca dos condiciones distintas, y mezclarlas lleva a conclusiones equivocadas:

| | **Baja entropía** | **Llave duplicada** |
|---|---|---|
| Qué compara | Tu llave pública contra una base de datos de llaves débiles conocidas y documentadas públicamente | Las llaves públicas de los nodos entre sí, dentro de la base de datos del propio monitor |
| Alcance | Global — tu llave está en una lista publicada | Local — estos nodos comparten llave *entre ellos* |
| Cuándo corre | En tiempo real, al descubrir o actualizar un nodo | Escáner en segundo plano: 5 minutos después de arrancar, luego cada 24 horas por defecto |
| Qué implica | Alguien con la lista puede descifrar tus DMs | Clonado de dispositivo, restauración de backup, o el artefacto de 2.8 |

Un nodo puede tener las dos banderas a la vez. Ese es el caso de máxima prioridad: llave débil *y* compartida.

Vale la pena conocer también las limitaciones que el propio proyecto documenta: el detector de baja entropía solo reconoce llaves que ya están en su base de datos, **no puede detectar llaves débiles nuevas**, y requiere que el nodo haya anunciado su llave pública. Ausencia de bandera no es prueba de que la llave esté bien.

## Cómo investigarlo sin hacer daño

Si ves un grupo de duplicados en el monitor, el orden sensato:

1. **Descarta la renumeración de 2.8.** ¿Uno de los NodeNums equivale a `crc32` de la llave pública? ¿El otro dejó de transmitir? Entonces es un nodo, no dos, y no hay incidente.
2. **Mira si ambos siguen activos.** Dos nodos transmitiendo al mismo tiempo con la misma llave no es una actualización. Eso es clonado real.
3. **Anota la versión de firmware.** Cualquier cosa entre 2.5.0 y 2.6.11 cae dentro del rango del CVE. Un nodo en ese rango con llave duplicada es casi con seguridad el caso de fábrica descrito en el aviso.
4. **Fuerza un escaneo si acabas de arreglar algo.** Las banderas no se limpian solas hasta el próximo ciclo, que puede ser hasta 24 horas. Hay un endpoint para dispararlo a mano.

Y una nota sobre firmware viejo que aplica a todo lo anterior: hubo un fallo separado, corregido en 2.6.3, en el que un atacante podía enviar un NodeInfo con la llave pública vacía para borrar la llave almacenada de un nodo conocido, y luego enviar una llave nueva que quedaba guardada en el NodeDB. En nodos por debajo de 2.6.3, la llave pública que ves anunciada no es necesariamente auténtica. Eso complica cualquier conclusión que quieras sacar del monitor sobre nodos con firmware antiguo.

## Cómo arreglar tu propio nodo

El aviso oficial da el camino directo:

```
meshtastic --factory-reset-device
```

Eso limpia una llave clonada de fábrica. Pero el propio aviso advierte que **la llave resultante puede seguir siendo de baja entropía dependiendo de la plataforma**. Si necesitas una llave de entropía alta de verdad, la recomendación es generarla fuera del dispositivo:

```
openssl genpkey -algorithm x25519 -outform DER | tail -c32 | base64
```

Y meter ese valor como llave privada en la configuración del nodo.

Actualiza el firmware primero, en todo caso. Desde 2.6.11 el dispositivo ya no genera la llave hasta que configuras la región, así que un flasheo limpio en firmware actual produce una llave que nadie más ha visto nunca.

## Cuando ya avisaste y no pasó nada

La recomendación estándar es contactar al operador en privado. Eso ya se hizo aquí, y no hubo respuesta. Así que la pregunta real no es si avisar — es qué hacer cuando avisar no funcionó.

Este post *es* el siguiente paso. Divulgación pública del problema, sin nombres. Y esa distinción no es timidez; es la parte que importa.

**Por qué sigue sin convenir publicar la lista de nodos afectados**, aunque sus dueños te hayan ignorado: el daño no cae sobre ellos. Cae sobre todo el que les manda un mensaje. Si publicas que el nodo X tiene llave comprometida, no estás castigando al operador negligente — estás diciéndole a cualquiera con un receptor exactamente qué conversaciones vale la pena capturar, incluyendo las de gente que no tiene nada que ver con esto. El aviso oficial es explícito en que el ataque requiere haber recopilado la lista de llaves comprometidas. Publicar la correlación de "esta llave, este nodo, esta zona" es hacerle a alguien la mitad del trabajo.

Y hay un detalle incómodo: si el aviso privado se mandó por DM al nodo afectado, ese aviso tampoco fue privado. Un nodo con llave comprometida no puede recibir un mensaje confidencial — ni siquiera uno que le avisa de que su llave está comprometida.

**Lo que sí funciona cuando el otro lado no responde:**

- **Publicar números sin nombres.** "En la malla de PR hay N nodos marcados, en M grupos de duplicados" genera presión y da una idea del tamaño del problema sin entregarle un mapa a nadie. Si la cifra es alta, la cifra sola es el argumento.
- **Poner una fecha.** Divulgación coordinada de toda la vida: "si esto no se corrige para tal fecha, publico los detalles". Le da al operador una razón concreta para actuar, y a ti una posición defendible si terminas publicando.
- **Subir un nivel.** Si el nodo está en un sitio compartido, en un repetidor de un club, o pertenece a alguien identificable dentro de un grupo local, el administrador del grupo puede tener más alcance que un DM.
- **Aceptar que algunos nodos no se van a arreglar.** Muchos de estos son nodos desatendidos: alguien los montó, funcionaron, y nadie volvió a mirarlos. Un operador que no lee mensajes tampoco va a leer un blog.

Y ahí está el giro que cambia para quién escribes esto.

**Si los dueños no van a arreglarlo, el público de este post es todo el resto.** El objetivo deja de ser "arreglen sus nodos" y pasa a ser "revisa el estado del nodo antes de mandarle algo sensible". Eso está enteramente en manos del lector, no depende de que nadie coopere, y es la única parte de este problema que no requiere que un tercero haga algo.

**Una nota sobre el tono, de todas formas.** Prácticamente ninguno de estos casos es malicioso. La causa dominante, según el propio aviso, es que ciertos fabricantes flasheaban mal — el operador no hizo nada incorrecto. La segunda más común es alguien que restauró un backup a un segundo dispositivo, que es un error honesto. Que te hayan ignorado es frustrante, pero un post que suene a acusación le da a la gente una excusa para discutir el tono en vez del problema.

## Lo que me llevo

La advertencia de llave duplicada es real y es seria: un CVE crítico de 9.5 que rompe por completo la privacidad de los mensajes directos y abre la puerta a la suplantación de administradores remotos.

Y al mismo tiempo, en este momento concreto, una parte de lo que aparece marcado es el ruido de una regresión de la 2.8, y el escáner está diseñado para preferir el falso positivo. Las dos cosas son ciertas.

El patrón se repite del post anterior sobre los relojes: el monitor te da una señal buena y unos cuantos falsos positivos conocidos, y el trabajo está en separarlos antes de sacar conclusiones.

Pero lo que separa este caso del de los relojes es que aquí ya se hizo el trabajo y ya se avisó. Si escribo esto en público no es por no haber intentado el camino privado — es porque ese camino se agotó. Y como el arreglo depende de gente que no está respondiendo, la parte útil de este post no es la que les habla a ellos. Es la que te dice a ti, que sí lo estás leyendo, cómo revisar tu propio nodo y cómo saber con quién estás hablando.

---

**Fuentes**

- [Monitor de la malla de Puerto Rico](https://monitor.prmsh.com/source/d9d92629-16d4-4de9-839d-30f62216e354/security) — página de Security de donde salen estas observaciones
- [GHSA-gq7v-jr8c-mfr7 — Repeated Public/Private Keypairs](https://github.com/meshtastic/firmware/security/advisories/GHSA-gq7v-jr8c-mfr7) — aviso oficial de Meshtastic
- [CVE-2025-52464](https://nvd.nist.gov/vuln/detail/CVE-2025-52464) — NVD
- [CVE-2025-55293](https://nvd.nist.gov/vuln/detail/cve-2025-55293) — sobreescritura de llave pública vía NodeInfo, corregido en 2.6.3
- [MeshMonitor — Security Features](https://meshmonitor.org/features/security.html) — mecánica de detección y la excepción de la renumeración de 2.8
- [MeshMonitor — Duplicate Encryption Keys](https://meshmonitor.org/security-duplicate-keys.html) — página explicativa para operadores afectados

*73 de WP4TZV*
