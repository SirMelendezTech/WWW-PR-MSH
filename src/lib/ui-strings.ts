import type { Locale } from "./i18n";

// Central UI string dictionary. Every user-visible string that lives in a
// component or page (as opposed to Markdown content) is keyed here by locale so
// the English and Spanish routes render from one source instead of duplicated
// markup. Markdown docs/blog posts are translated as separate files.

const en = {
  skipLink: "Skip to content",

  nav: {
    gettingStarted: "Getting Started",
    hardware: "Hardware",
    settings: "Settings",
    howItWorks: "How It Works",
    prMesh: "PR Mesh",
    map: "Node Map",
    blog: "Blog",
    community: "Community",
    links: "Links",
    searchAria: "Search documentation",
    viewSourceAria: "View source on GitHub",
    openMenuAria: "Open menu",
    primaryNavAria: "Primary",
    mobileNavAria: "Mobile",
    switchToEnglish: "View in English",
    switchToSpanish: "Ver en español",
  },

  breadcrumbs: {
    home: "Home",
    ariaLabel: "Breadcrumb",
  },

  copyButton: {
    copy: "Copy",
    copied: "Copied",
    fallback: "Press Ctrl+C",
    aria: "Copy command to clipboard",
  },

  opensInNewTab: "(opens in a new tab)",

  footer: {
    blurb:
      "Community-built LoRa mesh network for Puerto Rico. Off-grid, decentralized, and open to anyone who wants to help extend coverage.",
    gettingStartedHeading: "Getting Started",
    gettingStarted: "Getting started",
    recommendedHardware: "Recommended hardware",
    recommendedSettings: "Recommended settings",
    documentationHeading: "Documentation",
    howItWorks: "How Meshtastic works",
    prMesh: "Puerto Rico mesh",
    nodeMap: "Node map",
    blog: "Blog",
    communityHeading: "Community",
    communityHub: "Community hub",
    howToContribute: "How to contribute",
    events: "Events & field tests",
    linksHeading: "Links",
    linksResources: "Links & resources",
    copyright: (year: number) => `© ${year} Meshtastic Puerto Rico Community.`,
    disclaimer:
      "Meshtastic PR is an independent community project, not affiliated with Meshtastic LLC. Configure and operate radio equipment according to applicable laws, regulations, and current Meshtastic firmware documentation.",
    licenseBefore: "Site content licensed under ",
    licenseName: "CC BY-SA 4.0",
    licenseAfter: ".",
  },

  docs: {
    sidebarLabel: "Documentation",
    onThisPage: "On this page",
    untranslatedLabel: "Translation pending",
    untranslatedBody:
      "This page isn't translated yet — English content is shown.",
    docsPagesAria: "Documentation pages",
  },

  latestVersions: {
    title: "Latest Releases",
    checking: "Checking…",
    seeReleases: "See releases",
    unknown: "Unknown",
    firmware: "Firmware",
    androidApp: "Android App",
    iosApp: "iOS App",
  },

  categories: {
    All: "All",
    News: "News",
    Tutorials: "Tutorials",
    Hardware: "Hardware",
    "Field Reports": "Field Reports",
    "Node Builds": "Node Builds",
    Community: "Community",
    "Puerto Rico Mesh Updates": "Puerto Rico Mesh Updates",
  } as Record<string, string>,

  blogIndex: {
    title: "Blog",
    description:
      "Tutorials, field reports, node builds, and Puerto Rico mesh updates from the Meshtastic PR community.",
    eyebrow: "Meshtastic PR Blog",
    h1: "Field notes from the mesh",
    lede: "Tutorials, hardware reviews, node deployments, and coverage reports from operators building the network across Puerto Rico.",
    filterAria: "Filter by category",
    readSuffix: "read",
    noPosts: "No posts in this category yet.",
  },

  blogPost: {
    blogCrumb: "Blog",
    readSuffix: "read",
    relatedHeading: "Related articles",
    tagsLabel: "Tags",
  },

  home: {
    title: "Meshtastic Puerto Rico",
    description:
      "Meshtastic Puerto Rico is a community resource for building, learning about, and expanding decentralized LoRa mesh communication throughout Puerto Rico.",
    heroEyebrow: "Meshtastic Puerto Rico",
    heroTitle: "Stays connected when everything else goes down.",
    heroSub1:
      "Meshtastic Puerto Rico is a community-built radio network that lets you send messages without cell service, Wi-Fi, or the internet. You pair a small, affordable radio with an app on your phone — that radio talks directly to nearby radios, relaying your message from one to the next until it reaches its destination.",
    heroSub2:
      "Some devices even have their own screen and keyboard, so you don't need a phone at all. No towers, no company, no monthly bill.",
    heroSub3:
      "Simple enough for any age to set up and use for fun day to day — which means it's already working the moment cell service isn't.",
    heroCtaPrimary: "Get Started",
    heroCtaSecondary: "Explore the Mesh",

    introEyebrow: "What is Meshtastic?",
    introTitle: "Radios that talk to each other, not to a tower.",
    introBody1:
      "Meshtastic is open-source firmware for LoRa radios, and every node that joins does more than send its own messages — it extends the reach of everyone else's too, relaying traffic across the island one radio at a time.",
    introBody2:
      "Puerto Rico has already lived through weeks without cell service after Hurricane María and Fiona. This mesh exists so the next outage doesn't mean total silence.",
    introLink: "See how it actually works →",
    whyEyebrow: "Why Meshtastic PR",
    whyItems: [
      "Independent, community-run — no company, no subscription",
      "Built for Puerto Rico's terrain, climate, and hurricane risk",
      "Open documentation so anyone can join, configure, and contribute",
      "Useful today for hikers and boaters, critical during outages",
    ],

    featuresEyebrow: "Why it works",
    featuresTitle: "Off-grid, low-cost, and built together",
    features: [
      {
        title: "Off-Grid Communication",
        body: "Communicate using LoRa radios without relying on cellular networks or internet access.",
      },
      {
        title: "Build the Mesh",
        body: "Add a node anywhere useful — home, rooftop, or trail — to extend coverage for everyone nearby.",
      },
      {
        title: "Low Cost",
        body: "Start experimenting for the price of a nice dinner, with hardware that keeps working for years.",
      },
      {
        title: "Community Powered",
        body: "Learn, experiment, and improve the network together — no company decides how it's used.",
      },
    ],

    quickstartEyebrow: "Getting started",
    quickstartTitle: "Five steps to your first message",
    steps: [
      {
        title: "Get a compatible device",
        body: "Pick hardware sized to how you'll use it — see the guide organized by use case, not spec sheets.",
      },
      {
        title: "Install the app",
        body: "Android, iOS, or the web/desktop client over USB. Update to current firmware before configuring.",
      },
      {
        title: "Configure your device",
        body: "Set the correct region and a role that matches how the node will be used.",
      },
      {
        title: "Connect to the mesh",
        body: "Send a test message on the default channel, then find other operators nearby.",
      },
      {
        title: "Help expand the network",
        body: "A well-placed node — even a modest one — extends coverage for everyone around you.",
      },
    ],
    quickstartCta: "Read the full guide",

    splitCommunityEyebrow: "Community",
    splitCommunityTitle: "Join the community",
    splitCommunityBody:
      "Meet other Meshtastic users in Puerto Rico. Share knowledge, compare antennas and configurations, and help extend coverage together.",
    splitCommunityCta: "Join the Community",
    splitStartEyebrow: "Getting started",
    splitStartTitle: "Not on the mesh yet?",
    splitStartBody:
      "Pick hardware, install the app, and send your first message — the full walkthrough takes about twenty minutes.",
    splitStartCta: "Get Started",

    blogEyebrow: "From the blog",
    blogTitle: "Latest from Meshtastic PR",
    blogReadAll: "Read all posts →",

    ctaTitle: "Every node makes the mesh stronger.",
    ctaBody:
      "Whether it's a $30 handheld in your backpack or a solar repeater on a ridge, your radio helps carry the next message across Puerto Rico.",
    ctaPrimary: "Get Started",
    ctaSecondary: "See Hardware",
  },

  community: {
    title: "Community",
    description:
      "Where Puerto Rico Meshtastic operators find each other, share projects, coordinate events, and help each other build coverage.",
    crumb: "Community",
    eyebrow: "Community",
    h1: "Built by the people using it",
    lede: "There's no company behind Meshtastic PR — just operators who put up nodes, share what they learn, and help each other extend coverage. Here's how to find them and get involved.",
    projectsHeading: "Community Projects",
    projectsBody:
      "Ongoing efforts include coverage mapping for underserved regions, coordinated rooftop deployments, and shared documentation for local settings. If you're starting a project — a neighborhood node cluster, a trailhead repeater — post it where other operators can find and support it.",
    operatorsHeading: "Node Operators",
    operatorsBodyBefore:
      "Operators across San Juan Metro, Bayamón, Caguas, Ponce, Mayagüez, and beyond keep the mesh running. See current regional status on ",
    operatorsBodyLink: "Puerto Rico Mesh",
    operatorsBodyAfter:
      ", and connect with nearby operators before choosing a site for a new node — coordinating placement avoids duplicate coverage and fills real gaps instead.",
    eventsHeading: "Events",
    eventsBodyBefore:
      "Meetups, build nights, and range-test outings happen periodically as the community grows. Check the community channels linked on ",
    eventsBodyLink: "Links & Resources",
    eventsBodyAfter:
      " for what's currently scheduled — this page intentionally doesn't hardcode dates that would go stale.",
    fieldTestingHeading: "Field Testing",
    fieldTestingBody1Before:
      "Range and coverage tests — hilltop to hilltop, coastal path, urban canyon — are some of the most useful contributions anyone can make. A documented test with hardware, antenna, distance, and result helps every future node placement decision. See ",
    fieldTestingBody1Link: "the blog",
    fieldTestingBody1After: " for past field reports and how they're written up.",
    fieldTestingBody2Before: "Testing an antenna specifically? Submit your numbers to the upstream ",
    fieldTestingBody2Link: "Meshtastic Antenna Reports",
    fieldTestingBody2After:
      " project rather than a local writeup — it keeps the data in one place other operators, in Puerto Rico and beyond, can actually find.",
    emergencyHeading: "Emergency Communications",
    emergencyBodyBefore:
      "Meshtastic is not a replacement for licensed emergency services, but it is a useful layer of household and neighborhood resilience during outages. See the ",
    emergencyBodyLink: "hurricane-season checklist",
    emergencyBodyAfter:
      " for practical prep steps, and treat official emergency management guidance as authoritative for anything safety-critical.",
    contributeHeading: "How to Contribute",
    contributeItems: [
      { text: "Put up a node — even a modest home node helps." },
      { text: "Document a field test or hardware review and share it." },
    ],
    contributeItem3Before: "Report coverage gaps you find so ",
    contributeItem3Link: "Puerto Rico Mesh",
    contributeItem3After: " stays accurate.",
    contributeItem4: "Help newcomers get their first radio configured.",
  },

  map: {
    title: "Node Map",
    description:
      "Interactive map of participating Meshtastic nodes across Puerto Rico.",
    crumb: "Node Map",
    eyebrow: "Puerto Rico Node Map",
    h1: "Where the mesh is right now",
    ledeNodes: "nodes",
    ledeSampleNodes: "sample nodes",
    ledeShownOnline: (online: number, total: number, label: string) =>
      `${online} of ${total} ${label} shown online.`,
    ledeLive: " Positions are current as of the last site build.",
    ledeSample:
      " Live data was unreachable at build time, so sample positions are shown instead.",
    mapAria: "Map of Puerto Rico showing Meshtastic node locations",
    nodeListAria: "Node list",
    nodesLabel: (n: number) => `Nodes (${n})`,
    lastSeen: "last seen",
    sourceLabel: "Data source",
    sourceBefore: "Node positions come from the ",
    sourceMonitor: "Meshtastic PR Network Monitor",
    sourceMid: ", powered by ",
    sourceMalla: "Malla",
    sourceAfter:
      ", read once when this page was last built — not live in your browser. Precision reflects whatever each operator configured on their node; this page never sharpens a position beyond what the node itself reports, and an operator who wants off the map can do so from their own device.",
    sampleNote:
      "Live data was unreachable during the last build, so the markers above are illustrative demo positions, not real operator locations. The next successful build restores live data automatically.",
    appearLabel: "Want your node on this map?",
    appearBefore: "Bridge your node to MQTT with the root topic ",
    appearTopic: "msh/US/PR",
    appearMid: ", turn on ",
    appearOkToMqtt: "OK to MQTT",
    appearAfter:
      ", and set the primary channel to Uplink on. Full walkthrough in ",
    appearLink: "Recommended Settings → MQTT",
    appearLinkAfter: ".",
    popupLastSeen: "Last seen",
    popupSnr: "SNR",
    popupPrecision: "Position precision",
  },

  links: {
    title: "Links & Resources",
    description:
      "Official Puerto Rico mesh resources, the Meshtastic project, and reference documentation.",
    crumb: "Links",
    eyebrow: "Links & Resources",
    h1: "Where to go from here",
    lede: "All external links open in a new tab and are marked accordingly.",
    externalBadge: "External",
    externalBadgeSr: " — opens in a new tab",
    prHeading: "Puerto Rico Resources",
    projectHeading: "Official Meshtastic Project",
    referenceHeading: "Reference Documentation",
    notes: {
      monitor:
        "Live community monitoring for participating Puerto Rico nodes.",
      palmasmesh: "Puerto Rico Meshtastic community project.",
      mallapr:
        "Puerto Rico network monitor and map — the live data source behind this site's Node Map.",
      meshtasticOrg:
        "Official Meshtastic project — firmware, apps, and documentation.",
      flasher:
        "Flash firmware to a supported device directly from the browser — no drivers or CLI needed.",
      hwList: "Current, maintained list of supported devices.",
      cli: "Command-line configuration reference.",
      antennaReports:
        "Community-submitted, real-world antenna performance data from operators worldwide.",
      awesomeHw:
        "Community-maintained roundup of boards, sensors, and less common builds.",
      awesomeServer:
        "Community-maintained roundup of MQTT servers, dashboards, and mesh monitoring tools.",
      malla:
        "Open-source Meshtastic network analyzer (MIT) that powers Malla PR's live map and this site's Node Map data.",
      azSettings:
        "Reference documentation that inspired this site's structure.",
      azHardware:
        "Reference documentation that inspired this site's structure.",
    } as Record<string, string>,
  },

  notFound: {
    title: "Page not found",
    description: "This page doesn't exist.",
    eyebrow: "Signal lost",
    h1: "No route to this page.",
    body: "The link may be out of date, or the message never made it. Try one of these instead.",
    ctaHome: "Back to home",
    ctaGettingStarted: "Getting started",
  },

  mapPreview: {
    eyebrow: "Live coverage",
    h2: "The mesh, right now.",
    copy: "Real node positions, pulled from the Puerto Rico network monitor at the last site build — not a mockup.",
    sampleNote: "Live feed was unreachable at build time — sample positions shown.",
    nodes: "nodes",
    sampleNodes: "sample nodes",
    statOf: "of",
    statOnline: "online",
    cta: "View full map →",
  },

  search: {
    dialogAria: "Search documentation",
    placeholder: "Search docs, hardware, blog…",
    queryAria: "Search query",
    prompt: "Type to search Meshtastic PR documentation and blog posts.",
    noResults: "No results. Try a different term.",
  },

  themeToggle: {
    aria: "Switch color theme",
  },
};

type Strings = typeof en;

const es: Strings = {
  skipLink: "Saltar al contenido",

  nav: {
    gettingStarted: "Primeros Pasos",
    hardware: "Hardware",
    settings: "Configuración",
    howItWorks: "Cómo Funciona",
    prMesh: "Malla PR",
    map: "Mapa de Nodos",
    blog: "Blog",
    community: "Comunidad",
    links: "Enlaces",
    searchAria: "Buscar en la documentación",
    viewSourceAria: "Ver el código fuente en GitHub",
    openMenuAria: "Abrir menú",
    primaryNavAria: "Principal",
    mobileNavAria: "Móvil",
    switchToEnglish: "Ver en inglés",
    switchToSpanish: "Ver en español",
  },

  breadcrumbs: {
    home: "Inicio",
    ariaLabel: "Ruta de navegación",
  },

  copyButton: {
    copy: "Copiar",
    copied: "Copiado",
    fallback: "Presiona Ctrl+C",
    aria: "Copiar comando al portapapeles",
  },

  opensInNewTab: "(se abre en una pestaña nueva)",

  footer: {
    blurb:
      "Red mesh LoRa construida por la comunidad para Puerto Rico. Sin conexión a la red eléctrica, descentralizada y abierta a cualquiera que quiera ayudar a ampliar la cobertura.",
    gettingStartedHeading: "Primeros Pasos",
    gettingStarted: "Primeros pasos",
    recommendedHardware: "Hardware recomendado",
    recommendedSettings: "Configuración recomendada",
    documentationHeading: "Documentación",
    howItWorks: "Cómo funciona Meshtastic",
    prMesh: "Malla de Puerto Rico",
    nodeMap: "Mapa de nodos",
    blog: "Blog",
    communityHeading: "Comunidad",
    communityHub: "Centro comunitario",
    howToContribute: "Cómo contribuir",
    events: "Eventos y pruebas de campo",
    linksHeading: "Enlaces",
    linksResources: "Enlaces y recursos",
    copyright: (year: number) =>
      `© ${year} Comunidad Meshtastic Puerto Rico.`,
    disclaimer:
      "Meshtastic PR es un proyecto comunitario independiente, sin afiliación con Meshtastic LLC. Configura y opera equipos de radio de acuerdo con las leyes, reglamentos y la documentación vigente del firmware de Meshtastic.",
    licenseBefore: "Contenido del sitio bajo licencia ",
    licenseName: "CC BY-SA 4.0",
    licenseAfter: ".",
  },

  docs: {
    sidebarLabel: "Documentación",
    onThisPage: "En esta página",
    untranslatedLabel: "Traducción pendiente",
    untranslatedBody:
      "Esta página aún no está traducida — se muestra el contenido en inglés.",
    docsPagesAria: "Páginas de documentación",
  },

  latestVersions: {
    title: "Últimas Versiones",
    checking: "Consultando…",
    seeReleases: "Ver versiones",
    unknown: "Desconocida",
    firmware: "Firmware",
    androidApp: "App de Android",
    iosApp: "App de iOS",
  },

  categories: {
    All: "Todas",
    News: "Noticias",
    Tutorials: "Tutoriales",
    Hardware: "Hardware",
    "Field Reports": "Reportes de Campo",
    "Node Builds": "Construcción de Nodos",
    Community: "Comunidad",
    "Puerto Rico Mesh Updates": "Actualizaciones de la Malla PR",
  },

  blogIndex: {
    title: "Blog",
    description:
      "Tutoriales, reportes de campo, construcción de nodos y actualizaciones de la malla de Puerto Rico de la comunidad Meshtastic PR.",
    eyebrow: "Blog de Meshtastic PR",
    h1: "Notas de campo desde la malla",
    lede: "Tutoriales, reseñas de hardware, despliegues de nodos y reportes de cobertura de operadores que construyen la red por todo Puerto Rico.",
    filterAria: "Filtrar por categoría",
    readSuffix: "de lectura",
    noPosts: "Aún no hay artículos en esta categoría.",
  },

  blogPost: {
    blogCrumb: "Blog",
    readSuffix: "de lectura",
    relatedHeading: "Artículos relacionados",
    tagsLabel: "Etiquetas",
  },

  home: {
    title: "Meshtastic Puerto Rico",
    description:
      "Meshtastic Puerto Rico es un recurso comunitario para construir, aprender sobre y ampliar la comunicación mesh LoRa descentralizada por todo Puerto Rico.",
    heroEyebrow: "Meshtastic Puerto Rico",
    heroTitle: "Sigue conectada cuando todo lo demás se cae.",
    heroSub1:
      "Meshtastic Puerto Rico es una red de radio construida por la comunidad que te permite enviar mensajes sin servicio celular, Wi-Fi ni internet. Emparejas una radio pequeña y económica con una app en tu teléfono — esa radio se comunica directamente con radios cercanas, retransmitiendo tu mensaje de una a otra hasta que llega a su destino.",
    heroSub2:
      "Algunos equipos hasta tienen su propia pantalla y teclado, así que no necesitas teléfono para nada. Sin torres, sin compañía, sin factura mensual.",
    heroSub3:
      "Suficientemente simple para que cualquier edad la configure y la use por diversión en el día a día — lo que significa que ya está funcionando en el momento en que el servicio celular no lo está.",
    heroCtaPrimary: "Comenzar",
    heroCtaSecondary: "Explorar la Malla",

    introEyebrow: "¿Qué es Meshtastic?",
    introTitle: "Radios que se hablan entre sí, no con una torre.",
    introBody1:
      "Meshtastic es firmware de código abierto para radios LoRa, y cada nodo que se une hace más que enviar sus propios mensajes — también amplía el alcance de los demás, retransmitiendo tráfico por toda la isla una radio a la vez.",
    introBody2:
      "Puerto Rico ya ha vivido semanas sin servicio celular tras los huracanes María y Fiona. Esta malla existe para que el próximo apagón no signifique silencio total.",
    introLink: "Mira cómo funciona de verdad →",
    whyEyebrow: "Por qué Meshtastic PR",
    whyItems: [
      "Independiente, gestionada por la comunidad — sin compañía, sin suscripción",
      "Construida para el terreno, el clima y el riesgo de huracanes de Puerto Rico",
      "Documentación abierta para que cualquiera pueda unirse, configurar y contribuir",
      "Útil hoy para excursionistas y navegantes, crítica durante los apagones",
    ],

    featuresEyebrow: "Por qué funciona",
    featuresTitle: "Sin red eléctrica, de bajo costo y construida en conjunto",
    features: [
      {
        title: "Comunicación Sin Red",
        body: "Comunícate usando radios LoRa sin depender de redes celulares ni acceso a internet.",
      },
      {
        title: "Construye la Malla",
        body: "Añade un nodo en cualquier lugar útil — casa, techo o vereda — para ampliar la cobertura de todos los que te rodean.",
      },
      {
        title: "Bajo Costo",
        body: "Empieza a experimentar por el precio de una buena cena, con hardware que sigue funcionando por años.",
      },
      {
        title: "Impulsada por la Comunidad",
        body: "Aprende, experimenta y mejora la red en conjunto — ninguna compañía decide cómo se usa.",
      },
    ],

    quickstartEyebrow: "Primeros pasos",
    quickstartTitle: "Cinco pasos hasta tu primer mensaje",
    steps: [
      {
        title: "Consigue un equipo compatible",
        body: "Elige hardware según cómo lo vas a usar — mira la guía organizada por caso de uso, no por hojas de especificaciones.",
      },
      {
        title: "Instala la app",
        body: "Android, iOS o el cliente web/escritorio por USB. Actualiza al firmware vigente antes de configurar.",
      },
      {
        title: "Configura tu equipo",
        body: "Establece la región correcta y un rol que corresponda a cómo se usará el nodo.",
      },
      {
        title: "Conéctate a la malla",
        body: "Envía un mensaje de prueba en el canal por defecto y luego busca a otros operadores cercanos.",
      },
      {
        title: "Ayuda a ampliar la red",
        body: "Un nodo bien ubicado — aunque sea modesto — amplía la cobertura para todos a tu alrededor.",
      },
    ],
    quickstartCta: "Lee la guía completa",

    splitCommunityEyebrow: "Comunidad",
    splitCommunityTitle: "Únete a la comunidad",
    splitCommunityBody:
      "Conoce a otros usuarios de Meshtastic en Puerto Rico. Comparte conocimiento, compara antenas y configuraciones, y ayuda a ampliar la cobertura en conjunto.",
    splitCommunityCta: "Únete a la Comunidad",
    splitStartEyebrow: "Primeros pasos",
    splitStartTitle: "¿Aún no estás en la malla?",
    splitStartBody:
      "Elige hardware, instala la app y envía tu primer mensaje — el recorrido completo toma unos veinte minutos.",
    splitStartCta: "Comenzar",

    blogEyebrow: "Del blog",
    blogTitle: "Lo más reciente de Meshtastic PR",
    blogReadAll: "Lee todos los artículos →",

    ctaTitle: "Cada nodo hace la malla más fuerte.",
    ctaBody:
      "Ya sea un equipo de mano de $30 en tu mochila o un repetidor solar en una cresta, tu radio ayuda a llevar el próximo mensaje por todo Puerto Rico.",
    ctaPrimary: "Comenzar",
    ctaSecondary: "Ver Hardware",
  },

  community: {
    title: "Comunidad",
    description:
      "Donde los operadores de Meshtastic en Puerto Rico se encuentran, comparten proyectos, coordinan eventos y se ayudan a construir cobertura.",
    crumb: "Comunidad",
    eyebrow: "Comunidad",
    h1: "Construida por quienes la usan",
    lede: "No hay ninguna compañía detrás de Meshtastic PR — solo operadores que instalan nodos, comparten lo que aprenden y se ayudan a ampliar la cobertura. Así puedes encontrarlos y participar.",
    projectsHeading: "Proyectos Comunitarios",
    projectsBody:
      "Los esfuerzos en curso incluyen el mapeo de cobertura para regiones desatendidas, despliegues coordinados en techos y documentación compartida para configuraciones locales. Si vas a empezar un proyecto — un grupo de nodos de barrio, un repetidor en el inicio de una vereda — publicálo donde otros operadores puedan encontrarlo y apoyarlo.",
    operatorsHeading: "Operadores de Nodos",
    operatorsBodyBefore:
      "Operadores en el área metro de San Juan, Bayamón, Caguas, Ponce, Mayagüez y más allá mantienen la malla funcionando. Consulta el estado regional actual en ",
    operatorsBodyLink: "Malla de Puerto Rico",
    operatorsBodyAfter:
      ", y coordínate con operadores cercanos antes de elegir un sitio para un nodo nuevo — coordinar la ubicación evita cobertura duplicada y en su lugar llena huecos reales.",
    eventsHeading: "Eventos",
    eventsBodyBefore:
      "Encuentros, noches de armado y salidas de prueba de alcance ocurren periódicamente a medida que crece la comunidad. Consulta los canales comunitarios enlazados en ",
    eventsBodyLink: "Enlaces y recursos",
    eventsBodyAfter:
      " para ver qué está programado — esta página intencionalmente no fija fechas que quedarían obsoletas.",
    fieldTestingHeading: "Pruebas de Campo",
    fieldTestingBody1Before:
      "Las pruebas de alcance y cobertura — de cima a cima, por sendero costero, en cañón urbano — son de las contribuciones más útiles que cualquiera puede hacer. Una prueba documentada con hardware, antena, distancia y resultado ayuda a cada decisión futura de ubicación de nodos. Consulta ",
    fieldTestingBody1Link: "el blog",
    fieldTestingBody1After:
      " para ver reportes de campo anteriores y cómo se redactan.",
    fieldTestingBody2Before:
      "¿Estás probando una antena en concreto? Envía tus números al proyecto upstream ",
    fieldTestingBody2Link: "Meshtastic Antenna Reports",
    fieldTestingBody2After:
      " en lugar de a un reporte local — mantiene los datos en un solo lugar que otros operadores, en Puerto Rico y más allá, pueden encontrar de verdad.",
    emergencyHeading: "Comunicaciones de Emergencia",
    emergencyBodyBefore:
      "Meshtastic no reemplaza a los servicios de emergencia licenciados, pero es una capa útil de resiliencia del hogar y el vecindario durante los apagones. Consulta la ",
    emergencyBodyLink: "lista de preparación para la temporada de huracanes",
    emergencyBodyAfter:
      " para pasos prácticos de preparación, y trata la orientación oficial de manejo de emergencias como autoritativa para cualquier cosa crítica para la seguridad.",
    contributeHeading: "Cómo Contribuir",
    contributeItems: [
      { text: "Instala un nodo — hasta un modesto nodo casero ayuda." },
      { text: "Documenta una prueba de campo o reseña de hardware y compártela." },
    ],
    contributeItem3Before: "Reporta los huecos de cobertura que encuentres para que ",
    contributeItem3Link: "Malla de Puerto Rico",
    contributeItem3After: " se mantenga precisa.",
    contributeItem4: "Ayuda a los nuevos a configurar su primera radio.",
  },

  map: {
    title: "Mapa de Nodos",
    description:
      "Mapa interactivo de los nodos Meshtastic participantes por todo Puerto Rico.",
    crumb: "Mapa de Nodos",
    eyebrow: "Mapa de Nodos de Puerto Rico",
    h1: "Dónde está la malla ahora mismo",
    ledeNodes: "nodos",
    ledeSampleNodes: "nodos de muestra",
    ledeShownOnline: (online: number, total: number, label: string) =>
      `${online} de ${total} ${label} en línea.`,
    ledeLive: " Las posiciones están al día de la última compilación del sitio.",
    ledeSample:
      " Los datos en vivo no estaban disponibles al compilar, así que se muestran posiciones de muestra.",
    mapAria: "Mapa de Puerto Rico mostrando ubicaciones de nodos Meshtastic",
    nodeListAria: "Lista de nodos",
    nodesLabel: (n: number) => `Nodos (${n})`,
    lastSeen: "visto por última vez",
    sourceLabel: "Fuente de datos",
    sourceBefore: "Las posiciones de los nodos vienen del ",
    sourceMonitor: "Meshtastic PR Network Monitor",
    sourceMid: ", impulsado por ",
    sourceMalla: "Malla",
    sourceAfter:
      ", leídas una vez cuando esta página se compiló por última vez — no en vivo en tu navegador. La precisión refleja lo que cada operador configuró en su nodo; esta página nunca afina una posición más allá de lo que el propio nodo reporta, y un operador que quiera quedar fuera del mapa puede hacerlo desde su propio equipo.",
    sampleNote:
      "Los datos en vivo no estaban disponibles durante la última compilación, así que los marcadores de arriba son posiciones de demostración ilustrativas, no ubicaciones reales de operadores. La próxima compilación exitosa restaura los datos en vivo automáticamente.",
    appearLabel: "¿Quieres tu nodo en este mapa?",
    appearBefore: "Conecta tu nodo a MQTT con el tema raíz ",
    appearTopic: "msh/US/PR",
    appearMid: ", activa ",
    appearOkToMqtt: "OK to MQTT",
    appearAfter:
      ", y pon el canal primario en Uplink activado. Guía completa en ",
    appearLink: "Configuración Recomendada → MQTT",
    appearLinkAfter: ".",
    popupLastSeen: "Visto por última vez",
    popupSnr: "SNR",
    popupPrecision: "Precisión de posición",
  },

  links: {
    title: "Enlaces y Recursos",
    description:
      "Recursos oficiales de la malla de Puerto Rico, el proyecto Meshtastic y documentación de referencia.",
    crumb: "Enlaces",
    eyebrow: "Enlaces y Recursos",
    h1: "Hacia dónde seguir",
    lede: "Todos los enlaces externos se abren en una pestaña nueva y están marcados como tales.",
    externalBadge: "Externo",
    externalBadgeSr: " — se abre en una pestaña nueva",
    prHeading: "Recursos de Puerto Rico",
    projectHeading: "Proyecto Oficial de Meshtastic",
    referenceHeading: "Documentación de Referencia",
    notes: {
      monitor:
        "Monitoreo comunitario en vivo de los nodos participantes de Puerto Rico.",
      palmasmesh: "Proyecto comunitario de Meshtastic en Puerto Rico.",
      mallapr:
        "Monitor y mapa de la red de Puerto Rico — la fuente de datos en vivo detrás del Mapa de Nodos de este sitio.",
      meshtasticOrg:
        "Proyecto oficial de Meshtastic — firmware, apps y documentación.",
      flasher:
        "Graba firmware en un equipo compatible directamente desde el navegador — sin controladores ni CLI.",
      hwList: "Lista actual y mantenida de equipos compatibles.",
      cli: "Referencia de configuración por línea de comandos.",
      antennaReports:
        "Datos reales de rendimiento de antenas, enviados por la comunidad de operadores de todo el mundo.",
      awesomeHw:
        "Recopilación mantenida por la comunidad de placas, sensores y armados menos comunes.",
      awesomeServer:
        "Recopilación mantenida por la comunidad de servidores MQTT, paneles y herramientas de monitoreo de mallas.",
      malla:
        "Analizador de redes Meshtastic de código abierto (MIT) que impulsa el mapa en vivo de Malla PR y los datos del Mapa de Nodos de este sitio.",
      azSettings:
        "Documentación de referencia que inspiró la estructura de este sitio.",
      azHardware:
        "Documentación de referencia que inspiró la estructura de este sitio.",
    },
  },

  notFound: {
    title: "Página no encontrada",
    description: "Esta página no existe.",
    eyebrow: "Señal perdida",
    h1: "No hay ruta a esta página.",
    body: "El enlace puede estar desactualizado, o el mensaje nunca llegó. Prueba con una de estas.",
    ctaHome: "Volver al inicio",
    ctaGettingStarted: "Primeros pasos",
  },

  mapPreview: {
    eyebrow: "Cobertura en vivo",
    h2: "La malla, ahora mismo.",
    copy: "Posiciones reales de nodos, obtenidas del monitor de red de Puerto Rico en la última compilación del sitio — no es una maqueta.",
    sampleNote: "La fuente en vivo no estaba disponible al compilar — se muestran posiciones de muestra.",
    nodes: "nodos",
    sampleNodes: "nodos de muestra",
    statOf: "de",
    statOnline: "en línea",
    cta: "Ver el mapa completo →",
  },

  search: {
    dialogAria: "Buscar en la documentación",
    placeholder: "Busca en docs, hardware, blog…",
    queryAria: "Consulta de búsqueda",
    prompt: "Escribe para buscar en la documentación y el blog de Meshtastic PR.",
    noResults: "Sin resultados. Prueba con otro término.",
  },

  themeToggle: {
    aria: "Cambiar el tema de color",
  },
};

export const ui = { en, es } satisfies Record<Locale, Strings>;

export function useStrings(locale: Locale): Strings {
  return ui[locale];
}

/** Localized display name for a blog category enum value. */
export function categoryLabel(locale: Locale, category: string): string {
  return ui[locale].categories[category] ?? category;
}
