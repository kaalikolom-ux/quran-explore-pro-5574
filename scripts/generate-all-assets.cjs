const fs = require("fs");
const path = require("path");
const { Resvg } = require("@resvg/resvg-js");

async function main() {
  const publicDir = path.join(__dirname, "..", "public");
  const fontsDir = path.join(publicDir, "fonts");
  if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

  const fontPath = path.join(fontsDir, "kaushan-script.ttf");
  let fontBuffer;
  if (fs.existsSync(fontPath)) {
    fontBuffer = fs.readFileSync(fontPath);
  } else {
    const fontUrl =
      "https://fonts.gstatic.com/s/kaushanscript/v19/vm8vdRfvXFLG3OLnsO15WYS5DF7_.ttf";
    const res = await fetch(fontUrl);
    fontBuffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(fontPath, fontBuffer);
  }
  const fontBase64 = fontBuffer.toString("base64");

  function renderSvgToPng(svgString, width) {
    const resvg = new Resvg(svgString, {
      fitTo: { mode: "width", value: width },
      font: {
        fontBuffers: [fontBuffer],
        defaultFontFamily: "Kaushan Script",
      },
    });
    const pngData = resvg.render();
    return pngData.asPng();
  }

  function createSvgLogo(fillColor) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 44" width="240" height="44">
  <defs>
    <style>
      @font-face {
        font-family: 'Kaushan Script';
        font-style: normal;
        font-weight: 400;
        src: url('data:font/truetype;charset=utf-8;base64,${fontBase64}') format('truetype');
      }
      .logo-txt {
        font-family: 'Kaushan Script', cursive;
        font-size: 32px;
        font-weight: 400;
        fill: ${fillColor};
      }
    </style>
  </defs>
  <text x="2" y="32" class="logo-txt">Qur'an Explorer</text>
</svg>`;
  }

  // 1. Write SVG Logos
  const svgLight = createSvgLogo("#115360");
  const svgDark = createSvgLogo("#38d9c2");
  fs.writeFileSync(path.join(publicDir, "logo-light.svg"), svgLight);
  fs.writeFileSync(path.join(publicDir, "logo-dark.svg"), svgDark);

  // 2. Render PNG Logos for all device resolutions (Mobile, Laptop, Desktop, Retina Mac/iOS)
  fs.writeFileSync(path.join(publicDir, "logo-light.png"), renderSvgToPng(svgLight, 480));
  fs.writeFileSync(path.join(publicDir, "logo-light@2x.png"), renderSvgToPng(svgLight, 960));
  fs.writeFileSync(path.join(publicDir, "logo-dark.png"), renderSvgToPng(svgDark, 480));
  fs.writeFileSync(path.join(publicDir, "logo-dark@2x.png"), renderSvgToPng(svgDark, 960));

  // 3. Arabic Qaf (ق) Emerald/Teal Marble Favicon SVG (Matches Website Brand Theme)
  const qafPath512 =
    "M 355.3 76 L 334.8 105.2 L 365.6 132.2 L 384.5 104.1 L 385 101.9 Z " +
    "M 300.7 79.3 L 285.7 100.8 L 280.8 109 L 311.1 135.5 L 329.9 107.4 L 330.5 105.2 Z " +
    "M 333.5 193.3 L 323.6 195.5 L 319.3 197.6 L 311.6 203.1 L 302.1 213.2 L 293.4 225.7 L 283.5 245.4 L 277 265 L 273.7 281.4 L 273.7 287.4 L 273.2 287.9 L 273.7 296.1 L 274.8 299.9 L 278.1 305.4 L 285.5 312.7 L 295.8 318.7 L 303.5 321.5 L 320.4 324.2 L 366.7 324.2 L 368.1 329.4 L 368.1 336.5 L 359.1 345.5 L 353.1 350.4 L 342.7 358 L 334.5 362.9 L 322 369.5 L 307.3 375.5 L 287.1 381.5 L 261.5 385.8 L 247.8 386.4 L 247.3 386.9 L 227.1 386.9 L 226.5 386.4 L 218.9 386.4 L 203.6 384.2 L 188.9 380.4 L 179.6 376.5 L 166 367.8 L 157 358.8 L 153.2 353.9 L 150.5 349.5 L 145.5 338.6 L 142.3 326.1 L 141.7 316.3 L 141.2 315.7 L 141.2 304.3 L 141.7 303.7 L 141.2 302.1 L 141.7 301.5 L 141.7 292.3 L 142.3 291.7 L 142.8 281.9 L 145.5 266.1 L 148.3 255.7 L 148 254.4 L 144.7 253.3 L 132.5 278.1 L 126.5 295.5 L 121 321.2 L 120.5 329.9 L 119.9 330.5 L 119.4 349 L 119.9 349.5 L 120.5 361 L 122.1 369.7 L 128.6 388.8 L 136.8 401.4 L 146.4 411.5 L 155.1 418 L 168.2 425.1 L 179.6 429.5 L 194.4 433.3 L 205.3 434.9 L 223.8 435.5 L 224.4 436 L 246.2 435.5 L 246.7 434.9 L 254.4 434.9 L 254.9 434.4 L 266.9 433.3 L 282.7 430 L 306.2 422.9 L 317.1 418.5 L 334.5 409.8 L 347.6 401.6 L 356.4 395.1 L 366.2 386.9 L 374.6 378.5 L 380.6 366.5 L 386.6 351.2 L 390.5 337.5 L 392.1 328.8 L 392.1 324.5 L 392.6 323.9 L 392.6 294.5 L 392.1 293.9 L 392.1 286.3 L 391.5 285.7 L 391 276.5 L 388.3 259.5 L 385 246.5 L 379.5 230.1 L 375.2 220.8 L 367.5 209.4 L 360.7 202.5 L 351.5 196.5 L 342.2 193.8 Z " +
    "M 319.5 236.1 L 325.3 235.8 L 333.5 238.5 L 338.9 242.4 L 347.4 250.8 L 352.3 257.9 L 356.6 266.6 L 359.4 275.9 L 359.1 279.5 L 331.3 279.5 L 330.7 278.9 L 325.3 278.9 L 318.2 277.8 L 308.9 275.1 L 304.5 272.9 L 301.3 270.7 L 296.6 266.1 L 293.9 260.1 L 293.9 253.5 L 296.1 249.2 L 299.1 245.6 L 306.7 240.2 L 314.4 236.9 Z";

  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="marbleBase" cx="35%" cy="25%" r="80%">
      <stop offset="0%" stop-color="#134a54" />
      <stop offset="35%" stop-color="#0c343b" />
      <stop offset="70%" stop-color="#061e23" />
      <stop offset="100%" stop-color="#020f12" />
    </radialGradient>
    <linearGradient id="marbleVein1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2dd4bf" stop-opacity="0.55" />
      <stop offset="40%" stop-color="#0d9488" stop-opacity="0.3" />
      <stop offset="80%" stop-color="#042f2e" stop-opacity="0.0" />
    </linearGradient>
    <linearGradient id="marbleVein2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#5eead4" stop-opacity="0.45" />
      <stop offset="50%" stop-color="#14b8a6" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#0f766e" stop-opacity="0.0" />
    </linearGradient>
    <linearGradient id="qafGlow" x1="25%" y1="10%" x2="75%" y2="90%">
      <stop offset="0%" stop-color="#f0fdfa" />
      <stop offset="30%" stop-color="#99f6e4" />
      <stop offset="70%" stop-color="#2dd4bf" />
      <stop offset="100%" stop-color="#14b8a6" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Marble Rounded Base -->
  <rect width="512" height="512" rx="128" fill="url(#marbleBase)" />

  <!-- Marble Swirls -->
  <path d="M-40,110 Q140,30 290,170 T550,210" fill="none" stroke="url(#marbleVein1)" stroke-width="52" stroke-linecap="round" opacity="0.85" />
  <path d="M50,470 Q210,330 370,410 T570,350" fill="none" stroke="url(#marbleVein2)" stroke-width="40" stroke-linecap="round" opacity="0.7" />
  <path d="M-10,290 Q170,170 330,310 T530,230" fill="none" stroke="url(#marbleVein1)" stroke-width="26" stroke-linecap="round" opacity="0.55" />

  <!-- Inner Soft Accent Ring -->
  <rect x="20" y="20" width="472" height="472" rx="112" fill="none" stroke="#2dd4bf" stroke-opacity="0.38" stroke-width="6" />

  <!-- Arabic Qaf Calligraphy Glyph in Luminous Cyan/Teal -->
  <path d="${qafPath512}" fill="url(#qafGlow)" fill-rule="evenodd" filter="url(#glow)" />
</svg>`;

  fs.writeFileSync(path.join(publicDir, "favicon.svg"), faviconSvg);
  fs.writeFileSync(path.join(publicDir, "qaf-favicon.svg"), faviconSvg);

  // 4. Render Deep Teal / Emerald Marble Favicon PNGs
  const faviconPng512 = renderSvgToPng(faviconSvg, 512);
  fs.writeFileSync(path.join(publicDir, "favicon.png"), faviconPng512);
  fs.writeFileSync(path.join(publicDir, "qaf-favicon.png"), faviconPng512);
  fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), renderSvgToPng(faviconSvg, 180));

  console.log("✅ Generated all PNG & SVG assets successfully!");
  console.log("   - public/favicon.svg & public/favicon.png (Arabic Qaf Emerald Marble)");
  console.log("   - public/apple-touch-icon.png");
  console.log("   - public/logo-light.svg & public/logo-light.png (@1x, @2x)");
  console.log("   - public/logo-dark.svg & public/logo-dark.png (@1x, @2x)");
}

main().catch(console.error);
