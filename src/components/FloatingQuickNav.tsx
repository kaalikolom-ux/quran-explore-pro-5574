// src/components/FloatingQuickNav.tsx
import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Settings, Sparkles } from "lucide-react";
import { GlobalSearchDialog } from "@/components/GlobalSearchDialog";
import { usePrefs } from "@/lib/prefs";

export function FloatingQuickNav() {
  const { lang } = usePrefs();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Floating Quick Action Dock */}
      <div 
        className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 p-1.5 rounded-2xl bg-card/90 dark:bg-card/85 backdrop-blur-xl border border-border/80 shadow-[0_8px_30px_rgb(0,0,0,0.18)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
        role="navigation"
        aria-label="Floating Quick Navigation"
      >
        {/* গ্লোবাল সার্চ ফ্লোটিং বাটন */}
        <button
          onClick={() => setSearchOpen(true)}
          aria-label={lang === "bn" ? "সার্চ করুন" : "Search"}
          title={lang === "bn" ? "গ্লোবাল এআই সার্চ (Ctrl+K)" : "Global AI Search (Ctrl+K)"}
          className="relative flex size-10 sm:size-11 items-center justify-center rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white dark:bg-primary/20 dark:hover:bg-primary transition-all duration-200 cursor-pointer shadow-xs active:scale-95 group/btn"
        >
          <Search className="size-5 transition-transform group-hover/btn:scale-110" />
          <span className="sr-only">সার্চ</span>
          
          {/* ছোট এআই নোটিফিকেশন ডট */}
          <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2.5 bg-amber-500"></span>
          </span>
        </button>

        <div className="h-px w-5 bg-border/80 my-0.5" />

        {/* সেটিংস ফ্লোটিং বাটন */}
        <Link
          to="/settings"
          aria-label={lang === "bn" ? "সেটিংস" : "Settings"}
          title={lang === "bn" ? "সেটিংস ও ফন্ট কাস্টমাইজ" : "Settings & Preferences"}
          className="flex size-10 sm:size-11 items-center justify-center rounded-xl bg-muted/60 hover:bg-muted text-foreground/80 hover:text-foreground dark:hover:bg-accent transition-all duration-200 cursor-pointer shadow-xs active:scale-95 group/btn"
        >
          <Settings className="size-5 transition-transform group-hover/btn:rotate-45" />
          <span className="sr-only">সেটিংস</span>
        </Link>
      </div>

      {/* গ্লোবাল সার্চ ডায়ালগ মডাল */}
      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
