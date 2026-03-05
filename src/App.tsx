import CyberneticGridShader from "@/components/ui/cybernetic-grid-shader";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 20
  });

  const [distortion, setDistortion] = useState(0);

  // Directly map progress to distortion (which is now our scroll offset)
  useEffect(() => {
    return smoothProgress.on("change", (v) => setDistortion(v));
  }, [smoothProgress]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-y-auto scroll-smooth snap-y snap-mandatory bg-black text-white selection:bg-orange-500/30"
    >
      <CyberneticGridShader distortion={distortion} />

      {/* Hero Section */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center snap-start pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center space-y-6"
        >
          <div className="relative">
            <h1 className="text-7xl md:text-9xl font-light tracking-[0.2em] uppercase text-white overflow-hidden whitespace-nowrap border-r-2 border-orange-500/50 pr-2 animate-typing drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Argta
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="h-[1px] w-12 bg-white/20" />
            <p className="text-xl md:text-2xl font-light tracking-[0.4em] uppercase text-white/80 overflow-hidden whitespace-nowrap border-r-2 border-white/40 pr-1 animate-typing-delayed">
              Fullstack Developer
            </p>
            <span className="h-[1px] w-12 bg-white/20" />
          </div>
        </motion.div>

        <div className="absolute bottom-10 animate-bounce text-white/30 text-sm tracking-widest uppercase">
          Scroll to explore
        </div>
      </section>

      {/* About Section 1 */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center snap-start px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-center"
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-[0.1em] uppercase mb-8 text-orange-400">
            Innovative Design
          </h2>
          <p className="text-lg md:text-xl font-extralight leading-relaxed text-white/70">
            Pushing the boundaries of web development with high-performance shaders
            and immersive user interfaces. Every line of code is crafted for precision and speed.
          </p>
        </motion.div>
      </section>

      {/* About Section 2 */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center snap-start px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl text-center"
        >
          <h2 className="text-4xl md:text-6xl font-light tracking-[0.1em] uppercase mb-8 text-white">
            Matrix Integration
          </h2>
          <p className="text-lg md:text-xl font-extralight leading-relaxed text-white/70">
            Seamlessly connecting front-end aesthetics with back-end robustness.
            Building scalable digital ecosystems for the modern era.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
