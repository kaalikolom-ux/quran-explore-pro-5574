import React, { createContext, useContext, useEffect, useState } from "react";

export type DisplayLayers = {
  showArabic: boolean;
  showWordByWord: boolean;
  showTransliteration: boolean;
  showConventionalBn: boolean;
  showConventionalEn: boolean;
  showModernBn: boolean;
  showModernEn: boolean;
  showLexicon: boolean;
};

export type Prefs = DisplayLayers & {
  lang: "bn" | "en";
  dark: boolean;
  arabicFontSize: number;
  translationFontSize: number;
};

export const DEFAULT_PREFS: Prefs = {
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

const STORAGE_KEY = "quran_explorer_unified_prefs_v1";

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

export function savePrefs(newPrefs: Prefs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
  window.dispatchEvent(new Event("prefs-updated"));
}

type PrefsContextType = {
  prefs: Prefs;
  lang: "bn" | "en";
  dark: boolean;
  setDark: (dark: boolean) => void;
  toggleLang: () => void;
  updatePref: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void;
  t: (key: string) => string;
};

const PrefsContext = createContext<PrefsContextType | null>(null);

export function PrefsProvider({ children }: { children: React.ReactNode }) {
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
    const current = getStoredPrefs();
    const updated = { ...current, [key]: value };
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
      siteName: { bn: "Quran Explorer", en: "Quran Explorer" },
      home: { bn: "হোম", en: "Home" },
      readQuran: { bn: "কুরআন পড়ুন", en: "Read Quran" },
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
      menuLinks: { bn: "মেনু লিংক", en: "Menu Links" },
      rights: { bn: "সর্বস্বত্ব সংরক্ষিত।", en: "All rights reserved." },
      allCategories: { bn: "সকল ক্যাটাগরি", en: "All Categories" },
      dashboard: { bn: "ড্যাশবোর্ড", en: "Dashboard" },
      dashboardSub: { bn: "কন্টেন্ট, সেটিংস ও ওয়েবসাইট ব্যবস্থাপনা প্যানেল", en: "Content, settings and website management panel" },
      newArticle: { bn: "নতুন আর্টিকেল", en: "New Article" },
      editArticle: { bn: "আর্টিকেল এডিট করুন", en: "Edit Article" },
      slug: { bn: "স্লাগ (URL)", en: "Slug (URL)" },
      titleBn: { bn: "বাংলা শিরোনাম", en: "Bangla Title" },
      titleEn: { bn: "ইংরেজি শিরোনাম", en: "English Title" },
      excerptBn: { bn: "বাংলা সংক্ষিপ্ত বিবরণ", en: "Bangla Excerpt" },
      excerptEn: { bn: "ইংরেজি সংক্ষিপ্ত বিবরণ", en: "English Excerpt" },
      contentBn: { bn: "বাংলা মূল বিষয়বস্তু", en: "Bangla Content" },
      contentEn: { bn: "ইংরেজি মূল বিষয়বস্তু", en: "English Content" },
      published: { bn: "প্রকাশিত", en: "Published" },
      coverImageUrl: { bn: "কভার ছবির URL", en: "Cover Image URL" },
      category: { bn: "ক্যাটাগরি", en: "Category" },
      save: { bn: "সংরক্ষণ করুন", en: "Save" },
      saving: { bn: "সংরক্ষণ হচ্ছে...", en: "Saving..." },
      cancel: { bn: "বাতিল", en: "Cancel" },
    };
    return dict[key]?.[prefs.lang] || key;
  };

  return (
    <PrefsContext.Provider
      value={{
        prefs,
        lang: prefs.lang,
        dark: prefs.dark,
        setDark,
        toggleLang,
        updatePref,
        t,
      }}
    >
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  const context = useContext(PrefsContext);
  if (!context) {
    const fallbackPrefs = getStoredPrefs();
    return {
      prefs: fallbackPrefs,
      lang: fallbackPrefs.lang,
      dark: fallbackPrefs.dark,
      setDark: () => {},
      toggleLang: () => {},
      updatePref: () => {},
      t: (key: string) => key,
    };
  }
  return context;
}