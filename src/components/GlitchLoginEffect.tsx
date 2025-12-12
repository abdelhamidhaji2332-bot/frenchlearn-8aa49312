import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface GlitchLoginEffectProps {
  isActive: boolean;
  onComplete: () => void;
}

export const GlitchLoginEffect = ({ isActive, onComplete }: GlitchLoginEffectProps) => {
  const [stage, setStage] = useState<"glitch" | "recovering" | "recovered" | "done">("glitch");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setStage("glitch");
      setProgress(0);
      return;
    }

    // Stage 1: Glitch effect (1.5s)
    const glitchTimer = setTimeout(() => {
      setStage("recovering");
    }, 1500);

    // Stage 2: Recovery animation (2s with progress bar)
    const recoveryTimer = setTimeout(() => {
      setStage("recovered");
    }, 3500);

    // Stage 3: Done (0.5s)
    const doneTimer = setTimeout(() => {
      setStage("done");
      onComplete();
    }, 4500);

    // Progress bar animation
    let progressInterval: NodeJS.Timeout;
    if (isActive) {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100;
          const increment = stage === "recovering" ? 4 : 0;
          return prev + increment;
        });
      }, 50);
    }

    return () => {
      clearTimeout(glitchTimer);
      clearTimeout(recoveryTimer);
      clearTimeout(doneTimer);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isActive, stage, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Scanline effect */}
        {stage === "glitch" && <div className="scanline" />}

        {/* Glitch container */}
        <div className={`relative ${stage === "glitch" ? "glitch-effect" : ""}`}>
          <AnimatePresence mode="wait">
            {stage === "glitch" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  className="relative"
                  animate={{
                    x: [0, -5, 5, -3, 3, 0],
                  }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                >
                  {/* Error icon */}
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-destructive flex items-center justify-center"
                    animate={{
                      borderColor: ["hsl(0 72% 51%)", "hsl(0 72% 30%)", "hsl(0 72% 51%)"],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  >
                    <motion.span
                      className="text-4xl font-bold text-destructive"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.2, repeat: Infinity }}
                    >
                      !
                    </motion.span>
                  </motion.div>

                  <motion.h2
                    className="text-3xl md:text-4xl font-display text-destructive mb-4"
                    animate={{
                      textShadow: [
                        "2px 0 #ff0000, -2px 0 #00ff00",
                        "-2px 0 #ff0000, 2px 0 #00ff00",
                        "2px 0 #ff0000, -2px 0 #00ff00",
                      ],
                    }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                  >
                    Error... System malfunction...
                  </motion.h2>

                  <motion.div
                    className="flex flex-col gap-2 font-mono text-sm text-destructive/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p>ERROR_CODE: 0x4F52454E</p>
                    <p>STATUS: CRITICAL</p>
                    <motion.p
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      INITIATING RECOVERY PROTOCOL...
                    </motion.p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {stage === "recovering" && (
              <motion.div
                key="recovering"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                {/* Recovery icon */}
                <motion.div
                  className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-secondary flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full border-t-4 border-secondary"
                    style={{ borderTopColor: "hsl(38 92% 50%)" }}
                  />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-display text-secondary mb-4">
                  System recovering...
                </h2>

                {/* Progress bar */}
                <div className="w-80 max-w-full mx-auto h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-success to-success/80 rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <p className="mt-4 font-mono text-sm text-muted-foreground">
                  {progress}% Complete
                </p>
              </motion.div>
            )}

            {stage === "recovered" && (
              <motion.div
                key="recovered"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center"
              >
                {/* Success icon */}
                <motion.div
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-success flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <motion.svg
                    className="w-12 h-12 text-success-foreground"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </motion.div>

                <motion.h2
                  className="text-3xl md:text-4xl font-display text-success mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  System recovered.
                </motion.h2>
                <motion.p
                  className="text-xl text-card-foreground"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  You can enter now.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Background effects */}
        {stage === "glitch" && (
          <>
            <motion.div
              className="absolute inset-0 bg-destructive/10"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.15, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.03) 2px, rgba(255,0,0,0.03) 4px)",
              }}
            />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
