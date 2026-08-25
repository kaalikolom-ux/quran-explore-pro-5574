import { useEffect } from "react";

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

const CRISP_WEBSITE_ID = "d9f782c1-a040-4e66-8c9b-fb35eb0f22c5";

export function LiveChat() {
  useEffect(() => {
    if (!CRISP_WEBSITE_ID) return;

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;

    // উইজেটকে স্ক্রিনের বাম পাশের নিচে (Bottom Left) সেট করা
    window.$crisp.push(["set", "chat:position", ["left"]]);

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      const crispContainer = document.querySelector(".crisp-client");
      if (crispContainer) crispContainer.remove();
    };
  }, []);

  return null;
}
