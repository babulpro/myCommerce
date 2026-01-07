import { NextResponse } from "next/server";
import { DecodedJwtToken } from "./lib/authFunction/JwtHelper";

export async function proxy(req) {
  // Protect admin pages
  if (req.nextUrl.pathname.startsWith("/admin/pages")) {
    const token = req.cookies.get("token");
    
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    try {
      const payload = await DecodedJwtToken(token.value);
      
      // Check if user has admin role
      if (payload.role !== "ADMIN") {
        // Redirect non-admin users to user dashboard
        return NextResponse.redirect(new URL("/", req.url));
      }
      
      // Set headers for admin
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('user-id', payload.id);
      requestHeaders.set('user-role', payload.role);
      
      return NextResponse.next({
        request: { headers: requestHeaders }
      });
      
    } catch (error) {
      // Invalid token - clear it and redirect to login
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.delete("token");
      return response;
    }
  }
  
  // Protect user dashboard pages
  if (req.nextUrl.pathname.startsWith("/user/pages")) {
    const token = req.cookies.get("token");
    
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    try {
      const payload = await DecodedJwtToken(token.value);
      
      // Set headers for user
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('user-id', payload.id);
      requestHeaders.set('user-role', payload.role);
      
      return NextResponse.next({
        request: { headers: requestHeaders }
      });
      
    } catch (error) {
      // Invalid token - clear it and redirect to login
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }
  
  // Protect API routes - Fixed order to avoid conflicts
  if (req.nextUrl.pathname.startsWith("/api/admin")) {
    const token = req.cookies.get("token");
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    try {
      const payload = await DecodedJwtToken(token.value);
      
      // Check admin role
      if (payload.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        );
      }
      
      // Set headers for admin
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('user-id', payload.id);
      requestHeaders.set('user-role', payload.role);
      
      return NextResponse.next({
        request: { headers: requestHeaders }
      });
      
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
  }
  
  // Other API protections
  if (
    req.nextUrl.pathname.startsWith("/api/secret") ||
    req.nextUrl.pathname.startsWith("/api/orders") ||
    req.nextUrl.pathname.startsWith("/api/wishlist") ||
    req.nextUrl.pathname.startsWith("/api/cart")
  ) {
    const token = req.cookies.get("token");
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    try {
      const payload = await DecodedJwtToken(token.value);
      
      // Set headers
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('user-id', payload.id);
      requestHeaders.set('user-role', payload.role);
      
      return NextResponse.next({
        request: { headers: requestHeaders }
      });
      
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
  }
  
  // Continue to next if no protection needed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/pages/:path*',
    '/user/pages/:path*',
    '/api/admin/:path*',
    '/api/secret/:path*',
    '/api/orders/:path*',
    '/api/wishlist/:path*',
    '/api/cart/:path*',
  ],
}