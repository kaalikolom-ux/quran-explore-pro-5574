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
  showLexiconScientific: boolean;
  showMetaData: boolean;
  showSurahScientificMeaning: boolean;
};

export type ThemeMode = "dark" | "sepia" | "slate" | "light";

export type Prefs = DisplayLayers & {
  lang: "bn" | "en";
  dark: boolean;
  themeMode?: ThemeMode;
  arabicFontSize: number;
  translationFontSize: number;
};

export const DEFAULT_PREFS: Prefs = {
  lang: "bn",
  dark: true,
  themeMode: "dark",
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
  showLexiconScientific: true,
  showMetaData: true,
  showSurahScientificMeaning: true,
};

export type PublicDisplayPermissions = {
  showArabic: boolean;
  showWordByWord: boolean;
  showTransliteration: boolean;
  showConventionalBn: boolean;
  showConventionalEn: boolean;
  showModernBn: boolean;
  showModernEn: boolean;
  showLexicon: boolean;
  showLexiconScientific: boolean;
  showMetaData: boolean;
  showSurahScientificMeaning: boolean;
};

export const DEFAULT_PUBLIC_PERMISSIONS: PublicDisplayPermissions = {
  showArabic: true,
  showWordByWord: true,
  showTransliteration: true,
  showConventionalBn: true,
  showConventionalEn: true,
  showModernBn: true,
  showModernEn: true,
  showLexicon: true,
  showLexiconScientific: true,
  showMetaData: true,
  showSurahScientificMeaning: true,
};

const STORAGE_KEY = "quran_explorer_unified_prefs_v1";
const PUBLIC_PERMS_STORAGE_KEY = "quran_explorer_public_display_permissions_v1";

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

export function getStoredPublicPermissions(): PublicDisplayPermissions {
  if (typeof window === "undefined") return DEFAULT_PUBLIC_PERMISSIONS;
  try {
    const raw = localStorage.getItem(PUBLIC_PERMS_STORAGE_KEY);
    if (!raw) return DEFAULT_PUBLIC_PERMISSIONS;
    return { ...DEFAULT_PUBLIC_PERMISSIONS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PUBLIC_PERMISSIONS;
  }
}

type PrefsContextType = {
  prefs: Prefs;
  publicPermissions: PublicDisplayPermissions;
  userPermissions: PublicDisplayPermissions | null;
  lang: "bn" | "en";
  dark: boolean;
  themeMode: ThemeMode;
  setDark: (dark: boolean) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleLang: () => void;
  updatePref: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void;
  updatePublicPermission: (key: keyof PublicDisplayPermissions, value: boolean) => Promise<void>;
  isLayerAllowed: (layerKey: keyof PublicDisplayPermissions, isAdmin?: boolean) => boolean;
  t: (key: string) => string;
};

const PrefsContext = createContext<PrefsContextType | null>(null);

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefsState] = useState<Prefs>(getStoredPrefs);
  const [publicPermissions, setPublicPermissions] = useState<PublicDisplayPermissions>(getStoredPublicPermissions);
  const [userPermissions, setUserPermissions] = useState<PublicDisplayPermissions | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setPrefsState(getStoredPrefs());
      setPublicPermissions(getStoredPublicPermissions());
    };
    window.addEventListener("prefs-updated", handleUpdate);
    window.addEventListener("public-perms-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("prefs-updated", handleUpdate);
      window.removeEventListener("public-perms-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Sync public permissions and individual user permissions from Supabase
  useEffect(() => {
    import("@/integrations/supabase/client").then(({ supabase }) => {
      // 1. Public permissions from site_settings
      supabase
        .from("site_settings")
        .select("value")
        .eq("key", "public_display_permissions")
        .maybeSingle()
        .then(({ data }) => {
          if (data?.value) {
            try {
              const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
              const merged = { ...DEFAULT_PUBLIC_PERMISSIONS, ...parsed };
              setPublicPermissions(merged);
              localStorage.setItem(PUBLIC_PERMS_STORAGE_KEY, JSON.stringify(merged));
            } catch {}
          }
        })
        .catch(() => {});

      // 2. Individual user permissions if logged in
      const syncUserPermissions = async () => {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          const uid = sessionData?.session?.user?.id;
          if (uid) {
            const { data } = await supabase
              .from("user_display_permissions" as any)
              .select("permissions")
              .eq("user_id", uid)
              .maybeSingle();
            if (data && (data as any).permissions) {
              setUserPermissions((data as any).permissions);
            } else {
              setUserPermissions(null);
            }
          } else {
            setUserPermissions(null);
          }
        } catch {
          setUserPermissions(null);
        }
      };

      syncUserPermissions();

      const { data: authSub } = supabase.auth.onAuthStateChange(() => {
        syncUserPermissions();
      });

      return () => {
        authSub?.subscription.unsubscribe();
      };
    });
  }, []);

  const themeMode: ThemeMode = prefs.themeMode || (prefs.dark ? "dark" : "sepia");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "theme-sepia", "theme-slate", "theme-light");

    if (themeMode === "dark") {
      root.classList.add("dark");
    } else if (themeMode === "sepia") {
      root.classList.add("theme-sepia");
    } else if (themeMode === "slate") {
      root.classList.add("theme-slate");
    } else if (themeMode === "light") {
      root.classList.add("theme-light");
    }
  }, [themeMode]);

  const updatePref = <K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    const current = getStoredPrefs();
    const updated = { ...current, [key]: value };
    setPrefsState(updated);
    savePrefs(updated);
  };

  const updatePublicPermission = async (key: keyof PublicDisplayPermissions, value: boolean) => {
    const current = getStoredPublicPermissions();
    const updated: PublicDisplayPermissions = { ...current, [key]: value };
    setPublicPermissions(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(PUBLIC_PERMS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("public-perms-updated"));
    }

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("site_settings").upsert({
        key: "public_display_permissions",
        value: JSON.stringify(updated),
        is_public: true,
      }, { onConflict: "key" });
    } catch {}
  };

  const toggleLang = () => {
    updatePref("lang", prefs.lang === "bn" ? "en" : "bn");
  };

  const setDark = (dark: boolean) => {
    const newMode: ThemeMode = dark ? "dark" : (prefs.themeMode && prefs.themeMode !== "dark" ? prefs.themeMode : "sepia");
    const current = getStoredPrefs();
    const updated: Prefs = { ...current, dark, themeMode: newMode };
    setPrefsState(updated);
    savePrefs(updated);
  };

  const setThemeMode = (mode: ThemeMode) => {
    const isDark = mode === "dark";
    const current = getStoredPrefs();
    const updated: Prefs = { ...current, dark: isDark, themeMode: mode };
    setPrefsState(updated);
    savePrefs(updated);
  };

  const t = (key: string) => {
    const dict: Record<string, { bn: string; en: string }> = {
      // General & Layout
      siteName: { bn: "কুরআন অন্বেষা", en: "Quran Explorer" },
      home: { bn: "হোম", en: "Home" },
      readQuran: { bn: "কুরআন পড়ুন", en: "Read Quran" },
      articles: { bn: "আর্টিকেল", en: "Articles" },
      contact: { bn: "যোগাযোগ", en: "Contact" },
      settings: { bn: "সেটিংস", en: "Settings" },
      bookmarks: { bn: "বুকমার্ক", en: "Bookmarks" },
      admin: { bn: "অ্যাডমিন", en: "Admin" },
      adminOnly: { bn: "শুধুমাত্র অনুমোদিত অ্যাডমিন প্রবেশ করতে পারবেন।", en: "Access restricted to administrators only." },
      signOut: { bn: "লগআউট", en: "Sign Out" },
      signIn: { bn: "লগইন", en: "Sign In" },
      createAccount: { bn: "অ্যাকাউন্ট তৈরি করুন", en: "Create Account" },
      haveAccount: { bn: "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন", en: "Already have an account? Sign in" },
      noAccount: { bn: "নতুন ব্যবহারকারী? অ্যাকাউন্ট খুলুন", en: "Don't have an account? Sign up" },
      signInPrompt: { bn: "আপনার পছন্দের আয়াত ও আর্টিকেল সংরক্ষণ করতে সাইন ইন করুন", en: "Sign in to save and manage your bookmarks and notes" },
      forgotPassword: { bn: "পাসওয়ার্ড ভুলে গেছেন?", en: "Forgot your password?" },
      resetPassword: { bn: "পাসওয়ার্ড রিসেট", en: "Reset Password" },
      sendResetLink: { bn: "রিসেট লিংক পাঠান", en: "Send Reset Link" },
      backToSignIn: { bn: "লগইনে ফিরে যান", en: "Back to Sign In" },
      resetSent: { bn: "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।", en: "Password reset link has been sent to your email." },
      email: { bn: "ইমেইল", en: "Email" },
      Email: { bn: "ইমেইল এড্রেস", en: "Email Address" },
      password: { bn: "পাসওয়ার্ড", en: "Password" },
      error: { bn: "কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন", en: "Something went wrong, please try again" },
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
      save: { bn: "সংরক্ষণ করুন", en: "Save" },
      saving: { bn: "সংরক্ষণ হচ্ছে...", en: "Saving..." },
      saved: { bn: "সফলভাবে সংরক্ষিত হয়েছে", en: "Saved successfully" },
      cancel: { bn: "বাতিল", en: "Cancel" },
      delete: { bn: "মুছে ফেলা হয়েছে", en: "Deleted" },
      edit: { bn: "সম্পাদনা", en: "Edit" },
      draft: { bn: "খসড়া (Draft)", en: "Draft" },
      published: { bn: "প্রকাশিত", en: "Published" },
      visible: { bn: "প্রদর্শন", en: "Visible" },
      sortOrder: { bn: "ক্রমিক নম্বর (Sort Order)", en: "Sort Order" },

      // Contact Form Specific
      contactIntroTitle: { bn: "আমাদের সাথে সরাসরি যোগাযোগ করুন", en: "Get in touch with us directly" },
      contactIntro: { bn: "কুরআন অন্বেষা সম্পর্কিত যেকোনো প্রশ্ন, মতামত, বা পরামর্শ পাঠাতে নিচের ফর্মটি পূরণ করুন।", en: "Fill out the form below for any questions, feedback, or suggestions regarding Quran Explorer." },
      yourName: { bn: "আপনার নাম", en: "Your Name" },
      subject: { bn: "বিষয় (Subject)", en: "Subject" },
      messageLabel: { bn: "আপনার বার্তা / মন্তব্য", en: "Your Message" },
      sendMessage: { bn: "বার্তা পাঠান", en: "Send Message" },
      sending: { bn: "বার্তা পাঠানো হচ্ছে...", en: "Sending..." },
      messageSent: { bn: "আপনার বার্তা সফলভাবে পাঠানো হয়েছে!", en: "Your message has been sent successfully!" },

      // Main Navigation Tabs
      translationsTab: { bn: "কুরআন অনুবাদ", en: "Verse Translations" },
      postSettings: { bn: "লেখক ও পোস্ট সেটিংস", en: "Post & Author Settings" },
      authorsTab: { bn: "লেখকবৃন্দ", en: "Authors" },
      categoriesTab: { bn: "ক্যাটাগরি", en: "Categories" },
      menuTab: { bn: "নেভিগেশন মেনু", en: "Menu Settings" },
      pagesTab: { bn: "পেইজসমূহ", en: "Pages" },
      socialTab: { bn: "সোশ্যাল মিডিয়া লিংক", en: "Social Links" },
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
      contentBn: { bn: "বাংলা মূল বিষয়বস্তু", en: "Bangla Content" },
      contentEn: { bn: "ইংরেজি মূল বিষয়বস্তু", en: "English Content" },
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
      pageContentBn: { bn: "পেজের বিষয়বস্তু (বাংলা)", en: "Page Content (Bangla)" },
      pageContentEn: { bn: "পেজের বিষয়বস্তু (English)", en: "Page Content (English)" },
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
      newSocialLink: { bn: "নতুন সোশ্যাল মিডিয়া লিংক", en: "New Social Link" },
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
      website: { bn: "Website", en: "Website" },

      // Messages
      noMessages: { bn: "কোনো নতুন বার্তা বা ফিডব্যাক নেই।", en: "No messages found." },

      // Turnstile & Security & Email
      turnstileHint: { bn: "Cloudflare Turnstile ও ইমেইল নোটিফিকেশন কনফিগারেশন সেট করুন।", en: "Configure Cloudflare Turnstile and email notifications." },
      turnstileSiteKey: { bn: "Turnstile সাইট কী (Site Key)", en: "Turnstile Site Key" },
      turnstileSecretKey: { bn: "Turnstile সিক্রেট কী (Secret Key)", en: "Turnstile Secret Key" },
      contactFromEmail: { bn: "কন্টাক্ট সেন্ডার ইমেইল", en: "Contact Sender Email" },
      contactSenderDomain: { bn: "ভেরিফায়েড সেন্ডার ডোমেইন", en: "Sender Domain" },

      // Offline Sync & Audio Mirror
      offlineSync: { bn: "কুরআন অফলাইন ডেটা সিঙ্ক", en: "Quran Offline Sync" },
      offlineSyncHint: { bn: "ইন্টারনেট ছাড়া পড়ার জন্য কুরআনের সমস্ত সূরা ও অনুবাদ লোকাল ক্যাশে সংরক্ষণ করুন।", en: "Cache all Surahs and translations locally for offline reading." },
      syncedSurahs: { bn: "সিঙ্ককৃত সূরা", en: "Synced Surahs" },
      syncAll: { bn: "সব সূরা সিঙ্ক করুন", en: "Sync All Surahs" },
      syncFirstTen: { bn: "প্রথম ১০টি সূরা সিঙ্ক করুন", en: "Sync First 10 Surahs" },
      audioMirror: { bn: "অডিও ফাইল মিররিং ও ক্যাশিং", en: "Audio Mirroring & Cache" },
      audioMirrorHint: { bn: "দ্রুত লোডিং ও অফলাইন শোনার সুবিধার্থে অডিও ফাইল ক্যাশ করুন।", en: "Mirror audio files for fast loading and offline playback." },
      audioMirrorProgress: { bn: "অডিও সিঙ্ক অগ্রগতি", en: "Audio Mirror Progress" },
      audioMirrorStart: { bn: "অডিও মিররিং শুরু করুন", en: "Start Audio Mirroring" },

      // Verse Translation
      surahNumber: { bn: "সূরা নম্বর", en: "Surah Number" },
      ayahNumber: { bn: "আয়াত নম্বর", en: "Ayah Number" },
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

  const isLayerAllowed = (layerKey: keyof PublicDisplayPermissions, isAdminUser: boolean = false): boolean => {
    if (isAdminUser) return true;
    if (userPermissions && userPermissions[layerKey] !== undefined) {
      return userPermissions[layerKey];
    }
    return publicPermissions[layerKey] ?? true;
  };

  return (
    <PrefsContext.Provider
      value={{
        prefs,
        publicPermissions,
        userPermissions,
        lang: prefs.lang,
        dark: prefs.dark,
        themeMode,
        setDark,
        setThemeMode,
        toggleLang,
        updatePref,
        updatePublicPermission,
        isLayerAllowed,
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
    const fallbackPublicPerms = getStoredPublicPermissions();
    const fallbackMode = fallbackPrefs.themeMode || (fallbackPrefs.dark ? "dark" : "sepia");
    return {
      prefs: fallbackPrefs,
      publicPermissions: fallbackPublicPerms,
      userPermissions: null,
      lang: fallbackPrefs.lang,
      dark: fallbackPrefs.dark,
      themeMode: fallbackMode,
      setDark: () => {},
      setThemeMode: () => {},
      toggleLang: () => {},
      updatePref: () => {},
      updatePublicPermission: async () => {},
      isLayerAllowed: (layerKey: keyof PublicDisplayPermissions, isAdminUser?: boolean) => {
        if (isAdminUser) return true;
        return fallbackPublicPerms[layerKey] ?? true;
      },
      t: (key: string) => key,
    };
  }
  return context;
}