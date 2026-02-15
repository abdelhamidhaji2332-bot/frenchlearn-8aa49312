import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Volume2, ArrowRightLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dictionary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDirection, setSearchDirection] = useState<"fr-en" | "en-fr">("fr-en");

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["dictionary-search", searchQuery, searchDirection],
    queryFn: async () => {
      if (searchQuery.length < 2) return [];
      const column = searchDirection === "fr-en" ? "french" : "english";
      const { data } = await supabase
        .from("vocabulary")
        .select("french, english, arabic, pronunciation, category, example_sentence, example_translation")
        .ilike(column, `%${searchQuery}%`)
        .limit(20);
      return data || [];
    },
    enabled: searchQuery.length >= 2,
  });

  const speakWord = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Dictionnaire</h1>
            <p className="text-xl text-muted-foreground">French-English dictionary with pronunciation and examples</p>
          </motion.div>

          <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium">{searchDirection === "fr-en" ? "Français" : "English"}</span>
                  <Button variant="ghost" size="icon" onClick={() => setSearchDirection(d => d === "fr-en" ? "en-fr" : "fr-en")}>
                    <ArrowRightLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium">{searchDirection === "fr-en" ? "English" : "Français"}</span>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder={searchDirection === "fr-en" ? "Search in French..." : "Search in English..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {isLoading && searchQuery.length >= 2 && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {searchQuery.length < 2 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Type at least 2 characters to search</p>
                <p className="text-sm mt-2">Search through 385+ French words</p>
              </div>
            )}

            {searchQuery.length >= 2 && !isLoading && results.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No results found for "{searchQuery}"</p>
              </div>
            )}

            <div className="space-y-3">
              {results.map((word, index) => (
                <Card key={`${word.french}-${index}`} variant="glass" className="hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-display font-bold text-primary">{word.french}</h3>
                          {word.pronunciation && <span className="text-sm text-muted-foreground">/{word.pronunciation}/</span>}
                        </div>
                        <p className="font-medium">{word.english}</p>
                        {word.arabic && <p className="text-muted-foreground text-sm" dir="rtl">{word.arabic}</p>}
                        {word.example_sentence && (
                          <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                            <p className="text-sm italic">{word.example_sentence}</p>
                            {word.example_translation && <p className="text-xs text-muted-foreground mt-1">{word.example_translation}</p>}
                          </div>
                        )}
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs capitalize">{word.category}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => speakWord(word.french)}>
                        <Volume2 className="w-5 h-5" />
                      </Button>
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

export default Dictionary;
