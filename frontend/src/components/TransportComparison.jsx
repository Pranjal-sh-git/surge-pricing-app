import { motion, AnimatePresence } from 'framer-motion';
import { Car, Train, Plane, Zap, Clock, TrendingUp, AlertTriangle, CheckCircle2, Star, Gauge } from 'lucide-react';
import { MODES } from '../constants/transportModes';

// ── Surge badge ──────────────────────────────────────────────────
const SurgeBadge = ({ surge, color }) => {
  const isHigh = surge >= 1.5;
  const isMod = surge > 1.0;
  return (
    <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{
        background: isHigh ? 'rgba(239,68,68,0.15)' : isMod ? 'rgba(245,158,11,0.15)' : 'rgba(29,185,84,0.15)',
        color: isHigh ? '#EF4444' : isMod ? '#F59E0B' : '#1DB954',
        border: `1px solid ${isHigh ? 'rgba(239,68,68,0.3)' : isMod ? 'rgba(245,158,11,0.3)' : 'rgba(29,185,84,0.3)'}`,
      }}>
      {isHigh ? <AlertTriangle size={8} /> : isMod ? <Zap size={8} /> : <CheckCircle2 size={8} />}
      ×{surge.toFixed(2)}
    </div>
  );
};

// ── Single transport option card ─────────────────────────────────
const ModeDetailCard = ({ mode, fare, surge, eta, available, isBest, isFastest, onClick, isActive }) => {
  const cfg = MODES[mode] || MODES.cab;  // Safe fallback
  const Icon = cfg.icon;

  if (mode === 'flight' && !fare) {
    return (
      <div className="w-full rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex items-center gap-3 text-gray-500 text-xs">
        <div className="p-2 rounded-xl bg-white/[0.03] text-gray-500 flex-shrink-0">
          <Plane size={14} />
        </div>
        <span>Flights available for routes over 200 km</span>
      </div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left rounded-2xl border transition-all duration-300 overflow-hidden relative"
      style={{
        background: isActive ? cfg.bg : 'rgba(255,255,255,0.03)',
        borderColor: isActive ? cfg.color + '55' : 'rgba(255,255,255,0.06)',
        boxShadow: isActive ? `0 0 20px ${cfg.color}18` : 'none',
      }}
    >
      {/* Active indicator strip */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl" style={{ background: cfg.color }} />
      )}

      <div className="p-3 pl-4">
        {/* Top row: icon + label + chips */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl" style={{ background: cfg.color + '20' }}>
              <Icon size={14} style={{ color: cfg.color }} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{cfg.label}</div>
              <div className="text-[9px] text-gray-500">{cfg.tagline}</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {isBest && (
              <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30 uppercase tracking-wide flex items-center gap-0.5">
                <Star size={6} /> Best Value
              </span>
            )}
            {isFastest && (
              <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-[#00f3ff]/15 text-[#00f3ff] border border-[#00f3ff]/25 uppercase tracking-wide flex items-center gap-0.5">
                <Gauge size={6} /> Fastest
              </span>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Est. Fare</div>
            <div className="flex items-baseline gap-1.5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={fare}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-bold font-display text-white"
                >
                  {fare > 0 ? `₹${Math.round(fare)}` : '—'}
                </motion.span>
              </AnimatePresence>
              {surge !== null && surge !== undefined && <SurgeBadge surge={surge} />}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">ETA</div>
            <div className="flex items-center gap-1 justify-end">
              <Clock size={10} style={{ color: cfg.color }} />
              <span className="text-sm font-bold text-white">
                {eta > 0 ? formatETA(eta) : '—'}
              </span>
            </div>
            {!available && (
              <div className="text-[8px] text-orange-400 font-bold mt-0.5">Low availability</div>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
};

const formatETA = (minutes) => {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

// ── Comparison table view (ALL tab) ─────────────────────────────
const ComparisonTable = ({ cabFare, trainFare, flightFare, cabEta, trainEta, flightEta, cabSurge, trainSurge, flightSurge, onSelect }) => {
  const cheapestId = [
    { id: 'cab', fare: cabFare },
    { id: 'train', fare: trainFare },
    { id: 'flight', fare: flightFare },
  ].filter(m => m.fare > 0).sort((a, b) => a.fare - b.fare)[0]?.id;

  const fastestId = [
    { id: 'cab', eta: cabEta },
    { id: 'train', eta: trainEta },
    { id: 'flight', eta: flightEta },
  ].filter(m => m.eta > 0).sort((a, b) => a.eta - b.eta)[0]?.id;

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-3">
        <TrendingUp size={12} className="text-[#1DB954]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Compare All Options</span>
      </div>

      {(['cab', 'train', 'flight']).map((mode) => {
        const fares = { cab: cabFare, train: trainFare, flight: flightFare };
        const etas = { cab: cabEta, train: trainEta, flight: flightEta };
        const surges = { cab: cabSurge, train: trainSurge, flight: flightSurge };
        const avail = { cab: true, train: trainFare > 0, flight: flightFare > 0 };
        if (!MODES[mode]) return null;
        return (
          <ModeDetailCard
            key={mode}
            mode={mode}
            fare={fares[mode]}
            eta={etas[mode]}
            surge={surges[mode]}
            available={avail[mode]}
            isBest={cheapestId === mode && fares[mode] > 0}
            isFastest={fastestId === mode && etas[mode] > 0}
            isActive={false}
            onClick={() => onSelect(mode)}
          />
        );
      })}

      {/* Summary insight */}
      {cheapestId && fastestId && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] text-[10px] text-gray-500 leading-relaxed"
        >
          {cheapestId === fastestId ? (
            <><span style={{ color: MODES[cheapestId].color }} className="font-bold">{MODES[cheapestId].label}</span> is your best pick — cheapest <em>and</em> fastest for this route.</>
          ) : (
            <>Take <span style={{ color: MODES[cheapestId].color }} className="font-bold">{MODES[cheapestId].label}</span> to save money, or <span style={{ color: MODES[fastestId].color }} className="font-bold">{MODES[fastestId].label}</span> to get there fastest.</>
          )}
        </motion.div>
      )}
    </div>
  );
};

// ── Main TransportComparison export ─────────────────────────────
export const TransportComparison = ({
  activeMode, setActiveMode,
  cabFare, trainFare, flightFare,
  cabEta, trainEta, flightEta,
  cabSurge, trainSurge, flightSurge,
  distance,
  hasResult,
}) => {
  const modes = ['cab', 'train', 'flight', 'all'];
  const modeIcons = { cab: Car, train: Train, flight: Plane, all: TrendingUp };

  const isBestValue = (mode) => {
    if (mode === 'all') return false;
    const fares = { cab: cabFare, train: trainFare, flight: flightFare };
    const sorted = Object.entries(fares).filter(([, f]) => f > 0).sort(([, a], [, b]) => a - b);
    return sorted[0]?.[0] === mode;
  };

  const isFastest = (mode) => {
    if (mode === 'all') return false;
    const etas = { cab: cabEta, train: trainEta, flight: flightEta };
    const sorted = Object.entries(etas).filter(([, e]) => e > 0).sort(([, a], [, b]) => a - b);
    return sorted[0]?.[0] === mode;
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Mode Tab Bar ── */}
      <div className="p-3 border-b border-white/5 flex-shrink-0">
        <div className="flex gap-1.5 bg-white/[0.03] rounded-xl p-1 border border-white/5">
          {modes.map((mode) => {
            const Icon = modeIcons[mode];
            const cfg = MODES[mode] || { color: '#888' };
            const active = activeMode === mode;
            return (
              <motion.button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className="flex-1 flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg text-[9px] font-bold uppercase tracking-wide transition-all duration-200 cursor-pointer relative overflow-hidden"
                style={{
                  background: active ? (mode === 'all' ? 'rgba(255,255,255,0.08)' : cfg.bg) : 'transparent',
                  color: active ? (mode === 'all' ? '#fff' : cfg.color) : '#555',
                  border: active ? `1px solid ${mode === 'all' ? 'rgba(255,255,255,0.12)' : cfg.border}` : '1px solid transparent',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={12} />
                <span>{mode === 'all' ? 'All' : mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
                {/* Tiny chip indicators */}
                {mode !== 'all' && hasResult && (
                  <div className="flex gap-0.5 mt-0.5">
                    {isBestValue(mode) && <div className="w-1 h-1 rounded-full bg-[#1DB954]" />}
                    {isFastest(mode) && <div className="w-1 h-1 rounded-full bg-[#00f3ff]" />}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto p-3">
        <AnimatePresence mode="wait">
          {activeMode === 'all' ? (
            <motion.div
              key="all"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <ComparisonTable
                cabFare={cabFare} trainFare={trainFare} flightFare={flightFare}
                cabEta={cabEta} trainEta={trainEta} flightEta={flightEta}
                cabSurge={cabSurge} trainSurge={trainSurge} flightSurge={flightSurge}
                onSelect={setActiveMode}
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeMode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-2"
            >
              <ModeDetailCard
                mode={activeMode}
                fare={{ cab: cabFare, train: trainFare, flight: flightFare }[activeMode]}
                eta={{ cab: cabEta, train: trainEta, flight: flightEta }[activeMode]}
                surge={{ cab: cabSurge, train: trainSurge, flight: flightSurge }[activeMode]}
                available={true}
                isBest={isBestValue(activeMode)}
                isFastest={isFastest(activeMode)}
                isActive={true}
                onClick={() => { }}
              />

              {/* Mode-specific details */}
              <ModeDetails mode={activeMode} distance={distance}
                fare={{ cab: cabFare, train: trainFare, flight: flightFare }[activeMode]}
                surge={{ cab: cabSurge, train: trainSurge, flight: flightSurge }[activeMode]}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ── Mode-specific detail pane ────────────────────────────────────
const ModeDetails = ({ mode, distance, fare, surge }) => {
  const details = {
    cab: [
      { label: 'Base Fare', value: '₹30' },
      { label: 'Rate / km', value: '₹12' },
      { label: 'Surge Applied', value: surge > 1 ? `×${surge.toFixed(2)}` : 'None' },
      { label: 'Model', value: 'AI-Predicted' },
    ],
    train: [
      { label: 'Class', value: 'Sleeper / 2AC' },
      { label: 'Rate / km', value: '₹8 – ₹16' },
      { label: 'Peak Surcharge', value: 'Fixed schedule' },
      { label: 'Booking', value: 'IRCTC style' },
    ],
    flight: [
      { label: 'Sector', value: distance < 500 ? 'Short Haul' : 'Medium Haul' },
      { label: 'Base Ticket', value: '₹3,500+' },
      { label: 'Fuel Surcharge', value: distance < 500 ? '+20%' : '+10%' },
      { label: 'Airport Time', value: '+90 min' },
    ],
  };

  const cfg = MODES[mode];
  const info = details[mode] || [];

  return (
    <div className="rounded-2xl border p-3 space-y-2"
      style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: cfg?.color }}>
        Pricing Breakdown
      </div>
      {info.map(({ label, value }) => (
        <div key={label} className="flex justify-between items-center">
          <span className="text-[10px] text-gray-500">{label}</span>
          <span className="text-[10px] font-bold text-gray-200">{value}</span>
        </div>
      ))}
      {fare > 0 && (
        <div className="pt-2 mt-1 border-t border-white/5 flex justify-between items-center">
          <span className="text-[10px] font-bold text-gray-400">Total Estimate</span>
          <span className="text-sm font-bold" style={{ color: cfg?.color }}>₹{Math.round(fare)}</span>
        </div>
      )}
    </div>
  );
};
