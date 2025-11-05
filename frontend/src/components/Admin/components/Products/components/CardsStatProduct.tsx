import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package } from 'lucide-react'
interface CardsStatProductProps {
    totalProducts: number
    activeProducts: number
    outOfStockProducts: number
    inactiveProducts: number
}
export default function CardsStatProduct({ totalProducts, activeProducts, outOfStockProducts, inactiveProducts }: CardsStatProductProps) {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className=" shadow-sm hover:shadow-md transition-all duration-200 border-0">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-white mb-1">Tổng sản phẩm</p>
                            <p className="text-3xl font-bold text-blue-600">{totalProducts}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                            <Package className="h-6 w-6 text-blue-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-white mb-1">Đang bán</p>
                            <p className="text-3xl font-bold text-green-600">{activeProducts}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100">
                            <Package className="h-6 w-6 text-green-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-white mb-1">Hết hàng</p>
                            <p className="text-3xl font-bold text-red-600">{outOfStockProducts}</p>
                        </div>
                        <div className="p-3 rounded-full bg-red-100">
                            <Package className="h-6 w-6 text-red-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-0">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-white mb-1">Tạm ngưng</p>
                            <p className="text-3xl font-bold text-yellow-600">{inactiveProducts}</p>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-100">
                            <Package className="h-6 w-6 text-yellow-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
