"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { chartData } from './Data/DataRevenue'

export default function OrdersChart() {
    const chartConfig = {
        orders: {
            label: "Đơn hàng",
            color: "hsl(var(--primary))",
        },
        customers: {
            label: "Khách hàng",
            color: "hsl(var(--secondary))",
        },
    }

    return (
        <Card className="col-span-8">
            <CardHeader>
                <CardTitle>Thống kê đơn hàng và khách hàng</CardTitle>
                <CardDescription>Xu hướng đơn hàng và khách hàng theo tháng</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-md">
                                            <div className="grid gap-2">
                                                <div className="font-medium">{`Tháng ${label}`}</div>
                                                <div className="grid gap-1">
                                                    {payload.map((item, index) => (
                                                        <div key={index} className="flex items-center gap-2 text-sm">
                                                            <div
                                                                className="h-2 w-2 rounded-full"
                                                                style={{ backgroundColor: item.color }}
                                                            />
                                                            <span>{item.name}: {item.value?.toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="customers"
                            stroke="hsl(var(--secondary))"
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--secondary))", strokeWidth: 2, r: 4 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}