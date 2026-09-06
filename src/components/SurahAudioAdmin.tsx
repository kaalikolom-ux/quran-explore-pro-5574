import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Headphones,
  Globe,
  Lock,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  SlidersHorizontal,
  RefreshCw,
  ShieldCheck,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";

import { usePrefs } from "@/lib/prefs";
import { SURAH_META_MAP, type SurahMeta } from "@/lib/surahMeta";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SurahAudioAdmin() {
  const {
    publicPermissions,
    updatePublicPermission,
    surahAudioPermissions,
    updateSurahAudioPermission,
    bulkUpdateSurahAudioPermissions,
    lang,
  } = usePrefs();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "allowed" | "restricted">("all");
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Global switch
  const isGlobalAudioAllowed = publicPermissions.showAudioPlayback !== false;

  // Build 114 surahs array
  const surahsList = useMemo(() => {
    const list: Array<{ id: number } & SurahMeta> = [];
    for (let i = 1; i <= 114; i++) {
      const meta = SURAH_META_MAP[i] || {
        name_bn: `সুরা ${i}`,
        name_ar: "",
        type: "মাক্কী",
        total: 0,
      };
      list.push({ id: i, ...meta });
    }
    return list;
  }, []);

  // Filtered surahs
  const filteredSurahs = useMemo(() => {
    return surahsList.filter((s) => {
      const isAllowed = isGlobalAudioAllowed && surahAudioPermissions[s.id] !== false;

      // Status filter
      if (filterMode === "allowed" && !isAllowed) return false;
      if (filterMode === "restricted" && isAllowed) return false;

      // Search filter
      if (!searchTerm.trim()) return true;
      const term = searchTerm.trim().toLowerCase();
      const matchId = String(s.id) === term;
      const matchBn = s.name_bn.toLowerCase().includes(term);
      const matchAr = s.name_ar.includes(term);
      return matchId || matchBn || matchAr;
    });
  }, [surahsList, isGlobalAudioAllowed, surahAudioPermissions, filterMode, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    let allowedCount = 0;
    let restrictedCount = 0;
    for (let i = 1; i <= 114; i++) {
      if (isGlobalAudioAllowed && surahAudioPermissions[i] !== false) {
        allowedCount++;
      } else {
        restrictedCount++;
      }
    }
    return { allowedCount, restrictedCount };
  }, [isGlobalAudioAllowed, surahAudioPermissions]);

  const handleGlobalToggle = async (val: boolean) => {
    await updatePublicPermission("showAudioPlayback", val);
    toast.success(
      val
        ? (lang === "bn" ? "ভিজিটরদের জন্য সম্পূর্ণ কুরআনের অডিও প্লেব্যাক উন্মুক্ত করা হয়েছে" : "Global audio playback is now visible to public visitors")
        : (lang === "bn" ? "ভিজিটরদের জন্য সম্পূর্ণ কুরআনের অডিও প্লেব্যাক স্থগিত করা হয়েছে" : "Global audio playback is now restricted for public visitors")
    );
  };

  const handleSurahToggle = async (surahId: number, currentAllowed: boolean) => {
    const nextVal = !currentAllowed;
    await updateSurahAudioPermission(surahId, nextVal);
    const surahMeta = SURAH_META_MAP[surahId];
    toast.success(
      lang === "bn"
        ? `সুরা ${surahMeta?.name_bn || surahId} এর অডিও ভিজিটরদের জন্য ${nextVal ? "উন্মুক্ত" : "লুকানো/স্থগিত"} করা হয়েছে`
        : `Surah ${surahMeta?.name_bn || surahId} audio is now ${nextVal ? "allowed" : "restricted"} for visitors`
    );
  };

  const handleBulkEnableAll = async () => {
    setIsBulkProcessing(true);
    try {
      if (!isGlobalAudioAllowed) {
        await updatePublicPermission("showAudioPlayback", true);
      }
      await bulkUpdateSurahAudioPermissions(true);
      toast.success(
        lang === "bn"
          ? "সকল ১১৪টি সুরার অডিও ভিজিটরদের জন্য উন্মুক্ত করা হয়েছে"
          : "Audio for all 114 surahs is now allowed for visitors"
      );
    } catch {
      toast.error(lang === "bn" ? "আপডেট করতে সমস্যা হয়েছে" : "Failed to update permissions");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleBulkDisableAll = async () => {
    setIsBulkProcessing(true);
    try {
      await bulkUpdateSurahAudioPermissions(false);
      toast.success(
        lang === "bn"
          ? "সকল ১১৪টি সুরার অডিও ভিজিটরদের জন্য স্থগিত করা হয়েছে"
          : "Audio for all 114 surahs is now restricted for visitors"
      );
    } catch {
      toast.error(lang === "bn" ? "আপডেট করতে সমস্যা হয়েছে" : "Failed to update permissions");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* হেডার ও ব্রিফ */}
      <div className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Headphones className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <span>{lang === "bn" ? "সুরার অডিও এক্সেস ও ভিজিটর অনুমোদন কন্ট্রোল" : "Surah Audio Access & Visitor Control"}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="size-3.5" />
                  {lang === "bn" ? "এডমিন মাস্টার মোড" : "Admin Master"}
                </span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "bn"
                  ? "সাধারণ ভিজিটরদের জন্য সম্পূর্ণ কুরআনের সার্বিক অডিও কিংবা যেকোনো নির্দিষ্ট সুরার অডিও প্লেব্যাক নিয়ন্ত্রণ করুন।"
                  : "Control global and per-surah audio playback access for public visitors across all 114 surahs."}
              </p>
            </div>
          </div>
        </div>

        {/* গ্লোবাল মাস্টার সুইচ কার্ড */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Globe className={`size-4 shrink-0 mt-0.5 ${isGlobalAudioAllowed ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"}`} />
              <div>
                <span className="text-sm font-semibold text-foreground">
                  {lang === "bn" ? "সার্বিক অডিও প্লেব্যাক (Global Master Switch):" : "Global Audio Playback Master:"}
                </span>{" "}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ml-1.5 ${
                  isGlobalAudioAllowed
                    ? "text-emerald-700 bg-emerald-500/20 dark:text-emerald-300"
                    : "text-amber-700 bg-amber-500/20 dark:text-amber-300"
                }`}>
                  {isGlobalAudioAllowed
                    ? (lang === "bn" ? "🌐 উন্মুক্ত (Allowed)" : "Allowed")
                    : (lang === "bn" ? "🔒 সম্পূর্ণ সাইটে স্থগিত (Restricted)" : "Restricted")}
                </span>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {lang === "bn"
                    ? "এই গ্লোবাল সুইচটি বন্ধ থাকলে কোনো ভিজিটর সাইটের কোনো সুরায় আরবী বা অনুবাদ অডিও শুনতে পাবে না। এডমিন হিসেবে আপনি সবসময় পরীক্ষা করতে পারবেন।"
                    : "When turned off, audio playback is disabled sitewide for public visitors, while administrators can always listen."}
                </p>
              </div>
            </div>

            <div className="shrink-0 self-end sm:self-center">
              <Switch
                id="global-audio-master-switch"
                checked={isGlobalAudioAllowed}
                onCheckedChange={handleGlobalToggle}
              />
            </div>
          </div>
        </div>

        {/* ফিল্টার, সার্চ ও বাল্ক অ্যাকশন বার */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          {/* সার্চ ও ফিল্টার বাটন */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[180px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={lang === "bn" ? "সুরা খুঁজুন (নম্বর বা নাম)..." : "Search surah (number or name)..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs bg-background"
              />
            </div>

            <div className="flex items-center rounded-lg border border-border/70 p-0.5 bg-muted/40 text-xs">
              <button
                type="button"
                onClick={() => setFilterMode("all")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  filterMode === "all" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang === "bn" ? "সবগুলো (১১৪)" : "All (114)"}
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("allowed")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  filterMode === "allowed" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CheckCircle2 className="size-3 text-emerald-600" />
                {lang === "bn" ? `উন্মুক্ত (${stats.allowedCount})` : `Allowed (${stats.allowedCount})`}
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("restricted")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  filterMode === "restricted" ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Lock className="size-3 text-amber-600" />
                {lang === "bn" ? `স্থগিত (${stats.restrictedCount})` : `Restricted (${stats.restrictedCount})`}
              </button>
            </div>
          </div>

          {/* বাল্ক অ্যাকশন বাটন */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkEnableAll}
              disabled={isBulkProcessing}
              className="h-8 text-xs border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 cursor-pointer"
            >
              <Volume2 className="size-3.5 mr-1 text-emerald-600" />
              {lang === "bn" ? "সব সুরায় চালু করুন" : "Enable All"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDisableAll}
              disabled={isBulkProcessing}
              className="h-8 text-xs border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 cursor-pointer"
            >
              <VolumeX className="size-3.5 mr-1 text-amber-600" />
              {lang === "bn" ? "সব সুরায় স্থগিত করুন" : "Disable All"}
            </Button>
          </div>
        </div>
      </div>

      {/* ১১৪টি সুরার কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredSurahs.map((surah) => {
          const isSurahAllowed = isGlobalAudioAllowed && surahAudioPermissions[surah.id] !== false;

          return (
            <div
              key={surah.id}
              className={`flex flex-col justify-between rounded-xl border p-4 shadow-xs transition-all ${
                !isSurahAllowed
                  ? "border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10"
                  : "border-border/70 bg-card hover:border-border"
              }`}
            >
              {/* শীর্ষ অংশ: সুরার পরিচিতি ও টেস্ট লিংক */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="size-6 rounded-md bg-muted flex items-center justify-center text-xs font-bold text-foreground shrink-0 border border-border/60">
                      {surah.id}
                    </span>
                    <span className="text-sm font-bold text-foreground truncate">
                      {surah.name_bn}
                    </span>
                    <span className="text-xs font-serif text-muted-foreground">
                      ({surah.name_ar})
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <span>{surah.total}টি আয়াত</span>
                    <span>•</span>
                    <span className="rounded bg-muted/60 px-1.5 py-0.2 text-[10px] font-medium text-foreground">
                      {surah.type}
                    </span>
                  </p>
                </div>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                  title="সুরার অডিও টেস্ট করুন"
                >
                  <Link to={`/surah/${surah.id}`} target="_blank">
                    <ExternalLink className="size-3.5" />
                  </Link>
                </Button>
              </div>

              {/* নিচের অংশ: স্ক্রিনশটের হুবহু ডিজাইনে ভিজিটর অনুমোদন টগল */}
              <div
                className="mt-3.5 pt-3 border-t border-border/50 flex items-center justify-between gap-2 cursor-pointer hover:opacity-90 transition-opacity select-none"
                onClick={() => handleSurahToggle(surah.id, isSurahAllowed)}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <Globe
                    className={`size-3.5 shrink-0 ${
                      isSurahAllowed ? "text-emerald-500" : "text-amber-500"
                    }`}
                  />
                  <span className="text-xs font-semibold text-foreground/90 truncate">
                    {lang === "bn" ? "ভিজিটর অনুমোদন:" : "Visitor Access:"}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      isSurahAllowed
                        ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400"
                        : "text-amber-600 bg-amber-500/10 dark:text-amber-400"
                    }`}
                  >
                    {isSurahAllowed
                      ? (lang === "bn" ? "উন্মুক্ত" : "Allowed")
                      : (lang === "bn" ? "লুকানো (Hidden)" : "Restricted")}
                  </span>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <Switch
                    id={`surah-audio-perm-${surah.id}`}
                    checked={isSurahAllowed}
                    onCheckedChange={() => handleSurahToggle(surah.id, isSurahAllowed)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSurahs.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-xs">
          {lang === "bn"
            ? "কোনো সুরা খুঁজে পাওয়া যায়নি। ভিন্ন নম্বর বা নাম লিখে চেষ্টা করুন।"
            : "No surahs found matching your filter criteria."}
        </div>
      )}
    </div>
  );
}
