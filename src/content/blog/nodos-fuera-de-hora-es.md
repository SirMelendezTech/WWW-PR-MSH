---
title: "Nodos fuera de hora: el diagnóstico gratis que casi nadie está leyendo"
description: Qué significan realmente los relojes desincronizados que aparecen en el monitor de la malla de Puerto Rico, y las cuatro causas que hay que descartar antes de culpar a la antena.
pubDate: 2026-08-03
author: WP4TZV
category: Field Reports
tags: [monitor, diagnostico, gps, antenas]
readingTime: 11 min
lang: es
translationKey: nodes-out-of-time
---

Mirando el [monitor de la malla de Puerto Rico](https://monitor.prmsh.com/source/d9d92629-16d4-4de9-839d-30f62216e354/security) hay un patrón que se repite: un montón de nodos con la hora mal. No unos segundos — mal de verdad, timestamps que no tienen sentido.

Mi primera reacción fue: esos nodos están sordos. Si Meshtastic distribuye la hora por la malla, un nodo con la hora mal es un nodo que no está escuchando a nadie. Y de ahí el salto obvio: la causa probable es la antena, porque el repositorio oficial de pruebas de antenas marca varias de las antenas de fábrica como no recomendadas.

Esa cadena de razonamiento es *parcialmente* correcta, y la parte incorrecta es la interesante. El reloj sí es un diagnóstico de recepción — pero solo después de descartar cuatro cosas que producen exactamente el mismo síntoma sin que el radio tenga nada malo.

## Cómo Meshtastic obtiene la hora

Esto está sorprendentemente poco documentado. No aparece en la documentación oficial de usuario; hay que ir al código o a las discusiones del repositorio.

Existe una jerarquía de fuentes, con prioridad. Según uno de los mantenedores del proyecto:

- **GPS** — considerado el equivalente a Stratum 1. La fuente más confiable.
- **NTP** — por WiFi/Ethernet. Menos confiable que GPS.
- **Hora de malla** — menos confiable que NTP.
- **Nada** — el dispositivo arranca sin hora válida.

La lista de prioridades vive en `src/gps/RTC.h` del firmware, y hay ajustes adicionales para las placas que traen un módulo RTC dedicado.

Fíjate dónde cae la hora de malla: **última**. El mantenedor la describe como una fuente para un dispositivo *sin configurar*. No es un protocolo de sincronización tipo NTP corriendo sobre LoRa. Es un mecanismo de respaldo para que un nodo que no tiene nada más al menos arranque con algo razonable.

Y sobre cada cuánto se propaga, la respuesta honesta del propio mantenedor fue que cree que va en los mensajes y en el NodeInfo, pero que tendría que leer el código — y que estaría bien documentarlo. Es decir: ni el proyecto tiene esto escrito en ningún lado.

Vale la pena decirlo porque cambia las expectativas. Si tu nodo no tiene GPS, no tiene WiFi con NTP, y no está pareado a un teléfono, la hora que tenga la obtuvo escuchando a alguien más. Punto.

## Por eso el reloj es un diagnóstico de RX

Aquí está la parte del razonamiento que sí se sostiene, y es genuinamente útil:

> Para un nodo sin GPS, sin NTP y sin teléfono, tener la hora correcta es **prueba de que escuchó a alguien** que la tenía mejor.

Eso convierte una columna aburrida del monitor en un indicador de recepción que no cuesta nada obtener. No hay que hacer traceroute, no hay que pedirle nada a nadie, no hay que ir al sitio. La hora ya está ahí.

El problema es el converso. "Hora correcta ⇒ escuchó a alguien" es válido. "Hora incorrecta ⇒ no escuchó a nadie" **no** se sigue automáticamente, porque hay otras maneras de llegar al mismo síntoma.

## Cuatro formas de tener la hora mal sin estar sordo

### 1. El vecindario tampoco tiene la hora

Si un nodo solo escucha a otros nodos que también están sin GPS, sin NTP y sin teléfono, todos van a estar mal. El nodo puede tener una recepción excelente y aun así no tener de dónde sacar una hora buena.

Esto no es un problema de radio. Es un problema de fuentes — el mismo problema de infraestructura del que hablé en el post anterior sobre el backbone. Un nodo sordo y un nodo bien conectado a un vecindario sin reloj se ven idénticos en el monitor.

### 2. Un bug de firmware, abierto ahora mismo

Este es el que me hizo reescribir el post.

Existe un bug reportado en marzo de 2026 contra el firmware 2.7.20: en plataformas **sin RTC de hardware**, el nodo pierde la hora que obtuvo de la red inmediatamente después de recibirla.

El origen es un PR de enero de 2026 que eliminó una guarda `#if HAS_RTC` alrededor de una llamada a `readFromRTC()`. En plataformas sin RTC físico esa función cae en una rama que llama a `gettimeofday()`, y en RP2040 eso devuelve el *uptime* (segundos desde el arranque), no la hora de pared. La secuencia queda así:

1. El firmware fija correctamente la hora de red — un valor de ~1.77 mil millones.
2. Acto seguido llama a `readFromRTC()`.
3. Esa función lee el uptime — un valor como 21.
4. Y sobrescribe la hora con ese 21.

A partir de ahí el nodo cree que estamos en 1970. Las consecuencias que reporta el autor del bug van más allá de un reloj feo: el `rx_time` de todos los paquetes recibidos queda basado en uptime, el `last_heard` de los nodos nuevos también, y como los nodos cargados desde flash sí tienen timestamps reales, los nodos recién escuchados parecen los "más viejos" y el nodeDB los expulsa de inmediato. El reporte documenta 222 expulsiones en una sola sesión de unas tres horas.

Piensa en lo que eso significa para el monitor. Un nodo afectado por este bug se ve como el nodo más sordo de la malla — hora absurda y rotación constante de vecinos — cuando en realidad su radio está perfecto y lo que falla es una línea de C.

Al momento de escribir esto el issue sigue abierto, etiquetado como `bug`, `help wanted` y `triaged`. Verifica el estado antes de repetir esto, porque puede haberse arreglado.

### 3. Arrancó hace cinco minutos

Un nodo recién flasheado, o recién reiniciado tras un corte de luz, no tiene hora hasta que escuche a alguien. Si el monitor lo captura en esa ventana, aparece "fuera de hora" sin que haya nada roto.

En una isla donde los cortes de luz no son excepcionales, esto no es un caso raro.

### 4. Lo que mide el monitor no es lo que crees

Esta es la que más me costó aceptar.

Un dato importante, y me incluyo: la [página de **Security**](https://monitor.prmsh.com/source/d9d92629-16d4-4de9-839d-30f62216e354/security) que estaba mirando no es una página de relojes. En MeshMonitor esa vista está diseñada para detectar nodos con llaves de cifrado débiles (baja entropía) y llaves duplicadas compartidas entre varios nodos. Si estás viendo timestamps raros ahí, lo más probable es que estés leyendo una columna de *last heard*, que es una cosa distinta a "la hora que el nodo cree que es".

La diferencia importa:

- **La hora propia del nodo** te dice de dónde sacó su reloj.
- **`last_heard`** te dice cuándo *tu* nodo receptor lo escuchó por última vez — y ese valor lo genera el nodo del monitor, no el nodo remoto.

Son dos mediciones distintas con modos de falla distintos. Antes de publicar cualquier conclusión hay que saber cuál de las dos estás mirando.

Dos confusores adicionales del mismo tipo:

- **MQTT.** Si el monitor ingiere de un broker MQTT además de por radio, los nodos que entran por esa vía tienen semántica de timestamp completamente distinta. No son observaciones de RF.
- **Un solo punto de vista.** El monitor escucha desde un solo nodo. Un nodo que se ve sordo desde ahí puede estar perfectamente sano en su propio vecindario, hablando con gente que el monitor no alcanza.

## Entonces, ¿cuándo *sí* apunta a un problema de recepción?

Cuando hay **asimetría**. Y es un caso real, no teórico.

Si el monitor está escuchando al nodo — o sea, aparece en la lista, sus paquetes llegan — pero el nodo no consigue hora, tienes evidencia de que su TX funciona y su RX no. Ese enlace asimétrico es la firma de un problema de recepción, y es exactamente el escenario que vale la pena investigar.

¿Por qué puede pasar? Una antena es recíproca: es igual de buena transmitiendo que recibiendo. Pero el *balance del enlace* no es simétrico si los dos extremos transmiten con potencias distintas. Un nodo corriendo 30 dBm con una antena mediocre puede ser escuchado sin problema, mientras que los vecinos transmitiendo a 22 dBm no logran llegarle. Sube la potencia y tapas el síntoma en una dirección mientras el problema sigue intacto en la otra.

Esto es, por cierto, un argumento contra subir la potencia como primer reflejo. Una antena mala más 30 dBm te da un nodo ruidoso y sordo — el peor vecino posible en una malla compartida.

## La antena: qué dicen los reportes y qué no dicen

El repositorio `meshtastic/antenna-reports` recopila mediciones hechas por la comunidad con analizadores vectoriales. Lo que dice sobre las antenas de fábrica es contundente: las antenas stock del LoRa32, del T-Beam y del T-Echo aparecen las tres marcadas como **no recomendadas**. También la Ziisor TX915-JZ-5, una de las genéricas baratas.

Y hay una advertencia que va más allá del rendimiento: la antena Seeed 318020612, vendida como si cubriera 860–930 MHz, midió un VSWR por encima de 8:1 cerca de 860 MHz — un nivel que el repositorio advierte que **dañará** el hardware.

Ahora, lo que esos reportes **no** dicen, y que hay que tener claro antes de usarlos como prueba:

- **Son mediciones de VSWR, no de ganancia ni de patrón.** El propio repositorio advierte que los fabricantes suelen inflar la ganancia y que las cifras listadas son las que declara el fabricante, no medidas. Un VSWR malo te dice que hay desadaptación de impedancia. No te dice hacia dónde radia la antena ni cuánta eficiencia tiene.
- **Una antena mala degrada TX y RX por igual.** Por reciprocidad. Así que un nodo con una antena verdaderamente mala tiende a *desaparecer* del monitor, no a aparecer con la hora mal. El caso "se escucha pero está sordo" requiere la asimetría de potencia que mencioné arriba, o algo peor.
- **"Algo peor" incluye cosas que la antena no explica:** conector SMA vs RP-SMA mal apareado, un pigtail barato con pérdidas, agua dentro del conector — cosa nada exótica aquí —, o un LNA saturado por un transmisor cercano.

O sea: la antena es una hipótesis razonable, no una conclusión. Y es la hipótesis más cara de comprobar, porque requiere subir al sitio.

## Cómo comprobarlo de verdad

Antes de decirle a nadie que cambie su antena, el orden barato-a-caro:

1. **Determina qué mide tu monitor.** Hora propia del nodo o `last_heard`. Sin esto no tienes nada.
2. **Filtra los nodos que entran por MQTT.** No son observaciones de RF.
3. **Anota la versión de firmware y el hardware.** Si es una plataforma sin RTC de hardware y corre firmware afectado por el bug, ya tienes la explicación y no hace falta seguir.
4. **Mira si el nodo tiene NODEINFO completo.** MeshMonitor marca como "incompletos" los nodos a los que les falta nombre o información de hardware, lo cual en canales cifrados indica que nunca llegó su paquete NODEINFO. Un nodo con hora mala *y* NODEINFO incompleto es un candidato mucho más fuerte a problema de RX.
5. **Compara el SNR en ambas direcciones.** Un traceroute te da el SNR por salto en cada sentido. Asimetría marcada = problema de un lado del enlace.
6. **Solo entonces habla de antenas.** Y cuando lo hagas, pregunta primero por el conector y el cable, no por la antena.

Hay además un atajo que resuelve el problema en vez de diagnosticarlo: MeshMonitor puede sincronizar la hora automáticamente a los nodos que tengan administración remota habilitada, enviándoles un comando *Set Time* con la hora del servidor. Es útil para mantener la malla consistente — pero ojo, si lo activas **pierdes el diagnóstico**. Ya no puedes usar el reloj como indicador de recepción, porque se lo estás dando tú.

## Lo que me llevo de esto

El reloj es un buen indicador de RX, pero es un indicador con cuatro falsos positivos conocidos, uno de los cuales es un bug de firmware abierto que produce exactamente el síntoma que estamos buscando.

Publicar "estos nodos están sordos, cámbiense la antena" a partir de esa columna sería, en el mejor de los casos, adivinar. Y en una comunidad pequeña como la nuestra, mandar a media docena de operadores a subir a un techo a cambiar una antena que no era el problema es una manera rápida de que dejen de hacerte caso.

Lo que sí vale la pena publicar es la lista de comprobación. Si alguien de la comunidad quiere correrla contra su propio nodo y compartir los resultados — versión de firmware, hardware, SNR en ambas direcciones — ahí empezamos a tener datos en lugar de una correlación.

---

**Fuentes**

- [Monitor de la malla de Puerto Rico](https://monitor.prmsh.com/source/d9d92629-16d4-4de9-839d-30f62216e354/security) — la instancia de MeshMonitor de donde salen las observaciones de este post
- [Proposal: Accurate-ish time/date/clock/NTP sync across mesh](https://github.com/meshtastic/firmware/discussions/7273) — discusión #7273, respuesta del mantenedor sobre la jerarquía de fuentes de hora
- [`src/gps/RTC.h`](https://github.com/meshtastic/firmware/blob/master/src/gps/RTC.h) — lista de prioridades en el código
- [Bug: RTC time overwritten with uptime on platforms without hardware RTC](https://github.com/meshtastic/firmware/issues/9828) — issue #9828
- [meshtastic/antenna-reports](https://github.com/meshtastic/antenna-reports) — reportes VSWR de la comunidad
- [MeshMonitor — Automation](https://meshmonitor.org/features/automation.html) y [Settings](https://meshmonitor.org/features/settings.html)

*73 de WP4TZV*
