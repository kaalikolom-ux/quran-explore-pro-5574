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
    <div className={`relative w-full max-w-xl mx-auto flex items-center justify-center overflow-hidden rounded-2xl ${className}`}>
      {/* ১.৫ সেকেন্ড পরপর চারদিকে ছড়িয়ে পড়া তারাবাত্তির কণা — থিম-অনুযায়ী রঙ */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 sm:-left-3 -top-2 animate-star-fly-1 select-none z-10 text-sm"
        style={{ color: "var(--sparkle-star1)" }}
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 sm:-right-3 -top-2 animate-star-fly-2 select-none z-10 text-sm"
        style={{ color: "var(--sparkle-star2)" }}
      >
        ✦
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-2 sm:-left-3 -bottom-2 animate-star-fly-3 select-none z-10 text-sm"
        style={{ color: "var(--sparkle-star3)" }}
      >
        ★
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 sm:-right-3 -bottom-2 animate-star-fly-4 select-none z-10 text-sm"
        style={{ color: "var(--sparkle-star4)" }}
      >
        ★
      </span>

      {/* বক্স টাইপ শতভাগ সেন্টার্ড CTA বাটন (Theme Sparkle Blast) */}
      <button
        type="button"
        onClick={handleClick}
        className={`group relative z-30 w-full flex items-center justify-center rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] animate-sparkle-burst cursor-pointer select-none text-center shadow-md ${
          isHero
            ? "backdrop-blur-md text-white"
            : "shadow-xs"
        }`}
        style={
          isHero
            ? {
                borderColor: "var(--sparkle-border)",
                backgroundColor: "var(--sparkle-bg)",
                boxShadow: `0 0 20px var(--sparkle-glow)`,
              }
            : {
                borderColor: "var(--sparkle-border)",
                backgroundColor: "var(--sparkle-bg)",
                color: "var(--sparkle-text)",
              }
        }
      >
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 w-full text-center mx-auto">
          <Sparkles className="size-3.5 sm:size-4 shrink-0 animate-pulse" style={{ color: "var(--sparkle-text)" }} />
          <span className="leading-normal drop-shadow-xs font-sans text-center font-medium">
            {text}
          </span>
          <Sparkles className="size-3.5 sm:size-4 shrink-0 animate-pulse" style={{ color: "var(--sparkle-accent)" }} />
        </div>
      </button>
    </div>
  );
}
