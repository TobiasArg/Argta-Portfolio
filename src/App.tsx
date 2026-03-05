import CyberneticGridShader from "@/components/ui/cybernetic-grid-shader";
import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="relative min-h-screen text-foreground font-sans selection:bg-primary/30 bg-black overflow-hidden">
      <CyberneticGridShader />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 bg-transparent pointer-events-none">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-6"
        >
          {/* Main Title: Argta */}
          <div className="relative group">
            <h1 className="text-7xl md:text-9xl font-light tracking-[0.2em] uppercase text-white overflow-hidden whitespace-nowrap border-r-2 border-orange-500/50 pr-2 animate-typing drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Argta
            </h1>
          </div>

          {/* Subtitle: Fullstack Developer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="flex items-center space-x-4">
              <span className="h-[1px] w-12 bg-white/20" />
              <p className="text-xl md:text-2xl font-light tracking-[0.4em] uppercase text-white/80 overflow-hidden whitespace-nowrap border-r-2 border-white/40 pr-1 animate-typing-delayed">
                Fullstack Developer
              </p>
              <span className="h-[1px] w-12 bg-white/20" />
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
