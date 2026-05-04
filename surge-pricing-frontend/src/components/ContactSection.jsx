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
    <section id="contact" className="relative w-full py-24 px-4 overflow-hidden bg-[#121212]">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1DB954]/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00f3ff]/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
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
            className="text-4xl md:text-6xl font-display font-extrabold tracking-tighter text-white mb-6"
          >
            Get in <span className="text-gradient">Touch.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#888] text-lg max-w-2xl mx-auto font-body"
          >
            Have questions about our surge pricing model? Reach out to our team of data scientists and engineers.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Mail, label: 'Email Us', value: 'contact@surgeiq.ai', color: 'text-[#1DB954]' },
                { icon: Phone, label: 'Call Us', value: '+1 (555) 123-4567', color: 'text-[#00f3ff]' },
                { icon: MapPin, label: 'Location', value: 'Silicon Valley, CA', color: 'text-[#F59E0B]' },
                { icon: MessageSquare, label: 'Support', value: '24/7 Live Chat', color: 'text-[#EF4444]' },
              ].map((item, index) => (
                <div key={index} className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors group">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform ${item.color}`}>
                    <item.icon size={24} />
                  </div>
                  <div className="text-xs font-bold text-[#555] uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="text-white font-medium">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1DB954]/20 to-transparent border border-[#1DB954]/20">
              <h3 className="text-xl font-display font-bold text-white mb-4">Enterprise Solutions</h3>
              <p className="text-[#888] mb-6 font-body">
                Looking to integrate SurgeIQ into your own platform? We offer robust API solutions for high-scale ride-sharing networks.
              </p>
              <button className="text-[#1DB954] font-bold flex items-center gap-2 hover:gap-3 transition-all">
                View API Documentation <Send size={16} />
              </button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative p-8 md:p-12 rounded-[2.5rem] bg-[#1a1a1a]/50 backdrop-blur-3xl border border-white/10 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#888] uppercase tracking-widest ml-1">Name</label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#1DB954]/50 transition-colors placeholder:text-[#444]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#888] uppercase tracking-widest ml-1">Email</label>
                  <input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#1DB954]/50 transition-colors placeholder:text-[#444]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#888] uppercase tracking-widest ml-1">Subject</label>
                <select className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#1DB954]/50 transition-colors appearance-none cursor-pointer">
                  <option className="bg-[#1a1a1a]">General Inquiry</option>
                  <option className="bg-[#1a1a1a]">Partnership</option>
                  <option className="bg-[#1a1a1a]">Technical Support</option>
                  <option className="bg-[#1a1a1a]">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#888] uppercase tracking-widest ml-1">Message</label>
                <textarea
                  required
                  rows="4"
                  placeholder="How can we help you?"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#1DB954]/50 transition-colors placeholder:text-[#444] resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formState !== 'idle'}
                className={`w-full py-5 rounded-2xl font-display font-bold text-lg tracking-tight transition-all flex items-center justify-center gap-3
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
