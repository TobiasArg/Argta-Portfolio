import CyberneticGridShader from "@/components/ui/cybernetic-grid-shader";
import PathAnimation from "@/components/ui/svg-path-drawing-text-animation";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { GitHubCalendar } from 'react-github-calendar';

const ConstructedText = ({ text, className, delayOffset = 0 }: { text: string; className?: string; delayOffset?: number }) => {
  const letters = text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05 * i + delayOffset
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      scaleY: 1,
      scaleX: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 80,
      },
    },
    hidden: {
      opacity: 0,
      scaleY: 0,
      scaleX: 2,
      filter: "blur(10px)",
    },
  };

  return (
    <motion.div
      style={{ display: "flex", overflow: "hidden", flexWrap: "wrap", justifyContent: "center" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

const SkillNode = ({ label, level, delay }: { label: string; level: number; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scaleX: 0 }}
    whileInView={{ opacity: 1, scaleX: 1 }}
    transition={{ delay, duration: 1, ease: "circOut" }}
    className="flex flex-col space-y-2"
  >
    <div className="flex justify-between items-end text-[10px] tracking-[0.5em] uppercase px-1">
      <span className="text-white/60">{label}</span>
      <span className="text-orange-500 font-mono italic">{level}%</span>
    </div>
    <div className="h-[2px] w-full bg-orange-900/20 overflow-hidden">
      <motion.div
        initial={{ x: "-100%" }}
        whileInView={{ x: `${level - 100}%` }}
        transition={{ delay: delay + 0.5, duration: 1.5, ease: "easeInOut" }}
        className="h-full w-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
      />
    </div>
  </motion.div>
);

const GithubDashboard = ({ stats }: { stats: any }) => {
  return (
    <div className="w-full max-w-6xl flex flex-col items-center space-y-12">
      {/* Calendar Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full p-8 bg-black/40 border border-orange-500/10 backdrop-blur-md relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/20 group-hover:bg-orange-500/40 transition-colors" />
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center text-[10px] tracking-[0.4em] uppercase text-white/40">
            <span>Contribution Matrix // TobiasArg</span>
            <span className="animate-pulse text-orange-500/60">Live Feed Established</span>
          </div>
          <div className="flex justify-center overflow-x-auto custom-scrollbar pb-4 md:pb-0">
            <GitHubCalendar
              username="TobiasArg"
              theme={{
                light: ['#161b22', '#3a1c02', '#7a3100', '#d94e00', '#f97316'],
                dark: ['#161b22', '#3a1c02', '#7a3100', '#d94e00', '#f97316'],
              }}
              fontSize={12}
              blockSize={12}
              blockMargin={4}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {[
          { label: "Active Repos", value: stats.repos, icon: "RP" },
          { label: "Followers", value: stats.followers, icon: "FL" },
          { label: "Stars Growth", value: "824", icon: "ST" },
          { label: "Global Rank", value: "A++", icon: "RK" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + (i * 0.1) }}
            className="p-6 bg-white/[0.02] border border-white/5 backdrop-blur-sm relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-orange-500/20 group-hover:text-orange-500/40 transition-colors">
              {stat.icon}
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-3xl font-light font-mono text-white group-hover:text-orange-400 transition-colors">{stat.value}</span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-white/30">{stat.label}</span>
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-500/40 group-hover:w-full transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });
  const [distortion, setDistortion] = useState(0);
  const [stats, setStats] = useState({ repos: "0", followers: "0" });

  useEffect(() => {
    fetch("https://api.github.com/users/TobiasArg")
      .then(res => res.json())
      .then(data => {
        setStats({
          repos: data.public_repos?.toString() || "0",
          followers: data.followers?.toString() || "0"
        });
      })
      .catch(() => { });

    return smoothProgress.on("change", (v) => setDistortion(v));
  }, [smoothProgress]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-y-auto scroll-smooth snap-y snap-mandatory bg-black text-white selection:bg-orange-500/30 overflow-x-hidden font-sans"
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(249, 115, 22, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(249, 115, 22, 0.2); }
      `}</style>

      <CyberneticGridShader distortion={distortion} />

      {/* 01 // HERO */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center snap-start pointer-events-none">
        <div className="flex flex-col items-center justify-center space-y-0 w-full max-w-5xl">
          <PathAnimation text="ARGTA" fontSize={120} duration="6s" className="w-full" />
          <PathAnimation text="FULLSTACK DEVELOPER" fontSize={32} duration="8s" className="w-full -mt-16" />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 6, duration: 3 }}
          className="absolute bottom-10 animate-pulse text-orange-400 text-sm tracking-widest uppercase font-light"
        >
          Analyzing Environment...
        </motion.div>
      </section>

      {/* 02 // REPOSITORY DASHBOARD */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center snap-start px-8">
        <div className="max-w-6xl w-full flex flex-col items-center space-y-12">
          <div className="text-center space-y-4">
            <span className="text-orange-500 text-[10px] tracking-[1em] uppercase">Sector 01 // Repository Data</span>
            <ConstructedText
              text="DEVELOPMENT ACTIVITY"
              className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase text-white"
            />
          </div>

          <GithubDashboard stats={stats} />
        </div>
      </section>

      {/* 03 // SYSTEMS (Projects) */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center snap-start px-8">
        <div className="max-w-6xl w-full space-y-16">
          <div className="flex justify-between items-end border-b border-orange-500/20 pb-4">
            <div className="space-y-2">
              <span className="text-orange-500 text-[10px] tracking-[1em] uppercase">Sector 02 // Project Log</span>
              <ConstructedText text="ACTIVE SYSTEMS" className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase text-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Quantum Neural UI", tech: ["Three.js", "React", "Rust"] },
              { title: "Hypercloud Engine", tech: ["Node.js", "K8s", "Go"] },
              { title: "Vector Matrix Hub", tech: ["PyTorch", "C++", "WebGL"] }
            ].map((proj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-8 border border-white/5 bg-white/[0.01] backdrop-blur-sm transition-all hover:border-orange-500/40"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
                <h3 className="text-xl font-light tracking-widest text-white mb-4 uppercase group-hover:text-orange-400 transition-colors">{proj.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {proj.tech.map((t, idx) => (
                    <span key={idx} className="text-[9px] tracking-[0.2em] uppercase text-white/30 border border-white/10 px-2 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 // PROTOCOLS (Skills) */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center snap-start px-8">
        <div className="max-w-4xl w-full space-y-16">
          <div className="text-center space-y-2">
            <span className="text-orange-500 text-[10px] tracking-[1em] uppercase">Sector 03 // Tech Stack</span>
            <ConstructedText text="OPERATIONAL PROTOCOLS" className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase text-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-16">
            <SkillNode label="Frontend Synthesis" level={98} delay={0.2} />
            <SkillNode label="Neural Architectures" level={85} delay={0.3} />
            <SkillNode label="Core Systems" level={92} delay={0.4} />
            <SkillNode label="Protocol Optimization" level={89} delay={0.5} />
          </div>
        </div>
      </section>

      {/* 05 // ARCHITECTURE (About) */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center snap-start px-8">
        <div className="max-w-4xl text-center space-y-12">
          <div className="space-y-4">
            <span className="text-orange-500 text-[10px] tracking-[1em] uppercase animate-pulse">Sector 04 // Architecture</span>
            <ConstructedText
              text="VISION & MISSION"
              className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase text-white"
            />
          </div>
          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 1, duration: 2 }}
            className="text-lg md:text-xl font-extralight leading-relaxed text-white/50 max-w-2xl mx-auto"
          >
            Engineering scalable <span className="text-orange-500">digital ecosystems</span> that merge high-fidelity graphics
            with robust computational backbones. Defining the intersection of art and logic.
          </motion.p>
        </div>
      </section>

      {/* 06 // UPLINK */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center snap-start px-8">
        <div className="max-w-2xl w-full text-center space-y-12">
          <div className="space-y-4">
            <span className="text-orange-500 text-[10px] tracking-[1em] uppercase">Sector 05 // Uplink</span>
            <ConstructedText text="INITIATE PROTOCOL" className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase text-white" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1.5 }}
            className="flex flex-col space-y-8"
          >
            <p className="text-white/40 text-sm tracking-widest leading-loose max-w-md mx-auto">
              Secure channel ready. Encryption active. <br />
              Awaiting transmission...
            </p>
            <button className="self-center group relative border border-orange-500/40 px-16 py-5 text-white text-xs tracking-[0.5em] uppercase hover:border-orange-500/80 transition-all">
              <span className="relative z-10">Send Transmission</span>
              <div className="absolute inset-0 bg-orange-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>
        <footer className="absolute bottom-8 left-0 w-full text-center text-[10px] tracking-[0.8em] text-orange-500/30 uppercase font-mono">
          Argta // (C) 2026 // Distributed System
        </footer>
      </section>
    </div>
  );
}
