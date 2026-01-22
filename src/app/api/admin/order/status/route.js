import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Simple PATCH method for order status
export async function PATCH(req) {
    try {
        // Authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ status: "fail", msg: "Unauthorized" }, { status: 401 });
        }

        const payload = await DecodedJwtToken(token);
        const userId = payload.id;

        if (!userId) {
            return NextResponse.json({ status: "fail", msg: "Invalid token" }, { status: 401 });
        }

        const { orderId, status } = await req.json();

        if (!orderId || !status) {
            return NextResponse.json({ status: "fail", msg: "Missing order ID or status" }, { status: 400 });
        }

        // Update order status
        const order = await prisma.order.update({
            where: { 
                id: orderId, 
            },
            data: { status }
        });

        return NextResponse.json({
            status: "success",
            msg: "Order status updated",
            order: order
        });

    } catch (error) {
        console.error("PATCH order error:", error);
        return NextResponse.json({ status: "fail", msg: "Failed to update order" }, { status: 500 });
    }
}
