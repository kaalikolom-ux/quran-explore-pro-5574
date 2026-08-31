-- ==============================================================================
-- MASTER SUPABASE DATABASE SCHEMA BACKUP
-- Project: Quran Explore Pro (kaalikolom-ux / wooniche.com)
-- Backup Date: 2026-08-31T14:37:23.101Z
-- Total Source Migrations: 13
-- ==============================================================================


-- ------------------------------------------------------------------------------
-- Migration: 20260806141818_38d35592-ae58-488e-971b-d20665d11679.sql
-- ------------------------------------------------------------------------------
-- roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- user roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles select" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- signup trigger: profile + role (admin for the owner email)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;

  IF lower(NEW.email) = 'notabene.inc@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- scientific verse translations (admin authored)
CREATE TABLE public.verse_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  surah integer NOT NULL,
  ayah integer NOT NULL,
  lang text NOT NULL CHECK (lang IN ('bn','en')),
  text text NOT NULL,
  note text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (surah, ayah, lang)
);
GRANT SELECT ON public.verse_translations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.verse_translations TO authenticated;
GRANT ALL ON public.verse_translations TO service_role;
ALTER TABLE public.verse_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "verse translations readable" ON public.verse_translations FOR SELECT USING (true);
CREATE POLICY "admins manage verse translations" ON public.verse_translations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER verse_translations_touch BEFORE UPDATE ON public.verse_translations
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- articles
CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_bn text NOT NULL,
  title_en text,
  excerpt_bn text,
  excerpt_en text,
  content_bn text,
  content_en text,
  cover_image_url text,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published articles readable" ON public.articles FOR SELECT USING (published = true);
CREATE POLICY "admins read all articles" ON public.articles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage articles" ON public.articles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER articles_touch BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- bookmarks
CREATE TABLE public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('surah','ayah','article')),
  surah integer,
  ayah integer,
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE,
  label text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX bookmarks_unique_target ON public.bookmarks (user_id, kind, COALESCE(surah, 0), COALESCE(ayah, 0), COALESCE(article_id, '00000000-0000-0000-0000-000000000000'::uuid));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own bookmarks" ON public.bookmarks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "admins read subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ------------------------------------------------------------------------------
-- Migration: 20260806141845_4d2053c5-ecc4-4fe5-ab47-9ff2dd6c8fa8.sql
-- ------------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

-- ------------------------------------------------------------------------------
-- Migration: 20260806141928_e8cef035-e45a-4271-8c95-9b08c17df1ca.sql
-- ------------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- ------------------------------------------------------------------------------
-- Migration: 20260808011925_13aaf28f-a157-495a-96d2-9790801658b6.sql
-- ------------------------------------------------------------------------------
ALTER TABLE public.verse_translations DROP CONSTRAINT verse_translations_lang_check;
ALTER TABLE public.verse_translations ADD CONSTRAINT verse_translations_lang_check CHECK (lang = ANY (ARRAY['bn'::text, 'en'::text, 'bn_std'::text, 'en_std'::text]));

-- ------------------------------------------------------------------------------
-- Migration: 20260809061729_6360bc06-93ce-4e49-beb4-87c62a1703cc.sql
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      -- Callers may only evaluate their own roles; service_role/postgres unrestricted.
      AND (
        _user_id = auth.uid()
        OR current_setting('request.jwt.claims', true) IS NULL
        OR (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role'
      )
  )
$function$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- ------------------------------------------------------------------------------
-- Migration: 20260810004847_2a689b6d-74b6-4078-8471-749574e1a3e9.sql
-- ------------------------------------------------------------------------------
CREATE TABLE public.authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bn text NOT NULL,
  name_en text,
  image_url text,
  bio_bn text,
  bio_en text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.authors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.authors TO authenticated;
GRANT ALL ON public.authors TO service_role;

ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authors readable" ON public.authors FOR SELECT USING (true);
CREATE POLICY "admins manage authors" ON public.authors FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER authors_touch BEFORE UPDATE ON public.authors
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.articles ADD COLUMN author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL;

-- ------------------------------------------------------------------------------
-- Migration: 20260811022744_b5e96a9f-8ad8-47d6-a2c9-380a468c1e1e.sql
-- ------------------------------------------------------------------------------
CREATE TABLE public.quran_chapters (
  id integer PRIMARY KEY,
  name_simple text NOT NULL,
  name_arabic text NOT NULL,
  translated_name text NOT NULL,
  verses_count integer NOT NULL,
  revelation_place text,
  lang text NOT NULL DEFAULT 'bn',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.quran_chapters TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quran_chapters TO authenticated;
GRANT ALL ON public.quran_chapters TO service_role;
ALTER TABLE public.quran_chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quran chapters readable" ON public.quran_chapters FOR SELECT USING (true);
CREATE POLICY "admins manage quran chapters" ON public.quran_chapters FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.quran_verses (
  surah integer NOT NULL,
  ayah integer NOT NULL,
  text_uthmani text NOT NULL,
  words jsonb NOT NULL DEFAULT '[]'::jsonb,
  bn_text text,
  en_text text,
  audio_url text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (surah, ayah)
);

GRANT SELECT ON public.quran_verses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quran_verses TO authenticated;
GRANT ALL ON public.quran_verses TO service_role;
ALTER TABLE public.quran_verses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quran verses readable" ON public.quran_verses FOR SELECT USING (true);
CREATE POLICY "admins manage quran verses" ON public.quran_verses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.quran_sync_state (
  surah integer PRIMARY KEY,
  verses_synced integer NOT NULL DEFAULT 0,
  synced_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.quran_sync_state TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quran_sync_state TO authenticated;
GRANT ALL ON public.quran_sync_state TO service_role;
ALTER TABLE public.quran_sync_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quran sync state readable" ON public.quran_sync_state FOR SELECT USING (true);
CREATE POLICY "admins manage quran sync state" ON public.quran_sync_state FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER quran_verses_touch BEFORE UPDATE ON public.quran_verses
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER quran_chapters_touch BEFORE UPDATE ON public.quran_chapters
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ------------------------------------------------------------------------------
-- Migration: 20260812040608_f651639b-6da1-49c4-9a17-bd2baa2128aa.sql
-- ------------------------------------------------------------------------------
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name_bn text NOT NULL,
  name_en text,
  description_bn text,
  description_en text,
  show_in_menu boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER categories_touch BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.menu_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label_bn text NOT NULL,
  label_en text,
  href text NOT NULL,
  location text NOT NULL DEFAULT 'header',
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "menu items readable" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "admins manage menu items" ON public.menu_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER menu_items_touch BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.articles ADD COLUMN category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;

-- ------------------------------------------------------------------------------
-- Migration: 20260812065826_ad79e988-97b5-489b-a159-c1c4631a26e9.sql
-- ------------------------------------------------------------------------------
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  label text,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
GRANT ALL ON public.social_links TO service_role;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "social_links_public_read" ON public.social_links FOR SELECT TO anon, authenticated USING (visible = true);
CREATE POLICY "social_links_admin_all" ON public.social_links FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER social_links_touch BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_public boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_settings_public_read" ON public.site_settings FOR SELECT TO anon, authenticated USING (is_public = true);
CREATE POLICY "site_settings_admin_all" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_touch BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_bn text NOT NULL,
  title_en text,
  content_bn text,
  content_en text,
  meta_description_bn text,
  meta_description_en text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pages_public_read" ON public.pages FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "pages_admin_all" ON public.pages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER pages_touch BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  email_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_messages_admin_all" ON public.contact_messages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (key, value, is_public) VALUES
  ('turnstile', '{"site_key": "", "enabled": false}'::jsonb, true),
  ('turnstile_secret', '{"secret_key": ""}'::jsonb, false),
  ('contact', '{"to_email": "info@wooniche.com"}'::jsonb, false);

-- ------------------------------------------------------------------------------
-- Migration: 20260828193000_category_access_control.sql
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Migration: 20260830103000_ayah_metadata.sql
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- Migration: 20260830114500_user_display_permissions.sql
-- ------------------------------------------------------------------------------
-- Migration: user_display_permissions
-- Per-user granular display layer and content access permissions

CREATE TABLE IF NOT EXISTS public.user_display_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    permissions JSONB NOT NULL DEFAULT '{
        showArabic: true,
        showWordByWord: true,
        showTransliteration: true,
        showConventionalBn: true,
        showConventionalEn: true,
        showModernBn: true,
        showModernEn: true,
        showLexicon: true,
        showLexiconScientific: true,
        showMetaData: true
    }'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT user_display_permissions_user_id_key UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_disp_perms_user_id ON public.user_display_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_disp_perms_email ON public.user_display_permissions(email);

-- Grants
GRANT SELECT ON public.user_display_permissions TO authenticated;
GRANT ALL ON public.user_display_permissions TO service_role;

-- RLS
ALTER TABLE public.user_display_permissions ENABLE ROW LEVEL SECURITY;

-- Users can read their own permissions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_display_permissions' AND policyname = 'user_disp_perms_own_read'
    ) THEN
        CREATE POLICY user_disp_perms_own_read ON public.user_display_permissions
            FOR SELECT TO authenticated
            USING (auth.uid() = user_id OR email = auth.email());
    END IF;
END $$;

-- Admins can view, insert, update and delete all permissions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'user_display_permissions' AND policyname = 'user_disp_perms_admin_all'
    ) THEN
        CREATE POLICY user_disp_perms_admin_all ON public.user_display_permissions
            FOR ALL TO authenticated
            USING (public.has_role(auth.uid(), 'admin'))
            WITH CHECK (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

-- ------------------------------------------------------------------------------
-- Migration: 20260830135000_admin_read_profiles.sql
-- ------------------------------------------------------------------------------
-- Allow admins to read all user profiles for user access management
DROP POLICY IF EXISTS "admins read all profiles" ON public.profiles;
CREATE POLICY "admins read all profiles" ON public.profiles 
FOR SELECT TO authenticated 
USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = id);
