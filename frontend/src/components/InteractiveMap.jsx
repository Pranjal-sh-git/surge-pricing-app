import { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

// ── Custom Markers ─────────────────────────────────────────────────
const pickupIcon = new L.DivIcon({
  html: `<div style="width:28px;height:28px;background:#111;border:3px solid #1DB954;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 14px rgba(0,0,0,0.4)"></div>`,
  iconSize: [28, 28], iconAnchor: [14, 28], className: '',
});
const dropoffIcon = new L.DivIcon({
  html: `<div style="width:28px;height:28px;background:#1DB954;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 14px rgba(29,185,84,0.6)"></div>`,
  iconSize: [28, 28], iconAnchor: [14, 28], className: '',
});

// ── OSRM Route ─────────────────────────────────────────────────────
const fetchOSRMRoute = async (pickup, dropoff) => {
  const url = `https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${dropoff[1]},${dropoff[0]}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes.length) throw new Error('No route');
  const route = data.routes[0];
  return {
    coords: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distanceKm: Math.round((route.distance / 1000) * 10) / 10,
    durationMin: Math.round(route.duration / 60),
  };
};

// ── Fit map to bounds ──────────────────────────────────────────────
const MapFitter = ({ routeCoords, pickupCoords, dropoffCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (routeCoords?.length) {
      map.fitBounds(L.latLngBounds(routeCoords), { padding: [45, 45], maxZoom: 15 });
    } else if (pickupCoords && dropoffCoords) {
      map.fitBounds(L.latLngBounds([pickupCoords, dropoffCoords]), { padding: [60, 60] });
    }
  }, [routeCoords, pickupCoords, dropoffCoords, map]);
  return null;
};

// ── Map pan helper ─────────────────────────────────────────────────
const MapPanner = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (target) map.setView(target, Math.max(map.getZoom(), 14), { animate: true });
  }, [target, map]);
  return null;
};

// ── Click handler — FIXED: never auto-reset to pickup ──────────────
// nextPoint: 'pickup' | 'dropoff' | null (both set, do nothing)
const LocationMarker = ({ setPickup, setDropoff, pickupCoords, dropoffCoords, resetRoute }) => {
  useMapEvents({
    click(e) {
      const coords = [e.latlng.lat, e.latlng.lng];
      if (!pickupCoords) {
        setPickup(coords);
      } else if (!dropoffCoords) {
        setDropoff(coords);
      } else {
        // Both set: Reset and start fresh pickup at click location
        resetRoute();
        setDropoff(null);
        setPickup(coords);
      }
    },
  });
  return null;
};



// ── Main Component ─────────────────────────────────────────────────
export const InteractiveMap = ({ pickupCoords, dropoffCoords, onPickupChange, onDropoffChange, onRouteData }) => {
  const [center] = useState([28.6139, 77.2090]);
  const [routeCoords, setRouteCoords] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [panTarget, setPanTarget] = useState(null);

  // What the NEXT click on map should do
  const nextPoint = !pickupCoords ? 'pickup' : !dropoffCoords ? 'dropoff' : null;

  const getAddress = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      return data.display_name.split(',').slice(0, 2).join(',').trim();
    } catch { return `${lat.toFixed(4)}, ${lng.toFixed(4)}`; }
  };

  const handleSetPickup = useCallback(async (coords) => {
    if (!coords) { onPickupChange(null, ''); return; }
    const addr = await getAddress(coords[0], coords[1]);
    onPickupChange(coords, addr);
  }, [onPickupChange]);

  const handleSetDropoff = useCallback(async (coords) => {
    if (!coords) { onDropoffChange(null, ''); return; }
    const addr = await getAddress(coords[0], coords[1]);
    onDropoffChange(coords, addr);
  }, [onDropoffChange]);

  // Pan map when coordinates change from side panel search
  useEffect(() => {
    if (pickupCoords && !dropoffCoords) setPanTarget(pickupCoords);
    if (dropoffCoords && !pickupCoords) setPanTarget(dropoffCoords);
  }, [pickupCoords, dropoffCoords]);

  const handleClearPickup = () => { onPickupChange(null, ''); setRouteCoords(null); setRouteInfo(null); };
  const handleClearDropoff = () => { onDropoffChange(null, ''); setRouteCoords(null); setRouteInfo(null); };

  const resetRoute = useCallback(() => {
    setRouteCoords(null);
    setRouteInfo(null);
  }, []);

  // OSRM route
  useEffect(() => {
    if (!pickupCoords || !dropoffCoords) { setRouteCoords(null); setRouteInfo(null); return; }
    let cancelled = false;
    setRouteLoading(true);
    fetchOSRMRoute(pickupCoords, dropoffCoords)
      .then(({ coords, distanceKm, durationMin }) => {
        if (cancelled) return;
        setRouteCoords(coords);
        setRouteInfo({ distanceKm, durationMin });
        if (onRouteData) onRouteData(distanceKm, durationMin);
      })
      .catch(() => { if (!cancelled) setRouteCoords([pickupCoords, dropoffCoords]); })
      .finally(() => { if (!cancelled) setRouteLoading(false); });
    return () => { cancelled = true; };
  }, [pickupCoords, dropoffCoords, onRouteData]);

  // Status line
  const hint = !pickupCoords ? '📍 Click map or search in side panel to set Pickup'
    : !dropoffCoords ? '🟢 Click map or search in side panel to set Dropoff'
    : '🔄 Click anywhere to reset and start a new trip';

  return (
    <div className="w-full h-full relative">



      {/* ── Map ────────────────────────────────────────────────────── */}
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFitter routeCoords={routeCoords} pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
        <MapPanner target={panTarget} />
        <LocationMarker
          pickupCoords={pickupCoords} dropoffCoords={dropoffCoords}
          setPickup={handleSetPickup} setDropoff={handleSetDropoff}
          resetRoute={resetRoute}
        />

        {pickupCoords && <Marker position={pickupCoords} icon={pickupIcon}><Popup>📍 Pickup</Popup></Marker>}
        {dropoffCoords && <Marker position={dropoffCoords} icon={dropoffIcon}><Popup>🟢 Dropoff</Popup></Marker>}

        {routeCoords && <Polyline positions={routeCoords} color="#1DB954" weight={10} opacity={0.15} />}
        {routeCoords && <Polyline positions={routeCoords} color="#1DB954" weight={4} opacity={1} />}
      </MapContainer>

      {/* ── Route info badge (top-right, next to search) ──────────── */}
      {routeInfo && !routeLoading && (
        <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur border border-gray-200 text-gray-800 rounded-xl px-3 py-2 shadow-lg text-center min-w-[80px]">
          <div className="text-[9px] font-bold text-[#1DB954] uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse inline-block" /> Route
          </div>
          <div className="text-sm font-bold text-gray-900">{routeInfo.distanceKm} km</div>
          <div className="text-[10px] text-gray-500">{routeInfo.durationMin} min</div>
        </div>
      )}

      {routeLoading && (
        <div className="absolute top-3 right-3 z-[1000] bg-white/90 border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
          <svg className="animate-spin w-3.5 h-3.5 text-[#1DB954]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75"/>
          </svg>
          <span className="text-xs text-gray-700 font-semibold">Routing…</span>
        </div>
      )}

      {/* ── Bottom hint bar ─────────────────────────────────────────── */}
      <div className="absolute bottom-3 left-3 right-3 bg-black/55 backdrop-blur text-white text-[9px] py-1.5 px-3 rounded-lg border border-white/10 z-[1000] pointer-events-none text-center uppercase tracking-widest font-bold">
        {hint}
      </div>
    </div>
  );
};
