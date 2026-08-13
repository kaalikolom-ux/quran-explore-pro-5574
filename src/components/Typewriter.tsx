import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
}

export function Typewriter({
  text,
  speed = 100,
  delay = 600,
  className = "",
  cursor = true,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(cursor);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let i = 0;

    const start = setTimeout(() => {
      const tick = () => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i += 1;
          timeout = setTimeout(tick, speed);
        } else {
          setShowCursor(false);
        }
      };
      tick();
    }, delay);

    return () => {
      clearTimeout(start);
      clearTimeout(timeout);
    };
  }, [text, speed, delay]);

  return (
    <span className={className} aria-label={text}>
      {displayed}
      {showCursor && (
        <span className="inline-block w-[0.05em] animate-pulse bg-current align-baseline">
          &nbsp;
        </span>
      )}
    </span>
  );
}
