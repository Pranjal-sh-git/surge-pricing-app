import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Calendar, Key, Check, AlertCircle, ArrowLeft, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const UserProfile = () => {
  const { user, updateProfile, logout } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4">
        <div className="text-center p-8 rounded-3xl bg-[#181818]/60 border border-white/10 backdrop-blur-xl max-w-md w-full">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-zinc-400 mb-6">Please log in to view your profile settings.</p>
          <a
            href="#/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1DB954] text-black font-semibold hover:bg-[#1ed760] transition-all"
            onClick={() => {
              // Open login modal
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty.' });
      return;
    }

    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    // Simulate slight network lag for premium feedback feel
    await new Promise((r) => setTimeout(r, 800));

    const res = updateProfile({
      name: name.trim(),
      password: password ? password : undefined,
    });

    setLoading(false);
    if (res.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setPassword('');
      setConfirmPassword('');
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
  };

  const formatJoinDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans py-24 px-6 lg:px-8 relative overflow-hidden">
      {/* Background patterns & glows */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#1DB954]/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00f3ff]/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <a
            href="#/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#1DB954] font-medium text-sm transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </a>
          <span className="text-xs text-zinc-500 font-mono">ACCOUNT MANAGEMENT</span>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Left Column - User Stats Card */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#181818]/60 border border-white/10 backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden">
              <div
                className="absolute top-0 inset-x-0 h-1"
                style={{ backgroundColor: user.avatarColor }}
              />

              {/* Huge Avatar */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center font-display font-black text-3xl mb-4 mt-2"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${user.avatarColor}cc, ${user.avatarColor}66)`,
                  boxShadow: `0 0 32px ${user.avatarColor}40`,
                  border: `2px solid ${user.avatarColor}60`,
                }}
              >
                {initials}
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{user.name}</h2>
              <p className="text-zinc-500 text-xs font-mono mb-4">{user.email}</p>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/30 text-xs text-[#1DB954] font-semibold mb-6">
                <Shield size={12} />
                Verified SurgeIQ Member
              </div>

              {/* Details & stats */}
              <div className="w-full space-y-4 pt-4 border-t border-white/5 text-left text-sm text-zinc-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#00f3ff]" /> Member Since
                  </span>
                  <span className="text-white font-medium">
                    {formatJoinDate(user.joinedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <RefreshCw size={14} className="text-[#1DB954]" /> Rides Simulated
                  </span>
                  <span className="text-white font-bold text-base">
                    {user.ridesEstimated || 0}
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-400 font-semibold hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer"
              >
                <LogOut size={14} />
                Sign Out Account
              </button>
            </div>
          </div>

          {/* Right Column - Edit Profile Form */}
          <div className="md:col-span-7">
            <div className="p-8 rounded-3xl bg-[#181818]/40 border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-display font-black text-white mb-6 flex items-center gap-2">
                <User size={18} className="text-[#1DB954]" /> Edit Profile Settings
              </h3>

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] transition-all text-sm"
                    placeholder="Enter display name"
                  />
                </div>

                {/* Email (Disabled - cannot change unique identifier for mock simplicity) */}
                <div className="space-y-2 opacity-60">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Email Address (Account ID)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-4 py-3 rounded-2xl bg-black/20 border border-white/5 text-zinc-500 cursor-not-allowed text-sm"
                  />
                  <span className="text-[10px] text-zinc-600">
                    Email address serves as your unique identifier and cannot be modified.
                  </span>
                </div>

                <div className="border-t border-white/5 pt-4 my-4" />

                <div className="flex items-center gap-2 mb-4">
                  <Key size={14} className="text-[#00f3ff]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Change Password
                  </span>
                </div>

                {/* Password fields */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs text-zinc-500">New Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-all text-sm"
                      placeholder="Leave blank to keep same"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs text-zinc-500">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f3ff] focus:ring-1 focus:ring-[#00f3ff] transition-all text-sm"
                      placeholder="Leave blank to keep same"
                    />
                  </div>
                </div>

                {/* Messages notifications */}
                <AnimatePresence mode="wait">
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-2xl border flex items-center gap-3 text-xs font-medium ${
                        message.type === 'success'
                          ? 'border-[#1DB954]/30 bg-[#1DB954]/5 text-[#1DB954]'
                          : 'border-red-500/30 bg-red-500/5 text-red-400'
                      }`}
                    >
                      {message.type === 'success' ? (
                        <Check size={16} className="flex-shrink-0" />
                      ) : (
                        <AlertCircle size={16} className="flex-shrink-0" />
                      )}
                      <span>{message.text}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Save button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-[#1DB954] text-black font-bold hover:bg-[#1ed760] disabled:bg-zinc-700 disabled:text-zinc-500 hover:shadow-[0_0_24px_rgba(29,185,84,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? 'Saving Changes...' : 'Save Profile Settings'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
