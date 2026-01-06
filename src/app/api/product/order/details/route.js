import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { status: "fail", msg: "Please login to view order details" },
                { status: 401 }
            );
        }

        const payload = await DecodedJwtToken(token);
        const userId = payload.id;
        if (!userId) {
            return NextResponse.json(
                { status: "fail", msg: "Invalid user session" },
                { status: 401 }
            );
        }

        // Parse query parameters
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('id');
        
        if (!orderId) {
            return NextResponse.json(
                { status: "fail", msg: "Order ID is required" },
                { status: 400 }
            );
        }
       

        // Get the specific order
        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
                userId: userId // Ensure user can only access their own orders
            },
            include: {
                items: {
                    include: {
                        product: {
                                   }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                address: {
                    
                },
                transaction: {
                   
                },
                user: {
                }
            }
        });

        if (!order) {
            return NextResponse.json(
                { status: "fail", msg: "Order not found" },
                { status: 404 }
            );
        }

        

        return NextResponse.json({
            status: "success",data:order
        }, { status: 200 });

    } catch (error) {
        console.error("Get order details error:", error);
        return NextResponse.json(
            { status: "fail", msg: "Failed to fetch order details" },
            { status: 500 }
        );
    }
}
 