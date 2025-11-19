"use client";

import React, { useState } from "react";

export default function CreateProductPage() {
    const [productName, setProductName] = useState("");
    const [barcode, setBarcode] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [unit, setUnit] = useState("");
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [supplierId, setSupplierId] = useState<number | "">("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Preview ảnh từ file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            // Validate file size (5MB max theo backend)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setMessage(`❌ File quá lớn! Tối đa ${maxSize / 1024 / 1024}MB`);
                e.target.value = "";
                setImageFile(null);
                setImagePreview(null);
                return;
            }

            // Validate file extension
            const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
            const extension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
            if (!allowedExtensions.includes(extension)) {
                setMessage(`❌ Định dạng file không hợp lệ! Chỉ chấp nhận: ${allowedExtensions.join(", ")}`);
                e.target.value = "";
                setImageFile(null);
                setImagePreview(null);
                return;
            }

            setImageFile(file);
            setImageUrl(""); // Clear URL nếu chọn file
            setMessage(""); // Clear error message

            // Tạo preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    // Preview ảnh từ URL
    const handleUrlChange = (url: string) => {
        setImageUrl(url);
        if (url) {
            setImageFile(null);
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // Validation
        if (!productName.trim()) {
            setMessage("❌ Vui lòng nhập tên sản phẩm");
            setLoading(false);
            return;
        }

        if (!price || Number(price) <= 0) {
            setMessage("❌ Vui lòng nhập giá hợp lệ (lớn hơn 0)");
            setLoading(false);
            return;
        }

        if (!categoryId || Number(categoryId) <= 0) {
            setMessage("❌ Vui lòng chọn Category ID hợp lệ");
            setLoading(false);
            return;
        }

        if (!supplierId || Number(supplierId) <= 0) {
            setMessage("❌ Vui lòng chọn Supplier ID hợp lệ");
            setLoading(false);
            return;
        }

        try {
            // ✅ Tạo FormData
            const formData = new FormData();

            // ✅ Sử dụng camelCase (ASP.NET Core tự động map)
            formData.append("productName", productName.trim());
            formData.append("barcode", (barcode || "").trim());
            formData.append("price", String(Number(price)));
            formData.append("unit", (unit || "").trim());
            formData.append("categoryId", String(Number(categoryId)));
            formData.append("supplierId", String(Number(supplierId)));

            // ✅ Upload file nếu có
            if (imageFile) {
                formData.append("imageFile", imageFile);
            } else if (imageUrl) {
                formData.append("imageUrl", imageUrl.trim());
            }

            // ✅ Gửi request - KHÔNG set Content-Type header
            const res = await fetch("http://localhost:5006/api/product", {
                method: "POST",
                body: formData,
                // ✅ KHÔNG set headers - Browser tự động set multipart/form-data với boundary
                // ❌ KHÔNG làm: headers: { "Content-Type": "multipart/form-data" }
            });

            if (!res.ok) {
                let errorMessage = "Lỗi tạo sản phẩm";
                try {
                    const errorData = await res.json();
                    // Handle ModelState errors
                    if (errorData.errors) {
                        const errors = Object.values(errorData.errors).flat() as string[];
                        errorMessage = errors.join(", ");
                    } else {
                        errorMessage = errorData.message ||
                            errorData.title ||
                            JSON.stringify(errorData) ||
                            errorMessage;
                    }
                } catch {
                    errorMessage = `HTTP ${res.status}: ${res.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const data = await res.json();
            const productId = data.productId || data.product_id || "N/A";
            const createdProductName = data.productName || data.product_name || "Sản phẩm";

            setMessage(`✅ Tạo sản phẩm thành công! ID: ${productId}, Tên: ${createdProductName}`);

            // Reset form
            setProductName("");
            setBarcode("");
            setPrice("");
            setUnit("");
            setCategoryId("");
            setSupplierId("");
            setImageFile(null);
            setImageUrl("");
            setImagePreview(null);

            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = "";
            }
        } catch (error: any) {
            console.error("Error creating product:", error);
            setMessage(`❌ ${error.message || "Tạo sản phẩm thất bại!"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Tạo sản phẩm mới</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Tên sản phẩm */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Nhập tên sản phẩm"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Barcode */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Barcode
                    </label>
                    <input
                        type="text"
                        placeholder="Nhập barcode (tùy chọn)"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Giá và Đơn vị - 2 cột */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giá (VNĐ) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            value={price}
                            onChange={(e) => {
                                const val = e.target.value;
                                setPrice(val === "" ? "" : Number(val));
                            }}
                            required
                            min="0.01"
                            step="1000"
                            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Đơn vị
                        </label>
                        <input
                            type="text"
                            placeholder="cái, kg, hộp..."
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Category ID và Supplier ID - 2 cột */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category ID <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="1"
                            value={categoryId}
                            onChange={(e) => {
                                const val = e.target.value;
                                setCategoryId(val === "" ? "" : Number(val));
                            }}
                            required
                            min="1"
                            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Supplier ID <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            placeholder="1"
                            value={supplierId}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSupplierId(val === "" ? "" : Number(val));
                            }}
                            required
                            min="1"
                            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Upload ảnh */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hình ảnh sản phẩm
                    </label>

                    {/* File Upload */}
                    <div className="mb-3">
                        <label className="block text-xs text-gray-600 mb-1">
                            Upload từ máy tính:
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {imageFile && (
                            <p className="text-xs text-gray-600 mt-1">
                                📎 {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                            </p>
                        )}
                    </div>

                    {/* URL Input */}
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">
                            Hoặc nhập URL ảnh:
                        </label>
                        <input
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Preview ảnh */}
                    {imagePreview && (
                        <div className="mt-3 p-3 border border-gray-300 rounded-md bg-gray-50">
                            <p className="text-xs text-gray-600 mb-2">Preview:</p>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-w-full h-48 object-contain rounded-md border border-gray-200"
                                onError={() => {
                                    setImagePreview(null);
                                    setMessage("❌ Không thể load ảnh từ URL này");
                                }}
                            />
                        </div>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                        💡 Hỗ trợ: JPG, PNG, GIF, WEBP (tối đa 5MB)
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
                >
                    {loading ? "⏳ Đang tạo sản phẩm..." : "✅ Tạo sản phẩm"}
                </button>
            </form>

            {/* Message Display */}
            {message && (
                <div className={`mt-4 p-4 rounded-md text-center ${message.startsWith("✅")
                    ? "bg-green-50 text-green-800 border border-green-300"
                    : "bg-red-50 text-red-800 border border-red-300"
                    }`}>
                    <p className="font-medium">{message}</p>
                </div>
            )}
        </div>
    );
}