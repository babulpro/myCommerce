import { NextResponse } from "next/server";
import { DecodedJwtToken } from "./JwtHelper";

export async function CheckCookies(req) {
  try {
    // Get token from cookies
    let token = req.cookies.get('token');
    
    // If no token, redirect to login
    if (!token) {
      return NextResponse.next(new URL('/', req.url));
    }
    
    // Decode token
    let payload = await DecodedJwtToken(token['value']);
    
    // If token invalid, redirect to login
    if (!payload || !payload.id || !payload.role) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('user-id', payload.id);
    requestHeaders.set('user-role', payload.role);
    
    // Get the current path
    const path = req.nextUrl.pathname;
    
    // Admin routes protection
    if (path.startsWith('/dashboard/admin')) {
      if (payload.role !== 'ADMIN') {
        // Non-admin users trying to access admin routes
        return NextResponse.redirect(new URL('/dashboard/user', req.url));
      }
    }
    
    // User routes protection
    if (path.startsWith('/dashboard/user')) {
      // All authenticated users can access user routes
      // Additional checks can be added here if needed
    }
    
    // API routes protection based on role
    if (path.startsWith('/api/admin')) {
      if (payload.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Unauthorized access' },
          { status: 403 }
        );
      }
    }
    
    if (path.startsWith('/api/user')) {
      // Add user-specific API protection here
      // For example, ensure users can only access their own data
    }
    
    return NextResponse.next({
      request: { headers: requestHeaders }
    });
    
  } catch(error) {
    console.error("Middleware error:", error);
    
    // Clear invalid token
    const response = NextResponse.redirect(new URL('/', req.url));
    response.cookies.delete('token');
    
    return response;
  }
}