import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Code, Cpu, ArrowRight } from 'lucide-react';

const TEAM = [
  {
    name: 'Pranjal Sharma',
    role: 'Co-Founder & UI/ML Architect',
    bio: 'Designed and built the complete user interface, and fine-tuned the core predictive AI models.',
    initials: 'PS',
    gradient: 'from-[#1DB954] to-[#00f3ff]',
    glowColor: 'rgba(29, 185, 84, 0.4)',
    icon: Code,
    github: 'https://github.com/Pranjal-sh-git',
    linkedin: 'https://www.linkedin.com/in/pranjal-sharma-75123332a',
    email: 'mailto:work.pranjalsh@gmail.com',
    profileUrl: '#/author/pranjal-sharma'
  },
  {
    name: 'Parv Sood',
    role: 'Co-Founder & ML Engineer',
    bio: 'Developed the core machine learning pipeline, feature engineering, and training configurations.',
    initials: 'PS',
    gradient: 'from-[#00f3ff] to-[#3B82F6]',
    glowColor: 'rgba(0, 243, 255, 0.4)',
    icon: Cpu,
    github: '#',
    linkedin: '#',
    email: '#',
    profileUrl: '#/author/parv-sood'
  },
  {
    name: 'Pranjal Thakur',
    role: 'Co-Founder & Backend Developer',
    bio: 'Engineered the backend architecture, Flask API routes, and secure API gateway gateways.',
    initials: 'PT',
    gradient: 'from-[#F59E0B] to-[#EF4444]',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    icon: Shield,
    github: '#',
    linkedin: '#',
    email: '#',
    profileUrl: '#/author/pranjal-thakur'
  }
];

export const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative w-full py-16 lg:py-20 px-6 lg:px-8 overflow-hidden bg-[#0c0c0c] scroll-mt-16"
    >
      {/* Background cyber grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#1DB954]/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#00f3ff]/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-3 px-4 py-1 rounded-full border border-[#1DB954]/20 bg-[#1DB954]/5"
          >
            <span className="text-[#1DB954] text-[9px] font-mono font-bold uppercase tracking-[0.25em]">Who We Are</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tighter text-white mb-3"
          >
            Meet the <span className="text-gradient drop-shadow-[0_0_20px_rgba(29,185,84,0.15)]">Owners.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-zinc-500 max-w-2xl mx-auto text-xs sm:text-sm font-medium leading-relaxed"
          >
            SurgeIQ was engineered by a dedicated trio of developers and analysts aiming to solve dispatch latency and price anomalies in the Indian ride-sharing market.
          </motion.p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TEAM.map((member, index) => {
            const Icon = member.icon;
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="relative rounded-3xl bg-[#161616]/65 backdrop-blur-xl border border-white/5 p-6 flex flex-col justify-between overflow-hidden shadow-xl hover:border-white/10 transition-colors group"
                style={{
                  boxShadow: `0 10px 30px -15px rgba(0,0,0,0.7)`,
                }}
              >
                {/* Neon glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at top right, ${member.glowColor}, transparent 70%)`
                  }}
                />

                <div className="space-y-4 relative z-10">
                  {/* Top Row: Avatar Initials + Role Icon */}
                  <div className="flex items-center justify-between">
                    {/* Avatar circle */}
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.gradient} p-[1px] flex items-center justify-center`}
                      style={{
                        boxShadow: `0 0 20px -5px ${member.glowColor}`
                      }}
                    >
                      <div className="w-full h-full rounded-[15px] bg-[#121212] flex items-center justify-center text-white font-display font-black text-lg tracking-tight select-none">
                        {member.initials}
                      </div>
                    </div>

                    {/* Role Icon */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{
                        background: `rgba(255,255,255,0.02)`,
                        border: `1px solid rgba(255,255,255,0.04)`
                      }}
                    >
                      <Icon size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Member Name & Role */}
                  <div>
                    <h3 className="text-white font-bold text-lg font-display tracking-tight mb-0.5 group-hover:text-gradient transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                      {member.role}
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="text-zinc-400 text-xs leading-relaxed font-medium mb-1">
                    {member.bio}
                  </p>

                  {/* Know More Button */}
                  <div className="pt-1.5">
                    <a
                      href={member.profileUrl}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1DB954]/5 border border-[#1DB954]/20 hover:border-[#1DB954]/50 hover:bg-[#1DB954]/10 text-[11px] text-[#1DB954] hover:text-[#1ed760] font-bold tracking-tight transition-all duration-300 w-full justify-center group/btn cursor-pointer"
                    >
                      Know More About Author
                      <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Footer: Social Icons */}
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-white/5 relative z-10">
                  <a
                    href={member.github}
                    target={member.github !== '#' ? '_blank' : undefined}
                    rel={member.github !== '#' ? 'noopener noreferrer' : undefined}
                    className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.08-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.18 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                    </svg>
                  </a>
                  <a
                    href={member.linkedin}
                    target={member.linkedin !== '#' ? '_blank' : undefined}
                    rel={member.linkedin !== '#' ? 'noopener noreferrer' : undefined}
                    className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a
                    href={member.email !== '#' ? member.email : undefined}
                    className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
