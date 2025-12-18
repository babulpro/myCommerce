import react from "react";
import Logout from "./Logout";

 export default function Profile(){
    return(
        <div className="gap-1 navbar-end">
          {/* cart item */}
          <div className="flex-none">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="text-gray-600 transition-all btn btn-ghost btn-circle hover:text-slate-600 hover:bg-slate-50">
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /> 
                  </svg>
                  <span className="h-4 px-1 text-white border-0 rounded-sm badge badge-xs indicator-item bg-error min-w-4">0</span>
                </div>
              </div>
              <div
                tabIndex={0}
                className="z-50 mt-3 bg-white border border-gray-200 shadow-xl card card-compact dropdown-content w-80">
                <div className="p-4 card-body">
                  <span className="text-lg font-bold text-gray-900">Your Cart is Empty</span>
                  <span className="font-semibold text-slate-600">Add items to get started</span>
                  <div className="mt-2 card-actions">
                    <button className="font-medium text-white btn bg-slate-600 hover:bg-slate-700 btn-block">Start Shopping</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* profile */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="transition-all btn btn-ghost btn-circle avatar hover:bg-slate-50">
              <div className="w-10 border-2 rounded-full border-slate-100">
                <img
                  alt="Profile"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" 
                  className="transition-transform hover:scale-105"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="z-50 w-56 p-3 mt-3 bg-white border border-gray-200 shadow-xl menu menu-sm dropdown-content rounded-box">
              <li>
                <a className="justify-between py-2 font-medium text-gray-800 hover:text-slate-600 hover:bg-slate-50">
                  Profile
                  <span className="text-xs text-white border-0 badge bg-slate-600">New</span>
                </a>
              </li>
              <li><a className="py-2 text-gray-700 hover:text-slate-600 hover:bg-slate-50">Settings</a></li>
              <li><Logout/></li>
            </ul>
          </div>
        </div>
    )
 }