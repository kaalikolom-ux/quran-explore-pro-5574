import { createFileRoute, Link } from "@tanstack/react-router";
import React from "react";
import { ShieldCheck, Lock, EyeOff, Database, Bell, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "গোপনীয়তা নীতি (Privacy Policy) — কুরআন অন্বেষা" },
      {
        name: "description",
        content:
          "কুরআন অন্বেষা প্ল্যাটফর্মের গোপনীয়তা নীতি এবং ব্যবহারকারীর তথ্যের সুরক্ষা সংক্রান্ত বিস্তারিত বিবরণ।",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  const lastUpdated = "১৬ আগস্ট, ২০২৬";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12 space-y-8">
      {/* ব্যাক বাটন ও হেডার */}
      <div className="space-y-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <Link to="/">
            <ArrowLeft className="size-3.5 mr-1.5" /> হোমে ফিরুন
          </Link>
        </Button>
        <div className="space-y-2 border-b border-border/60 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="size-4" />
            <span>তথ্য সুরক্ষা ও স্বচ্ছতা</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            গোপনীয়তা নীতি (Privacy Policy)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            সর্বশেষ পরিমার্জন: {lastUpdated}
          </p>
        </div>
      </div>

      {/* মূল কনটেন্ট */}
      <div className="space-y-8 text-sm sm:text-base leading-relaxed text-foreground/90 font-sans">
        {/* পরিচিতি */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
            ১. আমাদের অঙ্গীকার
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            <strong>কুরআন অন্বেষা (Quran Explorer)</strong> একটি সম্পূর্ণ অলাভজনক ও দ্বীনি
            গবেষণাধর্মী প্ল্যাটফর্ম। পবিত্র কুরআন অনুধাবন ও তাদাব্বুরের এই যাত্রায় ব্যবহারকারীর
            গোপনীয়তা এবং তথ্য সুরক্ষা আমাদের অন্যতম প্রধান অগ্রাধিকার। আমরা কোনো প্রকার বাণিজ্যিক
            ট্র্যাকিং, থার্ড-পার্টি বিজ্ঞাপন বা অপ্রয়োজনীয় ব্যক্তিগত ডাটা সংগ্রহ করি না।
          </p>
        </section>

        {/* আমরা কী তথ্য সংগ্রহ করি */}
        <section className="space-y-4 rounded-2xl border border-border/70 bg-card p-5 sm:p-6 shadow-xs">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
            <Database className="size-5 text-primary" />
            ২. তথ্যের সংগ্রহ ও ব্যবহার
          </h2>
          <ul className="space-y-3 text-sm text-muted-foreground pl-1">
            <li className="flex items-start gap-2.5">
              <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>
                <strong className="text-foreground">ব্যক্তিগত নোট ও বুকমার্ক:</strong> আপনার
                সংরক্ষিত বুকমার্ক, পঠিত আয়াতের ট্র্যাকিং এবং ব্যক্তিগত তাদাব্বুর নোটসমূহ
                সম্পূর্ণভাবে আপনার ব্রাউজারের নিজস্ব মেমোরিতে (
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                  LocalStorage
                </code>
                ) সংরক্ষিত থাকে। এই তথ্য আমাদের সার্ভারে পাঠানো হয় না।
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>
                <strong className="text-foreground">অ্যাকাউন্ট তথ্য (ঐচ্ছিক):</strong> আপনি যদি
                প্ল্যাটফর্মে সাইন-ইন করেন, তবে কেবল আপনার ইমেইল ঠিকানা অ্যাকাউন্ট পরিচালনার জন্য
                সুরক্ষিত ডাটাবেজে সংরক্ষিত থাকে।
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
              <span>
                <strong className="text-foreground">যোগাযোগ ফর্ম ও বার্তা:</strong> আমাদের সাথে
                যোগাযোগ পেজের মাধ্যমে পাঠানো যেকোনো বার্তা কেবল প্রশ্নের উত্তর বা মতামত মূল্যায়নের
                কাজেই ব্যবহৃত হয়।
              </span>
            </li>
          </ul>
        </section>

        {/* কুকিজ ও লোকাল ক্যাশিং */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
            <Lock className="size-5 text-primary" />
            ৩. কুকিজ ও অফলাইন ক্যাশিং (PWA)
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            কুরআন অন্বেষা ওয়েবসাইটটিকে বিদ্যুৎগতির এবং অফলাইনে পাঠযোগ্য করার জন্য আমরা প্রগ্রেসিভ
            ওয়েব অ্যাপ (PWA) এবং সার্ভিস ওয়ার্কার প্রযুক্তি ব্যবহার করি। এর মাধ্যমে ১১৪টি সূরার
            অনুবাদ ও অডিও ফাইল আপনার ডিভাইসের লোকাল ক্যাশে সাময়িকভাবে সংরক্ষিত হয়। কোনো প্রকার
            ট্র্যাকিং কুকি ব্যবহার করা হয় না।
          </p>
        </section>

        {/* থার্ড পার্টি সার্ভিস ও অডিও রিসোর্স */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
            <EyeOff className="size-5 text-primary" />
            ৪. বাহ্যিক রিসোর্স ও থার্ড-পার্টি
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            পবিত্র কুরআনের নির্ভরযোগ্য তেলাওয়াত প্লে করার জন্য আমরা উন্মুক্ত অডিও রিপোজিটরি (যেমন:
            EveryAyah CDN) এবং ফন্ট পরিবেশনের জন্য Google Fonts ব্যবহার করি। এই সেবাগুলো তাদের
            নিজস্ব স্ট্যান্ডার্ড প্রোটোকল অনুযায়ী পরিচালিত হয়।
          </p>
        </section>

        {/* ডেটা মুছে ফেলা বা নিয়ন্ত্রণ */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            ৫. আপনার তথ্যের ওপর আপনার নিয়ন্ত্রণ
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            যেহেতু আপনার ব্যক্তিগত নোট ও সেটিংস ব্রাউজারে থাকে, তাই যেকোনো সময় ব্রাউজারের
            হিস্ট্রি/ক্যাশ ক্লিয়ার করে বা অ্যাপের সেটিংস থেকে সমস্ত ডাটা এক ক্লিকে মুছে ফেলতে পারেন।
          </p>
        </section>

        {/* যোগাযোগ */}
        <section className="space-y-3 rounded-2xl border border-primary/20 bg-primary/[0.03] p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground flex items-center gap-2">
            <Mail className="size-5 text-primary" />
            ৬. যোগাযোগ ও মতামত
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            আমাদের গোপনীয়তা নীতি সম্পর্কিত কোনো প্রশ্ন, মতামত বা পরামর্শ থাকলে নির্দ্বিধায় আমাদের
            সাথে যোগাযোগ করুন:
          </p>
          <div className="pt-1">
            <Button asChild variant="outline" size="sm">
              <Link to="/contact">যোগাযোগ পেজে যান</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
