// src/components/GoogleTranslateWidget.tsx
import React, { useEffect, useState, useRef } from "react";
import { Globe, Check, ChevronDown, Sparkles } from "lucide-react";

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (
          options: {
            pageLanguage: string;
            includedLanguages?: string;
            layout?: any;
            autoDisplay?: boolean;
          },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const POPULAR_LANGUAGES: LanguageOption[] = [
  { code: "bn", name: "Bengali", nativeName: "বাংলা (মূল ভাষা)", flag: "🇧🇩" },
  { code: "en", name: "English", nativeName: "English (International)", flag: "🇬🇧" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
];

export function GoogleTranslateWidget() {
  const [currentLang, setCurrentLang] = useState("bn");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getGoogleLang = () => {
      const match = document.cookie.match(/googtrans=\/bn\/([a-zA-Z\-]+)/);
      if (match && match[1]) {
        return match[1];
      }
      return "bn";
    };

    setCurrentLang(getGoogleLang());

    const visitedBefore = localStorage.getItem("visited_lang_detected");
    if (!visitedBefore) {
      localStorage.setItem("visited_lang_detected", "true");
      const browserLang = navigator.language ? navigator.language.split("-")[0].toLowerCase() : "bn";
      if (browserLang && browserLang !== "bn" && browserLang !== "en") {
        changeLanguage(browserLang);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);

    if (langCode === "bn") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + window.location.hostname + "; path=/;";
      window.location.reload();
      return;
    }

    const cookieValue = "/bn/" + langCode;
    document.cookie = "googtrans=" + cookieValue + "; path=/;";
    document.cookie = "googtrans=" + cookieValue + "; domain=" + window.location.hostname + "; path=/;";

    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  const currentOption = POPULAR_LANGUAGES.find((l) => l.code === currentLang) || {
    code: currentLang,
    name: currentLang.toUpperCase(),
    nativeName: currentLang.toUpperCase(),
    flag: "🌍",
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div id="google_translate_element" className="hidden" />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="ভাষা পরিবর্তন করুন / Change Language (Google Translate)"
        className="flex h-7.5 sm:h-8 items-center gap-1.5 rounded-lg border border-border bg-card/90 px-2 sm:px-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition-all cursor-pointer shadow-xs active:scale-95"
      >
        <Globe className="size-3.5 text-primary shrink-0" />
        <span className="hidden sm:inline text-[11px] font-medium">{currentOption.flag} {currentOption.code.toUpperCase()}</span>
        <span className="sm:hidden text-[11px] font-medium">{currentOption.flag}</span>
        <ChevronDown className={"size-3 text-muted-foreground transition-transform duration-200 " + (isOpen ? "rotate-180" : "")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-border/80 bg-card/95 backdrop-blur-xl p-1.5 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="px-2.5 py-1.5 border-b border-border/60 flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="size-3 text-primary" /> ভাষা নির্বাচন করুন
            </span>
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
              100+ Languages
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto py-1 space-y-0.5 scrollbar-thin">
            {POPULAR_LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={"w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer " + (isSelected ? "bg-primary/15 text-primary font-bold" : "text-foreground hover:bg-muted/80")}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </span>
                  {isSelected && <Check className="size-3.5 text-primary" />}
                </button>
              );
            })}
          </div>

          <div className="mt-1 pt-1.5 border-t border-border/60 px-2 text-center">
            <p className="text-[10px] text-muted-foreground">
              Powered by <span className="font-semibold text-foreground">Google Translate</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
