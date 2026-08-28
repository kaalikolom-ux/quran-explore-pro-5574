/**
 * Service-worker registration guard.
 */
const SW_PATH = "/sw.js";

function previewContext() {
  if (typeof window === "undefined") return true;
  if (window.self !== window.top) return true; // Lovable preview iframe
  const host = window.location.hostname;
  if (host.startsWith("id-preview--") || host.startsWith("preview--")) return true;
  if (host === "lovableproject.com" || host.endsWith(".lovableproject.com")) return true;
  if (host === "lovableproject-dev.com" || host.endsWith(".lovableproject-dev.com")) return true;
  if (host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev")) return true;
  if (new URL(window.location.href).searchParams.get("sw") === "off") return true;
  return false;
}

export async function registerOfflineWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  // Purge old HTML navigation caches so the browser never serves a stale error page
  if ("caches" in window) {
    try {
      const keys = await caches.keys();
      for (const k of keys) {
        if (k.includes("quran-pages")) {
          await caches.delete(k);
        }
      }
    } catch {}
  }

  if (previewContext()) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations
          .filter((r) => (r.active?.scriptURL ?? "").endsWith(SW_PATH))
          .map((r) => r.unregister()),
      );
    } catch (e) {
      console.warn("Failed to unregister preview SW:", e);
    }
    return;
  }

  try {
    const reg = await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
    
    // সাথে সাথে নতুন আপডেট চেক ও এক্টিভ করা
    if (reg.waiting) {
      reg.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    reg.onupdatefound = () => {
      const installingWorker = reg.installing;
      if (installingWorker) {
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
            console.log("New offline content is available; please refresh.");
          }
        };
      }
    };
  } catch (err) {
    console.warn("Service worker registration failed:", err);
  }
}