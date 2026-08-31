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
      ? "লগইন করুন - সাইটের সব কন্টেন্ট উপভোগ করুন।"
      : "Log in - Enjoy all the content on the site.";

  const isHero = variant === "hero";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate({ to: "/auth" });
  };

  return (
    <div className={`relative w-full max-w-xl mx-auto flex items-center justify-center ${className}`}>
      {/* ১.৫ সেকেন্ড পরপর চারদিকে ছড়িয়ে পড়া লাল তারাবাত্তির কণা (Red & Crimson Star Particles) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 sm:-left-3 -top-2 text-red-400 dark:text-red-300 animate-star-fly-1 select-none z-10 text-sm"
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 sm:-right-3 -top-2 text-rose-400 dark:text-rose-300 animate-star-fly-2 select-none z-10 text-sm"
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 sm:-left-3 -bottom-2 text-red-500 dark:text-red-400 animate-star-fly-3 select-none z-10 text-sm"
      >
        ★
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 sm:-right-3 -bottom-2 text-rose-500 dark:text-rose-400 animate-star-fly-4 select-none z-10 text-sm"
      >
        ★
      </span>

      {/* বক্স টাইপ শতভাগ সেন্টার্ড CTA বাটন (Red Blast) */}
      <button
        type="button"
        onClick={handleClick}
        className={`group relative z-30 w-full flex items-center justify-center rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] animate-sparkle-burst cursor-pointer select-none text-center shadow-md ${
          isHero
            ? "border-red-500/50 bg-red-950/45 hover:bg-red-900/65 hover:border-red-400 text-white backdrop-blur-md shadow-[0_0_22px_rgba(239,68,68,0.35)]"
            : "border-red-500/40 bg-red-950/30 hover:bg-red-900/50 hover:border-red-400 text-red-100 shadow-xs"
        }`}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 w-full text-center mx-auto">
          <Sparkles className="size-3.5 sm:size-4 shrink-0 text-red-400 animate-pulse" />
          <span className="leading-normal drop-shadow-xs font-sans text-center font-medium">
            {text}
          </span>
          <Sparkles className="size-3.5 sm:size-4 shrink-0 text-rose-300 animate-pulse" />
        </div>
      </button>
    </div>
  );
}
