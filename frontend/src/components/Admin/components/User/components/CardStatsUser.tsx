import React from 'react'
import { Users, UserCheck, UserX } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatsCardProps {
    totalUsers: number
    activeUsers: number
    inactiveUsers: number
}

export default function CardStatsUser({ totalUsers, activeUsers, inactiveUsers }: StatsCardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-white mb-1">Tổng thành viên</p>
                            <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                            <Users className="h-6 w-6 text-blue-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-white mb-1">Đang hoạt động</p>
                            <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100">
                            <UserCheck className="h-6 w-6 text-green-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-white mb-1">Đã khóa</p>
                            <p className="text-3xl font-bold text-red-600">{inactiveUsers}</p>
                        </div>
                        <div className="p-3 rounded-full bg-red-100">
                            <UserX className="h-6 w-6 text-red-700" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

