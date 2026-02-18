import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Volume2, Star, Bookmark, ChevronRight, Shuffle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface VocabularyWord {
  id: string;
  french: string;
  english: string;
  arabic: string | null;
  pronunciation: string | null;
  category: string;
  level: string;
  example_sentence: string | null;
  example_translation: string | null;
}

const categories = [
  { id: "greetings", name: "Salutations", nameEn: "Greetings", icon: "👋", color: "from-primary to-primary/80" },
  { id: "family", name: "Famille", nameEn: "Family", icon: "👨‍👩‍👧", color: "from-pink-500 to-rose-500" },
  { id: "food", name: "Nourriture", nameEn: "Food", icon: "🍽️", color: "from-orange-500 to-red-500" },
  { id: "colors", name: "Couleurs", nameEn: "Colors", icon: "🎨", color: "from-purple-500 to-violet-500" },
  { id: "numbers", name: "Nombres", nameEn: "Numbers", icon: "🔢", color: "from-blue-500 to-cyan-500" },
  { id: "travel", name: "Voyage", nameEn: "Travel", icon: "✈️", color: "from-teal-500 to-green-500" },
  { id: "animals", name: "Animaux", nameEn: "Animals", icon: "🦁", color: "from-amber-500 to-yellow-500" },
  { id: "body", name: "Corps", nameEn: "Body Parts", icon: "🫀", color: "from-red-500 to-pink-500" },
  { id: "clothing", name: "Vêtements", nameEn: "Clothing", icon: "👕", color: "from-indigo-500 to-purple-500" },
  { id: "weather", name: "Météo", nameEn: "Weather", icon: "🌤️", color: "from-sky-500 to-blue-500" },
  { id: "time", name: "Temps", nameEn: "Time", icon: "⏰", color: "from-emerald-500 to-teal-500" },
  { id: "house", name: "Maison", nameEn: "House", icon: "🏠", color: "from-lime-500 to-green-500" },
  { id: "school", name: "École", nameEn: "School", icon: "📚", color: "from-cyan-500 to-blue-500" },
  { id: "professions", name: "Métiers", nameEn: "Professions", icon: "👔", color: "from-slate-500 to-gray-600" },
  { id: "sports", name: "Sports", nameEn: "Sports", icon: "⚽", color: "from-green-500 to-emerald-500" },
  { id: "nature", name: "Nature", nameEn: "Nature", icon: "🌿", color: "from-green-600 to-lime-500" },
  { id: "emotions", name: "Émotions", nameEn: "Emotions", icon: "😊", color: "from-yellow-500 to-orange-500" },
  { id: "daily", name: "Quotidien", nameEn: "Daily Routine", icon: "☀️", color: "from-amber-400 to-yellow-500" },
  { id: "fruits", name: "Fruits", nameEn: "Fruits", icon: "🍎", color: "from-red-400 to-orange-500" },
  { id: "vegetables", name: "Légumes", nameEn: "Vegetables", icon: "🥕", color: "from-orange-400 to-green-500" },
  { id: "verbs", name: "Verbes", nameEn: "Verbs", icon: "💫", color: "from-violet-500 to-purple-600" },
  { id: "transportation", name: "Transport", nameEn: "Transportation", icon: "🚗", color: "from-blue-500 to-indigo-500" },
  { id: "places", name: "Lieux", nameEn: "Places", icon: "🏛️", color: "from-stone-500 to-amber-600" },
];

const Vocabulary = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchVocabulary();
  }, [selectedCategory]);

  const fetchVocabulary = async () => {
    setLoading(true);
    let query = supabase.from("vocabulary").select("*");
    
    if (selectedCategory) {
      query = query.eq("category", selectedCategory);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false }).limit(20);
    
    if (data && !error) {
      setWords(data);
    }
    
    // Fetch category counts
    const { data: allWords } = await supabase.from("vocabulary").select("category");
    if (allWords) {
      const counts: Record<string, number> = {};
      allWords.forEach((w) => {
        counts[w.category] = (counts[w.category] || 0) + 1;
      });
      setCategoryCounts(counts);
    }
    
    setLoading(false);
  };

  const filteredWords = words.filter(word =>
    word.french.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (word.arabic && word.arabic.includes(searchQuery))
  );

  const speakWord = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    window.speechSynthesis.speak(utterance);
  };

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
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/10" onClick={() => navigate("/flashcards")}>
              <Shuffle className="w-5 h-5" />
              <span>Flashcards</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/10">
              <Star className="w-5 h-5" />
              <span>Review</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/10">
              <Bookmark className="w-5 h-5" />
              <span>Saved Words</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/10">
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
              {categories.map((category) => (
                <Card 
                  key={category.id} 
                  variant="glass" 
                  className={`hover-lift cursor-pointer transition-all ${selectedCategory === category.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.nameEn} • {categoryCounts[category.id] || 0} words</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Words List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-display font-semibold mb-6">
              {selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.name || 'Words'}` : 'Recent Words'}
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredWords.map((word) => (
                  <Card key={word.id} variant="glass" className="hover-lift group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-display font-bold text-primary">{word.french}</h3>
                          <p className="text-sm text-muted-foreground">{word.pronunciation}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => speakWord(word.french)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Volume2 className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-foreground font-medium">{word.english}</p>
                        {word.arabic && (
                          <p className="text-muted-foreground" dir="rtl">{word.arabic}</p>
                        )}
                        {word.example_sentence && (
                          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50">
                            <p className="text-sm italic text-foreground">{word.example_sentence}</p>
                            <p className="text-xs text-muted-foreground mt-1">{word.example_translation}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {word.level}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium capitalize">
                          {word.category}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {!loading && filteredWords.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No words found. Try a different search or category.
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Vocabulary;