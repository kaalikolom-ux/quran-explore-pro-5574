import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "সাইন ইন / সাবস্ক্রাইব — কুরআন অন্বেষা" },
      {
        name: "description",
        content: "গুগল বা ইমেইল দিয়ে অ্যাকাউন্ট খুলে কুরআনের সকল কনটেন্ট উপভোগ ও বুকমার্ক করুন।",
      },
      { property: "og:title", content: "সাইন ইন / সাবস্ক্রাইব — কুরআন অন্বেষা" },
      { property: "og:description", content: "বুকমার্ক ও পূর্ণ কনটেন্ট পড়তে অ্যাকাউন্ট খুলুন।" },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
});

function GoogleIcon() {
  return (
    <svg className="size-4.5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="size-4.5 fill-current" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function AuthPage() {
  const { t, lang } = usePrefs();
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [oauthBusy, setOauthBusy] = useState<"google" | "github" | null>(null);
  const [sent, setSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const redirectUrl = search.redirect || "/bookmarks";

  async function checkAdminAndRedirect(userId: string) {
    try {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (data) {
        navigate({ to: "/admin" });
        return;
      }
    } catch {
      // fallback
    }

    if (search.redirect) {
      window.location.href = search.redirect;
      return;
    }
    navigate({ to: "/bookmarks" });
  }

  async function handleOAuthLogin(provider: "google" | "github") {
    try {
      setOauthBusy(provider);
      const targetRedirect = search.redirect
        ? `${window.location.origin}${search.redirect.startsWith('/') ? search.redirect : `/${search.redirect}`}`
        : `${window.location.origin}/bookmarks`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: targetRedirect,
          queryParams: provider === "google" ? {
            access_type: "offline",
            prompt: "consent",
          } : undefined,
        },
      });

      if (error) throw error;
    } catch (error) {
      toast.error((error as Error).message);
      setOauthBusy(null);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "forgot") {
        const parsedEmail = z.string().trim().email().max(255).safeParse(email);
        if (!parsedEmail.success) throw new Error(parsedEmail.error.issues[0]?.message ?? t("error"));
        const { error } = await supabase.auth.resetPasswordForEmail(parsedEmail.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setResetSent(true);
        return;
      }

      const parsed = schema.safeParse({ email, password });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? t("error"));

      if (mode === "in") {
        const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        if (data.user) {
          await checkAdminAndRedirect(data.user.id);
        } else {
          navigate({ to: redirectUrl as any });
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          ...parsed.data,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (data.session && data.user) {
          await checkAdminAndRedirect(data.user.id);
        } else {
          setSent(true);
        }
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const heading =
    mode === "in" ? t("signIn") : mode === "up" ? t("createAccount") : t("resetPassword");

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:py-16">
      <div className="card-soft p-6 sm:p-8 shadow-lg border border-border/80 rounded-2xl bg-card">
        <h1 className="text-2xl font-bold text-foreground font-serif">{heading}</h1>
        <p className="mt-1.5 text-xs text-muted-foreground">{t("signInPrompt")}</p>

        {/* ও-অথ (OAuth) অটো লগইন / সাইন-আপ বাটনসমূহ */}
        {mode !== "forgot" && (
          <div className="mt-6 space-y-3">
            {/* গুগল ওয়ান-ক্লিক বাটন */}
            <button
              type="button"
              disabled={busy || !!oauthBusy}
              onClick={() => handleOAuthLogin("google")}
              className="w-full h-11 rounded-xl border border-border bg-background hover:bg-muted/50 text-foreground font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-xs cursor-pointer disabled:opacity-50"
            >
              {oauthBusy === "google" ? (
                <Loader2 className="size-4 animate-spin text-primary" />
              ) : (
                <GoogleIcon />
              )}
              <span>
                {lang === "bn" ? "Google অ্যাকাউন্ট দিয়ে প্রবেশ করুন" : "Continue with Google"}
              </span>
            </button>

            {/* গিটহাব ওয়ান-ক্লিক বাটন */}
            <button
              type="button"
              disabled={busy || !!oauthBusy}
              onClick={() => handleOAuthLogin("github")}
              className="w-full h-11 rounded-xl border border-border bg-background hover:bg-muted/50 text-foreground font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-xs cursor-pointer disabled:opacity-50"
            >
              {oauthBusy === "github" ? (
                <Loader2 className="size-4 animate-spin text-primary" />
              ) : (
                <GithubIcon />
              )}
              <span>
                {lang === "bn" ? "GitHub অ্যাকাউন্ট দিয়ে প্রবেশ করুন" : "Continue with GitHub"}
              </span>
            </button>

            {/* বিভাজক দাগ */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="w-full border-t border-border" />
              <span className="absolute bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                {lang === "bn" ? "অথবা ইমেইল দিয়ে" : "Or with email"}
              </span>
            </div>
          </div>
        )}

        {sent ? (
          <p className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs leading-relaxed text-foreground">
            {t("email")}: <strong className="text-primary">{email}</strong> — আপনার ইমেইলে একটি কনফার্মেশন লিংক পাঠানো হয়েছে। অনুগ্রহ করে লিংকটি ক্লিক করে সক্রিয় করুন।
          </p>
        ) : resetSent ? (
          <p className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs leading-relaxed text-foreground">
            {t("resetSent")}
          </p>
        ) : (
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                required
                maxLength={255}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 text-xs rounded-xl"
              />
            </div>
            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  maxLength={72}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs cursor-pointer shadow-sm transition-all"
              disabled={busy || !!oauthBusy}
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : null}
              {mode === "in" ? t("signIn") : mode === "up" ? t("createAccount") : t("sendResetLink")}
            </Button>
          </form>
        )}

        {mode === "in" && !resetSent && (
          <button
            type="button"
            className="mt-4 w-full text-xs text-muted-foreground hover:text-primary hover:underline cursor-pointer text-center"
            onClick={() => {
              setSent(false);
              setResetSent(false);
              setMode("forgot");
            }}
          >
            {t("forgotPassword")}
          </button>
        )}

        <button
          type="button"
          className="mt-3 w-full text-xs font-semibold text-primary hover:underline cursor-pointer text-center"
          onClick={() => {
            setSent(false);
            setResetSent(false);
            setMode((m) => (m === "in" ? "up" : "in"));
          }}
        >
          {mode === "in" ? t("noAccount") : mode === "up" ? t("haveAccount") : t("backToSignIn")}
        </button>

        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            ← {t("home")}
          </Link>
        </div>
      </div>
    </div>
  );
}
