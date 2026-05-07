import Link from "next/link";
import { profile } from "@/data/profile";
import { Container } from "./Container";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";
import { getSiteLinks } from "@/lib/site";

export async function Footer() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const siteLinks = getSiteLinks(locale);

  return (
    <footer className="mt-24 border-t border-[var(--color-border)] pb-10 pt-8">
      <Container wide>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {profile.siteName}
            </p>
            <h2 className="text-2xl font-semibold text-[var(--color-ink)]">
              {messages.footer.heading}
            </h2>
            <p className="text-sm leading-7 text-[var(--color-muted)]">
              {messages.footer.body}
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {siteLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="text-sm text-[var(--color-muted)]">
              {messages.footer.contact}{" "}
              <a
                className="font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)]"
                href={`mailto:${profile.email}`}
              >
                {profile.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
