// app/api/admin/[...rest]/middleware.js or separate auth check
import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import { NextResponse } from "next/server";


export async function middleware(request) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify token
    const decoded = await DecodedJwtToken(token);
    
    // Check if user is admin
    if (decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", decoded.userId);
    requestHeaders.set("x-user-role", decoded.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: "/api/admin/:path*",
};