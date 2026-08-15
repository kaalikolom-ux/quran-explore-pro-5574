import { useEffect, useState } from "react";

export type Prefs = {
  lang: "bn" | "en";
  dark: boolean;
  arabicFontSize: number;
  translationFontSize: number;
  showArabic: boolean;
  showWordByWord: boolean;
  showTransliteration: boolean;
  showConventionalBn: boolean;
  showConventionalEn: boolean;
  showModernBn: boolean;
  showModernEn: boolean;
  showLexicon: boolean;
};

const DEFAULT_PREFS: Prefs = {
  lang: "bn",
  dark: true,
  arabicFontSize: 28,
  translationFontSize: 15,
  showArabic: true,
  showWordByWord: true,
  showTransliteration: true,
  showConventionalBn: true,
  showConventionalEn: true,
  showModernBn: true,
  showModernEn: true,
  showLexicon: true,
};

const STORAGE_KEY = "quran_anwesha_prefs_v2";

export function getStoredPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(prefs: Prefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new Event("prefs-updated"));
  window.dispatchEvent(new Event("storage"));
}

export function usePrefs() {
  const [prefs, setPrefsState] = useState<Prefs>(getStoredPrefs);

  useEffect(() => {
    const handleUpdate = () => {
      setPrefsState(getStoredPrefs());
    };

    window.addEventListener("prefs-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("prefs-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (prefs.dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [prefs.dark]);

  const updatePref = <K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    const updated = { ...getStoredPrefs(), [key]: value };
    setPrefsState(updated);
    savePrefs(updated);
  };

  const toggleLang = () => {
    updatePref("lang", prefs.lang === "bn" ? "en" : "bn");
  };

  const setDark = (dark: boolean) => {
    updatePref("dark", dark);
  };

  const t = (key: string) => {
    const dict: Record<string, { bn: string; en: string }> = {
      home: { bn: "হোম", en: "Home" },
      readQuran: { bn: "কুরআন পড়ুন", en: "Read Quran" },
      articles: { bn: "আর্টিকেল", en: "Articles" },
      contact: { bn: "যোগাযোগ", en: "Contact" },
      settings: { bn: "সেটিংস", en: "Settings" },
      bookmarks: { bn: "বুকমার্ক", en: "Bookmarks" },
      admin: { bn: "অ্যাডমিন", en: "Admin" },
      signOut: { bn: "লগআউট", en: "Sign Out" },
      signIn: { bn: "লগইন", en: "Sign In" },
      darkMode: { bn: "ডার্ক মোড", en: "Dark Mode" },
      language: { bn: "ভাষা", en: "Language" },
      tagline: { bn: "শব্দে শব্দে কুরআন ও প্রামাণ্য অনুবাদ", en: "Word by Word Quran & Authentic Translation" },
      heroSub: { bn: "কুরআনের প্রতিটি শব্দের ব্যাকরণগত ব্যুৎপত্তি, শাব্দিক ও ভাবানুবাদ একই পাতায়।", en: "Grammatical breakdown, word meaning, and translations in one place." },
      surahs: { bn: "সুরাসমূহ", en: "Surahs" },
      verses: { bn: "আয়াত", en: "Verses" },
      loading: { bn: "লোড হচ্ছে...", en: "Loading..." },
      latestArticles: { bn: "সাম্প্রতিক আর্টিকেল", en: "Latest Articles" },
      noArticles: { bn: "কোনো আর্টিকেল পাওয়া যায়নি।", en: "No articles found." },
      newsletter: { bn: "আমাদের নিউজলেটার সাবস্ক্রাইব করুন", en: "Subscribe to our Newsletter" },
      newsletterSub: { bn: "কুরআনের গভীর তাদাব্বুর ও নতুন গবেষণামূলক আর্টিকেল সরাসরি আপনার ইনবক্সে পান।", en: "Get Quranic tadabbur and new analytical articles directly in your inbox." },
    };
    return dict[key]?.[prefs.lang] || key;
  };

  return {
    prefs,
    lang: prefs.lang,
    dark: prefs.dark,
    setDark,
    toggleLang,
    updatePref,
    t,
  };
}