"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductDetailsContent from "@/lib/productDetails/ProductDetailsContent";
import ProductDetailsSkeleton from "@/lib/productDetails/ProductDetailsSkeleton";
import ProductNotFound from "@/lib/productDetails/ProductNotFound";
// import ProductDetailsContent from "@/components/product/ProductDetailsContent";
// import ProductDetailsSkeleton from "@/components/product/ProductDetailsSkeleton";
// import ProductNotFound from "@/components/product/ProductNotFound";

export default function Page() { 
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/product/detail?id=${id}`);
                const data = await response.json();
                
                if (data.status === "success") {
                    setProduct(data.data);
                } else {
                    setError("Product not found");
                }
            } catch (err) {
                setError("Failed to load product details");
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    if (loading) {
        return <ProductDetailsSkeleton />;
    }

    if (error || !product) {
        return <ProductNotFound router={router} />;
    }

    return <ProductDetailsContent product={product} router={router} />;
}