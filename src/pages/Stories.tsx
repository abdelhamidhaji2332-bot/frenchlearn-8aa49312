import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Volume2, ChevronRight, Clock } from "lucide-react";

const stories = [
  { 
    id: 1, 
    title: "Le Petit Prince", 
    author: "Antoine de Saint-Exupéry", 
    level: "B1", 
    readTime: "20 min",
    excerpt: "Lorsque j'avais six ans j'ai vu, une fois, une magnifique image...",
    hasAudio: true
  },
  { 
    id: 2, 
    title: "Le Chat Botté", 
    author: "Charles Perrault", 
    level: "A2", 
    readTime: "10 min",
    excerpt: "Un meunier ne laissa pour tous biens à trois enfants qu'il avait...",
    hasAudio: true
  },
  { 
    id: 3, 
    title: "Cendrillon", 
    author: "Charles Perrault", 
    level: "A1", 
    readTime: "8 min",
    excerpt: "Il était une fois un gentilhomme qui épousa en secondes noces...",
    hasAudio: true
  },
  { 
    id: 4, 
    title: "La Belle au Bois Dormant", 
    author: "Charles Perrault", 
    level: "A2", 
    readTime: "12 min",
    excerpt: "Il était une fois un roi et une reine qui étaient si fâchés...",
    hasAudio: true
  },
  { 
    id: 5, 
    title: "Le Petit Chaperon Rouge", 
    author: "Charles Perrault", 
    level: "A1", 
    readTime: "6 min",
    excerpt: "Il était une fois une petite fille de village...",
    hasAudio: true
  },
  { 
    id: 6, 
    title: "Les Trois Mousquetaires", 
    author: "Alexandre Dumas", 
    level: "B2", 
    readTime: "25 min",
    excerpt: "Le premier lundi du mois d'avril 1625...",
    hasAudio: false
  },
];

const Stories = () => {
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
              Histoires Courtes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Improve your reading skills with classic French stories and audio narration
            </p>
          </motion.div>

          {/* Filter by Level */}
          <motion.div
            className="flex justify-center gap-2 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button variant="default" size="sm">All</Button>
            <Button variant="outline" size="sm">A1</Button>
            <Button variant="outline" size="sm">A2</Button>
            <Button variant="outline" size="sm">B1</Button>
            <Button variant="outline" size="sm">B2</Button>
            <Button variant="outline" size="sm">C1</Button>
          </motion.div>

          {/* Stories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="hover-lift h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {story.level}
                        </span>
                        {story.hasAudio && (
                          <Volume2 className="w-4 h-4 text-secondary" />
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-display font-semibold mb-1">
                      {story.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {story.author}
                    </p>
                    
                    <p className="text-muted-foreground text-sm mb-4 italic flex-1">
                      "{story.excerpt}"
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {story.readTime}
                      </div>
                      <Button variant="outline" size="sm">
                        Read <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
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

export default Stories;
