import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { CreateJwtToken } from "@/lib/authFunction/JwtHelper";
import { randomBytes } from "crypto";

const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const data = await req.json();
        const findUser = await prisma.user.findUnique({
            where: {
                email: data.email
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                password: true
            }
        });

        if (!findUser) {
            return NextResponse.json({ status: "fail", msg: "User not found" }, { status: 404 });
        }

        const matchPassword = await bcrypt.compare(data.password, findUser.password);

        if (!matchPassword) {
            return NextResponse.json({ status: "fail", msg: "Invalid password" }, { status: 401 });
        }

        // Create session token
        const sessionToken = randomBytes(32).toString('hex');
        let expires = new Date();
        
        // FIXED: getDate() instead of getData()
        expires.setDate(expires.getDate() + (data.rememberMe ? 30 : 7));

        // Create session in database
        const session = await prisma.session.create({
            data: {
                sessionToken,
                expires,
                userId: findUser.id
            }
        });

        // Create JWT token
        const token = await CreateJwtToken(findUser.role, findUser.id);

        // Create response with user data
        const response = NextResponse.json({
            status: "success",
            msg: "User logged in successfully",
            user: {                
                role: findUser.role
            },
            token: token // Optional: include token in response for mobile apps
        });

        // Set session cookie (for server-side authentication)
        response.cookies.set({
            name: "nextshop-session",
            value: sessionToken,
            expires: expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        // Set JWT token cookie (for client-side API calls)
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;

    } catch (e) {
        console.error("Login error:", e);
        return NextResponse.json({ status: "fail", msg: "Internal server error" }, { status: 500 });
    }
}