import React from "react";
import { Check } from "lucide-react";

const ProductCharacteristics = ({ characteristics }) => {
    if (!characteristics?.filter(c => c.trim()).length > 0) return null;

    return (
        <div className="mt-4">
            <h3 className="flex items-center gap-2 mb-2 text-lg font-bold text-primary-800 sm:mb-3">
                <span className="text-accent-500">✨</span> Key Features
            </h3>
            <div className="pr-2 overflow-y-auto max-h-60 sm:max-h-none sm:overflow-visible sm:space-y-2">
                {characteristics.filter(c => c.trim()).map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 mb-2 border rounded-lg bg-primary-50 border-primary-100 sm:mb-0">
                        <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full bg-accent-100 text-accent-600">
                            <Check size={14} />
                        </div>
                        <span className="text-sm text-primary-700 sm:text-base" style={{ flex: 1 }}>
                            {feature}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductCharacteristics;