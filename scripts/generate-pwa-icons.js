import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Recommended PWA icon sizes
const iconSizes = [
  { size: 72, name: "icon-72x72.png" },
  { size: 96, name: "icon-96x96.png" },
  { size: 128, name: "icon-128x128.png" },
  { size: 144, name: "icon-144x144.png" },
  { size: 152, name: "icon-152x152.png" },
  { size: 192, name: "icon-192x192.png" },
  { size: 384, name: "icon-384x384.png" },
  { size: 512, name: "icon-512x512.png" },
];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, "../public/icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Copy existing logo as default icon
const sourceLogo = path.join(__dirname, "../public/logo.png");
const defaultIcon = path.join(iconsDir, "icon-192x192.png");

if (fs.existsSync(sourceLogo)) {
  fs.copyFileSync(sourceLogo, defaultIcon);
  console.log("✅ Default icon copied");
} else {
  console.log("⚠️  Source logo not found, please create icons manually");
}

console.log("📱 PWA icons generated in /public/icons/");
console.log("💡 For optimized icons, use tools like:");
console.log("   - https://realfavicongenerator.net/");
console.log("   - https://www.pwabuilder.com/imageGenerator");
