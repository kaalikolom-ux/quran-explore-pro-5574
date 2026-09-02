-- ==============================================================================
-- MASTER QURAN DATA SEED SCRIPT FOR SUPABASE
-- Project: Quran Explore Pro (kaalikolom-ux / wooniche.com)
-- Total Surahs: 114
-- Generated: 2026-09-02T10:21:01.787Z
-- ==============================================================================

-- 1. Ensure Table Structure
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
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (surah, ayah)
);

CREATE TABLE IF NOT EXISTS public.ayah_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  surah integer NOT NULL,
  ayah integer NOT NULL,
  meta_bn text,
  meta_en text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (surah, ayah)
);

-- 2. Enable Row Level Security (RLS) & Allow Public Read
ALTER TABLE public.quran_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quran_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ayah_metadata ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quran_chapters' AND policyname = 'Allow public read on quran_chapters') THEN
    CREATE POLICY "Allow public read on quran_chapters" ON public.quran_chapters FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quran_verses' AND policyname = 'Allow public read on quran_verses') THEN
    CREATE POLICY "Allow public read on quran_verses" ON public.quran_verses FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ayah_metadata' AND policyname = 'Allow public read on ayah_metadata') THEN
    CREATE POLICY "Allow public read on ayah_metadata" ON public.ayah_metadata FOR SELECT USING (true);
  END IF;
END $$;


-- ------------------------------------------------------------------------------
-- Chapters: 114 Surahs
-- ------------------------------------------------------------------------------
INSERT INTO public.quran_chapters (id, name_simple, name_arabic, translated_name, verses_count, revelation_place, lang, updated_at)
VALUES
  (1, 'Al-Fatihah', 'الفاتحة', 'উদ্বোধন / সূচনা', 7, 'makkah', 'bn', now()),
  (2, 'Al-Baqarah', 'البقرة', 'গাভী', 286, 'madinah', 'bn', now()),
  (3, 'Ali ''Imran', 'آل عمران', 'ইমরানের পরিবার', 200, 'madinah', 'bn', now()),
  (4, 'An-Nisa', 'النساء', 'নারী', 176, 'madinah', 'bn', now()),
  (5, 'Al-Ma''idah', 'المائدة', 'খাদ্য পরিবেশিত টেবিল', 120, 'madinah', 'bn', now()),
  (6, 'Al-An''am', 'الأنعام', 'গৃহপালিত পশু', 165, 'makkah', 'bn', now()),
  (7, 'Al-A''raf', 'الأعراف', 'উঁচু স্থানসমূহ', 206, 'makkah', 'bn', now()),
  (8, 'Al-Anfal', 'الأنفال', 'যুদ্ধলব্ধ সম্পদ', 75, 'madinah', 'bn', now()),
  (9, 'At-Tawbah', 'التوبة', 'অনুশোচনা', 129, 'madinah', 'bn', now()),
  (10, 'Yunus', 'يونس', 'ইউনুস (আঃ)', 109, 'makkah', 'bn', now()),
  (11, 'Hud', 'هود', 'হূদ (আঃ)', 123, 'makkah', 'bn', now()),
  (12, 'Yusuf', 'يوسف', 'ইউসুফ (আঃ)', 111, 'makkah', 'bn', now()),
  (13, 'Ar-Ra''d', 'الرعد', 'বজ্রপাত', 43, 'madinah', 'bn', now()),
  (14, 'Ibrahim', 'إبراهيم', 'ইব্রাহীম (আঃ)', 52, 'makkah', 'bn', now()),
  (15, 'Al-Hijr', 'الحجر', 'পাথুরে পাহাড়', 99, 'makkah', 'bn', now()),
  (16, 'An-Nahl', 'النحل', 'মৌমাছি', 128, 'makkah', 'bn', now()),
  (17, 'Al-Isra', 'الإسراء', 'রজনী ভ্রমণ', 111, 'makkah', 'bn', now()),
  (18, 'Al-Kahf', 'الكهف', 'গুহা', 110, 'makkah', 'bn', now()),
  (19, 'Maryam', 'مريم', 'মারিয়াম (আঃ)', 98, 'makkah', 'bn', now()),
  (20, 'Ta-Ha', 'طه', 'ত্বা-হা', 135, 'makkah', 'bn', now()),
  (21, 'Al-Anbiya', 'الأنبياء', 'নবীগণ', 112, 'makkah', 'bn', now()),
  (22, 'Al-Hajj', 'الحج', 'হজ্জ', 78, 'madinah', 'bn', now()),
  (23, 'Al-Mu''minun', 'المؤمنون', 'বিশ্বাসীগণ', 118, 'makkah', 'bn', now()),
  (24, 'An-Nur', 'النور', 'আলো / জ্যোতি', 64, 'madinah', 'bn', now()),
  (25, 'Al-Furqan', 'الفرقان', 'সত্য-মিথ্যার মানদণ্ড', 77, 'makkah', 'bn', now()),
  (26, 'Ash-Shu''ara', 'الشعراء', 'কবিগণ', 227, 'makkah', 'bn', now()),
  (27, 'An-Naml', 'النمل', 'পিপীলিকা', 93, 'makkah', 'bn', now()),
  (28, 'Al-Qasas', 'القصص', 'কাহিনী', 88, 'makkah', 'bn', now()),
  (29, 'Al-''Ankabut', 'العنكبوت', 'মাকড়সা', 69, 'makkah', 'bn', now()),
  (30, 'Ar-Rum', 'الروم', 'রোমবাসী', 60, 'makkah', 'bn', now()),
  (31, 'Luqman', 'لقمان', 'লুকমান', 34, 'makkah', 'bn', now()),
  (32, 'As-Sajdah', 'السجدة', 'সিজদা', 30, 'makkah', 'bn', now()),
  (33, 'Al-Ahzab', 'الأحزاب', 'সম্মিলিত বাহিনী', 73, 'madinah', 'bn', now()),
  (34, 'Saba', 'سبإ', 'সাবা জাতি', 54, 'makkah', 'bn', now()),
  (35, 'Fatir', 'فاطر', 'আদি স্রষ্টা', 45, 'makkah', 'bn', now()),
  (36, 'Ya-Sin', 'يس', 'ইয়াসীন', 83, 'makkah', 'bn', now()),
  (37, 'As-Saffat', 'الصافات', 'সারিবদ্ধভাবে দাঁড়ানো', 182, 'makkah', 'bn', now()),
  (38, 'Sad', 'ص', 'সোয়াদ', 88, 'makkah', 'bn', now()),
  (39, 'Az-Zumar', 'الزمر', 'দলবদ্ধ জনতা', 75, 'makkah', 'bn', now()),
  (40, 'Ghafir', 'غافر', 'ক্ষমাকারী', 85, 'makkah', 'bn', now()),
  (41, 'Fussilat', 'فصلت', 'সুস্পষ্ট বিবরণ', 54, 'makkah', 'bn', now()),
  (42, 'Ash-Shura', 'الشورى', 'পরামর্শ', 53, 'makkah', 'bn', now()),
  (43, 'Az-Zukhruf', 'الزخرف', 'স্বর্ণালঙ্কার', 89, 'makkah', 'bn', now()),
  (44, 'Ad-Dukhan', 'الدخان', 'ধোঁয়া', 59, 'makkah', 'bn', now()),
  (45, 'Al-Jathiyah', 'الجاثية', 'নতজানু', 37, 'makkah', 'bn', now()),
  (46, 'Al-Ahqaf', 'الأحقاف', 'বালুকাময় পর্বত', 35, 'makkah', 'bn', now()),
  (47, 'Muhammad', 'محمد', 'মুহাম্মদ (সাঃ)', 38, 'madinah', 'bn', now()),
  (48, 'Al-Fath', 'الفتح', 'বিজয়', 29, 'madinah', 'bn', now()),
  (49, 'Al-Hujurat', 'الحجرات', 'আবাসসমূহ', 18, 'madinah', 'bn', now()),
  (50, 'Qaf', 'ق', 'ক্বাফ', 45, 'makkah', 'bn', now()),
  (51, 'Adh-Dhariyat', 'الذاريات', 'বিক্ষিপ্তকারী বাতাস', 60, 'makkah', 'bn', now()),
  (52, 'At-Tur', 'الطور', 'তূর পর্বত', 49, 'makkah', 'bn', now()),
  (53, 'An-Najm', 'النجم', 'নক্ষত্র', 62, 'makkah', 'bn', now()),
  (54, 'Al-Qamar', 'القمر', 'চন্দ্র', 55, 'makkah', 'bn', now()),
  (55, 'Ar-Rahman', 'الرحمن', 'পরম দয়ালু', 78, 'madinah', 'bn', now()),
  (56, 'Al-Waqi''ah', 'الواقعة', 'মহাপ্রলয়', 96, 'makkah', 'bn', now()),
  (57, 'Al-Hadid', 'الحديد', 'লোহা', 29, 'madinah', 'bn', now()),
  (58, 'Al-Mujadila', 'المجادلة', 'অনুনয়কারিণী', 22, 'madinah', 'bn', now()),
  (59, 'Al-Hashr', 'الحشر', 'সমাবেশ', 24, 'madinah', 'bn', now()),
  (60, 'Al-Mumtahanah', 'الممتحنة', 'পরীক্ষিতা নারী', 13, 'madinah', 'bn', now()),
  (61, 'As-Saff', 'الصف', 'সারিবদ্ধ সৈন্য', 14, 'madinah', 'bn', now()),
  (62, 'Al-Jumu''ah', 'الجمعة', 'শুক্রবার / সমাবেশ', 11, 'madinah', 'bn', now()),
  (63, 'Al-Munafiqun', 'المنافقون', 'কপট বিশ্বাসীগণ', 11, 'madinah', 'bn', now()),
  (64, 'At-Taghabun', 'التغابن', 'লাভ-ক্ষতির দিন', 18, 'madinah', 'bn', now()),
  (65, 'At-Talaq', 'الطلاق', 'বিবাহ বিচ্ছেদ', 12, 'madinah', 'bn', now()),
  (66, 'At-Tahrim', 'التحريم', 'নিষিদ্ধকরণ', 12, 'madinah', 'bn', now()),
  (67, 'Al-Mulk', 'الملك', 'সার্বভৌম কর্তৃত্ব', 30, 'makkah', 'bn', now()),
  (68, 'Al-Qalam', 'القلم', 'কলম', 52, 'makkah', 'bn', now()),
  (69, 'Al-Haqqah', 'الحاقة', 'অবধারিত সত্য', 52, 'makkah', 'bn', now()),
  (70, 'Al-Ma''arij', 'المعارج', 'উন্নয়নের সোপান', 44, 'makkah', 'bn', now()),
  (71, 'Nuh', 'نوح', 'নূহ (আঃ)', 28, 'makkah', 'bn', now()),
  (72, 'Al-Jinn', 'الجن', 'জিন সম্প্রদায়', 28, 'makkah', 'bn', now()),
  (73, 'Al-Muzzammil', 'المزمل', 'বস্ত্রাবৃত', 20, 'makkah', 'bn', now()),
  (74, 'Al-Muddaththir', 'المدثر', 'চাদরাবৃত', 56, 'makkah', 'bn', now()),
  (75, 'Al-Qiyamah', 'القيامة', 'পুনরুত্থান', 40, 'makkah', 'bn', now()),
  (76, 'Al-Insan', 'الإنسان', 'মানবজাতি', 31, 'madinah', 'bn', now()),
  (77, 'Al-Mursalat', 'المرسلات', 'প্রেরিত বাতাস', 50, 'makkah', 'bn', now()),
  (78, 'An-Naba', 'النبإ', 'মহা সংবাদ', 40, 'makkah', 'bn', now()),
  (79, 'An-Nazi''at', 'النازعات', 'উৎপাটনকারী', 46, 'makkah', 'bn', now()),
  (80, '''Abasa', 'عبس', 'ভ্রুকুটি করল', 42, 'makkah', 'bn', now()),
  (81, 'At-Takwir', 'التكوير', 'নিষ্প্রভকরণ', 29, 'makkah', 'bn', now()),
  (82, 'Al-Infitar', 'الانفطار', 'বিদীর্ণ হওয়া', 19, 'makkah', 'bn', now()),
  (83, 'Al-Mutaffifin', 'المطففين', 'মাপে কমদানকারী', 36, 'makkah', 'bn', now()),
  (84, 'Al-Inshiqaq', 'الانشقاق', 'খণ্ড-বিখণ্ড হওয়া', 25, 'makkah', 'bn', now()),
  (85, 'Al-Buruj', 'البروج', 'নক্ষত্রমণ্ডল', 22, 'makkah', 'bn', now()),
  (86, 'At-Tariq', 'الطارق', 'রাতের আগন্তুক', 17, 'makkah', 'bn', now()),
  (87, 'Al-A''la', 'الأعلى', 'সর্বোচ্চ সত্তা', 19, 'makkah', 'bn', now()),
  (88, 'Al-Ghashiyah', 'الغاشية', 'আচ্ছন্নকারী সংকট', 26, 'makkah', 'bn', now()),
  (89, 'Al-Fajr', 'الفجر', 'ভোরবেলা', 30, 'makkah', 'bn', now()),
  (90, 'Al-Balad', 'البلد', 'নগরী', 20, 'makkah', 'bn', now()),
  (91, 'Ash-Shams', 'الشمس', 'সূর্য', 15, 'makkah', 'bn', now()),
  (92, 'Al-Layl', 'الليل', 'রাত', 21, 'makkah', 'bn', now()),
  (93, 'Ad-Duha', 'الضحى', 'পূর্বাহ্নের আলো', 11, 'makkah', 'bn', now()),
  (94, 'Ash-Sharh', 'الشرح', 'বক্ষ প্রশস্তকরণ', 8, 'makkah', 'bn', now()),
  (95, 'At-Tin', 'التين', 'ডুমুর ফল', 8, 'makkah', 'bn', now()),
  (96, 'Al-''Alaq', 'العلق', 'রক্তপিণ্ড', 19, 'makkah', 'bn', now()),
  (97, 'Al-Qadr', 'القدر', 'মহিমান্বিত রাত', 5, 'makkah', 'bn', now()),
  (98, 'Al-Bayyinah', 'البينة', 'সুস্পষ্ট প্রমাণ', 8, 'madinah', 'bn', now()),
  (99, 'Az-Zalzalah', 'الزلزلة', 'মহাকম্পন', 8, 'madinah', 'bn', now()),
  (100, 'Al-''Adiyat', 'العاديات', 'অভিযানকারী অশ্ব', 11, 'makkah', 'bn', now()),
  (101, 'Al-Qari''ah', 'القارعة', 'মহা বিপর্যয়', 11, 'makkah', 'bn', now()),
  (102, 'At-Takathur', 'التكاثر', 'প্রাচুর্যের মোহ', 8, 'makkah', 'bn', now()),
  (103, 'Al-''Asr', 'العصر', 'মহাকালের সময়', 3, 'makkah', 'bn', now()),
  (104, 'Al-Humazah', 'الهمزة', 'পরনিন্দাকারী', 9, 'makkah', 'bn', now()),
  (105, 'Al-Fil', 'الفيل', 'হাতি বাহিনী', 5, 'makkah', 'bn', now()),
  (106, 'Quraysh', 'قريش', 'কুরাইশ গোত্র', 4, 'makkah', 'bn', now()),
  (107, 'Al-Ma''un', 'الماعون', 'নিত্যপ্রয়োজনীয় সাহায্য', 7, 'makkah', 'bn', now()),
  (108, 'Al-Kawthar', 'الكوثر', 'প্রচুর কল্যাণ', 3, 'makkah', 'bn', now()),
  (109, 'Al-Kafirun', 'الكافرون', 'অবিশ্বাসী দল', 6, 'makkah', 'bn', now()),
  (110, 'An-Nasr', 'النصر', 'সাহায্য ও বিজয়', 3, 'madinah', 'bn', now()),
  (111, 'Al-Masad', 'المسد', 'খেজুরের রশি', 5, 'makkah', 'bn', now()),
  (112, 'Al-Ikhlas', 'الإخلاص', 'একনিষ্ঠ বিশ্বাস', 4, 'makkah', 'bn', now()),
  (113, 'Al-Falaq', 'الفلق', 'ঊষার আলো', 5, 'makkah', 'bn', now()),
  (114, 'An-Nas', 'الناس', 'মানবজাতি', 6, 'makkah', 'bn', now())
ON CONFLICT (id) DO UPDATE SET
  name_simple = EXCLUDED.name_simple,
  name_arabic = EXCLUDED.name_arabic,
  translated_name = EXCLUDED.translated_name,
  verses_count = EXCLUDED.verses_count,
  revelation_place = EXCLUDED.revelation_place,
  lang = EXCLUDED.lang,
  updated_at = now();

