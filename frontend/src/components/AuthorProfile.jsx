import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, CheckCircle } from 'lucide-react';

const AUTHOR_DATA = {
  'pranjal-sharma': {
    name: 'Pranjal Sharma',
    role: 'Co-Founder & UI/ML Architect',
    tagline: 'Bridging high-fidelity user experiences with real-time predictive systems.',
    bio: 'Pranjal Sharma is a Co-Founder and the Lead UI/ML Architect for SurgeIQ. He engineered the entire glassmorphic design system, high-contrast HUD layouts, and fluid frontend micro-interactions. Additionally, he fine-tuned the core XGBoost model hyperparameters for predicting dispatch rates and real-time ride costs.',
    skills: ['React & TailwindCSS', 'XGBoost Fine-tuning', 'Framer Motion', 'Hyperparameter Optimization', 'Figma UI/UX Design'],
    stats: [
      { label: 'UI Screens Built', value: '12+' },
      { label: 'Model Iterations', value: '45' },
      { label: 'Codebase Coverage', value: '88%' }
    ],
    github: 'https://github.com/Pranjal-sh-git',
    linkedin: 'https://www.linkedin.com/in/pranjal-sharma-75123332a',
    email: 'work.pranjalsh@gmail.com',
    gradient: 'from-[#1DB954] to-[#00f3ff]',
    glowColor: 'rgba(29, 185, 84, 0.4)',
    initials: 'PS'
  },
  'parv-sood': {
    name: 'Parv Sood',
    role: 'Co-Founder & ML Engineer',
    tagline: 'Architecting robust machine learning pipelines and streaming data inputs.',
    bio: 'Parv Sood is a Co-Founder and Lead Machine Learning Engineer. He developed the data cleaning routines, feature engineering pipelines, and trained the initial predictive pricing models. His work focuses on validating model predictions against live traffic conditions.',
    skills: ['Scikit-Learn', 'Data Feature Engineering', 'Model Testing & Evaluation', 'Python Data Pipelines', 'XGBoost Classifiers'],
    stats: [
      { label: 'Training Features', value: '24' },
      { label: 'Models Trained', value: '18' },
      { label: 'Accuracy Score', value: '94.2%' }
    ],
    github: '#',
    linkedin: '#',
    email: '#',
    gradient: 'from-[#00f3ff] to-[#3B82F6]',
    glowColor: 'rgba(0, 243, 255, 0.4)',
    initials: 'PS'
  },
  'pranjal-thakur': {
    name: 'Pranjal Thakur',
    role: 'Co-Founder & Backend Developer',
    tagline: 'Engineering scalable Flask servers and secure API gateways.',
    bio: 'Pranjal Thakur is a Co-Founder and Backend Engineer. He structured the Flask server routes, CORS request validation logic, API endpoints, and local user database persistence. He ensures that fare predictions resolve with sub-100ms response times.',
    skills: ['Flask (Python)', 'API Gateway Routing', 'JSON Web Tokens', 'Database Schemas', 'Cors Policy Configurations'],
    stats: [
      { label: 'API Endpoints', value: '8' },
      { label: 'Latency Rate', value: '<90ms' },
      { label: 'Server Up-time', value: '99.9%' }
    ],
    github: '#',
    linkedin: '#',
    email: '#',
    gradient: 'from-[#F59E0B] to-[#EF4444]',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    initials: 'PT'
  }
};

export const AuthorProfile = () => {
  const hash = window.location.hash;
  const slug = hash.split('/').pop() || 'pranjal-sharma';
  const author = AUTHOR_DATA[slug] || AUTHOR_DATA['pranjal-sharma'];

  const handleBack = () => {
    window.location.hash = '#about';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-16 px-6 lg:px-8 relative overflow-hidden flex items-center justify-center font-sans">
      {/* Background cyber grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      {/* Floating Ambient Glow */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${author.glowColor} 0%, transparent 70%)` }}
      />
      <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] bg-[#121212] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10">
        
        {/* Back navigation */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#1DB954] text-xs font-bold uppercase tracking-wider mb-8 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </button>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl bg-[#161616]/75 backdrop-blur-2xl border border-white/10 p-8 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Left Column: Avatar & Stats */}
            <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
              {/* Avatar circle */}
              <div
                className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${author.gradient} p-[1px] flex items-center justify-center`}
                style={{ boxShadow: `0 0 40px -10px ${author.glowColor}` }}
              >
                <div className="w-full h-full rounded-[23px] bg-[#121212] flex items-center justify-center text-white font-display font-black text-4xl select-none">
                  {author.initials}
                </div>
              </div>

              {/* Name & Title */}
              <div>
                <h1 className="text-2xl font-bold font-display text-white tracking-tight">{author.name}</h1>
                <p className="text-xs font-bold text-[#1DB954] font-mono uppercase tracking-wider mt-1">{author.role}</p>
              </div>

              {/* Stats Block */}
              <div className="w-full space-y-3 pt-4 border-t border-white/5">
                {author.stats.map(stat => (
                  <div key={stat.label} className="flex justify-between items-center bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{stat.label}</span>
                    <span className="text-sm font-black text-white">{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                {author.github !== '#' && (
                  <a
                    href={author.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.08-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.18 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                    </svg>
                  </a>
                )}
                {author.linkedin !== '#' && (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
                {author.email !== '#' && (
                  <a
                    href={`mailto:${author.email}`}
                    className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Bio & Core Skills */}
            <div className="md:col-span-8 space-y-8 flex flex-col justify-between">
              
              <div className="space-y-4">
                <h2 className="text-xl font-bold font-display text-white tracking-tight border-b border-white/5 pb-3">
                  Author Biography
                </h2>
                <p className="text-sm text-zinc-300 font-medium leading-relaxed font-body">
                  {author.bio}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu size={14} className="text-[#1DB954]" />
                  Key Skills &amp; Focus Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {author.skills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[10px] text-zinc-400 font-bold tracking-tight"
                    >
                      <CheckCircle size={10} className="text-[#1DB954] shrink-0" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
};
