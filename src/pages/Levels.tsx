import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, BookOpen, Trophy, Clock, Star } from "lucide-react";

const levels = [
  { 
    id: "A1", 
    name: "Débutant", 
    nameEn: "Beginner",
    description: "Learn basic French greetings, numbers, and simple phrases",
    lessons: 24,
    progress: 100,
    color: "from-green-500 to-emerald-600"
  },
  { 
    id: "A2", 
    name: "Élémentaire", 
    nameEn: "Elementary",
    description: "Expand vocabulary with everyday topics and basic conversations",
    lessons: 32,
    progress: 67,
    color: "from-blue-500 to-cyan-600"
  },
  { 
    id: "B1", 
    name: "Intermédiaire", 
    nameEn: "Intermediate",
    description: "Express opinions, understand main points of clear standard input",
    lessons: 40,
    progress: 0,
    color: "from-yellow-500 to-orange-600"
  },
  { 
    id: "B2", 
    name: "Intermédiaire Supérieur", 
    nameEn: "Upper Intermediate",
    description: "Interact with fluency, produce detailed text on various subjects",
    lessons: 48,
    progress: 0,
    color: "from-orange-500 to-red-600"
  },
  { 
    id: "C1", 
    name: "Avancé", 
    nameEn: "Advanced",
    description: "Express ideas fluently, use language flexibly for all purposes",
    lessons: 56,
    progress: 0,
    color: "from-purple-500 to-violet-600"
  },
  { 
    id: "C2", 
    name: "Maîtrise", 
    nameEn: "Mastery",
    description: "Understand virtually everything, express yourself spontaneously",
    lessons: 64,
    progress: 0,
    color: "from-pink-500 to-rose-600"
  },
];

const Levels = () => {
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
              Niveaux de Français
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From complete beginner to native-level fluency. Choose your level and start learning.
            </p>
          </motion.div>

          {/* Levels Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level, index) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="hover-lift h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center text-white shadow-lg`}>
                        <span className="text-2xl font-display font-bold">{level.id}</span>
                      </div>
                      {level.progress === 100 && (
                        <div className="flex items-center gap-1 text-success">
                          <Trophy className="w-5 h-5" />
                          <span className="text-sm font-medium">Complete</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-display font-semibold mb-1">
                      {level.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {level.nameEn}
                    </p>
                    <p className="text-muted-foreground text-sm mb-4">
                      {level.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {level.lessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        ~{level.lessons * 15} min
                      </div>
                    </div>

                    {level.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{level.progress}%</span>
                        </div>
                        <Progress value={level.progress} className="h-2" />
                      </div>
                    )}

                    <Link to={`/level/${level.id.toLowerCase()}`}>
                      <Button 
                        variant={level.progress > 0 && level.progress < 100 ? "hero" : "outline"} 
                        className="w-full"
                      >
                        {level.progress === 100 ? "Review" : level.progress > 0 ? "Continue" : "Start"}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Levels;
