import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Flame, 
  Trophy, 
  Calendar, 
  Clock, 
  ChevronRight,
  Volume2,
  Star,
  Target
} from "lucide-react";

const Dashboard = () => {
  const currentLevel = "A2";
  const progress = 67;
  const streak = 12;
  const wordsLearned = 324;

  const dailyWord = {
    french: "Papillon",
    english: "Butterfly",
    pronunciation: "/pa.pi.jɔ̃/",
    example: "Le papillon vole dans le jardin.",
  };

  const todayLessons = [
    { id: 1, title: "Les couleurs", subtitle: "Colors", progress: 100, completed: true },
    { id: 2, title: "Au restaurant", subtitle: "At the restaurant", progress: 45, completed: false },
    { id: 3, title: "Les verbes du 1er groupe", subtitle: "1st group verbs", progress: 0, completed: false },
  ];

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
              Bonjour, Student! 👋
            </h1>
            <p className="text-muted-foreground">
              Ready for today's French adventure?
            </p>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass" className="hover-lift">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground">
                    <span className="font-display font-bold">{currentLevel}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Level</p>
                    <p className="font-semibold">Élémentaire</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="glass" className="hover-lift">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Streak</p>
                    <p className="font-semibold">{streak} days 🔥</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="glass" className="hover-lift">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center text-secondary-foreground">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Words Learned</p>
                    <p className="font-semibold">{wordsLearned}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="glass" className="hover-lift">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">XP Points</p>
                    <p className="font-semibold">2,450</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
                        <p className="text-sm text-muted-foreground">A2 → B1</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-secondary">{progress}%</span>
                      </div>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">
                      33% more to reach B1 level
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
                  <h2 className="text-xl font-display font-semibold">Today's Lessons</h2>
                  <Link to="/levels">
                    <Button variant="ghost" size="sm">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {todayLessons.map((lesson, index) => (
                    <Card
                      key={lesson.id}
                      variant="glass"
                      className={`hover-lift cursor-pointer ${lesson.completed ? "opacity-75" : ""}`}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          lesson.completed 
                            ? "bg-success text-success-foreground" 
                            : lesson.progress > 0 
                              ? "bg-secondary/20 text-secondary" 
                              : "bg-muted text-muted-foreground"
                        }`}>
                          {lesson.completed ? (
                            <Star className="w-6 h-6 fill-current" />
                          ) : (
                            <Target className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{lesson.title}</h4>
                          <p className="text-sm text-muted-foreground">{lesson.subtitle}</p>
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
                    <h3 className="text-3xl font-display font-bold">{dailyWord.french}</h3>
                    <p className="text-sm opacity-80">{dailyWord.pronunciation}</p>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-lg font-medium mb-2">{dailyWord.english}</p>
                    <p className="text-sm text-muted-foreground italic">
                      "{dailyWord.example}"
                    </p>
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
                        <p className="text-sm text-muted-foreground">5 questions</p>
                      </div>
                    </div>
                    <Button variant="gold" className="w-full">
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Study Timer */}
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
                        <h4 className="font-semibold">Today's Study Time</h4>
                        <p className="text-2xl font-display font-bold text-primary">45 min</p>
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
