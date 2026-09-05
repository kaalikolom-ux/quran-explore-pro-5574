import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// 1. Update logo-dark.svg
const darkLogoPath = path.join(ROOT, 'public/logo-dark.svg');
let darkLogoSvg = fs.readFileSync(darkLogoPath, 'utf8');

// Replace old fill #38d9c2 with glowing cerulean gradient
const gradDef = '<linearGradient id="quranLogoGradDark" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#4da3d4" /><stop offset="100%" stop-color="#70c3ec" /></linearGradient>';

if (!darkLogoSvg.includes('id="quranLogoGradDark"')) {
  darkLogoSvg = darkLogoSvg.replace('<defs>', '<defs>\n    ' + gradDef);
}
darkLogoSvg = darkLogoSvg.replace(/fill:\s*#[0-9a-fA-F]{3,6};/, 'fill: url(#quranLogoGradDark);');
fs.writeFileSync(darkLogoPath, darkLogoSvg, 'utf8');
console.log('✓ public/logo-dark.svg updated');

// 2. Generate new unified Favicon SVG matching the user-provided oceanic cerulean badge
// The QAF calligraphy path in 512x512 coordinates
const QAF_PATH_512 =
  "M 355.3 76 L 334.8 105.2 L 365.6 132.2 L 384.5 104.1 L 385 101.9 Z " +
  "M 300.7 79.3 L 285.7 100.8 L 280.8 109 L 311.1 135.5 L 329.9 107.4 L 330.5 105.2 Z " +
  "M 333.5 193.3 L 323.6 195.5 L 319.3 197.6 L 311.6 203.1 L 302.1 213.2 L 293.4 225.7 L 283.5 245.4 L 277 265 L 273.7 281.4 L 273.7 287.4 L 273.2 287.9 L 273.7 296.1 L 274.8 299.9 L 278.1 305.4 L 285.5 312.7 L 295.8 318.7 L 303.5 321.5 L 320.4 324.2 L 366.7 324.2 L 368.1 329.4 L 368.1 336.5 L 359.1 345.5 L 353.1 350.4 L 342.7 358 L 334.5 362.9 L 322 369.5 L 307.3 375.5 L 287.1 381.5 L 261.5 385.8 L 247.8 386.4 L 247.3 386.9 L 227.1 386.9 L 226.5 386.4 L 218.9 386.4 L 203.6 384.2 L 188.9 380.4 L 179.6 376.5 L 166 367.8 L 157 358.8 L 153.2 353.9 L 150.5 349.5 L 145.5 338.6 L 142.3 326.1 L 141.7 316.3 L 141.2 315.7 L 141.2 304.3 L 141.7 303.7 L 141.2 302.1 L 141.7 301.5 L 141.7 292.3 L 142.3 291.7 L 142.8 281.9 L 145.5 266.1 L 148.3 255.7 L 148 254.4 L 144.7 253.3 L 132.5 278.1 L 126.5 295.5 L 121 321.2 L 120.5 329.9 L 119.9 330.5 L 119.4 349 L 119.9 349.5 L 120.5 361 L 122.1 369.7 L 128.6 388.8 L 136.8 401.4 L 146.4 411.5 L 155.1 418 L 168.2 425.1 L 179.6 429.5 L 194.4 433.3 L 205.3 434.9 L 223.8 435.5 L 224.4 436 L 246.2 435.5 L 246.7 434.9 L 254.4 434.9 L 254.9 434.4 L 266.9 433.3 L 282.7 430 L 306.2 422.9 L 317.1 418.5 L 334.5 409.8 L 347.6 401.6 L 356.4 395.1 L 366.2 386.9 L 374.6 378.5 L 380.6 366.5 L 386.6 351.2 L 390.5 337.5 L 392.1 328.8 L 392.1 324.5 L 392.6 323.9 L 392.6 294.5 L 392.1 293.9 L 392.1 286.3 L 391.5 285.7 L 391 276.5 L 388.3 259.5 L 385 246.5 L 379.5 230.1 L 375.2 220.8 L 367.5 209.4 L 360.7 202.5 L 351.5 196.5 L 342.2 193.8 Z " +
  "M 319.5 236.1 L 325.3 235.8 L 333.5 238.5 L 338.9 242.4 L 347.4 250.8 L 352.3 257.9 L 356.6 266.6 L 359.4 275.9 L 359.1 279.5 L 331.3 279.5 L 330.7 278.9 L 325.3 278.9 L 318.2 277.8 L 308.9 275.1 L 304.5 272.9 L 301.3 270.7 L 296.6 266.1 L 293.9 260.1 L 293.9 253.5 L 296.1 249.2 L 299.1 245.6 L 306.7 240.2 L 314.4 236.9 Z";

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient (Obsidian Midnight sampled #091820) -->
    <radialGradient id="favBg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#0b1d27" />
      <stop offset="60%" stop-color="#091820" />
      <stop offset="100%" stop-color="#051016" />
    </radialGradient>

    <!-- Cerulean Squircle Badge Gradient sampled from #2a6f97 button -->
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#327ea8" />
      <stop offset="50%" stop-color="#2a6f97" />
      <stop offset="100%" stop-color="#1f5a7d" />
    </linearGradient>

    <!-- Qaf Calligraphy Gradient (Crisp Radiant White to Subtle Cerulean Mist) -->
    <linearGradient id="qafWhite" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="85%" stop-color="#f2f8fc" />
      <stop offset="100%" stop-color="#dcedf7" />
    </linearGradient>

    <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6" />
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#2a6f97" flood-opacity="0.35" />
    </filter>

    <filter id="qafGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#0f344d" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Dark Base -->
  <rect width="512" height="512" rx="128" fill="url(#favBg)" />

  <!-- Oceanic Cerulean Squircle Button (Matches User Reference Image) -->
  <rect x="56" y="56" width="400" height="400" rx="120" fill="url(#badgeGrad)" filter="url(#badgeShadow)" stroke="#4da3d4" stroke-opacity="0.3" stroke-width="4" />

  <!-- Arabic Qaf Calligraphy Glyph in Crisp Elevated White -->
  <path d="${QAF_PATH_512}" fill="url(#qafWhite)" fill-rule="evenodd" filter="url(#qafGlow)" />
</svg>`;

fs.writeFileSync(path.join(ROOT, 'public/favicon.svg'), faviconSvg, 'utf8');
fs.writeFileSync(path.join(ROOT, 'public/qaf-favicon.svg'), faviconSvg, 'utf8');
console.log('✓ public/favicon.svg and qaf-favicon.svg updated');

// Render PNGs using @resvg/resvg-js
function renderPng(svgStr, outPath, width) {
  const resvg = new Resvg(svgStr, { fitTo: { mode: 'width', value: width } });
  const pngData = resvg.render();
  fs.writeFileSync(outPath, pngData.asPng());
  console.log(`✓ Rendered ${path.basename(outPath)} (${width}x${width})`);
}

renderPng(faviconSvg, path.join(ROOT, 'public/favicon.png'), 512);
renderPng(faviconSvg, path.join(ROOT, 'public/qaf-favicon.png'), 512);
renderPng(faviconSvg, path.join(ROOT, 'public/apple-touch-icon.png'), 180);

console.log('All favicon and logo assets successfully updated!');
