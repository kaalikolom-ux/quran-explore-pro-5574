import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextProps {
  label: string;
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextWithHtmlEditor({
  label,
  value,
  onChange,
  placeholder = "এখানে বিষয়বস্তু লিখুন...",
  minHeight = "240px",
}: RichTextProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // এডিটর লোড হওয়ার পর বা মোড পরিবর্তন হলে ভ্যালু সিঙ্ক করা
  useEffect(() => {
    if (!isHtmlMode && editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [isHtmlMode, value]);

  const handleCommand = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleVisualInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted-foreground">{label}</label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className={`h-7 px-2.5 text-[11px] gap-1.5 transition-all ${
            isHtmlMode
              ? "bg-amber-400/15 text-amber-400 border-amber-400/40 font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
          title={isHtmlMode ? "ভিজ্যুয়াল প্রিভিউ এডিটরে ফিরুন" : "সরাসরি HTML কোড এডিট করুন"}
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

      <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden focus-within:border-foreground/40 transition-all">
        {/* টুলবার */}
        <div className="flex flex-wrap items-center gap-1 border-b border-border/60 bg-muted/40 p-1.5 px-2">
          {!isHtmlMode ? (
            <>
              <button
                type="button"
                onClick={() => handleCommand("bold")}
                title="বোল্ড (Ctrl+B)"
                className="p-1.5 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors"
              >
                <Bold className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleCommand("italic")}
                title="ইটালিক (Ctrl+I)"
                className="p-1.5 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors"
              >
                <Italic className="size-3.5" />
              </button>
              <div className="h-4 w-px bg-border/80 mx-1" />
              <button
                type="button"
                onClick={() => handleCommand("formatBlock", "<h1>")}
                title="হেডিং ১"
                className="p-1.5 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors"
              >
                <Heading1 className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleCommand("formatBlock", "<h2>")}
                title="হেডিং ২"
                className="p-1.5 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors"
              >
                <Heading2 className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleCommand("formatBlock", "<h3>")}
                title="হেডিং ৩"
                className="p-1.5 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors"
              >
                <Heading3 className="size-3.5" />
              </button>
              <div className="h-4 w-px bg-border/80 mx-1" />
              <button
                type="button"
                onClick={() => handleCommand("insertUnorderedList")}
                title="বুলেট লিস্ট"
                className="p-1.5 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors"
              >
                <List className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleCommand("insertOrderedList")}
                title="নম্বর লিস্ট"
                className="p-1.5 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors"
              >
                <ListOrdered className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleCommand("formatBlock", "<blockquote>")}
                title="কোটেশন"
                className="p-1.5 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors"
              >
                <Quote className="size-3.5" />
              </button>
              <div className="h-4 w-px bg-border/80 mx-1" />
              <button
                type="button"
                onClick={() => handleCommand("undo")}
                title="আন্ডু"
                className="p-1.5 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors"
              >
                <Undo className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleCommand("redo")}
                title="রিডু"
                className="p-1.5 rounded-lg hover:bg-muted text-foreground/80 hover:text-foreground transition-colors"
              >
                <Redo className="size-3.5" />
              </button>
            </>
          ) : (
            <span className="text-[11px] font-mono text-muted-foreground px-1">
              &lt;HTML Code Editor Mode Active&gt;
            </span>
          )}
        </div>

        {/* এডিটর বডি */}
        {isHtmlMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="<p>এখানে সরাসরি HTML কোড পেস্ট বা লিখুন...</p>"
            style={{ minHeight }}
            className="w-full bg-background p-4 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none leading-relaxed resize-y"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleVisualInput}
            onBlur={handleVisualInput}
            style={{ minHeight }}
            data-placeholder={placeholder}
            className="p-4 text-sm text-foreground focus:outline-none leading-relaxed overflow-y-auto empty:before:text-muted-foreground/50 empty:before:content-[attr(data-placeholder)] [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-3 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-2 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/50 [&>blockquote]:pl-4 [&>blockquote]:italic"
          />
        )}
      </div>
    </div>
  );
}