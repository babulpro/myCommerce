import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    // 1. Get cart item ID from URL
    const { searchParams } = new URL(req.url);
    const cartItemId = searchParams.get('id');

    if (!cartItemId) {
      return NextResponse.json(
        { status: "fail", message: "Cart item ID is required" },
        { status: 400 }
      );
    }

    // 2. Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "fail", message: "Authentication required" },
        { status: 401 }
      );
    }

    // 3. Verify token and get user ID
    const payload = await DecodedJwtToken(token);
    const userId = payload?.id;

    if (!userId) {
      return NextResponse.json(
        { status: "fail", message: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // 4. Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { status: "fail", message: "User not found" },
        { status: 404 }
      );
    }

    // 5. First, find the cart item with its cart relation
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: {
          select: { userId: true } // Only need userId for verification
        },
        product: {
          select: {
            name: true,
            price: true
          }
        }
      }
    });

    // 6. Check if cart item exists
    if (!cartItem) {
      return NextResponse.json(
        { status: "fail", message: "Cart item not found" },
        { status: 404 }
      );
    }

    // 7. Verify ownership - ensure the cart belongs to the authenticated user
    if (cartItem.cart.userId !== userId) {
      return NextResponse.json(
        { status: "fail", message: "You are not authorized to remove this item" },
        { status: 403 }
      );
    }

    // 8. Delete the cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });

    // 9. Get updated cart to return
    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
   

    // 11. Return success response
    return NextResponse.json({
      status: "success",
      message: "Item removed from cart successfully",
      data:  updatedCart
    }, { status: 200 });

  } catch (error) {
    console.error("Delete Cart Item Error:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json(
        { status: "fail", message: "Cart item not found or already removed" },
        { status: 404 }
      );
    }

    if (error.code?.startsWith("P")) {
      return NextResponse.json(
        { status: "fail", message: "Database error occurred" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { status: "fail", message: "Internal server error" },
      { status: 500 }
    );
  }
}