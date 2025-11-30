import { useState, useEffect, useMemo, useCallback } from "react"
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/apis/productApi"
import { IProduct } from "@/types/types"
import { toast } from "sonner"

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

    // Derived state
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const idMatches = product.productId
                ? product.productId.toString().includes(searchTerm.toLowerCase())
                : false
            const matchesSearch =
                product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                idMatches

            // Handle potentially missing or malformed category data
            const categoryName = product.category ? product.category.categoryName : ""

            const matchesCategory = selectedCategory === "all" || categoryName === selectedCategory
            const matchesStatus = selectedStatus === "all" || product.status === selectedStatus
            return matchesSearch && matchesCategory && matchesStatus
        })
    }, [products, searchTerm, selectedCategory, selectedStatus])

    const totalProducts = products.length
    const activeProducts = products.filter((p) => p.status === "active").length
    const outOfStockProducts = products.filter((p) => p.status === "out-of-stock").length
    const inactiveProducts = products.filter((p) => p.status === "inactive").length

    // Handlers
    const handleOpenAddDialog = () => {
        setEditingProduct(null)
        setIsAddDialogOpen(true)
    }

    const handleEditProduct = (product: IProduct) => {
        setEditingProduct(product)
        setIsAddDialogOpen(true)
    }

    const handleDeleteProduct = async (productId: string) => {
        // Note: The original code used window.confirm, which is fine, but we might want to use a custom dialog later.
        // For now, we'll keep the logic but maybe move the confirm to the component or keep it here.
        // Keeping it simple and returning the handler.
        try {
            await deleteProduct(parseInt(productId))
            setProducts((prev) => prev.filter((p) => p.productId !== parseInt(productId)))
            toast.success("Đã xóa sản phẩm thành công")
        } catch (error) {
            console.error("Lỗi xóa sản phẩm:", error)
            toast.error("Không thể xóa sản phẩm")
        }
    }

    const handleFormSubmit = async (product: IProduct) => {
        try {
            if (editingProduct && editingProduct.productId) {
                // Update existing product
                const updated = await updateProduct(editingProduct.productId, product)
                setProducts((prev) =>
                    prev.map((p) => (p.productId === editingProduct.productId ? updated : p))
                )
                toast.success("Cập nhật sản phẩm thành công")
            } else {
                // Add new product
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
    }

    return {
        // Data
        products,
        filteredProducts,
        loading,

        // Stats
        totalProducts,
        activeProducts,
        outOfStockProducts,
        inactiveProducts,

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
        handleFormSubmit
    }
}