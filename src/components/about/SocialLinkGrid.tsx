import Link from "next/link";
import { Github, Mail } from "lucide-react";
import type { Profile } from "@/data/profile";

const iconMap: Record<string, string> = {
  bilibili: "B",
  xiaohongshu: "红",
  x: "X",
};

export function SocialLinkGrid({
  socialLinks,
}: {
  socialLinks: Profile["socialLinks"];
}) {
  const activeLinks = socialLinks.filter((link) => link.enabled);

  return (
    <div className="flex flex-wrap gap-4">
      {activeLinks.map((link) => {
        const dark = link.variant === "dark";
        const iconOnly = link.variant === "icon";

        return (
          <Link
            key={link.key}
            href={link.href}
            target={link.key === "email" ? undefined : "_blank"}
            rel={link.key === "email" ? undefined : "noreferrer"}
            className={[
              "group inline-flex items-center gap-3 rounded-[24px] border px-5 py-3 shadow-[0_16px_36px_rgba(51,65,85,0.08)] backdrop-blur hover:-translate-y-0.5",
              dark
                ? "border-white/40 bg-[linear-gradient(135deg,#0f172a,#111827)] text-white"
                : "theme-card-soft text-[var(--color-ink)]",
              iconOnly ? "justify-center px-4" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span
              className={[
                "flex h-10 w-10 items-center justify-center rounded-2xl",
                dark ? "bg-white text-slate-900" : "bg-white/80 text-[var(--color-accent)]",
              ].join(" ")}
            >
              {link.key === "github" ? (
                <Github size={18} />
              ) : link.key === "email" ? (
                <Mail size={18} />
              ) : (
                <span className="text-sm font-semibold">{iconMap[link.key]}</span>
              )}
            </span>
            {!iconOnly ? (
              <span className="text-lg font-semibold tracking-tight">{link.label}</span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
