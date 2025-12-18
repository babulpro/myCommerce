'use client'
import Link from "next/link";
import React from "react";

const Navbar = () => {
    return (
        <div className="">
            <div className="navbar bg-gradient-to-r from-slate-900/95 to-purple-900/95 backdrop-blur-lg border-b border-white/10 shadow-2xl fixed top-0 z-50">
                <div className="navbar-start">
                     <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-white hover:bg-white/10 border border-white/20">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> 
                              </svg>
                         </div>
                            <ul
                            tabIndex={0}
                            className="menu menu-m dropdown-content bg-gradient-to-br from-slate-900 to-purple-900 border border-white/20 rounded-2xl z-1 mt-3 w-64 p-2 shadow-2xl">
                                <li> 
                                    <Link href={'/'} className="text-emerald-100/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                                        Home
                                    </Link>
                                </li> 
                                <li> 
                                    <Link href={'/dashboard/pages/article'} className="text-emerald-100/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                                        Post TO Rent
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/dashboard/pages/about"} className="text-emerald-100/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                                        Why Here
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/dashboard/pages/support"} className="text-emerald-100/80 hover:text-white hover:bg-white/10 transition-all duration-300 w-full">
                                        Support
                                    </Link>
                                </li>
                            </ul>
                     </div>
                    <div className="hidden md:block w-15 h-15">
                        <Link href={'/'} className="text-2xl hover:scale-110 transition-transform duration-300">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white">
                                🏠
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 space-x-2">
                         <li> 
                            <Link href={'/'} className="text-emerald-100/80 hover:text-white hover:bg-white/10 px-6 py-3 rounded-xl transition-all duration-300 border border-transparent hover:border-emerald-400/30">
                                Home
                            </Link>
                         </li> 
                         <li> 
                            <Link href={'/dashboard/pages/article'} className="text-emerald-100/80 hover:text-white hover:bg-white/10 px-6 py-3 rounded-xl transition-all duration-300 border border-transparent hover:border-emerald-400/30">
                                Post To Rent
                            </Link>
                         </li>
                         <li>
                            <Link href={"/dashboard/pages/about"} className="text-emerald-100/80 hover:text-white hover:bg-white/10 px-6 py-3 rounded-xl transition-all duration-300 border border-transparent hover:border-emerald-400/30">
                                Why Here
                            </Link>
                         </li>
                         <li>
                            <Link href={"/dashboard/pages/support"} className="text-emerald-100/80 hover:text-white hover:bg-white/10 px-6 py-3 rounded-xl transition-all duration-300 border border-transparent hover:border-emerald-400/30 w-full">
                                Support
                            </Link>
                         </li>
                    </ul>
                </div> 
            </div>
        </div>
    );
};

export default Navbar;