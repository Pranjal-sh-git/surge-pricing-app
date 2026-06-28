import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Zap, ChevronDown, MapPin, Clock, TrendingUp, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ── User avatar (initials-based) ─────────────────────────────────
const Avatar = ({ user, size = 'md' }) => {
  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-14 h-14 text-lg',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-display font-black flex-shrink-0`}
      style={{
        background: `radial-gradient(circle at 30% 30%, ${user.avatarColor}cc, ${user.avatarColor}66)`,
        boxShadow: `0 0 16px ${user.avatarColor}40`,
        border: `1.5px solid ${user.avatarColor}50`,
        color: '#fff',
      }}
    >
      {initials}
    </div>
  );
};

// ── Stat chip ─────────────────────────────────────────────────────
const StatChip = ({ icon: Icon, label, value, color = '#1DB954' }) => (
  <div className="flex-1 p-3 rounded-2xl bg-white/[0.03] border border-white/8 text-center">
    <Icon size={14} className="mx-auto mb-1" style={{ color }} />
    <p className="text-white font-bold text-sm leading-tight">{value}</p>
    <p className="text-zinc-600 text-[10px] mt-0.5">{label}</p>
  </div>
);

// ── Format join date ──────────────────────────────────────────────
const formatJoinDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
};

// ── Account Button ────────────────────────────────────────────────
export const AccountButton = ({ onOpenAuth }) => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // ── Not logged in: show auth button ──────────────────────────
  if (!user) {
    return (
      <button
        onClick={onOpenAuth}
        id="auth-open-btn"
        className="flex items-center gap-2 px-4 py-1.5 rounded-xl
                   bg-[#1DB954]/10 border border-[#1DB954]/30
                   text-[#1DB954] text-[13px] font-semibold
                   hover:bg-[#1DB954]/20 hover:border-[#1DB954]/50
                   hover:shadow-[0_0_16px_rgba(29,185,84,0.2)]
                   transition-all duration-300 cursor-pointer whitespace-nowrap"
      >
        <User size={14} strokeWidth={2} />
        <span className="hidden sm:inline">Sign In</span>
      </button>
    );
  }

  // ── Logged in: avatar + dropdown ──────────────────────────────
  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(p => !p)}
        id="account-menu-btn"
        className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl border transition-all duration-300 cursor-pointer
          ${open
            ? 'bg-white/8 border-white/15 shadow-lg'
            : 'bg-white/4 border-white/8 hover:bg-white/8 hover:border-white/15'
          }`}
      >
        <Avatar user={user} size="sm" />
        <span className="hidden sm:block text-[13px] font-semibold text-white/90 max-w-[80px] truncate">
          {user.name.split(' ')[0]}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={13} className="text-zinc-500" />
        </motion.div>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+10px)] w-72 rounded-3xl
                       bg-[#161616]/98 backdrop-blur-2xl border border-white/10
                       shadow-[0_24px_60px_rgba(0,0,0,0.8)] overflow-hidden z-[200]"
          >
            {/* Top accent */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#1DB954]/60 to-transparent" />

            {/* Profile header */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar user={user} size="lg" />
                <div className="min-w-0">
                  <p className="text-white font-display font-bold text-base leading-tight truncate">{user.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5 truncate">{user.email}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Shield size={10} className="text-[#1DB954]" />
                    <span className="text-[10px] text-[#1DB954] font-semibold">Verified Member</span>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="flex gap-2">
                <StatChip
                  icon={TrendingUp}
                  label="Rides Est."
                  value={user.ridesEstimated || 0}
                  color="#1DB954"
                />
                <StatChip
                  icon={Clock}
                  label="Member Since"
                  value={formatJoinDate(user.joinedAt)}
                  color="#00f3ff"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5 mx-4" />

            {/* Menu items */}
            <div className="p-3 space-y-1">
              <MenuRow
                icon={User}
                label="My Profile"
                sub="Account settings"
                iconColor="#1DB954"
                onClick={() => { setOpen(false); window.location.hash = '#/profile'; }}
              />
              <MenuRow
                icon={MapPin}
                label="Ride History"
                sub="Your past estimates"
                iconColor="#00f3ff"
                onClick={() => { setOpen(false); window.location.hash = '#/ride-history'; }}
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5 mx-4" />

            {/* Logout */}
            <div className="p-3">
              <button
                onClick={() => { logout(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left
                           text-red-400 hover:bg-red-500/10 hover:text-red-300
                           transition-all duration-200 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center
                                group-hover:bg-red-500/15 transition-colors">
                  <LogOut size={14} className="text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Sign Out</p>
                  <p className="text-[10px] text-red-500/70">See you next time</p>
                </div>
              </button>
            </div>

            {/* Bottom padding */}
            <div className="pb-2" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Menu row item ─────────────────────────────────────────────────
const MenuRow = ({ icon: Icon, label, sub, iconColor, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left
               hover:bg-white/5 transition-all duration-200 cursor-pointer group"
  >
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
      style={{ background: `${iconColor}15`, border: `1px solid ${iconColor}25` }}
    >
      <Icon size={14} style={{ color: iconColor }} />
    </div>
    <div>
      <p className="text-white text-sm font-semibold leading-tight group-hover:text-white/90">{label}</p>
      <p className="text-zinc-600 text-[10px] mt-0.5">{sub}</p>
    </div>
  </button>
);
