import { BarChart3, FileDiff, PackagePlus, Warehouse } from "lucide-react"
import { Building2 } from "lucide-react"
import { DollarSign } from "lucide-react"
import { Star } from "lucide-react"
import { ShoppingCart } from "lucide-react"
import { Gift } from "lucide-react"
import { Lock } from "lucide-react"
import { Users } from "lucide-react"
import { Settings } from "lucide-react"
export const navigation = (pathname: string) => [
    {
        name: "Tổng quan",
        href: "/admin/dashboard",
        icon: BarChart3,
        current: pathname === "/admin/dashboard",
        badge: null,
    },
    {
        name: "Bán hàng",
        href: "/admin/sells",
        icon: ShoppingCart,
        current: pathname === "/admin/sells",
        badge: null,
    },
    // {
    //     name: "Quản lý nhập hàng",
    //     href: "/admin/importgoods",
    //     icon: PackagePlus,
    //     current: pathname === "/admin/importgoods",
    //     badge: null,
    // },
    {
        name: "Quản lý sản phẩm",
        href: "/admin/products",
        icon: Building2,
        current: pathname === "/admin/products",
        badge: null,
    },
    {
        name: "Quản lý thanh toán",
        href: "/admin/payments",
        icon: DollarSign,
        current: pathname === "/admin/payments",
        badge: null,
    },


    {
        name: "Hoá đơn bán hàng",
        href: "/admin/orders",
        icon: FileDiff,
        current: pathname === "/admin/orders",
        badge: null,
    },
    // {
    //     name: "Hoá đơn bán hàng",
    //     href: "/admin/invoices",
    //     icon: FileDiff,
    //     current: pathname === "/admin/invoices",
    //     badge: null,
    // },
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
        name: "Quản lý kho hàng",
        href: "/admin/inventorys",
        icon: Warehouse,
        current: pathname === "/admin/inventorys",
        badge: null,
    },
    {
        name: "Quản lý phiếu nhập",
        href: "/admin/receipts",
        icon: ShoppingCart,
        current: pathname === "/admin/receipts",
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
        name: "Nhân viên",
        href: "/admin/employees",
        icon: Users,
        current: pathname === "/admin/employees",
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
        name: "Quản lý quyền",
        href: "/admin/permissions",
        icon: Lock,
        current: pathname === "/admin/permissions",
        badge: null,
    },
    // {
    //     name: "Cài đặt",
    //     href: "/admin/settings",
    //     icon: Settings,
    //     current: pathname === "/admin/settings",
    //     badge: null,
    // },
]