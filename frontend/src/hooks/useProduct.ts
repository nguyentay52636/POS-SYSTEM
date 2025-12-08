import { useState, useEffect, useMemo, useCallback } from "react"
import { getProducts, createProduct, updateProduct, deleteProduct, updateProductStatus } from "@/apis/productApi"
import { IProduct } from "@/types/types"
import { toast } from "sonner"
import { calculateProductStats } from "@/utils/productUtils"

export const useProduct = () => {
    const [products, setProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState(true)

    // Filter states
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState("all")

    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null)

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getProducts()
            setProducts(data)
        } catch (error) {
            console.error("Lỗi lấy sản phẩm:", error)
            toast.error("Không thể tải danh sách sản phẩm")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const idMatches = product.productId
                ? product.productId.toString().includes(searchTerm.toLowerCase())
                : false
            const matchesSearch =
                product.productName.toLowerCase().includes(searchTerm.toLowerCase()) || idMatches

            const categoryName = product.category?.categoryName || ""
            const matchesCategory = selectedCategory === "all" || categoryName === selectedCategory
            const matchesStatus = selectedStatus === "all" || product.status === selectedStatus

            return matchesSearch && matchesCategory && matchesStatus
        })
    }, [products, searchTerm, selectedCategory, selectedStatus])

    // Calculate stats
    const stats = useMemo(() => calculateProductStats(products), [products])

    // Handlers
    const handleOpenAddDialog = useCallback(() => {
        setEditingProduct(null)
        setIsAddDialogOpen(true)
    }, [])

    const handleEditProduct = useCallback((product: IProduct) => {
        setEditingProduct(product)
        setIsAddDialogOpen(true)
    }, [])

    const handleDeleteProduct = useCallback(
        async (productId: string) => {
            try {
                await deleteProduct(parseInt(productId))
                setProducts((prev) => prev.filter((p) => p.productId !== parseInt(productId)))
                toast.success("Đã xóa sản phẩm thành công")
            } catch (error) {
                console.error("Lỗi xóa sản phẩm:", error)
                toast.error("Không thể xóa sản phẩm")
            }
        },
        []
    )

    const handleToggleStatus = useCallback(
        async (productId: string) => {
            try {
                const idNum = parseInt(productId)
                await updateProductStatus(idNum)
                setProducts((prev) =>
                    prev.map((p) => {
                        if (p.productId === idNum) {
                            const nextStatus = (p.status === "inactive" || p.status === "locked") ? "active" : "inactive"
                            return { ...p, status: nextStatus }
                        }
                        return p
                    })
                )
                toast.success("Đã cập nhật trạng thái sản phẩm")
            } catch (error) {
                console.error("Lỗi cập nhật trạng thái sản phẩm:", error)
                toast.error("Không thể cập nhật trạng thái sản phẩm")
            }
        },
        []
    )

    const handleFormSubmit = useCallback(
        async (product: IProduct) => {
            try {
                if (editingProduct?.productId) {
                    const updated = await updateProduct(editingProduct.productId, product)
                    setProducts((prev) =>
                        prev.map((p) => (p.productId === editingProduct.productId ? updated : p))
                    )
                    toast.success("Cập nhật sản phẩm thành công")
                } else {
                    const newProduct = await createProduct(product)
                    setProducts((prev) => [...prev, newProduct])
                    toast.success("Thêm sản phẩm mới thành công")
                }
                setIsAddDialogOpen(false)
                setEditingProduct(null)
            } catch (error) {
                console.error("Lỗi lưu sản phẩm:", error)
                toast.error("Không thể lưu sản phẩm")
            }
        },
        [editingProduct]
    )

    return {
        // Data
        products,
        filteredProducts,
        loading,

        // Stats
        totalProducts: stats.total,
        activeProducts: stats.active,
        outOfStockProducts: stats.outOfStock,
        inactiveProducts: stats.inactive,

        // Filter State
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,

        // Dialog State
        isAddDialogOpen,
        setIsAddDialogOpen,
        editingProduct,
        setEditingProduct,

        // Handlers
        fetchProducts,
        handleOpenAddDialog,
        handleEditProduct,
        handleDeleteProduct,
        handleToggleStatus,
        handleFormSubmit,
    }
}