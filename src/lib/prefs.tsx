import React, { createContext, useContext, useEffect, useState } from "react";

export type DisplayLayers = {
  showArabic: boolean;
  showWordByWord: boolean;
  showTransliteration: boolean;
  showConventionalBn: boolean;
  showModernBn: boolean;
  showLexicon: boolean;
  showLexiconScientific: boolean;
};

export type Prefs = DisplayLayers & {
  lang: "bn";
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
  showModernBn: true,
  showLexicon: true,
  showLexiconScientific: true,
};

const STORAGE_KEY = "quran_explorer_unified_prefs_v1";

export function getStoredPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFS, ...parsed, lang: "bn" };
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
  lang: "bn";
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
    // Pure Bengali site - language remains Bengali
  };

  const setDark = (dark: boolean) => {
    updatePref("dark", dark);
  };

  const t = (key: string): string => {
    const dict: Record<string, string> = {
      siteName: "কুরআন অন্বেষা",
      home: "হোম",
      readQuran: "কুরআন পড়ুন",
      articles: "আর্টিকেল",
      contact: "যোগাযোগ",
      settings: "সেটিংস",
      bookmarks: "বুকমার্ক",
      admin: "অ্যাডমিন",
      adminOnly: "শুধুমাত্র অনুমোদিত অ্যাডমিন প্রবেশ করতে পারবেন।",
      signOut: "লগআউট",
      signIn: "লগইন",
      createAccount: "অ্যাকাউন্ট তৈরি করুন",
      haveAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন",
      noAccount: "নতুন ব্যবহারকারী? অ্যাকাউন্ট খুলুন",
      signInPrompt: "আপনার পছন্দের আয়াত ও আর্টিকেল সংরক্ষণ করতে সাইন ইন করুন",
      forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
      resetPassword: "পাসওয়ার্ড রিসেট",
      sendResetLink: "রিসেট লিংক পাঠান",
      backToSignIn: "লগইনে ফিরে যান",
      resetSent: "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।",
      email: "ইমেইল",
      Email: "ইমেইল এড্রেস",
      password: "পাসওয়ার্ড",
      error: "কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন",
      darkMode: "ডার্ক মোড",
      language: "ভাষা",
      tagline: "শব্দে শব্দে কুরআন ও প্রামাণ্য অনুবাদ",
      heroTitle: "পবিত্র কুরআন — বুঝে পড়ুন",
      heroSub: "কুরআনের প্রতিটি শব্দের ব্যাকরণগত ব্যুৎপত্তি, শাব্দিক ও ভাবানুবাদ একই পাতায়।",
      readSurah1: "সূরা ফাতিহা পড়ুন",
      viewLexicon: "কুরআনিক অভিধান",
      surahs: "সুরাসমূহ",
      verses: "আয়াত",
      loading: "লোড হচ্ছে...",
      latestArticles: "সাম্প্রতিক আর্টিকেল",
      noArticles: "কোনো আর্টিকেল পাওয়া যায়নি।",
      newsletter: "আমাদের নিউজলেটার সাবস্ক্রাইব করুন",
      newsletterSub: "কুরআনের গভীর তাদাব্বুর ও নতুন গবেষণামূলক আর্টিকেল সরাসরি আপনার ইনবক্সে পান।",
      subscribe: "সাবস্ক্রাইব করুন",
      emailPlaceholder: "আপনার ইমেইল লিখুন...",
      searchPlaceholder: "সুরা বা আয়াত খুঁজুন...",
      menuLinks: "মেনু লিংক",
      rights: "সর্বস্বত্ব সংরক্ষিত।",
      allCategories: "সকল ক্যাটাগরি",
      dashboard: "ড্যাশবোর্ড",
      dashboardSub: "কন্টেন্ট, সেটিংস ও ওয়েবসাইট ব্যবস্থাপনা প্যানেল",
      save: "সংরক্ষণ করুন",
      saving: "সংরক্ষণ হচ্ছে...",
      saved: "সফলভাবে সংরক্ষিত হয়েছে",
      cancel: "বাতিল",
      delete: "মুছে ফেলুন",
      edit: "সম্পাদনা",
      draft: "খসড়া",
      published: "প্রকাশিত",
      visible: "প্রদর্শন",
      sortOrder: "ক্রমিক নম্বর",
      yourName: "আপনার নাম",
      subject: "বিষয়",
      messageLabel: "আপনার বার্তা / মন্তব্য",
      sendMessage: "বার্তা পাঠান",
      sending: "বার্তা পাঠানো হচ্ছে...",
      messageSent: "আপনার বার্তা সফলভাবে পাঠানো হয়েছে!",
      translationsTab: "কুরআন অনুবাদ",
      postSettings: "লেখক ও পোস্ট সেটিংস",
      authorsTab: "লেখকবৃন্দ",
      categoriesTab: "ক্যাটাগরি",
      menuTab: "নেভিগেশন মেনু",
      pagesTab: "পেইজসমূহ",
      socialTab: "সোশ্যাল মিডিয়া লিংক",
      turnstileTab: "টার্নস্টাইল সিকিউরিটি ও ইমেইল",
      messagesTab: "ব্যবহারকারীর বার্তা / ফিডব্যাক",
      offlineTab: "অফলাইন ডেটা সিঙ্ক ও ক্যাশ",
      subscribersTab: "সাবস্ক্রাইবার তালিকা",
      newArticle: "নতুন আর্টিকেল",
      editArticle: "আর্টিকেল এডিট করুন",
      slug: "স্লাগ (URL)",
      titleBn: "বাংলা শিরোনাম",
      excerptBn: "বাংলা সংক্ষিপ্ত বিবরণ",
      contentBn: "বাংলা মূল বিষয়বস্তু",
      coverImage: "কভার ছবির URL",
      category: "ক্যাটাগরি",
      noCategory: "কোনো ক্যাটাগরি নেই",
      author: "লেখক",
      noAuthor: "কোনো নির্দিষ্ট লেখক নেই",
      newAuthor: "নতুন লেখক যুক্ত করুন",
      authorNameBn: "লেখকের নাম (বাংলা)",
      authorImage: "লেখকের ছবি (URL)",
      authorBioBn: "লেখকের পরিচিতি (বাংলা)",
      newCategory: "নতুন ক্যাটাগরি তৈরি করুন",
      categoryNameBn: "ক্যাটাগরির নাম (বাংলা)",
      showInMenu: "হেডার মেনুতে প্রদর্শন করুন",
      newPage: "নতুন পেজ তৈরি করুন",
      pageTitleBn: "পেজের শিরোনাম (বাংলা)",
      pageSlug: "পেজ স্লাগ (URL Slug)",
      pageContentBn: "পেজের বিষয়বস্তু (বাংলা)",
      metaDescriptionBn: "মেটা বিবরণ (বাংলা)",
      addToHeaderMenu: "হেডার মেনুতে যুক্ত করুন",
      addToFooterMenu: "ফুটার মেনুতে যুক্ত করুন",
      newMenuItem: "নতুন মেনু আইটেম",
      menuLabelBn: "মেনুর নাম (বাংলা)",
      menuLink: "মেনু লিংক (URL/Path)",
      menuLocation: "মেনুর অবস্থান",
      headerMenu: "হেডার মেনু",
      footerMenu: "ফুটার মেনু",
      newSocialLink: "নতুন সোশ্যাল মিডিয়া লিংক",
      platform: "প্ল্যাটফর্ম",
      labelOptional: "লেবেল / নাম (ঐচ্ছিক)",
      link: "প্রোফাইল লিংক (URL)",
      noMessages: "কোনো নতুন বার্তা বা ফিডব্যাক নেই।",
      turnstileHint: "Cloudflare Turnstile ও ইমেইল নোটিফিকেশন কনফিগারেশন সেট করুন।",
      stdBn: "প্রচলিত অনুবাদ (বাংলা)",
    };
    return dict[key] || key;
  };

  return (
    <PrefsContext.Provider
      value={{
        prefs,
        lang: "bn",
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