"use client";

import React, { useEffect, useState } from "react";
import { getProducts } from "@/apis/productApi";
import { IProduct } from "@/types/types";

export default function Page() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi lấy sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-lg">Đang tải...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4 text-center">
                Danh sách sản phẩm
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => (
                    <div
                        key={p.product_id}
                        className="bg-white shadow rounded-lg p-4 border"
                    >
                        <img
                            src={p.image_url}
                            alt={p.product_name}
                            className="w-full h-40 object-cover rounded"
                        />

                        <h2 className="font-semibold text-lg mt-3 truncate">
                            {p.product_name}
                        </h2>

                        <p className="text-gray-600 text-sm">Barcode: {p.barcode}</p>
                        <p className="text-gray-800 font-bold mt-2">
                            Giá: {p.price.toLocaleString()} đ
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                            Nhà cung cấp: {p.supplier_id.name}
                        </p>

                        <p className="text-sm text-gray-500">
                            Danh mục: {p.category_id.category_name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
