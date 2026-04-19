import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Timer, Zap, Brain, Trophy, RotateCcw, ChevronRight,
  CheckCircle2, XCircle, Volume2, Loader2, Gamepad2, Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface WordPair {
  id: string;
  french: string;
  english: string;
  pronunciation?: string;
}

// ============ TIMED CHALLENGE ============
const TimedChallenge = () => {
  const [words, setWords] = useState<WordPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    const { data } = await supabase
      .from("vocabulary")
      .select("id, french, english, pronunciation")
      .limit(100);
    if (data && data.length > 0) {
      const shuffled = data.sort(() => Math.random() - 0.5);
      setWords(shuffled);
      generateOptions(shuffled, 0);
    }
    setLoading(false);
  };

  const generateOptions = (wordList: WordPair[], idx: number) => {
    const correct = wordList[idx].english;
    const others = wordList
      .filter((_, i) => i !== idx)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.english);
    setOptions([correct, ...others].sort(() => Math.random() - 0.5));
  };

  const startGame = () => {
    setIsRunning(true);
    setScore(0);
    setCurrentIndex(0);
    setTimeLeft(60);
    setIsComplete(false);
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    generateOptions(shuffled, 0);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAnswer = (answer: string) => {
    if (!isRunning || feedback) return;
    const isCorrect = answer === words[currentIndex].english;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore(prev => prev + 10);

    setTimeout(() => {
      setFeedback(null);
      const nextIdx = currentIndex + 1;
      if (nextIdx >= words.length) {
        clearInterval(timerRef.current!);
        setIsRunning(false);
        setIsComplete(true);
      } else {
        setCurrentIndex(nextIdx);
        generateOptions(words, nextIdx);
      }
    }, 500);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (isComplete) {
    if (score > 80) confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    return (
      <motion.div className="max-w-md mx-auto text-center py-12" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-display font-bold mb-2">Time's Up!</h2>
        <p className="text-5xl font-bold text-primary my-4">{score} pts</p>
        <p className="text-muted-foreground mb-6">
          {currentIndex} words answered in 60 seconds
        </p>
        <Button size="lg" onClick={startGame}>
          <RotateCcw className="w-5 h-5 mr-2" /> Play Again
        </Button>
      </motion.div>
    );
  }

  if (!isRunning) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <Zap className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold mb-3">Timed Vocabulary Challenge</h2>
        <p className="text-muted-foreground mb-6">
          Translate as many words as you can in 60 seconds!
        </p>
        <Button size="lg" onClick={startGame}>
          <Timer className="w-5 h-5 mr-2" /> Start Challenge
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Star className="w-5 h-5" /> {score} pts
        </div>
        <div className={cn(
          "flex items-center gap-2 font-bold text-lg",
          timeLeft <= 10 ? "text-destructive animate-pulse" : "text-muted-foreground"
        )}>
          <Timer className="w-5 h-5" /> {timeLeft}s
        </div>
      </div>
      <Progress value={(timeLeft / 60) * 100} className="h-2 mb-6" />

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          <Card className={cn(
            "text-center mb-6 transition-colors",
            feedback === "correct" && "border-success bg-success/5",
            feedback === "wrong" && "border-destructive bg-destructive/5"
          )}>
            <CardContent className="p-8">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Translate to English</p>
              <h3 className="text-2xl sm:text-4xl font-display font-bold text-primary">{words[currentIndex]?.french}</h3>
              {words[currentIndex]?.pronunciation && (
                <p className="text-sm text-muted-foreground mt-1">[{words[currentIndex].pronunciation}]</p>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {options.map((opt, i) => (
              <Button
                key={i}
                variant="outline"
                size="lg"
                className={cn(
                  "h-auto py-4 text-base transition-all",
                  feedback && opt === words[currentIndex].english && "bg-success/20 border-success text-success",
                  feedback === "wrong" && opt !== words[currentIndex].english && "opacity-50"
                )}
                onClick={() => handleAnswer(opt)}
                disabled={!!feedback}
              >
                {opt}
              </Button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ============ MEMORY GAME ============
interface MemoryCard {
  id: number;
  text: string;
  matchId: string;
  type: "french" | "english";
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame = () => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const totalPairs = 6;

  useEffect(() => { loadGame(); }, []);

  const loadGame = async () => {
    const { data } = await supabase
      .from("vocabulary")
      .select("id, french, english")
      .limit(50);
    if (data && data.length >= totalPairs) {
      const selected = data.sort(() => Math.random() - 0.5).slice(0, totalPairs);
      const gameCards: MemoryCard[] = [];
      selected.forEach((w, i) => {
        gameCards.push({ id: i * 2, text: w.french, matchId: w.id, type: "french", isFlipped: false, isMatched: false });
        gameCards.push({ id: i * 2 + 1, text: w.english, matchId: w.id, type: "english", isFlipped: false, isMatched: false });
      });
      setCards(gameCards.sort(() => Math.random() - 0.5));
      setMatches(0);
      setMoves(0);
      setIsComplete(false);
      setFlippedIds([]);
    }
    setLoading(false);
  };

  const handleFlip = (id: number) => {
    if (flippedIds.length >= 2) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
    setCards(newCards);
    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped.map(fid => newCards.find(c => c.id === fid)!);
      if (first.matchId === second.matchId && first.type !== second.type) {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.matchId === first.matchId ? { ...c, isMatched: true } : c
          ));
          setFlippedIds([]);
          const newMatches = matches + 1;
          setMatches(newMatches);
          if (newMatches === totalPairs) {
            setIsComplete(true);
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
          setFlippedIds([]);
        }, 800);
      }
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (isComplete) {
    const stars = moves <= totalPairs + 2 ? 3 : moves <= totalPairs + 5 ? 2 : 1;
    return (
      <motion.div className="max-w-md mx-auto text-center py-12" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-display font-bold mb-2">All Matched!</h2>
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3].map(i => (
            <Star key={i} className={cn("w-8 h-8", i <= stars ? "text-yellow-400 fill-yellow-400" : "text-muted")} />
          ))}
        </div>
        <p className="text-muted-foreground mb-6">{moves} moves to match {totalPairs} pairs</p>
        <Button size="lg" onClick={loadGame}>
          <RotateCcw className="w-5 h-5 mr-2" /> Play Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground">Matches: {matches}/{totalPairs}</span>
        <span className="text-sm text-muted-foreground">Moves: {moves}</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        {cards.map(card => (
          <motion.button
            key={card.id}
            className={cn(
              "aspect-square rounded-lg sm:rounded-xl border-2 flex items-center justify-center p-1.5 sm:p-2 text-center transition-all duration-200 text-xs sm:text-sm font-medium",
              card.isMatched
                ? "bg-success/10 border-success/30 text-success"
                : card.isFlipped
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-card border-border hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
            )}
            onClick={() => handleFlip(card.id)}
            whileTap={{ scale: 0.95 }}
            disabled={card.isMatched || card.isFlipped}
          >
            {card.isFlipped || card.isMatched ? (
              <span className={cn(card.type === "french" ? "font-display font-bold" : "")}>
                {card.text}
              </span>
            ) : (
              <span className="text-2xl">?</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ============ MAIN GAMES PAGE ============
const Games = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState<"timed" | "memory" | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-4 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Sign in to play games</h2>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const games = [
    {
      id: "timed" as const,
      icon: <Zap className="w-8 h-8" />,
      title: "Timed Challenge",
      description: "Translate as many words as possible in 60 seconds",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "memory" as const,
      icon: <Brain className="w-8 h-8" />,
      title: "Word Memory",
      description: "Match French words with their English translations",
      gradient: "from-blue-500 to-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Gamepad2 className="w-4 h-4" />
              Game Mode
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mb-3">Jeux Éducatifs</h1>
            <p className="text-sm sm:text-lg text-muted-foreground">Learn French while having fun!</p>
          </motion.div>

          {!activeGame ? (
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {games.map((game, idx) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card
                    className="cursor-pointer hover-lift overflow-hidden group"
                    onClick={() => setActiveGame(game.id)}
                  >
                    <CardContent className="p-0">
                      <div className={cn("bg-gradient-to-br p-8 text-white", game.gradient)}>
                        {game.icon}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-display font-bold mb-2">{game.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{game.description}</p>
                        <Button className="w-full group-hover:bg-primary">
                          Play Now <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <>
              <Button variant="ghost" className="mb-6" onClick={() => setActiveGame(null)}>
                ← Back to Games
              </Button>
              {activeGame === "timed" && <TimedChallenge />}
              {activeGame === "memory" && <MemoryGame />}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Games;
