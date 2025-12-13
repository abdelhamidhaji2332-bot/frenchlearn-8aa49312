import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, ChevronRight, CheckCircle } from "lucide-react";

const grammarTopics = [
  {
    category: "Les Bases",
    categoryEn: "Basics",
    topics: [
      { id: 1, title: "Les articles (le, la, les)", completed: true },
      { id: 2, title: "Le genre des noms", completed: true },
      { id: 3, title: "Les pronoms personnels", completed: false },
      { id: 4, title: "Les adjectifs possessifs", completed: false },
    ]
  },
  {
    category: "Les Verbes",
    categoryEn: "Verbs",
    topics: [
      { id: 5, title: "Le présent de l'indicatif", completed: true },
      { id: 6, title: "Le passé composé", completed: false },
      { id: 7, title: "L'imparfait", completed: false },
      { id: 8, title: "Le futur simple", completed: false },
    ]
  },
  {
    category: "Structure",
    categoryEn: "Sentence Structure",
    topics: [
      { id: 9, title: "La négation", completed: false },
      { id: 10, title: "Les questions", completed: false },
      { id: 11, title: "Les prépositions", completed: false },
      { id: 12, title: "Les conjonctions", completed: false },
    ]
  },
];

const Grammar = () => {
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
              Grammaire Française
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master French grammar with clear explanations, examples, and interactive exercises.
            </p>
          </motion.div>

          {/* Grammar Categories */}
          <div className="space-y-8">
            {grammarTopics.map((category, catIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-semibold">{category.category}</h2>
                    <p className="text-sm text-muted-foreground">{category.categoryEn}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {category.topics.map((topic, index) => (
                    <Card 
                      key={topic.id} 
                      variant="glass" 
                      className={`hover-lift cursor-pointer ${topic.completed ? 'border-success/30' : ''}`}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          topic.completed 
                            ? 'bg-success text-success-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {topic.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="font-semibold">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{topic.title}</h4>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Video Lessons CTA */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="gradient">
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                  <Play className="w-8 h-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-display font-semibold mb-2">
                    Video Grammar Lessons
                  </h3>
                  <p className="text-muted-foreground">
                    Watch detailed explanations for complex grammar topics
                  </p>
                </div>
                <Button variant="hero">
                  Watch Videos
                  <ChevronRight className="w-4 h-4 ml-1" />
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

export default Grammar;
