import { cookies } from "next/headers";
import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ isLoggedIn: false });
    }
    
    const payload = await DecodedJwtToken(token);
    
    if (payload) {
      return NextResponse.json({ 
        isLoggedIn: true,
        user: { id: payload.id, email: payload.email }
      });
    } else {
      return NextResponse.json({ isLoggedIn: false });
    }
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false });
  }
}