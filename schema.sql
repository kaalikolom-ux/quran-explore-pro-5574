table_name,complete_table_sql
articles,"CREATE TABLE IF NOT EXISTS public.articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  title_bn text NOT NULL,
  title_en text,
  excerpt_bn text,
  excerpt_en text,
  content_bn text,
  content_en text,
  cover_image_url text,
  author_id uuid,
  category_id uuid,
  published boolean NOT NULL DEFAULT false,
  published_at timestamp with time zone,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Public can view published articles"" ON public.articles FOR SELECT USING (true);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Authenticated users can delete articles"" ON public.articles FOR DELETE USING (true);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Authenticated users can update articles"" ON public.articles FOR UPDATE USING (true) WITH CHECK (true);
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Authenticated users can insert articles"" ON public.articles FOR INSERT WITH CHECK (true);"
authors,"CREATE TABLE IF NOT EXISTS public.authors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name_bn text NOT NULL,
  name_en text,
  bio_bn text,
  bio_en text,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Authenticated users can delete authors"" ON public.authors FOR DELETE USING (true);
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Authenticated users can update authors"" ON public.authors FOR UPDATE USING (true) WITH CHECK (true);
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Authenticated users can insert authors"" ON public.authors FOR INSERT WITH CHECK (true);
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Public can view authors"" ON public.authors FOR SELECT USING (true);"
bookmarks,"CREATE TABLE IF NOT EXISTS public.bookmarks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL,
  article_id uuid,
  surah integer,
  ayah integer,
  label text,
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

"
categories,"CREATE TABLE IF NOT EXISTS public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  name_bn text NOT NULL,
  name_en text,
  description_bn text,
  description_en text,
  sort_order integer NOT NULL DEFAULT 0,
  show_in_menu boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Authenticated users can insert categories"" ON public.categories FOR INSERT WITH CHECK (true);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Authenticated users can delete categories"" ON public.categories FOR DELETE USING (true);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Authenticated users can update categories"" ON public.categories FOR UPDATE USING (true) WITH CHECK (true);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Public can view categories"" ON public.categories FOR SELECT USING (true);"
contact_messages,"CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  email_sent boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

"
menu_items,"CREATE TABLE IF NOT EXISTS public.menu_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  label_bn text NOT NULL,
  label_en text,
  href text NOT NULL,
  location text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  category_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

"
newsletter_subscribers,"CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

"
pages,"CREATE TABLE IF NOT EXISTS public.pages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  title_bn text NOT NULL,
  title_en text,
  content_bn text,
  content_en text,
  meta_description_bn text,
  meta_description_en text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

"
profiles,"CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  display_name text,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

"
quran_chapters,"CREATE TABLE IF NOT EXISTS public.quran_chapters (
  id integer NOT NULL,
  lang text NOT NULL DEFAULT 'en'::text,
  name_simple text NOT NULL,
  name_arabic text NOT NULL,
  translated_name text NOT NULL,
  revelation_place text,
  verses_count integer NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

"
quran_sync_state,"CREATE TABLE IF NOT EXISTS public.quran_sync_state (
  surah integer NOT NULL,
  verses_synced integer NOT NULL DEFAULT 0,
  synced_at timestamp with time zone NOT NULL DEFAULT now()
);

"
quran_verses,"CREATE TABLE IF NOT EXISTS public.quran_verses (
  surah integer NOT NULL,
  ayah integer NOT NULL,
  text_uthmani text NOT NULL,
  bn_text text,
  en_text text,
  audio_url text,
  words jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

"
site_settings,"CREATE TABLE IF NOT EXISTS public.site_settings (
  key text NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_public boolean NOT NULL DEFAULT false,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

"
social_links,"CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  label text,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

"
surahs,"CREATE TABLE IF NOT EXISTS public.surahs (
  id integer NOT NULL,
  name_arabic text NOT NULL,
  name_simple text NOT NULL,
  name_complex text,
  name_bn text,
  meaning_bn text,
  meaning_en text,
  revelation_place text,
  ayahs_count integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.surahs ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Public can view surahs"" ON public.surahs FOR SELECT USING (true);
ALTER TABLE public.surahs ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Authenticated users can update surahs"" ON public.surahs FOR UPDATE USING (true) WITH CHECK (true);
ALTER TABLE public.surahs ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Authenticated users can insert surahs"" ON public.surahs FOR INSERT WITH CHECK (true);"
user_roles,"CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY ""Allow users to read own role"" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));"
verse_translations,"CREATE TABLE IF NOT EXISTS public.verse_translations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  surah integer NOT NULL,
  ayah integer NOT NULL,
  lang text NOT NULL,
  text text NOT NULL,
  note text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

"