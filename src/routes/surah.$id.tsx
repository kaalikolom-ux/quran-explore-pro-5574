import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  BookA,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Pause,
  Play,
  Search,
  Copy,
  Share2,
  SquarePen,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import {
  BN_TRANSLATION_ID,
  EN_TRANSLATION_ID,
  audioQuery,
  chaptersQuery,
  localNumber,
  stripHtml,
  versesQuery,
} from "@/lib/quran";
import { usePrefs } from "@/lib/prefs";
import { useIsAdmin, useSession } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { resolveAudioSrc } from "@/lib/offline";
import { BookmarkButton } from "@/components/BookmarkButton";
import { TranslationLayer } from "@/components/TranslationLayer";
import { WordSearchDialog } from "@/components/WordSearchDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/surah/$id")({
  validateSearch: (search: Record<string, unknown>) => ({
    ayah: search.ayah ? String(search.ayah) : undefined,
  }),
  head: ({ params }) => {
    const title = `সুরা ${params.id} — কুরআন অন্বেষা`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `সুরা ${params.id}-এর আরবি, শব্দে শব্দে অর্থ, বাংলা ও ইংরেজি অনুবাদ এবং বিজ্ঞানভিত্তিক অনুবাদ।`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "শব্দে শব্দে অর্থ ও একাধিক অনুবাদসহ কুরআন পড়ুন।",
        },
      ],
    };
  },
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(versesQuery(Number(params.id), "bn"));
    context.queryClient.ensureQueryData(chaptersQuery("bn"));
  },
  component: SurahPage,
});

function bnToEnDigits(str: string): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return str.replace(/[০-৯]/g, (w) => String(bnDigits.indexOf(w)));
}

function SurahPage() {
  const { id } = Route.useParams();
  const searchParams = useSearch({ from: "/surah/$id" });
  const surah = Number(id);
  const { t, lang, layers, arabicFontSize, translationFontSize } = usePrefs();
  const { isAdmin } = useIsAdmin();
  const { user } = useSession();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const chapters = useQuery(chaptersQuery(lang));
  const verses = useQuery(versesQuery(surah, lang));
  const chapter = chapters.data?.find((c) => c.id === surah);

  const custom = useQuery({
    queryKey: ["verse-translations", surah],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verse_translations")
        .select("surah, ayah, lang, text, note")
        .eq("surah", surah);
      if (error) throw error;
      return data;
    },
  });

  const customFor = (ayah: number, l: string) =>
    custom.data?.find((c) => c.ayah === ayah && c.lang === l);

  // ইউজারদের ব্যক্তিগত নোটস কুয়েরি
  const userNotes = useQuery({
    queryKey: ["user-notes", surah, user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_notes" as any)
        .select("ayah, note_text")
        .eq("surah", surah)
        .eq("user_id", user!.id);
      if (error) return [];
      return data as { ayah: number; note_text: string }[];
    },
  });

  // নোট ডায়ালগ স্টেট
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [activeAyahForNote, setActiveAyahForNote] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

  const saveNoteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("অনুগ্রহ করে সাইন ইন করুন");
      if (activeAyahForNote == null) return;
      const { error } = await supabase.from("user_notes" as any).upsert(
        {
          user_id: user.id,
          surah,
          ayah: activeAyahForNote,
          note_text: noteText.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,surah,ayah" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-notes", surah, user?.id] });
      setNoteModalOpen(false);
      toast.success("নোট সফলভাবে সেভ হয়েছে!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const audio = useQuery(audioQuery(surah));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const [lexOpen, setLexOpen] = useState<number | null>(null);
  const [searchWord, setSearchWord] = useState<string | null>(null);

  // আয়াতে স্ক্রল লজিক
  useEffect(() => {
    if (!verses.data || verses.data.length === 0) return;

    let targetAyah = searchParams?.ayah;
    if (!targetAyah && typeof window !== "undefined" && window.location.hash) {
      targetAyah = window.location.hash.replace("#ayah-", "").replace("#", "");
    }

    if (targetAyah) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`ayah-${targetAyah}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-primary", "transition-all", "duration-500");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-primary");
          }, 3500);
        }
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [verses.data, searchParams?.ayah]);

  async function playAyah(ayah: number) {
    const el = audioRef.current;
    const src = audio.data?.[ayah];
    if (!el || !src) return;
    if (playing === ayah && !el.paused) {
      el.pause();
      setPlaying(null);
      return;
    }
    el.src = await resolveAudioSrc(src);
    void el.play();
    setPlaying(ayah);
  }

  function playNext() {
    if (playing == null) return;
    const next = playing + 1;
    if (audio.data?.[next]) void playAyah(next);
    else setPlaying(null);
  }

  // কপি আয়াত হ্যান্ডলার
  const copyAyahText = (ayahNum: number, arabic: string, bnText: string) => {
    const copyContent = `${arabic}\n\n"${bnText}"\n\n— [সুরা ${chapter?.name_simple || surah} ${surah}:${ayahNum}]`;
    navigator.clipboard.writeText(copyContent);
    toast.success(`সুরা ${surah}:${ayahNum} কপি করা হয়েছে!`);
  };

  // শেয়ার আয়াত হ্যান্ডলার
  const shareAyah = async (ayahNum: number) => {
    const shareUrl = `${window.location.origin}/surah/${surah}?ayah=${ayahNum}#ayah-${ayahNum}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `সুরা ${chapter?.name_simple} — আয়াত ${surah}:${ayahNum}`,
          text: `কুরআন অন্বেষা থেকে সুরা ${chapter?.name_simple} (${surah}:${ayahNum}) পড়ুন:`,
          url: shareUrl,
        });
      } catch (err) {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("আয়াতের লিংক কপি করা হয়েছে!");
    }
  };

  // নোট ওপেন হ্যান্ডলার
  const openNoteDialog = (ayahNum: number) => {
    if (!user) {
      toast.error("ব্যক্তিগত নোট যুক্ত করতে অনুগ্রহ করে সাইন-ইন করুন!");
      return;
    }
    const existing = userNotes.data?.find((n) => n.ayah === ayahNum);
    setActiveAyahForNote(ayahNum);
    setNoteText(existing ? existing.note_text : "");
    setNoteModalOpen(true);
  };

  const handleFloatingSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = searchTerm.trim();
    if (!raw) return;

    const normalized = bnToEnDigits(raw.toLowerCase());

    const match = normalized.match(/^(\d+)[:ঃ/-](\d+)$/);
    if (match) {
      const sNum = match[1];
      const aNum = match[2];
      setSearchTerm("");
      void navigate({
        to: `/surah/$id`,
        params: { id: sNum },
        search: { ayah: aNum },
        hash: `ayah-${aNum}`,
      });
      return;
    }

    if (/^\d+$/.test(normalized)) {
      const sNum = Number(normalized);
      if (sNum >= 1 && sNum <= 114) {
        setSearchTerm("");
        void navigate({
          to: `/surah/$id`,
          params: { id: String(sNum) },
        });
        return;
      }
    }

    const found = chapters.data?.find(
      (c) =>
        c.name_simple.toLowerCase().includes(raw.toLowerCase()) ||
        c.translated_name.name.toLowerCase().includes(raw.toLowerCase())
    );
    if (found) {
      setSearchTerm("");
      void navigate({
        to: `/surah/$id`,
        params: { id: String(found.id) },
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 pb-28">
      {/* হেড কার্ড */}
      <div className="card-soft mb-6 flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {t("surahs")} {localNumber(surah, lang)}
          </p>
          <h1 className="mt-1 text-2xl font-semibold">
            {chapter?.name_simple ?? "..."}{" "}
            {chapter && (
              <span className="text-muted-foreground">— {chapter.translated_name.name}</span>
            )}
          </h1>
          {chapter && (
            <p className="mt-1 text-sm text-muted-foreground">
              {localNumber(chapter.verses_count, lang)} {t("verses")} · {t("makaMadina")}:{" "}
              {chapter.revelation_place}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="arabic text-2xl text-primary">{chapter?.name_arabic}</span>
          <Button
            variant="outline"
            size="sm"
            aria-label={playing != null ? t("pause") : t("play")}
            title={t("reciter")}
            onClick={() => void playAyah(playing ?? 1)}
          >
            {playing != null ? <Pause className="size-4" /> : <Play className="size-4" />}
            <span className="hidden sm:inline">{t("audio")}</span>
          </Button>
          {chapter && (
            <BookmarkButton
              variant="outline"
              target={{ kind: "surah", surah, label: chapter.name_simple }}
            />
          )}
        </div>
      </div>

      <audio
        ref={audioRef}
        onEnded={playNext}
        onPause={() => setPlaying((p) => (audioRef.current?.ended ? p : null))}
        preload="none"
        className="hidden"
      />
      <p className="mb-4 text-xs text-muted-foreground">{t("reciter")}</p>

      {verses.isLoading && <p className="text-sm text-muted-foreground">{t("loading")}</p>}
      {verses.isError && <p className="text-sm text-destructive">{t("error")}</p>}

      {/* আয়াত তালিকা */}
      <div className="space-y-4">
        {verses.data?.map((v) => {
          const bn = v.translations.find((x) => x.resource_id === BN_TRANSLATION_ID);
          const en = v.translations.find((x) => x.resource_id === EN_TRANSLATION_ID);
          const sciBn = customFor(v.verse_number, "bn");
          const sciEn = customFor(v.verse_number, "en");
          const bnEdited = customFor(v.verse_number, "bn_std");
          const enEdited = customFor(v.verse_number, "en_std");
          const metaBn = customFor(v.verse_number, "meta_bn");
          const metaEn = customFor(v.verse_number, "meta_en");
          const arabicEdited = customFor(v.verse_number, "arabic");
          const lexNote = customFor(v.verse_number, "lexicon");
          const words = v.words.filter((w) => w.char_type_name === "word");
          const fullTransliteration = words
            .map((w) => w.transliteration?.text)
            .filter(Boolean)
            .join(" ");
          const isPlaying = playing === v.verse_number;
          const lexiconOpen = lexOpen === v.verse_number;

          const hasSciBn = !!sciBn?.text?.trim();
          const hasSciEn = !!sciEn?.text?.trim();

          const activeBnText = bnEdited ? bnEdited.text : bn ? stripHtml(bn.text) : "";
          const activeArabicText = arabicEdited ? arabicEdited.text : v.text_uthmani;
          const hasSavedNote = userNotes.data?.some((n) => n.ayah === v.verse_number);

          return (
            <article key={v.id} id={`ayah-${v.verse_number}`} className="card-soft p-6">
              <div className="mb-4 flex items-center justify-between gap-2 border-b border-border/40 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    {localNumber(surah, "bn")}ঃ{localNumber(v.verse_number, "bn")}
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {surah}:{v.verse_number}
                  </span>
                </div>

                {/* টুলবার বাটনসমূহ (Play, Copy, Share, Note, Bookmark) */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    aria-label={isPlaying ? t("pause") : t("play")}
                    title={isPlaying ? "বিরতি দিন" : "তেলাওয়াত শুনুন"}
                    onClick={() => void playAyah(v.verse_number)}
                  >
                    {isPlaying ? <Pause className="size-4 text-primary" /> : <Play className="size-4" />}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="আয়াত ও অনুবাদ কপি করুন"
                    onClick={() => copyAyahText(v.verse_number, activeArabicText, activeBnText)}
                  >
                    <Copy className="size-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    title="শেয়ার করুন"
                    onClick={() => void shareAyah(v.verse_number)}
                  >
                    <Share2 className="size-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${hasSavedNote ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
                    title={hasSavedNote ? "নোট দেখুন / এডিট করুন" : "ব্যক্তিগত নোট লিখুন"}
                    onClick={() => openNoteDialog(v.verse_number)}
                  >
                    <SquarePen className="size-4" />
                  </Button>

                  <BookmarkButton
                    target={{
                      kind: "ayah",
                      surah,
                      ayah: v.verse_number,
                      label: `${chapter?.name_simple ?? surah} ${surah}:${v.verse_number}`,
                    }}
                  />
                </div>
              </div>

              {(isAdmin || metaBn?.text?.trim() || metaEn?.text?.trim()) && (
                <div className="mb-5 grid gap-3 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-2">
                  <TranslationLayer
                    surah={surah}
                    ayah={v.verse_number}
                    storageLang="meta_bn"
                    title={`${localNumber(surah, "bn")}ঃ${localNumber(v.verse_number, "bn")} — ${t("metadataBn")}`}
                    text={metaBn?.text ?? ""}
                    note={metaBn?.note ?? null}
                    placeholder={t("metadataPlaceholder")}
                  />
                  <TranslationLayer
                    surah={surah}
                    ayah={v.verse_number}
                    storageLang="meta_en"
                    title={`${surah}:${v.verse_number} — ${t("metadataEn")}`}
                    text={metaEn?.text ?? ""}
                    note={metaEn?.note ?? null}
                    placeholder={t("metadataPlaceholder")}
                  />
                </div>
              )}

              {layers.arabic && (
                <>
                  <div style={{ fontSize: `${arabicFontSize ?? 28}px` }}>
                    <TranslationLayer
                      surah={surah}
                      ayah={v.verse_number}
                      storageLang="arabic"
                      title={t("arabicText")}
                      text={arabicEdited ? arabicEdited.text : v.text_uthmani}
                      edited={!!arabicEdited}
                      hideNoteField
                      textClassName="arabic text-right text-3xl leading-[2.4] text-foreground"
                    />
                  </div>
                  {fullTransliteration && (
                    <p className="mt-3 text-sm italic leading-relaxed text-muted-foreground">
                      {fullTransliteration}
                    </p>
                  )}
                </>
              )}

              {layers.words && (
                <div className="mt-5 flex flex-wrap-reverse justify-end gap-x-4 gap-y-4">
                  {words.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setSearchWord(w.text_uthmani ?? null)}
                      className="min-w-16 rounded-md px-1.5 py-1 text-center transition-colors hover:bg-accent"
                      title={t("wordSearch")}
                    >
                      <div className="arabic text-2xl leading-normal text-foreground">
                        {w.text_uthmani}
                      </div>
                      {w.transliteration?.text && (
                        <div className="text-[11px] italic text-muted-foreground">
                          {w.transliteration.text}
                        </div>
                      )}
                      <div className="text-xs text-primary">{w.translation?.text}</div>
                    </button>
                  ))}
                </div>
              )}

              {layers.translation && (
                <div
                  className="mt-5 space-y-4 border-t border-border pt-5"
                  style={{ fontSize: `${translationFontSize ?? 16}px` }}
                >
                  {layers.bn && (
                    <TranslationLayer
                      surah={surah}
                      ayah={v.verse_number}
                      storageLang="bn_std"
                      title={bnEdited ? t("stdBn") : t("banglaTranslation")}
                      text={activeBnText}
                      note={bnEdited?.note ?? null}
                      edited={!!bnEdited}
                    />
                  )}
                  {layers.en && (
                    <TranslationLayer
                      surah={surah}
                      ayah={v.verse_number}
                      storageLang="en_std"
                      title={enEdited ? t("stdEn") : t("englishTranslation")}
                      text={enEdited ? enEdited.text : en ? stripHtml(en.text) : ""}
                      note={enEdited?.note ?? null}
                      edited={!!enEdited}
                    />
                  )}

                  {layers.sciBn && (isAdmin || hasSciBn) && (
                    <TranslationLayer
                      surah={surah}
                      ayah={v.verse_number}
                      storageLang="bn"
                      tone="primary"
                      title={t("sciBn")}
                      text={sciBn?.text ?? ""}
                      note={sciBn?.note ?? null}
                    />
                  )}

                  {layers.sciEn && (isAdmin || hasSciEn) && (
                    <TranslationLayer
                      surah={surah}
                      ayah={v.verse_number}
                      storageLang="en"
                      tone="gold"
                      title={t("sciEn")}
                      text={sciEn?.text ?? ""}
                      note={sciEn?.note ?? null}
                    />
                  )}
                </div>
              )}

              {layers.lexicon && (
                <div className="mt-5 border-t border-border pt-4">
                  <button
                    className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    aria-expanded={lexiconOpen}
                    onClick={() => setLexOpen(lexOpen ? null : v.verse_number)}
                  >
                    <BookA className="size-4" />
                    {t("lexicon")}
                  </button>
                  {lexiconOpen && (
                    <div className="mt-3 rounded-lg border border-border bg-muted/40 p-4">
                      <p className="text-xs text-muted-foreground">{t("lexiconHint")}</p>
                      <ul className="mt-3 divide-y divide-border/70">
                        {words.map((w) => (
                          <li
                            key={w.id}
                            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2"
                          >
                            <button
                              type="button"
                              onClick={() => setSearchWord(w.text_uthmani ?? null)}
                              className="arabic text-xl text-foreground hover:text-primary"
                              title={t("wordSearch")}
                            >
                              {w.text_uthmani}
                            </button>
                            {w.transliteration?.text && (
                              <span className="text-xs italic text-muted-foreground">
                                {w.transliteration.text}
                              </span>
                            )}
                            <span className="text-sm text-primary">{w.translation?.text}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 border-t border-border/70 pt-3">
                        <TranslationLayer
                              surah={surah}
                              ayah={v.verse_number}
                              storageLang="lexicon"
                              title={t("lexiconNote")}
                              text={lexNote?.text ?? ""}
                              note={lexNote?.note ?? null}
                            />
                      </div>
                      <a
                        href={`https://corpus.quran.com/wordbyword.jsp?chapter=${surah}&verse=${v.verse_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary"
                      >
                        {t("rootLookup")} <ExternalLink className="size-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* নেভিগেশন বাটন (আগের/পরের সুরা) */}
      <div className="mt-8 flex items-center justify-between">
        {surah > 1 ? (
          <Button asChild variant="outline">
            <Link to="/surah/$id" params={{ id: String(surah - 1) }}>
              <ChevronLeft className="size-4" /> {localNumber(surah - 1, lang)}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {surah < 114 && (
          <Button asChild variant="outline">
            <Link to="/surah/$id" params={{ id: String(surah + 1) }}>
              {localNumber(surah + 1, lang)} <ChevronRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* ফ্লোটিং জাম্প বার */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md">
        <div className="rounded-2xl border border-border/80 bg-background/90 p-2 shadow-2xl backdrop-blur-lg">
          <form onSubmit={handleFloatingSearch} className="relative flex items-center">
            <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                lang === "bn"
                  ? "সুরা/আয়াত জাম্প (যেমন: ৩৩:৪০ বা 33:40)..."
                  : "Jump to Surah/Ayah (e.g. 33:40)..."
              }
              className="h-10 rounded-xl border-border/60 bg-muted/40 pl-9 pr-14 text-sm placeholder:text-muted-foreground/70 focus-visible:ring-primary"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 h-8 rounded-lg px-3 text-xs"
            >
              জাম্প
            </Button>
          </form>
        </div>
      </div>

      {/* ব্যক্তিগত নোট লেখার মোডাল */}
      <Dialog open={noteModalOpen} onOpenChange={setNoteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SquarePen className="size-5 text-primary" /> আয়াত {surah}:{activeAyahForNote}-এ ব্যক্তিগত নোট
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted-foreground">
              এই নোটটি কেবলমাত্র আপনার অ্যাকাউন্টে সুরক্ষিত থাকবে এবং আপনি ছাড়া অন্য কেউ দেখতে পাবে না।
            </p>
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="এই আয়াত নিয়ে আপনার অনুভূতি, তাফসির পয়েন্ট বা ব্যক্তিগত ভাবনা লিখুন..."
              rows={5}
              className="resize-none"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setNoteModalOpen(false)}>
              বাতিল
            </Button>
            <Button onClick={() => saveNoteMutation.mutate()} disabled={saveNoteMutation.isPending}>
              সেভ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WordSearchDialog word={searchWord} onClose={() => setSearchWord(null)} />
    </div>
  );
}