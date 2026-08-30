-- Create ayah_metadata table to house per-ayah metadata in Bengali and English
CREATE TABLE IF NOT EXISTS public.ayah_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  surah integer NOT NULL,
  ayah integer NOT NULL,
  meta_bn text,
  meta_en text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (surah, ayah)
);

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS ayah_metadata_touch ON public.ayah_metadata;
CREATE TRIGGER ayah_metadata_touch BEFORE UPDATE ON public.ayah_metadata
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Permissions
GRANT SELECT ON public.ayah_metadata TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ayah_metadata TO authenticated;
GRANT ALL ON public.ayah_metadata TO service_role;

-- Row Level Security
ALTER TABLE public.ayah_metadata ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ayah_metadata' AND policyname = 'ayah_metadata_public_read'
  ) THEN
    CREATE POLICY "ayah_metadata_public_read" ON public.ayah_metadata
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ayah_metadata' AND policyname = 'ayah_metadata_admin_manage'
  ) THEN
    CREATE POLICY "ayah_metadata_admin_manage" ON public.ayah_metadata
      FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;
