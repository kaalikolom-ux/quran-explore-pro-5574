import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, FileCode, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";

interface ImportModalProps {
  type: "wordpress" | "blogger";
  onClose: () => void;
}

export function ImportModal({ type, onClose }: ImportModalProps) {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importedCount, setImportedCount] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const generateSlug = (title: string, fallback: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80);
    return slug || `post-${fallback}-${Date.now().toString().slice(-4)}`;
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
      if (parseError) {
        throw new Error("XML ফাইলটি সঠিক নয় বা ক্ষতিগ্রস্থ।");
      }

      const articlesToInsert: any[] = [];

      if (type === "wordpress") {
        // WordPress WXR XML Parsing
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
            const postDate =
              item.querySelector("post_date")?.textContent || new Date().toISOString();
            const postName = item.querySelector("post_name")?.textContent;
            const excerpt =
              item.getElementsByTagNameNS("*", "encoded")[1]?.textContent ||
              item.querySelector("excerpt")?.textContent ||
              "";

            const cleanExcerpt = excerpt
              ? excerpt.replace(/<[^>]*>?/gm, "").slice(0, 160)
              : content.replace(/<[^>]*>?/gm, "").slice(0, 160);

            articlesToInsert.push({
              title_bn: title,
              title_en: title,
              slug: postName || generateSlug(title, String(index)),
              content_bn: content,
              content_en: content,
              excerpt_bn: cleanExcerpt.trim(),
              excerpt_en: cleanExcerpt.trim(),
              cover_image_url: extractFirstImage(content),
              published: status === "publish",
              published_at: new Date(postDate).toISOString(),
              created_by: user!.id,
            });
          }
        });
      } else if (type === "blogger") {
        // Blogger Atom XML Parsing
        const entries = xmlDoc.querySelectorAll("entry");
        entries.forEach((entry, index) => {
          const idText = entry.querySelector("id")?.textContent || "";
          // শুধুমাত্র পোস্ট ফিল্টার করা (লেবেল বা কমেন্ট বাদ দেওয়া)
          if (idText.includes(".post-") || entry.querySelector('category[term*="#post"]')) {
            const title = entry.querySelector("title")?.textContent || "শিরোনামহীন পোস্ট";
            const content = entry.querySelector("content")?.textContent || "";
            const publishedAt =
              entry.querySelector("published")?.textContent || new Date().toISOString();
            const draftElement = entry.querySelector("app\\:control > app\\:draft, draft");
            const isDraft = draftElement?.textContent === "yes";

            const cleanExcerpt = content.replace(/<[^>]*>?/gm, "").slice(0, 160);

            articlesToInsert.push({
              title_bn: title,
              title_en: title,
              slug: generateSlug(title, String(index)),
              content_bn: content,
              content_en: content,
              excerpt_bn: cleanExcerpt.trim(),
              excerpt_en: cleanExcerpt.trim(),
              cover_image_url: extractFirstImage(content),
              published: !isDraft,
              published_at: new Date(publishedAt).toISOString(),
              created_by: user!.id,
            });
          }
        });
      }

      if (articlesToInsert.length === 0) {
        throw new Error("ফাইলটিতে কোনো পোস্ট পাওয়া যায়নি।");
      }

      // Supabase এ ব্যাচ ইনসার্ট
      const { error } = await supabase.from("articles").insert(articlesToInsert);
      if (error) throw error;

      setImportedCount(articlesToInsert.length);
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success(`${articlesToInsert.length}টি পোস্ট সফলভাবে ইমপোর্ট হয়েছে!`);
    } catch (err: any) {
      setErrorMsg(err.message || "ইমপোর্ট করার সময় সমস্যা হয়েছে");
      toast.error(err.message || "ইমপোর্ট ব্যর্থ হয়েছে");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="size-5 text-[#2271b1]" />
            <h3 className="font-bold text-sm text-foreground">
              {type === "wordpress"
                ? "ওয়ার্ডপ্রেস (WordPress) থেকে ইমপোর্ট"
                : "ব্লগার (Blogger) থেকে ইমপোর্ট"}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>

        {importedCount !== null ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="mx-auto size-12 text-emerald-500" />
            <p className="font-semibold text-sm text-foreground">
              {importedCount} টি পোস্ট সফলভাবে ইমপোর্ট করা হয়েছে!
            </p>
            <Button onClick={onClose} className="bg-[#2271b1] text-white text-xs">
              ঠিক আছে
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-dashed border-border p-6 text-center bg-muted/20">
              <Upload className="mx-auto size-8 text-muted-foreground/60 mb-2" />
              <label
                htmlFor="xml-upload"
                className="cursor-pointer block text-xs font-semibold text-[#2271b1] hover:underline"
              >
                XML ফাইল সিলেক্ট করুন
              </label>
              <input
                id="xml-upload"
                type="file"
                accept=".xml"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                {file
                  ? file.name
                  : type === "wordpress"
                    ? "WordPress Export .xml ফাইল"
                    : "Blogger Backup .xml ফাইল"}
              </p>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs"
              >
                বাতিল
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!file || isProcessing}
                onClick={handleImport}
                className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs"
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
