import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { 
  Pencil, 
  Trash2, 
  ShieldAlert, 
  Users, 
  X, 
  Check, 
  Search, 
  Plus, 
  Lock, 
  Unlock, 
  Mail,
  UserCheck,
  UserX
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "slug: lowercase letters, numbers and dashes only"),
  name_bn: z.string().trim().min(1).max(120),
  name_en: z.string().trim().max(120),
  sort_order: z.coerce.number().int().min(0).max(999),
});

const EMPTY = { slug: "", name_bn: "", name_en: "", sort_order: "0" };

type CategoryItem = {
  id: string;
  slug: string;
  name_bn: string;
  name_en: string | null;
  sort_order: number;
  show_in_menu: boolean;
  is_restricted?: boolean;
};

/* ========================================================================== */
/* CATEGORY SUBSCRIBER ACCESS MODAL                                           */
/* ========================================================================== */
function CategoryAccessModal({
  category,
  onClose,
}: {
  category: CategoryItem;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // 1. Fetch current access permissions for this category
  const accessQuery = useQuery({
    queryKey: ["category-access-users", category.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("category_user_access" as any)
        .select("*")
        .eq("category_id", category.id);
      if (error) {
        console.warn(error.message);
        return [];
      }
      return data || [];
    },
  });

  // 2. Fetch all newsletter subscribers
  const subscribersQuery = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return [];
      return data || [];
    },
  });

  // 3. Add access grant
  const grantAccess = useMutation({
    mutationFn: async ({ email, userId }: { email?: string; userId?: string }) => {
      const payload: any = {
        category_id: category.id,
        email: email ? email.trim().toLowerCase() : null,
        user_id: userId || null,
      };

      const { error } = await supabase
        .from("category_user_access" as any)
        .insert(payload);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-access-users", category.id] });
      queryClient.invalidateQueries({ queryKey: ["user-category-access"] });
      setNewEmail("");
      toast.success("সাবস্ক্রাইবারের অ্যাক্সেস সফলভাবে যুক্ত হয়েছে!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // 4. Revoke access grant
  const revokeAccess = useMutation({
    mutationFn: async (accessId: string) => {
      const { error } = await supabase
        .from("category_user_access" as any)
        .delete()
        .eq("id", accessId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-access-users", category.id] });
      queryClient.invalidateQueries({ queryKey: ["user-category-access"] });
      toast.success("অ্যাক্সেস প্রত্যাহার করা হয়েছে");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const accessList = accessQuery.data || [];
  const grantedEmailsSet = new Set(accessList.map((a: any) => a.email?.toLowerCase()).filter(Boolean));
  const grantedUserIdsSet = new Set(accessList.map((a: any) => a.user_id).filter(Boolean));

  const allSubscribers = subscribersQuery.data || [];
  const filteredSubscribers = allSubscribers.filter((s: any) =>
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSubscriber = (sub: any) => {
    const email = sub.email?.toLowerCase();
    const existing = accessList.find((a: any) => (email && a.email?.toLowerCase() === email) || (sub.id && a.user_id === sub.id));
    if (existing) {
      revokeAccess.mutate(existing.id);
    } else {
      grantAccess.mutate({ email: sub.email, userId: sub.id });
    }
  };

  const handleAddNewEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) {
      toast.error("সঠিক ইমেইল ঠিকানা প্রদান করুন");
      return;
    }
    grantAccess.mutate({ email: newEmail.trim().toLowerCase() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-border/60 pb-3">
          <div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Lock className="size-3.5" /> রেস্ট্রিকটেড ক্যাটাগরি অ্যাক্সেস নিয়ন্ত্রণ
            </span>
            <h3 className="text-lg font-bold text-foreground mt-0.5">
              {category.name_bn} ({category.name_en || category.slug})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          এই ক্যাটাগরির সমস্ত আর্টিকেল কেবল নিচে অনুমোদিত সাবস্ক্রাইবার বা ব্যবহারকারীরাই পড়তে পারবেন। অন্যান্য সাধারণ ভিজিটরদের কাছে এই ক্যাটাগরি সম্পূর্ণ হিডেন (অদৃশ্য) থাকবে।
        </p>

        {/* সরাসরি নতুন ইমেইল যুক্ত করার ফর্ম */}
        <form onSubmit={handleAddNewEmail} className="flex gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="সাবস্ক্রাইবার ইমেইল লিখুন (যেমন: user@example.com)..."
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={grantAccess.isPending}
            className="h-9 px-3 text-xs gap-1.5 cursor-pointer bg-primary text-primary-foreground"
          >
            <Plus className="size-3.5" /> অনুমতি দিন
          </Button>
        </form>

        {/* অনুমোদিত সাবস্ক্রাইবারদের সংক্ষিপ্ত ব্যাজ ভিউ */}
        {accessList.length > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 space-y-2">
            <span className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>অনুমোদিত সাবস্ক্রাইবারবৃন্দ ({accessList.length} জন):</span>
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {accessList.map((a: any) => (
                <span
                  key={a.id}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-foreground shadow-2xs"
                >
                  <UserCheck className="size-3 text-emerald-500" />
                  <span>{a.email || `ID: ${a.user_id?.slice(0, 8)}...`}</span>
                  <button
                    type="button"
                    onClick={() => revokeAccess.mutate(a.id)}
                    title="অনুমতি বাতিল করুন"
                    className="ml-1 text-muted-foreground hover:text-destructive cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* সাবস্ক্রাইবার সার্চ ও কুইক টগল তালিকা */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              নিউজলেটার গ্রাহক তালিকা থেকে নির্বাচন করুন:
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              মোট: {allSubscribers.length} জন
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="গ্রাহকের ইমেইল বা আইডি দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs h-8.5"
            />
          </div>

          <div className="divide-y divide-border/60 rounded-xl border border-border/70 bg-card max-h-56 overflow-y-auto shadow-xs">
            {filteredSubscribers.length === 0 ? (
              <p className="p-4 text-center text-xs text-muted-foreground">
                কোনো সাবস্ক্রাইবার পাওয়া যায়নি
              </p>
            ) : (
              filteredSubscribers.map((sub: any) => {
                const isGranted = (sub.email && grantedEmailsSet.has(sub.email.toLowerCase())) ||
                  (sub.id && grantedUserIdsSet.has(sub.id));

                return (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2.5 sm:p-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className="min-w-0 pr-3">
                      <p className="text-xs font-medium text-foreground truncate flex items-center gap-1.5">
                        <Mail className="size-3 text-muted-foreground shrink-0" />
                        <span>{sub.email}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate mt-0.5">
                        ID: {sub.id}
                      </p>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant={isGranted ? "default" : "outline"}
                      onClick={() => handleToggleSubscriber(sub)}
                      className={`h-7.5 px-2.5 text-[11px] font-medium gap-1 cursor-pointer ${
                        isGranted
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {isGranted ? (
                        <>
                          <Check className="size-3" /> অ্যাক্সেস আছে
                        </>
                      ) : (
                        <>
                          <Plus className="size-3" /> অনুমতি দিন
                        </>
                      )}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-end border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs cursor-pointer"
          >
            সম্পন্ন
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* MAIN CATEGORIES ADMIN COMPONENT                                            */
/* ========================================================================== */
export function CategoriesAdmin() {
  const { t, lang } = usePrefs();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ ...EMPTY });
  const [showInMenu, setShowInMenu] = useState(true);
  const [isRestricted, setIsRestricted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [managingAccessCat, setManagingAccessCat] = useState<CategoryItem | null>(null);

  const list = useQuery<CategoryItem[]>({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data || []) as CategoryItem[];
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["categories-list"] });
    queryClient.invalidateQueries({ queryKey: ["menu-items"] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const parsed = schema.safeParse(form);
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
      
      const payload: any = {
        slug: parsed.data.slug,
        name_bn: parsed.data.name_bn,
        name_en: parsed.data.name_en || null,
        sort_order: parsed.data.sort_order,
        show_in_menu: showInMenu,
        is_restricted: isRestricted,
      };

      if (editingId) {
        const { error } = await supabase.from("categories").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      setForm({ ...EMPTY });
      setEditingId(null);
      setIsRestricted(false);
      setShowInMenu(true);
      toast.success(t("saved") || "ক্যাটাগরি সংরক্ষিত হয়েছে!");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-8">
      {/* ক্যাটাগরি তৈরি / সম্পাদনা ফর্ম */}
      <form
        className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="font-bold text-base text-foreground flex items-center gap-2">
            {editingId ? <Pencil className="size-4 text-primary" /> : <Plus className="size-4 text-primary" />}
            <span>{editingId ? "ক্যাটাগরি সম্পাদনা করুন" : "নতুন ক্যাটাগরি যুক্ত করুন"}</span>
          </h2>
          {isRestricted && (
            <Badge variant="outline" className="gap-1 border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
              <Lock className="size-3" /> রেস্ট্রিকটেড মোড
            </Badge>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name-bn" className="text-xs font-semibold">{t("categoryNameBn") || "ক্যাটাগরির নাম (বাংলা)"}</Label>
            <Input
              id="cat-name-bn"
              value={form.name_bn}
              onChange={(e) => setForm({ ...form, name_bn: e.target.value })}
              required
              className="text-xs h-9"
              placeholder="যেমন: তাদাব্বুরে কুরআন..."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-name-en" className="text-xs font-semibold">{t("categoryNameEn") || "ক্যাটাগরির নাম (English)"}</Label>
            <Input
              id="cat-name-en"
              value={form.name_en}
              onChange={(e) => setForm({ ...form, name_en: e.target.value })}
              className="text-xs h-9"
              placeholder="e.g. Quran Tadabbur..."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-slug" className="text-xs font-semibold">{t("slug") || "স্লাগ (URL Slug)"}</Label>
            <Input
              id="cat-slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              required
              className="text-xs h-9 font-mono"
              placeholder="quran-tadabbur"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat-order" className="text-xs font-semibold">{t("sortOrder") || "ক্রম নম্বর (Sort Order)"}</Label>
            <Input
              id="cat-order"
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              className="text-xs h-9"
            />
          </div>
        </div>

        {/* কনফিগারেশন টগলসমূহ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 p-3">
            <div className="space-y-0.5 pr-2">
              <Label htmlFor="cat-menu" className="text-xs font-semibold cursor-pointer">
                {t("showInMenu") || "মেনুতে প্রদর্শন করুন"}
              </Label>
              <p className="text-[11px] text-muted-foreground">ন্যাভিগেশন মেনুতে এই ক্যাটাগরি লিংক দেখাবে</p>
            </div>
            <Switch checked={showInMenu} onCheckedChange={setShowInMenu} id="cat-menu" />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
            <div className="space-y-0.5 pr-2">
              <Label htmlFor="cat-restricted" className="text-xs font-semibold text-amber-900 dark:text-amber-200 cursor-pointer flex items-center gap-1.5">
                <Lock className="size-3.5 text-amber-600 dark:text-amber-400" />
                <span>রেস্ট্রিকটেড ক্যাটাগরি (Restricted / Private)</span>
              </Label>
              <p className="text-[11px] text-muted-foreground">
                অনুমতি ছাড়া ভিজিটরদের কাছে এই ক্যাটাগরি ও তার পোস্টগুলো অদৃশ্য থাকবে
              </p>
            </div>
            <Switch checked={isRestricted} onCheckedChange={setIsRestricted} id="cat-restricted" />
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-border/40">
          <Button type="submit" disabled={save.isPending} size="sm" className="text-xs px-4 cursor-pointer">
            {t("save") || "সংরক্ষণ করুন"}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs cursor-pointer"
              onClick={() => {
                setEditingId(null);
                setForm({ ...EMPTY });
                setIsRestricted(false);
                setShowInMenu(true);
              }}
            >
              {t("cancel") || "বাতিল"}
            </Button>
          )}
        </div>
      </form>

      {/* ক্যাটাগরি তালিকা */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">
            বিদ্যমান ক্যাটাগরি তালিকা ({list.data?.length || 0}টি):
          </h3>
        </div>

        <div className="space-y-2.5">
          {list.data?.map((c) => {
            const isRestrictedCat = Boolean(c.is_restricted);

            return (
              <div
                key={c.id}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5 transition-all ${
                  isRestrictedCat
                    ? "border-amber-500/40 bg-amber-500/[0.03] shadow-xs"
                    : "border-border/70 bg-card hover:border-border"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">{c.name_bn}</p>
                    {c.name_en && (
                      <span className="text-xs text-muted-foreground font-normal">
                        ({c.name_en})
                      </span>
                    )}

                    {isRestrictedCat ? (
                      <Badge variant="outline" className="gap-1 border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] py-0.5">
                        <Lock className="size-3" /> রেস্ট্রিকটেড
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] py-0.5">
                        <Unlock className="size-3" /> উন্মুক্ত
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    /{c.slug} · ক্রম: {c.sort_order} · {c.show_in_menu ? "মেনুতে দৃশ্যমান" : "মেনু ছাড়া"}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {isRestrictedCat && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setManagingAccessCat(c)}
                      className="h-8 px-2.5 text-xs gap-1.5 text-amber-700 dark:text-amber-300 border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer shadow-2xs"
                    >
                      <Users className="size-3.5" />
                      <span>সাবস্ক্রাইবার অ্যাক্সেস</span>
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("edit") || "সম্পাদনা"}
                    onClick={() => {
                      setEditingId(c.id);
                      setShowInMenu(c.show_in_menu);
                      setIsRestricted(Boolean(c.is_restricted));
                      setForm({
                        slug: c.slug,
                        name_bn: c.name_bn,
                        name_en: c.name_en ?? "",
                        sort_order: String(c.sort_order),
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Pencil className="size-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("delete") || "মুছুন"}
                    onClick={() => {
                      if (confirm("আপনি কি নিশ্চিত যে এই ক্যাটাগরিটি মুছে ফেলতে চান?")) {
                        remove.mutate(c.id);
                      }
                    }}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* সাবস্ক্রাইবার অ্যাক্সেস পারমিশন মডাল */}
      {managingAccessCat && (
        <CategoryAccessModal
          category={managingAccessCat}
          onClose={() => setManagingAccessCat(null)}
        />
      )}
    </div>
  );
}
