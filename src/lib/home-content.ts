import fs from "node:fs/promises";
import path from "node:path";

export type HeroStat = {
  label: string;
  value: string;
};

export type HomeContent = {
  hero: {
    eyebrow: string;
    badge: string;
    title: string;
    intro: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
    tags: string[];
    noteLabel: string;
    noteTitle: string;
    status: string;
    highlights: string[];
    stats: HeroStat[];
  };
  currentFocus: {
    eyebrow: string;
    title: string;
    description: string;
    status: string;
    items: string[];
    updatedAt: string;
    badgeLabel: string;
  };
};

const homeContentPath = path.join(
  process.cwd(),
  "src",
  "content",
  "site",
  "home.json",
);

export async function getHomeContent() {
  const raw = await fs.readFile(homeContentPath, "utf8");
  return JSON.parse(raw) as HomeContent;
}

function parseLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function serializeLines(values: string[]) {
  return values.join("\n");
}

function ensureString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export type HomeContentEditorValues = {
  heroEyebrow: string;
  heroBadge: string;
  heroTitle: string;
  heroIntro: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  heroTags: string;
  heroNoteLabel: string;
  heroNoteTitle: string;
  heroStatus: string;
  heroHighlights: string;
  heroStatLabel1: string;
  heroStatValue1: string;
  heroStatLabel2: string;
  heroStatValue2: string;
  heroStatLabel3: string;
  heroStatValue3: string;
  focusEyebrow: string;
  focusTitle: string;
  focusDescription: string;
  focusStatus: string;
  focusItems: string;
  focusUpdatedAt: string;
  focusBadgeLabel: string;
};

export function homeContentToEditorValues(content: HomeContent): HomeContentEditorValues {
  const [stat1, stat2, stat3] = content.hero.stats;

  return {
    heroEyebrow: content.hero.eyebrow,
    heroBadge: content.hero.badge,
    heroTitle: content.hero.title,
    heroIntro: content.hero.intro,
    primaryCtaLabel: content.hero.primaryCtaLabel,
    primaryCtaHref: content.hero.primaryCtaHref,
    secondaryCtaLabel: content.hero.secondaryCtaLabel,
    secondaryCtaHref: content.hero.secondaryCtaHref,
    heroTags: serializeLines(content.hero.tags),
    heroNoteLabel: content.hero.noteLabel,
    heroNoteTitle: content.hero.noteTitle,
    heroStatus: content.hero.status,
    heroHighlights: serializeLines(content.hero.highlights),
    heroStatLabel1: stat1?.label ?? "",
    heroStatValue1: stat1?.value ?? "",
    heroStatLabel2: stat2?.label ?? "",
    heroStatValue2: stat2?.value ?? "",
    heroStatLabel3: stat3?.label ?? "",
    heroStatValue3: stat3?.value ?? "",
    focusEyebrow: content.currentFocus.eyebrow,
    focusTitle: content.currentFocus.title,
    focusDescription: content.currentFocus.description,
    focusStatus: content.currentFocus.status,
    focusItems: serializeLines(content.currentFocus.items),
    focusUpdatedAt: content.currentFocus.updatedAt,
    focusBadgeLabel: content.currentFocus.badgeLabel,
  };
}

export function getHomeContentEditorValuesFromForm(
  formData: FormData,
): HomeContentEditorValues {
  return {
    heroEyebrow: ensureString(formData.get("heroEyebrow")),
    heroBadge: ensureString(formData.get("heroBadge")),
    heroTitle: ensureString(formData.get("heroTitle")),
    heroIntro: ensureString(formData.get("heroIntro")),
    primaryCtaLabel: ensureString(formData.get("primaryCtaLabel")),
    primaryCtaHref: ensureString(formData.get("primaryCtaHref")),
    secondaryCtaLabel: ensureString(formData.get("secondaryCtaLabel")),
    secondaryCtaHref: ensureString(formData.get("secondaryCtaHref")),
    heroTags: ensureString(formData.get("heroTags")),
    heroNoteLabel: ensureString(formData.get("heroNoteLabel")),
    heroNoteTitle: ensureString(formData.get("heroNoteTitle")),
    heroStatus: ensureString(formData.get("heroStatus")),
    heroHighlights: ensureString(formData.get("heroHighlights")),
    heroStatLabel1: ensureString(formData.get("heroStatLabel1")),
    heroStatValue1: ensureString(formData.get("heroStatValue1")),
    heroStatLabel2: ensureString(formData.get("heroStatLabel2")),
    heroStatValue2: ensureString(formData.get("heroStatValue2")),
    heroStatLabel3: ensureString(formData.get("heroStatLabel3")),
    heroStatValue3: ensureString(formData.get("heroStatValue3")),
    focusEyebrow: ensureString(formData.get("focusEyebrow")),
    focusTitle: ensureString(formData.get("focusTitle")),
    focusDescription: ensureString(formData.get("focusDescription")),
    focusStatus: ensureString(formData.get("focusStatus")),
    focusItems: ensureString(formData.get("focusItems")),
    focusUpdatedAt: ensureString(formData.get("focusUpdatedAt")),
    focusBadgeLabel: ensureString(formData.get("focusBadgeLabel")),
  };
}

export type HomeContentFieldErrors = Partial<Record<keyof HomeContentEditorValues, string>>;

export function validateHomeContentValues(values: HomeContentEditorValues) {
  const errors: HomeContentFieldErrors = {};

  const requiredFields: Array<keyof HomeContentEditorValues> = [
    "heroEyebrow",
    "heroBadge",
    "heroTitle",
    "heroIntro",
    "primaryCtaLabel",
    "primaryCtaHref",
    "secondaryCtaLabel",
    "secondaryCtaHref",
    "heroNoteLabel",
    "heroNoteTitle",
    "heroStatus",
    "focusEyebrow",
    "focusTitle",
    "focusDescription",
    "focusStatus",
    "focusUpdatedAt",
    "focusBadgeLabel",
  ];

  for (const field of requiredFields) {
    if (!values[field]) {
      errors[field] = "这个字段不能为空。";
    }
  }

  if (parseLines(values.heroTags).length === 0) {
    errors.heroTags = "至少填写一个 Hero 标签。";
  }

  if (parseLines(values.heroHighlights).length === 0) {
    errors.heroHighlights = "至少填写一条 Hero 亮点。";
  }

  if (parseLines(values.focusItems).length === 0) {
    errors.focusItems = "至少填写一条当前关注内容。";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.focusUpdatedAt)) {
    errors.focusUpdatedAt = "更新时间需要使用 YYYY-MM-DD 格式。";
  }

  return errors;
}

export function buildHomeContent(values: HomeContentEditorValues): HomeContent {
  return {
    hero: {
      eyebrow: values.heroEyebrow,
      badge: values.heroBadge,
      title: values.heroTitle,
      intro: values.heroIntro,
      primaryCtaLabel: values.primaryCtaLabel,
      primaryCtaHref: values.primaryCtaHref,
      secondaryCtaLabel: values.secondaryCtaLabel,
      secondaryCtaHref: values.secondaryCtaHref,
      tags: parseLines(values.heroTags),
      noteLabel: values.heroNoteLabel,
      noteTitle: values.heroNoteTitle,
      status: values.heroStatus,
      highlights: parseLines(values.heroHighlights),
      stats: [
        { label: values.heroStatLabel1, value: values.heroStatValue1 },
        { label: values.heroStatLabel2, value: values.heroStatValue2 },
        { label: values.heroStatLabel3, value: values.heroStatValue3 },
      ].filter((item) => item.label && item.value),
    },
    currentFocus: {
      eyebrow: values.focusEyebrow,
      title: values.focusTitle,
      description: values.focusDescription,
      status: values.focusStatus,
      items: parseLines(values.focusItems),
      updatedAt: values.focusUpdatedAt,
      badgeLabel: values.focusBadgeLabel,
    },
  };
}

export async function saveHomeContent(values: HomeContentEditorValues) {
  const content = buildHomeContent(values);
  await fs.writeFile(homeContentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}
