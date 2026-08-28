import { useState, useEffect } from "react";

interface TypewriterProps {
  words: string[];
  delayBetweenWords?: number;
}

export function Typewriter({
  words,
  delayBetweenWords = 2800,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isTranslated, setIsTranslated] = useState(false);

  // শুধুমাত্র বাংলা ভাষায় অ্যানিমেশন দৃশ্যমান হবে; অন্য যেকোনো ভাষায় হাইড থাকবে
  useEffect(() => {
    const checkTranslation = () => {
      if (typeof document === "undefined") return;
      const isTrans =
        document.documentElement.classList.contains("translated-ltr") ||
        document.documentElement.classList.contains("translated-rtl") ||
        document.body.classList.contains("translated-ltr") ||
        document.body.classList.contains("translated-rtl") ||
        (document.cookie.includes("googtrans=/bn/") && !document.cookie.includes("googtrans=/bn/bn"));
      setIsTranslated(Boolean(isTrans));
    };

    checkTranslation();
    const timer = setInterval(checkTranslation, 300);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isTranslated || !words || words.length === 0) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setFade(true);
      }, 350);
    }, delayBetweenWords);

    return () => clearInterval(interval);
  }, [words, delayBetweenWords, isTranslated]);

  if (isTranslated || !words || words.length === 0) return null;

  return (
    <span className="inline-flex items-center overflow-visible py-1">
      <span
        className={`transition-all duration-350 ease-in-out text-white/80 drop-shadow-sm inline-block ${
          fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1.5"
        }`}
      >
        {words[index % words.length]}
      </span>
      <span className="animate-pulse font-normal text-white/50 ms-1.5 select-none">
        |
      </span>
    </span>
  );
}