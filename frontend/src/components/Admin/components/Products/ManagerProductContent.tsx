"use client"

import { useMemo, useState, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ManagerProductHeader from "./components/ManagerProductHeader"
import CardsStatProduct from "./components/CardsStatProduct"
import { IProduct } from "@/types/types"
import { mockCategories } from "@/components/Admin/components/Products/mock/data"
import ActionHeaderTitle from "./components/Handler/ActionHeaderTitle"
import SearchCategoryProduct from "./components/Handler/SearchCategoryProduct"
import { FormProduct } from "./components/Dialog/FormProduct"
import PaginationManagerProduct from "./components/PaginationManagerProduct"
import ManagerTableProducts from "./components/ManagerTableProducts"
import { usePagination } from "@/context/PaginationContext"
import { useProducts } from "./hook/useProducts"
import { toast } from "react-toastify"



export default function ManagerProductContent() {

    const { products, loading, fetchProducts, addProductWithFormData, editProductWithFormData, removeProduct } = useProducts()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null)

    // Memoize static arrays to prevent recreation on every render
    const categories = useMemo(() => ["all", ...mockCategories.map(cat => cat.category_name)], [])
    const statuses = useMemo(() => ["all", "active", "inactive", "out-of-stock"], [])

    // Memoize stats calculations to prevent recalculation on every render
    const stats = useMemo(() => {
        const total = products.length
        let active = 0
        let outOfStock = 0
        let inactive = 0

        // Single loop instead of multiple filters
        for (const product of products) {
            if (product.status === "active") active++
            else if (product.status === "out-of-stock") outOfStock++
            else if (product.status === "inactive") inactive++
        }

        return { total, active, outOfStock, inactive }
    }, [products])

    const { paginationState } = usePagination()

    const filteredProducts = useMemo(() => {
        if (!products.length) return []

        const lowerSearchTerm = searchTerm.toLowerCase()
        const hasSearchTerm = lowerSearchTerm.length > 0
        const isAllCategory = selectedCategory === "all"
        const isAllStatus = selectedStatus === "all"

        return products.filter((product) => {
            if (!isAllCategory) {
                const categoryName = typeof product.category_id === 'object'
                    ? product.category_id.category_name
                    : ""
                if (categoryName !== selectedCategory) return false
            }

            // Early return for status filter
            if (!isAllStatus && product.status !== selectedStatus) return false

            // Search filter (only if search term exists)
            if (hasSearchTerm) {
                const idMatches = product.product_id
                    ? product.product_id.toString().includes(lowerSearchTerm)
                    : false
                const nameMatches = product.product_name.toLowerCase().includes(lowerSearchTerm)
                if (!idMatches && !nameMatches) return false
            }

            return true
        })
    }, [products, searchTerm, selectedCategory, selectedStatus])

    const paginatedProducts = useMemo(() => {
        const startIndex = (paginationState.currentPage - 1) * paginationState.rowsPerPage
        const endIndex = startIndex + paginationState.rowsPerPage
        return filteredProducts.slice(startIndex, endIndex)
    }, [filteredProducts, paginationState.currentPage, paginationState.rowsPerPage])



    // Memoize formatters to prevent recreation
    const formatPrice = useCallback((price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }, [])

    // Memoize status config to prevent recreation
    const statusConfig = useMemo(() => ({
        active: { label: "Đang bán", className: "bg-green-100 text-green-800 border-green-200" },
        inactive: { label: "Tạm ngưng", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
        "out-of-stock": { label: "Hết hàng", className: "bg-red-100 text-red-800 border-red-200" },
    }), [])

    const getStatusBadge = useCallback((status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
        return (
            <Badge className={`${config.className} border`}>
                {config.label}
            </Badge>
        )
    }, [statusConfig])

    const handleViewDetails = useCallback((product: IProduct) => {
        console.log("View details for product:", product.product_id)
    }, [])

    const handleDeleteProduct = useCallback(async (productId: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                await removeProduct(parseInt(productId));
                toast.success("Xóa sản phẩm thành công")
            } catch (error) {
                console.error("Lỗi xóa sản phẩm:", error);
                toast.error("Không thể xóa sản phẩm")
            }
        }
    }, [removeProduct])

    const handleEditProduct = useCallback((product: IProduct) => {
        setEditingProduct(product)
        setIsAddDialogOpen(true)
    }, [])

    const handleOpenAddDialog = useCallback(() => {
        setEditingProduct(null)
        setIsAddDialogOpen(true)
    }, [])

    const handleFormSubmit = useCallback(async (product: IProduct, imageFile?: File | null, imageUrl?: string) => {
        const isEditing = editingProduct && typeof editingProduct.product_id === "number"
        const productId = editingProduct?.product_id
        try {
            if (isEditing && productId) {
                await editProductWithFormData(productId, product, imageFile, imageUrl);
                toast.success("Cập nhật sản phẩm thành công");
            } else {
                await addProductWithFormData(product, imageFile, imageUrl);
                toast.success("Thêm sản phẩm thành công");
            }
            setIsAddDialogOpen(false)
            setEditingProduct(null)
        } catch (error: any) {
            console.error("Lỗi lưu sản phẩm:", error);
            const errorMessage = error?.message || "Đã xảy ra lỗi";
            if (isEditing) {
                toast.error(`Cập nhật sản phẩm thất bại: ${errorMessage}`);
            } else {
                toast.error(`Thêm sản phẩm thất bại: ${errorMessage}`);
            }
        }
    }, [editingProduct, editProductWithFormData, addProductWithFormData])

    return (
        <div className="min-h-screen  mx-2 my-4">
            {/* Header */}
            <ManagerProductHeader />

            <div className="p-6 space-y-6 my-4">
                <CardsStatProduct
                    totalProducts={stats.total}
                    activeProducts={stats.active}
                    outOfStockProducts={stats.outOfStock}
                    inactiveProducts={stats.inactive}
                />

                <Card className="shadow-sm border-0">
                    <CardHeader className="border-b dark:bg-gray-900/50">
                        <ActionHeaderTitle handleOpenAddDialog={handleOpenAddDialog} />
                    </CardHeader>
                    <CardContent className="p-6">
                        <SearchCategoryProduct searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} statuses={statuses} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-gray-500">Đang tải dữ liệu...</div>
                            </div>
                        ) : (
                            <>
                                <ManagerTableProducts
                                    products={paginatedProducts}
                                    formatPrice={formatPrice}
                                    getStatusBadge={getStatusBadge}
                                    handleViewDetails={handleViewDetails}
                                    handleEditProduct={handleEditProduct}
                                    handleDeleteProduct={handleDeleteProduct}
                                />
                                <PaginationManagerProduct totalItems={filteredProducts.length} />
                            </>
                        )}


                    </CardContent>
                </Card>
            </div>

            <FormProduct
                editingProduct={editingProduct}
                isOpen={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSubmit={handleFormSubmit}
            />
        </div>
    )
}
