import { getMessages, type Locale } from "@/lib/messages";

export function getSiteLinks(locale: Locale) {
  const messages = getMessages(locale);

  return [
    { href: "/", label: messages.nav.home },
    { href: "/blog", label: messages.nav.blog },
    { href: "/projects", label: messages.nav.projects },
    { href: "/about", label: messages.nav.about },
  ];
}
