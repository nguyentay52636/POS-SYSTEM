"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Award } from "lucide-react"

export function PointsTab() {
    return (
        <Card className="border-gray-200 shadow-md">
            <CardContent className="p-16 text-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quy đổi điểm Khách hàng</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Chức năng quy đổi điểm thưởng khách hàng đang được phát triển. Vui lòng quay lại sau.
                </p>
            </CardContent>
        </Card>
    )
}

