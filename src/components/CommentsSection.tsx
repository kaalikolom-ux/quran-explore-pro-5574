import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send, User, Calendar, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// আপনার ক্লাউডফ্লেয়ার ড্যাশবোর্ডের আসল Site Key
const TURNSTILE_SITE_KEY = "0x4AAAAAAAEcl9MvISJdu3ipW";

const commentSchema = z.object({
  name: z.string().trim().min(2, "নাম ন্যূনতম ২ অক্ষরের হতে হবে").max(80),
  email: z.string().trim().email("সঠিক ইমেইল এড্রেস প্রদান করুন").max(120),
  content: z.string().trim().min(3, "মন্তব্য লিখুন").max(2000),
});

interface CommentsSectionProps {
  articleId: string;
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const { lang, dark } = usePrefs();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Turnstile Widget Loader
  useEffect(() => {
    if (!isClient || typeof window === "undefined") return;

    const renderWidget = () => {
      const w = window as any;
      if (w.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          widgetIdRef.current = w.turnstile.render(containerRef.current, {
            sitekey: TURNSTILE_SITE_KEY,
            theme: dark ? "dark" : "light",
            callback: (token: string) => setTurnstileToken(token),
            "expired-callback": () => setTurnstileToken(null),
            "error-callback": () => setTurnstileToken(null),
          });
        } catch {
          // ignore
        }
      }
    };

    let script = document.getElementById("cf-turnstile-script") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "cf-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    } else {
      renderWidget();
    }

    return () => {
      const w = window as any;
      if (widgetIdRef.current && w.turnstile) {
        try {
          w.turnstile.reset(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [dark, isClient]);

  // কমেন্ট লিস্ট ফেচিং
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", articleId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .eq("article_id", articleId)
          .order("created_at", { ascending: false });
        if (error) return [];
        return data || [];
      } catch {
        return [];
      }
    },
    enabled: Boolean(articleId),
  });

  const submitComment = useMutation({
    mutationFn: async () => {
      const parsed = commentSchema.safeParse({ name, email, content });
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message);
      }

      const { error } = await supabase.from("comments").insert({
        article_id: articleId,
        author_name: parsed.data.name,
        author_email: parsed.data.email,
        content: parsed.data.content,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
      setName("");
      setEmail("");
      setContent("");
      setTurnstileToken(null);
      const w = window as any;
      if (widgetIdRef.current && w.turnstile) {
        w.turnstile.reset(widgetIdRef.current);
      }
      toast.success(
        lang === "en" ? "Comment posted successfully!" : "আপনার মন্তব্য সফলভাবে প্রকাশিত হয়েছে!"
      );
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitComment.mutate();
  };

  if (!isClient) return null;

  return (
    <section className="mt-14 border-t border-border/70 pt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="size-5 text-[#2A6F97] dark:text-[#58b4e8]" />
        <h3 className="text-xl font-bold font-serif text-foreground">
          {lang === "en" ? `Comments (${comments.length})` : `মন্তব্যসমূহ (${comments.length})`}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="card-soft p-5 sm:p-6 mb-10 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="author-name" className="text-xs font-semibold">
              {lang === "en" ? "Your Name" : "আপনার নাম"} *
            </Label>
            <Input
              id="author-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "en" ? "Enter your name" : "নাম লিখুন..."}
              required
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="author-email" className="text-xs font-semibold">
              {lang === "en" ? "Email Address" : "ইমেইল এড্রেস"} *
            </Label>
            <Input
              id="author-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={lang === "en" ? "name@example.com" : "আপনার ইমেইল..."}
              required
              className="text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="comment-text" className="text-xs font-semibold">
            {lang === "en" ? "Comment" : "মন্তব্য"} *
          </Label>
          <Textarea
            id="comment-text"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              lang === "en" ? "Write your comment here..." : "আপনার মূল্যবান মন্তব্য লিখুন..."
            }
            required
            className="text-xs leading-relaxed"
          />
        </div>

        <div className="pt-1 flex flex-col gap-1.5">
          <div ref={containerRef} className="min-h-[65px]" />
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>Cloudflare Turnstile দ্বারা সুরক্ষিত</span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitComment.isPending}
          className="bg-[#2A6F97] hover:bg-[#1f5575] text-white text-xs font-semibold px-5 cursor-pointer"
        >
          {submitComment.isPending ? (
            "সংরক্ষণ হচ্ছে..."
          ) : (
            <>
              <Send className="size-3.5 mr-1.5" />
              {lang === "en" ? "Post Comment" : "মন্তব্য প্রকাশ করুন"}
            </>
          )}
        </Button>
      </form>

      {isLoading ? (
        <p className="text-xs text-muted-foreground">{lang === "en" ? "Loading comments..." : "মন্তব্য লোড হচ্ছে..."}</p>
      ) : comments.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">
          {lang === "en" ? "No comments yet. Be the first to comment!" : "এখনো কোনো মন্তব্য করা হয়নি। প্রথম মন্তব্যটি আপনিই করুন!"}
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c: any) => (
            <div key={c.id} className="rounded-xl border border-border/60 bg-card p-4 text-xs">
              <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                <span className="font-semibold text-foreground inline-flex items-center gap-1.5">
                  <User className="size-3.5 text-[#2A6F97] dark:text-[#58b4e8]" />
                  {c.author_name}
                </span>
                <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Date(c.created_at).toLocaleDateString(lang === "en" ? "en-US" : "bn-BD", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap font-serif">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}