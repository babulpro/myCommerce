import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

export default function Logout() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const logOutButton = async () => {
        try {
            const response = await fetch(`/api/user/logOut`, { method: "GET" })
            if (!response.ok) {
                alert("try again later")
            }
            const json = await response.json()
            if (json.status === "success") {
                alert("log out success")
                router.refresh()
                setIsOpen(false) // Close dropdown after logout
            }
        } catch (e) {
            alert("try again")
        }
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const handleLinkClick = () => {
        setIsOpen(false) // Close dropdown when any link is clicked
    }

    return (
        <div ref={dropdownRef}>
            <div className="dropdown dropdown-end">
                <div className="relative">
                    <button 
                        onClick={toggleDropdown}
                        className="btn btn-ghost btn-circle p-2.5"
                        aria-label="User menu"
                        aria-expanded={isOpen}
                    >
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
                    </button>

                    {/* Profile Dropdown - Show on click */}
                    {isOpen && (
                        <ul className="absolute right-0 z-50 w-64 p-0 mt-3 bg-white border shadow-2xl dropdown-content rounded-2xl" style={{ borderColor: 'var(--primary-100)' }}>

                            <div className="p-2">                                

                                <li>
                                    <Link 
                                        href="/user/dashboard/order" 
                                        onClick={handleLinkClick}
                                        className="flex items-center gap-3 p-3 mb-1 transition-all duration-200 rounded-xl hover:shadow-md" 
                                        style={{ backgroundColor: 'var(--primary-25)' }}
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--primary-100)' }}>
                                            <span className="text-lg">📦</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium" style={{ color: 'var(--primary-800)' }}>My Orders</div>
                                            <div className="text-xs opacity-75" style={{ color: 'var(--primary-600)' }}>Track and manage orders</div>
                                        </div>
                                    </Link>
                                </li>

                                <li>
                                    <Link 
                                        href="/user/dashboard/address" 
                                        onClick={handleLinkClick}
                                        className="flex items-center gap-3 p-3 mb-1 transition-all duration-200 rounded-xl hover:shadow-md" 
                                        style={{ backgroundColor: 'var(--primary-25)' }}
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--primary-100)' }}>
                                            <span className="text-lg">📍</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium" style={{ color: 'var(--primary-800)' }}>Address</div>
                                            <div className="text-xs opacity-75" style={{ color: 'var(--primary-600)' }}>Shipping & billing addresses</div>
                                        </div>
                                    </Link>
                                </li>
 
                                {/* Additional options */}
                                <li>
                                    <Link 
                                        href="/pages/wishlist" 
                                        onClick={handleLinkClick}
                                        className="flex items-center gap-3 p-3 mb-1 transition-all duration-200 rounded-xl hover:shadow-md" 
                                        style={{ backgroundColor: 'var(--primary-25)' }}
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--primary-100)' }}>
                                            <span className="text-lg">❤️</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium" style={{ color: 'var(--primary-800)' }}>Wishlist</div>
                                            <div className="text-xs opacity-75" style={{ color: 'var(--primary-600)' }}>Saved items</div>
                                        </div>
                                    </Link>
                                </li>

                                <li>
                                    <Link 
                                        href="/user/dashboard/settings" 
                                        onClick={handleLinkClick}
                                        className="flex items-center gap-3 p-3 transition-all duration-200 rounded-xl hover:shadow-md" 
                                        style={{ backgroundColor: 'var(--primary-25)' }}
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--primary-100)' }}>
                                            <span className="text-lg">⚙️</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium" style={{ color: 'var(--primary-800)' }}>Settings</div>
                                            <div className="text-xs opacity-75" style={{ color: 'var(--primary-600)' }}>Preferences & notifications</div>
                                        </div>
                                    </Link>
                                </li>
                            </div>

                            {/* Logout */}
                            <div className="p-4 border-t" style={{ borderColor: 'var(--primary-100)' }}>
                                <button 
                                    onClick={() => {
                                        logOutButton()
                                        setIsOpen(false)
                                    }} 
                                    className="w-full py-2.5 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 border" 
                                    style={{
                                        backgroundColor: 'white',
                                        color: 'var(--accent-600)',
                                        borderColor: 'var(--accent-400)'
                                    }}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <span>🚪</span>
                                        <span>Logout</span>
                                    </div>
                                </button>
                            </div>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}