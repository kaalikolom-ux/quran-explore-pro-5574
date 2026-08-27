import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { 
  Home,
  FileText, 
  PenTool,
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function QuranLogoBadge({ className = "size-5" }: { className?: string }) {
  return (
    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-[#2A6F97]/15 dark:bg-[#58b4e8]/20 text-[#2A6F97] dark:text-[#58b4e8] border border-[#2A6F97]/30 dark:border-[#58b4e8]/40 shadow-xs transition-transform duration-200 group-hover:scale-105">
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
  const { prefs, updatePref, toggleLang, lang } = usePrefs();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const routerState = useRouterState();
  const navigate = useNavigate();
  const currentPath = routerState.location.pathname;

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
    { to: "/articles", label: lang === "bn" ? "আর্টিকেল" : "Articles", icon: FileText },
    { to: "/authors", label: lang === "bn" ? "লেখকবৃন্দ" : "Authors", icon: PenTool },
    { to: "/bookmarks", label: lang === "bn" ? "বুকমার্ক" : "Bookmarks", icon: Bookmark },
    { to: "/settings", label: lang === "bn" ? "সেটিংস" : "Settings", icon: Settings },
    { to: "/privacy", label: lang === "bn" ? "প্রাইভেসি" : "Privacy", icon: ShieldCheck },
    { to: "/contact", label: lang === "bn" ? "যোগাযোগ" : "Contact", icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-3 sm:px-6">
        
        {/* লোগো ও ব্র্যান্ডিং (WCAG compliant high-contrast color) */}
        <Link to="/" className="group flex items-center gap-2 sm:gap-2.5 shrink-0 select-none">
          <QuranLogoBadge className="size-4.5 sm:size-5" />
          <div className="flex flex-col justify-center leading-none min-w-0">
            <span 
              className="text-base sm:text-xl font-bold tracking-tight text-[#1c5576] dark:text-[#58b4e8] whitespace-nowrap select-none"
              style={{ 
                fontFamily: "'Kaushan Script', cursive",
                background: "transparent"
              }}
            >
              Quran Explorer
            </span>
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
            onClick={toggleLang}
            title={lang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
            className="flex h-7.5 sm:h-8 items-center gap-1 rounded-lg border border-border bg-card px-1.5 sm:px-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            <Languages className="size-3 sm:size-3.5 text-muted-foreground" />
            <span className="uppercase font-mono text-[10px] sm:text-[11px]">{lang}</span>
          </button>

          <button
            type="button"
            onClick={() => updatePref("dark", !prefs.dark)}
            title={prefs.dark ? "লাইট মোড" : "ডার্ক মোড"}
            className="flex size-7.5 sm:size-8 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary transition-colors cursor-pointer"
          >
            {prefs.dark ? <Sun className="size-3.5 sm:size-4" /> : <Moon className="size-3.5 sm:size-4" />}
          </button>

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