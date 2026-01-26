import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();  
    if (!data.name || !data.price) {
      return NextResponse.json({
        status: "fail",
        message: "Name and price are required"
      }, { status: 400 });
    }

    // Ensure categoryId is valid
    if (!data.categoryId) {
      return NextResponse.json({
        status: "fail",
        message: "Category ID is required"
      }, { status: 400 });
    }

    // Helper function to ensure array format
    const ensureArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return value.split(',').map(item => item.trim()).filter(item => item);
      return [];
    };

    // Create product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || "",
        price: parseFloat(data.price),
        images: data.images || [],
        brand: data.brand || "",
        currency: data.currency || "USD",
        inventory: parseInt(data.inventory) || 0,
        featured: Boolean(data.featured),
        rating: parseFloat(data.rating) || 0,
        reviewCount: parseInt(data.reviewCount) || 0,
        tags: ensureArray(data.tags),
        size: ensureArray(data.size),
        color: ensureArray(data.color),
        type: data.type || "general",
        discountPercent: parseFloat(data.discountPercent) || 0,
        compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
        categoryId: data.categoryId,
        char: data.char || [] // Added char field
      }
    });

    return NextResponse.json({
      status: "success",
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({
      status: "fail",
      message: "Failed to create product: " + error.message
    }, { status: 500 });
  }
}