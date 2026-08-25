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
      // General & Layout
      siteName: { bn: "কুরআন অন্বেষা", en: "Quran Explorer" },
      home: { bn: "হোম", en: "Home" },
      readQuran: { bn: "কুরআন পড়ুন", en: "Read Quran" },
      articles: { bn: "আর্টিকেল", en: "Articles" },
      contact: { bn: "যোগাযোগ", en: "Contact" },
      settings: { bn: "সেটিংস", en: "Settings" },
      bookmarks: { bn: "বুকমার্ক", en: "Bookmarks" },
      admin: { bn: "অ্যাডমিন", en: "Admin" },
      adminOnly: { bn: "শুধুমাত্র অনুমোদিত অ্যাডমিন প্রবেশ করতে পারবেন।", en: "Access restricted to administrators only." },
      signOut: { bn: "লগআউট", en: "Sign Out" },
      signIn: { bn: "লগইন", en: "Sign In" },
      darkMode: { bn: "ডার্ক মোড", en: "Dark Mode" },
      language: { bn: "ভাষা", en: "Language" },
      tagline: { bn: "শব্দে শব্দে কুরআন ও প্রামাণ্য অনুবাদ", en: "Word by Word Quran & Authentic Translation" },
      heroSub: { bn: "কুরআনের প্রতিটি শব্দের ব্যাকরণগত ব্যুৎপত্তি, শাব্দিক ও ভাবানুবাদ একই পাতায়।", en: "Grammatical breakdown, word meaning, and translations in one place." },
      surahs: { bn: "সুরাসমূহ", en: "Surahs" },
      verses: { bn: "আয়াত", en: "Verses" },
      loading: { bn: "লোড হচ্ছে...", en: "Loading..." },
      latestArticles: { bn: "সাম্প্রতিক আর্টিকেল", en: "Latest Articles" },
      noArticles: { bn: "কোনো আর্টিকেল পাওয়া যায়নি।", en: "No articles found." },
      newsletter: { bn: "আমাদের নিউজলেটার সাবস্ক্রাইব করুন", en: "Subscribe to our Newsletter" },
      newsletterSub: { bn: "কুরআনের গভীর তাদাব্বুর ও নতুন গবেষণামূলক আর্টিকেল সরাসরি আপনার ইনবক্সে পান।", en: "Get Quranic tadabbur and new analytical articles directly in your inbox." },
      menuLinks: { bn: "মেনু লিংক", en: "Menu Links" },
      rights: { bn: "সর্বস্বত্ব সংরক্ষিত।", en: "All rights reserved." },
      allCategories: { bn: "সকল ক্যাটাগরি", en: "All Categories" },
      dashboard: { bn: "ড্যাশবোর্ড", en: "Dashboard" },
      dashboardSub: { bn: "কন্টেন্ট, সেটিংস ও ওয়েবসাইট ব্যবস্থাপনা প্যানেল", en: "Content, settings and website management panel" },
      save: { bn: "সংরক্ষণ করুন", en: "Save" },
      saving: { bn: "সংরক্ষণ হচ্ছে...", en: "Saving..." },
      saved: { bn: "সফলভাবে সংরক্ষিত হয়েছে", en: "Saved successfully" },
      cancel: { bn: "বাতিল", en: "Cancel" },
      delete: { bn: "মুছে ফেলা হয়েছে", en: "Deleted" },
      edit: { bn: "সম্পাদনা", en: "Edit" },
      draft: { bn: "খসড়া (Draft)", en: "Draft" },
      published: { bn: "প্রকাশিত", en: "Published" },
      visible: { bn: "প্রদর্শন", en: "Visible" },
      sortOrder: { bn: "ক্রমিক নম্বর (Sort Order)", en: "Sort Order" },

      // Main Navigation Tabs
      translationsTab: { bn: "কুরআন অনুবাদ", en: "Verse Translations" },
      postSettings: { bn: "লেখক ও পোস্ট সেটিংস", en: "Post & Author Settings" },
      authorsTab: { bn: "লেখকবৃন্দ", en: "Authors" },
      categoriesTab: { bn: "ক্যাটাগরি", en: "Categories" },
      menuTab: { bn: "নেভিগেশন মেনু", en: "Menu Settings" },
      pagesTab: { bn: "পেইজসমূহ", en: "Pages" },
      socialTab: { bn: "সোশ্যাল মিডিয়া লিংক", en: "Social Links" },
      turnstileTab: { bn: "টার্নস্টাইল সিকিউরিটি ও ইমেইল", en: "Turnstile Security" },
      messagesTab: { bn: "ব্যবহারকারীর বার্তা / ফিডব্যাক", en: "Messages" },
      offlineTab: { bn: "অফলাইন ডেটা সিঙ্ক ও ক্যাশ", en: "Offline Sync" },
      subscribersTab: { bn: "সাবস্ক্রাইবার তালিকা", en: "Subscribers" },

      // Articles
      newArticle: { bn: "নতুন আর্টিকেল", en: "New Article" },
      editArticle: { bn: "আর্টিকেল এডিট করুন", en: "Edit Article" },
      slug: { bn: "স্লাগ (URL)", en: "Slug (URL)" },
      titleBn: { bn: "বাংলা শিরোনাম", en: "Bangla Title" },
      titleEn: { bn: "ইংরেজি শিরোনাম", en: "English Title" },
      excerptBn: { bn: "বাংলা সংক্ষিপ্ত বিবরণ", en: "Bangla Excerpt" },
      excerptEn: { bn: "ইংরেজি সংক্ষিপ্ত বিবরণ", en: "English Excerpt" },
      contentBn: { bn: "বাংলা মূল বিষয়বস্তু", en: "Bangla Content" },
      contentEn: { bn: "ইংরেজি মূল বিষয়বস্তু", en: "English Content" },
      coverImage: { bn: "কভার ছবির URL", en: "Cover Image URL" },
      coverImageUrl: { bn: "কভার ছবির URL", en: "Cover Image URL" },
      category: { bn: "ক্যাটাগরি", en: "Category" },
      noCategory: { bn: "কোনো ক্যাটাগরি নেই", en: "No Category" },
      author: { bn: "লেখক", en: "Author" },
      noAuthor: { bn: "কোনো নির্দিষ্ট লেখক নেই", en: "No Author" },

      // Authors
      newAuthor: { bn: "নতুন লেখক যুক্ত করুন", en: "Add New Author" },
      authorNameBn: { bn: "লেখকের নাম (বাংলা)", en: "Author Name (Bangla)" },
      authorNameEn: { bn: "লেখকের নাম (English)", en: "Author Name (English)" },
      authorImage: { bn: "লেখকের ছবি (URL)", en: "Author Photo (URL)" },
      authorBioBn: { bn: "লেখকের পরিচিতি (বাংলা)", en: "Author Bio (Bangla)" },
      authorBioEn: { bn: "লেখকের পরিচিতি (English)", en: "Author Bio (English)" },

      // Categories
      newCategory: { bn: "নতুন ক্যাটাগরি তৈরি করুন", en: "New Category" },
      categoryNameBn: { bn: "ক্যাটাগরির নাম (বাংলা)", en: "Category Name (Bangla)" },
      categoryNameEn: { bn: "ক্যাটাগরির নাম (English)", en: "Category Name (English)" },
      showInMenu: { bn: "হেডার মেনুতে প্রদর্শন করুন", en: "Show in Menu" },

      // Pages
      newPage: { bn: "নতুন পেজ তৈরি করুন", en: "Create New Page" },
      pageTitleBn: { bn: "পেজের শিরোনাম (বাংলা)", en: "Page Title (Bangla)" },
      pageTitleEn: { bn: "পেজের শিরোনাম (English)", en: "Page Title (English)" },
      pageSlug: { bn: "পেজ স্লাগ (URL Slug)", en: "Page Slug (URL)" },
      pageContentBn: { bn: "পেজের বিষয়বস্তু (বাংলা)", en: "Page Content (Bangla)" },
      pageContentEn: { bn: "পেজের বিষয়বস্তু (English)", en: "Page Content (English)" },
      metaDescriptionBn: { bn: "মেটা বিবরণ (বাংলা)", en: "Meta Description (Bangla)" },
      metaDescriptionEn: { bn: "মেটা বিবরণ (English)", en: "Meta Description (English)" },
      addToHeaderMenu: { bn: "হেডার মেনুতে যুক্ত করুন", en: "Add to Header Menu" },
      addToFooterMenu: { bn: "ফুটার মেনুতে যুক্ত করুন", en: "Add to Footer Menu" },

      // Menu
      newMenuItem: { bn: "নতুন মেনু আইটেম", en: "New Menu Item" },
      menuLabelBn: { bn: "মেনুর নাম (বাংলা)", en: "Menu Label (Bangla)" },
      menuLabelEn: { bn: "মেনুর নাম (English)", en: "Menu Label (English)" },
      menuLink: { bn: "মেনু লিংক (URL/Path)", en: "Menu Link (URL)" },
      menuLocation: { bn: "মেনুর অবস্থান", en: "Menu Location" },
      headerMenu: { bn: "হেডার মেনু", en: "Header Menu" },
      footerMenu: { bn: "ফুটার মেনু", en: "Footer Menu" },

      // Social Links & Platforms
      newSocialLink: { bn: "নতুন সোশ্যাল মিডিয়া লিংক", en: "New Social Link" },
      platform: { bn: "প্ল্যাটফর্ম", en: "Platform" },
      labelOptional: { bn: "লেবেল / নাম (ঐচ্ছিক)", en: "Label (Optional)" },
      link: { bn: "প্রোফাইল লিংক (URL)", en: "Profile Link (URL)" },
      facebook: { bn: "Facebook", en: "Facebook" },
      instagram: { bn: "Instagram", en: "Instagram" },
      twitter: { bn: "Twitter", en: "Twitter" },
      x: { bn: "X (Twitter)", en: "X (Twitter)" },
      youtube: { bn: "YouTube", en: "YouTube" },
      linkedin: { bn: "LinkedIn", en: "LinkedIn" },
      github: { bn: "GitHub", en: "GitHub" },
      telegram: { bn: "Telegram", en: "Telegram" },
      whatsapp: { bn: "WhatsApp", en: "WhatsApp" },
      email: { bn: "Email", en: "Email" },
      website: { bn: "Website", en: "Website" },

      // Messages
      noMessages: { bn: "কোনো নতুন বার্তা বা ফিডব্যাক নেই।", en: "No messages found." },

      // Turnstile & Security & Email
      turnstileHint: { bn: "Cloudflare Turnstile ও ইমেইল নোটিফিকেশন কনফিগারেশন সেট করুন।", en: "Configure Cloudflare Turnstile and email notifications." },
      turnstileSiteKey: { bn: "Turnstile সাইট কী (Site Key)", en: "Turnstile Site Key" },
      turnstileSecretKey: { bn: "Turnstile সিক্রেট কী (Secret Key)", en: "Turnstile Secret Key" },
      contactFromEmail: { bn: "কন্টাক্ট সেন্ডার ইমেইল", en: "Contact Sender Email" },
      contactSenderDomain: { bn: "ভেরিফায়েড সেন্ডার ডোমেইন", en: "Sender Domain" },

      // Offline Sync & Audio Mirror
      offlineSync: { bn: "কুরআন অফলাইন ডেটা সিঙ্ক", en: "Quran Offline Sync" },
      offlineSyncHint: { bn: "ইন্টারনেট ছাড়া পড়ার জন্য কুরআনের সমস্ত সূরা ও অনুবাদ লোকাল ক্যাশে সংরক্ষণ করুন।", en: "Cache all Surahs and translations locally for offline reading." },
      syncedSurahs: { bn: "সিঙ্ককৃত সূরা", en: "Synced Surahs" },
      syncAll: { bn: "সব সূরা সিঙ্ক করুন", en: "Sync All Surahs" },
      syncFirstTen: { bn: "প্রথম ১০টি সূরা সিঙ্ক করুন", en: "Sync First 10 Surahs" },
      audioMirror: { bn: "অডিও ফাইল মিররিং ও ক্যাশিং", en: "Audio Mirroring & Cache" },
      audioMirrorHint: { bn: "দ্রুত লোডিং ও অফলাইন শোনার সুবিধার্থে অডিও ফাইল ক্যাশ করুন।", en: "Mirror audio files for fast loading and offline playback." },
      audioMirrorProgress: { bn: "অডিও সিঙ্ক অগ্রগতি", en: "Audio Mirror Progress" },
      audioMirrorStart: { bn: "অডিও মিররিং শুরু করুন", en: "Start Audio Mirroring" },

      // Verse Translation
      surahNumber: { bn: "সূরা নম্বর", en: "Surah Number" },
      ayahNumber: { bn: "আয়াত নম্বর", en: "Ayah Number" },
      translationType: { bn: "অনুবাদ টাইপ", en: "Translation Type" },
      translationText: { bn: "অনুবাদ টেক্সট", en: "Translation Text" },
      note: { bn: "বিশেষ টীকা / নোট", en: "Special Note" },
      sciBn: { bn: "বিজ্ঞানভিত্তিক (বাংলা)", en: "Scientific (Bangla)" },
      sciEn: { bn: "বিজ্ঞানভিত্তিক (English)", en: "Scientific (English)" },
      stdBn: { bn: "প্রচলিত অনুবাদ (বাংলা)", en: "Standard (Bangla)" },
      stdEn: { bn: "প্রচলিত অনুবাদ (English)", en: "Standard (English)" },
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