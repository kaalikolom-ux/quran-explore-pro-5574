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
  Eraser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

// ফেসবুক, হোয়াটসঅ্যাপ, ওয়ার্ড ও চ্যাটজিপিটি থেকে পেস্ট করা টেক্সট ও মার্কডাউনকে ক্লিন HTML-এ রূপান্তর
function formatInlineText(str: string): string {
  return str
    // **bold** বা __bold__ -> <strong>
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    // *italic* বা _italic_ -> <em>
    .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    // [text](url) -> <a>
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>')
    // Standalone URLs -> <a>
    .replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$2</a>');
}

function sanitizeAndFormatContent(rawText: string): string {
  if (!rawText) return "";

  // ১. অদৃশ্য ক্ষতিকর চিহ্ন, জিরো-উইডথ স্পেস ও অপ্রয়োজনীয় ক্যারেক্টার ক্লিন করা
  const text = rawText
    .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g, "")
    .replace(/\u00A0/g, " ");

  // ২. প্যারাগ্রাফ ও ব্লককোট আলাদা করা
  const rawBlocks = text.split(/\r?\n\r?\n+/);
  const htmlBlocks: string[] = [];

  for (let block of rawBlocks) {
    block = block.trim();
    if (!block) continue;

    // ব্লককোট হ্যান্ডলিং (> "...")
    if (block.startsWith(">")) {
      const quoteLines = block
        .split(/\r?\n/)
        .map((l) => formatInlineText(l.replace(/^>\s*/, "").trim()))
        .filter(Boolean)
        .join("<br>");
      htmlBlocks.push(`<blockquote><p>${quoteLines}</p></blockquote>`);
      continue;
    }

    // হেডিং হ্যান্ডলিং
    if (block.startsWith("### ")) {
      htmlBlocks.push(`<h3>${formatInlineText(block.replace(/^###\s+/, ""))}</h3>`);
      continue;
    }
    if (block.startsWith("## ")) {
      htmlBlocks.push(`<h2>${formatInlineText(block.replace(/^##\s+/, ""))}</h2>`);
      continue;
    }
    if (block.startsWith("# ")) {
      htmlBlocks.push(`<h1>${formatInlineText(block.replace(/^#\s+/, ""))}</h1>`);
      continue;
    }

    // সাধারণ প্যারাগ্রাফ
    const lines = block
      .split(/\r?\n/)
      .map((l) => formatInlineText(l.trim()))
      .join("<br>");
    htmlBlocks.push(`<p>${lines}</p>`);
  }

  return htmlBlocks.join("");
}

  // ব্লগার, ফেসবুক, ওয়ার্ড ইত্যাদি থেকে পেস্ট করার সময় বাজে ব্যাকগ্রাউন্ড ও অনাকাঙ্ক্ষিত চিহ্ন অটো-ক্লিন করা
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const textData = clipboardData.getData("text/plain");
    const htmlData = clipboardData.getData("text/html");

    // যদি প্লেইন টেক্সটে মার্কডাউন সিনট্যাক্স (** বা > বা #) থাকে অথবা সরাসরি ফেসবুক থেকে কপি করা টেক্সট হয়
    if (textData && (textData.includes("**") || textData.includes(">") || textData.includes("http") || !htmlData)) {
      const cleanHtml = sanitizeAndFormatContent(textData);
      document.execCommand("insertHTML", false, cleanHtml);
    } else if (htmlData) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlData, "text/html");

      // সব উপাদান থেকে background-color, color, font-family মুছে ফেলা
      doc.body.querySelectorAll("*").forEach((node) => {
        if (node instanceof HTMLElement) {
          node.style.backgroundColor = "";
          node.style.background = "";
          node.style.color = "";
          node.style.fontFamily = "";
          node.style.fontSize = "";
          node.style.lineHeight = "";
          node.removeAttribute("class");
          if (!node.getAttribute("style")?.trim()) {
            node.removeAttribute("style");
          }
        }
      });

      // টেক্সটের মাঝে লুকিয়ে থাকা **bold** বা > কোটেশন কনভার্ট করা
      let innerHtml = doc.body.innerHTML;
      innerHtml = innerHtml
        .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g, "")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      document.execCommand("insertHTML", false, innerHtml);
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // পুরো লেখার ব্যাকগ্রাউন্ড ও অবাঞ্ছিত ফরম্যাট ক্লিন করার ফাংশন
  const handleCleanFormatting = () => {
    if (!editorRef.current) return;
    const currentText = editorRef.current.innerText || editorRef.current.textContent || "";
    if (!currentText.trim()) return;

    // সম্পূর্ণ টেক্সটকে ফ্রেশ ও ক্লিন HTML-এ কনভার্ট করা
    const cleaned = sanitizeAndFormatContent(currentText);
    editorRef.current.innerHTML = cleaned;
    onChange(cleaned);
    toast.success("অপ্রয়োজনীয় চিহ্ন, ব্যাকগ্রাউন্ড ও ফরম্যাটিং নিখুঁতভাবে ক্লিন করা হয়েছে!");
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
              <div className="h-4 w-px bg-border/80 mx-1" />
              <button
                type="button"
                onClick={handleCleanFormatting}
                title="কপি-পেস্ট করা লেখার অনাকাঙ্ক্ষিত ব্যাকগ্রাউন্ড ও কালার ফরম্যাট ক্লিন করুন"
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-medium transition-colors cursor-pointer"
              >
                <Eraser className="size-3.5" />
                <span>ফরম্যাট ক্লিন করুন</span>
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
            onPaste={handlePaste}
            style={{ minHeight }}
            data-placeholder={placeholder}
            className="p-4 text-sm text-foreground focus:outline-none leading-relaxed overflow-y-auto empty:before:text-muted-foreground/50 empty:before:content-[attr(data-placeholder)] [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-3 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-2 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/50 [&>blockquote]:pl-4 [&>blockquote]:italic"
          />
        )}
      </div>
    </div>
  );
}