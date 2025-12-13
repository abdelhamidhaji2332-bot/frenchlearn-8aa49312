import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Play, Volume2, MessageCircle, ChevronRight } from "lucide-react";

const scenarios = [
  { id: 1, title: "Au café", titleEn: "At the café", icon: "☕", difficulty: "A1" },
  { id: 2, title: "À l'hôtel", titleEn: "At the hotel", icon: "🏨", difficulty: "A2" },
  { id: 3, title: "Au restaurant", titleEn: "At the restaurant", icon: "🍽️", difficulty: "A2" },
  { id: 4, title: "À l'aéroport", titleEn: "At the airport", icon: "✈️", difficulty: "B1" },
  { id: 5, title: "Chez le médecin", titleEn: "At the doctor", icon: "🏥", difficulty: "B1" },
  { id: 6, title: "Entretien d'embauche", titleEn: "Job interview", icon: "💼", difficulty: "B2" },
];

const Speaking = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Parler Français
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Practice speaking with AI-powered pronunciation feedback and role-play scenarios.
            </p>
          </motion.div>

          {/* Quick Practice */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="gradient" className="hover-lift cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary mx-auto mb-4">
                  <Mic className="w-8 h-8" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">Record & Compare</h3>
                <p className="text-sm text-muted-foreground">Compare your pronunciation with native speakers</p>
              </CardContent>
            </Card>

            <Card variant="glass" className="hover-lift cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">AI Conversation</h3>
                <p className="text-sm text-muted-foreground">Practice conversations with our AI tutor</p>
              </CardContent>
            </Card>

            <Card variant="glass" className="hover-lift cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-success/20 flex items-center justify-center text-success mx-auto mb-4">
                  <Volume2 className="w-8 h-8" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">Listen & Repeat</h3>
                <p className="text-sm text-muted-foreground">Improve your accent with audio exercises</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Role-play Scenarios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-display font-semibold mb-6">Role-play Scenarios</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map((scenario, index) => (
                <Card key={scenario.id} variant="glass" className="hover-lift cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{scenario.icon}</div>
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {scenario.difficulty}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-1">{scenario.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{scenario.titleEn}</p>
                    <Button variant="outline" className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Start Practice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Speaking Challenge */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                  <span className="text-4xl">🎯</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-display font-bold mb-2">
                    Daily Speaking Challenge
                  </h3>
                  <p className="text-primary-foreground/80">
                    Complete today's challenge and earn bonus XP!
                  </p>
                </div>
                <Button variant="secondary" size="lg">
                  Start Challenge
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Speaking;
