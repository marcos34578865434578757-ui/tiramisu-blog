import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { InteractiveGlowBackground } from "@/components/ui/InteractiveGlowBackground";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

export const dynamic = "force-dynamic";

const sans = Noto_Sans_SC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const themeInitScript = `
  try {
    const stored = window.localStorage.getItem("theme-preference");
    const theme = stored === "dark" || stored === "light" ? stored : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }
`;

const localeInitScript = `
  try {
    const stored = window.localStorage.getItem("locale-preference");
    const fromCookie = document.cookie
      .split("; ")
      .find((item) => item.startsWith("locale-preference="))
      ?.split("=")[1];
    const locale = stored === "en" || stored === "zh"
      ? stored
      : fromCookie === "en" || fromCookie === "zh"
        ? fromCookie
        : "zh";
    document.documentElement.dataset.locale = locale;
    document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
  } catch {
    document.documentElement.dataset.locale = "zh";
    document.documentElement.lang = "zh-CN";
  }
`;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return {
    metadataBase: new URL("https://tiramisu-blog.vercel.app"),
    title: {
      default: messages.site.title,
      template: `%s | ${messages.site.title}`,
    },
    description: messages.site.description,
    keywords: [
      "AI building",
      "Vibe Coding",
      "Personal blog",
      "Next.js",
      "MDX",
      "UI design",
    ],
    openGraph: {
      title: messages.site.title,
      description: messages.site.ogDescription,
      siteName: messages.site.title,
      type: "website",
      locale: locale === "en" ? "en_US" : "zh_CN",
    },
    twitter: {
      card: "summary_large_image",
      title: messages.site.title,
      description: messages.site.twitterDescription,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html
      lang={locale === "en" ? "en" : "zh-CN"}
      suppressHydrationWarning
      data-locale={locale}
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-[var(--color-bg)] text-[var(--color-ink)]">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Script id="locale-init" strategy="beforeInteractive">
          {localeInitScript}
        </Script>
        <div className="relative min-h-screen overflow-x-clip">
          <InteractiveGlowBackground />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
