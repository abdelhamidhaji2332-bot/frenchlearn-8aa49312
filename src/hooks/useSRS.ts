import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface VocabCard {
  id: string;
  vocabulary_id: string;
  french: string;
  english: string;
  arabic: string | null;
  pronunciation: string | null;
  example_sentence: string | null;
  example_translation: string | null;
  category: string;
  // SRS fields
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
  correct_count: number;
  incorrect_count: number;
  is_new: boolean;
}

interface SRSStats {
  totalCards: number;
  dueCards: number;
  newCards: number;
  masteredCards: number;
}

// SM-2 Algorithm
function calculateSRS(quality: number, easeFactor: number, interval: number, repetitions: number) {
  // quality: 0-5 (0-2 = fail, 3 = hard, 4 = good, 5 = easy)
  let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEF = Math.max(1.3, newEF);

  let newInterval: number;
  let newReps: number;

  if (quality < 3) {
    // Failed - reset
    newReps = 0;
    newInterval = 0;
  } else {
    newReps = repetitions + 1;
    if (newReps === 1) {
      newInterval = 1;
    } else if (newReps === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEF);
    }
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + (newInterval || 0));
  // If interval is 0, review in 1 minute (for same-session retry)
  if (newInterval === 0) {
    nextReview.setMinutes(nextReview.getMinutes() + 1);
  }

  return {
    ease_factor: Number(newEF.toFixed(2)),
    interval_days: newInterval,
    repetitions: newReps,
    next_review_at: nextReview.toISOString(),
  };
}

export function useSRS(category?: string) {
  const { user } = useAuth();
  const [cards, setCards] = useState<VocabCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SRSStats>({ totalCards: 0, dueCards: 0, newCards: 0, masteredCards: 0 });
  const [sessionResults, setSessionResults] = useState({ correct: 0, incorrect: 0 });

  const fetchCards = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Fetch all vocabulary (optionally by category)
    let vocabQuery = supabase.from('vocabulary').select('*');
    if (category) vocabQuery = vocabQuery.eq('category', category);
    const { data: vocab } = await vocabQuery;

    // Fetch user's SRS progress
    const { data: progress } = await supabase
      .from('user_vocabulary_progress')
      .select('*')
      .eq('user_id', user.id);

    if (!vocab) { setLoading(false); return; }

    const progressMap = new Map<string, any>();
    (progress || []).forEach(p => progressMap.set(p.vocabulary_id, p));

    const now = new Date().toISOString();
    const allCards: VocabCard[] = vocab.map(v => {
      const p = progressMap.get(v.id);
      return {
        id: p?.id || '',
        vocabulary_id: v.id,
        french: v.french,
        english: v.english,
        arabic: v.arabic,
        pronunciation: v.pronunciation,
        example_sentence: v.example_sentence,
        example_translation: v.example_translation,
        category: v.category,
        ease_factor: p ? Number(p.ease_factor) : 2.5,
        interval_days: p?.interval_days || 0,
        repetitions: p?.repetitions || 0,
        next_review_at: p?.next_review_at || now,
        correct_count: p?.correct_count || 0,
        incorrect_count: p?.incorrect_count || 0,
        is_new: !p,
      };
    });

    // Due cards: new cards + cards due for review
    const dueCards = allCards.filter(c => c.is_new || new Date(c.next_review_at) <= new Date());
    const masteredCards = allCards.filter(c => !c.is_new && c.interval_days >= 21);

    // Shuffle and limit to 20 cards per session
    const shuffled = dueCards.sort(() => Math.random() - 0.5).slice(0, 20);

    setCards(shuffled);
    setCurrentIndex(0);
    setSessionResults({ correct: 0, incorrect: 0 });
    setStats({
      totalCards: allCards.length,
      dueCards: dueCards.length,
      newCards: allCards.filter(c => c.is_new).length,
      masteredCards: masteredCards.length,
    });
    setLoading(false);
  }, [user, category]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const answerCard = useCallback(async (quality: number) => {
    if (!user || currentIndex >= cards.length) return;

    const card = cards[currentIndex];
    const srs = calculateSRS(quality, card.ease_factor, card.interval_days, card.repetitions);
    const isCorrect = quality >= 3;

    setSessionResults(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }));

    if (card.is_new) {
      // Insert new progress record
      await supabase.from('user_vocabulary_progress').insert({
        user_id: user.id,
        vocabulary_id: card.vocabulary_id,
        ...srs,
        last_reviewed_at: new Date().toISOString(),
        correct_count: isCorrect ? 1 : 0,
        incorrect_count: isCorrect ? 0 : 1,
      });
    } else {
      // Update existing
      await supabase.from('user_vocabulary_progress')
        .update({
          ...srs,
          last_reviewed_at: new Date().toISOString(),
          correct_count: card.correct_count + (isCorrect ? 1 : 0),
          incorrect_count: card.incorrect_count + (isCorrect ? 0 : 1),
        })
        .eq('user_id', user.id)
        .eq('vocabulary_id', card.vocabulary_id);
    }

    // If failed, re-add card to end of queue
    if (!isCorrect) {
      setCards(prev => [...prev, { ...card, ...srs, is_new: false }]);
    }

    setCurrentIndex(prev => prev + 1);
  }, [user, cards, currentIndex]);

  const currentCard = cards[currentIndex] || null;
  const isSessionComplete = currentIndex >= cards.length && cards.length > 0;
  const progress = cards.length > 0 ? Math.round((currentIndex / cards.length) * 100) : 0;

  return {
    currentCard,
    cards,
    currentIndex,
    loading,
    stats,
    sessionResults,
    progress,
    isSessionComplete,
    answerCard,
    restartSession: fetchCards,
  };
}
