import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { 
  X, 
  Save, 
  Plus, 
  Tag as TagIcon, 
  Check, 
  Image as ImageIcon, 
  Sparkles, 
  Globe, 
  Calendar, 
  Layers, 
  User, 
  Eye, 
  EyeOff, 
  FileEdit,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { useCategories } from "@/lib/menu";
import { formatArticleContent } from "@/lib/contentFormatter";
import { bnToEnSlug } from "@/lib/slugHelper";
import { STATIC_ARTICLES_META } from "@/lib/staticArticlesMeta";
import { RichTextEditor } from "@/components/RichTextEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const articleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "স্লাগ বাধ্যতামূলক")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "স্লাগে শুধুমাত্র ছোট হাতের ইংরেজি অক্ষর, সংখ্যা এবং ড্যাশ (-) ব্যবহার করা যাবে"),
  title_bn: z.string().trim().min(1, "বাংলা শিরোনাম বাধ্যতামূলক").max(200),
  title_en: z.string().trim().max(200).optional(),
  excerpt_bn: z.string().trim().max(500).optional(),
  excerpt_en: z.string().trim().max(500).optional(),
  content_bn: z.string().trim().min(1, "বাংলা বিষয়বস্তু লিখুন").max(60000),
  content_en: z.string().trim().max(60000).optional(),
  cover_image_url: z.string().trim().max(500).optional(),
});

interface ArticleInlineEditorModalProps {
  article: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (updatedArticle: any) => void;
}

export function ArticleInlineEditorModal({
  article,
  open,
  onOpenChange,
  onSaved,
}: ArticleInlineEditorModalProps) {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const categories = useCategories();

  // Active Tab for Editor: bn or en
  const [activeTab, setActiveTab] = useState<"bn" | "en">("bn");

  // Form States
  const [form, setForm] = useState({
    slug: "",
    title_bn: "",
    title_en: "",
    excerpt_bn: "",
    excerpt_en: "",
    content_bn: "",
    content_en: "",
    cover_image_url: "",
  });

  const [published, setPublished] = useState(true);
  const [authorId, setAuthorId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState<string>("");
  const [tagSearchQuery, setTagSearchQuery] = useState<string>("");
  const [customPublishedAt, setCustomPublishedAt] = useState<string>("");

  // Sync form data when article changes or modal opens
  useEffect(() => {
    if (article && open) {
      setForm({
        slug: article.slug || "",
        title_bn: article.title_bn || "",
        title_en: article.title_en || "",
        excerpt_bn: article.excerpt_bn || "",
        excerpt_en: article.excerpt_en || "",
        content_bn: article.content_bn || "",
        content_en: article.content_en || "",
        cover_image_url: article.cover_image_url || "",
      });

      setPublished(article.published ?? true);
      setAuthorId(article.author_id || article.author?.id || "");
      setCategoryId(article.category_id || article.category?.id || "");

      // Tags
      const currentTags = Array.isArray(article.tags)
        ? article.tags.map((t: string) => String(t).trim().replace(/^#/, "")).filter(Boolean)
        : [];
      setSelectedTags(currentTags);

      // Published At
      if (article.published_at) {
        try {
          const d = new Date(article.published_at);
          // format as YYYY-MM-DDThh:mm for datetime-local
          const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
          setCustomPublishedAt(iso);
        } catch {
          setCustomPublishedAt("");
        }
      } else {
        setCustomPublishedAt("");
      }
    }
  }, [article, open]);

  // Authors query
  const authorsQuery = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("id, name_bn, name_en")
        .order("name_bn");
      if (error) throw error;
      return data || [];
    },
  });

  // All tags query
  const allTagsQuery = useQuery({
    queryKey: ["admin-tags-selector-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("tags")
        .select("id, name_bn, name_en, slug")
        .order("name_bn");
      const dbTags = data || [];
      const dbNames = new Set(dbTags.map((t: any) => (t.name_bn || "").toLowerCase().trim()));

      const extraTags: { id: string; name_bn: string; slug: string }[] = [];
      STATIC_ARTICLES_META.forEach((meta) => {
        if (Array.isArray(meta.tags)) {
          meta.tags.forEach((t: string) => {
            const clean = String(t).trim().replace(/^#/, "");
            if (clean && !dbNames.has(clean.toLowerCase())) {
              dbNames.add(clean.toLowerCase());
              extraTags.push({ id: `meta-${clean}`, name_bn: clean, slug: clean });
            }
          });
        }
      });

      return [...dbTags, ...extraTags];
    },
  });

  const availableTags = allTagsQuery.data || [];

  const filteredAvailableTags = useMemo(() => {
    if (!tagSearchQuery.trim()) return availableTags;
    const q = tagSearchQuery.toLowerCase().trim();
    return availableTags.filter(
      (t: any) =>
        t.name_bn?.toLowerCase().includes(q) ||
        t.name_en?.toLowerCase().includes(q) ||
        t.slug?.toLowerCase().includes(q)
    );
  }, [availableTags, tagSearchQuery]);

  const toggleTagSelection = (tagName: string) => {
    const clean = tagName.trim().replace(/^#/, "");
    if (!clean) return;
    setSelectedTags((prev) => {
      const exists = prev.some((t) => t.toLowerCase() === clean.toLowerCase());
      if (exists) {
        return prev.filter((t) => t.toLowerCase() !== clean.toLowerCase());
      } else {
        return [...prev, clean];
      }
    });
  };

  const handleAddNewTag = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newTagInput.trim().replace(/^#/, "");
    if (!clean) return;

    if (!selectedTags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      setSelectedTags((prev) => [...prev, clean]);
    }
    setNewTagInput("");

    try {
      await supabase.from("tags").insert({
        name_bn: clean,
        name_en: null,
        slug: bnToEnSlug(clean),
      });
      queryClient.invalidateQueries({ queryKey: ["admin-tags-selector-list"] });
    } catch {
      // ignore tag insert conflict if duplicate
    }
  };

  // Auto-slug generator
  const handleGenerateSlug = () => {
    if (!form.title_bn.trim()) {
      toast.error("প্রথমে বাংলা শিরোনাম লিখুন");
      return;
    }
    const generated = bnToEnSlug(form.title_bn, article?.id ? String(article.id).slice(0, 6) : "");
    setForm((prev) => ({ ...prev, slug: generated }));
    toast.success("বাংলা শিরোনাম অনুযায়ী স্লাগ তৈরি হয়েছে!");
  };

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const parsed = articleSchema.safeParse(form);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "সঠিক তথ্য প্রদান করুন");
      }

      const autoExcerptBn = parsed.data.excerpt_bn
        ? parsed.data.excerpt_bn
        : parsed.data.content_bn.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").slice(0, 160).trim();

      const autoExcerptEn = parsed.data.excerpt_en
        ? parsed.data.excerpt_en
        : parsed.data.content_en
        ? parsed.data.content_en.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").slice(0, 160).trim()
        : null;

      const payload: any = {
        title_bn: parsed.data.title_bn,
        title_en: parsed.data.title_en || null,
        slug: parsed.data.slug,
        excerpt_bn: autoExcerptBn || null,
        excerpt_en: autoExcerptEn || null,
        content_bn: parsed.data.content_bn ? formatArticleContent(parsed.data.content_bn) : null,
        content_en: parsed.data.content_en ? formatArticleContent(parsed.data.content_en) : null,
        cover_image_url: parsed.data.cover_image_url || null,
        published,
        author_id: authorId || null,
        category_id: categoryId || null,
        tags: selectedTags,
        published_at: published
          ? customPublishedAt
            ? new Date(customPublishedAt).toISOString()
            : article.published_at || new Date().toISOString()
          : null,
        updated_at: new Date().toISOString(),
      };

      if (user?.id) {
        payload.created_by = user.id;
      }

      // Update in Supabase
      const { data: updated, error } = await supabase
        .from("articles")
        .update(payload)
        .eq("id", article.id)
        .select();

      if ((!updated || updated.length === 0) || error) {
        const { error: upsertErr } = await supabase
          .from("articles")
          .upsert({ ...payload, id: article.id, slug: payload.slug }, { onConflict: "id" });
        if (upsertErr) throw upsertErr;
      }

      return payload;
    },
    onSuccess: (savedPayload) => {
      // Invalidate all related caches
      queryClient.invalidateQueries({ queryKey: ["article-single-detail", article.slug] });
      if (savedPayload.slug !== article.slug) {
        queryClient.invalidateQueries({ queryKey: ["article-single-detail", savedPayload.slug] });
      }
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-tags-selector-list"] });
      queryClient.invalidateQueries({ queryKey: ["article-prev-next-nav"] });

      toast.success(
        published
          ? "আর্টিকেল সফলভাবে আপডেট ও প্রকাশ করা হয়েছে!"
          : "আর্টিকেলটি খসড়া (Draft) হিসেবে সফলভাবে সংরক্ষণ করা হয়েছে!"
      );

      onSaved?.(savedPayload);
      onOpenChange(false);

      // If slug was changed, navigate to new URL
      if (savedPayload.slug && savedPayload.slug !== article.slug) {
        navigate({
          to: "/articles/$slug",
          params: { slug: savedPayload.slug },
        });
      }
    },
    onError: (err: any) => {
      toast.error(err?.message || "আর্টিকেল সংরক্ষণ ব্যর্থ হয়েছে");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden border-border/80 shadow-2xl">
        {/* Modal Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-border/60 bg-muted/30 shrink-0">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <FileEdit className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground font-serif">
                  আর্টিকেল ইন-লাইন এডিটর
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  এই পেজ থেকেই সরাসরি আর্টিকেল এডিট করুন এবং ভিজিটরদের অ্যাক্সেস নিয়ন্ত্রণ করুন
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold inline-flex items-center gap-1.5 border ${
                  published
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                }`}
              >
                {published ? (
                  <>
                    <Eye className="size-3.5" /> 🟢 প্রকাশিত (লাইভ)
                  </>
                ) : (
                  <>
                    <EyeOff className="size-3.5" /> 🟡 খসড়া (হিডেন)
                  </>
                )}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body - Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Visibility & Control Notice */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <ShieldCheck className="size-4 text-primary" />
                <span>ভিজিটর ভিজিবিলিটি স্ট্যাটাস (Visitor Visibility Control)</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {published
                  ? "এই পোস্টটি বর্তমানে সাধারণ ভিজিটরদের জন্য সম্পূর্ণ উন্মুক্ত এবং সার্চ ইঞ্জিনে দৃশ্যমান।"
                  : "এই পোস্টটি বর্তমানে খসড়া (Draft) মোডে রয়েছে। সাধারণ ভিজিটররা এটি দেখতে পারবেন না, শুধুমাত্র অ্যাডমিনরা দেখতে পারবেন।"}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                size="sm"
                variant={published ? "default" : "outline"}
                onClick={() => setPublished(!published)}
                className={`text-xs font-semibold cursor-pointer h-8 transition-all ${
                  published
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                }`}
              >
                {published ? (
                  <>
                    <Eye className="size-3.5 mr-1" /> প্রকাশিত
                  </>
                ) : (
                  <>
                    <EyeOff className="size-3.5 mr-1" /> খসড়া মোড
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Titles & Slug */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="inline-title-bn" className="text-xs font-semibold">
                বাংলা শিরোনাম <span className="text-destructive">*</span>
              </Label>
              <Input
                id="inline-title-bn"
                value={form.title_bn}
                onChange={(e) => {
                  const val = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    title_bn: val,
                  }));
                }}
                placeholder="পোস্টের বাংলা শিরোনাম লিখুন..."
                className="text-sm font-serif"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inline-title-en" className="text-xs font-semibold text-muted-foreground">
                ইংরেজি শিরোনাম (ঐচ্ছিক)
              </Label>
              <Input
                id="inline-title-en"
                value={form.title_en}
                onChange={(e) => setForm((prev) => ({ ...prev, title_en: e.target.value }))}
                placeholder="English title (optional)..."
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="inline-slug" className="text-xs font-semibold">
                  পার্মালিঙ্ক / Slug (URL Path) <span className="text-destructive">*</span>
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateSlug}
                  className="h-6 px-2 text-[11px] text-primary hover:bg-primary/10 gap-1 cursor-pointer"
                >
                  <Sparkles className="size-3" /> শিরোনাম থেকে স্লাগ তৈরি
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="inline-slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                    }))
                  }
                  placeholder="post-slug-in-english"
                  className="text-xs font-mono"
                  required
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                ইউআরএল: <span className="font-mono text-foreground">/articles/{form.slug || "..."}</span>
              </p>
            </div>
          </div>

          {/* Category, Author, Publication DateTime */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="inline-category" className="text-xs font-semibold flex items-center gap-1.5">
                <Layers className="size-3.5 text-muted-foreground" /> ক্যাটাগরি
              </Label>
              <select
                id="inline-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="">কোনো ক্যাটাগরি নেই</option>
                {categories.data?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_bn} {c.is_restricted ? "🔒 [সংরক্ষিত]" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inline-author" className="text-xs font-semibold flex items-center gap-1.5">
                <User className="size-3.5 text-muted-foreground" /> লেখক
              </Label>
              <select
                id="inline-author"
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
              >
                <option value="">কোনো নির্দিষ্ট লেখক নেই</option>
                {authorsQuery.data?.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name_bn}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="inline-published-at" className="text-xs font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-muted-foreground" /> প্রকাশের তারিখ
                </span>
                {customPublishedAt && (
                  <button
                    type="button"
                    onClick={() => setCustomPublishedAt("")}
                    className="text-[10px] text-muted-foreground hover:text-primary cursor-pointer"
                  >
                    রিসেট
                  </button>
                )}
              </Label>
              <Input
                id="inline-published-at"
                type="datetime-local"
                value={customPublishedAt}
                onChange={(e) => setCustomPublishedAt(e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-1.5">
            <Label htmlFor="inline-cover-image" className="text-xs font-semibold flex items-center gap-1.5">
              <ImageIcon className="size-3.5 text-muted-foreground" /> কভার ছবির URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="inline-cover-image"
                type="url"
                value={form.cover_image_url}
                onChange={(e) => setForm((prev) => ({ ...prev, cover_image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="text-xs flex-1"
              />
              {form.cover_image_url && (
                <a
                  href={form.cover_image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center size-9 rounded-md border border-border bg-card text-muted-foreground hover:text-primary transition-colors"
                  title="ছবি প্রিভিউ দেখুন"
                >
                  <ExternalLink className="size-4" />
                </a>
              )}
            </div>
          </div>

          {/* Tags Selector */}
          <div className="space-y-2 rounded-xl border border-border/80 bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <TagIcon className="size-3.5 text-primary" /> পোস্টের ট্যাগসমূহ (Tags)
              </Label>
              <span className="text-[11px] text-muted-foreground">
                নির্বাচিত ট্যাগ: {selectedTags.length}টি
              </span>
            </div>

            {/* Selected Tags Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-lg border border-border/60 bg-background/80">
              {selectedTags.length === 0 ? (
                <span className="text-[11px] text-muted-foreground italic">
                  নিচের তালিকা থেকে ক্লিক করে ট্যাগ সিলেক্ট করুন অথবা নতুন ট্যাগ লিখে যোগ করুন...
                </span>
              ) : (
                selectedTags.map((t, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs py-1 px-2.5 gap-1.5 font-normal bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => toggleTagSelection(t)}
                      className="hover:text-destructive transition-colors cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>

            {/* New Tag Input */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="নতুন কোনো ট্যাগ লিখতে এখানে টাইপ করুন (যেমন: সৃষ্টিতত্ত্ব)..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddNewTag();
                  }
                }}
                className="h-8 text-xs bg-background flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddNewTag()}
                disabled={!newTagInput.trim()}
                className="h-8 text-xs gap-1 cursor-pointer bg-background"
              >
                <Plus className="size-3.5" /> যোগ করুন
              </Button>
            </div>

            {/* Existing Available Tags */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>বিদ্যমান ট্যাগ তালিকা থেকে ক্লিক করে নির্বাচন করুন:</span>
                {availableTags.length > 6 && (
                  <input
                    type="text"
                    placeholder="ট্যাগ ফিল্টার..."
                    value={tagSearchQuery}
                    onChange={(e) => setTagSearchQuery(e.target.value)}
                    className="h-6 w-28 rounded border border-border bg-background px-2 text-[10px]"
                  />
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-lg border border-border/60 bg-card/60">
                {allTagsQuery.isLoading ? (
                  <span className="text-[11px] text-muted-foreground">ট্যাগ লোড হচ্ছে...</span>
                ) : filteredAvailableTags.length === 0 ? (
                  <span className="text-[11px] text-muted-foreground">কোনো ট্যাগ পাওয়া যায়নি।</span>
                ) : (
                  filteredAvailableTags.map((tagObj: any) => {
                    const isSelected = selectedTags.some(
                      (t) => t.toLowerCase() === tagObj.name_bn.toLowerCase()
                    );
                    return (
                      <button
                        key={tagObj.id}
                        type="button"
                        onClick={() => toggleTagSelection(tagObj.name_bn)}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer inline-flex items-center gap-1 ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary font-medium shadow-2xs"
                            : "bg-background text-foreground/80 border-border hover:bg-muted/70 hover:border-border/80"
                        }`}
                      >
                        {isSelected ? (
                          <Check className="size-3 text-primary-foreground" />
                        ) : (
                          <TagIcon className="size-2.5 text-muted-foreground" />
                        )}
                        <span>{tagObj.name_bn}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <Label htmlFor="inline-excerpt-bn" className="text-xs font-semibold">
              বাংলা সারসংক্ষেপ (Excerpt)
            </Label>
            <Textarea
              id="inline-excerpt-bn"
              value={form.excerpt_bn}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt_bn: e.target.value }))}
              rows={2}
              placeholder="আর্টিকেলের ছোট একটি সারসংক্ষেপ দিন (ফাঁকা রাখলে স্বয়ংক্রিয়ভাবে মূল লেখা থেকে প্রথম অংশ নেওয়া হবে)..."
              className="text-xs"
            />
          </div>

          {/* Rich Text Editor for Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("bn")}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    activeTab === "bn"
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/70"
                  }`}
                >
                  বাংলা বিষয়বস্তু (মূল পোস্ট) *
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("en")}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    activeTab === "en"
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/70"
                  }`}
                >
                  English Content (ঐচ্ছিক)
                </button>
              </div>

              <span className="text-[11px] text-muted-foreground">
                Tiptap ভিজ্যুয়াল এডিটর ও HTML কোড মোড
              </span>
            </div>

            {activeTab === "bn" ? (
              <div className="space-y-1">
                <RichTextEditor
                  value={form.content_bn}
                  onChange={(val) => setForm((prev) => ({ ...prev, content_bn: val }))}
                  placeholder="বাংলায় আর্টিকেলের সম্পূর্ণ বিষয়বস্তু এখানে লিখুন..."
                />
              </div>
            ) : (
              <div className="space-y-1">
                <RichTextEditor
                  value={form.content_en}
                  onChange={(val) => setForm((prev) => ({ ...prev, content_en: val }))}
                  placeholder="Write full article content in English (optional)..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer / Action Bar */}
        <div className="p-4 border-t border-border/60 bg-muted/30 shrink-0 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={saveMutation.isPending}
              className="cursor-pointer text-xs"
            >
              বাতিল
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
              size="sm"
              className={`text-white text-xs font-semibold shadow-md transition-all cursor-pointer ${
                published
                  ? "bg-[#2271b1] hover:bg-[#135e96]"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {saveMutation.isPending ? (
                <span>সংরক্ষণ হচ্ছে...</span>
              ) : published ? (
                <>
                  <Save className="size-3.5 mr-1.5" />
                  আপডেট ও প্রকাশ করুন
                </>
              ) : (
                <>
                  <Save className="size-3.5 mr-1.5" />
                  খসড়া হিসেবে সংরক্ষণ করুন
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
