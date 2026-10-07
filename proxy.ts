import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "./lib/i18n";

/** Redirect locale-less paths to /fr or /en based on Accept-Language. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  const accept = request.headers.get("accept-language") ?? "";
  const preferred = accept.toLowerCase().startsWith("en") ? "en" : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|images|videos|cv|favicon.ico|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml).*)"],
};
