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
  if (typeof window === "undefined") return;

  // 1. Purge all browser caches
  if ("caches" in window) {
    try {
      const keys = await caches.keys();
      for (const k of keys) {
        await caches.delete(k);
      }
    } catch {}
  }

  // 2. Unregister any service workers to ensure users always receive latest live updates
  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));
    } catch (e) {
      console.warn("Failed to unregister SW:", e);
    }
  }
}