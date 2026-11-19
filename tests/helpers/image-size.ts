/**
 * Reads the pixel size of a JPEG or WebP file from its header, so the tests can check that the
 * width and height declared in the content match the real images (next/image relies on them to
 * reserve space and avoid layout shift).
 */
import { readFileSync } from "node:fs";
import path from "node:path";

export interface Size {
  width: number;
  height: number;
}

const PUBLIC_DIR = path.resolve(import.meta.dirname, "../../public");

/** The file in public/ that a site path ("/img/a.jpg") points to. */
export function publicFile(src: string): string {
  return path.join(PUBLIC_DIR, src);
}

export function imageSize(file: string): Size {
  const data = readFileSync(file);
  if (data[0] === 0xff && data[1] === 0xd8) return jpegSize(data);
  if (data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WEBP")
    return webpSize(data);
  throw new Error(`${file}: not a JPEG or WebP image`);
}

function jpegSize(data: Buffer): Size {
  let offset = 2;
  while (offset < data.length) {
    if (data[offset] !== 0xff) throw new Error("Corrupt JPEG marker");
    const marker = data[offset + 1]!;
    const length = data.readUInt16BE(offset + 2);
    // Start-of-frame markers (baseline, progressive…), but not DHT (C4), JPG (C8) or DAC (CC).
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: data.readUInt16BE(offset + 5), width: data.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  throw new Error("JPEG without a frame header");
}

function webpSize(data: Buffer): Size {
  const chunk = data.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return { width: data.readUIntLE(24, 3) + 1, height: data.readUIntLE(27, 3) + 1 };
  }
  if (chunk === "VP8 ") {
    return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const bits = data.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  throw new Error(`Unknown WebP chunk ${chunk}`);
}
