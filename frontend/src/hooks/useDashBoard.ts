import { useState, useCallback } from "react"
import { 
    getChartWeekly, 
    getChartMonthly, 
    getCharYearly, 
    IRevenueChart 
} from "@/apis/dashboardApi"
import { toast } from "sonner"

export const useDashBoard = () => {
    const [weeklyData, setWeeklyData] = useState<IRevenueChart[]>([])
    const [monthlyData, setMonthlyData] = useState<IRevenueChart[]>([])
    const [yearlyData, setYearlyData] = useState<IRevenueChart[]>([])
    const [loading, setLoading] = useState(false)

    const fetchWeeklyData = useCallback(async (year: number, month: number) => {
        try {
            setLoading(true)
            const data = await getChartWeekly(year, month)
            setWeeklyData(data)
            return data
        } catch (error) {
            console.error("Lỗi lấy dữ liệu tuần:", error)
            toast.error("Không thể tải dữ liệu doanh thu theo tuần")
            return []
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchMonthlyData = useCallback(async (year: number) => {
        try {
            setLoading(true)
            const data = await getChartMonthly(year)
            setMonthlyData(data)
            return data
        } catch (error) {
            console.error("Lỗi lấy dữ liệu tháng:", error)
            toast.error("Không thể tải dữ liệu doanh thu theo tháng")
            return []
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchYearlyData = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getCharYearly()
            setYearlyData(data)
            return data
        } catch (error) {
            console.error("Lỗi lấy dữ liệu năm:", error)
            toast.error("Không thể tải dữ liệu doanh thu theo năm")
            return []
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        // Data
        weeklyData,
        monthlyData,
        yearlyData,
        loading,

        // Fetchers
        fetchWeeklyData,
        fetchMonthlyData,
        fetchYearlyData,
    }
}
