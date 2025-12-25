import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("id");
        
        if (!productId) {
            return NextResponse.json(
                { 
                    status: "fail", 
                    msg: "Product ID is required",
                    code: "MISSING_PRODUCT_ID" 
                },
                { status: 400 }
            );
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json(
                { 
                    status: "fail", 
                    msg: "Authentication required",
                    code: "UNAUTHORIZED" 
                },
                { status: 401 }
            );
        }

        const payload = await DecodedJwtToken(token);
        const userId = payload.id;

        // Check if item exists in user's wishlist
        const wishlistItem = await prisma.wishlist.findFirst({
            where: {
                AND: [
                    { productId: productId },
                    { userId: userId }
                ]
            },
            include: {
                product: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!wishlistItem) {
            return NextResponse.json(
                { 
                    status: "fail", 
                    msg: "Item not found in your wishlist",
                    code: "NOT_IN_WISHLIST" 
                },
                { status: 404 }
            );
        }

        // Delete the item
        await prisma.wishlist.deleteMany({
            where: {
                AND: [
                    { productId: productId },
                    { userId: userId }
                ]
            }
        });

        return NextResponse.json({
            status: "success",
            msg: `${wishlistItem.product.name} removed from wishlist`,
            data: { productId },
            code: "WISHLIST_REMOVED"
        });

    } catch (error) {
        console.error("Delete Wishlist Error:", error);
        return NextResponse.json(
            { 
                status: "error", 
                msg: "Unable to remove from wishlist",
                code: "SERVER_ERROR" 
            },
            { status: 500 }
        );
    }
}
