"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    inventory: "",
    featured: false,
    rating: 0,
    reviewCount: 0,
    tags: "",
    size: "",
    color: "",
    type: "",
    brand: "",
    currency: "BDT",
    discountPercent: 0,
    compareAtPrice: "",
    categoryId: "",
    char: "",
  });

  const [imageFiles, setImageFiles] = useState(Array(5).fill(null));

  const InputChange = (name, value) => {
    let processedValue = value;
    
    if (name === "price" || name === "rating" || name === "discountPercent" || name === "compareAtPrice") {
      processedValue = parseFloat(value) || 0;
    } else if (name === "inventory" || name === "reviewCount") {
      processedValue = parseInt(value) || 0;
    } else if (name === "featured") {
      processedValue = value === "true" || value === true;
    }
    
    setData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleFileChange = (index, file) => {
    const updated = [...imageFiles];
    updated[index] = file;
    setImageFiles(updated);
  };

  const uploadImages = async (files) => {
    const uploadedUrls = [];

    for (const file of files) {
      if (!file) continue;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/secrect/uploadProduct", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const json = await res.json();
          uploadedUrls.push(json.url);
        } else {
          console.error("Upload failed:", file.name);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    return uploadedUrls;
  };

  const FormSubmitHandler = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const validFiles = imageFiles.filter((f) => f !== null);
      if (validFiles.length < 4) {
        alert("Please upload at least 4 images.");
        return setUploading(false);
      }

      const imageUrls = await uploadImages(validFiles);

      if (imageUrls.length < 4) {
        alert("Some images failed to upload. Try again.");
        return setUploading(false);
      }

      const payload = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price) || 0,
        images: imageUrls,
        brand: data.brand,
        currency: data.currency,
        inventory: parseInt(data.inventory) || 0,
        featured: data.featured === true || data.featured === "true",
        rating: parseFloat(data.rating) || 0,
        reviewCount: parseInt(data.reviewCount) || 0,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
        size: data.size ? data.size.split(",").map(s => s.trim()) : [],
        color: data.color ? data.color.split(",").map(c => c.trim()) : [],
        type: data.type,
        discountPercent: parseFloat(data.discountPercent) || 0,
        compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
        categoryId: data.categoryId,
        char: data.char ? data.char.split(",").map(item => item.trim()) : [],
      };

      console.log("Submitting payload:", payload);

      const response = await fetch("/api/secrect/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server Error:", text);
        alert("Failed to create product. Check console for details.");
        return setUploading(false);
      }

      const json = await response.json();

      if (json.status === "success") {
        alert("🎉 Product created successfully!");
        router.push("/");
      } else {
        alert("Failed to create product: " + (json.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Try again later.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: "linear-gradient(to bottom, var(--primary-50), white)"
    }}>
      <h1 className="mb-8 text-3xl font-bold text-center" style={{ 
        color: "var(--primary-900)",
        background: "linear-gradient(to right, var(--accent-600), var(--secondary-600))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }}>
        Add New Product
      </h1>

      <div className="max-w-3xl p-6 mx-auto shadow-xl rounded-2xl" style={{
        backgroundColor: "white",
        border: "2px solid var(--primary-200)"
      }}>
        <form onSubmit={FormSubmitHandler}>
          
          <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
            Product Name *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => InputChange("name", e.target.value)}
            className="w-full px-4 py-3 mb-6 transition-all duration-200 border-2 rounded-xl focus:ring-2"
            style={{
              backgroundColor: "white",
              borderColor: "var(--primary-200)",
              color: "var(--primary-800)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent-400)";
              e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--primary-200)";
              e.target.style.boxShadow = "none";
            }}
            placeholder="Enter product name"
            required
          />

          <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
            Description *
          </label>
          <textarea
            value={data.description}
            onChange={(e) => InputChange("description", e.target.value)}
            className="w-full px-4 py-3 mb-6 transition-all duration-200 border-2 rounded-xl focus:ring-2"
            style={{
              backgroundColor: "white",
              borderColor: "var(--primary-200)",
              color: "var(--primary-800)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent-400)";
              e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--primary-200)";
              e.target.style.boxShadow = "none";
            }}
            rows="3"
            placeholder="Product description..."
            required
          />

          <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
            Characteristics (comma-separated) *
          </label>
          <textarea
            value={data.char}
            onChange={(e) => InputChange("char", e.target.value)}
            className="w-full px-4 py-3 mb-2 transition-all duration-200 border-2 rounded-xl focus:ring-2"
            style={{
              backgroundColor: "white",
              borderColor: "var(--primary-200)",
              color: "var(--primary-800)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent-400)";
              e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--primary-200)";
              e.target.style.boxShadow = "none";
            }}
            rows="4"
            placeholder="৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি, ৬ মাসের সার্ভিস ওয়ারেন্টি, ২০০০mAh লিথিয়াম ব্যাটারি"
            required
          />
          <p className="mb-6 text-sm" style={{ color: "var(--primary-500)" }}>
            Each comma-separated item will become a separate characteristic
          </p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={data.price}
                onChange={(e) => InputChange("price", e.target.value)}
                className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--primary-200)",
                  color: "var(--primary-800)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-400)";
                  e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--primary-200)";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
                Compare At Price
              </label>
              <input
                type="number"
                step="0.01"
                value={data.compareAtPrice}
                onChange={(e) => InputChange("compareAtPrice", e.target.value)}
                className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--primary-200)",
                  color: "var(--primary-800)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-400)";
                  e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--primary-200)";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="Original price"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
                Inventory *
              </label>
              <input
                type="number"
                value={data.inventory}
                onChange={(e) => InputChange("inventory", e.target.value)}
                className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--primary-200)",
                  color: "var(--primary-800)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-400)";
                  e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--primary-200)";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="Quantity"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
                Discount Percent
              </label>
              <input
                type="number"
                step="0.1"
                value={data.discountPercent}
                onChange={(e) => InputChange("discountPercent", e.target.value)}
                className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--primary-200)",
                  color: "var(--primary-800)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-400)";
                  e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--primary-200)";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
                Brand *
              </label>
              <input
                type="text"
                value={data.brand}
                onChange={(e) => InputChange("brand", e.target.value)}
                className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--primary-200)",
                  color: "var(--primary-800)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-400)";
                  e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--primary-200)";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="Brand name"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
                Type *
              </label>
              <input
                type="text"
                value={data.type}
                onChange={(e) => InputChange("type", e.target.value)}
                className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--primary-200)",
                  color: "var(--primary-800)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-400)";
                  e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--primary-200)";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="Product type"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
                Rating
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={data.rating}
                onChange={(e) => InputChange("rating", e.target.value)}
                className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--primary-200)",
                  color: "var(--primary-800)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-400)";
                  e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--primary-200)";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="0-5"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
                Review Count
              </label>
              <input
                type="number"
                value={data.reviewCount}
                onChange={(e) => InputChange("reviewCount", e.target.value)}
                className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--primary-200)",
                  color: "var(--primary-800)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-400)";
                  e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--primary-200)";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="Number of reviews"
              />
            </div>
          </div>

          <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={data.tags}
            onChange={(e) => InputChange("tags", e.target.value)}
            className="w-full px-4 py-3 mb-6 transition-all duration-200 border-2 rounded-xl focus:ring-2"
            style={{
              backgroundColor: "white",
              borderColor: "var(--primary-200)",
              color: "var(--primary-800)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent-400)";
              e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--primary-200)";
              e.target.style.boxShadow = "none";
            }}
            placeholder="tag1, tag2, tag3"
          />

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
                Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={data.size}
                onChange={(e) => InputChange("size", e.target.value)}
                className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--primary-200)",
                  color: "var(--primary-800)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-400)";
                  e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--primary-200)";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="S, M, L, XL"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
                Colors (comma-separated)
              </label>
              <input
                type="text"
                value={data.color}
                onChange={(e) => InputChange("color", e.target.value)}
                className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--primary-200)",
                  color: "var(--primary-800)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-400)";
                  e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--primary-200)";
                  e.target.style.boxShadow = "none";
                }}
                placeholder="Red, Blue, Green"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
                Currency
              </label>
              <select
                value={data.currency}
                onChange={(e) => InputChange("currency", e.target.value)}
                className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--primary-200)",
                  color: "var(--primary-800)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-400)";
                  e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--primary-200)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="BDT">BDT</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
                Featured Product?
              </label>
              <select
                value={data.featured}
                onChange={(e) => InputChange("featured", e.target.value)}
                className="w-full px-4 py-3 transition-all duration-200 border-2 rounded-xl focus:ring-2"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--primary-200)",
                  color: "var(--primary-800)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-400)";
                  e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--primary-200)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          <label className="block mb-2 font-semibold" style={{ color: "var(--primary-700)" }}>
            Category ID *
          </label>
          <input
            type="text"
            value={data.categoryId}
            onChange={(e) => InputChange("categoryId", e.target.value)}
            className="w-full px-4 py-3 mb-6 transition-all duration-200 border-2 rounded-xl focus:ring-2"
            style={{
              backgroundColor: "white",
              borderColor: "var(--primary-200)",
              color: "var(--primary-800)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent-400)";
              e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--primary-200)";
              e.target.style.boxShadow = "none";
            }}
            placeholder="Enter category ObjectId"
            required
          />

          <h3 className="mt-8 mb-4 text-lg font-bold" style={{ color: "var(--primary-800)" }}>
            Upload Images (4–5 images required)
          </h3>

          {imageFiles.map((file, idx) => (
            <div key={idx} className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(idx, e.target.files[0])}
                className="w-full p-3 transition-all duration-200 border-2 rounded-xl"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--primary-200)",
                  color: "var(--primary-800)"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--accent-400)";
                  e.target.style.boxShadow = "0 0 0 2px var(--accent-400)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--primary-200)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {file && (
                <p className="mt-1 text-sm font-medium" style={{ color: "var(--accent-600)" }}>
                  ✅ {file.name}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={uploading}
            className={`w-full mt-8 py-4 rounded-xl text-white font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
              uploading ? "cursor-not-allowed opacity-70" : "hover:shadow-xl"
            }`}
            style={{
              background: uploading 
                ? "linear-gradient(to right, var(--primary-400), var(--primary-500))"
                : "linear-gradient(to right, var(--accent-500), var(--accent-600))",
              boxShadow: "0 4px 6px -1px rgba(14, 165, 233, 0.2)"
            }}
            onMouseEnter={(e) => {
              if (!uploading) {
                e.currentTarget.style.boxShadow = "0 10px 25px -5px rgba(14, 165, 233, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!uploading) {
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(14, 165, 233, 0.2)";
              }
            }}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                Creating Product...
              </span>
            ) : (
              "✨ Create Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}