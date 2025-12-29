import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 1. Get data from request
    const data = await req.json();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    // 2. Basic validation
    if (!productId) {
      return NextResponse.json(
        { status: "fail", msg: "Product ID is required" },
        { status: 400 }
      );
    }

    // Validate quantity
    if(data){
    if (data.quantity && (data.quantity < 1 || data.quantity > 99)) {
      return NextResponse.json(
        { status: "fail", msg: "Quantity must be between 1 and 99" },
        { status: 400 }
      );
    }}

    // 3. Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { status: "fail", msg: "Please log in" },
        { status: 401 }
      );
    }

    const payload = await DecodedJwtToken(token);
    const userId = payload.id;

    if (!userId) {
      return NextResponse.json(
        { status: "fail", msg: "Invalid token" },
        { status: 401 }
      );
    }

    // 4. Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { status: "fail", msg: "User not found" },
        { status: 404 }
      );
    }

    // 5. Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { status: "fail", msg: "Product not found" },
        { status: 404 }
      );
    }

    // 6. Find or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: userId }
      });
    }

    // 7. Set default values if not provided
    const quantity = data.quantity || 1;
    const size = data.size || 'M';
    const color = data.color || 'BLACK';

    // 8. Check if same item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
        size: size,
        color: color
      }
    });

    // ⚠️ CRITICAL: If item already exists, DON'T add it again
    if (existingCartItem) {
      return NextResponse.json({
        status: "fail",
        msg: "This item is already in your cart"
      }, { status: 400 });
    }

    // 9. Create new cart item
    const newCartItem = await prisma.cartItem.create({
      data: {
        quantity: quantity,
        size: size,
        color: color,
        productId: productId,
        cartId: cart.id
      }
    });

    return NextResponse.json({
      status: "success",
      msg: "Item added to cart successfully",
      data: newCartItem
    }, { status: 201 });

  } catch (error) {
    console.error("Cart API Error:", error);

    // Handle specific errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { status: "fail", msg: "Item already in cart" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { status: "fail", msg: "Something went wrong" },
      { status: 500 }
    );
  }
}