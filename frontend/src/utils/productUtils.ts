import { IProduct } from "@/types/types"

/**
 * Format price to Vietnamese currency
 */
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price)
}

/**
 * Status badge configuration
 */
export const STATUS_CONFIG = {
    active: { label: "Đang bán", className: "bg-green-100 text-green-800 border-green-200" },
    inactive: { label: "Tạm ngưng", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    "out-of-stock": { label: "Hết hàng", className: "bg-red-100 text-red-800 border-red-200" },
} as const

/**
 * Get status badge configuration
 */
export const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active
}

/**
 * Get product category name safely
 */
export const getCategoryName = (product: IProduct): string => {
    return product.category?.categoryName || "-"
}

/**
 * Get supplier name safely
 */
export const getSupplierName = (product: IProduct): string => {
    return product.supplier?.name || "-"
}

/**
 * Calculate product statistics
 */
export const calculateProductStats = (products: IProduct[]) => {
    return {
        total: products.length,
        active: products.filter((p) => p.status === "active").length,
        outOfStock: products.filter((p) => p.status === "out-of-stock").length,
        inactive: products.filter((p) => p.status === "inactive").length,
    }
}

