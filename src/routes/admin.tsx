import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  UserCheck,
  Shield,
  UserX,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  LayoutGrid,
  Copy,
  Check,
  FileText,
  Languages,
  Users,
  FolderTree,
  Menu as MenuIcon,
  Globe,
  Share2,
  KeyRound,
  Mail,
  RefreshCw,
  ExternalLink,
  LogOut,
  User as UserIcon,
  ChevronRight,
  Code2,
  Eye,
  Save,
  Download,
  Upload,
  FileCode,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  CheckSquare,
  Square,
  RotateCcw,
  SlidersHorizontal,
  Sliders,
  Lock,
  Tag as TagIcon,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

import { bnToEnSlug } from "@/lib/slugHelper";
import { formatArticleContent } from "@/lib/contentFormatter";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/lib/auth";
import { useCategories } from "@/lib/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { OfflineSyncAdmin } from "@/components/OfflineSyncAdmin";
import { AuthorsAdmin } from "@/components/AuthorsAdmin";
import { CategoriesAdmin } from "@/components/CategoriesAdmin";
import { TagsAdmin } from "@/components/TagsAdmin";
import { MenuAdmin } from "@/components/MenuAdmin";
import { PagesAdmin } from "@/components/PagesAdmin";
import { SocialLinksAdmin } from "@/components/SocialLinksAdmin";
import { TurnstileAdmin } from "@/components/TurnstileAdmin";
import { MessagesAdmin } from "@/components/MessagesAdmin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "অ্যাডমিন ড্যাশবোর্ড — কুরআন অন্বেষা" },
      { name: "description", content: "আর্টিকেল ও কনটেন্ট ব্যবস্থাপনা প্যানেল।" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

/* ========================================================================== */
/* ADVANCED IMPORT MODAL WITH AUTO-CREATE AUTHORS & CATEGORIES                */
/* ========================================================================== */
function InlineImportModal({
  type,
  onClose,
}: {
  type: "wordpress" | "blogger";
  onClose: () => void;
}) {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const categories = useCategories();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [importOptions, setImportOptions] = useState({
    keepPermalink: true,
    keepAuthor: true,
    keepCategory: true,
    keepTags: true,
    keepCoverImage: true,
    keepDateAndStatus: true,
  });

  const [fallbackAuthorId, setFallbackAuthorId] = useState<string>("");
  const [fallbackCategoryId, setFallbackCategoryId] = useState<string>("");

  const authors = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("authors").select("id, name_bn, name_en").order("name_bn");
      if (error) return [];
      return data || [];
    },
  });

  const generateSlug = (title: string, fallback: string) => {
    return bnToEnSlug(title, fallback);
  };

  const extractFirstImage = (htmlContent: string) => {
    const match = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/i);
    return match ? match[1] : null;
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("অনুগ্রহ করে একটি XML ফাইল নির্বাচন করুন");
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const text = await file.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");

      const parseError = xmlDoc.querySelector("parsererror");
      if (parseError) throw new Error("XML ফাইলটি সঠিক নয় বা ক্ষতিগ্রস্থ।");

      const dbAuthors = authors.data || [];
      const dbCategories = categories.data || [];

      // ১. ক্যাটাগরি ও লেখক সংগ্রহ
      const detectedCategories = new Set<string>();
      const detectedAuthors = new Set<string>();

      if (type === "wordpress") {
        xmlDoc.querySelectorAll("item").forEach((item) => {
          item.querySelectorAll('category[domain="category"]').forEach((el) => {
            const val = el.textContent?.trim();
            if (val && val !== "Uncategorized") detectedCategories.add(val);
          });
          const creator = item.getElementsByTagNameNS("*", "creator")[0]?.textContent?.trim();
          if (creator) detectedAuthors.add(creator);
        });
      } else if (type === "blogger") {
        xmlDoc.querySelectorAll("entry").forEach((entry) => {
          entry.querySelectorAll('category[scheme="http://www.blogger.com/atom/ns#"]').forEach((el) => {
            const term = el.getAttribute("term");
            if (term && !term.includes("#")) detectedCategories.add(term.trim());
          });
          const aName = entry.querySelector("author > name")?.textContent?.trim();
          if (aName) detectedAuthors.add(aName);
        });
      }

      // ২. ক্যাটাগরি ম্যাপিং ও অটো-ইনসার্ট
      const categoryMap = new Map<string, string>();
      dbCategories.forEach((c) => {
        categoryMap.set(c.name_bn.toLowerCase(), c.id);
        if (c.name_en) categoryMap.set(c.name_en.toLowerCase(), c.id);
      });

      if (importOptions.keepCategory && detectedCategories.size > 0) {
        for (const catName of detectedCategories) {
          if (!categoryMap.has(catName.toLowerCase())) {
            const catSlug = generateSlug(catName, "cat");
            const { data: newCat } = await supabase
              .from("categories")
              .insert({
                name_bn: catName,
                name_en: catName,
                slug: catSlug,
                show_in_menu: false,
                sort_order: 10,
              })
              .select("id, name_bn")
              .maybeSingle();

            if (newCat) {
              categoryMap.set(newCat.name_bn.toLowerCase(), newCat.id);
            }
          }
        }
      }

      // ৩. লেখক ম্যাপিং ও অটো-ইনসার্ট
      const authorMap = new Map<string, string>();
      dbAuthors.forEach((a) => {
        authorMap.set(a.name_bn.toLowerCase(), a.id);
        if (a.name_en) authorMap.set(a.name_en.toLowerCase(), a.id);
      });

      if (importOptions.keepAuthor && detectedAuthors.size > 0) {
        for (const authName of detectedAuthors) {
          if (!authorMap.has(authName.toLowerCase())) {
            const { data: newAuth } = await supabase
              .from("authors")
              .insert({
                name_bn: authName,
                name_en: authName,
                bio_bn: "লেখক ও গবেষক",
                bio_en: "Author & Contributor",
              })
              .select("id, name_bn")
              .maybeSingle();

            if (newAuth) {
              authorMap.set(newAuth.name_bn.toLowerCase(), newAuth.id);
            }
          }
        }
      }

      // ৪. আর্টিকেল প্রসেস ও ইনসার্ট
      const articlesToInsert: any[] = [];

      if (type === "wordpress") {
        const items = xmlDoc.querySelectorAll("item");
        items.forEach((item, index) => {
          const postType = item.querySelector("post_type")?.textContent || "post";
          const status = item.querySelector("status")?.textContent || "publish";

          if (postType === "post" || postType === "") {
            const title = item.querySelector("title")?.textContent || "শিরোনামহীন পোস্ট";
            const content =
              item.getElementsByTagNameNS("*", "encoded")[0]?.textContent ||
              item.querySelector("content")?.textContent ||
              "";
            const postDate = item.querySelector("post_date")?.textContent || new Date().toISOString();
            const postName = item.querySelector("post_name")?.textContent;
            const creator = item.getElementsByTagNameNS("*", "creator")[0]?.textContent?.trim() || "";

            const categoryElements = item.querySelectorAll('category[domain="category"]');
            const tagElements = item.querySelectorAll('category[domain="post_tag"]');

            const rawCategory = categoryElements.length > 0 ? categoryElements[0].textContent?.trim() : "";
            const rawTags: string[] = [];
            tagElements.forEach((t) => {
              if (t.textContent) rawTags.push(t.textContent.trim());
            });

            let resolvedAuthorId = fallbackAuthorId || null;
            if (importOptions.keepAuthor && creator && authorMap.has(creator.toLowerCase())) {
              resolvedAuthorId = authorMap.get(creator.toLowerCase()) || null;
            }

            let resolvedCategoryId = fallbackCategoryId || null;
            if (importOptions.keepCategory && rawCategory && categoryMap.has(rawCategory.toLowerCase())) {
              resolvedCategoryId = categoryMap.get(rawCategory.toLowerCase()) || null;
            }

            const cleanExcerpt = content.replace(/<[^>]*>?/gm, "").slice(0, 160);

            articlesToInsert.push({
              title_bn: title,
              title_en: title,
              slug: importOptions.keepPermalink && postName ? postName : generateSlug(title, String(index)),
              content_bn: content,
              content_en: content,
              excerpt_bn: cleanExcerpt.trim(),
              excerpt_en: cleanExcerpt.trim(),
              cover_image_url: importOptions.keepCoverImage ? extractFirstImage(content) : null,
              author_id: resolvedAuthorId,
              category_id: resolvedCategoryId,
              tags: importOptions.keepTags ? rawTags : [],
              published: importOptions.keepDateAndStatus ? status === "publish" : true,
              published_at: importOptions.keepDateAndStatus ? new Date(postDate).toISOString() : new Date().toISOString(),
              created_by: user!.id,
              deleted_at: null,
            });
          }
        });
      } else if (type === "blogger") {
        const entries = xmlDoc.querySelectorAll("entry");
        entries.forEach((entry, index) => {
          const idText = entry.querySelector("id")?.textContent || "";
          if (idText.includes(".post-") || entry.querySelector('category[term*="#post"]')) {
            const title = entry.querySelector("title")?.textContent || "শিরোনামহীন পোস্ট";
            const content = entry.querySelector("content")?.textContent || "";
            const publishedAt = entry.querySelector("published")?.textContent || new Date().toISOString();
            const authorName = entry.querySelector("author > name")?.textContent?.trim() || "";
            const draftElement = entry.querySelector("app\\:control > app\\:draft, draft");
            const isDraft = draftElement?.textContent === "yes";

            const categoryElements = entry.querySelectorAll('category[scheme="http://www.blogger.com/atom/ns#"]');
            const rawTags: string[] = [];
            categoryElements.forEach((cat) => {
              const term = cat.getAttribute("term");
              if (term && !term.includes("#")) rawTags.push(term.trim());
            });

            let resolvedCategoryId = fallbackCategoryId || null;
            if (importOptions.keepCategory && rawTags.length > 0) {
              const firstLabel = rawTags[0];
              if (categoryMap.has(firstLabel.toLowerCase())) {
                resolvedCategoryId = categoryMap.get(firstLabel.toLowerCase()) || null;
              }
            }

            let resolvedAuthorId = fallbackAuthorId || null;
            if (importOptions.keepAuthor && authorName && authorMap.has(authorName.toLowerCase())) {
              resolvedAuthorId = authorMap.get(authorName.toLowerCase()) || null;
            }

            const cleanExcerpt = content.replace(/<[^>]*>?/gm, "").slice(0, 160);

            articlesToInsert.push({
              title_bn: title,
              title_en: title,
              slug: generateSlug(title, String(index)),
              content_bn: content,
              content_en: content,
              excerpt_bn: cleanExcerpt.trim(),
              excerpt_en: cleanExcerpt.trim(),
              cover_image_url: importOptions.keepCoverImage ? extractFirstImage(content) : null,
              author_id: resolvedAuthorId,
              category_id: resolvedCategoryId,
              tags: importOptions.keepTags ? rawTags : [],
              published: importOptions.keepDateAndStatus ? !isDraft : true,
              published_at: importOptions.keepDateAndStatus ? new Date(publishedAt).toISOString() : new Date().toISOString(),
              created_by: user!.id,
              deleted_at: null,
            });
          }
        });
      }

      if (articlesToInsert.length === 0) throw new Error("ফাইলটিতে কোনো পোস্ট পাওয়া যায়নি।");

      const { error } = await supabase.from("articles").insert(articlesToInsert);
      if (error) throw error;

      setImportedCount(articlesToInsert.length);
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["categories-all"] });
      queryClient.invalidateQueries({ queryKey: ["categories-list"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      queryClient.invalidateQueries({ queryKey: ["authors-all"] });
      queryClient.invalidateQueries({ queryKey: ["authors-directory-list"] });
      toast.success(`${articlesToInsert.length}টি পোস্ট, লেখক ও ক্যাটাগরি সফলভাবে ইমপোর্ট হয়েছে!`);
    } catch (err: any) {
      setErrorMsg(err.message || "ইমপোর্ট করার সময় সমস্যা হয়েছে");
      toast.error(err.message || "ইমপোর্ট ব্যর্থ হয়েছে");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="size-5 text-[#2271b1]" />
            <h3 className="font-bold text-sm text-foreground">
              {type === "wordpress" ? "ওয়ার্ডপ্রেস (WordPress) থেকে পোস্ট ইমপোর্ট" : "ব্লগার (Blogger) থেকে পোস্ট ইমপোর্ট"}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted cursor-pointer">
            <X className="size-4" />
          </button>
        </div>

        {importedCount !== null ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
            <p className="font-semibold text-sm text-foreground">
              {importedCount} টি পোস্ট সফলভাবে ইমপোর্ট করা হয়েছে!
            </p>
            <Button onClick={onClose} className="bg-[#2271b1] text-white text-xs cursor-pointer">
              ঠিক আছে
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-dashed border-border p-5 text-center bg-muted/20">
              <Upload className="mx-auto size-7 text-muted-foreground/60 mb-2" />
              <label htmlFor="xml-upload-modal" className="cursor-pointer block text-xs font-semibold text-[#2271b1] hover:underline">
                XML ফাইল সিলেক্ট করুন
              </label>
              <input
                id="xml-upload-modal"
                type="file"
                accept=".xml"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                {file ? file.name : type === "wordpress" ? "WordPress Export .xml ফাইল" : "Blogger Backup .xml ফাইল"}
              </p>
            </div>

            <div className="rounded-lg border border-border/70 bg-muted/10 p-4 space-y-3 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-foreground border-b border-border/40 pb-1.5">
                <SlidersHorizontal className="size-3.5 text-[#2271b1]" />
                <span>ইমপোর্ট সেটিংস ও ফিল্ড নির্বাচন:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importOptions.keepPermalink}
                    onChange={(e) => setImportOptions({ ...importOptions, keepPermalink: e.target.checked })}
                    className="rounded accent-[#2271b1] size-3.5"
                  />
                  <span>আসল পার্মালিঙ্ক / স্লাগ রাখুন</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importOptions.keepAuthor}
                    onChange={(e) => setImportOptions({ ...importOptions, keepAuthor: e.target.checked })}
                    className="rounded accent-[#2271b1] size-3.5"
                  />
                  <span>লেখক স্বয়ংক্রিয় তৈরি ও ম্যাচ</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importOptions.keepCategory}
                    onChange={(e) => setImportOptions({ ...importOptions, keepCategory: e.target.checked })}
                    className="rounded accent-[#2271b1] size-3.5"
                  />
                  <span>ক্যাটাগরি স্বয়ংক্রিয় তৈরি ও ম্যাচ</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importOptions.keepTags}
                    onChange={(e) => setImportOptions({ ...importOptions, keepTags: e.target.checked })}
                    className="rounded accent-[#2271b1] size-3.5"
                  />
                  <span>ট্যাগসমূহ (Tags) ইমপোর্ট করুন</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importOptions.keepCoverImage}
                    onChange={(e) => setImportOptions({ ...importOptions, keepCoverImage: e.target.checked })}
                    className="rounded accent-[#2271b1] size-3.5"
                  />
                  <span>প্রথম ছবি কভার হিসেবে নিন</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={importOptions.keepDateAndStatus}
                    onChange={(e) => setImportOptions({ ...importOptions, keepDateAndStatus: e.target.checked })}
                    className="rounded accent-[#2271b1] size-3.5"
                  />
                  <span>আসল প্রকাশের তারিখ ও স্ট্যাটাস</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/40">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">ডিফল্ট লেখক (যদি না মিলে):</label>
                  <select
                    value={fallbackAuthorId}
                    onChange={(e) => setFallbackAuthorId(e.target.value)}
                    className="h-8 w-full rounded border border-border bg-background px-2 text-xs"
                  >
                    <option value="">কোনো নির্দিষ্ট লেখক নেই</option>
                    {authors.data?.map((a) => (
                      <option key={a.id} value={a.id}>{a.name_bn}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">ডিফল্ট ক্যাটাগরি (যদি না মিলে):</label>
                  <select
                    value={fallbackCategoryId}
                    onChange={(e) => setFallbackCategoryId(e.target.value)}
                    className="h-8 w-full rounded border border-border bg-background px-2 text-xs"
                  >
                    <option value="">কোনো ক্যাটাগরি নেই</option>
                    {categories.data?.map((c) => (
                      <option key={c.id} value={c.id}>{c.name_bn}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs cursor-pointer">
                বাতিল
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!file || isProcessing}
                onClick={handleImport}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-3.5 mr-1.5 animate-spin" /> ইমপোর্ট হচ্ছে...
                  </>
                ) : (
                  "ইমপোর্ট শুরু করুন"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* DUAL-MODE RICH TEXT EDITOR                                                */
/* ========================================================================== */
function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({
        html: true,
        transformPastedText: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && !isHtmlMode && editor.getHTML() !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor, isHtmlMode]);

  return (
    <div className="rounded border border-input bg-background overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-border bg-muted/40 p-1.5">
        <div className="flex flex-wrap items-center gap-1">
          {!isHtmlMode && editor ? (
            <>
              <Button
                type="button"
                variant={editor.isActive("bold") ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="বোল্ড"
              >
                <Bold className="size-4" />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("italic") ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="ইটালিক"
              >
                <Italic className="size-4" />
              </Button>
              <div className="h-4 w-px bg-border mx-1" />
              <Button
                type="button"
                variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="হেডিং ১"
              >
                <Heading1 className="size-4" />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="হেডিং ২"
              >
                <Heading2 className="size-4" />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                title="হেডিং ৩"
              >
                <Heading3 className="size-4" />
              </Button>
              <div className="h-4 w-px bg-border mx-1" />
              <Button
                type="button"
                variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="বুলেট তালিকা"
              >
                <List className="size-4" />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="সংখ্যানুক্রমিক তালিকা"
              >
                <ListOrdered className="size-4" />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="উদ্ধৃতি"
              >
                <Quote className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 px-2 text-xs font-medium cursor-pointer text-primary border-primary/30 hover:bg-primary/10"
                onClick={() => {
                  const cardTemplate = `
                    <div style="border: 1px solid rgba(16, 185, 129, 0.3); background-color: rgba(16, 185, 129, 0.05); border-radius: 12px; padding: 16px; margin: 16px 0;">
                      <p><strong>💾 ২. তথ্যের সংগ্রহ ও ব্যবহার</strong></p>
                      <ul>
                        <li><strong>ব্যক্তিগত নোট ও বুকমার্ক:</strong> আপনার সংরক্ষিত বুকমার্ক, পঠিত আয়াতের ট্র্যাকিং এবং ব্যক্তিগত তাদাব্বুর নোটসমূহ সম্পূর্ণভাবে আপনার ব্রাউজারের নিজস্ব মেমোরিতে (LocalStorage) সংরক্ষিত থাকে।</li>
                        <li><strong>অ্যাকাউন্ট তথ্য (ঐচ্ছিক):</strong> আপনি যদি প্ল্যাটফর্মে সাইন-ইন করেন, তবে কেবল আপনার ইমেইল ঠিকানা অ্যাকাউন্ট পরিচালনার জন্য সুরক্ষিত ডাটাবেজে সংরক্ষিত থাকে।</li>
                        <li><strong>যোগাযোগ ফর্ম ও বার্তা:</strong> আমাদের সাথে যোগাযোগ পেজের মাধ্যমে পাঠানো যেকোনো বার্তা কেবল প্রশ্নের উত্তর বা মতামত মূল্যায়নের কাজেই ব্যবহৃত হয়।</li>
                      </ul>
                    </div>
                    <p></p>
                  `;
                  editor.chain().focus().insertContent(cardTemplate).run();
                  toast.success("কার্ড বক্স যোগ করা হয়েছে! এবার আপনি ইচ্ছামতো টেক্সট লিখে নিন।");
                }}
                title="স্ক্রিনশটের মতো সুন্দর কার্ড বক্স যুক্ত করুন"
              >
                <LayoutGrid className="size-3.5" />
                <span>কার্ড বক্স</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1 px-2 text-xs font-medium cursor-pointer text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                onClick={() => {
                  if (!editor) return;
                  const current = editor.getHTML();
                  const formatted = formatArticleContent(current);
                  editor.commands.setContent(formatted);
                  onChange(formatted);
                  toast.success("অটো ফরম্যাট সম্পন্ন: ** এবং > চিহ্নগুলো সুন্দর বোল্ড ও কোটেশনে রূপান্তর হয়েছে!");
                }}
                title="** এবং > চিহ্নগুলো স্বয়ংক্রিয়ভাবে বোল্ড ও উদ্ধৃতি বক্সে রূপান্তর করুন"
              >
                <Sparkles className="size-3.5 text-amber-500" />
                <span>অটো ফরম্যাট ক্লিন</span>
              </Button>
              <div className="h-4 w-px bg-border mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="পূর্বাবস্থায় ফেরান"
              >
                <Undo className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="পুনরায় করুন"
              >
                <Redo className="size-4" />
              </Button>
            </>
          ) : (
            <span className="text-[11px] font-mono text-muted-foreground px-2 py-1">
              &lt;HTML Code Editor Mode&gt;
            </span>
          )}
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            const nextMode = !isHtmlMode;
            setIsHtmlMode(nextMode);
            if (!nextMode && editor) {
              editor.commands.setContent(value || "");
            }
          }}
          className={`h-7 px-2.5 text-[11px] gap-1.5 transition-all cursor-pointer ${
            isHtmlMode
              ? "bg-[#2271b1]/15 text-[#2271b1] border-[#2271b1]/40 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={isHtmlMode ? "ভিজ্যুয়াল এডিটরে ফিরুন" : "সরাসরি HTML কোড সম্পাদনা করুন"}
        >
          {isHtmlMode ? (
            <>
              <Eye className="size-3.5" />
              <span>ভিজ্যুয়াল এডিটর</span>
            </>
          ) : (
            <>
              <Code2 className="size-3.5" />
              <span>HTML কোড এডিটর</span>
            </>
          )}
        </Button>
      </div>

      {isHtmlMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<p>এখানে সরাসরি HTML কোড লিখুন বা পেস্ট করুন...</p>"
          rows={10}
          className="w-full bg-background p-4 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none leading-relaxed resize-y border-none"
        />
      ) : (
        <div className="p-4">
          <EditorContent
            editor={editor}
            className="prose prose-sm dark:prose-invert max-w-none min-h-[220px] focus:outline-none [&_.tiptap]:focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}

/* ========================================================================== */
/* MAIN ADMIN PAGE                                                            */
/* ========================================================================== */
function AdminPage() {
  const { user, loading } = useSession();
  const { isAdmin, loading: roleLoading } = useIsAdmin();
  const [activeTab, setActiveTab] = useState("articles");
  const [importModalType, setImportModalType] = useState<"wordpress" | "blogger" | null>(null);

  const menuSections = [
    {
      group: "মূল কনটেন্ট মেনু",
      items: [
        { value: "articles", label: "আর্টিকেল ও প্রবন্ধ", icon: FileText },
        { value: "import", label: "পোস্ট ইমপোর্ট (Import)", icon: Download },
        { value: "translations", label: "কুরআন আয়াত ও অনুবাদ", icon: Languages },
        { value: "posts", label: "লেখক ও গবেষকবৃন্দ", icon: Users },
        { value: "categories", label: "বিষয়ভিত্তিক ক্যাটাগরি", icon: FolderTree },
        { value: "tags", label: "ট্যাগসমূহ (Tags)", icon: TagIcon },
      ],
    },
    {
      group: "ওয়েবসাইট ও পেজ লেআউট",
      items: [
        { value: "pages", label: "স্থির পেজসমূহ (Pages)", icon: LayoutGrid },
        { value: "menu", label: "হেডার ও নেভিগেশন মেনু", icon: MenuIcon },
        { value: "messages", label: "ব্যবহারকারীর বার্তা / ফিডব্যাক", icon: Mail },
      ],
    },
    {
      group: "ইউজার এক্সেস ও সিকিউরিটি",
      items: [
        { value: "subs", label: "গ্রাহক ও ইউজার পারমিশন নিয়ন্ত্রণ", icon: SlidersHorizontal },
        { value: "roles", label: "অ্যাডমিন ও ইউজার রোল", icon: Shield },
        { value: "social", label: "সোশ্যাল মিডিয়া প্রোফাইল লিংক", icon: Share2 },
        { value: "turnstile", label: "টার্নস্টাইল সিকিউরিটি কী", icon: KeyRound },
        { value: "offline", label: "অফলাইন ডেটা সিঙ্ক ও ক্যাশ", icon: RefreshCw },
      ],
    },
  ];

  if (loading || (user && roleLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1d2327]">
        <p className="text-sm font-medium text-slate-300">ড্যাশবোর্ড লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 px-4">
        <div className="w-full max-w-sm rounded border bg-card p-6 text-center shadow-sm">
          <Shield className="mx-auto mb-3 size-10 text-muted-foreground/60" />
          <h2 className="text-lg font-semibold">অ্যাডমিন প্রবেশাধিকার সংরক্ষিত</h2>
          <p className="mt-1 text-xs text-muted-foreground">শুধুমাত্র অনুমোদিত অ্যাডমিন এই প্যানেলে প্রবেশ করতে পারবেন।</p>
          <Button asChild className="mt-5 w-full">
            <Link to="/auth">লগইন করুন</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f0f0f1] text-[#2c3338] dark:bg-[#121212] dark:text-[#f0f0f1]">
      {importModalType && (
        <InlineImportModal type={importModalType} onClose={() => setImportModalType(null)} />
      )}

      <header className="sticky top-14 sm:top-16 z-30 flex h-8 w-full items-center justify-between bg-[#1d2327] px-3 text-[#c3c4c7] select-none text-xs border-b border-[#2c3338] shadow-xs">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 font-semibold text-white hover:text-[#72aee6] transition-colors"
          >
            <Globe className="size-3.5 text-[#2271b1]" />
            <span>কুরআন অন্বেষা</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="hidden items-center gap-1 hover:text-[#72aee6] transition-colors sm:inline-flex text-[11px]"
          >
            <span>ওয়েবসাইট ভিজিট করুন</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden items-center gap-1.5 md:inline-flex">
            <UserIcon className="size-3" /> {user.email}
          </span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer"
            title="লগআউট"
          >
            <LogOut className="size-3" />
            <span>লগআউট</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-[calc(100vh-5.5rem)] sm:min-h-[calc(100vh-6rem)]">
        <aside className="w-64 shrink-0 bg-[#1d2327] text-[#c3c4c7] flex flex-col justify-between hidden md:flex border-r border-[#2c3338] sticky top-[5.5rem] sm:top-[6rem] h-[calc(100vh-5.5rem)] sm:h-[calc(100vh-6rem)] self-start">
          <div className="py-2 overflow-y-auto">
            {menuSections.map((section, idx) => (
              <div key={idx} className="mb-3">
                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8c8f94]">
                  {section.group}
                </div>
                <ul>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.value;
                    return (
                      <li key={item.value}>
                        <button
                          type="button"
                          onClick={() => setActiveTab(item.value)}
                          className={`group flex w-full items-center justify-between px-4 py-2 text-left text-xs font-medium transition-colors cursor-pointer ${
                            isActive
                              ? "bg-[#2271b1] text-white shadow-inner font-semibold"
                              : "hover:bg-[#2c3338] hover:text-[#72aee6]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`size-4 ${isActive ? "text-white" : "text-[#8c8f94] group-hover:text-[#72aee6]"}`} />
                            <span>{item.label}</span>
                          </div>
                          {isActive && <ChevronRight className="size-3.5 opacity-80" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-[#2c3338] p-3 text-[11px] text-[#8c8f94] text-center">
            ওয়ার্ডপ্রেস স্টাইল অ্যাডমিন প্যানেল
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 block md:hidden">
              <label htmlFor="mobile-admin-tab" className="block text-xs font-medium text-muted-foreground mb-1.5">
                মেনু নির্বাচন করুন:
              </label>
              <select
                id="mobile-admin-tab"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full rounded border border-border bg-card p-2.5 text-xs font-medium shadow-sm"
              >
                {menuSections.flatMap((section) =>
                  section.items.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="mb-6 flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-1">
                  <span>ড্যাশবোর্ড</span>
                  <span>/</span>
                  <span className="font-semibold text-foreground">
                    {menuSections.flatMap((s) => s.items).find((i) => i.value === activeTab)?.label || "মূল মেনু"}
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {menuSections.flatMap((s) => s.items).find((i) => i.value === activeTab)?.label || "ড্যাশবোর্ড"}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ওয়েবসাইট কনটেন্ট ও ডেটাবেজ কনফিগারেশন প্যানেল
                </p>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="articles" className="mt-0 focus-visible:outline-none">
                <ArticlesAdmin onOpenImport={(type) => setImportModalType(type)} />
              </TabsContent>
              <TabsContent value="import" className="mt-0 focus-visible:outline-none">
                <ImportTab onSelectType={(type) => setImportModalType(type)} />
              </TabsContent>
              <TabsContent value="translations" className="mt-0 focus-visible:outline-none">
                <TranslationsAdmin />
              </TabsContent>
              <TabsContent value="posts" className="mt-0 focus-visible:outline-none">
                <div className="space-y-4">
                  <div className="border-b border-border/50 pb-2">
                    <h2 className="text-base font-semibold">লেখক ও গবেষক ব্যবস্থাপনা</h2>
                    <p className="text-xs text-muted-foreground">নতুন লেখক যুক্ত করুন এবং প্রোফাইল তথ্য পরিচালনা করুন।</p>
                  </div>
                  <AuthorsAdmin />
                </div>
              </TabsContent>
              <TabsContent value="categories" className="mt-0 focus-visible:outline-none">
                <CategoriesAdmin />
              </TabsContent>
              <TabsContent value="tags" className="mt-0 focus-visible:outline-none">
                <TagsAdmin />
              </TabsContent>
              <TabsContent value="roles" className="mt-0 focus-visible:outline-none">
                <RolesAdmin />
              </TabsContent>
              <TabsContent value="menu" className="mt-0 focus-visible:outline-none">
                <MenuAdmin />
              </TabsContent>
              <TabsContent value="pages" className="mt-0 focus-visible:outline-none">
                <PagesAdmin />
              </TabsContent>
              <TabsContent value="social" className="mt-0 focus-visible:outline-none">
                <SocialLinksAdmin />
              </TabsContent>
              <TabsContent value="turnstile" className="mt-0 focus-visible:outline-none">
                <TurnstileAdmin />
              </TabsContent>
              <TabsContent value="messages" className="mt-0 focus-visible:outline-none">
                <MessagesAdmin />
              </TabsContent>
              <TabsContent value="offline" className="mt-0 focus-visible:outline-none">
                <OfflineSyncAdmin />
              </TabsContent>
              <TabsContent value="subs" className="mt-0 focus-visible:outline-none">
                <SubscribersAdmin />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* IMPORT TAB                                                                 */
/* ========================================================================== */
function ImportTab({ onSelectType }: { onSelectType: (type: "wordpress" | "blogger") => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded border border-border bg-card p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">অন্যান্য প্ল্যাটফর্ম থেকে কনটেন্ট ইমপোর্ট করুন</h2>
          <p className="text-xs text-muted-foreground mt-1">
            আপনার ওয়ার্ডপ্রেস বা ব্লগারে প্রকাশিত পোস্টের এক্সপোর্টকৃত XML ফাইল থেকে সরাসরি সব আর্টিকেল একসাথে ইমপোর্ট করুন।
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <div className="rounded-xl border border-border/80 bg-muted/20 p-5 flex flex-col justify-between space-y-4 hover:border-[#2271b1]/50 transition-all">
            <div className="space-y-2">
              <span className="inline-block rounded-md bg-[#2271b1]/10 px-2.5 py-1 text-xs font-bold text-[#2271b1]">
                WordPress (WXR XML)
              </span>
              <h3 className="text-sm font-bold text-foreground">ওয়ার্ডপ্রেস থেকে ইমপোর্ট</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tools &gt; Export থেকে ডাউনলোড করা <code>.xml</code> ফাইল আপলোড করে এক ক্লিকে সব পোস্ট ইমপোর্ট করুন।
              </p>
            </div>
            <Button
              onClick={() => onSelectType("wordpress")}
              className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white text-xs cursor-pointer"
            >
              <Upload className="size-3.5 mr-1.5" /> WordPress XML আপলোড করুন
            </Button>
          </div>

          <div className="rounded-xl border border-border/80 bg-muted/20 p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-all">
            <div className="space-y-2">
              <span className="inline-block rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                Blogger (Atom XML)
              </span>
              <h3 className="text-sm font-bold text-foreground">ব্লগার থেকে ইমপোর্ট</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Settings &gt; Back up content থেকে ডাউনলোড করা <code>.xml</code> ব্যাকআপ ফাইল দিয়ে পোস্টগুলো ইমপোর্ট করুন।
              </p>
            </div>
            <Button
              onClick={() => onSelectType("blogger")}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs cursor-pointer"
            >
              <Upload className="size-3.5 mr-1.5" /> Blogger XML আপলোড করুন
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* ARTICLES ADMIN WITH TRASH, RESTORE, TAGS & BULK SELECTION                  */
/* ========================================================================== */
const articleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "স্লাগে শুধুমাত্র ছোট হাতের ইংরেজি অক্ষর, সংখ্যা এবং ড্যাশ (-) ব্যবহার করা যাবে"),
  title_bn: z.string().trim().min(1, "বাংলা শিরোনাম বাধ্যতামূলক").max(200),
  title_en: z.string().trim().max(200),
  excerpt_bn: z.string().trim().max(500),
  excerpt_en: z.string().trim().max(500),
  content_bn: z.string().trim().max(60000),
  content_en: z.string().trim().max(60000),
  cover_image_url: z.string().trim().max(500),
});

const EMPTY = {
  slug: "",
  title_bn: "",
  title_en: "",
  excerpt_bn: "",
  excerpt_en: "",
  content_bn: "",
  content_en: "",
  cover_image_url: "",
};

function ArticlesAdmin({ onOpenImport }: { onOpenImport: (type: "wordpress" | "blogger") => void }) {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ ...EMPTY });
  const [published, setPublished] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [authorId, setAuthorId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [tagsInput, setTagsInput] = useState<string>("");

  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "trash">("all");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [bulkAuthorId, setBulkAuthorId] = useState<string>("");
  const [bulkCategoryId, setBulkCategoryId] = useState<string>("");
  const [isAutoSlugging, setIsAutoSlugging] = useState(false);

  const categories = useCategories();

  const authors = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("authors").select("id, name_bn").order("name_bn");
      if (error) throw error;
      return data;
    },
  });

  const list = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, nextStatus }: { id: string; nextStatus: boolean }) => {
      const { error } = await supabase
        .from("articles")
        .update({
          published: nextStatus,
          published_at: nextStatus ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success(variables.nextStatus ? "আর্টিকেল প্রকাশিত হয়েছে" : "আর্টিকেলটি খসড়া/ড্রাফট করা হয়েছে");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const moveToTrash = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("articles")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("আর্টিকেল ট্র্যাশ বক্সে পাঠানো হয়েছে");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const restoreFromTrash = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("articles")
        .update({ deleted_at: null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("আর্টিকেল সফলভাবে পুনরুদ্ধার (Restore) করা হয়েছে");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const permanentDelete = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("আর্টিকেল চিরতরে মুছে ফেলা হয়েছে");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const executeBulkAction = useMutation({
    mutationFn: async () => {
      if (selectedIds.length === 0) throw new Error("অনুগ্রহ করে অন্তত একটি পোস্ট নির্বাচন করুন");
      if (!bulkAction) throw new Error("বাল্ক অ্যাকশন নির্বাচন করুন");

      if (bulkAction === "trash") {
        const { error } = await supabase
          .from("articles")
          .update({ deleted_at: new Date().toISOString() })
          .in("id", selectedIds);
        if (error) throw error;
      } else if (bulkAction === "restore") {
        const { error } = await supabase
          .from("articles")
          .update({ deleted_at: null })
          .in("id", selectedIds);
        if (error) throw error;
      } else if (bulkAction === "permanent-delete") {
        const { error } = await supabase.from("articles").delete().in("id", selectedIds);
        if (error) throw error;
      } else if (bulkAction === "publish") {
        const { error } = await supabase
          .from("articles")
          .update({ published: true, published_at: new Date().toISOString() })
          .in("id", selectedIds);
        if (error) throw error;
      } else if (bulkAction === "draft") {
        const { error } = await supabase
          .from("articles")
          .update({ published: false, published_at: null })
          .in("id", selectedIds);
        if (error) throw error;
      } else if (bulkAction === "change-author") {
        const { error } = await supabase
          .from("articles")
          .update({ author_id: bulkAuthorId || null })
          .in("id", selectedIds);
        if (error) throw error;
      } else if (bulkAction === "change-category") {
        const { error } = await supabase
          .from("articles")
          .update({ category_id: bulkCategoryId || null })
          .in("id", selectedIds);
        if (error) throw error;
      } else if (bulkAction === "auto-slug") {
        const targetArticles = (list.data || []).filter((a) => selectedIds.includes(a.id));
        for (const art of targetArticles) {
          if (!art.title_bn) continue;
          const properSlug = bnToEnSlug(art.title_bn, String(art.id).slice(0, 6));
          const { error } = await supabase
            .from("articles")
            .update({ slug: properSlug })
            .eq("id", art.id);
          if (error) console.error("Auto slug update error:", art.id, error);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      setSelectedIds([]);
      setBulkAction("");
      setBulkAuthorId("");
      setBulkCategoryId("");
      toast.success("বাল্ক অ্যাকশন সফলভাবে সম্পন্ন হয়েছে!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleBulkAutoSlugGenerate = async () => {
    if (!list.data || list.data.length === 0) {
      toast.error("কোনো পোস্ট পাওয়া যায়নি");
      return;
    }
    if (
      !confirm(
        "আপনি কি সমস্ত পোস্টের পার্মালিঙ্ক (Slug) বাংলা শিরোনাম অনুযায়ী স্বয়ংক্রিয়ভাবে ইংরেজি ফোনেটিকে (যেমন: 'duibar-mrityu-ebong-duibar-jibon') রূপান্তর করতে চান?"
      )
    ) {
      return;
    }

    setIsAutoSlugging(true);
    let updated = 0;
    try {
      for (const art of list.data) {
        if (!art.title_bn) continue;
        const properSlug = bnToEnSlug(art.title_bn, String(art.id).slice(0, 6));
        if (art.slug !== properSlug) {
          const { error } = await supabase
            .from("articles")
            .update({ slug: properSlug })
            .eq("id", art.id);
          if (!error) updated++;
        }
      }
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success(`সফলভাবে ${updated}টি পোস্টের পার্মালিঙ্ক বাংলা শিরোনাম অনুযায়ী আপডেট করা হয়েছে!`);
    } catch (err: any) {
      toast.error(`ইরোর: ${err?.message || "স্লাগ আপডেট ব্যর্থ হয়েছে"}`);
    } finally {
      setIsAutoSlugging(false);
    }
  };

  const save = useMutation({
    mutationFn: async () => {
      const parsed = articleSchema.safeParse(form);
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "সঠিক তথ্য প্রদান করুন");

      const autoExcerptBn = parsed.data.excerpt_bn
        ? parsed.data.excerpt_bn
        : parsed.data.content_bn.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").slice(0, 160).trim();

      const autoExcerptEn = parsed.data.excerpt_en
        ? parsed.data.excerpt_en
        : parsed.data.content_en ? parsed.data.content_en.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").slice(0, 160).trim() : null;

      // কমা দিয়ে আলাদা করা ট্যাগ অ্যারে রূপান্তর
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        ...parsed.data,
        title_en: parsed.data.title_en || null,
        excerpt_bn: autoExcerptBn || null,
        excerpt_en: autoExcerptEn || null,
        content_bn: parsed.data.content_bn ? formatArticleContent(parsed.data.content_bn) : null,
        content_en: parsed.data.content_en ? formatArticleContent(parsed.data.content_en) : null,
        cover_image_url: parsed.data.cover_image_url || null,
        published,
        author_id: authorId || null,
        category_id: categoryId || null,
        tags: parsedTags,
        published_at: published ? new Date().toISOString() : null,
        created_by: user!.id,
        deleted_at: null,
      };

      if (editingId) {
        const { error } = await supabase.from("articles").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("articles").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      setForm({ ...EMPTY });
      setEditingId(null);
      setAuthorId("");
      setCategoryId("");
      setTagsInput("");
      setPublished(true);
      toast.success(published ? "আর্টিকেল সফলভাবে প্রকাশিত হয়েছে" : "আর্টিকেল সফলভাবে খসড়া (Draft) হিসেবে সংরক্ষিত হয়েছে");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const allList = list.data || [];
  const activeArticles = allList.filter((a) => !a.deleted_at);
  const trashArticles = allList.filter((a) => a.deleted_at);

  const filteredArticles = (statusFilter === "trash"
    ? trashArticles
    : activeArticles.filter((a) => {
        if (statusFilter === "published") return a.published;
        if (statusFilter === "draft") return !a.published;
        return true;
      })) || [];

  const publishedCount = activeArticles.filter((a) => a.published).length;
  const draftCount = activeArticles.filter((a) => !a.published).length;
  const trashCount = trashArticles.length;

  const isAllSelected = filteredArticles.length > 0 && selectedIds.length === filteredArticles.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArticles.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const field = (key: keyof typeof EMPTY, label: string, long = false) => (
    <div className="space-y-1.5">
      <Label htmlFor={key} className="text-xs font-semibold">{label}</Label>
      {long ? (
        key.startsWith("content") ? (
          <RichTextEditor
            value={form[key]}
            onChange={(val) => setForm((prev) => ({ ...prev, [key]: val }))}
          />
        ) : (
          <Textarea
            id={key}
            rows={3}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            className="text-xs"
          />
        )
      ) : (
        <Input
          id={key}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="h-9 text-xs"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <form
        className="rounded border border-border bg-card p-5 shadow-sm space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div>
            <h2 className="font-semibold text-base">
              {editingId ? "আর্টিকেল সম্পাদনা করুন" : "নতুন আর্টিকেল লিখুন"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Download className="size-3.5 text-[#2271b1]" /> কুইক ইমপোর্ট:
              </span>
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value === "wordpress" || e.target.value === "blogger") {
                    onOpenImport(e.target.value);
                  }
                }}
                className="h-8 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none cursor-pointer"
              >
                <option value="">নির্বাচন করুন...</option>
                <option value="wordpress">ওয়ার্ডপ্রেস / WordPress (.xml)</option>
                <option value="blogger">ব্লগার / Blogger (.xml)</option>
              </select>
            </div>

            <div className="h-4 w-px bg-border mx-1" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">স্ট্যাটাস:</span>
              <select
                value={published ? "published" : "draft"}
                onChange={(e) => setPublished(e.target.value === "published")}
                className={`h-8 rounded-md border px-2.5 text-xs font-semibold transition-colors focus:outline-none cursor-pointer ${
                  published 
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                    : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                <option value="published" className="bg-card text-foreground">🟢 প্রকাশিত (Published)</option>
                <option value="draft" className="bg-card text-foreground">🟡 খসড়া (Draft)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="article-slug" className="text-xs font-semibold">স্লাগ (URL Permalink Slug)</Label>
            <button
              type="button"
              onClick={() => {
                if (form.title_bn) {
                  const autoSlug = bnToEnSlug(form.title_bn);
                  setForm((prev) => ({ ...prev, slug: autoSlug }));
                  toast.success(`স্লাগ তৈরি হয়েছে: ${autoSlug}`);
                } else {
                  toast.error("অনুগ্রহ করে আগে বাংলা শিরোনাম লিখুন");
                }
              }}
              className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="size-3 text-primary" /> শিরোনাম থেকে অটো স্লাগ তৈরি করুন
            </button>
          </div>
          <Input
            id="article-slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
            placeholder="যেমন: duibar-mrityu-ebong-duibar-jibon"
            className="h-9 text-xs font-mono"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="title_bn" className="text-xs font-semibold">শিরোনাম (বাংলা)</Label>
            <Input
              id="title_bn"
              value={form.title_bn}
              onChange={(e) => {
                const val = e.target.value;
                setForm((prev) => {
                  const shouldAutoSlug = !editingId && (!prev.slug || prev.slug.startsWith("post-") || prev.slug === bnToEnSlug(prev.title_bn));
                  return {
                    ...prev,
                    title_bn: val,
                    slug: shouldAutoSlug && val ? bnToEnSlug(val) : prev.slug,
                  };
                });
              }}
              className="h-9 text-xs"
            />
          </div>
          {field("title_en", "শিরোনাম (English)")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("excerpt_bn", "সংক্ষিপ্ত বিবরণ (বাংলা)", true)}
          {field("excerpt_en", "সংক্ষিপ্ত বিবরণ (English)", true)}
        </div>
        {field("content_bn", "মূল বিষয়বস্তু (বাংলা)", true)}
        {field("content_en", "মূল বিষয়বস্তু (English)", true)}
        {field("cover_image_url", "কভার ইমেজ লিংক (Cover Image URL)")}

        {/* ট্যাগ ইনপুট ফিল্ড */}
        <div className="space-y-1.5">
          <Label htmlFor="article-tags" className="text-xs font-semibold">
            ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)
          </Label>
          <Input
            id="article-tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="যেমন: বিজ্ঞান, কুরআন, মহাবিশ্ব, তাদাব্বুর"
            className="h-9 text-xs"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="author" className="text-xs font-semibold">লেখক নির্বাচন</Label>
            <select
              id="author"
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="h-9 w-full rounded border border-input bg-background px-3 text-xs"
            >
              <option value="">কোনো নির্দিষ্ট লেখক নেই</option>
              {authors.data?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name_bn}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="article-category" className="text-xs font-semibold">ক্যাটাগরি নির্বাচন</Label>
            <select
              id="article-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-9 w-full rounded border border-input bg-background px-3 text-xs"
            >
              <option value="">কোনো ক্যাটাগরি নেই</option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_bn}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="post-status" className="text-xs font-semibold">পোস্ট দৃশ্যমানতা / স্ট্যাটাস</Label>
            <select
              id="post-status"
              value={published ? "published" : "draft"}
              onChange={(e) => setPublished(e.target.value === "published")}
              className="h-9 w-full rounded border border-input bg-background px-3 text-xs"
            >
              <option value="published">🟢 প্রকাশিত (Published)</option>
              <option value="draft">🟡 খসড়া (Draft)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button 
            type="submit" 
            disabled={save.isPending} 
            size="sm" 
            className={`text-white transition-all cursor-pointer ${
              published
                ? "bg-[#2271b1] hover:bg-[#135e96]"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {published ? (
              <>
                <Plus className="size-3.5 mr-1" />
                {editingId ? "আপডেট ও প্রকাশ করুন" : "প্রকাশ করুন (Publish)"}
              </>
            ) : (
              <>
                <Save className="size-3.5 mr-1" />
                {editingId ? "খসড়া আপডেট করুন" : "খসড়া সংরক্ষণ করুন (Save Draft)"}
              </>
            )}
          </Button>

          {editingId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                setEditingId(null);
                setForm({ ...EMPTY });
                setPublished(true);
                setAuthorId("");
                setCategoryId("");
                setTagsInput("");
              }}
            >
              বাতিল
            </Button>
          )}
        </div>
      </form>

      {/* আর্টিকেল তালিকা ও ট্র্যাশ ফিল্টার বার */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">আর্টিকেল তালিকা</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBulkAutoSlugGenerate}
              disabled={isAutoSlugging}
              className="h-7 gap-1.5 px-2.5 text-xs font-medium text-primary border-primary/30 hover:bg-primary/10 cursor-pointer shadow-xs"
              title="সব পোস্টের স্লাগ বাংলা শিরোনাম অনুযায়ী স্বয়ংক্রিয়ভাবে ফোনেটিক ইংরেজিতে রূপান্তর করুন"
            >
              <Sparkles className="size-3.5 text-primary" />
              {isAutoSlugging ? "স্লাগ আপডেট হচ্ছে..." : "শিরোনাম অনুযায়ী সব স্লাগ অটো ফিক্স করুন"}
            </Button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setSelectedIds([]);
              }}
              className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                statusFilter === "all"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              সব ({activeArticles.length})
            </button>
            <span className="text-border">|</span>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("published");
                setSelectedIds([]);
              }}
              className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                statusFilter === "published"
                  ? "bg-emerald-600 text-white font-semibold"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              প্রকাশিত ({publishedCount})
            </button>
            <span className="text-border">|</span>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("draft");
                setSelectedIds([]);
              }}
              className={`rounded px-2.5 py-1 transition-colors cursor-pointer ${
                statusFilter === "draft"
                  ? "bg-amber-600 text-white font-semibold"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              খসড়া / Drafts ({draftCount})
            </button>
            <span className="text-border">|</span>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("trash");
                setSelectedIds([]);
              }}
              className={`rounded px-2.5 py-1 transition-colors cursor-pointer flex items-center gap-1 ${
                statusFilter === "trash"
                  ? "bg-destructive text-white font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-destructive"
              }`}
            >
              <Trash2 className="size-3" />
              <span>মুছে ফেলা / Trash ({trashCount})</span>
            </button>
          </div>
        </div>

        {/* বাল্ক অ্যাকশন কন্ট্রোল বার */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-2.5 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            >
              {isAllSelected ? (
                <CheckSquare className="size-4 text-[#2271b1]" />
              ) : (
                <Square className="size-4 text-muted-foreground" />
              )}
              <span>সব সিলেক্ট করুন ({selectedIds.length}/{filteredArticles.length})</span>
            </button>

            <div className="h-4 w-px bg-border mx-1" />

            {statusFilter === "trash" ? (
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="h-8 rounded border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value="">বাল্ক অ্যাকশন নির্বাচন করুন...</option>
                <option value="restore">🔄 একসাথে ফিরিয়ে আনুন (Restore)</option>
                <option value="permanent-delete">🗑️ চিরতরে মুছে ফেলুন (Delete Permanently)</option>
              </select>
            ) : (
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="h-8 rounded border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none cursor-pointer"
              >
                <option value="">বাল্ক অ্যাকশন নির্বাচন করুন...</option>
                <option value="auto-slug">✨ একসাথে স্লাগ/পার্মালিঙ্ক অটো জেনারেট করুন</option>
                <option value="publish">🟢 একসাথে প্রকাশিত করুন</option>
                <option value="draft">🟡 একসাথে খসড়া (Draft) করুন</option>
                <option value="change-author">👤 একসাথে লেখক পরিবর্তন করুন</option>
                <option value="change-category">📁 একসাথে ক্যাটাগরি পরিবর্তন করুন</option>
                <option value="trash">🗑️ ট্র্যাশে পাঠান (Move to Trash)</option>
              </select>
            )}

            {bulkAction === "change-author" && (
              <select
                value={bulkAuthorId}
                onChange={(e) => setBulkAuthorId(e.target.value)}
                className="h-8 rounded border border-border bg-background px-2 text-xs"
              >
                <option value="">লেখক বাছাই করুন</option>
                {authors.data?.map((a) => (
                  <option key={a.id} value={a.id}>{a.name_bn}</option>
                ))}
              </select>
            )}

            {bulkAction === "change-category" && (
              <select
                value={bulkCategoryId}
                onChange={(e) => setBulkCategoryId(e.target.value)}
                className="h-8 rounded border border-border bg-background px-2 text-xs"
              >
                <option value="">ক্যাটাগরি বাছাই করুন</option>
                {categories.data?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name_bn}</option>
                ))}
              </select>
            )}

            <Button
              type="button"
              size="sm"
              disabled={selectedIds.length === 0 || !bulkAction || executeBulkAction.isPending}
              onClick={() => executeBulkAction.mutate()}
              className="h-8 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs px-3 cursor-pointer"
            >
              {executeBulkAction.isPending ? "প্রয়োগ হচ্ছে..." : "প্রয়োগ করুন (Apply)"}
            </Button>
          </div>
        </div>

        <div className="divide-y divide-border rounded border border-border bg-card shadow-sm">
          {filteredArticles.length === 0 ? (
            <p className="p-4 text-xs text-muted-foreground text-center">
              {statusFilter === "trash" ? "ট্র্যাশ বক্সে কোনো আর্টিকেল নেই।" : "কোনো আর্টিকেল পাওয়া যায়নি।"}
            </p>
          ) : (
            filteredArticles.map((a) => {
              const isChecked = selectedIds.includes(a.id);

              return (
                <div key={a.id} className="flex items-center gap-3 p-3.5 hover:bg-muted/30 transition-colors">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleSelectOne(a.id)}
                    className="size-4 rounded border-border accent-[#2271b1] cursor-pointer"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">{a.title_bn}</p>
                    <p className="text-[11px] text-muted-foreground">
                      /{a.slug} ·{" "}
                      {a.deleted_at ? (
                        <span className="text-destructive font-medium">মুছে ফেলা হয়েছে (In Trash)</span>
                      ) : (
                        <span className={a.published ? "text-emerald-600 font-medium" : "text-amber-600 font-semibold"}>
                          {a.published ? "প্রকাশিত" : "খসড়া (Draft)"}
                        </span>
                      )}
                    </p>
                  </div>

                  {statusFilter !== "trash" && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground hidden sm:inline">
                        {a.published ? "Live" : "Draft"}
                      </span>
                      <Switch
                        checked={a.published}
                        onCheckedChange={(checked) =>
                          togglePublish.mutate({ id: a.id, nextStatus: checked })
                        }
                        title={a.published ? "ক্লিক করে খসড়া/ড্রাফট করুন" : "ক্লিক করে প্রকাশ করুন"}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-1 ml-2 border-l border-border/60 pl-2">
                    {statusFilter === "trash" ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-emerald-600 hover:bg-emerald-500/10 cursor-pointer"
                          aria-label="পুনরুদ্ধার করুন"
                          title="পুনরুদ্ধার করুন (Restore)"
                          onClick={() => restoreFromTrash.mutate(a.id)}
                        >
                          <RotateCcw className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                          aria-label="চিরতরে মুছে ফেলুন"
                          title="চিরতরে মুছে ফেলুন"
                          onClick={() => permanentDelete.mutate(a.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 cursor-pointer"
                          aria-label="সম্পাদনা"
                          onClick={() => {
                            setEditingId(a.id);
                            setPublished(a.published);
                            setAuthorId(a.author_id ?? "");
                            setCategoryId(a.category_id ?? "");
                            setTagsInput(Array.isArray(a.tags) ? a.tags.join(", ") : "");
                            setForm({
                              slug: a.slug,
                              title_bn: a.title_bn,
                              title_en: a.title_en ?? "",
                              excerpt_bn: a.excerpt_bn ?? "",
                              excerpt_en: a.excerpt_en ?? "",
                              content_bn: a.content_bn ?? "",
                              content_en: a.content_en ?? "",
                              cover_image_url: a.cover_image_url ?? "",
                            });
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                          aria-label="ট্র্যাশে পাঠান"
                          title="ট্র্যাশে পাঠান"
                          onClick={() => moveToTrash.mutate(a.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function TranslationsAdmin() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [surah, setSurah] = useState("1");
  const [ayah, setAyah] = useState("1");
  const [lng, setLng] = useState<"bn" | "en" | "bn_std" | "en_std">("bn");
  const [metaBn, setMetaBn] = useState("");
  const [metaEn, setMetaEn] = useState("");
  const [text, setText] = useState("");
  const [note, setNote] = useState("");

  // Load existing metadata whenever surah or ayah changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`quran_ayah_meta_${surah}_${ayah}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMetaBn(parsed.meta_bn || "");
        setMetaEn(parsed.meta_en || "");
        return;
      }
    } catch {}

    fetch(`/data/quran/surahs/${surah}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const a = d?.ayahs?.find((x: any) => String(x.ayah) === String(ayah));
        if (a) {
          setMetaBn(a.meta_bn || "");
          setMetaEn(a.meta_en || "");
        } else {
          setMetaBn("");
          setMetaEn("");
        }
      })
      .catch(() => {});
  }, [surah, ayah]);

  const list = useQuery({
    queryKey: ["admin-verse-translations", surah],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verse_translations")
        .select("*")
        .eq("surah", Number(surah) || 1)
        .order("ayah");
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const sNum = Number(surah);
      const aNum = Number(ayah);
      if (!sNum || sNum < 1 || sNum > 114) throw new Error("সঠিক সূরা নম্বর দিন (১-১১৪)");
      if (!aNum || aNum < 1 || aNum > 300) throw new Error("সঠিক আয়াত নম্বর দিন");

      let metaSaved = false;

      // ১. মেটা ডাটা লোকাল ও ক্লাউডে সংরক্ষণ
      if (metaBn.trim() || metaEn.trim()) {
        try {
          localStorage.setItem(`quran_ayah_meta_${sNum}_${aNum}`, JSON.stringify({
            meta_bn: metaBn.trim(),
            meta_en: metaEn.trim(),
          }));
          metaSaved = true;
        } catch {}

        try {
          await supabase.from("ayah_metadata").upsert({
            surah: sNum,
            ayah: aNum,
            meta_bn: metaBn.trim() || null,
            meta_en: metaEn.trim() || null,
            created_by: user?.id,
            updated_at: new Date().toISOString(),
          }, { onConflict: "surah,ayah" });
        } catch {}
      }

      // ২. অনুবাদ টেক্সট সংরক্ষণ (যদি প্রদান করা হয়)
      if (text.trim()) {
        const transSchema = z.object({
          surah: z.coerce.number().int().min(1).max(114),
          ayah: z.coerce.number().int().min(1).max(300),
          lang: z.enum(["bn", "en", "bn_std", "en_std"]),
          text: z.string().trim().min(1, "অনুবাদ টেক্সট প্রদান করুন").max(8000),
          note: z.string().trim().max(4000),
        });

        const parsed = transSchema.safeParse({ surah: sNum, ayah: aNum, lang: lng, text, note });
        if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "সঠিক অনুবাদ তথ্য দিন");
        const { error } = await supabase.from("verse_translations").upsert(
          {
            surah: parsed.data.surah,
            ayah: parsed.data.ayah,
            lang: parsed.data.lang,
            text: parsed.data.text,
            note: parsed.data.note || null,
            created_by: user!.id,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "surah,ayah,lang" },
        );
        if (error) throw error;
      } else if (!metaSaved) {
        throw new Error("অনুবাদ টেক্সট অথবা মেটা ডাটা প্রদান করুন");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verse-translations"] });
      queryClient.invalidateQueries({ queryKey: ["verse-translations"] });
      queryClient.invalidateQueries({ queryKey: ["local-surah-cache"] });
      setText("");
      setNote("");
      toast.success("আয়াতের তথ্য ও মেটা ডাটা সফলভাবে সংরক্ষণ করা হয়েছে");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("verse_translations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verse-translations"] });
      queryClient.invalidateQueries({ queryKey: ["verse-translations"] });
      toast.success("অনুবাদ মুছে ফেলা হয়েছে");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-6">
      <form
        className="rounded border border-border bg-card p-5 shadow-sm space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="surah" className="text-xs font-semibold">সূরা নম্বর</Label>
            <Input
              id="surah"
              type="number"
              min={1}
              max={114}
              value={surah}
              onChange={(e) => setSurah(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ayah" className="text-xs font-semibold">আয়াত নম্বর</Label>
            <Input
              id="ayah"
              type="number"
              min={1}
              max={300}
              value={ayah}
              onChange={(e) => setAyah(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lng" className="text-xs font-semibold">অনুবাদ টাইপ</Label>
            <select
              id="lng"
              value={lng}
              onChange={(e) => setLng(e.target.value as typeof lng)}
              className="h-9 w-full rounded border border-input bg-background px-3 text-xs"
            >
              <option value="bn">বিজ্ঞানভিত্তিক (বাংলা)</option>
              <option value="en">বিজ্ঞানভিত্তিক (English)</option>
              <option value="bn_std">প্রচলিত অনুবাদ (বাংলা)</option>
              <option value="en_std">প্রচলিত অনুবাদ (English)</option>
            </select>
          </div>
        </div>

        {/* মেটা ডাটা (Meta Data) বক্স */}
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <Sparkles className="size-3.5" />
            <span>আয়াতের মেটা ডাটা / Meta Data (নম্বরের পাশে দৃশ্যমান হবে)</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="metaBn" className="text-xs font-medium text-muted-foreground">
                মেটা ডাটা (বাংলা)
              </Label>
              <Input
                id="metaBn"
                value={metaBn}
                onChange={(e) => setMetaBn(e.target.value)}
                placeholder="যেমন: সিস্টেমের মূল উৎসের পরিচয় ও করুণাময় গুণাবলী"
                className="h-9 text-xs bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="metaEn" className="text-xs font-medium text-muted-foreground">
                Meta Data (English)
              </Label>
              <Input
                id="metaEn"
                value={metaEn}
                onChange={(e) => setMetaEn(e.target.value)}
                placeholder="e.g. Root Directory Authentication"
                className="h-9 text-xs bg-background"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="text" className="text-xs font-semibold">অনুবাদ টেক্সট (ঐচ্ছিক যদি শুধু মেটা ডাটা সংরক্ষণ করেন)</Label>
          <Textarea 
            id="text" 
            rows={4} 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="এখানে আয়াতের অনুবাদ লিখুন..."
            className="text-xs" 
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="note" className="text-xs font-semibold">বিশেষ টীকা / নোট (ঐচ্ছিক)</Label>
          <Textarea 
            id="note" 
            rows={2} 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            placeholder="প্রাসঙ্গিক ব্যাখ্যা বা তথ্যসূত্র..."
            className="text-xs" 
          />
        </div>
        <Button type="submit" disabled={save.isPending} size="sm" className="bg-[#2271b1] hover:bg-[#135e96] text-white cursor-pointer">
          <Plus className="size-3.5 mr-1" /> সংরক্ষণ করুন
        </Button>
      </form>

      <div className="space-y-2">
        <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">সংরক্ষিত অনুবাদ তালিকা:</h3>
        <div className="divide-y divide-border rounded border border-border bg-card shadow-sm">
          {list.data?.map((v) => (
            <div key={v.id} className="flex items-start gap-3 p-3.5 hover:bg-muted/30 transition-colors">
              <span className="rounded bg-[#2271b1]/10 px-2 py-0.5 text-[11px] font-bold text-[#2271b1]">
                সূরা {v.surah} : আয়াত {v.ayah} · {v.lang}
              </span>
              <p className="min-w-0 flex-1 text-xs text-foreground leading-relaxed">{v.text}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:bg-destructive/10 cursor-pointer"
                aria-label="মুছে ফেলুন"
                onClick={() => remove.mutate(v.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserPermissionsDialog({
  user,
  onClose,
}: {
  user: { id: string; email?: string } | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    showArabic: true,
    showWordByWord: true,
    showTransliteration: true,
    showConventionalBn: true,
    showConventionalEn: true,
    showModernBn: true,
    showModernEn: true,
    showLexicon: true,
    showLexiconScientific: true,
    showMetaData: true,
  });
  const [hasCustomRecord, setHasCustomRecord] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    supabase
      .from("user_display_permissions" as any)
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (data && (data as any).permissions) {
          setPermissions({
            showArabic: true,
            showWordByWord: true,
            showTransliteration: true,
            showConventionalBn: true,
            showConventionalEn: true,
            showModernBn: true,
            showModernEn: true,
            showLexicon: true,
            showLexiconScientific: true,
            showMetaData: true,
            ...((data as any).permissions || {}),
          });
          setNotes((data as any).notes || "");
          setHasCustomRecord(true);
        } else {
          setHasCustomRecord(false);
        }
        setLoading(false);
      });
  }, [user?.id]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;
      const { error } = await supabase
        .from("user_display_permissions" as any)
        .upsert({
          user_id: user.id,
          email: user.email ? user.email.trim().toLowerCase() : null,
          permissions,
          notes: notes.trim() || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-display-permissions"] });
      toast.success(`ইউজার ${user?.email || user?.id} এর জন্য কাস্টম ডিসপ্লে পারমিশন সংরক্ষিত হয়েছে!`);
      onClose();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;
      const { error } = await supabase
        .from("user_display_permissions" as any)
        .delete()
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-display-permissions"] });
      toast.success("কাস্টম পারমিশন মুছে গ্লোবাল ডিফল্টে ফিরিয়ে নেওয়া হয়েছে");
      onClose();
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (!user) return null;

  const displayLayersList: { key: string; title: string; desc: string; highlight?: boolean }[] = [
    { key: "showArabic", title: "আরবি টেক্সট", desc: "মূল কুরআন পাঠ প্রদর্শন" },
    { key: "showWordByWord", title: "শব্দে শব্দে অর্থ", desc: "প্রতিটি শব্দের নিচে স্বতন্ত্র অর্থ ও উচ্চারণ" },
    { key: "showTransliteration", title: "উচ্চারণ নির্দেশিকা", desc: "সহজে পড়ার জন্য আয়াতের উচ্চারণ নির্দেশিকা" },
    { key: "showConventionalBn", title: "১. প্রচলিত বাংলা অনুবাদ", desc: "মুহিউদ্দীন খান / তাইসিরুল কুরআন" },
    { key: "showConventionalEn", title: "২. Conventional English Translation", desc: "সহীহ ইন্টারন্যাশনাল অনুবাদ" },
    { key: "showModernBn", title: "৩. আধুনিক বাংলা অনুবাদ", desc: "আমাদের প্রাঞ্জল ও সমসাময়িক আধুনিক বাংলা অনুবাদ", highlight: true },
    { key: "showModernEn", title: "৪. Modern English Translation", desc: "আমাদের সমসাময়িক আধুনিক ইংরেজি অনুবাদ", highlight: true },
    { key: "showLexicon", title: "অভিধান / Lexicon", desc: "শব্দকোষ, মূল ধাতু (Root) ও ব্যাকরণ" },
    { key: "showLexiconScientific", title: "বিজ্ঞানভিত্তিক অর্থ ও গবেষণা", desc: "অভিধানে আধুনিক বিজ্ঞানভিত্তিক ব্যাখ্যা ও প্রেক্ষাপট", highlight: true },
    { key: "showMetaData", title: "মেটা ডাটা / Meta Data", desc: "আয়াতের পাশে বিষয়ভিত্তিক মেটা ডাটা ও টপিক ট্যাগ", highlight: true },
  ];

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <SlidersHorizontal className="size-5 text-primary" />
            স্বতন্ত্র ইউজার ডিসপ্লে ও অ্যাক্সেস পারমিশন
          </DialogTitle>
          <DialogDescription className="text-xs">
            ইউজার: <span className="font-semibold text-foreground">{user.email || "অজ্ঞাত"}</span>{" "}
            (আইডি: <span className="font-mono">{user.id}</span>)
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 flex justify-center items-center text-muted-foreground text-xs">
            <Loader2 className="size-5 animate-spin mr-2" /> পারমিশন লোড হচ্ছে...
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* কুইক প্রিসেট বাটন */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground">কুইক প্রিসেট:</span>
              <button
                type="button"
                onClick={() => {
                  const allOn: Record<string, boolean> = {};
                  displayLayersList.forEach((l) => (allOn[l.key] = true));
                  setPermissions(allOn);
                  toast.info("সবগুলো লেয়ার উন্মুক্ত করা হলো");
                }}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/30 cursor-pointer"
              >
                🌟 সম্পূর্ণ উন্মুক্ত (Full Access)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPermissions({
                    showArabic: true,
                    showWordByWord: true,
                    showTransliteration: true,
                    showConventionalBn: true,
                    showConventionalEn: true,
                    showModernBn: false,
                    showModernEn: false,
                    showLexicon: true,
                    showLexiconScientific: false,
                    showMetaData: false,
                  });
                  toast.info("শুধুমাত্র প্রচলিত কুরআন লেয়ারসমূহ সক্রিয় করা হলো");
                }}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border border-blue-500/30 cursor-pointer"
              >
                📖 শুধুমাত্র প্রচলিত কুরআন (Standard)
              </button>
            </div>

            {/* ১০টি লেয়ারের চেকলিস্ট */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-foreground block">
                এই ইউজারের জন্য কুরআনের কোন কোন অংশ দৃশ্যমান হবে:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {displayLayersList.map((layer) => {
                  const isChecked = permissions[layer.key] ?? true;
                  return (
                    <div
                      key={layer.key}
                      className={`flex items-start justify-between gap-2.5 p-3 rounded-lg border transition-all cursor-pointer ${
                        layer.highlight
                          ? isChecked
                            ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10"
                            : "border-border/60 bg-card opacity-70"
                          : isChecked
                          ? "border-border bg-card"
                          : "border-border/40 bg-muted/20 opacity-60"
                      }`}
                      onClick={() => setPermissions({ ...permissions, [layer.key]: !isChecked })}
                    >
                      <div className="space-y-0.5 select-none flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-foreground truncate">{layer.title}</span>
                          {layer.highlight && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/15 text-amber-600 font-bold">
                              বিশেষ
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{layer.desc}</p>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Switch
                          id={`user-perm-${layer.key}`}
                          checked={isChecked}
                          onCheckedChange={(val) => setPermissions({ ...permissions, [layer.key]: val })}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* এডমিন নোটস */}
            <div className="space-y-1 pt-2 border-t border-border/50">
              <Label htmlFor="admin-perm-notes" className="text-xs font-semibold">
                এডমিন নোট (ঐচ্ছিক):
              </Label>
              <Input
                id="admin-perm-notes"
                placeholder="যেমন: অনুমোদিত ইসলামিক গবেষক / বিশেষ রিভিউয়ার"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 pt-2 border-t border-border/60">
          {hasCustomRecord ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={resetMutation.isPending}
              onClick={() => resetMutation.mutate()}
              className="text-destructive hover:bg-destructive/10 text-xs h-8 cursor-pointer"
            >
              <RotateCcw className="size-3 mr-1" /> গ্লোবাল ডিফল্টে রিসেট
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="h-8 text-xs cursor-pointer">
              বাতিল
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={saveMutation.isPending || loading}
              onClick={() => saveMutation.mutate()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 text-xs cursor-pointer"
            >
              {saveMutation.isPending ? <Loader2 className="size-3 animate-spin mr-1" /> : <Check className="size-3 mr-1" />}
              পারমিশন সংরক্ষণ করুন
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RolesAdmin() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"admin" | "user">("admin");
  const [selectedUserForPerms, setSelectedUserForPerms] = useState<{ id: string; email?: string } | null>(null);

  const rolesList = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const displayPermsQuery = useQuery({
    queryKey: ["admin-user-display-permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_display_permissions" as any)
        .select("*");
      if (error) return [];
      return data || [];
    },
  });

  const addRole = useMutation({
    mutationFn: async () => {
      if (!userId.trim()) throw new Error("User ID প্রদান করুন");
      const { error } = await supabase
        .from("user_roles")
        .upsert({ user_id: userId.trim(), role }, { onConflict: "user_id,role" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      setUserId("");
      toast.success("ইউজার রোল সফলভাবে আপডেট হয়েছে!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const removeRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast.success("রোল মুছে ফেলা হয়েছে");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const customPermsList = displayPermsQuery.data || [];

  return (
    <div className="space-y-6">
      {selectedUserForPerms && (
        <UserPermissionsDialog
          user={selectedUserForPerms}
          onClose={() => setSelectedUserForPerms(null)}
        />
      )}

      <form
        className="rounded border border-border bg-card p-5 shadow-sm space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          addRole.mutate();
        }}
      >
        <h2 className="font-semibold text-base flex items-center gap-2 border-b border-border/60 pb-2">
          <Shield className="size-4 text-[#2271b1]" /> নতুন অ্যাডমিন বা ইউজার রোল অ্যাসাইন করুন
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="userId" className="text-xs font-semibold">ব্যবহারকারী আইডি (Supabase Auth UID)</Label>
            <Input
              id="userId"
              placeholder="যেমন: e2a8b... (User UUID)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="h-9 text-xs"
            />
            <p className="text-[11px] text-muted-foreground">
              💡 সাবস্ক্রাইবার তালিকা থেকে সরাসরি UUID কপি করে এখানে ব্যবহার করতে পারেন।
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="roleSelect" className="text-xs font-semibold">রোল নির্বাচন করুন</Label>
            <select
              id="roleSelect"
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "user")}
              className="h-9 w-full rounded border border-input bg-background px-3 text-xs"
            >
              <option value="admin">Admin (অ্যাডমিন)</option>
              <option value="user">User (ব্যবহারকারী)</option>
            </select>
          </div>
        </div>
        <Button type="submit" disabled={addRole.isPending} size="sm" className="bg-[#2271b1] hover:bg-[#135e96] text-white cursor-pointer">
          <UserCheck className="size-3.5 mr-1.5" /> রোল সংরক্ষণ করুন
        </Button>
      </form>

      <div className="space-y-2">
        <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">বর্তমান রোলসমূহের তালিকা:</h3>
        <div className="divide-y divide-border rounded border border-border bg-card shadow-sm">
          {rolesList.data?.map((r) => {
            const hasCustomPerms = customPermsList.some((p: any) => p.user_id === r.user_id);
            return (
              <div key={r.id} className="flex items-center justify-between p-3.5 flex-wrap gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-mono font-medium text-foreground">{r.user_id}</p>
                    <span className="inline-block rounded bg-[#2271b1]/10 px-2 py-0.5 text-[10px] font-bold text-[#2271b1]">
                      {r.role}
                    </span>
                    {hasCustomPerms && (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        <Sliders className="size-2.5" /> কাস্টম পারমিশন
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs px-2.5 cursor-pointer"
                    onClick={() => setSelectedUserForPerms({ id: r.user_id })}
                  >
                    <SlidersHorizontal className="size-3 mr-1" /> পারমিশন সেটিংস
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete Role"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
                    onClick={() => removeRole.mutate(r.id)}
                  >
                    <UserX className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SubscribersAdmin() {
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedUserForPerms, setSelectedUserForPerms] = useState<{ id: string; email?: string } | null>(null);

  const list = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data || [];
    },
  });

  const accessQuery = useQuery({
    queryKey: ["all-category-user-access"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_user_access" as any)
        .select("*");
      if (error) return [];
      return data || [];
    },
  });

  const displayPermsQuery = useQuery({
    queryKey: ["admin-user-display-permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_display_permissions" as any)
        .select("*");
      if (error) return [];
      return data || [];
    },
  });

  const toggleAccess = useMutation({
    mutationFn: async ({ categoryId, email, userId, existsId }: { categoryId: string; email?: string; userId?: string; existsId?: string }) => {
      if (existsId) {
        const { error } = await supabase
          .from("category_user_access" as any)
          .delete()
          .eq("id", existsId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("category_user_access" as any)
          .insert({
            category_id: categoryId,
            email: email ? email.trim().toLowerCase() : null,
            user_id: userId || null,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-category-user-access"] });
      queryClient.invalidateQueries({ queryKey: ["category-access-users"] });
      queryClient.invalidateQueries({ queryKey: ["user-category-access"] });
      toast.success("ক্যাটাগরি অ্যাক্সেস পারমিশন আপডেট হয়েছে!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("UUID ক্লিপবোর্ডে কপি হয়েছে!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const restrictedCategories = (categoriesQuery.data || []).filter((c: any) => c.is_restricted);
  const allAccessList = accessQuery.data || [];
  const customPermsList = displayPermsQuery.data || [];

  return (
    <div className="space-y-4">
      {selectedUserForPerms && (
        <UserPermissionsDialog
          user={selectedUserForPerms}
          onClose={() => setSelectedUserForPerms(null)}
        />
      )}

      <div>
        <h2 className="text-base font-semibold">নিউজলেটার সাবস্ক্রাইবার ও ইউজার পারমিশন নিয়ন্ত্রণ</h2>
        <p className="text-xs text-muted-foreground">
          সাইন-আপ করা গ্রাহকদের বিবরণ দেখুন এবং প্রতিটি ইউজারের জন্য কুরআন ডিসপ্লে লেয়ার ও রেস্ট্রিকটেড ক্যাটাগরি পারমিশন কনফিগার করুন।
        </p>
      </div>

      <div className="divide-y divide-border rounded border border-border bg-card shadow-sm">
        {list.data?.length === 0 && (
          <p className="p-4 text-xs text-muted-foreground">কোনো সাবস্ক্রাইবার পাওয়া যায়নি</p>
        )}
        {list.data?.map((s: any) => {
          const subscriberEmail = s.email?.toLowerCase();
          const grantedForThisUser = allAccessList.filter(
            (a: any) => (subscriberEmail && a.email?.toLowerCase() === subscriberEmail) || (s.id && a.user_id === s.id)
          );

          const customPermRecord = customPermsList.find(
            (p: any) => (subscriberEmail && p.email?.toLowerCase() === subscriberEmail) || (s.id && p.user_id === s.id)
          );

          return (
            <div
              key={s.id}
              className="flex flex-col gap-3 p-4 text-xs hover:bg-muted/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground text-sm">{s.email}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      (তারিখ: {new Date(s.created_at).toLocaleDateString("en-GB")})
                    </span>

                    {customPermRecord ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <Sliders className="size-2.5" /> কাস্টম পারমিশন সক্রিয়
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/40">
                        <Globe className="size-2.5" /> গ্লোবাল ডিফল্ট
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/50 select-all">
                      আইডি: {s.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(s.id)}
                      className="inline-flex items-center gap-1 text-[11px] text-[#2271b1] hover:underline font-medium cursor-pointer"
                    >
                      {copiedId === s.id ? (
                        <>
                          <Check className="size-3 text-emerald-500" /> কপি হয়েছে
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" /> আইডি কপি
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs font-semibold px-3 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 cursor-pointer"
                    onClick={() => setSelectedUserForPerms({ id: s.id, email: s.email })}
                  >
                    <SlidersHorizontal className="size-3.5 mr-1.5 text-emerald-600" />
                    ডিসপ্লে ও অ্যাক্সেস পারমিশন
                  </Button>
                </div>
              </div>

              {/* রেস্ট্রিকটেড ক্যাটাগরি পারমিশন চেকলিস্ট */}
              {restrictedCategories.length > 0 && (
                <div className="mt-1 pt-2.5 border-t border-border/50">
                  <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                    রেস্ট্রিকটেড আর্টিকেল ক্যাটাগরি অ্যাক্সেস:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {restrictedCategories.map((cat: any) => {
                      const accessRecord = grantedForThisUser.find((a: any) => a.category_id === cat.id);
                      const isGranted = Boolean(accessRecord);

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() =>
                            toggleAccess.mutate({
                              categoryId: cat.id,
                              email: s.email,
                              userId: s.id,
                              existsId: accessRecord?.id,
                            })
                          }
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${
                            isGranted
                              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold shadow-2xs"
                              : "border-border/80 bg-card text-muted-foreground hover:border-amber-500/50 hover:bg-amber-500/5"
                          }`}
                        >
                          {isGranted ? (
                            <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Plus className="size-3 text-muted-foreground" />
                          )}
                          <span>{cat.name_bn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}