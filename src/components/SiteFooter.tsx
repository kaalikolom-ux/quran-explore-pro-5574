import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { usePrefs } from "@/lib/prefs";
import { useMenuItems } from "@/lib/menu";
import { supabase } from "@/integrations/supabase/client";
import { SocialLinks } from "@/components/SocialLinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuranExplorerLogo } from "@/components/QuranExplorerLogo";

const footerLinkClass =
  "w-fit rounded-md border border-transparent px-3 py-1.5 text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground hover:translate-x-1 font-medium";

const emailSchema = z.string().trim().email("সঠিক ইমেইল এড্রেস লিখুন");

function QuranLogoBadge({ className = "size-4.5" }: { className?: string }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2A6F97]/15 dark:bg-[#58b4e8]/20 text-[#1c5576] dark:text-[#58b4e8] border border-[#2A6F97]/30 dark:border-[#58b4e8]/40 shadow-xs transition-transform duration-200 group-hover:scale-105">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    </div>
  );
}

export function SiteFooter() {
  const { t, lang } = usePrefs();
  const menu = useMenuItems("footer");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(lang === "en" ? "Please enter a valid email address" : "সঠিক ইমেইল এড্রেস দিন");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: parsed.data });

      if (error) {
        if (error.code === "23505") {
          toast.info(
            lang === "en"
              ? "You are already subscribed!"
              : "আপনি ইতিমধ্যে সাবস্ক্রাইব করেছেন!"
          );
          setSubscribed(true);
          return;
        }
        throw error;
      }

      try {
        await fetch("/api/public/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: parsed.data,
            target_notification: "newslater+notabene.inc@gmail.com",
          }),
        });
      } catch (apiErr) {
        // Handled silently
      }

      setSubscribed(true);
      setEmail("");
      toast.success(
        lang === "en"
          ? "Thank you for subscribing to our newsletter!"
          : "নিউজলেটারে সাবস্ক্রাইব করার জন্য ধন্যবাদ!"
      );
    } catch (err: any) {
      toast.error(err.message || "সাবস্ক্রিপশন ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        
        {/* ১. পরিচিতি ও সোশ্যাল */}
        <div>
          <Link to="/" className="group inline-flex items-center gap-2.5 transition-opacity hover:opacity-80 select-none shrink-0">
            <QuranLogoBadge />
            <div className="flex flex-col leading-none min-w-0">
              <QuranExplorerLogo size="md" className="h-6 sm:h-7" />
              <span className="mt-1 text-[11px] text-muted-foreground font-medium tracking-wide whitespace-nowrap">
                {lang === "bn" ? "শব্দে শব্দে কুরআন অন্বেষা" : "Word by Word Exploration"}
              </span>
            </div>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground font-normal">{t("tagline")}</p>
          <SocialLinks className="mt-5" />
        </div>

        {/* ২. গুরুত্বপূর্ণ লিংকসমূহ */}
        <nav className="flex flex-col gap-1 text-sm">
          <p className="px-3 pb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {lang === "en" ? "Navigation" : "মেনু লিংক"}
          </p>
          <Link to="/" className={footerLinkClass}>
            {t("home")}
          </Link>
          <Link to="/surah/$id" params={{ id: "1" }} className={footerLinkClass}>
            {t("readQuran")}
          </Link>
          <Link to="/articles" className={footerLinkClass}>
            {t("articles")}
          </Link>
          {menu.data?.map((m) => (
            <a key={m.id} href={m.href} className={footerLinkClass}>
              {lang === "en" && m.label_en ? m.label_en : m.label_bn}
            </a>
          ))}
          <Link to="/contact" className={footerLinkClass}>
            {t("contact")}
          </Link>
        </nav>

        {/* ৩. নিউজলেটার সাবস্ক্রিপশন ও কপিরাইট ক্রেডিট */}
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground">
              {lang === "en" ? "Subscribe to Newsletter" : "নিউজলেটার সাবস্ক্রাইব করুন"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {lang === "en"
                ? "Get updates on new articles and scientific Quran translations."
                : "নতুন আর্টিকেল এবং বিজ্ঞানভিত্তিক অনুবাদের আপডেট সরাসরি ইমেইলে পান।"}
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-xs text-foreground border border-border">
              <CheckCircle2 className="size-4 text-[#1c5576] dark:text-[#58b4e8]" />
              <span>{lang === "en" ? "Subscribed successfully!" : "সফলভাবে সাবস্ক্রাইব করা হয়েছে!"}</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder={lang === "en" ? "Your email address..." : "আপনার ইমেইল অ্যাড্রেস..."}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground text-xs"
              />
              <Button
                type="submit"
                disabled={loading}
                aria-label={lang === "en" ? "Subscribe to newsletter" : "নিউজলেটার সাবস্ক্রাইব করুন"}
                title={lang === "en" ? "Subscribe to newsletter" : "নিউজলেটার সাবস্ক্রাইব করুন"}
                className="h-10 rounded-xl px-4 text-xs shrink-0 bg-[#2A6F97] hover:bg-[#2A6F97]/90 text-white font-semibold shadow-xs"
              >
                {loading ? "..." : <Send className="size-3.5" aria-hidden="true" />}
                <span className="sr-only">{lang === "en" ? "Subscribe" : "সাবস্ক্রাইব করুন"}</span>
              </Button>
            </form>
          )}

          {/* কপিরাইট ও Upwork প্রোফাইল লিংক */}
          <div className="pt-2 text-xs text-muted-foreground border-t border-border">
            <p className="flex items-center gap-1.5 flex-wrap">
              <span>© {new Date().getFullYear()}</span>
              <a 
                href="https://www.upwork.com/freelancers/~01e6f18d96f1c7294f"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-all inline-flex items-center"
                title="Developer Upwork Profile"
              >
                <QuranExplorerLogo size="sm" className="h-5 sm:h-5.5" />
              </a>
              <span>— {lang === "en" ? "All rights reserved." : "সর্বস্বত্ব সংরক্ষিত।"}</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}