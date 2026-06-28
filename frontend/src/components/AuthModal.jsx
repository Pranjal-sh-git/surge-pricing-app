import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle2, Zap, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ── Floating label input ──────────────────────────────────────────
const FloatField = ({ label, type = 'text', value, onChange, error, autoComplete, rightSlot }) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        placeholder=" "
        className={`peer w-full px-4 pt-6 pb-2 rounded-2xl bg-white/[0.04] border text-white text-sm font-medium
          outline-none transition-all duration-300 placeholder:text-transparent
          ${error
            ? 'border-red-500/60 ring-1 ring-red-500/20'
            : focused
              ? 'border-[#1DB954] ring-1 ring-[#1DB954]/20 bg-white/[0.06]'
              : 'border-white/10 hover:border-white/20'
          }
          ${rightSlot ? 'pr-12' : ''}
        `}
      />
      <label
        className={`absolute left-4 transition-all duration-200 pointer-events-none font-medium
          ${active ? 'top-2 text-[10px] tracking-widest uppercase' : 'top-4 text-sm'}
          ${error ? 'text-red-400' : focused ? 'text-[#1DB954]' : 'text-zinc-500'}
        `}
      >
        {label}
      </label>
      {rightSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
      {error && (
        <p className="mt-1.5 ml-1 text-[11px] text-red-400 flex items-center gap-1">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
};

// ── Auth Modal ────────────────────────────────────────────────────
export const AuthModal = ({ open, onClose }) => {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [globalError, setGlobalError] = useState('');
  const overlayRef = useRef(null);

  // Login fields
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPw, setLoginShowPw]     = useState(false);
  const [loginErrors, setLoginErrors]     = useState({});

  // Signup fields
  const [signName, setSignName]           = useState('');
  const [signEmail, setSignEmail]         = useState('');
  const [signPassword, setSignPassword]   = useState('');
  const [signConfirm, setSignConfirm]     = useState('');
  const [signShowPw, setSignShowPw]       = useState(false);
  const [signTerms, setSignTerms]         = useState(false);
  const [signErrors, setSignErrors]       = useState({});

  // Forgot password fields
  const [forgotEmail, setForgotEmail]     = useState('');
  const [forgotError, setForgotError]     = useState('');
  const [resetEmail, setResetEmail]       = useState('');
  const [newPassword, setNewPassword]     = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetErrors, setResetErrors]     = useState({});

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setTab('login');
      setStatus('idle');
      setGlobalError('');
      setLoginEmail(''); setLoginPassword(''); setLoginErrors({});
      setSignName(''); setSignEmail(''); setSignPassword(''); setSignConfirm(''); setSignTerms(false); setSignErrors({});
      setForgotEmail(''); setForgotError(''); setResetEmail(''); setNewPassword(''); setConfirmNewPassword(''); setResetErrors({});
    }
  }, [open]);

  const switchTab = (t) => {
    setTab(t);
    setGlobalError('');
    setLoginErrors({});
    setSignErrors({});
    setForgotError('');
    setResetErrors({});
    setStatus('idle');
  };

  // ── Login submit ──
  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!loginEmail) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.email = 'Invalid email address';
    if (!loginPassword) errs.password = 'Password is required';
    if (Object.keys(errs).length) { setLoginErrors(errs); return; }

    setStatus('loading');
    setGlobalError('');
    await new Promise(r => setTimeout(r, 900)); // simulate network

    const result = login({ email: loginEmail, password: loginPassword });
    if (result.success) {
      setStatus('success');
      setTimeout(onClose, 1200);
    } else {
      setStatus('idle');
      setGlobalError(result.error);
    }
  };

  // ── Signup submit ──
  const handleSignup = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!signName.trim()) errs.name = 'Full name is required';
    if (!signEmail) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signEmail)) errs.email = 'Invalid email address';
    if (!signPassword) errs.password = 'Password is required';
    else if (signPassword.length < 6) errs.password = 'Minimum 6 characters';
    if (!signConfirm) errs.confirm = 'Please confirm your password';
    else if (signConfirm !== signPassword) errs.confirm = 'Passwords do not match';
    if (!signTerms) errs.terms = 'Please accept the terms';
    if (Object.keys(errs).length) { setSignErrors(errs); return; }

    setStatus('loading');
    setGlobalError('');
    await new Promise(r => setTimeout(r, 1000)); // simulate network

    const result = signup({ name: signName, email: signEmail, password: signPassword });
    if (result.success) {
      setStatus('success');
      setTimeout(onClose, 1400);
    } else {
      setStatus('idle');
      setGlobalError(result.error);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotEmail) {
      setForgotError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotError('Invalid email address');
      return;
    }

    setStatus('loading');
    await new Promise(r => setTimeout(r, 600));

    const existingRaw = localStorage.getItem('surgeiq_users_db');
    const usersDb = existingRaw ? JSON.parse(existingRaw) : {};
    const record = usersDb[forgotEmail.toLowerCase().trim()];

    if (!record) {
      setStatus('idle');
      setForgotError('No account found with this email.');
      return;
    }

    setStatus('idle');
    setResetEmail(forgotEmail.toLowerCase().trim());
    setTab('reset-new');
  };

  const handleResetNewSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!newPassword) errs.password = 'Password is required';
    else if (newPassword.length < 6) errs.password = 'Minimum 6 characters';
    if (!confirmNewPassword) errs.confirm = 'Confirm password is required';
    else if (confirmNewPassword !== newPassword) errs.confirm = 'Passwords do not match';

    if (Object.keys(errs).length) {
      setResetErrors(errs);
      return;
    }

    setStatus('loading');
    await new Promise(r => setTimeout(r, 800));

    const existingRaw = localStorage.getItem('surgeiq_users_db');
    const usersDb = existingRaw ? JSON.parse(existingRaw) : {};
    
    if (usersDb[resetEmail]) {
      usersDb[resetEmail].password = newPassword;
      localStorage.setItem('surgeiq_users_db', JSON.stringify(usersDb));
      
      setStatus('success');
      setTimeout(() => {
        setTab('login');
        setLoginEmail(resetEmail);
        setLoginPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setForgotEmail('');
        setStatus('idle');
      }, 1500);
    } else {
      setStatus('idle');
      setGlobalError('Something went wrong. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Overlay ── */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          />

          {/* ── Modal card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md rounded-3xl bg-[#161616]/95 backdrop-blur-2xl
                         border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.7)] overflow-hidden pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Top accent line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#1DB954] to-transparent" />

              {/* Ambient glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-48 bg-[#1DB954]/10 rounded-full blur-3xl pointer-events-none" />

              {/* ── Success state ── */}
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-8 py-14 flex flex-col items-center gap-4 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                      className="w-16 h-16 rounded-2xl bg-[#1DB954]/15 border border-[#1DB954]/30 flex items-center justify-center"
                    >
                      <CheckCircle2 size={32} className="text-[#1DB954]" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-display font-bold text-white mb-1">
                        {tab === 'reset-new' 
                          ? 'Password updated!' 
                          : tab === 'login' 
                            ? 'Welcome back!' 
                            : 'Account created!'}
                      </h3>
                      <p className="text-zinc-500 text-sm">
                        {tab === 'reset-new' 
                          ? 'Your password was successfully reset.' 
                          : 'Signing you in to SurgeIQ…'}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>

                    {/* ── Header ── */}
                    <div className="px-6 pt-6 pb-0 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#1DB954] flex items-center justify-center">
                          <Zap size={13} className="text-black" strokeWidth={2.5} />
                        </span>
                        <span className="text-base font-display font-bold text-white tracking-tight">
                          Surge<span className="text-[#1DB954]">IQ</span>
                        </span>
                      </div>
                      <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center
                                   text-zinc-500 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {/* ── Tab switcher ── */}
                    {['login', 'signup'].includes(tab) && (
                      <div className="px-6 pt-5 pb-4">
                        <div className="relative flex bg-white/[0.04] border border-white/8 rounded-2xl p-1">
                          <motion.div
                            layout
                            className="absolute inset-y-1 rounded-xl bg-[#1DB954]/15 border border-[#1DB954]/30"
                            style={{ width: 'calc(50% - 4px)', left: tab === 'login' ? '4px' : 'calc(50%)' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                          {['login', 'signup'].map(t => (
                            <button
                              key={t}
                              onClick={() => switchTab(t)}
                              className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors duration-200 cursor-pointer
                                ${tab === t ? 'text-[#1DB954]' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                              {t === 'login' ? 'Sign In' : 'Sign Up'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Forgot/Reset Header ── */}
                    {(tab === 'forgot' || tab === 'reset-new') && (
                      <div className="px-6 pt-5 pb-2 text-center">
                        <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">
                          {tab === 'forgot' ? 'Recover Password' : 'Set New Password'}
                        </h3>
                        <p className="text-zinc-500 text-xs mt-1">
                          {tab === 'forgot' 
                            ? 'Enter your registered email to reset your password' 
                            : `Choose a secure password for ${resetEmail}`
                          }
                        </p>
                      </div>
                    )}

                    {/* ── Forms ── */}
                    <div className="px-6 pb-6">
                      <AnimatePresence mode="wait">
                        {tab === 'login' ? (
                          <motion.form
                            key="login-form"
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 12 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleLogin}
                            className="space-y-3"
                          >
                            <FloatField
                              label="Email address"
                              type="email"
                              value={loginEmail}
                              onChange={setLoginEmail}
                              error={loginErrors.email}
                              autoComplete="email"
                            />
                            <FloatField
                              label="Password"
                              type={loginShowPw ? 'text' : 'password'}
                              value={loginPassword}
                              onChange={setLoginPassword}
                              error={loginErrors.password}
                              autoComplete="current-password"
                              rightSlot={
                                <button type="button" onClick={() => setLoginShowPw(p => !p)}
                                  className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                                  {loginShowPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                              }
                            />

                            <div className="flex justify-end px-1">
                              <button
                                type="button"
                                onClick={() => switchTab('forgot')}
                                className="text-[11px] text-[#1DB954] hover:text-[#1ed760] font-semibold transition-colors cursor-pointer"
                              >
                                Forgot password?
                              </button>
                            </div>

                            {globalError && (
                              <motion.p
                                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-red-400 flex items-center gap-1.5 px-1"
                              >
                                <AlertCircle size={12} /> {globalError}
                              </motion.p>
                            )}

                            <button
                              type="submit"
                              disabled={status === 'loading'}
                              className="w-full py-3 rounded-2xl bg-[#1DB954] text-black font-display font-bold text-sm
                                         hover:bg-[#1ed760] active:scale-95 transition-all duration-200 cursor-pointer
                                         disabled:opacity-60 disabled:cursor-not-allowed
                                         shadow-[0_0_24px_rgba(29,185,84,0.25)] hover:shadow-[0_0_32px_rgba(29,185,84,0.4)]
                                         flex items-center justify-center gap-2 mt-2"
                            >
                              {status === 'loading' ? (
                                <span className="flex items-center gap-2">
                                  <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                                  Signing in…
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">Sign In <ArrowRight size={15} /></span>
                              )}
                            </button>

                            <p className="text-center text-xs text-zinc-600 pt-1">
                              Don't have an account?{' '}
                              <button type="button" onClick={() => switchTab('signup')}
                                className="text-[#1DB954] hover:text-[#1ed760] font-semibold cursor-pointer">
                                Sign up
                              </button>
                            </p>
                          </motion.form>
                        ) : tab === 'signup' ? (
                          <motion.form
                            key="signup-form"
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -12 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleSignup}
                            className="space-y-3"
                          >
                            <FloatField
                              label="Full name"
                              value={signName}
                              onChange={setSignName}
                              error={signErrors.name}
                              autoComplete="name"
                            />
                            <FloatField
                              label="Email address"
                              type="email"
                              value={signEmail}
                              onChange={setSignEmail}
                              error={signErrors.email}
                              autoComplete="email"
                            />
                            <FloatField
                              label="Password"
                              type={signShowPw ? 'text' : 'password'}
                              value={signPassword}
                              onChange={setSignPassword}
                              error={signErrors.password}
                              autoComplete="new-password"
                              rightSlot={
                                <button type="button" onClick={() => setSignShowPw(p => !p)}
                                  className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                                  {signShowPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                              }
                            />
                            <FloatField
                              label="Confirm password"
                              type="password"
                              value={signConfirm}
                              onChange={setSignConfirm}
                              error={signErrors.confirm}
                              autoComplete="new-password"
                            />

                            {/* Terms */}
                            <div>
                              <label className={`flex items-start gap-3 cursor-pointer group ${signErrors.terms ? 'text-red-400' : ''}`}>
                                <div
                                  onClick={() => setSignTerms(p => !p)}
                                  className={`mt-0.5 w-4 h-4 rounded-md border flex-shrink-0 flex items-center justify-center transition-all duration-200 cursor-pointer
                                    ${signTerms
                                      ? 'bg-[#1DB954] border-[#1DB954]'
                                      : signErrors.terms
                                        ? 'border-red-500/60 bg-transparent'
                                        : 'border-white/20 bg-transparent group-hover:border-white/40'
                                    }`}
                                >
                                  {signTerms && (
                                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                      <path d="M1 3L3.5 5.5L8 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                </div>
                                <span className="text-xs text-zinc-500 leading-relaxed" onClick={() => setSignTerms(p => !p)}>
                                  I agree to the{' '}
                                  <span className="text-[#1DB954] font-semibold">Terms of Service</span>
                                  {' '}and{' '}
                                  <span className="text-[#1DB954] font-semibold">Privacy Policy</span>
                                </span>
                              </label>
                              {signErrors.terms && (
                                <p className="mt-1 ml-7 text-[11px] text-red-400">{signErrors.terms}</p>
                              )}
                            </div>

                            {globalError && (
                              <motion.p
                                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                className="text-xs text-red-400 flex items-center gap-1.5 px-1"
                              >
                                <AlertCircle size={12} /> {globalError}
                              </motion.p>
                            )}

                            <button
                              type="submit"
                              disabled={status === 'loading'}
                              className="w-full py-3 rounded-2xl bg-[#1DB954] text-black font-display font-bold text-sm
                                         hover:bg-[#1ed760] active:scale-95 transition-all duration-200 cursor-pointer
                                         disabled:opacity-60 disabled:cursor-not-allowed
                                         shadow-[0_0_24px_rgba(29,185,84,0.25)] hover:shadow-[0_0_32px_rgba(29,185,84,0.4)]
                                         flex items-center justify-center gap-2 mt-1"
                            >
                              {status === 'loading' ? (
                                <span className="flex items-center gap-2">
                                  <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                                  Creating account…
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">Create Account <ArrowRight size={15} /></span>
                              )}
                            </button>

                            <p className="text-center text-xs text-zinc-600 pt-1">
                              Already have an account?{' '}
                              <button type="button" onClick={() => switchTab('login')}
                                className="text-[#1DB954] hover:text-[#1ed760] font-semibold cursor-pointer">
                                Sign in
                              </button>
                            </p>
                          </motion.form>
                        ) : tab === 'forgot' ? (
                          <motion.form
                            key="forgot-form"
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -12 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleForgotSubmit}
                            className="space-y-4"
                          >
                            <FloatField
                              label="Email address"
                              type="email"
                              value={forgotEmail}
                              onChange={setForgotEmail}
                              error={forgotError}
                              autoComplete="email"
                            />

                            <button
                              type="submit"
                              disabled={status === 'loading'}
                              className="w-full py-3 rounded-2xl bg-[#1DB954] text-black font-display font-bold text-sm
                                         hover:bg-[#1ed760] active:scale-95 transition-all duration-200 cursor-pointer
                                         disabled:opacity-60 disabled:cursor-not-allowed
                                         shadow-[0_0_24px_rgba(29,185,84,0.25)] hover:shadow-[0_0_32px_rgba(29,185,84,0.4)]
                                         flex items-center justify-center gap-2 mt-2"
                            >
                              {status === 'loading' ? (
                                <span className="flex items-center gap-2">
                                  <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                                  Verifying email…
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">Verify Email <ArrowRight size={15} /></span>
                              )}
                            </button>

                            <p className="text-center text-xs text-zinc-600 pt-1">
                              Remember your password?{' '}
                              <button type="button" onClick={() => switchTab('login')}
                                className="text-[#1DB954] hover:text-[#1ed760] font-semibold cursor-pointer">
                                Back to Sign In
                              </button>
                            </p>
                          </motion.form>
                        ) : (
                          <motion.form
                            key="reset-new-form"
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -12 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={handleResetNewSubmit}
                            className="space-y-3"
                          >
                            <FloatField
                              label="New Password"
                              type="password"
                              value={newPassword}
                              onChange={setNewPassword}
                              error={resetErrors.password}
                              autoComplete="new-password"
                            />
                            <FloatField
                              label="Confirm New Password"
                              type="password"
                              value={confirmNewPassword}
                              onChange={setConfirmNewPassword}
                              error={resetErrors.confirm}
                              autoComplete="new-password"
                            />

                            {globalError && (
                              <p className="text-xs text-red-400 flex items-center gap-1.5 px-1">
                                <AlertCircle size={12} /> {globalError}
                              </p>
                            )}

                            <button
                              type="submit"
                              disabled={status === 'loading'}
                              className="w-full py-3 rounded-2xl bg-[#1DB954] text-black font-display font-bold text-sm
                                         hover:bg-[#1ed760] active:scale-95 transition-all duration-200 cursor-pointer
                                         disabled:opacity-60 disabled:cursor-not-allowed
                                         shadow-[0_0_24px_rgba(29,185,84,0.25)] hover:shadow-[0_0_32px_rgba(29,185,84,0.4)]
                                         flex items-center justify-center gap-2 mt-2"
                            >
                              {status === 'loading' ? (
                                <span className="flex items-center gap-2">
                                  <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                                  Updating password…
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">Update Password <ArrowRight size={15} /></span>
                              )}
                            </button>
                          </motion.form>
                        )}
                      </AnimatePresence>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
