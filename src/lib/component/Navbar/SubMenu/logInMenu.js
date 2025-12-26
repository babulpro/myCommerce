"use client"
 import React from "react";
import Logout from "./LogOut";
import Wishlist from "./wishList";
import ProfileCart from "./profileCart";


export default function LogInMenu() {
    
  return (
    <div className="flex items-center gap-3">
      
      {/* Wishlist Icon - Hidden on Mobile */}
      <Wishlist/>

      {/* Shopping Cart - Hidden on Mobile */}
      <ProfileCart/>
      

      {/* User Profile - Always Visible */}
     
      <Logout/>
    </div>
  );
}