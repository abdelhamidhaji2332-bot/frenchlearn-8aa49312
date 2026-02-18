
-- SRS progress tracking per user per vocabulary word
CREATE TABLE public.user_vocabulary_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vocabulary_id UUID NOT NULL REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  ease_factor NUMERIC NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  repetitions INTEGER NOT NULL DEFAULT 0,
  next_review_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  correct_count INTEGER NOT NULL DEFAULT 0,
  incorrect_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, vocabulary_id)
);

-- Enable RLS
ALTER TABLE public.user_vocabulary_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vocabulary progress"
  ON public.user_vocabulary_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vocabulary progress"
  ON public.user_vocabulary_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary progress"
  ON public.user_vocabulary_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for efficient review queries
CREATE INDEX idx_user_vocab_progress_review ON public.user_vocabulary_progress(user_id, next_review_at);
