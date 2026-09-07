import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/lib/auth";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

type Tone = "plain" | "primary" | "gold";

const TONE_WRAP: Record<Tone, string> = {
  plain: "",
  primary: "rounded-lg border border-primary/25 bg-primary/5 p-4",
  gold: "rounded-lg border border-gold/40 bg-gold/10 p-4 dark:border-gold/50 dark:bg-gold/15",
};

const TONE_TITLE: Record<Tone, string> = {
  plain: "text-muted-foreground",
  primary: "text-primary",
  gold: "text-gold-foreground dark:text-gold",
};

export function TranslationLayer({
  surah,
  ayah,
  storageLang,
  title,
  text,
  note,
  edited,
  tone = "plain",
  placeholder,
  textClassName,
  hideNoteField,
}: {
  surah: number;
  ayah: number;
  /** row `lang` value in verse_translations: bn_std | en_std | bn | en */
  storageLang: string;
  title: string;
  text: string;
  note?: string | null;
  edited?: boolean;
  tone?: Tone;
  placeholder?: string;
  textClassName?: string;
  hideNoteField?: boolean;
}) {

  const { t } = usePrefs();
  const { isAdmin } = useIsAdmin();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(text);
  const [draftNote, setDraftNote] = useState(note ?? "");

  const save = useMutation({
    mutationFn: async () => {
      const cleanText = draft.trim();
      const cleanNote = draftNote.trim() || null;

      // 1. Safe lookup to avoid Postgres 42P10 onConflict constraint error
      const { data: existingTrans } = await supabase
        .from("verse_translations")
        .select("id")
        .eq("surah", surah)
        .eq("ayah", ayah)
        .eq("lang", storageLang)
        .maybeSingle();

      if (existingTrans?.id) {
        const { error: updateErr } = await supabase
          .from("verse_translations")
          .update({
            text: cleanText,
            note: cleanNote,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingTrans.id);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from("verse_translations")
          .insert({
            surah,
            ayah,
            lang: storageLang,
            text: cleanText,
            note: cleanNote,
            updated_at: new Date().toISOString(),
          });
        if (insertErr) throw insertErr;
      }

      // 2. Also sync to quran_verses master table
      const verseUpdate: any = {
        surah,
        ayah,
        updated_at: new Date().toISOString(),
      };
      if (storageLang === "bn_std" || storageLang === "conventional_bn") {
        verseUpdate.conventional_bn = cleanText;
        verseUpdate.bn_text = cleanText;
      } else if (storageLang === "en_std" || storageLang === "conventional_en") {
        verseUpdate.conventional_en = cleanText;
        verseUpdate.en_text = cleanText;
      } else if (storageLang === "core_bn" || storageLang === "core_meaning_bn") {
        verseUpdate.core_meaning_bn = cleanText;
      } else if (storageLang === "core_en" || storageLang === "core_meaning_en") {
        verseUpdate.core_meaning_en = cleanText;
      } else if (storageLang === "bn" || storageLang === "modern_bn" || storageLang === "modern_translation_bn") {
        verseUpdate.modern_translation_bn = cleanText;
      } else if (storageLang === "en" || storageLang === "modern_en" || storageLang === "modern_translation_en") {
        verseUpdate.modern_translation_en = cleanText;
      }
      try {
        await (supabase as any).from("quran_verses").upsert(verseUpdate, { onConflict: "surah,ayah" });
      } catch (qvErr) {
        console.warn("Failed to sync quran_verses in TranslationLayer:", qvErr);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["verse-translations", surah] });
      await queryClient.invalidateQueries({ queryKey: ["local-surah-cache", surah] });
      await queryClient.invalidateQueries({ queryKey: ["local-surah-init", surah] });
      setOpen(false);
      toast.success(t("saved"));
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function startEdit() {
    setDraft(text);
    setDraftNote(note ?? "");
    setOpen(true);
  }

  // Empty sections stay hidden from visitors even when the toggle is on;
  // admins still see them so they can fill them in.
  if (!isAdmin && !text?.trim() && !note?.trim()) return null;

  return (
    <div className={TONE_WRAP[tone]}>
      <div className="flex items-start justify-between gap-2">
        <p
          className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide ${TONE_TITLE[tone]}`}
        >
          {title}
          {edited && (
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] normal-case text-primary">
              {t("editedBadge")}
            </span>
          )}
        </p>
        {isAdmin && !open && (
          <button
            onClick={startEdit}
            aria-label={t("edit")}
            title={t("edit")}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
          >
            <Pencil className="size-3.5" />
          </button>
        )}
      </div>

      {open ? (
        <div className="mt-2 space-y-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            placeholder={title}
            className={textClassName}
          />
          {!hideNoteField && (
            <Input
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder={t("note")}
            />
          )}
          <div className="flex gap-2">
            <Button size="sm" disabled={save.isPending} onClick={() => save.mutate()}>
              {t("save")}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className={`mt-1 leading-relaxed ${textClassName ?? ""}`}>
            {text || <span className="text-muted-foreground">{placeholder ?? t("notAdded")}</span>}
          </p>
          {note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}
        </>
      )}
    </div>
  );
}

