import { cookies } from "next/headers";
import {
  getMessages,
  isLocale,
  localeCookieName,
  type Locale,
} from "@/lib/messages";

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(localeCookieName)?.value;
  return isLocale(locale) ? locale : "zh";
}

export async function getRequestMessages() {
  const locale = await getRequestLocale();
  return getMessages(locale);
}

