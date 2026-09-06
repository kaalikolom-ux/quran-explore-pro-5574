import { createFileRoute } from "@tanstack/react-router";

const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const CHROMIUM_FULL_VERSION = "143.0.3650.75";

async function generateSecMsGec(): Promise<string> {
  const WIN_EPOCH = 11644473600n;
  const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
  let ticks = (nowSeconds + WIN_EPOCH) * 10000000n;
  ticks -= ticks % 3000000000n; // 5-minute window
  const strToHash = `${ticks}${TRUSTED_CLIENT_TOKEN}`;
  const msgUint8 = new TextEncoder().encode(strToHash);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export async function synthesizeEdgeSpeech(text: string, rawVoice?: string): Promise<Uint8Array> {
  if (!text || text.trim().length === 0) {
    throw new Error("Text is required for speech synthesis");
  }

  // Clean text: strip HTML tags, footnotes like [1], and bracket clutter
  const cleanText = text
    .replace(/<[^>]*>/g, " ")
    .replace(/\[\d+\]/g, "")
    .replace(/[\{\}\[\]\<\>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanText) {
    throw new Error("Text contains no speakable characters");
  }

  const isBengali = /[\u0980-\u09FF]/.test(cleanText);
  // Default to Natural Male Voices:
  // Bangla: bn-BD-PradeepNeural (Male)
  // English: en-US-GuyNeural (Male)
  const voice = rawVoice || (isBengali ? "bn-BD-PradeepNeural" : "en-US-GuyNeural");
  const lang = isBengali ? "bn-BD" : "en-US";

  const secMsGec = await generateSecMsGec();
  const secMsGecVersion = `1-${CHROMIUM_FULL_VERSION}`;
  const connectionId = crypto.randomUUID().replace(/-/g, "");

  const endpointParams = `TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=${secMsGecVersion}&ConnectionId=${connectionId}`;
  const wssUrl = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?${endpointParams}`;
  const httpsUrl = `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?${endpointParams}`;

  const headers = {
    Upgrade: "websocket",
    Connection: "Upgrade",
    Origin: "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0",
  };

  let ws: any;
  const isCloudflare =
    typeof (globalThis as any).WebSocketPair !== "undefined" ||
    (typeof navigator !== "undefined" && navigator.userAgent?.includes("Cloudflare-Workers"));

  if (isCloudflare) {
    // Cloudflare Workers outbound WebSocket client
    const resp = await fetch(httpsUrl, { headers });
    ws = (resp as any).webSocket;
    if (!ws) {
      throw new Error(`Cloudflare outbound WebSocket failed with status ${resp.status}`);
    }
    ws.accept();
  } else {
    // Node.js environment
    try {
      const { default: WebSocketImpl } = await import("ws");
      ws = new WebSocketImpl(wssUrl, { headers });
    } catch {
      const resp = await fetch(httpsUrl, { headers });
      ws = (resp as any).webSocket;
      if (ws) ws.accept();
    }
  }

  if (!ws) {
    throw new Error("Unable to establish WebSocket connection for TTS");
  }

  return new Promise<Uint8Array>((resolve, reject) => {
    const audioChunks: Uint8Array[] = [];
    const timeout = setTimeout(() => {
      try {
        ws.close();
      } catch {}
      reject(new Error("Edge TTS synthesis timed out"));
    }, 15000);

    const handleTurnEnd = () => {
      clearTimeout(timeout);
      try {
        ws.close();
      } catch {}
      const totalLength = audioChunks.reduce((acc, c) => acc + c.byteLength, 0);
      const merged = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of audioChunks) {
        merged.set(chunk, offset);
        offset += chunk.byteLength;
      }
      resolve(merged);
    };

    const handleBinaryData = (data: any) => {
      // 1. Node.js Buffer
      if (typeof Buffer !== "undefined" && Buffer.isBuffer(data)) {
        if (data.length > 2) {
          const headerLen = data.readUInt16BE(0);
          if (2 + headerLen <= data.length) {
            const headerStr = data.subarray(2, 2 + headerLen).toString("utf-8");
            if (headerStr.includes("Path:audio")) {
              audioChunks.push(new Uint8Array(data.subarray(2 + headerLen)));
            }
          }
        }
        return;
      }

      // 2. Cloudflare / Web ArrayBuffer
      let arrayBuffer: ArrayBuffer | null = null;
      let byteOffset = 0;
      let byteLength = 0;

      if (data instanceof ArrayBuffer) {
        arrayBuffer = data;
        byteOffset = 0;
        byteLength = data.byteLength;
      } else if (ArrayBuffer.isView(data)) {
        arrayBuffer = data.buffer;
        byteOffset = data.byteOffset;
        byteLength = data.byteLength;
      }

      if (arrayBuffer && byteLength > 2) {
        const dataView = new DataView(arrayBuffer, byteOffset, byteLength);
        const headerLen = dataView.getUint16(0);
        if (2 + headerLen <= byteLength) {
          const headerBytes = new Uint8Array(arrayBuffer, byteOffset + 2, headerLen);
          const headerStr = new TextDecoder().decode(headerBytes);
          if (headerStr.includes("Path:audio")) {
            audioChunks.push(
              new Uint8Array(arrayBuffer, byteOffset + 2 + headerLen, byteLength - 2 - headerLen)
            );
          }
        }
      }
    };

    function sendPayload() {
      const requestId = crypto.randomUUID().replace(/-/g, "");

      // 1. Send speech.config
      const configMsg = `X-Timestamp:${new Date().toISOString()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}\r\n`;
      ws.send(configMsg);

      // 2. Escape XML entities in text
      const escapedText = cleanText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${lang}'><voice name='${voice}'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>${escapedText}</prosody></voice></speak>`;
      const ssmlMsg = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${new Date().toISOString()}\r\nPath:ssml\r\n\r\n${ssml}`;
      ws.send(ssmlMsg);
    }

    if (typeof ws.on === "function") {
      ws.on("open", sendPayload);
      ws.on("message", (msg: any, isBinary: boolean) => {
        if (!isBinary) {
          const str = typeof msg === "string" ? msg : msg.toString("utf-8");
          if (str.includes("Path:turn.end")) {
            handleTurnEnd();
          }
        } else {
          handleBinaryData(msg);
        }
      });
      ws.on("error", (err: any) => {
        clearTimeout(timeout);
        reject(err);
      });
    } else if (typeof ws.addEventListener === "function") {
      ws.addEventListener("message", (event: any) => {
        if (typeof event.data === "string") {
          if (event.data.includes("Path:turn.end")) {
            handleTurnEnd();
          }
        } else {
          handleBinaryData(event.data);
        }
      });
      ws.addEventListener("error", (err: any) => {
        clearTimeout(timeout);
        reject(new Error(`WebSocket error: ${err?.message || err}`));
      });
      sendPayload();
    }
  });
}

export const Route = createFileRoute("/api/public/tts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const text = url.searchParams.get("text") || "";
          const voice = url.searchParams.get("voice") || undefined;

          if (!text) {
            return Response.json({ error: "missing_text" }, { status: 400 });
          }

          const audioBytes = await synthesizeEdgeSpeech(text, voice);

          return new Response(audioBytes, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=31536000, immutable",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } catch (err: any) {
          console.error("TTS synthesis error:", err);
          return Response.json(
            { error: "synthesis_failed", message: err?.message || String(err) },
            { status: 500 }
          );
        }
      },
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { text?: string; voice?: string };
          const text = body.text || "";
          const voice = body.voice || undefined;

          if (!text) {
            return Response.json({ error: "missing_text" }, { status: 400 });
          }

          const audioBytes = await synthesizeEdgeSpeech(text, voice);

          return new Response(audioBytes, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=31536000, immutable",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } catch (err: any) {
          console.error("TTS synthesis error:", err);
          return Response.json(
            { error: "synthesis_failed", message: err?.message || String(err) },
            { status: 500 }
          );
        }
      },
    },
  },
});
