-- Fix security issue #1: Protect teacher email addresses from public access
-- Change the policy to only allow authenticated users to see teacher details
DROP POLICY IF EXISTS "Anyone can view teachers" ON public.teachers;

CREATE POLICY "Authenticated users can view teachers" 
ON public.teachers 
FOR SELECT 
TO authenticated
USING (true);

-- Fix security issue #2: Add admin-only policies for lessons table to prevent unauthorized modifications
CREATE POLICY "Admins can insert lessons" 
ON public.lessons 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update lessons" 
ON public.lessons 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete lessons" 
ON public.lessons 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable leaked password protection recommendation noted (requires Supabase dashboard)