import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, BookOpen, Trophy, Clock, Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LessonViewer } from "@/components/learning/LessonViewer";
import { QuizContainer } from "@/components/learning/QuizContainer";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const levelMeta = [
  { id: "A1", name: "Débutant", nameEn: "Beginner", description: "Learn basic French greetings, numbers, and simple phrases", color: "from-green-500 to-emerald-600" },
  { id: "A2", name: "Élémentaire", nameEn: "Elementary", description: "Expand vocabulary with everyday topics and basic conversations", color: "from-blue-500 to-cyan-600" },
  { id: "B1", name: "Intermédiaire", nameEn: "Intermediate", description: "Express opinions, understand main points of clear standard input", color: "from-yellow-500 to-orange-600" },
  { id: "B2", name: "Intermédiaire Supérieur", nameEn: "Upper Intermediate", description: "Interact with fluency, produce detailed text on various subjects", color: "from-orange-500 to-red-600" },
  { id: "C1", name: "Avancé", nameEn: "Advanced", description: "Express ideas fluently, use language flexibly for all purposes", color: "from-purple-500 to-violet-600" },
  { id: "C2", name: "Maîtrise", nameEn: "Mastery", description: "Understand virtually everything, express yourself spontaneously", color: "from-pink-500 to-rose-600" },
];

interface LessonDetail {
  id: string;
  title: string;
  description: string | null;
  level: string;
  category: string;
  order_index: number | null;
}

const Levels = () => {
  const { user } = useAuth();
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  // Fetch lesson counts per level
  const { data: lessonCounts = {} } = useQuery({
    queryKey: ["level-lesson-counts"],
    queryFn: async () => {
      const { data } = await supabase.from("lessons").select("level");
      if (!data) return {};
      const counts: Record<string, number> = {};
      data.forEach((l) => { counts[l.level] = (counts[l.level] || 0) + 1; });
      return counts;
    },
  });

  // Fetch user progress
  const { data: userProgress = {} } = useQuery({
    queryKey: ["user-level-progress", user?.id],
    queryFn: async () => {
      if (!user) return {};
      const { data: progressRows } = await supabase
        .from("user_progress")
        .select("lesson_id, completed")
        .eq("user_id", user.id)
        .eq("completed", true);
      if (!progressRows) return {};
      // Get lesson levels for completed lessons
      const lessonIds = progressRows.map((p) => p.lesson_id);
      if (lessonIds.length === 0) return {};
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, level")
        .in("id", lessonIds);
      if (!lessons) return {};
      const counts: Record<string, number> = {};
      lessons.forEach((l) => { counts[l.level] = (counts[l.level] || 0) + 1; });
      return counts;
    },
    enabled: !!user,
  });

  // Fetch lessons for expanded level
  const { data: levelLessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["level-lessons", expandedLevel],
    queryFn: async () => {
      if (!expandedLevel) return [];
      const { data } = await supabase
        .from("lessons")
        .select("id, title, description, level, category, order_index")
        .eq("level", expandedLevel)
        .order("order_index", { ascending: true });
      return (data || []) as LessonDetail[];
    },
    enabled: !!expandedLevel,
  });

  // Fetch lesson sections for active lesson
  const { data: activeLessonData } = useQuery({
    queryKey: ["lesson-detail", activeLessonId],
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

  // Fetch quiz for active quiz
  const { data: activeQuizData } = useQuery({
    queryKey: ["quiz-detail", activeQuizId],
    queryFn: async () => {
      if (!activeQuizId) return null;
      const [{ data: quiz }, { data: questions }] = await Promise.all([
        supabase.from("quizzes").select("*").eq("id", activeQuizId).single(),
        supabase.from("quiz_questions").select("*").eq("quiz_id", activeQuizId).order("order_index", { ascending: true }),
      ]);
      return { quiz, questions: (questions || []).map(q => ({ ...q, options: q.options as string[] | null, points: q.points || 10 })) };
    },
    enabled: !!activeQuizId,
  });

  // Fetch quizzes for expanded level
  const { data: levelQuizzes = [] } = useQuery({
    queryKey: ["level-quizzes", expandedLevel],
    queryFn: async () => {
      if (!expandedLevel) return [];
      const { data } = await supabase
        .from("quizzes")
        .select("id, title, description, quiz_type")
        .eq("level", expandedLevel)
        .order("order_index", { ascending: true });
      return data || [];
    },
    enabled: !!expandedLevel,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Niveaux de Français</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From complete beginner to native-level fluency. Choose your level and start learning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levelMeta.map((level, index) => {
              const total = lessonCounts[level.id] || 0;
              const completed = userProgress[level.id] || 0;
              const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
              const isExpanded = expandedLevel === level.id;

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={isExpanded ? "md:col-span-2 lg:col-span-3" : ""}
                >
                  <Card variant="glass" className="hover-lift h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center text-white shadow-lg`}>
                          <span className="text-2xl font-display font-bold">{level.id}</span>
                        </div>
                        {progress === 100 && (
                          <div className="flex items-center gap-1 text-success">
                            <Trophy className="w-5 h-5" />
                            <span className="text-sm font-medium">Complete</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-display font-semibold mb-1">{level.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{level.nameEn}</p>
                      <p className="text-muted-foreground text-sm mb-4">{level.description}</p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {total} lessons
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          ~{total * 15} min
                        </div>
                      </div>

                      {progress > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}

                      <Button 
                        variant={progress > 0 && progress < 100 ? "hero" : "outline"} 
                        className="w-full"
                        onClick={() => setExpandedLevel(isExpanded ? null : level.id)}
                        disabled={total === 0}
                      >
                        {total === 0 ? "Coming Soon" : isExpanded ? "Close" : progress === 100 ? "Review" : progress > 0 ? "Continue" : "Start"}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>

                      {/* Expanded lesson list */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-6 space-y-3"
                        >
                          <h4 className="font-display font-semibold text-lg">Lessons</h4>
                          {lessonsLoading ? (
                            <div className="space-y-2">
                              {[1,2,3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
                            </div>
                          ) : (
                            levelLessons.map((lesson) => (
                              <Card 
                                key={lesson.id} 
                                variant="glass" 
                                className="hover-lift cursor-pointer"
                                onClick={() => setActiveLessonId(lesson.id)}
                              >
                                <CardContent className="p-4 flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                                    {lesson.order_index || 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">{lesson.title}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{lesson.category}</p>
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </CardContent>
                              </Card>
                            ))
                          )}

                          {levelQuizzes.length > 0 && (
                            <>
                              <h4 className="font-display font-semibold text-lg mt-6">Quizzes</h4>
                              {levelQuizzes.map((quiz) => (
                                <Card 
                                  key={quiz.id} 
                                  variant="glass" 
                                  className="hover-lift cursor-pointer"
                                  onClick={() => setActiveQuizId(quiz.id)}
                                >
                                  <CardContent className="p-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                                      <Star className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">{quiz.title}</p>
                                      <p className="text-xs text-muted-foreground capitalize">{quiz.quiz_type}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                  </CardContent>
                                </Card>
                              ))}
                            </>
                          )}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Lesson Viewer Dialog */}
      <Dialog open={!!activeLessonId && !!activeLessonData?.sections?.length} onOpenChange={() => setActiveLessonId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {activeLessonData?.lesson && activeLessonData.sections.length > 0 && (
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
          )}
          {activeLessonData?.lesson && activeLessonData.sections.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">{activeLessonData.lesson.title}</h3>
              <p className="text-muted-foreground">{activeLessonData.lesson.description}</p>
              <p className="text-sm text-muted-foreground mt-4">Lesson content coming soon!</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={!!activeQuizId && !!activeQuizData?.questions?.length} onOpenChange={() => setActiveQuizId(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {activeQuizData?.quiz && activeQuizData.questions.length > 0 && (
            <QuizContainer
              quizId={activeQuizData.quiz.id}
              title={activeQuizData.quiz.title}
              description={activeQuizData.quiz.description || undefined}
              questions={activeQuizData.questions.map(q => ({
                id: q.id,
                question_type: q.question_type as any,
                question_text: q.question_text,
                question_audio_text: q.question_audio_text || undefined,
                options: (q.options as string[]) || undefined,
                correct_answer: q.correct_answer || undefined,
                correct_answers: (q.correct_answers as string[]) || undefined,
                explanation: q.explanation || undefined,
                image_url: q.image_url || undefined,
                points: q.points || 10,
              }))}
              passingScore={activeQuizData.quiz.passing_score || 70}
              onClose={() => setActiveQuizId(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Levels;
