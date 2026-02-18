import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSRS } from "@/hooks/useSRS";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Volume2, RotateCcw, Brain, Flame, Trophy, ChevronRight,
  Loader2, BookOpen, CheckCircle2, XCircle, ArrowRight
} from "lucide-react";

const categories = [
  { id: "greetings", name: "Salutations", icon: "👋" },
  { id: "family", name: "Famille", icon: "👨‍👩‍👧" },
  { id: "food", name: "Nourriture", icon: "🍽️" },
  { id: "colors", name: "Couleurs", icon: "🎨" },
  { id: "numbers", name: "Nombres", icon: "🔢" },
  { id: "travel", name: "Voyage", icon: "✈️" },
  { id: "animals", name: "Animaux", icon: "🦁" },
  { id: "body", name: "Corps", icon: "🫀" },
  { id: "clothing", name: "Vêtements", icon: "👕" },
  { id: "weather", name: "Météo", icon: "🌤️" },
  { id: "emotions", name: "Émotions", icon: "😊" },
  { id: "verbs", name: "Verbes", icon: "💫" },
];

const FlashcardView = ({ category }: { category?: string }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const {
    currentCard, loading, stats, sessionResults,
    progress, isSessionComplete, answerCard, restartSession, currentIndex, cards
  } = useSRS(category);

  const speakWord = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = (quality: number) => {
    setIsFlipped(false);
    setTimeout(() => answerCard(quality), 300);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading flashcards...</p>
      </div>
    );
  }

  if (isSessionComplete) {
    const total = sessionResults.correct + sessionResults.incorrect;
    const pct = total > 0 ? Math.round((sessionResults.correct / total) * 100) : 0;
    return (
      <motion.div
        className="max-w-lg mx-auto text-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-2">Session Complete!</h2>
        <p className="text-muted-foreground mb-8">Great job reviewing your vocabulary</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card variant="glass">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary">{sessionResults.correct}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-4 text-center">
              <XCircle className="w-6 h-6 text-destructive mx-auto mb-1" />
              <p className="text-2xl font-bold text-destructive">{sessionResults.incorrect}</p>
              <p className="text-xs text-muted-foreground">To Review</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardContent className="p-4 text-center">
              <Brain className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-primary">{pct}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </CardContent>
          </Card>
        </div>

        <Button size="lg" onClick={restartSession}>
          <RotateCcw className="w-5 h-5 mr-2" />
          Start New Session
        </Button>
      </motion.div>
    );
  }

  if (!currentCard) {
    return (
      <div className="text-center py-20">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-display font-semibold mb-2">No cards to review!</h3>
        <p className="text-muted-foreground mb-6">All caught up. Come back later for more reviews.</p>
        <Button onClick={restartSession} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Card {currentIndex + 1} of {cards.length}</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6 mb-6 text-sm">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Brain className="w-4 h-4" /> {stats.dueCards} due
        </span>
        <span className="flex items-center gap-1 text-primary">
          <CheckCircle2 className="w-4 h-4" /> {sessionResults.correct}
        </span>
        <span className="flex items-center gap-1 text-destructive">
          <XCircle className="w-4 h-4" /> {sessionResults.incorrect}
        </span>
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.vocabulary_id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="perspective-1000"
        >
          <motion.div
            className="relative w-full min-h-[320px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front */}
            <Card
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden" }}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[320px]">
                {currentCard.is_new && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                    New word
                  </span>
                )}
                <span className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {currentCard.category}
                </span>
                <h3 className="text-4xl font-display font-bold text-primary mb-3">
                  {currentCard.french}
                </h3>
                {currentCard.pronunciation && (
                  <p className="text-muted-foreground italic mb-4">
                    [{currentCard.pronunciation}]
                  </p>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(currentCard.french);
                  }}
                >
                  <Volume2 className="w-6 h-6" />
                </Button>
                <p className="text-sm text-muted-foreground mt-6 flex items-center gap-1">
                  Tap to reveal <ArrowRight className="w-3 h-3" />
                </p>
              </CardContent>
            </Card>

            {/* Back */}
            <Card
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[320px]">
                <h3 className="text-3xl font-display font-bold mb-2">
                  {currentCard.english}
                </h3>
                {currentCard.arabic && (
                  <p className="text-xl text-muted-foreground mb-4" dir="rtl">
                    {currentCard.arabic}
                  </p>
                )}
                {currentCard.example_sentence && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg w-full">
                    <p className="text-sm font-medium text-primary">
                      {currentCard.example_sentence}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {currentCard.example_translation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Answer buttons - only show when flipped */}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            className="flex gap-3 mt-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Button
              variant="destructive"
              size="lg"
              onClick={(e) => { e.stopPropagation(); handleAnswer(1); }}
            >
              <XCircle className="w-5 h-5 mr-2" />
              Again
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={(e) => { e.stopPropagation(); handleAnswer(3); }}
            >
              Hard
            </Button>
            <Button
              size="lg"
              onClick={(e) => { e.stopPropagation(); handleAnswer(4); }}
            >
              Good
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={(e) => { e.stopPropagation(); handleAnswer(5); }}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Easy
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Flashcards = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [started, setStarted] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-4 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Sign in to use Flashcards</h2>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
              <Brain className="inline w-10 h-10 mr-3 text-primary" />
              Flashcards SRS
            </h1>
            <p className="text-lg text-muted-foreground">
              Spaced repetition for optimal memorization
            </p>
          </motion.div>

          {!started ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Category Selection */}
              <h2 className="text-xl font-display font-semibold mb-4 text-center">
                Choose a category or review all
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                <Card
                  variant="glass"
                  className={`cursor-pointer hover-lift transition-all ${!selectedCategory ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedCategory(undefined)}
                >
                  <CardContent className="p-4 text-center">
                    <span className="text-2xl mb-1 block">🌍</span>
                    <p className="font-medium text-sm">All Words</p>
                  </CardContent>
                </Card>
                {categories.map(cat => (
                  <Card
                    key={cat.id}
                    variant="glass"
                    className={`cursor-pointer hover-lift transition-all ${selectedCategory === cat.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <span className="text-2xl mb-1 block">{cat.icon}</span>
                      <p className="font-medium text-sm">{cat.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button size="xl" onClick={() => setStarted(true)}>
                  <Flame className="w-5 h-5 mr-2" />
                  Start Review Session
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <FlashcardView category={selectedCategory} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Flashcards;
