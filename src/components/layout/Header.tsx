import Image from "next/image";
import Link from "next/link";
import { profile } from "@/data/profile";
import { Container } from "./Container";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";
import { getSiteLinks } from "@/lib/site";

export async function Header() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const siteLinks = getSiteLinks(locale);

  return (
    <header className="sticky top-0 z-50 pt-4 sm:pt-5">
      <Container wide>
        <div className="theme-card relative flex items-center justify-between gap-4 rounded-[32px] px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[18px] border border-white/35 shadow-[0_14px_28px_rgba(51,65,85,0.14)]">
              <Image
                src={profile.avatar}
                alt={`${profile.name}${messages.header.avatarAlt}`}
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-base font-semibold text-[var(--color-ink)]">
                {profile.siteName}
              </p>
              <p className="truncate text-xs text-[var(--color-muted)]">
                {messages.header.subtitle}
              </p>
            </div>
          </Link>

          <div className="hidden flex-1 justify-center md:flex">
            <div className="relative">
              <div className="theme-nav-pill absolute inset-x-[-14px] inset-y-[-10px] rounded-full" />
              <nav className="relative flex items-center gap-1 px-3 py-1.5">
                {siteLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-muted)] hover:bg-white/45 hover:text-[var(--color-ink)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}
