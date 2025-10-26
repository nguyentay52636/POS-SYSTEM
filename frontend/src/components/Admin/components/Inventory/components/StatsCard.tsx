import React from 'react'
import { Warehouse, AlertTriangle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsCardProps {
    totalInventories: number
    lowStockInventories: number
    outOfStockInventories: number
}

export default function StatsCard({ totalInventories, lowStockInventories, outOfStockInventories }: StatsCardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tổng tồn kho</p>
                            <p className="text-3xl font-bold text-blue-600">{totalInventories}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                            <Warehouse className="h-6 w-6 text-blue-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card >
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tồn kho thấp</p>
                            <p className="text-3xl font-bold text-orange-600">{lowStockInventories}</p>
                        </div>
                        <div className="p-3 rounded-full bg-orange-100">
                            <AlertTriangle className="h-6 w-6 text-orange-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Hết hàng</p>
                            <p className="text-3xl font-bold text-red-600">{outOfStockInventories}</p>
                        </div>
                        <div className="p-3 rounded-full bg-red-100">
                            <XCircle className="h-6 w-6 text-red-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

