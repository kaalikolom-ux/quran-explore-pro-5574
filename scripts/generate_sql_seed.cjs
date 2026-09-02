const fs = require('fs');
const path = require('path');

const surahsDir = path.join(__dirname, '../public/data/quran/surahs');
const outputSqlPath = path.join(__dirname, '../backups/seed_quran_master_data.sql');

console.log('--- Generating Master SQL Seed for Supabase ---');

const files = fs.readdirSync(surahsDir)
  .filter(f => f.endsWith('.json'))
  .sort((a, b) => parseInt(a) - parseInt(b));

let sql = `-- ==============================================================================
-- MASTER QURAN DATA SEED SCRIPT FOR SUPABASE
-- Project: Quran Explore Pro (kaalikolom-ux / wooniche.com)
-- Total Surahs: ${files.length}
-- Generated: ${new Date().toISOString()}
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

`;

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

// 3. Populate Chapters from ALL_SURAHS_DATABASE mapping
const chapterNames = [
  { id: 1, name_en: "Al-Fatihah", name_ar: "الفاتحة", meaning_bn: "উদ্বোধন / সূচনা", verses: 7, type: "makkah" },
  { id: 2, name_en: "Al-Baqarah", name_ar: "البقرة", meaning_bn: "গাভী", verses: 286, type: "madinah" },
  { id: 3, name_en: "Ali 'Imran", name_ar: "آل عمران", meaning_bn: "ইমরানের পরিবার", verses: 200, type: "madinah" },
  { id: 4, name_en: "An-Nisa", name_ar: "النساء", meaning_bn: "নারী", verses: 176, type: "madinah" },
  { id: 5, name_en: "Al-Ma'idah", name_ar: "المائدة", meaning_bn: "খাদ্য পরিবেশিত টেবিল", verses: 120, type: "madinah" },
  { id: 6, name_en: "Al-An'am", name_ar: "الأنعام", meaning_bn: "গৃহপালিত পশু", verses: 165, type: "makkah" },
  { id: 7, name_en: "Al-A'raf", name_ar: "الأعراف", meaning_bn: "উঁচু স্থানসমূহ", verses: 206, type: "makkah" },
  { id: 8, name_en: "Al-Anfal", name_ar: "الأنفال", meaning_bn: "যুদ্ধলব্ধ সম্পদ", verses: 75, type: "madinah" },
  { id: 9, name_en: "At-Tawbah", name_ar: "التوبة", meaning_bn: "অনুশোচনা", verses: 129, type: "madinah" },
  { id: 10, name_en: "Yunus", name_ar: "يونس", meaning_bn: "ইউনুস (আঃ)", verses: 109, type: "makkah" },
  { id: 11, name_en: "Hud", name_ar: "هود", meaning_bn: "হূদ (আঃ)", verses: 123, type: "makkah" },
  { id: 12, name_en: "Yusuf", name_ar: "يوسف", meaning_bn: "ইউসুফ (আঃ)", verses: 111, type: "makkah" },
  { id: 13, name_en: "Ar-Ra'd", name_ar: "الرعد", meaning_bn: "বজ্রপাত", verses: 43, type: "madinah" },
  { id: 14, name_en: "Ibrahim", name_ar: "إبراهيم", meaning_bn: "ইব্রাহীম (আঃ)", verses: 52, type: "makkah" },
  { id: 15, name_en: "Al-Hijr", name_ar: "الحجر", meaning_bn: "পাথুরে পাহাড়", verses: 99, type: "makkah" },
  { id: 16, name_en: "An-Nahl", name_ar: "النحل", meaning_bn: "মৌমাছি", verses: 128, type: "makkah" },
  { id: 17, name_en: "Al-Isra", name_ar: "الإسراء", meaning_bn: "রজনী ভ্রমণ", verses: 111, type: "makkah" },
  { id: 18, name_en: "Al-Kahf", name_ar: "الكهف", meaning_bn: "গুহা", verses: 110, type: "makkah" },
  { id: 19, name_en: "Maryam", name_ar: "مريم", meaning_bn: "মারিয়াম (আঃ)", verses: 98, type: "makkah" },
  { id: 20, name_en: "Ta-Ha", name_ar: "طه", meaning_bn: "ত্বা-হা", verses: 135, type: "makkah" },
  { id: 21, name_en: "Al-Anbiya", name_ar: "الأنبياء", meaning_bn: "নবীগণ", verses: 112, type: "makkah" },
  { id: 22, name_en: "Al-Hajj", name_ar: "الحج", meaning_bn: "হজ্জ", verses: 78, type: "madinah" },
  { id: 23, name_en: "Al-Mu'minun", name_ar: "المؤمنون", meaning_bn: "বিশ্বাসীগণ", verses: 118, type: "makkah" },
  { id: 24, name_en: "An-Nur", name_ar: "النور", meaning_bn: "আলো / জ্যোতি", verses: 64, type: "madinah" },
  { id: 25, name_en: "Al-Furqan", name_ar: "الفرقان", meaning_bn: "সত্য-মিথ্যার মানদণ্ড", verses: 77, type: "makkah" },
  { id: 26, name_en: "Ash-Shu'ara", name_ar: "الشعراء", meaning_bn: "কবিগণ", verses: 227, type: "makkah" },
  { id: 27, name_en: "An-Naml", name_ar: "النمل", meaning_bn: "পিপীলিকা", verses: 93, type: "makkah" },
  { id: 28, name_en: "Al-Qasas", name_ar: "القصص", meaning_bn: "কাহিনী", verses: 88, type: "makkah" },
  { id: 29, name_en: "Al-'Ankabut", name_ar: "العنكبوت", meaning_bn: "মাকড়সা", verses: 69, type: "makkah" },
  { id: 30, name_en: "Ar-Rum", name_ar: "الروم", meaning_bn: "রোমবাসী", verses: 60, type: "makkah" },
  { id: 31, name_en: "Luqman", name_ar: "لقمان", meaning_bn: "লুকমান", verses: 34, type: "makkah" },
  { id: 32, name_en: "As-Sajdah", name_ar: "السجدة", meaning_bn: "সিজদা", verses: 30, type: "makkah" },
  { id: 33, name_en: "Al-Ahzab", name_ar: "الأحزاب", meaning_bn: "সম্মিলিত বাহিনী", verses: 73, type: "madinah" },
  { id: 34, name_en: "Saba", name_ar: "سبإ", meaning_bn: "সাবা জাতি", verses: 54, type: "makkah" },
  { id: 35, name_en: "Fatir", name_ar: "فاطر", meaning_bn: "আদি স্রষ্টা", verses: 45, type: "makkah" },
  { id: 36, name_en: "Ya-Sin", name_ar: "يس", meaning_bn: "ইয়াসীন", verses: 83, type: "makkah" },
  { id: 37, name_en: "As-Saffat", name_ar: "الصافات", meaning_bn: "সারিবদ্ধভাবে দাঁড়ানো", verses: 182, type: "makkah" },
  { id: 38, name_en: "Sad", name_ar: "ص", meaning_bn: "সোয়াদ", verses: 88, type: "makkah" },
  { id: 39, name_en: "Az-Zumar", name_ar: "الزمر", meaning_bn: "দলবদ্ধ জনতা", verses: 75, type: "makkah" },
  { id: 40, name_en: "Ghafir", name_ar: "غافر", meaning_bn: "ক্ষমাকারী", verses: 85, type: "makkah" },
  { id: 41, name_en: "Fussilat", name_ar: "فصلت", meaning_bn: "সুস্পষ্ট বিবরণ", verses: 54, type: "makkah" },
  { id: 42, name_en: "Ash-Shura", name_ar: "الشورى", meaning_bn: "পরামর্শ", verses: 53, type: "makkah" },
  { id: 43, name_en: "Az-Zukhruf", name_ar: "الزخرف", meaning_bn: "স্বর্ণালঙ্কার", verses: 89, type: "makkah" },
  { id: 44, name_en: "Ad-Dukhan", name_ar: "الدخان", meaning_bn: "ধোঁয়া", verses: 59, type: "makkah" },
  { id: 45, name_en: "Al-Jathiyah", name_ar: "الجاثية", meaning_bn: "নতজানু", verses: 37, type: "makkah" },
  { id: 46, name_en: "Al-Ahqaf", name_ar: "الأحقاف", meaning_bn: "বালুকাময় পর্বত", verses: 35, type: "makkah" },
  { id: 47, name_en: "Muhammad", name_ar: "محمد", meaning_bn: "মুহাম্মদ (সাঃ)", verses: 38, type: "madinah" },
  { id: 48, name_en: "Al-Fath", name_ar: "الفتح", meaning_bn: "বিজয়", verses: 29, type: "madinah" },
  { id: 49, name_en: "Al-Hujurat", name_ar: "الحجرات", meaning_bn: "আবাসসমূহ", verses: 18, type: "madinah" },
  { id: 50, name_en: "Qaf", name_ar: "ق", meaning_bn: "ক্বাফ", verses: 45, type: "makkah" },
  { id: 51, name_en: "Adh-Dhariyat", name_ar: "الذاريات", meaning_bn: "বিক্ষিপ্তকারী বাতাস", verses: 60, type: "makkah" },
  { id: 52, name_en: "At-Tur", name_ar: "الطور", meaning_bn: "তূর পর্বত", verses: 49, type: "makkah" },
  { id: 53, name_en: "An-Najm", name_ar: "النجم", meaning_bn: "নক্ষত্র", verses: 62, type: "makkah" },
  { id: 54, name_en: "Al-Qamar", name_ar: "القمر", meaning_bn: "চন্দ্র", verses: 55, type: "makkah" },
  { id: 55, name_en: "Ar-Rahman", name_ar: "الرحمن", meaning_bn: "পরম দয়ালু", verses: 78, type: "madinah" },
  { id: 56, name_en: "Al-Waqi'ah", name_ar: "الواقعة", meaning_bn: "মহাপ্রলয়", verses: 96, type: "makkah" },
  { id: 57, name_en: "Al-Hadid", name_ar: "الحديد", meaning_bn: "লোহা", verses: 29, type: "madinah" },
  { id: 58, name_en: "Al-Mujadila", name_ar: "المجادلة", meaning_bn: "অনুনয়কারিণী", verses: 22, type: "madinah" },
  { id: 59, name_en: "Al-Hashr", name_ar: "الحشر", meaning_bn: "সমাবেশ", verses: 24, type: "madinah" },
  { id: 60, name_en: "Al-Mumtahanah", name_ar: "الممتحنة", meaning_bn: "পরীক্ষিতা নারী", verses: 13, type: "madinah" },
  { id: 61, name_en: "As-Saff", name_ar: "الصف", meaning_bn: "সারিবদ্ধ সৈন্য", verses: 14, type: "madinah" },
  { id: 62, name_en: "Al-Jumu'ah", name_ar: "الجمعة", meaning_bn: "শুক্রবার / সমাবেশ", verses: 11, type: "madinah" },
  { id: 63, name_en: "Al-Munafiqun", name_ar: "المنافقون", meaning_bn: "কপট বিশ্বাসীগণ", verses: 11, type: "madinah" },
  { id: 64, name_en: "At-Taghabun", name_ar: "التغابن", meaning_bn: "লাভ-ক্ষতির দিন", verses: 18, type: "madinah" },
  { id: 65, name_en: "At-Talaq", name_ar: "الطلاق", meaning_bn: "বিবাহ বিচ্ছেদ", verses: 12, type: "madinah" },
  { id: 66, name_en: "At-Tahrim", name_ar: "التحريم", meaning_bn: "নিষিদ্ধকরণ", verses: 12, type: "madinah" },
  { id: 67, name_en: "Al-Mulk", name_ar: "الملك", meaning_bn: "সার্বভৌম কর্তৃত্ব", verses: 30, type: "makkah" },
  { id: 68, name_en: "Al-Qalam", name_ar: "القلم", meaning_bn: "কলম", verses: 52, type: "makkah" },
  { id: 69, name_en: "Al-Haqqah", name_ar: "الحاقة", meaning_bn: "অবধারিত সত্য", verses: 52, type: "makkah" },
  { id: 70, name_en: "Al-Ma'arij", name_ar: "المعارج", meaning_bn: "উন্নয়নের সোপান", verses: 44, type: "makkah" },
  { id: 71, name_en: "Nuh", name_ar: "نوح", meaning_bn: "নূহ (আঃ)", verses: 28, type: "makkah" },
  { id: 72, name_en: "Al-Jinn", name_ar: "الجن", meaning_bn: "জিন সম্প্রদায়", verses: 28, type: "makkah" },
  { id: 73, name_en: "Al-Muzzammil", name_ar: "المزمل", meaning_bn: "বস্ত্রাবৃত", verses: 20, type: "makkah" },
  { id: 74, name_en: "Al-Muddaththir", name_ar: "المدثر", meaning_bn: "চাদরাবৃত", verses: 56, type: "makkah" },
  { id: 75, name_en: "Al-Qiyamah", name_ar: "القيامة", meaning_bn: "পুনরুত্থান", verses: 40, type: "makkah" },
  { id: 76, name_en: "Al-Insan", name_ar: "الإنسان", meaning_bn: "মানবজাতি", verses: 31, type: "madinah" },
  { id: 77, name_en: "Al-Mursalat", name_ar: "المرسلات", meaning_bn: "প্রেরিত বাতাস", verses: 50, type: "makkah" },
  { id: 78, name_en: "An-Naba", name_ar: "النبإ", meaning_bn: "মহা সংবাদ", verses: 40, type: "makkah" },
  { id: 79, name_en: "An-Nazi'at", name_ar: "النازعات", meaning_bn: "উৎপাটনকারী", verses: 46, type: "makkah" },
  { id: 80, name_en: "'Abasa", name_ar: "عبس", meaning_bn: "ভ্রুকুটি করল", verses: 42, type: "makkah" },
  { id: 81, name_en: "At-Takwir", name_ar: "التكوير", meaning_bn: "নিষ্প্রভকরণ", verses: 29, type: "makkah" },
  { id: 82, name_en: "Al-Infitar", name_ar: "الانفطار", meaning_bn: "বিদীর্ণ হওয়া", verses: 19, type: "makkah" },
  { id: 83, name_en: "Al-Mutaffifin", name_ar: "المطففين", meaning_bn: "মাপে কমদানকারী", verses: 36, type: "makkah" },
  { id: 84, name_en: "Al-Inshiqaq", name_ar: "الانشقاق", meaning_bn: "খণ্ড-বিখণ্ড হওয়া", verses: 25, type: "makkah" },
  { id: 85, name_en: "Al-Buruj", name_ar: "البروج", meaning_bn: "নক্ষত্রমণ্ডল", verses: 22, type: "makkah" },
  { id: 86, name_en: "At-Tariq", name_ar: "الطارق", meaning_bn: "রাতের আগন্তুক", verses: 17, type: "makkah" },
  { id: 87, name_en: "Al-A'la", name_ar: "الأعلى", meaning_bn: "সর্বোচ্চ সত্তা", verses: 19, type: "makkah" },
  { id: 88, name_en: "Al-Ghashiyah", name_ar: "الغاشية", meaning_bn: "আচ্ছন্নকারী সংকট", verses: 26, type: "makkah" },
  { id: 89, name_en: "Al-Fajr", name_ar: "الفجر", meaning_bn: "ভোরবেলা", verses: 30, type: "makkah" },
  { id: 90, name_en: "Al-Balad", name_ar: "البلد", meaning_bn: "নগরী", verses: 20, type: "makkah" },
  { id: 91, name_en: "Ash-Shams", name_ar: "الشمس", meaning_bn: "সূর্য", verses: 15, type: "makkah" },
  { id: 92, name_en: "Al-Layl", name_ar: "الليل", meaning_bn: "রাত", verses: 21, type: "makkah" },
  { id: 93, name_en: "Ad-Duha", name_ar: "الضحى", meaning_bn: "পূর্বাহ্নের আলো", verses: 11, type: "makkah" },
  { id: 94, name_en: "Ash-Sharh", name_ar: "الشرح", meaning_bn: "বক্ষ প্রশস্তকরণ", verses: 8, type: "makkah" },
  { id: 95, name_en: "At-Tin", name_ar: "التين", meaning_bn: "ডুমুর ফল", verses: 8, type: "makkah" },
  { id: 96, name_en: "Al-'Alaq", name_ar: "العلق", meaning_bn: "রক্তপিণ্ড", verses: 19, type: "makkah" },
  { id: 97, name_en: "Al-Qadr", name_ar: "القدر", meaning_bn: "মহিমান্বিত রাত", verses: 5, type: "makkah" },
  { id: 98, name_en: "Al-Bayyinah", name_ar: "البينة", meaning_bn: "সুস্পষ্ট প্রমাণ", verses: 8, type: "madinah" },
  { id: 99, name_en: "Az-Zalzalah", name_ar: "الزلزلة", meaning_bn: "মহাকম্পন", verses: 8, type: "madinah" },
  { id: 100, name_en: "Al-'Adiyat", name_ar: "العاديات", meaning_bn: "অভিযানকারী অশ্ব", verses: 11, type: "makkah" },
  { id: 101, name_en: "Al-Qari'ah", name_ar: "القارعة", meaning_bn: "মহা বিপর্যয়", verses: 11, type: "makkah" },
  { id: 102, name_en: "At-Takathur", name_ar: "التكاثر", meaning_bn: "প্রাচুর্যের মোহ", verses: 8, type: "makkah" },
  { id: 103, name_en: "Al-'Asr", name_ar: "العصر", meaning_bn: "মহাকালের সময়", verses: 3, type: "makkah" },
  { id: 104, name_en: "Al-Humazah", name_ar: "الهمزة", meaning_bn: "পরনিন্দাকারী", verses: 9, type: "makkah" },
  { id: 105, name_en: "Al-Fil", name_ar: "الفيل", meaning_bn: "হাতি বাহিনী", verses: 5, type: "makkah" },
  { id: 106, name_en: "Quraysh", name_ar: "قريش", meaning_bn: "কুরাইশ গোত্র", verses: 4, type: "makkah" },
  { id: 107, name_en: "Al-Ma'un", name_ar: "الماعون", meaning_bn: "নিত্যপ্রয়োজনীয় সাহায্য", verses: 7, type: "makkah" },
  { id: 108, name_en: "Al-Kawthar", name_ar: "الكوثر", meaning_bn: "প্রচুর কল্যাণ", verses: 3, type: "makkah" },
  { id: 109, name_en: "Al-Kafirun", name_ar: "الكافرون", meaning_bn: "অবিশ্বাসী দল", verses: 6, type: "makkah" },
  { id: 110, name_en: "An-Nasr", name_ar: "النصر", meaning_bn: "সাহায্য ও বিজয়", verses: 3, type: "madinah" },
  { id: 111, name_en: "Al-Masad", name_ar: "المسد", meaning_bn: "খেজুরের রশি", verses: 5, type: "makkah" },
  { id: 112, name_en: "Al-Ikhlas", name_ar: "الإخلاص", meaning_bn: "একনিষ্ঠ বিশ্বাস", verses: 4, type: "makkah" },
  { id: 113, name_en: "Al-Falaq", name_ar: "الفلق", meaning_bn: "ঊষার আলো", verses: 5, type: "makkah" },
  { id: 114, name_en: "An-Nas", name_ar: "الناس", meaning_bn: "মানবজাতি", verses: 6, type: "makkah" },
];

const chapterRows = chapterNames.map(c => 
  `(${c.id}, ${escapeSql(c.name_en)}, ${escapeSql(c.name_ar)}, ${escapeSql(c.meaning_bn)}, ${c.verses}, ${escapeSql(c.type)}, 'bn', now())`
);


sql += `\n-- ------------------------------------------------------------------------------\n`;
sql += `-- Chapters: 114 Surahs\n`;
sql += `-- ------------------------------------------------------------------------------\n`;
sql += `INSERT INTO public.quran_chapters (id, name_simple, name_arabic, translated_name, verses_count, revelation_place, lang, updated_at)\nVALUES\n  ` + chapterRows.join(',\n  ') + `\nON CONFLICT (id) DO UPDATE SET\n  name_simple = EXCLUDED.name_simple,\n  name_arabic = EXCLUDED.name_arabic,\n  translated_name = EXCLUDED.translated_name,\n  verses_count = EXCLUDED.verses_count,\n  revelation_place = EXCLUDED.revelation_place,\n  lang = EXCLUDED.lang,\n  updated_at = now();\n\n`;

let totalAyahs = 0;
let totalModern = 0;
let totalMeta = 0;

for (const file of files) {
  const surahId = parseInt(path.basename(file, '.json'), 10);
  const data = JSON.parse(fs.readFileSync(path.join(surahsDir, file), 'utf8'));

  if (!data.ayahs || !Array.isArray(data.ayahs)) continue;

  sql += `\n-- ------------------------------------------------------------------------------\n`;
  sql += `-- Surah ${surahId}: ${data.ayahs.length} Ayahs\n`;
  sql += `-- ------------------------------------------------------------------------------\n`;

  const valuesRows = [];
  const metaRows = [];

  data.ayahs.forEach(a => {
    totalAyahs++;
    const convBn = a.conventional_bn || a.translation_bn || '';
    const convEn = a.conventional_en || a.translation_en || '';
    const modBn = a.modern_translation_bn || null;
    const modEn = a.modern_translation_en || null;
    const mBn = a.meta_bn || null;
    const mEn = a.meta_en || null;

    if (modBn || modEn) totalModern++;
    if (mBn || mEn) totalMeta++;

    let lexNotes = '';
    if (a.lexicon_modern_notes) {
      lexNotes = typeof a.lexicon_modern_notes === 'string'
        ? a.lexicon_modern_notes
        : JSON.stringify(a.lexicon_modern_notes);
    }

    const sPad = String(surahId).padStart(3, '0');
    const aPad = String(a.ayah).padStart(3, '0');
    const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${sPad}${aPad}.mp3`;
    const wordsJson = JSON.stringify(a.words || []).replace(/'/g, "''");

    valuesRows.push(`(${surahId}, ${a.ayah}, ${escapeSql(a.text_uthmani || '')}, '${wordsJson}'::jsonb, ${escapeSql(a.transliteration || '')}, ${escapeSql(convBn)}, ${escapeSql(convEn)}, ${escapeSql(convBn)}, ${escapeSql(convEn)}, ${escapeSql(modBn)}, ${escapeSql(modEn)}, ${escapeSql(mBn)}, ${escapeSql(mEn)}, ${escapeSql(lexNotes || null)}, ${escapeSql(audioUrl)}, now())`);

    if (mBn || mEn) {
      metaRows.push(`(${surahId}, ${a.ayah}, ${escapeSql(mBn)}, ${escapeSql(mEn)}, now())`);
    }
  });

  // Batch insert into quran_verses
  sql += `INSERT INTO public.quran_verses (surah, ayah, text_uthmani, words, transliteration, bn_text, en_text, conventional_bn, conventional_en, modern_translation_bn, modern_translation_en, meta_bn, meta_en, lexicon_modern_notes, audio_url, updated_at)\nVALUES\n  ` + valuesRows.join(',\n  ') + `\nON CONFLICT (surah, ayah) DO UPDATE SET\n  text_uthmani = EXCLUDED.text_uthmani,\n  words = EXCLUDED.words,\n  transliteration = EXCLUDED.transliteration,\n  bn_text = EXCLUDED.bn_text,\n  en_text = EXCLUDED.en_text,\n  conventional_bn = EXCLUDED.conventional_bn,\n  conventional_en = EXCLUDED.conventional_en,\n  modern_translation_bn = EXCLUDED.modern_translation_bn,\n  modern_translation_en = EXCLUDED.modern_translation_en,\n  meta_bn = EXCLUDED.meta_bn,\n  meta_en = EXCLUDED.meta_en,\n  lexicon_modern_notes = EXCLUDED.lexicon_modern_notes,\n  audio_url = EXCLUDED.audio_url,\n  updated_at = now();\n`;

  if (metaRows.length > 0) {
    sql += `\nINSERT INTO public.ayah_metadata (surah, ayah, meta_bn, meta_en, updated_at)\nVALUES\n  ` + metaRows.join(',\n  ') + `\nON CONFLICT (surah, ayah) DO UPDATE SET\n  meta_bn = EXCLUDED.meta_bn,\n  meta_en = EXCLUDED.meta_en,\n  updated_at = now();\n`;
  }
}

fs.writeFileSync(outputSqlPath, sql, 'utf8');
console.log(`✅ Master SQL Seed created: ${outputSqlPath} (${(fs.statSync(outputSqlPath).size / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`Total Chapters: 114`);
console.log(`Total Ayahs: ${totalAyahs}`);
console.log(`Ayahs with Modern Scientific Translations: ${totalModern}`);
console.log(`Ayahs with Metadata Tags: ${totalMeta}`);
