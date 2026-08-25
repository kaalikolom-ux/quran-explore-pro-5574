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
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";

import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/lib/auth";
import { useCategories } from "@/lib/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { OfflineSyncAdmin } from "@/components/OfflineSyncAdmin";
import { AuthorsAdmin } from "@/components/AuthorsAdmin";
import { CategoriesAdmin } from "@/components/CategoriesAdmin";
import { MenuAdmin } from "@/components/MenuAdmin";
import { PagesAdmin } from "@/components/PagesAdmin";
import { SocialLinksAdmin } from "@/components/SocialLinksAdmin";
import { TurnstileAdmin } from "@/components/TurnstileAdmin";
import { MessagesAdmin } from "@/components/MessagesAdmin";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "অ্যাডমিন ড্যাশবোর্ড — কুরআন অন্বেষা" },
      { name: "description", content: "আর্টিকেল ও বিজ্ঞানভিত্তিক অনুবাদ ইনপুট দেওয়ার প্যানেল।" },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "অ্যাডমিন ড্যাশবোর্ড — কুরআন অন্বেষা" },
      { property: "og:description", content: "কনটেন্ট ব্যবস্থাপনা প্যানেল।" },
    ],
  }),
  component: AdminPage,
});

/* ========================================================================== */
/* DUAL-MODE (VISUAL + HTML) RICH TEXT EDITOR COMPONENT                       */
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
                className="h-8 w-8 p-0"
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="বোল্ড"
              >
                <Bold className="size-4" />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("italic") ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
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
                className="h-8 w-8 p-0"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="হেডিং ১"
              >
                <Heading1 className="size-4" />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="হেডিং ২"
              >
                <Heading2 className="size-4" />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
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
                className="h-8 w-8 p-0"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="বুলেট তালিকা"
              >
                <List className="size-4" />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="সংখ্যানুক্রমিক তালিকা"
              >
                <ListOrdered className="size-4" />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="উদ্ধৃতি"
              >
                <Quote className="size-4" />
              </Button>
              <div className="h-4 w-px bg-border mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
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
                className="h-8 w-8 p-0"
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
          className={`h-7 px-2.5 text-[11px] gap-1.5 transition-all ${
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
/* MAIN WORDPRESS-STYLE ADMIN PAGE                                           */
/* ========================================================================== */
function AdminPage() {
  const { user, loading } = useSession();
  const { isAdmin, loading: roleLoading } = useIsAdmin();
  const [activeTab, setActiveTab] = useState("articles");

  const menuSections = [
    {
      group: "মূল কনটেন্ট মেনু",
      items: [
        { value: "articles", label: "আর্টিকেল ও প্রবন্ধ", icon: FileText },
        { value: "translations", label: "কুরআন আয়াত ও অনুবাদ", icon: Languages },
        { value: "posts", label: "লেখক ও গবেষকবৃন্দ", icon: Users },
        { value: "categories", label: "বিষয়ভিত্তিক ক্যাটাগরি", icon: FolderTree },
      ],
    },
    {
      group: "ওয়েবসাইট ও পেজ লেআউট",
      items: [
        { value: "pages", label: "স্থির পেজসমূহ (Pages)", icon: LayoutGrid },
        { value: "menu", label: "হেডার ও নেভিগেশন মেনু", icon: MenuIcon },
        { value: "messages", label: "ব্যবহারকারীর বার্তা / ফিডব্যাক", icon: Mail },
        { value: "subs", label: "নিউজলেটার সাবস্ক্রাইবার", icon: Users },
      ],
    },
    {
      group: "সিস্টেম ও সিকিউরিটি কনফিগারেশন",
      items: [
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
      <header className="sticky top-0 z-50 flex h-8 w-full items-center justify-between bg-[#1d2327] px-3 text-[#c3c4c7] select-none text-xs border-b border-[#2c3338]">
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
            className="flex items-center gap-1 hover:text-red-400 transition-colors"
            title="লগআউট"
          >
            <LogOut className="size-3" />
            <span>লগআউট</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 shrink-0 bg-[#1d2327] text-[#c3c4c7] flex flex-col justify-between hidden md:flex border-r border-[#2c3338]">
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
                          className={`group flex w-full items-center justify-between px-4 py-2 text-left text-xs font-medium transition-colors ${
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
                <ArticlesAdmin />
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
/* SUB-COMPONENTS                                                             */
/* ========================================================================== */
function RolesAdmin() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<"admin" | "user">("admin");

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

  return (
    <div className="space-y-6">
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
        <Button type="submit" disabled={addRole.isPending} size="sm" className="bg-[#2271b1] hover:bg-[#135e96] text-white">
          <UserCheck className="size-3.5 mr-1.5" /> রোল সংরক্ষণ করুন
        </Button>
      </form>

      <div className="space-y-2">
        <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">বর্তমান রোলসমূহের তালিকা:</h3>
        <div className="divide-y divide-border rounded border border-border bg-card shadow-sm">
          {rolesList.data?.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3.5">
              <div>
                <p className="text-xs font-mono font-medium text-foreground">{r.user_id}</p>
                <span className="inline-block mt-1 rounded bg-[#2271b1]/10 px-2 py-0.5 text-[10px] font-bold text-[#2271b1]">
                  {r.role}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete Role"
                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                onClick={() => removeRole.mutate(r.id)}
              >
                <UserX className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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

function ArticlesAdmin() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ ...EMPTY });
  const [published, setPublished] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [authorId, setAuthorId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
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

      const payload = {
        ...parsed.data,
        title_en: parsed.data.title_en || null,
        excerpt_bn: autoExcerptBn || null,
        excerpt_en: autoExcerptEn || null,
        content_bn: parsed.data.content_bn || null,
        content_en: parsed.data.content_en || null,
        cover_image_url: parsed.data.cover_image_url || null,
        published,
        author_id: authorId || null,
        category_id: categoryId || null,
        published_at: published ? new Date().toISOString() : null,
        created_by: user!.id,
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
      toast.success("আর্টিকেল সফলভাবে সংরক্ষিত হয়েছে");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast.success("আর্টিকেল মুছে ফেলা হয়েছে");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const filteredArticles = list.data?.filter((a) => {
    if (statusFilter === "published") return a.published;
    if (statusFilter === "draft") return !a.published;
    return true;
  });

  const publishedCount = list.data?.filter((a) => a.published).length || 0;
  const draftCount = list.data?.filter((a) => !a.published).length || 0;

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
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="font-semibold text-base">{editingId ? "আর্টিকেল সম্পাদনা করুন" : "নতুন আর্টিকেল লিখুন"}</h2>
          <div className="flex items-center gap-2 text-xs">
            <span className={published ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
              {published ? "প্রকাশিত (Published)" : "খসড়া (Draft)"}
            </span>
            <Switch checked={published} onCheckedChange={setPublished} />
          </div>
        </div>
        {field("slug", "স্লাগ (URL Slug)")}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("title_bn", "শিরোনাম (বাংলা)")}
          {field("title_en", "শিরোনাম (English)")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("excerpt_bn", "সংক্ষিপ্ত বিবরণ (বাংলা)", true)}
          {field("excerpt_en", "সংক্ষিপ্ত বিবরণ (English)", true)}
        </div>
        {field("content_bn", "মূল বিষয়বস্তু (বাংলা)", true)}
        {field("content_en", "মূল বিষয়বস্তু (English)", true)}
        {field("cover_image_url", "কভার ইমেজ লিংক (Cover Image URL)")}
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Button type="submit" disabled={save.isPending} size="sm" className="bg-[#2271b1] hover:bg-[#135e96] text-white">
            <Plus className="size-3.5 mr-1" /> সংরক্ষণ করুন
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingId(null);
                setForm({ ...EMPTY });
              }}
            >
              বাতিল
            </Button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">আর্টিকেল তালিকা</h3>
          
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded px-2.5 py-1 transition-colors ${
                statusFilter === "all"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              সব ({list.data?.length || 0})
            </button>
            <span className="text-border">|</span>
            <button
              type="button"
              onClick={() => setStatusFilter("published")}
              className={`rounded px-2.5 py-1 transition-colors ${
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
              onClick={() => setStatusFilter("draft")}
              className={`rounded px-2.5 py-1 transition-colors ${
                statusFilter === "draft"
                  ? "bg-amber-600 text-white font-semibold"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              খসড়া / Drafts ({draftCount})
            </button>
          </div>
        </div>

        <div className="divide-y divide-border rounded border border-border bg-card shadow-sm">
          {filteredArticles?.length === 0 ? (
            <p className="p-4 text-xs text-muted-foreground text-center">কোনো আর্টিকেল পাওয়া যায়নি।</p>
          ) : (
            filteredArticles?.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3.5 hover:bg-muted/30 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">{a.title_bn}</p>
                  <p className="text-[11px] text-muted-foreground">
                    /{a.slug} ·{" "}
                    <span className={a.published ? "text-emerald-600 font-medium" : "text-amber-600 font-semibold"}>
                      {a.published ? "প্রকাশিত" : "খসড়া (Draft)"}
                    </span>
                  </p>
                </div>

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

                <div className="flex items-center gap-1 ml-2 border-l border-border/60 pl-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    aria-label="সম্পাদনা"
                    onClick={() => {
                      setEditingId(a.id);
                      setPublished(a.published);
                      setAuthorId(a.author_id ?? "");
                      setCategoryId(a.category_id ?? "");
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
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    aria-label="মুছে ফেলুন"
                    onClick={() => remove.mutate(a.id)}
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

const transSchema = z.object({
  surah: z.coerce.number().int().min(1).max(114),
  ayah: z.coerce.number().int().min(1).max(300),
  lang: z.enum(["bn", "en", "bn_std", "en_std"]),
  text: z.string().trim().min(1, "অনুবাদ টেক্সট প্রদান করুন").max(8000),
  note: z.string().trim().max(4000),
});

function TranslationsAdmin() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [surah, setSurah] = useState("1");
  const [ayah, setAyah] = useState("1");
  const [lng, setLng] = useState<"bn" | "en" | "bn_std" | "en_std">("bn");
  const [text, setText] = useState("");
  const [note, setNote] = useState("");

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
      const parsed = transSchema.safeParse({ surah, ayah, lang: lng, text, note });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "সঠিক তথ্য দিন");
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verse-translations"] });
      queryClient.invalidateQueries({ queryKey: ["verse-translations"] });
      setText("");
      setNote("");
      toast.success("অনুবাদ সফলভাবে সংরক্ষণ করা হয়েছে");
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
        <div className="space-y-1.5">
          <Label htmlFor="text" className="text-xs font-semibold">অনুবাদ টেক্সট</Label>
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
        <Button type="submit" disabled={save.isPending} size="sm" className="bg-[#2271b1] hover:bg-[#135e96] text-white">
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
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
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

function SubscribersAdmin() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const list = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("UUID ক্লিপবোর্ডে কপি হয়েছে!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">নিউজলেটার সাবস্ক্রাইবার তালিকা</h2>
        <p className="text-xs text-muted-foreground">
          সাবস্ক্রাইবারের UUID দেখতে পাবেন এবং কপি করে অ্যাডমিন রোলে ব্যবহার করতে পারবেন।
        </p>
      </div>

      <div className="divide-y divide-border rounded border border-border bg-card shadow-sm">
        {list.data?.length === 0 && (
          <p className="p-4 text-xs text-muted-foreground">কোনো সাবস্ক্রাইবার পাওয়া যায়নি</p>
        )}
        {list.data?.map((s) => (
          <div
            key={s.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 text-xs hover:bg-muted/30 transition-colors"
          >
            <div className="space-y-1">
              <span className="font-semibold text-foreground">{s.email}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border/50 select-all">
                  ইউজার আইডি: {s.id}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(s.id)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#2271b1] hover:underline font-medium"
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

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-muted-foreground">
                তারিখ: {new Date(s.created_at).toLocaleDateString("en-GB")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}