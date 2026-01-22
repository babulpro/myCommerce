import { Truck, RefreshCw, Shield, Check } from "lucide-react";

const TrustBadges = () => (
    <div className="grid grid-cols-2 gap-3 p-4 mt-6 border rounded-xl bg-primary-50 border-primary-100 sm:grid-cols-4 sm:gap-4 sm:mt-8">
        {[
            { icon: <Truck size={20} />, text: "Free Shipping", color: "accent" },
            { icon: <RefreshCw size={20} />, text: "7-Day Returns", color: "secondary" },
            { icon: <Shield size={20} />, text: "1 Year Warranty", color: "warning" },
            { icon: <Check size={20} />, text: "Authentic Product", color: "primary" }
        ].map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center">
                <div className={`flex items-center justify-center w-10 h-10 mb-2 rounded-full sm:w-12 sm:h-12 bg-${badge.color}-100 text-${badge.color}-600`}>
                    {badge.icon}
                </div>
                <span className="text-xs font-medium text-primary-700 sm:text-sm">
                    {badge.text}
                </span>
            </div>
        ))}
    </div>
);

export default TrustBadges;