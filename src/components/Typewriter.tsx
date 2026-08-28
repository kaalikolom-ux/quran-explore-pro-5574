import { useState, useEffect } from "react";

interface TypewriterProps {
  words?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

const DEFAULT_WORDS = [
  "প্রতিটি আয়াত ও শব্দের মর্মার্থ সরাসরি অনুধাবন করুন...",
  "বিজ্ঞান, সৃষ্টিতত্ত্ব ও ইতিহাসের আলোকে কুরআন অধ্যয়ন...",
  "সহজ বাংলা অনুবাদ ও সহিহ তাফসিরের সমন্বয়...",
];

export function Typewriter({
  words = DEFAULT_WORDS,
  typingSpeed = 90,
  deletingSpeed = 50,
  delayBetweenWords = 2500,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(() => (words && words[0] ? words[0].length : 0));
  const [isDeleting, setIsDeleting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Delay animation start until after initial page paint to prevent forced reflow
    const startTimer = setTimeout(() => setStarted(true), 2500);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!started || !words || words.length === 0) return;

    if (subIndex === words[index].length + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), delayBetweenWords);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      },
      isDeleting ? deletingSpeed : typingSpeed,
    );

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, words, typingSpeed, deletingSpeed, delayBetweenWords, started]);

  if (!words || words.length === 0) return null;

  return (
    <span className="inline-flex items-center overflow-visible py-1">
      <span className="text-white/90 drop-shadow-sm">{words[index].substring(0, subIndex)}</span>
      <span className="animate-pulse font-normal text-white/50 ms-1 select-none">|</span>
    </span>
  );
}
