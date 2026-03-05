import CyberneticGridShader from "@/components/ui/cybernetic-grid-shader";
import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="relative min-h-screen text-foreground font-sans selection:bg-primary/30 bg-black overflow-hidden">
      <CyberneticGridShader />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 bg-transparent pointer-events-none">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,100,0,0.5)]">
            Argta
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-4 flex flex-col items-center justify-center"
          >
            <div className="flex items-center space-x-3">
              <span className="h-[1px] w-8 bg-orange-500/30" />
              <p className="text-xl md:text-2xl font-light tracking-[0.4em] uppercase text-orange-400/90 overflow-hidden whitespace-nowrap border-r-2 border-orange-500/50 pr-1 animate-typing">
                Fullstack Developer
              </p>
              <span className="h-[1px] w-8 bg-orange-500/30" />
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
