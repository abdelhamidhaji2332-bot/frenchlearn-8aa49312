import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface DashboardLesson {
  id: string;
  title: string;
  description: string | null;
  progress: number;
  completed: boolean;
  level: string;
  category: string;
}

export interface DailyWord {
  french: string;
  english: string;
  pronunciation: string | null;
  example: string | null;
  arabic: string | null;
}

export const useDashboardData = () => {
  const { user, profile } = useAuth();

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["dashboard-lessons", user?.id, profile?.level],
    queryFn: async () => {
      if (!user) return [];
      const level = profile?.level || "A1";

      // Get lessons for current level
      const { data: lessonRows, error } = await supabase
        .from("lessons")
        .select("id, title, description, level, category, order_index")
        .eq("level", level)
        .order("order_index", { ascending: true })
        .limit(5);

      if (error || !lessonRows) return [];

      // Get user progress for these lessons
      const { data: progressRows } = await supabase
        .from("user_progress")
        .select("lesson_id, completed, score")
        .eq("user_id", user.id)
        .in("lesson_id", lessonRows.map((l) => l.id));

      const progressMap = new Map(
        (progressRows || []).map((p) => [p.lesson_id, p])
      );

      return lessonRows.map((lesson): DashboardLesson => {
        const prog = progressMap.get(lesson.id);
        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          progress: prog ? (prog.completed ? 100 : (prog.score ?? 50)) : 0,
          completed: prog?.completed ?? false,
          level: lesson.level,
          category: lesson.category,
        };
      });
    },
    enabled: !!user,
  });

  const { data: dailyWord, isLoading: wordLoading } = useQuery({
    queryKey: ["daily-word", new Date().toDateString()],
    queryFn: async () => {
      // Use the day of year as a seed for consistent daily word
      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
      );

      const { count } = await supabase
        .from("vocabulary")
        .select("*", { count: "exact", head: true });

      if (!count || count === 0) return null;

      const index = dayOfYear % count;

      const { data } = await supabase
        .from("vocabulary")
        .select("french, english, pronunciation, example_sentence, arabic")
        .range(index, index)
        .limit(1)
        .single();

      if (!data) return null;

      return {
        french: data.french,
        english: data.english,
        pronunciation: data.pronunciation,
        example: data.example_sentence,
        arabic: data.arabic,
      } as DailyWord;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user) return null;

      // Count completed lessons
      const { count: completedLessons } = await supabase
        .from("user_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("completed", true);

      // Count total lessons for current level
      const level = profile?.level || "A1";
      const { count: totalLessons } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true })
        .eq("level", level);

      // Count quiz attempts today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { count: quizzesToday } = await supabase
        .from("user_quiz_attempts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("started_at", todayStart.toISOString());

      // Words learned = vocabulary items the user has encountered in completed lessons
      // Approximate via completed lessons * avg words per lesson
      const wordsLearned = (completedLessons || 0) * 15;

      const levelProgress =
        totalLessons && totalLessons > 0
          ? Math.round(((completedLessons || 0) / totalLessons) * 100)
          : 0;

      return {
        completedLessons: completedLessons || 0,
        totalLessons: totalLessons || 0,
        levelProgress,
        quizzesToday: quizzesToday || 0,
        wordsLearned,
      };
    },
    enabled: !!user,
  });

  const levelLabels: Record<string, string> = {
    A1: "Débutant",
    A2: "Élémentaire",
    B1: "Intermédiaire",
    B2: "Avancé",
    C1: "Autonome",
    C2: "Maîtrise",
  };

  const nextLevel: Record<string, string> = {
    A1: "A2",
    A2: "B1",
    B1: "B2",
    B2: "C1",
    C1: "C2",
    C2: "C2",
  };

  const currentLevel = profile?.level || "A1";

  return {
    profile,
    currentLevel,
    levelLabel: levelLabels[currentLevel] || "Débutant",
    nextLevel: nextLevel[currentLevel] || "A2",
    xpPoints: profile?.xp_points ?? 0,
    streakDays: profile?.streak_days ?? 0,
    lessons,
    dailyWord,
    stats,
    isLoading: lessonsLoading || wordLoading || statsLoading,
  };
};
