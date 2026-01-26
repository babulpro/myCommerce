import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

 
export async function DELETE(req) {
     try {
        // Authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json(
                { status: "fail", message: "Please login to cancel order" },
                { status: 401 }
            );
        }

        const payload = await DecodedJwtToken(token);
        const userId = payload.id;
        
        if (!userId) {
            return NextResponse.json(
                { status: "fail", message: "Invalid user session" },
                { status: 401 }
            );
        }

        // Get order ID from query parameters
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('orderId');
        
        if (!orderId) {
            return NextResponse.json(
                { status: "fail", message: "Order ID is required" },
                { status: 400 }
            );
        }

        // Get cancellation reason from request body
        let cancellationReason = "Customer request";
        try {
            const body = await req.json();
            if (body?.reason) {
                cancellationReason = body.reason;
            }
        } catch (error) {
            // Body is optional, continue without reason
        }

        // Check if user exists
        const userExists = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!userExists) {
            return NextResponse.json(
                { status: "fail", message: "User not found" },
                { status: 404 }
            );
        }

        // Find the order with items to check status and ownership
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: {
                        }
                    }
                },
                transaction: { }
            }
        });

        // Check if order exists
        if (!order) {
            return NextResponse.json(
                { status: "fail", message: "Order not found" },
                { status: 404 }
            );
        }

        // Verify the order belongs to the authenticated user
        if (order.userId !== userId) {
            return NextResponse.json(
                { status: "fail", message: "You are not authorized to cancel this order" },
                { status: 403 }
            );
        }

        // Check if order is already cancelled
        if (order.status === 'CANCELLED') {
            return NextResponse.json(
                { status: "fail", message: "Order is already cancelled" },
                { status: 400 }
            );
        }

        // Check if order can be cancelled based on status
        const nonCancellableStatuses = ['SHIPPED', 'DELIVERED', 'COMPLETED'];
        if (nonCancellableStatuses.includes(order.status)) {
            let errorMessage = `Order cannot be cancelled as it is already ${order.status.toLowerCase()}`;
            
            if (order.status === 'SHIPPED') {
                errorMessage = "Order has been shipped and cannot be cancelled. Please contact support for return options.";
            } else if (order.status === 'DELIVERED') {
                errorMessage = "Order has been delivered. You can request a return within 7 days of delivery.";
            } else if (order.status === 'RETURNED') {
                errorMessage = "Order has already been returned.";
            }
            
            return NextResponse.json(
                { status: "fail", message: errorMessage },
                { status: 400 }
            );
        }

        // Check payment status if transaction exists
        if (order.transaction) {
            const paidStatuses = ['COMPLETED', 'SUCCESS'];
            if (paidStatuses.includes(order.transaction.status)) {
                return NextResponse.json(
                    { 
                        status: "fail", 
                        message: "Payment has been completed. Refund will be processed within 5-7 business days." 
                    },
                    { status: 400 }
                );
            }
            
            // If payment failed, allow cancellation without refund concerns
            if (order.transaction.status === 'FAILED') {
                console.log("Payment failed, allowing cancellation without refund process");
            }
        }

        // Process cancellation in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // 1. Update order status to CANCELLED
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: 'CANCELLED',
                    updatedAt: new Date()
                },
                include: {
                    items: {
                        include: {
                            product: {
                                
                            }
                        }
                    }
                }
            });

            // 2. Restore product inventory for each item
            const inventoryUpdates = order.items.map(item => 
                tx.product.update({
                    where: { id: item.productId },
                    data: {
                        inventory: {
                            increment: item.quantity
                        },
                        updatedAt: new Date()
                    }
                })
            );
            
            await Promise.all(inventoryUpdates);

            // 3. Update transaction status if exists and payment was completed
            if (order.transaction && ['COMPLETED', 'SUCCESS'].includes(order.transaction.status)) {
                await tx.transaction.update({
                    where: { id: order.transaction.id },
                    data: {
                        status: 'REFUNDED',
                        updatedAt: new Date()
                    }
                });
            }

            // 4. Create cancellation record as per your schema
            await tx.orderCancellation.create({
                data: {
                    orderId: orderId,
                    userId: userId,
                    reason: cancellationReason,
                    cancelledAt: new Date(),
                    previousStatus: order.status,
                    inventoryRestored: true,
                    itemsCount: order.items.length,
                    totalItemsRestored: order.items.reduce((sum, item) => sum + item.quantity, 0)
                }
            });

            return updatedOrder;
        });

        // Calculate restored inventory details
        const inventoryDetails = result.items.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            quantityRestored: item.quantity,
            newInventory: item.product.inventory + item.quantity
        }));

        const totalItemsRestored = result.items.reduce((sum, item) => sum + item.quantity, 0);

        // Prepare response
        const responseData = {
            orderId: result.id,
            orderNumber: `ORD-${result.id.slice(-8).toUpperCase()}`,
            status: result.status,
            previousStatus: order.status,
            cancelledAt: new Date().toISOString(),
            cancellationReason: cancellationReason,
            message: "Order cancelled successfully",
            inventoryRestored: true,
            inventoryDetails: inventoryDetails,
            totalItemsRestored: totalItemsRestored,
            refundStatus: order.transaction?.status === 'COMPLETED' ? 'PENDING' : 'NOT_REQUIRED'
        };

        // Add refund information if applicable
        if (order.transaction && ['COMPLETED', 'SUCCESS'].includes(order.transaction.status)) {
            responseData.refundStatus = 'PROCESSING';
            responseData.refundMessage = "Refund will be processed to your original payment method within 5-7 business days.";
            responseData.refundAmount = order.totalAmount;
        }

        return NextResponse.json({
            status: "success",
            data: responseData
        }, { status: 200 });

    } catch (error) {
        console.error("Cancel order error:", error);
        
        // Handle specific Prisma errors
        if (error.code === 'P2025') {
            return NextResponse.json(
                { status: "fail", message: "Order not found or already updated" },
                { status: 404 }
            );
        }
        
        if (error.code === 'P2023') {
            return NextResponse.json(
                { status: "fail", message: "Invalid order ID format" },
                { status: 400 }
            );
        }

        if (error.code === 'P2002') {
            return NextResponse.json(
                { status: "fail", message: "Cancellation record already exists for this order" },
                { status: 409 }
            );
        }

        if (error.name === 'PrismaClientValidationError') {
            return NextResponse.json(
                { status: "fail", message: "Invalid request parameters" },
                { status: 400 }
            );
        }

        // Handle MongoDB duplicate key errors
        if (error.message && error.message.includes('E11000')) {
            return NextResponse.json(
                { status: "fail", message: "Cancellation already processed for this order" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { status: "fail", message: "Failed to cancel order. Please try again." },
            { status: 500 }
        );
    }
}