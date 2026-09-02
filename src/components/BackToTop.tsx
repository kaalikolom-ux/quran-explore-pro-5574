import React, { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { usePrefs } from "@/lib/prefs";

/**
 * Global Dual Quick-Scroll Component (Top & Bottom)
 * - Elongated capsule pill design with subtle divider
 * - Smooth scrolling to top (0px) and bottom (document height)
 * - Safe for SSR, accessible & responsive with backdrop-blur styling
 */
export function BackToTop() {
  const { lang } = usePrefs();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        // Show after scrolling 250px down
        setVisible(window.scrollY > 250);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const scrollToBottom = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  if (!visible) return null;

  const topTooltip = lang === "bn" ? "উপরে যান (শীর্ষ)" : "Scroll to top";
  const bottomTooltip = lang === "bn" ? "নিচে যান (শেষ)" : "Scroll to bottom";

  return (
    <div
      id="quick-scroll-nav"
      data-testid="quick-scroll-nav"
      className="fixed bottom-6 right-6 z-40 flex flex-col items-center rounded-2xl border border-border/80 bg-card/80 text-foreground backdrop-blur-md shadow-lg transition-all duration-300 hover:border-primary/50 hover:shadow-2xl p-1"
    >
      <button
        id="scroll-to-top"
        data-testid="scroll-to-top-button"
        type="button"
        onClick={scrollToTop}
        aria-label={topTooltip}
        title={topTooltip}
        className="flex size-9 items-center justify-center rounded-xl text-foreground/80 hover:text-primary hover:bg-primary/15 active:scale-95 transition-all duration-200 cursor-pointer group"
      >
        <ChevronUp className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
      </button>

      {/* Subtle translucent divider */}
      <div className="w-5 h-[1px] bg-border/70 dark:bg-border/50 my-0.5" />

      <button
        id="scroll-to-bottom"
        data-testid="scroll-to-bottom-button"
        type="button"
        onClick={scrollToBottom}
        aria-label={bottomTooltip}
        title={bottomTooltip}
        className="flex size-9 items-center justify-center rounded-xl text-foreground/80 hover:text-primary hover:bg-primary/15 active:scale-95 transition-all duration-200 cursor-pointer group"
      >
        <ChevronDown className="size-5 transition-transform duration-200 group-hover:translate-y-0.5" />
      </button>
    </div>
  );
}
