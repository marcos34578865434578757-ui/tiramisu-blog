import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { slugify } from "@/lib/content-admin";

export type UploadKind = "posts" | "projects" | "shared";
export type UploadTarget = "cover" | "content";

const acceptedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "image/bmp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/apng",
]);

const acceptedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
  ".bmp",
  ".ico",
  ".apng",
]);

const rejectedExtensions = new Set([".psd", ".heic", ".heif", ".tif", ".tiff"]);

export function isBrowserDisplayableImage(file: File) {
  const extension = path.extname(file.name).toLowerCase();

  if (rejectedExtensions.has(extension)) {
    return false;
  }

  if (acceptedExtensions.has(extension)) {
    return true;
  }

  return acceptedMimeTypes.has(file.type);
}

export async function saveUploadedImage(file: File, kind: UploadKind) {
  const extension = path.extname(file.name) || ".png";
  const safeBaseName = slugify(path.basename(file.name, extension)) || "image";
  const fileName = `${Date.now()}-${safeBaseName}-${randomUUID().slice(0, 8)}${extension.toLowerCase()}`;
  const outputDirectory = path.join(process.cwd(), "public", "uploads", kind);

  await fs.mkdir(outputDirectory, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  const outputPath = path.join(outputDirectory, fileName);
  await fs.writeFile(outputPath, bytes);

  return {
    fileName,
    url: `/uploads/${kind}/${fileName}`,
    markdown: `![图片说明](/uploads/${kind}/${fileName})`,
  };
}

