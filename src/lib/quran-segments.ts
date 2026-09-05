export type WordSegment = [position: number, startMs: number, endMs: number];
export type SurahSegmentsMap = Record<number, WordSegment[]>;

const segmentsCache = new Map<number, Promise<SurahSegmentsMap | null>>();

/**
 * Loads word timing segments for a given Surah.
 * Tries local bundled assets first (/data/quran/segments/${surahId}.json),
 * and falls back to Quran.com API if not present.
 */
export async function getSurahSegments(surahId: number): Promise<SurahSegmentsMap | null> {
  if (segmentsCache.has(surahId)) {
    return segmentsCache.get(surahId)!;
  }

  const promise = (async (): Promise<SurahSegmentsMap | null> => {
    try {
      // 1. Try local bundled segment asset
      const res = await fetch(`/data/quran/segments/${surahId}.json`);
      if (res.ok) {
        return (await res.json()) as SurahSegmentsMap;
      }
    } catch (e) {
      console.warn(`Local segment load failed for surah ${surahId}, trying API fallback...`, e);
    }

    try {
      // 2. Fallback to api.quran.com on-demand
      const apiRes = await fetch(
        `https://api.quran.com/api/v4/verses/by_chapter/${surahId}?audio=7&per_page=300`
      );
      if (apiRes.ok) {
        const data = await apiRes.json();
        const map: SurahSegmentsMap = {};
        for (const v of data.verses || []) {
          const rawSegments = v.audio?.segments || [];
          map[v.verse_number] = rawSegments.map((s: number[]) => [s[1], s[2], s[3]]);
        }
        return map;
      }
    } catch (apiErr) {
      console.error(`Failed to load audio segments for surah ${surahId}:`, apiErr);
    }

    return null;
  })();

  segmentsCache.set(surahId, promise);
  return promise;
}

/**
 * Given the current playback position in milliseconds and the list of segments for an Ayah,
 * returns the word position (1-indexed) currently being recited.
 * Includes boundary smoothing to prevent flicker during brief micro-silences between words.
 */
export function findActiveWordPosition(
  segments: WordSegment[] | undefined,
  currentMs: number
): number | null {
  if (!segments || segments.length === 0) return null;

  for (let i = 0; i < segments.length; i++) {
    const [pos, start, end] = segments[i];
    // Use the start of the next segment as the upper boundary if available,
    // plus a small 40ms buffer to seamlessly bridge micro-gaps.
    const nextStart = segments[i + 1] ? segments[i + 1][1] : end + 40;

    if (currentMs >= start && currentMs < nextStart) {
      return pos;
    }
  }

  return null;
}
