import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Globe, ExternalLink, Mail } from 'lucide-react';

const footerLinks = [
  { label: 'Platform',  href: '#' },
  { label: 'API Docs',  href: '#' },
  { label: 'Pricing',   href: '#' },
  { label: 'Privacy',   href: '#' },
];

const socials = [
  { icon: Globe,        href: '#', label: 'Website'  },
  { icon: ExternalLink, href: '#', label: 'Docs'     },
  { icon: Mail,         href: '#', label: 'Contact'  },
];

export const Footer = () => {
  return (
    <footer className="relative w-full bg-[#0a0a0a] overflow-hidden pt-16 pb-10">

      {/* Top neon border */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#1DB954] to-transparent opacity-60" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-48
                      rounded-full bg-[#1DB954]/8 blur-3xl" />

      <div className="max-w-6xl mx-auto px-6">

        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-lg bg-[#1DB954] flex items-center justify-center">
                <Zap size={14} className="text-black" strokeWidth={2.5} />
              </span>
              <h2 className="text-2xl font-display font-bold text-black dark:text-white tracking-tight">
                Surge<span className="text-gradient">IQ</span>
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-[#B3B3B3] font-body max-w-xs leading-relaxed">
              Intelligence-driven pricing engine that adapts to real-world demand in real time.
            </p>
          </motion.div>

          {/* Links */}
          <motion.nav
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="flex flex-wrap gap-6"
          >
            {footerLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-gray-600 dark:text-[#B3B3B3] font-body hover:text-[#1DB954] transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </motion.nav>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex gap-3"
          >
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-center
                           text-gray-600 dark:text-[#B3B3B3] hover:text-[#1DB954] hover:border-[#1DB954]/40 hover:bg-[#1DB954]/10
                           transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-black/5 dark:bg-white/5 mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#555] font-body">
          <span>© {new Date().getFullYear()} SurgeIQ. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built with
            <span className="text-[#1DB954]">♥</span>
            for intelligent mobility
          </span>
        </div>

      </div>
    </footer>
  );
};
