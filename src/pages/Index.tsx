import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { LevelSelector } from "@/components/LevelSelector";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { Footer } from "@/components/Footer";
import { WelcomeAnimation } from "@/components/WelcomeAnimation";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Check if user has seen the animation before
  useEffect(() => {
    const hasSeenAnimation = localStorage.getItem("hasSeenWelcome");
    if (hasSeenAnimation) {
      setShowWelcome(false);
      setAnimationComplete(true);
    }
  }, []);

  const handleAnimationComplete = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setAnimationComplete(true);
    setTimeout(() => setShowWelcome(false), 500);
  };

  return (
    <>
      {/* Welcome Animation */}
      <AnimatePresence>
        {showWelcome && !animationComplete && (
          <WelcomeAnimation 
            onComplete={handleAnimationComplete}
            skipAnimation={false}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {animationComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen"
          >
            <Navbar />
            <main>
              <HeroSection />
              <LevelSelector />
              <FeaturesGrid />
              
              {/* Daily Motivation Section */}
              <section className="py-12 sm:py-20 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5" />
                <div className="container mx-auto max-w-4xl relative z-10">
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-secondary font-medium mb-4 block">
                      Mot du jour
                    </span>
                    <h2 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold mb-4">
                      Courage
                    </h2>
                    <p className="text-lg sm:text-2xl text-muted-foreground mb-2">
                      /ku.ʁaʒ/
                    </p>
                    <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 px-2">
                      Bravery, courage — the ability to face difficulty
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <motion.button
                        className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </motion.button>
                      <span className="text-muted-foreground">Listen to pronunciation</span>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="py-12 sm:py-20 px-4">
                <div className="container mx-auto max-w-4xl">
                  <motion.div
                    className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center text-primary-foreground relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                  >
                    {/* Decorative elements */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-secondary/20 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-card/10 blur-3xl" />
                    
                    <div className="relative z-10">
                      <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mb-3 sm:mb-4">
                        Prêt à commencer?
                      </h2>
                      <p className="text-base sm:text-xl text-primary-foreground/80 mb-6 sm:mb-8">
                        Join thousands of learners mastering French today.
                      </p>
                      <Link
                        to="/auth"
                        className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg shadow-lg hover:shadow-glow transition-all hover:-translate-y-1"
                      >
                        Créer un compte gratuit
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </section>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
