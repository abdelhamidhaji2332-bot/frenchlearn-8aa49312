-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  quiz_type TEXT NOT NULL DEFAULT 'lesson_review', -- 'lesson_review', 'level_test', 'practice'
  level TEXT NOT NULL DEFAULT 'A1',
  passing_score INTEGER DEFAULT 70,
  time_limit_minutes INTEGER,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quiz_questions table with different question types
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL, -- 'mcq', 'fill_blank', 'matching', 'reorder', 'listening', 'speaking'
  question_text TEXT NOT NULL,
  question_audio_text TEXT, -- Text for TTS
  options JSONB, -- For MCQ: ["option1", "option2", ...], For matching: [{"left": "...", "right": "..."}]
  correct_answer TEXT, -- For MCQ/fill_blank
  correct_answers JSONB, -- For matching/reorder: ["a-1", "b-2"] or ["word1", "word2", "word3"]
  explanation TEXT,
  points INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_quiz_attempts table
CREATE TABLE public.user_quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  max_score INTEGER NOT NULL DEFAULT 0,
  percentage INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN DEFAULT false,
  answers JSONB, -- Store all answers
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create lesson_sections table for structured lesson content
CREATE TABLE public.lesson_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL, -- 'intro', 'vocabulary', 'grammar', 'dialogue', 'exercise', 'summary'
  title TEXT,
  content JSONB NOT NULL, -- Flexible content based on section type
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vocabulary_images table for AI-generated images
CREATE TABLE public.vocabulary_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vocabulary_id UUID REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  image_data TEXT, -- Base64 or URL
  prompt_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes (public read)
CREATE POLICY "Anyone can view quizzes" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Admins can manage quizzes" ON public.quizzes FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for quiz_questions (public read)
CREATE POLICY "Anyone can view quiz questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Admins can manage quiz questions" ON public.quiz_questions FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for user_quiz_attempts (user-specific)
CREATE POLICY "Users can view own attempts" ON public.user_quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON public.user_quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own attempts" ON public.user_quiz_attempts FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for lesson_sections (public read)
CREATE POLICY "Anyone can view lesson sections" ON public.lesson_sections FOR SELECT USING (true);
CREATE POLICY "Admins can manage lesson sections" ON public.lesson_sections FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- RLS Policies for vocabulary_images (public read)
CREATE POLICY "Anyone can view vocabulary images" ON public.vocabulary_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage vocabulary images" ON public.vocabulary_images FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));