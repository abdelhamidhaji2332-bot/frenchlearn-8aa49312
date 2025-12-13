import { motion } from "framer-motion";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Volume2, Star, Bookmark, ChevronRight, Shuffle } from "lucide-react";

const categories = [
  { id: "food", name: "Nourriture", nameEn: "Food", icon: "🍽️", words: 120, color: "from-orange-500 to-red-500" },
  { id: "travel", name: "Voyage", nameEn: "Travel", icon: "✈️", words: 85, color: "from-blue-500 to-cyan-500" },
  { id: "family", name: "Famille", nameEn: "Family", icon: "👨‍👩‍👧", words: 45, color: "from-pink-500 to-rose-500" },
  { id: "work", name: "Travail", nameEn: "Work", icon: "💼", words: 95, color: "from-purple-500 to-violet-500" },
  { id: "home", name: "Maison", nameEn: "Home", icon: "🏠", words: 75, color: "from-green-500 to-emerald-500" },
  { id: "nature", name: "Nature", nameEn: "Nature", icon: "🌳", words: 60, color: "from-teal-500 to-green-500" },
];

const recentWords = [
  { french: "Bonjour", english: "Hello", arabic: "مرحبا", pronunciation: "/bɔ̃.ʒuʁ/" },
  { french: "Merci", english: "Thank you", arabic: "شكراً", pronunciation: "/mɛʁ.si/" },
  { french: "S'il vous plaît", english: "Please", arabic: "من فضلك", pronunciation: "/sil.vu.plɛ/" },
  { french: "Au revoir", english: "Goodbye", arabic: "مع السلامة", pronunciation: "/o.ʁə.vwaʁ/" },
];

const Vocabulary = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
              Vocabulaire
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Build your French vocabulary with flashcards, games, and spaced repetition.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            className="max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for a word..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Shuffle className="w-5 h-5" />
              <span>Flashcards</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Star className="w-5 h-5" />
              <span>Review</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Bookmark className="w-5 h-5" />
              <span>Saved Words</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Volume2 className="w-5 h-5" />
              <span>Listen & Learn</span>
            </Button>
          </motion.div>

          {/* Categories */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-display font-semibold mb-6">Categories</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => (
                <Card key={category.id} variant="glass" className="hover-lift cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.nameEn} • {category.words} words</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Recent Words */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-display font-semibold mb-6">Recent Words</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {recentWords.map((word, index) => (
                <Card key={word.french} variant="glass" className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-display font-bold">{word.french}</h3>
                        <p className="text-sm text-muted-foreground">{word.pronunciation}</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Volume2 className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-foreground">{word.english}</p>
                      <p className="text-muted-foreground" dir="rtl">{word.arabic}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Vocabulary;
