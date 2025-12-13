"use client"

import { useState, useEffect } from "react"
import HeaderRevenue from "./components/HeaderRevenue/HeaderRevenue"
import StatsCardRevenue from "./components/StatsCardRevenue/StatsCardRevenue"
import OrdersChart from "./components/OrdersChart"
import CategoryChart from "./components/CategoryChart/CategoryChart"
import SelectDashBoardChart from "./components/HeaderRevenue/SelectDashBoardChart"
import { useDashBoard } from "@/hooks/useDashBoard"
import TableCategoryChart from "./components/CategoryChart/TableCategoryChart"

type PeriodType = "week" | "month" | "year"

export default function DashBoard() {
    const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("month")
    const {
        weeklyData,
        monthlyData,
        yearlyData,
        topProducts,
        loading,
        loadingTopProducts,
        fetchWeeklyData,
        fetchMonthlyData,
        fetchYearlyData,
        fetchTopProductsWeekly,
        fetchTopProductsMonthly,
        fetchTopProductsYearly,
    } = useDashBoard()

    useEffect(() => {
        const now = new Date()
        const year = now.getFullYear()
        const month = now.getMonth() + 1

        switch (selectedPeriod) {
            case "week":
                fetchWeeklyData(year, month)
                fetchTopProductsWeekly(year, month)
                break
            case "month":
                fetchMonthlyData(year)
                fetchTopProductsMonthly(year, month)
                break
            case "year":
                fetchYearlyData()
                fetchTopProductsYearly(year)
                break
        }
    }, [selectedPeriod, fetchWeeklyData, fetchMonthlyData, fetchYearlyData, fetchTopProductsWeekly, fetchTopProductsMonthly, fetchTopProductsYearly])

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
                topProducts={topProducts}
                loadingTopProducts={loadingTopProducts}
            />


            <div className="grid gap-4 md:grid-cols-2">
                <CategoryChart />
                <TableCategoryChart />
            </div>

            {/* <OrdersChart /> */}
        </div>
    )
}