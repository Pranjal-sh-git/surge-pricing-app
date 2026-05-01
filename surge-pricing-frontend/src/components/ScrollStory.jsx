import React from 'react';
import { motion } from 'framer-motion';
import { BatteryLow, Zap, Flame } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// ── Animated bar ─────────────────────────────────────────────
const Bar = ({ label, value, maxValue = 100, color, delay = 0 }) => (
  <div className="flex items-center gap-3">
    <span className="text-[11px] text-gray-500 dark:text-[#888] font-medium w-16 text-right shrink-0">{label}</span>
    <div className="flex-1 h-4 bg-gray-200 dark:bg-[#1a1a1a] rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        whileInView={{ width: `${(value / maxValue) * 100}%` }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
      />
    </div>
    <span className="text-xs font-bold text-black dark:text-white w-8">{value}</span>
  </div>
);

// ── Mini Map: LOW ────────────────────────────────────────────
const LowMap = () => (
  <div className="relative w-full h-52 rounded-2xl bg-gray-100 dark:bg-[#0d0d0d] overflow-hidden border border-black/5 dark:border-white/5">
    {/* Grid */}
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(29,185,84,0.35) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
    {/* Glow */}
    <div className="absolute w-40 h-40 top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1DB954]/12 blur-[60px]" />
    {/* Route */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
      <motion.path
        d="M30 120 C 100 80, 200 150, 370 90"
        fill="none" stroke="#1DB954" strokeWidth="4" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
    {/* Pickup */}
    <div className="absolute top-[55%] left-[7%] flex flex-col items-center">
      <div className="w-4 h-4 rounded-full bg-white border-2 border-[#1DB954] shadow-lg" />
      <span className="text-[9px] mt-1 font-bold text-[#1DB954]/80 bg-gray-100 dark:bg-[#0d0d0d]/80 px-1.5 rounded">A</span>
    </div>
    {/* Dropoff */}
    <div className="absolute top-[40%] right-[6%] flex flex-col items-center">
      <div className="w-4 h-4 rounded-full bg-[#1DB954] border-2 border-white shadow-lg" />
      <span className="text-[9px] mt-1 font-bold text-[#1DB954]/80 bg-gray-100 dark:bg-[#0d0d0d]/80 px-1.5 rounded">B</span>
    </div>
    {/* Label */}
    <div className="absolute bottom-2 right-3 text-[10px] text-[#1DB954]/50 font-semibold tracking-wider">1 route · low traffic</div>
  </div>
);

// ── Mini Map: BALANCED ───────────────────────────────────────
const BalancedMap = () => (
  <div className="relative w-full h-52 rounded-2xl bg-gray-100 dark:bg-[#0d0d0d] overflow-hidden border border-black/5 dark:border-white/5">
    {/* Grid */}
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(245,158,11,0.35) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
    {/* Glow */}
    <div className="absolute w-48 h-48 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/12 blur-[60px]" />
    {/* Route 1 */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
      <motion.path
        d="M20 130 C 80 60, 180 160, 280 100 S 360 50, 390 80"
        fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
      />
      {/* Route 2 */}
      <motion.path
        d="M30 50 C 120 120, 250 30, 380 140"
        fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 6"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 1.5, ease: 'easeOut', delay: 0.6 }}
      />
    </svg>
    {/* Pickup */}
    <div className="absolute top-[60%] left-[5%] flex flex-col items-center">
      <div className="w-4 h-4 rounded-full bg-white border-2 border-amber-500 shadow-lg" />
      <span className="text-[9px] mt-1 font-bold text-amber-400/80 bg-gray-100 dark:bg-[#0d0d0d]/80 px-1.5 rounded">A</span>
    </div>
    {/* Dropoff */}
    <div className="absolute top-[35%] right-[3%] flex flex-col items-center">
      <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-lg" />
      <span className="text-[9px] mt-1 font-bold text-amber-400/80 bg-gray-100 dark:bg-[#0d0d0d]/80 px-1.5 rounded">B</span>
    </div>
    {/* Extra rider pin */}
    <div className="absolute top-[22%] left-[55%]">
      <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 border-2 border-white shadow-lg animate-pulse" />
    </div>
    {/* Label */}
    <div className="absolute bottom-2 right-3 text-[10px] text-amber-400/50 font-semibold tracking-wider">2 routes · moderate</div>
  </div>
);

// ── Mini Map: HIGH ───────────────────────────────────────────
const HighMap = () => (
  <div className="relative w-full h-52 rounded-2xl bg-gray-100 dark:bg-[#0d0d0d] overflow-hidden border border-red-500/20">
    {/* Grid */}
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(239,68,68,0.4) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
    {/* Pulsing glow */}
    <div className="absolute w-56 h-56 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/15 blur-[70px] animate-pulse" />
    {/* Route 1 */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
      <motion.path
        d="M15 140 C 80 50, 200 170, 300 80 S 370 30, 395 60"
        fill="none" stroke="#EF4444" strokeWidth="5" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
      />
      {/* Route 2 */}
      <motion.path
        d="M25 40 C 100 130, 220 20, 390 150"
        fill="none" stroke="#F97316" strokeWidth="4" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
      />
      {/* Route 3 */}
      <motion.path
        d="M180 -10 C 200 80, 150 140, 220 210"
        fill="none" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 5"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
      />
    </svg>
    {/* Pickup */}
    <div className="absolute top-[65%] left-[4%] flex flex-col items-center">
      <div className="w-4 h-4 rounded-full bg-white border-2 border-red-500 shadow-lg" />
      <span className="text-[9px] mt-1 font-bold text-red-400/80 bg-gray-100 dark:bg-[#0d0d0d]/80 px-1.5 rounded">A</span>
    </div>
    {/* Dropoff */}
    <div className="absolute top-[25%] right-[2%] flex flex-col items-center">
      <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-lg" />
      <span className="text-[9px] mt-1 font-bold text-red-400/80 bg-gray-100 dark:bg-[#0d0d0d]/80 px-1.5 rounded">B</span>
    </div>
    {/* Surge pins */}
    <div className="absolute top-[30%] left-[40%]">
      <div className="w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white shadow-lg animate-pulse" />
    </div>
    <div className="absolute top-[50%] left-[55%]">
      <div className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow-lg animate-pulse" />
    </div>
    <div className="absolute top-[72%] left-[35%]">
      <div className="w-3 h-3 rounded-full bg-red-400 border-2 border-white shadow-lg" />
    </div>
    {/* Label */}
    <div className="absolute bottom-2 right-3 text-[10px] text-red-400/50 font-semibold tracking-wider">3 routes · surge zone</div>
  </div>
);

// ── SECTION 1: LOW DEMAND ────────────────────────────────────
const LowSection = () => (
  <div className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 px-6 md:px-16 py-24">
    {/* Graph + Map */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full lg:w-1/2 max-w-lg space-y-5"
    >
      {/* Map */}
      <LowMap />

      {/* Data card */}
      <div className="bg-green-50 dark:bg-[#0a0f0a] rounded-3xl border border-[#1DB954]/20 p-8 relative overflow-hidden">
        <div className="absolute w-64 h-64 -top-20 -left-20 rounded-full bg-[#1DB954]/10 blur-[80px] pointer-events-none" />
        <div className="text-center mb-6 relative z-10">
          <div className="text-6xl font-display font-extrabold text-[#1DB954]">×1.0</div>
          <div className="text-xs text-[#1DB954]/60 font-semibold tracking-widest uppercase mt-1">Base Fare</div>
        </div>
        <div className="space-y-3 relative z-10">
          <Bar label="Riders" value={15} color="#1DB954" delay={0.1} />
          <Bar label="Drivers" value={72} color="#1DB954" delay={0.2} />
          <Bar label="Wait (min)" value={3} maxValue={30} color="#1DB954" delay={0.3} />
        </div>
        <div className="mt-6 text-center relative z-10">
          <span className="px-4 py-1.5 rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 text-[#1DB954] text-xs font-semibold">
            ● Plenty of drivers nearby
          </span>
        </div>
      </div>
    </motion.div>

    {/* Card */}
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="w-full lg:w-1/2 max-w-xl"
    >
      <div className="p-8 md:p-12 rounded-[2.5rem] border-[3px] border-[#1DB954] bg-gray-50 dark:bg-[#181818]/80 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-5 mb-8">
          <div className="p-4 rounded-2xl bg-[#1DB954]/10 text-[#1DB954]"><BatteryLow size={28} /></div>
          <div className="text-base font-bold px-4 py-2 rounded-xl bg-[#1DB954]/10 text-[#1DB954]">Surge ×1.0</div>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-black dark:text-white tracking-tight">
          Low Demand. Lower Fares.
        </h2>
        <p className="text-xl md:text-2xl font-body text-gray-600 dark:text-[#B3B3B3] leading-relaxed font-medium">
          When the city is quiet, your ride is cheaper. Our baseline fares apply, making it the perfect time for a leisurely ride.
        </p>
      </div>
    </motion.div>
  </div>
);

// ── SECTION 2: BALANCED ──────────────────────────────────────
const BalancedSection = () => (
  <div className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 px-6 md:px-16 py-24">
    {/* Graph + Map */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full lg:w-1/2 max-w-lg space-y-5"
    >
      {/* Map */}
      <BalancedMap />

      {/* Data card */}
      <div className="bg-[#0f0d08] rounded-3xl border border-amber-500/20 p-8 relative overflow-hidden">
        <div className="absolute w-72 h-72 -top-24 -right-20 rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />
        <div className="text-center mb-6 relative z-10">
          <div className="text-6xl font-display font-extrabold text-amber-400">×1.5</div>
          <div className="text-xs text-amber-400/60 font-semibold tracking-widest uppercase mt-1">Moderate Surge</div>
        </div>
        <div className="space-y-3 relative z-10">
          <Bar label="Riders" value={52} color="#F59E0B" delay={0.1} />
          <Bar label="Drivers" value={40} color="#F59E0B" delay={0.2} />
          <Bar label="Wait (min)" value={12} maxValue={30} color="#F59E0B" delay={0.3} />
        </div>
        <div className="mt-6 flex gap-3 justify-center relative z-10">
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="text-[9px] text-amber-400/50 uppercase tracking-widest">Demand</div>
            <div className="text-sm font-bold text-amber-400">↑ Rising</div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="text-[9px] text-amber-400/50 uppercase tracking-widest">Supply</div>
            <div className="text-sm font-bold text-amber-400">→ Stable</div>
          </div>
        </div>
      </div>
    </motion.div>

    {/* Card */}
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="w-full lg:w-1/2 max-w-xl"
    >
      <div className="p-8 md:p-12 rounded-[2.5rem] border-[3px] border-amber-500 bg-gray-50 dark:bg-[#181818]/80 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-5 mb-8">
          <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500"><Zap size={28} /></div>
          <div className="text-base font-bold px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500">Surge ×1.5</div>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-black dark:text-white tracking-tight">
          Balanced Market. Stable Pricing.
        </h2>
        <p className="text-xl md:text-2xl font-body text-gray-600 dark:text-[#B3B3B3] leading-relaxed font-medium">
          Steady demand means consistent and predictable fares. Rush hour begins, but prices stay stable to get more drivers on the road.
        </p>
      </div>
    </motion.div>
  </div>
);

// ── SECTION 3: HIGH DEMAND ───────────────────────────────────
const HighSection = () => (
  <div className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 px-6 md:px-16 py-24">
    {/* Graph + Map */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full lg:w-1/2 max-w-lg space-y-5"
    >
      {/* Map */}
      <HighMap />

      {/* Data card */}
      <div className="bg-[#0f0808] rounded-3xl border border-red-500/20 p-8 relative overflow-hidden">
        <div className="absolute w-80 h-80 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[100px] pointer-events-none animate-pulse" />
        <div className="text-center mb-6 relative z-10">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-6xl font-display font-extrabold text-red-500"
          >×2.4</motion.div>
          <div className="text-xs text-red-400/60 font-semibold tracking-widest uppercase mt-1">Surge Active</div>
        </div>
        <div className="space-y-3 relative z-10">
          <Bar label="Riders" value={92} color="#EF4444" delay={0.1} />
          <Bar label="Drivers" value={18} color="#EF4444" delay={0.2} />
          <Bar label="Wait (min)" value={25} maxValue={30} color="#EF4444" delay={0.3} />
        </div>
        <div className="mt-6 flex gap-3 justify-center relative z-10">
          <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
            <div className="text-[9px] text-red-400/50 uppercase tracking-widest">Demand</div>
            <div className="text-sm font-bold text-red-400">↑↑ Peak</div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
            <div className="text-[9px] text-red-400/50 uppercase tracking-widest">Supply</div>
            <div className="text-sm font-bold text-red-400">↓↓ Low</div>
          </div>
        </div>
        <div className="mt-4 text-center text-[10px] text-red-400/40 font-medium tracking-wider relative z-10">
          ⚠ Fares elevated to balance marketplace
        </div>
      </div>
    </motion.div>

    {/* Card */}
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="w-full lg:w-1/2 max-w-xl"
    >
      <div className="p-8 md:p-12 rounded-[2.5rem] border-[3px] border-red-500 bg-gray-50 dark:bg-[#181818]/80 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-5 mb-8">
          <div className="p-4 rounded-2xl bg-red-500/10 text-red-500"><Flame size={28} /></div>
          <div className="text-base font-bold px-4 py-2 rounded-xl bg-red-500/10 text-red-500">Surge ×2.4+</div>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-black dark:text-white tracking-tight">
          High Demand. Surge Activated.
        </h2>
        <p className="text-xl md:text-2xl font-body text-gray-600 dark:text-[#B3B3B3] leading-relaxed font-medium">
          When everyone needs a ride, fares adapt to ensure availability. Surge pricing balances the marketplace so you can always get a pickup.
        </p>
      </div>
    </motion.div>
  </div>
);

// ── MAIN EXPORT ──────────────────────────────────────────────
export const ScrollStory = () => (
  <section className="relative w-full z-20 bg-white dark:bg-[#121212]">
    <LowSection />
    <BalancedSection />
    <HighSection />
  </section>
);
