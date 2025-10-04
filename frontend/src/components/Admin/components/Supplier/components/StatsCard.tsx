import React from 'react'
import { Building2, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
interface StatsCardProps {
    totalSuppliers: number
    activeSuppliers: number
    inactiveSuppliers: number
}
export default function StatsCard({ totalSuppliers, activeSuppliers, inactiveSuppliers }: StatsCardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tổng nhà cung cấp</p>
                            <p className="text-3xl font-bold text-blue-600">{totalSuppliers}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                            <Building2 className="h-6 w-6 text-blue-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Đang hoạt động</p>
                            <p className="text-3xl font-bold text-green-600">{activeSuppliers}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Tạm ngưng</p>
                            <p className="text-3xl font-bold text-red-600">{inactiveSuppliers}</p>
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
