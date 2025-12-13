import { motion } from "framer-motion";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Volume2, BookOpen } from "lucide-react";

const popularVerbs = [
  "être", "avoir", "aller", "faire", "pouvoir", "vouloir", "devoir", "savoir"
];

const conjugationExample = {
  verb: "parler",
  meaning: "to speak",
  group: "1st group (-er)",
  tenses: {
    "Présent": ["je parle", "tu parles", "il/elle parle", "nous parlons", "vous parlez", "ils/elles parlent"],
    "Passé Composé": ["j'ai parlé", "tu as parlé", "il/elle a parlé", "nous avons parlé", "vous avez parlé", "ils/elles ont parlé"],
    "Imparfait": ["je parlais", "tu parlais", "il/elle parlait", "nous parlions", "vous parliez", "ils/elles parlaient"],
    "Futur Simple": ["je parlerai", "tu parleras", "il/elle parlera", "nous parlerons", "vous parlerez", "ils/elles parleront"],
  }
};

const Conjugator = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTense, setSelectedTense] = useState("Présent");

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
              Conjugueur de Verbes
            </h1>
            <p className="text-xl text-muted-foreground">
              Conjugate any French verb in all tenses
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Enter a verb (e.g., parler, être, avoir)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </motion.div>

          {/* Popular Verbs */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-muted-foreground text-center mb-4">Popular verbs:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularVerbs.map((verb) => (
                <Button 
                  key={verb} 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSearchQuery(verb)}
                >
                  {verb}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Conjugation Result */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass">
              <CardContent className="p-6">
                {/* Verb Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-display font-bold">{conjugationExample.verb}</h2>
                      <Button variant="ghost" size="icon">
                        <Volume2 className="w-5 h-5" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground">{conjugationExample.meaning}</p>
                    <p className="text-sm text-primary">{conjugationExample.group}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Tense Selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.keys(conjugationExample.tenses).map((tense) => (
                    <Button
                      key={tense}
                      variant={selectedTense === tense ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTense(tense)}
                    >
                      {tense}
                    </Button>
                  ))}
                </div>

                {/* Conjugation Table */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {conjugationExample.tenses[selectedTense as keyof typeof conjugationExample.tenses].map((form, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/50">
                      <p className="font-medium">{form}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Conjugator;
