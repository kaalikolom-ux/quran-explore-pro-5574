import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bookmark, Sparkles, X, ShieldCheck, BookMarked, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AuthPromptModal() {
  const { lang } = usePrefs();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // ১. চেক করা ইউজার ইতিমধ্যে লগইন কিনা
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // ২. চেক করা ইউজার এই সেশনে বা সম্প্রতি পপ-আপটি বন্ধ করেছে কিনা
        const dismissed = localStorage.getItem("auth_prompt_dismissed");
        if (!dismissed) {
          // ভিজিটের ৩ সেকেন্ড পর পপ-আপ ওপেন হবে (যাতে ইউজার এক্সপেরিয়েন্স ভালো থাকে)
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 3000);

          return () => clearTimeout(timer);
        }
      }
    });
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    // ২৪ ঘণ্টার জন্য পপ-আপ মিউট রাখা
    localStorage.setItem("auth_prompt_dismissed", String(Date.now()));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="sm:max-w-md bg-card border border-border/80 shadow-2xl p-6 overflow-hidden">
        
        {/* টপ ব্যাজ ও টাইটেল */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-foreground text-background shadow-md">
            <Sparkles className="size-6" />
          </div>

          <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
            {lang === "bn" ? "একটি ফ্রি অ্যাকাউন্ট তৈরি করুন" : "Create a Free Account"}
          </DialogTitle>

          <p className="text-xs text-muted-foreground leading-relaxed px-2">
            {lang === "bn"
              ? "কুরআন অন্বেষার সম্পূর্ণ সম্ভাবনা উপভোগ করুন। আপনার ব্যক্তিগত অধ্যায়ন যাত্রা শুরু করুন আজই।"
              : "Unlock the full potential of Quran Explorer. Start your personalized Quran study journey today."}
          </p>
        </div>

        {/* ফিচার তালিকা */}
        <div className="mt-4 space-y-2.5 rounded-xl border border-border/60 bg-muted/20 p-3.5 text-xs text-foreground/90">
          <div className="flex items-center gap-2.5">
            <div className="rounded-md bg-foreground/10 p-1 text-foreground">
              <Bookmark className="size-3.5" />
            </div>
            <span>{lang === "bn" ? "পছন্দের আয়াত ক্লাউডে বুকমার্ক ও সিঙ্ক" : "Save and cloud-sync your bookmarks"}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="rounded-md bg-foreground/10 p-1 text-foreground">
              <BookMarked className="size-3.5" />
            </div>
            <span>{lang === "bn" ? "ব্যক্তিগত নোট (তাদাব্বুর) সংরক্ষণ ও পরিচালনা" : "Keep personal reflection notes & Tadabbur"}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="rounded-md bg-foreground/10 p-1 text-foreground">
              <ShieldCheck className="size-3.5" />
            </div>
            <span>{lang === "bn" ? "অগ্রিম ফিচার ও বিজ্ঞানভিত্তিক অনুবাদের আপডেট" : "Access all upcoming features & modern tafseer"}</span>
          </div>
        </div>

        {/* কল টু অ্যাকশন বাটনসমূহ */}
        <div className="mt-6 flex flex-col gap-2">
          <Button
            asChild
            className="w-full h-10 rounded-xl bg-foreground text-background font-semibold text-xs shadow-md hover:bg-foreground/90"
            onClick={handleDismiss}
          >
            <Link to="/auth">
              <UserPlus className="size-4 mr-2" />
              {lang === "bn" ? "এখনই ফ্রিতে সাইন-আপ / লগইন করুন" : "Sign Up / Login for Free"}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-xs text-muted-foreground hover:text-foreground h-8"
          >
            {lang === "bn" ? "পরে করব / ভিজিটর হিসেবে চালিয়ে যান" : "Maybe Later / Continue as Guest"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}