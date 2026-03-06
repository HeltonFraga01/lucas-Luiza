import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";

// Protected routes
const protectedRoutes = ["/admin"];
const publicRoutes = ["/admin/login"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route) && path !== "/admin/login");
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("session")?.value;
  let session = null;
  
  if (cookie) {
    try {
      session = await decrypt(cookie);
    } catch (e) {
      console.error("Invalid session");
    }
  }

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session?.role) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  // Redirect to admin dashboard if accessing login page with existing session
  if (isPublicRoute && session?.role === "admin") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
