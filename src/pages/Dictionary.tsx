import { motion } from "framer-motion";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Volume2, Bookmark, History, ArrowRightLeft } from "lucide-react";

const recentSearches = [
  { french: "amour", english: "love", type: "noun" },
  { french: "manger", english: "to eat", type: "verb" },
  { french: "beau", english: "beautiful", type: "adjective" },
  { french: "rapidement", english: "quickly", type: "adverb" },
];

const Dictionary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDirection, setSearchDirection] = useState<"fr-en" | "en-fr">("fr-en");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Dictionnaire
            </h1>
            <p className="text-xl text-muted-foreground">
              French-English dictionary with pronunciation and examples
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium">
                    {searchDirection === "fr-en" ? "Français" : "English"}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSearchDirection(d => d === "fr-en" ? "en-fr" : "fr-en")}
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {searchDirection === "fr-en" ? "English" : "Français"}
                  </span>
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

          {/* Recent Searches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-display font-semibold">Recent Searches</h2>
            </div>
            <div className="space-y-3">
              {recentSearches.map((word, index) => (
                <Card key={word.french} variant="glass" className="hover-lift cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{word.french}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                          {word.type}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{word.english}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Volume2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Bookmark className="w-4 h-4" />
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
