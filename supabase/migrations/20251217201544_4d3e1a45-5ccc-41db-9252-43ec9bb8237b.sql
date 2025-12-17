-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT,
  avatar_url TEXT,
  xp_points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE,
  level TEXT DEFAULT 'A1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  UNIQUE (user_id, role)
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  content JSONB,
  xp_reward INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 50,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Lessons policies (public read)
CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT TO authenticated USING (true);

-- User progress policies
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Achievements policies (public read)
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT TO authenticated USING (true);

-- User achievements policies
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create role check function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'username');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample lessons
INSERT INTO public.lessons (title, description, category, level, xp_reward, order_index) VALUES
('Basic Greetings', 'Learn essential French greetings', 'vocabulary', 'A1', 15, 1),
('Numbers 1-20', 'Master counting in French', 'vocabulary', 'A1', 15, 2),
('Present Tense - Être', 'Conjugate the verb to be', 'grammar', 'A1', 20, 3),
('Present Tense - Avoir', 'Conjugate the verb to have', 'grammar', 'A1', 20, 4),
('Colors and Shapes', 'Describe the world around you', 'vocabulary', 'A1', 15, 5),
('Family Members', 'Talk about your family', 'vocabulary', 'A1', 15, 6),
('Articles - Le, La, Les', 'Master French articles', 'grammar', 'A1', 20, 7),
('Daily Routines', 'Describe your daily life', 'vocabulary', 'A2', 25, 8);

-- Insert sample achievements
INSERT INTO public.achievements (name, description, icon, xp_reward, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your first lesson', 'award', 50, 'lessons_completed', 1),
('Dedicated Learner', 'Complete 10 lessons', 'star', 100, 'lessons_completed', 10),
('Streak Master', 'Maintain a 7-day streak', 'flame', 150, 'streak_days', 7),
('XP Hunter', 'Earn 500 XP', 'zap', 100, 'xp_earned', 500),
('Grammar Guru', 'Complete all A1 grammar lessons', 'book-open', 200, 'category_completed', 1);