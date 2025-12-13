import { useState, useCallback } from "react"
import { 
    getChartWeekly, 
    getChartMonthly, 
    getCharYearly, 
    getTopProductsWeekly,
    getTopProductsMonthly,
    getTopProductsYearly,
    getTopProductsQuarterly,
    getCategoryChart,
    IRevenueChart,
    ITopProduct,
    ICategoryChart
} from "@/apis/dashboardApi"
import { toast } from "sonner"

export const useDashBoard = () => {
    const [weeklyData, setWeeklyData] = useState<IRevenueChart[]>([])
    const [monthlyData, setMonthlyData] = useState<IRevenueChart[]>([])
    const [yearlyData, setYearlyData] = useState<IRevenueChart[]>([])
    const [topProducts, setTopProducts] = useState<ITopProduct[]>([])
    const [categoryData, setCategoryData] = useState<ICategoryChart[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingTopProducts, setLoadingTopProducts] = useState(false)
    const [loadingCategory, setLoadingCategory] = useState(false)

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

    const fetchTopProductsWeekly = useCallback(async (year?: number, month?: number, topCount: number = 10) => {
        try {
            setLoadingTopProducts(true)
            const data = await getTopProductsWeekly(year, month, topCount)
            setTopProducts(data)
            return data
        } catch (error) {
            console.error("Lỗi lấy top sản phẩm tuần:", error)
            toast.error("Không thể tải top sản phẩm tuần này")
            return []
        } finally {
            setLoadingTopProducts(false)
        }
    }, [])

    const fetchTopProductsMonthly = useCallback(async (year?: number, month?: number, topCount: number = 10) => {
        try {
            setLoadingTopProducts(true)
            const data = await getTopProductsMonthly(year, month, topCount)
            setTopProducts(data)
            return data
        } catch (error) {
            console.error("Lỗi lấy top sản phẩm tháng:", error)
            toast.error("Không thể tải top sản phẩm tháng này")
            return []
        } finally {
            setLoadingTopProducts(false)
        }
    }, [])

    const fetchTopProductsYearly = useCallback(async (year?: number, topCount: number = 10) => {
        try {
            setLoadingTopProducts(true)
            const data = await getTopProductsYearly(year, topCount)
            setTopProducts(data)
            return data
        } catch (error) {
            console.error("Lỗi lấy top sản phẩm năm:", error)
            toast.error("Không thể tải top sản phẩm năm này")
            return []
        } finally {
            setLoadingTopProducts(false)
        }
    }, [])

    const fetchTopProductsQuarterly = useCallback(async (year?: number, quarter?: number, topCount: number = 10) => {
        try {
            setLoadingTopProducts(true)
            const data = await getTopProductsQuarterly(year, quarter, topCount)
            setTopProducts(data)
            return data
        } catch (error) {
            console.error("Lỗi lấy top sản phẩm quý:", error)
            toast.error("Không thể tải top sản phẩm quý này")
            return []
        } finally {
            setLoadingTopProducts(false)
        }
    }, [])

    const fetchCategoryData = useCallback(async () => {
        try {
            setLoadingCategory(true)
            const data = await getCategoryChart()
            setCategoryData(data)
            return data
        } catch (error) {
            console.error("Lỗi lấy dữ liệu danh mục:", error)
            toast.error("Không thể tải dữ liệu danh mục")
            return []
        } finally {
            setLoadingCategory(false)
        }
    }, [])

    return {
        // Data
        weeklyData,
        monthlyData,
        yearlyData,
        topProducts,
        categoryData,
        loading,
        loadingTopProducts,
        loadingCategory,

        // Revenue Fetchers
        fetchWeeklyData,
        fetchMonthlyData,
        fetchYearlyData,

        // Top Products Fetchers
        fetchTopProductsWeekly,
        fetchTopProductsMonthly,
        fetchTopProductsYearly,
        fetchTopProductsQuarterly,

        // Category Fetcher
        fetchCategoryData,
    }
}
