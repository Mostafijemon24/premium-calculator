import sharp from "sharp";
import { mkdir, copyFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const source = path.join(root, "assets", "app-icon-source.png");
const resDir = path.join(root, "android", "app", "src", "main", "res");
const publicDir = path.join(root, "public");

/** Dark grey matching flat icon backdrop (adaptive icon background). */
const BG = { r: 58, g: 58, b: 58, alpha: 1 };

const densities = {
  "mipmap-mdpi": { launcher: 48, foreground: 108 },
  "mipmap-hdpi": { launcher: 72, foreground: 162 },
  "mipmap-xhdpi": { launcher: 96, foreground: 216 },
  "mipmap-xxhdpi": { launcher: 144, foreground: 324 },
  "mipmap-xxxhdpi": { launcher: 192, foreground: 432 },
};

async function resizeIcon(size, paddingPercent = 0) {
  const pad = Math.round(size * paddingPercent);
  const inner = size - pad * 2;
  const resized = await sharp(source)
    .resize(inner, inner, { fit: "contain", background: BG })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toBuffer();
}

async function writePng(filePath, buffer) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await sharp(buffer).toFile(filePath);
}

for (const [folder, { launcher, foreground }] of Object.entries(densities)) {
  const dir = path.join(resDir, folder);
  const launcherBuf = await resizeIcon(launcher, 0.06);
  const fgBuf = await resizeIcon(foreground, 0.08);

  await writePng(path.join(dir, "ic_launcher.png"), launcherBuf);
  await writePng(path.join(dir, "ic_launcher_round.png"), launcherBuf);
  await writePng(path.join(dir, "ic_launcher_foreground.png"), fgBuf);
}

const webSizes = [
  [192, "icon-192.png"],
  [512, "icon-512.png"],
  [32, "favicon.png"],
];

await mkdir(publicDir, { recursive: true });
for (const [size, name] of webSizes) {
  const buf = await resizeIcon(size, 0.06);
  await writePng(path.join(publicDir, name), buf);
}

await copyFile(source, path.join(publicDir, "app-icon.png"));
console.log("Icons generated successfully.");
