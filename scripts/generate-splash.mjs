import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconPath = join(__dirname, "../public/icon-512.png");
const outDir = join(__dirname, "../public");

const screens = [
  { w: 1290, h: 2796, name: "splash-1290x2796" }, // iPhone 15/14 Pro Max
  { w: 1179, h: 2556, name: "splash-1179x2556" }, // iPhone 15/14 Pro
  { w: 1284, h: 2778, name: "splash-1284x2778" }, // iPhone 14 Plus / 13 Pro Max
  { w: 1170, h: 2532, name: "splash-1170x2532" }, // iPhone 14 / 13 / 12
  { w: 1125, h: 2436, name: "splash-1125x2436" }, // iPhone X / XS / 11 Pro
  { w: 750,  h: 1334, name: "splash-750x1334"  }, // iPhone SE
];

for (const { w, h, name } of screens) {
  const logoSize = Math.round(w * 0.28);
  const logoX = Math.round((w - logoSize) / 2);
  const logoY = Math.round(h * 0.36 - logoSize / 2);
  const textY = logoY + logoSize + Math.round(h * 0.045);
  const fontSize = Math.round(w * 0.075);
  const subtitleY = textY + fontSize + Math.round(h * 0.018);
  const subtitleSize = Math.round(w * 0.038);

  const svgOverlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <text x="${w / 2}" y="${textY}"
      font-family="-apple-system, SF Pro Display, Helvetica Neue, Arial, sans-serif"
      font-size="${fontSize}" font-weight="700" fill="white" text-anchor="middle"
      letter-spacing="-1">Crown AI</text>
    <text x="${w / 2}" y="${subtitleY}"
      font-family="-apple-system, SF Pro Display, Helvetica Neue, Arial, sans-serif"
      font-size="${subtitleSize}" font-weight="400" fill="#b3874b" text-anchor="middle">
      Crown Building Supplies</text>
  </svg>`;

  const logo = await sharp(iconPath).resize(logoSize, logoSize).toBuffer();

  await sharp({
    create: { width: w, height: h, channels: 4, background: { r: 26, g: 26, b: 26, alpha: 1 } },
  })
    .composite([
      { input: logo, left: logoX, top: logoY },
      { input: Buffer.from(svgOverlay), left: 0, top: 0 },
    ])
    .png()
    .toFile(`${outDir}/${name}.png`);

  console.log(`Generated ${name}.png`);
}
