"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartLegend } from '@/components/ui/chart'
import { PieChart, Pie, Cell } from 'recharts'
import { ICategoryChart } from '@/apis/dashboardApi'

// Default colors nếu API không trả về
const DEFAULT_COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
]

interface CategoryChartProps {
    categoryData: ICategoryChart[]
    loading: boolean
}

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

export default function CategoryChart({ categoryData, loading }: CategoryChartProps) {
    const chartConfig = {
        revenue: {
            label: "Doanh thu",
        },
    }

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Phân loại doanh thu theo danh mục</CardTitle>
                <CardDescription>Doanh thu theo từng danh mục sản phẩm</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
                    </div>
                ) : categoryData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Không có dữ liệu</div>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-full">
                        <PieChart>
                            <Pie
                                data={categoryData as any}
                                dataKey="revenue"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={140}
                                paddingAngle={2}
                                label={({ payload }: any) => `${payload.category}: ${payload.percentage.toFixed(1)}%`}
                                labelLine={{ stroke: '#888', strokeWidth: 1 }}
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload as ICategoryChart
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-md">
                                                <div className="grid gap-2">
                                                    <div className="font-medium">{data.category}</div>
                                                    <div className="text-sm">
                                                        <div>Doanh thu: {formatRevenue(data.revenue)}</div>
                                                        <div>Tỷ lệ: {data.percentage.toFixed(1)}%</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <ChartLegend />
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
