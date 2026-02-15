import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  BookOpen,
  Flame,
  Trophy,
  Calendar,
  Clock,
  ChevronRight,
  Volume2,
  Star,
  Target,
} from "lucide-react";

const StatCard = ({
  icon,
  iconBg,
  label,
  value,
  delay,
  loading,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  delay: number;
  loading?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card variant="glass" className="hover-lift">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="h-5 w-16 mt-1" />
          ) : (
            <p className="font-semibold">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    profile,
    currentLevel,
    levelLabel,
    nextLevel,
    xpPoints,
    streakDays,
    lessons,
    dailyWord,
    stats,
    isLoading,
  } = useDashboardData();

  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const username = profile?.username || user?.email?.split("@")[0] || "Student";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Bonjour, {username}! 👋
            </h1>
            <p className="text-muted-foreground">
              Ready for today's French adventure?
            </p>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<span className="font-display font-bold text-primary-foreground">{currentLevel}</span>}
              iconBg="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
              label="Current Level"
              value={levelLabel}
              delay={0.1}
              loading={isLoading}
            />
            <StatCard
              icon={<Flame className="w-6 h-6" />}
              iconBg="bg-gradient-to-br from-orange-500 to-red-500 text-white"
              label="Streak"
              value={`${streakDays} days 🔥`}
              delay={0.2}
              loading={isLoading}
            />
            <StatCard
              icon={<BookOpen className="w-6 h-6" />}
              iconBg="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground"
              label="Words Learned"
              value={String(stats?.wordsLearned ?? 0)}
              delay={0.3}
              loading={isLoading}
            />
            <StatCard
              icon={<Trophy className="w-6 h-6" />}
              iconBg="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
              label="XP Points"
              value={xpPoints.toLocaleString()}
              delay={0.4}
              loading={isLoading}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Level Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card variant="gradient">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-display font-semibold text-lg">Level Progress</h3>
                        <p className="text-sm text-muted-foreground">
                          {currentLevel} → {nextLevel}
                        </p>
                      </div>
                      <div className="text-right">
                        {isLoading ? (
                          <Skeleton className="h-8 w-12" />
                        ) : (
                          <span className="text-2xl font-bold text-secondary">
                            {stats?.levelProgress ?? 0}%
                          </span>
                        )}
                      </div>
                    </div>
                    <Progress value={stats?.levelProgress ?? 0} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {stats?.completedLessons ?? 0} / {stats?.totalLessons ?? 0} lessons completed
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Today's Lessons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-semibold">Your Lessons</h2>
                  <Link to="/levels">
                    <Button variant="ghost" size="sm">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-xl" />
                    ))}
                  </div>
                ) : lessons.length === 0 ? (
                  <Card variant="glass">
                    <CardContent className="p-6 text-center text-muted-foreground">
                      <Target className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>No lessons available for level {currentLevel} yet.</p>
                      <Link to="/levels">
                        <Button variant="outline" className="mt-3">Browse All Levels</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <Card
                        key={lesson.id}
                        variant="glass"
                        className={`hover-lift cursor-pointer ${lesson.completed ? "opacity-75" : ""}`}
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              lesson.completed
                                ? "bg-success text-success-foreground"
                                : lesson.progress > 0
                                ? "bg-secondary/20 text-secondary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {lesson.completed ? (
                              <Star className="w-6 h-6 fill-current" />
                            ) : (
                              <Target className="w-6 h-6" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{lesson.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {lesson.category} · {lesson.level}
                            </p>
                          </div>
                          {!lesson.completed && lesson.progress > 0 && (
                            <div className="w-24">
                              <Progress value={lesson.progress} className="h-2" />
                            </div>
                          )}
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Daily Word */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card variant="elevated" className="overflow-hidden">
                  <div className="bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm opacity-80">Mot du jour</span>
                      <button className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    {isLoading || !dailyWord ? (
                      <>
                        <Skeleton className="h-8 w-32 bg-primary-foreground/20 mb-1" />
                        <Skeleton className="h-4 w-20 bg-primary-foreground/20" />
                      </>
                    ) : (
                      <>
                        <h3 className="text-3xl font-display font-bold">{dailyWord.french}</h3>
                        <p className="text-sm opacity-80">{dailyWord.pronunciation || ""}</p>
                      </>
                    )}
                  </div>
                  <CardContent className="p-4">
                    {isLoading || !dailyWord ? (
                      <>
                        <Skeleton className="h-5 w-24 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium mb-2">{dailyWord.english}</p>
                        {dailyWord.example && (
                          <p className="text-sm text-muted-foreground italic">
                            "{dailyWord.example}"
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Daily Quiz */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Card variant="glass" className="hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Daily Quiz</h4>
                        <p className="text-sm text-muted-foreground">
                          {stats?.quizzesToday ?? 0} completed today
                        </p>
                      </div>
                    </div>
                    <Button variant="gold" className="w-full">
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Study Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Card variant="glass">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Lessons Completed</h4>
                        {isLoading ? (
                          <Skeleton className="h-7 w-12 mt-1" />
                        ) : (
                          <p className="text-2xl font-display font-bold text-primary">
                            {stats?.completedLessons ?? 0}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
