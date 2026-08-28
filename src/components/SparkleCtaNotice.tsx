import { useNavigate } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { usePrefs } from "@/lib/prefs";

interface SparkleCtaNoticeProps {
  className?: string;
  variant?: "hero" | "card" | "subtle";
}

export function SparkleCtaNotice({ className = "", variant = "hero" }: SparkleCtaNoticeProps) {
  const { lang } = usePrefs();
  const navigate = useNavigate();

  const text =
    lang === "bn"
      ? "লগইন করুন, সাইটের সব কনটেন্ট উপভোগ করুন।"
      : "Log in - otherwise you will miss out on a lot of the site's content.";

  const isHero = variant === "hero";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate({ to: "/auth" });
  };

  return (
    <div className={`relative w-full max-w-xl mx-auto flex items-center justify-center ${className}`}>
      {/* ১.৫ সেকেন্ড পরপর চারদিকে ছড়িয়ে পড়া তারাবাত্তির কণা (Emerald & Cyan Star Particles) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 sm:-left-3 -top-2 text-emerald-400 dark:text-emerald-300 animate-star-fly-1 select-none z-10 text-sm"
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 sm:-right-3 -top-2 text-cyan-300 dark:text-cyan-400 animate-star-fly-2 select-none z-10 text-sm"
      >
        ✨
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 sm:-left-3 -bottom-2 text-teal-300 dark:text-teal-400 animate-star-fly-3 select-none z-10 text-sm"
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 sm:-right-3 -bottom-2 text-emerald-300 dark:text-emerald-400 animate-star-fly-4 select-none z-10 text-sm"
      >
        ★
      </span>

      {/* বক্স টাইপ সেন্টার্ড CTA বাটন (ডেস্কটপ ও মোবাইলে শতভাগ নির্ভরযোগ্য ক্লিকেবল) */}
      <button
        type="button"
        onClick={handleClick}
        className={`group relative z-30 w-full flex items-center justify-center gap-2 sm:gap-2.5 rounded-xl border px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] animate-sparkle-burst cursor-pointer select-none text-center shadow-md ${
          isHero
            ? "border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 hover:border-emerald-400 text-white backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.25)]"
            : "border-primary/40 bg-primary/10 hover:bg-primary/15 hover:border-primary text-primary shadow-xs"
        }`}
      >
        <Sparkles className="size-3.5 sm:size-4 shrink-0 text-emerald-400 animate-pulse" />
        <span className="leading-snug drop-shadow-xs font-serif">{text}</span>
        <Sparkles className="size-3.5 sm:size-4 shrink-0 text-cyan-300 animate-pulse" />
      </button>
    </div>
  );
}
