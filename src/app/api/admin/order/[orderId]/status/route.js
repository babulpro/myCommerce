// app/api/admin/orders/[orderId]/status/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
// import { sendOrderStatusEmail } from "@/lib/email/orderStatusEmail";

export async function PATCH(request, { params }) {
  try {
    const { orderId } = await params;
    const { status, adminNotes } = await request.json();

    // Validate status
    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Get current order to check if it's already cancelled
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true, user: { select: { email: true, name: true } } }
    });

    if (!currentOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Prevent updating cancelled orders (unless it's being re-activated)
    if (currentOrder.status === "CANCELLED" && status !== "CANCELLED") {
      return NextResponse.json(
        { success: false, error: "Cannot update a cancelled order" },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(adminNotes && { adminNotes }),
        statusHistory: {
          create: {
            status,
            notes: adminNotes || `Status changed to ${status}`
          }
        }
      },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    // Send email notification to customer
    // try {
    //   await sendOrderStatusEmail({
    //     to: updatedOrder.user.email,
    //     customerName: updatedOrder.user.name,
    //     orderId: orderId.slice(-8).toUpperCase(),
    //     status,
    //     items: updatedOrder.items.map(item => item.product.name),
    //     totalAmount: updatedOrder.totalAmount
    //   });
    // } catch (emailError) {
    //   console.error("Failed to send status email:", emailError);
    //   // Don't fail the request if email fails
    // }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "Order status updated successfully"
    });

  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order status" },
      { status: 500 }
    );
  }
}