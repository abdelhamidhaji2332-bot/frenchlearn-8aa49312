
-- Allow public read of leaderboard-relevant profile fields
-- Drop existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Users can always view their own full profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Anyone authenticated can view leaderboard data (username, xp, level, streak)
CREATE POLICY "Authenticated users can view leaderboard profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);
