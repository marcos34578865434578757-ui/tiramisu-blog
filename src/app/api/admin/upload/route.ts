import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";
import {
  isBrowserDisplayableImage,
  saveUploadedImage,
  type UploadKind,
  type UploadTarget,
} from "@/lib/image-upload";

export const dynamic = "force-dynamic";

function normalizeKind(value: string): UploadKind {
  return value === "posts" || value === "projects" ? value : "shared";
}

function normalizeTarget(value: string): UploadTarget {
  return value === "content" ? "content" : "cover";
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  if (!session.authenticated) {
    return NextResponse.json(
      { error: messages.admin.login.title },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = normalizeKind(String(formData.get("kind") ?? "shared"));
  const target = normalizeTarget(String(formData.get("target") ?? "content"));

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: locale === "en" ? "Please choose an image first." : "请先选择一张图片再上传。" },
      { status: 400 },
    );
  }

  if (!isBrowserDisplayableImage(file)) {
    return NextResponse.json(
      { error: messages.admin.editor.supportedFormats },
      { status: 400 },
    );
  }

  const uploaded = await saveUploadedImage(file, kind);

  return NextResponse.json({
    url: uploaded.url,
    markdown: uploaded.markdown,
    target,
    message:
      target === "content"
        ? messages.admin.editor.uploadInserted
        : messages.admin.editor.uploadFilledCover,
  });
}
