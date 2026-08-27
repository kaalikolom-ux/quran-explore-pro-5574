const fs = require('fs');
const path = require('path');

async function build() {
  const fontUrl = 'https://fonts.gstatic.com/s/kaushanscript/v19/vm8vdRfvXFLG3OLnsO15WYS5DF7_.ttf';
  const res = await fetch(fontUrl);
  const fontBuffer = Buffer.from(await res.arrayBuffer());
  const fontBase64 = fontBuffer.toString('base64');

  const publicDir = path.join(__dirname, '..', 'public');
  const fontsDir = path.join(publicDir, 'fonts');
  if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });

  fs.writeFileSync(path.join(fontsDir, 'kaushan-script.ttf'), fontBuffer);

  function createSvgLogo(fillColor) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 235 44" width="235" height="44">
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
        dominant-baseline: alphabetic;
      }
    </style>
  </defs>
  <text x="2" y="32" class="logo-txt">Qur'an Explorer</text>
</svg>`;
  }

  // Write standalone SVGs
  fs.writeFileSync(path.join(publicDir, 'logo-light.svg'), createSvgLogo('#1c5576'));
  fs.writeFileSync(path.join(publicDir, 'logo-dark.svg'), createSvgLogo('#58b4e8'));

  // Create Deep Navy Blue Marble Favicon SVG
  // Deep navy blue marble background with soft luminous swirl & golden/cyan book emblem
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="marbleBase" cx="30%" cy="25%" r="85%">
      <stop offset="0%" stop-color="#1e3a5f" />
      <stop offset="35%" stop-color="#0e2340" />
      <stop offset="70%" stop-color="#071526" />
      <stop offset="100%" stop-color="#020813" />
    </radialGradient>
    <linearGradient id="marbleVein1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.4" />
      <stop offset="40%" stop-color="#1d4ed8" stop-opacity="0.2" />
      <stop offset="80%" stop-color="#0369a1" stop-opacity="0.0" />
    </linearGradient>
    <linearGradient id="marbleVein2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.3" />
      <stop offset="50%" stop-color="#2563eb" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0" />
    </linearGradient>
    <linearGradient id="bookGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7dd3fc" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Marble Rounded Base -->
  <rect width="512" height="512" rx="128" fill="url(#marbleBase)" />

  <!-- Marble Veins & Swirls -->
  <path d="M-50,120 Q120,40 280,180 T560,220" fill="none" stroke="url(#marbleVein1)" stroke-width="48" stroke-linecap="round" filter="blur(16px)" opacity="0.75" />
  <path d="M60,480 Q220,340 380,420 T580,360" fill="none" stroke="url(#marbleVein2)" stroke-width="36" stroke-linecap="round" filter="blur(12px)" opacity="0.6" />
  <path d="M-20,300 Q180,180 340,320 T540,240" fill="none" stroke="url(#marbleVein1)" stroke-width="24" stroke-linecap="round" filter="blur(8px)" opacity="0.5" />

  <!-- Inner Subtle Border -->
  <rect x="16" y="16" width="480" height="480" rx="112" fill="none" stroke="#38bdf8" stroke-opacity="0.25" stroke-width="8" />

  <!-- Quran Emblem with Glow -->
  <g filter="url(#glow)" transform="translate(116, 116) scale(11.66)">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="none" stroke="url(#bookGlow)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="none" stroke="url(#bookGlow)" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" />
    <line x1="12" y1="7" x2="12" y2="21" stroke="url(#bookGlow)" stroke-width="1.8" stroke-linecap="round" />
  </g>
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);

  console.log('✅ Generated public/logo-light.svg, public/logo-dark.svg, and public/favicon.svg');
}

build().catch(console.error);
