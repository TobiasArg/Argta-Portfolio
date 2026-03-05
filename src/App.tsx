import CyberneticGridShader from "@/components/ui/cybernetic-grid-shader";
import PathAnimation from "@/components/ui/svg-path-drawing-text-animation";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const ConstructedText = ({ text, className, delayOffset = 0 }: { text: string; className?: string; delayOffset?: number }) => {
  const letters = text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Slower stagger
        delayChildren: 0.08 * i + delayOffset
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
        damping: 25, // More damped for smoother, slower motion
        stiffness: 80, // Lower stiffness for slower motion
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
      className="relative h-screen overflow-y-auto scroll-smooth snap-y snap-mandatory bg-black text-white selection:bg-orange-500/30 overflow-x-hidden"
    >
      <CyberneticGridShader distortion={distortion} />

      {/* Hero Section */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center snap-start pointer-events-none">
        <div className="flex flex-col items-center justify-center space-y-0 w-full max-w-5xl">
          <PathAnimation
            text="ARGTA"
            fontSize={120}
            duration="6s" // Much slower drawing
            className="w-full"
          />
          <PathAnimation
            text="FULLSTACK DEVELOPER"
            fontSize={32}
            duration="8s" // Very slow drawing for the secondary text
            className="w-full -mt-16"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 6, duration: 3 }} // Appears after drawings are well underway
          className="absolute bottom-10 animate-pulse text-orange-500/50 text-sm tracking-widest uppercase font-light"
        >
          Transmitting...
        </motion.div>
      </section>

      {/* About Section 1 */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center snap-start px-8 text-center">
        <div className="max-w-4xl">
          <ConstructedText
            text="INNOVATIVE DESIGN"
            className="text-4xl md:text-6xl font-light tracking-[0.1em] uppercase mb-8 text-orange-500/90"
          />
          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 2.5, duration: 2.5 }} // Slower fade-in
            className="text-lg md:text-xl font-extralight leading-relaxed text-orange-200/60"
          >
            Pushing the boundaries of web development with high-performance shaders
            and immersive user interfaces. Every line of code is crafted for precision and speed.
          </motion.p>
        </div>
      </section>

      {/* About Section 2 */}
      <section className="relative z-10 h-screen flex flex-col items-center justify-center snap-start px-8 text-center">
        <div className="max-w-4xl">
          <ConstructedText
            text="MATRIX INTEGRATION"
            className="text-4xl md:text-6xl font-light tracking-[0.1em] uppercase mb-8 text-orange-400"
          />
          <motion.p
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: 2.5, duration: 2.5 }} // Slower reveal
            className="text-lg md:text-xl font-extralight leading-relaxed text-orange-200/60"
          >
            Seamlessly connecting front-end aesthetics with back-end robustness.
            Building scalable digital ecosystems for the modern era.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
