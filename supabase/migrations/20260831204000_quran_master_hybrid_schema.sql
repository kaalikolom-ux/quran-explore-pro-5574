-- ==============================================================================
-- HYBRID QURAN MASTER SCHEMA & EXTENSIONS
-- Project: Quran Explore Pro (kaalikolom-ux / wooniche.com)
-- Created: 2026-08-31
-- ==============================================================================

-- 1. Touch updated_at function
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SET search_path = public 
AS $$
BEGIN 
  NEW.updated_at = now(); 
  RETURN NEW; 
END; 
$$;

-- 2. Quran Chapters Table
CREATE TABLE IF NOT EXISTS public.quran_chapters (
  id integer PRIMARY KEY,
  name_simple text NOT NULL,
  name_arabic text NOT NULL,
  translated_name text NOT NULL,
  verses_count integer NOT NULL,
  revelation_place text,
  lang text NOT NULL DEFAULT 'bn',
  meaning_bn text,
  meaning_en text,
  scientific_meaning_bn text,
  scientific_meaning_en text,
  consistency_bn text,
  consistency_en text,
  consistency_title_bn text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE IF EXISTS public.quran_chapters
  ADD COLUMN IF NOT EXISTS meaning_bn text,
  ADD COLUMN IF NOT EXISTS meaning_en text,
  ADD COLUMN IF NOT EXISTS scientific_meaning_bn text,
  ADD COLUMN IF NOT EXISTS scientific_meaning_en text,
  ADD COLUMN IF NOT EXISTS consistency_bn text,
  ADD COLUMN IF NOT EXISTS consistency_en text,
  ADD COLUMN IF NOT EXISTS consistency_title_bn text;

-- 3. Quran Verses Table (Rich Hybrid Master Storage)
CREATE TABLE IF NOT EXISTS public.quran_verses (
  surah integer NOT NULL,
  ayah integer NOT NULL,
  text_uthmani text NOT NULL,
  words jsonb NOT NULL DEFAULT '[]'::jsonb,
  transliteration text,
  bn_text text,
  en_text text,
  conventional_bn text,
  conventional_en text,
  modern_translation_bn text,
  modern_translation_en text,
  meta_bn text,
  meta_en text,
  lexicon_modern_notes text,
  audio_url text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (surah, ayah)
);

ALTER TABLE IF EXISTS public.quran_verses
  ADD COLUMN IF NOT EXISTS transliteration text,
  ADD COLUMN IF NOT EXISTS conventional_bn text,
  ADD COLUMN IF NOT EXISTS conventional_en text,
  ADD COLUMN IF NOT EXISTS modern_translation_bn text,
  ADD COLUMN IF NOT EXISTS modern_translation_en text,
  ADD COLUMN IF NOT EXISTS meta_bn text,
  ADD COLUMN IF NOT EXISTS meta_en text,
  ADD COLUMN IF NOT EXISTS lexicon_modern_notes text,
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- 4. Triggers for automatic timestamp update
DROP TRIGGER IF EXISTS quran_verses_touch ON public.quran_verses;
CREATE TRIGGER quran_verses_touch BEFORE UPDATE ON public.quran_verses
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS quran_chapters_touch ON public.quran_chapters;
CREATE TRIGGER quran_chapters_touch BEFORE UPDATE ON public.quran_chapters
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 5. Indexes for ultra-fast lookups
CREATE INDEX IF NOT EXISTS idx_quran_verses_surah_ayah ON public.quran_verses (surah, ayah);
CREATE INDEX IF NOT EXISTS idx_quran_verses_surah ON public.quran_verses (surah);

-- 6. Permissions and Access Control
GRANT SELECT ON public.quran_chapters TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quran_chapters TO authenticated;
GRANT ALL ON public.quran_chapters TO service_role;

GRANT SELECT ON public.quran_verses TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quran_verses TO authenticated;
GRANT ALL ON public.quran_verses TO service_role;

-- 7. Row Level Security (RLS)
ALTER TABLE public.quran_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_verses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quran chapters readable" ON public.quran_chapters;
CREATE POLICY "quran chapters readable" ON public.quran_chapters FOR SELECT USING (true);

DROP POLICY IF EXISTS "quran verses readable" ON public.quran_verses;
CREATE POLICY "quran verses readable" ON public.quran_verses FOR SELECT USING (true);

DROP POLICY IF EXISTS "admins manage quran chapters" ON public.quran_chapters;
CREATE POLICY "admins manage quran chapters" ON public.quran_chapters FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "admins manage quran verses" ON public.quran_verses;
CREATE POLICY "admins manage quran verses" ON public.quran_verses FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
