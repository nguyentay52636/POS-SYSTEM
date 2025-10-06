import { BarChart3 } from "lucide-react"
import { Building2 } from "lucide-react"
import { DollarSign } from "lucide-react"
import { Star } from "lucide-react"
import { ShoppingCart } from "lucide-react"
import { Gift } from "lucide-react"
import { Users } from "lucide-react"
import { Settings } from "lucide-react"
 export const navigation = (pathname: string) => [
    {
        name: "Tổng quan",
        href: "/admin",
        icon: BarChart3,
        current: pathname === "/admin/sells",
        badge: null,
    },
    {
        name: "Bán hàng",
        href: "/admin/sells",
        icon: ShoppingCart,
        current: pathname === "/admin/sells",
        badge: null,
    },
    {
        name: "Quản lý sản phẩm",
        href: "/admin/products",
        icon: Building2,
        current: pathname === "/admin/products",
        badge: null,
    },
    {
        name: "Thống kê Doanh thu",
        href: "/admin/revenue",
        icon: DollarSign,
        current: pathname === "/admin/revenue",
        badge: null,
    },


    {
        name: "Quản lý đơn hàng",
        href: "/admin/orders",
        icon: ShoppingCart,
        current: pathname === "/admin/orders",
        badge: null,
    },
    {
        name: "Quản lý nhà cung cấp",
        href: "/admin/suppliers",
        icon: Building2,
        current: pathname === "/admin/suppliers",
        badge: null,
    },
    {
        name: "Quản lý khuyến mãi",
        href: "/admin/promotions",
        icon: Gift,
        current: pathname === "/admin/promotions",
        badge: null,
    },
    {
        name: "Khách hàng",
        href: "/admin/customers",
        icon: Users,
        current: pathname === "/admin/customers",
        badge: null,
    },

    {
        name: "Tài khoản",
        href: "/admin/users",
        icon: Users,
        current: pathname === "/admin/users",
        badge: null,
    },
    {
        name: "Cài đặt",
        href: "/admin/settings",
        icon: Settings,
        current: pathname === "/admin/settings",
        badge: null,
    },
]