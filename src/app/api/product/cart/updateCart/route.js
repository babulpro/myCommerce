import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req) {
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

    // 2. Get request body
    const body = await req.json();
    const { quantity } = body;

    // 3. Validate quantity
    if (!quantity && quantity !== 0) {
      return NextResponse.json(
        { status: "fail", message: "Quantity is required" },
        { status: 400 }
      );
    }

    if (typeof quantity !== 'number') {
      return NextResponse.json(
        { status: "fail", message: "Quantity must be a number" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { status: "fail", message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    if (quantity > 99) {
      return NextResponse.json(
        { status: "fail", message: "Maximum quantity is 99" },
        { status: 400 }
      );
    }

    // 4. Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "fail", message: "Authentication required" },
        { status: 401 }
      );
    }

    // 5. Verify token
    const payload = await DecodedJwtToken(token);
    const userId = payload?.id;

    if (!userId) {
      return NextResponse.json(
        { status: "fail", message: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // 6. Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { status: "fail", message: "User not found" },
        { status: 404 }
      );
    }

    // 7. Find the cart item and verify ownership
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId: userId
        }
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            inventory: true,
            discountPercent: true
          }
        },
        cart: true
      }
    });

    if (!cartItem) {
      return NextResponse.json(
        { status: "fail", message: "Cart item not found" },
        { status: 404 }
      );
    }

    // 8. Check stock availability
    if (quantity > cartItem.product.inventory) {
      return NextResponse.json(
        { 
          status: "fail", 
          message: `Only ${cartItem.product.inventory} items available in stock` 
        },
        { status: 400 }
      );
    }

    // 9. Update cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            discountPercent: true,
            inventory: true
          }
        }
      }
    });

    // 10. Get updated cart with all items
    const cart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                discountPercent: true
              }
            }
          }
        }
      }
    });

    // 11. Calculate cart totals
    let totalItems = 0;
    let subtotal = 0;
    let discount = 0;

    cart.items.forEach((item) => {
      const itemPrice = item.product.price;
      const itemDiscount = item.product.discountPercent || 0;
      const discountedPrice = itemPrice - (itemPrice * itemDiscount / 100);
      
      totalItems += item.quantity;
      subtotal += discountedPrice * item.quantity;
      discount += (itemPrice * itemDiscount / 100) * item.quantity;
    });

    const shipping = subtotal > 1000 ? 0 : 60;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    const summary = {
      totalItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };

    // 12. Return success response
    return NextResponse.json({
      status: "success",
      message: "Cart item quantity updated successfully",
      data: {
        cartItem: updatedCartItem,
        cartSummary: summary
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Update Cart Item Error:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return NextResponse.json(
        { status: "fail", message: "Cart item not found" },
        { status: 404 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { status: "fail", message: "Duplicate cart item" },
        { status: 409 }
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