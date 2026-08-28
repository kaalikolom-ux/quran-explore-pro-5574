import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="উপরে ফিরে যান"
            className="fixed bottom-6 right-6 z-50 flex size-11 items-center justify-center rounded-xl border border-border/80 bg-card/90 text-foreground backdrop-blur-md shadow-lg transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer group animate-in fade-in zoom-in-90 duration-300"
          >
            <ArrowUp className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8} className="font-medium text-xs shadow-md">
          উপরে ফিরে যান
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
