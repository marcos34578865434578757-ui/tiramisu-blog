export const POST_CATEGORIES = [
  "AI 使用心得",
  "成长思考",
  "工具分享",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export function isPostCategory(value: string): value is PostCategory {
  return POST_CATEGORIES.includes(value as PostCategory);
}
