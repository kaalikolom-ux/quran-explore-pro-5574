import { useState, useEffect } from "react";

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

export function Typewriter({
  words,
  delayBetweenWords = 2800,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (!words || words.length <= 1) return;

    const timer = setInterval(() => {
      // ১. বর্তমান লাইনটি স্মুথলি উপরে রোল আউট ও ফেড আউট হবে
      setIsRolling(true);

      // ২. ৪০০ মিলিসেকেন্ড পর পরবর্তী লাইনটি নিচে থেকে স্মুথলি রোল ইন হবে
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setIsRolling(false);
      }, 400);
    }, delayBetweenWords);

    return () => clearInterval(timer);
  }, [words, delayBetweenWords]);

  if (!words || words.length === 0) return null;

  return (
    <span className="inline-flex items-center overflow-hidden py-1 min-h-[1.4em]">
      <span
        className={`inline-block text-white/85 drop-shadow-md transition-all duration-500 ease-out transform ${
          isRolling
            ? "opacity-0 -translate-y-4 scale-98 blur-[1px]"
            : "opacity-100 translate-y-0 scale-100 blur-0"
        }`}
      >
        {words[index % words.length]}
      </span>
    </span>
  );
}