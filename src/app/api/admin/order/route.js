// app/api/admin/orders/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "ALL";
    const dateRange = searchParams.get("dateRange") || "ALL";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build date filter
    let dateFilter = {};
    const now = new Date();
    
    switch (dateRange) {
      case "TODAY":
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dateFilter = {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        };
        break;
      case "YESTERDAY":
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        dateFilter = {
          gte: yesterday,
          lt: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000)
        };
        break;
      case "LAST_7_DAYS":
        dateFilter = {
          gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        };
        break;
      case "LAST_30_DAYS":
        dateFilter = {
          gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        };
        break;
      case "THIS_MONTH":
        dateFilter = {
          gte: new Date(now.getFullYear(), now.getMonth(), 1)
        };
        break;
      case "LAST_MONTH":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        dateFilter = {
          gte: lastMonth,
          lt: new Date(now.getFullYear(), now.getMonth(), 1)
        };
        break;
      case "ALL":
      default:
        dateFilter = {};
    }

    // Build status filter
    const statusFilter = status === "ALL" ? {} : { status };

    // Build search filter
    let searchFilter = {};
    if (search) {
      searchFilter = {
        OR: [
          {
            id: {
              contains: search,
              mode: "insensitive"
            }
          },
          {
            user: {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive"
                  }
                },
                {
                  email: {
                    contains: search,
                    mode: "insensitive"
                  }
                }
              ]
            }
          },
          {
            address: {
              OR: [
                {
                  phone: {
                    contains: search,
                    mode: "insensitive"
                  }
                },
                {
                  firstName: {
                    contains: search,
                    mode: "insensitive"
                  }
                },
                {
                  lastName: {
                    contains: search,
                    mode: "insensitive"
                  }
                }
              ]
            }
          }
        ]
      };
    }

    // Combine filters
    const where = {
      ...statusFilter,
      ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
      ...searchFilter
    };

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
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
                  price: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}