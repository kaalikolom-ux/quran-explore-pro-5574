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
  const svgLight = createSvgLogo("#1c5576");
  const svgDark = createSvgLogo("#58b4e8");
  fs.writeFileSync(path.join(publicDir, "logo-light.svg"), svgLight);
  fs.writeFileSync(path.join(publicDir, "logo-dark.svg"), svgDark);

  // 2. Render PNG Logos for all device resolutions (Mobile, Laptop, Desktop, Retina Mac/iOS)
  fs.writeFileSync(path.join(publicDir, "logo-light.png"), renderSvgToPng(svgLight, 480));
  fs.writeFileSync(path.join(publicDir, "logo-light@2x.png"), renderSvgToPng(svgLight, 960));
  fs.writeFileSync(path.join(publicDir, "logo-dark.png"), renderSvgToPng(svgDark, 480));
  fs.writeFileSync(path.join(publicDir, "logo-dark@2x.png"), renderSvgToPng(svgDark, 960));

  // 3. Deep Navy Blue Marble Favicon SVG
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="marbleBase" cx="35%" cy="25%" r="80%">
      <stop offset="0%" stop-color="#1e3a5f" />
      <stop offset="40%" stop-color="#0e2340" />
      <stop offset="75%" stop-color="#071526" />
      <stop offset="100%" stop-color="#020813" />
    </radialGradient>
    <linearGradient id="marbleVein1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.45" />
      <stop offset="40%" stop-color="#1d4ed8" stop-opacity="0.2" />
      <stop offset="80%" stop-color="#0369a1" stop-opacity="0.0" />
    </linearGradient>
    <linearGradient id="marbleVein2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#2563eb" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0" />
    </linearGradient>
    <linearGradient id="bookGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a5f3fc" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Marble Rounded Base -->
  <rect width="512" height="512" rx="128" fill="url(#marbleBase)" />

  <!-- Marble Swirls -->
  <path d="M-40,110 Q140,30 290,170 T550,210" fill="none" stroke="url(#marbleVein1)" stroke-width="52" stroke-linecap="round" opacity="0.8" />
  <path d="M50,470 Q210,330 370,410 T570,350" fill="none" stroke="url(#marbleVein2)" stroke-width="40" stroke-linecap="round" opacity="0.65" />
  <path d="M-10,290 Q170,170 330,310 T530,230" fill="none" stroke="url(#marbleVein1)" stroke-width="26" stroke-linecap="round" opacity="0.5" />

  <!-- Inner Soft Accent Ring -->
  <rect x="20" y="20" width="472" height="472" rx="112" fill="none" stroke="#38bdf8" stroke-opacity="0.3" stroke-width="6" />

  <!-- Quran Emblem in Bright Cyan/Sky Blue -->
  <g filter="url(#glow)" transform="translate(108, 108) scale(12.33)">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="none" stroke="url(#bookGlow)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="none" stroke="url(#bookGlow)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" />
    <line x1="12" y1="7" x2="12" y2="21" stroke="url(#bookGlow)" stroke-width="1.8" stroke-linecap="round" />
  </g>
</svg>`;

  fs.writeFileSync(path.join(publicDir, "favicon.svg"), faviconSvg);

  // 4. Render Deep Navy Blue Marble Favicon PNGs
  fs.writeFileSync(path.join(publicDir, "favicon.png"), renderSvgToPng(faviconSvg, 512));
  fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), renderSvgToPng(faviconSvg, 180));

  console.log("✅ Generated all PNG & SVG assets successfully!");
  console.log("   - public/favicon.svg & public/favicon.png (Deep Navy Blue Marble)");
  console.log("   - public/apple-touch-icon.png");
  console.log("   - public/logo-light.svg & public/logo-light.png (@1x, @2x)");
  console.log("   - public/logo-dark.svg & public/logo-dark.png (@1x, @2x)");
}

main().catch(console.error);
