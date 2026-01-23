import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");
        
        // Get data from request body
        const data = await req.json();
        const { quantity, size, color, customerNote } = data;

        // Validate required fields from query
        if (!productId) {
            return NextResponse.json(
                { status: "fail", msg: "Product ID is required in query parameters" },
                { status: 400 }
            );
        }

        // Validate quantity
        if (!quantity || quantity < 1 || quantity > 99) {
            return NextResponse.json(
                { status: "fail", msg: "Quantity must be between 1 and 99" },
                { status: 400 }
            );
        }

        // Authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { status: "fail", msg: "Please login to place an order" },
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

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({
                status: "fail",
                msg: "User not found"
            }, { status: 404 });
        }

        // Find address
        const findAddress = await prisma.address.findFirst({
            where: { userId: userId }
        });

        // Check if user has at least one address
        if (!findAddress) {
            return NextResponse.json({
                status: "fail",
                msg: "Please add a shipping address before placing an order"
            }, { status: 400 });
        } 

        // Use the first/default address 
        const addressId =findAddress.id;

        // Get product
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json(
                { status: "fail", msg: "Product not found" },
                { status: 404 }
            );
        }

        // Check inventory
        if (product.inventory < quantity) {
            return NextResponse.json({
                status: "fail",
                msg: `Only ${product.inventory} items available in stock`
            }, { status: 400 });
        }

        // Validate size (if provided)
        const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        const orderSize = size || 'M';

        if (!validSizes.includes(orderSize)) {
            return NextResponse.json({
                status: "fail",
                msg: `Invalid size. Available sizes: ${validSizes.join(', ')}`
            }, { status: 400 });
        }

        // Validate color (if provided)
        const validColors = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'BLACK', 'WHITE', 
                           'ORANGE', 'PURPLE', 'PINK', 'BROWN', 'GRAY', 'MULTI'];

        const orderColor = color || 'BLACK';
        if (!validColors.includes(orderColor)) {
            return NextResponse.json({
                status: "fail",
                msg: `Invalid color. Available colors: ${validColors.join(', ')}`
            }, { status: 400 });
        }

        // Process order in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Calculate item price (consider discount if any)
            const itemPrice = product.compareAtPrice && product.discountPercent > 0 
                ? product.compareAtPrice * (1 - product.discountPercent / 100)
                : product.price;
            
            const totalAmount = itemPrice * quantity;

            // Create the order
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    addressId: addressId,
                    totalAmount: totalAmount,
                    customerNote: customerNote || null,
                    status: 'PENDING',
                    items: {
                        create: [{
                            productId: productId,
                            quantity: quantity,
                            price: itemPrice,
                            size: orderSize,
                            color: orderColor
                        }]
                    }
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    images: true,
                                    price: true,
                                    discountPercent: true,
                                    compareAtPrice: true
                                }
                            }
                        }
                    },
                    address: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });

            // Reduce product inventory
            await tx.product.update({
                where: { id: productId },
                data: {
                    inventory: {
                        decrement: quantity
                    }
                }
            });

            // Check and clear cart item if exists
            const userCart = await tx.cart.findUnique({
                where: { userId: userId },
                include: { 
                    items: {
                        where: {
                            productId: productId,
                            size: orderSize,
                            color: orderColor
                        }
                    }
                }
            });

            if (userCart && userCart.items.length > 0) {
                // Remove this specific item from cart
                await tx.cartItem.deleteMany({
                    where: { 
                        cartId: userCart.id,
                        productId: productId,
                        size: orderSize,
                        color: orderColor
                    }
                });
            }

            return order;
        });

        return NextResponse.json({
            status: "success",
            msg: "Order placed successfully",
            order: result
        }, { status: 201 });

    } catch (error) {
        console.error("Order creation error:", error);
        
        // Handle specific errors
        if (error.message.includes("Only")) {
            return NextResponse.json(
                { status: "fail", msg: error.message },
                { status: 400 }
            );
        }

        if (error.message.includes("Invalid")) {
            return NextResponse.json(
                { status: "fail", msg: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { status: "fail", msg: "Failed to place order. Please try again." },
            { status: 500 }
        );
    }
}



// Alternative: Order from cart (multiple items)
export async function PUT(req) {
    try {
        // This endpoint allows ordering all items from cart
        const data = await req.json();
        const { customerNote } = data;

        // Authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { status: "fail", msg: "Please login to place an order" },
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

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({
                status: "fail",
                msg: "User not found"
            }, { status: 404 });
        }

        // Check if user has at least one address
          // Find address
        const findAddress = await prisma.address.findFirst({
            where: { userId: userId }
        });

        // Check if user has at least one address
        if (!findAddress) {
            return NextResponse.json({
                status: "fail",
                msg: "Please add a shipping address before placing an order"
            }, { status: 400 });
        } 

        // Use the first/default address 
        const addressId =findAddress.id;


        // Get user's cart with items
        const cart = await prisma.cart.findUnique({
            where: { userId: userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({
                status: "fail",
                msg: "Your cart is empty"
            }, { status: 400 });
        }

        // Process order in transaction
        const result = await prisma.$transaction(async (tx) => {
            let totalAmount = 0;
            const orderItems = [];
            
            // Validate each cart item
            for (const cartItem of cart.items) {
                const product = cartItem.product;
                
                if (product.inventory < cartItem.quantity) {
                    throw new Error(
                        `Insufficient stock for "${product.name}". Available: ${product.inventory}, Requested: ${cartItem.quantity}`
                    );
                }

                // Calculate item price
                const itemPrice = product.compareAtPrice && product.discountPercent > 0 
                    ? product.compareAtPrice * (1 - product.discountPercent / 100)
                    : product.price;
                
                const itemTotal = itemPrice * cartItem.quantity;
                totalAmount += itemTotal;

                // Prepare order item
                orderItems.push({
                    productId: product.id,
                    quantity: cartItem.quantity,
                    price: itemPrice,
                    size: cartItem.size,
                    color: cartItem.color
                });

                // Reduce inventory
                await tx.product.update({
                    where: { id: product.id },
                    data: {
                        inventory: {
                            decrement: cartItem.quantity
                        }
                    }
                });
            }

            // Create the order
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    addressId: addressId,
                    totalAmount: totalAmount,
                    customerNote: customerNote || null,
                    status: 'PENDING',
                    items: {
                        create: orderItems
                    }
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    images: true
                                }
                            }
                        }
                    },
                    address: true
                }
            });

            // Clear the entire cart
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            });

            return order;
        });

        return NextResponse.json({
            status: "success",
            msg: "Order placed successfully from cart",
            order: result
        }, { status: 201 });

    } catch (error) {
        console.error("Cart order creation error:", error);
        
        if (error.message.includes("Insufficient stock")) {
            return NextResponse.json(
                { status: "fail", msg: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { status: "fail", msg: "Failed to place order. Please try again." },
            { status: 500 }
        );
    }
}





// Get all orders for the authenticated user (remains same)
export async function GET(req) {
    try {
        // Authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { status: "fail", msg: "Please login to view orders" },
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
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;
        const status = searchParams.get('status');

        // Build where clause
        const where = { userId: userId };
        if (status && status !== 'ALL') {
            where.status = status;
        }

        // Get orders with pagination
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    images: true
                                }
                            }
                        }
                    },
                    address: true,
                    transaction: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.order.count({ where })
        ]);

        return NextResponse.json({
            status: "success",
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Get orders error:", error);
        return NextResponse.json(
            { status: "fail", msg: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}