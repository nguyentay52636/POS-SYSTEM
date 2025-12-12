"use client"

import { Badge } from '@/components/ui/badge'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { categoryData, topProducts } from './Data/DataRevenue'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts'
import { IRevenueChart } from '@/apis/dashboardApi'
import { useMemo } from 'react'

type PeriodType = "week" | "month" | "year"

interface StatsCardRevenueProps {
    chartData: IRevenueChart[]
    loading: boolean
    selectedPeriod: PeriodType
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

// Format cho trục Y dựa trên giá trị max
const getYAxisConfig = (maxValue: number) => {
    if (maxValue >= 1_000_000_000) {
        return { divisor: 1_000_000_000, suffix: 'Tỷ' }
    }
    if (maxValue >= 1_000_000) {
        return { divisor: 1_000_000, suffix: 'Tr' }
    }
    if (maxValue >= 1_000) {
        return { divisor: 1_000, suffix: 'K' }
    }
    return { divisor: 1, suffix: 'đ' }
}

const getPeriodTitle = (period: PeriodType) => {
    switch (period) {
        case "week": return "Doanh thu theo tuần"
        case "month": return "Doanh thu theo tháng"
        case "year": return "Doanh thu theo năm"
    }
}

const getPeriodDescription = (period: PeriodType) => {
    switch (period) {
        case "week": return "Biểu đồ doanh thu các tuần trong tháng"
        case "month": return "Biểu đồ doanh thu các tháng trong năm"
        case "year": return "Biểu đồ doanh thu các năm"
    }
}

export default function ChartsRevenue({ chartData, loading, selectedPeriod }: StatsCardRevenueProps) {
    const chartConfig = {
        revenue: {
            label: "Doanh thu",
            color: "hsl(var(--primary))",
        },
        orders: {
            label: "Đơn hàng",
            color: "hsl(var(--secondary))",
        },
        customers: {
            label: "Khách hàng",
            color: "hsl(var(--accent))",
        },
    }

    const { formattedChartData, yAxisConfig } = useMemo(() => {
        const maxRevenue = Math.max(...chartData.map(item => item.revenue), 0)
        const config = getYAxisConfig(maxRevenue)

        const formatted = chartData.map(item => ({
            ...item,
            displayRevenue: item.revenue / config.divisor,
        }))

        return { formattedChartData: formatted, yAxisConfig: config }
    }, [chartData])

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>{getPeriodTitle(selectedPeriod)}</CardTitle>
                    <CardDescription>{getPeriodDescription(selectedPeriod)}</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    {loading ? (
                        <div className="flex items-center justify-center h-[300px]">
                            <div className="text-muted-foreground">Đang tải dữ liệu...</div>
                        </div>
                    ) : formattedChartData.length === 0 ? (
                        <div className="flex items-center justify-center h-[300px]">
                            <div className="text-muted-foreground">Không có dữ liệu</div>
                        </div>
                    ) : (
                        <ChartContainer config={chartConfig}>
                            <AreaChart
                                data={formattedChartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}${yAxisConfig.suffix}`} />
                                <ChartTooltip
                                    cursor={false}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload as IRevenueChart & { displayRevenue: number }
                                            return (
                                                <div className="rounded-lg border bg-background p-2 shadow-md">
                                                    <div className="grid gap-2">
                                                        <div className="font-medium">{label}</div>
                                                        <div className="grid gap-1">
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                                                <span>Doanh thu: {formatRevenue(data.revenue)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <div className="h-2 w-2 rounded-full bg-secondary" />
                                                                <span>Đơn hàng: {data.orderCount.toLocaleString('vi-VN')}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <div className="h-2 w-2 rounded-full bg-accent" />
                                                                <span>Khách hàng: {data.customerCount.toLocaleString('vi-VN')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <defs>
                                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    dataKey="displayRevenue"
                                    type="natural"
                                    fill="url(#fillRevenue)"
                                    fillOpacity={0.4}
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>

            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Top sản phẩm bán chạy</CardTitle>
                    <CardDescription>Sản phẩm bán chạy nhất trong tháng</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex items-center">
                                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: categoryData[index % categoryData.length].color }}></div>
                                <div className="space-y-1 flex-1">
                                    <p className="text-sm font-medium leading-none">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.sales} sản phẩm</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium">₫{product.revenue}M</div>
                                    <Badge variant="secondary" className="text-xs">
                                        {product.growth}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}