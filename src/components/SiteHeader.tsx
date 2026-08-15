import { Link, useRouterState } from "@tanstack/react-router";
import React from "react";
import { 
  Home,
  BookOpen, 
  FileText, 
  Bookmark, 
  Settings, 
  Mail, 
  Moon, 
  Sun, 
  Languages, 
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { usePrefs } from "@/lib/prefs";

export function SiteHeader() {
  const { prefs, updatePref, toggleLang, lang } = usePrefs();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { to: "/", label: lang === "bn" ? "হোম" : "Home", icon: Home },
    { to: "/articles", label: lang === "bn" ? "আর্টিকেল" : "Articles", icon: FileText },
    { to: "/bookmarks", label: lang === "bn" ? "বুকমার্ক" : "Bookmarks", icon: Bookmark },
    { to: "/settings", label: lang === "bn" ? "সেটিংস" : "Settings", icon: Settings },
    { to: "/privacy", label: lang === "bn" ? "প্রাইভেসি" : "Privacy", icon: ShieldCheck },
    { to: "/contact", label: lang === "bn" ? "যোগাযোগ" : "Contact", icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* লোগো ও ব্র্যান্ডিং */}
        <Link to="/" className="flex items-center gap-2.5 font-bold transition-opacity hover:opacity-90">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs font-serif font-bold text-base">
            ق
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-foreground">
              {lang === "bn" ? "কুরআন অন্বেষা" : "Quran Explorer"}
            </span>
            <span className="text-[10px] text-muted-foreground font-normal">
              {lang === "bn" ? "শব্দে শব্দে অর্থ ও অনুবাদ" : "Word by Word & Meaning"}
            </span>
          </div>
        </Link>

        {/* ডেস্কটপ মেনু আইটেমসমূহ (হোম ও যোগাযোগসহ প্রতিটিতে আইকন) */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.to || (item.to !== "/" && currentPath.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className={`size-3.5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* অ্যাকশন বাটনসমূহ (ভাষা পরিবর্তন, ডার্ক মোড ও মোবাইল টগল) */}
        <div className="flex items-center gap-1.5">
          {/* ভাষা টগল */}
          <button
            type="button"
            onClick={toggleLang}
            title={lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
            className="flex h-8 items-center gap-1 rounded-lg border border-border/60 bg-muted/30 px-2 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Languages className="size-3.5 text-muted-foreground" />
            <span className="uppercase font-mono text-[11px]">{lang}</span>
          </button>

          {/* থিম টগল */}
          <button
            type="button"
            onClick={() => updatePref("dark", !prefs.dark)}
            title={prefs.dark ? "লাইট মোড" : "ডার্ক মোড"}
            className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            {prefs.dark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-slate-700" />}
          </button>

          {/* মোবাইল মেনু বাটন */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-foreground md:hidden hover:bg-muted transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* মোবাইল ড্রপডাউন মেনু */}
      {mobileOpen && (
        <div className="border-b border-border/80 bg-card p-4 md:hidden space-y-1 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.to || (item.to !== "/" && currentPath.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4 text-primary" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}