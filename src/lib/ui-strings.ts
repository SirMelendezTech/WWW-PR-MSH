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
    protocols: "Meshtastic vs MeshCore",
    prMesh: "PR Mesh",
    map: "Node Map",
    blog: "Blog",
    community: "Community",
    links: "Links",
    searchAria: "Search documentation",
    viewSourceAria: "View source on GitHub",
    discordAria: "Join the PRMSH Discord",
    openMenuAria: "Open menu",
    closeMenuAria: "Close menu",
    primaryNavAria: "Primary",
    mobileNavAria: "Mobile",
    switchToEnglish: "View in English",
    switchToSpanish: "Ver en español",
    familyHome: "PRMSH Community",
    familyAria: "PRMSH sites",
    discordCta: "Join the Discord",
    sisterShort: "MeshCore PR",
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
    linksHeading: "Elsewhere",
    linksResources: "Links & resources",
    github: "Source on GitHub",
    discord: "Community Discord",
    sisterNetwork: "MeshCore PR (sister network)",
    nodeGuides: "Node setup guides (Spanish)",
    nodesReporting: (online: number, total: number) =>
      `${online} of ${total} nodes reporting`,
    rebuilt: (date: string) => `site rebuilt ${date}`,
    copyright: (year: number) => `© ${year} PRMSH Community.`,
    disclaimer:
      "This site is not affiliated with or endorsed by the Meshtastic project. PRMSH is an independent community project. Configure and operate radio equipment according to applicable laws, regulations, and current Meshtastic firmware documentation.",
    trademarkBefore:
      "Meshtastic® is a registered trademark of Meshtastic LLC. Meshtastic software components are released under various licenses, see ",
    trademarkLink: "GitHub",
    trademarkAfter: " for details.",
    platformNotice:
      "Android is a trademark of Google LLC. iPhone is a trademark of Apple Inc. The Android robot is reproduced or modified from work created and shared by Google and used according to terms described in the Creative Commons 3.0 Attribution License.",
    licenseBefore: "Site content licensed under ",
    licenseName: "CC BY-SA 4.0",
    licenseAfter: ".",
    colFamily: "PRMSH",
    colSite: "This site",
    colCommunity: "Community",
    prmshHome: "PRMSH home",
    officialDocs: "Official Meshtastic docs",
  },

  docs: {
    sidebarLabel: "Documentation",
    onThisPage: "On this page",
    untranslatedLabel: "Translation pending",
    untranslatedBody:
      "This page isn't translated yet — English content is shown.",
    docsPagesAria: "Documentation pages",
    readingOrder: "Read in order",
    prevLabel: "Back",
    nextLabel: "Next",
    pagerAria: "Documentation sequence",
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

  difficulties: {
    beginner: "Beginner",
    operator: "Operator",
  } as Record<string, string>,

  blogIndex: {
    title: "Blog",
    description:
      "Tutorials, field reports, node builds, and Puerto Rico mesh updates from the PRMSH community.",
    eyebrow: "PRMSH Blog",
    h1: "Field notes from the mesh",
    lede: "Tutorials, hardware reviews, node deployments, and coverage reports from operators building the network across Puerto Rico.",
    filterAria: "Filter by category",
    readSuffix: "read",
    noPosts: "No posts in this category yet.",
    countSuffix: "notes logged",
    countSuffixOne: "note logged",
  },

  blogPost: {
    blogCrumb: "Blog",
    readSuffix: "read",
    relatedHeading: "Related articles",
    tagsLabel: "Tags",
    bylineAuthor: "Author",
    bylineFiled: "Filed",
    bylineReading: "Reading",
  },

  home: {
    title: "PRMSH — Puerto Rico Meshtastic Community",
    description:
      "PRMSH is the Puerto Rico Meshtastic community — a resource for building, learning about, and expanding decentralized LoRa mesh communication throughout Puerto Rico.",
    heroEyebrow: "Puerto Rico / Community Meshtastic network",
    heroTitle: "Stays connected when everything else goes down.",
    heroSub1:
      "PRMSH is a community-built Meshtastic® radio network. Pair a small, affordable radio with your phone and send messages with no cell service, Wi-Fi, or internet.",
    heroSub2:
      "Some devices even have their own screen and keyboard, so you don't need a phone at all.",
    heroSub3:
      "Easy at any age. Use it every day — it's already on when the cell towers go dark.",
    heroCtaPrimary: "Get Started",
    heroCtaSecondary: "Explore the PR Mesh",

    introEyebrow: "What is Meshtastic?",
    introTitle: "Radios that talk to each other, not to a tower.",
    introBody1:
      "Meshtastic is open-source firmware for LoRa radios, and every node that joins does more than send its own messages — it extends the reach of everyone else's too, relaying traffic across the island one radio at a time.",
    introBody2:
      "Puerto Rico has already lived through weeks without cell service after Hurricane María and Fiona. This mesh exists so the next outage doesn't mean total silence.",
    introLink: "See how it actually works",
    sisterBefore: "PRMSH has a sister project: ",
    sisterLink: "MeshCore Puerto Rico (meshcore.prmsh.com)",
    sisterAfter: ", the island's MeshCore network. The radio protocol is different, so the two meshes can't hear each other.",
    compareLink: "Compare Meshtastic and MeshCore",
    whyEyebrow: "Why PRMSH",
    whyItems: [
      { lead: "No contract.", body: "A starter radio costs about as much as a nice dinner and keeps working for years." },
      { lead: "No permission.", body: "Put a node at home, on a rooftop, or along a trail, and everyone nearby gains coverage." },
      { lead: "No company.", body: "The docs are open, and the community decides how the network grows." },
      { lead: "Built by neighbors.", body: "Every node is a radio someone installed and looks after. The network is the sum of those radios." },
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
    splitCommunitySister: "See the sister network at meshcore.prmsh.com",

    blogEyebrow: "From the blog",
    blogTitle: "Latest from PRMSH",
    blogReadAll: "Read all posts",

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
    h1: "Built by the people using it",
    lede: "There's no company behind PRMSH. Operators put up nodes, share what they learn, and help each other extend coverage. Here's how to find them and get involved.",


    talkHeading: "Talk to operators",
    talkIntro: "Ask before you buy or mount anything. Operators near you know which sites already have coverage.",
    talkCaption: "Community channels: what each is for, its language, and the account it needs",
    colChannel: "Channel",
    colBestFor: "Best for",
    colLanguage: "Language",
    colAccount: "Account",
    channels: {
      discord: {
        name: "PRMSH Discord",
        bestFor: "Day-to-day chat, questions, and finding operators near you",
        language: "Spanish and English",
        account: "Discord",
      },
      facebook: {
        name: "Facebook group",
        bestFor: "Photos and news from around the island",
        language: "Spanish",
        account: "Facebook",
      },
      reddit: {
        name: "r/MeshtasticPuertoRico",
        bestFor: "Questions and answers that stay searchable",
        language: "Spanish and English",
        account: "Reddit, to post",
      },
    },
    siteBefore: "Choosing a site for a new node? Check regional status on ",
    siteLink: "Puerto Rico Mesh",
    siteAfter: " and ask in the Discord first. Coordinated placement fills real gaps instead of doubling coverage.",

    joinHeading: "Join a project",
    projects: {
      palmas: {
        name: "PalmasMesh",
        place: "Humacao",
        body: "A free neighborhood mesh in Palmas del Mar, built and run by residents as a backup for when power and cell service go down.",
      },
      skynet: {
        name: "SKYNET",
        place: "Island-wide",
        body: "The communications program of Resilient Network Puerto Rico, Inc. (RNPR): community networks, technical education, and preparedness tools.",
      },
    },
    ownName: "Start your own",
    ownBody: "A neighborhood node cluster, a trailhead repeater, a coordinated rooftop. Post it in the Discord so other operators can find and support it.",
    sisterBefore: "Running MeshCore instead? ",
    sisterLink: "MeshCore Puerto Rico",
    sisterAfter: " is PRMSH's sister network: same goal, different radio protocol.",

    helpHeading: "Help the mesh",
    fieldHeading: "Field testing",
    field1Before: "Range tests, hilltop to hilltop or along the coast, are among the most useful things anyone can do. Write down the hardware, antenna, distance, and result. See ",
    field1Link: "past field reports on the blog",
    field1After: ".",
    field2Before: "Testing an antenna? Send your numbers to ",
    field2Link: "Meshtastic Antenna Reports",
    field2After: " so operators everywhere can find them.",
    emergencyHeading: "Emergency communications",
    emergencyBefore: "Meshtastic doesn't replace licensed emergency services, but it adds a layer of household and neighborhood resilience during outages. Start with the ",
    emergencyLink: "hurricane-season checklist",
    emergencyAfter: ", and follow official emergency guidance for anything safety-critical.",
    contributeHeading: "Other ways to help",
    contributeItems: [
      "Put up a node. Even a modest home node helps.",
      "Write up a field test or a hardware review and share it.",
      "Help a newcomer configure their first radio.",
    ],
    gapsBefore: "Report coverage gaps you find so ",
    gapsLink: "Puerto Rico Mesh",
    gapsAfter: " stays accurate.",

    meetupsHeading: "Meetups",
    meetupsBefore: "Meetups, build nights, and range-test outings are announced in the ",
    meetupsLink: "PRMSH Discord",
    meetupsAfter: ". This page doesn't list dates, so nothing here goes stale.",
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
    sourceMonitor: "PRMSH Network Dashboard",
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
    viewsLabel: "Other views of the same mesh",
    viewsNewTab: " — opens in a new tab",
    viewsIntro:
      "This page shows one thing: where nodes are. These read the network along other axes.",
    views: [
      {
        measures: "Position",
        name: "Malla",
        url: "https://malla.prmsh.com/map",
        blurb:
          "The full map this page reads from, with filters, node history, and coverage over time.",
      },
      {
        measures: "Traffic",
        name: "MeshView",
        url: "https://meshview.prmsh.com/map",
        blurb:
          "The same island with the links drawn in — who is hearing whom, over a live packet feed.",
      },
      {
        measures: "Health",
        name: "MeshMonitor",
        url: "https://monitor.prmsh.com/",
        blurb:
          "Node-by-node diagnostics — clocks, duplicate keys, and channel use.",
      },
    ],
  },

  links: {
    title: "Links & Resources",
    description:
      "Puerto Rico mesh tools, community channels, device setup, and reference material, grouped by what you want to do.",
    crumb: "Links",
    h1: "Where to go from here",
    lede: "Tools, people, and references for the Puerto Rico mesh, grouped by what you want to do. Every link opens in a new tab.",
    externalBadgeSr: " (opens in a new tab)",
    groups: {
      network: "See the network",
      talk: "Talk to people",
      projects: "Projects in Puerto Rico",
      setup: "Set up a device",
      learn: "Learn more",
      global: "Global community",
    },
    names: {
      monitor: "PRMSH MeshMonitor",
      mallapr: "Malla PR",
      meshview: "MeshView PR",
      discord: "PRMSH Discord",
      facebookGroup: "Puerto Rico Meshtastic group on Facebook",
      redditPR: "r/MeshtasticPuertoRico on Reddit",
      palmasmesh: "PalmasMesh",
      skynet: "SKYNET",
      meshcorePr: "MeshCore Puerto Rico",
      nodeGuides: "PRMSH node guides",
      flasher: "Meshtastic Web Flasher",
      hwList: "Meshtastic supported hardware",
      cli: "Meshtastic CLI reference",
      azSettings: "Arizona recommended settings",
      azHardware: "Arizona recommended hardware",
      meshtasticOrg: "Meshtastic.org",
      antennaReports: "Meshtastic Antenna Reports",
      rfindex: "RF Index",
      redditGlobal: "r/meshtastic on Reddit",
      awesomeHw: "Awesome Meshtastic: hardware and sensors",
      awesomeServer: "Awesome Meshtastic: server software",
      malla: "Malla source code",
    } as Record<string, string>,
    notes: {
      monitor: "Live community monitoring for participating Puerto Rico nodes.",
      mallapr: "Network monitor and map. The live data behind this site's Node Map.",
      meshview: "Live packet feed: messages, telemetry, and which nodes hear each other.",
      discord: "Questions, builds, and coordination with Puerto Rico operators.",
      facebookGroup: "Posts, photos, and news from operators around the island.",
      redditPR: "Threaded questions and answers that stay searchable.",
      palmasmesh: "Neighborhood mesh in Palmas del Mar, Humacao, run by residents.",
      skynet: "RNPR's resilient communications program: networks, education, preparedness.",
      meshcorePr: "PRMSH's sister network. Different protocol; it can't talk to Meshtastic radios.",
      nodeGuides: "Step-by-step setup for Meshtastic and MeshCore nodes on this mesh. In Spanish.",
      flasher: "Official tool. Flash firmware from the browser, no drivers or CLI needed.",
      hwList: "Official, maintained list of supported devices.",
      cli: "Official command-line configuration reference.",
      azSettings: "Another community's recommended settings. Not specific to Puerto Rico.",
      azHardware: "Another community's hardware picks. Not specific to Puerto Rico.",
      meshtasticOrg: "The official project: firmware, apps, and documentation.",
      antennaReports: "Real-world antenna performance data submitted by operators worldwide.",
      rfindex: "Device and antenna specs with bench VSWR measurements. Covers MeshCore hardware too.",
      redditGlobal: "Global subreddit in English: project news and troubleshooting.",
      awesomeHw: "Community roundup of boards, sensors, and less common builds.",
      awesomeServer: "Community roundup of MQTT servers, dashboards, and monitoring tools.",
      malla: "Open-source network analyzer (MIT) that powers Malla PR and the Node Map data.",
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
    statKnown: "known nodes",
    statOffline: "offline",
    panelLabel: "PR mesh",
    updated: (date: string) => `Data from the ${date} build`,
    mapAria: (total: number, online: number) =>
      `Map of Puerto Rico, Vieques and St. Thomas showing ${total} mesh nodes, ${online} of them online. Node markers cluster around the San Juan metro area and the east of the island.`,
    legendOnline: "Heard in the last 3 hours",
    legendOffline: "Quiet longer than that",
    legendHint: "Point at a node for its name",
    reliefCredit: "Relief: AWS Terrain Tiles (SRTM, USGS 3DEP)",
    cta: "View full map",
  },

  search: {
    dialogAria: "Search documentation",
    placeholder: "Search docs, hardware, blog…",
    queryAria: "Search query",
    prompt: "Type to search PRMSH documentation and blog posts.",
    noResults: "No results. Try a different term.",
    loading: "Loading search…",
    loadError: "Search could not load. Check your connection and try again.",
    retry: "Try again",
    resultOne: "1 result",
    resultMany: "{n} results",
  },

  themeToggle: {
    toDark: "Switch to dark theme",
    toLight: "Switch to light theme",
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
    protocols: "Meshtastic vs MeshCore",
    prMesh: "Malla PR",
    map: "Mapa de Nodos",
    blog: "Blog",
    community: "Comunidad",
    links: "Enlaces",
    searchAria: "Buscar en la documentación",
    viewSourceAria: "Ver el código fuente en GitHub",
    discordAria: "Únete al Discord de PRMSH",
    openMenuAria: "Abrir menú",
    closeMenuAria: "Cerrar menú",
    primaryNavAria: "Principal",
    mobileNavAria: "Móvil",
    switchToEnglish: "Ver en inglés",
    switchToSpanish: "Ver en español",
    familyHome: "Comunidad PRMSH",
    familyAria: "Sitios de PRMSH",
    discordCta: "Únete al Discord",
    sisterShort: "MeshCore PR",
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
    linksHeading: "En otros lados",
    linksResources: "Enlaces y recursos",
    github: "Código en GitHub",
    discord: "Discord de la comunidad",
    sisterNetwork: "MeshCore PR (red hermana)",
    nodeGuides: "Guías de configuración de nodos",
    nodesReporting: (online: number, total: number) =>
      `${online} de ${total} nodos reportando`,
    rebuilt: (date: string) => `sitio reconstruido ${date}`,
    copyright: (year: number) =>
      `© ${year} Comunidad PRMSH.`,
    disclaimer:
      "Este sitio no está afiliado ni respaldado por el proyecto Meshtastic. PRMSH es un proyecto comunitario independiente. Configura y opera equipos de radio de acuerdo con las leyes, reglamentos y la documentación vigente del firmware de Meshtastic.",
    trademarkBefore:
      "Meshtastic® es una marca registrada de Meshtastic LLC. Los componentes de software de Meshtastic se publican bajo varias licencias; consulta ",
    trademarkLink: "GitHub",
    trademarkAfter: " para más detalles.",
    platformNotice:
      "Android es una marca de Google LLC. iPhone es una marca de Apple Inc. El robot de Android se reproduce o modifica a partir de una obra creada y compartida por Google, y se usa según los términos de la Licencia Creative Commons 3.0 Attribution.",
    licenseBefore: "Contenido del sitio bajo licencia ",
    licenseName: "CC BY-SA 4.0",
    licenseAfter: ".",
    colFamily: "PRMSH",
    colSite: "Este sitio",
    colCommunity: "Comunidad",
    prmshHome: "Inicio de PRMSH",
    officialDocs: "Documentación oficial de Meshtastic",
  },

  docs: {
    sidebarLabel: "Documentación",
    onThisPage: "En esta página",
    untranslatedLabel: "Traducción pendiente",
    untranslatedBody:
      "Esta página aún no está traducida — se muestra el contenido en inglés.",
    docsPagesAria: "Páginas de documentación",
    readingOrder: "Lee en orden",
    prevLabel: "Atrás",
    nextLabel: "Siguiente",
    pagerAria: "Secuencia de documentación",
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
  } as Record<string, string>,

  difficulties: {
    beginner: "Principiante",
    operator: "Operador",
  } as Record<string, string>,

  blogIndex: {
    title: "Blog",
    description:
      "Tutoriales, reportes de campo, construcción de nodos y actualizaciones de la malla de Puerto Rico de la comunidad PRMSH.",
    eyebrow: "Blog de PRMSH",
    h1: "Notas de campo desde la malla",
    lede: "Tutoriales, reseñas de hardware, despliegues de nodos y reportes de cobertura de operadores que construyen la red por todo Puerto Rico.",
    filterAria: "Filtrar por categoría",
    readSuffix: "de lectura",
    noPosts: "Aún no hay artículos en esta categoría.",
    countSuffix: "notas registradas",
    countSuffixOne: "nota registrada",
  },

  blogPost: {
    blogCrumb: "Blog",
    readSuffix: "de lectura",
    relatedHeading: "Artículos relacionados",
    tagsLabel: "Etiquetas",
    bylineAuthor: "Autor",
    bylineFiled: "Publicado",
    bylineReading: "Lectura",
  },

  home: {
    title: "PRMSH — Comunidad Meshtastic de Puerto Rico",
    description:
      "PRMSH es la comunidad Meshtastic de Puerto Rico — un recurso comunitario para construir, aprender sobre y ampliar la comunicación mesh LoRa descentralizada por todo Puerto Rico.",
    heroEyebrow: "Puerto Rico / Red Meshtastic comunitaria",
    heroTitle: "Sigue conectada cuando todo lo demás se cae.",
    heroSub1:
      "PRMSH es una red de radio Meshtastic® construida por la comunidad. Empareja una radio pequeña y económica con tu teléfono y envía mensajes sin servicio celular, Wi-Fi ni internet.",
    heroSub2:
      "Algunos equipos hasta tienen su propia pantalla y teclado, así que no necesitas teléfono para nada.",
    heroSub3:
      "Fácil a cualquier edad. Úsala a diario — ya está encendida cuando las torres celulares se apagan.",
    heroCtaPrimary: "Comenzar",
    heroCtaSecondary: "Explorar la Malla PR",

    introEyebrow: "¿Qué es Meshtastic?",
    introTitle: "Radios que se hablan entre sí, no con una torre.",
    introBody1:
      "Meshtastic es firmware de código abierto para radios LoRa, y cada nodo que se une hace más que enviar sus propios mensajes — también amplía el alcance de los demás, retransmitiendo tráfico por toda la isla una radio a la vez.",
    introBody2:
      "Puerto Rico ya ha vivido semanas sin servicio celular tras los huracanes María y Fiona. Esta malla existe para que el próximo apagón no signifique silencio total.",
    introLink: "Mira cómo funciona de verdad",
    sisterBefore: "PRMSH tiene un proyecto hermano: ",
    sisterLink: "MeshCore Puerto Rico (meshcore.prmsh.com)",
    sisterAfter: ", la red MeshCore de la isla. El protocolo de radio es distinto, así que las dos mallas no se escuchan entre sí.",
    compareLink: "Compara Meshtastic y MeshCore",
    whyEyebrow: "Por qué PRMSH",
    whyItems: [
      { lead: "Sin contrato.", body: "Una radio para empezar cuesta lo que una buena cena y sigue funcionando por años." },
      { lead: "Sin permiso.", body: "Pon un nodo en tu casa, en un techo o en una vereda, y todos a tu alrededor ganan cobertura." },
      { lead: "Sin compañía.", body: "La documentación es abierta y la comunidad decide cómo crece la red." },
      { lead: "Hecha por vecinos.", body: "Cada nodo es una radio que alguien instaló y cuida. La red es la suma de esas radios." },
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
    splitCommunitySister: "Ver la red hermana en meshcore.prmsh.com",

    blogEyebrow: "Del blog",
    blogTitle: "Lo más reciente de PRMSH",
    blogReadAll: "Lee todos los artículos",

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
    h1: "Construida por quienes la usan",
    lede: "No hay ninguna compañía detrás de PRMSH. Los operadores instalan nodos, comparten lo que aprenden y se ayudan a ampliar la cobertura. Así puedes encontrarlos y participar.",


    talkHeading: "Habla con operadores",
    talkIntro: "Pregunta antes de comprar o instalar nada. Los operadores cerca de ti saben qué sitios ya tienen cobertura.",
    talkCaption: "Canales de la comunidad: para qué sirve cada uno, su idioma y la cuenta que necesita",
    colChannel: "Canal",
    colBestFor: "Ideal para",
    colLanguage: "Idioma",
    colAccount: "Cuenta",
    channels: {
      discord: {
        name: "Discord de PRMSH",
        bestFor: "Conversación diaria, preguntas y encontrar operadores cerca de ti",
        language: "Español e inglés",
        account: "Discord",
      },
      facebook: {
        name: "Grupo de Facebook",
        bestFor: "Fotos y noticias de toda la isla",
        language: "Español",
        account: "Facebook",
      },
      reddit: {
        name: "r/MeshtasticPuertoRico",
        bestFor: "Preguntas y respuestas que se pueden buscar después",
        language: "Español e inglés",
        account: "Reddit, para publicar",
      },
    },
    siteBefore: "¿Vas a escoger un sitio para un nodo nuevo? Consulta el estado regional en ",
    siteLink: "Malla de Puerto Rico",
    siteAfter: " y pregunta primero en el Discord. Coordinar la ubicación llena huecos reales en vez de duplicar cobertura.",

    joinHeading: "Únete a un proyecto",
    projects: {
      palmas: {
        name: "PalmasMesh",
        place: "Humacao",
        body: "Una malla vecinal gratuita en Palmas del Mar, que los residentes construyen y operan como respaldo para cuando se van la luz y la señal celular.",
      },
      skynet: {
        name: "SKYNET",
        place: "Toda la isla",
        body: "El programa de comunicaciones de Resilient Network Puerto Rico, Inc. (RNPR): redes comunitarias, educación técnica y herramientas de preparación.",
      },
    },
    ownName: "Empieza el tuyo",
    ownBody: "Un grupo de nodos de barrio, un repetidor en el inicio de una vereda, un techo coordinado. Publícalo en el Discord para que otros operadores lo encuentren y lo apoyen.",
    sisterBefore: "¿Usas MeshCore? ",
    sisterLink: "MeshCore Puerto Rico",
    sisterAfter: " es la red hermana de PRMSH: la misma meta, otro protocolo de radio.",

    helpHeading: "Ayuda a la malla",
    fieldHeading: "Pruebas de campo",
    field1Before: "Las pruebas de alcance, de cima a cima o por la costa, son de lo más útil que cualquiera puede hacer. Anota el hardware, la antena, la distancia y el resultado. Mira los ",
    field1Link: "reportes de campo en el blog",
    field1After: ".",
    field2Before: "¿Estás probando una antena? Envía tus números a ",
    field2Link: "Meshtastic Antenna Reports",
    field2After: " para que operadores de todas partes los encuentren.",
    emergencyHeading: "Comunicaciones de emergencia",
    emergencyBefore: "Meshtastic no reemplaza a los servicios de emergencia licenciados, pero añade una capa de resiliencia al hogar y al vecindario durante los apagones. Empieza con la ",
    emergencyLink: "lista de preparación para la temporada de huracanes",
    emergencyAfter: ", y sigue la orientación oficial de emergencias para todo lo que sea crítico para la seguridad.",
    contributeHeading: "Otras formas de ayudar",
    contributeItems: [
      "Instala un nodo. Hasta un modesto nodo casero ayuda.",
      "Escribe sobre una prueba de campo o una reseña de hardware y compártela.",
      "Ayuda a alguien nuevo a configurar su primera radio.",
    ],
    gapsBefore: "Reporta los huecos de cobertura que encuentres para que ",
    gapsLink: "Malla de Puerto Rico",
    gapsAfter: " se mantenga precisa.",

    meetupsHeading: "Encuentros",
    meetupsBefore: "Los encuentros, las noches de armado y las salidas de prueba de alcance se anuncian en el ",
    meetupsLink: "Discord de PRMSH",
    meetupsAfter: ". Esta página no lista fechas, así que nada aquí se queda viejo.",
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
    sourceMonitor: "PRMSH Network Dashboard",
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
    viewsLabel: "Otras vistas de la misma malla",
    viewsNewTab: " — se abre en una pestaña nueva",
    viewsIntro:
      "Esta página muestra una sola cosa: dónde están los nodos. Estas leen la red por otros ejes.",
    views: [
      {
        measures: "Posición",
        name: "Malla",
        url: "https://malla.prmsh.com/map",
        blurb:
          "El mapa completo del que lee esta página, con filtros, historial de nodos y cobertura en el tiempo.",
      },
      {
        measures: "Tráfico",
        name: "MeshView",
        url: "https://meshview.prmsh.com/map",
        blurb:
          "La misma isla con los enlaces dibujados — quién oye a quién, sobre un flujo de paquetes en vivo.",
      },
      {
        measures: "Salud",
        name: "MeshMonitor",
        url: "https://monitor.prmsh.com/",
        blurb:
          "Diagnóstico nodo por nodo — relojes, llaves duplicadas y uso de canales.",
      },
    ],
  },

  links: {
    title: "Enlaces y Recursos",
    description:
      "Herramientas de la malla de Puerto Rico, canales de la comunidad, configuración de equipos y material de referencia, agrupados según lo que quieras hacer.",
    crumb: "Enlaces",
    h1: "Hacia dónde seguir",
    lede: "Herramientas, gente y referencias para la malla de Puerto Rico, agrupadas según lo que quieras hacer. Todos los enlaces se abren en una pestaña nueva.",
    externalBadgeSr: " (se abre en una pestaña nueva)",
    groups: {
      network: "Ver la red",
      talk: "Hablar con la gente",
      projects: "Proyectos en Puerto Rico",
      setup: "Configurar un equipo",
      learn: "Aprender más",
      global: "Comunidad global",
    },
    names: {
      monitor: "PRMSH MeshMonitor",
      mallapr: "Malla PR",
      meshview: "MeshView PR",
      discord: "Discord de PRMSH",
      facebookGroup: "Grupo de Meshtastic de Puerto Rico en Facebook",
      redditPR: "r/MeshtasticPuertoRico en Reddit",
      palmasmesh: "PalmasMesh",
      skynet: "SKYNET",
      meshcorePr: "MeshCore Puerto Rico",
      nodeGuides: "Guías de nodos de PRMSH",
      flasher: "Meshtastic Web Flasher",
      hwList: "Hardware compatible con Meshtastic",
      cli: "Referencia del CLI de Meshtastic",
      azSettings: "Configuración recomendada de Arizona",
      azHardware: "Hardware recomendado de Arizona",
      meshtasticOrg: "Meshtastic.org",
      antennaReports: "Meshtastic Antenna Reports",
      rfindex: "RF Index",
      redditGlobal: "r/meshtastic en Reddit",
      awesomeHw: "Awesome Meshtastic: hardware y sensores",
      awesomeServer: "Awesome Meshtastic: software de servidor",
      malla: "Código fuente de Malla",
    } as Record<string, string>,
    notes: {
      monitor: "Monitoreo comunitario en vivo de los nodos participantes de Puerto Rico.",
      mallapr: "Monitor y mapa de la red. Los datos en vivo detrás del Mapa de Nodos de este sitio.",
      meshview: "Flujo de paquetes en vivo: mensajes, telemetría y qué nodos se oyen entre sí.",
      discord: "Preguntas, proyectos y coordinación con operadores de Puerto Rico.",
      facebookGroup: "Publicaciones, fotos y noticias de operadores de toda la isla.",
      redditPR: "Preguntas y respuestas en hilos que se pueden buscar después.",
      palmasmesh: "Malla vecinal en Palmas del Mar, Humacao, operada por residentes.",
      skynet: "Programa de comunicaciones resilientes de RNPR: redes, educación y preparación.",
      meshcorePr: "Red hermana de PRMSH. Otro protocolo; no se comunica con radios Meshtastic.",
      nodeGuides: "Configuración paso a paso de nodos Meshtastic y MeshCore en esta malla.",
      flasher: "Herramienta oficial. Instala el firmware desde el navegador, sin drivers ni CLI.",
      hwList: "Lista oficial y mantenida de equipos compatibles. En inglés.",
      cli: "Referencia oficial de configuración por línea de comandos. En inglés.",
      azSettings: "Configuración recomendada por otra comunidad. No es específica de Puerto Rico.",
      azHardware: "Selección de hardware de otra comunidad. No es específica de Puerto Rico.",
      meshtasticOrg: "El proyecto oficial: firmware, aplicaciones y documentación.",
      antennaReports: "Datos reales de rendimiento de antenas enviados por operadores de todo el mundo.",
      rfindex: "Especificaciones de equipos y antenas con medidas de VSWR. Incluye hardware MeshCore.",
      redditGlobal: "Subreddit global en inglés: noticias del proyecto y solución de problemas.",
      awesomeHw: "Recopilación comunitaria de placas, sensores y montajes menos comunes.",
      awesomeServer: "Recopilación comunitaria de servidores MQTT, paneles y herramientas de monitoreo.",
      malla: "Analizador de red de código abierto (MIT) que alimenta Malla PR y el Mapa de Nodos.",
    } as Record<string, string>,
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
    statKnown: "nodos conocidos",
    statOffline: "fuera de línea",
    panelLabel: "Malla PR",
    updated: (date: string) => `Datos de la compilación del ${date}`,
    mapAria: (total: number, online: number) =>
      `Mapa de Puerto Rico, Vieques y St. Thomas con ${total} nodos de la malla, ${online} de ellos en línea. Los nodos se concentran en el área metropolitana de San Juan y el este de la isla.`,
    legendOnline: "Escuchado en las últimas 3 horas",
    legendOffline: "Callado desde hace más",
    legendHint: "Apunta a un nodo para ver su nombre",
    reliefCredit: "Relieve: AWS Terrain Tiles (SRTM, USGS 3DEP)",
    cta: "Ver el mapa completo",
  },

  search: {
    dialogAria: "Buscar en la documentación",
    placeholder: "Busca en docs, hardware, blog…",
    queryAria: "Consulta de búsqueda",
    prompt: "Escribe para buscar en la documentación y el blog de PRMSH.",
    noResults: "Sin resultados. Prueba con otro término.",
    loading: "Cargando la búsqueda…",
    loadError: "La búsqueda no pudo cargar. Revisa tu conexión e inténtalo otra vez.",
    retry: "Intentar otra vez",
    resultOne: "1 resultado",
    resultMany: "{n} resultados",
  },

  themeToggle: {
    toDark: "Cambiar al tema oscuro",
    toLight: "Cambiar al tema claro",
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

/** Localized display name for a blog post's difficulty tag ("beginner" / "operator"). */
export function difficultyLabel(locale: Locale, difficulty: string): string {
  return ui[locale].difficulties[difficulty] ?? difficulty;
}
