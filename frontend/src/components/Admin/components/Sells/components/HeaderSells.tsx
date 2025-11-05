import React from 'react'
import { Store, TrendingUp } from 'lucide-react'
import { IProduct } from './SellsContent'

interface CartItem {
    product: IProduct
    quantity: number
    subtotal: number
}

interface HeaderSellsProps {
    cart: CartItem[]
    total: number
}

export default function HeaderSells({ cart, total }: HeaderSellsProps) {
    return (
        <>
            <div className="border-b border-green-200 shadow-sm sticky top-0 z-10  ">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-lg ring-1 ring-green-200">
                                <Store className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 mb-0.5 dark:text-white! text-white!  ">Bán hàng trực tiếp</h1>
                                <p className="text-sm text-gray-600 flex items-center gap-2 dark:text-white! text-white!  ">
                                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Point of Sale System
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm dark:text-white! text-white!  ">
                                <div className="text-right dark:text-white! text-white!     ">
                                    <p className="text-xs text-gray-500 mb-0.5 font-medium">Thời gian hiện tại</p>
                                    <p className="font-semibold text-gray-900 text-sm dark:text-white! text-white!     ">{new Date().toLocaleTimeString("vi-VN")}</p>
                                </div>
                            </div>
                            {cart.length > 0 && (
                                <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm dark:text-white! text-white!     ">
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Tổng đơn hàng</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
