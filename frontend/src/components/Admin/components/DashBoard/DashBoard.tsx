"use client"

import { useState, useEffect } from "react"
import HeaderRevenue from "./components/HeaderRevenue/HeaderRevenue"
import StatsCardRevenue from "./components/StatsCardRevenue"
import OrdersChart from "./components/OrdersChart"
import CategoryChart from "./components/CategoryChart"
import SelectDashBoardChart from "./components/HeaderRevenue/SelectDashBoardChart"
import { useDashBoard } from "@/hooks/useDashBoard"

type PeriodType = "week" | "month" | "year"

export default function DashBoard() {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("month")
    const {
        weeklyData,
        monthlyData,
        yearlyData,
        loading,
        fetchWeeklyData,
        fetchMonthlyData,
        fetchYearlyData
    } = useDashBoard()

    useEffect(() => {
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1

        switch (selectedPeriod) {
            case "week":
                fetchWeeklyData(year, month)
                break
            case "month":
                fetchMonthlyData(year)
                break
            case "year":
                fetchYearlyData()
                break
        }
    }, [selectedPeriod, fetchWeeklyData, fetchMonthlyData, fetchYearlyData])

    const getChartData = () => {
        switch (selectedPeriod) {
            case "week":
                return weeklyData
            case "month":
                return monthlyData
            case "year":
                return yearlyData
            default:
                return []
        }
    }

    return (
        <div className="flex-1 space-y-6 p-6">

            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard Bách Hóa Xanh</h2>
                    <p className="text-muted-foreground">Thống kê và phân tích kinh doanh siêu thị</p>
                </div>
                <SelectDashBoardChart
                    selectedPeriod={selectedPeriod}
                    onPeriodChange={setSelectedPeriod}
                />
            </div>
            {/* <OrdersChart /> */}
            <StatsCardRevenue
                chartData={getChartData()}
                loading={loading}
                selectedPeriod={selectedPeriod}
            />


            <div className="grid gap-4 md:grid-cols-2">
                <CategoryChart />
                <div className="space-y-4">
                    <div className="text-center p-8 border rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Tổng quan nhanh</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-muted-foreground">Đơn hàng trung bình</div>
                                <div className="font-semibold">₫225K</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">Tỷ lệ chuyển đổi</div>
                                <div className="font-semibold">68.5%</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">Khách hàng quay lại</div>
                                <div className="font-semibold">45.2%</div>
                            </div>
                            <div>
                                <div className="text-muted-foreground">Đánh giá TB</div>
                                <div className="font-semibold">4.8/5</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <OrdersChart /> */}
        </div>
    )
}