import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshReflectorMaterial, useGLTF } from '@react-three/drei';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowDown, Zap, TrendingUp, Clock, Users } from 'lucide-react';
import * as THREE from 'three';
import { useTheme } from '../contexts/ThemeContext';

// ── Staggered word entrance + persistent CSS effects ─────────
const AnimatedHeadline = ({ text, className, delay = 0 }) => {
  const words = text.split(' ');
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: delay } } }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="inline-block mr-[0.22em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Silver shimmer version — same entrance, uses CSS class for the persistent shimmer
const SilverHeadline = ({ text, className, delay = 0 }) => {
  const words = text.split(' ');
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: delay } } }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
          }}
          className="hero-silver-text inline-block mr-[0.22em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};


// 🏙️ CYBER CITY — optimised (shared geometry, instanced-style manual batching)
const CyberCity = ({ surgeMultiplier }) => {
  const cityRef = useRef();
  const neonColors = ['#00f3ff', '#ff00ff', '#1DB954', '#7C3AED', '#f97316'];

  // Generate buildings ONCE — fewer objects, shared materials
  const buildings = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const x = side * (Math.random() * 35 + 14);
      const z = -(Math.random() * 150);
      const height = Math.random() * 38 + 12;
      const width = Math.random() * 7 + 4;
      const depth = Math.random() * 7 + 4;
      const neonColor = neonColors[Math.floor(Math.random() * neonColors.length)];
      const hasNeon = Math.random() > 0.25;
      arr.push({ x, y: height / 2 - 0.5, z, width, height, depth, neonColor, hasNeon });
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!cityRef.current) return;
    const speed = 12 + (surgeMultiplier - 1) * 18;
    cityRef.current.position.z += speed * delta;
    if (cityRef.current.position.z > 75) cityRef.current.position.z -= 75;
  });

  return (
    <group ref={cityRef}>
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.y, b.z]}>
          {/* Building body */}
          <mesh>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial color="#080808" roughness={0.15} metalness={0.95} />
          </mesh>
          {/* Neon wireframe edge glow */}
          {b.hasNeon && (
            <mesh>
              <boxGeometry args={[b.width + 0.08, b.height + 0.08, b.depth + 0.08]} />
              <meshBasicMaterial color={b.neonColor} wireframe transparent opacity={0.25} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};

// 🛣️ ROAD ONLY (streetlights + buildings disabled for performance)
const CyberRoad = ({ surgeMultiplier }) => {
  const envRef = useRef();

  useFrame((_, delta) => {
    if (!envRef.current) return;
    const speed = 12 + (surgeMultiplier - 1) * 18;
    envRef.current.position.z += speed * delta;
    if (envRef.current.position.z > 75) envRef.current.position.z -= 75;
  });

  return (
    <group ref={envRef} position={[0, -0.49, -20]}>
      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -60]}>
        <planeGeometry args={[10, 240]} />
        <meshStandardMaterial color="#0e0e10" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Cyber ground flanks */}
      <mesh position={[-28, -0.02, -60]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[46, 240]} />
        <meshStandardMaterial color="#04050a" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[28, -0.02, -60]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[46, 240]} />
        <meshStandardMaterial color="#04050a" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Glowing neon road edges */}
      <mesh position={[-4.8, 0.01, -60]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.18, 240]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[4.8, 0.01, -60]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.18, 240]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.7} />
      </mesh>

      {/* Dashed center lane */}
      {Array.from({ length: 50 }, (_, i) => (
        <mesh key={i} position={[0, 0.015, -145 + i * 4.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.14, 1.8]} />
          <meshBasicMaterial color="#1DB954" transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
};

// 🚗 CAR MODEL
const RealCarModel = ({ surgeMultiplier, theme }) => {
  const { scene } = useGLTF('/my-futuristic-concept-car/source/base_basic_pbr.glb');
  const groupRef = useRef();
  const carWrapperRef = useRef();

  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.color.set(theme === 'taxi' ? '#FBBF24' : '#ffffff');
        child.material.roughness = theme === 'taxi' ? 0.2 : 0.1;
        child.material.metalness = theme === 'taxi' ? 0.5 : 0.8;
      }
    });
  }, [scene, theme]);

  useFrame((state) => {
    const scrollZ = THREE.MathUtils.clamp(window.scrollY * 0.014, 0, 8);
    const targetY = (state.pointer.x * Math.PI) / 9;
    const targetX = -(state.pointer.y * Math.PI) / 28;
    if (groupRef.current) {
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, scrollZ, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.08);
    }
    if (carWrapperRef.current) {
      carWrapperRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.018 + Math.sin(state.clock.elapsedTime * 0.7) * 0.012;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={carWrapperRef}>
        <primitive object={scene} scale={2.5} position={[0, 0, 0]} rotation={[0, -Math.PI, 0]} />
      </group>
    </group>
  );
};

// ── STAT PANEL COMPONENT ─────────────────────────────────────
const StatPanel = ({ title, value, icon: Icon, color, delay, side = 'left' }) => (
  <motion.div
    initial={{ opacity: 0, x: side === 'left' ? -30 : 30, filter: 'blur(10px)' }}
    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
    className="flex items-center gap-5 w-64 px-6 py-5 rounded-[2rem] border border-white/10 bg-[#121212]/40 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] pointer-events-auto"
  >
    <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <div className="text-[10px] text-[#888] uppercase tracking-[0.2em] font-semibold mb-1">{title}</div>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
          className="text-white font-display font-bold text-2xl tracking-tight"
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  </motion.div>
);

// ── MAIN HERO ─────────────────────────────────────────────────
export const HeroSection = ({ surgeMultiplier = 1 }) => {
  const { theme } = useTheme();
  const heroRef = useRef(null);

  // Fake live data updates
  const [liveData, setLiveData] = useState({
    surge: "1.8",
    demand: "High",
    wait: 2,
    riders: 342
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => {
        const newSurge = (Math.random() * 1.5 + 1.0).toFixed(1);
        return {
          surge: newSurge,
          demand: newSurge > 2.0 ? "Peak" : newSurge > 1.5 ? "High" : "Normal",
          wait: Math.floor(Math.random() * 8) + 1,
          riders: Math.floor(Math.random() * 200) + 200
        };
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Hero-scoped scroll — 0 at top, 1 when hero scrolls out
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven exit: text fades out, moves up, scales down, blurs
  const textY       = useTransform(heroScroll, [0, 0.5], [0, -120]);
  const textOpacity = useTransform(heroScroll, [0, 0.4], [1, 0]);
  const scaleDown   = useTransform(heroScroll, [0, 0.4], [1, 0.88]);
  const rawBlur     = useTransform(heroScroll, [0, 0.35], [0, 16]);
  const blurFilter  = useTransform(rawBlur, (v) => `blur(${v}px)`);

  // Smooth spring for Y movement
  const smoothY = useSpring(textY, { stiffness: 100, damping: 25 });

  return (
    <section ref={heroRef} className="relative w-full h-[120vh] flex flex-col items-center justify-start overflow-visible bg-[#121212]">

      {/* ── 3D CANVAS ── */}
      <div className="sticky top-0 w-full h-screen z-0">
        <Canvas
          camera={{ position: [0, 3, 9], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: 'high-performance' }}
          performance={{ min: 0.5 }}
        >
          <ambientLight intensity={0.15} />
          <directionalLight position={[8, 18, 8]} intensity={1.2} color="#c8d8ff" />
          <pointLight position={[0, -1, 3]} color="#00f3ff" intensity={1.5} distance={12} decay={2} />
          <pointLight position={[0, -1, 3]} color="#1DB954" intensity={0.8} distance={10} decay={2} />

          <RealCarModel surgeMultiplier={surgeMultiplier} theme={theme} />
          <CyberRoad surgeMultiplier={surgeMultiplier} />
          {/* Buildings removed for performance — re-enable when optimised */}
          {/* <CyberCity surgeMultiplier={surgeMultiplier} /> */}

          <Environment preset="night" />

          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <MeshReflectorMaterial
              blur={[250, 60]}
              resolution={512}
              mixBlur={1.2}
              mixStrength={35}
              roughness={0.7}
              depthScale={1}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#0a0a0a"
              metalness={0.8}
            />
          </mesh>

          <fog attach="fog" args={['#121212', 18, 65]} />
        </Canvas>
      </div>

      {/* ── TEXT OVERLAY — visible on load, fades out on scroll ── */}
      <motion.div
        className="absolute top-[18vh] z-10 w-full text-center px-4 pointer-events-none flex flex-col items-center"
        style={{ y: smoothY, opacity: textOpacity, scale: scaleDown, filter: blurFilter }}
      >
        {/* Eyebrow label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#1DB954]/40 bg-[#1DB954]/10 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
          <span className="text-[#1DB954] text-sm font-semibold tracking-widest uppercase">Live Surge System</span>
        </motion.div>

        {/* Headlines — appear with staggered entrance, persistent shimmer/glow */}
        <AnimatedHeadline
          text="Pricing that"
          delay={0.15}
          className="hero-title-breathe text-6xl md:text-8xl lg:text-[8.5rem] font-display font-extrabold tracking-tighter text-white leading-[1.05]"
        />
        <SilverHeadline
          text="adapts in real time."
          delay={0.35}
          className="text-6xl md:text-8xl lg:text-[8.5rem] font-display font-extrabold tracking-tighter leading-[1.05] mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
          className="hero-float text-lg md:text-2xl text-[#B3B3B3] font-body max-w-2xl mx-auto font-medium tracking-tight mb-10"
        >
          Experience intelligent fare calculation powered by real‑world demand signals.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.95 }}
          whileHover={{ scale: 1.06, boxShadow: '0 0 50px rgba(29,185,84,0.5)' }}
          whileTap={{ scale: 0.96 }}
          className="px-11 py-4 bg-[#1DB954] text-black rounded-full font-display font-bold text-xl tracking-tight hover:bg-[#1ed760] pointer-events-auto shadow-[0_0_30px_rgba(29,185,84,0.25)] transition-colors mb-12"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          Check Live Prices
        </motion.button>

        {/* ── LEFT PANEL ── */}
        <div className="absolute left-8 lg:left-12 top-0 hidden xl:flex flex-col gap-4 pointer-events-auto text-left">
          <StatPanel title="Current Surge" value={`×${liveData.surge}`} icon={Zap} color="text-[#1DB954]" delay={1.0} side="left" />
          <StatPanel title="Demand Index" value={liveData.demand} icon={TrendingUp} color="text-[#F59E0B]" delay={1.1} side="left" />
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="absolute right-8 lg:right-12 top-0 hidden xl:flex flex-col gap-4 pointer-events-auto text-left">
          <StatPanel title="Est. Wait Time" value={`${liveData.wait} min`} icon={Clock} color="text-[#00f3ff]" delay={1.2} side="right" />
          <StatPanel title="Active Riders" value={liveData.riders} icon={Users} color="text-[#EF4444]" delay={1.3} side="right" />
        </div>
      </motion.div>

      {/* ── SCROLL HINT ── */}
      <motion.div
        className="absolute bottom-8 z-10 w-full flex flex-col items-center gap-2 text-[#B3B3B3] pointer-events-none"
        style={{ opacity: textOpacity }}
      >
        <motion.span
          className="text-xs font-semibold tracking-[0.25em] uppercase"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        >
          Scroll to drive
        </motion.span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>

      {/* ── BOTTOM FADE ── */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#121212] via-[#121212]/10 to-transparent z-[1]" />
    </section>
  );
};
