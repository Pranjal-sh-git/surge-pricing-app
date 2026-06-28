import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Zap } from 'lucide-react';
import { useSurgeCalculation } from './hooks/useSurgeCalculation';
import { CustomCursor } from './components/CustomCursor';
import { HeroSection } from './components/HeroSection';
import { ScrollStory } from './components/ScrollStory';
import { RideAppUI } from './components/RideAppUI';
import { ContactSection } from './components/ContactSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { useTheme } from './contexts/ThemeContext';
import ModelInsights from './components/ModelInsights';
import { NotFound } from './components/NotFound';
import { AuthModal } from './components/AuthModal';
import { AccountButton } from './components/AccountButton';
import { UserProfile } from './components/UserProfile';
import { RideHistory } from './components/RideHistory';
import { useAuth } from './contexts/AuthContext';
import { AuthorProfile } from './components/AuthorProfile';



// ── Apple-style glass navbar ──────────────────────────────────
const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'story', label: 'How It Works' },
  { id: 'model-insights', label: 'Model Insights' },
  { id: 'ride', label: 'Plan Journey' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

const GlassNavbar = ({ onOpenAuth }) => {
  const [activeId, setActiveId] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 60);
    if (window.location.hash.startsWith('#/')) {
      setActiveId(null);
      return;
    }
    const viewportCenter = window.innerHeight / 3;
    let currentId = 'hero';
    for (const item of navItems) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= viewportCenter && rect.bottom > 0) {
        currentId = item.id;
      }
    }
    setActiveId(currentId);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash.startsWith('#/')) {
        setActiveId(null);
      } else {
        handleScroll();
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [handleScroll]);

  const scrollTo = (id) => {
    if (window.location.hash.startsWith('#/')) {
      window.location.hash = `#${id}`;
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      <div
        className={`flex items-center gap-1 px-2 py-2 rounded-2xl border transition-all duration-500
          ${scrolled
            ? 'bg-[#0a0a0a]/70 backdrop-blur-2xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
            : 'bg-[#0a0a0a]/40 backdrop-blur-xl border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
          }`}
      >
        {/* Brand icon */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 mr-1 cursor-pointer"
          onClick={() => scrollTo('hero')}
        >
          <span className="w-6 h-6 rounded-lg bg-[#1DB954] flex items-center justify-center">
            <Zap size={12} className="text-black" strokeWidth={2.5} />
          </span>
          <span className="text-sm font-display font-bold text-white tracking-tight hidden sm:inline">
            Surge<span className="text-[#1DB954]">IQ</span>
          </span>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-5 bg-white/10 mr-1" />

        {/* Nav items */}
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`relative px-4 py-1.5 rounded-xl text-[13px] font-medium tracking-tight transition-all duration-300 cursor-pointer whitespace-nowrap
              ${activeId === item.id
                ? 'text-white'
                : 'text-[#888] hover:text-white/80'
              }`}
          >
            {activeId === item.id && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-xl bg-white/10 border border-white/5"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}

        {/* ── Account button — separated by a subtle divider ── */}
        <div className="w-[1px] h-5 bg-white/10 mx-1" />
        <AccountButton onOpenAuth={onOpenAuth} />
      </div>
    </motion.nav>
  );
};


// ── Back-to-top button ────────────────────────────────────────
const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollTop}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-50 w-12 h-12 flex items-center justify-center
                     rounded-full bg-[#1DB954] text-black shadow-[0_0_24px_rgba(29,185,84,0.5)]
                     hover:bg-[#1ed760] hover:scale-110 active:scale-95 transition-colors cursor-pointer"
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

function App() {
  const { user } = useAuth();

  const {
    demand, setDemand,
    supply, setSupply,
    distance, setDistance,
    pickupCoords, dropoffCoords,
    pickupAddress, dropoffAddress,
    updateCoordinates,
    surgeMultiplier, totalFare, baseFare, ratePerKm,
    loading, error,
    weather, simulateRain, setSimulateRain,
    fetchSurgeEstimate,
    cabType, setCabType,
    rideTier, setRideTier,
    // Multi-modal
    activeMode, setActiveMode,
    trainFare, trainEta, trainSurge,
    flightFare, flightEta, flightSurge,
  } = useSurgeCalculation();

  const { theme } = useTheme();

  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash;
    if (hash === '#/profile') return 'profile';
    if (hash === '#/ride-history') return 'ride-history';
    if (hash.startsWith('#/author/')) return 'author-profile';
    if (hash === '#/404') return '404';
    
    const clean = hash.replace(/^#\/?/, '');
    const isHomeSection = ['hero', 'story', 'model-insights', 'ride', 'about', 'contact', 'footer'].includes(clean);
    if (hash && hash !== '#/' && !isHomeSection) {
      return '404';
    }
    return 'home';
  });

  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash;
      setHash(currentHash);

      let route = 'home';
      if (currentHash === '#/profile') {
        route = 'profile';
      } else if (currentHash === '#/ride-history') {
        route = 'ride-history';
      } else if (currentHash.startsWith('#/author/')) {
        route = 'author-profile';
      } else if (currentHash === '#/404') {
        route = '404';
      } else {
        const clean = currentHash.replace(/^#\/?/, '');
        const isHomeSection = ['hero', 'story', 'model-insights', 'ride', 'about', 'contact', 'footer'].includes(clean);
        if (currentHash && currentHash !== '#/' && !isHomeSection) {
          route = '404';
        }
      }
      setCurrentRoute(route);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Redirection for guests trying to access auth-restricted routes
  useEffect(() => {
    if ((currentRoute === 'profile' || currentRoute === 'ride-history') && !user) {
      window.location.hash = '#/';
      setShowAuthModal(true);
    }
  }, [currentRoute, user]);

  useEffect(() => {
    if (currentRoute === 'home' && hash && hash !== '#/') {
      const targetId = hash.replace(/^#\/?/, '');
      const scrollToSection = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };

      const t1 = setTimeout(scrollToSection, 150);
      const t2 = setTimeout(scrollToSection, 600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [currentRoute, hash]);

  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen text-white font-body bg-[#121212] relative overflow-x-hidden">
      <CustomCursor />
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      {currentRoute === 'home' && <GlassNavbar onOpenAuth={() => setShowAuthModal(true)} />}
      {currentRoute === 'home' && <BackToTop />}

      {/* Subtle static ambient orbs */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          background:
            'radial-gradient(circle at 25% 15%, rgba(29,185,84,0.12) 0%, transparent 45%), ' +
            'radial-gradient(circle at 80% 80%, rgba(0,243,255,0.07) 0%, transparent 45%)',
        }}
      />

      <div className="relative z-10">
        {/* Landing Page Content: remains mounted in the background */}
        <>
          {/* ── HERO ── */}
          <div id="hero">
            <HeroSection surgeMultiplier={surgeMultiplier} />
          </div>

          {/* ── Fade: Hero → Story ── */}
          <div className="relative h-32 -mt-32 z-30 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, #121212)' }} />

          {/* ── SCROLL STORY ── */}
          <div id="story">
            <ScrollStory />
          </div>

          {/* ── MODEL INSIGHTS ── */}
          <ModelInsights />

          {/* ── Fade: Story → Ride App ── */}
          <div className="h-24 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #121212, #0e0e0e)' }} />

          {/* ── PLAN JOURNEY (formerly "Get a Ride") ── */}
          <div id="ride">
            <RideAppUI
              demand={demand} setDemand={setDemand}
              supply={supply} setSupply={setSupply}
              distance={distance} setDistance={setDistance}
              pickupCoords={pickupCoords}
              dropoffCoords={dropoffCoords}
              pickupAddress={pickupAddress}
              dropoffAddress={dropoffAddress}
              updateCoordinates={updateCoordinates}
              surgeMultiplier={surgeMultiplier}
              totalFare={totalFare}
              baseFare={baseFare}
              ratePerKm={ratePerKm}
              loading={loading}
              error={error}
              weather={weather}
              simulateRain={simulateRain}
              setSimulateRain={setSimulateRain}
              fetchSurgeEstimate={fetchSurgeEstimate}
              cabType={cabType} setCabType={setCabType}
              rideTier={rideTier} setRideTier={setRideTier}
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              trainFare={trainFare}
              trainEta={trainEta}
              trainSurge={trainSurge}
              flightFare={flightFare}
              flightEta={flightEta}
              flightSurge={flightSurge}
            />
          </div>

          {/* ── Fade: Ride App → About ── */}
          <div className="h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #0e0e0e, #0c0c0c)' }} />

          {/* ── ABOUT US ── */}
          <AboutSection />

          {/* ── Fade: About → Contact ── */}
          <div className="h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #0c0c0c, #121212)' }} />

          {/* ── CONTACT ── */}
          <ContactSection />

          {/* ── Fade: Contact → Footer ── */}
          <div className="h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, #121212, #0a0a0a)' }} />

          {/* ── FOOTER ── */}
          <div id="footer">
            <Footer />
          </div>
        </>

        {/* ── Standalone subpages rendered as opaque fullscreen overlays ── */}
        {['profile', 'ride-history', 'author-profile', '404'].includes(currentRoute) && (
          <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#0a0a0a]">
            {currentRoute === 'profile' && <UserProfile />}
            {currentRoute === 'ride-history' && <RideHistory />}
            {currentRoute === 'author-profile' && <AuthorProfile />}
            {currentRoute === '404' && <NotFound />}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


