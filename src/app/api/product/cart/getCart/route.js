import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // 1. Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "fail", message: "Authentication required" },
        { status: 401 }
      );
    }

    // 2. Verify token
    const payload = await DecodedJwtToken(token);
    const userId = payload?.id;

    if (!userId) {
      return NextResponse.json(
        { status: "fail", message: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // 3. Check if user exists (optional but good for validation)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { status: "fail", message: "User not found" },
        { status: 404 }
      );
    }

    // // 4. Fetch cart with items and product details
    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        items: {
          include: {
            product:true
          },
          orderBy: {
            createdAt: 'desc', // Optional: sort by newest first
          },
        },
      },
    });

    

    // 7. Return response
    return NextResponse.json({
      status: "success",
      data:cart
    }, { status: 200 });

  } catch (error) { 

    return NextResponse.json(
      { status: "fail", message: "Internal server error" },
      { status: 500 }
    );
  }
}