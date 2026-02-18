import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronRight, ChevronDown, BookOpen, Trophy, Clock, Star, 
  Loader2, GraduationCap, Flame, Lock, CheckCircle2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { LessonViewer } from "@/components/learning/LessonViewer";
import { QuizContainer } from "@/components/learning/QuizContainer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const levelMeta = [
  { id: "A1", name: "Débutant", nameEn: "Beginner", description: "Learn basic French greetings, numbers, and simple phrases", icon: "🌱", gradient: "from-emerald-500 to-green-600" },
  { id: "A2", name: "Élémentaire", nameEn: "Elementary", description: "Expand vocabulary with everyday topics and basic conversations", icon: "🌿", gradient: "from-teal-500 to-cyan-600" },
  { id: "B1", name: "Intermédiaire", nameEn: "Intermediate", description: "Express opinions, understand main points of clear standard input", icon: "🌳", gradient: "from-blue-500 to-indigo-600" },
  { id: "B2", name: "Intermédiaire Supérieur", nameEn: "Upper Intermediate", description: "Interact with fluency, produce detailed text on various subjects", icon: "⭐", gradient: "from-violet-500 to-purple-600" },
  { id: "C1", name: "Avancé", nameEn: "Advanced", description: "Express ideas fluently, use language flexibly for all purposes", icon: "💎", gradient: "from-amber-500 to-orange-600" },
  { id: "C2", name: "Maîtrise", nameEn: "Mastery", description: "Understand virtually everything, express yourself spontaneously", icon: "👑", gradient: "from-rose-500 to-red-600" },
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

  const { data: completedLessonIds = new Set<string>() } = useQuery({
    queryKey: ["completed-lesson-ids", user?.id],
    queryFn: async () => {
      if (!user) return new Set<string>();
      const { data } = await supabase
        .from("user_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("completed", true);
      return new Set((data || []).map(d => d.lesson_id));
    },
    enabled: !!user,
  });

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

  const totalLessons = Object.values(lessonCounts).reduce((a, b) => a + b, 0);
  const totalCompleted = Object.values(userProgress).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <GraduationCap className="w-4 h-4" />
              CEFR Framework
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Niveaux de Français
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From complete beginner to native-level fluency. Choose your level and start learning.
            </p>

            {/* Global progress bar */}
            {user && totalLessons > 0 && (
              <motion.div 
                className="max-w-md mx-auto mt-6 p-4 rounded-xl bg-card border border-border/50"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Flame className="w-4 h-4 text-destructive" />
                    Overall Progress
                  </span>
                  <span className="font-semibold">{totalCompleted}/{totalLessons} lessons</span>
                </div>
                <Progress value={totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0} className="h-2.5" />
              </motion.div>
            )}
          </motion.div>

          {/* Levels */}
          <div className="space-y-4">
            {levelMeta.map((level, index) => {
              const total = lessonCounts[level.id] || 0;
              const completed = userProgress[level.id] || 0;
              const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;
              const isExpanded = expandedLevel === level.id;

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card 
                    className={cn(
                      "overflow-hidden transition-all duration-300 border",
                      isExpanded ? "border-primary/30 shadow-warm" : "border-border/50 hover:border-primary/20"
                    )}
                  >
                    {/* Level Header - always visible */}
                    <button
                      className="w-full text-left"
                      onClick={() => setExpandedLevel(isExpanded ? null : level.id)}
                      disabled={total === 0}
                    >
                      <CardContent className="p-5 md:p-6">
                        <div className="flex items-center gap-4">
                          {/* Level badge */}
                          <div className={cn(
                            "w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-md shrink-0",
                            level.gradient
                          )}>
                            <span className="text-2xl md:text-3xl">{level.icon}</span>
                          </div>

                          {/* Level info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{level.id}</span>
                              {progressPct === 100 && (
                                <span className="flex items-center gap-1 text-success text-xs font-medium">
                                  <Trophy className="w-3 h-3" /> Complete
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-display font-bold truncate">{level.name}</h3>
                            <p className="text-sm text-muted-foreground hidden md:block">{level.description}</p>
                            
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" /> {total} lessons
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> ~{total * 15} min
                              </span>
                              {completed > 0 && (
                                <span className="flex items-center gap-1 text-primary font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> {completed} done
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress circle + expand icon */}
                          <div className="flex items-center gap-3 shrink-0">
                            {total > 0 && progressPct > 0 && (
                              <div className="relative w-12 h-12 hidden md:flex items-center justify-center">
                                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
                                    strokeDasharray={`${progressPct}, 100`} strokeLinecap="round" />
                                </svg>
                                <span className="absolute text-xs font-bold">{progressPct}%</span>
                              </div>
                            )}
                            {total > 0 ? (
                              <ChevronDown className={cn(
                                "w-5 h-5 text-muted-foreground transition-transform duration-300",
                                isExpanded && "rotate-180"
                              )} />
                            ) : (
                              <Lock className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {/* Mobile progress bar */}
                        {progressPct > 0 && (
                          <Progress value={progressPct} className="h-1.5 mt-3 md:hidden" />
                        )}
                      </CardContent>
                    </button>

                    {/* Expanded lesson list */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-6 md:px-6 border-t border-border/50 pt-4">
                            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                              Lessons
                            </h4>
                            {lessonsLoading ? (
                              <div className="space-y-2">
                                {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {levelLessons.map((lesson, lIdx) => {
                                  const isDone = completedLessonIds instanceof Set && completedLessonIds.has(lesson.id);
                                  return (
                                    <motion.div
                                      key={lesson.id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: lIdx * 0.04 }}
                                    >
                                      <button
                                        className={cn(
                                          "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 group",
                                          isDone 
                                            ? "bg-success/5 border-success/20 hover:bg-success/10" 
                                            : "bg-card border-border/50 hover:border-primary/30 hover:bg-primary/5"
                                        )}
                                        onClick={() => setActiveLessonId(lesson.id)}
                                      >
                                        <div className={cn(
                                          "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                                          isDone 
                                            ? "bg-success/10 text-success" 
                                            : "bg-primary/10 text-primary"
                                        )}>
                                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : (lesson.order_index || lIdx + 1)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium truncate">{lesson.title}</p>
                                          {lesson.description && (
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">{lesson.description}</p>
                                          )}
                                          <span className="inline-block text-xs text-muted-foreground capitalize mt-1 px-2 py-0.5 rounded-full bg-muted/30">
                                            {lesson.category}
                                          </span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                                      </button>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            )}

                            {levelQuizzes.length > 0 && (
                              <>
                                <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3 mt-6">
                                  Quizzes
                                </h4>
                                <div className="space-y-2">
                                  {levelQuizzes.map((quiz, qIdx) => (
                                    <motion.div
                                      key={quiz.id}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: qIdx * 0.04 }}
                                    >
                                      <button
                                        className="w-full text-left p-4 rounded-xl border border-border/50 bg-card hover:border-accent-foreground/20 hover:bg-accent/30 transition-all duration-200 flex items-center gap-4 group"
                                        onClick={() => setActiveQuizId(quiz.id)}
                                      >
                                        <div className="w-10 h-10 rounded-xl bg-accent/50 flex items-center justify-center shrink-0">
                                          <Star className="w-5 h-5 text-accent-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium truncate">{quiz.title}</p>
                                          <p className="text-xs text-muted-foreground capitalize">{quiz.quiz_type.replace('_', ' ')}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent-foreground transition-colors shrink-0" />
                                      </button>
                                    </motion.div>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Lesson Viewer Dialog */}
      <Dialog open={!!activeLessonId && !!activeLessonData?.sections?.length} onOpenChange={() => setActiveLessonId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
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
