import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Volume2, ArrowRight, Shuffle } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { cn } from '@/lib/utils';

export type QuestionType = 'mcq' | 'fill_blank' | 'matching' | 'reorder' | 'listening';

interface QuizQuestionProps {
  questionType: QuestionType;
  questionText: string;
  questionAudioText?: string;
  options?: string[];
  matchingPairs?: { left: string; right: string }[];
  correctAnswer?: string;
  correctAnswers?: string[];
  explanation?: string;
  imageUrl?: string;
  onAnswer: (isCorrect: boolean, answer: string | string[]) => void;
  onNext: () => void;
}

export const QuizQuestion = ({
  questionType,
  questionText,
  questionAudioText,
  options = [],
  matchingPairs = [],
  correctAnswer,
  correctAnswers = [],
  explanation,
  imageUrl,
  onAnswer,
  onNext,
}: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [reorderedWords, setReorderedWords] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { speak, isSpeaking } = useTextToSpeech();

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setTextAnswer('');
    setMatchedPairs({});
    setReorderedWords([]);
    setIsAnswered(false);
    setIsCorrect(false);

    // Initialize reorder with shuffled words
    if (questionType === 'reorder' && correctAnswers.length > 0) {
      const shuffled = [...correctAnswers].sort(() => Math.random() - 0.5);
      setReorderedWords(shuffled);
    }
  }, [questionText, questionType, correctAnswers]);

  const handleMCQSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    let correct = false;
    let answer: string | string[] = '';

    switch (questionType) {
      case 'mcq':
      case 'listening':
        correct = selectedAnswer?.toLowerCase() === correctAnswer?.toLowerCase();
        answer = selectedAnswer || '';
        break;
      case 'fill_blank':
        correct = textAnswer.toLowerCase().trim() === correctAnswer?.toLowerCase().trim();
        answer = textAnswer;
        break;
      case 'matching':
        // Check if all pairs are correctly matched
        correct = matchingPairs.every(pair => 
          matchedPairs[pair.left] === pair.right
        );
        answer = Object.entries(matchedPairs).map(([k, v]) => `${k}-${v}`);
        break;
      case 'reorder':
        correct = JSON.stringify(reorderedWords) === JSON.stringify(correctAnswers);
        answer = reorderedWords;
        break;
    }

    setIsCorrect(correct);
    setIsAnswered(true);
    onAnswer(correct, answer);
  };

  const handleWordReorder = (fromIndex: number, toIndex: number) => {
    const newOrder = [...reorderedWords];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);
    setReorderedWords(newOrder);
  };

  const shuffleWords = () => {
    setReorderedWords([...reorderedWords].sort(() => Math.random() - 0.5));
  };

  const renderQuestion = () => {
    switch (questionType) {
      case 'mcq':
        return (
          <div className="space-y-3">
            {options.map((option, index) => (
              <motion.button
                key={index}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left transition-all",
                  selectedAnswer === option
                    ? isAnswered
                      ? isCorrect
                        ? "border-success bg-success/10 text-success"
                        : option === correctAnswer
                          ? "border-success bg-success/10"
                          : "border-destructive bg-destructive/10 text-destructive"
                      : "border-primary bg-primary/10"
                    : isAnswered && option === correctAnswer
                      ? "border-success bg-success/10"
                      : "border-border hover:border-primary/50"
                )}
                onClick={() => handleMCQSelect(option)}
                whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                whileTap={{ scale: isAnswered ? 1 : 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {isAnswered && (
                    option === correctAnswer ? (
                      <Check className="w-5 h-5 text-success" />
                    ) : selectedAnswer === option ? (
                      <X className="w-5 h-5 text-destructive" />
                    ) : null
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'fill_blank':
        return (
          <div className="space-y-4">
            <div className="text-lg">
              {questionText.split('___').map((part, index, arr) => (
                <span key={index}>
                  {part}
                  {index < arr.length - 1 && (
                    <span className="inline-block mx-2 min-w-[100px] border-b-2 border-primary">
                      {isAnswered ? (
                        <span className={cn(
                          "font-bold",
                          isCorrect ? "text-success" : "text-destructive"
                        )}>
                          {textAnswer}
                        </span>
                      ) : null}
                    </span>
                  )}
                </span>
              ))}
            </div>
            {!isAnswered && (
              <Input
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="text-lg"
                onKeyDown={(e) => e.key === 'Enter' && textAnswer && handleSubmit()}
              />
            )}
            {isAnswered && !isCorrect && (
              <p className="text-success">
                Correct answer: <strong>{correctAnswer}</strong>
              </p>
            )}
          </div>
        );

      case 'listening':
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <Button
                size="lg"
                variant="outline"
                onClick={() => speak(questionAudioText || questionText)}
                disabled={isSpeaking}
                className="gap-2"
              >
                <Volume2 className={cn("w-6 h-6", isSpeaking && "animate-pulse text-primary")} />
                {isSpeaking ? "Playing..." : "Play Audio"}
              </Button>
            </div>
            <div className="space-y-3">
              {options.map((option, index) => (
                <motion.button
                  key={index}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all",
                    selectedAnswer === option
                      ? isAnswered
                        ? isCorrect
                          ? "border-success bg-success/10"
                          : option === correctAnswer
                            ? "border-success bg-success/10"
                            : "border-destructive bg-destructive/10"
                        : "border-primary bg-primary/10"
                      : isAnswered && option === correctAnswer
                        ? "border-success bg-success/10"
                        : "border-border hover:border-primary/50"
                  )}
                  onClick={() => handleMCQSelect(option)}
                  whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                  whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'reorder':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Drag or click words to reorder:</p>
              {!isAnswered && (
                <Button variant="ghost" size="sm" onClick={shuffleWords}>
                  <Shuffle className="w-4 h-4 mr-1" />
                  Shuffle
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg min-h-[80px]">
              {reorderedWords.map((word, index) => (
                <motion.button
                  key={`${word}-${index}`}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors",
                    isAnswered
                      ? isCorrect
                        ? "bg-success/20 text-success border border-success"
                        : reorderedWords[index] === correctAnswers[index]
                          ? "bg-success/20 text-success border border-success"
                          : "bg-destructive/20 text-destructive border border-destructive"
                      : "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
                  )}
                  onClick={() => {
                    if (isAnswered) return;
                    // Simple swap with next word
                    const nextIndex = (index + 1) % reorderedWords.length;
                    handleWordReorder(index, nextIndex);
                  }}
                  whileHover={{ scale: isAnswered ? 1 : 1.05 }}
                  whileTap={{ scale: isAnswered ? 1 : 0.95 }}
                  layout
                >
                  {word}
                </motion.button>
              ))}
            </div>
            {isAnswered && !isCorrect && (
              <p className="text-success text-sm">
                Correct order: <strong>{correctAnswers.join(' ')}</strong>
              </p>
            )}
          </div>
        );

      case 'matching':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              {matchingPairs.map((pair, index) => (
                <Button
                  key={index}
                  variant={matchedPairs[pair.left] ? "default" : "outline"}
                  className="w-full justify-start"
                  disabled={isAnswered}
                >
                  {pair.left}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              {matchingPairs.map((pair, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start"
                  disabled={isAnswered}
                >
                  {pair.right}
                </Button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canSubmit = () => {
    switch (questionType) {
      case 'mcq':
      case 'listening':
        return !!selectedAnswer;
      case 'fill_blank':
        return !!textAnswer.trim();
      case 'reorder':
        return reorderedWords.length > 0;
      case 'matching':
        return Object.keys(matchedPairs).length === matchingPairs.length;
      default:
        return false;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* Question Header */}
        <div className="mb-6">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="Question illustration" 
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
          )}
          <div className="flex items-start gap-3">
            <h3 className="text-xl font-display font-semibold flex-1">
              {questionType === 'listening' ? 'Listen and choose the correct answer:' : questionText}
            </h3>
            {(questionAudioText || (questionType !== 'listening' && questionText)) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => speak(questionAudioText || questionText)}
                disabled={isSpeaking}
              >
                <Volume2 className={cn("w-5 h-5", isSpeaking && "text-primary animate-pulse")} />
              </Button>
            )}
          </div>
        </div>

        {/* Question Content */}
        {renderQuestion()}

        {/* Feedback */}
        <AnimatePresence>
          {isAnswered && explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className={cn(
                "p-4 rounded-lg",
                isCorrect ? "bg-success/10 border border-success/30" : "bg-warning/10 border border-warning/30"
              )}>
                <p className="font-medium mb-1">
                  {isCorrect ? '✨ Excellent!' : '💡 Explanation:'}
                </p>
                <p className="text-sm text-muted-foreground">{explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          {!isAnswered ? (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit()}
              size="lg"
            >
              Check Answer
            </Button>
          ) : (
            <Button onClick={onNext} size="lg">
              Next Question
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
