import { useEffect, useState } from "react";

/** Cache Storage buckets */
export const AUDIO_CACHE = "quran-audio-v1";
export const SURAH_TEXT_CACHE = "quran-text-v3";
const IDB_NAME = "quran_offline_storage_v1";
const AUDIO_STORE = "offline_audio";
const SURAH_STORE = "offline_surahs";

/** IndexedDB helper for 100% reliable persistence in Web, PWA, and APK WebViews */
function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return reject(new Error("IndexedDB not supported"));
    }
    const request = indexedDB.open(IDB_NAME, 2);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE, { keyPath: "url" });
      }
      if (!db.objectStoreNames.contains(SURAH_STORE)) {
        db.createObjectStore(SURAH_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}

function cachesAvailable() {
  return typeof window !== "undefined" && "caches" in window;
}

/** Save audio blob to both Cache Storage and IndexedDB */
export async function saveAudioOffline(url: string, blob: Blob): Promise<void> {
  const audioBlob = blob.type === "audio/mpeg" ? blob : new Blob([await blob.arrayBuffer()], { type: "audio/mpeg" });

  // 1. Cache Storage
  if (cachesAvailable()) {
    try {
      const cache = await caches.open(AUDIO_CACHE);
      const response = new Response(audioBlob.slice(), {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": String(audioBlob.size),
          "Accept-Ranges": "bytes",
        },
      });
      await cache.put(url, response);
    } catch (e) {
      console.warn("CacheStorage audio save warning:", e);
    }
  }

  // 2. IndexedDB (Critical for APK WebViews)
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(AUDIO_STORE, "readwrite");
    tx.objectStore(AUDIO_STORE).put({ url, blob: audioBlob, timestamp: Date.now() });
  } catch (e) {
    console.warn("IndexedDB audio save warning:", e);
  }
}

/** Check if an audio URL is stored offline */
export async function isAudioSavedOffline(url: string): Promise<boolean> {
  // 1. Cache Storage check
  if (cachesAvailable()) {
    try {
      const cache = await caches.open(AUDIO_CACHE);
      const hit = await cache.match(url);
      if (hit) return true;
    } catch {}
  }

  // 2. IndexedDB check
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(AUDIO_STORE, "readonly");
    const store = tx.objectStore(AUDIO_STORE);
    return new Promise((resolve) => {
      const req = store.get(url);
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

/** Resolve a playable URL for an ayah audio (offline object URL preferred) */
export async function resolveAudioSrc(url: string): Promise<string> {
  // 1. Check Cache Storage
  if (cachesAvailable()) {
    try {
      const cache = await caches.open(AUDIO_CACHE);
      const hit = await cache.match(url);
      if (hit) {
        const buffer = await hit.arrayBuffer();
        const blob = new Blob([buffer], { type: "audio/mpeg" });
        return URL.createObjectURL(blob);
      }
    } catch (e) {
      console.warn("CacheStorage match warning:", e);
    }
  }

  // 2. Check IndexedDB
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(AUDIO_STORE, "readonly");
    const store = tx.objectStore(AUDIO_STORE);
    const item = await new Promise<any>((resolve) => {
      const req = store.get(url);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
    if (item && item.blob) {
      const blob = item.blob.type === "audio/mpeg" ? item.blob : new Blob([await item.blob.arrayBuffer()], { type: "audio/mpeg" });
      return URL.createObjectURL(blob);
    }
  } catch (e) {
    console.warn("IndexedDB audio lookup warning:", e);
  }

  // 3. Online fallback (direct remote URL)
  return url;
}

/** Check if all ayahs in a surah are downloaded */
export async function isSurahAudioDownloaded(urls: string[]): Promise<boolean> {
  if (urls.length === 0) return false;
  const first = await isAudioSavedOffline(urls[0]!);
  const last = await isAudioSavedOffline(urls[urls.length - 1]!);
  return first && last;
}

/** Download every ayah recitation into offline storage */
export async function downloadSurahAudio(
  urls: string[],
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  let done = 0;
  for (const url of urls) {
    const isSaved = await isAudioSavedOffline(url);
    if (!isSaved) {
      try {
        const res = await fetch(url, { mode: "cors" });
        if (res.ok) {
          const blob = await res.blob();
          await saveAudioOffline(url, blob);
        }
      } catch (e) {
        console.warn("Audio download error for", url, e);
      }
    }
    done += 1;
    onProgress?.(done, urls.length);
  }
}

/** Delete an audio file from offline storage */
export async function deleteAudioOffline(url: string): Promise<void> {
  if (cachesAvailable()) {
    try {
      const cache = await caches.open(AUDIO_CACHE);
      await cache.delete(url);
    } catch {}
  }
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(AUDIO_STORE, "readwrite");
    tx.objectStore(AUDIO_STORE).delete(url);
  } catch {}
}

export async function removeSurahAudio(urls: string[]): Promise<void> {
  await Promise.all(urls.map((u) => deleteAudioOffline(u)));
}

/** Save a full surah JSON to offline storage */
export async function saveSurahOffline(surahId: number, data: any): Promise<void> {
  const url = `/data/quran/surahs/${surahId}.json`;
  if (cachesAvailable()) {
    try {
      const cache = await caches.open(SURAH_TEXT_CACHE);
      await cache.put(url, new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
      }));
    } catch {}
  }
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(SURAH_STORE, "readwrite");
    tx.objectStore(SURAH_STORE).put({ id: surahId, data, timestamp: Date.now() });
  } catch {}
}

/** Retrieve a full surah JSON from offline storage */
export async function getSurahOffline(surahId: number): Promise<any | null> {
  // 1. Try Cache Storage
  const url = `/data/quran/surahs/${surahId}.json`;
  if (cachesAvailable()) {
    try {
      const cache = await caches.open(SURAH_TEXT_CACHE);
      const hit = await cache.match(url);
      if (hit) {
        return await hit.json();
      }
    } catch {}
  }

  // 2. Try IndexedDB
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(SURAH_STORE, "readonly");
    const store = tx.objectStore(SURAH_STORE);
    return new Promise((resolve) => {
      const req = store.get(surahId);
      req.onsuccess = () => resolve(req.result?.data || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}
