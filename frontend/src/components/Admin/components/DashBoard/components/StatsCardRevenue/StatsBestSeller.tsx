"use client"

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ITopProduct } from '@/apis/dashboardApi'
import React from 'react'

type PeriodType = "week" | "month" | "year"

interface StatsBestSellerProps {
    topProducts: ITopProduct[]
    loading: boolean
    selectedPeriod: PeriodType
}

const RANK_COLORS = [
    '#3B82F6', // 1st - blue
    '#10B981', // 2nd - green  
    '#F59E0B', // 3rd - amber
    '#EF4444', // 4th - red
    '#8B5CF6', // 5th - purple
    '#EC4899', // 6th - pink
    '#06B6D4', // 7th - cyan
    '#84CC16', // 8th - lime
    '#F97316', // 9th - orange
    '#6366F1', // 10th - indigo
]

const formatRevenue = (value: number) => {
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(1)} Tỷ`
    }
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)} Tr`
    }
    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(0)}K`
    }
    return `${value.toLocaleString('vi-VN')} đ`
}

const getPeriodDescription = (period: PeriodType) => {
    switch (period) {
        case "week": return "Sản phẩm bán chạy nhất trong tuần"
        case "month": return "Sản phẩm bán chạy nhất trong tháng"
        case "year": return "Sản phẩm bán chạy nhất trong năm"
    }
}

export default function StatsBestSeller({ topProducts, loading, selectedPeriod }: StatsBestSellerProps) {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Top sản phẩm bán chạy</CardTitle>
                <CardDescription>{getPeriodDescription(selectedPeriod)}</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
                    </div>
                ) : topProducts.length === 0 ? (
                    <div className="flex items-center justify-center h-[200px]">
                        <div className="text-muted-foreground">Không có dữ liệu</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {topProducts.slice(0, 10).map((product, index) => (
                            <div key={product.productId} className="flex items-center">
                                <div
                                    className="w-6 h-6 rounded-full mr-3 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ backgroundColor: RANK_COLORS[index % RANK_COLORS.length] }}
                                >
                                    {product.rank}
                                </div>
                                <img
                                    src={product.imageUrl || "/placeholder.svg"}
                                    alt={product.productName}
                                    className="w-10 h-10 rounded-md object-cover mr-3"
                                />
                                <div className="space-y-1 flex-1 min-w-0">
                                    <p className="text-sm font-medium leading-none truncate">{product.productName}</p>
                                    <p className="text-xs text-muted-foreground">{product.totalQuantitySold.toLocaleString('vi-VN')} sản phẩm</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium">{formatRevenue(product.totalRevenue)}</div>
                                    <Badge
                                        variant={product.growthRate >= 0 ? "default" : "destructive"}
                                        className="text-xs"
                                    >
                                        {product.growthRate >= 0 ? '+' : ''}{product.growthRate.toFixed(1)}%
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
