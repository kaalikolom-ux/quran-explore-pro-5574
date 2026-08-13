import { Link } from "@tanstack/react-router";

import { usePrefs } from "@/lib/prefs";
import { useMenuItems } from "@/lib/menu";
import { SocialLinks } from "@/components/SocialLinks";

const footerLinkClass =
  "w-fit rounded-md border border-transparent px-3 py-1.5 text-chrome-foreground/70 transition-all duration-200 hover:bg-white/10 hover:text-chrome-foreground hover:translate-x-1";

export function SiteFooter() {
  const { t, lang } = usePrefs();
  const menu = useMenuItems("footer");

  return (
    <footer className="border-t border-white/10 bg-chrome text-chrome-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-base font-semibold">{t("siteName")}</p>
          <p className="mt-2 text-sm text-chrome-foreground/70">{t("tagline")}</p>
          <SocialLinks className="mt-4" />
        </div>
        <nav className="flex flex-col gap-1 text-sm">
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

        <div className="text-sm text-chrome-foreground/70">
          <p>
            {lang === "en"
              ? "Word-by-word meaning, classical and authentic translation — on one page"
              : "শব্দে শব্দে অর্থ, প্রচলিত ও প্রকৃত অনুবাদ — একই পাতায়"}
          </p>
          <p className="mt-2">© {new Date().getFullYear()} {t("siteName")}</p>
        </div>
      </div>
    </footer>
  );
}
