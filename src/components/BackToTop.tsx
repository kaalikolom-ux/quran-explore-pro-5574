import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { usePrefs } from "@/lib/prefs";

/**
 * Global Back-To-Top Component
 * - Fully accessible & Agentic-Browsing friendly (explicit ID, test ID, ARIA attributes)
 * - Safe for SSR & smooth scrolling
 * - Theme-aware with high-contrast visible indicator
 */
export function BackToTop() {
  const { lang } = usePrefs();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        // Show after scrolling 300px down
        setVisible(window.scrollY > 300);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check in case page loaded scrolled down
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

  if (!visible) return null;

  const tooltipText = lang === "bn" ? "উপরে যান" : "Back to top";

  return (
    <button
      id="back-to-top"
      data-testid="back-to-top-button"
      type="button"
      onClick={scrollToTop}
      aria-label={tooltipText}
      title={tooltipText}
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg border border-primary/20 hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cursor-pointer group"
    >
      <ChevronUp className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}
