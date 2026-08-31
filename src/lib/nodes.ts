// Node map data layer.
//
// getNodes() fetches live Puerto Rico node positions from the Meshtastic PR
// Network Monitor (malla.prmsh.com), which runs Malla
// (https://github.com/zenitraM/malla, MIT). This runs at build time inside
// Astro's server-side render, not in the browser, so it isn't subject to
// the API's lack of CORS headers. If the fetch fails (network hiccup during
// a build, API temporarily down), it falls back to static sample data so
// the site still builds. The map page reads the result once at build time
// and passes it to the client as inline JSON — the browser never calls
// this API directly.

export interface MeshNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: "client" | "client-mute" | "router" | "solar";
  status: "online" | "offline";
  lastSeen: string;
  precisionMeters?: number;
  snr?: number;
}

const MALLA_LOCATIONS_URL = "https://malla.prmsh.com/api/locations";

interface MallaLocation {
  node_id: number;
  display_name?: string;
  long_name?: string;
  short_name?: string;
  latitude: number;
  longitude: number;
  role?: string;
  hw_model?: string;
  age_hours: number;
  avg_snr?: number | null;
  precision_meters?: number | null;
  timestamp_str?: string;
}

function mapRole(role: string | undefined, hwModel: string | undefined): MeshNode["type"] {
  if ((hwModel ?? "").toUpperCase().includes("SOLAR")) return "solar";
  switch ((role ?? "").toUpperCase()) {
    case "ROUTER":
    case "ROUTER_LATE":
      return "router";
    case "CLIENT_MUTE":
      return "client-mute";
    default:
      return "client";
  }
}

function formatLastSeen(ageHours: number): string {
  if (ageHours < 1) return `${Math.max(1, Math.round(ageHours * 60))} min ago`;
  if (ageHours < 24) return `${Math.round(ageHours)} hr ago`;
  return `${Math.round(ageHours / 24)} day${ageHours >= 48 ? "s" : ""} ago`;
}

async function fetchLiveNodes(): Promise<MeshNode[]> {
  // The Malla API sits behind Cloudflare, which 403s datacenter IPs (e.g. the
  // GitHub Actions runner). Set MALLA_API_TOKEN in the build environment and add
  // a matching Cloudflare WAF skip rule ("if header x-site-key equals <token>")
  // so production builds get live data instead of the sample fallback.
  const token = import.meta.env.MALLA_API_TOKEN;
  const res = await fetch(MALLA_LOCATIONS_URL, {
    headers: {
      Accept: "application/json",
      ...(token ? { "x-site-key": token } : {}),
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Malla API responded ${res.status}`);

  const data = (await res.json()) as { locations?: MallaLocation[] };
  const locations = data.locations ?? [];

  return locations
    .filter((loc) => typeof loc.latitude === "number" && typeof loc.longitude === "number")
    .map((loc) => ({
      id: `pr-${loc.node_id}`,
      name: loc.display_name || loc.long_name || loc.short_name || `Node ${loc.node_id}`,
      lat: loc.latitude,
      lng: loc.longitude,
      type: mapRole(loc.role, loc.hw_model),
      status: loc.age_hours <= 3 ? "online" : "offline",
      lastSeen: formatLastSeen(loc.age_hours),
      precisionMeters: loc.precision_meters ?? undefined,
      snr: loc.avg_snr ?? undefined,
    }));
}

// Used only if the live fetch fails — approximate, illustrative positions,
// not real operator locations.
function getFallbackNodes(): MeshNode[] {
  return [
    { id: "demo-sju-01", name: "San Juan Metro — Demo Node", lat: 18.4655, lng: -66.1057, type: "router", status: "online", lastSeen: "12 min ago", snr: 7.2 },
    { id: "demo-bay-01", name: "Bayamón — Demo Node", lat: 18.3985, lng: -66.1614, type: "client", status: "online", lastSeen: "4 min ago", snr: 5.8 },
    { id: "demo-car-01", name: "Carolina — Demo Node", lat: 18.3809, lng: -65.9528, type: "client", status: "offline", lastSeen: "3 hr ago" },
    { id: "demo-cag-01", name: "Caguas — Demo Node", lat: 18.2342, lng: -66.0356, type: "solar", status: "online", lastSeen: "1 min ago", snr: 9.1 },
    { id: "demo-pon-01", name: "Ponce — Demo Node", lat: 18.0111, lng: -66.6141, type: "client", status: "online", lastSeen: "18 min ago", snr: 4.4 },
    { id: "demo-may-01", name: "Mayagüez — Demo Node", lat: 18.2013, lng: -67.1397, type: "client-mute", status: "online", lastSeen: "2 min ago" },
    { id: "demo-are-01", name: "Arecibo — Demo Node", lat: 18.4744, lng: -66.7156, type: "client", status: "offline", lastSeen: "1 day ago" },
  ];
}

export async function getNodes(): Promise<{ nodes: MeshNode[]; live: boolean }> {
  try {
    const nodes = await fetchLiveNodes();
    if (nodes.length === 0) throw new Error("Malla API returned no locations");
    return { nodes, live: true };
  } catch (err) {
    console.warn(`[nodes] Falling back to sample data: ${(err as Error).message}`);
    return { nodes: getFallbackNodes(), live: false };
  }
}
