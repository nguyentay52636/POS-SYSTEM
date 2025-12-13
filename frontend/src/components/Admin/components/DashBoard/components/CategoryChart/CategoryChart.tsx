"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartLegend } from '@/components/ui/chart'
import { PieChart, Pie, Cell } from 'recharts'
import { categoryData } from '../Data/DataRevenue'

export default function CategoryChart() {
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
                <ChartContainer config={chartConfig} className="h-full">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            dataKey="revenue"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={140}
                            paddingAngle={2}
                            label={({ name, payload }: any) => `${payload.category}: ${payload.percentage}%`}
                            labelLine={{ stroke: '#888', strokeWidth: 1 }}
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <ChartTooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-md">
                                            <div className="grid gap-2">
                                                <div className="font-medium">{data.category}</div>
                                                <div className="text-sm">
                                                    <div>Doanh thu: ₫{data.revenue}M</div>
                                                    <div>Tỷ lệ: {data.percentage}%</div>
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
            </CardContent>
        </Card>
    )
}
