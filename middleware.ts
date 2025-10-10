// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // public routes
  if (url.pathname.startsWith("/_next") || url.pathname.startsWith("/api") || url.pathname === "/" || url.pathname.startsWith("/login") || url.pathname.startsWith("/signup")) {
    return NextResponse.next();
  }

  // Interviewer routes: must be role=interviewer
  if (url.pathname.startsWith("/interviewer")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    if (token.role !== "interviewer") return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  // Interviewee specific routes
  if (url.pathname.startsWith("/interviewee") || url.pathname.startsWith("/interview")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    if (token.role && token.role !== "interviewee") return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  // Default
  return NextResponse.next();
}

export const config = {
  matcher: ["/interviewer/:path*", "/interviewee/:path*", "/interview/:path*"],
};
