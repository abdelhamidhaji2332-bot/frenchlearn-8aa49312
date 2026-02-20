import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Medal, Crown, Flame, Star, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  user_id: string;
  username: string | null;
  xp_points: number;
  level: string;
  streak_days: number;
  avatar_url: string | null;
}

const rankIcons = [
  <Crown className="w-6 h-6 text-yellow-400" />,
  <Medal className="w-6 h-6 text-gray-300" />,
  <Medal className="w-6 h-6 text-amber-600" />,
];

const Leaderboard = () => {
  const { user } = useAuth();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, username, xp_points, level, streak_days, avatar_url")
        .order("xp_points", { ascending: false })
        .limit(50);
      return (data || []) as LeaderboardEntry[];
    },
  });

  const userRank = entries.findIndex(e => e.user_id === user?.id) + 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Trophy className="w-4 h-4" />
              Classement
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
              Leaderboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Compete with other learners and climb the ranks!
            </p>
            {userRank > 0 && (
              <motion.p
                className="mt-3 text-primary font-semibold"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                You are ranked #{userRank} 🎉
              </motion.p>
            )}
          </motion.div>

          {/* Top 3 Podium */}
          {!isLoading && entries.length >= 3 && (
            <motion.div
              className="grid grid-cols-3 gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {[1, 0, 2].map((idx) => {
                const entry = entries[idx];
                if (!entry) return null;
                const isFirst = idx === 0;
                return (
                  <motion.div
                    key={entry.user_id}
                    className={cn("flex flex-col items-center", isFirst && "order-first md:order-none -mt-4")}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                  >
                    <Card className={cn(
                      "w-full text-center overflow-hidden",
                      isFirst ? "border-yellow-400/50 bg-yellow-400/5" : "border-border/50"
                    )}>
                      <CardContent className="p-4 pt-6">
                        <div className="mb-2">{rankIcons[idx]}</div>
                        <div className={cn(
                          "w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-lg",
                          isFirst
                            ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-black"
                            : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                        )}>
                          {(entry.username || "?").charAt(0).toUpperCase()}
                        </div>
                        <p className="font-semibold text-sm truncate">{entry.username || "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground">{entry.level}</p>
                        <p className={cn(
                          "text-lg font-bold mt-1",
                          isFirst ? "text-yellow-400" : "text-primary"
                        )}>
                          {entry.xp_points?.toLocaleString() || 0} XP
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Full List */}
          <div className="space-y-2">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))
            ) : (
              entries.map((entry, idx) => {
                const isCurrentUser = entry.user_id === user?.id;
                return (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Card className={cn(
                      "transition-all duration-200",
                      isCurrentUser && "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                    )}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                          idx < 3
                            ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-black"
                            : "bg-muted text-muted-foreground"
                        )}>
                          {idx + 1}
                        </div>
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0",
                          "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                        )}>
                          {(entry.username || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {entry.username || "Anonymous"}
                            {isCurrentUser && <span className="text-primary ml-2 text-xs">(you)</span>}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3" /> {entry.level}
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-destructive" /> {entry.streak_days || 0}d streak
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-primary">{entry.xp_points?.toLocaleString() || 0}</p>
                          <p className="text-xs text-muted-foreground">XP</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Leaderboard;
