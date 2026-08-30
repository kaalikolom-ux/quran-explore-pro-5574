-- ==============================================================================
-- AYAH METADATA TABLE & TRIGGER (সম্পূর্ণ স্বয়ংসম্পূর্ণ SQL স্ক্রিপ্ট)
-- কুরআন অন্বেষা (Quran Explore Pro)
-- ==============================================================================

-- ১. Updated At ট্রিগার ফাংশন তৈরি (যদি পূর্বে না থাকে)
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

-- ২. ayah_metadata টেবিল তৈরি (প্রতি আয়াতে বাংলা ও ইংরেজি মেটা ডাটা)
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

-- ৩. টাইমস্ট্যাম্প অটো-আপডেট ট্রিগার
DROP TRIGGER IF EXISTS ayah_metadata_touch ON public.ayah_metadata;
CREATE TRIGGER ayah_metadata_touch BEFORE UPDATE ON public.ayah_metadata
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ৪. পারমিশন ও এক্সেস কন্ট্রোল
GRANT SELECT ON public.ayah_metadata TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ayah_metadata TO authenticated;
GRANT ALL ON public.ayah_metadata TO service_role;

-- ৫. Row Level Security (RLS) সক্রিয়করণ
ALTER TABLE public.ayah_metadata ENABLE ROW LEVEL SECURITY;

-- ৬. পাবলিক রিড ও এডমিন ম্যানেজ পলিসি
DROP POLICY IF EXISTS "ayah_metadata_public_read" ON public.ayah_metadata;
CREATE POLICY "ayah_metadata_public_read" ON public.ayah_metadata
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "ayah_metadata_admin_manage" ON public.ayah_metadata;
CREATE POLICY "ayah_metadata_admin_manage" ON public.ayah_metadata
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
