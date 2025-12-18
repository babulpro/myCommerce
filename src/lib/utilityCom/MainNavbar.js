'use client'
import Link from "next/link";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast"; 

const MainNavbar = () => { 
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [role,setRole]=useState("")

 
 

  const logOut = async () => {
    try {
      const response = await fetch("/api/user/logOut", { 
        method: "GET",
        cache: 'no-cache'
      });
      
      const json = await response.json();

      if (json.status === "success") {
        toast.success("Log Out Success");
        window.location.href = "/";
      }
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  // Navigation items configuration
  const navItems = [
    { href: '/', label: 'Home' }, 
    { href: '/dashboard/pages/article', label: 'Post To Rent' },
    { href: '/dashboard/pages/about', label: 'Why Here' },
    { href: '/dashboard/pages/support', label: 'Support' }
  ];

  // Admin-only items
  const adminItems = [
    { href: '/dashboard/pages/admin', label: 'Admin Panel' },
    { href: '/dashboard/pages/admin/statistics', label: 'Statistics' },
  ];

  const renderNavItem = (item) => (
    <li key={item.href}>
      <Link href={item.href} className="w-full px-4 py-2 transition-all duration-300 rounded-lg text-emerald-100/80 hover:text-white hover:bg-white/10">
        {item.label}
      </Link>
    </li>
  );
 
  return (
    <div className="fixed top-0 z-50 border-b shadow-2xl navbar bg-gradient-to-r from-slate-900/95 to-purple-900/95 backdrop-blur-lg border-white/10">
      {/* Mobile Menu */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="text-white border btn btn-ghost lg:hidden hover:bg-white/10 border-white/20">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M4 6h16M4 12h8m-8 6h16" 
              />
            </svg>
          </div>
          
          <ul
            tabIndex={0}
            className="z-50 w-56 p-2 mt-3 border shadow-2xl menu menu-md dropdown-content bg-gradient-to-br from-slate-900 to-purple-900 border-white/20 rounded-2xl"
          >
            {/* Regular navigation items */}
            {navItems.map(renderNavItem)}
            
            {/* Admin items (if user is admin) */}
            {role==="ADMIN" && adminItems.map(item => (
              <li key={item.href}>
                <Link href={item.href} className="w-full px-4 py-2 font-semibold text-purple-300 transition-all duration-300 rounded-lg hover:text-white hover:bg-purple-500/20">
                  👑 {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logo */}
        <div className="items-center justify-center hidden w-12 h-12 md:flex">
          <Link href="/" className="text-2xl transition-transform duration-300 hover:scale-110">
            <div className="flex items-center justify-center w-10 h-10 text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
              🏠
            </div>
          </Link>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden navbar-center lg:flex">
        <ul className="px-1 space-x-2 menu menu-horizontal">
          {navItems.map(item => (
            <li key={item.href}>
              <Link href={item.href} className="px-6 py-3 transition-all duration-300 border border-transparent text-emerald-100/80 hover:text-white hover:bg-white/10 rounded-xl hover:border-emerald-400/30">
                {item.label}
              </Link>
            </li>
          ))}
          
          {/* Admin items with visual distinction */}
          {role === 'ADMIN' && 
            adminItems.map(item => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className="px-6 py-3 font-semibold text-purple-300 transition-all duration-300 border hover:text-white hover:bg-purple-500/20 rounded-xl border-purple-400/30"
                >
                  👑 {item.label}
                </Link>
              </li>
            ))
          }
        </ul>
      </div>

      {/* User Section */}
      <div className="navbar-end">
        {!isLoading && (
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-24 text-white input input-bordered md:w-auto bg-white/10 border-emerald-400/30 placeholder-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20" 
            />
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="transition-all duration-300 border btn btn-ghost btn-circle avatar border-white/20 hover:border-emerald-400/30 hover:bg-white/10">
                <div className="w-10 rounded-full ring-2 ring-emerald-400/30">
                  <img
                    alt="User avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="p-2 mt-3 border shadow-2xl menu menu-sm dropdown-content bg-gradient-to-br from-slate-900 to-purple-900 border-white/20 rounded-2xl z-1 w-52">
                <li>
                  <Link href={"/dashboard/pages/myDashboard/house"} className="transition-all duration-300 text-emerald-100/80 hover:text-white hover:bg-white/10">
                    My Houses
                  </Link>
                </li>
                <li>
                  <Link href={"/dashboard/pages/myDashboard/book"} className="transition-all duration-300 text-emerald-100/80 hover:text-white hover:bg-white/10">
                    My Booking
                  </Link>
                </li> 
                <li>
                  <a className="transition-all duration-300 text-emerald-100/80 hover:text-white hover:bg-white/10">Settings</a>
                </li>
                <li>
                  <button
                      onClick={logOut}
                      className="justify-start w-full transition-all duration-300 btn btn-ghost hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/30 text-emerald-100/80"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        'Logout'  // Ensure this text does not contain unescaped characters
                      )}
                    </button>

                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainNavbar;