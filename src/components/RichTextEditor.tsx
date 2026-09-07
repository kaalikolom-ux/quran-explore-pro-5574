import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  LayoutGrid,
  Sparkles,
  Undo,
  Redo,
  Eye,
  Code2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatArticleContent } from "@/lib/contentFormatter";

export function RichTextEditor({
  value,
  onChange,
  minHeight = "220px",
}: {
  value: string;
  onChange: (val: string) => void;
  minHeight?: string;
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
                      <p><strong>💾 তথ্যের বিষয়বস্তু</strong></p>
                      <ul>
                        <li>নোট বা পয়েন্ট লিখুন...</li>
                      </ul>
                    </div>
                    <p></p>
                  `;
                  editor.chain().focus().insertContent(cardTemplate).run();
                  toast.success("কার্ড বক্স যোগ করা হয়েছে!");
                }}
                title="কার্ড বক্স যুক্ত করুন"
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
                  toast.success("অটো ফরম্যাট সম্পন্ন!");
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
              ? "bg-primary/15 text-primary border-primary/40 font-semibold"
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
            style={{ minHeight }}
            className="prose prose-sm dark:prose-invert max-w-none focus:outline-none [&_.tiptap]:focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
