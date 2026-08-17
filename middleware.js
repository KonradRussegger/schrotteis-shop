import { NextResponse } from "next/server";

// Einfacher HTTP-Basic-Auth-Schutz für /admin. Für den Start ausreichend bei
// einer Person, die die Produkte pflegt. Bei mehreren Nutzer:innen später auf
// eine echte Login-Lösung (z.B. Supabase Auth) umstellen.
export function middleware(request) {
  const auth = request.headers.get("authorization");
  const expected =
    "Basic " +
    Buffer.from(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASSWORD}`).toString("base64");

  if (auth !== expected) {
    return new NextResponse("Zugriff verweigert.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
