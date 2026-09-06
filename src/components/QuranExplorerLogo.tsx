import React from "react";

interface QuranExplorerLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function QuranExplorerLogo({ className = "", size = "md" }: QuranExplorerLogoProps) {
  const heightClass = {
    sm: "h-5 sm:h-6",
    md: "h-5.5 sm:h-7.5",
    lg: "h-8 sm:h-10",
  }[size];

  return (
    <div className={`inline-flex items-center shrink-0 select-none ${className}`}>
      {/* Light Mode Logo */}
      <img
        src="/logo-light.png"
        srcSet="/logo-light.png 1x, /logo-light@2x.png 2x"
        alt="Qur'an Explorer"
        width="240"
        height="44"
        className={`w-auto ${heightClass} object-contain dark:hidden block select-none`}
        loading="eager"
        decoding="async"
      />
      {/* Dark Mode Logo */}
      <img
        src="/logo-dark.png"
        srcSet="/logo-dark.png 1x, /logo-dark@2x.png 2x"
        alt="Qur'an Explorer"
        width="240"
        height="44"
        className={`w-auto ${heightClass} object-contain dark:block hidden select-none`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
