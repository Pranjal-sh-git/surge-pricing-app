import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Loader2, ArrowRight,
  AlertTriangle, MapPin, Clock,
  CloudRain, Sun, Car, Train, Plane,
} from 'lucide-react';
import { PremiumMap } from './PremiumMap';
import { LocationSearchInput } from './LocationSearchInput';
import { TransportComparison } from './TransportComparison';
import { MODES } from '../constants/transportModes';

// ── Surge colour helper ────────────────────────────────────────────
const getSurgeStyle = (surge) => {
  if (surge >= 1.5) return { color: '#ff6633', bg: 'rgba(216,59,1,0.12)', border: 'rgba(216,59,1,0.25)' };
  if (surge > 1.0) return { color: '#E4A11B', bg: 'rgba(228,161,27,0.12)', border: 'rgba(228,161,27,0.25)' };
  return { color: '#1DB954', bg: 'rgba(29,185,84,0.12)', border: 'rgba(29,185,84,0.25)' };
};

// ── Transport mode icon helper ─────────────────────────────────────
const ModeIcon = ({ mode, size = 13 }) => {
  const icons = { cab: Car, train: Train, flight: Plane };
  const Icon = icons[mode] || Car;
  const color = MODES[mode]?.color || '#1DB954';
  return <Icon size={size} style={{ color }} />;
};

export const RideAppUI = ({
  demand, setDemand,
  distance, setDistance,
  pickupCoords, dropoffCoords,
  pickupAddress, dropoffAddress,
  updateCoordinates,
  surgeMultiplier, totalFare, baseFare, ratePerKm,
  loading, error,
  weather, simulateRain, setSimulateRain,
  fetchSurgeEstimate,
  cabType, setCabType,
  rideTier, setRideTier,
  // Multi-modal
  activeMode, setActiveMode,
  trainFare, trainEta, trainSurge,
  flightFare, flightEta, flightSurge,
}) => {
  const [routeDuration, setRouteDuration] = useState(null);
  const [hasResult, setHasResult] = useState(false);

  const handleRouteData = useCallback((distKm, durMin) => {
    setDistance(distKm);
    setRouteDuration(durMin);
  }, [setDistance]);

  useEffect(() => {
    if (distance <= 0) return;
    const t = setTimeout(async () => {
      const ok = await fetchSurgeEstimate();
      if (ok) setHasResult(true);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demand, distance, weather, simulateRain, cabType, rideTier]);

  const handleCheck = async () => {
    const ok = await fetchSurgeEstimate();
    if (ok) setHasResult(true);
  };

  // Mode-specific data
  const fares = { cab: totalFare, train: trainFare, flight: flightFare };
  const etas = { cab: routeDuration, train: trainEta, flight: flightEta };
  const surges = { cab: surgeMultiplier, train: trainSurge, flight: flightSurge };

  const activeFare = fares[activeMode] ?? (activeMode === 'all' ? totalFare : 0);
  const activeEta = etas[activeMode] ?? (activeMode === 'all' ? routeDuration : null);
  const activeSurge = surges[activeMode] ?? (activeMode === 'all' ? surgeMultiplier : 1);

  const surgeStyle = getSurgeStyle(activeSurge ?? 1);
  const modeColor = activeMode === 'all' ? '#1DB954' : (MODES[activeMode]?.color || '#1DB954');
  const isRainActive = weather?.isBad || simulateRain;

  return (
    /*
     * LAYOUT STRATEGY
     * ───────────────
     * • Section = exactly 100dvh (dynamic viewport height handles mobile bars)
     * • Inner wrapper = h-full flex-col, with top padding for the navbar (64px)
     * • Section header is compact and flex-shrink-0
     * • Main card = flex-1 with overflow-hidden — fills remaining height exactly
     * • Right panel = flex-col with overflow-y-auto on the scrollable middle part
     *   so static header/footer blocks never push the card taller than the viewport
     */
    <section
      id="ride"
      className="w-full relative z-20"
      style={{ height: '100dvh', minHeight: 600 }}
    >
      {/* Full-height column wrapper, padded for navbar */}
      <div
        className="h-full flex flex-col max-w-7xl mx-auto px-3 sm:px-5"
        style={{ paddingTop: '68px', paddingBottom: '12px' }}
      >
        {/* ── Section header — compact ── */}
        <div className="mb-2 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight leading-tight">
              Plan Your Journey
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Compare Cab · Train · Flight — live prices &amp; surge
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#1DB954] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-pulse" />
            Live
          </div>
        </div>

        {/* ── Main card — flex-1 fills the remaining height exactly ── */}
        <div className="flex-1 flex flex-col lg:flex-row bg-[#181818]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 overflow-hidden min-h-0">

          {/* ── LEFT: Premium Map — takes all remaining width on desktop ── */}
          <div className="flex-1 relative min-h-[280px] lg:min-h-0 order-2 lg:order-1 border-r border-white/5">
            <PremiumMap
              pickupCoords={pickupCoords}
              dropoffCoords={dropoffCoords}
              onPickupChange={(c, a) => updateCoordinates('pickup', c, a)}
              onDropoffChange={(c, a) => updateCoordinates('dropoff', c, a)}
              onRouteData={handleRouteData}
              activeMode={activeMode === 'all' ? 'cab' : activeMode}
              surgeMultiplier={surgeMultiplier}
            />
          </div>

          {/* ── RIGHT: Control panel — fixed 380px, scrollable body ── */}
          <div className="w-full lg:w-[380px] flex flex-col order-1 lg:order-2 min-h-0">

            {/* ① Location inputs — never shrinks */}
            <div className="px-3 pt-2.5 pb-2 border-b border-white/5 flex-shrink-0">
              <div className="relative space-y-1.5">
                <div className="absolute left-[14px] top-[34px] bottom-[34px] w-[2px] bg-white/10" />
                <LocationSearchInput
                  value={pickupAddress && pickupCoords ? pickupAddress : ''}
                  placeholder="Search pickup location…"
                  dotColor="#ffffff"
                  dotShape="circle"
                  onSelect={(coords, addr) => updateCoordinates('pickup', coords, addr)}
                />
                <LocationSearchInput
                  value={dropoffAddress && dropoffCoords ? dropoffAddress : ''}
                  placeholder="Search dropoff / destination…"
                  dotColor={modeColor}
                  dotShape="square"
                  onSelect={(coords, addr) => updateCoordinates('dropoff', coords, addr)}
                />
              </div>
            </div>

            {/* ② Distance + ETA stats row — never shrinks */}
            <div className="px-3 py-2 border-b border-white/5 flex-shrink-0">
              <div className="grid grid-cols-2 gap-2">
                {/* Distance */}
                <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-2.5 py-2 border border-white/5">
                  <MapPin size={11} style={{ color: modeColor }} className="shrink-0" />
                  <div>
                    <div className="text-[8px] text-gray-500 uppercase tracking-wider font-bold">Distance</div>
                    <div className="text-sm font-bold text-white">{distance > 0 ? `${distance} km` : '—'}</div>
                  </div>
                </div>
                {/* Road ETA */}
                <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl px-2.5 py-2 border border-white/5">
                  <Clock size={11} style={{ color: modeColor }} className="shrink-0" />
                  <div>
                    <div className="text-[8px] text-gray-500 uppercase tracking-wider font-bold">Road ETA</div>
                    <div className="text-sm font-bold text-white">{routeDuration != null ? `${routeDuration} min` : '—'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ③ Transport comparison — scrollable, takes remaining height */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <TransportComparison
                activeMode={activeMode}
                setActiveMode={setActiveMode}
                cabFare={totalFare}
                trainFare={trainFare}
                flightFare={flightFare}
                cabEta={routeDuration}
                trainEta={trainEta}
                flightEta={flightEta}
                cabSurge={surgeMultiplier}
                trainSurge={trainSurge}
                flightSurge={flightSurge}
                distance={distance}
                hasResult={hasResult}
              />
            </div>

            {/* ④ Controls footer — demand + weather + button, all in one compact block */}
            <div className="flex-shrink-0 border-t border-white/5 bg-[#111]/40">

              {/* Cab Operator & Category Selection */}
              <div className="px-3 pt-2 pb-1.5 border-b border-white/[0.04] grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] text-gray-500 uppercase tracking-wider font-bold">Operator</label>
                  <select
                    value={cabType}
                    onChange={(e) => setCabType(parseInt(e.target.value))}
                    className="bg-white/[0.03] border border-white/5 text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-spotify-green/50 cursor-pointer"
                  >
                    <option value={0} className="bg-[#181818]">Ola</option>
                    <option value={1} className="bg-[#181818]">Uber India</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[8px] text-gray-500 uppercase tracking-wider font-bold">Category</label>
                  <select
                    value={rideTier}
                    onChange={(e) => setRideTier(parseInt(e.target.value))}
                    className="bg-white/[0.03] border border-white/5 text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-spotify-green/50 cursor-pointer"
                  >
                    <option value={0} className="bg-[#181818]">Auto</option>
                    <option value={1} className="bg-[#181818]">Mini</option>
                    <option value={2} className="bg-[#181818]">Sedan</option>
                    <option value={3} className="bg-[#181818]">Prime Sedan</option>
                    <option value={4} className="bg-[#181818]">Prime SUV</option>
                    <option value={5} className="bg-[#181818]">Bike</option>
                  </select>
                </div>
              </div>

              {/* Demand slider — ultra-compact */}
              <div className="px-3 pt-2 pb-1.5 border-b border-white/[0.04]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Activity size={11} style={{ color: modeColor }} />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Demand</span>
                  </div>
                  <span className="text-sm font-black text-white">{demand}x</span>
                </div>
                <input
                  type="range" min="1" max="10" step="1"
                  value={demand}
                  onChange={(e) => setDemand(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: modeColor }}
                />
                <div className="flex justify-between mt-0.5 text-[8px] text-gray-700 font-bold uppercase">
                  <span>Low</span><span>Peak</span>
                </div>
              </div>

              {/* Weather + simulate rain — single row */}
              <div className="px-3 py-1.5 border-b border-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {isRainActive
                    ? <CloudRain size={11} className="text-blue-400" />
                    : <Sun size={11} className="text-yellow-400" />
                  }
                  {weather ? (
                    <span className="text-[9px] text-gray-400">
                      {simulateRain ? 'Rain (Simulated)' : weather.condition}
                      <span className="text-gray-600 ml-1">· {weather.temp}°C</span>
                    </span>
                  ) : (
                    <span className="text-[9px] text-gray-600">Set pickup for weather</span>
                  )}
                  {isRainActive && (
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 ml-1">+20%</span>
                  )}
                </div>
                {/* Toggle */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-bold text-gray-600 uppercase">Rain</span>
                  <button
                    onClick={() => setSimulateRain(!simulateRain)}
                    className="w-7 h-3.5 rounded-full relative transition-colors duration-200 flex-shrink-0"
                    style={{ background: simulateRain ? '#3b82f6' : 'rgba(255,255,255,0.1)' }}
                  >
                    <div className={`absolute top-[1px] left-[1px] w-2.5 h-2.5 bg-white rounded-full transition-transform duration-200 ${simulateRain ? 'translate-x-3.5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Active fare summary + action button */}
              <div className="px-3 py-2">
                {/* Fare summary row (only when results exist) */}
                {hasResult && activeMode !== 'all' && activeFare > 0 && (
                  <div
                    className="flex items-center justify-between mb-2 px-2.5 py-1.5 rounded-xl border"
                    style={{ background: MODES[activeMode]?.bg || 'rgba(255,255,255,0.04)', borderColor: modeColor + '33' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <ModeIcon mode={activeMode} size={12} />
                      <span className="text-[10px] font-bold" style={{ color: modeColor }}>
                        {MODES[activeMode]?.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {activeEta && activeEta > 0 && (
                        <span className="text-[9px] text-gray-500 flex items-center gap-0.5">
                          <Clock size={8} />
                          {activeEta < 60
                            ? `${Math.round(activeEta)}m`
                            : `${Math.floor(activeEta / 60)}h ${Math.round(activeEta % 60)}m`}
                        </span>
                      )}
                      <span className="text-base font-bold font-display" style={{ color: modeColor }}>
                        ₹{Math.round(activeFare)}
                      </span>
                    </div>
                  </div>
                )}

                {/* CTA button */}
                <button
                  onClick={handleCheck}
                  disabled={loading || distance === 0}
                  className="w-full flex items-center justify-center gap-2 font-bold text-sm py-2 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: loading ? '#333' : modeColor,
                    color: loading ? '#999' : '#000',
                  }}
                >
                  {loading
                    ? <><Loader2 className="animate-spin" size={14} /> Calculating…</>
                    : <><ArrowRight size={14} /> {distance === 0 ? 'Select a Route First' : 'Refresh Prices'}</>
                  }
                </button>

                {/* Error */}
                {error && (
                  <div className="mt-1.5 text-[10px] text-red-400 bg-red-500/10 px-2.5 py-1.5 rounded-lg border border-red-500/20">
                    {error}
                  </div>
                )}

                {/* Surge warning */}
                {hasResult && activeSurge > 1.2 && (
                  <div
                    className="mt-1.5 flex items-center gap-1.5 text-[9px] px-2.5 py-1.5 rounded-lg"
                    style={{ background: surgeStyle.bg, color: surgeStyle.color, border: `1px solid ${surgeStyle.border}` }}
                  >
                    <AlertTriangle size={9} className="shrink-0" />
                    <span>
                      {activeMode === 'cab' && `Cab surge ×${activeSurge?.toFixed(2)} — consider train or flight.`}
                      {activeMode === 'train' && `Peak booking time — ×${activeSurge?.toFixed(2)} surcharge.`}
                      {activeMode === 'flight' && `Elevated demand — prices ×${activeSurge?.toFixed(2)}.`}
                      {activeMode === 'all' && `Surge ×${activeSurge?.toFixed(2)} active.`}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>{/* end right panel */}
        </div>{/* end main card */}
      </div>
    </section>
  );
};
