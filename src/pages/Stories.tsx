import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Volume2, ChevronRight, Clock, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Story {
  id: string;
  title: string;
  author: string | null;
  level: string;
  content: string;
  content_arabic: string | null;
  read_time_minutes: number | null;
  category: string | null;
}

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [showArabic, setShowArabic] = useState(false);

  useEffect(() => {
    fetchStories();
  }, [selectedLevel]);

  const fetchStories = async () => {
    setLoading(true);
    let query = supabase.from("stories").select("*");
    
    if (selectedLevel) {
      query = query.eq("level", selectedLevel);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (data && !error) {
      setStories(data);
    }
    setLoading(false);
  };

  const levels = ["A1", "A2", "B1", "B2", "C1"];

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.8;
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
              Histoires Courtes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Improve your reading skills with classic French stories and audio narration
            </p>
          </motion.div>

          {/* Filter by Level */}
          <motion.div
            className="flex justify-center gap-2 mb-12 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button 
              variant={selectedLevel === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedLevel(null)}
            >
              All
            </Button>
            {levels.map(level => (
              <Button 
                key={level}
                variant={selectedLevel === level ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedLevel(level)}
              >
                {level}
              </Button>
            ))}
          </motion.div>

          {/* Stories Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
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
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground">
                          <BookOpen className="w-8 h-8" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {story.level}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(story.title);
                            }}
                          >
                            <Volume2 className="w-4 h-4 text-secondary" />
                          </Button>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-display font-semibold mb-1">
                        {story.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {story.author}
                      </p>
                      
                      <p className="text-muted-foreground text-sm mb-4 italic flex-1 line-clamp-3">
                        "{story.content.substring(0, 150)}..."
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {story.read_time_minutes || 5} min
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedStory(story)}
                        >
                          Read <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && stories.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No stories found for this level.
            </div>
          )}
        </div>
      </main>

      {/* Story Reader Modal */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl font-display">{selectedStory?.title}</DialogTitle>
                <p className="text-muted-foreground">{selectedStory?.author}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => selectedStory && speakText(selectedStory.content)}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Listen
                </Button>
                {selectedStory?.content_arabic && (
                  <Button 
                    variant={showArabic ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowArabic(!showArabic)}
                  >
                    العربية
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>
          <ScrollArea className="h-[60vh] p-6 pt-4">
            <div className={`grid gap-8 ${showArabic && selectedStory?.content_arabic ? 'md:grid-cols-2' : ''}`}>
              <div className="prose prose-lg dark:prose-invert">
                {selectedStory?.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 leading-relaxed text-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
              {showArabic && selectedStory?.content_arabic && (
                <div className="prose prose-lg dark:prose-invert" dir="rtl">
                  {selectedStory.content_arabic.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 leading-relaxed text-foreground font-arabic">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Stories;