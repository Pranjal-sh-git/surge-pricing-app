import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, Gauge, Database, Sliders } from 'lucide-react';

// Exact datasets requested
const featureData = [
  { feature: 'Festival Day', importance: 0.5367 },
  { feature: 'Pickup Hour', importance: 0.1835 },
  { feature: 'Pickup Day', importance: 0.1086 },
  { feature: 'Pickup Month', importance: 0.0672 },
  { feature: 'Bad Weather', importance: 0.0534 },
  { feature: 'Distance (km)', importance: 0.0213 },
  { feature: 'City', importance: 0.0187 },
  { feature: 'Ride Tier', importance: 0.0054 },
  { feature: 'Base Price', importance: 0.0032 },
  { feature: 'Cab Operator', importance: 0.0017 },
];

const hourlyData = [
  { hour: '12am', surge: 1.4 },
  { hour: '1am', surge: 1.3 },
  { hour: '2am', surge: 1.2 },
  { hour: '3am', surge: 1.1 },
  { hour: '4am', surge: 1.0 },
  { hour: '5am', surge: 1.1 },
  { hour: '6am', surge: 1.3 },
  { hour: '7am', surge: 1.5 },
  { hour: '8am', surge: 1.9 },
  { hour: '9am', surge: 2.1 },
  { hour: '10am', surge: 1.8 },
  { hour: '11am', surge: 1.5 },
  { hour: '12pm', surge: 1.3 },
  { hour: '1pm', surge: 1.2 },
  { hour: '2pm', surge: 1.2 },
  { hour: '3pm', surge: 1.3 },
  { hour: '4pm', surge: 1.5 },
  { hour: '5pm', surge: 1.8 },
  { hour: '6pm', surge: 2.2 },
  { hour: '7pm', surge: 2.4 },
  { hour: '8pm', surge: 2.1 },
  { hour: '9pm', surge: 1.8 },
  { hour: '10pm', surge: 1.6 },
  { hour: '11pm', surge: 1.5 },
];

const monthlyData = [
  { month: 'Jan', surge: 1.4 },
  { month: 'Feb', surge: 1.3 },
  { month: 'Mar', surge: 1.6 },
  { month: 'Apr', surge: 1.4 },
  { month: 'May', surge: 1.3 },
  { month: 'Jun', surge: 1.8 },
  { month: 'Jul', surge: 2.0 },
  { month: 'Aug', surge: 1.9 },
  { month: 'Sep', surge: 1.7 },
  { month: 'Oct', surge: 2.1 },
  { month: 'Nov', surge: 2.3 },
  { month: 'Dec', surge: 1.5 },
];

// Custom Premium Tooltip Component
const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f0f0f]/95 border border-white/10 p-2.5 rounded-2xl backdrop-blur-md shadow-2xl text-[10px] font-sans">
        <p className="font-bold text-white mb-1">{label}</p>
        {payload.map((pld, index) => (
          <p key={index} style={{ color: pld.color || pld.fill || '#00ff88' }} className="font-mono font-medium">
            {pld.name}: {typeof pld.value === 'number' ? pld.value.toFixed(4) : pld.value}{unit}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ModelInsights = () => {
  const containerRef = useRef(null);
  // Trigger animations when the container gets scrolled into view
  const isInView = useInView(containerRef, { once: true, margin: "-120px 0px" });

  return (
    <section
      ref={containerRef}
      id="model-insights"
      className="relative w-full py-12 lg:py-16 px-6 lg:px-8 overflow-hidden bg-[#121212] scroll-mt-20 border-t border-white/5"
    >
      {/* ── Background Cyber Ambient Elements ── */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00ff88]/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00f3ff]/10 rounded-full blur-[120px] -z-10 animate-pulse"
        style={{ animationDelay: '1.5s' }}
      />

      <div className="max-w-6xl mx-auto w-full relative z-10 font-sans">
        {/* ── Section Header ── */}
        <div className="text-left mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" />
            <span className="text-[#00ff88] text-[9px] font-bold uppercase tracking-[0.2em] font-display">
              Model Intelligence
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="text-3xl md:text-4xl font-display font-extrabold tracking-tighter text-white mb-2"
          >
            Model{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00f3ff] drop-shadow-[0_0_15px_rgba(0,255,136,0.25)]">
              Intelligence.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[#B3B3B3] text-xs md:text-sm max-w-3xl font-body font-medium leading-relaxed"
          >
            XGBoost model trained on 50,000 synthetic Indian ride records — built to reflect real surge patterns across Indian cities
          </motion.p>
        </div>

        {/* ── SECTION 1: Model Stats Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            {
              value: '84.84%',
              label: 'Model Accuracy (R²)',
              icon: TrendingUp,
              desc: 'Explains variance of surge factors',
            },
            {
              value: '0.2061',
              label: 'RMSE Score',
              icon: Gauge,
              desc: 'Standard deviation of residuals',
            },
            {
              value: '50,000',
              label: 'Training Records',
              icon: Database,
              desc: 'Synthetic ride profiles',
            },
            {
              value: '10',
              label: 'Features Used',
              icon: Sliders,
              desc: 'Context feature columns',
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.12 + idx * 0.06 }}
              whileHover={{
                y: -6,
                scale: 1.02,
                borderColor: 'rgba(0, 255, 136, 0.4)',
                boxShadow: '0 12px 30px rgba(0, 255, 136, 0.08)',
                transition: { duration: 0.18, ease: 'easeOut', delay: 0 },
              }}
              className="p-4 rounded-2xl bg-[#181818]/60 border border-white/10 backdrop-blur-xl hover:border-[#00ff88]/30 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-display">
                  {card.label}
                </span>
                <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-[#00ff88] group-hover:scale-110 transition-transform">
                  <card.icon size={13} />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-display font-black tracking-tight text-[#00ff88] mb-0.5 drop-shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                {card.value}
              </div>
              <p className="text-[9px] text-zinc-500 font-medium">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── SECTION 2, 3, & 4: Charts Grid (3 Columns Side-by-Side) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Feature Importance */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            whileHover={{
              y: -6,
              scale: 1.015,
              borderColor: 'rgba(0, 255, 136, 0.3)',
              boxShadow: '0 12px 30px rgba(0, 255, 136, 0.05)',
              transition: { duration: 0.2, ease: 'easeOut', delay: 0 },
            }}
            className="p-5 rounded-2xl bg-[#181818]/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between h-[380px] transition-all duration-300"
          >
            <div>
              <h3 className="text-white font-display font-bold text-sm mb-0.5">
                Feature Importance
              </h3>
              <p className="text-zinc-400 text-[10px] font-medium mb-4">
                Relative contribution of features to XGBoost surge predictions
              </p>
            </div>

            <div className="flex-1 w-full relative min-h-[260px]">
              {isInView && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={featureData}
                    layout="vertical"
                    margin={{ top: 0, right: 10, left: 15, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="rgba(255,255,255,0.02)"
                      strokeDasharray="3 3"
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis
                      type="number"
                      stroke="#555"
                      tick={{ fill: '#888', fontSize: 8 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      dataKey="feature"
                      type="category"
                      stroke="#555"
                      tick={{ fill: '#ccc', fontSize: 9, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      width={75}
                    />
                    <Tooltip
                      content={<CustomTooltip name="Importance" />}
                      cursor={{ fill: 'rgba(255,255,255,0.01)' }}
                    />
                    <Bar
                      dataKey="importance"
                      name="Importance"
                      fill="#00ff88"
                      radius={[0, 3, 3, 0]}
                      barSize={10}
                      isAnimationActive={true}
                      animationDuration={1500}
                    >
                      {featureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill="#00ff88" fillOpacity={1 - index * 0.08} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Card 2: Surge by Hour of Day */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            whileHover={{
              y: -6,
              scale: 1.015,
              borderColor: 'rgba(0, 243, 255, 0.3)',
              boxShadow: '0 12px 30px rgba(0, 243, 255, 0.05)',
              transition: { duration: 0.2, ease: 'easeOut', delay: 0 },
            }}
            className="p-5 rounded-2xl bg-[#181818]/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between h-[380px] transition-all duration-300"
          >
            <div>
              <h3 className="text-white font-display font-bold text-sm mb-0.5">
                Surge by Hour of Day
              </h3>
              <p className="text-zinc-400 text-[10px] font-medium mb-4">
                Peak demand surges during morning (9 AM) & evening (7 PM) rush hours
              </p>
            </div>

            <div className="flex-1 w-full relative min-h-[260px]">
              {isInView && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={hourlyData}
                    margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="hourlyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#00f3ff" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke="rgba(255,255,255,0.02)"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="hour"
                      stroke="#555"
                      tick={{ fill: '#888', fontSize: 8 }}
                      axisLine={false}
                      tickLine={false}
                      interval={4}
                    />
                    <YAxis
                      domain={[1.0, 2.6]}
                      stroke="#555"
                      tick={{ fill: '#888', fontSize: 8 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip name="Avg Surge" unit="x" />} />
                    <Area
                      type="monotone"
                      dataKey="surge"
                      name="Avg Surge"
                      stroke="#00f3ff"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#hourlyGrad)"
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Card 3: Surge by Month */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            whileHover={{
              y: -6,
              scale: 1.015,
              borderColor: 'rgba(255, 107, 53, 0.3)',
              boxShadow: '0 12px 30px rgba(255, 107, 53, 0.05)',
              transition: { duration: 0.2, ease: 'easeOut', delay: 0 },
            }}
            className="p-5 rounded-2xl bg-[#181818]/60 border border-white/10 backdrop-blur-xl flex flex-col justify-between h-[380px] transition-all duration-300"
          >
            <div>
              <h3 className="text-white font-display font-bold text-sm mb-0.5">
                Surge by Month
              </h3>
              <p className="text-zinc-400 text-[10px] font-medium mb-4">
                Visualizing monsoon season spikes (Jun-Sep) & festive peaks (Oct-Nov)
              </p>
            </div>

            <div className="flex-1 w-full relative min-h-[260px]">
              {isInView && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="rgba(255,255,255,0.02)"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#555"
                      tick={{ fill: '#888', fontSize: 8 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[1.0, 2.5]}
                      stroke="#555"
                      tick={{ fill: '#888', fontSize: 8 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip name="Surge Multiplier" unit="x" />} />
                    <Bar
                      dataKey="surge"
                      name="Surge Multiplier"
                      radius={[2, 2, 0, 0]}
                      barSize={12}
                      isAnimationActive={true}
                      animationDuration={1500}
                    >
                      {monthlyData.map((entry, index) => {
                        const isSpecial = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].includes(entry.month);
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={isSpecial ? '#ff6b35' : '#555555'}
                            fillOpacity={isSpecial ? 1 : 0.6}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ModelInsights;
