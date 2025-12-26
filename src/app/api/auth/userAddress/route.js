import { DecodedJwtToken } from "@/lib/authFunction/JwtHelper";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// GET: Get user's address
export async function GET(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ 
                status: "fail", 
                msg: "Authentication required" 
            }, { status: 401 });
        }

        const payload = await DecodedJwtToken(token);
        const userId = payload.id;

        // Find user
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
        const address = await prisma.address.findFirst({
            where: { userId: userId }
        });

        // Return address if found, else empty array
        return NextResponse.json({
            status: "success",
            msg: address ? [address] : []
        });

    } catch (error) {
        console.error("GET Address Error:", error);
        return NextResponse.json({ 
            status: "fail", 
            msg: "Something went wrong" 
        }, { status: 500 });
    }
}

// POST: Create or update address (upsert)
export async function POST(req) {
    try {
        const data = await req.json();
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ 
                status: "fail", 
                msg: "Authentication required" 
            }, { status: 401 });
        }

        const payload = await DecodedJwtToken(token);
        const userId = payload.id;

        // Find user
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json({ 
                status: "fail", 
                msg: "User not found" 
            }, { status: 404 });
        }

        // Add userId to data for new address
        if (!data.userId) {
            data.userId = userId;
        }

        // Check if address already exists
        const existingAddress = await prisma.address.findFirst({
            where: { userId: userId }
        });

        let result;
        
        if (existingAddress) {
            // Update existing address - only update the address fields, not userId
            // Remove userId from update data since it shouldn't change
            const { userId: _, ...updateData } = data;
            
            result = await prisma.address.update({
                where: { id: existingAddress.id },
                data: {
                    firstName: updateData.firstName || existingAddress.firstName,
                    lastName: updateData.lastName || existingAddress.lastName,
                    street: updateData.street || existingAddress.street,
                    city: updateData.city || existingAddress.city,
                    state: updateData.state || existingAddress.state,
                    zipCode: updateData.zipCode || existingAddress.zipCode,
                    country: updateData.country || existingAddress.country,
                    phone: updateData.phone || existingAddress.phone
                }
            });
            return NextResponse.json({ 
                status: "success", 
                msg: "Address updated successfully",
                data: result 
            });
        } else {
            // Create new address
            // Validate all required fields are present
            const requiredFields = ['firstName', 'lastName', 'street', 'city', 'state', 'zipCode', 'phone'];
            for (const field of requiredFields) {
                if (!data[field] || data[field].trim() === '') {
                    return NextResponse.json({ 
                        status: "fail", 
                        msg: `${field} is required` 
                    }, { status: 400 });
                }
            }

            // Set default country if not provided
            if (!data.country) {
                data.country = "Bangladesh";
            }

            result = await prisma.address.create({
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    street: data.street,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zipCode,
                    country: data.country,
                    phone: data.phone,
                    userId: userId
                }
            });
            return NextResponse.json({ 
                status: "success", 
                msg: "Address created successfully",
                data: result 
            }, { status: 201 });
        }

    } catch (error) {
        console.error("POST Address Error:", error);
        console.error("Error details:", error.message);
        
        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return NextResponse.json({ 
                status: "fail", 
                msg: "Address already exists for this user" 
            }, { status: 400 });
        }
        
        if (error.code === 'P2025') {
            return NextResponse.json({ 
                status: "fail", 
                msg: "Record not found for update" 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            status: "fail", 
            msg: error.message || "Something went wrong" 
        }, { status: 500 });
    }
}