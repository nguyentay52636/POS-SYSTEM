import React from 'react'
import { FileText, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsCardProps {
    totalReceipts: number
    pendingReceipts: number
    completedReceipts: number
}

export default function StatsCard({ totalReceipts, pendingReceipts, completedReceipts }: StatsCardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-white mb-1">Tổng phiếu nhập</p>
                            <p className="text-3xl font-bold text-blue-600">{totalReceipts}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                            <FileText className="h-6 w-6 text-blue-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-white mb-1">Đang chờ</p>
                            <p className="text-3xl font-bold text-orange-600">{pendingReceipts}</p>
                        </div>
                        <div className="p-3 rounded-full bg-orange-100">
                            <Clock className="h-6 w-6 text-orange-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-white mb-1">Đã hoàn thành</p>
                            <p className="text-3xl font-bold text-green-600">{completedReceipts}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

