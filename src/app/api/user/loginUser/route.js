import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { CreateJwtToken } from "@/lib/authFunction/JwtHelper";
import { randomBytes } from "crypto";

const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const data = await req.json();
        
        // Validate rememberMe
        const rememberMe = data.rememberMe === true;
        
        // Calculate expiration time (same for both session and JWT)
        const expiresInDays = rememberMe ? 30 : 5;
        const expiresInSeconds = expiresInDays * 24 * 60 * 60;
        
        const sessionExpires = new Date();
        sessionExpires.setDate(sessionExpires.getDate() + expiresInDays);

        // Find user
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

        // Verify password
        const matchPassword = await bcrypt.compare(data.password, findUser.password);
        if (!matchPassword) {
            return NextResponse.json({ status: "fail", msg: "Invalid password" }, { status: 401 });
        }

        // Create session token
        const sessionToken = randomBytes(32).toString('hex');

        // Create session in database
        await prisma.session.create({
            data: {
                sessionToken,
                expires: sessionExpires,
                userId: findUser.id
            }
        });

        // Create JWT token with same expiration time
        const token = await CreateJwtToken(
            findUser.email, 
            findUser.id, 
            expiresInDays*24 // Pass expiration time in seconds
        );

        // Create response
        const response = NextResponse.json({
            status: "success",
            msg: "User logged in successfully",
            user: {
                id: findUser.id,
                email: findUser.email,
                name: findUser.name,
                role: findUser.role
            },
            token: token
        });

        // Set session cookie (for server-side authentication)
        response.cookies.set({
            name: "nextshop-session",
            value: sessionToken,
            expires: sessionExpires,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        // Set JWT token cookie with same expiration
        response.cookies.set({
            name: "token",
            value: token,
            expires: sessionExpires, // Same expiration as session
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/"
        });

        return response;

    } catch (e) {
        console.error("Login error:", e);
        return NextResponse.json({ status: "fail", msg: "Internal server error" }, { status: 500 });
    }
}