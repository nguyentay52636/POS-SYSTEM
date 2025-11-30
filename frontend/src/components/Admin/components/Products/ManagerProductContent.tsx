"use client"

import { useMemo } from "react"
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
import { useProduct } from "@/hooks/useProduct"

export default function ManagerProductContent() {

    const {
        filteredProducts,
        loading,
        totalProducts,
        activeProducts,
        outOfStockProducts,
        inactiveProducts,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        isAddDialogOpen,
        setIsAddDialogOpen,
        editingProduct,
        handleOpenAddDialog,
        handleEditProduct,
        handleDeleteProduct,
        handleFormSubmit
    } = useProduct()

    const categories = ["all", ...mockCategories.map(cat => cat.categoryName)]
    const statuses = ["all", "active", "inactive", "out-of-stock"]

    const { paginationState } = usePagination()

    const paginatedProducts = useMemo(() => {
        const startIndex = (paginationState.currentPage - 1) * paginationState.rowsPerPage
        const endIndex = startIndex + paginationState.rowsPerPage
        return filteredProducts.slice(startIndex, endIndex)
    }, [filteredProducts, paginationState.currentPage, paginationState.rowsPerPage])

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            active: { label: "Đang bán", className: "bg-green-100 text-green-800 border-green-200" },
            inactive: { label: "Tạm ngưng", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
            "out-of-stock": { label: "Hết hàng", className: "bg-red-100 text-red-800 border-red-200" },
        }
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active
        return (
            <Badge className={`${config.className} border`}>
                {config.label}
            </Badge>
        )
    }

    const handleViewDetails = (product: IProduct) => {
        console.log("View details for product:", product.productId)
    }

    const confirmDelete = (productId: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            handleDeleteProduct(productId)
        }
    }

    return (
        <div className="min-h-screen  mx-2 my-4">
            {/* Header */}
            <ManagerProductHeader />

            <div className="p-6 space-y-6 my-4">
                <CardsStatProduct totalProducts={totalProducts} activeProducts={activeProducts} outOfStockProducts={outOfStockProducts} inactiveProducts={inactiveProducts} />

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
                                    handleDeleteProduct={confirmDelete}
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

