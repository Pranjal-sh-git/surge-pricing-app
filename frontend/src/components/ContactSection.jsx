import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';

export const ContactSection = () => {
  const [formState, setFormState] = useState('idle'); // idle, sending, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('sending');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
      setTimeout(() => setFormState('idle'), 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="relative w-full py-24 lg:py-32 px-6 lg:px-8 overflow-hidden bg-[#121212] scroll-mt-24">
      {/* ── Background Elements ── */}
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.15]" 
        style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      
      {/* Vibrant Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#1DB954]/15 rounded-full blur-[140px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#00f3ff]/15 rounded-full blur-[140px] -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/[0.01] rounded-full blur-[160px] -z-10" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <div className="text-center mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10"
          >
            <MessageSquare size={14} className="text-[#1DB954]" />
            <span className="text-[#1DB954] text-[10px] font-bold uppercase tracking-[0.2em]">Contact Us</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-extrabold tracking-tighter text-white mb-3"
          >
            Get in <span className="text-gradient drop-shadow-[0_0_15px_rgba(29,185,84,0.3)]">Touch.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#B3B3B3] text-sm md:text-base max-w-2xl mx-auto font-body font-medium"
          >
            Have questions about our surge pricing model? Reach out to our team of data scientists and engineers.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4 lg:space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-3 lg:gap-4">
              {[
                { icon: Mail, label: 'Email Us', value: 'contact@surgeiq.ai', color: 'text-[#1DB954]' },
                { icon: Phone, label: 'Call Us', value: '+1 (555) 123-4567', color: 'text-[#00f3ff]' },
                { icon: MapPin, label: 'Location', value: 'Silicon Valley, CA', color: 'text-[#F59E0B]' },
                { icon: MessageSquare, label: 'Support', value: '24/7 Live Chat', color: 'text-[#EF4444]', glow: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]' },
              ].map((item, index) => (
                <div key={index} className={`p-4 rounded-3xl bg-[#181818]/80 border border-white/10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 ${item.glow || ''}`}>
                  <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-[#222] flex items-center justify-center mb-3 border border-white/5 group-hover:scale-110 transition-transform ${item.color}`}>
                    <item.icon size={18} />
                  </div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1" style={{ color: '#a1a1aa' }}>{item.label}</div>
                  <div className="text-white font-bold text-sm lg:text-base" style={{ color: '#ffffff' }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Enhanced Enterprise Box */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1DB954]/15 via-white/[0.02] to-transparent border border-white/10 flex items-center justify-between shadow-lg">
              <div>
                <h3 className="text-white font-bold text-base mb-1">Enterprise Solutions</h3>
                <p className="text-gray-400 text-xs font-medium">Power your network with SurgeIQ API.</p>
              </div>
              <button className="bg-[#1DB954] text-black text-xs font-black px-5 py-2.5 rounded-full hover:bg-[#1ed760] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(29,185,84,0.3)]">
                API DOCS <Send size={12} />
              </button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative p-5 lg:p-6 rounded-[2rem] bg-[#1a1a1a]/60 backdrop-blur-3xl border border-white/10 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
              <div className="grid md:grid-cols-2 gap-3 lg:gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Name</label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-[#1DB954]/50 focus:bg-white/[0.06] transition-all placeholder:text-gray-600 font-medium text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-[#1DB954]/50 focus:bg-white/[0.06] transition-all placeholder:text-gray-600 font-medium text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                <select className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-[#1DB954]/50 transition-all appearance-none cursor-pointer font-medium text-sm">
                  <option className="bg-[#1a1a1a]">General Inquiry</option>
                  <option className="bg-[#1a1a1a]">Partnership</option>
                  <option className="bg-[#1a1a1a]">Technical Support</option>
                  <option className="bg-[#1a1a1a]">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                <textarea
                  required
                  rows="2"
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-[#1DB954]/50 focus:bg-white/[0.06] transition-all placeholder:text-gray-600 resize-none font-medium text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formState !== 'idle'}
                className={`w-full py-3 mt-2 rounded-xl font-display font-bold text-sm tracking-tight transition-all flex items-center justify-center gap-2 shadow-xl
                  ${formState === 'success'
                    ? 'bg-[#1DB954] text-black'
                    : 'bg-white text-black hover:bg-[#1DB954] shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(29,185,84,0.3)]'
                  }
                `}
              >
                {formState === 'idle' && (
                  <>Send Signal <Send size={20} /></>
                )}
                {formState === 'sending' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full"
                  />
                )}
                {formState === 'success' && (
                  <>Sent Successfully <CheckCircle2 size={20} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
