import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('nextshop-session')?.value;
        
        // Delete session from database
        if (sessionToken) {
            await prisma.session.deleteMany({
                where: { sessionToken }
            });
        }
        
        // Create response
        const response = NextResponse.json(
            { status: "success", msg: "Logout successful" }, 
            { status: 200 }
        );
        
        // Clear cookies in response
        response.cookies.delete('nextshop-session');
        response.cookies.delete('token');
        
        return response;

    } catch (e) {
        console.error("Logout error:", e);
        return NextResponse.json(
            { status: "fail", msg: "Internal server error" },
            { status: 500 }
        );
    }
}