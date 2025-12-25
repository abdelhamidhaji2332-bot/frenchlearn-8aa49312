import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, RotateCcw, Check, X, Loader2 } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface VocabularyCardProps {
  french: string;
  english: string;
  arabic?: string;
  pronunciation?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  category?: string;
  imageUrl?: string;
  onCorrect?: () => void;
  onIncorrect?: () => void;
  showFlashcardMode?: boolean;
}

export const VocabularyCard = ({
  french,
  english,
  arabic,
  pronunciation,
  exampleSentence,
  exampleTranslation,
  category,
  imageUrl,
  onCorrect,
  onIncorrect,
  showFlashcardMode = false,
}: VocabularyCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { speak, speakWithGuide, isSpeaking, isLoading, pronunciationData } = useTextToSpeech();

  const handleSpeak = () => {
    speak(french);
  };

  const handleSpeakWithGuide = async () => {
    await speakWithGuide(french);
  };

  if (showFlashcardMode) {
    return (
      <motion.div
        className="perspective-1000"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div
          className="relative w-full min-h-[300px] cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <Card 
            className="absolute inset-0 backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt={french} 
                  className="w-24 h-24 object-cover rounded-lg mb-4"
                />
              )}
              <span className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                {category}
              </span>
              <h3 className="text-3xl font-display font-bold text-primary mb-2">
                {french}
              </h3>
              {pronunciation && (
                <p className="text-muted-foreground italic mb-4">[{pronunciation}]</p>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeak();
                }}
                disabled={isSpeaking}
              >
                <Volume2 className={`w-6 h-6 ${isSpeaking ? 'text-primary animate-pulse' : ''}`} />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">Tap to reveal</p>
            </CardContent>
          </Card>

          {/* Back */}
          <Card 
            className="absolute inset-0"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)' 
            }}
          >
            <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
              <h3 className="text-2xl font-display font-bold mb-2">{english}</h3>
              {arabic && (
                <p className="text-xl text-muted-foreground mb-4" dir="rtl">{arabic}</p>
              )}
              {exampleSentence && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg w-full">
                  <p className="text-sm font-medium text-primary">{exampleSentence}</p>
                  <p className="text-xs text-muted-foreground mt-1">{exampleTranslation}</p>
                </div>
              )}
              
              {onCorrect && onIncorrect && (
                <div className="flex gap-4 mt-6">
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onIncorrect();
                    }}
                  >
                    <X className="w-5 h-5 mr-2" />
                    Again
                  </Button>
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-success hover:bg-success/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCorrect();
                    }}
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Got it!
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  // Regular vocabulary display card
  return (
    <Card variant="glass" className="hover-lift">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={french} 
              className="w-16 h-16 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-display font-semibold text-primary">{french}</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleSpeak}
                disabled={isSpeaking}
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-primary animate-pulse' : ''}`} />
              </Button>
            </div>
            {pronunciation && (
              <p className="text-sm text-muted-foreground italic">[{pronunciation}]</p>
            )}
            <p className="text-foreground mt-1">{english}</p>
            {arabic && (
              <p className="text-muted-foreground" dir="rtl">{arabic}</p>
            )}
          </div>
        </div>
        
        {exampleSentence && (
          <div className="mt-3 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium flex-1">{exampleSentence}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => speak(exampleSentence)}
                disabled={isSpeaking}
              >
                <Volume2 className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{exampleTranslation}</p>
          </div>
        )}

        {pronunciationData && (
          <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-xs font-medium text-primary mb-1">Pronunciation Guide</p>
            {pronunciationData.ipa && (
              <p className="text-sm">IPA: <span className="font-mono">{pronunciationData.ipa}</span></p>
            )}
            {pronunciationData.tips && (
              <p className="text-xs text-muted-foreground mt-1">{pronunciationData.tips}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
