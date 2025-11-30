"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function ProfitTab() {
    return (
        <Card className="border-gray-200 shadow-md">
            <CardContent className="p-16 text-center">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý Lợi nhuận</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Chức năng cấu hình phần trăm lợi nhuận đang được phát triển. Vui lòng quay lại sau.
                </p>
            </CardContent>
        </Card>
    )
}

