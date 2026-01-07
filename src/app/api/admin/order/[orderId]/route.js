// app/api/admin/orders/[orderId]/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        address: true,
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                price: true,
                category: true
              }
            }
          }
        },
        statusHistory: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}







export async function DELETE(request, { params }) {
  try {
    const { orderId } = await params;
    const { reason } = await request.json();

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Only allow cancellation if not already delivered
    if (order.status === "DELIVERED") {
      return NextResponse.json(
        { success: false, error: "Cannot cancel a delivered order" },
        { status: 400 }
      );
    }

    // Update order status to CANCELLED
    const cancelledOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        cancellationReason: reason || "Cancelled by admin",
        statusHistory: {
          create: {
            status: "CANCELLED",
            notes: reason || "Order cancelled by admin"
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      order: cancelledOrder
    });

  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel order" },
      { status: 500 }
    );
  }
}