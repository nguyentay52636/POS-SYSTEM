import React from 'react'
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2 } from "lucide-react"

interface HeaderCartSellsProps {
    cart: any[]
    total: number
    stats: {
        totalItems: number
        totalProducts: number
        subtotal: number
        total: number
    }
    clearCart: () => void
}

export default function HeaderCartSells({ cart, total, stats, clearCart }: HeaderCartSellsProps) {
    return (
        <>
            <div className="p-6 border-b border-green-200 ">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg ring-1 ring-green-200">
                            <ShoppingCart className="h-5 w-5 text-white" />
                        </div>
                        Giỏ hàng
                    </h2>
                    {cart.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearCart}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 font-medium bg-white shadow-sm"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa tất cả
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className=" p-4 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-xs text-gray-500 mb-2 font-medium uppercase dark:text-white!  tracking-wide">Số mặt hàng</p>
                        <p className="text-2xl font-bold text-green-700">{stats.totalProducts}</p>
                    </div>
                    <div className=" p-4 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-xs text-gray-500 mb-2 font-medium uppercase  dark:text-white! tracking-wide">Tổng số lượng</p>
                        <p className="text-2xl font-bold text-green-700">{stats.totalItems}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
