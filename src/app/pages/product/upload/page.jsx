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
    currency: "USD",
    discountPercent: 0,
    compareAtPrice: "",
    categoryId: "",
  });

  const [imageFiles, setImageFiles] = useState(Array(5).fill(null));

  const InputChange = (name, value) => {
    // Convert string values to appropriate types
    let processedValue = value;
    
    if (name === "price" || name === "rating" || name === "discountPercent" || name === "compareAtPrice") {
      processedValue = parseFloat(value) || 0;
    } else if (name === "inventory" || name === "reviewCount") {
      processedValue = parseInt(value) || 0;
    } else if (name === "featured") {
      processedValue = value === "true" || value === true;
    } else if (name === "tags" || name === "size" || name === "color") {
      // These will be converted to arrays when submitting
      processedValue = value;
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

      // Prepare data according to Prisma schema
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
        // Note: char field is not in your form, you might want to add it
        char: [], // Add this if you want to include it
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
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <h1 className="text-3xl text-emerald-300 font-bold text-center mb-8">
        Add New Product
      </h1>

      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl max-w-3xl mx-auto shadow-xl border border-white/20">
        <form onSubmit={FormSubmitHandler}>
          
          <label className="text-emerald-200">Product Name *</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => InputChange("name", e.target.value)}
            className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400 mb-4"
            placeholder="Enter product name"
            required
          />

          <label className="text-emerald-200">Description *</label>
          <textarea
            value={data.description}
            onChange={(e) => InputChange("description", e.target.value)}
            className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400 mb-4"
            rows="3"
            placeholder="Product description..."
            required
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-emerald-200">Price *</label>
              <input
                type="number"
                step="0.01"
                value={data.price}
                onChange={(e) => InputChange("price", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="text-emerald-200">Compare At Price</label>
              <input
                type="number"
                step="0.01"
                value={data.compareAtPrice}
                onChange={(e) => InputChange("compareAtPrice", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400"
                placeholder="Original price"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-emerald-200">Inventory *</label>
              <input
                type="number"
                value={data.inventory}
                onChange={(e) => InputChange("inventory", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400"
                placeholder="Quantity"
                required
              />
            </div>

            <div>
              <label className="text-emerald-200">Discount Percent</label>
              <input
                type="number"
                step="0.1"
                value={data.discountPercent}
                onChange={(e) => InputChange("discountPercent", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400"
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-emerald-200">Brand *</label>
              <input
                type="text"
                value={data.brand}
                onChange={(e) => InputChange("brand", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400"
                placeholder="Brand name"
                required
              />
            </div>

            <div>
              <label className="text-emerald-200">Type *</label>
              <input
                type="text"
                value={data.type}
                onChange={(e) => InputChange("type", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400"
                placeholder="Product type"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-emerald-200">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={data.rating}
                onChange={(e) => InputChange("rating", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400"
                placeholder="0-5"
              />
            </div>

            <div>
              <label className="text-emerald-200">Review Count</label>
              <input
                type="number"
                value={data.reviewCount}
                onChange={(e) => InputChange("reviewCount", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400"
                placeholder="Number of reviews"
              />
            </div>
          </div>

          <label className="text-emerald-200">Tags (comma-separated)</label>
          <input
            type="text"
            value={data.tags}
            onChange={(e) => InputChange("tags", e.target.value)}
            className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400 mb-4"
            placeholder="tag1, tag2, tag3"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-emerald-200">Sizes (comma-separated)</label>
              <input
                type="text"
                value={data.size}
                onChange={(e) => InputChange("size", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400"
                placeholder="S, M, L, XL"
              />
            </div>

            <div>
              <label className="text-emerald-200">Colors (comma-separated)</label>
              <input
                type="text"
                value={data.color}
                onChange={(e) => InputChange("color", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400"
                placeholder="Red, Blue, Green"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-emerald-200">Currency</label>
              <select
                value={data.currency}
                onChange={(e) => InputChange("currency", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white focus:ring-2 ring-emerald-400"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="BDT">BDT</option>
              </select>
            </div>

            <div>
              <label className="text-emerald-200">Featured Product?</label>
              <select
                value={data.featured}
                onChange={(e) => InputChange("featured", e.target.value)}
                className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white focus:ring-2 ring-emerald-400"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          <label className="text-emerald-200">Category ID *</label>
          <input
            type="text"
            value={data.categoryId}
            onChange={(e) => InputChange("categoryId", e.target.value)}
            className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-emerald-400/30 rounded-xl text-white placeholder-emerald-200 focus:ring-2 ring-emerald-400 mb-4"
            placeholder="Enter category ObjectId"
            required
          />

          <h3 className="mt-6 mb-2 text-emerald-300 font-semibold">
            Upload Images (4–5 images required)
          </h3>

          {imageFiles.map((file, idx) => (
            <div key={idx} className="mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(idx, e.target.files[0])}
                className="w-full bg-white/10 p-2 border border-emerald-400/30 backdrop-blur-sm rounded-xl text-emerald-200"
              />
              {file && (
                <p className="text-green-400 text-xs mt-1">✅ {file.name}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={uploading}
            className={`w-full mt-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all ${
              uploading
                ? "bg-gray-500/50 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            }`}
          >
            {uploading ? "Creating Product..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}