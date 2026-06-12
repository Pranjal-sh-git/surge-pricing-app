import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Compass, ArrowLeft, Home, Zap } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans flex items-center justify-center py-24 px-6 lg:px-8 relative overflow-hidden">
      {/* Background Cyber Ambient Rings / Grids */}
      <div 
        className="absolute inset-0 opacity-[0.12]" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} 
      />

      {/* Cyber Grid Circle Overlays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/10 border-dashed pointer-events-none animate-spin" style={{ animationDuration: '60s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-[#1DB954]/10 pointer-events-none" />

      {/* Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#1DB954]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00f3ff]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 space-y-8">
        
        {/* Animated Cyber Radar Hexagon */}
        <div className="relative flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-24 h-24 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center relative group"
          >
            <Compass size={44} className="text-[#00f3ff] animate-pulse" />
            <span className="absolute inset-0 rounded-2xl border border-[#1DB954]/40 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
          </motion.div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute top-0 w-24 h-24 rounded-2xl border border-[#1DB954]/20 scale-125"
          />
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-widest"
          >
            <ShieldAlert size={12} />
            Error 404
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-display font-black tracking-tight text-white"
          >
            Signal <span className="text-gradient">Lost.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[#B3B3B3] text-xs font-medium max-w-sm mx-auto leading-relaxed"
          >
            The coordinates you requested are outside the mapped grids of the SurgeIQ network. 
            There are no drivers available at this location.
          </motion.p>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2"
        >
          <a
            href="#/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1DB954] text-black font-display font-bold text-xs tracking-tight transition-all flex items-center justify-center gap-2 hover:bg-[#1ed760] shadow-[0_0_24px_rgba(29,185,84,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Home size={14} />
            Return to Hub
          </a>
        </motion.div>

      </div>
    </div>
  );
};
