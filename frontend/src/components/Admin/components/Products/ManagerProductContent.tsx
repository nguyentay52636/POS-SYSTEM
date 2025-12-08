"use client"

import { useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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

const STATUSES: string[] = ["all", "active", "inactive", "out-of-stock"]

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
        handleFormSubmit,
        handleToggleStatus: handleToggleStatusProduct,
    } = useProduct()

    const categories = useMemo(
        () => ["all", ...mockCategories.map((cat) => cat.categoryName).filter((name): name is string => Boolean(name))],
        []
    )

    const { paginationState } = usePagination()

    const paginatedProducts = useMemo(() => {
        const startIndex = (paginationState.currentPage - 1) * paginationState.rowsPerPage
        const endIndex = startIndex + paginationState.rowsPerPage
        return filteredProducts.slice(startIndex, endIndex)
    }, [filteredProducts, paginationState.currentPage, paginationState.rowsPerPage])

    const handleViewDetails = useCallback((product: IProduct) => {
        console.log("View details for product:", product.productId)
    }, [])

    const confirmDelete = useCallback(
        (productId: string) => {
            if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
                handleDeleteProduct(productId)
            }
        },
        [handleDeleteProduct]
    )

    return (
        <div className="min-h-screen mx-2 my-4">
            <ManagerProductHeader />

            <div className="p-6 space-y-6 my-4">
                <CardsStatProduct
                    totalProducts={totalProducts}
                    activeProducts={activeProducts}
                    outOfStockProducts={outOfStockProducts}
                    inactiveProducts={inactiveProducts}
                />

                <Card className="shadow-sm border-0">
                    <CardHeader className="border-b dark:bg-gray-900/50">
                        <ActionHeaderTitle handleOpenAddDialog={handleOpenAddDialog} />
                    </CardHeader>
                    <CardContent className="p-6">
                        <SearchCategoryProduct
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            categories={categories}
                            statuses={STATUSES}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                        />

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-gray-500">Đang tải dữ liệu...</div>
                            </div>
                        ) : (
                            <>
                                <ManagerTableProducts
                                    products={paginatedProducts}
                                    onView={handleViewDetails}
                                    onEdit={handleEditProduct}
                                    onToggleStatus={handleToggleStatusProduct}
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

