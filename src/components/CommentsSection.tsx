import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send, User, Calendar, ShieldCheck, Reply, CornerDownRight, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { usePrefs } from "@/lib/prefs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const commentSchema = z.object({
  name: z.string().trim().min(2, "নাম ন্যূনতম ২ অক্ষরের হতে হবে").max(80),
  email: z.string().trim().email("সঠিক ইমেইল এড্রেস প্রদান করুন").max(120),
  content: z.string().trim().min(2, "মন্তব্য লিখুন").max(2000),
});

// ── Math Challenge helpers ──────────────────────────────────────────────────
interface MathChallenge {
  num1: number;
  num2: number;
  operator: "+" | "-" | "×" | "÷";
  answer: number;
}

function generateMathChallenge(): MathChallenge {
  const ops: Array<"+" | "-" | "×" | "÷"> = ["+", "-", "×", "÷"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let num1 = 0, num2 = 0, answer = 0;

  if (op === "+") {
    answer = Math.floor(Math.random() * 8) + 2;        // 2..9
    num1   = Math.floor(Math.random() * (answer - 1)) + 1;
    num2   = answer - num1;
  } else if (op === "-") {
    num1   = Math.floor(Math.random() * 9) + 1;        // 1..9
    num2   = Math.floor(Math.random() * num1);          // 0..(num1-1)
    answer = num1 - num2;
  } else if (op === "×") {
    const pairs: [number, number, number][] = [
      [1,2,2],[1,3,3],[1,4,4],[1,5,5],[1,6,6],[1,7,7],[1,8,8],[1,9,9],
      [2,2,4],[2,3,6],[2,4,8],[3,3,9],
    ];
    const [a, b, c] = pairs[Math.floor(Math.random() * pairs.length)];
    num1 = a; num2 = b; answer = c;
  } else {
    const pairs: [number, number, number][] = [
      [2,2,1],[3,3,1],[4,4,1],[6,3,2],[8,4,2],[9,3,3],[6,2,3],[8,2,4],[9,9,1],
    ];
    const [a, b, c] = pairs[Math.floor(Math.random() * pairs.length)];
    num1 = a; num2 = b; answer = c;
  }

  return { num1, num2, operator: op, answer };
}

function toEnDigits(str: string): string {
  const bn = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  let res = str;
  bn.forEach((b, idx) => { res = res.replaceAll(b, String(idx)); });
  return res;
}

// ── Sub-component: MathCaptcha ──────────────────────────────────────────────
function MathCaptcha({
  value,
  onChange,
  onRefresh,
  challenge,
  lang,
}: {
  value: string;
  onChange: (v: string) => void;
  onRefresh: () => void;
  challenge: MathChallenge;
  lang: string;
}) {
  return (
    <div className="space-y-1.5 rounded-xl border border-border/70 bg-muted/20 p-3">
      <div className="flex items-center justify-between text-xs">
        <Label className="font-semibold text-foreground flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-primary" />
          <span>{lang === "bn" ? "নিরাপত্তা যাচাই (Human Verification)" : "Security Verification"}</span>
        </Label>
        <button
          type="button"
          onClick={onRefresh}
          className="text-muted-foreground hover:text-primary transition-colors p-1 cursor-pointer flex items-center gap-1 text-[11px]"
          title={lang === "bn" ? "নতুন প্রশ্ন আনুন" : "Generate new question"}
        >
          <RefreshCw className="size-3" />
          <span>{lang === "bn" ? "নতুন প্রশ্ন" : "Reload"}</span>
        </button>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="flex items-center justify-center rounded-lg bg-card border border-border px-3.5 py-1.5 font-mono text-sm font-bold text-foreground select-none shadow-xs tracking-wider">
          {`${challenge.num1} ${challenge.operator} ${challenge.num2} = ?`}
        </div>
        <Input
          type="text"
          inputMode="numeric"
          required
          maxLength={2}
          placeholder={lang === "bn" ? "উত্তর লিখুন (যেমন: 5)" : "Enter answer (e.g. 5)"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 text-xs rounded-lg flex-1 font-mono"
        />
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
interface CommentsSectionProps {
  articleId: string;
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const { lang } = usePrefs();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState<MathChallenge>(() => generateMathChallenge());

  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyName, setReplyName] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const [replyCaptchaInput, setReplyCaptchaInput] = useState("");
  const [replyCaptcha, setReplyCaptcha] = useState<MathChallenge>(() => generateMathChallenge());

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateMathChallenge());
    setCaptchaInput("");
  }, []);

  const refreshReplyCaptcha = useCallback(() => {
    setReplyCaptcha(generateMathChallenge());
    setReplyCaptchaInput("");
  }, []);

  // কমেন্ট লিস্ট ফেচিং
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", articleId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .eq("article_id", articleId)
          .order("created_at", { ascending: true });
        if (error) return [];
        return data || [];
      } catch {
        return [];
      }
    },
    enabled: Boolean(articleId),
  });

  // কমেন্ট / রিপ্লাই সাবমিশন
  const submitComment = useMutation({
    mutationFn: async ({
      author_name,
      author_email,
      commentText,
      parent_id,
    }: {
      author_name: string;
      author_email: string;
      commentText: string;
      parent_id?: string | null;
    }) => {
      const parsed = commentSchema.safeParse({
        name: author_name,
        email: author_email,
        content: commentText,
      });

      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message);
      }

      const { error } = await supabase.from("comments").insert({
        article_id: articleId,
        author_name: parsed.data.name,
        author_email: parsed.data.email,
        content: parsed.data.content,
        parent_id: parent_id || null,
      });

      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
      if (vars.parent_id) {
        setReplyingTo(null);
        setReplyContent("");
        setReplyName("");
        setReplyEmail("");
        setReplyCaptchaInput("");
        setReplyCaptcha(generateMathChallenge());
      } else {
        setName("");
        setEmail("");
        setContent("");
        setCaptchaInput("");
        setCaptcha(generateMathChallenge());
      }
      toast.success(
        lang === "en" ? "Comment submitted successfully!" : "মন্তব্য সফলভাবে প্রকাশিত হয়েছে!"
      );
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  // ── Main form submit ────────────────────────────────────────────────────
  const handleMainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userAnswer = parseInt(toEnDigits(captchaInput.trim()), 10);
    if (isNaN(userAnswer) || userAnswer !== captcha.answer) {
      toast.error(lang === "bn" ? "নিরাপত্তা প্রশ্নের উত্তর ভুল হয়েছে। পুনরায় চেষ্টা করুন।" : "Incorrect answer. Please try again.");
      refreshCaptcha();
      return;
    }
    submitComment.mutate({ author_name: name, author_email: email, commentText: content, parent_id: null });
  };

  // ── Reply form submit ───────────────────────────────────────────────────
  const handleReplySubmit = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    const userAnswer = parseInt(toEnDigits(replyCaptchaInput.trim()), 10);
    if (isNaN(userAnswer) || userAnswer !== replyCaptcha.answer) {
      toast.error(lang === "bn" ? "নিরাপত্তা প্রশ্নের উত্তর ভুল হয়েছে। পুনরায় চেষ্টা করুন।" : "Incorrect answer. Please try again.");
      refreshReplyCaptcha();
      return;
    }
    submitComment.mutate({ author_name: replyName, author_email: replyEmail, commentText: replyContent, parent_id: parentId });
  };

  if (!isClient) return null;

  // প্যারেন্ট কমেন্ট ও রিপ্লাই পৃথক করা
  const rootComments = comments.filter((c: any) => !c.parent_id);
  const repliesMap = comments.reduce((acc: any, c: any) => {
    if (c.parent_id) {
      if (!acc[c.parent_id]) acc[c.parent_id] = [];
      acc[c.parent_id].push(c);
    }
    return acc;
  }, {});

  return (
    <section className="mt-14 border-t border-border/70 pt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="size-5 text-[#2A6F97] dark:text-[#58b4e8]" />
        <h3 className="text-xl font-bold font-serif text-foreground">
          {lang === "en" ? `Comments (${comments.length})` : `মন্তব্যসমূহ (${comments.length})`}
        </h3>
      </div>

      {/* মূল কমেন্ট ফর্ম */}
      <form onSubmit={handleMainSubmit} className="card-soft p-5 sm:p-6 mb-10 space-y-4">
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

        {/* Math Challenge */}
        <MathCaptcha
          challenge={captcha}
          value={captchaInput}
          onChange={setCaptchaInput}
          onRefresh={refreshCaptcha}
          lang={lang}
        />

        <Button
          type="submit"
          disabled={submitComment.isPending}
          className="bg-[#2A6F97] hover:bg-[#1f5575] text-white text-xs font-semibold px-5 cursor-pointer"
        >
          {submitComment.isPending ? (
            lang === "bn" ? "সংরক্ষণ হচ্ছে..." : "Submitting..."
          ) : (
            <>
              <Send className="size-3.5 mr-1.5" />
              {lang === "en" ? "Post Comment" : "মন্তব্য প্রকাশ করুন"}
            </>
          )}
        </Button>
      </form>

      {/* কমেন্ট ও রিপ্লাই তালিকা */}
      {isLoading ? (
        <p className="text-xs text-muted-foreground">{lang === "en" ? "Loading comments..." : "মন্তব্য লোড হচ্ছে..."}</p>
      ) : rootComments.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">
          {lang === "en" ? "No comments yet. Be the first to comment!" : "এখনো কোনো মন্তব্য করা হয়নি। প্রথম মন্তব্যটি আপনিই করুন!"}
        </p>
      ) : (
        <div className="space-y-4">
          {rootComments.map((c: any) => {
            const replies = repliesMap[c.id] || [];
            const isReplying = replyingTo?.id === c.id;

            return (
              <div key={c.id} className="rounded-xl border border-border/60 bg-card p-4 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
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

                {/* উত্তর দেওয়ার টগল বাটন */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (isReplying) {
                        setReplyingTo(null);
                      } else {
                        setReplyingTo({ id: c.id, name: c.author_name });
                        setReplyName(name);
                        setReplyEmail(email);
                        setReplyCaptchaInput("");
                        setReplyCaptcha(generateMathChallenge());
                      }
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2A6F97] hover:underline dark:text-[#58b4e8] cursor-pointer"
                  >
                    {isReplying ? (
                      <><X className="size-3" /> বাতিল</>
                    ) : (
                      <><Reply className="size-3" /> উত্তর দিন (Reply)</>
                    )}
                  </button>
                </div>

                {/* ইনলাইন রিপ্লাই ফর্ম */}
                {isReplying && (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, c.id)}
                    className="mt-3 rounded-lg border border-border/80 bg-muted/30 p-3 space-y-3"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                      <span>উত্তর দিচ্ছেন: @{c.author_name}</span>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <Input
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                        placeholder="আপনার নাম *"
                        required
                        className="h-8 text-xs bg-card"
                      />
                      <Input
                        type="email"
                        value={replyEmail}
                        onChange={(e) => setReplyEmail(e.target.value)}
                        placeholder="আপনার ইমেইল *"
                        required
                        className="h-8 text-xs bg-card"
                      />
                    </div>

                    <Textarea
                      rows={2}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="আপনার উত্তর লিখুন..."
                      required
                      className="text-xs bg-card"
                    />

                    {/* Reply Math Challenge */}
                    <MathCaptcha
                      challenge={replyCaptcha}
                      value={replyCaptchaInput}
                      onChange={setReplyCaptchaInput}
                      onRefresh={refreshReplyCaptcha}
                      lang={lang}
                    />

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setReplyingTo(null)}
                      >
                        বাতিল
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={submitComment.isPending}
                        className="h-7 bg-[#2A6F97] text-white text-xs"
                      >
                        {submitComment.isPending ? "পাঠানো হচ্ছে..." : "উত্তর পোস্ট করুন"}
                      </Button>
                    </div>
                  </form>
                )}

                {/* নেস্টেড রিপ্লাইসমূহ */}
                {replies.length > 0 && (
                  <div className="mt-3 space-y-2.5 border-l-2 border-[#2A6F97]/40 pl-3 pt-2">
                    {replies.map((reply: any) => (
                      <div key={reply.id} className="rounded-lg bg-muted/40 p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground inline-flex items-center gap-1">
                            <CornerDownRight className="size-3 text-[#2A6F97] dark:text-[#58b4e8]" />
                            {reply.author_name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(reply.created_at).toLocaleDateString(
                              lang === "en" ? "en-US" : "bn-BD",
                              { year: "numeric", month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>
                        <p className="text-foreground/90 font-serif leading-relaxed pt-0.5">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}