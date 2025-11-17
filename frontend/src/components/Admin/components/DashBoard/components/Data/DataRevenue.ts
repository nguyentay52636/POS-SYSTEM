import { DollarSign, TrendingUp, ShoppingCart, Users, Package, Store } from "lucide-react"

export const revenueStats = [
    {
        title: "Doanh thu tháng này",
        value: "₫2.8B",
        change: "+15.2%",
        changeType: "increase" as const,
        icon: DollarSign,
        description: "so với tháng trước",
    },
    {
        title: "Tổng đơn hàng",
        value: "12,456",
        change: "+8.7%",
        changeType: "increase" as const,
        icon: ShoppingCart,
        description: "đơn hàng trong tháng",
    },
    {
        title: "Sản phẩm bán chạy",
        value: "8,234",
        change: "+12.3%",
        changeType: "increase" as const,
        icon: Package,
        description: "sản phẩm đã bán",
    },
    {
        title: "Khách hàng mới",
        value: "3,456",
        change: "+5.8%",
        changeType: "increase" as const,
        icon: Users,
        description: "khách hàng trong tháng",
    },
    {
        title: "Chi nhánh hoạt động",
        value: "156",
        change: "+2",
        changeType: "increase" as const,
        icon: Store,
        description: "chi nhánh trên toàn quốc",
    },
  ]

export const chartData = [
    { month: "T1", revenue: 2.1, orders: 8500, customers: 2800 },
    { month: "T2", revenue: 2.3, orders: 9200, customers: 3100 },
    { month: "T3", revenue: 2.6, orders: 10800, customers: 3600 },
    { month: "T4", revenue: 2.4, orders: 9800, customers: 3200 },
    { month: "T5", revenue: 2.8, orders: 11200, customers: 3800 },
    { month: "T6", revenue: 3.1, orders: 12500, customers: 4200 },
]

export const categoryData = [
    { category: "Thực phẩm tươi", revenue: 850, percentage: 35, color: "#3B82F6" },
    { category: "Đồ uống", revenue: 620, percentage: 25, color: "#10B981" },
    { category: "Mỹ phẩm", revenue: 480, percentage: 20, color: "#F59E0B" },
    { category: "Đồ gia dụng", revenue: 320, percentage: 13, color: "#EF4444" },
    { category: "Khác", revenue: 150, percentage: 7, color: "#8B5CF6" },
]

export const topProducts = [
    { name: "Sữa tươi Vinamilk", sales: 1250, revenue: 45.2, growth: "+15%" },
    { name: "Bánh mì Kinh Đô", sales: 980, revenue: 32.8, growth: "+8%" },
    { name: "Nước suối Aquafina", sales: 850, revenue: 18.5, growth: "+12%" },
    { name: "Kem đánh răng P/S", sales: 720, revenue: 25.6, growth: "+5%" },
    { name: "Mì tôm Hảo Hảo", sales: 680, revenue: 22.3, growth: "+18%" },
]