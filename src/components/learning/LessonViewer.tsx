import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, ChevronRight, BookOpen, Volume2, 
  CheckCircle2, Play, Pause, BookMarked
} from 'lucide-react';
import { VocabularyCard } from './VocabularyCard';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { cn } from '@/lib/utils';

interface LessonSection {
  id: string;
  section_type: 'intro' | 'vocabulary' | 'grammar' | 'dialogue' | 'exercise' | 'summary';
  title?: string;
  content: {
    text?: string;
    items?: any[];
    dialogueLines?: { speaker: string; text: string; translation: string }[];
    grammarRule?: { title: string; explanation: string; examples: { french: string; english: string }[] };
    tips?: string[];
  };
}

interface LessonViewerProps {
  lessonId: string;
  title: string;
  description?: string;
  level: string;
  sections: LessonSection[];
  onComplete?: () => void;
  onStartQuiz?: () => void;
}

export const LessonViewer = ({
  lessonId,
  title,
  description,
  level,
  sections,
  onComplete,
  onStartQuiz,
}: LessonViewerProps) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const { speak, isSpeaking, stopSpeaking } = useTextToSpeech();

  const currentSection = sections[currentSectionIndex];
  const progress = ((completedSections.size) / sections.length) * 100;
  const isLastSection = currentSectionIndex === sections.length - 1;

  const handleNextSection = () => {
    setCompletedSections(prev => new Set([...prev, currentSectionIndex]));
    
    if (isLastSection) {
      onComplete?.();
    } else {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  const renderSectionContent = () => {
    if (!currentSection) return null;
    const { section_type, content, title: sectionTitle } = currentSection;

    switch (section_type) {
      case 'intro':
        return (
          <div className="space-y-4">
            <p className="text-lg leading-relaxed">{content.text}</p>
            {content.tips && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <BookMarked className="w-4 h-4" />
                  Learning Tips
                </h4>
                <ul className="space-y-2">
                  {content.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'vocabulary':
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {content.items?.map((item, idx) => (
              <VocabularyCard
                key={idx}
                french={item.french}
                english={item.english}
                arabic={item.arabic}
                pronunciation={item.pronunciation}
                exampleSentence={item.example_sentence}
                exampleTranslation={item.example_translation}
                category={item.category}
                imageUrl={item.image_url}
              />
            ))}
          </div>
        );

      case 'grammar':
        const rule = content.grammarRule;
        return (
          <div className="space-y-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3 className="text-xl font-display font-semibold">{rule?.title}</h3>
              <p className="text-muted-foreground">{rule?.explanation}</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Examples:</h4>
              {rule?.examples.map((example, idx) => (
                <Card key={idx} variant="glass" className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-primary">{example.french}</p>
                        <p className="text-sm text-muted-foreground">{example.english}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => speak(example.french)}
                        disabled={isSpeaking}
                      >
                        <Volume2 className={cn("w-4 h-4", isSpeaking && "text-primary animate-pulse")} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'dialogue':
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    const fullDialogue = content.dialogueLines
                      ?.map(line => line.text)
                      .join('. ');
                    if (fullDialogue) speak(fullDialogue);
                  }
                }}
              >
                {isSpeaking ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Audio
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Play Full Dialogue
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-3">
              {content.dialogueLines?.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "flex gap-3",
                    idx % 2 === 1 && "flex-row-reverse"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0",
                    idx % 2 === 0 ? "bg-primary/20" : "bg-secondary/20"
                  )}>
                    {line.speaker === 'A' ? '👤' : '👩'}
                  </div>
                  <Card className={cn(
                    "max-w-[80%]",
                    idx % 2 === 0 ? "bg-primary/5" : "bg-secondary/5"
                  )}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="font-medium">{line.text}</p>
                          <p className="text-sm text-muted-foreground">{line.translation}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => speak(line.text)}
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 mx-auto bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold mb-2">Lesson Complete!</h3>
              <p className="text-muted-foreground">{content.text}</p>
            </div>
            {onStartQuiz && (
              <Button size="lg" onClick={onStartQuiz}>
                Take the Quiz
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}
          </div>
        );

      default:
        return <p>{content.text}</p>;
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'intro': return '📖';
      case 'vocabulary': return '📚';
      case 'grammar': return '✏️';
      case 'dialogue': return '💬';
      case 'exercise': return '🎯';
      case 'summary': return '🎉';
      default: return '📄';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            {level}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            Section {currentSectionIndex + 1} of {sections.length}
          </span>
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">{title}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
        <Progress value={progress} className="mt-4 h-2" />
      </div>

      {/* Section Navigation Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {sections.map((section, idx) => (
          <button
            key={section.id}
            onClick={() => setCurrentSectionIndex(idx)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors",
              idx === currentSectionIndex
                ? "bg-primary text-primary-foreground"
                : completedSections.has(idx)
                  ? "bg-success/10 text-success"
                  : "bg-muted hover:bg-muted/80"
            )}
          >
            <span>{getSectionIcon(section.section_type)}</span>
            <span>{section.title || section.section_type}</span>
            {completedSections.has(idx) && (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection?.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card>
            <CardContent className="p-6">
              {currentSection?.title && currentSection.section_type !== 'summary' && (
                <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                  <span>{getSectionIcon(currentSection.section_type)}</span>
                  {currentSection.title}
                </h2>
              )}
              {renderSectionContent()}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevSection}
          disabled={currentSectionIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        <Button
          onClick={handleNextSection}
        >
          {isLastSection ? 'Complete' : 'Next'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
