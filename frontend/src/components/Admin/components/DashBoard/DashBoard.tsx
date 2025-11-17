

import HeaderRevenue from "./components/HeaderRevenue"
import StatsCardRevenue from "./components/StatsCardRevenue"
import OrdersChart from "./components/OrdersChart"
import CategoryChart from "./components/CategoryChart"

export default function DashBoard() {
    return (
        <div className="flex-1 space-y-6 p-6">
            <HeaderRevenue />
            <StatsCardRevenue />
            <OrdersChart />

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

            <OrdersChart />
        </div>
    )
}