import { useEffect, useState } from "react"
import { getAllProductBySupplierId } from "@/apis/importReceiptApi"
import type { IProduct } from "@/types/types"

export const useProductBySupplier = (supplierId: number | null) => {
    const [products, setProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProducts = async () => {
        if (!supplierId) {
            setProducts([])
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)
            const data = await getAllProductBySupplierId(supplierId)
            setProducts(data)
        } catch (error) {
            setError("Không thể tải danh sách sản phẩm")
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [supplierId])

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
    }
}
