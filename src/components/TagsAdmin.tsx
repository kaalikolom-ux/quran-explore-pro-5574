import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil, Tag as TagIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const tagSchema = z.object({
  name_bn: z.string().trim().min(1, "ট্যাগের বাংলা নাম বাধ্যতামূলক").max(80),
  name_en: z.string().trim().max(80),
  slug: z
    .string()
    .trim()
    .min(1, "স্লাগ বাধ্যতামূলক")
    .max(80)
    .regex(/^[a-z0-9-]+$/, "স্লাগে শুধুমাত্র ছোট হাতের ইংরেজি অক্ষর, সংখ্যা এবং ড্যাশ (-) ব্যবহার করা যাবে"),
});

const EMPTY_TAG = {
  name_bn: "",
  name_en: "",
  slug: "",
};

export function TagsAdmin() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ ...EMPTY_TAG });
  const [editingId, setEditingId] = useState<string | null>(null);

  const tagsQuery = useQuery({
    queryKey: ["admin-tags-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name_bn", { ascending: true });
      if (error) return [];
      return data || [];
    },
  });

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const saveTag = useMutation({
    mutationFn: async () => {
      const parsed = tagSchema.safeParse(form);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message);
      }

      const payload = {
        name_bn: parsed.data.name_bn,
        name_en: parsed.data.name_en || null,
        slug: parsed.data.slug,
      };

      if (editingId) {
        const { error } = await supabase.from("tags").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tags").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tags-list"] });
      setForm({ ...EMPTY_TAG });
      setEditingId(null);
      toast.success(editingId ? "ট্যাগ আপডেট হয়েছে" : "নতুন ট্যাগ যুক্ত হয়েছে");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteTag = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tags").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tags-list"] });
      toast.success("ট্যাগ মুছে ফেলা হয়েছে");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveTag.mutate();
        }}
        className="rounded border border-border bg-card p-5 shadow-sm space-y-4"
      >
        <h2 className="text-base font-semibold flex items-center gap-2 border-b border-border/60 pb-2">
          <TagIcon className="size-4 text-[#2271b1]" />
          {editingId ? "ট্যাগ সম্পাদনা করুন" : "নতুন ট্যাগ তৈরি করুন"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="tag-name-bn" className="text-xs font-semibold">
              ট্যাগের নাম (বাংলা) *
            </Label>
            <Input
              id="tag-name-bn"
              value={form.name_bn}
              onChange={(e) => {
                const val = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  name_bn: val,
                  slug: editingId ? prev.slug : generateSlug(prev.name_en || val),
                }));
              }}
              placeholder="যেমন: বিজ্ঞান"
              required
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tag-name-en" className="text-xs font-semibold">
              ট্যাগের নাম (English)
            </Label>
            <Input
              id="tag-name-en"
              value={form.name_en}
              onChange={(e) => {
                const val = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  name_en: val,
                  slug: editingId ? prev.slug : generateSlug(val || prev.name_bn),
                }));
              }}
              placeholder="e.g. Science"
              className="h-9 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tag-slug" className="text-xs font-semibold">
            স্লাগ (URL Slug) *
          </Label>
          <Input
            id="tag-slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })}
            placeholder="যেমন: science"
            required
            className="h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Button
            type="submit"
            disabled={saveTag.isPending}
            size="sm"
            className="bg-[#2271b1] hover:bg-[#135e96] text-white text-xs cursor-pointer"
          >
            <Plus className="size-3.5 mr-1" />
            {editingId ? "আপডেট করুন" : "ট্যাগ সংরক্ষণ করুন"}
          </Button>

          {editingId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingId(null);
                setForm({ ...EMPTY_TAG });
              }}
              className="text-xs cursor-pointer"
            >
              বাতিল
            </Button>
          )}
        </div>
      </form>

      {/* ট্যাগ তালিকা */}
      <div className="space-y-2">
        <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
          সকল ট্যাগ তালিকা ({tagsQuery.data?.length || 0})
        </h3>

        <div className="divide-y divide-border rounded border border-border bg-card shadow-sm">
          {tagsQuery.data?.length === 0 ? (
            <p className="p-4 text-xs text-muted-foreground text-center">কোনো ট্যাগ তৈরি করা হয়নি।</p>
          ) : (
            tagsQuery.data?.map((tag: any) => (
              <div key={tag.id} className="flex items-center justify-between p-3.5 hover:bg-muted/30 transition-colors">
                <div>
                  <span className="text-xs font-bold text-foreground inline-flex items-center gap-1.5">
                    <TagIcon className="size-3 text-[#2271b1]" />
                    {tag.name_bn}
                    {tag.name_en && <span className="text-muted-foreground font-normal">({tag.name_en})</span>}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">/{tag.slug}</p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 cursor-pointer"
                    onClick={() => {
                      setEditingId(tag.id);
                      setForm({
                        name_bn: tag.name_bn,
                        name_en: tag.name_en || "",
                        slug: tag.slug,
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
                    onClick={() => deleteTag.mutate(tag.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}