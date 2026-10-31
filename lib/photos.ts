import fs from 'node:fs';
import path from 'node:path';
// Lists every image in /public/images/couple — drop files in, no code changes needed.
export function getCouplePhotos(): string[] {
  const dir = path.join(process.cwd(), 'public', 'images', 'couple');
  try {
    return fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).sort().map((f) => `/images/couple/${f}`);
  } catch { return []; }
}
