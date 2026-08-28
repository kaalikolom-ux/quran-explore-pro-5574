-- Add is_restricted to categories table
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_restricted boolean NOT NULL DEFAULT false;

-- Create category_user_access table for subscriber/user level access grants
CREATE TABLE IF NOT EXISTS public.category_user_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  user_id uuid,
  email text,
  granted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for fast access checks
CREATE INDEX IF NOT EXISTS idx_cat_user_access_user_id ON public.category_user_access(user_id);
CREATE INDEX IF NOT EXISTS idx_cat_user_access_email ON public.category_user_access(email);
CREATE INDEX IF NOT EXISTS idx_cat_user_access_cat_id ON public.category_user_access(category_id);

-- Permissions
GRANT SELECT ON public.category_user_access TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.category_user_access TO authenticated;
GRANT ALL ON public.category_user_access TO service_role;

-- Row Level Security
ALTER TABLE public.category_user_access ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'category_user_access' AND policyname = 'category_user_access_user_read'
  ) THEN
    CREATE POLICY "category_user_access_user_read" ON public.category_user_access
      FOR SELECT TO authenticated
      USING (user_id = auth.uid() OR email = auth.email());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'category_user_access' AND policyname = 'category_user_access_admin_all'
  ) THEN
    CREATE POLICY "category_user_access_admin_all" ON public.category_user_access
      FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;
