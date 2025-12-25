import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, ChevronRight, BookOpen, Volume2, 
  CheckCircle2, Trophy, Star, RotateCcw 
} from 'lucide-react';
import { QuizQuestion, QuestionType } from './QuizQuestion';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface Question {
  id: string;
  question_type: QuestionType;
  question_text: string;
  question_audio_text?: string;
  options?: string[];
  correct_answer?: string;
  correct_answers?: string[];
  explanation?: string;
  image_url?: string;
  points: number;
}

interface QuizContainerProps {
  quizId: string;
  title: string;
  description?: string;
  questions: Question[];
  passingScore?: number;
  onComplete?: (score: number, passed: boolean) => void;
  onClose?: () => void;
}

export const QuizContainer = ({
  quizId,
  title,
  description,
  questions,
  passingScore = 70,
  onComplete,
  onClose,
}: QuizContainerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { isCorrect: boolean; answer: string | string[] }>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  
  const handleAnswer = (isCorrect: boolean, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { isCorrect, answer }
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      calculateFinalScore();
    }
  };

  const calculateFinalScore = async () => {
    let totalScore = 0;
    let totalMaxScore = 0;

    questions.forEach(q => {
      totalMaxScore += q.points;
      if (answers[q.id]?.isCorrect) {
        totalScore += q.points;
      }
    });

    const percentage = Math.round((totalScore / totalMaxScore) * 100);
    const passed = percentage >= passingScore;

    setScore(totalScore);
    setMaxScore(totalMaxScore);
    setIsCompleted(true);

    // Celebration animation for passing
    if (passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Save attempt to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_quiz_attempts').insert({
          user_id: user.id,
          quiz_id: quizId,
          score: totalScore,
          max_score: totalMaxScore,
          percentage,
          passed,
          answers,
          completed_at: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Failed to save quiz attempt:', err);
    }

    onComplete?.(percentage, passed);
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setIsCompleted(false);
    setScore(0);
    setMaxScore(0);
  };

  if (isCompleted) {
    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= passingScore;
    const correctCount = Object.values(answers).filter(a => a.isCorrect).length;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto"
      >
        <Card className={cn(
          "overflow-hidden",
          passed ? "border-success" : "border-warning"
        )}>
          <div className={cn(
            "p-6 text-center",
            passed ? "bg-success/10" : "bg-warning/10"
          )}>
            {passed ? (
              <Trophy className="w-16 h-16 mx-auto text-success mb-4" />
            ) : (
              <Star className="w-16 h-16 mx-auto text-warning mb-4" />
            )}
            <h2 className="text-2xl font-display font-bold mb-2">
              {passed ? 'Félicitations!' : 'Keep Practicing!'}
            </h2>
            <p className="text-muted-foreground">
              {passed 
                ? "You've passed this quiz!" 
                : `You need ${passingScore}% to pass. Keep learning!`
              }
            </p>
          </div>
          
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-5xl font-display font-bold text-primary mb-2">
                {percentage}%
              </div>
              <p className="text-muted-foreground">
                {correctCount} of {questions.length} correct
              </p>
              <p className="text-sm text-muted-foreground">
                {score} / {maxScore} points
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleRetry}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                className="flex-1"
                onClick={onClose}
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-display font-bold">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">
              {currentIndex + 1}
            </span>
            <span className="text-muted-foreground">/{questions.length}</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <QuizQuestion
            questionType={currentQuestion.question_type}
            questionText={currentQuestion.question_text}
            questionAudioText={currentQuestion.question_audio_text}
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correct_answer}
            correctAnswers={currentQuestion.correct_answers}
            explanation={currentQuestion.explanation}
            imageUrl={currentQuestion.image_url}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
