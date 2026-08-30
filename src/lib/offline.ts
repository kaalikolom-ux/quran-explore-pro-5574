import { useEffect, useState } from "react";

/** Cache Storage buckets */
export const AUDIO_CACHE = "quran-audio-v1";
export const SURAH_TEXT_CACHE = "quran-text-v3";
const IDB_NAME = "quran_offline_storage_v2";
const AUDIO_STORE = "offline_audio";
const SURAH_STORE = "offline_surahs";

/** IndexedDB helper with ArrayBuffer storage for 100% cross-platform support */
function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return reject(new Error("IndexedDB not supported"));
    }
    const request = indexedDB.open(IDB_NAME, 1);
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

/** Save audio binary data to both Cache Storage and IndexedDB (as ArrayBuffer) */
export async function saveAudioOffline(url: string, data: Blob | ArrayBuffer): Promise<void> {
  let arrayBuffer: ArrayBuffer;
  let audioBlob: Blob;

  if (data instanceof Blob) {
    arrayBuffer = await data.arrayBuffer();
    audioBlob = data.type === "audio/mpeg" ? data : new Blob([arrayBuffer], { type: "audio/mpeg" });
  } else {
    arrayBuffer = data;
    audioBlob = new Blob([arrayBuffer], { type: "audio/mpeg" });
  }

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

  // 2. IndexedDB (Stores ArrayBuffer to avoid Safari/WebView DataCloneError)
  try {
    const db = await openOfflineDB();
    const tx = db.transaction(AUDIO_STORE, "readwrite");
    tx.objectStore(AUDIO_STORE).put({ url, buffer: arrayBuffer, timestamp: Date.now() });
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
        if (buffer && buffer.byteLength > 100) {
          const blob = new Blob([buffer], { type: "audio/mpeg" });
          return URL.createObjectURL(blob);
        }
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
    if (item && item.buffer && item.buffer.byteLength > 100) {
      const blob = new Blob([item.buffer], { type: "audio/mpeg" });
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

/** Fetch audio file with fallback mirrors */
async function fetchAudioBlob(url: string): Promise<Blob> {
  const mirrors = [
    url,
    url.replace("everyayah.com/data", "audio.qurancdn.com"),
    url.replace("https://everyayah.com/data/", "https://mirrors.quranicaudio.com/everyayah/"),
  ];

  for (const mirror of mirrors) {
    try {
      const res = await fetch(mirror, { mode: "cors" });
      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 500) return blob;
      }
    } catch {}
  }
  throw new Error(`Failed to fetch audio from all mirrors for ${url}`);
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
      const blob = await fetchAudioBlob(url);
      await saveAudioOffline(url, blob);
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
