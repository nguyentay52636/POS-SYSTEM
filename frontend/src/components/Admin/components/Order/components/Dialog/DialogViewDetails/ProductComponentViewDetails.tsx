"use client"
import { Order } from '@/apis/orderApi';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, Search } from 'lucide-react';
import React, { useState } from 'react'
interface Props {
    selectedOrder: Order;
}
export default function ProductComponentViewDetails({ selectedOrder }: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = selectedOrder.orderItems.filter(item =>
        item.product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.productId).includes(searchQuery)
    );

    return (
        <div className="space-y-4">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Tìm kiếm sản phẩm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                />
            </div>
            <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Package className="h-5 w-5 text-green-600" />
                <span>Danh sách sản phẩm ({filteredItems.length}/{selectedOrder.orderItems.length})</span>
            </h3>
            <ScrollArea className="h-[300px] border rounded-md p-2">
                <div className="space-y-3">
                    {filteredItems.map((it) => (
                        <div
                            key={it.orderItemId}
                            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <div className="w-20 h-20 flex items-center justify-center bg-green-100 rounded-md overflow-hidden">
                                {it.product.imageUrl ? (
                                    <img src={it.product.imageUrl} alt={it.product.productName} className="w-full h-full object-cover" />
                                ) : (
                                    <Package className="h-8 w-8 text-green-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-green-700">
                                    SP: #{it.productId}
                                </div>
                                <div className="text-lg font-semibold">{it.product.productName}</div>
                                <div className="text-sm text-gray-600">
                                    SL: {it.quantity} • Giá:{" "}
                                    {it.price.toLocaleString("vi-VN")} đ
                                </div>
                            </div>
                            <div className="text-lg font-semibold text-green-700">
                                {(it.quantity * it.price).toLocaleString("vi-VN")} đ
                            </div>
                        </div>
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Không tìm thấy sản phẩm nào.
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
