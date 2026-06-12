import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Trash2, ShieldAlert, Award, TrendingUp, AlertTriangle, ArrowLeft, RefreshCw, Car } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const RideHistory = () => {
  const { user, clearRideHistory } = useAuth();
  const history = user?.rideHistory || [];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
        <div className="text-center p-8 rounded-3xl bg-[#181818]/60 border border-white/10 backdrop-blur-xl max-w-md w-full">
          <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-zinc-400 mb-6">Please log in to view your ride history.</p>
          <a
            href="#/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1DB954] text-black font-semibold hover:bg-[#1ed760] transition-all"
            onClick={() => {
              const btn = document.getElementById('auth-open-btn');
              if (btn) btn.click();
            }}
          >
            Go to Home & Sign In
          </a>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalRides = history.length;
  const avgSurge = totalRides > 0 
    ? (history.reduce((acc, r) => acc + (Number(r.surgeMultiplier) || 1), 0) / totalRides).toFixed(2)
    : '1.00';
  
  const maxSurge = totalRides > 0
    ? Math.max(...history.map(r => Number(r.surgeMultiplier) || 1)).toFixed(2)
    : '1.00';

  const cabTypeNames = {
    0: 'Ola',
    1: 'Uber India'
  };

  const rideTierNames = {
    0: 'Auto',
    1: 'Mini',
    2: 'Sedan',
    3: 'Prime Sedan',
    4: 'Prime SUV',
    5: 'Bike'
  };

  const formatDateTime = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '—';
    }
  };

  const getSurgeBadgeColor = (surge) => {
    const s = Number(surge) || 1.0;
    if (s >= 1.5) return 'bg-red-500/10 border-red-500/30 text-red-400';
    if (s > 1.0) return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    return 'bg-[#1DB954]/10 border-[#1DB954]/30 text-[#1DB954]';
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans py-24 px-6 lg:px-8 relative overflow-hidden">
      {/* Background Grid Pattern & Glows */}
      <div className="absolute inset-0 opacity-[0.05]" 
        style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00f3ff]/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#1DB954]/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <a href="#/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#1DB954] font-medium text-sm transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </a>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono">ESTIMATION RECORDS</span>
            {totalRides > 0 && (
              <button 
                onClick={clearRideHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
              >
                <Trash2 size={12} />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-[#00f3ff]/30 bg-[#00f3ff]/10 text-xs text-[#00f3ff] font-bold uppercase tracking-widest">
            <Clock size={12} />
            Your Estimates
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-4">
            Ride <span className="text-[#00f3ff]">History.</span>
          </h1>
          <p className="text-[#B3B3B3] text-sm md:text-base max-w-3xl leading-relaxed">
            Review your previously calculated surge multipliers and fare estimations. This data helps track pricing trends for your common routes.
          </p>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-[#181818]/60 border border-white/10 backdrop-blur-xl">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider block mb-1">Total Runs</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-display text-white">{totalRides}</span>
              <span className="text-zinc-600 text-xs">queries</span>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-[#181818]/60 border border-white/10 backdrop-blur-xl">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider block mb-1">Avg Surge</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-display text-[#00f3ff]">{avgSurge}x</span>
              <TrendingUp size={12} className="text-[#00f3ff]" />
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-[#181818]/60 border border-white/10 backdrop-blur-xl">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider block mb-1">Max Surge</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-display text-red-400">{maxSurge}x</span>
              <AlertTriangle size={12} className="text-red-400" />
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-[#181818]/60 border border-white/10 backdrop-blur-xl">
            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider block mb-1">Member Status</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold font-display text-[#1DB954]">Active Saver</span>
              <Award size={12} className="text-[#1DB954] ml-1" />
            </div>
          </div>
        </div>

        {/* Estimates List */}
        {totalRides === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#181818]/40 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 mb-4">
              <Car size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Estimation Records Found</h3>
            <p className="text-zinc-500 text-sm max-w-sm mb-6 leading-relaxed">
              You haven't run any route calculations yet. Launch the journey planner to check prices, live surge, and alternative modes of transit.
            </p>
            <a 
              href="#/ride" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1DB954] text-black text-sm font-semibold hover:bg-[#1ed760] transition-all cursor-pointer shadow-lg shadow-[#1DB954]/10"
            >
              Plan Your Journey
              <ArrowRight size={14} />
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {history.map((ride, idx) => (
                <motion.div
                  key={ride.id || idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                  className="p-5 rounded-2xl bg-[#181818]/40 border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Info: Cab Type & Route */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2.5">
                      {/* Operator Badge */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border
                        ${ride.cabType === 1
                          ? 'bg-white/10 border-white/20 text-white' 
                          : 'bg-[#1DB954]/10 border-[#1DB954]/20 text-[#1DB954]'
                        }`}
                      >
                        {cabTypeNames[ride.cabType] || 'Cab'}
                      </span>
                      
                      {/* Tier */}
                      <span className="text-xs text-zinc-300 font-semibold">
                        {rideTierNames[ride.rideTier] || 'Standard'}
                      </span>

                      {/* Distance */}
                      <span className="text-[10px] text-zinc-500 font-mono">
                        · {ride.distance_km || ride.distance} km
                      </span>

                      {/* Date */}
                      <span className="text-[10px] text-zinc-500 font-mono ml-auto md:ml-0 flex items-center gap-1">
                        <Clock size={10} />
                        {formatDateTime(ride.timestamp)}
                      </span>
                    </div>

                    {/* Route Addresses */}
                    <div className="space-y-1 text-sm text-zinc-300">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                        <p className="truncate font-medium text-xs md:text-sm text-white/90">{ride.pickupAddress || 'Pickup'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-sm bg-[#00f3ff] flex-shrink-0" />
                        <p className="truncate font-medium text-xs md:text-sm text-white/90">{ride.dropoffAddress || 'Dropoff'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Info: Surge & Fare */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-white/5 pt-3 md:pt-0 gap-1 flex-shrink-0">
                    {/* Surge badge */}
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-black border tracking-wider ${getSurgeBadgeColor(ride.surgeMultiplier)}`}>
                      ×{Number(ride.surgeMultiplier || 1.0).toFixed(2)} Surge
                    </span>
                    
                    {/* Final Estimated Fare */}
                    <span className="text-xl md:text-2xl font-black font-display text-white mt-1">
                      ₹{Math.round(ride.totalFare || ride.fare)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
