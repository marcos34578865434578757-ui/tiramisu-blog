import type { TocItem } from "@/lib/posts";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

export async function Toc({ items }: { items: TocItem[] }) {
  if (!items.length) {
    return null;
  }

  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <aside className="glass-panel sticky top-24 rounded-[28px] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {messages.blog.toc}
      </p>
      <nav className="mt-4 space-y-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={[
              "block text-sm leading-6 text-slate-500 hover:text-[#148d83]",
              item.depth === 3 ? "pl-4" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {item.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}
