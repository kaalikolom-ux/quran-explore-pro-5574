import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { 
  Home,
  FileText,
  BookA, 
  PenTool,
  Bookmark, 
  Settings, 
  Mail, 
  Languages, 
  ShieldCheck,
  Info,
  Menu,
  X,
  Search,
  Moon,
  Sun,
  BookOpen,
  Sparkles
} from "lucide-react";
import { usePrefs, type ThemeMode } from "@/lib/prefs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QuranExplorerLogo } from "@/components/QuranExplorerLogo";
import { GlobalSearchDialog } from "@/components/GlobalSearchDialog";

function QuranLogoBadge({ className = "size-5" }: { className?: string }) {
  return (
    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-[#115360]/15 dark:bg-[#1a9e8f]/20 text-[#115360] dark:text-[#1a9e8f] border border-[#115360]/30 dark:border-[#1a9e8f]/40 shadow-xs transition-transform duration-200 group-hover:scale-105">
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

function AdminGearIcon({ className = "size-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <circle cx="19" cy="11" r="2" />
      <path d="M19 8v1m0 4v1m-2.6-4.5.7.7m3.8 3.8.7.7m-5.2 0 .7-.7m3.8-3.8.7-.7" />
    </svg>
  );
}

function LogoutDoorIcon({ className = "size-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function LoginDoorIcon({ className = "size-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  );
}

export function SiteHeader() {
  const { prefs, updatePref, toggleLang, lang, themeMode, setThemeMode } = usePrefs();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const routerState = useRouterState();
  const navigate = useNavigate();
  const currentPath = routerState.location.pathname;

  const currentTheme: ThemeMode = themeMode || (prefs.dark ? "dark" : "sepia");

  const cycleTheme = () => {
    let next: ThemeMode = "dark";
    if (currentTheme === "dark") next = "sepia";
    else if (currentTheme === "sepia") next = "slate";
    else if (currentTheme === "slate") next = "light";
    else if (currentTheme === "light") next = "dark";

    setThemeMode(next);

    const themeNames: Record<ThemeMode, { bn: string; en: string }> = {
      dark: { bn: "মিডনাইট ডার্ক", en: "Midnight Dark" },
      sepia: { bn: "মুসহাফ সেপিয়া", en: "Mushaf Sepia" },
      slate: { bn: "নরম স্লেট", en: "Soft Slate" },
      light: { bn: "স্বাভাবিক লাইট", en: "Natural Light" },
    };

    toast.success(
      lang === "bn"
        ? `থিম: ${themeNames[next].bn}`
        : `Theme: ${themeNames[next].en}`,
      { duration: 1500 }
    );
  };

  const getThemeDetails = () => {
    switch (currentTheme) {
      case "dark":
        return {
          icon: <Moon className="size-3.5 sm:size-4 text-[#58b4e8]" />,
          name: lang === "bn" ? "মিডনাইট ডার্ক" : "Midnight Dark",
          title: lang === "bn" ? "থিম: মিডনাইট ডার্ক (ক্লিক করলে মুসহাফ সেপিয়া হবে)" : "Theme: Midnight Dark (Click for Mushaf Sepia)",
        };
      case "sepia":
        return {
          icon: <BookOpen className="size-3.5 sm:size-4 text-[#1f6f43]" />,
          name: lang === "bn" ? "মুসহাফ সেপিয়া" : "Mushaf Sepia",
          title: lang === "bn" ? "থিম: মুসহাফ সেপিয়া (ক্লিক করলে নরম স্লেট হবে)" : "Theme: Mushaf Sepia (Click for Soft Slate)",
        };
      case "slate":
        return {
          icon: <Sparkles className="size-3.5 sm:size-4 text-[#2563eb]" />,
          name: lang === "bn" ? "নরম স্লেট" : "Soft Slate",
          title: lang === "bn" ? "থিম: নরম স্লেট (ক্লিক করলে স্বাভাবিক লাইট হবে)" : "Theme: Soft Slate (Click for Natural Light)",
        };
      case "light":
      default:
        return {
          icon: <Sun className="size-3.5 sm:size-4 text-[#f59e0b]" />,
          name: lang === "bn" ? "স্বাভাবিক লাইট" : "Natural Light",
          title: lang === "bn" ? "থিম: স্বাভাবিক লাইট (ক্লিক করলে মিডনাইট ডার্ক হবে)" : "Theme: Natural Light (Click for Midnight Dark)",
        };
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success(lang === "bn" ? "লগআউট সফল হয়েছে" : "Logged out successfully");
    navigate({ to: "/" });
  };

  const navItems = [
    { to: "/", label: lang === "bn" ? "হোম" : "Home", icon: Home },
    { to: "/lexicon", label: lang === "bn" ? "অভিধান" : "Lexicon", icon: BookA },
    { to: "/articles", label: lang === "bn" ? "আর্টিকেল" : "Articles", icon: FileText },
    { to: "/authors", label: lang === "bn" ? "লেখকবৃন্দ" : "Authors", icon: PenTool },
    { to: "/bookmarks", label: lang === "bn" ? "বুকমার্ক" : "Bookmarks", icon: Bookmark },
    { to: "/settings", label: lang === "bn" ? "সেটিংস" : "Settings", icon: Settings },
    { to: "/about", label: lang === "bn" ? "পরিচিতি" : "About", icon: Info },
    { to: "/contact", label: lang === "bn" ? "যোগাযোগ" : "Contact", icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-3 sm:px-6">
        
        {/* লোগো ও ব্র্যান্ডিং (Zero-Latency Standalone Kaushan Script Logo) */}
        <Link to="/" className="group flex items-center gap-2 sm:gap-2.5 shrink-0 select-none">
          <QuranLogoBadge className="size-4.5 sm:size-5" />
          <div className="flex flex-col justify-center leading-none min-w-0">
            <QuranExplorerLogo size="md" className="h-6 sm:h-7" />
            <span className="hidden sm:block text-[11px] text-muted-foreground font-medium tracking-wide mt-0.5 whitespace-nowrap">
              {lang === "bn" ? "শব্দে শব্দে কুরআন অন্বেষা" : "Word by Word Exploration"}
            </span>
          </div>
        </Link>

        {/* প্রধান ন্যাভিগেশন মেনু (ডেস্কটপ) */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.to || (item.to !== "/" && currentPath.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* অ্যাকশন আইকনসমূহ */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          
          {/* গ্লোবাল স্মার্ট সার্চ বাটন */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            title={lang === "bn" ? "কুরআন, বিষয় ও আর্টিকেল খুঁজুন (Ctrl + K)" : "Search Quran, Topics & Articles (Ctrl + K)"}
            aria-label="Search"
            className="flex items-center gap-1.5 h-7.5 sm:h-8 px-2 sm:px-2.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer text-xs group"
          >
            <Search className="size-3.5 text-primary group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-medium text-[11px]">
              {lang === "bn" ? "অনুসন্ধান..." : "Search..."}
            </span>
            <kbd className="hidden md:inline-flex items-center rounded border border-border/80 bg-muted/80 px-1 text-[9px] font-mono font-semibold text-muted-foreground">
              ⌘K
            </kbd>
          </button>
          
          <button
            type="button"
            onClick={toggleLang}
            title={lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
            className="flex h-7.5 sm:h-8 items-center gap-1 rounded-lg border border-border bg-card px-1.5 sm:px-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <Languages className="size-3 sm:size-3.5 text-muted-foreground" />
            <span className="uppercase font-mono text-[10px] sm:text-[11px]">{lang}</span>
          </button>

          {/* থিম পরিবর্তন বাটন (১ ক্লিকে চক্রাকারে ৪টি থিম পরিবর্তন) */}
          <button
            type="button"
            onClick={cycleTheme}
            title={getThemeDetails().title}
            aria-label="Toggle Theme"
            className="flex size-7.5 sm:size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-all cursor-pointer group"
          >
            <span className="transition-transform duration-200 group-hover:scale-115">
              {getThemeDetails().icon}
            </span>
          </button>

          {/* সেটিংস পেজ বাটন */}
          <Link
            to="/settings"
            title={lang === "bn" ? "সেটিংস ও পছন্দসমূহ" : "Settings & Preferences"}
            aria-label="Settings"
            className={`flex size-7.5 sm:size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-colors cursor-pointer ${
              currentPath === "/settings" ? "border-primary text-primary font-bold bg-secondary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="size-3.5 sm:size-4 hover:rotate-45 transition-transform" />
          </Link>

          {user && (
            <Link
              to="/admin"
              title={lang === "bn" ? "এডমিন প্যানেল" : "Admin Panel"}
              aria-label="Admin Panel"
              className={`flex size-7.5 sm:size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-all cursor-pointer ${
                currentPath.startsWith("/admin") ? "border-[#2A6F97] dark:border-[#58b4e8] text-[#1c5576] dark:text-[#58b4e8] font-bold" : ""
              }`}
            >
              <AdminGearIcon className="size-3.5 sm:size-4" />
            </Link>
          )}

          {/* লগইন / লগআউট বাটন (ডান পাশের শেষে) */}
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              title={lang === "bn" ? "লগআউট করুন" : "Log out"}
              aria-label="Logout"
              className="flex size-7.5 sm:size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
            >
              <LogoutDoorIcon className="size-3.5 sm:size-4" />
            </button>
          ) : (
            <Link
              to="/auth"
              title={lang === "bn" ? "লগইন করুন" : "Sign In"}
              aria-label="Login"
              className="flex size-7.5 sm:size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              <LoginDoorIcon className="size-3.5 sm:size-4" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-7.5 sm:size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground md:hidden hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-3.5 sm:size-4" /> : <Menu className="size-3.5 sm:size-4" />}
          </button>
        </div>
      </div>

      {/* গ্লোবাল সার্চ ডায়ালগ */}
      <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      {/* মোবাইল ড্রপডাউন মেনু */}
      {mobileOpen && (
        <div className="border-b border-border bg-card p-4 md:hidden space-y-1 animate-in slide-in-from-top duration-200 shadow-md">
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
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4 text-[#1c5576] dark:text-[#58b4e8]" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-border space-y-1">
            {/* মোবাইল থিম পরিবর্তন বাটন */}
            <button
              type="button"
              onClick={cycleTheme}
              className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="size-4 flex items-center justify-center">
                  {getThemeDetails().icon}
                </span>
                <span>{lang === "bn" ? "থিম পরিবর্তন" : "Switch Theme"}</span>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                {getThemeDetails().name}
              </span>
            </button>

            {user && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground bg-muted/40 transition-all"
              >
                <AdminGearIcon className="size-4 text-[#1c5576] dark:text-[#58b4e8]" />
                <span>{lang === "bn" ? "এডমিন প্যানেল" : "Admin Panel"}</span>
              </Link>
            )}

            {user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
              >
                <LogoutDoorIcon className="size-4" />
                <span>{lang === "bn" ? "লগআউট" : "Logout"}</span>
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground bg-secondary transition-all"
              >
                <LoginDoorIcon className="size-4 text-[#1c5576] dark:text-[#58b4e8]" />
                <span>{lang === "bn" ? "লগইন করুন" : "Login"}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}