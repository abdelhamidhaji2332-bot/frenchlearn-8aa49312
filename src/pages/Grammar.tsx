import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Play, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LessonViewer } from "@/components/learning/LessonViewer";

const Grammar = () => {
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<string>("A1");
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  const { data: grammarLessons = [], isLoading } = useQuery({
    queryKey: ["grammar-lessons", selectedLevel],
    queryFn: async () => {
      const { data } = await supabase
        .from("lessons")
        .select("id, title, description, level, category, order_index")
        .eq("level", selectedLevel)
        .eq("category", "grammar")
        .order("order_index", { ascending: true });
      return data || [];
    },
  });

  const { data: completedIds = [] } = useQuery({
    queryKey: ["grammar-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("completed", true);
      return (data || []).map(p => p.lesson_id);
    },
    enabled: !!user,
  });

  const { data: activeLessonData } = useQuery({
    queryKey: ["grammar-lesson-detail", activeLessonId],
    queryFn: async () => {
      if (!activeLessonId) return null;
      const [{ data: lesson }, { data: sections }] = await Promise.all([
        supabase.from("lessons").select("*").eq("id", activeLessonId).single(),
        supabase.from("lesson_sections").select("*").eq("lesson_id", activeLessonId).order("order_index", { ascending: true }),
      ]);
      return { lesson, sections: sections || [] };
    },
    enabled: !!activeLessonId,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Grammaire Française</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Master French grammar with clear explanations, examples, and interactive exercises.
            </p>
          </motion.div>

          {/* Level Filter */}
          <motion.div className="flex justify-center gap-2 mb-12 flex-wrap" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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

          {/* Grammar Lessons */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
            </div>
          ) : grammarLessons.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No grammar lessons available for {selectedLevel} yet.</p>
            </div>
          ) : (
            <motion.div className="grid md:grid-cols-2 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {grammarLessons.map((lesson, index) => {
                const isCompleted = completedIds.includes(lesson.id);
                return (
                  <Card
                    key={lesson.id}
                    variant="glass"
                    className={`hover-lift cursor-pointer ${isCompleted ? 'border-success/30' : ''}`}
                    onClick={() => setActiveLessonId(lesson.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isCompleted ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <span className="font-semibold">{index + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{lesson.title}</h4>
                        {lesson.description && <p className="text-sm text-muted-foreground line-clamp-1">{lesson.description}</p>}
                      </div>
                      <Button variant="ghost" size="icon"><ChevronRight className="w-5 h-5" /></Button>
                    </CardContent>
                  </Card>
                );
              })}
            </motion.div>
          )}

          {/* Video Lessons CTA */}
          <motion.div className="mt-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card variant="gradient">
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                  <Play className="w-8 h-8" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-display font-semibold mb-2">Video Grammar Lessons</h3>
                  <p className="text-muted-foreground">Watch detailed explanations for complex grammar topics</p>
                </div>
                <Button variant="hero">Watch Videos <ChevronRight className="w-4 h-4 ml-1" /></Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Lesson Viewer Dialog */}
      <Dialog open={!!activeLessonId && !!activeLessonData} onOpenChange={() => setActiveLessonId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {activeLessonData?.lesson && activeLessonData.sections.length > 0 ? (
            <LessonViewer
              lessonId={activeLessonData.lesson.id}
              title={activeLessonData.lesson.title}
              description={activeLessonData.lesson.description || undefined}
              level={activeLessonData.lesson.level}
              sections={activeLessonData.sections.map(s => ({
                id: s.id,
                section_type: s.section_type as any,
                title: s.title || undefined,
                content: s.content as any,
              }))}
              onComplete={() => setActiveLessonId(null)}
            />
          ) : activeLessonData?.lesson ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">{activeLessonData.lesson.title}</h3>
              <p className="text-muted-foreground">{activeLessonData.lesson.description}</p>
              <p className="text-sm text-muted-foreground mt-4">Detailed content coming soon!</p>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Grammar;
