import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, ChevronRight, BookOpen, Volume2, 
  CheckCircle2, Play, Pause, BookMarked, Languages
} from 'lucide-react';
import { VocabularyCard } from './VocabularyCard';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { cn } from '@/lib/utils';

interface LessonSection {
  id: string;
  section_type: 'intro' | 'vocabulary' | 'grammar' | 'dialogue' | 'exercise' | 'summary' | 'conjugation';
  title?: string;
  content: {
    text?: string;
    items?: any[];
    dialogueLines?: { speaker: string; text: string; translation: string }[];
    grammarRule?: { title: string; explanation: string; examples: { french: string; english: string }[] };
    tips?: string[];
    conjugations?: {
      verb: string;
      meaning: string;
      group: string;
      tenses: {
        name: string;
        forms: { pronoun: string; form: string }[];
        examples?: { french: string; english: string }[];
      }[];
    }[];
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
          <div className="space-y-5">
            <p className="text-lg leading-relaxed text-foreground/90">{content.text}</p>
            {content.tips && (
              <div className="bg-accent/50 border border-accent-foreground/10 rounded-xl p-5">
                <h4 className="font-display font-semibold mb-3 flex items-center gap-2 text-accent-foreground">
                  <BookMarked className="w-5 h-5" />
                  Learning Tips
                </h4>
                <ul className="space-y-2">
                  {content.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{idx + 1}</span>
                      <span>{tip}</span>
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
            <div className="p-5 rounded-xl bg-accent/30 border border-accent-foreground/10">
              <h3 className="text-xl font-display font-bold text-accent-foreground mb-2">{rule?.title}</h3>
              <p className="text-foreground/80 leading-relaxed">{rule?.explanation}</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-display font-semibold text-lg flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">📝</span>
                Examples
              </h4>
              {rule?.examples.map((example, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card variant="glass" className="overflow-hidden border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-primary text-lg">{example.french}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{example.english}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => speak(example.french)}
                          disabled={isSpeaking}
                          className="shrink-0"
                        >
                          <Volume2 className={cn("w-4 h-4", isSpeaking && "text-primary animate-pulse")} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'conjugation':
        return (
          <div className="space-y-8">
            {content.conjugations?.map((verb, vIdx) => (
              <div key={vIdx} className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <Languages className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="text-2xl font-display font-bold text-primary">{verb.verb}</h3>
                    <p className="text-sm text-muted-foreground">{verb.meaning} • {verb.group}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="ml-auto" onClick={() => speak(verb.verb)}>
                    <Volume2 className="w-5 h-5" />
                  </Button>
                </div>

                <Tabs defaultValue={verb.tenses[0]?.name || "présent"} className="w-full">
                  <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 rounded-xl">
                    {verb.tenses.map((tense) => (
                      <TabsTrigger 
                        key={tense.name} 
                        value={tense.name}
                        className="text-xs px-3 py-1.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        {tense.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {verb.tenses.map((tense) => (
                    <TabsContent key={tense.name} value={tense.name} className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {tense.forms.map((f, fIdx) => (
                          <motion.div
                            key={fIdx}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: fIdx * 0.03 }}
                            className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group"
                            onClick={() => speak(`${f.pronoun} ${f.form}`)}
                          >
                            <span className="text-muted-foreground text-sm w-8 shrink-0">{f.pronoun}</span>
                            <span className="font-semibold text-primary group-hover:text-primary/80">{f.form}</span>
                            <Volume2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                          </motion.div>
                        ))}
                      </div>
                      {tense.examples && tense.examples.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Examples</p>
                          {tense.examples.map((ex, eIdx) => (
                            <div key={eIdx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{ex.french}</p>
                                <p className="text-xs text-muted-foreground">{ex.english}</p>
                              </div>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => speak(ex.french)}>
                                <Volume2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            ))}
          </div>
        );

      case 'dialogue':
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeaking();
                  } else {
                    const fullDialogue = content.dialogueLines?.map(line => line.text).join('. ');
                    if (fullDialogue) speak(fullDialogue);
                  }
                }}
              >
                {isSpeaking ? <><Pause className="w-4 h-4" /> Pause Audio</> : <><Play className="w-4 h-4" /> Play Full Dialogue</>}
              </Button>
            </div>
            
            <div className="space-y-3">
              {content.dialogueLines?.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn("flex gap-3", idx % 2 === 1 && "flex-row-reverse")}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 shadow-sm",
                    idx % 2 === 0 ? "bg-primary/20" : "bg-accent/60"
                  )}>
                    {line.speaker === 'A' ? '👤' : '👩'}
                  </div>
                  <Card className={cn(
                    "max-w-[80%] border-0 shadow-sm",
                    idx % 2 === 0 ? "bg-primary/5" : "bg-accent/30"
                  )}>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="font-medium">{line.text}</p>
                          <p className="text-sm text-muted-foreground">{line.translation}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => speak(line.text)}>
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
      case 'conjugation': return '🔄';
      case 'summary': return '🎉';
      default: return '📄';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("level-badge", `level-${level.toLowerCase()}`)}>
            {level}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            Section {currentSectionIndex + 1} of {sections.length}
          </span>
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
        <Progress value={progress} className="mt-4 h-2" />
      </div>

      {/* Section Navigation Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {sections.map((section, idx) => (
          <button
            key={section.id}
            onClick={() => setCurrentSectionIndex(idx)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 border",
              idx === currentSectionIndex
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : completedSections.has(idx)
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-card border-border hover:border-primary/30 hover:bg-muted/50"
            )}
          >
            <span>{getSectionIcon(section.section_type)}</span>
            <span>{section.title || section.section_type}</span>
            {completedSections.has(idx) && <CheckCircle2 className="w-4 h-4" />}
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
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 md:p-8">
              {currentSection?.title && currentSection.section_type !== 'summary' && (
                <h2 className="text-xl font-display font-semibold mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">
                    {getSectionIcon(currentSection.section_type)}
                  </span>
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
        <Button variant="outline" onClick={handlePrevSection} disabled={currentSectionIndex === 0}>
          <ChevronLeft className="w-5 h-5 mr-2" /> Previous
        </Button>
        <Button onClick={handleNextSection} variant={isLastSection ? "hero" : "default"}>
          {isLastSection ? '🎉 Complete' : 'Next'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
