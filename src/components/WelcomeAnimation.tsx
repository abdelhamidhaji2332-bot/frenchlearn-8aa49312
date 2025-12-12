import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface WelcomeAnimationProps {
  onComplete: () => void;
  skipAnimation?: boolean;
}

export const WelcomeAnimation = ({ onComplete, skipAnimation = false }: WelcomeAnimationProps) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (skipAnimation) {
      onComplete();
      return;
    }

    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 2500),
      setTimeout(() => setStage(4), 3500),
      setTimeout(() => onComplete(), 4500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete, skipAnimation]);

  if (skipAnimation) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-primary overflow-hidden"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* French flag stripes */}
        <div className="absolute inset-0 flex">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "100%" }}
            animate={{ width: stage >= 3 ? "33.33%" : "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <motion.div
            className="h-full bg-card"
            initial={{ width: "0%" }}
            animate={{ width: stage >= 3 ? "33.33%" : "0%" }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.1 }}
          />
          <motion.div
            className="h-full bg-destructive"
            initial={{ width: "0%" }}
            animate={{ width: stage >= 3 ? "33.33%" : "0%" }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <AnimatePresence mode="wait">
            {stage === 0 && (
              <motion.div
                key="bonjour"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-6xl md:text-8xl font-display text-primary-foreground">
                  Bonjour!
                </h1>
              </motion.div>
            )}
            
            {stage === 1 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-6xl font-display text-primary-foreground">
                  Bienvenue
                </h2>
                <p className="mt-4 text-xl text-primary-foreground/80">
                  Welcome to your French journey
                </p>
              </motion.div>
            )}

            {stage === 2 && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 10 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center gap-4"
              >
                <motion.div
                  className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center"
                  animate={{ 
                    boxShadow: ["0 0 20px hsl(38 92% 50% / 0.3)", "0 0 40px hsl(38 92% 50% / 0.6)", "0 0 20px hsl(38 92% 50% / 0.3)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-4xl font-display font-bold text-secondary-foreground">F</span>
                </motion.div>
                <span className="text-4xl md:text-5xl font-display text-primary-foreground">
                  rançais
                </span>
              </motion.div>
            )}

            {stage >= 3 && (
              <motion.div
                key="ready"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-8"
              >
                <motion.h1
                  className="text-5xl md:text-7xl font-display text-primary"
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Prêt à apprendre?
                </motion.h1>
                <motion.p
                  className="mt-4 text-xl text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Ready to learn?
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-secondary/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-secondary/20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Skip button */}
        <motion.button
          onClick={onComplete}
          className="absolute bottom-8 right-8 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Skip →
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};
