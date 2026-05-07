"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  establishAdminSession,
  requireAdminSession,
  verifyAdminCredentials,
} from "@/lib/admin-auth";
import {
  deletePostBySlug,
  deleteProjectBySlug,
  savePostFromForm,
  saveProjectFromForm,
  type EditorData,
  type EditorFieldErrors,
} from "@/lib/content-admin";
import {
  getHomeContentEditorValuesFromForm,
  saveHomeContent,
  validateHomeContentValues,
  type HomeContentEditorValues,
  type HomeContentFieldErrors,
} from "@/lib/home-content";
import {
  isBrowserDisplayableImage,
  saveUploadedImage,
  type UploadKind,
} from "@/lib/image-upload";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

export type LoginActionState = {
  error: string | null;
};

export type EditorActionState = {
  message: string | null;
  errors: EditorFieldErrors;
  values: EditorData | null;
};

export type HomeContentActionState = {
  message: string | null;
  errors: HomeContentFieldErrors;
  values: HomeContentEditorValues | null;
};

export type UploadActionState = {
  message: string | null;
  url: string | null;
  markdown: string | null;
  target: "cover" | "content" | null;
};

function revalidateContentPaths(kind: "post" | "project", slug: string) {
  revalidatePath("/");
  revalidatePath("/admin");

  if (kind === "post") {
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    return;
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
}

function revalidateHomePaths() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/home");
}

function getActionMessages(locale: "zh" | "en") {
  return {
    missingConfig:
      locale === "en"
        ? "Admin environment variables are not configured yet. Please set ADMIN_PASSWORD and ADMIN_SESSION_SECRET first."
        : "后台登录环境变量还没配置完整，请先设置 ADMIN_PASSWORD 和 ADMIN_SESSION_SECRET。",
    invalidCredentials:
      locale === "en" ? "Invalid username or password." : "用户名或密码不正确。",
    fixForm:
      locale === "en" ? "Please fix the highlighted form issues first." : "请先修正表单里的问题。",
    fixHomeForm:
      locale === "en"
        ? "Please fix the highlighted home content issues first."
        : "请先修正首页内容表单里的问题。",
    chooseImage:
      locale === "en" ? "Please choose an image first." : "请先选择一张图片再上传。",
  };
}

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const locale = await getRequestLocale();
  const labels = getActionMessages(locale);
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const result = await verifyAdminCredentials(username, password);

  if (!result.ok) {
    return {
      error:
        result.reason === "missing-config"
          ? labels.missingConfig
          : labels.invalidCredentials,
    };
  }

  await establishAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function savePostAction(
  _previousState: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  const locale = await getRequestLocale();
  const labels = getActionMessages(locale);
  await requireAdminSession();

  const result = await savePostFromForm(formData);
  if (!result.ok) {
    return {
      message: labels.fixForm,
      errors: result.errors,
      values: result.values,
    };
  }

  revalidateContentPaths("post", result.slug);
  redirect(`/admin/posts/${result.slug}?saved=1&contentLocale=${result.contentLocale}`);
}

export async function saveProjectAction(
  _previousState: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  const locale = await getRequestLocale();
  const labels = getActionMessages(locale);
  await requireAdminSession();

  const result = await saveProjectFromForm(formData);
  if (!result.ok) {
    return {
      message: labels.fixForm,
      errors: result.errors,
      values: result.values,
    };
  }

  revalidateContentPaths("project", result.slug);
  redirect(
    `/admin/projects/${result.slug}?saved=1&contentLocale=${result.contentLocale}`,
  );
}

export async function saveHomeContentAction(
  _previousState: HomeContentActionState,
  formData: FormData,
): Promise<HomeContentActionState> {
  const locale = await getRequestLocale();
  const labels = getActionMessages(locale);
  await requireAdminSession();

  const values = getHomeContentEditorValuesFromForm(formData);
  const errors = validateHomeContentValues(values);

  if (Object.keys(errors).length > 0) {
    return {
      message: labels.fixHomeForm,
      errors,
      values,
    };
  }

  await saveHomeContent(values);
  revalidateHomePaths();
  redirect("/admin/home?saved=1");
}

export async function deletePostAction(formData: FormData) {
  await requireAdminSession();

  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) {
    return;
  }

  const deleted = await deletePostBySlug(slug);
  if (deleted) {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
  }

  redirect("/admin?deleted=post");
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdminSession();

  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) {
    return;
  }

  const deleted = await deleteProjectBySlug(slug);
  if (deleted) {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/projects");
    revalidatePath(`/projects/${slug}`);
  }

  redirect("/admin?deleted=project");
}

function normalizeKind(value: string): UploadKind {
  return value === "posts" || value === "projects" ? value : "shared";
}

export async function uploadImageAction(
  _previousState: UploadActionState,
  formData: FormData,
): Promise<UploadActionState> {
  const locale = await getRequestLocale();
  const labels = getActionMessages(locale);
  const messages = getMessages(locale);
  await requireAdminSession();

  const file = formData.get("file");
  const kind = normalizeKind(String(formData.get("kind") ?? "shared"));
  const target = formData.get("target") === "content" ? "content" : "cover";

  if (!(file instanceof File) || file.size === 0) {
    return {
      message: labels.chooseImage,
      url: null,
      markdown: null,
      target,
    };
  }

  if (!isBrowserDisplayableImage(file)) {
    return {
      message: messages.admin.editor.supportedFormats,
      url: null,
      markdown: null,
      target,
    };
  }

  const uploaded = await saveUploadedImage(file, kind);

  return {
    message:
      target === "content"
        ? messages.admin.editor.uploadInserted
        : messages.admin.editor.uploadFilledCover,
    url: uploaded.url,
    markdown: uploaded.markdown,
    target,
  };
}
