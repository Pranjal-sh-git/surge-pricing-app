import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mail, MapPin, Phone, MessageSquare,
  CheckCircle2, Zap, GitBranch, GitFork, Share2,
  ArrowRight, Sparkles, Clock, Globe
} from 'lucide-react';


// ── Inquiry categories with icons & accent colours ──────────────
const INQUIRIES = [
  { id: 'general',   label: 'General',   icon: MessageSquare, accent: '#1DB954', desc: 'Questions about SurgeIQ' },
  { id: 'api',       label: 'API / Dev',  icon: Zap,           accent: '#00f3ff', desc: 'Integration & technical queries' },
  { id: 'partner',   label: 'Partner',   icon: Sparkles,      accent: '#F59E0B', desc: 'Business & enterprise' },
  { id: 'support',   label: 'Support',   icon: Clock,         accent: '#EF4444', desc: 'Bug reports & help' },
];

// ── Floating-label input wrapper ────────────────────────────────
const FloatInput = ({ label, type = 'text', placeholder, required, multiline, rows = 4 }) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue]     = useState('');
  const active = focused || value.length > 0;

  const base =
    'w-full px-4 pt-5 pb-2 rounded-2xl bg-white/[0.03] border transition-all duration-300 ' +
    'text-white font-medium text-sm placeholder:text-transparent resize-none outline-none ' +
    (focused
      ? 'border-[#1DB954] ring-1 ring-[#1DB954]/25 shadow-[0_0_18px_rgba(29,185,84,0.08)] bg-white/[0.05]'
      : 'border-white/10 hover:border-white/20');

  return (
    <div className="relative group">
      {multiline ? (
        <textarea
          required={required}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={base}
        />
      ) : (
        <input
          required={required}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={base}
        />
      )}
      <label
        className={`absolute left-4 font-semibold pointer-events-none transition-all duration-200
          ${active
            ? 'top-1.5 text-[9px] uppercase tracking-widest ' + (focused ? 'text-[#1DB954]' : 'text-zinc-500')
            : 'top-3.5 text-sm text-zinc-500'
          }`}
      >
        {label}
      </label>
    </div>
  );
};

// ── Contact method card ─────────────────────────────────────────
const ContactCard = ({ icon: Icon, label, value, accent, href }) => (
  <a
    href={href || '#'}
    className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/8
               hover:border-white/15 hover:-translate-y-0.5 transition-all duration-300 group"
    style={{ '--accent': accent }}
  >
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
      style={{ background: `${accent}18`, border: `1px solid ${accent}30`, color: accent }}
    >
      <Icon size={17} strokeWidth={2} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">{label}</p>
      <p className="text-white font-semibold text-sm truncate">{value}</p>
    </div>
    <ArrowRight
      size={14}
      className="ml-auto text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
    />
  </a>
);

// ── Main component ──────────────────────────────────────────────
export const ContactSection = () => {
  const [formState,      setFormState]      = useState('idle'); // idle | sending | success
  const [activeInquiry,  setActiveInquiry]  = useState('general');

  const current = INQUIRIES.find(i => i.id === activeInquiry);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('sending');
    setTimeout(() => {
      setFormState('success');
      setTimeout(() => setFormState('idle'), 3500);
    }, 1600);
  };

  return (
    <section
      id="contact"
      className="relative w-full py-14 lg:py-16 px-6 lg:px-8 overflow-hidden bg-[#121212] scroll-mt-16"
    >
      {/* ── Background ── */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="absolute top-[-15%] right-[-15%] w-[700px] h-[700px] bg-[#1DB954]/12 rounded-full blur-[130px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-15%] left-[-15%] w-[700px] h-[700px] bg-[#00f3ff]/10 rounded-full blur-[130px] -z-10 animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="max-w-6xl mx-auto w-full relative z-10">

        {/* ── Section header ── */}
        <div className="text-center mb-7 lg:mb-9">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 mb-3 px-4 py-1 rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] animate-ping" />
            <span className="text-[#1DB954] text-[10px] font-bold uppercase tracking-[0.2em]">Get in Touch</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tighter text-white mb-2"
          >
            Let's <span className="text-gradient drop-shadow-[0_0_24px_rgba(29,185,84,0.25)]">Connect.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-[#B3B3B3] text-xs md:text-sm max-w-xl mx-auto font-body leading-relaxed"
          >
            Whether you're exploring our surge model, integrating our API, or proposing a partnership —
            we respond within one business day.
          </motion.p>
        </div>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-start">

          {/* ── LEFT: Contact details ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 space-y-3"
          >
            {/* Contact method cards */}
            <div className="space-y-2">
              <ContactCard icon={Mail}   label="Email"    value="contact@surgeiq.ai"   accent="#1DB954" href="mailto:contact@surgeiq.ai" />
              <ContactCard icon={Phone}  label="Phone"    value="+91 98765 43210"       accent="#00f3ff" href="tel:+919876543210" />
              <ContactCard icon={Globe}  label="Web"      value="surgeiq.ai"            accent="#F59E0B" href="#/" />
              <ContactCard icon={MapPin} label="Based in" value="Bangalore, India 🇮🇳" accent="#EF4444" />
            </div>

            {/* Social links */}
            <div className="">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-2">Follow us</p>
              <div className="flex items-center gap-2">
                {[
                  { icon: GitBranch, label: 'GitHub',   href: '#', color: '#e2e8f0' },
                  { icon: GitFork,   label: 'Twitter',  href: '#', color: '#1d9bf0' },
                  { icon: Share2,    label: 'LinkedIn', href: '#', color: '#0077b5' },
                ].map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center
                               text-zinc-500 hover:-translate-y-1 transition-all duration-300"
                    style={{ '--hover-color': color }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.color = color; e.currentTarget.style.boxShadow = `0 0 20px ${color}18`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; e.currentTarget.style.boxShadow = ''; }}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            </div>

            {/* Enterprise CTA */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1DB954]/12 via-white/[0.02] to-transparent border border-[#1DB954]/20 space-y-2.5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#1DB954] mb-0.5">Enterprise</p>
                <h3 className="text-white font-bold text-sm leading-snug">Ready to power your fleet with SurgeIQ?</h3>
                <p className="text-zinc-500 text-[11px] leading-relaxed">Get API access, custom model tuning, and dedicated support.</p>
              </div>
              <button
                onClick={() => setActiveInquiry('partner')}
                className="inline-flex items-center gap-2 bg-[#1DB954] text-black text-xs font-black px-5 py-2.5 rounded-full
                           hover:bg-[#1ed760] hover:scale-105 active:scale-95 transition-all duration-200
                           shadow-[0_0_20px_rgba(29,185,84,0.25)] cursor-pointer"
              >
                Contact Sales <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>

          {/* ── RIGHT: Contact form ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-3xl bg-[#181818]/60 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl">

              {/* Subtle top glow line */}
              <div
                className="absolute top-0 left-0 right-0 h-px transition-all duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${current.accent}80, transparent)` }}
              />

              <div className="p-5 lg:p-6 space-y-4">

                {/* ── Inquiry type tabs ── */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">What can we help with?</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {INQUIRIES.map(({ id, label, icon: Icon, accent }) => {
                      const isActive = activeInquiry === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setActiveInquiry(id)}
                          className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-center transition-all duration-250 cursor-pointer
                            ${isActive
                              ? 'border-transparent bg-white/[0.06]'
                              : 'border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15'
                            }`}
                          style={isActive ? { boxShadow: `0 0 20px ${accent}20, inset 0 0 20px ${accent}08` } : {}}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="inquiry-pill"
                              className="absolute inset-0 rounded-2xl border"
                              style={{ borderColor: `${accent}50` }}
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          )}
                          <Icon size={16} style={{ color: isActive ? accent : '#666' }} className="transition-colors duration-200" />
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 relative z-10"
                            style={{ color: isActive ? accent : '#666' }}
                          >
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={activeInquiry}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs text-zinc-500 mt-2 font-medium"
                    >
                      {current.desc}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* ── Form ── */}
                <AnimatePresence mode="wait">
                  {formState === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="py-10 flex flex-col items-center gap-4 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#1DB954]/15 border border-[#1DB954]/30 flex items-center justify-center">
                        <CheckCircle2 size={32} className="text-[#1DB954]" />
                      </div>
                      <div>
                        <h3 className="text-white font-display font-bold text-xl mb-1">Message sent!</h3>
                        <p className="text-zinc-400 text-sm">We'll get back to you within one business day.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-3"
                    >
                      {/* Name + Email row */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <FloatInput label="Your Name"      placeholder="Pranjal Sharma" required />
                        <FloatInput label="Email Address"  placeholder="you@example.com" type="email" required />
                      </div>

                      {/* Subject */}
                      <FloatInput label="Subject" placeholder="e.g. API Integration Help" />

                      {/* Message */}
                      <FloatInput label="Your Message" placeholder="Tell us more…" multiline rows={2} required />

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={formState !== 'idle'}
                        className="relative w-full py-3 rounded-2xl font-display font-bold text-sm tracking-tight
                                   transition-all duration-300 flex items-center justify-center gap-2.5 overflow-hidden
                                   bg-[#1DB954] text-black hover:bg-[#1ed760]
                                   shadow-[0_0_30px_rgba(29,185,84,0.25)] hover:shadow-[0_0_40px_rgba(29,185,84,0.4)]
                                   hover:scale-[1.015] active:scale-[0.985] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {formState === 'idle' && (
                          <>
                            Send Message
                            <Send size={16} strokeWidth={2.5} />
                          </>
                        )}
                        {formState === 'sending' && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-black/25 border-t-black rounded-full"
                          />
                        )}
                      </button>

                      <p className="text-center text-[10px] text-zinc-600 font-medium">
                        No spam, ever. We only use your info to reply to your message.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
