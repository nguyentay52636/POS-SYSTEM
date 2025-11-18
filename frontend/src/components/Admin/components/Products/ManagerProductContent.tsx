"use client"

import { useMemo, useState } from "react"
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




export default function ManagerProductContent() {

    const { products, loading, fetchProducts, addProduct, editProduct, removeProduct } = useProducts()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null)

    const categories = ["all", ...mockCategories.map(cat => cat.category_name)]
    const statuses = ["all", "active", "inactive", "out-of-stock"]

    const totalProducts = products.length
    const activeProducts = products.filter((p) => p.status === "active").length
    const outOfStockProducts = products.filter((p) => p.status === "out-of-stock").length
    const inactiveProducts = products.filter((p) => p.status === "inactive").length

    const { paginationState } = usePagination()

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.product_id.toString().includes(searchTerm.toLowerCase())
            const categoryName = typeof product.category_id === 'object' ? product.category_id.category_name : ""
            const matchesCategory = selectedCategory === "all" || categoryName === selectedCategory
            const matchesStatus = selectedStatus === "all" || product.status === selectedStatus
            return matchesSearch && matchesCategory && matchesStatus
        })
    }, [products, searchTerm, selectedCategory, selectedStatus])

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
        console.log("View details for product:", product.product_id)
    }

    const handleViewEdit = (product: IProduct) => {
        console.log("View edit for product:", product.product_id)
    }

    const handleDeleteProduct = async (productId: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                await removeProduct(parseInt(productId));
            } catch (error) {
                console.error("Lỗi xóa sản phẩm:", error);
            }
        }
    }

    const handleEditProduct = (product: IProduct) => {
        setEditingProduct(product)
        setIsAddDialogOpen(true)
    }

    const handleOpenAddDialog = () => {
        setEditingProduct(null)
        setIsAddDialogOpen(true)
    }

    const handleFormSubmit = async (product: IProduct) => {
        try {
            if (editingProduct) {
                // Update existing product
                await editProduct(editingProduct.product_id, product);
            } else {
                // Add new product
                await addProduct(product);
            }
            setIsAddDialogOpen(false)
            setEditingProduct(null)
        } catch (error) {
            console.error("Lỗi lưu sản phẩm:", error);
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
                                    handleViewEdit={handleViewEdit}
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
