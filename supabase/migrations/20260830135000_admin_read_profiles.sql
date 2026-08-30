-- Allow admins to read all user profiles for user access management
DROP POLICY IF EXISTS "admins read all profiles" ON public.profiles;
CREATE POLICY "admins read all profiles" ON public.profiles 
FOR SELECT TO authenticated 
USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = id);
