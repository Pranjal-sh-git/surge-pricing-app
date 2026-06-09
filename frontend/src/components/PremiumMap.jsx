import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
window.L = L;
import 'leaflet.heat';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

// ── Mode colour palette ─────────────────────────────────────────────
const MODE_COLORS = {
  cab:    { primary: '#1DB954', glow: 'rgba(29,185,84,0.6)',   label: 'Road Route',   dash: '' },
  train:  { primary: '#3B82F6', glow: 'rgba(59,130,246,0.6)',  label: 'Rail Route',   dash: '12 8' },
  flight: { primary: '#F59E0B', glow: 'rgba(245,158,11,0.6)',  label: 'Flight Path',  dash: '4 8' },
  all:    { primary: '#1DB954', glow: 'rgba(29,185,84,0.5)',   label: 'Road Route',   dash: '' },
};

// ── Build a great-circle arc between two points (for flights) ─────
const buildArcPath = (p1, p2, numPoints = 50) => {
  const toRad = d => d * Math.PI / 180;
  const [lat1, lng1] = p1.map(toRad);
  const [lat2, lng2] = p2.map(toRad);
  const d = 2 * Math.asin(Math.sqrt(
    Math.sin((lat2 - lat1) / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin((lng2 - lng1) / 2) ** 2
  ));
  if (d === 0) return [p1, p2];
  const points = [];
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
    const y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
    const lng = Math.atan2(y, x) * 180 / Math.PI;
    // Add altitude bow (latitude shift) for visual arc
    const bow = Math.sin(f * Math.PI) * (d * 180 / Math.PI) * 0.12;
    points.push([lat + bow, lng]);
  }
  return points;
};

// ── Custom Markers — Google Maps teardrop-pin style ─────────────────
const makePickupIcon = (color = '#1DB954') => new L.DivIcon({
  html: `
    <div style="position:relative;width:32px;height:42px">
      <!-- Pin body -->
      <div style="
        width:32px;height:32px;
        background:${color};
        border:3px solid #fff;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 4px 16px rgba(0,0,0,0.35),0 0 0 2px ${color}44;
        position:absolute;top:0;left:0;
      "></div>
      <!-- Letter label -->
      <div style="
        position:absolute;top:4px;left:7px;
        color:#fff;font-size:11px;font-weight:900;
        font-family:system-ui,sans-serif;line-height:1;
        text-shadow:0 1px 2px rgba(0,0,0,0.4);
      ">A</div>
    </div>`,
  iconSize: [32, 42], iconAnchor: [16, 42], className: '',
});

const makeDropoffIcon = (color = '#1DB954') => new L.DivIcon({
  html: `
    <div style="position:relative;width:32px;height:42px">
      <!-- Pin body -->
      <div style="
        width:32px;height:32px;
        background:${color};
        border:3px solid #fff;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        box-shadow:0 4px 16px rgba(0,0,0,0.35),0 0 0 2px ${color}44;
        position:absolute;top:0;left:0;
      "></div>
      <!-- Letter label -->
      <div style="
        position:absolute;top:4px;left:7px;
        color:#fff;font-size:11px;font-weight:900;
        font-family:system-ui,sans-serif;line-height:1;
        text-shadow:0 1px 2px rgba(0,0,0,0.4);
      ">B</div>
    </div>`,
  iconSize: [32, 42], iconAnchor: [16, 42], className: '',
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
const MapFitter = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points?.length >= 2) {
      map.fitBounds(L.latLngBounds(points), { padding: [50, 50], maxZoom: 14 });
    }
  }, [points, map]);
  return null;
};

// ── Map panner ─────────────────────────────────────────────────────
const MapPanner = ({ target }) => {
  const map = useMap();
  useEffect(() => {
    if (target) map.setView(target, Math.max(map.getZoom(), 13), { animate: true });
  }, [target, map]);
  return null;
};

// ── Heatmap Layer ──────────────────────────────────────────────────
const HeatmapLayer = ({ pickupCoords, surgeMultiplier, showHeatmap }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (showHeatmap && pickupCoords) {
      const [centerLat, centerLng] = pickupCoords;
      const points = [];
      const gridSize = 15;
      const maxOffset = 0.036; // ~4km radius

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const latOffset = ((i - (gridSize - 1) / 2) / ((gridSize - 1) / 2)) * maxOffset;
          const lngOffset = ((j - (gridSize - 1) / 2) / ((gridSize - 1) / 2)) * maxOffset;
          
          const pointLat = centerLat + latOffset;
          const pointLng = centerLng + lngOffset;
          
          const dist = Math.sqrt(latOffset * latOffset + lngOffset * lngOffset);
          const maxDist = Math.sqrt(maxOffset * maxOffset * 2);
          const distanceFactor = 1 - (dist / maxDist);
          
          const normalizedSurge = Math.max(0, Math.min(1, (surgeMultiplier - 1.0) / 4.0));
          const baseIntensity = 0.3 + normalizedSurge * 0.5;
          const randomVar = (Math.random() - 0.5) * 0.2;
          
          let intensity = baseIntensity * distanceFactor + randomVar;
          intensity = Math.max(0.1, Math.min(1.0, intensity));
          
          points.push([pointLat, pointLng, intensity]);
        }
      }

      const heatLayer = L.heatLayer(points, {
        radius: 35,
        blur: 25,
        maxZoom: 15,
        gradient: { 0.2: '#00ff88', 0.5: '#ffaa00', 0.8: '#ff4444' }
      });

      heatLayer.addTo(map);
      heatLayerRef.current = heatLayer;
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [pickupCoords, surgeMultiplier, showHeatmap, map]);

  return null;
};

// ── Click handler ─────────────────────────────────────────────────
const LocationMarker = ({ setPickup, setDropoff, pickupCoords, dropoffCoords, resetRoute }) => {
  useMapEvents({
    click(e) {
      const coords = [e.latlng.lat, e.latlng.lng];
      if (!pickupCoords) {
        setPickup(coords);
      } else if (!dropoffCoords) {
        setDropoff(coords);
      } else {
        resetRoute();
        setDropoff(null);
        setPickup(coords);
      }
    },
  });
  return null;
};

// ── Google Maps-style route line ─────────────────────────────────────
const AnimatedRoute = ({ positions, color, dashArray, weight = 5 }) => {
  if (!positions?.length) return null;
  return (
    <>
      {/* White outline (Google Maps style border) */}
      <Polyline
        positions={positions}
        color="#ffffff"
        weight={weight + 6}
        opacity={0.9}
        pathOptions={{ lineCap: 'round', lineJoin: 'round' }}
      />
      {/* Coloured route fill */}
      <Polyline
        positions={positions}
        color={color}
        weight={weight + 2}
        opacity={1}
        pathOptions={{
          dashArray: dashArray || '',
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />
    </>
  );
};

// ── Main Component ─────────────────────────────────────────────────
export const PremiumMap = ({
  pickupCoords, dropoffCoords,
  onPickupChange, onDropoffChange,
  onRouteData,
  activeMode = 'cab',
  surgeMultiplier = 1.0,
}) => {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [center] = useState([20.5937, 78.9629]); // India center
  const [roadRouteCoords, setRoadRouteCoords] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [panTarget, setPanTarget] = useState(null);

  const modeColor = MODE_COLORS[activeMode] || MODE_COLORS.cab;

  // Dynamically create icons based on mode color
  const pickupIcon = useMemo(() => makePickupIcon(modeColor.primary), [modeColor.primary]);
  const dropoffIcon = useMemo(() => makeDropoffIcon(modeColor.primary), [modeColor.primary]);

  // Reverse geocode
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

  useEffect(() => {
    if (pickupCoords && !dropoffCoords) setPanTarget(pickupCoords);
    if (dropoffCoords && !pickupCoords) setPanTarget(dropoffCoords);
  }, [pickupCoords, dropoffCoords]);

  const resetRoute = useCallback(() => {
    setRoadRouteCoords(null);
    setRouteInfo(null);
    onPickupChange(null, '');
  }, [onPickupChange]);

  // Fetch OSRM road route
  useEffect(() => {
    if (!pickupCoords || !dropoffCoords) { setRoadRouteCoords(null); setRouteInfo(null); return; }
    let cancelled = false;
    setRouteLoading(true);
    fetchOSRMRoute(pickupCoords, dropoffCoords)
      .then(({ coords, distanceKm, durationMin }) => {
        if (cancelled) return;
        setRoadRouteCoords(coords);
        setRouteInfo({ distanceKm, durationMin });
        if (onRouteData) onRouteData(distanceKm, durationMin);
      })
      .catch(() => { if (!cancelled) setRoadRouteCoords([pickupCoords, dropoffCoords]); })
      .finally(() => { if (!cancelled) setRouteLoading(false); });
    return () => { cancelled = true; };
  }, [pickupCoords, dropoffCoords, onRouteData]);

  // Build the displayed route coords based on active mode
  const displayRouteCoords = useMemo(() => {
    if (!pickupCoords || !dropoffCoords) return null;
    if (activeMode === 'flight') return buildArcPath(pickupCoords, dropoffCoords);
    if (activeMode === 'train') return [pickupCoords, dropoffCoords]; // straight line (simplified rail)
    return roadRouteCoords; // cab uses OSRM road
  }, [activeMode, pickupCoords, dropoffCoords, roadRouteCoords]);

  const fitPoints = displayRouteCoords?.length ? displayRouteCoords : [pickupCoords, dropoffCoords].filter(Boolean);

  const hint = !pickupCoords ? '📍 Click map to set Pickup'
    : !dropoffCoords ? '🎯 Click map to set Destination'
    : '🔄 Click anywhere to reset route';

  const modeLabel = { cab: '🚗', train: '🚂', flight: '✈️', all: '🚗' }[activeMode] || '🚗';

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        {/*
          CartoDB Voyager — the closest free tile to Google Maps:
          identical color palette for roads, POI labels, terrain,
          clear road hierarchy, no API key required.
        */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          maxZoom={20}
        />

        {fitPoints?.length >= 2 && <MapFitter points={fitPoints} />}
        <MapPanner target={panTarget} />

        {/* Heatmap overlay */}
        <HeatmapLayer
          pickupCoords={pickupCoords}
          surgeMultiplier={surgeMultiplier}
          showHeatmap={showHeatmap}
        />

        <LocationMarker
          pickupCoords={pickupCoords} dropoffCoords={dropoffCoords}
          setPickup={handleSetPickup} setDropoff={handleSetDropoff}
          resetRoute={resetRoute}
        />

        {/* Route visualization */}
        {displayRouteCoords && (
          <AnimatedRoute
            positions={displayRouteCoords}
            color={modeColor.primary}
            dashArray={modeColor.dash}
            weight={activeMode === 'flight' ? 3 : 5}
          />
        )}

        {/* Pickup marker */}
        {pickupCoords && (
          <Marker position={pickupCoords} icon={pickupIcon}>
            <Popup>
              <div style={{ fontWeight: 700, color: modeColor.primary }}>📍 Pickup</div>
            </Popup>
          </Marker>
        )}

        {/* Dropoff marker */}
        {dropoffCoords && (
          <Marker position={dropoffCoords} icon={dropoffIcon}>
            <Popup>
              <div style={{ fontWeight: 700, color: modeColor.primary }}>🎯 Destination</div>
            </Popup>
          </Marker>
        )}

        {/* Pulsing circle at dropoff for flights */}
        {activeMode === 'flight' && dropoffCoords && (
          <CircleMarker
            center={dropoffCoords}
            radius={18}
            pathOptions={{ color: modeColor.primary, fillColor: modeColor.primary, fillOpacity: 0.08, weight: 1.5, opacity: 0.4, dashArray: '4 6' }}
          />
        )}
      </MapContainer>

      {/* ── Route info badge — Google Maps card style, light bg ── */}
      {routeInfo && !routeLoading && (
        <div
          className="absolute top-3 z-[1000] rounded-2xl px-4 py-2.5 text-center min-w-[110px]"
          style={{
            right: pickupCoords ? '148px' : '12px',
            background: '#fff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)',
          }}
        >
          <div
            className="text-[9px] font-extrabold uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5"
            style={{ color: modeColor.primary }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
              style={{ background: modeColor.primary }}
            />
            {modeLabel} {modeColor.label}
          </div>
          <div className="text-base font-black" style={{ color: '#111' }}>
            {routeInfo.distanceKm} km
          </div>
          <div className="text-[10px] font-semibold" style={{ color: '#666' }}>
            ~{routeInfo.durationMin} min
          </div>
        </div>
      )}

      {routeLoading && (
        <div
          className="absolute top-3 z-[1000] rounded-xl px-3 py-2 flex items-center gap-2"
          style={{
            right: pickupCoords ? '148px' : '12px',
            background: '#fff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
          }}
        >
          <svg
            className="animate-spin w-3.5 h-3.5"
            style={{ color: modeColor.primary }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75" />
          </svg>
          <span className="text-xs font-semibold" style={{ color: '#333' }}>Routing…</span>
        </div>
      )}

      {/* ── Surge Heatmap Toggle Button ── */}
      {pickupCoords && (
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className="absolute top-3 right-3 z-[1000] px-4 py-2.5 rounded-2xl text-xs font-bold font-sans tracking-wide cursor-pointer transition-all duration-300 backdrop-blur-md border border-white/10 hover:border-white/20 select-none shadow-lg text-white bg-[#0e0e0e]/75 hover:bg-[#181818]/90"
          style={{
            boxShadow: showHeatmap 
              ? '0 0 15px rgba(255, 68, 68, 0.25), 0 4px 12px rgba(0,0,0,0.5)'
              : '0 4px 12px rgba(0,0,0,0.4)',
            borderColor: showHeatmap ? 'rgba(255, 68, 68, 0.4)' : 'rgba(255,255,255,0.1)',
          }}
        >
          {showHeatmap ? '✕ Hide Zones' : '🔥 Surge Zones'}
        </button>
      )}

      {/* ── Bottom hint bar — Google Maps style pill ── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={{
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            color: '#444',
          }}
        >
          {hint}
        </div>
      </div>
    </div>
  );
};
