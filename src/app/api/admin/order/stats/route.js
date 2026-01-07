// app/api/admin/orders/stats/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      };
    }

    // Get counts for each status
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      recentOrders,
      topProducts
    ] = await Promise.all([
      // Total orders count
      prisma.order.count({ where: dateFilter }),
      
      // Status-based counts
      prisma.order.count({
        where: { ...dateFilter, status: "PENDING" }
      }),
      prisma.order.count({
        where: { ...dateFilter, status: "PROCESSING" }
      }),
      prisma.order.count({
        where: { ...dateFilter, status: "SHIPPED" }
      }),
      prisma.order.count({
        where: { ...dateFilter, status: "DELIVERED" }
      }),
      prisma.order.count({
        where: { ...dateFilter, status: "CANCELLED" }
      }),
      
      // Total revenue (only from delivered orders)
      prisma.order.aggregate({
        where: { ...dateFilter, status: "DELIVERED" },
        _sum: { totalAmount: true }
      }),
      
      // Recent orders (last 7 days)
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          totalAmount: true,
          status: true,
          createdAt: true,
          user: {
            select: { name: true }
          }
        }
      }),
      
      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            status: "DELIVERED",
            ...dateFilter
          }
        },
        _sum: {
          quantity: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      })
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        recentOrders,
        topProducts
      }
    });

  } catch (error) {
    console.error("Error fetching order stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order statistics" },
      { status: 500 }
    );
  }
}