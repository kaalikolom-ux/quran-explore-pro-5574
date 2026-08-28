import { Link } from "@tanstack/react-router";
import { Sparkles, Star } from "lucide-react";
import { usePrefs } from "@/lib/prefs";

interface SparkleCtaNoticeProps {
  className?: string;
  variant?: "hero" | "card" | "subtle";
}

export function SparkleCtaNotice({ className = "", variant = "hero" }: SparkleCtaNoticeProps) {
  const { lang } = usePrefs();

  const text =
    lang === "bn"
      ? "লগইন করুন, সাইটের সব কনটেন্ট উপভোগ করুন।"
      : "Log in - otherwise you will miss out on a lot of the site's content.";

  const isHero = variant === "hero";

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* ১.৫ সেকেন্ড পরপর চারদিকে ছড়িয়ে পড়া তারাবাত্তির কণা (Star Particles) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 -top-1 text-amber-400 dark:text-amber-300 animate-star-fly-1 select-none"
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-1 text-cyan-300 dark:text-cyan-400 animate-star-fly-2 select-none"
      >
        ✨
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 -bottom-1 text-yellow-300 dark:text-yellow-400 animate-star-fly-3 select-none"
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -bottom-1 text-amber-300 dark:text-amber-400 animate-star-fly-4 select-none"
      >
        ★
      </span>

      {/* মূল অ্যানিমেটেড নোটিশ বক্স */}
      <Link
        to="/auth"
        className={`group relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 animate-sparkle-burst cursor-pointer select-none ${
          isHero
            ? "border border-amber-400/50 bg-black/40 text-amber-300 hover:bg-black/60 hover:border-amber-300 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            : "border border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 hover:border-amber-500 shadow-sm"
        }`}
      >
        <Sparkles className="size-3.5 sm:size-4 shrink-0 text-amber-400 animate-pulse" />
        <span className="leading-none drop-shadow-xs">{text}</span>
        <Sparkles className="size-3.5 sm:size-4 shrink-0 text-amber-400 animate-pulse" />
      </Link>
    </div>
  );
}
