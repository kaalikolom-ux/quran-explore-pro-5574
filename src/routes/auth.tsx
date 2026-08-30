import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, ShieldCheck, RefreshCw } from "lucide-react";

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

interface MathChallenge {
  num1: number;
  num2: number;
  operator: "+" | "-" | "×" | "÷";
  answer: number;
}

function generateMathChallenge(): MathChallenge {
  const operations: Array<"+" | "-" | "×" | "÷"> = ["+", "-", "×", "÷"];
  const op = operations[Math.floor(Math.random() * operations.length)];

  let num1 = 0;
  let num2 = 0;
  let answer = 0;

  if (op === "+") {
    // যোগফল যেন সর্বোচ্চ ৯ হয় (Single Digit: <= 9)
    answer = Math.floor(Math.random() * 8) + 2; // 2..9
    num1 = Math.floor(Math.random() * (answer - 1)) + 1; // 1..(answer-1)
    num2 = answer - num1;
  } else if (op === "-") {
    // বিয়োগফল যেন একক সংখ্যা হয় (>= 0 এবং <= 9)
    num1 = Math.floor(Math.random() * 9) + 1; // 1..9
    num2 = Math.floor(Math.random() * num1); // 0..(num1-1)
    answer = num1 - num2;
  } else if (op === "×") {
    // গুণফল যেন সর্বোচ্চ ৯ হয় (Single Digit: <= 9)
    const pairs = [
      [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9],
      [2, 1], [2, 2], [2, 3], [2, 4],
      [3, 1], [3, 2], [3, 3],
      [4, 1], [4, 2],
      [5, 1], [6, 1], [7, 1], [8, 1], [9, 1],
    ];
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    num1 = pair[0];
    num2 = pair[1];
    answer = num1 * num2;
  } else {
    // ভাগফল যেন পূর্ণ একক সংখ্যা হয় (Single Digit: <= 9)
    const divPairs = [
      [2, 2], [4, 2], [6, 2], [8, 2],
      [3, 3], [6, 3], [9, 3],
      [4, 4], [8, 4],
      [5, 5], [6, 6], [7, 7], [8, 8], [9, 9],
    ];
    const pair = divPairs[Math.floor(Math.random() * divPairs.length)];
    num1 = pair[0];
    num2 = pair[1];
    answer = Math.floor(num1 / num2);
  }

  return { num1, num2, operator: op, answer };
}

function toBnDigits(num: number | string): string {
  const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/\d/g, (d) => bn[parseInt(d, 10)]);
}

function toEnDigits(str: string): string {
  const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  let res = str;
  bn.forEach((b, idx) => {
    res = res.replaceAll(b, String(idx));
  });
  return res;
}

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

function AppleIcon() {
  return (
    <svg className="size-4.5 fill-current" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.62 1.35-.57.65-1.06 1.72-.93 2.75 1.01.08 2.02-.5 2.63-1.25" />
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
  const [oauthBusy, setOauthBusy] = useState<"google" | "apple" | null>(null);
  const [sent, setSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // গণিত সিকিউরিটি ক্যাপচা স্টেট
  const [captcha, setCaptcha] = useState<MathChallenge>(() => generateMathChallenge());
  const [captchaInput, setCaptchaInput] = useState("");

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateMathChallenge());
    setCaptchaInput("");
  }, []);

  // মোড পরিবর্তন হলে নতুন গণিত ক্যাপচা জেনারেট
  useEffect(() => {
    refreshCaptcha();
  }, [mode, refreshCaptcha]);

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

  async function handleOAuthLogin(provider: "google" | "apple") {
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
    
    // ১. গণিত সিকিউরিটি ক্যাপচা যাচাইকরণ
    const parsedUserAnswer = parseInt(toEnDigits(captchaInput.trim()), 10);
    if (isNaN(parsedUserAnswer) || parsedUserAnswer !== captcha.answer) {
      toast.error(
        lang === "bn"
          ? "গণিত সিকিউরিটি প্রশ্নের সঠিক উত্তর দিন।"
          : "Please solve the math security question correctly."
      );
      refreshCaptcha();
      return;
    }

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
      refreshCaptcha();
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

            {/* গণিত সিকিউরিটি ক্যাপচা (Math Security Logic: একক সংখ্যা যোগ, বিয়োগ, গুণ, ভাগ) */}
            <div className="space-y-1.5 rounded-xl border border-border/70 bg-muted/20 p-3">
              <div className="flex items-center justify-between text-xs">
                <Label htmlFor="captcha" className="font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-primary" />
                  <span>{lang === "bn" ? "নিরাপত্তা প্রশ্ন (Human Verification)" : "Security Question (Verification)"}</span>
                </Label>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="text-muted-foreground hover:text-primary transition-colors p-1 cursor-pointer flex items-center gap-1 text-[11px]"
                  title={lang === "bn" ? "নতুন প্রশ্ন আনুন" : "Generate new question"}
                >
                  <RefreshCw className="size-3" />
                  <span>{lang === "bn" ? "নতুন প্রশ্ন" : "Reload"}</span>
                </button>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center justify-center rounded-lg bg-card border border-border px-3.5 py-1.5 font-mono text-sm font-bold text-foreground select-none shadow-xs tracking-wider">
                  {lang === "bn"
                    ? `${toBnDigits(captcha.num1)} ${captcha.operator} ${toBnDigits(captcha.num2)} = ?`
                    : `${captcha.num1} ${captcha.operator} ${captcha.num2} = ?`}
                </div>
                <Input
                  id="captcha"
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={2}
                  placeholder={lang === "bn" ? "উত্তর লিখুন (যেমন: ৫)" : "Answer (e.g. 5)"}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="h-9 text-xs rounded-lg flex-1 font-mono"
                />
              </div>
            </div>

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
