/**
 * imageSize.ts — dependency-free pixel-dimension reader.
 * Parses the header of a PNG / JPEG / WebP / GIF file (or the <svg> tag) and
 * returns its intrinsic { width, height }. Used by extract.ts so each media asset
 * carries dimensions + orientation for downstream layout decisions in the creator.
 */
import { openSync, readSync, closeSync, readFileSync } from "node:fs";

export interface Dim { width: number; height: number; }

function readHead(path: string, n = 65536): Buffer {
  const fd = openSync(path, "r");
  try {
    const buf = Buffer.alloc(n);
    const bytes = readSync(fd, buf, 0, n, 0);
    return buf.subarray(0, bytes);
  } finally { closeSync(fd); }
}

function svgSize(path: string): Dim | undefined {
  let t: string;
  try { t = readFileSync(path, "utf8").slice(0, 8192); } catch { return undefined; }
  const tag = t.match(/<svg[^>]*>/i)?.[0] || "";
  const num = (s?: string) => { const m = s?.match(/[\d.]+/); return m ? parseFloat(m[0]) : undefined; };
  const w = num(tag.match(/\bwidth\s*=\s*["']([^"']+)["']/i)?.[1]);
  const h = num(tag.match(/\bheight\s*=\s*["']([^"']+)["']/i)?.[1]);
  if (w && h) return { width: w, height: h };
  const vb = tag.match(/\bviewBox\s*=\s*["']([^"']+)["']/i)?.[1];
  if (vb) { const p = vb.split(/[\s,]+/).map(Number); if (p.length === 4 && p[2] && p[3]) return { width: p[2], height: p[3] }; }
  return undefined;
}

/** Best-effort intrinsic size for a local image file; undefined if unparseable. */
export function imageSize(path: string): Dim | undefined {
  if (/\.svg$/i.test(path)) return svgSize(path);
  let b: Buffer;
  try { b = readHead(path); } catch { return undefined; }

  // PNG: signature 89 50 4E 47, then IHDR width/height (big-endian) at 16/20
  if (b.length >= 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  // GIF: 'GIF', then logical screen width/height (little-endian) at 6/8
  if (b.length >= 10 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) {
    return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  }
  // WebP: 'RIFF'....'WEBP' then VP8 / VP8L / VP8X
  if (b.length >= 30 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const fmt = b.toString("ascii", 12, 16);
    if (fmt === "VP8 ") {
      const w = b.readUInt16LE(26) & 0x3fff, h = b.readUInt16LE(28) & 0x3fff;
      if (w && h) return { width: w, height: h };
    } else if (fmt === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    } else if (fmt === "VP8X") {
      const w = 1 + (b[24] | (b[25] << 8) | (b[26] << 16));
      const h = 1 + (b[27] | (b[28] << 8) | (b[29] << 16));
      return { width: w, height: h };
    }
    return undefined;
  }
  // JPEG: scan segments for a Start-Of-Frame marker (carries H/W)
  if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8) {
    let o = 2;
    while (o + 1 < b.length) {
      if (b[o] !== 0xff) { o++; continue; }
      const marker = b[o + 1];
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) { o += 2; continue; }
      if (o + 4 > b.length) break;
      const len = b.readUInt16BE(o + 2);
      // SOF0..SOF15 except DHT(C4), JPG(C8), DAC(CC) carry the frame dimensions
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        if (o + 9 > b.length) break;
        return { width: b.readUInt16BE(o + 7), height: b.readUInt16BE(o + 5) };
      }
      o += 2 + len;
    }
  }
  return undefined;
}
