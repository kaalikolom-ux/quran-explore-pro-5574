-- ==============================================================================
-- 📖 Quranic Insights Hub (wooniche) — Full Database Schema Backup
-- PostgreSQL / Supabase Schema Definition
-- Generated for full database setup and restoration
-- ==============================================================================

-- 1. EXTENSIONS & TYPES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. UTILITY & SECURITY FUNCTIONS
-- Updated At Trigger Function
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

-- Has Role Check Function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (
        _user_id = auth.uid()
        OR current_setting('request.jwt.claims', true) IS NULL
        OR (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role'
      )
  );
$$;

-- Function Execution Permissions
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

-- 3. CORE USER & AUTH TABLES
-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Auto-handle new user signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public 
AS $$
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

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created 
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. AUTHORS & CATEGORIES
-- Authors
CREATE TABLE IF NOT EXISTS public.authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bn text NOT NULL,
  name_en text,
  image_url text,
  bio_bn text,
  bio_en text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS authors_touch ON public.authors;
CREATE TRIGGER authors_touch BEFORE UPDATE ON public.authors
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name_bn text NOT NULL,
  name_en text,
  description_bn text,
  description_en text,
  show_in_menu boolean NOT NULL DEFAULT false,
  is_restricted boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS categories_touch ON public.categories;
CREATE TRIGGER categories_touch BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Category User Access Control
CREATE TABLE IF NOT EXISTS public.category_user_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  user_id uuid,
  email text,
  granted_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cat_user_access_user_id ON public.category_user_access(user_id);
CREATE INDEX IF NOT EXISTS idx_cat_user_access_email ON public.category_user_access(email);
CREATE INDEX IF NOT EXISTS idx_cat_user_access_cat_id ON public.category_user_access(category_id);

-- Tags
CREATE TABLE IF NOT EXISTS public.tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bn text NOT NULL,
  name_en text,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS tags_touch ON public.tags;
CREATE TRIGGER tags_touch BEFORE UPDATE ON public.tags
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 5. ARTICLES & CMS CONTENT
CREATE TABLE IF NOT EXISTS public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_bn text NOT NULL,
  title_en text,
  excerpt_bn text,
  excerpt_en text,
  content_bn text,
  content_en text,
  cover_image_url text,
  author_id uuid REFERENCES public.authors(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS articles_touch ON public.articles;
CREATE TRIGGER articles_touch BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Article Tags Junction
CREATE TABLE IF NOT EXISTS public.article_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  UNIQUE (article_id, tag_id)
);

-- Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  content text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS comments_touch ON public.comments;
CREATE TRIGGER comments_touch BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 6. QURAN DATABASE TABLES
-- Quran Chapters (Surahs metadata)
CREATE TABLE IF NOT EXISTS public.quran_chapters (
  id integer PRIMARY KEY,
  name_simple text NOT NULL,
  name_arabic text NOT NULL,
  translated_name text NOT NULL,
  verses_count integer NOT NULL,
  revelation_place text,
  lang text NOT NULL DEFAULT 'bn',
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS quran_chapters_touch ON public.quran_chapters;
CREATE TRIGGER quran_chapters_touch BEFORE UPDATE ON public.quran_chapters
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Legacy / Secondary Surahs Table
CREATE TABLE IF NOT EXISTS public.surahs (
  id integer PRIMARY KEY,
  name_arabic text NOT NULL,
  name_simple text NOT NULL,
  name_complex text,
  name_bn text,
  meaning_bn text,
  meaning_en text,
  revelation_place text,
  ayahs_count integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Quran Verses (Ayahs with Words jsonb & Audio)
CREATE TABLE IF NOT EXISTS public.quran_verses (
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

DROP TRIGGER IF EXISTS quran_verses_touch ON public.quran_verses;
CREATE TRIGGER quran_verses_touch BEFORE UPDATE ON public.quran_verses
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Quran Sync State
CREATE TABLE IF NOT EXISTS public.quran_sync_state (
  surah integer PRIMARY KEY,
  verses_synced integer NOT NULL DEFAULT 0,
  synced_at timestamptz NOT NULL DEFAULT now()
);

-- Scientific & Authored Verse Translations
CREATE TABLE IF NOT EXISTS public.verse_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  surah integer NOT NULL,
  ayah integer NOT NULL,
  lang text NOT NULL CHECK (lang = ANY (ARRAY['bn'::text, 'en'::text, 'bn_std'::text, 'en_std'::text])),
  text text NOT NULL,
  note text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (surah, ayah, lang)
);

DROP TRIGGER IF EXISTS verse_translations_touch ON public.verse_translations;
CREATE TRIGGER verse_translations_touch BEFORE UPDATE ON public.verse_translations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 7. USER BOOKMARKS & INTERACTION
CREATE TABLE IF NOT EXISTS public.bookmarks (
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

CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_unique_target 
  ON public.bookmarks (user_id, kind, COALESCE(surah, 0), COALESCE(ayah, 0), COALESCE(article_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- 8. NAVIGATION, PAGES, SETTINGS & FORMS
-- Menu Items
CREATE TABLE IF NOT EXISTS public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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

DROP TRIGGER IF EXISTS menu_items_touch ON public.menu_items;
CREATE TRIGGER menu_items_touch BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Custom Static Pages
CREATE TABLE IF NOT EXISTS public.pages (
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

DROP TRIGGER IF EXISTS pages_touch ON public.pages;
CREATE TRIGGER pages_touch BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Social Links
CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  label text,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS social_links_touch ON public.social_links;
CREATE TRIGGER social_links_touch BEFORE UPDATE ON public.social_links
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Site Settings (Turnstile, Emails, Configs)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_public boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS site_settings_touch ON public.site_settings;
CREATE TRIGGER site_settings_touch BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Contact Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  email_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES & PERMISSIONS

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
CREATE POLICY "profiles_own_select" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- User Roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
CREATE POLICY "user_roles_own_select" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Authors
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.authors TO anon, authenticated;
GRANT ALL ON public.authors TO service_role;
CREATE POLICY "authors_public_read" ON public.authors FOR SELECT USING (true);
CREATE POLICY "authors_admin_manage" ON public.authors FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_manage" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Category User Access
ALTER TABLE public.category_user_access ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.category_user_access TO anon, authenticated;
GRANT ALL ON public.category_user_access TO service_role;
CREATE POLICY "category_user_access_read" ON public.category_user_access FOR SELECT TO authenticated USING (user_id = auth.uid() OR email = auth.email());
CREATE POLICY "category_user_access_admin" ON public.category_user_access FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.tags TO anon, authenticated;
GRANT ALL ON public.tags TO service_role;
CREATE POLICY "tags_public_read" ON public.tags FOR SELECT USING (true);
CREATE POLICY "tags_admin_manage" ON public.tags FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT ALL ON public.articles TO service_role;
CREATE POLICY "articles_published_read" ON public.articles FOR SELECT USING (published = true);
CREATE POLICY "articles_admin_all" ON public.articles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Article Tags
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.article_tags TO anon, authenticated;
GRANT ALL ON public.article_tags TO service_role;
CREATE POLICY "article_tags_public_read" ON public.article_tags FOR SELECT USING (true);
CREATE POLICY "article_tags_admin_manage" ON public.article_tags FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.comments TO anon, authenticated;
GRANT ALL ON public.comments TO service_role;
CREATE POLICY "comments_public_approved_read" ON public.comments FOR SELECT USING (is_approved = true);
CREATE POLICY "comments_public_insert" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "comments_admin_manage" ON public.comments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Quran Chapters
ALTER TABLE public.quran_chapters ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.quran_chapters TO anon, authenticated;
GRANT ALL ON public.quran_chapters TO service_role;
CREATE POLICY "quran_chapters_public_read" ON public.quran_chapters FOR SELECT USING (true);
CREATE POLICY "quran_chapters_admin_manage" ON public.quran_chapters FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Surahs (legacy)
ALTER TABLE public.surahs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.surahs TO anon, authenticated;
GRANT ALL ON public.surahs TO service_role;
CREATE POLICY "surahs_public_read" ON public.surahs FOR SELECT USING (true);
CREATE POLICY "surahs_admin_manage" ON public.surahs FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Quran Verses
ALTER TABLE public.quran_verses ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.quran_verses TO anon, authenticated;
GRANT ALL ON public.quran_verses TO service_role;
CREATE POLICY "quran_verses_public_read" ON public.quran_verses FOR SELECT USING (true);
CREATE POLICY "quran_verses_admin_manage" ON public.quran_verses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Quran Sync State
ALTER TABLE public.quran_sync_state ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.quran_sync_state TO anon, authenticated;
GRANT ALL ON public.quran_sync_state TO service_role;
CREATE POLICY "quran_sync_state_public_read" ON public.quran_sync_state FOR SELECT USING (true);
CREATE POLICY "quran_sync_state_admin_manage" ON public.quran_sync_state FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Verse Translations
ALTER TABLE public.verse_translations ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.verse_translations TO anon, authenticated;
GRANT ALL ON public.verse_translations TO service_role;
CREATE POLICY "verse_translations_public_read" ON public.verse_translations FOR SELECT USING (true);
CREATE POLICY "verse_translations_admin_manage" ON public.verse_translations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bookmarks
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
CREATE POLICY "bookmarks_own_manage" ON public.bookmarks FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Menu Items
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT ALL ON public.menu_items TO service_role;
CREATE POLICY "menu_items_public_read" ON public.menu_items FOR SELECT USING (visible = true);
CREATE POLICY "menu_items_admin_manage" ON public.menu_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Custom Pages
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.pages TO anon, authenticated;
GRANT ALL ON public.pages TO service_role;
CREATE POLICY "pages_public_read" ON public.pages FOR SELECT USING (published = true);
CREATE POLICY "pages_admin_manage" ON public.pages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Social Links
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.social_links TO anon, authenticated;
GRANT ALL ON public.social_links TO service_role;
CREATE POLICY "social_links_public_read" ON public.social_links FOR SELECT USING (visible = true);
CREATE POLICY "social_links_admin_manage" ON public.social_links FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Site Settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
CREATE POLICY "site_settings_public_read" ON public.site_settings FOR SELECT USING (is_public = true);
CREATE POLICY "site_settings_admin_manage" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Contact Messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
CREATE POLICY "contact_messages_public_insert" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_messages_admin_manage" ON public.contact_messages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Newsletter Subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
CREATE POLICY "newsletter_public_subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "newsletter_admin_read" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 10. DEFAULT SEED DATA
INSERT INTO public.site_settings (key, value, is_public) VALUES
  ('turnstile', '{"site_key": "", "enabled": false}'::jsonb, true),
  ('turnstile_secret', '{"secret_key": ""}'::jsonb, false),
  ('turnstile_site_key', '""'::jsonb, true),
  ('contact', '{"to_email": "info@wooniche.com"}'::jsonb, false)
ON CONFLICT (key) DO NOTHING;

-- ==============================================================================
-- End of Database Backup Script
-- ==============================================================================
