
import { Card } from '@/components/ui/card'
import React from 'react'
import { CardContent } from '@/components/ui/card'

export default function StatsCardManagerUser({ stat, index }: { stat: any, index: number }) {
    return (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
            <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                            {stat.title}
                        </p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                            {stat.value}
                        </p>
                    </div>
                    <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor} flex-shrink-0 ml-3`}>
                        <stat.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${stat.color}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
