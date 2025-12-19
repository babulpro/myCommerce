import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        // Get ALL products
        const response = await prisma.product.findMany();
        
        console.log(`Fetched ${response?.length || 0} products`);
        
        if (!response || response.length === 0) {
            return NextResponse.json(
                { status: "fail", msg: "No products found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(
            { 
                status: "success", 
                msg: "Products fetched successfully", 
                data: response,
                count: response.length 
            },
            { status: 200 }
        );

    } catch (e) {
        console.error("Error fetching products:", e);
        return NextResponse.json(
            { 
                status: "fail", 
                msg: "Error fetching products: " + e.message 
            },
            { status: 500 }
        );
    }
}