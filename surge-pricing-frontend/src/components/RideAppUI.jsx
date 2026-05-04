import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, CreditCard, Loader2, ArrowRight,
  AlertTriangle, CheckCircle2, MapPin, Clock, Zap,
  CloudRain, Sun, Thermometer,
} from 'lucide-react';
import { InteractiveMap } from './InteractiveMap';
import { LocationSearchInput } from './LocationSearchInput';

// ── Surge colour helper ────────────────────────────────────────────
const getSurgeStyle = (surge) => {
  if (surge >= 1.5) return { color: '#ff6633', bg: 'rgba(216,59,1,0.12)', border: 'rgba(216,59,1,0.25)', label: 'High Surge' };
  if (surge > 1.0)  return { color: '#E4A11B', bg: 'rgba(228,161,27,0.12)', border: 'rgba(228,161,27,0.25)', label: 'Moderate Surge' };
  return               { color: '#1DB954',   bg: 'rgba(29,185,84,0.12)',  border: 'rgba(29,185,84,0.25)',  label: 'Standard Fare' };
};

export const RideAppUI = ({
  demand, setDemand,
  distance, setDistance,
  pickupCoords, dropoffCoords,
  pickupAddress, dropoffAddress,
  updateCoordinates,
  surgeMultiplier,
  totalFare,
  baseFare,
  ratePerKm,
  loading,
  error,
  weather,
  simulateRain,
  setSimulateRain,
  fetchSurgeEstimate,
}) => {
  const [routeDuration, setRouteDuration] = useState(null);
  const [hasResult, setHasResult] = useState(false);

  const handleRouteData = useCallback((distKm, durMin) => {
    setDistance(distKm);
    setRouteDuration(durMin);
  }, [setDistance]);

  // Auto-recalculate whenever demand or distance changes
  useEffect(() => {
    if (distance <= 0) return;
    const t = setTimeout(async () => {
      const ok = await fetchSurgeEstimate();
      if (ok) setHasResult(true);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demand, distance, weather, simulateRain]);

  const handleCheck = async () => {
    const ok = await fetchSurgeEstimate();
    if (ok) setHasResult(true);
  };

  const surgeStyle = getSurgeStyle(surgeMultiplier);
  const baseFareTotal = baseFare + distance * ratePerKm;

  return (
    /* ── outer section: full viewport height ── */
    <section id="ride" className="w-full relative z-20" style={{ height: '100vh', minHeight: 640 }}>
      <div className="h-full max-w-7xl mx-auto px-3 sm:px-6 flex flex-col" style={{ paddingTop: '72px' }}>

        {/* Section header — compact */}
        <div className="mb-2 flex items-baseline justify-between flex-shrink-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">Get a Ride</h2>
            <p className="text-gray-500 text-sm mt-0.5">Select locations on the map → live surge + fare</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#1DB954] font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
            Live Prediction
          </div>
        </div>

        {/* ── Main card — flex row, fills remaining height ── */}
        <div className="flex-1 flex flex-col lg:flex-row gap-0 bg-[#181818]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 overflow-hidden min-h-0">

          {/* ── LEFT: Map (takes most space) ── */}
          <div className="flex-1 relative min-h-[300px] lg:min-h-0 order-2 lg:order-1 border-r border-white/5">
            <InteractiveMap
              pickupCoords={pickupCoords}
              dropoffCoords={dropoffCoords}
              onPickupChange={(c, a) => updateCoordinates('pickup', c, a)}
              onDropoffChange={(c, a) => updateCoordinates('dropoff', c, a)}
              onRouteData={handleRouteData}
            />
          </div>

          {/* ── RIGHT: Control panel ── */}
          <div className="w-full lg:w-[380px] flex flex-col order-1 lg:order-2 overflow-y-auto">

            {/* Location inputs */}
            <div className="p-3 border-b border-white/5 flex-shrink-0">
              <div className="relative space-y-1.5">
                <div className="absolute left-[15px] top-[36px] bottom-[36px] w-[2px] bg-white/10" />

                {/* Pickup search */}
                <LocationSearchInput
                  value={pickupAddress && pickupCoords ? pickupAddress : ''}
                  placeholder="Search pickup location…"
                  dotColor="#ffffff"
                  dotShape="circle"
                  onSelect={(coords, addr) => updateCoordinates('pickup', coords, addr)}
                />

                {/* Dropoff search */}
                <LocationSearchInput
                  value={dropoffAddress && dropoffCoords ? dropoffAddress : ''}
                  placeholder="Search dropoff location…"
                  dotColor="#1DB954"
                  dotShape="square"
                  onSelect={(coords, addr) => updateCoordinates('dropoff', coords, addr)}
                />
              </div>
            </div>


            {/* Route stats */}
            <div className="p-3 border-b border-white/5 flex-shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-xl p-2.5">
                  <div className="flex items-center gap-1 text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1">
                    <MapPin size={10} /> Distance
                  </div>
                  <div className="text-lg font-bold text-white">
                    {distance > 0 ? `${distance} km` : <span className="text-gray-600 text-base">—</span>}
                  </div>
                  {distance > 0 && <div className="text-[10px] text-gray-600 mt-0.5">via shortest road</div>}
                </div>
                <div className="bg-white/5 rounded-xl p-2.5">
                  <div className="flex items-center gap-1 text-gray-500 text-[10px] uppercase tracking-wider font-bold mb-1">
                    <Clock size={10} /> ETA
                  </div>
                  <div className="text-lg font-bold text-white">
                    {routeDuration != null ? `${routeDuration} min` : <span className="text-gray-600 text-base">—</span>}
                  </div>
                  {routeDuration != null && <div className="text-[10px] text-gray-600 mt-0.5">estimated travel</div>}
                </div>
              </div>
            </div>

            {/* ── Demand slider ── */}
            <div className="p-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-[#1DB954]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Demand Intensity</span>
                </div>
                <span className="text-xl font-black text-white">{demand}x</span>
              </div>
              <input
                type="range" min="1" max="10" step="1"
                value={demand}
                onChange={(e) => setDemand(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
              />
              <div className="flex justify-between mt-2 px-1 text-[10px] text-gray-500 font-bold uppercase">
                <span>Low</span>
                <span>Peak</span>
              </div>
            </div>

            {/* Weather Conditions */}
            <div className="p-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CloudRain size={16} className="text-[#3b82f6]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Weather Analysis</span>
                </div>
                
                {/* Simulated Rain Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-gray-500 uppercase">Simulate Rain</span>
                  <button
                    onClick={() => setSimulateRain(!simulateRain)}
                    className={`w-8 h-4 rounded-full relative transition-colors duration-200 ${simulateRain ? 'bg-blue-600' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${simulateRain ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {weather ? (() => {
                const isRainActive = weather.isBad || simulateRain;
                const displayCondition = simulateRain ? 'Rainy (Simulated)' : weather.condition;
                return (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        {isRainActive ? <CloudRain size={14} className="text-blue-400" /> : <Sun size={14} className="text-yellow-400" />}
                        <span>{displayCondition}</span>
                        <span className="text-gray-500 ml-1">· {weather.temp}°C</span>
                      </div>
                      <div className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${isRainActive ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {isRainActive ? '+20% Surge Impact' : 'No Impact'}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      {isRainActive 
                        ? "Adverse weather detected. Driver availability is significantly reduced, increasing surge intensity."
                        : "Clear conditions detected. Pricing is operating under the standard model."}
                    </p>
                  </div>
                );
              })() : (
                <div className="flex flex-col items-center justify-center py-4 border border-dashed border-white/10 rounded-xl">
                   <p className="text-[10px] text-gray-500">Select pickup to detect local weather</p>
                </div>
              )}
            </div>

            {/* ── SURGE METER (always visible) ── */}
            <div className="p-3 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-gray-500 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1">
                  <Zap size={10} /> Surge Multiplier
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={surgeMultiplier}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl font-bold font-display"
                    style={{ color: surgeStyle.color }}
                  >
                    ×{hasResult ? surgeMultiplier.toFixed(2) : '—'}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Surge bar */}
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                <motion.div
                  animate={{ width: `${Math.min(100, ((surgeMultiplier - 1) / 4) * 100)}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: surgeStyle.color }}
                />
              </div>

              {/* Surge label badge */}
              {hasResult && (
                <div className="text-xs rounded-lg px-3 py-2 flex items-center gap-2 font-semibold"
                  style={{ background: surgeStyle.bg, color: surgeStyle.color, border: `1px solid ${surgeStyle.border}` }}>
                  {surgeMultiplier >= 1.5
                    ? <AlertTriangle size={12} className="shrink-0" />
                    : surgeMultiplier > 1
                    ? <Activity size={12} className="shrink-0" />
                    : <CheckCircle2 size={12} className="shrink-0" />}
                  <span>{surgeStyle.label} — {
                    surgeMultiplier >= 1.5 ? 'Very high demand in your area.'
                    : surgeMultiplier > 1 ? 'Slightly elevated demand.'
                    : 'Prices are normal right now.'
                  }</span>
                </div>
              )}
              {!hasResult && (
                <div className="text-xs text-gray-600 italic">
                  {distance > 0 ? 'Calculating surge…' : 'Select route to see surge prediction'}
                </div>
              )}
            </div>

            {/* ── Fare breakdown (always visible once we have data) ── */}
            <div className="p-3 flex-shrink-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-500 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1">
                  <CreditCard size={10} /> Estimated Fare
                </span>
                {hasResult && surgeMultiplier > 1 && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                    style={{ background: surgeStyle.bg, color: surgeStyle.color, border: `1px solid ${surgeStyle.border}` }}>
                    Surge ×{surgeMultiplier.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={totalFare}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="text-3xl font-bold text-white font-display"
                  >
                    {hasResult ? `₹${totalFare.toFixed(2)}` : '₹—'}
                  </motion.span>
                </AnimatePresence>
                {hasResult && surgeMultiplier > 1 && (
                  <span className="text-gray-600 line-through text-base">₹{baseFareTotal.toFixed(2)}</span>
                )}
              </div>

              {hasResult && (
                <div className="flex justify-between text-[10px] text-gray-600 mb-3">
                  <span>Base ₹{baseFare.toFixed(0)}</span>
                  <span>+{distance} km × ₹{ratePerKm.toFixed(0)}</span>
                  <span>× {surgeMultiplier.toFixed(2)}</span>
                </div>
              )}

              <button
                onClick={handleCheck}
                disabled={loading || distance === 0}
                className="w-full flex items-center justify-center gap-2 font-bold text-sm py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: loading ? '#333' : '#1DB954',
                  color: loading ? '#999' : '#000',
                }}
              >
                {loading
                  ? <><Loader2 className="animate-spin" size={16} /> Calculating…</>
                  : <><ArrowRight size={16} /> {distance === 0 ? 'Select a Route First' : 'Recalculate'}</>
                }
              </button>

              {error && (
                <div className="mt-2 text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}
            </div>

          </div>{/* end right panel */}
        </div>{/* end main card */}
      </div>
    </section>
  );
};
