import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Activity, CreditCard, Loader2, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

const MapPlaceholder = () => (
  <div className="absolute inset-0 bg-white dark:bg-[#121212] overflow-hidden rounded-t-[2rem] lg:rounded-r-none lg:rounded-l-[2rem]">
    {/* Map Grid Pattern */}
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
    {/* Abstract Routes */}
    <svg className="absolute w-full h-full opacity-30" viewBox="0 0 800 600" preserveAspectRatio="none">
      <path d="M-100 200 C 100 150, 300 400, 500 300 S 700 100, 900 250" fill="none" stroke="#1DB954" strokeWidth="8" strokeLinecap="round" />
      <path d="M100 600 C 200 450, 400 500, 600 350 S 700 -50, 800 100" fill="none" stroke="#9CA3AF" strokeWidth="12" strokeLinecap="round" />
    </svg>
    {/* Map Pins */}
    <div className="absolute top-[40%] left-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div className="w-4 h-4 bg-white rounded-full border-2 border-[#111111] shadow-md"></div>
      <div className="text-xs font-semibold mt-1 px-2 py-0.5 bg-gray-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 text-black dark:text-white rounded-md shadow-sm">Pickup</div>
    </div>
    <div className="absolute top-[60%] left-[60%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div className="w-5 h-5 bg-[#1DB954] rounded-full border-2 border-[#121212] shadow-md flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white dark:bg-[#121212] rounded-full"></div>
      </div>
      <div className="text-xs font-semibold mt-1 px-2 py-0.5 bg-gray-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 text-black dark:text-white rounded-md shadow-sm">Dropoff</div>
    </div>
  </div>
);

export const RideAppUI = ({
  demand, setDemand,
  distance, setDistance,
  surgeMultiplier,
  totalFare,
  baseFare,
  ratePerKm,
  loading,
  error,
  fetchSurgeEstimate
}) => {
  const [showResult, setShowResult] = useState(false);

  const handleCheckSurge = async () => {
    const success = await fetchSurgeEstimate();
    if (success) {
      setShowResult(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      const success = await fetchSurgeEstimate();
      if (success) {
        setShowResult(true);
      }
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demand, distance]);

  return (
    <section className="w-full relative z-20 py-12 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-0 bg-gray-50 dark:bg-[#181818]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-black/5 dark:border-white/5 overflow-hidden min-h-[650px] transition-transform duration-300">

          {/* LEFT SIDE: Map View */}
          <div className="flex-1 relative min-h-[300px] lg:min-h-full order-2 lg:order-1 border-r border-black/5 dark:border-white/5 hidden sm:block">
            <MapPlaceholder />
            <div className="absolute top-6 left-6 bg-gray-50 dark:bg-[#181818]/80 backdrop-blur-md shadow-md rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium border border-black/10 dark:border-white/10 text-black dark:text-white z-10">
              <div className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse"></div>
              Live Map Data
            </div>
          </div>

          {/* RIGHT SIDE: Control Panel */}
          <div className="w-full lg:w-[480px] p-6 sm:p-10 flex flex-col justify-between order-1 lg:order-2 relative z-10">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl font-bold text-black dark:text-white mb-3 font-display tracking-tight"
              >
                Get a ride
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="text-gray-400 mb-8 font-body text-lg font-medium"
              >
                Check surge pricing and fare estimates.
              </motion.p>

              <div className="space-y-6">
                {/* Location Inputs */}
                <div className="relative">
                  {/* Connecting Line */}
                  <div className="absolute left-[23px] top-[40px] bottom-[40px] w-[2px] bg-black/10 dark:bg-white/10"></div>

                  {/* Pickup */}
                  <div className="relative flex items-center mb-4 group">
                    <div className="w-12 flex justify-center z-10">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Pickup location"
                        defaultValue="Current location"
                        className="w-full bg-[#282828] border-2 border-transparent rounded-xl px-4 py-3.5 text-black dark:text-white font-medium placeholder-[#B3B3B3] focus:bg-[#3E3E3E] focus:border-black/5 dark:border-white/50 outline-none transition-all font-body"
                      />
                    </div>
                  </div>

                  {/* Dropoff */}
                  <div className="relative flex items-center group">
                    <div className="w-12 flex justify-center z-10">
                      <div className="w-3 h-3 rounded-sm bg-[#1DB954]"></div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Where to?"
                        defaultValue="Downtown Avenue"
                        className="w-full bg-[#282828] border-2 border-transparent rounded-xl px-4 py-3.5 text-black dark:text-white font-medium placeholder-[#B3B3B3] focus:bg-[#3E3E3E] focus:border-black/5 dark:border-white/50 outline-none transition-all font-body"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-black/10 dark:border-white/10 my-6" />

                {/* Adjusters (Clean, minimal) */}
                <div className="space-y-5 bg-gray-50 dark:bg-[#181818] p-5 rounded-2xl border border-black/5 dark:border-white/5">
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-[#B3B3B3] uppercase tracking-wider mb-2">Trip Settings</h4>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400 font-medium">
                        <Navigation size={16} />
                        <span>Distance</span>
                      </div>
                      <span className="font-bold text-black dark:text-white">{distance} km</span>
                    </div>
                    <input
                      type="range" min="1" max="50"
                      value={distance} onChange={(e) => { setDistance(Number(e.target.value)); }}
                      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-[#B3B3B3] font-medium">
                        <Activity size={16} />
                        <span>Demand Intensity</span>
                      </div>
                      <span className="font-bold text-black dark:text-white">{demand} / 10</span>
                    </div>
                    <input
                      type="range" min="1" max="10"
                      value={demand} onChange={(e) => { setDemand(Number(e.target.value)); }}
                      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#1DB954]"
                    />
                  </div>
                </div>

                {/* Result Area */}
                <AnimatePresence mode="wait">
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#282828] rounded-2xl p-5 border border-black/10 dark:border-white/10 mt-6 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600 dark:text-[#B3B3B3] font-medium flex items-center gap-2 text-sm">
                            <CreditCard size={16} /> Est. Fare
                          </span>
                          {surgeMultiplier > 1 && (
                            <span className="text-[10px] font-bold bg-[#D83B01]/20 text-[#ff6633] px-2 py-1 rounded-md uppercase tracking-wider border border-[#D83B01]/30">
                              Surge x{surgeMultiplier}
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-4xl font-bold text-black dark:text-white font-display">₹{totalFare.toFixed(2)}</span>
                          {surgeMultiplier > 1 && (
                            <span className="text-gray-600 dark:text-[#B3B3B3] line-through text-lg font-medium">
                              ₹{((baseFare + distance * ratePerKm)).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex justify-between items-center text-xs text-gray-600 dark:text-[#B3B3B3]">
                          <div>Base: ₹{baseFare.toFixed(2)}</div>
                          <div>Rate: ₹{ratePerKm.toFixed(2)}/km</div>
                        </div>

                        {/* Dynamic Surge Message */}
                        {surgeMultiplier >= 1.5 ? (
                          <div className="mt-3 text-[13px] text-[#ff6633] bg-[#D83B01]/10 px-3 py-2.5 rounded-lg border border-[#D83B01]/20 flex items-start gap-2.5 leading-snug">
                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                            <div><strong className="font-bold block mb-0.5">High Surge</strong> Prices are significantly elevated due to very high demand.</div>
                          </div>
                        ) : surgeMultiplier > 1.0 ? (
                          <div className="mt-3 text-[13px] text-[#E4A11B] bg-[#E4A11B]/10 px-3 py-2.5 rounded-lg border border-[#E4A11B]/20 flex items-start gap-2.5 leading-snug">
                            <Activity size={16} className="mt-0.5 shrink-0" />
                            <div><strong className="font-bold block mb-0.5">Moderate Surge</strong> Prices are slightly higher than normal right now.</div>
                          </div>
                        ) : (
                          <div className="mt-3 text-[13px] text-[#1DB954] bg-[#1DB954]/10 px-3 py-2.5 rounded-lg border border-[#1DB954]/20 flex items-start gap-2.5 leading-snug">
                            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                            <div><strong className="font-bold block mb-0.5">Standard Fares</strong> Prices are normal. No surge is active.</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <button
                onClick={handleCheckSurge}
                disabled={loading}
                className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed font-body"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={20} /> Calculating</>
                ) : (
                  <>Check Price <ArrowRight size={20} /></>
                )}
              </button>
              {error && (
                <div className="mt-4 text-sm text-red-400 font-medium">
                  {error}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
