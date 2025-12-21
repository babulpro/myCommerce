import { useRouter } from "next/navigation"

  

export default function Logout(){
    const router =useRouter()
    const logOutButton = async()=>{
        try{
            const response = await fetch(`/api/user/logOut`,{method:"GET"})
            if(!response.ok){
                alert("try again later")
            }
            const json = await response.json()
            if(json.status ==="success"){
                alert("log out success")
                router.refresh()
            }

        }
        catch(e){
            alert("try again")
        }
    }
    return(
        <div>
            <div className="dropdown dropdown-end">
                <div className="relative">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle p-2.5">
                    <div className="relative">
                    <div className="w-10 h-10 overflow-hidden rounded-xl ring-2" style={{ 
                        ringColor: 'var(--accent-400)'
                    }}>
                        <img 
                        alt="User Profile" 
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="absolute w-3 h-3 bg-green-400 border-2 border-white rounded-full -bottom-1 -right-1"></div>
                    </div>
                </div>
                
                {/* Profile Dropdown */}
                    <ul tabIndex={0} className="z-50 w-64 p-0 mt-3 bg-white border shadow-2xl dropdown-content rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>
                        {/* User Info Header */}
                        <div className="p-4 bg-gradient-to-r from-[var(--primary-50)] to-white border-b" style={{ borderColor: 'var(--primary-100)' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 overflow-hidden rounded-xl ring-2" style={{ ringColor: 'var(--accent-400)' }}>
                            <img 
                                alt="User Profile" 
                                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                className="object-cover w-full h-full"
                            />
                            </div>
                            <div>
                            <div className="font-bold" style={{ color: 'var(--primary-800)' }}>Alex Morgan</div>
                            <div className="text-sm opacity-75" style={{ color: 'var(--primary-600)' }}>alex@example.com</div>
                            </div>
                        </div>
                        <div className="mt-3 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 text-sm" style={{ 
                            backgroundColor: 'var(--accent-100)', 
                            color: 'var(--accent-700)' 
                        }}>
                            <span>⭐</span>
                            Premium Member
                        </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="p-2">
                        <li>
                            <a className="flex items-center gap-3 p-3 mb-1 transition-all duration-200 rounded-xl hover:shadow-md" style={{ 
                            backgroundColor: 'var(--primary-25)'
                            }}>
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--primary-100)' }}>
                                <span className="text-lg">👤</span>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium" style={{ color: 'var(--primary-800)' }}>My Profile</div>
                                <div className="text-xs opacity-75" style={{ color: 'var(--primary-600)' }}>View and edit profile</div>
                            </div>
                            <span className="px-2 py-1 text-xs font-bold rounded-full" style={{ 
                                backgroundColor: 'var(--secondary-100)', 
                                color: 'var(--secondary-700)' 
                            }}>
                                New
                            </span>
                            </a>
                        </li>
                        
                        <li>
                            <a className="flex items-center gap-3 p-3 mb-1 transition-all duration-200 rounded-xl hover:shadow-md" style={{ 
                            backgroundColor: 'var(--primary-25)'
                            }}>
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--primary-100)' }}>
                                <span className="text-lg">📦</span>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium" style={{ color: 'var(--primary-800)' }}>My Orders</div>
                                <div className="text-xs opacity-75" style={{ color: 'var(--primary-600)' }}>Track and manage orders</div>
                            </div>
                            </a>
                        </li>
                        
                        <li>
                            <a className="flex items-center gap-3 p-3 transition-all duration-200 rounded-xl hover:shadow-md" style={{ 
                            backgroundColor: 'var(--primary-25)'
                            }}>
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--primary-100)' }}>
                                <span className="text-lg">⚙️</span>
                            </div>
                            <div className="flex-1">
                                <div className="font-medium" style={{ color: 'var(--primary-800)' }}>Settings</div>
                                <div className="text-xs opacity-75" style={{ color: 'var(--primary-600)' }}>Account preferences</div>
                            </div>
                            </a>
                        </li>
                        </div>
                        
                        {/* Logout */}
                        <div className="p-4 border-t" style={{ borderColor: 'var(--primary-100)' }}>
                        <button onClick={logOutButton} className="w-full py-2.5 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 border" style={{
                            backgroundColor: 'white',
                            color: 'var(--accent-600)',
                            borderColor: 'var(--accent-400)'
                        }}>
                            <div className="flex items-center justify-center gap-2">
                            <span>🚪</span>
                            <span>Logout</span>
                            </div>
                        </button>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    )
}