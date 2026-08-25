import { useState, useEffect } from "react";

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

export function Typewriter({
  words,
  typingSpeed = 90,
  deletingSpeed = 50,
  delayBetweenWords = 1500,
}: TypewriterProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[wordIndex % words.length];

    const handleTyping = () => {
      if (!isDeleting) {
        if (text.length < currentWord.length) {
          setText(currentWord.slice(0, text.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), delayBetweenWords);
        }
      } else {
        if (text.length > 0) {
          setText(currentWord.slice(0, text.length - 1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(handleTyping, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <span className="inline-block overflow-visible py-1">
      {/* bg-clip-text বাদ দিয়ে স্পষ্ট ও পূর্ণাঙ্গ গ্লিফ রেন্ডারিং */}
      <span className="text-amber-300 drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]">
        {text}
      </span>
      <span className="animate-pulse font-normal text-amber-300/80 ms-1 select-none">
        |
      </span>
    </span>
  );
}