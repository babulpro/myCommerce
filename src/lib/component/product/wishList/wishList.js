"use client"
import Link from "next/link";
import { useEffect, useState } from "react"
import React from "react";

export default function WishlistLink(){
    const [wishlist,setWishlist]=useState([])
     useEffect(() => {
       const fetchWishlist = async () => {
         try {  
           const response = await fetch('/api/product/wishList/getWishList');
        //    console.log(response.json())
           
        //    if (!response.ok) {
        //       setWishlist([])
        //    }
           
           const data = await response.json();
           console.log(data.data)
           
           if (data.status === "success") {
             // Extract product items from the response - data.data contains the array
             const items = data.data || [];
             setWishlist(items);
           } else {
             throw new Error(data.msg || "Failed to load wishlist");
           }
         } catch (error) { 
           setWishlist([]);
         } 
       };
       
       fetchWishlist();
     }, []);
     console.log(wishlist)
   

    return(
        <div>
            <Link 
                href="/pages/wishlist" 
                className="relative p-2 transition-all duration-300 rounded-lg hover:bg-gray-50"
                title="View Wishlist"
              >
                <span className="text-lg">❤️</span>
                {wishlist.length > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full -top-1 -right-1"
                    style={{
                      backgroundColor: 'var(--accent-500)',
                      color: 'white'
                    }}>
                    {wishlist.length}
                  </span>
                )}
              </Link>
        </div>
    )
}