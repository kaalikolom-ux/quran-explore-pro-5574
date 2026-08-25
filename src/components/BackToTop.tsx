import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { usePrefs } from "@/lib/prefs";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { lang } = usePrefs();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  const tooltipText = lang === "bn" ? "শীর্ষে যান" : "Back to top";

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={tooltipText}
      title={tooltipText}
      className="fixed bottom-6 right-6 z-50 flex size-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-foreground/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white/15 hover:border-white/30 hover:text-foreground active:scale-95 focus:outline-none cursor-pointer dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/80 dark:hover:text-white"
    >
      <ChevronUp className="size-5 stroke-[2.5] transition-transform duration-200 hover:-translate-y-0.5" />
    </button>
  );
}
